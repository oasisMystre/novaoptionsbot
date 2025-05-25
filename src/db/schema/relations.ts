import { relations } from "drizzle-orm";

import { forms } from "./forms";
import { users } from "./users";
import { messages } from "./messages";

export const userRelations = relations(users, ({ many, one }) => ({
  form: many(forms),
  messages: many(messages),
}));

export const messageRelations = relations(messages, ({ one }) => ({
  user: one(users, { fields: [messages.user], references: [users.id] }),
}));

export const formRelations = relations(forms, ({ one }) => ({
  user: one(users, { fields: [forms.user], references: [users.id] }),
}));
