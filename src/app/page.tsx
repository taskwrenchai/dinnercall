"use client";

import { useState } from "react";

export default function Home() {
  const [ingredients, setIngredients] = useState("");
  const [result, setResult] = useState("");

  const handleClick = () => {
    setResult(`Tonight you could cook something with: ${ingredients}`);
  };

  return (
    <main style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>DinnerCall</h1>

      <p>What do you have?</p>

      <input
        type="text"
        placeholder="chicken, rice, broccoli..."
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        style={{
          padding: "10px",
          width: "300px",
          marginRight: "10px",
        }}
      />

      <button onClick={handleClick} style={{ padding: "10px" }}>
        Generate Idea
      </button>

      {result && (
        <p style={{ marginTop: "20px" }}>
          {result}
        </p>
      )}
    </main>
  );
}