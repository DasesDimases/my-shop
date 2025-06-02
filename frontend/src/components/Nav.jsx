import { Link } from "react-router-dom";
import { useAuth } from "../AuthContext";
import { ShoppingCart, LogIn, UserPlus, LogOut, LayoutGrid } from "lucide-react";

export default function Nav({ totalCount }) {
  const { token, user, logout } = useAuth();

  return (
    <nav
      className="shadow sticky top-0 z-50"
      style={{
        background: `linear-gradient(90deg, #222 0%, #444 30%, #FDE047 100%)`,
      }}
    >
      <div className="container mx-auto flex flex-wrap justify-between items-center py-3 px-4">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 text-2xl font-bold"
            style={{
              color: "#fde047", 
              textShadow: "1px 1px 2px #222"
            }}
          >
            <LayoutGrid size={28} />
            RenaultParts
          </Link>
          <Link
            to="/cart"
            className="flex items-center gap-1 font-medium hover:underline transition"
            style={{ color: "#F9E79F" }} 
          >
            <ShoppingCart size={22} />
            Корзина {totalCount > 0 && (
              <span className="ml-1 text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full">
                {totalCount}
              </span>
            )}
          </Link>

          <Link
            to="/catalog"
            className="flex items-center gap-1 text-yellow-200 hover:text-yellow-400 font-semibold transition"
          >
            Каталог
          </Link>

          {/* Только для админа */}
          {token && user?.isAdmin && (
            <Link
              to="/admin"
              className="flex items-center gap-1 text-yellow-100 hover:text-white transition"
            >
              <LayoutGrid size={20} /> Админка
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {!token ? (
            <>
              <Link
                to="/login"
                className="flex items-center gap-1 text-gray-100 hover:text-yellow-100 transition"
              >
                <LogIn size={18} /> Войти
              </Link>
              <Link
                to="/register"
                className="flex items-center gap-1 text-gray-100 hover:text-yellow-100 transition"
              >
                <UserPlus size={18} /> Регистрация
              </Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="flex items-center gap-1 text-red-200 hover:text-white transition font-medium"
            >
              <LogOut size={18} /> Выйти
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
