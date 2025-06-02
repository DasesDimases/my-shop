import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-transparent">
      <h1 className="text-4xl font-extrabold text-yellow-400 mb-4 drop-shadow">
        🚗 Магазин автозапчастей RenaultParts
      </h1>
      <p className="text-xl text-gray-200 mb-8 text-center max-w-xl">
        Интернет-магазин оригинальных и аналоговых запчастей для Renault. 
        Только проверенные поставщики, доставка по всей России!
      </p>
      <div className="flex flex-col gap-4 items-center">
        <Link to="/catalog" className="px-8 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-500 text-black text-lg font-bold shadow transition">
          Перейти в каталог товаров
        </Link>
        <Link to="#contacts" className="text-blue-300 hover:underline">
          Контактная информация
        </Link>
      </div>

      {/* Контакты внизу страницы */}
      <div id="contacts" className="mt-20 bg-gray-800 bg-opacity-80 p-6 rounded-xl shadow-xl max-w-lg w-full text-center text-gray-100">
        <h2 className="text-xl font-bold mb-2 text-yellow-300">Контакты</h2>
        <div>📞 +7 (999) 123-45-67</div>
        <div>✉️ info@renaultparts.ru</div>
        <div>г. Москва, ул. Примерная, д. 1</div>
      </div>
    </div>
  );
}
