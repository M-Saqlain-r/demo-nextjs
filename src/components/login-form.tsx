'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  arrayUnion,
} from 'firebase/firestore'
import { auth, firestore } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = auth.currentUser
        if (!user) {
          setCheckingSession(false)
          return
        }

        const docSnap = await getDoc(doc(firestore, 'users', user.uid))
        const data = docSnap.exists() ? docSnap.data() : null

        if (data?.isLogin) {
          router.push('/')
        } else {
          await signOut(auth)
          setCheckingSession(false)
        }
      } catch {
        setCheckingSession(false)
      }
    }

    checkSession()
  }, [router])

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault()
  setError('')

  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password)
    const now = new Date()
    const userRef = doc(firestore, 'users', user.uid)

    // Get current login history
    const docSnap = await getDoc(userRef)
    const existingHistory = docSnap.exists() && Array.isArray(docSnap.data().loginHistory)
      ? docSnap.data().loginHistory
      : []

    // Add new login time and keep only the last 10
    const updatedHistory = [...existingHistory, now].slice(-11)

    // Save data to Firestore
    await setDoc(
      userRef,
      {
        uid: user.uid,
        email: user.email,
        name: user.email?.split('@')[0] || '',
        lastLogin: now,
        isLogin: true,
        loginHistory: updatedHistory,
      },
      { merge: true }
    )

    router.push('/')
  } catch (err: unknown) {
    setError(err instanceof Error ? err.message : 'Unknown login error.')
  }
}


  if (checkingSession) return <p className="p-4">Checking session...</p>

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleLogin} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-muted-foreground text-balance">
                  Sign in to continue to Acme Inc
                </p>
              </div>
              {error && <p className="text-sm text-red-600 text-center">{error}</p>}
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Login</Button>
              <p className="text-sm text-center text-muted-foreground">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="text-blue-600 hover:underline">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="/black-car.jpg"
              alt="Login Visual"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
