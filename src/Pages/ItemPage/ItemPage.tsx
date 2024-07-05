// ItemPage.tsx
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { addReview, deleteReview, fetchItems, Review } from "../../store/slices/ItemsSlice";
import styles from "./ItemPage.module.scss";
import StarRating from "./StarRating/StarRating";
import ReviewItem from "./Review/ReviewItem";
import { addToCart } from "../../store/slices/AuthSlice";

const ItemPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector((state) => state.auth.isAuth);
  const role = useAppSelector((state) => state.auth.user.role);
  const user = useAppSelector((state) => state.auth.user);
  const { items, status } = useAppSelector((state) => state.items);
  const [ratingMessage, setRatingMessage] = useState("");
  const [newReview, setNewReview] = useState<Review>({
    id: "",
    user: user.userName,
    comment: "",
    rating: 0,
  });

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchItems());
    }
  }, [status, dispatch]);

  useEffect(() => {
    if (user) {
      setNewReview((prevReview) => ({
        ...prevReview,
        user: user.userName,
      }));
    }
  }, [user]);

  const item = items.find((item) => item.id === id);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.rating) {
      setRatingMessage("Поставьте оценку");
      return;
    }
    if (item) {
      const existingReview = item.reviews.find(
        (review) => review.user === user.userName
      );
      if (existingReview) {
        setRatingMessage("Вы уже оставили отзыв на этот товар");
        return;
      }

      dispatch(
        addReview({
          itemId: item.id,
          review: { ...newReview, id: (item.reviews.length + 1).toString() },
        })
      );
      setNewReview({ id: "", user: user.userName, comment: "", rating: 0 });
      setRatingMessage("");
    }
  };

  const handleRatingChange = (rating: number) => {
    setNewReview({ ...newReview, rating });
  };

  const handleReviewDelete = (reviewId: string) => {
    if (item) {
      dispatch(deleteReview({ itemId: item.id, reviewId }));
    }
  };

  const handleAddToCart = () => {
    if (item && user.userName && item.id) {
      dispatch(addToCart({ username: user.userName, itemId: item.id }));
    }
  };

  if (status === "loading" || !item) return <p>Loading...</p>;

  return (
    <div className={styles.itemPage}>
      <img src={item.image} alt={item.title} />
      <h2>{item.title}</h2>
      <p>{item.description}</p>
      <p>Цена: {item.price} руб.</p>
      <p>Автор: {item.author}</p>
      {isAuth && role === "buyer" && (
          <button className={styles.addToCart} onClick={handleAddToCart}>
            Добавить в корзину
          </button>
        )}
      <h3>Отзывы:</h3>

      {item.reviews.map((review) => (
          <ReviewItem key={review.id} review={review} isAuth={isAuth} userName={user.userName} onReviewDelete={handleReviewDelete} />
      ))}

      {isAuth ? (
        <form onSubmit={handleReviewSubmit} className={styles.reviewForm}>
          <p>Ваша оценка</p>
          <StarRating rating={newReview.rating} onRatingChange={handleRatingChange} />
          <p>{ratingMessage}</p>
          <textarea
            value={newReview.comment}
            onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
            placeholder="Ваш отзыв"
            required
          />
          <button type="submit">Оставить отзыв</button>
        </form>
      ) : (
        <h2>
          <Link to="/login">Войдите</Link> или <Link to="/register">Зарегистрируйтесь</Link> чтобы оставить отзыв
        </h2>
      )}
    </div>
  );
};

export default ItemPage;

