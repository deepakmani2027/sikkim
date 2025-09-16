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

class AuthService {
  private storageKey = "sikkim_monasteries_auth"

  getAuthState(): AuthState {
    if (typeof window === "undefined") {
      return { user: null, isAuthenticated: false }
    }

    try {
      const stored = localStorage.getItem(this.storageKey)
      if (stored) {
        const authData = JSON.parse(stored)
        return {
          user: authData.user,
          isAuthenticated: true,
        }
      }
    } catch (error) {
      console.error("Error reading auth state:", error)
    }

    return { user: null, isAuthenticated: false }
  }

  async login(email: string, password: string): Promise<{ success: boolean; error?: string; user?: User }> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Get users from localStorage
    const users = this.getUsers()
    const user = users.find((u) => u.email === email)

    if (!user) {
      return { success: false, error: "User not found" }
    }

    // In a real app, you'd verify the password hash
    // For demo purposes, we'll accept any password
    const authData = { user }
    localStorage.setItem(this.storageKey, JSON.stringify(authData))

    return { success: true, user }
  }

  async register(
    email: string,
    password: string,
    name: string,
    role: "tourist" | "researcher" | "admin",
  ): Promise<{ success: boolean; error?: string; user?: User }> {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const users = this.getUsers()

    if (users.find((u) => u.email === email)) {
      return { success: false, error: "User already exists" }
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    localStorage.setItem("sikkim_monasteries_users", JSON.stringify(users))

    const authData = { user: newUser }
    localStorage.setItem(this.storageKey, JSON.stringify(authData))

    return { success: true, user: newUser }
  }

  logout(): void {
    localStorage.removeItem(this.storageKey)
  }

  private getUsers(): User[] {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem("sikkim_monasteries_users")
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }
}

export const authService = new AuthService()
