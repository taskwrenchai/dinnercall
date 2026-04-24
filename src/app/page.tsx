"use client";

import { useState } from "react";

export default function Home() {
  const [ingredients, setIngredients] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (!ingredients.trim()) return;

    setLoading(true);
    setResult("");

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
        setResult(data.error || "Something went wrong.");
      } else {
        setResult(data.recipe);
      }
    } catch {
      setResult("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif", maxWidth: "800px" }}>
      <h1>DinnerCall</h1>
      <p>What ingredients do you have?</p>

      <input
        type="text"
        placeholder="chicken, rice, broccoli..."
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        style={{
          padding: "10px",
          width: "320px",
          marginRight: "10px",
        }}
      />

      <button onClick={handleClick} style={{ padding: "10px" }} disabled={loading}>
        {loading ? "Generating..." : "Generate Recipe"}
      </button>

      {result && (
        <pre
          style={{
            marginTop: "20px",
            whiteSpace: "pre-wrap",
            background: "#111",
            color: "#fff",
            padding: "20px",
            borderRadius: "8px",
          }}
        >
          {result}
        </pre>
      )}
    </main>
  );
}