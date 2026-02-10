require("module-alias/register");
const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const connectDB = require("./src/config/db");
const createApp = require("./app");

const PORT = process.env.PORT;

const startServer = async () => {
  await connectDB();

  const { app, apolloServer } = await createApp();

  const httpServer = app.listen(PORT, () => {
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${apolloServer.graphqlPath}`,
    );
  });

  /* =======================
     GRACEFUL SHUTDOWN
  ======================= */
  const shutdown = async (signal) => {
    console.log(`\n🛑 ${signal} received. Shutting down gracefully...`);

    try {
      await apolloServer.stop();
      console.log("🧠 Apollo Server stopped");

      httpServer.close(async () => {
        console.log("🌐 HTTP server closed");

        await mongoose.connection.close(false);
        console.log("🗄️ MongoDB connection closed");

        process.exit(0);
      });

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
