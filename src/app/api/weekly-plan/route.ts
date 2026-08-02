import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const {
      ingredients,
      servings,
      mealPreference,
      avoidIngredients,
      maxTime,
      kidFriendly,
    } = await req.json();

    if (!ingredients || !ingredients.trim()) {
      return NextResponse.json(
        {
          error:
            "Tell DinnerCall which proteins or main ingredients you want included this week.",
        },
        { status: 400 }
      );
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `
You are DinnerCall, a practical home cooking assistant.

Create a varied 5-night dinner plan built around these ingredients:

${ingredients}

User preferences:

Servings: ${servings || "4"}
Meal preference: ${mealPreference || "No Preference"}
Maximum cooking time: ${maxTime || "No Preference"}
Avoid these ingredients or allergens: ${avoidIngredients || "None"}
Kid friendly: ${kidFriendly ? "Yes" : "No"}

Create 5 different dinner ideas for Monday through Friday.

Use the supplied ingredients as the primary ingredients to build the week around,
but do not force every meal to use every supplied ingredient.

Create a week that feels like a real family's meal plan.

Requirements:

- Vary the proteins, vegetables, starches, and cooking styles.
- Do not repeat the same side dish more than twice.
- Avoid meals that are only small variations of each other.
- If the user supplies only one protein, use it in no more than two meals unless necessary.
- If helpful, introduce common grocery items to create variety.
- Balance convenience with variety.
- Keep meals realistic for busy families.
- Respect the user's meal preference, time limit, dislikes, and allergies.
- Never include an ingredient listed under dislikes or allergies.
- Use U.S. kitchen language.
- Do not write full recipes.
- Return meal names only.
- Return exactly five meals.
- Return only valid JSON.

Return JSON in exactly this shape:

{
  "meals": [
    "Monday meal",
    "Tuesday meal",
    "Wednesday meal",
    "Thursday meal",
    "Friday meal"
  ]
}

No markdown.
No additional text outside the JSON.
      `,
    });

    const data = JSON.parse(response.output_text);

    return NextResponse.json(data);
  } catch (error) {
    console.error("Weekly plan error:", error);

    return NextResponse.json(
      { error: "DinnerCall could not create your weekly plan." },
      { status: 500 }
    );
  }
}