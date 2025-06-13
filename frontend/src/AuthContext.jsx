// src/AuthContext.jsx
import { createContext, useState, useEffect, useContext } from "react"
import axios from "axios"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"))
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      localStorage.setItem("token", token)
      try {
        const payload = JSON.parse(atob(token.split(".")[1]))
        setUser({ email: payload.sub, isAdmin: payload.is_superuser })
      } catch (error) {
        console.error("Ошибка разбора токена:", error)
        logout()
      }
    } else {
      delete axios.defaults.headers.common["Authorization"]
      localStorage.removeItem("token")
      setUser(null)
    }
  }, [token])

  const login = async (email, password) => {
    try {
      const res = await axios.post('${import.meta.env.VITE_API_URL}/auth/login', {
        email,
        password
      })
      setToken(res.data.access_token)
      return { success: true }
    } catch (err) {
      console.error("Ошибка входа:", err.response?.data || err.message)
      return {
        success: false,
        message:
          err.response?.data?.detail || "Неверный email или пароль"
      }
    }
  }

  const register = async (email, password) => {
    try {
      await axios.post('${import.meta.env.VITE_API_URL}/auth/register', {
        email,
        password
      })
      // успешная регистрация → логиним
      return await login(email, password)
    } catch (err) {
      console.error("Ошибка регистрации:", err.response?.data || err.message)
      return {
        success: false,
        message:
          err.response?.data?.detail || "Ошибка при регистрации"
      }
    }
  }

  const logout = () => {
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ token, user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
