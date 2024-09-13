'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import useUserStore from '@/Store/userStore'
import { checkUserAuth, logout } from '@/services/auth.service'
import Header from '@/app/components/Header'
import Loader from '@/lib/Loader'

export default function LayoutWrapper({ children }) {
  const { user, setUser, clearUser } = useUserStore()
  const router = useRouter()
  const pathname = usePathname()
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const isLoginPage = pathname === '/user-login'

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await checkUserAuth()
        if (response?.isAuthenticated) {
          setUser(response?.user)
          setIsAuthenticated(true)
        } else {
          await handleLogout()
        }
      } catch (error) {
        console.error('Authentication check failed:', error)
        await handleLogout()
      } finally {
        setLoading(false)
      }
    }

    const handleLogout = async () => {
      clearUser()
      setIsAuthenticated(false)
      try {
        await logout() // Call the logout API
      } catch (error) {
        console.error('Logout failed:', error)
      }
      if (!isLoginPage) {
        router.push('/user-login')
      }
    }

    if (!isLoginPage) {
      checkAuth()
    } else {
      setLoading(false)
    }
  }, [isLoginPage, router, setUser, clearUser])

  if (loading) {
    return <Loader />
  }

  if (!isAuthenticated && !isLoginPage) {
    return <Loader />
  }

  return (
    <>
      {!isLoginPage && isAuthenticated && <Header />}
      {(isAuthenticated || isLoginPage) && children}
    </>
  )
}