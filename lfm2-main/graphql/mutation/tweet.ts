import {graphql } from "@/gql"

export const createTweetMutation = graphql(`#graphql 
    mutation CreateTweet($payload:CreateTweetData!) {
    createTweet(payload:$payload) {
    id 
    content
    imageURL
    author{
    id
    firstName
    lastName
    }
    }
    }
`);

export const deleteTweetMutation = graphql(`#graphql
    mutation DeleteTweet($id: ID!) {
        deleteTweet(id: $id)
    }
`); 