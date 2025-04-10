import type { Context } from "telegraf";
import { readFileSync } from "../utils";

export const onNewChatMembers = (context: Context) => {
  const text = readFileSync("./src/locale/en/approval.md");
  return context.replyWithMarkdownV2(text);
};
