import { categories } from "./constants/constants";
import db from "./db";
import jwt from 'jsonwebtoken';
import {
  AuthenticationError,
  withFilter,
} from 'apollo-server';

const NEW_MESSAGE = "NEW_MESSAGE"

export const resolvers = {
  Query: {
    users: async () => {
      const users = await db.select("*").from("users")
      return users;
    },
    postsOverview: async () => {
      let posts = [];
      for (const category in categories) {
        const postByCategory = await db("posts").where("category", categories[category]).orderBy("created", 'desc').limit(5);
        posts = [
          ...posts,
          ...postByCategory
        ]
      }
      return posts;
    },
    postsByCategory: async (_, { category }) => {
      const postByCategory = await db("posts").where("category", category).orderBy("created", 'desc');
      return postByCategory;
    },
    getRooms: async (_, { uid }) => {
      // @TODO: Add created to sort by date for recent.
      const roomsByUser = await db("rooms").where("from", uid).orWhere("to", uid);
      return roomsByUser;
    },
    getMessages: async (_, { rid }) => {
      try {
        const messages = await db("messages").where("room", rid).orderBy("created", 'asc');
        return messages;
      } catch (err) {
        console.log(err)
        throw err
      }
    },
    messages: () => messages,
  },
  Mutation: {
    createUser: async (_, { username, email, password, picture }) => {
      const [user] = await db("users")
        .returning("*")
        .insert({
          username,
          email,
          password,
          picture,
          created: new Date()
        });
      return user;
    },
    login: async (_, { email, password }) => {
      const [user] = await db("users").where({ email: email, password: password });
      if (user) {
        const token = jwt.sign({ uid: user.uid }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3d' });
        user.token = token;
        return user;
      }
    },
    createPost: async (_, args) => {
      const [post] = await db("posts")
        .returning("*")
        .insert({
          ...args,
          likedby: [],
          comments: [],
          created: new Date()
        });
      return post;
    },
    createRoom: async (_, { to, post }, { user }) => {
      try {
        if (!user) throw new AuthenticationError('Unauthenticated')
        const [room] = await db("rooms")
          .returning("*")
          .insert({
            from: user.uid,
            to,
            post,
          });
        return room
      } catch (err) {
        console.log(err)
        throw err
      }
    },
    postMessage: async (_, { room, to, content }, { user, pubsub }) => {
      try {
        if (!user) throw new AuthenticationError('Unauthenticated')

        const [message] = await db("messages")
          .returning("*")
          .insert({
            room,
            from: user.uid,
            to,
            content,
            created: new Date()
          });

        pubsub.publish(NEW_MESSAGE, {
          newMessage: message
        })

        return message;
      } catch (err) {
        console.log(err)
        throw err
      }
    },
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        (_, __, { pubsub, user }) => {
          if (!user) throw new AuthenticationError('Unauthenticated')
          return pubsub.asyncIterator(NEW_MESSAGE)
        },
        ({ newMessage }, _, { user }) => {
          if (
            newMessage.from === user.uid ||
            newMessage.to === user.uid
          ) {
            return true
          }

          return false
        }
      ),
    },
  },
  Post: {
    createdby: async root => {
      const [createdby] = await db("users").where("uid", root.createdby);
      return createdby;
    },
  },
  Room: {
    from: async root => {
      const [from] = await db("users").where("uid", root.from);
      return from;
    },
    to: async root => {
      const [to] = await db("users").where("uid", root.to);
      return to;
    },
    post: async root => {
      const [post] = await db("posts").where("pid", root.post);
      return post;
    },
    latestMessage: async root => {
      const [message] = await db("messages").where("room", root.rid).orderBy('created', 'desc').limit(1);
      if (!message) return "";

      return message.content;
    },
  }
};
