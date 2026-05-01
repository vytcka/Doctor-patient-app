import { useState } from "react";
import { users, initialMessages } from "./dummyData";
import { Link } from "react-router-dom";
import Icon from "./LogoIcon.png";

export default function Chat() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [reportOpen, setReportOpen] = useState(false);
  const [reportForm, setReportForm] = useState({ reason: "", details: "" });
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const currentUser = users.u1; // Patient is logged in

  function sendMessage() {
    let currentChatId = 12;
    if (!input.trim()) return;

    const newMsg = {
      id: crypto.randomUUID(),
      chat_id: currentChatId,
      sender_id: currentUser.id,
      sender_type: currentUser.type,
      content: input,
      file_path: null,
      file_type: null
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
    <div>
      {/* Header */}
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
          <Link to="/login-choice" style={{ textDecoration: "none" }}>
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

      {/* Chat Area */}
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

        {/* Input Row */}
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
          <button style={{ ...styles.button, background: "#ef4444" }} onClick={() => setReportOpen(true)}>
            Report
          </button>
        </div>
      </div>

      {/* Report Modal */}
      {reportOpen && (
        <div
          onClick={() => setReportOpen(false)}
          style={{
            position: "fixed", inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex", alignItems: "center", justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: "#fff", borderRadius: 8, padding: 24,
              width: 400, maxWidth: "90vw",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            {reportSubmitted ? (
              <p>✅ Report submitted. Thank you!</p>
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
                  <button
                    onClick={() => setReportOpen(false)}
                    style={{ padding: "8px 14px", borderRadius: 6, cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={submitReport}
                    disabled={!reportForm.reason}
                    style={{ ...styles.button, background: "#ef4444", opacity: reportForm.reason ? 1 : 0.5 }}
                  >
                    Submit
                  </button>
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
  container: {
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