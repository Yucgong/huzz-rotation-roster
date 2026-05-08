'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type User = string | null

const UserContext = createContext<{
  user: User
  setUser: (name: string) => void
  clearUser: () => void
}>({
  user: null,
  setUser: () => {},
  clearUser: () => {},
})

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('huzz_user')
    if (saved) setUserState(saved)
    setMounted(true)
  }, [])

  const setUser = (name: string) => {
    localStorage.setItem('huzz_user', name)
    setUserState(name)
  }

  const clearUser = () => {
    localStorage.removeItem('huzz_user')
    setUserState(null)
  }

  if (!mounted) return null

  return (
    <UserContext.Provider value={{ user, setUser, clearUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}