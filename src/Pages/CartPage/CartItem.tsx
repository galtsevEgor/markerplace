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

  return (
    <li className={styles.cartItem}>
      <img src={item.image} alt={item.title} />
      <div>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
        <p>Цена: {item.price} руб.</p>
        <div className={styles.quantityControls}>
          <button onClick={handleDecrement}>-</button>
          <span>{quantity}</span>
          <button onClick={handleIncrement}>+</button>
        </div>
        <button onClick={() => onDeleteItem(username as string, item.id)}>
          Удалить
        </button>
      </div>
    </li>
  );
};

export default CartItem;
