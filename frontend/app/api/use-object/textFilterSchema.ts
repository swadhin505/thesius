import { z } from 'zod';

// define a schema for the textFilters
export const textFilterSchema = z.object({
  visualTextList: z.array(
    z.string().describe("sentence which require visualization"),
  ),
});