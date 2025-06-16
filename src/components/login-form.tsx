'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  updateDoc,
  getDoc,
  arrayUnion,
} from 'firebase/firestore';
import { auth, firestore } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
// import { response } from './data-table'
export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [checkingSession, setCheckingSession] = useState(true);
  // let api = response();
  // console.log(api);


  // ✅ Check Firestore directly to see if user is marked logged in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setCheckingSession(false);
          return;
        }

        const docSnap = await getDoc(doc(firestore, 'users', user.uid));
        const data = docSnap.exists() ? docSnap.data() : null;

        if (data?.isLogin) {
          router.push('/');
        } else {
          await signOut(auth); // ensure clean state
          setCheckingSession(false);
        }
      } catch {
        setCheckingSession(false);
      }
    };

    checkSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const now = new Date();
      const userRef = doc(firestore, 'users', user.uid);

      await setDoc(
        userRef,
        {
          uid: user.uid,
          email: user.email,
          name: user.email?.split('@')[0] || '',
          lastLogin: now,
          isLogin: true,
        },
        { merge: true }
      );

      await updateDoc(userRef, {
        loginHistory: arrayUnion(now),
      });

      router.push('/');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Unknown login error.');
    }
  };

  if (checkingSession) return <p className="p-4">Checking session...</p>;

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleLogin} className="space-y-4">
          <h2 className="text-xl font-bold">Login</h2>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Login
          </Button>
          <p className="text-sm text-center text-muted-foreground mt-2">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
