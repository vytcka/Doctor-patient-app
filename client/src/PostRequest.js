import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './LogoIcon.png';
import TickGif from './check-green.gif';

//only logged in users can post a request
function PostRequest() {
  const [showGif, setShowGif] = useState(false);
  const [doctors, setDoctor] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [backgroundInfo, setBackgroundInfo] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");

  const handleSubmit = () => {
    if (!symptoms || !backgroundInfo || !age) {
      alert("Please fill in symptoms, background info, and age before submitting.");
      return;
    }
    setShowGif(true);
    setTimeout(() => setShowGif(false), 2000); // hides after 2 seconds
    // Clear form after submission
    setSymptoms("");
    setBackgroundInfo("");
    setGender("");
    setAge("");
    setDoctor("");
  };

  return (
    <div>
      {/* Navbar with clickable logo - YOUR VERSION */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", marginBottom: "20px" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src={Icon} alt="Logo" style={{ width: "100px", height: "100px", marginRight: "10px" }} />
          <div style={{ fontSize: "2rem", color: "#1b4cb6", fontWeight: "bold" }}>TreatMe</div>
        </Link>
        {/* Buttons - Home button REMOVED */}
        <div style={{ display: "flex", gap: "10px" }}>
          <Link to="/reviews" style={{ textDecoration: "none" }}>
            <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Reviews</button>
          </Link>
          <Link to="/login" style={{ textDecoration: "none" }}>
            <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Login</button>
          </Link>
          <Link to="/signup" style={{ textDecoration: "none" }}>
            <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Signup</button>
          </Link>
          <Link to="/chat" style={{ textDecoration: "none" }}>
            <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Chats</button>
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
        <p style={{ fontSize: "1.7rem", fontWeight: "bold", color: "#040f25", textAlign: "center", textDecorationLine: 'underline' }}>
          Create an anonymous request
        </p>
        
        <p style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#1b4cb6", textAlign: "left", marginTop: "20px" }}>Symptoms:</p>
        <textarea 
          cols="60" 
          rows="3"
          autoCorrect="on"
          placeholder="Write what you're feeling..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", marginBottom: "10px" }}
        /> 
        
        <p style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#1b4cb6", textAlign: "left" }}>Background Information:</p>
        <textarea 
          cols="60" 
          rows="3"
          autoCorrect="on"
          placeholder="Any medical history or context?"
          value={backgroundInfo}
          onChange={(e) => setBackgroundInfo(e.target.value)}
          style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc", marginBottom: "10px" }}
        /> 
        
        <p style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#1b4cb6", textAlign: "left" }}>Gender:</p>
        <div style={{ display: "flex", gap: "20px", alignItems: "center", marginBottom: "15px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <input
              type="radio"
              value="male"
              checked={gender === "male"}
              onChange={(e) => setGender(e.target.value)}
            />
            Male
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <input
              type="radio"
              value="female"
              checked={gender === "female"}
              onChange={(e) => setGender(e.target.value)}
            />
            Female
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <input
              type="radio"
              value="prefer-not-to-say"
              checked={gender === "prefer-not-to-say"}
              onChange={(e) => setGender(e.target.value)}
            />
            Prefer not to say
          </label>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <input
            type="number"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            style={{ width: "80px", padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}
            min="0"
            max="120"
          />
        </div>

        <div style={{ marginBottom: "20px" }}>
          <select 
            value={doctors} 
            onChange={(e) => setDoctor(e.target.value)}
            style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
          >
            <option value="">Select your preferred doctor (optional)</option>
            <option value="doctorA">Doctor A</option>
            <option value="doctorB">Doctor B</option>
            <option value="doctorC">Doctor C</option>
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "15px", marginTop: "20px" }}>
          <button 
            onClick={handleSubmit}
            style={{ backgroundColor: "#3b82f6", color: "white", padding: "10px 24px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold" }}
          >
            Submit Request
          </button>
          {showGif && (
            <img
              src={TickGif}
              alt="Confirmation checkmark"
              style={{ width: "50px", height: "50px" }}
            />
          )}
        </div>

        <p style={{ fontSize: "0.85rem", color: "#607593", textAlign: "center", marginTop: "20px", fontStyle: "italic" }}>
          Your request is anonymous. No personal information will be shared with doctors.
        </p>
      </div>
    </div>
  );
}

export default PostRequest;