import { GraphQLClient } from "graphql-request";

const isClient = typeof window !== "undefined";

export const graphQLClient = new GraphQLClient(
  "http://localhost:8000/graphql",
  {
    headers: () => {
      if (!isClient) {
        return {};
      }

      const token = window.localStorage.getItem("_eno_ondh_esru");
      
      if (!token) {
        console.log("No token found in localStorage");
        return {};
      }

      // Validate token structure before sending
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        console.error("Invalid JWT token structure in localStorage");
        // Clear the corrupted token
        window.localStorage.removeItem("_eno_ondh_esru");
        return {};
      }

      console.log("Sending token with request, preview:", token.substring(0, 50) + "...");
      
      return {
        Authorization: `Bearer ${token}`,
      };
    },
  }
);