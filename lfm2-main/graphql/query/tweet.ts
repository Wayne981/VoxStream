import { graphql } from "@/gql";

export const getAllTweetsQuery = graphql(`
    query GetAllTweets {
      getAllTweets {
        id
        content
        imageURL
        createdAt
        updatedAt
        author {
          id
          firstName
          lastName
          profileImageURL
        }
      }
    }
  `);

  export const getSignedURLForTweetQuery = graphql(`
    query GetSignedURL($imageName: String!, $imageType: String!) {
  getSignedUrlForTweet(imageName: $imageName, imageType: $imageType)
}
    `)

