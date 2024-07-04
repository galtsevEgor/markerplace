import React from "react";
import { Review } from "../../../store/slices/ItemsSlice";
import styles from "../ItemPage.module.scss";

interface ReviewItemProps {
  review: Review;
  isAuth: boolean;
  userName: string | null;
  onReviewDelete: (reviewId: string) => void
}

const ReviewItem: React.FC<ReviewItemProps> = ({review, isAuth, userName, onReviewDelete} ) => {
  return (
    <div className={styles.review}>
      <p>
        {review.user}: {review.comment}
      </p>
      <p>Рейтинг: {Array(review.rating).fill('⭐️').join('')}</p>
        {isAuth && review.user === userName && (
        <button onClick={() => onReviewDelete(review.id)}>Удалить</button>
        )}
    </div>
  );
};

export default ReviewItem;
