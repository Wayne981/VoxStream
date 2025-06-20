import express from 'express';
import bodyParser from 'body-parser'
import cors from 'cors'; 
import { ApolloServer } from '@apollo/server';
import { expressMiddleware} from '@apollo/server/express4'
import { prismaClient } from '../clients/db';

import {User} from "./user";
import {Tweet } from "./tweet"
import { GraphqlContext } from '../interfaces';
import JWTService from '../services/jwt';
import { mutations } from './user/mutations';

// type GraphqlContext = {
//   user?: {
//     id: string;
//     email: string;
//   };
// };

export async function initServer()  {
    const app = express(); 

    app.use(bodyParser.json());
    app.use(cors());

    app.get("/", (req, res) => res.status(200).json({ message: "Everything is good" }));

    const graphqlserver = new ApolloServer<GraphqlContext>({
        typeDefs: `
         ${User.types} 
         ${Tweet.types}

        type Query{
        ${User.queries}  
        ${Tweet.queries}
        }


        type Mutation { 
         ${Tweet.mutations}
         ${User.mutations}

         
        }
        `, 
        resolvers:{
            Query: {
             ...User.resolvers.queries, 
             ...Tweet.resolvers.queries,
            }, 
            Mutation: {
              ...Tweet.resolvers.mutations ,
              ...User.resolvers.mutations ,
             
            },
            ...Tweet.resolvers.extraResolvers , 
            ...User.resolvers.extraResolvers , 
            
        }, 
    });

    await graphqlserver.start();

    app.use('/graphql', expressMiddleware(graphqlserver, {
      context: async ({ req, res }) => {
        return {
          user: req.headers.authorization 
            ? await JWTService.decodeToken(req.headers.authorization)
            : undefined , 
        };
      }
    }));

    return app;
}