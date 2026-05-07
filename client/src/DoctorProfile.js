import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Icon from './LogoIcon.png';
import StarRating from './StarRating';

export default function DoctorProfile() {
    const { id } = useParams();  // gets the nhs_number from the URL
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch("http://127.0.0.1:5000/doctor/reviews", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nhs_number: id })
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 200) {
                    setDoctor(data.doctor);
                    setReviews(data.reviews);
                    setAvgRating(data.avg_rating);
                } else {
                    setError("Doctor not found.");
                }
            })
            .catch(() => setError("Could not reach server."))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return <div style={{ textAlign: "center", marginTop: "100px" }}>Loading...</div>;
    if (error) return <div style={{ textAlign: "center", marginTop: "100px", color: "red" }}>{error}</div>;

    return (
        <div style={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
            {/* Navbar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", backgroundColor: "white", borderBottom: "1px solid #e2e8f0" }}>
                <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                    <img src={Icon} alt="Logo" style={{ width: "100px", height: "100px", marginRight: "10px" }} />
                    <div style={{ fontSize: "2rem", color: "#1b4cb6", fontWeight: "bold" }}>TreatMe</div>
                </Link>
                <div style={{ display: "flex", gap: "10px" }}>
                    <Link to="/search"><button style={{ backgroundColor: "#3b82f6", color: "white" }}>Back to Search</button></Link>
                </div>
            </div>

            <div style={{ maxWidth: "700px", margin: "40px auto", padding: "0 20px" }}>
                {/* Doctor info card */}
                <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "40px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", marginBottom: "24px" }}>
                    <div style={{ display: "flex", gap: "24px", alignItems: "center", marginBottom: "24px" }}>
                        <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", color: "white", flexShrink: 0 }}>
                            👤
                        </div>
                        <div>
                            <h1 style={{ margin: 0, color: "#040f25" }}>{doctor.name}</h1>
                            <p style={{ margin: "4px 0", color: "#607593" }}>{doctor.specialty}</p>
                            <StarRating rating={avgRating || 0} />
                            <p style={{ margin: "4px 0", color: "#607593", fontSize: "0.9rem" }}>
                                {avgRating ? `${avgRating} / 5` : "No reviews yet"}
                            </p>
                        </div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
                        <p style={{ margin: 0 }}><span style={{ color: "#607593" }}>Gender: </span>{doctor.gender}</p>
                        <p style={{ margin: 0 }}><span style={{ color: "#607593" }}>Language: </span>{doctor.language}</p>
                        <p style={{ margin: 0 }}><span style={{ color: "#607593" }}>Location: </span>{doctor.location}</p>
                        <p style={{ margin: 0 }}><span style={{ color: "#607593" }}>Availability: </span>
                            <span style={{ color: doctor.availability ? "#15803d" : "#b91c1c" }}>
                                {doctor.availability ? "Available" : "Unavailable"}
                            </span>
                        </p>
                    </div>

                    {doctor.bio && (
                        <div>
                            <p style={{ color: "#607593", fontWeight: "bold", marginBottom: "8px" }}>About</p>
                            <p style={{ color: "#040f25", lineHeight: "1.6" }}>{doctor.bio}</p>
                        </div>
                    )}

                    <button
                        onClick={() => navigate(`/post-request?doctor=${id}`)}
                        style={{ marginTop: "24px", width: "100%", backgroundColor: "#3b82f6", color: "white", padding: "12px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "1rem" }}>
                        Request Appointment
                    </button>
                </div>

                {/* Reviews */}
                <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "40px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                    <h2 style={{ color: "#040f25", marginTop: 0 }}>Reviews ({reviews.length})</h2>
                    {reviews.length === 0 ? (
                        <p style={{ color: "#607593" }}>No reviews yet.</p>
                    ) : (
                        reviews.map((review) => (
                            <div key={review.id} style={{ borderBottom: "1px solid #e2e8f0", paddingBottom: "16px", marginBottom: "16px" }}>
                                <StarRating rating={review.rating} />
                                <p style={{ margin: "8px 0", color: "#040f25" }}>{review.comment}</p>
                                <p style={{ margin: 0, fontSize: "0.8rem", color: "#94a3b8" }}>{review.created_at}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}