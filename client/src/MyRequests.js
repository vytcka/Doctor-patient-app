import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from './LogoIcon.png';

export default function MyRequests({ isLoggedIn, userData }) {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userData) return;
        fetch("http://127.0.0.1:5000/my-requests", {
            credentials: "include",
            headers: { "X-Username": userData.username }
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 200) setRequests(data.requests);
            })
            .finally(() => setLoading(false));
    }, [userData]);

    const statusColor = (status) => {
        if (status === "REQUEST_STATUS_PENDING") return { color: "#e67e22", bg: "#fef3c7" };
        if (status === "REQUEST_STATUS_ACCEPTED") return { color: "#15803d", bg: "#dcfce7" };
        if (status === "REQUEST_STATUS_REJECTED") return { color: "#ef4444", bg: "#fdecea" };
        return { color: "#607593", bg: "#f1f5f9" };
    };

    const statusLabel = (status) => {
        if (status === "REQUEST_STATUS_PENDING") return "Pending";
        if (status === "REQUEST_STATUS_ACCEPTED") return "Accepted";
        if (status === "REQUEST_STATUS_REJECTED") return "Rejected";
        return status;
    };

    return (
        <div style={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", backgroundColor: "white", borderBottom: "1px solid #e2e8f0" }}>
                <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
                    <img src={Icon} alt="Logo" style={{ width: "100px", height: "100px", marginRight: "10px" }} />
                    <div style={{ fontSize: "2rem", color: "#1b4cb6", fontWeight: "bold" }}>TreatMe</div>
                </Link>
                <div style={{ display: "flex", gap: "10px" }}>
                    <Link to="/dashboard"><button style={{ backgroundColor: "#3b82f6", color: "white" }}>Dashboard</button></Link>
                    <Link to="/post-request"><button style={{ backgroundColor: "#3b82f6", color: "white" }}>New Request</button></Link>
                </div>
            </div>

            <div style={{ maxWidth: "700px", margin: "40px auto", padding: "0 20px" }}>
                <h1 style={{ color: "#040f25", marginBottom: "24px" }}>My Requests</h1>

                {loading ? (
                    <p style={{ color: "#607593" }}>Loading...</p>
                ) : requests.length === 0 ? (
                    <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "40px", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                        <p style={{ color: "#607593" }}>You haven't submitted any requests yet.</p>
                        <Link to="/post-request">
                            <button style={{ backgroundColor: "#3b82f6", color: "white", padding: "10px 24px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold", marginTop: "16px" }}>
                                Submit a Request
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {requests.map(req => {
                            const { color, bg } = statusColor(req.status);
                            return (
                                <div key={req.id} style={{ backgroundColor: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                        <h3 style={{ margin: 0, color: "#040f25" }}>Request #{req.id}</h3>
                                        <span style={{ backgroundColor: bg, color: color, padding: "4px 12px", borderRadius: "20px", fontSize: "0.8rem", fontWeight: "bold" }}>
                                            {statusLabel(req.status)}
                                        </span>
                                    </div>
                                    <p style={{ margin: "0 0 8px 0", color: "#607593", fontSize: "0.85rem" }}>
                                        Submitted: {new Date(req.created_at).toLocaleDateString()}
                                    </p>
                                    <p style={{ margin: "0 0 8px 0" }}><strong>Age:</strong> {req.age}</p>
                                    <p style={{ margin: "0 0 8px 0" }}><strong>Symptoms:</strong> {req.symptoms}</p>
                                    <p style={{ margin: 0, color: "#607593", fontSize: "0.9rem" }}>{req.symptoms_details}</p>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}