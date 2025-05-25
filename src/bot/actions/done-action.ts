import moment from "moment";
import { readFileSync } from "fs";
import { Markup, Telegraf, type Context } from "telegraf";

import { getEnv } from "../../env";
import { db } from "../../instances";
import { contactSupportButton } from "../../constants";
import { createMessages } from "../../controllers/message.controller";
import { updateFormById } from "../../controllers/form.controller";

export const doneAction = (bot: Telegraf) => {
  bot.action("done", async (context: Context) => {
    if (context.user.form)
      if (context.user.form.metadata && context.user.form.metadata.done) return;
      else {
        return Promise.allSettled([
          updateFormById(db, context.user.form.id, {
            metadata: { ...context.user.form.metadata, done: true },
          }),
          context.editMessageReplyMarkup(
            Markup.inlineKeyboard([
              Markup.button.callback("✅ Completed", "completed"),
            ]).reply_markup
          ),
          context.replyWithMarkdownV2(
            readFileSync("locale/en/flows/flow-5.md", "utf-8").replace(
              "%name%",
              context.user.name
            ),
            Markup.inlineKeyboard([contactSupportButton])
          ),
          createMessages(db, {
            buttons: [],
            user: context.user.id,
            schedule: moment().add(5, "minute").toDate(),
            text: readFileSync("locale/en/flows/flow-6.md", "utf-8")
              .replace("%name%", context.user.name)
              .replace("%code%", getEnv("CODE"))
              .replace("%link%", getEnv("REFERRAL_LINK")),
          }),
          createMessages(db, {
            buttons: [
              { type: "callback", name: "✅ Yes", data: "gift" },
              { type: "callback", name: "🔴 No", data: "restart" },
            ],
            user: context.user.id,
            schedule: moment().add(1, "minutes").toDate(),
            text: readFileSync(
              "locale/en/reminders/flow-1.md",
              "utf-8"
            ).replace("%name%", context.user.name),
          }),
        ]);
      }
  });
};
