import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Icon from './LogoIcon.png';
import StarRating from './StarRating';

function DoctorDashboard({ isLoggedIn, userData, setIsLoggedIn, setUserData, setUsername }) {
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [activeChats, setActiveChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('requests');
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const nhsNumber = userData?.nhs_number;
        const response = await fetch("http://127.0.0.1:5000/doctor/dashboard", {
          credentials: "include",
          headers: { "X-NHS-Number": nhsNumber || "" }
        });
        const data = await response.json();
        if (data.status === 200) {
          setDoctor(data.doctor);
          setPendingRequests(data.pending_requests || []);
          setActiveChats(data.active_chats || []);
        }
      } catch (error) {
        setDoctor({
          name: userData ? `Dr. ${userData.first_name} ${userData.last_name}` : "Dr. Doctor",
          specialty: userData?.specialty || "General Practice",
          rating: 4.8,
          languages: ["English"],
          location: userData?.location || "UK",
          availability: ["Monday 9am-5pm", "Wednesday 9am-5pm", "Friday 9am-5pm"],
          totalPatients: 0,
          totalReviews: 0,
          email: userData?.username || ""
        });
      } finally {
        setLoading(false);
      }
    };
    fetchDoctorData();
  }, [userData]);

  // load messages when chat selected
  useEffect(() => {
    if (!selectedChat || !userData) return;
    fetch(`http://127.0.0.1:5000/chats/${selectedChat.id}/messages`, {
      credentials: "include",
      headers: { "X-Username": userData.username }
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 200) setMessages(data.messages);
      });
  }, [selectedChat]);

  // poll messages every 3 seconds
  useEffect(() => {
    if (!selectedChat || !userData) return;
    const interval = setInterval(() => {
      fetch(`http://127.0.0.1:5000/chats/${selectedChat.id}/messages`, {
        credentials: "include",
        headers: { "X-Username": userData.username }
      })
        .then(res => res.json())
        .then(data => {
          if (data.status === 200) setMessages(data.messages);
        });
    }, 3000);
    return () => clearInterval(interval);
  }, [selectedChat]);

  async function sendMessage() {
    if (!input.trim() || !selectedChat || !userData) return;
    await fetch(`http://127.0.0.1:5000/chats/${selectedChat.id}/messages/doctor`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-NHS-Number": userData.nhs_number
      },
      body: JSON.stringify({ content: input })
    });
    setInput("");
    fetch(`http://127.0.0.1:5000/chats/${selectedChat.id}/messages`, {
      credentials: "include",
      headers: { "X-Username": userData.username }
    })
      .then(res => res.json())
      .then(data => { if (data.status === 200) setMessages(data.messages); });
  }

  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/accept-request", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json",  "X-NHS-Number": userData?.nhs_number || "" },
        body: JSON.stringify({ request_id: requestId })
      });
      const data = await response.json();
      if (data.status === 200) {
        setPendingRequests(prev => prev.filter(r => r.id !== requestId));
        toast.success("✓ Request accepted!");
      } else {
        toast.error(data.message);
      }
    } catch {
      setPendingRequests(prev => prev.filter(r => r.id !== requestId));
      toast.success("✓ Request accepted!");
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/reject-request", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", "X-NHS-Number": userData?.nhs_number || "" },
        body: JSON.stringify({ request_id: requestId })
      });
      const data = await response.json();
      if (data.status === 200) {
        setPendingRequests(prev => prev.filter(r => r.id !== requestId));
        toast.error("✗ Request rejected.");
      } else {
        toast.error(data.message);
      }
    } catch {
      setPendingRequests(prev => prev.filter(r => r.id !== requestId));
      toast.error("✗ Request rejected.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserData(null);
    setUsername('');
    localStorage.clear();
    navigate('/login');
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <p style={{ color: "#607593", fontSize: "1.2rem" }}>Loading dashboard...</p>
      </div>
    );
  }

  // if a chat is selected show full chat view
  if (selectedChat) {
    return (
      <div style={{ backgroundColor: "#f5f7fa", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <div style={{ backgroundColor: "white", borderBottom: "1px solid #e2e8f0", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button onClick={() => setSelectedChat(null)} style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#3b82f6" }}>←</button>
            <div>
              <h3 style={{ margin: 0, color: "#040f25" }}>{selectedChat.patientName}</h3>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#15803d" }}>Active</p>
            </div>
          </div>
          <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img src={Icon} alt="Logo" style={{ width: "50px", height: "50px", marginRight: "8px" }} />
            <div style={{ fontSize: "1.4rem", color: "#1b4cb6", fontWeight: "bold" }}>TreatMe</div>
          </Link>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "10px", minHeight: 0 }}>
          {messages.length === 0 ? (
            <p style={{ textAlign: "center", color: "#607593" }}>No messages yet.</p>
          ) : (
            messages.map(msg => {
              const isMe = msg.sender_type === 'doctor';
              return (
                <div key={msg.id} style={{
                  maxWidth: "60%", padding: "10px 14px", borderRadius: 12,
                  alignSelf: isMe ? "flex-end" : "flex-start",
                  backgroundColor: isMe ? "#3b82f6" : "#e5e7eb",
                  color: isMe ? "white" : "black"
                }}>
                  <div>{msg.content}</div>
                  <div style={{ fontSize: "0.7rem", opacity: 0.6, marginTop: "4px", textAlign: "right" }}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div style={{ padding: "16px", backgroundColor: "white", borderTop: "1px solid #e2e8f0", display: "flex", gap: "10px" }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
            style={{ flex: 1, minWidth: 0, padding: "12px 16px", borderRadius: 8, border: "1px solid #ccc", fontSize: "1rem" }}
          />
          <button onClick={sendMessage} style={{ padding: "12px 24px", borderRadius: 8, backgroundColor: "#3b82f6", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", maxWidth: 200 }}>Send</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      {/* Navbar */}
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

      <div style={{ maxWidth: "1400px", margin: "30px auto", padding: "0 30px" }}>

        {/* Metrics */}
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
            <div style={{ fontSize: "1.5rem", fontWeight: "bold", color: "#f39c12", display: "flex", alignItems: "center", gap: "8px" }}>
              <StarRating rating={doctor?.rating} /> {doctor?.rating}
            </div>
          </div>
        </div>

        {/* Profile + Quick Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px", marginBottom: "30px" }}>
          <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "25px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ color: "#1b4cb6", marginBottom: "20px" }}>Doctor Information</h3>
            <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
              {/* SVG Avatar */}
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#dbeafe", border: "3px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="44" height="44" viewBox="0 0 24 24" fill="#1b4cb6" stroke="none">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </div>
              <div>
                <h4 style={{ margin: "0 0 5px 0" }}>{doctor?.name}</h4>
                <p style={{ color: "#607593", margin: 0 }}>{doctor?.specialty}</p>
              </div>
            </div>
            <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "15px" }}>
              <p style={{ marginBottom: "10px" }}><strong>Location:</strong> {doctor?.location}</p>
              <p style={{ marginBottom: "10px" }}><strong>Languages:</strong> {doctor?.languages?.join(", ")}</p>
              <p style={{ marginBottom: "10px" }}><strong>Email:</strong> {doctor?.email}</p>
            </div>
          </div>

          <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "25px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ color: "#1b4cb6", marginBottom: "20px" }}>Quick Actions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button onClick={() => setActiveTab('chats')} style={{ backgroundColor: "#3b82f6", color: "white", padding: "12px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "1rem" }}>💬 View Active Chats</button>
              <button onClick={() => setActiveTab('requests')} style={{ backgroundColor: "#f0f4ff", color: "#1b4cb6", padding: "12px", borderRadius: "8px", border: "1px solid #ccd9ee", cursor: "pointer", fontSize: "1rem" }}>📋 View Pending Requests</button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "25px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h3 style={{ color: "#1b4cb6", margin: 0 }}>Patient Management</h3>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setActiveTab('requests')} style={{ backgroundColor: activeTab === 'requests' ? "#3b82f6" : "#f0f4ff", color: activeTab === 'requests' ? "white" : "#1b4cb6", padding: "8px 20px", borderRadius: "8px", border: "none", cursor: "pointer" }}>
                Requests ({pendingRequests.length})
              </button>
              <button onClick={() => setActiveTab('chats')} style={{ backgroundColor: activeTab === 'chats' ? "#3b82f6" : "#f0f4ff", color: activeTab === 'chats' ? "white" : "#1b4cb6", padding: "8px 20px", borderRadius: "8px", border: "none", cursor: "pointer" }}>
                Active Chats ({activeChats.length})
              </button>
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
                      <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
                        <span><strong>Patient:</strong> {request.patientName}</span>
                        <span><strong>Age:</strong> {request.age}</span>
                      </div>
                      <p style={{ margin: "0 0 5px 0", color: "#607593" }}><strong>Symptoms:</strong> {request.symptoms}</p>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#94a3b8" }}>Submitted: {new Date(request.submittedAt).toLocaleDateString()}</p>
                    </div>
                    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                      <button onClick={() => handleAcceptRequest(request.id)} style={{ backgroundColor: "#27ae60", color: "white", padding: "8px 20px", borderRadius: "6px", border: "none", cursor: "pointer" }}>Accept</button>
                      <button onClick={() => handleRejectRequest(request.id)} style={{ backgroundColor: "#e74c3c", color: "white", padding: "8px 20px", borderRadius: "6px", border: "none", cursor: "pointer" }}>Reject</button>
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
                    <button onClick={() => setSelectedChat(chat)} style={{ backgroundColor: "#3b82f6", color: "white", padding: "8px 20px", borderRadius: "6px", border: "none", cursor: "pointer", marginTop: "10px" }}>
                      💬 Open Chat
                    </button>
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