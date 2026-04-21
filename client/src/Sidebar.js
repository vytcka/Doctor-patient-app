import { Link } from 'react-router-dom';

export default function Sidebar() {
  return (
    <div style={{
      width: "60px",
      backgroundColor: "#f0f4ff",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "20px 0",
      borderRight: "1px solid #ccd9ee",
      minHeight: "100vh"
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "24px", alignItems: "center" }}>
        <Link to="/Dashboard" title="Profile">
          <span style={{ fontSize: "1.5rem", cursor: "pointer" }}>👤</span>
        </Link>
        <Link to="/post-request" title="Post a Request">
          <span style={{ fontSize: "1.5rem", cursor: "pointer" }}>➕</span>
        </Link>
        <Link to="/chat" title="Chats">
          <span style={{ fontSize: "1.5rem", cursor: "pointer" }}>💬</span>
        </Link>
      </div>
      <Link to="/" title="Home">
        <span style={{ fontSize: "1.5rem", cursor: "pointer" }}>⬅️</span>
      </Link>
    </div>
  );
}