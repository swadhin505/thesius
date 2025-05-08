import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { textFilterSchema } from './textFilterSchema';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const context = await req.json();

  const result = await streamObject({
    model: openai('gpt-3.5-turbo'),
    schema: textFilterSchema,
    prompt:
      `extract a list of full sentences which are describing a view from this text:` + context,
  });

  return result.toTextStreamResponse();
}