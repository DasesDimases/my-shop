import { useEffect, useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"

export default function AdminOrders() {
  const [orders, setOrders] = useState([])

  const fetchOrders = () => {
    axios.get('${import.meta.env.VITE_API_URL}/orders')
      .then(res => setOrders(res.data))
      .catch(err => console.error("Ошибка загрузки заказов:", err))
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleDelete = (id) => {
    if (!window.confirm("Удалить этот заказ?")) return
    axios.delete(`${import.meta.env.VITE_API_URL}/orders/${id}`)
      .then(() => fetchOrders())
      .catch(err => console.error("Ошибка удаления заказа:", err))
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Заказы</h1>
        <Link to="/admin" className="text-blue-600 underline">← Назад в админку</Link>
      </div>

      {orders.length === 0 ? (
        <p>Заказов пока нет.</p>
      ) : (
        <div className="space-y-6">
          {orders.map(order => (
            <div key={order._id} className="p-4 border rounded shadow bg-white">
              <div className="mb-2">
                <strong>Имя:</strong> {order.customer?.name} <br />
                <strong>Email:</strong> {order.customer?.email} <br />
                <strong>Телефон:</strong> {order.customer?.phone}
              </div>
              <div className="mb-2">
                <strong>Дата:</strong> {new Date(order.createdAt).toLocaleString()}
              </div>
              <ul className="mb-2 list-disc list-inside text-sm">
                {order.items.map(item => (
                  <li key={item.id}>
                    {item.name} — {item.qty} × {item.price} ₽
                  </li>
                ))}
              </ul>
              <div className="flex justify-between items-center">
                <div className="font-bold">Итого: {order.total} ₽</div>
                <button
                  onClick={() => handleDelete(order._id)}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Удалить заказ
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
