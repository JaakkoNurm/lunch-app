"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type User = {
  email: string
  firstName: string
  lastName: string
  username: string
  profilePicture?: string | null
  accessToken: string
}

type AuthContextType = {
  user: User | null
  setUser: (user: User | null) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Optionally load user from localStorage/token
    const token = localStorage.getItem("token")
    if (token) {
      // This would be replaced with real logic to fetch user info
      const storedUser = JSON.parse(localStorage.getItem("user") || "null")
      if (storedUser) setUser({ ...storedUser, accessToken: token })
    }
  }, [])

  const logout = () => {
    setUser(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
