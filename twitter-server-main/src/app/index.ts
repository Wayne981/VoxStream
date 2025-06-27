import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'; 
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { prismaClient } from '../clients/db';

import { User } from "./user";
import { Tweet } from "./tweet";
import { GraphqlContext } from '../interfaces';
import JWTService from '../services/jwt';

export async function initServer() {
    const app = express(); 

    app.use(bodyParser.json());
    app.use(cors());

    // Basic health check route
    app.get("/", (req, res) => res.status(200).json({ message: "Everything is good" }));

    // ✅ Temporary route to generate token from user ID
    app.get("/dev/generate-token/:userId", async (req, res) => {
        const { userId } = req.params;
        try {
            const token = await JWTService.generateTokenForUser(userId);
            res.status(200).json({ token });
        } catch (err) {
            const message = err instanceof Error ? err.message : "Unknown error";
            res.status(400).json({ error: message });
        }
    });

    // Apollo Server setup
    const graphqlserver = new ApolloServer<GraphqlContext>({
        typeDefs: `
            ${User.types} 
            ${Tweet.types}

            type Query {
                ${User.queries}  
                ${Tweet.queries}
            }

            type Mutation { 
                ${Tweet.mutations}
                ${User.mutations}
            }
        `, 
        resolvers: {
            Query: {
                ...User.resolvers.queries, 
                ...Tweet.resolvers.queries,
            }, 
            Mutation: {
                ...Tweet.resolvers.mutations,
                ...User.resolvers.mutations,
            },
            ...Tweet.resolvers.extraResolvers,
            ...User.resolvers.extraResolvers,
        }, 
    });

    await graphqlserver.start();

    // GraphQL middleware with auth context
    app.use('/graphql', expressMiddleware(graphqlserver, {
        context: async ({ req }) => {
            const authHeader = req.headers.authorization || '';
            const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
            const user = JWTService.decodeToken(token);

            // Debug log
            console.log("Decoded user in context:", user);

            return { user };
        }
    }));

    return app;
}
