import OpenAI from "openai";
import { NextResponse } from "next/server";
import { calculateRecipeNutrition } from "@/lib/nutrition";

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
  "prepTime": "10 minutes",
  "cookTime": "30 minutes",
  "totalTime": "40 minutes",
  "adjustmentNote": "Short note explaining what changed or what ingredient was substituted",
  "ingredients": [
    "1 lb boneless skinless chicken breast",
    "1 tablespoon olive oil"
  ],
  "ingredientData": [
    {
      "name": "boneless skinless chicken breast, raw",
      "amount": 1,
      "unit": "lb",
      "grams": 454
    },
    {
      "name": "olive oil",
      "amount": 1,
      "unit": "tbsp",
      "grams": 14
    }
  ],
  "steps": [
    {
      "title": "Preheat the oven",
      "instruction": "Preheat the oven to 425°F."
    },
    {
      "title": "Cook the chicken",
      "instruction": "Cook until the chicken reaches 165°F internally."
    }
  ]
}

The prepTime, cookTime, and totalTime must reflect realistic times for the adjusted recipe.
The totalTime should approximately equal prepTime plus cookTime.

For ingredientData:
- Include every ingredient that contributes meaningful calories or nutrients.
- Use a numeric amount.
- Include the best practical gram equivalent for the TOTAL amount used in the adjusted recipe.
- Keep the ingredient name clean, specific, and searchable in a nutrition database.
- Use consistent units such as lb, oz, cup, tbsp, tsp, or item.
- Do not combine multiple ingredients into one entry.
- The "grams" value should represent the TOTAL ingredient used in the recipe, not one serving.

For steps:
- Return each step as an object with a short "title" and detailed "instruction".
- Keep titles brief and easy to scan.
- Write clear sequential instructions for a normal home cook.
- Include specific temperatures, times, heat levels, and doneness cues when relevant.

Include an adjustmentNote that clearly explains what changed. If the user is missing an ingredient, suggest a practical substitute when possible.

Use U.S. kitchen measurements whenever possible. Prefer cups, tablespoons, teaspoons, ounces, pounds, and common item counts instead of grams or milliliters. For example, use "1 lb chicken breast" instead of "450g chicken breast."

Return ONLY valid JSON. No markdown. No extra text.

`
    });

    const adjustedRecipe = JSON.parse(response.output_text);

    const nutrition = await calculateRecipeNutrition(
  adjustedRecipe.ingredientData,
  recipe.servings
);

adjustedRecipe.calories = String(nutrition.perServing.calories);
adjustedRecipe.protein = `${nutrition.perServing.protein}g`;
adjustedRecipe.carbs = `${nutrition.perServing.carbs}g`;
adjustedRecipe.fat = `${nutrition.perServing.fat}g`;
adjustedRecipe.nutritionVerified = true;

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