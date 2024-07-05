import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import styles from "./SearchResults.module.scss";
import { fetchSearchResults } from "../../store/slices/ItemsSlice";
import Item from "../ItemPage/Items/Item";

const SearchResults: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("query") || "";
  const searchResults = useAppSelector((state) => state.items.searchResults);
  const searchStatus = useAppSelector((state) => state.items.searchStatus);
  const isAuth = useAppSelector((state) => state.auth.isAuth);
  const username = useAppSelector((state) => state.auth.user.userName);

  useEffect(() => {
    if (query) {
      dispatch(fetchSearchResults(query));
    }
  }, [dispatch, query]);

  return (
    <div className={styles.searchResults}>
      <h2>Результаты поиска для "{query}"</h2>
      {searchStatus === "loading" && <p>Загрузка...</p>}
      {searchStatus === "failed" && <p>Ошибка загрузки результатов поиска</p>}
      {searchStatus === "succeeded" && searchResults.length === 0 && (
        <p>Ничего не найдено</p>
      )}
      {searchStatus === "succeeded" && searchResults.length > 0 && (
        <ul className={styles.itemsList}>
          {searchResults.map((item) => (
            <Item
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              price={item.price}
              image={item.image}
              username={username}
              isAuth={isAuth}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;

