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
 input: `Create a simple, practical dinner recipe using these ingredients: ${ingredients}.

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

    Keep it clean, realistic, and easy for a normal home cook.`,
    });

    return NextResponse.json({
      recipe: response.output_text,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong generating the recipe." },
      { status: 500 }
    );
  }
}