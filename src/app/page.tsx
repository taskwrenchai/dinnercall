"use client";

import { useState, useEffect, useRef } from "react";

type Recipe = {
  name: string;
  why: string;
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
  const [mealPreference, setMealPreference] = useState("No Preference");
  const [maxTime, setMaxTime] = useState("No Preference");
  const [kidFriendly, setKidFriendly] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const recipeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("dinnercall_saved_recipes");
    if (saved) setSavedRecipes(JSON.parse(saved));
  }, []);

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

  const saveRecipe = () => {
    if (!recipe) return;
    const updatedRecipes = [recipe, ...savedRecipes];
    setSavedRecipes(updatedRecipes);
    localStorage.setItem("dinnercall_saved_recipes", JSON.stringify(updatedRecipes));
  };

  const deleteRecipe = (index: number) => {
    const updatedRecipes = savedRecipes.filter((_, savedIndex) => savedIndex !== index);
    setSavedRecipes(updatedRecipes);
    localStorage.setItem("dinnercall_saved_recipes", JSON.stringify(updatedRecipes));
  };

 const getRecipeText = () => {
  if (!recipe) return "";

  return `${recipe.name}

Why this works:
${recipe.why}

Ingredients:
${recipe.ingredients.map((item) => `- ${item}`).join("\n")}

Instructions:
${recipe.steps.map((step, index) => `${index + 1}. ${step}`).join("\n")}`;
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

  const a = document.createElement("a");
  a.href = url;
  a.download = `${recipe.name}.txt`;
  a.click();

  URL.revokeObjectURL(url);
};

  const handleClick = async () => {
    if (!ingredients.trim()) return;

    setLoading(true);
    setRecipe(null);
    setError("");
    setCopied(false);

    try {
      const res = await fetch("/api/recipe", {
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
    `${servings} servings`,
    mealPreference !== "No Preference" ? mealPreference : null,
    maxTime !== "No Preference" ? maxTime : null,
    kidFriendly ? "Kid Friendly" : null,
  ].filter(Boolean);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F7F6F1",
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
            }}
          >
            What’s for dinner?
          </h1>

          <p
            style={{
              fontSize: "clamp(18px, 3vw, 22px)",
              color: "#52616B",
              maxWidth: "620px",
              lineHeight: "1.6",
            }}
          >
            Tell us what you have, and we’ll decide dinner.
          </p>
        </div>

        <div style={cardStyle}>
          <label style={labelStyle}>Ingredients on hand</label>

          <input
            type="text"
            placeholder="chicken, rice, broccoli..."
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !loading) handleClick();
            }}
            style={inputStyle}
          />

          <label style={labelStyle}>Dislikes / Allergies</label>

          <input
            type="text"
            placeholder="mushrooms, olives, peanuts..."
            value={avoidIngredients}
            onChange={(e) => setAvoidIngredients(e.target.value)}
            style={inputStyle}
          />

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "18px" }}>
            <select value={servings} onChange={(e) => setServings(e.target.value)} style={selectStyle}>
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
            </select>

            <select value={maxTime} onChange={(e) => setMaxTime(e.target.value)} style={selectStyle}>
              <option value="No Preference">Any Time</option>
              <option value="15 minutes or less">15 min or less</option>
              <option value="30 minutes or less">30 min or less</option>
              <option value="45 minutes or less">45 min or less</option>
              <option value="60 minutes or less">60 min or less</option>
            </select>

            <label style={toggleStyle}>
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

          <div style={{ marginTop: "18px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {[
              "chicken, rice, broccoli",
              "ground beef, tortillas, cheese",
              "salmon, potatoes, asparagus",
            ].map((example) => (
              <button key={example} onClick={() => setIngredients(example)} style={chipStyle}>
                {example}
              </button>
            ))}
          </div>
        </div>

        {error && <p style={{ color: "#B42318", fontWeight: "bold" }}>{error}</p>}

        {recipe && (
  <section style={recipeCardStyle}>
            <p style={eyebrowStyle}>Tonight’s DinnerCall</p>

            <h2
              style={{
                fontSize: "clamp(30px, 5vw, 46px)",
                marginTop: 0,
                marginBottom: "16px",
                lineHeight: "1.08",
              }}
            >
<div ref={recipeRef} style={{ scrollMarginTop: "24px" }} />

              {recipe.name}
            </h2>

            {recipeBadges.length > 0 && (
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "28px" }}>
                {recipeBadges.map((badge) => (
                  <span key={badge} style={badgeStyle}>
                    {badge}
                  </span>
                ))}
              </div>
            )}

            <div
              style={{
                background: "#F7F6F1",
                border: "1px solid #ECEEE9",
                borderRadius: "16px",
                padding: "20px",
                marginBottom: "32px",
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: "10px", fontSize: "22px" }}>
                Why this works
              </h3>
              <p style={{ color: "#52616B", lineHeight: "1.8", fontSize: "17px", marginBottom: 0 }}>
                {recipe.why}
              </p>
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

            <ol style={{ ...listStyle, listStyleType: "decimal" }}>
              {recipe.steps.map((step, index) => (
                <li key={index} style={{ marginBottom: "18px", paddingLeft: "4px" }}>
                  {step}
                </li>
              ))}
            </ol>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginTop: "30px" }}>
              <button onClick={saveRecipe} style={greenButtonStyle}>
                Save Recipe
              </button>

              <button onClick={downloadRecipe} style={whiteButtonStyle}>
  Download Recipe
</button>

              <button onClick={copyRecipe} style={whiteButtonStyle}>
                {copied ? "Copied!" : "Copy Recipe"}
              </button>

              <button onClick={() => setRecipe(null)} style={whiteButtonStyle}>
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

                  <p style={{ color: "#52616B", marginBottom: 0, marginTop: "6px", lineHeight: "1.6" }}>
                    {savedRecipe.why}
                  </p>
                </button>

                <button onClick={() => deleteRecipe(index)} style={deleteButtonStyle}>
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
  padding: "28px",
  borderRadius: "22px",
  boxShadow: "0 10px 35px rgba(0,0,0,0.06)",
  marginBottom: "28px",
  border: "1px solid #ECEEE9",
};

const recipeCardStyle = {
  ...cardStyle,
  padding: "34px",
};

const labelStyle = {
  display: "block",
  fontWeight: "bold",
  marginBottom: "12px",
  fontSize: "16px",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box" as const,
  padding: "16px",
  borderRadius: "12px",
  border: "1px solid #D9DED6",
  fontSize: "16px",
  marginBottom: "18px",
};

const selectStyle = {
  padding: "16px",
  borderRadius: "12px",
  border: "1px solid #D9DED6",
  fontSize: "16px",
  background: "#FFFFFF",
};

const toggleStyle = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  padding: "16px",
  borderRadius: "12px",
  border: "1px solid #D9DED6",
  background: "#FFFFFF",
  fontSize: "16px",
  cursor: "pointer",
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

const chipStyle = {
  padding: "10px 14px",
  borderRadius: "999px",
  border: "1px solid #D9DED6",
  background: "#F7F6F1",
  color: "#52616B",
  cursor: "pointer",
  fontSize: "14px",
};

const eyebrowStyle = {
  color: "#6B8F71",
  fontWeight: "bold",
  marginBottom: "10px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.06em",
  fontSize: "13px",
};

const badgeStyle = {
  padding: "8px 12px",
  borderRadius: "999px",
  background: "#F7F6F1",
  border: "1px solid #D9DED6",
  color: "#52616B",
  fontSize: "14px",
  fontWeight: "600",
};

const sectionTitleStyle = {
  marginTop: "34px",
  marginBottom: "14px",
  fontSize: "24px",
};

const listStyle = {
  paddingLeft: "24px",
  lineHeight: "1.9",
  fontSize: "17px",
};

const greenButtonStyle = {
  padding: "14px 18px",
  borderRadius: "12px",
  border: "none",
  background: "#6B8F71",
  color: "white",
  fontSize: "15px",
  fontWeight: "bold",
  cursor: "pointer",
};

const whiteButtonStyle = {
  padding: "14px 18px",
  borderRadius: "12px",
  border: "1px solid #D9DED6",
  background: "#FFFFFF",
  color: "#1F2933",
  fontSize: "15px",
  fontWeight: "bold",
  cursor: "pointer",
};

const deleteButtonStyle = {
  padding: "8px 12px",
  borderRadius: "10px",
  border: "1px solid #E5E7EB",
  background: "#FFFFFF",
  color: "#B42318",
  cursor: "pointer",
  fontWeight: "bold",
};