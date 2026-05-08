import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './LogoIcon.png';
import TickGif from './check-green.gif';

function PostRequest({ isLoggedIn, userData }) {
  const [showGif, setShowGif] = useState(false);
  const [symptoms, setSymptoms] = useState("");
  const [symptomsDetails, setSymptomsDetails] = useState("");
  const [familyIssues, setFamilyIssues] = useState("");
  const [familyDetails, setFamilyDetails] = useState("");
  const [age, setAge] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

const handleSubmit = async () => {
    if (!symptoms || !symptomsDetails || !age) {
      setErrorMessage("Please fill in all required fields.");
      return;
    }
    setErrorMessage("");

    try {
      const response = await fetch("http://127.0.0.1:5000/new-request", {
        method: "POST",
        credentials: "include",
        headers: { 
            "Content-Type": "application/json",
            "X-Username": userData?.username || ""
        },
        body: JSON.stringify({
          age: Number(age),
          symptoms: symptoms,
          symptoms_details: symptomsDetails,
          family_issues: familyIssues === "yes",
          family_details: familyDetails
        })
      });

      const data = await response.json(); 

      if (data.status === 200) {
        setShowGif(true);
        setTimeout(() => setShowGif(false), 2000);
        setSymptoms("");
        setSymptomsDetails("");
        setFamilyIssues("");
        setFamilyDetails("");
        setAge("");
      } else {
        setErrorMessage(data.message || "Submission failed.");
      }
    } catch (error) {
      setErrorMessage("Could not reach server.");
    }
};

  const labelStyle = {
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "#374151",
    display: "block",
    marginBottom: "6px"
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "0.95rem",
    color: "#374151",
    boxSizing: "border-box",
    outline: "none",
    marginBottom: "20px"
  };

  const textareaStyle = {
    ...inputStyle,
    resize: "vertical",
    minHeight: "90px",
    fontFamily: "inherit"
  };

  return (
    <div style={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      {/* Navbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 40px", height: "68px", backgroundColor: "white", borderBottom: "1px solid #e8edf5", boxShadow: "0 1px 8px rgba(27,75,182,0.06)", position: "sticky", top: 0, zIndex: 100, marginBottom: "30px" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", gap: "10px" }}>
          <img src={Icon} alt="Logo" style={{ width: "44px", height: "44px" }} />
          <span style={{ fontSize: "1.4rem", color: "#1b4cb6", fontWeight: "800", letterSpacing: "-0.3px" }}>TreatMe</span>
        </Link>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Link to="/search" style={{ textDecoration: "none" }}>
            <button style={{ background: "none", border: "none", color: "#334155", fontWeight: "500", fontSize: "0.9rem", padding: "8px 14px", cursor: "pointer" }}>Find a Doctor</button>
          </Link>
          {isLoggedIn ? (
            <>
              <Link to="/chat" style={{ textDecoration: "none" }}>
                <button style={{ background: "none", border: "none", color: "#334155", fontWeight: "500", fontSize: "0.9rem", padding: "8px 14px", cursor: "pointer" }}>Chats</button>
              </Link>
              <Link to="/Dashboard" style={{ textDecoration: "none" }}>
                <button style={{ backgroundColor: "#1b4cb6", color: "white", border: "none", borderRadius: "50px", padding: "10px 22px", fontSize: "0.88rem", fontWeight: "700", cursor: "pointer" }}>My Profile</button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login-choice" style={{ textDecoration: "none" }}>
                <button style={{ border: "1.5px solid #c7d9f5", background: "white", color: "#1b4cb6", borderRadius: "50px", padding: "9px 20px", fontSize: "0.88rem", fontWeight: "600", cursor: "pointer" }}>Log In</button>
              </Link>
              <Link to="/signup-choice" style={{ textDecoration: "none" }}>
                <button style={{ backgroundColor: "#1b4cb6", color: "white", border: "none", borderRadius: "50px", padding: "10px 22px", fontSize: "0.88rem", fontWeight: "700", cursor: "pointer" }}>Sign Up</button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Form */}
      <div style={{ maxWidth: "620px", margin: "0 auto", padding: "0 20px 40px" }}>
        <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "40px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>

          <h1 style={{ fontSize: "1.6rem", fontWeight: "bold", color: "#1b4cb6", textAlign: "center", marginBottom: "6px" }}>
            Medical Request Form
          </h1>
          <p style={{ fontSize: "0.85rem", color: "#94a3b8", textAlign: "center", marginBottom: "32px", fontStyle: "italic" }}>
            Your request is completely anonymous. No personal information will be shared.
          </p>

          <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", marginBottom: "28px" }} />

          {/* Age */}
          <label style={labelStyle}>Age: <span style={{ color: "#ef4444" }}>*</span></label>
          <input
            type="number"
            placeholder="Enter your age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            min="0"
            max="120"
            style={{ ...inputStyle, width: "120px" }}
          />

          {/* Symptoms */}
          <label style={labelStyle}>Current Symptoms: <span style={{ color: "#ef4444" }}>*</span></label>
          <textarea
            placeholder="Describe what you are currently experiencing..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            style={textareaStyle}
          />

          {/* Symptoms Details */}
          <label style={labelStyle}>More Details About Your Symptoms: <span style={{ color: "#ef4444" }}>*</span></label>
          <textarea
            placeholder="Please provide further detail about your symptoms, when they started, severity etc..."
            value={symptomsDetails}
            onChange={(e) => setSymptomsDetails(e.target.value)}
            style={textareaStyle}
          />

          {/* Family Issues */}
          <label style={labelStyle}>Do you have any family history of medical conditions?</label>
          <div style={{ display: "flex", gap: "30px", marginBottom: "20px" }}>
            {["yes", "no"].map((option) => (
              <label
                key={option}
                onClick={() => setFamilyIssues(option)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                  color: "#374151"
                }}
              >
                {/* Custom radio circle */}
                <div style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  border: `2px solid ${familyIssues === option ? "#1b4cb6" : "#cbd5e1"}`,
                  backgroundColor: familyIssues === option ? "#1b4cb6" : "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.15s ease",
                  flexShrink: 0
                }}>
                  {familyIssues === option && (
                    <span style={{ color: "white", fontSize: "12px", fontWeight: "bold", lineHeight: 1 }}>✓</span>
                  )}
                </div>
                {option.charAt(0).toUpperCase() + option.slice(1)}
              </label>
            ))}
          </div>

          {/* Family Details - only show if yes */}
          {familyIssues === "yes" && (
            <>
              <label style={labelStyle}>Please provide details about your family's medical history:</label>
              <textarea
                placeholder="Describe any relevant family medical history..."
                value={familyDetails}
                onChange={(e) => setFamilyDetails(e.target.value)}
                style={textareaStyle}
              />
            </>
          )}

          {errorMessage && (
            <p style={{ color: "#ef4444", fontSize: "0.9rem", marginBottom: "16px" }}>{errorMessage}</p>
          )}

          <hr style={{ border: "none", borderTop: "1px solid #f1f5f9", marginBottom: "24px" }} />

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={handleSubmit}
              style={{ backgroundColor: "#1b4cb6", color: "white", padding: "12px 32px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "1rem" }}
            >
              Submit Request
            </button>
            {showGif && (
              <img src={TickGif} alt="Submitted" style={{ width: "50px", height: "50px" }} />
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default PostRequest;