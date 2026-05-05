import { useState } from "react";
import { users, initialMessages } from "./dummyData";
import { Link, useNavigate } from "react-router-dom";
import Icon from "./LogoIcon.png";

export default function Chat({ isLoggedIn }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportForm, setReportForm] = useState({ reason: "", details: "" });
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const currentUser = users.u1;

  const user = {
    username: "Johndoe1",
    email: "johndoe@email.com",
    requestStatus: "Granted",
    points: 3,
  };

  // Redirect to login if not logged in
  if (!isLoggedIn) {
    return (
      <div style={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", backgroundColor: "white", borderBottom: "1px solid #e2e8f0" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img src={Icon} alt="Logo" style={{ width: "100px", height: "100px", marginRight: "10px" }} />
            <div style={{ fontSize: "2rem", color: "#1b4cb6", fontWeight: "bold" }}>TreatMe</div>
          </Link>
          <div style={{ display: "flex", gap: "10px" }}>
            <Link to="/login-choice" style={{ textDecoration: "none" }}>
              <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Login</button>
            </Link>
            <Link to="/signup-choice" style={{ textDecoration: "none" }}>
              <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Signup</button>
            </Link>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: "16px" }}>
          <p style={{ fontSize: "1.2rem", color: "#607593" }}>You need to be logged in to access chats.</p>
          <Link to="/login-choice">
            <button style={{ backgroundColor: "#3b82f6", color: "white", padding: "12px 28px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "1rem" }}>
              Log In
            </button>
          </Link>
        </div>
      </div>
    );
  }

  function sendMessage() {
    if (!input.trim()) return;
    const newMsg = {
      id: crypto.randomUUID(),
      text: input,
      senderId: currentUser.id,
      timestamp: Date.now()
    };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
  }

  function submitReport() {
    console.log("Report submitted:", reportForm);
    setReportSubmitted(true);
    setTimeout(() => {
      setReportOpen(false);
      setReportSubmitted(false);
      setReportForm({ reason: "", details: "" });
    }, 2000);
  }

  return (
    <div style={{ backgroundColor: "#f5f7fa", minHeight: "100vh" }}>
      {/* Navbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", backgroundColor: "white", borderBottom: "1px solid #e2e8f0" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src={Icon} alt="Logo" style={{ width: "100px", height: "100px", marginRight: "10px" }} />
          <div style={{ fontSize: "2rem", color: "#1b4cb6", fontWeight: "bold" }}>TreatMe</div>
        </Link>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link to="/post-request" style={{ textDecoration: "none" }}>
            <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Post a Request</button>
          </Link>
          <Link to="/reviews" style={{ textDecoration: "none" }}>
            <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Find a Doctor</button>
          </Link>
          <Link to="/dashboard" style={{ textDecoration: "none" }}>
            <button style={{ backgroundColor: "#3b82f6", color: "white" }}>User Profile</button>
          </Link>
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            style={{ backgroundColor: "#3b82f6", color: "white" }}
            title="Your Profile"
          >
            👤
          </button>
        </div>
      </div>

      {/* Chat + slide-out panel wrapper */}
      <div style={{ display: "flex", position: "relative" }}>

        {/* Chat area */}
        <div style={styles.container}>
          <div style={styles.messages}>
            {messages.map(msg => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div
                  key={msg.id}
                  style={{
                    ...styles.message,
                    alignSelf: isMe ? "flex-end" : "flex-start",
                    background: isMe ? "#3b82f6" : "#e5e7eb",
                    color: isMe ? "white" : "black"
                  }}
                >
                  <strong>{users[msg.senderId].name}</strong>
                  <div>{msg.text}</div>
                </div>
              );
            })}
          </div>

          <div style={styles.inputRow}>
            <input
              style={styles.input}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
            />
            <button style={styles.button} onClick={sendMessage}>Send</button>
            <button style={{ ...styles.button, background: "#ef4444" }} onClick={() => setReportOpen(true)}>Report</button>
          </div>
        </div>

        {/* Slide-out profile panel */}
        {panelOpen && (
          <div style={{ width: "260px", backgroundColor: "white", borderLeft: "1px solid #ccd9ee", padding: "24px 20px", boxShadow: "-4px 0 12px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setPanelOpen(false)} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#607593" }}>✕</button>
            </div>
            <div style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", color: "white", margin: "0 auto" }}>
              👤
            </div>
            <p style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1rem", textDecorationLine: "underline", color: "#040f25" }}>Your Profile</p>
            <p style={{ color: "#040f25", fontSize: "0.9rem" }}><span style={{ color: "#607593" }}>Username: </span>{user.username}</p>
            <p style={{ color: "#040f25", fontSize: "0.9rem" }}><span style={{ color: "#607593" }}>Email: </span>{user.email}</p>
            <p style={{ color: "#040f25", fontSize: "0.9rem" }}><span style={{ color: "#607593" }}>Request Status: </span>{user.requestStatus}</p>
            <p style={{ color: "#040f25", fontSize: "0.9rem" }}><span style={{ color: "#607593" }}>Points: </span>{user.points}</p>
            <Link to="/dashboard" style={{ textDecoration: "none", marginTop: "8px" }}>
              <button style={{ width: "100%", backgroundColor: "#3b82f6", color: "white", padding: "8px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold" }}>Full Profile</button>
            </Link>
          </div>
        )}
      </div>

      {/* Report Modal */}
      {reportOpen && (
        <div onClick={() => setReportOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 8, padding: 24, width: 400, maxWidth: "90vw", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
            {reportSubmitted ? (
              <p>Report submitted. Thank you!</p>
            ) : (
              <>
                <h2 style={{ marginTop: 0 }}>Submit a Report</h2>
                <label>Reason</label>
                <select
                  value={reportForm.reason}
                  onChange={e => setReportForm({ ...reportForm, reason: e.target.value })}
                  style={{ display: "block", width: "100%", marginBottom: 12, padding: 8, borderRadius: 6 }}
                >
                  <option value="">Select a reason...</option>
                  <option value="spam">Spam</option>
                  <option value="harassment">Harassment</option>
                  <option value="misinformation">Misinformation</option>
                  <option value="other">Other</option>
                </select>
                <label>Details</label>
                <textarea
                  value={reportForm.details}
                  onChange={e => setReportForm({ ...reportForm, details: e.target.value })}
                  placeholder="Describe the issue..."
                  rows={4}
                  style={{ display: "block", width: "100%", marginBottom: 16, padding: 8, borderRadius: 6 }}
                />
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <button onClick={() => setReportOpen(false)} style={{ padding: "8px 14px", borderRadius: 6, cursor: "pointer" }}>Cancel</button>
                  <button onClick={submitReport} disabled={!reportForm.reason} style={{ ...styles.button, background: "#ef4444", opacity: reportForm.reason ? 1 : 0.5 }}>Submit</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { flex: 1, height: "80vh", width: "100%", display: "flex", flexDirection: "column", padding: 20, background: "#f3f4f6" },
  messages: { flex: 1, display: "flex", flexDirection: "column", gap: 10, overflowY: "auto", paddingBottom: 20 },
  message: { maxWidth: "60%", padding: "10px 14px", borderRadius: 12, display: "flex", flexDirection: "column", gap: 4 },
  inputRow: { display: "flex", gap: 10 },
  input: { flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ccc" },
  button: { padding: "10px 16px", borderRadius: 8, background: "#3b82f6", color: "white", border: "none", cursor: "pointer" }
};