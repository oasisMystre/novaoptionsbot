import { Telegraf } from "telegraf";
import { doneAction } from "./done-action";
import onJoinAction from "./on-join-action";
import { restartAction } from "./restart-action";

export default function registerActions(bot: Telegraf) {
  doneAction(bot);
  onJoinAction(bot);
  restartAction(bot);
}
