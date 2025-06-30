import { Tweet } from "@prisma/client";
import { prismaClient } from "../../clients/db";
import { GraphqlContext } from "../../interfaces";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

require('dotenv').config();

interface CreateTweetPayload {
    content: string;
    imageURL?: string;
}

const region = process.env.AWS_REGION;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.S3_BUCKET_NAME;

if (!region || !accessKeyId || !secretAccessKey || !bucketName) {
  throw new Error("AWS credentials and bucket name must be set in environment variables");
}

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
});

const queries = {
  getAllTweets: () =>  
    prismaClient.tweet.findMany({ orderBy: { createdAt: "desc" } }),
  
  getSignedUrlForTweet: async (
    parent: any, 
    { imageType, imageName }: { imageType: string, imageName: string }, 
    ctx: GraphqlContext
  ) => {
    if(!ctx.user || !ctx.user.id) throw new Error("You are not authenticated");
    
    const allowedImageTypes = ["image/jpg", "image/jpeg", "image/png", "image/webp"]; 
    if(!allowedImageTypes.includes(imageType)) throw new Error("Invalid image type"); 

    // Clean the filename and create a unique key
    const cleanFileName = imageName.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `uploads/${ctx.user.id}/tweets/${cleanFileName}_${Date.now()}`;

    const putObjectCommand = new PutObjectCommand({ 
      Bucket: bucketName,
      Key: key,
      ContentType: imageType,
      // Remove ACL as it might cause issues with some S3 configurations
      // ACL: 'public-read'  
    });

    try {
      const signedURL = await getSignedUrl(s3Client, putObjectCommand, { expiresIn: 3600 });
      
      // Construct the public URL
      const publicURL = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
      
      // Return as JSON string as expected by frontend
      return JSON.stringify({
        signedURL,
        publicURL
      });
    } catch (error) {
      console.error('Error generating signed URL:', error);
      throw new Error('Failed to generate signed URL');
    }
  }
};

const mutations = {
  createTweet: async (
    parent: any,
    { payload }: { payload: CreateTweetPayload },
    context: GraphqlContext
  ) => {
    if (!context.user) throw new Error("You are not authenticated");
    
    console.log('Creating tweet with payload:', payload);
    
    const tweet = await prismaClient.tweet.create({
      data: {
        content: payload.content,
        imageURL: payload.imageURL || null,
        author: { connect: { id: context.user.id } },
      },
    });

    return tweet;
  },
  
  deleteTweet: async (
    parent: any,
    { tweetId }: { tweetId: string },
    context: GraphqlContext
  ) => {
    if (!context.user) throw new Error("Unauthorized");

    const tweet = await prismaClient.tweet.findUnique({ where: { id: tweetId } });
    if (!tweet || tweet.authorId !== context.user.id) throw new Error("Not allowed");

    await prismaClient.tweet.delete({ where: { id: tweetId } });
    return { id: tweetId };
  }
};

const extraResolvers = {
  Tweet: {
    author: async (parent: Tweet) => {
      console.log("Fetching author for tweet:", parent.id);
      const author = await prismaClient.user.findUnique({ where: { id: parent.authorId } });
      console.log("Fetched author:", author);
      return author;
    },
  },
};

export const resolvers = { queries, mutations, extraResolvers };