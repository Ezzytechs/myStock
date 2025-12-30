const express = require("express");
require("module-alias/register");
const dotenv = require("dotenv");
const { ApolloServer } = require("apollo-server-express");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/config/db");
const { verifyAccess } = require("./src/utils/auth");
const { typeDefs, resolvers } = require("./src/graphql");
const mongoose = require("mongoose");
const morgan = require("morgan");
const AppError = require("./src/utils/appErrors");

dotenv.config();

const startServer = async () => {
  await connectDB();

  const app = express();
  app.use(cookieParser());
  app.use(morgan(":method :url :response-time ms"));

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
      if (!user)
        throw AppError.unauthorized("Unauthorized. Invalid or expired token");
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
    cors: { origin: "http://localhost:4000", credentials: true },
  });

  const httpServer = app.listen(4000, () => {
    console.log(
      `🚀 Server ready at http://localhost:4000${apolloServer.graphqlPath}`
    );
  });

  /* =======================
     GRACEFUL SHUTDOWN
  ======================= */
  const shutdown = async (signal) => {
    console.log(`\n🛑 ${signal} received. Shutting down gracefully...`);

    try {
      // Stop Apollo Server
      await apolloServer.stop();
      console.log("🧠 Apollo Server stopped");

      // Stop accepting new connections
      httpServer.close(async () => {
        console.log("🌐 HTTP server closed");

        // Close MongoDB
        await mongoose.connection.close(false);
        console.log("🗄️ MongoDB connection closed");

        process.exit(0);
      });

      // Force exit if shutdown takes too long
      setTimeout(() => {
        console.error("⏰ Force shutdown");
        process.exit(1);
      }, 10000);
    } catch (err) {
      console.error("❌ Error during shutdown", err);
      process.exit(1);
    }
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
};

startServer();
