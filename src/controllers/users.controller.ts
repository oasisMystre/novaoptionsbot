import type { z } from "zod";

import { eq } from "drizzle-orm";

import type { Database } from "../db";
import { users, forms } from "../db/schema";
import { userInsertSchema } from "../db/zod";

export const createUser = async (
  db: Database,
  value: z.infer<typeof userInsertSchema>
) => {
  const [user] = await db
    .insert(users)
    .values(value)
    .onConflictDoUpdate({ target: [users.id], set: value })
    .returning()
    .execute();

  const form = await db.query.forms
    .findFirst({
      where: eq(forms.user, user.id),
    })
    .execute();

  return { ...user, form };
};

export const updateUserById = async (
  db: Database,
  id: z.infer<typeof userInsertSchema>["id"],
  values: Partial<z.infer<typeof userInsertSchema>>
) => db.update(users).set(values).where(eq(users.id, id)).returning().execute();
