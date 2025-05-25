import { session, Telegraf } from "telegraf";

import registerActions from "./actions";
import { registerCommands } from "./commands";
import { authenticateUser } from "./middlewares/authenticate-user";

export default function registerBot(bot: Telegraf) {
  bot.use(session());
  bot.use(authenticateUser);
  
  registerActions(bot);
  registerCommands(bot);
}
