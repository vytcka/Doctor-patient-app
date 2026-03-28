import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './LogoIcon.png';
import TickGif from './check-green.gif';

//only logged in users can post a request
function PostRequest() {
  const [showGif, setShowGif] = useState(false);
  const [doctors, setDoctor] = useState("");
  const [message, setMessage] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");


  const handleSubmit = () => {
    setShowGif(true);
    setTimeout(() => setShowGif(false), 2000); // hides after 2 seconds

  };

  return (
    <div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "9px" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                <img src={Icon} alt="Description" style={{ width: "100px", height: "100px", marginRight: "10px" }} />
                <div style={{ fontSize: "2rem", color: "#1b4cb6", fontWeight: "bold", marginRight: "80px" }}>TreatMe</div>{/* App title */}
              </div>
              {/* Buttons for: Home, PostaRequest, Reviews, Login and their colours + placements */}
              <div style={{ display: "flex", gap: "10px" }}>
                <Link to="/" style={{ textDecoration: "none" }}>
                  <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Home</button>
                </Link>
                <Link to="/post-request" style={{ textDecoration: "none" }}>
                  <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Post a Request</button>
                </Link>
                <Link to="/reviews" style={{ textDecoration: "none" }}>
                  <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Reviews</button>
                </Link>
                <Link to="/login" style={{ textDecoration: "none" }}>
                  <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Login</button>
                </Link>
                <Link to="/signup" style={{ textDecoration: "none" }}>
                  <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Signup</button>
                </Link>
              </div>
        </div>
        <p style={{ fontSize: "1.7rem", fontWeight: "bold", color: "#040f25", textAlign:"center", textDecorationLine: 'underline' }}>Create an anonymous request</p>
        <p style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#1b4cb6", textAlign:"left" }}>Symptoms:</p>
       <textarea cols= "60" autocorrect="on"
          placeholder="Write what you're feeling..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        /> 
      <p style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#1b4cb6", textAlign:"left" }}>Background Information:</p>
       <textarea cols= "60" autocorrect="on"
          placeholder="Any medical history or context?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        /> 
    <p style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#1b4cb6", textAlign:"left" }}>Gender:</p>
  <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
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
</div>

<div>
      <input
        type="text"
        placeholder="Age"
        value={age}
        onChange={(e) => setAge(e.target.value)}  style={{ width: "30px" }}
      />
</div>
<select value={doctors} onChange={(e) => setDoctor(e.target.value)}>
  <option value="">Select your preferred doctor (optional)</option>
  <option value="doctorA">DoctorA</option>
  <option value="doctorB">DoctorB</option>
  <option value="doctorC">DoctorC</option> {/* ect add the doctors from database */}
</select>

<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
  <button onClick={handleSubmit}>Submit</button>

  {showGif && (
    <img
      src={TickGif}
      alt="confirmation"
      style={{ width: "60px", height: "60px" }}
    />
    
  )}
</div>
</div>
  );
}

export default PostRequest;