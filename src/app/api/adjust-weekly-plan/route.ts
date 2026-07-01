import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const {
      weeklyPlan,
      adjustmentRequest,
      ingredients,
      servings,
      mealPreference,
      avoidIngredients,
      maxTime,
      kidFriendly,
    } = await req.json();

    if (!weeklyPlan || weeklyPlan.length === 0 || !adjustmentRequest?.trim()) {
      return NextResponse.json(
        { error: "Please tell DinnerCall what to adjust." },
        { status: 400 }
      );
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `
You are DinnerCall, a practical home meal-planning assistant.

Current weekly plan:
${weeklyPlan
  .map(
    (meal: string, index: number) =>
      `${["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][index]}: ${meal}`
  )
  .join("\n")}

User adjustment request:
${adjustmentRequest}

Original ingredients or proteins:
${ingredients}

Servings: ${servings || "4"}
Meal preference: ${mealPreference || "No Preference"}
Max cooking time: ${maxTime || "No Preference"}
Avoid these ingredients/allergies: ${avoidIngredients || "None"}
Kid friendly: ${kidFriendly ? "Yes" : "No"}

Modify the weekly plan based on the user's request.

Rules:
- Keep any meals the user did not ask to change.
- If the user dislikes a side, ingredient, or meal, replace only the affected meal unless they clearly ask for more.
- Keep the plan realistic for busy families.
- Use U.S. kitchen language.
- Avoid ingredients listed in dislikes/allergies.
- Return exactly 5 meals, Monday through Friday.
- Meal names only. No recipes yet.

Return ONLY valid JSON in this exact shape:

{
  "meals": [
    "Meal idea 1",
    "Meal idea 2",
    "Meal idea 3",
    "Meal idea 4",
    "Meal idea 5"
  ]
}

No markdown. No extra text.
      `,
    });

    const adjustedPlan = JSON.parse(response.output_text);

    return NextResponse.json(adjustedPlan);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong adjusting your weekly plan." },
      { status: 500 }
    );
  }
}