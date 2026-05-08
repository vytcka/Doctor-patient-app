import { useState } from 'react';
import { Link } from 'react-router-dom';
import myImage1 from './Homepage1.png';
import myImage2 from './Homepage2.png';
import Icon from './LogoIcon.png';

const styles = {
  page: {
    fontFamily: "'Segoe UI', sans-serif",
    background: "#ffffff",
    minHeight: "100vh",
  },

  /* ── ABOUT SECTION ── */
  aboutSection: {
    background: "#ffffff",
    borderTop: "1px solid #e2eaf8",
    borderBottom: "1px solid #e2eaf8",
  },
  aboutInner: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "64px 32px",
    display: "flex",
    alignItems: "center",
    gap: "64px",
  },
  aboutImage: {
    width: "260px",
    height: "260px",
    borderRadius: "24px",
    objectFit: "cover",
    flexShrink: 0,
    boxShadow: "0 8px 32px rgba(27,75,182,0.12)",
  },
  aboutText: {
    flex: 1,
  },
  sectionLabel: {
    display: "inline-block",
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    color: "#3b82f6",
    background: "#eff6ff",
    border: "1px solid #dbeafe",
    borderRadius: "6px",
    padding: "3px 10px",
    marginBottom: "12px",
  },
  sectionTitle: {
    fontSize: "2rem",
    fontWeight: 800,
    color: "#1b3f8a",
    margin: "0 0 16px",
    lineHeight: 1.2,
  },
  bodyText: {
    fontSize: "1rem",
    color: "#475569",
    lineHeight: 1.7,
    margin: "0 0 12px",
  },
  subText: {
    fontSize: "0.875rem",
    color: "#64748b",
    lineHeight: 1.7,
    margin: 0,
    paddingLeft: "12px",
    borderLeft: "3px solid #93c5fd",
  },

  /* ── FEATURES SECTION ── */
  featuresSection: {
    background: "linear-gradient(135deg, #eef4ff 0%, #f0f6ff 60%, #e8f0fe 100%)",
    borderTop: "1px solid #e2eaf8",
    borderBottom: "1px solid #e2eaf8",
  },
  featuresInner: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "64px 32px",
    display: "flex",
    alignItems: "center",
    gap: "64px",
  },
  featuresText: {
    flex: 1,
  },
  featuresList: {
    listStyle: "none",
    padding: 0,
    margin: "24px 0 0",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  featureItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    fontSize: "0.9rem",
    color: "#475569",
    lineHeight: 1.6,
  },
  featureIcon: {
    width: "28px",
    height: "28px",
    borderRadius: "8px",
    background: "#eff6ff",
    border: "1px solid #dbeafe",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    flexShrink: 0,
    marginTop: "1px",
  },
  featuresImage: {
    width: "320px",
    height: "320px",
    borderRadius: "24px",
    objectFit: "cover",
    flexShrink: 0,
    boxShadow: "0 8px 32px rgba(27,75,182,0.1)",
  },

  /* ── POST REVIEW SECTION ── */
  ctaSection: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "64px 32px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  ctaText: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  ctaDesc: {
    fontSize: "1rem",
    color: "#64748b",
    margin: "8px 0 28px",
    lineHeight: 1.6,
  },
  ctaButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#3b82f6",
    color: "#ffffff",
    fontSize: "1rem",
    fontWeight: 600,
    padding: "14px 32px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 4px 14px rgba(59,130,246,0.35)",
    textDecoration: "none",
    transition: "transform 0.15s, box-shadow 0.15s",
  },
};


const features = [
  { icon: "💬", label: "Secure chat with file sharing", desc: "Send messages, images, and audio files safely within private consultations" },
  { icon: "✅", label: "Moderation & verified doctors", desc: "All profiles are vetted and content monitored for quality and safety" },
  { icon: "⭐", label: "Doctor reviews & ratings", desc: "Leave feedback to help others find the right doctor" },
  { icon: "🕵️", label: "Anonymous messaging & posting", desc: "Ask questions while protecting your identity" },
  { icon: "📅", label: "Appointment booking", desc: "Seamlessly book in-person appointments after consulting" },
];

function Home({ isLoggedIn, userRole }) {
  const [ctaHovered, setCtaHovered] = useState(false);

  return (
    <div style={styles.page}>

      {/* ── NAVIGATION ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src={Icon} alt="Logo" style={{ width: "100px", height: "100px", marginRight: "10px" }} />
          <div style={{ fontSize: "2rem", color: "#1b4cb6", fontWeight: "bold" }}>TreatMe</div>
        </Link>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link to="/post-request" style={{ textDecoration: "none" }}>
            <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Post a Request</button>
          </Link>
          <Link to="/search" style={{ textDecoration: "none" }}>
            <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Find a Doctor</button>
          </Link>
          {isLoggedIn ? (
            <>
              <Link to="/chat" style={{ textDecoration: "none" }}>
                <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Chats</button>
              </Link>
              <Link to={userRole === 'doctor' ? '/doctor-dashboard' : '/Dashboard'} style={{ textDecoration: "none" }}>
                <button style={{ backgroundColor: "#3b82f6", color: "white" }}>User Profile</button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login-choice" style={{ textDecoration: "none" }}>
                <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Login</button>
              </Link>
              <Link to="/signup-choice" style={{ textDecoration: "none" }}>
                <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Signup</button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* ── ABOUT US ── */}
      <div style={styles.aboutSection}>
        <div style={styles.aboutInner}>
          <img src={myImage2} alt="About TreatMe" style={styles.aboutImage} />
          <div style={styles.aboutText}>
            <span style={styles.sectionLabel}>Who we are</span>
            <p style={styles.sectionTitle}>About Us</p>
            <p style={styles.bodyText}>
              TreatMe helps you connect with doctors for reliable health advice. Ask questions, chat securely, and get the support you need — when you need it. Real doctors. Real answers.
            </p>
            <p style={styles.subText}>
              TreatMe supports UN Sustainable Development Goal 3: Good Health and Well-Being by making healthcare more accessible, reducing pressure on NHS services, and connecting patients with verified doctors digitally.
            </p>
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div style={styles.featuresSection}>
        <div style={styles.featuresInner}>
          <div style={styles.featuresText}>
            <span style={styles.sectionLabel}>What we offer</span>
            <p style={styles.sectionTitle}>Features</p>
            <ul style={styles.featuresList}>
              {features.map((f) => (
                <li key={f.label} style={styles.featureItem}>
                  <span style={styles.featureIcon}>{f.icon}</span>
                  <span>
                    <strong style={{ color: "#1e293b" }}>{f.label} — </strong>
                    {f.desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <img src={myImage1} alt="Features" style={styles.featuresImage} />
        </div>
      </div>

      {/* ── POST REQUEST── */}
      <div style={styles.ctaSection}>
        <div style={styles.ctaText}>
          <span style={styles.sectionLabel}>Get started</span>
          <p style={styles.sectionTitle}>Post a Request</p>
          <p style={styles.ctaDesc}>
            Make an anonymous request and start chatting with verified doctors today.
          </p>
          <Link to="/post-request" style={styles.ctaButton}>
            Post a request now →
          </Link>
        </div>

      </div>

    </div>
  );
}

export default Home;