import { Link } from "react-router-dom"

export default function ProductCard({ product, onAdd }) {
  return (
    <div id={`product-${product.id}`} className="border p-4 rounded shadow bg-white">
      <Link to={`/product/${product.id}`}>
        <img src={product.image} alt={product.name} className="w-full h-48 object-cover mb-4 rounded" />
      </Link>
      <h3 className="text-lg font-semibold mb-2">
        <Link to={`/product/${product.id}`} className="hover:underline text-blue-600">
          {product.name}
        </Link>
      </h3>
      <p className="text-gray-600 mb-2">{product.price} ₽</p>
      <p className="text-xs text-gray-500 mb-2">Код: {product.code}</p>
      <button
        onClick={() => onAdd(product)}
        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
      >
        В корзину
      </button>
    </div>
  )
}
