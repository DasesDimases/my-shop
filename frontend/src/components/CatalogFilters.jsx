import { useState, useEffect } from "react";

export default function CatalogFilters({
  products = [],
  onCategoryChange,
  onModelChange,
  onSearchChange,
  onSortChange,
  onReset,
}) {
  const [categories, setCategories] = useState([]);
  const [models, setModels] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedModels, setSelectedModels] = useState([]);
  const [sort, setSort] = useState("");

  useEffect(() => {
    setCategories([
      ...new Set(products.flatMap((p) => p.category ? [p.category] : [])),
    ]);
    setModels([
      ...new Set(products.flatMap((p) => p.models ?? [])),
    ]);
  }, [products]);

  const handleCategory = (cat) => {
    const next = selectedCategories.includes(cat)
      ? selectedCategories.filter((c) => c !== cat)
      : [...selectedCategories, cat];
    setSelectedCategories(next);
    onCategoryChange(next);
  };

  const handleModel = (model) => {
    const next = selectedModels.includes(model)
      ? selectedModels.filter((m) => m !== model)
      : [...selectedModels, model];
    setSelectedModels(next);
    onModelChange(next);
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedModels([]);
    setSearch("");
    setSort("");
    onCategoryChange([]);
    onModelChange([]);
    onSearchChange("");
    onSortChange("");
    onReset && onReset();
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    onSearchChange(e.target.value);
  };

  const handleSort = (e) => {
    setSort(e.target.value);
    onSortChange(e.target.value);
  };

  return (
    <div className="bg-gray-900 bg-opacity-80 rounded-2xl p-5 shadow-xl border border-gray-800 mb-4 sticky top-6 text-gray-100">
      <div className="flex items-center justify-between mb-3">
        <span className="font-extrabold text-xl tracking-tight">Фильтры</span>
        <button
          className="text-xs font-bold bg-yellow-500 hover:bg-yellow-600 text-black rounded px-3 py-1 ml-2 shadow transition"
          onClick={handleReset}
        >
          Сбросить
        </button>
      </div>

      <div className="mb-5">
        <input
          type="text"
          className="w-full px-4 py-2 rounded border-2 border-gray-700 bg-gray-800 text-gray-100 font-semibold focus:border-yellow-400 outline-none transition"
          placeholder="Поиск по названию..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      <div className="mb-5">
        <div className="font-semibold mb-1 text-yellow-300">Категории</div>
        <div className="flex flex-wrap gap-2">
          {categories.length === 0 && (
            <span className="text-gray-400 text-sm">Нет категорий</span>
          )}
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-2 py-1 rounded-lg text-sm font-semibold border-2 transition
                ${selectedCategories.includes(cat)
                  ? "bg-yellow-400 text-black border-yellow-600 shadow"
                  : "bg-gray-700 text-gray-100 border-gray-600 hover:bg-yellow-100 hover:text-black"}`}
              onClick={() => handleCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5">
        <div className="font-semibold mb-1 text-yellow-300">Модели</div>
        <div className="flex flex-wrap gap-2">
          {models.length === 0 && (
            <span className="text-gray-400 text-sm">Нет моделей</span>
          )}
          {models.map((model) => (
            <button
              key={model}
              className={`px-2 py-1 rounded-lg text-sm font-semibold border-2 transition
                ${selectedModels.includes(model)
                  ? "bg-yellow-400 text-black border-yellow-600 shadow"
                  : "bg-gray-700 text-gray-100 border-gray-600 hover:bg-yellow-100 hover:text-black"}`}
              onClick={() => handleModel(model)}
            >
              {model}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="font-semibold mb-1 text-yellow-300">Сортировка</div>
        <select
          value={sort}
          onChange={handleSort}
          className="w-full px-2 py-2 rounded border-2 border-gray-700 bg-gray-800 text-gray-100 font-semibold focus:border-yellow-400 outline-none transition"
        >
          <option value="">Без сортировки</option>
          <option value="priceAsc">Цена по возрастанию</option>
          <option value="priceDesc">Цена по убыванию</option>
        </select>
      </div>
    </div>
  );
}
