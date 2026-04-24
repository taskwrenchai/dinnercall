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
      model: "gpt-5.4",
      input: `You are a helpful recipe assistant for an app called DinnerCall.
Create one simple dinner idea using these ingredients: ${ingredients}.

Return:
1. Recipe name
2. Short description
3. Ingredients list
4. Step-by-step instructions

Keep it practical and concise.`,
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