'use client'

import { useEffect, useState } from 'react'

export default function AllUsersClient() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/all-users")
      const data = await res.json()
      setUsers(data.users || [])
    }
    fetchUsers()
  }, [])
  console.log(users);

  return (
    <div>
      <h2>All Firebase Users</h2>
      {users.map((user: any) => (
        <div key={user.uid}>
          {user.email} ({user.displayName || 'No name'})
        </div>
      ))}
    </div>
  )
}
