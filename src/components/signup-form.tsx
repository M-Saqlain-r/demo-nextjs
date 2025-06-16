'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export function SignupForm({ className, ...props }: React.ComponentProps<'div'>) {
  const router = useRouter()
  const [error, setError] = useState('')

  const signup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const email = (document.getElementById('email') as HTMLInputElement).value
    const password = (document.getElementById('password') as HTMLInputElement).value

    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCred.user

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        name: user.email?.split('@')[0],
        createdAt: new Date(user.metadata.creationTime ?? Date.now()).getTime(),
        lastLogin: Date.now(),
      })

      router.push('/login')
    } catch (err: any) {
      setError(err.message || 'Signup failed')
    }
  }

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
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
                <Input id="email" type="email" required />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">Sign Up</Button>
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
    </div>
  )
}
