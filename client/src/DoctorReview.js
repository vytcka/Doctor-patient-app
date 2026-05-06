import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import './reviews.css'; 
import StarRating from "./StarRating";
import Icon from "./LogoIcon.png";

export default function DoctorReview({ isLoggedIn }){
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

            setDoctor(data.doctor || null); 
            setReviews(Array.isArray(data.reviews) ? data.reviews : []); // ensure reviews is an array
        } catch (err) {
            setError(err.message || "Cannot reach backend1.");
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

            {isLoggedIn ? (
                        <Link to="/dashboard" style={{ textDecoration: "none" }}>
                            <button style={{ backgroundColor: "#3b82f6", color: "white" }}>User Profile</button>
                        </Link>
                        ) : (
                        <>
                            <Link to="/login-choice" style={{ textDecoration: "none" }}>
                                <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Login</button>
                            </Link>
                            <Link to="/signup-choice" style={{ textDecoration: "none" }}>
                                <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Signup</button>
                            </Link>
                        </>
                    )
            }

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

            <div style={{ maxWidth: "1100px", margin: "30px auto", padding: "0 20px" }}>

                {/* Back link */}
                <Link to="/search" style={{ color: "#3b82f6", textDecoration: "none", fontSize: "0.9rem", display: "inline-block", marginBottom: "20px" }}>
                    ← Back to Search
                </Link>

                {/* Two column layout */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "24px", alignItems: "start" }}>

                    {/* Left column */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

                        {/* Doctor header card */}
                        <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "30px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                            <div style={{ display: "flex", gap: "20px", alignItems: "center", marginBottom: "20px" }}>
                                <img src={doctor.profileIcon} alt={doctor.name}
                                    style={{ width: "90px", height: "90px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                                <div>
                                    <h1 style={{ margin: "0 0 4px 0", color: "#1b4cb6", fontSize: "1.6rem" }}>{doctor.name}</h1>
                                    <p style={{ margin: "0 0 8px 0", color: "#607593" }}>{doctor.specialty}</p>
                                    {averageRating ? (
                                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                            <StarRating rating={Number(averageRating)} />
                                            <span style={{ color: "#f39c12", fontWeight: "bold" }}>{averageRating}</span>
                                            <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>({reviews.length} review{reviews.length !== 1 ? "s" : ""})</span>
                                        </div>
                                    ) : (
                                        <span style={{ color: "#94a3b8", fontSize: "0.85rem" }}>No reviews yet</span>
                                    )}
                                </div>
                            </div>

                            <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "20px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                <p style={{ margin: 0, color: "#374151", fontSize: "0.9rem" }}><span style={{ color: "#607593", fontWeight: "600" }}>Gender: </span>{doctor.gender}</p>
                                <p style={{ margin: 0, color: "#374151", fontSize: "0.9rem" }}><span style={{ color: "#607593", fontWeight: "600" }}>Language: </span>{doctor.language.join(", ")}</p>
                                <p style={{ margin: 0, color: "#374151", fontSize: "0.9rem" }}><span style={{ color: "#607593", fontWeight: "600" }}>Location: </span>{doctor.location}</p>
                                <p style={{ margin: 0, color: "#374151", fontSize: "0.9rem" }}><span style={{ color: "#607593", fontWeight: "600" }}>Availability: </span>{doctor.availability.days} {doctor.availability.time}</p>
                            </div>
                        </div>

                        {/* Bio card */}
                        <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                            <h3 style={{ color: "#1b4cb6", marginTop: 0, marginBottom: "12px" }}>About</h3>
                            <p style={{ margin: 0, color: "#374151", lineHeight: "1.7", fontSize: "0.95rem" }}>{doctor.bio}</p>
                        </div>

                        {/* Reviews */}
                        <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                            <h3 style={{ color: "#1b4cb6", marginTop: 0, marginBottom: "20px" }}>Patient Reviews</h3>
                            {reviews.length === 0 ? (
                                <div style={{ textAlign: "center", padding: "30px", color: "#94a3b8" }}>No reviews yet — be the first!</div>
                            ) : (
                                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                    {reviews.map((review) => (
                                        <div key={review.id} style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "16px" }}>
                                            {editedReviewId === review.id ? (
                                                <>
                                                    <StarRating rating={editedReview.rating} onRatingChange={(value) => setEditedReview({ ...editedReview, rating: value })} />
                                                    <textarea
                                                        value={editedReview.comment}
                                                        onChange={(e) => setEditedReview({ ...editedReview, comment: e.target.value })}
                                                        style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #e2e8f0", marginTop: "10px", boxSizing: "border-box" }}
                                                    />
                                                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                                                        <button onClick={() => handleSaveEdit(review.id)} style={{ backgroundColor: "#27ae60", color: "white", padding: "8px 20px", borderRadius: "6px", border: "none", cursor: "pointer" }}>Save</button>
                                                        <button onClick={() => setEditedReviewId(null)} style={{ backgroundColor: "#f0f4ff", color: "#1b4cb6", padding: "8px 20px", borderRadius: "6px", border: "1px solid #ccd9ee", cursor: "pointer" }}>Cancel</button>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <StarRating rating={review.rating} />
                                                    <p style={{ margin: "8px 0", color: "#374151" }}>{review.comment}</p>
                                                    <button onClick={() => handleEdit(review)} style={{ backgroundColor: "#f0f4ff", color: "#1b4cb6", padding: "6px 16px", borderRadius: "6px", border: "1px solid #ccd9ee", cursor: "pointer", fontSize: "0.85rem" }}>Edit</button>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Leave a review - only show if logged in */}
                        {isLoggedIn && (
                            <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                                <h3 style={{ color: "#1b4cb6", marginTop: 0, marginBottom: "16px" }}>Leave a Review</h3>
                                <StarRating rating={newReview.rating} onRatingChange={(value) => setNewReview({ ...newReview, rating: value })} />
                                <textarea
                                    placeholder="Write your review here..."
                                    value={newReview.comment}
                                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", marginTop: "12px", minHeight: "100px", fontSize: "0.9rem", boxSizing: "border-box", resize: "vertical" }}
                                />
                                <button
                                    onClick={handleAddReview}
                                    disabled={newReview.rating === 0 || newReview.comment === ""}
                                    style={{ marginTop: "12px", backgroundColor: newReview.rating === 0 || newReview.comment === "" ? "#94a3b8" : "#3b82f6", color: "white", padding: "10px 28px", borderRadius: "8px", border: "none", cursor: newReview.rating === 0 || newReview.comment === "" ? "not-allowed" : "pointer", fontWeight: "bold" }}>
                                    Submit Review
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Right column - action card */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                            <h3 style={{ color: "#1b4cb6", marginTop: 0, marginBottom: "16px" }}>Consult this Doctor</h3>
                            <p style={{ color: "#607593", fontSize: "0.9rem", marginBottom: "20px", lineHeight: "1.6" }}>
                                Start a secure private chat with {doctor.name} to discuss your symptoms and get medical advice.
                            </p>
                            {isLoggedIn ? (
                                <>
                                    <Link to="/chat" style={{ textDecoration: "none" }}>
                                        <button style={{ width: "100%", backgroundColor: "#1b4cb6", color: "white", padding: "12px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "1rem" }}>
                                            Start Chat
                                        </button>
                                    </Link>
                                    <Link to="/post-request" style={{ textDecoration: "none" }}>
                                        <button style={{ width: "100%", backgroundColor: "#f0f4ff", color: "#1b4cb6", padding: "12px", borderRadius: "8px", border: "1px solid #ccd9ee", cursor: "pointer", fontWeight: "bold", fontSize: "1rem", marginTop: "10px" }}>
                                            Post a Request
                                        </button>
                                    </Link>
                                </>
                            ) : (
                                <p style={{ color: "#607593", fontSize: "0.9rem", textAlign: "center" }}>
                                    <Link to="/login-choice" style={{ color: "#3b82f6", fontWeight: "600" }}>Log in</Link> to start chatting with this doctor.
                                </p>
                            )}
                        </div>

                        <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                            <h3 style={{ color: "#1b4cb6", marginTop: 0, marginBottom: "16px" }}>Quick Info</h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <div style={{ padding: "12px", backgroundColor: "#f5f7fa", borderRadius: "8px" }}>
                                    <p style={{ margin: "0 0 2px 0", fontSize: "0.8rem", color: "#94a3b8" }}>Specialty</p>
                                    <p style={{ margin: 0, fontWeight: "600", color: "#374151" }}>{doctor.specialty}</p>
                                </div>
                                <div style={{ padding: "12px", backgroundColor: "#f5f7fa", borderRadius: "8px" }}>
                                    <p style={{ margin: "0 0 2px 0", fontSize: "0.8rem", color: "#94a3b8" }}>Location</p>
                                    <p style={{ margin: 0, fontWeight: "600", color: "#374151" }}>{doctor.location}</p>
                                </div>
                                <div style={{ padding: "12px", backgroundColor: "#f5f7fa", borderRadius: "8px" }}>
                                    <p style={{ margin: "0 0 2px 0", fontSize: "0.8rem", color: "#94a3b8" }}>Availability</p>
                                    <p style={{ margin: 0, fontWeight: "600", color: "#374151" }}>{doctor.availability.days} {doctor.availability.time}</p>
                                </div>
                                <div style={{ padding: "12px", backgroundColor: "#f5f7fa", borderRadius: "8px" }}>
                                    <p style={{ margin: "0 0 2px 0", fontSize: "0.8rem", color: "#94a3b8" }}>Languages</p>
                                    <p style={{ margin: 0, fontWeight: "600", color: "#374151" }}>{doctor.language.join(", ")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
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