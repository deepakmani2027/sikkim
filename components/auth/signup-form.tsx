"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { Loader2, Eye, EyeOff, Mail, User2, Lock, BadgeCheck } from "lucide-react"
import { toast } from "sonner"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"

interface SignupFormProps {
  onToggleMode: () => void
}

export function SignupForm({ onToggleMode }: SignupFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "" as "tourist" | "researcher" | "admin" | "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register, loading } = useAuth()

  // OTP state
  const [phase, setPhase] = useState<"form" | "otp">("form")
  const [otp, setOtp] = useState("")
  const isOtpComplete = otp.length === 6
  const [otpShake, setOtpShake] = useState(false)
  const [otpInvalid, setOtpInvalid] = useState(false)

  // InputOTP manages focus and caret automatically
  
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [resendIn, setResendIn] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setResendIn((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [resendIn])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (phase === "form") {
      if (!formData.name || !formData.email || !formData.password || !formData.role) {
        setError("Please fill in all fields")
        return
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        return
      }
      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters")
        return
      }

      // Step 1: Pre-check if account exists, then send OTP via our API route
      try {
        const exists = authService.emailExists(formData.email)
        if (exists) {
          setError("An account already exists for this email. Please sign in.")
          return
        }
        setSendingOtp(true)
        const resp = await fetch("/api/auth/send-otp", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        })
        if (!resp.ok) {
          const data = await resp.json().catch(() => ({}))
          throw new Error(data?.error || `Failed to send OTP (${resp.status})`)
        }
        try {
          const pending = {
            email: (formData.email || "").trim().toLowerCase(),
            name: formData.name,
            role: formData.role,
            password: formData.password,
            createdAt: Date.now(),
          }
          localStorage.setItem("sikkim_pending_signup", JSON.stringify(pending))
        } catch {}
        toast.success("OTP sent to your email")
        router.push("/auth/verify-otp")
      } catch (err: any) {
        setError(err?.message || "Failed to send OTP")
      } finally {
        setSendingOtp(false)
      }
    } else {
      // Step 2: Verify OTP via our API, then create local account
      const code = otp
      if (!code || code.length < 6) {
        setError("Enter the 6-digit OTP")
        return
      }
      try {
        setVerifyingOtp(true)
        const resp = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ code, email: formData.email }),
        })
        if (!resp.ok) {
          const data = await resp.json().catch(() => ({}))
          // Trigger shake on invalid code
          setOtpShake(true)
          setOtpInvalid(true)
          setTimeout(() => setOtpShake(false), 420)
          throw new Error(data?.error || `Invalid OTP (${resp.status})`)
        }

    const result = await register(
      formData.email,
      formData.password,
      formData.name,
      formData.role as "tourist" | "researcher" | "admin",
    )

    if (!result.success) {
      const errorMessage = result.error || "Registration failed. Please try again."
      if (errorMessage.toLowerCase().includes("already registered")) {
        toast.error("Account Exists", {
          description: "A user with this email is already registered. Please sign in instead.",
          action: {
            label: "Sign In",
            onClick: onToggleMode,
          },
        })
      } else if (errorMessage.toLowerCase().includes("already exists but is not verified")) {
        toast.info("Confirmation Resent", {
          description: "This email is already registered but not verified. We've sent a new confirmation link to your inbox.",
          duration: 10000,
        })
        onToggleMode() // Switch to login view as a cue
      } else {
        toast.error("Registration Failed", {
          description: errorMessage,
        })
      }
    } else {
      toast.success("Verification Email Sent!", {
        description: "Please check your email to verify your account before signing in.",
        duration: 10000,
      })
      onToggleMode()
    }
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // No extra handlers needed for InputOTP

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: "easeOut" }}>
      <Card className="w-full max-w-md mx-auto bg-card/80 backdrop-blur-12xl border-[0.5px] border-border/50 shadow-floating">
        <CardHeader className="text-center space-y-3">
          <div className="w-16 h-16 mx-auto bg-primary rounded-full flex items-center justify-center shadow-soft">
            <div className="text-2xl text-primary-foreground">🏛️</div>
          </div>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <BadgeCheck className="h-4 w-4" /> Create your account
          </div>
          <CardTitle className="text-2xl font-bold text-card-foreground">Join Our Community</CardTitle>
          <CardDescription className="text-muted-foreground">
            Create an account to explore Sikkim's monasteries
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground">
                Full Name
              </Label>
              <div className="relative">
                <User2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  placeholder="Enter your full name"
                  className="bg-input border-border pl-9"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  placeholder="Enter your email"
                  className="bg-input border-border pl-9"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-foreground">
                I am a...
              </Label>
              <Select value={formData.role} onValueChange={(value) => updateFormData("role", value)} disabled={loading}>
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tourist">Tourist - Explore and learn</SelectItem>
                  <SelectItem value="researcher">Researcher - Access archives</SelectItem>
                  <SelectItem value="admin">Admin - Manage content</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  placeholder="Create a password"
                  className="bg-input border-border pr-10 pl-9"
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                  placeholder="Confirm your password"
                  className="bg-input border-border pr-10 pl-9"
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {phase === "otp" && (
              <div className="space-y-3">
                <Label className="text-foreground flex items-center gap-2">
                  <KeyRound className="h-4 w-4" /> Enter 6‑digit OTP sent to your email
                </Label>
                <div className={`flex items-center justify-center ${otpShake ? "otp-shake" : ""}`}>
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(v) => { setOtp(v.replace(/\D/g, "")); setOtpInvalid(false) }}
                    containerClassName=""
                  >
                    <InputOTPGroup className="gap-2 sm:gap-3">
                      <InputOTPSlot index={0} className={`${otpInvalid ? "border-red-500 bg-red-50 text-red-600" : (isOtpComplete ? "bg-green-50 border-green-400" : "bg-input border-border")} border rounded-md`} />
                      <InputOTPSlot index={1} className={`${otpInvalid ? "border-red-500 bg-red-50 text-red-600" : (isOtpComplete ? "bg-green-50 border-green-400" : "bg-input border-border")} border rounded-md`} />
                      <InputOTPSlot index={2} className={`${otpInvalid ? "border-red-500 bg-red-50 text-red-600" : (isOtpComplete ? "bg-green-50 border-green-400" : "bg-input border-border")} border rounded-md`} />
                      <InputOTPSlot index={3} className={`${otpInvalid ? "border-red-500 bg-red-50 text-red-600" : (isOtpComplete ? "bg-green-50 border-green-400" : "bg-input border-border")} border rounded-md`} />
                      <InputOTPSlot index={4} className={`${otpInvalid ? "border-red-500 bg-red-50 text-red-600" : (isOtpComplete ? "bg-green-50 border-green-400" : "bg-input border-border")} border rounded-md`} />
                      <InputOTPSlot index={5} className={`${otpInvalid ? "border-red-500 bg-red-50 text-red-600" : (isOtpComplete ? "bg-green-50 border-green-400" : "bg-input border-border")} border rounded-md`} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{resendIn > 0 ? `Resend in ${resendIn}s` : "Didn't get the code?"}</span>
                  <Button
                    type="button"
                    variant="link"
                    className="p-0 h-auto"
                    disabled={resendIn > 0 || sendingOtp}
                    onClick={async () => {
                      try {
                        setSendingOtp(true)
                        const resp = await fetch("/api/auth/send-otp", {
                          method: "POST",
                          headers: { "content-type": "application/json" },
                          body: JSON.stringify({ email: formData.email }),
                        })
                        if (!resp.ok) {
                          const data = await resp.json().catch(() => ({}))
                          throw new Error(data?.error || `Failed to resend OTP (${resp.status})`)
                        }
                        setResendIn(60)
                        toast.success("OTP resent")
                      } catch (err: any) {
                        setError(err?.message || "Failed to resend OTP")
                      } finally {
                        setSendingOtp(false)
                      }
                    }}
                  >
                    <RotateCcw className="h-3.5 w-3.5 mr-1" /> Resend
                  </Button>
                </div>
              </div>
            )}

            {error && <div className="text-destructive text-sm text-center bg-destructive/10 p-2 rounded">{error}</div>}

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-elevated"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Registering...
                </>
              ) : (
                "Create Account"
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-primary hover:text-primary/80"
                onClick={onToggleMode}
              >
                Sign in here
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}