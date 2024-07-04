import React, { useState } from "react";
import styles from "./StarRating.module.scss";

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleStarClick = (starIndex: number) => {
    onRatingChange(starIndex + 1);
  };

  const handleMouseEnter = (starIndex: number) => {
    setHoverRating(starIndex + 1);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };

  return (
    <div className={styles.starRating}>
      {[...Array(5)].map((_, index) => (
        <span
          key={index}
          className={
            index < (hoverRating || rating)
              ? styles.filledStar
              : styles.emptyStar
          }
          onClick={() => handleStarClick(index)}
          onMouseEnter={() => handleMouseEnter(index)}
          onMouseLeave={handleMouseLeave}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;

