"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "../context/auth-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs"
import { Button } from "@/app/components/ui/button"
import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar"
import { Upload, User } from "lucide-react"
import { registerUser } from "@/app/services/api"

type AuthModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthModal({ open, onOpenChange }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState("login")
  const [error, setError] = useState('')
  const [profileImage, setProfileImage] = useState<string | null>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    // TODO: Implement login logic
    console.log("Login:", { email, password })
    onOpenChange(false)
  }

  const { setUser } = useAuth()

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const userData = {
      email: formData.get("email") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      username: formData.get("username") as string,
      password: formData.get("password") as string,
      profilePicture: profileImage,
    }

    try {
      const response = await registerUser(userData);
      const { success, access_token } = response;

      if (success) {
        const fullUser = { ...userData, accessToken: access_token }
        localStorage.setItem("token", access_token)
        localStorage.setItem("user", JSON.stringify(userData))
        setUser(fullUser)
        onOpenChange(false)
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.log("Error while trying to register: ", error)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to Today's Lunch</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 mt-6">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input id="login-email" name="email" type="email" placeholder="Enter your email" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input id="login-password" name="password" type="password" placeholder="Enter your password" required />
              </div>

              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              {"Don't have an account? "}
              <button type="button" onClick={() => setActiveTab("register")} className="text-primary hover:underline">
                Sign up
              </button>
            </div>
          </TabsContent>

          <TabsContent value="register" className="space-y-4 mt-6">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={profileImage || undefined} />
                    <AvatarFallback>
                      <User className="w-8 h-8" />
                    </AvatarFallback>
                  </Avatar>
                  <label
                    htmlFor="profile-upload"
                    className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors"
                  >
                    <Upload className="w-3 h-3" />
                  </label>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Profile picture (optional)</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" placeholder="John" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" placeholder="Doe" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" placeholder="johndoe" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input id="register-email" name="email" type="email" placeholder="john@example.com" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <Input
                  id="register-password"
                  name="password"
                  type="password"
                  placeholder="Create a password"
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <button type="button" onClick={() => setActiveTab("login")} className="text-primary hover:underline">
                Login
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
