import React, { useEffect, useState } from "react";
import styles from "./Cart.module.scss";
import { useAppDispatch } from "../../hooks/hooks";
import {
  ICartItem,
  decrementCartItem,
  incrementCartItem,
} from "../../store/slices/AuthSlice";

interface CartItemProps {
  item: ICartItem;
  username: string | null;
  onDeleteItem: (username: string, itemId: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  username,
  onDeleteItem,
}) => {
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(item.quantity);

  useEffect(() => {
    setQuantity(item.quantity);
  }, [item.quantity]);

  const handleIncrement = () => {
    if (username) {
      dispatch(incrementCartItem({ username, itemId: item.id })).then(() => {
        setQuantity(quantity + 1);
      });
    }
  };

  const handleDecrement = () => {
    if (username && quantity > 1) {
      dispatch(decrementCartItem({ username, itemId: item.id })).then(() => {
        setQuantity(quantity - 1);
      });
    }
  };

  const handleDeleteItem = () => {
    if (username) {
      onDeleteItem(username, item.id)
    }
  }

  return (
    <li className={styles.cartItem}>
      <img className={styles.itemImage} src={item.image} alt={item.title} />
      <div className={styles.itemDetails}>
        <h3 className={styles.itemTitle}>{item.title}</h3>
        <p className={styles.itemDescription}>{item.description}</p>
        <p className={styles.itemPrice}>Цена: {item.price} руб.</p>
        <div className={styles.quantityControls}>
          <button className={styles.quantityButton} onClick={handleDecrement}>
            -
          </button>
          <span className={styles.quantity}>{quantity}</span>
          <button className={styles.quantityButton} onClick={handleIncrement}>
            +
          </button>
        </div>
        <button
          className={styles.deleteButton}
          onClick={handleDeleteItem}
        >
          Удалить
        </button>
      </div>
    </li>
  );
};

export default CartItem;
