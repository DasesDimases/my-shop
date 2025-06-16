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
<<<<<<< HEAD
      navigate("/catalog"); 
=======
      navigate("/catalog");
>>>>>>> 4eaa1782 (Auto update)
    } catch {
      alert("Неверные учётные данные");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-6">
      <h1 className="text-2xl mb-4">Вход в аккаунт</h1>
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
        Войти
      </button>
    </form>
  );
}
