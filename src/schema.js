import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    users: [User!]!
    postsOverview: [Post!]!
    postsByCategory (category: String!): [Post!]!
    messages: [Message!]
    getRooms (uid: Int!): [Room!]!
    getMessages (rid: String!): [Message!]!
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
    createdby: User!
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

  type Room {
    rid: ID!
    from: User!
    to: User!
    post: Post!
    latestMessage: String
  }

  type Message {
    mid: ID!
    room: String!
    from:Int!
    to:Int!
    content: String!
    created: String!
  }

  type Subscription {
    newMessage: Message!
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
    ): Post!,
    createRoom(to: String!, post: String! ): Room!
    postMessage(room: String!, to: String!, content: String!): Message!
  }
`;
