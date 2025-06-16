'use client'

import { useEffect, useState } from 'react'
import {
  collection, onSnapshot, updateDoc,
  deleteDoc, doc, addDoc
} from 'firebase/firestore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { debounce } from 'lodash'
import { db } from '@/lib/firebase' // ✅ Safe, app is already initialized


interface FirebaseUser {
  uid: string
  email: string
  name?: string
  isLogin?: boolean
}

interface Task {
  id: string
  title: string
  completed: boolean
}

export default function TaskDashboard() {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [filtered, setFiltered] = useState<Task[]>([])
  const [newTask, setNewTask] = useState('')
  const [search, setSearch] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [sortAscending, setSortAscending] = useState(true)

  // ✅ Live check for active logged-in user (isLogin === true)
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), snapshot => {
      const users = snapshot.docs.map(doc => doc.data() as FirebaseUser)
      const active = users.find(u => u.isLogin === true)
      setUser(active || null)
    })

    return () => unsubscribe()
  }, [])

  // ✅ Listen to task changes
  useEffect(() => {
    if (!user) return

    const taskRef = collection(db, 'users', user.uid, 'tasks')
    const unsubscribe = onSnapshot(taskRef, snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Task[]
      setTasks(data)
    })

    return () => unsubscribe()
  }, [user])

  // ✅ Filter & Sort
  useEffect(() => {
    const debounced = debounce(() => {
      const searchLower = search.toLowerCase()
      const result = tasks.filter(task =>
        task.title.toLowerCase().includes(searchLower)
      )

      const sorted = result.sort((a, b) =>
        sortAscending
          ? Number(a.completed) - Number(b.completed)
          : Number(b.completed) - Number(a.completed)
      )

      setFiltered(sorted)
    }, 200)

    debounced()
    return () => debounced.cancel()
  }, [tasks, search, sortAscending])

  // ➕ Add task
  const addTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !newTask.trim()) return

    const taskRef = collection(db, 'users', user.uid, 'tasks')
    await addDoc(taskRef, { title: newTask, completed: false })
    setNewTask('')
  }

  // ✅ Edit/Update/Delete
  const toggleComplete = async (task: Task) => {
    if (!user) return
    const ref = doc(db, 'users', user.uid, 'tasks', task.id)
    await updateDoc(ref, { completed: !task.completed })
  }

  const deleteTask = async (task: Task) => {
    if (!user) return
    const ref = doc(db, 'users', user.uid, 'tasks', task.id)
    await deleteDoc(ref)
  }

  const startEdit = (task: Task) => {
    setEditingId(task.id)
    setEditTitle(task.title)
  }

  const saveEdit = async (task: Task) => {
    if (!user || !editTitle.trim()) return
    const ref = doc(db, 'users', user.uid, 'tasks', task.id)
    await updateDoc(ref, { title: editTitle })
    setEditingId(null)
    setEditTitle('')
  }

  // 🔒 Access control
  if (!user) return <p className="p-4">Please log in to manage tasks.</p>

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>My Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          {/* 🔍 Search & Sort Controls */}
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="flex-1"
            />
            <Button variant="outline" onClick={() => setSortAscending(!sortAscending)}>
              Sort: {sortAscending ? 'Pending First' : 'Done First'}
            </Button>
          </div>

          {/* ➕ Add Task */}
          <form onSubmit={addTask} className="flex gap-2 mb-4">
            <Input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="Enter new task..."
              className="flex-1"
            />
            <Button type='submit'>Add</Button>
          </form>

          {/* 📋 Task Table */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map(task => (
                <TableRow key={task.id}>
                  <TableCell>
                    {editingId === task.id ? (
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(task)
                          if (e.key === 'Escape') setEditingId(null)
                        }}
                        autoFocus
                      />
                    ) : (
                      <span className={task.completed ? 'line-through' : ''}>
                        {task.title}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>{task.completed ? 'Done' : 'Pending'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant="outline"
                        onClick={() =>
                          editingId === task.id ? saveEdit(task) : startEdit(task)
                        }
                      >
                        {editingId === task.id ? 'Save' : 'Edit'}
                      </Button>
                      <Button variant="outline" onClick={() => toggleComplete(task)}>
                        {task.completed ? 'Undo' : 'Complete'}
                      </Button>
                      <Button variant="destructive" onClick={() => deleteTask(task)}>
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No tasks found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
