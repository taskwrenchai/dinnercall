import { NextResponse } from "next/server";
import { calculateRecipeNutrition } from "@/lib/nutrition";

export async function GET() {
  try {
    const result = await calculateRecipeNutrition(
      [
  {
    name: "salmon fillet raw skin on",
    amount: 12,
    unit: "oz",
    grams: 340
  },
  {
    name: "sweet potato raw",
    amount: 10,
    unit: "oz",
    grams: 283
  },
  {
    name: "asparagus raw",
    amount: 8,
    unit: "oz",
    grams: 227
  },
  {
    name: "olive oil",
    amount: 2,
    unit: "tbsp",
    grams: 28
  }
],
      2
    );

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    console.error("Nutrition test error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Unknown nutrition error.";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}