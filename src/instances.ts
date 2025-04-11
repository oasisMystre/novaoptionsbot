import { Telegraf } from "telegraf";
import { credential } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";

import { FIREBASE_SERVICE_ACCOUNT, TELEGRAM_ACCESS_TOKEN } from "./constants";

initializeApp({
  credential: credential.cert(JSON.parse(FIREBASE_SERVICE_ACCOUNT)),
});

export const telegraf = new Telegraf(TELEGRAM_ACCESS_TOKEN);
