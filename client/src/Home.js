import { useEffect, useState } from 'react';
import myImage from './Homepage1.png';
import myImage2 from './Homepage2.png';
import Icon from './LogoIcon.png';

function Home() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={Icon} alt="Description" style={{ width: "100px", height: "100px", marginRight: "10px" }} />
          <div style={{ fontSize: "2rem", color: "#1b4cb6", fontWeight: "bold" }}>TreatMe</div>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Home</button>
          <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Post a Request</button>
          <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Reviews</button>
          <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Login</button>
        </div>
      </div>

      <div style={{ maxWidth: "800px", margin: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "80px" }}>
          <img src={myImage2} alt="description" style={{ width: "250px", height: "250px" }} />
          <div>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#1b4cb6" }}>About Us</p>
            <p style={{ fontSize: "1rem", textAlign: "center" }}>TreatMe helps you connect with doctors for reliable health advice. Ask questions, chat securely, and get the support you need—when you need it. Real doctors. Real answers.</p>
          </div>
        </div>
      </div>
      <div style={{backgroundColor: "#dbeafe", padding: "40px"}}>
        <h2>Features</h2>
        <p>Some content here</p>
      </div>
    </div>
  );
}

export default Home;