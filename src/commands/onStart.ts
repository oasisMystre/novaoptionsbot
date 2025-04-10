import { Markup, type Context } from "telegraf";
import { getFirestore } from "firebase-admin/firestore";

import { readFileSync, format } from "../utils";
import { PINNED_TUTORIAL_MESSAGE_LINK, SUPPORT_CHAT_ID } from "../constants";

export const onStart = async (context: Context) => {
  const firestore = getFirestore();
  const user = context.from;
  if (user) {
    const userId = String(user.id);

    const hasStarted = await firestore
      .collection(userId)
      .doc("hasStarted")
      .get();

    if (hasStarted.exists) {
      const text = readFileSync("./src/locale/en/step01.md");

      return context.replyWithMarkdownV2(
        format(text, PINNED_TUTORIAL_MESSAGE_LINK, SUPPORT_CHAT_ID),
        {
          link_preview_options: { is_disabled: true },
          reply_markup: Markup.inlineKeyboard([
            Markup.button.url(
              "📥 Contact Support",
              format("tg://user?id=%", SUPPORT_CHAT_ID)
            ),
          ]).reply_markup,
        }
      );
    } else {
      const text = readFileSync("./src/locale/en/start.md");
      await hasStarted.ref.create({ started: true });

      return context.replyWithMarkdownV2(text, {
        link_preview_options: { is_disabled: true },
        reply_markup: Markup.inlineKeyboard([
          Markup.button.switchToChat(
            "📥 Contact Support",
            format("tg://user?id=%", SUPPORT_CHAT_ID)
          ),
        ]).reply_markup,
      });
    }
  }
};
