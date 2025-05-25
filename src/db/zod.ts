import z, { object, enum as enum_, string, boolean } from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

import { messages, users, forms } from "./schema";

export const userSelectSchema = createSelectSchema(users);
export const userInsertSchema = createInsertSchema(users);

export type Button = {
  type: "callback" | "url";
  name: string;
  data: string;
};

const messageMetadataSchema = z.object({
  type: enum_(["callback", "url"]),
  name: string(),
  data: string(),
});

export const messageSelectSchema = createSelectSchema(messages, {
  buttons: z
    .array(messageMetadataSchema)
    .or(z.array(z.array(messageMetadataSchema))),
});

export const messageInsertSchema = createInsertSchema(messages, {
  buttons: z
    .array(messageMetadataSchema)
    .or(z.array(z.array(messageMetadataSchema))),
});

const formMetadata = object({
  done: boolean(),
});

export const formSelectSchema = createSelectSchema(forms, {
  metadata: formMetadata.nullish(),
});
export const formInsertSchema = createInsertSchema(forms, {
  metadata: formMetadata.nullish(),
});
