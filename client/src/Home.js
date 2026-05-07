import { Link } from 'react-router-dom';
import myImage1 from './Homepage1.png';
import myImage2 from './Homepage2.png';
import Icon from './LogoIcon.png';

function Home({ isLoggedIn }) {
  return (
    <div>
      {/* Navigation header with conditional login/logout buttons */}
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
              <Link to="/dashboard" style={{ textDecoration: "none" }}>
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

      {/* About Us Section */}
      <div style={{ maxWidth: "800px", margin: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "80px" }}>
              <img src={myImage2} alt="description" style={{ width: "250px", height: "250px" }} />
              <div>
                  <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#1b4cb6" }}>About Us</p>
                  <p style={{ fontSize: "1rem", textAlign: "center" }}>TreatMe helps you connect with doctors for reliable health advice. Ask questions, chat securely, and get the support you need, when you need it. Real doctors. Real answers.</p>
                  <p style={{ fontSize: "0.9rem", textAlign: "center", color: "#435e99", marginTop: "12px" }}>
                      TreatMe supports UN Sustainable Development Goal 3: Good Health and Well-Being by making healthcare more accessible, reducing pressure on NHS services, and connecting patients with verified doctors digitally.
                  </p>
              </div>
          </div>
      </div>

      {/* Features Section */}
      <div style={{ backgroundColor: "#dbeafe", padding: "40px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "40px" }}>
          <div style={{ flex: 1 }}>
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

      {/* Post Request Section */}
      <div style={{ backgroundColor: "#ffffff", padding: "40px", textAlign: "center" }}>
        <p style={{ fontSize: "2rem", fontWeight: "bold", color: "#1b4cb6" }}>Post a request</p>
        <p style={{ color: "#435e99" }}>Make an anonymous request to start chatting with doctors</p>
        <Link to="/post-request" style={{ textDecoration: "none" }}>
          <button style={{ backgroundColor: "#709de6", color: "#41537a", fontSize: "2rem", padding: "15px 40px" }}>Post a request now!</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;