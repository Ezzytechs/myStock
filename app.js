const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const cors = require("cors");
const { verifyAccess } = require("./src/utils/auth");
const { typeDefs, resolvers } = require("./src/graphql");
const AppError = require("./src/utils/appErrors");

const corsConfig = require("./src/config/cors");
const helmetConfig = require("./src/config/helmet");
const { limiter } = require("./src/config/rateLimiter");

const createApp = async () => {
  const app = express();

  app.use(cookieParser());
  app.use(morgan(":method :url :response-time ms"));
  app.use(helmet(helmetConfig));
  app.use(compression());
  app.use(cors(corsConfig));
  app.use(limiter);

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => {
      const authHeader = req.headers.authorization;
      const token = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : null;

      if (!token) return { req, res, user: null };

      const user = verifyAccess(token);
      if (!user) {
        throw AppError.unauthorized("Unauthorized. Invalid or expired token");
      }

      return { req, res, user };
    },

    formatError: (err) => {
      console.error("error from formatter", { err: err.message });

      if (
        err.message.includes("(reading 'sub')") ||
        err.message.includes("(reading 'role')")
      ) {
        throw AppError.unauthorized("Unauthorized. Must sign in!");
      }

      return err;
    },
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({
    app,
    cors: { origin: `http://localhost:${process.env.PORT}`, credentials: true },
  });

  return { app, apolloServer };
};

module.exports = createApp;
