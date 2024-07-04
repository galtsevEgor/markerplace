import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { toggleTheme } from "../../store/slices/ThemeSlice";
import styles from "./ThemeSwitcher.module.scss";

const ThemeSwitcher: React.FC = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className={styles.container}>
      <label className={styles.switch}>
        <input
          type="checkbox"
          checked={theme === "dark"}
          onChange={() => dispatch(toggleTheme())}
        />
        <span className={styles.slider}></span>
      </label>
      <p>{theme === "dark" ? "Темная" : "Светлая"} тема</p>
    </div>
  );
};

export default ThemeSwitcher;
