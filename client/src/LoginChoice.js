import { Link } from "react-router-dom";
import Icon from "./LogoIcon.png";

export default function LoginChoice() {
  return (
    <div style={{ fontFamily: "'Segoe UI', -apple-system, sans-serif", minHeight: "100vh", backgroundColor: "#f0f4ff" }}>

      {/* Navbar - matches homepage */}
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "0 40px", height: "68px",
        backgroundColor: "white",
        borderBottom: "1px solid #e8edf5",
        boxShadow: "0 1px 8px rgba(27,75,182,0.06)",
        position: "sticky", top: 0, zIndex: 100
      }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", gap: "10px" }}>
          <img src={Icon} alt="Logo" style={{ width: "44px", height: "44px" }} />
          <span style={{ fontSize: "1.4rem", color: "#1b4cb6", fontWeight: "800", letterSpacing: "-0.3px" }}>TreatMe</span>
        </Link>
<div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
  <Link to="/" style={{ textDecoration: "none" }}>
    <button style={{ background: "none", border: "none", color: "#334155", fontWeight: "500", fontSize: "0.9rem", padding: "8px 14px", cursor: "pointer" }}>Home</button>
  </Link>
  <Link to="/search" style={{ textDecoration: "none" }}>
    <button style={{ background: "none", border: "none", color: "#334155", fontWeight: "500", fontSize: "0.9rem", padding: "8px 14px", cursor: "pointer" }}>Find a Doctor</button>
  </Link>
  <Link to="/signup-choice" style={{ textDecoration: "none" }}>
    <button style={{ backgroundColor: "#1b4cb6", color: "white", border: "none", borderRadius: "50px", padding: "10px 22px", fontSize: "0.88rem", fontWeight: "700", cursor: "pointer" }}>Sign Up</button>
  </Link>
</div>
      </div>

      {/* Main Content */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", textAlign: "center" }}>
        <p style={{ fontSize: "0.8rem", fontWeight: "700", color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "12px", opacity: 1 }}>Welcome back</p>
        <h1 style={{ fontSize: "2.2rem", fontWeight: "800", color: "#0f1f4b", marginBottom: "12px" }}>Log in to TreatMe</h1>
        <p style={{ fontSize: "1rem", color: "#64748b", marginBottom: "48px", lineHeight: "1.6", opacity: 1 }}>
          Connecting patients with trusted medical professionals.
        </p>

        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", justifyContent: "center", marginBottom: "36px" }}>

          {/* Patient Card */}
          <div style={{
            background: "white", borderRadius: "16px", padding: "40px 32px", width: "260px",
            boxShadow: "0 4px 24px rgba(27,75,182,0.08)", border: "1.5px solid #e2eaf8",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "16px",
          }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #dbeafe" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <h2 style={{ fontSize: "1.2rem", color: "#0f1f4b", margin: 0, fontWeight: "700" }}>I'm a Patient</h2>
            <p style={{ fontSize: "0.88rem", color: "#64748b", lineHeight: "1.6", textAlign: "center", margin: 0, opacity: 1 }}>
              Book appointments, message your doctor, and manage your health requests.
            </p>
            <Link to="/login" style={{ textDecoration: "none", width: "100%", marginTop: "auto" }}>
              <button style={{ backgroundColor: "#3b82f6", color: "white", padding: "12px 24px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "0.95rem", fontWeight: "700", width: "100%", boxShadow: "0 2px 8px rgba(59,130,246,0.3)" }}>
                Log in as Patient
              </button>
            </Link>
          </div>

          {/* Doctor Card */}
          <div style={{
            background: "white", borderRadius: "16px", padding: "40px 32px", width: "260px",
            boxShadow: "0 4px 24px rgba(27,75,182,0.08)", border: "1.5px solid #e2eaf8",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "16px",
          }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "#eff6ff", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #dbeafe" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#1b4cb6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
                <path d="M12 11v4M10 13h4"/>
              </svg>
            </div>
            <h2 style={{ fontSize: "1.2rem", color: "#0f1f4b", margin: 0, fontWeight: "700" }}>I'm a Doctor</h2>
            <p style={{ fontSize: "0.88rem", color: "#64748b", lineHeight: "1.6", textAlign: "center", margin: 0, opacity: 1 }}>
              View patient requests, manage appointments, and communicate securely.
            </p>
            <Link to="/doctorlogin" style={{ textDecoration: "none", width: "100%" }}>
              <button style={{ backgroundColor: "#1b4cb6", color: "white", padding: "12px 24px", borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "0.95rem", fontWeight: "700", width: "100%", boxShadow: "0 2px 8px rgba(27,75,182,0.3)" }}>
                Log in as Doctor
              </button>
            </Link>
          </div>
        </div>

        <p style={{ color: "#64748b", fontSize: "0.95rem", opacity: 1 }}>
          Don't have an account?{" "}
          <Link to="/signup-choice" style={{ color: "#3b82f6", fontWeight: "600", textDecoration: "none" }}>Sign up here</Link>
        </p>
      </div>
    </div>
  );
}