'use client'

import { useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { collection, getDocs } from 'firebase/firestore'
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

// 👇 Your user type
export interface FirebaseUser {
  uid: string
  email: string
  name?: string
  lastLogin?: any
  isLogin?: boolean
}

// ✅ Exportable function to reuse elsewhere
export async function getAllUsersFromFirestore(): Promise<FirebaseUser[]> {
  const snapshot = await getDocs(collection(firestore, 'users'))
  return snapshot.docs.map(doc => doc.data() as FirebaseUser)
}

// ✅ Main component
export default function UserDashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<FirebaseUser[]>([])

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getAllUsersFromFirestore()
      setUsers(data)
    }

    fetchUsers()
  }, [])

  // ✅ Sort users: isLogin === true first, then currentUser first
  const sorted = [...users]
    .sort((a, b) => (b.isLogin ? 1 : 0) - (a.isLogin ? 1 : 0)) // isLogin true first
    .sort((a, b) => (a.uid === currentUser?.uid ? -1 : b.uid === currentUser?.uid ? 1 : 0)) // currentUser on top

  console.log('isLogin', sorted.map((data) => data.isLogin))
  console.log('lastLogin', sorted.map((data) =>
    data.lastLogin?.toDate?.() ? data.lastLogin.toDate().toLocaleString() : '—'
  ))

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
                <TableRow
                  key={u.uid}
                >
                  <TableCell>
                    {u.uid === currentUser?.uid && u.isLogin && (
                      <span className="h-2 w-2 rounded-full bg-blue-500 inline-block" />
                    )}
                    {/* {u.isLogin && (
                      <span className="ml-2 px-2 py-0.5 text-xs rounded bg-green-200 text-green-800">
                        Online
                      </span>
                    )} */}
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
