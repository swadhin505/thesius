import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import {z} from 'zod'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const context = await req.json();

  const result = await streamObject({
    model: openai('gpt-3.5-turbo'),
    schema: z.object({prompt: z.string().describe("instruction sentence for vision language model")}),
    prompt:
      `Convert this following sentence into an instruction prompt for a vision model for image generation: \n` + context,
  });

  return result.toTextStreamResponse();
}