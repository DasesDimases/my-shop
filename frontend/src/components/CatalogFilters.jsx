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
    // Получение уникальных категорий и моделей из товаров
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

  // Поиск и сортировка
  const handleSearch = (e) => {
    setSearch(e.target.value);
    onSearchChange(e.target.value);
  };

  const handleSort = (e) => {
    setSort(e.target.value);
    onSortChange(e.target.value);
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow border mb-4 sticky top-6">
      <div className="flex items-center justify-between mb-2">
        <span className="font-bold text-lg">Фильтры</span>
        <button
          className="text-xs bg-gray-200 hover:bg-gray-300 rounded px-2 py-1 ml-2"
          onClick={handleReset}
        >
          Сбросить фильтры
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          className="w-full px-3 py-2 rounded border"
          placeholder="Поиск по названию..."
          value={search}
          onChange={handleSearch}
        />
      </div>

      <div className="mb-4">
        <div className="font-semibold mb-1">Категории</div>
        <div className="flex flex-wrap gap-2">
          {categories.length === 0 && (
            <span className="text-gray-400 text-sm">Нет категорий</span>
          )}
          {categories.map((cat) => (
            <button
              key={cat}
              className={`px-2 py-1 rounded text-sm border ${selectedCategories.includes(cat) ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
              onClick={() => handleCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="font-semibold mb-1">Модели</div>
        <div className="flex flex-wrap gap-2">
          {models.length === 0 && (
            <span className="text-gray-400 text-sm">Нет моделей</span>
          )}
          {models.map((model) => (
            <button
              key={model}
              className={`px-2 py-1 rounded text-sm border ${selectedModels.includes(model) ? "bg-blue-500 text-white" : "bg-gray-100 hover:bg-gray-200"}`}
              onClick={() => handleModel(model)}
            >
              {model}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="font-semibold mb-1">Сортировка</div>
        <select
          value={sort}
          onChange={handleSort}
          className="w-full px-2 py-1 rounded border"
        >
          <option value="">Без сортировки</option>
          <option value="priceAsc">Цена по возрастанию</option>
          <option value="priceDesc">Цена по убыванию</option>
        </select>
      </div>
    </div>
  );
}
