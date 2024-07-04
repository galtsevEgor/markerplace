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

const App: React.FC = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      dispatch(loginUser(JSON.parse(user))); 
    }
  }, [dispatch]);

  return (
    <Router>
      <Header />
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<CartPage/>} />
          <Route path="/item/:id" element={<ItemPage />} />
          <Route
            path="/dashboard"
            element={<PrivateRoute children={undefined}></PrivateRoute>}
          />
        </Routes>
    </Router>
  );
};

export default App;
