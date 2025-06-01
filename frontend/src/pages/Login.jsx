// src/pages/Login.jsx
import { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate("/admin"); // после успешной авторизации
    } catch {
      alert("Неверные учётные данные");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl mb-4">Вход в админку</h1>
      <input type="email" placeholder="Email" required
        value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Пароль" required
        value={password} onChange={e => setPassword(e.target.value)} />
      <button type="submit">Войти</button>
    </form>
  );
}
