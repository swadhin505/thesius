import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import OpenAI from "openai";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
// });

// export async function generateSummary(content: string): Promise<string> {
//   try {
//     // Make the API call
//     const completion = await openai.chat.completions.create({
//       model: "gpt-4o-mini",
//       store: false,
//       messages: [
//         {
//           role: "user",
//           content: `summarize the following into a raw text without links or references within 60 words:\n\n${content}`,
//         },
//       ],
//     });

//     // Extract the content safely
//     const summary = completion.choices[0]?.message?.content;
//     if (!summary) {
//       throw new Error("No content returned from the API.");
//     }

//     console.log("Generated summary:", summary);
//     return summary;
//   } catch (error) {
//     console.error("Error generating summary:", error);
//     throw error;
//   }
// }