import React from "react";
import styles from "./Items.module.scss";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";
import { addToCart } from "../../../store/slices/AuthSlice";

interface ItemProps {
  id: string;
  username: string | null;
  title: string;
  description: string;
  price: number;
  image: string;
  isAuth: boolean;
}

const Item: React.FC<ItemProps> = ({
  id,
  title,
  username,
  description,
  price,
  image,
  isAuth
}) => {
  const role = useAppSelector((state) => state.auth.user.role)
  const dispatch = useAppDispatch()

  const handleAddToCart = () => {
    if (username) {
      dispatch(addToCart({ username, itemId: id }));
    }
  };

  return (
    <li className={styles.item}>
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
      <p>${price}</p>
      {isAuth && role === "buyer" &&<button onClick={() => dispatch(handleAddToCart)}>Добавить в корзину</button>}
      <Link to={`/item/${id}`}>Перейти к товару</Link>
    </li>
  );
};

export default Item;
