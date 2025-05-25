import { readFileSync } from "fs";
import { message } from "telegraf/filters";
import { Context, type Telegraf } from "telegraf";

import { getEnv } from "../../env";
import { db } from "../../instances";
import { joinChannel } from "../utils/join-channel";
import { updateFormById } from "../../controllers/form.controller";
import { deleteMessagesByUser } from "../../controllers/message.controller";

export default function onJoinAction(bot: Telegraf) {
  const onJoin = async (context: Context) => {
    return Promise.allSettled([
      joinChannel(context),
      context.telegram.sendMessage(
        context.user.id,
        readFileSync("locale/en/approval.md", "utf-8").replace(
          "%project_name%",
          getEnv("PROJECT_NAME")
        ),
        { parse_mode: "MarkdownV2" }
      ),
    ]);
  };

  bot.on("chat_member", (context) => {
    if (context.chatMember.new_chat_member) return onJoin(context);
  });

  bot.on("chat_join_request", onJoin);
  bot.on("left_chat_member", (context) => {
    Promise.all([
      deleteMessagesByUser(db, context.user.id),
      updateFormById(db, context.user.form!.id, {
        metadata: { ...context.user.form!.metadata, done: false },
      }),
    ]);
  });
  bot.on(message("new_chat_members"), onJoin);
}
