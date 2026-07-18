import { z } from "zod";

export const listUsersSchema = z.object({
  body: z.object({}).optional(),
  params: z.object({}).optional(),
  query: z.object({
    page: z.coerce.number().optional(),
    pageSize: z.coerce.number().optional()
  })
});
