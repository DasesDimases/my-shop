import { useState, useEffect } from "react"
import axios from "axios"

export default function CategoriesAdmin() {
  const [categories, setCategories] = useState([])
  const [models, setModels] = useState([])
  const [newCategory, setNewCategory] = useState("")
  const [newModel, setNewModel] = useState("")

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    axios.get("${import.meta.env.VITE_API_URL}/categories").then(res => setCategories(res.data))
    axios.get("${import.meta.env.VITE_API_URL}/car-models").then(res => setModels(res.data))
  }

  const addCategory = () => {
    if (!newCategory.trim()) return
    axios.post("${import.meta.env.VITE_API_URL}/categories", { name: newCategory })
      .then(() => {
        setNewCategory("")
        fetchData()
      })
  }

  const deleteCategory = (id) => {
    axios.delete(`${import.meta.env.VITE_API_URL}/categories/${id}`).then(fetchData)
  }

  const addModel = () => {
    if (!newModel.trim()) return
    axios.post("${import.meta.env.VITE_API_URL}/car-models", { name: newModel })
      .then(() => {
        setNewModel("")
        fetchData()
      })
  }

  const deleteModel = (id) => {
    axios.delete(`${import.meta.env.VITE_API_URL}/car-models/${id}`).then(fetchData)
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Управление категориями и моделями</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Категории товаров</h2>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Новая категория"
            className="flex-1 p-2 border rounded"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button onClick={addCategory} className="bg-blue-600 text-white px-4 py-2 rounded">Добавить</button>
        </div>
        <ul className="space-y-2">
          {categories.map(cat => (
            <li key={cat.id} className="flex justify-between items-center border p-2 rounded">
              <span>{cat.name}</span>
              <button onClick={() => deleteCategory(cat.id)} className="text-red-600 hover:underline">Удалить</button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Модели автомобилей</h2>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            placeholder="Новая модель"
            className="flex-1 p-2 border rounded"
            value={newModel}
            onChange={(e) => setNewModel(e.target.value)}
          />
          <button onClick={addModel} className="bg-blue-600 text-white px-4 py-2 rounded">Добавить</button>
        </div>
        <ul className="space-y-2">
          {models.map(m => (
            <li key={m.id} className="flex justify-between items-center border p-2 rounded">
              <span>{m.name}</span>
              <button onClick={() => deleteModel(m.id)} className="text-red-600 hover:underline">Удалить</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
