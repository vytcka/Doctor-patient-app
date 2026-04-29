import { useState } from "react";
import { PrefetchPageLinks, useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import { data } from "./doctorItems";
import './reviews.css'; 


export default function DoctorDetail(){
    //Reviews
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({
    rating: 0,
    comment: ""
    });
    const [editedReviewId, setEditedReviewId] = useState(null);
    const [editedReview, setEditedReview] = useState({
        rating: 0,
        comment: ""
    });

    const {id} = useParams();

    //find doctor by id
    const doctor = data.find(doc => doc.id === Number(id))

    if(!doctor){
        return <p>Doctor not found</p>
    }

    //Adding reviews
    const handleAddReview = () => {
        if (newReview.rating === 0 || newReview.comment === "") return;

        setReviews([
            ...reviews,
            {
                id: Date.now(),
                rating: newReview.rating,
                comment: newReview.comment
            }
        ]);

        //reset
        setNewReview({rating:0, comment:""});

    }

    //Edit
    const handleEdit = (review) => {
        setEditedReviewId(review.id);
        setEditedReview({
            rating: review.rating,
            comment: review.comment
        });
    };

    //Save Edit
    const handleSaveEdit = (id) => {
        const updatedReviews = reviews.map((review) => review.id === id?
            {...review, rating:editedReview.rating, comment:editedReview.comment}
            : review
        );

        setReviews(updatedReviews);
        setEditedReviewId(null);
    }

    //calculate average rating based on reviews gotten
    const averageRating = reviews.length > 0 ? (
        reviews.reduce((sum, r) => sum + r.rating, 0) /
        reviews.length
    ).toFixed(1) : 0;

    //For star display
    const renderStars = (rating) => "⭐".repeat(Math.round(rating));

    // Show average rating if reviews exist, otherwise show N/A
    const displayedRating = reviews.length > 0 ? averageRating : "N/A";

    return(
        <div>
            <div className="doctor-info">
                <p><img src={doctor.profileIcon} alt={doctor.name} className="doc-profile-icon"/></p>
                <h1>{doctor.name}</h1>
                <p><b>Rating: </b>{renderStars(displayedRating)} {displayedRating}</p>
                <p><b>Specialty: </b>{doctor.specialty}</p>
                <p><b>Gender: </b>{doctor.gender}</p>
                <p><b>Language: </b>{doctor.language.join(", ")}</p>
                <p><b>Location: </b>{doctor.location}</p>
                <p><b>Availability: </b>{doctor.availability.days} {doctor.availability.time}</p>
                <p><b>Bio: </b>{doctor.bio}</p>
            </div>

            <div className="display-reviews">
                <h3>Reviews</h3>

                {reviews.length === 0 ? (
                    <p>No reviews yet</p>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="review">
                            {editedReviewId === review.id ? (
                                //edit mode
                                <>
                                    {/* Edit star rating */}
                                    <select
                                        value={editedReview.rating}
                                        onChange={(e) =>
                                            setEditedReview({
                                                ...editedReview,
                                                rating: Number(e.target.value)
                                            })
                                        }
                                        >
                                            <option>Select rating</option>
                                            <option value="5">⭐⭐⭐⭐⭐</option>
                                            <option value="4">⭐⭐⭐⭐</option>
                                            <option value="3">⭐⭐⭐</option>
                                            <option value="2">⭐⭐</option>
                                            <option value="1">⭐</option>
                                            <option value="0">0</option>
                                    </select>

                                    {/* Edit comments */}
                                    <textarea
                                        value={editedReview.comment}
                                        onChange={(e) =>
                                            setEditedReview({
                                                ...editedReview,
                                                comment: e.target.value
                                            })
                                        }
                                    />

                                    {/* Save or cancel edit button */}
                                    <button onClick={() => handleSaveEdit(review.id)}>
                                        Save
                                    </button>
                                    <button onClick={() => setEditedReviewId(null)}>
                                        Cancel
                                    </button>
                                </>
                            ):(
                                <>
                                    {/* Normal view */}
                                    <p>{"⭐".repeat(review.rating)}</p>
                                    <p>{review.comment}</p>

                                    <button onClick={() => handleEdit(review)}>
                                        Edit
                                    </button>
                                </>  
                            )}
                            </div>
                    ))
                )}
            </div>

            <div className="review-form">
                <h3>Leave a Review</h3>

                {/* Star Rating */}
                <select
                    value={newReview.rating}
                    onChange={(e) =>
                        setNewReview({...newReview, rating: Number(e.target.value)})
                    }>
                        <option>Select rating</option>
                        <option value="5">⭐⭐⭐⭐⭐</option>
                        <option value="4">⭐⭐⭐⭐</option>
                        <option value="3">⭐⭐⭐</option>
                        <option value="2">⭐⭐</option>
                        <option value="1">⭐</option>
                        <option value="0">0</option>
                </select>

                {/* comments */}
                <textarea
                    placeholder="Write your review here..."
                    value={newReview.comment}
                    onChange={(e) =>
                        setNewReview({...newReview, comment:e.target.value})}
                />

                <button onClick={handleAddReview}>Submit</button>

                <Link to="/Chat"><button>Start Chat!</button></Link>

                <Link to="/Reviews"> ← Back to Reviews Page </Link>

            </div>
            
        </div>
    );

}