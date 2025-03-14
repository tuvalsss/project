import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useState, useEffect } from "react"
import { jwtDecode } from "jwt-decode"

import {
  LoginService,
  type UserPublic,
  UsersService,
} from "@/client"
import { ApiError } from "@/client/core/ApiError"
import { handleError } from "@/utils"

interface LoginFormData {
  username: string
  password: string
}

interface JwtPayload {
  exp: number
  sub: string
}

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded = jwtDecode(token) as JwtPayload
    return decoded.exp * 1000 < Date.now()
  } catch {
    return true
  }
}

const isLoggedIn = () => {
  const token = localStorage.getItem("access_token")
  return token !== null && !isTokenExpired(token)
}

interface User {
  id: string
  email: string
  full_name?: string
  role: string
}

export const useAuth = () => {
  const [user, setUser] = useState<UserPublic | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const validateToken = async () => {
    try {
      await LoginService.testToken()
      return true
    } catch {
      return false
    }
  }

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('access_token')
        if (!token) {
          setUser(null)
          return
        }

        if (isTokenExpired(token) || !(await validateToken())) {
          localStorage.removeItem("access_token")
          navigate({ to: "/login" })
          return
        }

        const userData = await UsersService.readUserMe()
        setUser(userData)
      } catch (error) {
        console.error('Error loading user:', error)
        setUser(null)
        if (error instanceof ApiError && error.status === 401) {
          navigate({ to: "/login" })
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()

    const tokenCheckInterval = setInterval(async () => {
      const token = localStorage.getItem('access_token')
      if (token && (isTokenExpired(token) || !(await validateToken()))) {
        localStorage.removeItem("access_token")
        navigate({ to: "/login" })
      }
    }, 5 * 60 * 1000) // Check every 5 minutes

    return () => clearInterval(tokenCheckInterval)
  }, [navigate])

  const signUpMutation = useMutation({
    mutationFn: (data: { email: string; password: string; full_name?: string }) =>
      UsersService.registerUser({ requestBody: data }),
    onSuccess: () => {
      navigate({ to: "/login" })
    },
    onError: (err: ApiError) => {
      handleError(err)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] })
    },
  })

  const login = async (data: LoginFormData) => {
    const response = await LoginService.loginAccessToken({
      formData: {
        username: data.username,
        password: data.password,
        grant_type: "password",
      },
    })
    localStorage.setItem("access_token", response.access_token)
  }

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate({ to: "/" })
    },
    onError: (err: ApiError) => {
      handleError(err)
      setError(err.message)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] })
    },
  })

  const logout = () => {
    localStorage.removeItem("access_token")
    queryClient.clear()
    navigate({ to: "/login" })
  }

  return {
    signUpMutation,
    loginMutation,
    logout,
    user,
    isLoading,
    error,
    resetError: () => setError(null),
  }
}

export { isLoggedIn }
export default useAuth
