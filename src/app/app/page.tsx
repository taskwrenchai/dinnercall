"use client";

import { useEffect, useRef, useState } from "react";

type Recipe = {
  name: string;
  why: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
  adjustmentNote?: string;
  ingredients: string[];
  steps: string[];
};

const loadingMessages = [
  "🥕 Chopping vegetables...",
  "🧂 Checking the pantry...",
  "🍳 Heating the skillet...",
  "🍽️ Calling dinner...",
];

export default function Home() {
  const [ingredients, setIngredients] = useState("");
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

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [planningWeek, setPlanningWeek] = useState(false);
  const [copied, setCopied] = useState(false);
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

  useEffect(() => {
    const savedPlans = localStorage.getItem("dinnercall_saved_weekly_plans");
if (savedPlans) setSavedWeeklyPlans(JSON.parse(savedPlans));
    
    const saved = localStorage.getItem("dinnercall_saved_recipes");
    if (saved) setSavedRecipes(JSON.parse(saved));

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
${recipe.steps.map((step, index) => `${index + 1}. ${step}`).join("\n")}`;
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

  const saveRecipe = () => {
  if (!recipe) return;

  const updated = [recipe, ...savedRecipes];
  setSavedRecipes(updated);
  localStorage.setItem("dinnercall_saved_recipes", JSON.stringify(updated));

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
        ingredients,
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

const deleteSavedRecipe = (indexToDelete: number) => {
  const updated = savedRecipes.filter(
    (_, index) => index !== indexToDelete
  );

  setSavedRecipes(updated);
  localStorage.setItem(
    "dinnercall_saved_recipes",
    JSON.stringify(updated)
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
    setWeeklyPlan([]);
    setError("");
    setCopied(false);
    setAdjustmentRequest("");
  };

  const copyWeeklyPlan = async () => {
  if (weeklyPlan.length === 0) return;

  await navigator.clipboard.writeText(getWeeklyPlanText());
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
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

  const saveWeeklyPlan = () => {
  if (weeklyPlan.length === 0) return;

  const updated = [weeklyPlan, ...savedWeeklyPlans];
  setSavedWeeklyPlans(updated);
  localStorage.setItem(
    "dinnercall_saved_weekly_plans",
    JSON.stringify(updated)
  );

  setSaved(true);
  setTimeout(() => setSaved(false), 2000);
};

  const planMyWeek = async () => {
    if (!ingredients.trim()) {
      setError(
        "🔔 My dinner bell isn't ringing yet. Tell me what ingredients you have first."
      );
      return;
    }

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
          ingredients,
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

  const handleClick = async () => {
    if (!ingredients.trim()) {
      setError(
        "Oops! DinnerCall can't decide dinner if you don't tell me what's in the kitchen. 🍳"
      );
      return;
    }

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
        padding: "24px 16px",
      }}
    >
      <section style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ marginBottom: "32px" }}>
          <img
            src="/dinnercall-logo-v2.png"
            alt="DinnerCall Logo"
            style={{ width: "340px", marginBottom: "48px", maxWidth: "100%" }}
          />

          <h1
            style={{
              fontSize: "clamp(36px, 7vw, 56px)",
              lineHeight: "1.05",
              margin: "0 0 16px",
              fontWeight: 400,
            }}
          >
            What&apos;s for dinner?
          </h1>

          <p
            style={{
              fontSize: "clamp(18px, 3vw, 24px)",
              color: "#52616B",
              margin: 0,
            }}
          >
            Tell us what you have, and we&apos;ll decide dinner.
          </p>
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

          <input
            type="text"
            placeholder="chicken, rice, broccoli..."
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            style={inputStyle}
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

          <label style={labelStyle}>
          Dislikes / Allergies
         </label>

          <input
            type="text"
            placeholder="mushrooms, olives, peanuts..."
            value={avoidIngredients}
            onChange={(e) => setAvoidIngredients(e.target.value)}
            style={inputStyle}
          />

          <div
            style={{
              display: "flex",
              gap: "12px",
              flexWrap: "wrap",
              marginTop: "18px",
            }}
          >
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
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
              style={selectStyle}
            >
              <option value="2">2 servings</option>
              <option value="4">4 servings</option>
              <option value="6">6 servings</option>
            </select>

            <select
              value={mealPreference}
              onChange={(e) => setMealPreference(e.target.value)}
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
      color: "#6B8F71",
      letterSpacing: "0.06em",
      textTransform: "uppercase",
      fontSize: "13px",
    }}
  >
    Want to plan ahead?
  </p>

  <h3 style={{ margin: "0 0 8px", fontSize: "30px" }}>
  Plan your week
</h3>

  <p
  style={{
    margin: "0 0 18px",
    color: "#52616B",
    lineHeight: "1.6",
    fontSize: "17px",
    maxWidth: "760px",
  }}
>
  For best results, enter your proteins or main ingredients above. DinnerCall will use them to create five dinners for the week.
</p>

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

            <ul style={listStyle}>
              {weeklyPlan.map((meal, index) => (
                <li key={index} style={{ marginBottom: "14px" }}>
                  <strong>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"][index]}:
                  </strong>{" "}
                  {meal}
                </li>
              ))}
            </ul>
          
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
  backgroundColor: "#ffffff",
  color: "#1f2937",
  border: "2px solid #d1d5db",
}}
  >
    Copy Weekly Plan
  </button>

  <button
    onClick={saveWeeklyPlan}
    style={greenButtonStyle}
  >
    Save Weekly Plan
  </button>

  <button
    onClick={clearWeek}
    style={{
      ...greenButtonStyle,
      backgroundColor: "#8b3a2b",
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

  <input
    type="text"
    placeholder="Replace Thursday. I don't want quinoa..."
    value={weeklyAdjustmentRequest}
    onChange={(e) => setWeeklyAdjustmentRequest(e.target.value)}
    style={inputStyle}
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

 {groceryList && (
  <div className="grocery-card">
     <div
      ref={groceryListRef}
      style={{ scrollMarginTop: "24px" }}
    />

    <h2>Grocery List</h2>
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
                marginBottom: "28px",
              }}
            >
              <span style={badgeStyle}>🔥 {recipe.calories} calories</span>
              <span style={badgeStyle}>💪 {recipe.protein} protein</span>
              <span style={badgeStyle}>🍚 {recipe.carbs} carbs</span>
              <span style={badgeStyle}>🥑 {recipe.fat} fat</span>
            </div>

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
  {recipe.steps.map((step, index) => (
    <li
      key={index}
      style={{
        marginBottom: "18px",
        paddingLeft: "6px",
        display: "list-item",
      }}
    >
      {step}
    </li>
  ))}
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
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
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

              <button onClick={clearRecipe} style={whiteButtonStyle}>
                Clear Recipe
              </button>
            </div>
          </section>
        )}

{savedRecipes.length > 0 && (
  <section style={cardStyle}>
    <h2 style={{ marginTop: 0, marginBottom: "8px", fontSize: "32px" }}>
      Saved Recipes
    </h2>

    <p style={{ color: "#52616B", marginBottom: "24px" }}>
      Your favorite DinnerCalls.
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

          <p
            style={{
              color: "#52616B",
              marginBottom: 0,
              marginTop: "6px",
              lineHeight: "1.6",
            }}
          >
            {savedRecipe.why}
          </p>
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
  background: "#6B8F71",
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
  background: "#6B8F71",
  color: "white",
  fontSize: "16px",
  fontWeight: "bold",
  cursor: "pointer",
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
  color: "#6B8F71",
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
  marginTop: "32px",
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