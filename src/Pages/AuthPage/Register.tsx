import React, { useCallback, useEffect, useState } from "react";
import { RootState } from "../../store/store";
import {
  checkUsernameExists,
  registerUser,
  resetUsernameExists,
} from "../../store/slices/AuthSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { Link, useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
import styles from "./AuthPage.module.scss";

const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"buyer" | "seller">("buyer");
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const userName = useAppSelector((state) => state.auth.user.userName)
  const theme = useAppSelector((state: RootState) => state.theme.theme);
  const { status, usernameExists } = useAppSelector(
    (state: RootState) => state.auth
  );

  const debouncedCheckUsername = useCallback(
    debounce((value: string) => {
      dispatch(checkUsernameExists(value));
    }, 1000),
    [dispatch]
  );

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUsername(value);
    if (value) {
      debouncedCheckUsername(value);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameExists) {
      dispatch(registerUser({ username, password, role }));
    }
  };

  useEffect(() => {
    if (status === "succeeded" && userName) {
      navigate("/login");
    }
  }, [status, username, navigate]);

  useEffect(() => {
    return () => {
      dispatch(resetUsernameExists());
    };
  }, [dispatch]);

  return (
    <div
      className={`${styles.authForm} ${theme === "dark" && styles.darkTheme}`}
      data-theme={theme}
    >
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={handleUsernameChange}
          placeholder="Username"
          required
        />
        {usernameExists && <p>Username already exists</p>}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "buyer" | "seller")}
        >
          <option value="buyer">Buyer</option>
          <option value="seller">Seller</option>
        </select>
        <button type="submit">Register</button>
        {status === "loading" && <p>Loading...</p>}
        {status === "failed" && <p>Registration failed</p>}
        <p>
          Уже есть аккаунт? {}
          <Link to="/login" className={styles.authLink}>
            Войдите
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
