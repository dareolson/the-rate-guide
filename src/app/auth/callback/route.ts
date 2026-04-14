// Handles Supabase auth redirects (email confirmation, OAuth, etc.)
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code  = searchParams.get("code");
  const next  = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      // Bad or expired confirmation link — send back to login with a message
      return NextResponse.redirect(`${origin}/login?error=confirmation_failed`);
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
