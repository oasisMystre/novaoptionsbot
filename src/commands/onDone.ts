import { Markup, type Context } from "telegraf";
import { getFirestore } from "firebase-admin/firestore";

export const onDone = async (context: Context) => {
  const user = context.from;
  const firestore = getFirestore();

  

  if (user) {
    const userId = String(user.id);
    const form = await firestore.collection("forms").doc(userId).get();
    if (form.exists) return;
    else {
      await form.ref.update({ done: true });
      
      return context.editMessageReplyMarkup(
        Markup.inlineKeyboard([
          Markup.button.callback("✅ Completed", "completed"),
        ]).reply_markup
      );
    }
  }
};
