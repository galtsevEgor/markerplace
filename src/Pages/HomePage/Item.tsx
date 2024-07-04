import React from "react";
import styles from "./Items.module.scss";
import { Link } from "react-router-dom";

interface ItemProps {
  id: string;
  title: string;
  description: string;
  price: number;
  image: string;
}

const Item: React.FC<ItemProps> = ({
  id,
  title,
  description,
  price,
  image,
}) => {
  return (
    <li className={styles.item}>
      <img src={image} alt={title} />
      <h3>{title}</h3>
      <p>{description}</p>
      <p>${price}</p>
      <Link to={`/item/${id}`}>Перейти к товару</Link>
    </li>
  );
};

export default Item;
