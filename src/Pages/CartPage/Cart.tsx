import React, { useEffect, useState } from "react";
import styles from "./Cart.module.scss";
import { useAppSelector, useAppDispatch } from "../../hooks/hooks";
import { deleteItemCart, fetchCart } from "../../store/slices/AuthSlice";
import CartItem from "./CartItem";

const Cart: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const cart = user.cart;

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    if (user.userName) {
      dispatch(fetchCart(user.userName));
    }
  }, [dispatch, user.userName]);

  useEffect(() => {
    const total = cart.reduce(
      (sum, item) => sum + item.price * (item.quantity),
      0
    );
    setTotalPrice(total);
  }, [cart]);

  const handleDeleteItem = (username: null | string, itemId: string) => {
    if (username) {
      dispatch(deleteItemCart({ username, itemId })).then(() => {
        const updatedCart = cart.filter((item) => item.id !== itemId);
        const total = updatedCart.reduce(
          (sum, item) => sum + item.price * (item.quantity),
          0
        );
        setTotalPrice(total); 
    })}}

  return (
    <div className={styles.cart}>
      <h2 className={styles.cartTitle}>Ваша корзина</h2>
      {cart.length === 0 ? (
        <p className={styles.emptyCart}>Корзина пуста</p>
      ) : (
        <>
          <ul className={styles.cartList}>
            {cart.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                username={user.userName}
                onDeleteItem={handleDeleteItem}
              />
            ))}
          </ul>
          <div className={styles.totalPrice}>
            Общая стоимость: {totalPrice} руб.
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
