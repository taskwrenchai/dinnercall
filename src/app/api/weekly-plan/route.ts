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
        { error: "Please enter some ingredients first." },
        { status: 400 }
      );
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `
You are DinnerCall, a practical home meal-planning assistant.

Create a simple 5-night dinner plan using these ingredients when helpful:
${ingredients}

Servings: ${servings || "4"}
Meal preference: ${mealPreference || "No Preference"}
Max cooking time: ${maxTime || "No Preference"}
Avoid these ingredients/allergies: ${avoidIngredients || "None"}
Kid friendly: ${kidFriendly ? "Yes" : "No"}

Create 5 different dinner ideas for Monday through Friday.

Use U.S. kitchen language.
Keep meals realistic for busy families.
Avoid repeating the exact same meal.
Reuse ingredients intelligently when possible.
Do not write full recipes yet. Meal names only.

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

    const weeklyPlan = JSON.parse(response.output_text);

    return NextResponse.json(weeklyPlan);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong planning your week." },
      { status: 500 }
    );
  }
}