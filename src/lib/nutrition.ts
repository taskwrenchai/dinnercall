type IngredientData = {
  name: string;
  amount: number;
  unit: string;
  grams: number;
};

type FoodNutrient = {
  nutrientId?: number;
  nutrientName?: string;
  value?: number;
  unitName?: string;
  amount?: number;
  nutrient?: {
    id?: number;
    name?: string;
    unitName?: string;
  };
};

type UsdaFood = {
  fdcId?: number;
  description?: string;
  dataType?: string;
  foodNutrients?: FoodNutrient[];
};

type UsdaSearchResponse = {
  foods?: UsdaFood[];
};

export type IngredientNutritionResult = {
  ingredient: IngredientData;
  matchedFood: {
    fdcId: number | null;
    description: string;
    dataType: string;
  };
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
};

export type RecipeNutritionResult = {
  servings: number;

  totalNutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };

  perServing: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };

  matchedIngredients: IngredientNutritionResult[];

  unmatchedIngredients: {
    ingredient: IngredientData;
    reason: string;
  }[];
};

function findNutrient(
  nutrients: FoodNutrient[],
  possibleNames: string[]
): number {
  const match = nutrients.find((nutrient) => {
    const name = (
      nutrient.nutrientName ??
      nutrient.nutrient?.name ??
      ""
    ).toLowerCase();

    const hasValue =
  typeof nutrient.value === "number" ||
  typeof nutrient.amount === "number";

return (
  hasValue &&
  possibleNames.some((possibleName) =>
    name.includes(possibleName.toLowerCase())
  )
);
  });

  return match?.value ?? match?.amount ?? 0;
}

function hasUsableMacros(nutrients: FoodNutrient[]): boolean {
  const protein = findNutrient(nutrients, ["protein"]);

  const carbs = findNutrient(nutrients, [
    "carbohydrate, by difference",
    "carbohydrate",
  ]);

  const fat = findNutrient(nutrients, [
    "total lipid (fat)",
    "total fat",
  ]);

  return protein > 0 || carbs > 0 || fat > 0;
}

function roundToOneDecimal(value: number): number {
  return Math.round(value * 10) / 10;
}

function scoreFoodMatch(
  ingredientName: string,
  foodDescription: string,
  dataType: string
): number {
  const descriptorWords = new Set([
    "raw",
    "cooked",
    "dry",
    "fresh",
    "frozen",
    "skin",
    "skinless",
    "boneless",
    "bone",
    "fillet",
    "drained",
    "chopped",
    "diced",
    "minced",
    "sliced",
    "whole",
    "peeled",
    "deveined",
  ]);

  const ingredientWords = ingredientName
    .toLowerCase()
    .split(/[\s,]+/)
    .filter((word) => word.length > 2);

  const descriptionWords = foodDescription
    .toLowerCase()
    .split(/[\s,]+/)
    .filter((word) => word.length > 2);

    const description = foodDescription.toLowerCase();

const identityChangingWords = [
  "leaves",
  "leaf",
  "greens",
  "shoots",
  "stems",
  "seeds",
  "juice",
  "almond",
  "peanut",
  "cashew",
  "sunflower",
];

const ingredientLower = ingredientName.toLowerCase();

if (
  ingredientLower.includes("dry") &&
  description.includes("prepared")
) {
  return -100;
}

if (
  ingredientLower.includes("raw") &&
  description.includes("cooked")
) {
  return -100;
}

if (
  ingredientLower.includes("cooked") &&
  description.includes("raw")
) {
  return -100;
}

for (const word of identityChangingWords) {
  if (
    description.includes(word) &&
    !ingredientName.toLowerCase().includes(word)
  ) {
    return -100;
  }
}

  const coreWords = ingredientWords.filter(
    (word) => !descriptorWords.has(word)
  );

  const descriptorMatches = ingredientWords.filter(
    (word) =>
      descriptorWords.has(word) &&
      descriptionWords.includes(word)
  );

  const coreMatches = coreWords.filter((word) =>
    descriptionWords.includes(word)
  );

  // A preparation word such as "raw" or "skin" is never enough
  // to establish that this is the correct food.
  if (coreMatches.length === 0) {
    return -100;
  }

  let score = 0;

  // Food identity matters much more than preparation details.
  score += coreMatches.length * 5;

  // Preparation/state words are useful only as refinements.
  score += descriptorMatches.length;

  if (dataType === "Foundation") {
    score += 3;
  }

  if (dataType === "SR Legacy") {
    score += 2;
  }

  return score;
}

function getCoreSearchTerm(ingredientName: string): string {
  const descriptorWords = new Set([
    "raw",
    "cooked",
    "dry",
    "fresh",
    "frozen",
    "skin",
    "skinless",
    "boneless",
    "bone",
    "fillet",
    "drained",
    "chopped",
    "diced",
    "minced",
    "sliced",
    "whole",
    "on",
  ]);

  return ingredientName
    .toLowerCase()
    .split(/[\s,]+/)
    .filter(
      (word) =>
        word.length > 2 &&
        !descriptorWords.has(word)
    )
    .join(" ");
}

async function searchUsdaFoods(
  query: string,
  apiKey: string
): Promise<UsdaFood[]> {
  const response = await fetch(
    `https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
        pageSize: 20,
        dataType: ["Foundation", "SR Legacy"],
      }),
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.error(
      "USDA FoodData Central error:",
      response.status,
      errorText
    );

    throw new Error(
      `USDA request failed with status ${response.status}.`
    );
  }

  const data = (await response.json()) as UsdaSearchResponse;

  return data.foods ?? [];
}

async function getUsdaFoodById(
  fdcId: number,
  apiKey: string
): Promise<UsdaFood> {
  const response = await fetch(
    `https://api.nal.usda.gov/fdc/v1/food/${fdcId}?api_key=${apiKey}`,
    {
      method: "GET",
      cache: "no-store",
    }
  );

  if (!response.ok) {
    const errorText = await response.text();

    console.error(
      "USDA FoodData Central detail error:",
      response.status,
      errorText
    );

    throw new Error(
      `USDA food detail request failed with status ${response.status}.`
    );
  }

  return (await response.json()) as UsdaFood;
}

export async function calculateIngredientNutrition(
  ingredient: IngredientData
): Promise<IngredientNutritionResult> {
  const apiKey = process.env.USDA_API_KEY;

  if (!apiKey) {
    throw new Error("USDA_API_KEY is missing.");
  }

  if (!ingredient.name.trim()) {
    throw new Error("Ingredient name is required.");
  }

  if (!Number.isFinite(ingredient.grams) || ingredient.grams <= 0) {
    throw new Error(
      `A valid gram amount is required for ${ingredient.name}.`
    );
  }

  let foods = await searchUsdaFoods(
  ingredient.name,
  apiKey
);

let scoredFoods = foods
  .map((food) => ({
    food,
    score: scoreFoodMatch(
      ingredient.name,
      food.description ?? "",
      food.dataType ?? ""
    ),
  }))
  .sort((a, b) => b.score - a.score);


let bestMatch = scoredFoods[0];

if (!bestMatch || bestMatch.score < 2) {
  const coreSearchTerm = getCoreSearchTerm(
    ingredient.name
  );

  if (
    coreSearchTerm &&
    coreSearchTerm !== ingredient.name.toLowerCase()
  ) {
    foods = await searchUsdaFoods(
      coreSearchTerm,
      apiKey
    );

    scoredFoods = foods
      .map((food) => ({
        food,
        score: scoreFoodMatch(
          coreSearchTerm,
          food.description ?? "",
          food.dataType ?? ""
        ),
      }))
      .sort((a, b) => b.score - a.score);

    bestMatch = scoredFoods[0];
  }
}

if (!bestMatch || bestMatch.score < 2) {
  throw new Error(
    `No reliable USDA match found for ${ingredient.name}.`
  );
}

let food = bestMatch.food;
let fullFood = food;
let nutrients: FoodNutrient[] = [];

for (const candidate of scoredFoods) {
  if (candidate.score < 2) {
    break;
  }

  const candidateFood = candidate.food;

  const candidateFullFood =
    candidateFood.fdcId != null
      ? await getUsdaFoodById(candidateFood.fdcId, apiKey)
      : candidateFood;

  const candidateNutrients =
    candidateFullFood.foodNutrients ?? [];

  if (hasUsableMacros(candidateNutrients)) {
    food = candidateFood;
    fullFood = candidateFullFood;
    nutrients = candidateNutrients;
    break;
  }
}

if (!hasUsableMacros(nutrients)) {
  throw new Error(
    `No USDA match with usable nutrition data found for ${ingredient.name}.`
  );
}

  const proteinPer100g = findNutrient(nutrients, ["protein"]);

  const carbsPer100g = findNutrient(nutrients, [
    "carbohydrate, by difference",
    "carbohydrate",
  ]);

  const fatPer100g = findNutrient(nutrients, [
    "total lipid (fat)",
    "total fat",
  ]);

  const calorieNutrient = nutrients.find((nutrient) => {
  const name = (
    nutrient.nutrientName ??
    nutrient.nutrient?.name ??
    ""
  ).toLowerCase();

  const unit = (
    nutrient.unitName ??
    nutrient.nutrient?.unitName ??
    ""
  ).toLowerCase();

  return name.includes("energy") && unit === "kcal";
});

const listedCaloriesPer100g =
  calorieNutrient?.value ??
  calorieNutrient?.amount ??
  0;

  const calculatedCaloriesPer100g =
    proteinPer100g * 4 +
    carbsPer100g * 4 +
    fatPer100g * 9;

  const caloriesPer100g =
    listedCaloriesPer100g > 0
      ? listedCaloriesPer100g
      : calculatedCaloriesPer100g;

  const multiplier = ingredient.grams / 100;

  if (ingredient.name.toLowerCase().includes("shrimp")) {
  console.log("SHRIMP USDA CHECK:", {
    ingredient,
    matchedFood: {
      fdcId: fullFood.fdcId ?? food.fdcId ?? null,
      description: fullFood.description ?? food.description ?? "Unknown",
      dataType: fullFood.dataType ?? food.dataType ?? "Unknown",
    },
    proteinPer100g,
    carbsPer100g,
    fatPer100g,
    listedCaloriesPer100g,
    caloriesPer100g,
  });
}

  return {
    ingredient,
    matchedFood: {
  fdcId: fullFood.fdcId ?? food.fdcId ?? null,
  description:
    fullFood.description ??
    food.description ??
    "Unknown USDA food",
  dataType:
    fullFood.dataType ??
    food.dataType ??
    "Unknown",
},
    nutrition: {
      calories: Math.round(caloriesPer100g * multiplier),
      protein: roundToOneDecimal(proteinPer100g * multiplier),
      carbs: roundToOneDecimal(carbsPer100g * multiplier),
      fat: roundToOneDecimal(fatPer100g * multiplier),
    },
  };
}
export async function calculateRecipeNutrition(
  ingredients: IngredientData[],
  servings: number
): Promise<RecipeNutritionResult> {
  if (!Number.isFinite(servings) || servings <= 0) {
    throw new Error("A valid serving count is required.");
  }

  if (!ingredients.length) {
    throw new Error("At least one ingredient is required.");
  }

  const matchedIngredients: IngredientNutritionResult[] = [];

  const unmatchedIngredients: {
    ingredient: IngredientData;
    reason: string;
  }[] = [];

  for (const ingredient of ingredients) {
    try {
      const result = await calculateIngredientNutrition(ingredient);
      matchedIngredients.push(result);
    } catch (error) {
      unmatchedIngredients.push({
        ingredient,
        reason:
          error instanceof Error
            ? error.message
            : "Unknown nutrition error.",
      });
    }
  }

  const totalNutrition = matchedIngredients.reduce(
    (totals, result) => {
      totals.calories += result.nutrition.calories;
      totals.protein += result.nutrition.protein;
      totals.carbs += result.nutrition.carbs;
      totals.fat += result.nutrition.fat;

      return totals;
    },
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    }
  );

  totalNutrition.calories = Math.round(totalNutrition.calories);
  totalNutrition.protein = roundToOneDecimal(totalNutrition.protein);
  totalNutrition.carbs = roundToOneDecimal(totalNutrition.carbs);
  totalNutrition.fat = roundToOneDecimal(totalNutrition.fat);

  const perServing = {
    calories: Math.round(totalNutrition.calories / servings),
    protein: roundToOneDecimal(totalNutrition.protein / servings),
    carbs: roundToOneDecimal(totalNutrition.carbs / servings),
    fat: roundToOneDecimal(totalNutrition.fat / servings),
  };

  return {
    servings,
    totalNutrition,
    perServing,
    matchedIngredients,
    unmatchedIngredients,
  };
}