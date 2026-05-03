import { Link } from "react-router-dom";
import Icon from "./LogoIcon.png";

export default function LoginChoice() {
  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logoRow}>
          <img src={Icon} alt="TreatMe Logo" style={styles.logo} />
          <div style={styles.appTitle}>TreatMe</div>
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        <h1 style={styles.heading}>Welcome back to TreatMe</h1>
        <p style={styles.subheading}>
          Connecting patients with trusted medical professionals.<br />
          Please log in to continue.
        </p>

        <p style={styles.question}>Are you a patient or a doctor?</p>

        <div style={styles.cardRow}>
          {/* Patient Card */}
          <div style={styles.card}>
            <div style={styles.cardIcon}>🧑‍⚕️</div>
            <h2 style={styles.cardTitle}>I'm a Patient</h2>
            <p style={styles.cardText}>
              Book appointments, message your doctor, and manage your health requests.
            </p>
            <Link to="/login" style={{ textDecoration: "none" }}>
              <button style={styles.button}>Log in as Patient</button>
            </Link>
          </div>

          {/* Doctor Card */}
          <div style={styles.card}>
            <div style={styles.cardIcon}>👨‍⚕️</div>
            <h2 style={styles.cardTitle}>I'm a Doctor</h2>
            <p style={styles.cardText}>
              View patient requests, manage appointments, and communicate securely.
            </p>
            <Link to="/doctorlogin" style={{ textDecoration: "none" }}>
              <button style={{ ...styles.button, background: "#1b4cb6" }}>Log in as Doctor</button>
            </Link>
          </div>
        </div>

        <p style={styles.signupPrompt}>
          Don't have an account?{" "}
          <Link to="/signup" style={styles.signupLink}>Sign up here</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f4f6",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    background: "white",
    padding: "10px 20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  logoRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    width: 70,
    height: 70,
  },
  appTitle: {
    fontSize: "2rem",
    color: "#1b4cb6",
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    textAlign: "center",
  },
  heading: {
    fontSize: "2.4rem",
    color: "#1b4cb6",
    marginBottom: 12,
  },
  subheading: {
    fontSize: "1.1rem",
    color: "#6b7280",
    marginBottom: 8,
    lineHeight: 1.6,
  },
  question: {
    fontSize: "1.2rem",
    color: "#374151",
    fontWeight: "600",
    marginBottom: 32,
  },
  cardRow: {
    display: "flex",
    gap: 24,
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 36,
  },
  card: {
    background: "white",
    borderRadius: 12,
    padding: "36px 32px",
    width: 260,
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 12,
  },
  cardIcon: {
    fontSize: "3rem",
  },
  cardTitle: {
    fontSize: "1.3rem",
    color: "#1b4cb6",
    margin: 0,
  },
  cardText: {
    fontSize: "0.95rem",
    color: "#6b7280",
    lineHeight: 1.5,
    textAlign: "center",
    margin: 0,
  },
  button: {
    padding: "12px 24px",
    borderRadius: 8,
    background: "#3b82f6",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    marginTop: 8,
    width: "100%",
  },
  signupPrompt: {
    color: "#6b7280",
    fontSize: "0.95rem",
  },
  signupLink: {
    color: "#3b82f6",
    fontWeight: "600",
    textDecoration: "none",
  },
};