'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import {
  doc, getDoc, updateDoc as firestoreUpdateDoc,
  onSnapshot, collection, DocumentReference, DocumentData
} from 'firebase/firestore'
import { db, auth } from '@/lib/firebase'
import {
  Dialog, DialogTrigger, DialogContent, DialogHeader,
  DialogTitle, DialogDescription, DialogFooter
} from '@/components/ui/dialog'
import {
  Avatar, AvatarFallback, AvatarImage
} from '@/components/ui/avatar'
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu, SidebarMenuButton,
  SidebarMenuItem, useSidebar
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  IconUserCircle, IconLogout,
  IconDotsVertical, IconCreditCard,
  IconNotification
} from '@tabler/icons-react'

export function NavUser() {
  const { isMobile } = useSidebar()
  const router = useRouter()

  const [userData, setUserData] = useState<{
    uid: string,
    name: string,
    avatar: string,
    email: string
  } | null>(null)
  const [open, setOpen] = useState(false)

  // 🔁 Real-time Firestore listener to check for active user
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const users = snapshot.docs.map(doc => doc.data())
      const activeUser = users.find(u => u.isLogin === true)

      if (activeUser) {
        setUserData({
          uid: activeUser.uid,
          name: activeUser.name || activeUser.email.split('@')[0],
          avatar: activeUser.avatar || '/black-car.jpg',
          email: activeUser.email
        })
      } else {
        setUserData(null)
        router.push('/')
      }
    })

    return () => unsubscribe()
  }, [router])

  // 🚪 Logout
  const handleLogout = async () => {
    if (!userData) return
    try {
      const userRef = doc(db, 'users', userData.uid)
      await updateDoc(userRef, {
        isLogin: false,
        lastLogout: new Date()
      })

      await signOut(auth)
      setUserData(null)
      router.push('/')
    } catch (err) {
      console.error('🔴 Logout failed:', err)
    }
  }

  if (!userData) {
    return (
      <div className="flex justify-end p-4">
        <Button onClick={() => router.push('/login')}>Login</Button>
      </div>
    )
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg">
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={userData.avatar} alt={userData.name} />
                <AvatarFallback className="rounded-lg">{userData.name[0]}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userData.name}</span>
                <span className="text-muted-foreground truncate text-xs">{userData.email}</span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="min-w-56 rounded-lg" side={isMobile ? 'bottom' : 'right'} align="end" sideOffset={4}>
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback className="rounded-lg">{userData.name[0]}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userData.name}</span>
                  <span className="text-muted-foreground truncate text-xs">{userData.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                      setOpen(true)
                    }}
                    className="cursor-pointer flex items-center px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground rounded-sm"
                  >
                    <IconUserCircle className="mr-2" />
                    Account
                  </div>
                </DialogTrigger>

                <DialogContent className="!top-14 !right-6 left-auto origin-top-right w-[90%] max-w-sm rounded-lg shadow-lg animate-in fade-in zoom-in-90" style={{ position: 'absolute' }}>
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault()
                      const name = (document.getElementById('name') as HTMLInputElement).value
                      const avatar = (document.getElementById('avatar') as HTMLInputElement).value

                      await firestoreUpdateDoc(doc(db, 'users', userData.uid), {
                        name,
                        avatar,
                        updatedAt: Date.now(),
                      })

                      setUserData(prev => prev ? { ...prev, name, avatar } : null)
                      setTimeout(() => setOpen(false), 100)
                    }}
                  >
                    <DialogHeader>
                      <DialogTitle>Edit Account</DialogTitle>
                      <DialogDescription>You can update your account info here.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input id="name" defaultValue={userData.name} className="col-span-3" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="avatar" className="text-right">Avatar URL</Label>
                        <Input id="avatar" defaultValue={userData.avatar} className="col-span-3" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <Input id="email" value={userData.email} readOnly disabled className="col-span-3 opacity-50" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Save changes</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <DropdownMenuItem>
                <IconCreditCard className="mr-2" />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconNotification className="mr-2" />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <IconLogout className="mr-2" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

// Fix TS for updateDoc
async function updateDoc(
  userRef: DocumentReference<DocumentData, DocumentData>,
  data: { [key: string]: any }
) {
  return firestoreUpdateDoc(userRef, data)
}
