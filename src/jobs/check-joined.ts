import type { z } from "zod";

import { eq } from "drizzle-orm";
import { readFileSync } from "fs";
import { Markup, TelegramError, type Telegraf } from "telegraf";

import { getEnv } from "../env";
import { users } from "../db/schema";
import type { Database } from "../db";
import type { userInsertSchema } from "../db/zod";
import { updateUserById } from "../controllers/users.controller";
import { createForm } from "../controllers/form.controller";

const onJoin = async (
  db: Database,
  bot: Telegraf,
  user: z.infer<typeof userInsertSchema>,
  sendMessage?: boolean
) => [
  updateUserById(db, user.id, { joinedChannel: true }),
  await bot.telegram.sendMessage(
    user.id,
    readFileSync("locale/en/approval.md", "utf-8").replace(
      "%project_name%",
      getEnv("PROJECT_NAME")
    ),
    { parse_mode: "MarkdownV2" }
  ),
  sendMessage
    ? [
        createForm(db, {
          user: user.id,
        }),
        bot.telegram.sendMessage(
          user.id,
          readFileSync("locale/en/start.md", "utf-8").replace(
            "%link%",
            getEnv("PINNED_TUTORIAL_MESSAGE_LINK")
          ),
          {
            link_preview_options: { is_disabled: true },
            parse_mode: "MarkdownV2",
            reply_markup: Markup.inlineKeyboard([
              Markup.button.url("Contact Support", getEnv("SUPPORT_CHAT_URL")),
            ]).reply_markup,
          }
        ),
      ]
    : null,
];

export const checkJoined = async (db: Database, bot: Telegraf) => {
  const unjoinedUsers = await db.query.users
    .findMany({
      where: eq(users.joinedChannel, false),
    })
    .execute();

  console.log("[processing.checked.joined] unjoined=", unjoinedUsers.length);

  return Promise.allSettled(
    unjoinedUsers.flatMap(async (user) => {
      await bot.telegram
        .approveChatJoinRequest(getEnv("CHANNEL_ID"), Number(user.id))
        .then(() => onJoin(db, bot, user, true))
        .catch(async (error) => {
          if (error instanceof TelegramError) {
            if (error.description.includes("USER_ALREADY_PARTICIPANT"))
              return onJoin(db, bot, user);
            bot.telegram.sendMessage(
              user.id,
              getEnv<string>("CHANNEL_INVITE_LINK")
            );
          }
        });
    })
  );
};
