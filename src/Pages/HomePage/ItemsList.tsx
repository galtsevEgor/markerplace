import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { fetchItems } from "../../store/slices/ItemsSlice";
import Item from "./Item";
import styles from "./Items.module.scss";

const ItemsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.items.items);
  const status = useAppSelector((state) => state.items.status);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchItems());
    }
  }, [status, dispatch]);

  return (
    <div className={styles.itemsList}>
      {status === "loading" && <p>Loading...</p>}
      {status === "failed" && <p>Error loading items</p>}
      {status === "succeeded" &&
        items.map((item) => (
          <Item
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            price={item.price}
            image={item.image}
          />
        ))}
    </div>
  );
};

export default ItemsList;