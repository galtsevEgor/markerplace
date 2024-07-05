import React from "react";
import { Item } from "../../store/slices/ItemsSlice"
import styles from "./Product.module.scss";


interface PropsProductItem {
  product: Item;
  onDeleteProduct: (itemId: string) => void;
}

const ProductItem: React.FC<PropsProductItem> = ({product, onDeleteProduct}) => {
  return (
    <li key={product.id} className={styles.productItem}>
      <img src={product.image} alt={product.title} />
        <div className={styles.productDetails}>
          <h3>{product.title}</h3>
          <p>{product.description}</p>
          <p>{product.price} руб.</p>
            <div className={styles.productActions}>
              <button
                className="delete"
                onClick={() => onDeleteProduct(product.id)}
              >
                Удалить
              </button>
            </div>
        </div>
    </li>
  )
}

export default ProductItem