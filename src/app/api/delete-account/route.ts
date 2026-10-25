import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createClient } from "@/utils/supabase/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
        const origin = request.headers.get("origin");
    const requestOrigin = new URL(request.url).origin;

    if (!origin || origin !== requestOrigin) {
      return NextResponse.json(
        { error: "Unauthorized request origin." },
        { status: 403 }
      );
    }
    const { confirmation, password } = await request.json();

    if (typeof password !== "string" || !password) {
  return NextResponse.json(
    { error: "Please enter your password to confirm account deletion." },
    { status: 400 }
  );
}

    if (confirmation !== "DELETE") {
      return NextResponse.json(
        { error: "Account deletion was not confirmed." },
        { status: 400 }
      );
    }

    // Identify the signed-in user securely.
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "You must be signed in." },
        { status: 401 }
      );
    }

    // Verify the user's password before permanently deleting the account.
if (!user.email) {
  return NextResponse.json(
    { error: "Unable to verify this account." },
    { status: 400 }
  );
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !publishableKey) {
  return NextResponse.json(
    { error: "Authentication is temporarily unavailable." },
    { status: 500 }
  );
}

const verificationClient = createAdminClient(
  supabaseUrl,
  publishableKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  }
);

const { data: verification, error: verificationError } =
  await verificationClient.auth.signInWithPassword({
    email: user.email,
    password,
  });

if (
  verificationError ||
  !verification.user ||
  verification.user.id !== user.id
) {
  return NextResponse.json(
    { error: "Incorrect password. Account was not deleted." },
    { status: 403 }
  );
}

    // Administrative credentials must stay on the server.
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("Account deletion server configuration is missing.");
      return NextResponse.json(
        { error: "Account deletion is temporarily unavailable." },
        { status: 500 }
      );
    }

    const admin = createAdminClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Foreign-key CASCADE removes saved recipes, usage events,
    // and feedback associated with this account.
    const { error: deleteError } =
      await admin.auth.admin.deleteUser(user.id);

    if (deleteError) {
      console.error("Account deletion failed:", deleteError);
      return NextResponse.json(
        { error: "Unable to delete your account. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Account deletion error:", error);

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}