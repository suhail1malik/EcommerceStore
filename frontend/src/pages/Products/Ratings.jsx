import React from "react";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const Ratings = ({ value, text, color }) => {
  const fullStars = Math.floor(value);
  const halfStars = value - fullStars >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStars;

  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, index) => (
        <FaStar key={index} className={`${color} ml-1`} />
      ))}

      {halfStars === 1 && <FaStarHalfAlt className={`${color} ml-1`} />}

      {[...Array(emptyStars)].map((_, index) => (
        <FaRegStar key={index} className={`${color} ml-1`} />
      ))}

      {text && <span className={`ml-2 ${color}`}>{text}</span>}
    </div>
  );
};

Ratings.defaultProps = {
  color: "text-yellow-500",
};

export default Ratings;
