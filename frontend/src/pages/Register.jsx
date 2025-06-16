import { useState } from "react"
import { useAuth } from "../AuthContext"
import { useNavigate } from "react-router-dom"

export default function Register() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await register(email, password)
    if (res.success) {
      navigate("/admin")
    } else {
      setError(res.message || "Ошибка регистрации")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl mb-4">Регистрация</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <input
        type="email"
        placeholder="Email"
        required
        className="w-full p-2 mb-3 border rounded"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Пароль"
        required
        className="w-full p-2 mb-4 border rounded"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Зарегистрироваться
      </button>
    </form>
  )
}
