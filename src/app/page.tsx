export default function HomePage() {
  return (
    <main style={{ minHeight: "100vh", background: "#ffffff", color: "#1f2937" }}>
      <section
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: "3rem",
            lineHeight: 1.1,
            marginBottom: "20px",
          }}
        >
          Dinner planning, finally made simple.
        </h1>

        <p
          style={{
            fontSize: "1.25rem",
            maxWidth: "720px",
            margin: "0 auto 32px",
            color: "#4b5563",
          }}
        >
          DinnerCall helps you decide what&apos;s for dinner, plan your week,
          and build a smart grocery list in minutes.
        </p>

        <a
          href="/app"
          style={{
            display: "inline-block",
            background: "#2f6b3f",
            color: "white",
            padding: "14px 24px",
            borderRadius: "999px",
            fontWeight: 700,
            textDecoration: "none",
          }}
        >
          Try DinnerCall
        </a>
      </section>

      <section
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "0 24px 80px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {[
          ["AI Recipe Ideas", "Turn ingredients on hand into practical meals."],
          ["Weekly Meal Plans", "Build a week of dinners without overthinking it."],
          ["Smart Grocery Lists", "Combine ingredients and organize by category."],
          ["Pantry Staples Toggle", "Keep common staples off your list when you already have them."],
        ].map(([title, text]) => (
          <div
            key={title}
            style={{
              background: "white",
              border: "1px solid #eef0ea",
              borderRadius: "18px",
              padding: "24px",
              boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
            }}
          >
            <h2 style={{ fontSize: "1.2rem", marginBottom: "10px" }}>
              {title}
            </h2>
            <p style={{ color: "#4b5563", lineHeight: 1.5 }}>{text}</p>
          </div>
        ))}
      </section>

      <footer
        style={{
          textAlign: "center",
          padding: "32px 24px",
          color: "#6b7280",
          borderTop: "1px solid #ead8bd",
        }}
      >
        DinnerCall Beta
      </footer>
    </main>
  );
}