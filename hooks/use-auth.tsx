"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { authService, type AuthState } from "@/lib/auth"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (
    email: string,
    password: string,
    name: string,
    role: "tourist" | "researcher" | "admin",
  ) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({ user: null, isAuthenticated: false })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const state = authService.getAuthState()
    setAuthState(state)
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    const result = await authService.login(email, password)

    if (result.success && result.user) {
      setAuthState({ user: result.user, isAuthenticated: true })
    }

    setLoading(false)
    return result
  }

  const register = async (email: string, password: string, name: string, role: "tourist" | "researcher" | "admin") => {
    setLoading(true)
    const result = await authService.register(email, password, name, role)

    if (result.success && result.user) {
      setAuthState({ user: result.user, isAuthenticated: true })
    }

    setLoading(false)
    return result
  }

  const logout = () => {
    authService.logout()
    setAuthState({ user: null, isAuthenticated: false })
  }

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
