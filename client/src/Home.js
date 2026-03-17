import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import myImage1 from './Homepage1.png';
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "40px" }}>

        <div style={{ flex: 1}}>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#1b4cb6" }}>Features</p>
          <ul>
            <li><strong>Secure chat with file sharing – </strong>Send messages, images, and audio files safely within private doctor consultations</li>
            <li><strong>Moderation & verified doctors –</strong> All doctor profiles are vetted, and content is monitored to ensure quality and safety</li>
            <li><strong>Doctor reviews & ratings –</strong> Users can leave feedback to help others choose the right doctor</li>
            <li><strong>Anonymous messaging & posting –</strong> Ask questions and chat with doctors while protecting your identity</li>
            <li><strong>Appointment booking –</strong> Seamlessly book in-person appointments after consulting with a doctor</li>
          </ul>
        </div>

        <div style={{ flex: 1, display: "flex", justifyContent: "right" }}>
          <img src={myImage1} alt="Features" style={{ width: "350px", height: "350px" }} />
        </div>
        </div>
      </div>


    </div>
  );
}

export default Home;