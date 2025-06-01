import React, { useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import CatalogFilters from "./CatalogFilters";

const Catalog = ({ products = [], onAddToCart }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedModels, setSelectedModels] = useState([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [showFilters, setShowFilters] = useState(true);

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const inCategory =
          selectedCategories.length === 0 ||
          selectedCategories.includes(product.category);
        const inModel =
          selectedModels.length === 0 ||
          (product.models && product.models.some((m) => selectedModels.includes(m)));
        const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
        return inCategory && inModel && matchesSearch;
      })
      .sort((a, b) => {
        if (sort === "priceAsc") return a.price - b.price;
        if (sort === "priceDesc") return b.price - a.price;
        return 0;
      });
  }, [products, selectedCategories, selectedModels, search, sort]);

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Каталог товаров</h1>
      <button
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        onClick={() => setShowFilters((prev) => !prev)}
      >
        {showFilters ? "Скрыть фильтры" : "Показать фильтры"}
      </button>
      <div className="flex flex-col md:flex-row gap-4">
        {showFilters && (
          <div className="md:w-1/4">
            <CatalogFilters
              onCategoryChange={setSelectedCategories}
              onModelChange={setSelectedModels}
              onSearchChange={setSearch}
              onSortChange={setSort}
              products={products}
            />
          </div>
        )}
        <div className={`${showFilters ? "md:w-3/4" : "w-full"} grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4`}>
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-gray-500">Нет товаров по выбранным фильтрам</div>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} onAdd={onAddToCart} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Catalog;
