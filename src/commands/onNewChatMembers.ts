import type { Context } from "telegraf";
import { readFileSync } from "../utils";

export const onNewChatMembers = (context: Context) => {
  return context.replyWithMarkdownV2(
    readFileSync("./src/locale/en/approval.md")
  );
};
