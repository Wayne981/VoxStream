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

if (!region || !accessKeyId || !secretAccessKey) {
  throw new Error("AWS credentials are not properly set in environment variables");
}

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId,
    secretAccessKey
  }
});

const queries = {
  getAllTweets: async () => {
    const tweets = await prismaClient.tweet.findMany({
      orderBy: { createdAt: "desc" },
    });
    
    // Format dates before returning
    return tweets.map(tweet => ({
      ...tweet,
      createdAt: tweet.createdAt.toISOString(),
      updatedAt: tweet.updatedAt.toISOString()
    }));
  },
  getSignedUrlForTweet: async (
    parent: any,
    { imageName, imageType }: { imageName: string; imageType: string },
    context: GraphqlContext
  ) => {
    if (!context.user) throw new Error("You are not authenticated");

    const allowedImageTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedImageTypes.includes(imageType))
      throw new Error("Unsupported image type");

    const putObjectCommand = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: `tweets/${context.user.id}/${imageName}`,
      ContentType: imageType,
    });

    const signedUrl = await getSignedUrl(s3Client, putObjectCommand);
    return signedUrl;
  },
};

const mutations = {
  createTweet: async (
    parent: any,
    { payload }: { payload: CreateTweetPayload },
    context: GraphqlContext
  ) => {
    if (!context.user) throw new Error("You are not authenticated");
    const tweet = await prismaClient.tweet.create({
      data: {
        content: payload.content,
        imageURL: payload.imageURL,
        author: { connect: { id: context.user.id } },
      },
    });

    // Format dates before returning
    return {
      ...tweet,
      createdAt: tweet.createdAt.toISOString(),
      updatedAt: tweet.updatedAt.toISOString()
    };
  },
  deleteTweet: async (
    parent: any,
    { id }: { id: string },
    context: GraphqlContext
  ) => {
    if (!context.user) throw new Error("You are not authenticated");

    const tweet = await prismaClient.tweet.findUnique({
      where: { id },
      select: { authorId: true }
    });

    if (!tweet) throw new Error("Tweet not found");
    if (tweet.authorId !== context.user.id) throw new Error("Not authorized to delete this tweet");

    await prismaClient.tweet.delete({
      where: { id }
    });

    return true;
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