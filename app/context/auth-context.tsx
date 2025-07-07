"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { jwtDecode } from "jwt-decode";

type User = {
  id: number,
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
    const token = sessionStorage.getItem("token")

    if (token) {
      const decodedToken: { exp: number } = jwtDecode(token)

      const currentTime = Date.now() / 1000
      if (decodedToken.exp > currentTime) {
        scheduleAutoLogout(decodedToken.exp)
      } else {
        logout()
      }
    }
  }, [])

  const scheduleAutoLogout = (exp: number) => {
    const msUntilLogout = (exp * 1000) - Date.now()
    if (msUntilLogout > 0) {
      setTimeout(() => {
        logout()
      }, msUntilLogout)
    } else {
      logout()
    }
  }

  const logout = () => {
    setUser(null)
    sessionStorage.removeItem("token")
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
