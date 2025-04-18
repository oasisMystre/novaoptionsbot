import "dotenv/config";
import { Markup } from "telegraf";

import { format } from "./utils";

export const WEBSITE = process.env.WEBSITE!;
export const REFERRAL_LINK = process.env.REFERRAL_LINK!;
export const SUPPORT_CHAT_ID = process.env.SUPPORT_CHAT_ID!;
export const TELEGRAM_ACCESS_TOKEN = process.env.TELEGRAM_ACCESS_TOKEN!;
export const FIREBASE_SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT!;
export const PINNED_TUTORIAL_MESSAGE_LINK =
  process.env.PINNED_TUTORIAL_MESSAGE_LINK!;

export const contactSupportButton = Markup.button.url(
  "📥 Contact Support",
  format("tg://user?id=%", SUPPORT_CHAT_ID)
);
