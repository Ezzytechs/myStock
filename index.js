const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/db');
const { verifyAccess, verifyRefresh } = require('./src/utils/auth');
const { typeDefs, resolvers } = require('./src/graphql');

const startServer = async () => {
  await connectDB();

  const app = express();
  app.use(cookieParser());

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => {
      const token = req.cookies.token;
      if(!token)return { req, res, user:null };
      const user = verifyRefresh(token);
      return { req, res, user };
    },
  });

  await server.start();
  server.applyMiddleware({
    app,
    cors: { origin: 'http://localhost:3000', credentials: true },
  });

  app.listen(4000, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
  );
};

startServer();
