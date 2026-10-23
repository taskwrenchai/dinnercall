"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

type Recipe = {
  name: string;
  why: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  nutritionVerified?: boolean;
  adjustmentNote?: string;
  ingredients: string[];
  steps: (
  | string
  | {
      title: string;
      instruction: string;
    }
)[];
};

const loadingMessages = [
  "🥕 Chopping vegetables...",
  "🧂 Checking the pantry...",
  "🍳 Heating the skillet...",
  "🍽️ Calling dinner...",
];

export default function Home() {

const router = useRouter();

const handleSignOut = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    alert("Unable to sign out. Please try again.");
    return;
  }

  router.replace("/login");
  router.refresh();
};

const submitFeedback = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!feedbackMessage.trim()) return;

  setFeedbackSending(true);
  setFeedbackStatus("");

  try {
    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setFeedbackStatus("Please sign in to send feedback.");
      return;
    }

    const { error: feedbackError } = await supabase
      .from("feedback")
      .insert({
  user_id: user.id,
  feedback_type: "general",
  category: feedbackType,
  message: feedbackMessage.trim(),
});

    if (feedbackError) {
      console.error("Feedback submission failed:", feedbackError);
      setFeedbackStatus("Couldn't send feedback. Please try again.");
      return;
    }

    setFeedbackMessage("");
    setFeedbackType("suggestion");
    setFeedbackStatus("Thank you! Your feedback has been sent.");
  } catch (error) {
    console.error("Feedback submission failed:", error);
    setFeedbackStatus("Couldn't send feedback. Please try again.");
  } finally {
    setFeedbackSending(false);
  }
};

  const [ingredients, setIngredients] = useState("");
  const [dinnerMoods, setDinnerMoods] = useState<string[]>([]);
  const [dinnerIntent, setDinnerIntent] = useState("");
  const [weeklyIngredients, setWeeklyIngredients] = useState("");
  const [avoidIngredients, setAvoidIngredients] = useState("");
  const [servings, setServings] = useState("4");
  const [mealType, setMealType] = useState("Dinner");
  const [mealPreference, setMealPreference] = useState("No Preference");
  const [maxTime, setMaxTime] = useState("No Preference");
  const [kidFriendly, setKidFriendly] = useState(false);
  const [saved, setSaved] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [weeklyPlan, setWeeklyPlan] = useState<string[]>([]);
  const [savedWeeklyPlans, setSavedWeeklyPlans] = useState<string[][]>([]);
  const [showSavedWeeklyPlans, setShowSavedWeeklyPlans] = useState(false);
  useEffect(() => {
  if (showSavedWeeklyPlans) {
    document
      .getElementById("my-weekly-plans")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  }
}, [showSavedWeeklyPlans]);

  const [error, setError] = useState("");
  const [feedbackType, setFeedbackType] = useState("suggestion");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackSending, setFeedbackSending] = useState(false);
  const [feedbackStatus, setFeedbackStatus] = useState("");
  const [weeklyPlanError, setWeeklyPlanError] = useState("");
  const [loading, setLoading] = useState(false);
  const [planningWeek, setPlanningWeek] = useState(false);
  const [cookingMeal, setCookingMeal] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [weeklyPlanCopied, setWeeklyPlanCopied] = useState(false);
  const [weeklyPlanSaved, setWeeklyPlanSaved] = useState(false);
  const [showWeeklySettingsInfo, setShowWeeklySettingsInfo] = useState(false);
  const [adjustmentRequest, setAdjustmentRequest] = useState("");
  const [adjusting, setAdjusting] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [weeklyAdjustmentRequest, setWeeklyAdjustmentRequest] = useState("");
  const [adjustingWeeklyPlan, setAdjustingWeeklyPlan] = useState(false);
  const [weeklyAdjustmentNote, setWeeklyAdjustmentNote] = useState("");
  const [groceryList, setGroceryList] = useState<any>(null);
  const [isGeneratingGroceryList, setIsGeneratingGroceryList] = useState(false);
  const [hasLoadedSavedData, setHasLoadedSavedData] = useState(false);
  const [groceryCopied, setGroceryCopied] = useState(false);
  const [excludePantryStaples, setExcludePantryStaples] = useState(true);

  const recipeRef = useRef<HTMLDivElement>(null);
  const weeklyPlanRef = useRef<HTMLDivElement>(null);
  const groceryListRef = useRef<HTMLDivElement>(null);
  const ingredientsRef = useRef<HTMLTextAreaElement>(null);

useEffect(() => {
  const textarea = ingredientsRef.current;

  if (!textarea) return;

  textarea.style.height = "auto";

  const newHeight = Math.min(textarea.scrollHeight, 128);

  textarea.style.height = `${Math.max(newHeight, 60)}px`;
  textarea.style.overflowY =
    textarea.scrollHeight > 128 ? "auto" : "hidden";
}, [ingredients]);

  useEffect(() => {

  

    const savedPreferences = localStorage.getItem("dinnercall_preferences");
    if (savedPreferences) {
      const preferences = JSON.parse(savedPreferences);

      if (preferences.ingredients) setIngredients(preferences.ingredients);
      if (preferences.servings) setServings(preferences.servings);
      if (preferences.mealType) setMealType(preferences.mealType);
      if (preferences.mealPreference) setMealPreference(preferences.mealPreference);
      if (preferences.maxTime) setMaxTime(preferences.maxTime);
      if (preferences.avoidIngredients) setAvoidIngredients(preferences.avoidIngredients);
      
     if (typeof preferences.kidFriendly === "boolean") {
  setKidFriendly(preferences.kidFriendly);
}

if (typeof preferences.excludePantryStaples === "boolean") {
  setExcludePantryStaples(preferences.excludePantryStaples);
}

    }
  }, []);
  
  useEffect(() => {
    const preferences = {
    ingredients,  
    servings,
    mealType,
    mealPreference,
    maxTime,
    avoidIngredients,
    kidFriendly,
    excludePantryStaples,
};
    
    localStorage.setItem("dinnercall_preferences", JSON.stringify(preferences));
  }, 
  [ingredients, 
  servings,
  mealType,
  mealPreference,
  maxTime,
  avoidIngredients,
  kidFriendly,
  excludePantryStaples,]);

useEffect(() => {
  const savedWeeklyPlan = localStorage.getItem("dinnercall-current-weekly-plan");
  const savedGroceryList = localStorage.getItem("dinnercall-current-grocery-list");

  if (savedWeeklyPlan) {
    setWeeklyPlan(JSON.parse(savedWeeklyPlan));
  }

  if (savedGroceryList) {
    setGroceryList(JSON.parse(savedGroceryList));
  }

  setHasLoadedSavedData(true);
}, []);

useEffect(() => {
  if (!hasLoadedSavedData) return;

  if (weeklyPlan && weeklyPlan.length > 0) {
    localStorage.setItem(
      "dinnercall-current-weekly-plan",
      JSON.stringify(weeklyPlan)
    );
  }
}, [weeklyPlan, hasLoadedSavedData]);

useEffect(() => {
  if (!hasLoadedSavedData) return;

  if (groceryList) {
    localStorage.setItem(
      "dinnercall-current-grocery-list",
      JSON.stringify(groceryList)
    );
  }
}, [groceryList, hasLoadedSavedData]);
  
  useEffect(() => {
    if (!loading) {
      setLoadingMessageIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setLoadingMessageIndex((currentIndex) =>
        currentIndex === loadingMessages.length - 1 ? 0 : currentIndex + 1
      );
    }, 1400);

    return () => clearInterval(interval);
  }, [loading]);

  const getRecipeText = () => {
    if (!recipe) return "";

    return `${recipe.name}

Calories: ${recipe.calories}
Protein: ${recipe.protein}
Carbs: ${recipe.carbs}
Fat: ${recipe.fat}

Why this works:
${recipe.why}

Ingredients:
${recipe.ingredients.map((item) => `- ${item}`).join("\n")}

Instructions:
${recipe.steps
  .map((step, index) =>
    typeof step === "string"
      ? `${index + 1}. ${step}`
      : `${index + 1}. ${step.title}\n${step.instruction}`
  )
  .join("\n\n")}`;
  };

  const getWeeklyPlanText = () => {
  if (weeklyPlan.length === 0) return "";

  return `DinnerCall Weekly Plan

${weeklyPlan
  .map(
    (meal, index) =>
      `${["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][index]}: ${meal}`
  )
  .join("\n")}`;
};

useEffect(() => {
  const loadSavedRecipes = async () => {
    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setSavedRecipes([]);
      return;
    }

    const { data, error } = await supabase
      .from("saved_recipes")
      .select("recipe_data")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading saved recipes:", error);
      return;
    }

    setSavedRecipes(
      (data ?? []).map((row) => row.recipe_data as Recipe)
    );
  };

  void loadSavedRecipes();
}, []); 

const saveRecipe = async () => {
  if (!recipe) return;

  const alreadySaved = savedRecipes.some(
    (savedRecipe) => savedRecipe.name === recipe.name
  );

  if (alreadySaved) {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    return;
  }

  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    setError("Please sign in to save your recipe.");
    return;
  }

  const { error: saveError } = await supabase
    .from("saved_recipes")
    .insert({
      user_id: user.id,
      recipe_data: recipe,
    });

  if (saveError) {
    console.error("Error saving recipe:", saveError);
    setError("Couldn't save your recipe. Please try again.");
    return;
  }

  const updated = [recipe, ...savedRecipes];
  setSavedRecipes(updated);

  setSaved(true);
  setTimeout(() => setSaved(false), 2000);
};

const adjustWeeklyPlan = async () => {
  if (weeklyPlan.length === 0 || !weeklyAdjustmentRequest.trim()) return;

  setAdjustingWeeklyPlan(true);
  setError("");

  try {
    const res = await fetch("/api/adjust-weekly-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      weeklyPlan,
      adjustmentRequest: weeklyAdjustmentRequest,
      ingredients: weeklyIngredients,
      servings,
      mealPreference,
      avoidIngredients,
      maxTime,
      kidFriendly,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
    } else {

      setWeeklyPlan(data.meals);

localStorage.setItem(
  "dinnercall-current-weekly-plan",
  JSON.stringify(data.meals || [])
);
      setWeeklyAdjustmentRequest("");
      setWeeklyAdjustmentNote("Updated your weekly plan.");

      setTimeout(() => {
  weeklyPlanRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}, 300);
    }
  } catch {
    setError("Something went wrong.");
  } finally {
    setAdjustingWeeklyPlan(false);
  }
};

async function generateGroceryList() {
  if (!weeklyPlan) return;

  setIsGeneratingGroceryList(true);

  try {
    const response = await fetch("/api/grocery-list", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ weeklyPlan, excludePantryStaples, }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to generate grocery list.");
    }

    setGroceryList(data.groceryList);

    if (data.groceryList) {
  void (async () => {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error: trackingError } = await supabase
      .from("usage_events")
      .insert({
        user_id: user.id,
        event_type: "grocery_list_generated",
      });

    if (trackingError) {
      console.warn(
        "Grocery list usage tracking failed:",
        trackingError.message
      );
    }
  })();
}

    setTimeout(() => {
  groceryListRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}, 300);

  } catch (error) {
    console.error(error);
    alert("Sorry, DinnerCall could not generate the grocery list.");
  } finally {
    setIsGeneratingGroceryList(false);
  }
}

const copyGroceryList = async () => {
  if (!groceryList) return;

  const groceryText = groceryList.categories
    .filter((category: any) => category.items.length > 0)
    .map((category: any) => {
      const items = category.items
        .map((item: any) => {
          const checkmark = item.checked ? "☑" : "☐";
          return `${checkmark} ${item.quantity} ${item.name}`;
        })
        .join("\n");

      return `${category.name.toUpperCase()}\n${items}`;
    })
    .join("\n\n");

  await navigator.clipboard.writeText(groceryText);

  setGroceryCopied(true);
  setTimeout(() => setGroceryCopied(false), 2000);
};

const clearWeek = () => {
  const confirmed = window.confirm(
    "Clear your current weekly plan and grocery list?"
  );

  if (!confirmed) return;

  setWeeklyPlan([]);
  setGroceryList(null);

  localStorage.removeItem("dinnercall-current-weekly-plan");
  localStorage.removeItem("dinnercall-current-grocery-list");
};

const deleteSavedRecipe = async (indexToDelete: number) => {
  const recipeToDelete = savedRecipes[indexToDelete];
  if (!recipeToDelete) return;

  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    setError("Please sign in to delete a saved recipe.");
    return;
  }

  const { data: matchingRecipes, error: lookupError } = await supabase
    .from("saved_recipes")
    .select("id")
    .eq("user_id", user.id)
    .eq("recipe_data->>name", recipeToDelete.name)
    .order("created_at", { ascending: false })
    .limit(1);

  if (lookupError || !matchingRecipes?.length) {
    setError("Couldn't find the saved recipe. Please try again.");
    return;
  }

  const { error: deleteError } = await supabase
    .from("saved_recipes")
    .delete()
    .eq("id", matchingRecipes[0].id)
    .eq("user_id", user.id);

  if (deleteError) {
    console.error("Error deleting saved recipe:", deleteError);
    setError("Couldn't delete your recipe. Please try again.");
    return;
  }

  setSavedRecipes((current) =>
    current.filter((_, index) => index !== indexToDelete)
  );
};

  const copyRecipe = async () => {
    if (!recipe) return;

    await navigator.clipboard.writeText(getRecipeText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadRecipe = () => {
    if (!recipe) return;

    const blob = new Blob([getRecipeText()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${recipe.name.replaceAll(" ", "-").toLowerCase()}.txt`;
    link.click();

    URL.revokeObjectURL(url);
  };

  const shareRecipe = async () => {
    if (!recipe) return;

    const recipeText = getRecipeText();

    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.name,
          text: recipeText,
        });
      } catch {
        // User canceled share.
      }
    } else {
      await navigator.clipboard.writeText(recipeText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const clearRecipe = () => {
    setRecipe(null);
    setError("");
    setCopied(false);
    setAdjustmentRequest("");
  };

  const copyWeeklyPlan = async () => {
  if (weeklyPlan.length === 0) return;

  try {
    await navigator.clipboard.writeText(getWeeklyPlanText());
    setWeeklyPlanCopied(true);
    setTimeout(() => setWeeklyPlanCopied(false), 2000);
  } catch {
    setError("DinnerCall could not copy the weekly plan.");
  }
};

  const adjustRecipe = async () => {
    if (!recipe || !adjustmentRequest.trim()) return;

    setAdjusting(true);
    setError("");

    try {
      const res = await fetch("/api/adjust-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipe,
          adjustmentRequest,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setRecipe(data.recipe);
        setAdjustmentRequest("");

        setTimeout(() => {
          recipeRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 300);
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setAdjusting(false);
    }
  };


  useEffect(() => {
  const loadSavedWeeklyPlans = async () => {
    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setSavedWeeklyPlans([]);
      return;
    }

    const { data, error } = await supabase
      .from("saved_weekly_plans")
      .select("plan_data")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading saved weekly plans:", error);
      return;
    }

    setSavedWeeklyPlans(
      (data ?? []).map((row) => row.plan_data)
    );
  };

  void loadSavedWeeklyPlans();
}, []);

const deleteSavedWeeklyPlan = async (indexToDelete: number) => {
  const planToDelete = savedWeeklyPlans[indexToDelete];
  if (!planToDelete) return;

  const confirmed = window.confirm(
    "Are you sure you want to permanently delete this saved weekly plan?"
  );

  if (!confirmed) return;

  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    setError("Please sign in to delete a saved weekly plan.");
    return;
  }

  const { data: matchingPlans, error: lookupError } = await supabase
    .from("saved_weekly_plans")
    .select("id, plan_data")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (lookupError) {
    console.error("Error finding saved weekly plan:", lookupError);
    setError("Couldn't find your saved weekly plan.");
    return;
  }

  const matchingPlan = matchingPlans?.find(
    (row) => JSON.stringify(row.plan_data) === JSON.stringify(planToDelete)
  );

  if (!matchingPlan) {
    setError("Couldn't find your saved weekly plan.");
    return;
  }

  const { error: deleteError } = await supabase
    .from("saved_weekly_plans")
    .delete()
    .eq("id", matchingPlan.id)
    .eq("user_id", user.id);

  if (deleteError) {
    console.error("Error deleting saved weekly plan:", deleteError);
    setError("Couldn't delete your weekly plan. Please try again.");
    return;
  }

  setSavedWeeklyPlans((current) =>
    current.filter((_, index) => index !== indexToDelete)
  );
};

  const saveWeeklyPlan = async () => {
  if (weeklyPlan.length === 0) return;

  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    setError("Please sign in to save your weekly plan.");
    return;
  }

  const { error: saveError } = await supabase
    .from("saved_weekly_plans")
    .insert({
      user_id: user.id,
      plan_data: weeklyPlan,
    });

  if (saveError) {
    console.error("Error saving weekly plan:", saveError);
    setError("Couldn't save your weekly plan. Please try again.");
    return;
  }

  const updated = [weeklyPlan, ...savedWeeklyPlans];
  setSavedWeeklyPlans(updated);

  setWeeklyPlanSaved(true);
  setTimeout(() => setWeeklyPlanSaved(false), 2000);
};

  const planMyWeek = async () => {
   if (!weeklyIngredients.trim()) {
  setWeeklyPlanError(
    "Enter at least one protein or main ingredient for this week."
  );
  return;
}

    setWeeklyPlanError("");
    setPlanningWeek(true);
    setError("");
    setWeeklyPlan([]);
    setWeeklyAdjustmentNote("");
    setRecipe(null);

    try {
      const res = await fetch("/api/weekly-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: weeklyIngredients,
          servings,
          mealPreference,
          avoidIngredients,
          maxTime,
          kidFriendly,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");

      } else {
  setWeeklyPlan(data.meals || []);

  if (Array.isArray(data.meals) && data.meals.length > 0) {
  void (async () => {
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error: trackingError } = await supabase
      .from("usage_events")
      .insert({
        user_id: user.id,
        event_type: "weekly_plan_generated",
      });

    if (trackingError) {
      console.warn("Weekly plan usage tracking failed:", trackingError.message);
    }
  })();
}

  localStorage.setItem(
    "dinnercall-current-weekly-plan",
    JSON.stringify(data.meals || [])
  );

  setTimeout(() => {
    weeklyPlanRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 300);
}

    } catch {
      setError("Something went wrong.");
    } finally {
      setPlanningWeek(false);
    }
  };

  const cookThis = async (meal: string) => {
  setCookingMeal(meal);
  setError("");
  setRecipe(null);

  try {
    const res = await fetch("/api/weekly-recipe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        meal,
        weeklyIngredients,
        servings,
        mealPreference,
        avoidIngredients,
        maxTime,
        kidFriendly,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Something went wrong.");
      return;
    }

    setRecipe(data.recipe);

    setTimeout(() => {
      recipeRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 300);

  } catch {
    setError("Something went wrong.");
  } finally {
  setCookingMeal(null);
}
};

  const handleClick = async () => {
  

    setError("");
    setLoading(true);
    setRecipe(null);
    setWeeklyPlan([]);
    setCopied(false);

    try {
      const res = await fetch("/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients,
          dinnerMoods,
          dinnerIntent,
          servings,
          mealType,
          mealPreference,
          avoidIngredients,
          maxTime,
          kidFriendly,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setRecipe(data.recipe);

        // Track successful recipe generation
void (async () => {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { error: trackingError } = await supabase
    .from("usage_events")
    .insert({
      user_id: user.id,
      event_type: "recipe_generated",
    });

  if (trackingError) {
    console.error(
  "Recipe usage tracking failed:",
  trackingError.message,
  trackingError.code,
  trackingError.details
);
  }
})();

        setTimeout(() => {
          recipeRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }, 300);
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const recipeBadges = [
    mealType,
    `${servings} servings`,
    mealPreference !== "No Preference" ? mealPreference : null,
    maxTime !== "No Preference" ? maxTime : null,
    kidFriendly ? "Kid Friendly" : null,
  ].filter(Boolean);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#FFFFFF",
        color: "#1F2933",
        fontFamily: "Arial, sans-serif",
        padding: "12px 16px",
      }}
    >
      <section style={{ maxWidth: "720px", margin: "0 auto 28px" }}>
        
        <div style={{ marginBottom: "32px" }}>
          <div style={{ textAlign: "right", marginBottom: "8px" }}>
  
  <button
  type="button"
  onClick={() => {
    document.getElementById("feedback-form")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }}
  style={{
    background: "transparent",
    border: "none",
    color: "#2DA11B",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 600,
    padding: "8px",
    marginRight: "16px",
  }}
>
  Send Feedback
</button>
  
  <button
    type="button"
    onClick={handleSignOut}
    style={{
      background: "transparent",
      border: "none",
      color: "#52616B",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: 600,
      padding: "8px",
    }}
  >
    Sign Out
  </button>
</div>
          <img
            src="/dinnercall-logo.png"
            alt="DinnerCall Logo"
            style={{ width: "320px", marginTop: "8px", marginBottom: "20px", maxWidth: "100%" }}
          />

<div
  style={{
    background: "#F0FAED",
    border: "1px solid #B9E3B1",
    borderRadius: "12px",
    padding: "16px 20px",
    marginBottom: "24px",
    textAlign: "left",
  }}
>
  <div
    style={{
      color: "#248A18",
      fontWeight: 700,
      fontSize: "16px",
      marginBottom: "6px",
    }}
  >
    Premium Preview
  </div>
  <p
    style={{
      margin: 0,
      color: "#374151",
      fontSize: "13.5px",
      lineHeight: "1.6",
    }}
  >
    You&apos;re enjoying complimentary access to all DinnerCall features
    during our launch preview. No payment required.
  </p>
</div>
        
         <h1
  style={{
    fontSize: "clamp(16px, 2vw, 26px)",
    lineHeight: "1.25",
    margin: "0 0 24px",
    fontWeight: 550,
    color: "#52616B",
    maxWidth: "640px",
  }}
>
    Tell us what's in your kitchen. We&apos;ll decide dinner.
</h1>
        </div>

        {error && (
          <div
            style={{
              background: "#FFF4E5",
              border: "1px solid #FFD8A8",
              color: "#8A5A00",
              padding: "12px 16px",
              borderRadius: "12px",
              marginBottom: "16px",
              fontWeight: "bold",
              lineHeight: "1.5",
            }}
          >
            {error}
          </div>
        )}

        <div style={cardStyle}>
          <label style={labelStyle}>Ingredients on hand</label>

          <textarea
  ref={ingredientsRef}
  placeholder="chicken, rice, broccoli..."
  value={ingredients}
  onChange={(e) => setIngredients(e.target.value)}
  rows={1}
  style={{
    ...inputStyle,
    minHeight: "52px",
    maxHeight: "128px",
    resize: "none",
    overflowY: "hidden",
    fontFamily: "inherit",
    lineHeight: "1.5",
  }}
/>

<p
  style={{
    margin: "12px 0 8px",
    color: "#52616B",
    fontSize: "14px",
    fontWeight: 600,
  }}
>
  Need ideas?
</p>
          <div
  style={{
    marginTop: "6px",
    marginBottom: "18px",
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  }}
>
  {[
    "chicken, rice, broccoli",
    "ground beef, tortillas, cheese",
    "salmon, potatoes, asparagus",
  ].map((example) => (
    <button
      key={example}
      type="button"
      onClick={() => setIngredients(example)}
      style={chipStyle}
    >
      {example}
    </button>
  ))}
</div>

<div style={{ marginTop: "20px" }}>
  <label style={labelStyle}>What sounds good tonight?</label>

  <p
    style={{
      margin: "6px 0 12px",
      color: "#6b7280",
      fontSize: "0.9rem",
    }}
  >
    Optional — give DinnerCall a little direction.
  </p>

  <div
    style={{
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
    }}
  >
    {[
      "Comforting",
      "Rich & Savory",
      "Spicy",
      "Light & Fresh",
      "Healthy",
      "Surprise Me",
    ].map((mood) => {
      const selected = dinnerMoods.includes(mood);

      return (
        <button
          key={mood}
          type="button"
          onClick={() =>
            setDinnerMoods((current) =>
              current.includes(mood)
                ? current.filter((item) => item !== mood)
                : [...current, mood]
            )
          }
          style={{
            padding: "10px 14px",
            borderRadius: "999px",
            border: selected
              ? "2px solid #2da11b"
              : "1px solid #d1d5db",
            background: selected ? "#f0faed" : "#ffffff",
            color: "#374151",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {mood}
        </button>
      );
    })}
  </div>
</div>

<div style={{ marginTop: "20px" }}>
  <label style={labelStyle}>Have something in mind?</label>

  <p
    style={{
      margin: "6px 0 10px",
      color: "#6b7280",
      fontSize: "0.9rem",
    }}
  >
    Optional — tell DinnerCall anything else that sounds good.
  </p>

  <textarea
    placeholder="Saucy, baked, a little spicy, no lemon..."
    value={dinnerIntent}
    onChange={(e) => setDinnerIntent(e.target.value)}
    rows={2}
    style={{
      ...inputStyle,
      minHeight: "72px",
      resize: "vertical",
      fontFamily: "inherit",
      lineHeight: "1.5",
    }}
  />
</div>



          <label style={{ ...labelStyle, marginTop: "24px" }}>
          Dislikes / Allergies
         </label>

          <input
            type="text"
            placeholder="mushrooms, olives, peanuts..."
            value={avoidIngredients}
            onChange={(e) => setAvoidIngredients(e.target.value)}
            style={inputStyle}
          />

          <h3
  style={{
    margin: "24px 0 12px",
    fontSize: "1.15rem",
    fontWeight: 700,
  }}
>
  Dinner details
</h3>
          <div          

className="dinner-options"
  style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "0px",
            }}
          >
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="dinner-option-select"
style={selectStyle}
            >
              <option value="Dinner">Dinner</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Snack">Snack</option>
              <option value="Dessert">Dessert</option>
            </select>

            <select
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              className="dinner-option-select"
style={selectStyle}
            >
              <option value="2">2 servings</option>
              <option value="4">4 servings</option>
              <option value="6">6 servings</option>
            </select>

            <select
              value={mealPreference}
              onChange={(e) => setMealPreference(e.target.value)}
              className="dinner-option-select"
style={selectStyle}
            >
              <option value="No Preference">No Preference</option>
              <option value="Comfort Food">Comfort Food</option>
              <option value="Clean Eating">Clean Eating</option>
              <option value="High Protein">High Protein</option>
              <option value="Carnivore">Carnivore</option>
              <option value="Vegetarian">Vegetarian</option>
              <option value="Vegan">Vegan</option>
              <option value="Keto">Keto</option>
              <option value="Paleo">Paleo</option>
              <option value="Whole30">Whole30</option>
            </select>

            <select
              value={maxTime}
              onChange={(e) => setMaxTime(e.target.value)}
              className="dinner-option-select"
style={selectStyle}
            >
              <option value="No Preference">Any Time</option>
              <option value="30 minutes or less">30 min or less</option>
              <option value="45 minutes or less">45 min or less</option>
              <option value="60 minutes or less">60 min or less</option>
            </select>

            <label
              style={{
                ...selectStyle,
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <input
                type="checkbox"
                checked={kidFriendly}
                onChange={(e) => setKidFriendly(e.target.checked)}
                style={{ width: "18px", height: "18px" }}
              />
              Kid Friendly
            </label>

            <button onClick={handleClick} disabled={loading} style={mainButtonStyle}>
              {loading ? loadingMessages[loadingMessageIndex] : "Decide Dinner"}
            </button>
          </div>
        </div>

<div style={cardStyle}>

  <p
    style={{
      margin: "0 0 6px",
      fontWeight: "bold",
      color: "#2DA11B",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      fontSize: "13px",
    }}
  >
    Want to plan ahead?
  </p>

  <div
  style={{
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "8px",
  }}
>
  <h3 style={{ margin: 0, fontSize: "30px" }}>
    Plan your week
  </h3>

  <span
    style={{
      background: "#F0FAED",
      color: "#248A18",
      border: "1px solid #B9E3B1",
      borderRadius: "999px",
      padding: "5px 12px",
      fontSize: "12px",
      fontWeight: 700,
      whiteSpace: "nowrap",
    }}
  >
    Premium Preview
  </span>
</div>

  <p
  style={{
    margin: "0 0 18px",
    color: "#52616B",
    lineHeight: "1.6",
    fontSize: "17px",
    maxWidth: "760px",
  }}
>
  Add the proteins or main ingredients you especially want included.
  DinnerCall will build five varied dinners around them.
</p>

<button
  type="button"
  onClick={() => setShowWeeklySettingsInfo((current) => !current)}
  style={{
    border: "none",
    background: "#F7F6F1",
    color: "#52616B",
    padding: "8px 12px",
    borderRadius: "999px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    marginBottom: "18px",
  }}
>
  ℹ️ What settings are used?
</button>

{showWeeklySettingsInfo && (
  <div
    style={{
      background: "#F7F6F1",
      border: "1px solid #D9DED6",
      borderRadius: "14px",
      padding: "14px 16px",
      marginBottom: "18px",
      color: "#52616B",
      fontSize: "14px",
      lineHeight: "1.5",
    }}
  >
    Weekly plans use your servings, meal preference, cooking time,
    dislikes/allergies, and Kid Friendly settings above
  </div>
)}

<label style={labelStyle}>
  Ingredients for this week
</label>

<textarea
  placeholder="tri tip, chicken breasts, ground beef, pork chops..."
  value={weeklyIngredients}
  onChange={(e) => setWeeklyIngredients(e.target.value)}
  rows={2}
  style={{
    ...inputStyle,
    minHeight: "72px",
    resize: "vertical",
    fontFamily: "inherit",
    lineHeight: "1.5",
    marginBottom: "18px",
  }}
/>

{weeklyPlanError && (
  <p
    style={{
      margin: "-6px 0 16px",
      color: "#B42318",
      fontSize: "14px",
      fontWeight: 600,
    }}
  >
    {weeklyPlanError}
  </p>
)}

<button
  onClick={planMyWeek}
  disabled={planningWeek}
  style={greenButtonStyle}
>
  {planningWeek ? "Planning your week..." : "Plan My Week"}
</button>
</div>

        {weeklyPlan.length > 0 && (
          <section style={cardStyle}>
             <div
      ref={weeklyPlanRef}
      style={{ scrollMarginTop: "24px" }}
    />
            <p style={eyebrowStyle}>This Week&apos;s DinnerCall</p>

            <h2
              style={{
                fontSize: "clamp(30px, 5vw, 46px)",
                marginTop: "40px",
                marginBottom: "24px",
                lineHeight: "1.08",
              }}        
            >

              5 Dinner Ideas
            </h2>

{weeklyAdjustmentNote && (
  <div
    style={{
      background: "#F7F6F1",
      border: "1px solid #D9DED6",
      borderRadius: "14px",
      padding: "12px 16px",
      marginBottom: "20px",
      color: "#52616B",
      fontWeight: "bold",
    }}
  >
    {weeklyAdjustmentNote}
  </div>
)}

 <div
  style={{
    display: "flex",
    flexDirection: "column",
    flex: 1,
    gap: "10px",
  }}
>
  {weeklyPlan.map((meal, index) => (
    <div
        key={index}
        onClick={() => {
  if (!cookingMeal) cookThis(meal);
}}

onMouseEnter={(e) => {
  e.currentTarget.style.border = "1px solid #2DA11B";
  e.currentTarget.style.boxShadow = "0 6px 16px rgba(45, 161, 27, 0.10)";
}}
onMouseLeave={(e) => {
  e.currentTarget.style.border = "1px solid #ECEEE9";
  e.currentTarget.style.boxShadow = "none";
}}

        style={{
        cursor: "pointer",
        display: "flex",
        alignItems: "stretch",
        justifyContent: "space-between",
        gap: "16px",
        flexWrap: "wrap",
        padding: "16px",
        background: "#F7F6F1",
        border: "1px solid #ECEEE9",
        borderRadius: "14px",
        transition: "border-color 150ms ease, box-shadow 150ms ease",
      }}
    >
      <div
        style={{
          flex: "1 1 280px",
          lineHeight: "1.6",
          fontSize: "17px",
        }}
      >
        <strong>
          {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][index]}:
        </strong>{" "}
        {meal}
      </div>

      <div
  style={{
    alignSelf: "flex-end",
    color: "#2EAF1C",
    fontSize: "13px",
    fontWeight: 600,
    cursor: "pointer",
    userSelect: "none",
    paddingBottom: "6px",
    opacity: cookingMeal !== null && cookingMeal !== meal ? 0.5 : 1,
    textDecoration: cookingMeal === meal ? "none" : "underline",
textUnderlineOffset: "3px",
  }}
>
  {cookingMeal === meal
  ? "Cooking up your recipe..."
  : "Cook This"}
</div>

    </div>
  ))}
</div>
          
 <div
  style={{
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    marginTop: "20px",
    marginBottom: "24px",
  }}
>
  <button
    onClick={copyWeeklyPlan}
    style={{
  ...greenButtonStyle,
  background: "#ffffff",
  color: "#1f2937",
  border: "2px solid #d1d5db",
}}
  >
  {weeklyPlanCopied ? "Copied!" : "Copy Weekly Plan"}
  </button>

  <button
    onClick={saveWeeklyPlan}
    style={greenButtonStyle}
  >
  {weeklyPlanSaved ? "Saved!" : "Save Weekly Plan"}
  </button>

  <button
    onClick={clearWeek}
    style={{
      ...greenButtonStyle,
      background: "#8b3a2b",
    }}
  >
    🗑️ Clear Week
  </button>
</div>



<div
  style={{
    background: "#F7F6F1",
    border: "1px solid #ECEEE9",
    borderRadius: "16px",
    padding: "20px",
    marginTop: "28px",
  }}
>
  <h3 style={{ marginTop: 0 }}>Want to tweak the week?</h3>

  <p style={{ color: "#52616B", lineHeight: "1.6" }}>
    Tell DinnerCall what to change, like &quot;replace Thursday&quot; or
    &quot;I don&apos;t want quinoa.&quot;
  </p>

  <textarea
  placeholder="Replace Thursday. I don't want quinoa..."
  value={weeklyAdjustmentRequest}
  onChange={(e) => setWeeklyAdjustmentRequest(e.target.value)}
  rows={2}
  style={{
    ...inputStyle,
    resize: "vertical",
    minHeight: "80px",
    lineHeight: "1.5",
    fontFamily: "inherit",
  }}
/>

 <div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    marginTop: "12px",
  }}
>
  <button
    onClick={adjustWeeklyPlan}
    disabled={adjustingWeeklyPlan}
    style={greenButtonStyle}
  >
    {adjustingWeeklyPlan ? "Adjusting..." : "Adjust Weekly Plan"}
  </button>

<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginTop: "16px",
    marginBottom: "16px",
  }}
>
  <input
    type="checkbox"
    checked={excludePantryStaples}
    onChange={(e) => setExcludePantryStaples(e.target.checked)}
  />

  <div>
    <div style={{ fontWeight: 600 }}>
      Exclude Pantry Staples
    </div>

    <div
      style={{
        fontSize: "0.9rem",
        color: "#666",
      }}
    >
      Assumes you already have salt, pepper, oil and common seasonings.
    </div>
  </div>
</div>

  <button
    onClick={generateGroceryList}
    disabled={isGeneratingGroceryList}
    style={greenButtonStyle}
  >
    {isGeneratingGroceryList
      ? "Building your grocery list..."
      : "🛒 Build Grocery List"}
  </button>
</div>  
</div>

</section>
        )}

{savedWeeklyPlans.length > 0 && (
  <button
    onClick={() => {
  setShowSavedWeeklyPlans(!showSavedWeeklyPlans);
}}
    style={{
      ...greenButtonStyle,
      background: "#ffffff",
      color: "#2da11b",
      border: "1px solid #2da11b",
      marginTop: "16px",
    }}
  >
    {showSavedWeeklyPlans ? "Hide" : "My"} Weekly Plans ({savedWeeklyPlans.length})
  </button>
)}

{savedWeeklyPlans.length > 0 && showSavedWeeklyPlans && (
  <div
    id="my-weekly-plans"
    style={{
      background: "#ffffff",
      border: "1px solid #ECEEE9",
      borderRadius: "16px",
      padding: "20px",
      marginTop: "20px",
    }}
  >
    <h3 style={{ marginTop: 0 }}>My Weekly Plans</h3>

    <p style={{ color: "#52616B" }}>
      Your previously saved dinner plans.
    </p>

    {savedWeeklyPlans.map((plan, index) => (
      <div
        key={index}
        style={{
          border: "1px solid #ECEEE9",
          borderRadius: "12px",
          padding: "16px",
          marginTop: "12px",
        }}
      >
        <strong>Weekly Plan {savedWeeklyPlans.length - index}</strong>

        <ul style={{ paddingLeft: "20px", lineHeight: "1.8" }}>
          {plan.map((meal, mealIndex) => (
            <li key={mealIndex}>{meal}</li>
          ))}
        </ul>

        <button
          onClick={() => {
            setWeeklyPlan([...plan]);
            localStorage.setItem(
              "dinnercall-current-weekly-plan",
              JSON.stringify(plan)
            );
          }}
          style={greenButtonStyle}
        >
          Load This Plan
        </button>

<button
  onClick={() => deleteSavedWeeklyPlan(index)}
  style={{
    background: "#ffffff",
    color: "#c0392b",
    border: "1px solid #c0392b",
    borderRadius: "8px",
    padding: "10px 16px",
    marginTop: "16px",
    cursor: "pointer",
  }}
>
  Delete Saved Plan
</button>

      </div>
    ))}
  </div>
)}



 {groceryList && (
  <div className="grocery-card">
     <div
      ref={groceryListRef}
      style={{ scrollMarginTop: "24px" }}
    />

    <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
  <h2 style={{ margin: 0 }}>Grocery List</h2>
  <span
    style={{
      background: "#EFF9ED",
      color: "#178A12",
      border: "1px solid #B6E5AF",
      borderRadius: "999px",
      padding: "6px 12px",
      fontSize: "13px",
      fontWeight: 700,
    }}
  >
    Premium Preview
  </span>
</div>
    <p className="grocery-subtitle">
      Smartly combined from your weekly plan.
    </p>

<button
  onClick={copyGroceryList}
  style={{ ...greenButtonStyle, marginBottom: "20px" }}
>
  {groceryCopied ? "Copied!" : "📋 Copy Grocery List"}
</button>


    {groceryList.categories
      .filter((category: any) => category.items.length > 0)
      .map((category: any, categoryIndex: number) => (
        <div key={category.name} className="grocery-category">
          <h3>{category.name}</h3>

          {category.items.map((item: any, itemIndex: number) => (
            <label
              key={`${item.name}-${itemIndex}`}
              className={`grocery-item ${item.checked ? "checked" : ""}`}
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => {
                  const updated = { ...groceryList };

                  updated.categories[categoryIndex].items[
                    itemIndex
                  ].checked =
                    !updated.categories[categoryIndex].items[itemIndex]
                      .checked;

                  setGroceryList(updated);
                }}
              />

              <span>
                <strong>{item.quantity}</strong> {item.name}
              </span>
            </label>
          ))}
        </div>
      ))}
  </div>
)}

        {recipe && (
          <section style={cardStyle}>
            <p style={eyebrowStyle}>Tonight&apos;s DinnerCall</p>

            <div ref={recipeRef} style={{ scrollMarginTop: "24px" }} />

            <h2
              style={{
                fontSize: "clamp(30px, 5vw, 46px)",
                marginTop: 0,
                marginBottom: "16px",
                lineHeight: "1.08",
              }}
            >
              {recipe.name}
            </h2>

            {recipeBadges.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginBottom: "28px",
                }}
              >
                {recipeBadges.map((badge) => (
                  <span key={String(badge)} style={badgeStyle}>
                    {badge}
                  </span>
                ))}
              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginBottom: "8px",
              }}
            >
              <span style={badgeStyle}>🔥 {recipe.calories} calories</span>
              <span style={badgeStyle}>💪 {recipe.protein} protein</span>
              <span style={badgeStyle}>🍚 {recipe.carbs} carbs</span>
              <span style={badgeStyle}>🥑 {recipe.fat} fat</span>
            </div>

            <p
  style={{
    marginTop: 0,
    marginBottom: "28px",
    fontSize: "13px",
    color: "#6B7280",
  }}
>
  Nutrition shown per serving.
{recipe.nutritionVerified && " Calculated using USDA FoodData Central."}
</p>

            {recipe.adjustmentNote && (
              <div
                style={{
                  background: "#F7F6F1",
                  border: "1px solid #D9DED6",
                  borderRadius: "16px",
                  padding: "16px 18px",
                  marginBottom: "24px",
                  color: "#52616B",
                  lineHeight: "1.6",
                }}
              >
                <strong style={{ color: "#1F2933" }}>Adjusted:</strong>{" "}
                {recipe.adjustmentNote}
              </div>
            )}

            <div
              style={{
                background: "#F7F6F1",
                border: "1px solid #ECEEE9",
                borderRadius: "16px",
                padding: "20px",
                marginBottom: "36px",
              }}
            >
              <h3 style={sectionTitleStyle}>Why this works</h3>
              <p style={paragraphStyle}>{recipe.why}</p>
            </div>

{(recipe.prepTime || recipe.cookTime || recipe.totalTime) && (
  <div
    style={{
      display: "flex",
      gap: "24px",
      flexWrap: "wrap",
      marginBottom: "28px",
      fontSize: "15px",
      color: "#52616B",
    }}
  >
    {recipe.prepTime && (
      <span>
        <strong>Prep:</strong> {recipe.prepTime}
      </span>
    )}

    {recipe.cookTime && (
      <span>
        <strong>Cook:</strong> {recipe.cookTime}
      </span>
    )}

    {recipe.totalTime && (
      <span>
        <strong>Total:</strong> {recipe.totalTime}
      </span>
    )}
  </div>
)}

            <h3 style={sectionTitleStyle}>Ingredients</h3>
            <ul style={listStyle}>
              {recipe.ingredients.map((item, index) => (
                <li key={index} style={{ marginBottom: "8px" }}>
                  {item}
                </li>
              ))}
            </ul>

            <h3 style={sectionTitleStyle}>Instructions</h3>

            <ol
  style={{
    ...listStyle,
    listStyleType: "decimal",
    paddingLeft: "28px",
  }}
>
  {recipe.steps.map((step, index) => {
  const isLegacyStep = typeof step === "string";

  return (
    <li
      key={index}
      style={{
        marginBottom: "22px",
        paddingLeft: "8px",
        display: "list-item",
        lineHeight: "1.7",
      }}
    >
      {!isLegacyStep && (
        <span style={{ fontWeight: 600 }}>
          {step.title}
        </span>
      )}

      <div style={{ marginTop: isLegacyStep ? 0 : "4px" }}>
        {isLegacyStep ? step : step.instruction}
      </div>
    </li>
  );
})}

</ol>

            <div
              style={{
                background: "#F7F6F1",
                border: "1px solid #ECEEE9",
                borderRadius: "16px",
                padding: "20px",
                marginTop: "32px",
              }}
            >
              <h3 style={{ marginTop: 0 }}>Need to change something?</h3>

              <p style={{ color: "#52616B", lineHeight: "1.6" }}>
                Tell DinnerCall what to adjust, like &quot;I only have 1 lb beef&quot; or
                &quot;I don&apos;t have soy sauce.&quot;
              </p>

              <input
                type="text"
                placeholder="I don't have soy sauce..."
                value={adjustmentRequest}
                onChange={(e) => setAdjustmentRequest(e.target.value)}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "14px",
                  borderRadius: "12px",
                  border: "1px solid #D9DED6",
                  fontSize: "16px",
                  marginBottom: "12px",
                }}
              />

              <button onClick={adjustRecipe} disabled={adjusting} style={greenButtonStyle}>
                {adjusting ? "Adjusting..." : "Adjust Recipe"}
              </button>
            </div>

            <div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "12px",
    marginTop: "30px",
  }}
>
             <button onClick={saveRecipe} style={greenButtonStyle}>
  {saved ? "Saved!" : "Save Recipe"}
</button>

              <button onClick={downloadRecipe} style={whiteButtonStyle}>
                Download Recipe
              </button>

              <button onClick={copyRecipe} style={whiteButtonStyle}>
                {copied ? "Copied!" : "Copy Recipe"}
              </button>

              <button onClick={shareRecipe} style={whiteButtonStyle}>
                Share Recipe
              </button>

              <button
  onClick={clearRecipe}
  style={{
    ...whiteButtonStyle,
    gridColumn: "1 / -1",
  }}
>
                Clear Recipe
              </button>
            </div>
          </section>
        )}

{savedRecipes.length > 0 && (
  <section style={cardStyle}>
    <h2 style={{ marginTop: 0, marginBottom: "8px", fontSize: "32px" }}>
      My DinnerCalls
    </h2>

    <p style={{ color: "#52616B", marginBottom: "24px" }}>
      Recipes you've saved for another night.
    </p>

    {savedRecipes.map((savedRecipe, index) => (
      <div
        key={index}
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "flex-start",
          padding: "18px 0",
          borderTop: index === 0 ? "none" : "1px solid #E5E7EB",
        }}
      >
        <button
          onClick={() => setRecipe(savedRecipe)}
          style={{
            flex: 1,
            textAlign: "left",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <strong style={{ fontSize: "18px", color: "#1F2933" }}>
            {savedRecipe.name}
          </strong>

<span
  style={{
    color: "#2da11b",
    fontWeight: 700,
    fontSize: "15px",
    display: "block",
    marginTop: "8px",
  }}
>
  View Recipe →
</span>

        </button>

        <button
          onClick={() => deleteSavedRecipe(index)}
          style={{
            padding: "8px 12px",
            borderRadius: "10px",
            border: "1px solid #E5E7EB",
            background: "#FFFFFF",
            color: "#B42318",
            cursor: "pointer",
            fontWeight: "bold",
            height: "fit-content",
          }}
        >
          Delete
        </button>
              </div>
      ))}
    </section>
  )}

<div id="feedback-form" style={cardStyle}>
  <h2
  style={{
    marginTop: 0,
    marginBottom: "20px",
    color: "#2DA11B",
    fontSize: "26px",
    fontWeight: 700,
  }}
>
  Help us improve DinnerCall
</h2>

  <p style={{ color: "#52616B", lineHeight: 1.6 }}>
    Have an idea, suggestion, or problem to report?
    We'd love to hear it.
  </p>

  <form onSubmit={submitFeedback}>
    <label
      htmlFor="feedback-type"
      style={{ display: "block", fontWeight: 600, marginBottom: "8px" }}
    >
      What's on your mind?
    </label>

    <select
      id="feedback-type"
      value={feedbackType}
onChange={(e) => setFeedbackType(e.target.value)}
      style={{ ...inputStyle, marginBottom: "16px" }}
    >
      <option value="suggestion">Suggestion or idea</option>
      <option value="problem">Report a problem</option>
      <option value="recipe">Recipe feedback</option>
      <option value="other">Something else</option>
    </select>

    <label
      htmlFor="feedback-message"
      style={{ display: "block", fontWeight: 600, marginBottom: "8px" }}
    >
      Your feedback
    </label>

    <textarea
      id="feedback-message"
      value={feedbackMessage}
onChange={(e) => setFeedbackMessage(e.target.value)}
      placeholder="Tell us what you think..."
      rows={4}
      required
      style={{ ...inputStyle, resize: "vertical", marginBottom: "16px" }}
    />

    <button
  type="submit"
  style={greenButtonStyle}
  disabled={feedbackSending}
>
  {feedbackSending ? "Sending..." : "Send Feedback"}
</button>
  </form>
  {feedbackStatus && (
  <p
    role="status"
    style={{
      marginTop: "16px",
      color: feedbackStatus.startsWith("Thank you")
        ? "#2DA11B"
        : "#B42318",
      fontWeight: 600,
    }}
  >
    {feedbackStatus}
  </p>
)}
</div>

      </section>
    </main>
  );
}

const cardStyle = {
  background: "#FFFFFF",
  border: "1px solid #ECEEE9",
  borderRadius: "24px",
  padding: "36px",
  boxShadow: "0 12px 30px rgba(31, 41, 51, 0.06)",
  marginBottom: "32px",
};

const labelStyle = {
  display: "block",
  fontWeight: "bold",
  marginBottom: "10px",
  fontSize: "18px",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  padding: "16px",
  borderRadius: "14px",
  border: "1px solid #D9DED6",
  fontSize: "16px",
};

const selectStyle = {
  padding: "16px",
  borderRadius: "12px",
  border: "1px solid #D9DED6",
  fontSize: "16px",
  background: "#FFFFFF",
};

const mainButtonStyle = {
  padding: "16px 24px",
  borderRadius: "12px",
  border: "none",
  background: "#2DA11B",
  color: "white",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
  minWidth: "260px",
  whiteSpace: "nowrap" as const,
};

const greenButtonStyle = {
  padding: "14px 22px",
  borderRadius: "12px",
  border: "none",
  background: "#2DA11B",
  color: "white",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
  width: "100%",
minHeight: "64px",
display: "flex",
alignItems: "center",
justifyContent: "center",
textAlign: "center" as const,
};

const whiteButtonStyle = {
  padding: "14px 22px",
  borderRadius: "12px",
  border: "1px solid #D9DED6",
  background: "#FFFFFF",
  color: "#1F2933",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
  width: "100%",
minHeight: "64px",
display: "flex",
alignItems: "center",
justifyContent: "center",
textAlign: "center" as const,
};

const chipStyle = {
  padding: "10px 16px",
  borderRadius: "999px",
  border: "1px solid #D9DED6",
  background: "#F7F6F1",
  color: "#52616B",
  fontSize: "15px",
  cursor: "pointer",
};

const eyebrowStyle = {
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  color: "#2DA11B",
  fontWeight: "bold",
  fontSize: "14px",
};

const badgeStyle = {
  display: "inline-flex",
  alignItems: "center",
  padding: "10px 16px",
  borderRadius: "999px",
  border: "1px solid #D9DED6",
  background: "#F7F6F1",
  color: "#52616B",
  fontWeight: "bold",
};

const sectionTitleStyle = {
  fontSize: "24px",
  marginTop: "0px",
  marginBottom: "12px",
};

const paragraphStyle = {
  color: "#52616B",
  lineHeight: "1.7",
  fontSize: "17px",
};

const listStyle = {
  paddingLeft: "24px",
  lineHeight: "1.9",
  fontSize: "17px",
};