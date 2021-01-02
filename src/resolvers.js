import { categories } from "./constants/constants";
import db from "./db";
import jwt from 'jsonwebtoken';

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
    }
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
        const token = jwt.sign({ uid: user.uid }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '3h' });
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
  }
};
