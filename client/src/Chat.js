import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "./LogoIcon.png";

const navStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px",
  backgroundColor: "white",
  borderBottom: "1px solid #e2e8f0"
};

export default function Chat({ isLoggedIn, userData }) {
  const navigate = useNavigate();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportForm, setReportForm] = useState({ reason: "", details: "" });
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // load chats on mount
  useEffect(() => {
    if (!isLoggedIn || !userData) return;
    fetch("http://127.0.0.1:5000/chats", {
      credentials: "include",
      headers: { "X-Username": userData.username }
    })
      .then(res => res.json())
      .then(data => {
        if (data.status === 200) setChats(data.chats);
        else console.log("chats error:", data);
      })
      .finally(() => setLoading(false));
  }, [isLoggedIn, userData]);

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

  // scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // poll for new messages every 3 seconds
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
    await fetch(`http://127.0.0.1:5000/chats/${selectedChat.id}/messages`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-Username": userData.username
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

  function submitReport() {
    setReportSubmitted(true);
    setTimeout(() => {
      setReportOpen(false);
      setReportSubmitted(false);
      setReportForm({ reason: "", details: "" });
    }, 2000);
  }

  if (!isLoggedIn) {
    return (
      <div style={{ backgroundColor: "#f0f4ff", minHeight: "100vh" }}>
        <div style={navStyle}>
          <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", gap: "10px" }}>
            <img src={Icon} alt="Logo" style={{ width: "44px", height: "44px" }} />
            <span style={{ fontSize: "1.4rem", color: "#1b4cb6", fontWeight: "800" }}>TreatMe</span>
          </Link>
          <div style={{ display: "flex", gap: "10px" }}>
            <Link to="/login-choice"><button style={{ backgroundColor: "#3b82f6", color: "white" }}>Login</button></Link>
            <Link to="/signup-choice"><button style={{ backgroundColor: "#3b82f6", color: "white" }}>Signup</button></Link>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: "16px" }}>
          <p style={{ fontSize: "1.2rem", color: "#607593" }}>You need to be logged in to access chats.</p>
          <Link to="/login-choice">
            <button style={{ backgroundColor: "#3b82f6", color: "white", padding: "12px 28px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold" }}>Log In</button>
          </Link>
        </div>
      </div>
    );
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
          <Link to="/post-request"><button style={{ backgroundColor: "#3b82f6", color: "white" }}>Post a Request</button></Link>
          <Link to="/search"><button style={{ backgroundColor: "#3b82f6", color: "white" }}>Find a Doctor</button></Link>
          <Link to="/dashboard"><button style={{ backgroundColor: "#3b82f6", color: "white" }}>Profile</button></Link>

        </div>
      </div>

      <div style={{ display: "flex", height: "calc(100vh - 120px)" }}>

        {/* Chat list sidebar */}
        <div style={{ width: "260px", backgroundColor: "white", borderRight: "1px solid #e2e8f0", overflowY: "auto", flexShrink: 0 }}>
          <div style={{ padding: "16px", borderBottom: "1px solid #e2e8f0" }}>
            <h3 style={{ margin: 0, color: "#040f25" }}>Your Chats</h3>
          </div>
          {loading ? (
            <p style={{ padding: "16px", color: "#607593" }}>Loading...</p>
          ) : chats.length === 0 ? (
            <p style={{ padding: "16px", color: "#607593" }}>No chats yet.</p>
          ) : (
            chats.map(chat => (
              <div key={chat.id} onClick={() => setSelectedChat(chat)}
                style={{ padding: "16px", cursor: "pointer", borderBottom: "1px solid #e2e8f0", backgroundColor: selectedChat?.id === chat.id ? "#eff6ff" : "white" }}>
                <p style={{ margin: 0, fontWeight: "bold", color: "#040f25" }}>{chat.doctor_name || "Unknown Doctor"}</p>
                <p style={{ margin: "2px 0 0 0", fontSize: "0.75rem", color: "#607593" }}>Chat #{chat.id}</p>
                <p style={{ margin: "4px 0 0 0", fontSize: "0.8rem", color: chat.status === "CHAT_STATUS_ACTIVE" ? "#15803d" : "#94a3b8" }}>
                  {chat.status === "CHAT_STATUS_ACTIVE" ? "Active" : chat.status === "CHAT_STATUS_CLOSED" ? "Closed" : "Withdrawn"}
                </p>
                <p style={{ margin: "2px 0 0 0", fontSize: "0.75rem", color: "#94a3b8" }}>{chat.message_count} messages</p>
              </div>
            ))
          )}
        </div>

       {/* Main chat area */}
<div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
  {!selectedChat ? (
    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <p style={{ color: "#607593" }}>Select a chat to start messaging</p>
    </div>
  ) : (
    <>
{/* Chat header */}
<div style={{ padding: "16px", backgroundColor: "white", borderBottom: "1px solid #e2e8f0", flexShrink: 0, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
  <div>
    <h3 style={{ margin: 0, color: "#040f25" }}>{selectedChat.doctor_name || "Chat"}</h3>
    <p style={{ margin: 0, fontSize: "0.8rem", color: selectedChat.status === "CHAT_STATUS_ACTIVE" ? "#15803d" : "#94a3b8" }}>
      {selectedChat.status === "CHAT_STATUS_ACTIVE" ? "Active" : selectedChat.status === "CHAT_STATUS_CLOSED" ? "Closed" : "Withdrawn"}
    </p>
  </div>
  <div style={{ position: "relative" }}>
    <button
      onClick={() => setDropdownOpen(prev => !prev)}
      style={{ background: "none", border: "none", fontSize: "1.4rem", cursor: "pointer", color: "#607593", padding: "4px 8px" }}>
      ⋯
    </button>
    {dropdownOpen && (
      <div style={{ position: "absolute", right: 0, top: "100%", backgroundColor: "white", border: "1px solid #e2e8f0", borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 100, minWidth: "160px" }}>
        <button onClick={() => { setReportOpen(true); setDropdownOpen(false); }}
          style={{ display: "block", width: "100%", padding: "12px 16px", textAlign: "left", background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontWeight: "bold", fontSize: "0.9rem" }}>
          Report this chat
        </button>
      </div>
    )}
  </div>
</div>
      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px", display: "flex", flexDirection: "column", gap: "10px", minHeight: 0 }}>
        {messages.length === 0 ? (
          <p style={{ color: "#607593", textAlign: "center" }}>No messages yet. Say hello!</p>
        ) : (
          messages.map(msg => {
            const isMe = msg.sender_type === 'user' && msg.sender_id === String(userData?.id);
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
        <div ref={messagesEndRef} />
      </div>

{/* Input row */}
<div style={{ padding: "16px", backgroundColor: "white", borderTop: "1px solid #e2e8f0", flexShrink: 0, display: "flex", gap: "10px" }}>
  {selectedChat.status === "CHAT_STATUS_ACTIVE" ? (
    <>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === "Enter" && sendMessage()}
        placeholder="Type a message..."
        style={{ flex: 1, minWidth: 0, padding: "12px 16px", borderRadius: 8, border: "1px solid #ccc", fontSize: "1rem" }}
      />
      <button onClick={sendMessage} style={{ padding: "12px 24px", borderRadius: 8, backgroundColor: "#3b82f6", color: "white", border: "none", cursor: "pointer", fontWeight: "bold", maxWidth: 200 }}>
        Send
      </button>
    </>
  ) : (
    <p style={{ color: "#94a3b8", margin: 0, padding: "10px" }}>
      This chat is {selectedChat.status === "CHAT_STATUS_CLOSED" ? "closed" : "withdrawn"}, messaging is disabled.
    </p>
  )}
</div>
    </>
  )}
</div>

        {/* Slide-out profile panel */}
        {panelOpen && (
          <div style={{ width: "280px", backgroundColor: "white", borderLeft: "1px solid #e2eaf8", padding: "28px 20px", boxShadow: "-4px 0 16px rgba(27,75,182,0.08)", display: "flex", flexDirection: "column", gap: "20px", overflowY: "auto" }}>

            {/* Close button */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setPanelOpen(false)} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer" }}>✕</button>
            </div>
            <div style={{ width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem", color: "white", margin: "0 auto" }}>👤</div>
            <p style={{ textAlign: "center", fontWeight: "bold", color: "#040f25" }}>Your Profile</p>
            <p style={{ color: "#040f25", fontSize: "0.9rem" }}><span style={{ color: "#607593" }}>Name: </span>{userData?.first_name} {userData?.last_name}</p>
            <p style={{ color: "#040f25", fontSize: "0.9rem" }}><span style={{ color: "#607593" }}>Email: </span>{userData?.username}</p>
            <p style={{ color: "#040f25", fontSize: "0.9rem" }}><span style={{ color: "#607593" }}>Location: </span>{userData?.location}</p>
            <Link to="/dashboard" style={{ textDecoration: "none", marginTop: "8px" }}>
              <button style={{ width: "100%", backgroundColor: "#3b82f6", color: "white", padding: "8px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold" }}>Full Profile</button>
            </Link>
          </div>
        )}
      </div>

      {/* Report modal */}
      {reportOpen && (
        <div onClick={() => setReportOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: 8, padding: 24, width: 400, maxWidth: "90vw" }}>
            {reportSubmitted ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <p style={{ fontSize: "1.1rem", fontWeight: "700", color: "#16a34a" }}>Report submitted. Thank you!</p>
              </div>
            ) : (
              <>
                <h2 style={{ marginTop: 0 }}>Submit a Report</h2>
                <label>Reason</label>
                <select value={reportForm.reason} onChange={e => setReportForm({ ...reportForm, reason: e.target.value })}
                  style={{ display: "block", width: "100%", marginBottom: 12, padding: 8, borderRadius: 6 }}>
                  <option value="">Select a reason...</option>
                  <option value="spam">Spam</option>
                  <option value="harassment">Harassment</option>
                  <option value="misinformation">Misinformation</option>
                  <option value="other">Other</option>
                </select>
                <label>Details</label>
                <textarea value={reportForm.details} onChange={e => setReportForm({ ...reportForm, details: e.target.value })}
                  placeholder="Describe the issue..." rows={4}
                  style={{ display: "block", width: "100%", marginBottom: 16, padding: 8, borderRadius: 6 }} />
                <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                  <button onClick={() => setReportOpen(false)} style={{ padding: "8px 14px", borderRadius: 6, cursor: "pointer" }}>Cancel</button>
                  <button onClick={submitReport} disabled={!reportForm.reason}
                    style={{ padding: "10px 20px", borderRadius: 8, backgroundColor: "#ef4444", color: "white", border: "none", cursor: "pointer", opacity: reportForm.reason ? 1 : 0.5 }}>Submit</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
