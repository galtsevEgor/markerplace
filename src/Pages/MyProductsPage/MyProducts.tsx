import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import AddProductForm from "./AddProductForm";
import styles from "./Product.module.scss";
import {
  deleteUserProduct,
  fetchUserProducts,
} from "../../store/slices/AuthSlice";
import ProductItem from "./ProductItem";
import { Item } from "../../store/slices/ItemsSlice";

const MyProducts: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const userProducts = useAppSelector((state) => state.auth.user.products);
  const status = useAppSelector((state) => state.auth.status);

  useEffect(() => {
    if (user.userName) {
      dispatch(fetchUserProducts(user.userName));
    }
  }, [dispatch, user.userName]);

  const handleDeleteProduct = (itemId: string) => {
    dispatch(deleteUserProduct(itemId));
  };

  return (
    <div className={styles.myProducts}>
      <AddProductForm />
      <h2>Мои товары</h2>
      {status === "loading" && <p>Загрузка...</p>}
      {status === "failed" && <p>Не удалось загрузить товары.</p>}
      {userProducts.length === 0 ? (
        <p>Нет добавленных товаров</p>
      ) : (
        <ul className={styles.productList}>
          {userProducts.map((product: Item) => (
            <ProductItem key={product.id} product={product} onDeleteProduct={handleDeleteProduct} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyProducts;
