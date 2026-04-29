import { useState } from "react";

export default function UserDashboard() {
    const [username, setUsername] = useState("");
    const [firstName, setFirstName] = useState("");
    const [points, setPoints] = useState(0);
    const [requestStatus, setRequestStatus] = useState(""); //accepted or pending

    const handleDeleteAccount = () => {
        // Implement account deletion logic here
        alert("Account deleted");
    }

    const handleLogout = () => {
        // Implement logout logic here
        alert("Logged out");
    }

    return (
        <div className="user-dashboard">
            <h1>User Dashboard</h1>
            <div className="user-info">
                <p><strong>Username:</strong> {username}</p>
                <p><strong>First Name:</strong> {firstName}</p>
                <p><strong>Points:</strong> {points}</p>
                <p><strong>Request Status:</strong> {requestStatus}</p>
            </div>
            <button onClick={handleDeleteAccount}>Delete Account</button>
            <button onClick={handleLogout}>Logout</button>
        </div>
    )

}