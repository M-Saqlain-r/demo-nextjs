'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { collection, onSnapshot } from 'firebase/firestore'
import { auth } from '@/lib/firebase'
import { getFirestore } from 'firebase/firestore'

const firestore = getFirestore()

import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow
} from '@/components/ui/table'
import {
  Card, CardHeader, CardTitle, CardContent
} from '@/components/ui/card'

export interface FirebaseUser {
  uid: string
  email: string
  name?: string
  lastLogin?: any
  isLogin?: boolean
}

export default function UserDashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<FirebaseUser[]>([])

  // Track the currently authenticated user
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
    })
    return () => unsub()
  }, [])

  // Real-time Firestore listener for 'users' collection
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'users'), (snapshot) => {
      const data = snapshot.docs.map(doc => doc.data() as FirebaseUser)
      setUsers(data)
    })

    return () => unsubscribe()
  }, [])

  // Sort: isLogin === true first, then currentUser first
  const sorted = [...users]
    .sort((a, b) => (b.isLogin ? 1 : 0) - (a.isLogin ? 1 : 0))
    .sort((a, b) => (a.uid === currentUser?.uid ? -1 : b.uid === currentUser?.uid ? 1 : 0))

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Last Login</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((u) => (
                <TableRow key={u.uid}>
                  <TableCell>
                    {u.isLogin && (
                      <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />
                    )}
                  </TableCell>
                  <TableCell>{u.email || '—'}</TableCell>
                  <TableCell>{u.name || '—'}</TableCell>
                  <TableCell>
                    {u.lastLogin?.toDate?.()
                      ? u.lastLogin.toDate().toLocaleString()
                      : '—'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
