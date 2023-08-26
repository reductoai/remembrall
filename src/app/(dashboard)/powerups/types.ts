import { z } from "zod";
export const createDocContextSchema = z.object({
  name: z.string().nonempty(),
  chunkSize: z.number().int(),
});
