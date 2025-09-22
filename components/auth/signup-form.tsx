"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/use-auth"
import { authService } from "@/lib/auth"
import { Loader2, Eye, EyeOff, Mail, User2, Lock, BadgeCheck, KeyRound, RotateCcw } from "lucide-react"
import { toast } from "sonner"

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
  const [error, setError] = useState("")
  const { register, loading } = useAuth()

  // OTP state
  const [phase, setPhase] = useState<"form" | "otp">("form")
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]) 
  const isOtpComplete = otpDigits.every((d) => d && d.length === 1)
  const [otpShake, setOtpShake] = useState(false)
  const otpInputsRef = useRef<Array<HTMLInputElement | null>>([])

  // Autofocus first OTP box when phase switches to OTP
  useEffect(() => {
    if (phase === "otp") {
      const focusFirst = () => {
        const el = otpInputsRef.current[0]
        if (el) {
          el.focus()
          el.select?.()
        }
      }
      // Next tick for reliability
      const t = setTimeout(focusFirst, 100)
      return () => clearTimeout(t)
    }
  }, [phase])
  
  const [sendingOtp, setSendingOtp] = useState(false)
  const [verifyingOtp, setVerifyingOtp] = useState(false)
  const [resendIn, setResendIn] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setResendIn((s) => (s > 0 ? s - 1 : 0)), 1000)
    return () => clearInterval(t)
  }, [resendIn])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

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
      const code = otpDigits.join("")
      if (!code || code.length < 6) {
        setError("Enter the 6-digit OTP")
        return
      }
      try {
        setVerifyingOtp(true)
        const resp = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ code }),
        })
        if (!resp.ok) {
          const data = await resp.json().catch(() => ({}))
          // Trigger shake on invalid code
          setOtpShake(true)
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
          const msg = (result.error || "Registration failed").toLowerCase()
          if (msg.includes("already")) {
            setError("An account already exists for this email. Please sign in.")
          } else {
            setError(result.error || "Registration failed")
          }
        } else {
          toast.success("Email verified. Account created")
          router.push("/auth")
        }
      } catch (err: any) {
        setError(err?.message || "Invalid OTP")
      } finally {
        setVerifyingOtp(false)
      }
    }
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleOtpChange = (index: number, val: string) => {
    const input = (val || "").replace(/\D/g, "")
    
    if (!input) {
      // If backspace on empty field, focus previous
      setOtpDigits((prev) => {
        const next = [...prev]
        next[index] = ""
        return next
      })
      return
    }
    
    setOtpDigits((prev) => {
      const next = [...prev]
      next[index] = input[0] // Only take the first character
      return next
    })
    
    // Auto-focus to next input if current input is filled
    if (index < 5 && input) {
      setTimeout(() => {
        focusOtpIndex(index + 1)
      }, 10)
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault()
      
      if (otpDigits[index]) {
        // If current field has value, clear it but stay focused
        setOtpDigits((prev) => {
          const next = [...prev]
          next[index] = ""
          return next
        })
      } else if (index > 0) {
        // If current field is empty, move to previous field and clear it
        focusOtpIndex(index - 1)
        setOtpDigits((prev) => {
          const next = [...prev]
          next[index - 1] = ""
          return next
        })
      }
    }
    else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault()
      focusOtpIndex(index - 1)
    }
    else if (e.key === "ArrowRight" && index < 5) {
      e.preventDefault()
      focusOtpIndex(index + 1)
    }
    else if (e.key === "Delete") {
      e.preventDefault()
      setOtpDigits((prev) => {
        const next = [...prev]
        next[index] = ""
        return next
      })
    }
  }

  const handleOtpPaste = (startIndex: number, e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6 - startIndex)
    if (!text) return
    const arr = text.split("")
    setOtpDigits((prev) => {
      const next = [...prev]
      for (let i = 0; i < arr.length && startIndex + i < 6; i++) {
        next[startIndex + i] = arr[i]
      }
      return next
    })
    const nextIndex = Math.min(startIndex + arr.length, 5)
    setTimeout(() => {
      focusOtpIndex(nextIndex)
    }, 10)
  }

  const focusOtpIndex = (i: number) => {
    const el = otpInputsRef.current[i]
    if (!el) return
    
    requestAnimationFrame(() => {
      el.focus()
      el.select?.()
    })
  }

  // Handle auto-focus when digits are filled
  useEffect(() => {
    if (phase !== "otp") return
    
    // Find first empty field and focus it
    const firstEmptyIndex = otpDigits.findIndex(digit => digit === "")
    if (firstEmptyIndex !== -1) {
      // If there's an empty field, focus it
      setTimeout(() => {
        focusOtpIndex(firstEmptyIndex)
      }, 10)
    }
  }, [otpDigits, phase])

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
                  disabled={loading || phase === "otp"}
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
                  disabled={loading || phase === "otp"}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-foreground">
                I am a...
              </Label>
              <Select value={formData.role} onValueChange={(value) => updateFormData("role", value)} disabled={loading || phase === "otp"}>
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
                  disabled={loading || phase === "otp"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading || phase === "otp"}
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
                  disabled={loading || phase === "otp"}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading || phase === "otp"}
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
                <div className={`flex items-center justify-center gap-2 ${otpShake ? "otp-shake" : ""}`}>
                  {otpDigits.map((d, i) => (
                    <Input
                      key={i}
                      ref={(el) => (otpInputsRef.current[i] = el)}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={d}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      onPaste={(e) => handleOtpPaste(i, e)}
                      onFocus={(e) => e.currentTarget.select()}
                      placeholder="•"
                      className={`w-12 h-12 text-center text-xl font-semibold rounded-md transition-all duration-150 
                        ${d ? "text-foreground" : "text-muted-foreground"} 
                        ${d ? (isOtpComplete ? "bg-green-50 border-green-400" : "bg-input border-border") : "bg-background/60 border-border/70"} 
                        focus:ring-2 focus:ring-primary/50 focus:border-primary/60 focus:shadow-md focus:shadow-primary/10 
                        data-[empty=true]:placeholder-opacity-60 
                        tracking-widest`}
                      data-empty={d ? "false" : "true"}
                      aria-label={`OTP digit ${i + 1}`}
                      autoComplete={i === 0 ? "one-time-code" : undefined}
                      disabled={loading}
                      onKeyPress={(e) => {
                        if (!/[0-9]/.test(e.key)) {
                          e.preventDefault()
                        }
                      }}
                    />
                  ))}
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
              disabled={loading || sendingOtp || verifyingOtp}
            >
              {phase === "form" ? (
                sendingOtp ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending OTP...
                  </>
                ) : (
                  "Send OTP"
                )
              ) : verifyingOtp ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
                </>
              ) : (
                "Verify & Create Account"
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