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
      <div className={styles.imageContainer}>
        <img className={styles.image} src={image} alt={title} />
      </div>
      <div className={styles.details}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.description}>{description}</p>
        <p className={styles.price}>${price}</p>
        {isAuth && role === "buyer" && (
          <button className={styles.addToCart} onClick={handleAddToCart}>
            Добавить в корзину
          </button>
        )}
        <Link className={styles.link} to={`/item/${id}`}>
          Перейти к товару
        </Link>
      </div>
    </li>
  );
};

export default Item;
