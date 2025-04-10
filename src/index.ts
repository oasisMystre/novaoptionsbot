import "dotenv/config";
import admin from "firebase-admin";
import { Telegraf } from "telegraf";
import Fastify, { type FastifyRequest } from "fastify";

import { registerCommands } from "./commands";
import { FIREBASE_SERVICE_ACCOUNT } from "./constants";

async function main() {
  admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(FIREBASE_SERVICE_ACCOUNT)),
  });
  const server = Fastify({
    logger: true,
    ignoreDuplicateSlashes: true,
    ignoreTrailingSlash: true,
  });
  const telegraf = new Telegraf(process.env.TELEGRAM_ACCESS_TOKEN!);
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
  } else tasks.push(telegraf.launch());

  tasks.push(
    server.listen({
      host: process.env.HOST,
      port: process.env.PORT ? Number(process.env.PORT!) : undefined,
    })
  );

  process.on("SIGINT", () => {
    telegraf.stop("SIGINT");
    return server.close();
  });
  process.on("SIGTERM", () => {
    telegraf.stop("SIGTERM");
    return server.close();
  });

  return await Promise.all(tasks);
}

main();
