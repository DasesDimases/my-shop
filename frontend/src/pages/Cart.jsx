import { useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"

export default function Cart({ cart, onRemove, onClear, onIncrease, onDecrease }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" })
  const [submitted, setSubmitted] = useState(false)

  const totalPrice = cart.reduce((sum, item) => sum + item.qty * item.price, 0)

  const handleSubmit = (e) => {
    e.preventDefault()
    const order = {
      customer: form,
      items: cart,
      total: totalPrice,
      createdAt: new Date().toISOString()
    }

    axios.post("${import.meta.env.VITE_API_URL}/orders", order)
      .then(() => {
        setSubmitted(true)
        onClear()
      })
      .catch(err => console.error("Ошибка оформления:", err))
  }

  if (submitted) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl font-bold mb-4">🎉 Спасибо за заказ!</h2>
        <p className="mb-4">Мы свяжемся с вами в ближайшее время.</p>
        <Link to="/" className="text-blue-600 underline">Вернуться в каталог</Link>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="text-center mt-10">
        <h2 className="text-xl mb-4">Корзина пуста</h2>
        <Link to="/" className="text-blue-600 underline">Вернуться в каталог</Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6">Оформление заказа</h2>
  
  {cart.map(item => (
        <div key={item.id} className="flex gap-4 items-center border-b py-3">
          <img
            src={item.image}
            alt={item.name}
            className="w-20 h-20 object-cover rounded"
          />
          
          <div className="flex-1">
            <Link
              to={`/product/${item.id}`}
              className="text-blue-600 font-semibold hover:underline"
            >
              {item.name}
            </Link>
            <p className="text-sm text-gray-600">
              {item.qty} × {item.price} ₽ = {item.qty * item.price} ₽
            </p>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => onDecrease(item.id)}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                −
              </button>
              <button
                onClick={() => onIncrease(item.id)}
                className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={() => onRemove(item.id)}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            Удалить
          </button>
        </div>
      )
    )
  }




      <p className="text-right font-semibold mb-6">Итого: {totalPrice} ₽</p>

      <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded shadow">
        <input
          type="text"
          placeholder="Имя"
          className="w-full p-2 mb-3 border rounded"
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="tel"
          placeholder="Телефон"
          className="w-full p-2 mb-4 border rounded"
          required
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          Оформить заказ
        </button>
        <button
          onClick={onClear}
          className="mt-6 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
        >
          Очистить корзину
        </button>
      </form>
    </div>
  )
}
