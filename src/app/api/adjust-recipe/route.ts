import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { recipe, adjustmentRequest } = await req.json();

    if (!recipe || !adjustmentRequest?.trim()) {
      return NextResponse.json(
        { error: "Please tell DinnerCall what to adjust." },
        { status: 400 }
      );
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `
You are DinnerCall.

Current recipe:
${JSON.stringify(recipe)}

User adjustment:
${adjustmentRequest}

Modify the recipe while keeping the same overall meal whenever possible.

Return ONLY valid JSON in this exact shape:

{
  "name": "Recipe name",
  "why": "Short explanation",
  "calories": "650",
  "protein": "45g",
  "carbs": "40g",
  "fat": "25g",
  "ingredients": ["item 1"],
  "steps": ["step 1"]
}
`
    });

    const adjustedRecipe = JSON.parse(response.output_text);

    return NextResponse.json({
      recipe: adjustedRecipe,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong adjusting the recipe." },
      { status: 500 }
    );
  }
}