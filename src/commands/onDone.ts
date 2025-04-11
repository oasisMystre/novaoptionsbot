import { Markup, type Context } from "telegraf";
import { getFirestore } from "firebase-admin/firestore";

import { format, readFileSync } from "../utils";
import { contactSupportButton } from "../constants";

export const onDone = async (context: Context) => {
  const user = context.from;
  const firestore = getFirestore();

  if (user) {
    const userId = String(user.id);
    const form = await firestore.collection("forms").doc(userId).get();
    if (form.exists) return;
    else {
      await form.ref.create({ done: true });
      const text = readFileSync("./src/locale/en/step03.md");

      await context.replyWithMarkdownV2(
        text.replace("%name%", format("%%", user.first_name, user.last_name)),
        Markup.inlineKeyboard([contactSupportButton])
      );

      return context.editMessageReplyMarkup(
        Markup.inlineKeyboard([
          Markup.button.callback("✅ Completed", "completed"),
        ]).reply_markup
      );
    }
  }
};
