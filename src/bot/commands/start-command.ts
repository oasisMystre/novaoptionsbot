import moment from "moment";
import { readFileSync } from "fs";
import { Markup, Telegraf } from "telegraf";

import { getEnv } from "../../env";
import { db } from "../../instances";
import { protectedCommand } from "../../utils";
import { contactSupportButton } from "../../constants";
import { createForm, updateFormById } from "../../controllers/form.controller";
import {
  createMessages,
  deleteMessagesByUser,
} from "../../controllers/message.controller";

export const startCommand = (bot: Telegraf) => {
  const onStart = protectedCommand((context) => {
    if (context.user.form)
      return Promise.all([
        deleteMessagesByUser(db, context.user.id),
        updateFormById(db, context.user.form.id, {
          metadata: { ...context.user.form.metadata, done: false },
        }),
        createMessages(db, {
          user: context.user.id,
          schedule: moment().add(1, "minutes").toDate(),
          text: readFileSync("locale/en/flows/flow-4.md", "utf-8")
            .replace("%link%", getEnv("FORM_LINK"))
            .replace("%name%", context.user.name),
          buttons: [{ type: "callback", name: "Done", data: "done" }],
        }),
        context.replyWithMarkdownV2(
          readFileSync("locale/en/flows/flow-3.md", "utf-8")
            .replace("%name%", context.user.name)
            .replace("%message_link%", getEnv("PINNED_TUTORIAL_MESSAGE_LINK"))
            .replace("%support_link%", getEnv("SUPPORT_CHAT_URL")),
          {
            link_preview_options: { is_disabled: true },
            reply_markup: Markup.inlineKeyboard([contactSupportButton])
              .reply_markup,
          }
        ),
      ]);
    else
      return Promise.all([
        createForm(db, {
          user: context.user.id,
        }),
        context.replyWithMarkdownV2(
          readFileSync("locale/en/start.md", "utf-8").replace(
            "%link%",
            getEnv("PINNED_TUTORIAL_MESSAGE_LINK")
          ),
          {
            link_preview_options: { is_disabled: true },
            reply_markup: Markup.inlineKeyboard([
              Markup.button.url("Contact Support", getEnv("SUPPORT_CHAT_URL")),
            ]).reply_markup,
          }
        ),
      ]);
  });

  bot.start(onStart);
  bot.action("onstart", onStart);
};
