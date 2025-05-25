import type { Telegraf } from "telegraf";

import { startCommand } from "./start-command";

export const registerCommands = (bot: Telegraf) => {
  startCommand(bot);
};
