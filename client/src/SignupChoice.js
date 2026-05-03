import { Link } from "react-router-dom";
import Icon from "./LogoIcon.png";

export default function SignupChoice() {
  return (
    <div>
      {/* Navbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src={Icon} alt="Logo" style={{ width: "100px", height: "100px", marginRight: "10px" }} />
          <div style={{ fontSize: "2rem", color: "#1b4cb6", fontWeight: "bold" }}>TreatMe</div>
        </Link>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link to="/post-request" style={{ textDecoration: "none" }}>
            <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Post a Request</button>
          </Link>
          <Link to="/reviews" style={{ textDecoration: "none" }}>
            <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Find a Doctor</button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px", textAlign: "center" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#1b4cb6", marginBottom: "12px" }}>Welcome to TreatMe</h1>
        <p style={{ fontSize: "1rem", color: "#607593", marginBottom: "8px" }}>
          Connecting patients with trusted medical professionals.<br />
          Please sign up to continue.
        </p>

        <p style={{ fontSize: "1.1rem", color: "#374151", fontWeight: "600", marginBottom: "32px" }}>
          Are you a patient or a doctor?
        </p>

        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", justifyContent: "center", marginBottom: "36px" }}>
          {/* Patient Card */}
          <div style={{ background: "white", borderRadius: "12px", padding: "36px 32px", width: "260px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <div style={{ fontSize: "3rem" }}>🧑‍⚕️</div>
            <h2 style={{ fontSize: "1.3rem", color: "#1b4cb6", margin: 0 }}>I'm a Patient</h2>
            <p style={{ fontSize: "0.9rem", color: "#607593", lineHeight: "1.5", textAlign: "center", margin: 0 }}>
              Book appointments, message your doctor, and manage your health requests.
            </p>
            <Link to="/signup" style={{ textDecoration: "none", width: "100%" }}>
              <button style={{ backgroundColor: "#3b82f6", color: "white", padding: "10px 24px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: "600", width: "100%" }}>
                Sign up as Patient
              </button>
            </Link>
          </div>

          {/* Doctor Card */}
          <div style={{ background: "white", borderRadius: "12px", padding: "36px 32px", width: "260px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <div style={{ fontSize: "3rem" }}>👨‍⚕️</div>
            <h2 style={{ fontSize: "1.3rem", color: "#1b4cb6", margin: 0 }}>I'm a Doctor</h2>
            <p style={{ fontSize: "0.9rem", color: "#607593", lineHeight: "1.5", textAlign: "center", margin: 0 }}>
              View patient requests, manage appointments, and communicate securely.
            </p>
            <Link to="/doctorsignup" style={{ textDecoration: "none", width: "100%" }}>
              <button style={{ backgroundColor: "#1b4cb6", color: "white", padding: "10px 24px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "1rem", fontWeight: "600", width: "100%" }}>
                Sign up as Doctor
              </button>
            </Link>
          </div>
        </div>

        <p style={{ color: "#607593", fontSize: "0.95rem" }}>
          Already have an account?{" "}
          <Link to="/login-choice" style={{ color: "#3b82f6", fontWeight: "600", textDecoration: "none" }}>Log in here</Link>
        </p>
      </div>
    </div>
  );
}