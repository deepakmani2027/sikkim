"use client"

import { Button } from "@/components/ui/button"
import { supabase, isSupabaseEnabled } from "@/lib/supabase"
import { FcGoogle } from "react-icons/fc"
import { SiX } from "react-icons/si"

export function SocialAuthButtons() {
  const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined

  const signIn = async (provider: "google" | "twitter") => {
    if (!isSupabaseEnabled() || !supabase) return
    await supabase.auth.signInWithOAuth({ provider, options: { redirectTo } })
  }

  return (
    <div className="grid grid-cols-1 gap-2">
      <Button type="button" variant="outline" onClick={() => signIn("google")} className="bg-yellow-200">
        <span className="inline-flex items-center gap-2"><FcGoogle /> Continue with Google</span>
      </Button>
      <Button type="button" variant="outline" onClick={() => signIn("twitter")} className="bg-yellow-200">
        <span className="inline-flex items-center gap-2"><SiX /> Continue with Twitter</span>
      </Button>
    </div>
  )
}


