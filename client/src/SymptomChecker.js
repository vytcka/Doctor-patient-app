import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from './LogoIcon.png';

const BODY_REGIONS = {
  head: { label: "Head", symptoms: ["Headache", "Dizziness", "Blurred vision", "Ear pain", "Sore throat", "Runny nose"] },
  chest: { label: "Chest", symptoms: ["Chest pain", "Shortness of breath", "Cough", "Heart palpitations", "Wheezing"] },
  stomach: { label: "Abdomen", symptoms: ["Stomach pain", "Nausea", "Vomiting", "Bloating", "Diarrhea", "Constipation"] },
  leftArm: { label: "Left Arm", symptoms: ["Pain", "Swelling", "Numbness", "Weakness", "Rash"] },
  rightArm: { label: "Right Arm", symptoms: ["Pain", "Swelling", "Numbness", "Weakness", "Rash"] },
  leftLeg: { label: "Left Leg", symptoms: ["Pain", "Swelling", "Numbness", "Cramps", "Rash"] },
  rightLeg: { label: "Right Leg", symptoms: ["Pain", "Swelling", "Numbness", "Cramps", "Rash"] },
  back: { label: "Back", symptoms: ["Lower back pain", "Upper back pain", "Stiffness", "Muscle spasm"] },
};

export default function SymptomChecker({ isLoggedIn, userData }) {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleRegionClick = (region) => {
    setSelectedRegion(region);
    setSelectedSymptoms([]);
    setDetails('');
  };

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

   if (!isLoggedIn) {
    return (
      <div style={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", backgroundColor: "white", borderBottom: "1px solid #e2e8f0" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img src={Icon} alt="Logo" style={{ width: "100px", height: "100px", marginRight: "10px" }} />
            <div style={{ fontSize: "2rem", color: "#1b4cb6", fontWeight: "bold" }}>TreatMe</div>
          </Link>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: "16px" }}>
          <p style={{ fontSize: "1.2rem", color: "#607593" }}>You need to be logged in to use the symptom checker.</p>
          <Link to="/login-choice">
            <button style={{ backgroundColor: "#3b82f6", color: "white", padding: "12px 28px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold" }}>Log In</button>
          </Link>
        </div>
      </div>
    );
  }

 const handleSubmit = async () => {
    if (selectedSymptoms.length === 0) {
      setError("Please select at least one symptom.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/requestAppointment", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-Username": userData?.username || "" 
        },
        body: JSON.stringify({
          age: null,
          symptoms: selectedRegion,
          symptoms_details: `${selectedSymptoms.join(", ")}. ${details}`,
          family_issues: false,
          family_details: "",
          existing_issues: false,
          existing_details: ""
        })
      });
      const data = await response.json();
      if (data.status === 200) {
        setSubmitted(true);
      } else {
        setError(data.message || "Failed to submit.");
      }
    } catch {
      setError("Could not reach server.");
    }
};
  return (
    <div style={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      {/* Navbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", backgroundColor: "white", borderBottom: "1px solid #e2e8f0" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src={Icon} alt="Logo" style={{ width: "100px", height: "100px", marginRight: "10px" }} />
          <div style={{ fontSize: "2rem", color: "#1b4cb6", fontWeight: "bold" }}>TreatMe</div>
        </Link>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link to="/dashboard"><button style={{ backgroundColor: "#3b82f6", color: "white" }}>Dashboard</button></Link>
          <Link to="/search"><button style={{ backgroundColor: "#3b82f6", color: "white" }}>Find a Doctor</button></Link>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "40px auto", padding: "0 20px" }}>
        <h1 style={{ textAlign: "center", color: "#040f25" }}>🩺 Easy Request</h1>
        <p style={{ textAlign: "center", color: "#607593", marginBottom: "40px" }}>Click on a body region to select your symptoms</p>

        {submitted ? (
          <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "40px", textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: "4rem", marginBottom: "16px" }}>✅</div>
            <h2 style={{ color: "#15803d" }}>Request Submitted!</h2>
            <p style={{ color: "#607593" }}>A doctor will review your symptoms and get back to you.</p>
            <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "24px" }}>
              <Link to="/search"><button style={{ backgroundColor: "#3b82f6", color: "white", padding: "10px 24px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold" }}>Find a Doctor</button></Link>
              <Link to="/dashboard"><button style={{ backgroundColor: "#f0f4ff", color: "#1b4cb6", padding: "10px 24px", borderRadius: "8px", border: "1px solid #ccd9ee", cursor: "pointer", fontWeight: "bold" }}>Dashboard</button></Link>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", gap: "40px", alignItems: "flex-start" }}>

            {/* Body SVG */}
            <div style={{ flex: "0 0 300px" }}>
              <svg viewBox="0 0 200 450" width="300" height="450" style={{ display: "block", margin: "0 auto" }}>

                {/* Head */}
                <ellipse cx="100" cy="40" rx="30" ry="35"
                  fill={selectedRegion === "head" ? "#3b82f6" : "#cbd5e1"}
                  style={{ cursor: "pointer", transition: "fill 0.2s" }}
                  onClick={() => handleRegionClick("head")}
                />
                <text x="100" y="44" textAnchor="middle" fontSize="9" fill="white" style={{ pointerEvents: "none" }}>Head</text>

                {/* Neck */}
                <rect x="88" y="73" width="24" height="18" fill="#e2e8f0" style={{ pointerEvents: "none" }} />

                {/* Chest */}
                <rect x="60" y="90" width="80" height="80" rx="8"
                  fill={selectedRegion === "chest" ? "#3b82f6" : "#cbd5e1"}
                  style={{ cursor: "pointer", transition: "fill 0.2s" }}
                  onClick={() => handleRegionClick("chest")}
                />
                <text x="100" y="135" textAnchor="middle" fontSize="9" fill="white" style={{ pointerEvents: "none" }}>Chest</text>

                {/* Stomach */}
                <rect x="65" y="175" width="70" height="65" rx="8"
                  fill={selectedRegion === "stomach" ? "#3b82f6" : "#cbd5e1"}
                  style={{ cursor: "pointer", transition: "fill 0.2s" }}
                  onClick={() => handleRegionClick("stomach")}
                />
                <text x="100" y="212" textAnchor="middle" fontSize="9" fill="white" style={{ pointerEvents: "none" }}>Abdomen</text>

                {/* Left Arm */}
                <rect x="20" y="90" width="35" height="110" rx="10"
                  fill={selectedRegion === "leftArm" ? "#3b82f6" : "#cbd5e1"}
                  style={{ cursor: "pointer", transition: "fill 0.2s" }}
                  onClick={() => handleRegionClick("leftArm")}
                />
                <text x="37" y="150" textAnchor="middle" fontSize="8" fill="white" style={{ pointerEvents: "none" }}>L.Arm</text>

                {/* Right Arm */}
                <rect x="145" y="90" width="35" height="110" rx="10"
                  fill={selectedRegion === "rightArm" ? "#3b82f6" : "#cbd5e1"}
                  style={{ cursor: "pointer", transition: "fill 0.2s" }}
                  onClick={() => handleRegionClick("rightArm")}
                />
                <text x="162" y="150" textAnchor="middle" fontSize="8" fill="white" style={{ pointerEvents: "none" }}>R.Arm</text>

                {/* Left Leg */}
                <rect x="65" y="248" width="32" height="140" rx="10"
                  fill={selectedRegion === "leftLeg" ? "#3b82f6" : "#cbd5e1"}
                  style={{ cursor: "pointer", transition: "fill 0.2s" }}
                  onClick={() => handleRegionClick("leftLeg")}
                />
                <text x="81" y="322" textAnchor="middle" fontSize="8" fill="white" style={{ pointerEvents: "none" }}>L.Leg</text>

                {/* Right Leg */}
                <rect x="103" y="248" width="32" height="140" rx="10"
                  fill={selectedRegion === "rightLeg" ? "#3b82f6" : "#cbd5e1"}
                  style={{ cursor: "pointer", transition: "fill 0.2s" }}
                  onClick={() => handleRegionClick("rightLeg")}
                />
                <text x="119" y="322" textAnchor="middle" fontSize="8" fill="white" style={{ pointerEvents: "none" }}>R.Leg</text>

                {/* Back button */}
                <rect x="60" y="395" width="80" height="30" rx="6"
                  fill={selectedRegion === "back" ? "#3b82f6" : "#94a3b8"}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRegionClick("back")}
                />
                <text x="100" y="415" textAnchor="middle" fontSize="9" fill="white" style={{ pointerEvents: "none" }}>Back/Spine</text>

              </svg>
              <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "0.8rem", marginTop: "8px" }}>Click a region to select</p>
            </div>

            {/* Symptom panel */}
            <div style={{ flex: 1 }}>
              {!selectedRegion ? (
                <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "32px", textAlign: "center", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                  <p style={{ color: "#607593" }}>Click a body region on the left to get started</p>
                </div>
              ) : (
                <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "32px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
                  <h2 style={{ color: "#040f25", marginTop: 0 }}>{BODY_REGIONS[selectedRegion].label} Symptoms</h2>
                  <p style={{ color: "#607593", marginBottom: "16px" }}>Select all that apply:</p>

                  <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "24px" }}>
                    {BODY_REGIONS[selectedRegion].symptoms.map(symptom => (
                      <button key={symptom} onClick={() => toggleSymptom(symptom)}
                        style={{
                          padding: "8px 16px", borderRadius: "99px", border: "2px solid",
                          borderColor: selectedSymptoms.includes(symptom) ? "#3b82f6" : "#e2e8f0",
                          backgroundColor: selectedSymptoms.includes(symptom) ? "#dbeafe" : "white",
                          color: selectedSymptoms.includes(symptom) ? "#1b4cb6" : "#607593",
                          cursor: "pointer", fontWeight: "bold", fontSize: "0.9rem",
                          transition: "all 0.2s"
                        }}>
                        {symptom}
                      </button>
                    ))}
                  </div>

                  <textarea
                    placeholder="Any additional details? (optional)"
                    value={details}
                    onChange={e => setDetails(e.target.value)}
                    style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "0.95rem", color: "#040f25", minHeight: "80px", boxSizing: "border-box", marginBottom: "16px" }}
                  />

                  {error && <p style={{ color: "red", marginBottom: "12px" }}>{error}</p>}

                  {selectedSymptoms.length > 0 && (
                    <div style={{ backgroundColor: "#f0f4ff", borderRadius: "8px", padding: "12px", marginBottom: "16px" }}>
                      <p style={{ margin: 0, color: "#1b4cb6", fontSize: "0.9rem" }}>
                        <b>Selected:</b> {selectedSymptoms.join(", ")}
                      </p>
                    </div>
                  )}

                  <button onClick={handleSubmit}
                    style={{ width: "100%", backgroundColor: "#3b82f6", color: "white", padding: "12px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "1rem" }}>
                    {isLoggedIn ? "Submit to Doctor 🩺" : "Login to Submit"}
                  </button>

                  {!isLoggedIn && (
                    <p style={{ textAlign: "center", color: "#94a3b8", fontSize: "0.85rem", marginTop: "8px" }}>
                      You need to be logged in to submit a request
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}