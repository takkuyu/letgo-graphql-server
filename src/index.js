import { ApolloServer } from "apollo-server";
import { resolvers } from "./resolvers";
import { typeDefs } from "./schema";
import dotenv from 'dotenv';
import contextMiddleware from './util/contextMiddleware';

dotenv.config();

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: contextMiddleware,
  subscriptions: { path: '/' },
});

apolloServer.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`🚀  Server ready at ${url}`);
  console.log(`🚀  Susbscription ready at ${subscriptionsUrl}`)
});