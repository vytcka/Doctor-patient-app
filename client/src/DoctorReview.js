import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import './reviews.css'; 
import StarRating from "./StarRating";

export default function DoctorReview(){
    const [doctor, setDoctor] = useState(null);
    const [reviews, setReviews] = useState([]); // reviews loaded from backend
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(""); 
    const [submitMessage, setSubmitMessage] = useState("");

    // Store new review inputted by user
    const [newReview, setNewReview] = useState({
        rating: 0,
        comment: ""
    });

    const [editedReviewId, setEditedReviewId] = useState(null);
    // Store temporary edited review values while editing
    const [editedReview, setEditedReview] = useState({
        rating: 0,
        comment: ""
    });

    // route parameter for doctor id or nhs_number
    const { id } = useParams(); 

    const loadReviews = async () => {
        setLoading(true); 
        setError("");
        setSubmitMessage(""); 

        //get doctor info and reviews from backend using doctor id (nhs_number)
        try {
            const response = await fetch("http://127.0.0.1:5000/doctor/reviews", {
                method: "POST",
                credentials: "include", 
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nhs_number: String(id) })
            });

            const data = await response.json();

            if (!response.ok || data.status !== 200) {
                throw new Error(data.message || "Unable to load reviews from backend."); 
            }

            setDoctor(data.doctor || null); // set doctor info or null if not provided
            setReviews(Array.isArray(data.reviews) ? data.reviews : []); // ensure reviews is an array
        } catch (err) {
            setError(err.message || "Cannot reach backend.");
            setDoctor(null);
            setReviews([]); // clear reviews
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReviews(); // load backend reviews when the doctor id changes
    }, [id]);

    if (loading) {
        return (
            <div className="review-container">
                <p>Loading doctor reviews...</p>
            </div>
        );
    }

    if (!doctor) {
        return (
            <div className="review-container">
                <p>Doctor not found</p>
                {error && <div className="error-message">{error}</div>}
            </div>
        );
    }

    // Adding reviews by sending them to the backend submit-review route
    const handleAddReview = async () => {
        if (newReview.rating === 0 || newReview.comment.trim() === "") {
            setError("Please add a rating and a comment before submitting.");
            return;
        }


        try {
            const formData = new URLSearchParams(); 
            formData.append("rating", String(newReview.rating));
            formData.append("comment", newReview.comment.trim());

            // Send the review to the backend
            const response = await fetch(`http://127.0.0.1:5000/submit-review/${String(id)}`, {
                method: "POST",
                credentials: "include",
                body: formData
            });

            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to submit review.");
            }

            setSubmitMessage(data.message || "Review submitted successfully.");
            setError("");
            setNewReview({ rating: 0, comment: "" });
            setEditedReviewId(null);
            await loadReviews(); // refresh the approved review list after submission
        } catch (err) {
            setError(err.message || "Failed to submit review.");
        }
    }

    //Enable edit mode for selected review
    const handleEdit = (review) => {
        setEditedReviewId(review.id);
        setEditedReview({
            rating: review.rating,
            comment: review.comment
        });
    };

    // Save edited review to the backend or locally when backend is unavailable
    const handleSaveEdit = async (reviewId) => {
        if (editedReview.rating === 0 || editedReview.comment.trim() === "") {
            setError("Please add a rating and comment before saving your edit.");
            return;
        }


        try {
            const formData = new URLSearchParams();
            formData.append("rating", String(editedReview.rating)); 
            formData.append("comment", editedReview.comment.trim());

            // Send the edited review to the backend
            const response = await fetch(`http://127.0.0.1:5000/submit-review/${String(id)}`, {
                method: "POST",
                credentials: "include",
                body: formData
            });

            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.message || "Failed to save review edit.");
            }

            setSubmitMessage(data.message || "Review updated successfully.");
            setError("");
            setEditedReviewId(null);
            await loadReviews(); // reload reviews after edit
        } catch (err) {
            setError(err.message || "Failed to save review edit.");
            setEditedReviewId(null);
        }
    }

    // calculate average rating if reviews exist
    const averageRating = reviews.length > 0 ? (
        reviews.reduce((sum, r) => sum + Number(r.rating), 0) /
        reviews.length
    ).toFixed(1) : 0;

    // Convert numeric rating into star rating strings 
    const renderStars = (rating) => {
        const numericRating = Number(rating);
        return Number.isFinite(numericRating) && numericRating > 0
            ? "⭐".repeat(Math.round(numericRating))
            : "";
    };

    // Show average rating if reviews exist, otherwise show N/A
    const displayedRating = reviews.length > 0 ? averageRating : "N/A";

    return(
        <div>

            {/* Doctor Information Section */}
            <div className="doctor-info">
                <p><img src={doctor.profileIcon || "/profile-icon.svg"} alt={doctor.name} className="doc-profile-icon"/></p>
                <h1>{doctor.name}</h1>
                <p><b>Rating: </b>{renderStars(displayedRating)} {displayedRating}</p>
                {doctor.specialty && <p><b>Specialty: </b>{doctor.specialty}</p>}
                {doctor.gender && <p><b>Gender: </b>{doctor.gender}</p>}
                {doctor.language && (
                    <p><b>Language: </b>{typeof doctor.language === 'string' ? doctor.language : doctor.language.join(", ")}</p>
                )}
                {doctor.location && <p><b>Location: </b>{doctor.location}</p>}
                {'availability' in doctor && (
                    <p><b>Availability: </b>{doctor.availability ? 'Available' : 'Not available'}</p>
                )}
                {doctor.bio && <p><b>Bio: </b>{doctor.bio}</p>}
            </div>

            {/* Reviews Display */}
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
                                    <StarRating
                                        rating={editedReview.rating}
                                        onRatingChange={(value) =>
                                            setEditedReview({ ...editedReview, rating: value })
                                        }
                                    />

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
                                    <p><StarRating rating={review.rating}/></p>
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

            {/* Add review form */}
            <div className="review-form">
                <h3>Leave a Review</h3>

                {/* Star Rating */}
                <StarRating
                    rating={newReview.rating}
                    onRatingChange={(value) =>
                        setNewReview({ ...newReview, rating: value })
                    }
                />

                {/* comments */}
                <textarea
                    placeholder="Write your review here..."
                    value={newReview.comment}
                    onChange={(e) =>
                        setNewReview({...newReview, comment:e.target.value})}
                />

                {/* show backend or validation error messages */}
                {error && (
                    <div className="error-message">{error}</div>
                )}

                {/* show successful submit/edit feedback */}
                {submitMessage && (
                    <div className="success-message">{submitMessage}</div>
                )}

                <button onClick={handleAddReview}>Submit</button>

                <Link to="/Chat"><button>Start Chat!</button></Link>

                <Link to="/search"> ← Back to Reviews Page </Link>

            </div>
            
        </div>
    );

}