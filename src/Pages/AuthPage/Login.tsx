import React, { useEffect, useState } from "react";
import { RootState } from "../../store/store";
import { loginUser } from "../../store/slices/AuthSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { Link, useNavigate } from "react-router-dom";
import styles from "./AuthPage.module.scss";

const Login: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useAppDispatch();
  const { status, user } = useAppSelector((state: RootState) => state.auth);
  const theme = useAppSelector((state: RootState) => state.theme.theme);

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ username, password }))
    }
    

  useEffect(() => {
    if (user.userName) {
      navigate("/home");
    }
  }, [status, user, navigate]);

  return (
    <div
      className={`${styles.authForm} ${theme === "dark" && styles.darkTheme}`}
      data-theme={theme}
    >
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Login</button>
        {status === "loading" && <p>Loading...</p>}
        {status === "failed" && <p>Login failed</p>}
        <p>
          Нет аккаунта? {}
          <Link to="/register" className={styles.authLink}>
            Зарегистрируйтесь
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
