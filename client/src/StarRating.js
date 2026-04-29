import { FaStar, FaRegStar } from "react-icons/fa";

export default function StarRating({rating}){
    return(
        <div className="star">
            {[1, 2, 3, 4, 5].map((star) => star <= rating ? (
                <FaStar key={star} />
            ) : (
                <FaRegStar key={star}/>
            )
        )}
        </div>
    )
}
