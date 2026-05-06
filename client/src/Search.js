import { React, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import './reviews.css'; 
import StarRating from "./StarRating";
import Icon from "./LogoIcon.png";
console.log("SEARCH FILE LOADED");
const doctor = (doc) => {
    let avgRating = 0;
    if (Array.isArray(doc.reviews) && doc.reviews.length > 0) {
        const sum = doc.reviews.reduce((total, r) => total + Number(r.rating), 0);
        avgRating = (sum / doc.reviews.length);
    } else {
        avgRating = Number(doc.rating) || 0;
    }

    return {
        id: doc.nhs_number || doc.id,
        name: doc.first_name && doc.last_name 
            ? `${doc.first_name} ${doc.last_name}` 
            : doc.name,
        specialty: doc.specialty || "",
        rating: avgRating, 
        gender: doc.gender || "Unknown",
        language: Array.isArray(doc.language)
            ? doc.language
            : String(doc.language || "").split(",").map((lang) => lang.trim()).filter(Boolean),
        location: doc.location || "",
        profileIcon: doc.profileIcon || "/profile-icon.svg",
    };
};

export default function Search() {
    console.log("Search component rendered");
    const [query, setQuery] = useState("")
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const [selectedFilters, setSelectedFilters] = useState({
            name: "",
            specialty: "",
            rating: "",
            gender: "",
            language: "",
            location: "",
        }); 

    useEffect(() => {
        const loadDoctors = async () => {
            try {
                const response = await fetch("http://127.0.0.1:5000/filter", {
                    method : "POST",
                    credentials: "include",
                    headers: {
                        "Content-Type": "application/json"
                        },
                        body: JSON.stringify(selectedFilters)
                });
                if (!response.ok) {
                    throw new Error(`Could not load doctors: ${response.status}`);
                }
                const data = await response.json();
                console.log(data)
                // First, map doctors without ratings
                let mappedDoctors = Array.isArray(data.objects) ? data.objects.map(doctor) : [];

                // Then, fetch reviews for each doctor to calculate average rating
                const doctorsWithRatings = await Promise.all(
                    mappedDoctors.map(async (doc) => {
                        try {
                            const reviewResponse = await fetch("http://127.0.0.1:5000/doctor/reviews", {
                                method: "POST",
                                credentials: "include",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({ nhs_number: String(doc.id) })
                            });
                            if (reviewResponse.ok) {
                                const reviewData = await reviewResponse.json();
                                if (reviewData.status === 200 && Array.isArray(reviewData.reviews)) {
                                    const reviews = reviewData.reviews;
                                    if (reviews.length > 0) {
                                        const avgRating = reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length;
                                        return { ...doc, rating: avgRating };
                                    }
                                }
                            }
                        } catch (err) {
                            console.error(`Failed to load reviews for doctor ${doc.id}:`, err);
                            console.log(err)
                        }
                        return doc; 
                        console.log(doc)
                    })
                );

                setDoctors(doctorsWithRatings);
                setError(null);
            } catch (err) {
                setDoctors([]);
                setError("Cannot reach backend.");
            } finally {
                setLoading(false);
            }
        };
        loadDoctors();
    }, []);

    if (loading) {
        return <div className="review-container"><p>Loading doctors...</p></div>;
    }

        const filters = [
                         {key: "specialty", label:"Specialty"},
                         {key: "rating", label: "Rating"},
                         {key: "gender", label: "Gender"},
                         {key: "language", label: "Language"},
                         {key: "location", label: "Location"}
                        ];
    
        const filteredDoctors = doctors.filter((item) => {
                return (
                    //search
                    (query === "" ||
                        item.name.toLowerCase().includes(query.toLowerCase()) ||
                        item.specialty.toLowerCase().includes(query.toLowerCase()) ||
                        item.gender.toLowerCase().includes(query.toLowerCase()) ||
                        item.language.some(lang => lang.toLowerCase().includes(query.toLowerCase())) ||
                        item.location.toLowerCase().includes(query.toLowerCase())
                    ) &&

                    //Specialty Filter
                    (selectedFilters.specialty === "" || item.specialty.toLowerCase() === selectedFilters.specialty.toLowerCase()) &&

                    //Rating Filter
                    (selectedFilters.rating === "" || item.rating >= Number(selectedFilters.rating)) &&

                    //Gender Filter
                    (selectedFilters.gender === "" || item.gender.toLowerCase() === selectedFilters.gender.toLowerCase()) &&

                    //Language Filter
                    (selectedFilters.language === "" || item.language.some(lang => lang.toLowerCase() === selectedFilters.language.toLowerCase())) &&

                    //Location Filter
                    (selectedFilters.location === "" || item.location.toLowerCase() === selectedFilters.location.toLowerCase())
                );
            });

            //Get unique values for options
            //Specialty
            const specialtyOptions = [
                ...new Set(doctors.map(item => item.specialty).filter(Boolean)) //filter(Boolean) removes empty or null
            ];
            //rating
            const ratingOptions = [...new Set(doctors.map(item => item.rating))].sort();
            //language
            const languageOptions = [
                ...new Set(doctors.flatMap(item => item.language).filter(Boolean)) 
            ];
            //location
            const locationOptions = [
                ...new Set(doctors.map(item => item.location).filter(Boolean))
            ];

    return(
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img src={Icon} alt="Description" style={{ width: "100px", height: "100px", marginRight: "10px" }} />
                  <div style={{ fontSize: "2rem", color: "#1b4cb6", fontWeight: "bold" }}>TreatMe</div>{/* App title */}
                </div>
                {/* Buttons for: Home, PostaRequest, Reviews, Login and their colours + placements */}
                <div style={{ display: "flex", gap: "10px" }}>
                  <Link to="/" style={{ textDecoration: "none" }}>
                    <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Home</button>
                  </Link>
                  <Link to="/post-request" style={{ textDecoration: "none" }}>
                    <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Post a Request</button>
                  </Link>
                  <Link to="/search" style={{ textDecoration: "none" }}>
                    <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Search for Doctors</button>
                  </Link>
                  <Link to="/login" style={{ textDecoration: "none" }}>
                    <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Login</button>
                  </Link>
                  <Link to="/signup" style={{ textDecoration: "none" }}>
                    <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Signup</button>
                  </Link>
                  <Link to="/chat" style={{ textDecoration: "none" }}>
                    <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Chats</button>
                  </Link>
                </div>
              </div>

            <div className="review-container">
                <h1>Doctors Reviews</h1>
                <h2>Look at reviews for each doctor or leave a review</h2>
                {/* show error if cannot reach backend, just show dummy data instead */}
                {error && (
                    <div style={{ marginBottom: '16px', padding: '12px', borderRadius: '8px', backgroundColor: '#fdecea', color: '#b71c1c' }}>
                        {error}
                    </div>
                )}

                {/*Search bar*/}
                <div className="search-bar">
                    <input
                    type="search"
                    placeholder="🔍 Search"
                    onChange={event => setQuery(event.target.value)}
                    />
                </div>

                {/*Filters*/}
                <div className="filter-container">
                    {filters.map((filter) => (
                        <select 
                            key={filter.key}
                            value={selectedFilters[filter.key]}
                            onChange={(e) => setSelectedFilters({
                                ...selectedFilters,
                                [filter.key]: e.target.value
                            })}
                        >
                            <option value="">All {filter.label}</option>

                            {/*Filter options*/}
                            {filter.key === "specialty" &&
                                specialtyOptions.map((spec) => (
                                    <option key={spec} value={spec}>
                                        {spec}
                                    </option>
                                )
                            )}

                            {filter.key === "rating" &&
                                ratingOptions.map((rate) => (
                                    <option key={rate} value={rate}>
                                        {rate}+
                                    </option>
                                )
                            )}

                            {filter.key === "gender" && (
                                <>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </>
                            )}

                            {filter.key === "language" &&
                                languageOptions.map((lang) => (
                                    <option key={lang} value={lang}>
                                        {lang}
                                    </option>
                                )
                            )}

                            {filter.key === "location" &&
                                locationOptions.map((loc) => (
                                    <option key={loc} value={loc}>
                                        {loc}
                                    </option>
                                )
                            )}

                        </select>
                    ))}
                </div>

                {/*Displays of doctor ratings and info*/}
                <div className="doctor-container">
                    {filteredDoctors.length === 0 ? (
                        <p>No doctors match your filters.</p>
                    ) : (
                        filteredDoctors.map((items) => (
                            <div className="doctor-card" key={items.id} onClick={() => navigate(`/doctor/${items.id}`)}>
                                <img src={items.profileIcon} alt={items.name} className="doc-profile-icon"/>
                                <div className="doctor-info">
                                    <h3>{items.name}</h3>
                                    <p><b>Specialty: </b>{items.specialty}</p>
                                    <p><b>Gender: </b>{items.gender}</p>
                                    <p><b>Language: </b>{items.language.join(", ")}</p>
                                    <p><b>Location: </b>{items.location}</p>
                                </div>

                                <div className="doctor-rating"> 
                                    <StarRating rating={items.rating || 0} />
                                    <p>
                                        {items.rating && items.rating > 0
                                            ? `${items.rating.toFixed(1)} / 5` 
                                            : "No reviews yet"}
                                    </p>
                                    <p>View details →</p>
                                </div>

                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}
