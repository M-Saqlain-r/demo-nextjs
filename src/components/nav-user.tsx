'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/lib/firebase'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { ref, get, set } from 'firebase/database'

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

import {
  IconUserCircle,
  IconLogout,
  IconDotsVertical,
  IconCreditCard,
  IconNotification,
} from '@tabler/icons-react'

export function NavUser() {
  const { isMobile } = useSidebar()
  const router = useRouter()

  const [user, setUser] = useState<{ name: string; email: string; avatar: string } | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('auth_user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
      setIsLoggedIn(true)
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const safeEmail = firebaseUser.email!.replace(/\./g, '_')
        const userRef = ref(db, `users/${safeEmail}`)
        const snapshot = await get(userRef)

        const name = snapshot.exists() ? snapshot.val().name : firebaseUser.email!.split('@')[0]
        const avatar = snapshot.exists() ? snapshot.val().avatar : '/black-car.jpg'

        const newUser = {
          name,
          email: firebaseUser.email!,
          avatar,
        }

        setUser(newUser)
        setIsLoggedIn(true)
        localStorage.setItem('auth_user', JSON.stringify(newUser))
      } else {
        setUser(null)
        setIsLoggedIn(false)
        localStorage.removeItem('auth_user')
      }
    })

    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    await signOut(auth)
    setUser(null)
    setIsLoggedIn(false)
    localStorage.removeItem('auth_user')
    router.push('/')
  }

  if (!isLoggedIn) {
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
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="rounded-lg">{user?.name[0]}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.name}</span>
                <span className="text-muted-foreground truncate text-xs">{user?.email}</span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="rounded-lg">{user?.name[0]}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name}</span>
                  <span className="text-muted-foreground truncate text-xs">{user?.email}</span>
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

                <DialogContent
                  className="!top-14 !right-6 translate-x-0 translate-y-0 left-auto origin-top-right w-[90%] max-w-sm rounded-lg shadow-lg animate-in fade-in zoom-in-90"
                  style={{ position: 'absolute' }}
                >
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault()
                      const nameInput = (document.getElementById('name') as HTMLInputElement).value
                      const avatarInput = (document.getElementById('avatar') as HTMLInputElement).value
                      const safeEmail = user!.email.replace(/\./g, '_')
                      const userRef = ref(db, `users/${safeEmail}`)

                      await set(userRef, {
                        name: nameInput,
                        avatar: avatarInput,
                      })

                      const updatedUser = { ...user!, name: nameInput, avatar: avatarInput }
                      setUser(updatedUser)
                      localStorage.setItem('auth_user', JSON.stringify(updatedUser))

                      // Ensures dialog popup closes reliably
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
                        <Input id="name" defaultValue={user?.name} className="col-span-3" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="avatar" className="text-right">Avatar URL</Label>
                        <Input id="avatar" defaultValue={user?.avatar} className="col-span-3" required />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">Email</Label>
                        <Input id="email" value={user?.email} readOnly disabled className="col-span-3 opacity-50" />
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
              <IconLogout />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
