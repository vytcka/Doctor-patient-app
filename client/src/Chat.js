import { useState } from "react";
import { users, initialMessages } from "./dummyData";
import { Link } from "react-router-dom";
import Icon from "./LogoIcon.png";

export default function Chat() {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");

  const currentUser = users.u1; // Patient is logged in

  function sendMessage() {
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

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={Icon} alt="Description" style={{ width: "100px", height: "100px", marginRight: "10px" }} />
          <div style={{ fontSize: "2rem", color: "#1b4cb6", fontWeight: "bold" }}>TreatMe</div>{/* App title */}
        </div>
        {/* Buttons for: Home, PostaRequest, Reviews, Login and their colours + placements */}
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
          <Link to="/chat" style={{ textDecoration: "none" }}>
            <button style={{ backgroundColor: "#3b82f6", color: "white" }}>Chats</button>
          </Link>
        </div>
      </div>
      

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
        <button style={styles.button} on  Click={sendMessage}>
          Send
        </button>
      </div>
    </div>
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

