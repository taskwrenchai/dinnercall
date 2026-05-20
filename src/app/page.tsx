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
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("dinnercall_saved_recipes");
    if (saved) setSavedRecipes(JSON.parse(saved));
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

  const deleteRecipe = (index: number) => {
    const updatedRecipes = savedRecipes.filter(
      (_, savedIndex) => savedIndex !== index
    );

    setSavedRecipes(updatedRecipes);
    localStorage.setItem(
      "dinnercall_saved_recipes",
      JSON.stringify(updatedRecipes)
    );
  };

  const copyRecipe = async () => {
    if (!recipe) return;

    const recipeText = `${recipe.name}

Why this works:
${recipe.why}

Ingredients:
${recipe.ingredients.map((item) => `- ${item}`).join("\n")}

Instructions:
${recipe.steps.map((step, index) => `${index + 1}. ${step}`).join("\n")}`;

    await navigator.clipboard.writeText(recipeText);
    setCopied(true);

    setTimeout(() => setCopied(false), 2000);
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
        padding: "24px 16px",
      }}
    >
      <section style={{ maxWidth: "900px", margin: "0 auto" }}>
        <div style={{ marginBottom: "32px" }}>
          <img
            src="/dinnercall-logo-v2.png"
            alt="DinnerCall Logo"
            style={{
              width: "340px",
              marginBottom: "48px",
            }}
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
            Tell us what you have, and we’ll turn it into a simple dinner idea.
          </p>
        </div>

        <div
          style={{
            background: "#FFFFFF",
            padding: "24px",
            borderRadius: "22px",
            boxShadow: "0 10px 35px rgba(0,0,0,0.06)",
            marginBottom: "28px",
            border: "1px solid #ECEEE9",
          }}
        >
          <label
            style={{
              display: "block",
              fontWeight: "bold",
              marginBottom: "12px",
              fontSize: "15px",
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
                if (e.key === "Enter" && !loading) handleClick();
              }}
              style={{
                flex: "1",
                minWidth: "240px",
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid #D9DED6",
                fontSize: "16px",
              }}
            />

            <select
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              style={{
                padding: "16px",
                borderRadius: "12px",
                border: "1px solid #D9DED6",
                fontSize: "16px",
                background: "#FFFFFF",
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
                padding: "16px 22px",
                borderRadius: "12px",
                border: "none",
                background: "#6B8F71",
                color: "white",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: loading ? "not-allowed" : "pointer",
                minWidth: "170px",
              }}
            >
              {loading ? "Thinking..." : "Generate Recipe"}
            </button>
          </div>

          <div
            style={{
              marginTop: "18px",
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
                  padding: "10px 14px",
                  borderRadius: "999px",
                  border: "1px solid #D9DED6",
                  background: "#F7F6F1",
                  color: "#52616B",
                  cursor: "pointer",
                  fontSize: "14px",
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
              borderRadius: "22px",
              boxShadow: "0 10px 35px rgba(0,0,0,0.06)",
              marginBottom: "28px",
              border: "1px solid #ECEEE9",
            }}
          >
            <p
              style={{
                color: "#6B8F71",
                fontWeight: "bold",
                marginBottom: "10px",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                fontSize: "13px",
              }}
            >
              Tonight’s DinnerCall
            </p>

            <h2
              style={{
                fontSize: "clamp(28px, 5vw, 42px)",
                marginTop: 0,
                marginBottom: "20px",
                lineHeight: "1.1",
              }}
            >
              {recipe.name}
            </h2>

            <h3>Why this works</h3>
            <p style={{ color: "#52616B", lineHeight: "1.8", fontSize: "17px" }}>
              {recipe.why}
            </p>

            <h3 style={{ marginTop: "36px", fontSize: "24px" }}>
              Ingredients
            </h3>

            <ul style={{ paddingLeft: "24px", lineHeight: "1.9", fontSize: "17px" }}>
              {recipe.ingredients.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            <h3 style={{ marginTop: "40px", fontSize: "24px" }}>
              Instructions
            </h3>

            <ol
              style={{
                paddingLeft: "24px",
                lineHeight: "1.9",
                listStyleType: "decimal",
                fontSize: "17px",
              }}
            >
              {recipe.steps.map((step, index) => (
                <li key={index} style={{ marginBottom: "16px" }}>
                  {step}
                </li>
              ))}
            </ol>

            <div
              style={{
                display: "flex",
                gap: "12px",
                flexWrap: "wrap",
                marginTop: "28px",
              }}
            >
              <button
                onClick={saveRecipe}
                style={{
                  padding: "14px 18px",
                  borderRadius: "12px",
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

              <button
                onClick={copyRecipe}
                style={{
                  padding: "14px 18px",
                  borderRadius: "12px",
                  border: "1px solid #D9DED6",
                  background: "#FFFFFF",
                  color: "#1F2933",
                  fontSize: "15px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                {copied ? "Copied!" : "Copy Recipe"}
              </button>

              <button
                onClick={() => setRecipe(null)}
                style={{
                  padding: "14px 18px",
                  borderRadius: "12px",
                  border: "1px solid #D9DED6",
                  background: "#FFFFFF",
                  color: "#52616B",
                  fontSize: "15px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Clear Recipe
              </button>
            </div>
          </section>
        )}

        {savedRecipes.length > 0 && (
          <section
            style={{
              background: "#FFFFFF",
              padding: "28px",
              borderRadius: "22px",
              boxShadow: "0 10px 35px rgba(0,0,0,0.06)",
              border: "1px solid #ECEEE9",
            }}
          >
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
                  onClick={() => deleteRecipe(index)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "10px",
                    border: "1px solid #E5E7EB",
                    background: "#FFFFFF",
                    color: "#B42318",
                    cursor: "pointer",
                    fontWeight: "bold",
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