import { message } from "telegraf/filters";
import type { Telegraf } from "telegraf";

import { onDone } from "./onDone";
import { onStart } from "./onStart";
import { protectedCommand } from "../utils";
import { onNewChatMembers } from "./onNewChatMembers";

export const registerCommands = (botInstance: Telegraf) => {
  botInstance.start(protectedCommand(onStart, "private"));
  botInstance.on("callback_query", (context) => {
    const query = context.callbackQuery;
    if ("data" in query) {
      switch (query.data) {
        case "done":
          return onDone(context);
      }
    }
  });
  botInstance.on(message("new_chat_members"), onNewChatMembers);
};
