import { jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";

import { users } from "./users";

type Form = {
  done: boolean;
};

export const forms = pgTable("forms", {
  id: uuid().defaultRandom().primaryKey(),
  user: text()
    .references(() => users.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  metadata: jsonb().$type<Form>(),
});
