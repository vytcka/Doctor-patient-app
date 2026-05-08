import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Icon from "./LogoIcon.png";

export default function Chat({ isLoggedIn, userData }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportForm, setReportForm] = useState({ reason: "", details: "" });
  const [reportSubmitted, setReportSubmitted] = useState(false);
  const messagesEndRef = useRef(null);

  const points = 3;
  const badges = [
    { icon: "🩺", label: "First consult", earned: true, color: "#dbeafe", textColor: "#1d4ed8" },
    { icon: "⚡", label: "Quick responder", earned: true, color: "#dcfce7", textColor: "#15803d" },
    { icon: "❤️", label: "Kind person", earned: true, color: "#fce7f3", textColor: "#9d174d" },
    { icon: "🔒", label: "Loyal patient", earned: false, color: "#f1f5f9", textColor: "#94a3b8" },
    { icon: "🔒", label: "Top reviewer", earned: false, color: "#f1f5f9", textColor: "#94a3b8" },
    { icon: "🔒", label: "Verified member", earned: false, color: "#f1f5f9", textColor: "#94a3b8" },
  ];

  const navStyle = { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 40px", height: "68px", backgroundColor: "white", borderBottom: "1px solid #e8edf5", boxShadow: "0 1px 8px rgba(27,75,182,0.06)", position: "sticky", top: 0, zIndex: 100 };

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  useEffect(() => {
    if (!chatId) { setLoading(false); return; }
    const fetchMessages = async () => {
      try {
        const res = await fetch("http://127.0.0.1:5000/chat", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: chatId }) });
        const data = await res.json();
        if (data.status === 200) setMessages(data.messages || []);
      } catch (e) {
        setMessages([
          { id: 1, content: "Hello! How can I help you today?", sender_type: "doctor", timestamp: Date.now() - 60000 },
          { id: 2, content: "I've been having chest pains for the past two days.", sender_type: "user", timestamp: Date.now() - 30000 },
          { id: 3, content: "I see. Can you describe the pain? Is it sharp or dull?", sender_type: "doctor", timestamp: Date.now() - 10000 },
        ]);
      }
      setLoading(false);
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [chatId]);

  useEffect(() => {
    if (!chatId) {
      setMessages([
        { id: 1, content: "Hello! How can I help you today?", sender_type: "doctor", timestamp: Date.now() - 60000 },
        { id: 2, content: "I've been having chest pains for the past two days.", sender_type: "user", timestamp: Date.now() - 30000 },
        { id: 3, content: "I see. Can you describe the pain? Is it sharp or dull?", sender_type: "doctor", timestamp: Date.now() - 10000 },
      ]);
      setLoading(false);
    }
  }, []);

  async function sendMessage() {
    if (!input.trim()) return;
    const optimistic = { id: Date.now(), content: input, sender_type: "user", timestamp: Date.now() };
    setMessages(prev => [...prev, optimistic]);
    setInput("");
    if (chatId) {
      try { await fetch("http://127.0.0.1:5000/chat", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ chat_id: chatId, content: input }) }); } catch (e) {}
    }
  }

  async function submitReport() {
    try { await fetch("http://127.0.0.1:5000/reportChat", { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reason: reportForm.reason, details: reportForm.details }) }); } catch (e) {}
    setReportSubmitted(true);
    setTimeout(() => { setReportOpen(false); setReportSubmitted(false); setReportForm({ reason: "", details: "" }); }, 2000);
  }

  if (!isLoggedIn) {
    return (
      <div style={{ backgroundColor: "#f0f4ff", minHeight: "100vh" }}>
        <div style={navStyle}>
          <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", gap: "10px" }}>
            <img src={Icon} alt="Logo" style={{ width: "44px", height: "44px" }} />
            <span style={{ fontSize: "1.4rem", color: "#1b4cb6", fontWeight: "800" }}>TreatMe</span>
          </Link>
          <div style={{ display: "flex", gap: "8px" }}>
            <Link to="/login-choice" style={{ textDecoration: "none" }}><button style={{ border: "1.5px solid #c7d9f5", background: "white", color: "#1b4cb6", borderRadius: "50px", padding: "9px 20px", fontSize: "0.88rem", fontWeight: "600", cursor: "pointer" }}>Log In</button></Link>
            <Link to="/signup-choice" style={{ textDecoration: "none" }}><button style={{ backgroundColor: "#1b4cb6", color: "white", border: "none", borderRadius: "50px", padding: "10px 22px", fontSize: "0.88rem", fontWeight: "700", cursor: "pointer" }}>Sign Up</button></Link>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh", gap: "16px" }}>
          <p style={{ fontSize: "1.2rem", color: "#607593" }}>You need to be logged in to access chats.</p>
          <Link to="/login-choice"><button style={{ backgroundColor: "#3b82f6", color: "white", padding: "12px 28px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: "1rem" }}>Log In</button></Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f0f4ff", minHeight: "100vh", display: "flex", flexDirection: "column" }}>

      {/* Navbar */}
      <div style={navStyle}>
        <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", gap: "10px" }}>
          <img src={Icon} alt="Logo" style={{ width: "44px", height: "44px" }} />
          <span style={{ fontSize: "1.4rem", color: "#1b4cb6", fontWeight: "800", letterSpacing: "-0.3px" }}>TreatMe</span>
        </Link>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <Link to="/post-request" style={{ textDecoration: "none" }}><button style={{ background: "none", border: "none", color: "#334155", fontWeight: "500", fontSize: "0.9rem", padding: "8px 14px", cursor: "pointer" }}>Post a Request</button></Link>
          <Link to="/search" style={{ textDecoration: "none" }}><button style={{ background: "none", border: "none", color: "#334155", fontWeight: "500", fontSize: "0.9rem", padding: "8px 14px", cursor: "pointer" }}>Find a Doctor</button></Link>
          <button
            onClick={() => setPanelOpen(!panelOpen)}
            style={{ backgroundColor: panelOpen ? "#1b4cb6" : "#eff6ff", color: panelOpen ? "white" : "#1b4cb6", border: "none", borderRadius: "50px", padding: "10px 22px", fontSize: "0.88rem", fontWeight: "700", cursor: "pointer" }}>
            My Profile
          </button>
        </div>
      </div>

      {/* Body */}
      <div style={{ display: "flex", flex: 1, position: "relative" }}>

        {/* Chat area */}
        <div style={{ flex: 1, padding: "30px 24px", display: "flex", flexDirection: "column", gap: "16px", maxWidth: "800px", margin: "0 auto", width: "100%", transition: "margin-right 0.3s ease" }}>

          {/* Chat header */}
          <div style={{ backgroundColor: "white", borderRadius: "16px", padding: "20px 24px", boxShadow: "0 2px 12px rgba(27,75,182,0.08)", border: "1.5px solid #e2eaf8", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ margin: 0, fontWeight: "700", color: "#0f1f4b", fontSize: "1rem" }}>Active Consultation</p>
              <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "#64748b" }}>Your messages are encrypted and anonymous</p>
            </div>
            <button onClick={() => setReportOpen(true)} style={{ backgroundColor: "#fef2f2", color: "#ef4444", border: "1.5px solid #fca5a5", borderRadius: "8px", padding: "8px 16px", fontSize: "0.85rem", fontWeight: "600", cursor: "pointer" }}>Report</button>
          </div>

          {/* Messages box */}
          <div style={{ backgroundColor: "white", borderRadius: "16px", boxShadow: "0 2px 12px rgba(27,75,182,0.08)", border: "1.5px solid #e2eaf8", display: "flex", flexDirection: "column", height: "480px" }}>
            <div style={{ flex: 1, overflowY: "auto", padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {loading ? (
                <div style={{ textAlign: "center", color: "#94a3b8", marginTop: "40px" }}>Loading messages...</div>
              ) : messages.map(msg => {
                const isMe = msg.sender_type === "user";
                const time = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return (
                  <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: isMe ? "flex-end" : "flex-start" }}>
                    <div style={{ maxWidth: "70%", backgroundColor: isMe ? "#1b4cb6" : "#f0f4ff", color: isMe ? "white" : "#0f1f4b", padding: "12px 16px", borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px", fontSize: "0.9rem", lineHeight: "1.5", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                      {msg.content}
                    </div>
                    <span style={{ fontSize: "0.7rem", color: "#94a3b8", marginTop: "4px" }}>{time}</span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
            <div style={{ borderTop: "1px solid #e2eaf8", padding: "16px 20px", display: "flex", gap: "10px", alignItems: "center" }}>
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="Type a message..." style={{ flex: 1, padding: "12px 16px", borderRadius: "10px", border: "1.5px solid #e2eaf8", fontSize: "0.9rem", outline: "none", backgroundColor: "#f8faff" }} />
              <button onClick={sendMessage} disabled={!input.trim()} style={{ backgroundColor: input.trim() ? "#1b4cb6" : "#94a3b8", color: "white", border: "none", borderRadius: "10px", padding: "12px 24px", fontSize: "0.9rem", fontWeight: "700", cursor: input.trim() ? "pointer" : "not-allowed" }}>Send</button>
            </div>
          </div>
        </div>

        {/* Slide-out mini dashboard panel */}
        {panelOpen && (
          <div style={{ width: "280px", backgroundColor: "white", borderLeft: "1px solid #e2eaf8", padding: "28px 20px", boxShadow: "-4px 0 16px rgba(27,75,182,0.08)", display: "flex", flexDirection: "column", gap: "20px", overflowY: "auto" }}>

            {/* Close button */}
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setPanelOpen(false)} style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: "1.2rem", padding: 0 }}>✕</button>
            </div>

            {/* Avatar + name */}
            <div style={{ textAlign: "center" }}>
              <div style={{ width: "88px", height: "88px", borderRadius: "50%", backgroundColor: "#dbeafe", border: "3px solid #bfdbfe", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px auto", boxShadow: "0 4px 12px rgba(59,130,246,0.15)" }}>
                <svg width="52" height="52" viewBox="0 0 24 24" fill="#1b4cb6" stroke="none">
                  <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                </svg>
              </div>
              <p style={{ margin: "0 0 2px", fontWeight: "700", color: "#1e293b", fontSize: "1rem" }}>{userData?.first_name ? `${userData.first_name} ${userData.last_name}` : "Johndoe1"}</p>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#94a3b8" }}>{userData?.username || "johndoe@email.com"}</p>
            </div>

            {/* Points bar */}
            <div style={{ backgroundColor: "#eff6ff", borderRadius: "12px", padding: "14px 16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px" }}>
                  <span style={{ fontSize: "1.6rem", fontWeight: "800", color: "#1b4cb6" }}>{points}</span>
                  <span style={{ fontSize: "0.8rem", color: "#607593" }}>points</span>
                </div>
                <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>{badges.filter(b => b.earned).length}/{badges.length} badges</span>
              </div>
              <div style={{ height: "6px", backgroundColor: "#bfdbfe", borderRadius: "99px", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(points / 10) * 100}%`, background: "linear-gradient(90deg, #3b82f6, #1b4cb6)", borderRadius: "99px" }} />
              </div>
              <p style={{ margin: "6px 0 0", fontSize: "0.7rem", color: "#3b82f6", fontWeight: "600", textAlign: "center" }}>Next reward at 5 pts</p>
            </div>

            {/* Badges */}
            <div>
              <p style={{ fontSize: "0.72rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px" }}>Badges</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px" }}>
                {badges.map((badge, i) => (
                  <div key={i} style={{ backgroundColor: badge.color, borderRadius: "10px", padding: "10px 6px", textAlign: "center", opacity: badge.earned ? 1 : 0.45 }}>
                    <div style={{ fontSize: "1.3rem", marginBottom: "4px" }}>{badge.icon}</div>
                    <div style={{ fontSize: "0.6rem", fontWeight: "700", color: badge.textColor, lineHeight: "1.2" }}>{badge.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Go to full profile */}
            <Link to="/Dashboard" style={{ textDecoration: "none", marginTop: "auto" }}>
              <button style={{ width: "100%", backgroundColor: "#1b4cb6", color: "white", padding: "11px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "600", fontSize: "0.88rem" }}>
                View Full Profile
              </button>
            </Link>
          </div>
        )}
      </div>

      {/* Report modal */}
      {reportOpen && (
        <div onClick={() => setReportOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: "white", borderRadius: "16px", padding: "32px", width: "400px", maxWidth: "90vw", boxShadow: "0 8px 32px rgba(0,0,0,0.2)" }}>
            {reportSubmitted ? (
              <div style={{ textAlign: "center", padding: "20px" }}>
                <p style={{ fontSize: "1.1rem", fontWeight: "700", color: "#16a34a" }}>Report submitted. Thank you!</p>
              </div>
            ) : (
              <>
                <p style={{ fontSize: "1.2rem", fontWeight: "700", color: "#0f1f4b", marginBottom: "20px" }}>Submit a Report</p>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>Reason</label>
                <select value={reportForm.reason} onChange={e => setReportForm({ ...reportForm, reason: e.target.value })} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #e2eaf8", marginBottom: "16px", fontSize: "0.9rem", outline: "none" }}>
                  <option value="">Select a reason...</option>
                  <option value="spam">Spam</option>
                  <option value="harassment">Harassment</option>
                  <option value="misinformation">Misinformation</option>
                  <option value="other">Other</option>
                </select>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "#374151", display: "block", marginBottom: "6px" }}>Details</label>
                <textarea value={reportForm.details} onChange={e => setReportForm({ ...reportForm, details: e.target.value })} placeholder="Describe the issue..." rows={4} style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1.5px solid #e2eaf8", marginBottom: "20px", fontSize: "0.9rem", outline: "none", resize: "vertical", boxSizing: "border-box" }} />
                <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                  <button onClick={() => setReportOpen(false)} style={{ padding: "10px 20px", borderRadius: "8px", border: "1px solid #e2eaf8", background: "white", color: "#374151", cursor: "pointer", fontWeight: "600" }}>Cancel</button>
                  <button onClick={submitReport} disabled={!reportForm.reason} style={{ padding: "10px 20px", borderRadius: "8px", border: "none", backgroundColor: reportForm.reason ? "#ef4444" : "#94a3b8", color: "white", cursor: reportForm.reason ? "pointer" : "not-allowed", fontWeight: "600" }}>Submit</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}