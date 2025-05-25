import type { z } from "zod";
import { eq } from "drizzle-orm";

import { Database } from "../db";
import { forms } from "../db/schema";
import {
  userSelectSchema,
  formInsertSchema,
  formSelectSchema,
} from "../db/zod";

export const createForm = (
  db: Database,
  value: z.infer<typeof formInsertSchema>
) => db.insert(forms).values(value).returning().execute();

export const getformByUser = (
  db: Database,
  user: z.infer<typeof userSelectSchema>["id"]
) => db.query.forms.findFirst({ where: eq(forms.id, user) });

export const updateFormById = (
  db: Database,
  id: z.infer<typeof formSelectSchema>["id"],
  value: Partial<z.infer<typeof formInsertSchema>>
) => db.update(forms).set(value).where(eq(forms.id, id)).returning().execute();
