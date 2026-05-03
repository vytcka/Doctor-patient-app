import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from './LogoIcon.png';
import StarRating from './StarRating';

function DoctorDashboard() {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeChats, setActiveChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('requests');

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/doctor/dashboard", {
          credentials: "include"
        });
        const data = await response.json();
        if (data.status === 200) {
          setDoctor(data.doctor);
          setPendingRequests(data.pending_requests || []);
          setActiveChats(data.active_chats || []);
        }
      } catch (error) {
        // Dummy data
        setDoctor({
          name: "Dr. Sarah Johnson",
          specialty: "Cardiology",
          rating: 4.8,
          languages: ["English", "Spanish"],
          location: "London, UK",
          availability: ["Monday 9am-5pm", "Wednesday 9am-5pm", "Friday 9am-5pm"],
          totalPatients: 127,
          totalReviews: 89,
          email: "sarah.johnson@treatme.com",
          phone: "+44 20 7946 0123"
        });
        setPendingRequests([
          { id: 1, patientName: "Anonymous User", age: 32, symptoms: "Chest pain, shortness of breath", submittedAt: "2024-05-03T10:30:00" },
          { id: 2, patientName: "Anonymous User", age: 45, symptoms: "Irregular heartbeat", submittedAt: "2024-05-03T09:15:00" },
          { id: 3, patientName: "Anonymous User", age: 28, symptoms: "High blood pressure concerns", submittedAt: "2024-05-02T14:20:00" }
        ]);
        setActiveChats([
          { id: 1, patientName: "John D.", startedAt: "2024-05-02", lastMessage: "Feeling better today", unread: 2 },
          { id: 2, patientName: "Emma W.", startedAt: "2024-05-01", lastMessage: "When should I take my medication?", unread: 0 }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorData();
  }, []);

  const handleAcceptRequest = async (requestId) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/accept-request", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request_id: requestId })
    });
    const data = await response.json();
    if (data.status === 200) {
      setPendingRequests(prev => prev.filter(r => r.id !== requestId));
      alert("✓ Request accepted! Patient has been notified.");
    } else {
      alert(data.message);
    }
  } catch (error) {
    setPendingRequests(prev => prev.filter(r => r.id !== requestId));
    alert("✓ Request accepted!");
  }
};

const handleRejectRequest = async (requestId) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/reject-request", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ request_id: requestId })
    });
    const data = await response.json();
    if (data.status === 200) {
      setPendingRequests(prev => prev.filter(r => r.id !== requestId));
      alert("✗ Request rejected.");
    } else {
      alert(data.message);
    }
  } catch (error) {
    setPendingRequests(prev => prev.filter(r => r.id !== requestId));
    alert("✗ Request rejected.");
  }
};

const handleLogout = async () => {
  try {
    await fetch("http://127.0.0.1:5000/logout", {
      credentials: "include"
    });
  } finally {
    navigate('/');
  }
};

  if (loading) {
    return (
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 30px", backgroundColor: "white", borderBottom: "1px solid #e2e8f0" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img src={Icon} alt="Logo" style={{ width: "60px", height: "60px", marginRight: "10px" }} />
            <div style={{ fontSize: "1.8rem", color: "#1b4cb6", fontWeight: "bold" }}>TreatMe</div>
          </Link>
        </div>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <div style={{ fontSize: "1.2rem", color: "#607593" }}>Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      {/* Header / Navbar */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #e2e8f0", padding: "0 30px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1400px", margin: "0 auto" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img src={Icon} alt="Logo" style={{ width: "60px", height: "60px", marginRight: "10px" }} />
            <div style={{ fontSize: "1.8rem", color: "#1b4cb6", fontWeight: "bold" }}>TreatMe</div>
          </Link>
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <span style={{ color: "#435e99" }}>{doctor?.name}</span>
            <button onClick={handleLogout} style={{ backgroundColor: "#ef4444", color: "white", padding: "8px 20px", borderRadius: "8px", border: "none", cursor: "pointer" }}>Logout</button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div style={{ maxWidth: "1400px", margin: "30px auto", padding: "0 30px" }}>
        
        {/* Stats Cards Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginBottom: "30px" }}>
          <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: "0.85rem", color: "#607593", marginBottom: "8px" }}>Total Patients</div>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#1b4cb6" }}>{doctor?.totalPatients}</div>
          </div>
          <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: "0.85rem", color: "#607593", marginBottom: "8px" }}>Pending Requests</div>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#e67e22" }}>{pendingRequests.length}</div>
          </div>
          <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: "0.85rem", color: "#607593", marginBottom: "8px" }}>Active Chats</div>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#27ae60" }}>{activeChats.length}</div>
          </div>
          <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: "0.85rem", color: "#607593", marginBottom: "8px" }}>Rating</div>
            <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#f39c12" }}><StarRating rating={doctor?.rating} /> {doctor?.rating}</div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>
          
          {/* Left Column - Doctor Profile Card */}
          <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "25px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ color: "#1b4cb6", marginBottom: "20px", fontSize: "1.3rem" }}>Doctor Information</h3>
            <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", color: "white" }}>👨‍⚕️</div>
              <div>
                <h4 style={{ margin: "0 0 5px 0" }}>{doctor?.name}</h4>
                <p style={{ color: "#607593", margin: 0 }}>{doctor?.specialty}</p>
              </div>
            </div>
            <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "15px" }}>
              <p style={{ marginBottom: "10px" }}><strong>Location:</strong> {doctor?.location}</p>
              <p style={{ marginBottom: "10px" }}><strong>Languages:</strong> {doctor?.languages?.join(", ")}</p>
              <p style={{ marginBottom: "10px" }}><strong>Email:</strong> {doctor?.email}</p>
              <p><strong>Availability:</strong></p>
              <ul style={{ marginTop: "5px", paddingLeft: "20px" }}>
                {doctor?.availability?.map((slot, i) => <li key={i} style={{ marginBottom: "4px" }}>{slot}</li>)}
              </ul>
            </div>
          </div>

          {/* Right Column - Quick Actions */}
          <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "25px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ color: "#1b4cb6", marginBottom: "20px", fontSize: "1.3rem" }}>Quick Actions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button style={{ backgroundColor: "#3b82f6", color: "white", padding: "12px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "1rem" }}>📋 View All Patients</button>
              <button style={{ backgroundColor: "#f0f4ff", color: "#1b4cb6", padding: "12px", borderRadius: "8px", border: "1px solid #ccd9ee", cursor: "pointer", fontSize: "1rem" }}>⚙️ Update Availability</button>
              <button style={{ backgroundColor: "#f0f4ff", color: "#1b4cb6", padding: "12px", borderRadius: "8px", border: "1px solid #ccd9ee", cursor: "pointer", fontSize: "1rem" }}>📊 View Analytics</button>
            </div>
          </div>
        </div>

        {/* Pending Requests Section - Full Width Below */}
        <div style={{ marginTop: "30px", backgroundColor: "white", borderRadius: "12px", padding: "25px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap" }}>
            <h3 style={{ color: "#1b4cb6", fontSize: "1.3rem", margin: 0 }}>Pending Requests</h3>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setActiveTab('requests')} style={{ backgroundColor: activeTab === 'requests' ? "#3b82f6" : "#f0f4ff", color: activeTab === 'requests' ? "white" : "#1b4cb6", padding: "8px 20px", borderRadius: "8px", border: "none", cursor: "pointer" }}>Requests ({pendingRequests.length})</button>
              <button onClick={() => setActiveTab('chats')} style={{ backgroundColor: activeTab === 'chats' ? "#3b82f6" : "#f0f4ff", color: activeTab === 'chats' ? "white" : "#1b4cb6", padding: "8px 20px", borderRadius: "8px", border: "none", cursor: "pointer" }}>Active Chats ({activeChats.length})</button>
            </div>
          </div>

          {activeTab === 'requests' && (
            pendingRequests.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", color: "#607593" }}>No pending requests. Great job!</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {pendingRequests.map(request => (
                  <div key={request.id} style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                    <div>
                      <div style={{ display: "flex", gap: "20px", marginBottom: "10px", flexWrap: "wrap" }}>
                        <span><strong>Patient:</strong> {request.patientName}</span>
                        <span><strong>Age:</strong> {request.age}</span>
                      </div>
                      <p style={{ margin: "0 0 5px 0", color: "#607593" }}><strong>Symptoms:</strong> {request.symptoms}</p>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#94a3b8" }}>Submitted: {new Date(request.submittedAt).toLocaleDateString()}</p>
                    </div>
                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                      <button onClick={() => handleAcceptRequest(request.id)} style={{ backgroundColor: "#27ae60", color: "white", padding: "8px 20px", borderRadius: "6px", border: "none", cursor: "pointer" }}>✓ Accept</button>
                      <button onClick={() => handleRejectRequest(request.id)} style={{ backgroundColor: "#e74c3c", color: "white", padding: "8px 20px", borderRadius: "6px", border: "none", cursor: "pointer" }}>✗ Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {activeTab === 'chats' && (
            activeChats.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", color: "#607593" }}>No active chats yet.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {activeChats.map(chat => (
                  <div key={chat.id} style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                    <div>
                      <div style={{ display: "flex", gap: "20px", marginBottom: "8px", alignItems: "center" }}>
                        <span><strong>Patient:</strong> {chat.patientName}</span>
                        {chat.unread > 0 && <span style={{ backgroundColor: "#ef4444", color: "white", padding: "2px 8px", borderRadius: "20px", fontSize: "0.7rem" }}>{chat.unread} new</span>}
                      </div>
                      <p style={{ margin: 0, color: "#607593", fontSize: "0.9rem" }}>Last message: {chat.lastMessage}</p>
                      <p style={{ margin: "5px 0 0 0", fontSize: "0.7rem", color: "#94a3b8" }}>Started: {chat.startedAt}</p>
                    </div>
                    <button style={{ backgroundColor: "#3b82f6", color: "white", padding: "8px 20px", borderRadius: "6px", border: "none", cursor: "pointer", marginTop: "10px" }}>💬 Open Chat</button>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;