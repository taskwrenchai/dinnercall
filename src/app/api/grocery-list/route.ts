import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { weeklyPlan } = await req.json();

    if (!weeklyPlan) {
      return Response.json(
        { error: "Weekly plan is required." },
        { status: 400 }
      );
    }

    const prompt = `
You are creating a premium grocery list from a weekly meal plan.

Requirements:
- Combine duplicate ingredients across meals.
- Consolidate quantities when reasonable.
- Group items by category.
- Use shopper-friendly wording.
- Return ONLY valid JSON.
- Do not include markdown.

Categories should include:
Protein, Produce, Dairy, Pantry, Frozen, Spices & Seasonings, Other.

Weekly Plan:
${weeklyPlan}

Return this exact structure:
{
  "categories": [
    {
      "name": "Produce",
      "items": [
        {
          "name": "Yellow onions",
          "quantity": "2 medium",
          "checked": false
        }
      ]
    }
  ]
}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("No grocery list returned.");
    }

    const groceryList = JSON.parse(content);

    return Response.json({ groceryList });
  } catch (error) {
    console.error("Grocery list error:", error);
    return Response.json(
      { error: "Failed to generate grocery list." },
      { status: 500 }
    );
  }
}