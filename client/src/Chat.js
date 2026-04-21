import { useState } from "react";
import { users, initialMessages } from "./dummyData";
import { Link } from "react-router-dom";
import Icon from "./LogoIcon.png";

export default function Chat() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);

  const currentUser = users.u1;

  // Dummy user info for panel — replace with real auth context later
  const user = {
    username: "Johndoe1",
    email: "johndoe@email.com",
    requestStatus: "Granted",
    points: 3,
  };

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

  return (
    <div>
      {/* Navbar */}
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
          <Link to="/signup" style={{ textDecoration: "none" }}>
            <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Signup</button>
          </Link>
          {/* Dashboard icon button */}
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

        {/* Chat area — original layout */}
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
              placeholder="Type a message..."
            />
            <button style={styles.button} onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>

        {/* Slide-out dashboard panel */}
        {panelOpen && (
          <div style={{
            width: "260px",
            backgroundColor: "white",
            borderLeft: "1px solid #ccd9ee",
            padding: "24px 20px",
            boxShadow: "-4px 0 12px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}>
            {/* Close button */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setPanelOpen(false)}
                style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#607593" }}
              >
                ✕
              </button>
            </div>

            {/* Avatar */}
            <div style={{
              width: "60px", height: "60px", borderRadius: "50%",
              backgroundColor: "#3b82f6", display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: "1.8rem", color: "white", margin: "0 auto"
            }}>
              👤
            </div>

            <p style={{ textAlign: "center", fontWeight: "bold", fontSize: "1.1rem", textDecorationLine: "underline", color: "#040f25" }}>
              Your Profile
            </p>

            <p style={{ color: "#040f25", fontSize: "0.9rem" }}>
              <span style={{ color: "#607593" }}>Username: </span>{user.username}
            </p>
            <p style={{ color: "#040f25", fontSize: "0.9rem" }}>
              <span style={{ color: "#607593" }}>Email: </span>{user.email}
            </p>
            <p style={{ color: "#040f25", fontSize: "0.9rem" }}>
              <span style={{ color: "#607593" }}>Request Status: </span>{user.requestStatus}
            </p>
            <p style={{ color: "#040f25", fontSize: "0.9rem" }}>
              <span style={{ color: "#607593" }}>Points: </span>{user.points}
            </p>

            <Link to="/Dashboard" style={{ textDecoration: "none", marginTop: "8px" }}>
              <button style={{
                width: "100%", backgroundColor: "#3b82f6", color: "white",
                padding: "8px", borderRadius: "6px", border: "none",
                cursor: "pointer", fontWeight: "bold"
              }}>
                Full Profile
              </button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    flex: 1,
    height: "80vh",
    width: "100vh",
    display: "flex",
    flexDirection: "column",
    padding: 20,
    background: "#f3f4f6"
  },
  messages: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: 10,
    overflowY: "auto",
    paddingBottom: 20
  },
  message: {
    maxWidth: "60%",
    padding: "10px 14px",
    borderRadius: 12,
    display: "flex",
    flexDirection: "column",
    gap: 4
  },
  inputRow: {
    display: "flex",
    gap: 10
  },
  input: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px 16px",
    borderRadius: 8,
    background: "#3b82f6",
    color: "white",
    border: "none",
    cursor: "pointer"
  }
};