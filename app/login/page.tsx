"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Default credentials
    const defaultUsername = "Admin"
    const defaultPassword = "Admin@123$"

    if (username === defaultUsername && password === defaultPassword) {
      toast({
        title: "Login Successful!",
        description: "Redirecting to dashboard...",
        duration: 2000,
      })
      // In a real app, you'd set a session/token here
      router.push("/dashboard") // Redirect to the new dashboard page
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid username or password.",
        variant: "destructive",
        duration: 3000,
      })
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-foreground">
      <Card className="w-full max-w-md bg-card bg-foreground01 text-background border-border shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Login</CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="bg-input text-foreground border-border focus:ring-ring"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Admin@123$"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-input text-foreground border-border focus:ring-ring"
              />
            </div>
            <Button type="submit" className="bg-[var(--chart-6)] text-black hover:bg-[var(--chart-7)]">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  )
}
