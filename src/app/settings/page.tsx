'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function PageContent() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [saved, setSaved] = useState(false)

  // Load data from localStorage when page mounts
  useEffect(() => {
    const storedName = localStorage.getItem('userName') || 'John Doe'
    const storedEmail = localStorage.getItem('email') || 'john@example.com'
    setName(storedName)
    setEmail(storedEmail)
  }, [])

  // Save data to localStorage
  const handleSave = () => {
    localStorage.setItem('userName', name)
    localStorage.setItem('email', email)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">User Settings</h1>
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <Button onClick={handleSave}>Save Changes</Button>
          {saved && <p className="text-sm text-green-600">Changes saved successfully!</p>}
        </CardContent>
      </Card>
    </div>
  )
}
