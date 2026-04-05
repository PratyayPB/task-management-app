import { createApp } from "./src/app.js";
import { connectDatabase, disconnectDatabase } from "./src/lib/db.js";
import { env, validateEnv } from "./src/lib/env.js";

async function startServer() {
  validateEnv();
  await connectDatabase(env.mongoUri);

  const app = createApp();
  const server = app.listen(env.port, () => {
    console.log(`Server is running on port ${env.port}`);
  });

  const shutdown = async (signal) => {
    console.log(`${signal} received. Shutting down gracefully...`);

    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });

    setTimeout(() => process.exit(1), 10000).unref();
  };

  process.on("SIGINT", () => {
    void shutdown("SIGINT");
  });

  process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
  });
}

startServer().catch((error) => {
  console.error("Failed to start the server.", error);
  process.exit(1);
});
