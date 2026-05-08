import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const location = useLocation();

  const items = [
    {
      to: "/Dashboard",
      title: "My Profile",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      )
    },
    {
      to: "/post-request",
      title: "Post a Request",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14"/>
        </svg>
      )
    },
    {
      to: "/chat",
      title: "Chats",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      )
    },
    {
      to: "/search",
      title: "Find a Doctor",
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
      )
    },
  ];

  return (
    <div style={{
      width: "68px",
      backgroundColor: "white",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "24px 0",
      borderRight: "1px solid #e2eaf8",
      minHeight: "100vh",
      boxShadow: "2px 0 8px rgba(27,75,182,0.06)",
      position: "sticky",
      top: 0,
    }}>

      {/* Nav icons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }}>
        {items.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              title={item.title}
              style={{ textDecoration: "none" }}
            >
              <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: active ? "#eff6ff" : "transparent",
                color: active ? "#1b4cb6" : "#94a3b8",
                transition: "all 0.15s ease",
                cursor: "pointer",
              }}
              onMouseEnter={e => { if (!active) { e.currentTarget.style.backgroundColor = "#f8faff"; e.currentTarget.style.color = "#1b4cb6"; }}}
              onMouseLeave={e => { if (!active) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}}
              >
                {item.icon}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Back to home */}
      <Link to="/" title="Home" style={{ textDecoration: "none" }}>
        <div style={{
          width: "44px",
          height: "44px",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#94a3b8",
          cursor: "pointer",
          transition: "all 0.15s ease",
        }}
        onMouseEnter={e => { e.currentTarget.style.backgroundColor = "#f8faff"; e.currentTarget.style.color = "#1b4cb6"; }}
        onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#94a3b8"; }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </div>
      </Link>
    </div>
  );
}