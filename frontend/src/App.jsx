import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import axios from "axios";
import AdminCustomerClusters from "./pages/AdminCustomerClusters";
import Admin from "./pages/Admin";
import AdminOrders from "./pages/AdminOrders";
import CategoriesAdmin from "./pages/CategoriesAdmin";
import Cart from "./pages/Cart";
import ProductPage from "./pages/ProductPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Nav from "./components/Nav";
import Catalog from "./components/Catalog";
import Home from "./pages/Home";

// Вся логика вынесена в AppContent (внутри Router)
function AppContent({
  cart, setCart, handleAddToCart, handleRemoveFromCart, handleClearCart,
  handleIncreaseQty, handleDecreaseQty, totalCount, productList,
  handleAddProduct, handleDeleteProduct
}) {
  const location = useLocation();
  // Проверка маршрута для скрытия фона
  const hideBg = [
    "/admin",
    "/admin/customers",
    "/admin/orders",
    "/admin/categories"
  ].some((route) => location.pathname.startsWith(route));

  useEffect(() => {
    if (hideBg) {
      document.body.classList.add("admin-bg");
      document.body.classList.remove("site-bg");
    } else {
      document.body.classList.add("site-bg");
      document.body.classList.remove("admin-bg");
    }
  }, [hideBg]);

  return (
    <>
      <Nav totalCount={totalCount} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/catalog"
          element={<Catalog products={productList} onAdd={handleAddToCart} />}
        />
        <Route
          path="/product/:id"
          element={<ProductPage onAdd={handleAddToCart} />}
        />
        <Route
          path="/cart"
          element={
            <Cart
              cart={cart}
              onRemove={handleRemoveFromCart}
              onClear={handleClearCart}
              onIncrease={handleIncreaseQty}
              onDecrease={handleDecreaseQty}
            />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <Admin
                products={productList}
                onAddProduct={handleAddProduct}
                onDeleteProduct={handleDeleteProduct}
              />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <ProtectedRoute requireAdmin>
              <AdminOrders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute requireAdmin>
              <CategoriesAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/customers"
          element={
            <ProtectedRoute requireAdmin>
              <AdminCustomerClusters />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const handleRemoveFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearCart = () => setCart([]);

  const handleIncreaseQty = (id) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: item.qty + 1 } : item
      )
    );
  };

  const handleDecreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: item.qty - 1 } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const [productList, setProductList] = useState([]);

  useEffect(() => {
    axios
      .get('${import.meta.env.VITE_API_URL}/products')
      .then((res) => setProductList(res.data))
      .catch((err) => console.error("Ошибка загрузки товаров:", err));
  }, []);

  const handleAddProduct = (input) => {
    if (typeof input === "function") {
      setProductList(input);
    } else {
      axios
        .post('${import.meta.env.VITE_API_URL}/products', input)
        .then((res) => setProductList((prev) => [...prev, res.data]))
        .catch((err) => console.error("Ошибка добавления товара:", err));
    }
  };

  const handleDeleteProduct = (id) => {
    setProductList((prev) => prev.filter((p) => p.id !== id));
  };

  useEffect(() => {
    if (productList.length > 0) {
      setCart((prevCart) => {
        const validIds = new Set(productList.map((p) => p.id));
        const filtered = prevCart.filter((item) => validIds.has(item.id));
        if (filtered.length !== prevCart.length) {
          localStorage.setItem("cart", JSON.stringify(filtered));
        }
        return filtered;
      });
    }
  }, [productList]);

  return (
    <Router>
      <AppContent
        cart={cart}
        setCart={setCart}
        handleAddToCart={handleAddToCart}
        handleRemoveFromCart={handleRemoveFromCart}
        handleClearCart={handleClearCart}
        handleIncreaseQty={handleIncreaseQty}
        handleDecreaseQty={handleDecreaseQty}
        totalCount={totalCount}
        productList={productList}
        handleAddProduct={handleAddProduct}
        handleDeleteProduct={handleDeleteProduct}
      />
    </Router>
  );
}
