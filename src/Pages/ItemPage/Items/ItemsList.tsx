import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../../hooks/hooks";
import { fetchItems } from "../../../store/slices/ItemsSlice";
import Item from "./Item";
import styles from "./Items.module.scss";

const ItemsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const authState = useAppSelector((state) => state.auth);
  const items = useAppSelector((state) => state.items.items);
  const status = useAppSelector((state) => state.items.status);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchItems());
    }
  }, [status, dispatch, items]);

  return (
    <div className={styles.itemsList}>
      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p>Error loading items</p>}
      {status === "succeeded" && (
        <ul className={styles.itemList}>
          {items.map((item) => (
            <Item
              key={item.id}
              username={authState.user.userName}
              id={item.id}
              title={item.title}
              description={item.description}
              price={item.price}
              image={item.image}
              isAuth={authState.isAuth}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default ItemsList;
