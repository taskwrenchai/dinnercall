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
Include:
- Recipe name
- Ingredients list
- Step-by-step instructions
- Keep it concise and realistic.`,
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