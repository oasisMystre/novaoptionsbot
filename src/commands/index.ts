import { message } from "telegraf/filters";
import type { Telegraf } from "telegraf";

import { onStart } from "./onStart";
import { protectedCommand } from "../utils";
import { onNewChatMembers } from "./onNewChatMembers";

export const registerCommands = (botInstance: Telegraf) => {
  botInstance.start(protectedCommand(onStart, "private"));
  botInstance.on(message("new_chat_members"), onNewChatMembers);
};
