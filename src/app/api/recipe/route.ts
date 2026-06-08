import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
const { ingredients, servings, mealPreference, avoidIngredients, maxTime, kidFriendly, mealType,
 } = await req.json();

    if (!ingredients || !ingredients.trim()) {
      return NextResponse.json(
        { error: "Please enter some ingredients." },
        { status: 400 }
      );
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `
Create one simple but genuinely GOOD ${mealType || "Dinner"} recipe...
Make the recipe for ${servings || "4"} servings.

${kidFriendly ? "The recipe should be kid-friendly and appeal to children." : ""}

${maxTime !== "No Preference"
  ? `The recipe must realistically take ${maxTime} from start to finish, including prep time. Do not exceed this limit.`
  : ""}

Meal preference: ${mealPreference || "No Preference"}.

Avoid these ingredients: ${avoidIngredients || "None"}.

Maximum cook time: ${maxTime || "No Preference"}.

Kid friendly: ${kidFriendly ? "Yes" : "No"}.


The recipe should feel like advice from a smart home cook, not a generic AI.

Use:
- better flavor combinations
- seasoning suggestions
- easy upgrades
- practical cooking techniques
- realistic cooking instructions

Return ONLY valid JSON in this exact shape:
{
  "name": "Recipe name",
  "why": "Short explanation of why this works",
  "calories": "650",
  "protein": "45g",
  "carbs": "40g",
  "fat": "25g",
  "ingredients": ["item 1", "item 2"],
  "steps": ["step one", "step two"]
}

Estimate nutrition PER SERVING.

Provide:
- calories
- protein
- carbs
- fat

Use realistic estimates based on the ingredients and portion size.

Make the instructions detailed enough for a normal home cook to follow.
No markdown. No extra text.

Use U.S. kitchen measurements whenever possible. Prefer cups, tablespoons, teaspoons, ounces, pounds, and common item counts instead of grams or milliliters. For example, use "1 lb chicken breast" instead of "450g chicken breast."

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