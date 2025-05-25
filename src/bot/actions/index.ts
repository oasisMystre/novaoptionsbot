import { Telegraf } from "telegraf";
import { doneAction } from "./done-action";
import { restartAction } from "./restart-action";

export default function registerActions(bot: Telegraf) {
  doneAction(bot);
  restartAction(bot);
}
