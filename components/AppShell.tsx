'use client'

import { useUser } from './UserContext'
import UserSelect from './UserSelect'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { user } = useUser()

  if (!user) return <UserSelect />

  return <>{children}</>
}