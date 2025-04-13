import moment from "moment";
import { Markup, type Context } from "telegraf";
import { getFirestore } from "firebase-admin/firestore";

import type { Form } from "../data/models";
import { format, readFileSync } from "../utils";
import { createScheduledMessage } from "../data";
import { contactSupportButton, REFERRAL_LINK } from "../constants";

export const onDone = async (context: Context) => {
  const user = context.from;
  const firestore = getFirestore();

  if (user) {
    const userId = String(user.id);
    const name = format("%%", user.first_name, user.last_name);
    const doc = await firestore.collection("forms").doc(userId).get();
    const form = doc.data() as Form | undefined;

    if (form && form.done) return;
    else {
      return Promise.allSettled([
        doc.exists
          ? doc.ref.update({ done: true })
          : doc.ref.create({ done: true }),
        context.editMessageReplyMarkup(
          Markup.inlineKeyboard([
            Markup.button.callback("✅ Completed", "completed"),
          ]).reply_markup
        ),
        context.replyWithMarkdownV2(
          readFileSync("./src/locale/en/step03.md").replace("%name%", name),
          Markup.inlineKeyboard([contactSupportButton])
        ),
        createScheduledMessage({
          message: {
            chatId: userId,
            text: readFileSync("./src/locale/en/done.md", "utf-8")
              .replace("%name%", name)
              .replace("%referralLink%", REFERRAL_LINK),
          },
          date: moment().add(1, "minute").toDate(),
        }),
      ]);
    }
  }
};
