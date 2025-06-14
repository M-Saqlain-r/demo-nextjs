'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { ref, get } from 'firebase/database'
import { auth, db } from '@/lib/firebase'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card'
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table'

interface UserData {
  uid: string
  email: string
  createdAt: string
  lastSignInTime: string
  name?: string
  avatar?: string
}

export default function UserDashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<UserData[]>([])

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setCurrentUser(firebaseUser)
    })
    return () => unsubscribe()
  }, [])

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/all-users')
      const data = await res.json()

      const enrichedUsers = await Promise.all(
        data.users.map(async (user: any) => {
          const safeEmail = user.email.replace(/\./g, '_')
          const snapshot = await get(ref(db, `users/${safeEmail}`))
          const profile = snapshot.val() || {}

          return {
            uid: user.uid,
            email: user.email,
            createdAt: user.createdAt,
            lastSignInTime: user.lastSignInTime,
            name: profile.name || user.email.split('@')[0],
            avatar: profile.avatar || '/default-avatar.png',
          }
        })
      )

      setUsers(enrichedUsers)
    }

    fetchUsers()
  }, [])

  const sortedUsers = [...users].sort((a, b) => {
    if (a.uid === currentUser?.uid) return -1
    if (b.uid === currentUser?.uid) return 1
    return 0
  })

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
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Last Login</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedUsers.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell className="flex items-center gap-2">
                    {currentUser?.uid === user.uid && (
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                    )}
                    {user.name}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleString()
                      : 'N/A'}
                  </TableCell>
                  <TableCell>
                    {user.lastSignInTime
                      ? new Date(user.lastSignInTime).toLocaleString()
                      : 'N/A'}
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
