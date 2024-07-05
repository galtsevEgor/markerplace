import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/AuthPage/Login";
import Register from "./Pages/AuthPage/Register";
import PrivateRoute from "./Components/route/PrivateRoute";
import HomePage from "./Pages/HomePage/HomePage";
import Header from "./Components/Header/Header";
import { loginUser } from "./store/slices/AuthSlice";
import { useAppDispatch } from "./hooks/hooks";
import ItemPage from "./Pages/ItemPage/ItemPage";
import CartPage from "./Pages/CartPage/Cart";
import MyProducts from "./Pages/MyProductsPage/MyProducts";
import SearchResults from "./Pages/SearchPage/SearchResults";

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      dispatch(loginUser(JSON.parse(user)));
    }
  }, [dispatch]);

  return (
    <Router>
      <div style={{ marginBottom: "20px" }}>
        <Header />
      </div>
      <Routes>
        <Route path="/home" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/item/:id" element={<ItemPage />} />
        <Route path="/my-products" element={<MyProducts />} />
        <Route path="/search" element={<SearchResults/>} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Routes>
                <Route path="/my-products" element={<MyProducts />} />
              </Routes>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
