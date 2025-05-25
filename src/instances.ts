import { Telegraf } from "telegraf";

import { getEnv } from "./env";
import { createDB } from "./db";

export const db = createDB(getEnv("DATABASE_URL"));
export const telegraf = new Telegraf(getEnv("TELEGRAM_ACCESS_TOKEN"));
