import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type Query {
    users: [User!]!
    postsOverview: [Post!]!
    postsByCategory (category: String!): [Post!]!
  }

  type User {
    uid: ID!
    username: String!
    email: String!
    password: String!
    picture: String!
    created: String!
    token: String
  }

  type Post {
    pid:  ID!
    createdby:  [User!]!
    title:  String!
    category: String!
    location:  String!
    price:  Int!
    condition:  String!
    imageurl:  String!
    description:  String!
    likedby: [Int!]!
    comments: [String!]!
    created: String!
  }

  type Mutation {
    createUser(
      username: String!,
      email: String!,
      password: String!,
      picture: String!
    ): User!,
    login(
      email: String!,
      password: String!,
    ): User!,
    createPost(
      createdby: Int!
      title:  String!
      category: String!
      location:  String!
      price:  Int!
      condition:  String!
      imageurl:  String!
      description:  String!
    ): Post!
  }
`;
