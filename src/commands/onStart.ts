import moment from "moment";
import { Markup, type Context } from "telegraf";
import { getFirestore } from "firebase-admin/firestore";

import type { Form } from "../data/models";
import { readFileSync, format } from "../utils";
import { createScheduledMessage } from "../data";
import {
  contactSupportButton,
  PINNED_TUTORIAL_MESSAGE_LINK,
  SUPPORT_CHAT_ID,
  WEBSITE,
} from "../constants";

export const onStart = async (context: Context) => {
  const firestore = getFirestore();
  const user = context.from;
  if (user) {
    const userId = String(user.id);

    const doc = await firestore.collection("forms").doc(userId).get();
    const form = doc.data() as Form | undefined;

    if (form && !form.started) {
      return Promise.allSettled([
        doc.ref.update({ started: true }),
        createScheduledMessage({
          date: moment().add(1, "minutes").toDate(),
          message: {
            chatId: user.id,
            inlineActions: [{ type: "callback", name: "Done", data: "done" }],
            text: readFileSync("./src/locale/en/step02.md", "utf-8")
              .replace("%formLink%", "https://novaoptions.com")
              .replace(
                "%name%",
                format("% %", user.first_name, user.last_name)
              ),
          },
        }),
        context.replyWithMarkdownV2(
          format(
            readFileSync("./src/locale/en/step01.md"),
            PINNED_TUTORIAL_MESSAGE_LINK,
            SUPPORT_CHAT_ID
          ),
          {
            link_preview_options: { is_disabled: true },
            reply_markup: Markup.inlineKeyboard([contactSupportButton])
              .reply_markup,
          }
        ),
      ]);
    } else
      return Promise.allSettled([
        doc.exists
          ? doc.ref.update({ started: false, done: false })
          : doc.ref.create({ started: false, done: false }),
        context.replyWithMarkdownV2(
          format(readFileSync("./src/locale/en/start.md"), WEBSITE),
          {
            link_preview_options: { is_disabled: true },
            reply_markup: Markup.inlineKeyboard([
              Markup.button.callback("⚡️ Start", "/start"),
            ]).reply_markup,
          }
        ),
      ]);
  }
};
