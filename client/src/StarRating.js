import { useState } from "react";
import { FaStar } from "react-icons/fa";

export default function StarRating({rating, onRatingChange}){

    // Stores which star the user is currently hovering over
    // Default value is null (no hover)
    const [hover, setHover] = useState(null);

    // Check if the component should be interactive
    // If onRatingChange is a function - user can click and change rating
    // If not - display only
    const isInteractive = typeof onRatingChange === "function";

    // Determine what value should be displayed:
    // - If interactive - show hover value if exists, otherwise show actual rating
    // - If not - just show rating
    const displayValue = isInteractive ? (hover || rating) : rating;

    return (
        <div className="star">
        {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
            key={star} //unique key for each star
            style={{
                cursor: "pointer",
                color: star <= displayValue ? "gold" : "#ccc" //changes color based on hover/rating
            }}

            // Only works if component is interactive
            onClick={
                isInteractive ? () => onRatingChange(star) : undefined
            }

            //When user hovers - update hover state
            onMouseEnter={
                isInteractive ? () => setHover(star) : undefined
            }

            //Resets hover state to null when mouse leave star
            onMouseLeave={
                isInteractive ? () => setHover(null) : undefined
            }
            />
        ))}
        </div>
    );
}
