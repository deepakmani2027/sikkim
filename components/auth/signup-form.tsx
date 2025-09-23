"use client"

import type React from "react"

import { useState } from "react"
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

=======
>>>>>>> Stashed changes
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.password || !formData.role) {
      toast.error("Please fill in all fields")
      return
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
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

            {/* Error display is now handled by toasts */}

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