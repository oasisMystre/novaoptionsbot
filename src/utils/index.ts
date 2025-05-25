import { Context } from "telegraf";

export * from "./format";

export const protectedCommand =
  <T extends Context, Fn extends (context: T) => void>(
    fn: Fn,
    rooms?: ("private" | "channel" | "group" | "supergroup")[]
  ) =>
  (context: T) => {
    rooms = rooms || ["private"];
    if (context.chat && rooms.includes(context.chat.type)) return fn(context);
    return;
  };
