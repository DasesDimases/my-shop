import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function ProductPage({ onAddToCart }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const fallbackImage = "/img/no_photo.png";

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/products`)
      .then((res) => {
        const found = res.data.find((p) => p.id === id);
        setProduct(found);
      })
      .catch((err) => console.error("Ошибка загрузки товара:", err));
  }, [id]);

  if (!product) {
    return <div className="p-10 text-center">Загрузка...</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Link to="/" className="text-blue-600 underline">
        ← Назад в каталог
      </Link>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <img src={product.image || fallbackImage} alt={product.name} className="w-full rounded shadow" />
        <div>
          <h1 className="text-3xl font-bold mb-4">
            {/* Новый вывод: бренд + название */}
            {product.brand && (
              <span className="font-bold text-yellow-400">{product.brand} </span>
            )}
            {product.name}
          </h1>
          <p className="text-xl text-gray-800 mb-4">{product.price} ₽</p>
          <p className="text-sm text-gray-700 mb-6 whitespace-pre-line">
            {product.description || "Описание отсутствует"}
          </p>
          <p className="text-sm text-gray-500 mb-2">
            Код запчасти: {product.code || "не указан"}
          </p>
          <button
            onClick={() => onAddToCart(product)}
            className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600"
          >
            В корзину
          </button>
        </div>
      </div>
    </div>
  );
}
