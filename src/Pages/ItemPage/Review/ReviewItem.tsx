import React from "react";
import { Review } from "../../../store/slices/ItemsSlice";
import styles from "../ItemPage.module.scss";

interface ReviewItemProps {
  review: Review;
}

const ReviewItem: React.FC<ReviewItemProps> = (review) => {
  return (
    <div className={styles.review}>
      <p>
        {review.review.user}: {review.review.comment}
      </p>
      <p>Рейтинг: {review.review.rating}</p>
    </div>
  );
};

export default ReviewItem;
