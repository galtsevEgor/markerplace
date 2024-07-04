import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { logout } from "../../store/slices/AuthSlice";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import styles from "./Header.module.scss";

const Header: React.FC = () => {
  const { user, status, isAuth } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('user')
    navigate("/login");
  };

  const renderLinks = () => {
    if (status === "loading") {
      return <h1>Загрузка...</h1>;
    } else if (!isAuth) {
      return (
        <ul className={styles.links}>
          <li>
            <Link to="/">Главная</Link>
          </li>
          <li>
            <Link to="/login">Войти</Link>
          </li>
          <li>
            <Link to="/register">Регистрация</Link>
          </li>
        </ul>
      );
    } else if (isAuth && user.role === "seller") {
      return (
        <ul className={styles.links}>
          <li>
            <Link to="/">Главная</Link>
          </li>
          <li>
            <Link to="/dashboard">Панель управления</Link>
          </li>
          <li>
            <Link to="/my-products">Мои товары</Link>
          </li>
          <li>
            <button onClick={handleLogout}>Выйти</button>
          </li>
        </ul>
      );
    } else if (isAuth && user.role === "buyer") {
      return (
        <ul className={styles.links}>
          <li>
            <Link to="/">Главная</Link>
          </li>
          <li>
            <Link to="/cart">Корзина</Link>
          </li>
          <li>
            <button onClick={handleLogout}>Выйти</button>
          </li>
        </ul>
      );
    }
    return null;
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <h1>БояраШоп</h1>
      </div>
      <div className={styles.search}>
        <input type="text" placeholder="Поиск..." />
      </div>
      <nav className={styles.nav}>{renderLinks()}</nav>
      <div className={styles.themeSwitcher}>
        <ThemeSwitcher />
      </div>
    </header>
  );
};

export default Header;



