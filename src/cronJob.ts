import { telegraf } from "instances";
import { Input, Markup } from "telegraf";

import { cleanText } from "./utils";
import { contactSupportButton } from "./constants";
import { getScheduledMessages, updateScheduledMessages } from "./data";

export const run = async () => {
  const scheduledMessages = await getScheduledMessages("pending");
  console.log(
    "[checking messages] ",
    scheduledMessages.length,
    " messages found"
  );

  return Promise.all(
    scheduledMessages.map(async ({ id, message }) => {
      const reply_markup = (
        message.inlineActions
          ? Markup.inlineKeyboard(
              message.inlineActions.map((inlineAction) =>
                Markup.button.callback(inlineAction.name, inlineAction.data)
              )
            )
          : Markup.inlineKeyboard([contactSupportButton])
      ).reply_markup;

      if (message.image)
        await telegraf.telegram.sendPhoto(
          message.chatId,
          Input.fromURL(message.image),
          {
            caption: cleanText(message.text),
            parse_mode: message.parseMode ? message.parseMode : "MarkdownV2",
            reply_markup,
          }
        );
      else
        await telegraf.telegram.sendMessage(
          message.chatId,
          cleanText(message.text),
          {
            parse_mode: message.parseMode ? message.parseMode : "MarkdownV2",
            link_preview_options: {
              is_disabled: true,
            },
            reply_markup,
          }
        );

      return updateScheduledMessages(id, { status: "sent" });
    })
  );
};

