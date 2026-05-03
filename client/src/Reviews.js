import { React, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { data } from "./doctorItems";
import StarRating from "./StarRating";
import Icon from "./LogoIcon.png";

export default function Reviews() {
    const [query, setQuery] = useState("");
    const navigate = useNavigate();

    const [selectedFilters, setSelectedFilters] = useState({
        specialty: "",
        rating: "",
        gender: "",
        language: "",
        location: "",
    });

    const filters = [
        { key: "specialty", label: "Specialty" },
        { key: "rating", label: "Rating" },
        { key: "gender", label: "Gender" },
        { key: "language", label: "Language" },
        { key: "location", label: "Location" }
    ];

    const filteredDoctors = data.filter((item) => {
        return (
            (query === "" ||
                item.name.toLowerCase().includes(query.toLowerCase()) ||
                item.specialty.toLowerCase().includes(query.toLowerCase()) ||
                item.gender.toLowerCase().includes(query.toLowerCase()) ||
                item.language.some(lang => lang.toLowerCase().includes(query.toLowerCase())) ||
                item.location.toLowerCase().includes(query.toLowerCase())
            ) &&
            (selectedFilters.specialty === "" || item.specialty === selectedFilters.specialty) &&
            (selectedFilters.rating === "" || item.rating >= Number(selectedFilters.rating)) &&
            (selectedFilters.gender === "" || item.gender === selectedFilters.gender) &&
            (selectedFilters.language === "" || item.language.some(lang => lang.toLowerCase() === selectedFilters.language.toLowerCase())) &&
            (selectedFilters.location === "" || item.location === selectedFilters.location)
        );
    });

    const specialtyOptions = [...new Set(data.map(item => item.specialty))];
    const ratingOptions = [...new Set(data.map(item => item.rating))].sort();
    const languageOptions = [...new Set(data.flatMap(item => item.language))];
    const locationOptions = [...new Set(data.map(item => item.location))];

    return (
        <div style={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
            {/* Navbar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", backgroundColor: "white", borderBottom: "1px solid #e2e8f0" }}>
                <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                    <img src={Icon} alt="Logo" style={{ width: "100px", height: "100px", marginRight: "10px" }} />
                    <div style={{ fontSize: "2rem", color: "#1b4cb6", fontWeight: "bold" }}>TreatMe</div>
                </Link>
                <div style={{ display: "flex", gap: "10px" }}>
                    <Link to="/post-request" style={{ textDecoration: "none" }}>
                        <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Post a Request</button>
                    </Link>
                    <Link to="/login-choice" style={{ textDecoration: "none" }}>
                        <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Login</button>
                    </Link>
                    <Link to="/signup-choice" style={{ textDecoration: "none" }}>
                        <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Signup</button>
                    </Link>
                    <Link to="/dashboard" style={{ textDecoration: "none" }}>
                        <button style={{ backgroundColor: "#3b82f6", color: "white" }}>User Profile</button>
                    </Link>
                </div>
            </div>

            {/* Page Header */}
            <div style={{ backgroundColor: "#1b4cb6", padding: "40px 30px", textAlign: "center" }}>
                <h1 style={{ color: "white", fontSize: "2rem", margin: "0 0 8px 0" }}>Find a Doctor</h1>
                <p style={{ color: "#bfdbfe", margin: "0 0 24px 0" }}>Search and filter verified doctors, and read patient reviews</p>

                {/* Search bar */}
                <div style={{ maxWidth: "600px", margin: "0 auto" }}>
                    <input
                        type="search"
                        placeholder="🔍 Search by name, specialty, location..."
                        onChange={e => setQuery(e.target.value)}
                        style={{ width: "100%", padding: "14px 20px", borderRadius: "8px", border: "none", fontSize: "1rem", outline: "none", boxSizing: "border-box" }}
                    />
                </div>
            </div>

            <div style={{ maxWidth: "1100px", margin: "30px auto", padding: "0 20px" }}>

                {/* Filters */}
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "24px", backgroundColor: "white", padding: "16px", borderRadius: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                    {filters.map((filter) => (
                        <select
                            key={filter.key}
                            value={selectedFilters[filter.key]}
                            onChange={(e) => setSelectedFilters({ ...selectedFilters, [filter.key]: e.target.value })}
                            style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", fontSize: "0.9rem", color: "#374151", cursor: "pointer" }}
                        >
                            <option value="">All {filter.label}</option>
                            {filter.key === "specialty" && specialtyOptions.map(s => <option key={s} value={s}>{s}</option>)}
                            {filter.key === "rating" && ratingOptions.map(r => <option key={r} value={r}>{r}+ Stars</option>)}
                            {filter.key === "gender" && (<><option value="Male">Male</option><option value="Female">Female</option></>)}
                            {filter.key === "language" && languageOptions.map(l => <option key={l} value={l}>{l}</option>)}
                            {filter.key === "location" && locationOptions.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                    ))}
                    <span style={{ marginLeft: "auto", color: "#607593", fontSize: "0.9rem", alignSelf: "center" }}>
                        {filteredDoctors.length} doctor{filteredDoctors.length !== 1 ? "s" : ""} found
                    </span>
                </div>

                {/* Doctor Cards */}
                {filteredDoctors.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px", color: "#607593", backgroundColor: "white", borderRadius: "12px" }}>
                        No doctors found matching your search.
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {filteredDoctors.map((doctor) => (
                            <div
                                key={doctor.id}
                                onClick={() => navigate(`/doctor/${doctor.id}`)}
                                style={{ backgroundColor: "white", borderRadius: "12px", padding: "20px", display: "flex", alignItems: "center", gap: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", cursor: "pointer", transition: "box-shadow 0.2s" }}
                                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)"}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.1)"}
                            >
                                <img src={doctor.profileIcon} alt={doctor.name} style={{ width: "70px", height: "70px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: "0 0 4px 0", color: "#1b4cb6", textAlign: "left" }}>{doctor.name}</h3>
                                    <p style={{ margin: "0 0 8px 0", color: "#607593", fontSize: "0.9rem" }}>{doctor.specialty}</p>
                                    <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", fontSize: "0.85rem", color: "#374151" }}>
                                        <span>👤 {doctor.gender}</span>
                                        <span>🗣️ {doctor.language.join(", ")}</span>
                                        <span>📍 {doctor.location}</span>
                                    </div>
                                </div>
                                <div style={{ textAlign: "right", flexShrink: 0 }}>
                                    <StarRating rating={doctor.rating} />
                                    <p style={{ margin: "8px 0 0 0", fontSize: "0.8rem", color: "#3b82f6", fontWeight: "600" }}>View Profile →</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}