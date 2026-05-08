"use client";

import { useState } from "react";

type Recipe = {
  name: string;
  why: string;
  ingredients: string[];
  steps: string[];
};

export default function Home() {
  const [ingredients, setIngredients] = useState("");
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!ingredients.trim()) return;

    setLoading(true);
    setRecipe(null);
    setError("");

    try {
      const res = await fetch("/api/recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ingredients }),
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
    <main style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "900px" }}>
      <h1>DinnerCall</h1>
      <p>What ingredients do you have?</p>

      <input
        type="text"
        placeholder="chicken, rice, broccoli..."
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        style={{ padding: "10px", width: "320px", marginRight: "10px" }}
      />

      <button onClick={handleClick} style={{ padding: "10px" }} disabled={loading}>
        {loading ? "Generating..." : "Generate Recipe"}
      </button>

      {error && <p style={{ color: "red", marginTop: "20px" }}>{error}</p>}

      {recipe && (
        <section
          style={{
            marginTop: "30px",
            background: "#111",
            color: "#fff",
            padding: "24px",
            borderRadius: "12px",
            lineHeight: "1.6",
            maxWidth: "700px",
          }}
        >
          <h2>{recipe.name}</h2>

          <h3>Why this works</h3>
          <p>{recipe.why}</p>

          <h3>Ingredients</h3>
          <ul>
            {recipe.ingredients.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h3>Instructions</h3>
          <ol>
            {recipe.steps.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </section>
      )}
    </main>
  );
}