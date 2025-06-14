'use client'

import { useRouter } from "next/navigation"
import { useState } from "react"
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth"
import { ref, set } from "firebase/database"
import { auth, db } from "@/lib/firebase"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function SignupForm({ className, ...props }: React.ComponentProps<"div">) {
  const router = useRouter()
  const [error, setError] = useState("")

  const signup = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")

    const inputEmail = (document.getElementById("email") as HTMLInputElement).value
    const inputPassword = (document.getElementById("password") as HTMLInputElement).value

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, inputEmail, inputPassword)
      const firebaseUser = userCredential.user

      await sendEmailVerification(firebaseUser)

      const safeEmail = inputEmail.replace(/\./g, "_")
      const defaultName = inputEmail.split('@')[0]
      const defaultAvatar = "/black-car.jpg"

      // Save user to Realtime Database
      await set(ref(db, `users/${safeEmail}`), {
        name: defaultName,
        email: inputEmail,
        avatar: defaultAvatar,
      })

      const user = {
        name: defaultName,
        email: inputEmail,
        avatar: defaultAvatar,
      }

      // Save to localStorage
      localStorage.setItem("auth_user", JSON.stringify(user))
      localStorage.setItem("isLoggedIn", "true")

      alert("Verification email sent. Please check your inbox.")
      router.push("/") // or router.push("/verify-email") if you have a page

    } catch (err: any) {
      setError(err.message || "Signup failed")
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={signup} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Create an account</h1>
                <p className="text-muted-foreground text-balance">
                  Start your journey with Acme Inc
                </p>
              </div>
              {error && <p className="text-sm text-red-600 text-center">{error}</p>}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="m@example.com" required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
              <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                <span className="bg-card text-muted-foreground relative z-10 px-2">
                  Or continue with
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {/* Optional social buttons */}
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <a href="/login" className="underline underline-offset-4">
                  Login
                </a>
              </div>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/black-car.jpg"
              alt="Signup Visual"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By signing up, you agree to our <a href="#">Terms of Service</a> and{" "}
        <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
