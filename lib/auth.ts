// This file can be removed or simplified if no other code depends on it.
// For now, we will just export the interfaces.

export interface User {
  id: string
  email: string
  name: string
  role: "tourist" | "researcher" | "admin"
  createdAt: string
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}