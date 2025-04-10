import { Context } from "telegraf";

export * from "./format";

export const protectedCommand =
  <T extends (context: Context) => void>(
    fn: T,
    ...rooms: ("private" | "channel" | "group" | "supergroup")[]
  ) =>
  (context: Context) => {
    if (context.chat && rooms.includes(context.chat.type)) return fn(context);
    return;
  };
