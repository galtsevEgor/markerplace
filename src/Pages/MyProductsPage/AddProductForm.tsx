import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import styles from "./Product.module.scss";
import { addUserProduct } from "../../store/slices/AuthSlice";

const AddProductForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user.userName) {
      const newProduct = {
        id: `${Date.now()}`,
        title,
        description,
        price: parseFloat(price),
        image,
        author: user.userName,
        reviews: [],
      };
      dispatch(addUserProduct(newProduct));
      setTitle("");
      setDescription("");
      setPrice("");
      setImage("");
    }
  };

  return (
    <div className={styles.addProductForm}>
      <h3>Добавить продукт</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Название:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Описание:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </label>
        <label>
          Цена:
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </label>
        <label>
          Изображение:
          <input type="text" value={image} onChange={(e) => setImage(e.target.value)} required />
        </label>
        <button type="submit">Добавить</button>
      </form>
    </div>
  );
};

export default AddProductForm;
