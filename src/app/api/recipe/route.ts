import OpenAI from "openai";
import { NextResponse } from "next/server";
import { calculateRecipeNutrition } from "@/lib/nutrition";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {

const {
  ingredients,
  dinnerMoods,
  dinnerIntent,
  servings,
  mealPreference,
  avoidIngredients,
  maxTime,
  kidFriendly,
  mealType,
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
Create one simple but genuinely GOOD ${mealType || "Dinner"} recipe using these ingredients: ${ingredients}.

The recipe must make ${servings || 4} servings.

${kidFriendly ? "The recipe should be kid-friendly and appeal to children." : ""}

${
  maxTime !== "No Preference"
    ? `The recipe must realistically take ${maxTime} from start to finish, including prep time. Do not exceed this limit.`
    : ""
}

Meal preference: ${mealPreference || "No Preference"}.

Avoid these ingredients: ${avoidIngredients || "None"}.

Maximum cook time: ${maxTime || "No Preference"}.

Kid friendly: ${kidFriendly ? "Yes" : "No"}.

What sounds good tonight: ${
  Array.isArray(dinnerMoods) && dinnerMoods.length > 0
    ? dinnerMoods.join(", ")
    : "No specific preference"
}.

Additional dinner direction from the user: ${
  dinnerIntent?.trim() || "None"
}.

IMPORTANT DINNER INTENT:
- The user's "What sounds good tonight" selections and additional dinner direction describe the kind of meal they actually want to eat tonight.
- When provided, treat these as strong recipe-selection signals, not casual suggestions.
- Choose the flavor profile, sauce, seasoning, texture, and cooking method to fit the user's stated direction as closely as practical.
- If the user asks for something saucy, rich, spicy, comforting, light, baked, grilled, crispy, creamy, or similar, the finished recipe should clearly deliver that quality.
- Do not default to generic lemon-herb, garlic-herb, or simply seasoned preparations when the user's dinner direction points toward a different flavor experience.
- The user's additional written direction should take priority over the quick-choice selections if there is any conflict.
- Still respect all avoid ingredients, allergies, time limits, serving size, and other explicit restrictions.

The recipe MUST be based primarily on the user's ingredients on hand.

Do not introduce a different main protein, starch, or main vegetable unless the user did not provide enough ingredients to make a realistic recipe.

If extra ingredients are needed, keep them to common pantry staples or clearly label them as optional.

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
  "servings": 4,
"prepTime": "10 minutes",
"cookTime": "30 minutes",
"totalTime": "40 minutes",
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
    "instruction": "Preheat the oven to 425°F. Line a baking sheet with parchment paper or lightly grease it."
  },
  {
    "title": "Prepare the vegetables",
    "instruction": "Cut the vegetables as directed and season them with the specified amounts of oil and seasonings."
  },
  {
    "title": "Start roasting",
    "instruction": "Roast the vegetables for 15 minutes, then add the seasoned protein to the baking sheet."
  },
  {
    "title": "Finish cooking",
    "instruction": "Continue roasting until the protein reaches a safe internal temperature and the vegetables are tender."
  },
  {
    "title": "Rest and serve",
    "instruction": "Remove from the oven, let the protein rest briefly, and serve."
  }
]
}

For steps:
- Write clear, sequential instructions for a normal home cook.
- Use 5–8 steps when appropriate rather than combining too many actions into one step.
- Include specific temperatures, cooking times, heat levels, and visual doneness cues when relevant.
- Refer to ingredient quantities when helpful so the user does not have to constantly look back at the ingredient list.
- Coordinate steps efficiently when parts of the meal can cook at the same time.
- Include safe internal temperatures for meat, poultry, and fish when appropriate.
- Do not assume advanced cooking knowledge.
- Keep each step concise enough to read easily while actively cooking.

The servings value must equal ${servings || 4}.
The prepTime, cookTime, and totalTime must reflect realistic times for this specific recipe.
The totalTime should approximately equal prepTime plus cookTime and must stay within the user's requested time limit when one is provided.

For ingredients:
- Write each ingredient as a clean, natural shopping/cooking list item.
- Begin each ingredient with the quantity and unit, followed by the ingredient name.
- Put preparation details after the ingredient name, separated naturally with a comma or parentheses.
- Use familiar U.S. kitchen measurements such as cups, tablespoons, teaspoons, ounces, pounds, or whole items.
- Be consistent with unit wording throughout the ingredient list.
- Include useful size or count information when it helps the cook, such as "2 salmon fillets (6 oz each)".
- Avoid unnecessary words or database-style descriptions in the user-facing ingredient list.
- Every ingredient referenced in the cooking instructions must appear in the ingredient list.
- Do not introduce ingredients in the instructions that are missing from the ingredient list.
- List every ingredient needed to make the recipe.
- Do not include optional ingredients, optional garnishes, or "if desired" ingredients.
- Every ingredient listed should be treated as part of the recipe.
- Use realistic, balanced ingredient quantities for the selected number of servings.
- Consider the role each ingredient plays in the finished meal. When a calorie-dense ingredient such as meat, cheese, oil, cream, butter, or sauce is one component of a multi-component dish, use only the amount reasonably needed for that dish rather than automatically assigning a full standalone portion per person.
- Ingredients the user lists as being on hand are available ingredients, not quantities that must all be used. Do not unnecessarily increase portions simply to use all of an ingredient.
- Do not make a recipe low-calorie by default. Prioritize sensible portions and the user's selected dinner preferences, moods, and directions.
- Use clear, natural U.S. kitchen measurements and include helpful preparation notes such as chopped, minced, peeled, or cut into pieces.

For ingredientData:
- Include every ingredient that contributes meaningful calories or nutrients.
- Use a numeric amount.
- Include the best practical gram equivalent for the TOTAL amount used in the recipe.
- Keep the ingredient name clean, specific, and easily searchable in a nutrition database.
- Include nutritionally meaningful details when they are known from the recipe, such as raw vs cooked, dry vs cooked, skinless vs skin-on, lean percentage for ground meat, or fat percentage/type for dairy.
- The ingredientData name must accurately reflect the ingredient shown to the user. Do not invent a more specific variety, fat level, lean percentage, preparation state, or other characteristic unless the recipe itself specifies it.
- When a nutritionally meaningful distinction matters, make the user-facing ingredient specific enough to support an accurate nutrition match. For example, prefer "1 lb 90% lean ground beef" over an unspecified "1 lb ground beef" when ground beef is used.
- Put preparation notes outside the ingredient name whenever possible.
- Use consistent units such as lb, oz, cup, tbsp, tsp, or item.
- Do not combine multiple ingredients into one entry.
- Do not include optional garnishes unless they are included in the nutrition estimate.
- The "grams" value should represent the TOTAL ingredient used in the recipe, not one serving.
- The ingredientData name and grams must represent the SAME physical state of the ingredient.
- For packaged dry mixes such as boxed macaroni and cheese, cake mix, rice mixes, or similar products, use the dry/unprepared product name when the grams represent the package contents. Do not label a dry package weight as "prepared."
- If an ingredient is represented as prepared/cooked in ingredientData, the grams must represent the total prepared/cooked weight, not the dry package weight.
- For branded packaged foods, preserve the brand/product identity when known and use the package's dry or unprepared state unless the recipe explicitly provides the total prepared weight.

For steps:
- Return each step as an object with:
  - "title": a short, action-oriented heading
  - "instruction": the detailed cooking instruction
- Keep each title brief and easy to scan, such as "Preheat the oven", "Start the potatoes", or "Cook the chicken".
- Write clear, sequential instructions for a normal home cook.
- Use 5–8 steps when appropriate rather than combining too many actions into one step.
- Include specific temperatures, cooking times, heat levels, and visual doneness cues when relevant.
- Refer to ingredient quantities when helpful so the user does not have to constantly look back at the ingredient list.
- Coordinate steps efficiently when parts of the meal can cook at the same time.
- Include safe internal temperatures for meat, poultry, and fish when appropriate.
- Do not assume advanced cooking knowledge.
- Keep each step concise enough to read easily while actively cooking.
- Keep step titles to about 2–5 words whenever possible. Avoid repeating ingredient names unnecessarily when the context is already clear.

Make the instructions detailed enough for a normal home cook to follow.
No markdown. No extra text.

Use U.S. kitchen measurements whenever possible. Prefer cups, tablespoons, teaspoons, ounces, pounds, and common item counts instead of grams or milliliters. For example, use "1 lb chicken breast" instead of "450g chicken breast."

      `,
    });

    const recipe = JSON.parse(response.output_text);

console.log("INGREDIENT DATA:", recipe.ingredientData);   

const nutrition = await calculateRecipeNutrition(
  recipe.ingredientData,
  recipe.servings
);

console.log("NUTRITION MATCHES:", nutrition.matchedIngredients);

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
    console.error(error);

    return NextResponse.json(
      { error: "Something went wrong generating the recipe." },
      { status: 500 }
    );
  }
}