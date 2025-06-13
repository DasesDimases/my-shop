import { Link } from "react-router-dom";

const fallbackImage = "img/no_photo.png";

export default function ProductCard({ product, onAdd }) {
  return (
    <div
      id={`product-${product.id}`}
      className="bg-gray-900 bg-opacity-80 rounded-2xl p-5 shadow-xl border border-gray-800 mb-4 sticky top-6 text-gray-100"
    >
      <Link to={`/product/${product.id}`}>
        <img
          src={product.image || fallbackImage}
          alt={product.name}
          className="w-full h-48 object-cover mb-4 rounded"
        />
      </Link>
      <h3 className="text-lg font-semibold mb-2">
        <Link
          to={`/product/${product.id}`}
          className="hover:underline text-white-600"
        >
          {/* Бренд + название */}
          {product.brand && (
            <span className="font-bold text-yellow-400">{product.brand} </span>
          )}
          {product.name}
        </Link>
      </h3>
      <p className="text-white-600 mb-2">{product.price} ₽</p>
      <p className="text-xs text-white-500 mb-2">Код: {product.code}</p>
      <button
        onClick={() => onAdd(product)}
        className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600"
      >
        В корзину
      </button>
    </div>
  );
}
