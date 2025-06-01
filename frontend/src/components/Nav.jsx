import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function Nav({ totalCount }) {
  const { token, user, logout } = useAuth();

  return (
    <nav className="bg-gray-100 p-4 flex justify-between items-center">
      {/* Левый блок навигации */}
      <div className="flex items-center gap-4">
        <Link to="/" className="text-2xl font-bold text-yellow-600">
          🛍 RenaultParts
        </Link>

        {/* Кнопка корзины — доступна всем */}
        <Link to="/cart" className="text-green-600 hover:underline">
          🛒 Корзина {totalCount > 0 && `(${totalCount})`}
        </Link>



        {/* Только для админа */}
        {token && user?.isAdmin && (
          <>
            <Link to="/admin" className="text-blue-600 hover:underline">
              ⚙️ Админка
            </Link>
            <Link to="/admin/orders" className="text-blue-600 hover:underline">
              📦 Заказы
            </Link>
            <Link to="/admin/categories" className="text-blue-600 hover:underline">
              📂 Категории
            </Link>
                   
          </>
        )}
      </div>

      {/* Правый блок (вход/выход) */}
      <div className="flex items-center gap-4">
        {!token ? (
          <>
            <Link to="/login" className="text-blue-600 hover:underline">
              Войти
            </Link>
            <Link to="/register" className="text-blue-600 hover:underline">
              Регистрация
            </Link>
          </>
        ) : (
          <button onClick={logout} className="text-red-600 hover:underline">
            Выйти
          </button>
        )}
      </div>
    </nav>
  );
}
