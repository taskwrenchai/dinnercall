"use client";

import { useEffect, useState } from "react";

type Recipe = {
  name: string;
  why: string;
  ingredients: string[];
  steps: string[];
};

export default function Home() {
  const [ingredients, setIngredients] = useState("");
  const [servings, setServings] = useState("4");
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("dinnercall_saved_recipes");
    if (saved) {
      setSavedRecipes(JSON.parse(saved));
    }
  }, []);

  const saveRecipe = () => {
    if (!recipe) return;

    const updatedRecipes = [recipe, ...savedRecipes];
    setSavedRecipes(updatedRecipes);
    localStorage.setItem(
      "dinnercall_saved_recipes",
      JSON.stringify(updatedRecipes)
    );
  };

  const handleClick = async () => {
    if (!ingredients.trim()) return;

    setLoading(true);
    setRecipe(null);
    setError("");

    try {
      const res = await fetch("/api/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ingredients, servings }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setRecipe(data.recipe);
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F7F6F1",
        color: "#1F2933",
        fontFamily: "Arial, sans-serif",
        padding: "48px 24px",
      }}
    >
      <section style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ marginBottom: "36px" }}>
          <p
            style={{
              color: "#6B8F71",
              fontWeight: "bold",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontSize: "14px",
            }}
          >
            DinnerCall
          </p>

          <h1 style={{ fontSize: "48px", margin: "0 0 12px" }}>
            What’s for dinner?
          </h1>

          <p style={{ fontSize: "20px", color: "#52616B", maxWidth: "620px" }}>
            Tell us what you have, and we’ll turn it into a simple dinner idea.
          </p>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            padding: "28px",
            borderRadius: "18px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            marginBottom: "28px",
          }}
        >
          <label
            style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            Ingredients on hand
          </label>

          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <input
              type="text"
              placeholder="chicken, rice, broccoli..."
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !loading) {
                  handleClick();
                }
              }}
              style={{
                flex: "1",
                minWidth: "260px",
                padding: "14px",
                borderRadius: "10px",
                border: "1px solid #D9DED6",
                fontSize: "16px",
              }}
            />

            <select
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              style={{
                padding: "14px",
                borderRadius: "10px",
                border: "1px solid #D9DED6",
                fontSize: "16px",
              }}
            >
              <option value="2">2 servings</option>
              <option value="4">4 servings</option>
              <option value="6">6 servings</option>
            </select>

            <button
              onClick={handleClick}
              disabled={loading}
              style={{
                padding: "14px 22px",
                borderRadius: "10px",
                border: "none",
                background: "#6B8F71",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Thinking..." : "Generate Recipe"}
            </button>
          </div>

          <div
            style={{
              marginTop: "16px",
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
                onClick={() => setIngredients(example)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "999px",
                  border: "1px solid #D9DED6",
                  background: "#F7F6F1",
                  color: "#52616B",
                  cursor: "pointer",
                }}
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <p style={{ color: "#B42318", fontWeight: "bold" }}>{error}</p>
        )}

        {recipe && (
          <section
            style={{
              background: "#FFFFFF",
              padding: "32px",
              borderRadius: "18px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              marginBottom: "28px",
            }}
          >
            <p
              style={{
                color: "#6B8F71",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              Tonight’s DinnerCall
            </p>

            <h2 style={{ fontSize: "32px", marginTop: 0 }}>{recipe.name}</h2>

            <h3>Why this works</h3>
            <p style={{ color: "#52616B", lineHeight: "1.7" }}>{recipe.why}</p>

            <h3 style={{ marginTop: "32px", fontSize: "28px" }}>
              Ingredients
            </h3>

            <ul
              style={{
                paddingLeft: "24px",
                marginTop: "16px",
                lineHeight: "1.8",
              }}
            >
              {recipe.ingredients.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3 style={{ marginTop: "40px", fontSize: "28px" }}>
              Instructions
            </h3>

            <ol
              style={{
                paddingLeft: "24px",
                lineHeight: "1.8",
                listStyleType: "decimal",
              }}
            >
              {recipe.steps.map((step, index) => (
                <li key={index} style={{ marginBottom: "12px" }}>
                  {step}
                </li>
              ))}
            </ol>

            <button
              onClick={saveRecipe}
              style={{
                marginTop: "24px",
                padding: "12px 18px",
                borderRadius: "10px",
                border: "none",
                background: "#6B8F71",
                color: "white",
                fontSize: "15px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Save Recipe
            </button>
          </section>
        )}

        {savedRecipes.length > 0 && (
          <section
            style={{
              background: "#FFFFFF",
              padding: "28px",
              borderRadius: "18px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            }}
          >
            <h2 style={{ marginTop: 0 }}>Saved Recipes</h2>

            {savedRecipes.map((savedRecipe, index) => (
              <div
                key={index}
                style={{
                  padding: "16px 0",
                  borderTop: index === 0 ? "none" : "1px solid #E5E7EB",
                }}
              >
                <strong>{savedRecipe.name}</strong>
                <p style={{ color: "#52616B", marginBottom: 0 }}>
                  {savedRecipe.why}
                </p>
              </div>
            ))}
          </section>
        )}
      </section>
    </main>
  );
}