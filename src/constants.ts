import "dotenv/config";
import { Markup } from "telegraf";

import { getEnv } from "./env";

export const contactSupportButton = Markup.button.url(
  "📥 Contact Support",
  getEnv("SUPPORT_CHAT_URL")
);
