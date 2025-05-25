import moment from "moment";
import { readFileSync } from "fs";
import { Markup, Telegraf } from "telegraf";

import { db } from "../../instances";
import { contactSupportButton } from "../../constants";
import { createMessages } from "../../controllers/message.controller";

export const restartAction = (telegraf: Telegraf) => {
  telegraf.action("restart", (context) => {
    return Promise.all([
      context.replyWithMarkdownV2(
        readFileSync("locale/en/flows/flow-2.md", "utf-8").replace(
          "%name%",
          context.user.name
        ),
        Markup.inlineKeyboard([
          [Markup.button.callback("Get started", "onstart")],
          [contactSupportButton],
        ])
      ),
      createMessages(db, {
        user: context.user.id,
        buttons: [
          {
            type: "callback",
            name: "Get started",
            data: "onstart",
          },
        ],
        text: readFileSync("locale/en/reminders/flow-2.md", "utf-8").replace(
          "%name%",
          context.user.name
        ),
        schedule: moment().add(24, "hours").toDate(),
      }),
    ]);
  });
};
