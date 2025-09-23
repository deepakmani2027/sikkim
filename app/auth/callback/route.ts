import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function GET(req: Request) {
  try {
    // For Supabase PKCE/code exchange handled on client via detectSessionInUrl.
    // This route simply redirects back to dashboard.
    return NextResponse.redirect(new URL("/dashboard", req.url))
  } catch {
    return NextResponse.redirect(new URL("/auth?error=callback", req.url))
  }
}


