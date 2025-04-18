import "dotenv/config";
import cron from "node-cron";
import Fastify, { type FastifyRequest } from "fastify";

import { run } from "./cronJob";
import { telegraf } from "./instances";
import { registerCommands } from "./commands";

async function main() {
  const server = Fastify({
    logger: true,
    ignoreDuplicateSlashes: true,
    ignoreTrailingSlash: true,
  });

  registerCommands(telegraf);

  const tasks = [];

  if ("RENDER_EXTERNAL_HOSTNAME" in process.env) {
    const webhook = await telegraf.createWebhook({
      domain: process.env.RENDER_EXTERNAL_HOSTNAME!,
    });
    server.post(
      "/telegraf/" + telegraf.secretPathComponent(),
      webhook as unknown as (request: FastifyRequest) => void
    );

    tasks.push(
      server.listen({
        host: process.env.HOST,
        port: process.env.PORT ? Number(process.env.PORT!) : undefined,
      })
    );
  } else tasks.push(telegraf.launch());

  process.on("SIGINT", () => {
    telegraf.stop("SIGINT");
    return server.close();
  });
  process.on("SIGTERM", () => {
    telegraf.stop("SIGTERM");
    return server.close();
  });

  Promise.all(tasks);
  cron.schedule("*/5 * * * *", () =>
    run().catch((error) => console.error("[FATILE ERROR]", error))
  );
}

main();
