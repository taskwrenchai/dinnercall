import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const {
      meal,
      weeklyIngredients,
      servings,
      mealPreference,
      avoidIngredients,
      maxTime,
      kidFriendly,
    } = await req.json();

    if (!meal || !meal.trim()) {
      return NextResponse.json(
        { error: "DinnerCall could not identify that meal." },
        { status: 400 }
      );
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `
You are DinnerCall, a practical home cooking assistant.

Create a complete recipe for this dinner from the user's weekly plan:

${meal}

The recipe should closely match the meal name and include all major components named in it.

Weekly ingredients the user wants incorporated when appropriate:
${weeklyIngredients || "None specified"}

Servings: ${servings || "4"}
Meal preference: ${mealPreference || "No Preference"}
Maximum cooking time: ${maxTime || "No Preference"}
Avoid these ingredients or allergens: ${avoidIngredients || "None"}
Kid friendly: ${kidFriendly ? "Yes" : "No"}

Requirements:

- Use U.S. measurements and common U.S. kitchen language.
- Give precise ingredient quantities for the selected serving size.
- Include every major component named in the dinner.
- Keep the recipe practical for a home cook.
- Respect the user's allergies, dislikes, meal preference, and time limit.
- Do not introduce any ingredient listed under avoid ingredients or allergens.
- Make the instructions clear and sequential.
- Estimate calories, protein, carbohydrates, and fat per serving.
- Return ingredient entries as complete strings containing quantity and ingredient.
- Return only valid JSON.

Return JSON in exactly this shape:

{
  "recipe": {
    "name": "Recipe name",
    "why": "A short explanation of why this recipe fits the user's request.",
    "calories": "Estimated calories per serving",
    "protein": "Estimated protein per serving",
    "carbs": "Estimated carbohydrates per serving",
    "fat": "Estimated fat per serving",
    "ingredients": [
      "ingredient with quantity",
      "ingredient with quantity"
    ],
    "steps": [
      "First instruction",
      "Second instruction"
    ]
  }
}

No markdown.
No additional text outside the JSON.
      `,
    });

    const data = JSON.parse(response.output_text);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Weekly recipe error:", error);

    return NextResponse.json(
      { error: "DinnerCall could not create that recipe." },
      { status: 500 }
    );
  }
}