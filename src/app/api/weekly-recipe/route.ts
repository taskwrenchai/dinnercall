import OpenAI from "openai";
import { NextResponse } from "next/server";
import { calculateRecipeNutrition } from "@/lib/nutrition";

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

The weekly meal name is authoritative. Preserve the intended dish, protein type, cut, preparation style, and major components implied by the meal name. Do not substitute a different form of a protein merely because it appears in the weekly ingredients. For example, "Beef Fajitas" should use sliced fajita-appropriate beef, not ground beef; "Beef and Broccoli Stir-Fry" should use sliced beef, not ground beef. Weekly ingredients are secondary and should only be incorporated when they make culinary sense for the named meal.

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
- Return ingredient entries as complete strings containing quantity and ingredient.
- Return only valid JSON.
- Return structured ingredient data for nutrition calculations.
- For each ingredient, include the best practical gram equivalent for the TOTAL amount used in the recipe.
- Keep the ingredient name clean, specific, and easily searchable in a nutrition database.
- Include nutritionally meaningful details when they are known from the recipe, such as raw vs cooked, dry vs cooked, skinless vs skin-on, lean percentage for ground meat, or fat percentage/type for dairy.
- The ingredientData name must accurately reflect the ingredient shown to the user. Do not invent a more specific variety, fat level, lean percentage, preparation state, or other characteristic unless the recipe itself specifies it.
- When a nutritionally meaningful distinction matters, make the user-facing ingredient specific enough to support an accurate nutrition match. For example, prefer "1 lb 90% lean ground beef" over an unspecified "1 lb ground beef" when ground beef is used.
- Include realistic prepTime, cookTime, and totalTime values for this specific recipe.
- totalTime should approximately equal prepTime plus cookTime and must stay within the user's selected time limit.
- Return each step as an object with a short action-oriented title and a detailed instruction.
- Keep step titles brief and easy to scan.
- Include specific cooking times, temperatures, heat levels, and doneness cues when relevant.
- Write the "why" explanation as natural, appetizing dinner guidance. Explain what makes the flavors, ingredients, or cooking style work well together. Do not mention the user, their request, the prompt, the meal name, requirements, constraints, or that the recipe "matches" anything.

Return JSON in exactly this shape:

{
  "recipe": {
    "name": "Recipe name",
    "why": "A short explanation of why this recipe fits the user's request.",
    "servings": 4,
    "prepTime": "10 minutes",
    "cookTime": "30 minutes",
    "totalTime": "40 minutes",
    "ingredients": [
      "ingredient with quantity",
      "ingredient with quantity"
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
}

The servings value must equal ${servings || 4}.

For ingredientData:
- Include every ingredient that contributes meaningful calories or nutrients.
- Use a numeric amount.
- Include the best practical gram equivalent for the TOTAL amount used in the recipe.
- Use consistent units such as lb, oz, cup, tbsp, tsp, or item.
- Do not combine multiple ingredients into one entry.
- Do not include optional garnishes unless they are included in the recipe.
- The "grams" value should represent the TOTAL ingredient used in the recipe, not one serving.

No markdown.
No additional text outside the JSON.
      `,
    });

    const data = JSON.parse(response.output_text);

const recipe = data.recipe;

const nutrition = await calculateRecipeNutrition(
  recipe.ingredientData,
  recipe.servings
);

recipe.calories = String(nutrition.perServing.calories);
recipe.protein = `${nutrition.perServing.protein}g`;
recipe.carbs = `${nutrition.perServing.carbs}g`;
recipe.fat = `${nutrition.perServing.fat}g`;
recipe.nutritionVerified = true;

return NextResponse.json({
  recipe,
  nutritionDetails: nutrition,
});

  } catch (error) {
    console.error("Weekly recipe error:", error);

    return NextResponse.json(
      { error: "DinnerCall could not create that recipe." },
      { status: 500 }
    );
  }
}