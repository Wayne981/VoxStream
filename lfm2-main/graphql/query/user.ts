import { graphql } from "../../gql";

export const verifyUserGoogleTokenQuery = graphql(`
  query VerifyUserGoogleToken($token: String!) {
    verifyGoogleToken(token: $token)
  }
`);

export const getCurrentUserQuery = graphql(`
  query GetCurrentUser {
  getCurrentUser {
  id 
  profileImageURL
  email 
  firstName 
  lastName 
  recommendedUsers {
      id
      firstName
      lastName
      profileImageURL
    }
  followers {
  id
  firstName
  lastName
  profileImageURL
  }
  following { 
  id
  firstName
  lastName
  profileImageURL
  }
  tweets { 
  id 
  content 
  author {
  id
  firstName 
  lastName 
  profileImageURL
  }
  }
  }
  }
  
  
  
  `);


export const getUserByIdQuery = graphql(`#graphql
query GetUserById($userId: ID!) {
  getUserById(id: $userId) {
    id
    firstName
    lastName
    profileImageURL 
    followers {
      id
      firstName
      lastName
      profileImageURL
    }
    following {
      id
      firstName
      lastName
      profileImageURL
    }
    tweets {
    content
    author {
      id
      firstName
      lastName
      profileImageURL
    }
    }
  
  }
}
`);