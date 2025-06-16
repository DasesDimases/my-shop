import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Admin({ products, onAddProduct, onDeleteProduct }) {
  const [form, setForm] = useState({
    name: "",
    brand: "",           
    price: "",
    image: "",
    description: "",
    code: "",
    category: "",
    models: []
  });

  const [editing, setEditing] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCode, setFilterCode] = useState("");
  const [meta, setMeta] = useState({ categories: [], carModels: [] });

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/meta`)
      .then(res => setMeta(res.data))
      .catch(err => console.error("Ошибка загрузки мета-данных:", err));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newProduct = {
      name: form.name,
      brand: form.brand,        
      price: parseInt(form.price, 10),
      image: form.image,
      description: form.description,
      code: form.code,
      category: form.category,
      models: form.models
    };

    axios.post(`${import.meta.env.VITE_API_URL}/products`, newProduct)
      .then(res => {
        onAddProduct(res.data);
        setForm({
          name: "", brand: "", price: "", image: "", description: "", code: "", category: "", models: []
        });
      })
      .catch(err => console.error("Ошибка добавления:", err));
  };

  const handleDelete = (id) => {
    axios.delete(`${import.meta.env.VITE_API_URL}/products/${id}`)
      .then(() => {
        onDeleteProduct(id);
      })
      .catch(err => console.error("Ошибка удаления:", err));
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    axios.put(`${import.meta.env.VITE_API_URL}/products/${editing.id}`, editing)
      .then(res => {
        onAddProduct(prev =>
          prev.map(p => p.id === editing.id ? res.data : p)
        );
        setEditing(null);
      })
      .catch(err => console.error("Ошибка обновления:", err));
  };

  const filteredProducts = products
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter(p => p.code.toLowerCase().includes(filterCode.toLowerCase()));

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Админка — управление товарами</h1>
        <div className="flex gap-4">
          <Link to="/admin/customers" className="text-blue-600 underline">
            👥 Кластеры клиентов
          </Link>
          <Link to="/admin/orders" className="text-blue-600 underline">📦 Заказы</Link>
          <Link to="/admin/categories" className="text-blue-600 underline">📂 Категории</Link>
        </div>
      </div>

      {!editing && (
        <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Добавить товар</h2>

          <input type="text" placeholder="Название" className="w-full p-2 mb-3 border rounded" required
            value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />

          <input type="text" placeholder="Бренд" className="w-full p-2 mb-3 border rounded" required
            value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} />

          <input type="number" placeholder="Цена" className="w-full p-2 mb-3 border rounded" required
            value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />

          <input type="url" placeholder="Ссылка на изображение" className="w-full p-2 mb-3 border rounded" 
            value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />

          <textarea placeholder="Описание" className="w-full p-2 mb-3 border rounded" rows={3}
            value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />

          <input type="text" placeholder="Код запчасти / артикул" className="w-full p-2 mb-3 border rounded"
            value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} />

          <select className="w-full p-2 mb-3 border rounded" value={form.category}
            onChange={e => setForm({ ...form, category: e.target.value })}>
            <option value="">Выберите категорию</option>
            {meta.categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          <div className="mb-3">
            <p className="text-sm text-gray-600 mb-1">Модели автомобилей:</p>
            <div className="flex flex-wrap gap-3">
              {Array.isArray(meta.carModels) && meta.carModels.map(m => (
                <label key={m.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.models.includes(m.name)}
                    onChange={e => {
                      const updated = e.target.checked
                        ? [...form.models, m.name]
                        : form.models.filter(name => name !== m.name);
                      setForm({ ...form, models: updated });
                    }}
                  />
                  {m.name}
                </label>
              ))}
            </div>
          </div>

          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Добавить
          </button>
        </form>
      )}

      {editing && (
        <form onSubmit={handleEditSubmit} className="mb-8 bg-yellow-50 p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Редактировать товар</h2>

          <input type="text" className="w-full p-2 mb-3 border rounded"
            value={editing.name} onChange={e => setEditing({ ...editing, name: e.target.value })} />

          <input type="text" className="w-full p-2 mb-3 border rounded"
            value={editing.brand} onChange={e => setEditing({ ...editing, brand: e.target.value })} />

          <input type="number" className="w-full p-2 mb-3 border rounded"
            value={editing.price} onChange={e => setEditing({ ...editing, price: e.target.value })} />

          <input type="url" className="w-full p-2 mb-3 border rounded"
            value={editing.image} onChange={e => setEditing({ ...editing, image: e.target.value })} />

          <input type="text" className="w-full p-2 mb-3 border rounded"
            value={editing.code} onChange={e => setEditing({ ...editing, code: e.target.value })} />

          <textarea className="w-full p-2 mb-3 border rounded" rows={3}
            value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} />

          <select className="w-full p-2 mb-3 border rounded" value={editing.category}
            onChange={e => setEditing({ ...editing, category: e.target.value })}>
            <option value="">Выберите категорию</option>
            {meta.categories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>

          <div className="mb-3">
            <p className="text-sm text-gray-600 mb-1">Модели автомобилей:</p>
            <div className="flex flex-wrap gap-3">
              {Array.isArray(meta.carModels) && meta.carModels.map(m => (
                <label key={m.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Array.isArray(editing.models) && editing.models.includes(m.name)}
                    onChange={e => {
                      const selected = Array.isArray(editing.models) ? editing.models : [];
                      const updated = e.target.checked
                        ? [...selected, m.name]
                        : selected.filter(name => name !== m.name);
                      setEditing({ ...editing, models: updated });
                    }}
                  />
                  {m.name}
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Сохранить
            </button>
            <button type="button" onClick={() => setEditing(null)}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400">
              Отмена
            </button>
          </div>
        </form>
      )}

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Поиск по названию"
          className="flex-1 p-2 border rounded"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <input
          type="text"
          placeholder="Фильтр по коду"
          className="flex-1 p-2 border rounded"
          value={filterCode}
          onChange={e => setFilterCode(e.target.value)}
        />
      </div>

      <h2 className="text-xl font-semibold mb-3">Товары</h2>
      {filteredProducts.length === 0 ? (
        <p>Список пуст</p>
      ) : (
        filteredProducts.map(p => (
          <div key={p.id} className="flex justify-between items-center border-b py-3">
            <div>
              <p className="font-medium">
                {p.brand && <span className="font-bold text-yellow-700">{p.brand} </span>}
                {p.name}
              </p>
              <p className="text-sm text-gray-600">{p.price} ₽</p>
              <p className="text-xs text-gray-500">Код: {p.code}</p>
              <p className="text-xs text-gray-500">Категория: {p.category}</p>
              <p className="text-xs text-gray-500">Модели: {p.models?.join(", ")}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(p)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                ✏️ Редактировать
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Удалить
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
