import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { ingredients } = await req.json();

    if (!ingredients || !ingredients.trim()) {
      return NextResponse.json(
        { error: "Please enter some ingredients." },
        { status: 400 }
      );
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `
Create a simple but genuinely GOOD dinner recipe using these ingredients: ${ingredients}.

The recipe should feel like advice from a smart home cook, not a generic AI.

Use:
- better flavor combinations
- seasoning suggestions
- easy upgrades
- practical cooking techniques
- realistic cooking instructions

Avoid bland or overly basic directions.

Format your response EXACTLY like this:

Recipe Name:
<name>

Why this works:
<short explanation>

Ingredients:
- item 1
- item 2

Instructions:
1. step one
2. step two

Keep it clean, realistic, flavorful, and easy for a normal home cook.
      `,
    });

    const recipe = JSON.parse(response.output_text);

    return NextResponse.json({ recipe });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong generating the recipe." },
      { status: 500 }
    );
  }
}