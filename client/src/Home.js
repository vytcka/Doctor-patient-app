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
    <div style={{ fontFamily: "'Segoe UI', -apple-system, sans-serif", margin: 0, padding: 0 }}>

      {/* Navbar */}
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
          <Link to="/search" style={{ textDecoration: "none" }}>
            <button style={{ background: "none", border: "none", color: "#334155", fontWeight: "500", fontSize: "0.9rem", padding: "8px 14px", cursor: "pointer", borderRadius: "6px" }}>
              Find a Doctor
            </button>
          </Link>
          {isLoggedIn ? (
            <>
              <Link to="/chat" style={{ textDecoration: "none" }}>
                <button style={{ background: "none", border: "none", color: "#334155", fontWeight: "500", fontSize: "0.9rem", padding: "8px 14px", cursor: "pointer" }}>
                  Chats
                </button>
              </Link>
              <Link to={userRole === 'doctor' ? '/doctor-dashboard' : '/Dashboard'} style={{ textDecoration: "none" }}>
                <button style={{ backgroundColor: "#1b4cb6", color: "white", border: "none", borderRadius: "50px", padding: "10px 22px", fontSize: "0.88rem", fontWeight: "700", cursor: "pointer", boxShadow: "0 2px 8px rgba(27,75,182,0.3)" }}>
                  My Profile
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login-choice" style={{ textDecoration: "none" }}>
                <button style={{ background: "none", border: "1.5px solid #c7d9f5", color: "#1b4cb6", borderRadius: "50px", padding: "9px 20px", fontSize: "0.88rem", fontWeight: "600", cursor: "pointer" }}>
                  Log In
                </button>
              </Link>
              <Link to="/signup-choice" style={{ textDecoration: "none" }}>
                <button style={{ backgroundColor: "#1b4cb6", color: "white", border: "none", borderRadius: "50px", padding: "10px 22px", fontSize: "0.88rem", fontWeight: "700", cursor: "pointer", boxShadow: "0 2px 8px rgba(27,75,182,0.3)" }}>
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <div style={{
        background: "linear-gradient(135deg, #eef4ff 0%, #e8f0fe 50%, #f0f6ff 100%)",
        padding: "80px 40px",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "60px",
        minHeight: "480px"
      }}>
        <div style={{ maxWidth: "520px" }}>
          <p style={{ fontSize: "0.8rem", fontWeight: "700", color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "12px", margin: "0 0 12px 0", textAlign: "left", opacity: 1 }}>
            NHS-Verified Doctors
          </p>
          <h1 style={{ fontSize: "2.8rem", fontWeight: "800", color: "#0f1f4b", lineHeight: "1.15", marginBottom: "20px", margin: "0 0 20px 0", textAlign: "left" }}>
            Get medical advice<br />
            <span style={{ color: "#3b82f6" }}>from real doctors,</span><br />
            instantly.
          </h1>
          <p style={{ fontSize: "1.05rem", color: "#475569", lineHeight: "1.7", marginBottom: "32px", margin: "0 0 32px 0", textAlign: "left", opacity: 1 }}>
            TreatMe connects you with verified NHS doctors for secure consultations.
          </p>

          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <Link to="/signup-choice" style={{ textDecoration: "none" }}>
              <button style={{ backgroundColor: "#3b82f6", color: "white", border: "none", borderRadius: "10px", padding: "12px 24px", fontSize: "0.9rem", fontWeight: "700", cursor: "pointer", boxShadow: "0 2px 8px rgba(59,130,246,0.3)" }}>
                Sign Up
              </button>
            </Link>
          </div>
        </div>

        <img src={myImage2} alt="TreatMe" style={{ width: "340px", height: "340px", flexShrink: 0, filter: "drop-shadow(0 8px 24px rgba(27,75,182,0.15))" }} />
      </div>

      {/* Stats bar */}
      <div style={{ backgroundColor: "#1b4cb6", padding: "28px 40px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", justifyContent: "space-around", alignItems: "center" }}>
          {[
            { num: "100%", label: "NHS Verified Doctors" },
            { num: "Free", label: "No subscription needed" },
            { num: "24/7", label: "Available anytime" },
            { num: "Secure", label: "Anonymous & encrypted" },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <p style={{ fontSize: "1.6rem", fontWeight: "800", color: "white", margin: "0 0 4px 0", opacity: 1, textAlign: "center" }}>{stat.num}</p>
              <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.75)", margin: 0, opacity: 1, textAlign: "center" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* About Us */}
      <div style={{ backgroundColor: "white", padding: "60px 40px", borderBottom: "1px solid #e2eaf8" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto", display: "flex", alignItems: "center", gap: "60px" }}>
          <img src={myImage2} alt="About TreatMe" style={{ width: "220px", height: "220px", flexShrink: 0 }} />
          <div>
            <p style={{ fontSize: "0.8rem", fontWeight: "700", color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "12px", opacity: 1, textAlign: "left" }}>About Us</p>
            <p style={{ fontSize: "1rem", color: "#475569", lineHeight: "1.7", marginBottom: "12px", textAlign: "left", opacity: 1 }}>
              TreatMe helps you connect with doctors for reliable health advice. Ask questions, chat securely, and get the support you need, when you need it. Real doctors. Real answers.
            </p>
            <p style={{ fontSize: "0.9rem", color: "#64748b", lineHeight: "1.7", textAlign: "left", opacity: 1 }}>
              TreatMe supports <strong>UN Sustainable Development Goal 3: Good Health and Well-Being</strong> by making healthcare more accessible, reducing pressure on NHS services, and connecting patients with verified doctors digitally.
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ backgroundColor: "white", padding: "80px 40px" }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <p style={{ textAlign: "center", fontSize: "0.8rem", fontWeight: "700", color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "12px", opacity: 1 }}>Why TreatMe</p>
          <h2 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "800", color: "#0f1f4b", marginBottom: "48px", opacity: 1 }}>Everything you need, in one place</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px" }}>
            {[
              { icon: "01", title: "Secure messaging", desc: "Chat privately with your doctor. Send images and voice messages." },
              { icon: "02", title: "Verified NHS doctors", desc: "Every doctor on TreatMe is NHS-trained and vetted by moderators." },
              { icon: "03", title: "Full anonymity", desc: "No real name required. Stay anonymous throughout your consultation." },
              { icon: "04", title: "Reviews & ratings", desc: "Read patient reviews to find the right doctor for your needs." },
              { icon: "05", title: "Book appointments", desc: "Move from chat to in-person appointment seamlessly." },
              { icon: "06", title: "Always free", desc: "No fees, no subscriptions. Healthcare should be accessible to all." },
            ].map((f, i) => (
              <div key={i} style={{ backgroundColor: "#f8faff", borderRadius: "14px", padding: "24px", border: "1.5px solid #e2eaf8" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: "800", color: "#3b82f6", letterSpacing: "0.08em", display: "block", marginBottom: "12px" }}>{f.icon}</span>
                <p style={{ fontWeight: "700", color: "#0f1f4b", fontSize: "0.95rem", margin: "0 0 8px 0", textAlign: "left", opacity: 1 }}>{f.title}</p>
                <p style={{ color: "#64748b", fontSize: "0.85rem", lineHeight: "1.6", margin: 0, textAlign: "left", opacity: 1 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Banner */}
      <div style={{ background: "linear-gradient(135deg, #1b4cb6 0%, #2563eb 100%)", padding: "72px 40px", textAlign: "center" }}>
        <h2 style={{ fontSize: "2.2rem", fontWeight: "800", color: "white", marginBottom: "12px", opacity: 1, textAlign: "center" }}>
          Ready to speak to a doctor?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: "1rem", marginBottom: "32px", opacity: 1, textAlign: "center" }}>
          Post an anonymous request and get matched with an NHS doctor in minutes.
        </p>
      </div>

    </div>
  );
}

export default Home;