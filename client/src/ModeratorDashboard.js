import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from './LogoIcon.png';

function ModeratorDashboard() {
  const navigate = useNavigate();
  // State for moderator's profile information
  const [moderator, setModerator] = useState(null);
  // Lists of moderation items requiring action
  const [reportedChats, setReportedChats] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [flaggedAccounts, setFlaggedAccounts] = useState([]);
  // Doctors awaiting credential verification before going live
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('reports');
  // Notes written by the moderator when approving/rejecting a doctor credential
  const [credentialNotes, setCredentialNotes] = useState({});

  // Fetch moderator dashboard data on component mount
  // Falls back to dummy data if API is unavailable (development/demo purposes)
  useEffect(() => {
    const fetchModeratorData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/moderator/dashboard", {
          credentials: "include"
        });
        const data = await response.json();
        if (data.status === 200) {
          setModerator(data.moderator);
          setReportedChats(data.reported_chats || []);
          setPendingReviews(data.pending_reviews || []);
          setFlaggedAccounts(data.flagged_accounts || []);
          setPendingDoctors(data.pending_doctors || []);
        }
      } catch (error) {
        // Dummy data for development/demo
        setModerator({
          username: "mod_bob",
          role: "moderator",
          bio: "Senior platform moderator responsible for maintaining community standards and ensuring safe interactions between patients and doctors"
        });
        setReportedChats([
          { id: 1, reportedBy: "Patient #4821", against: "Dr. Kevin Marsh", reason: "Inappropriate advice given", chatId: "CH-1042", reportedAt: "2026-05-03T11:00:00", severity: "high" },
          { id: 2, reportedBy: "Dr. Helen Troy", against: "Patient #3390", reason: "Abusive language in chat", chatId: "CH-0987", reportedAt: "2026-05-03T08:45:00", severity: "medium" },
          { id: 3, reportedBy: "Patient #5512", against: "Dr. James Briggs", reason: "Soliciting payment outside platform", chatId: "CH-1105", reportedAt: "2026-05-02T16:30:00", severity: "high" }
        ]);
        setPendingReviews([
          { id: 1, reviewerName: "Patient #7731", targetName: "Dr. Sarah Johnson", rating: 2, content: "The doctor was dismissive and rushed through my concerns.", submittedAt: "2026-05-03T09:20:00" },
          { id: 2, reviewerName: "Patient #2204", targetName: "Dr. Alan Webb", rating: 5, content: "Excellent care, very thorough and professional!", submittedAt: "2026-05-02T17:10:00" },
          { id: 3, reviewerName: "Patient #6643", targetName: "Dr. Nina Patel", rating: 1, content: "Prescribed medication without a proper evaluation.", submittedAt: "2026-05-02T13:55:00" }
        ]);
        setFlaggedAccounts([
          { id: 1, accountType: "Doctor", name: "Dr. Kevin Marsh", reason: "Multiple patient reports", flagCount: 4, status: "under_review" },
          { id: 2, accountType: "Patient", name: "Patient #3390", reason: "Repeated abusive messages", flagCount: 2, status: "under_review" }
        ]);
        // Dummy pending doctor credential submissions
        setPendingDoctors([
          {
            id: 1,
            name: "Dr. Priya Mehta",
            nhsNumber: "1234509876",
            specialty: "Neurology",
            location: "Bristol, UK",
            language: "English, Hindi",
            bio: "Neurologist with 8 years of clinical experience in stroke management and epilepsy.",
            submittedAt: "2026-05-04T09:00:00"
          },
          {
            id: 2,
            name: "Dr. Tom Clarke",
            nhsNumber: "9876501234",
            specialty: "Psychiatry",
            location: "Edinburgh, UK",
            language: "English",
            bio: "Consultant psychiatrist specialising in anxiety and mood disorders.",
            submittedAt: "2026-05-03T14:30:00"
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchModeratorData();
  }, []);

  // Remove a report from the queue after review
  const handleDismissReport = async (reportId) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/moderator/dismiss-report", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report_id: reportId })
      });
      const data = await response.json();
      if (data.status === 200) {
        setReportedChats(prev => prev.filter(r => r.id !== reportId));
        alert("Report dismissed.");
      } else {
        alert(data.message);
      }
    } catch (error) {
      setReportedChats(prev => prev.filter(r => r.id !== reportId));
      alert("Report dismissed.");
    }
  };

  // Send report to admin for further investigation
  const handleEscalateReport = async (reportId) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/moderator/escalate-report", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ report_id: reportId })
      });
      const data = await response.json();
      if (data.status === 200) {
        setReportedChats(prev => prev.filter(r => r.id !== reportId));
        alert("Report escalated to admin.");
      } else {
        alert(data.message);
      }
    } catch (error) {
      setReportedChats(prev => prev.filter(r => r.id !== reportId));
      alert("Report escalated to admin.");
    }
  };

  // Publish an approved review to the platform
  const handleApproveReview = async (reviewId) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/moderator/approve-review", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review_id: reviewId })
      });
      const data = await response.json();
      if (data.status === 200) {
        setPendingReviews(prev => prev.filter(r => r.id !== reviewId));
        alert("Review approved and published.");
      } else {
        alert(data.message);
      }
    } catch (error) {
      setPendingReviews(prev => prev.filter(r => r.id !== reviewId));
      alert("Review approved and published.");
    }
  };

  // Prevent a rejected review from being published
  const handleRejectReview = async (reviewId) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/moderator/reject-review", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ review_id: reviewId })
      });
      const data = await response.json();
      if (data.status === 200) {
        setPendingReviews(prev => prev.filter(r => r.id !== reviewId));
        alert("Review rejected.");
      } else {
        alert(data.message);
      }
    } catch (error) {
      setPendingReviews(prev => prev.filter(r => r.id !== reviewId));
      alert("Review rejected.");
    }
  };

  // Permanently remove an account after confirmation
  const handleBanAccount = async (accountId, accountType) => {
    if (!window.confirm(`Are you sure you want to ban this ${accountType.toLowerCase()}? This action cannot be undone.`)) return;
    try {
      const response = await fetch("http://127.0.0.1:5000/moderator/ban-account", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_id: accountId, account_type: accountType.toLowerCase() })
      });
      const data = await response.json();
      if (data.status === 200) {
        setFlaggedAccounts(prev => prev.filter(a => a.id !== accountId));
        alert("Account has been banned.");
      } else {
        alert(data.message);
      }
    } catch (error) {
      setFlaggedAccounts(prev => prev.filter(a => a.id !== accountId));
      alert("Account has been banned.");
    }
  };

  // Temporarily restrict an account pending investigation
  const handleSuspendAccount = async (accountId, accountType) => {
    try {
      const response = await fetch("http://127.0.0.1:5000/moderator/suspend-account", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ account_id: accountId, account_type: accountType.toLowerCase() })
      });
      const data = await response.json();
      if (data.status === 200) {
        setFlaggedAccounts(prev => prev.filter(a => a.id !== accountId));
        alert("⏸ Account has been suspended.");
      } else {
        alert(data.message);
      }
    } catch (error) {
      setFlaggedAccounts(prev => prev.filter(a => a.id !== accountId));
      alert("⏸ Account has been suspended.");
    }
  };

  // Approve a doctor's NHS credentials and allow them onto the platform
  const handleApproveDoctor = async (doctorId) => {
    const notes = credentialNotes[doctorId] || "";
    try {
      const response = await fetch("http://127.0.0.1:5000/moderator/approve-doctor", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctor_id: doctorId, notes })
      });
      const data = await response.json();
      if (data.status === 200) {
        setPendingDoctors(prev => prev.filter(d => d.id !== doctorId));
        setCredentialNotes(prev => { const n = { ...prev }; delete n[doctorId]; return n; });
        alert("✓ Doctor credentials approved. They can now accept patients.");
      } else {
        alert(data.message);
      }
    } catch (error) {
      // Optimistic UI update when backend is unavailable
      setPendingDoctors(prev => prev.filter(d => d.id !== doctorId));
      setCredentialNotes(prev => { const n = { ...prev }; delete n[doctorId]; return n; });
      alert("✓ Doctor credentials approved.");
    }
  };

  // Reject a doctor's registration, removing them from the pending queue
  const handleRejectDoctor = async (doctorId) => {
    const notes = credentialNotes[doctorId] || "";
    if (!notes.trim()) {
      alert("Please provide a reason for rejection in the notes field before rejecting.");
      return;
    }
    try {
      const response = await fetch("http://127.0.0.1:5000/moderator/reject-doctor", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctor_id: doctorId, notes })
      });
      const data = await response.json();
      if (data.status === 200) {
        setPendingDoctors(prev => prev.filter(d => d.id !== doctorId));
        setCredentialNotes(prev => { const n = { ...prev }; delete n[doctorId]; return n; });
        alert("✗ Doctor registration rejected.");
      } else {
        alert(data.message);
      }
    } catch (error) {
      setPendingDoctors(prev => prev.filter(d => d.id !== doctorId));
      setCredentialNotes(prev => { const n = { ...prev }; delete n[doctorId]; return n; });
      alert("✗ Doctor registration rejected.");
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("http://127.0.0.1:5000/logout", { credentials: "include" });
    } finally {
      navigate('/');
    }
  };

  // Return styling object based on report severity level (high/medium/low)
  const getSeverityStyle = (severity) => {
    if (severity === 'high') return { backgroundColor: "#fef2f2", borderLeft: "4px solid #e74c3c" };
    if (severity === 'medium') return { backgroundColor: "#fffbeb", borderLeft: "4px solid #f39c12" };
    return { backgroundColor: "#f0fdf4", borderLeft: "4px solid #27ae60" };
  };

  // Generate colored badge component for severity
  const getSeverityBadge = (severity) => {
    const base = { padding: "2px 10px", borderRadius: "20px", fontSize: "0.7rem", fontWeight: "bold", textTransform: "uppercase" };
    if (severity === 'high') return { ...base, backgroundColor: "#fee2e2", color: "#dc2626" };
    if (severity === 'medium') return { ...base, backgroundColor: "#fef3c7", color: "#d97706" };
    return { ...base, backgroundColor: "#dcfce7", color: "#16a34a" };
  };

  // Render star rating visualisation (filled/unfilled stars)
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <span key={i} style={{ color: i < rating ? "#f39c12" : "#d1d5db", fontSize: "0.9rem" }}>★</span>
    ));
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

      {/* Header/Navigation with moderator identity */}
      <div style={{ backgroundColor: "white", borderBottom: "1px solid #e2e8f0", padding: "0 30px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", maxWidth: "1400px", margin: "0 auto" }}>
          <Link to="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
            <img src={Icon} alt="Logo" style={{ width: "60px", height: "60px", marginRight: "10px" }} />
            <div style={{ fontSize: "1.8rem", color: "#1b4cb6", fontWeight: "bold" }}>TreatMe</div>
          </Link>
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <span style={{ color: "#435e99", fontWeight: "500" }}>🛡️ {moderator?.username}</span>
            <span style={{ backgroundColor: "#f0f4ff", color: "#1b4cb6", padding: "4px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase" }}>{moderator?.role}</span>
            <button onClick={handleLogout} style={{ backgroundColor: "#ef4444", color: "white", padding: "8px 20px", borderRadius: "8px", border: "none", cursor: "pointer" }}>Logout</button>
          </div>
        </div>
      </div>

      {/* Main Dashboard Content */}
      <div style={{ maxWidth: "1400px", margin: "30px auto", padding: "0 30px" }}>

        {/* Dashboard metrics overview cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px", marginBottom: "30px" }}>
          <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: "0.85rem", color: "#607593", marginBottom: "8px" }}>Reported Chats</div>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#e74c3c" }}>{reportedChats.length}</div>
          </div>
          <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: "0.85rem", color: "#607593", marginBottom: "8px" }}>Pending Reviews</div>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#e67e22" }}>{pendingReviews.length}</div>
          </div>
          <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: "0.85rem", color: "#607593", marginBottom: "8px" }}>Flagged Accounts</div>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#8b5cf6" }}>{flaggedAccounts.length}</div>
          </div>
          <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: "0.85rem", color: "#607593", marginBottom: "8px" }}>High Priority</div>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#1b4cb6" }}>{reportedChats.filter(r => r.severity === 'high').length}</div>
          </div>
          <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <div style={{ fontSize: "0.85rem", color: "#607593", marginBottom: "8px" }}>Doctors Pending Verification</div>
            <div style={{ fontSize: "2rem", fontWeight: "bold", color: "#0891b2" }}>{pendingDoctors.length}</div>
          </div>
        </div>

        {/* Moderator profile + Quick action buttons */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "30px" }}>

          {/* Left Column — Moderator Profile Card */}
          <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "25px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ color: "#1b4cb6", marginBottom: "20px", fontSize: "1.3rem" }}>Moderator Information</h3>
            <div style={{ display: "flex", gap: "20px", marginBottom: "20px" }}>
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#8b5cf6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", color: "white", flexShrink: 0 }}>🛡️</div>
              <div>
                <h4 style={{ margin: "0 0 5px 0" }}>{moderator?.username}</h4>
                <p style={{ color: "#607593", margin: "0 0 8px 0", textTransform: "capitalize" }}>{moderator?.role}</p>
              </div>
            </div>
            <div style={{ borderTop: "1px solid #e2e8f0", paddingTop: "15px" }}>
              <p style={{ marginBottom: "10px" }}><strong>Bio:</strong></p>
              <p style={{ color: "#607593", lineHeight: "1.6", margin: 0 }}>{moderator?.bio}</p>
            </div>
          </div>

          {/* Right Column — Quick Actions */}
          <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "25px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
            <h3 style={{ color: "#1b4cb6", marginBottom: "20px", fontSize: "1.3rem" }}>Quick Actions</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button style={{ backgroundColor: "#3b82f6", color: "white", padding: "12px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "1rem" }}>👥 View All Accounts</button>
              <button style={{ backgroundColor: "#f0f4ff", color: "#1b4cb6", padding: "12px", borderRadius: "8px", border: "1px solid #ccd9ee", cursor: "pointer", fontSize: "1rem" }}>📋 View Moderation Log</button>
              <button style={{ backgroundColor: "#f0f4ff", color: "#1b4cb6", padding: "12px", borderRadius: "8px", border: "1px solid #ccd9ee", cursor: "pointer", fontSize: "1rem" }}>📊 View Activity Report</button>
            </div>
          </div>
        </div>

        {/* Tabbed moderation queue interface */}
        <div style={{ marginTop: "30px", backgroundColor: "white", borderRadius: "12px", padding: "25px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
            <h3 style={{ color: "#1b4cb6", fontSize: "1.3rem", margin: 0 }}>Moderation Queue</h3>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <button onClick={() => setActiveTab('reports')} style={{ backgroundColor: activeTab === 'reports' ? "#3b82f6" : "#f0f4ff", color: activeTab === 'reports' ? "white" : "#1b4cb6", padding: "8px 20px", borderRadius: "8px", border: "none", cursor: "pointer" }}>
                Reported Chats ({reportedChats.length})
              </button>
              <button onClick={() => setActiveTab('reviews')} style={{ backgroundColor: activeTab === 'reviews' ? "#3b82f6" : "#f0f4ff", color: activeTab === 'reviews' ? "white" : "#1b4cb6", padding: "8px 20px", borderRadius: "8px", border: "none", cursor: "pointer" }}>
                Pending Reviews ({pendingReviews.length})
              </button>
              <button onClick={() => setActiveTab('accounts')} style={{ backgroundColor: activeTab === 'accounts' ? "#3b82f6" : "#f0f4ff", color: activeTab === 'accounts' ? "white" : "#1b4cb6", padding: "8px 20px", borderRadius: "8px", border: "none", cursor: "pointer" }}>
                Flagged Accounts ({flaggedAccounts.length})
              </button>
              {/* Doctor credentials tab — highlighted in teal to stand out as a distinct workflow */}
              <button onClick={() => setActiveTab('credentials')} style={{ backgroundColor: activeTab === 'credentials' ? "#0891b2" : "#f0fdff", color: activeTab === 'credentials' ? "white" : "#0891b2", padding: "8px 20px", borderRadius: "8px", border: activeTab === 'credentials' ? "none" : "1px solid #a5f3fc", cursor: "pointer", fontWeight: activeTab === 'credentials' ? "bold" : "normal" }}>
                🩺 Doctor Credentials ({pendingDoctors.length})
              </button>
            </div>
          </div>

          {/* Reports tab: reported chats for review and action */}
          {activeTab === 'reports' && (
            reportedChats.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", color: "#607593" }}>No reported chats. All clear!</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {reportedChats.map(report => (
                  <div key={report.id} style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", ...getSeverityStyle(report.severity) }}>
                    <div>
                      <div style={{ display: "flex", gap: "15px", marginBottom: "8px", alignItems: "center", flexWrap: "wrap" }}>
                        <span><strong>Reported By:</strong> {report.reportedBy}</span>
                        <span><strong>Against:</strong> {report.against}</span>
                        <span style={getSeverityBadge(report.severity)}>{report.severity}</span>
                      </div>
                      <p style={{ margin: "0 0 5px 0", color: "#607593" }}><strong>Reason:</strong> {report.reason}</p>
                      <p style={{ margin: "0 0 5px 0", fontSize: "0.85rem", color: "#435e99" }}>Chat ID: {report.chatId}</p>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#94a3b8" }}>Reported: {new Date(report.reportedAt).toLocaleString()}</p>
                    </div>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      <button style={{ backgroundColor: "#3b82f6", color: "white", padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "0.9rem" }}>👁 View Chat</button>
                      <button onClick={() => handleEscalateReport(report.id)} style={{ backgroundColor: "#e67e22", color: "white", padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "0.9rem" }}>⚠ Escalate</button>
                      <button onClick={() => handleDismissReport(report.id)} style={{ backgroundColor: "#6b7280", color: "white", padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "0.9rem" }}>✗ Dismiss</button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* Reviews tab: user submissions requiring moderation approval */}
          {activeTab === 'reviews' && (
            pendingReviews.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", color: "#607593" }}>No pending reviews. All caught up!</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {pendingReviews.map(review => (
                  <div key={review.id} style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: "20px", marginBottom: "8px", alignItems: "center", flexWrap: "wrap" }}>
                        <span><strong>Reviewer:</strong> {review.reviewerName}</span>
                        <span><strong>About:</strong> {review.targetName}</span>
                        <span>{renderStars(review.rating)}</span>
                      </div>
                      <p style={{ margin: "0 0 5px 0", color: "#607593", fontStyle: "italic" }}>"{review.content}"</p>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#94a3b8" }}>Submitted: {new Date(review.submittedAt).toLocaleString()}</p>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button onClick={() => handleApproveReview(review.id)} style={{ backgroundColor: "#27ae60", color: "white", padding: "8px 20px", borderRadius: "6px", border: "none", cursor: "pointer" }}>✓ Approve</button>
                      <button onClick={() => handleRejectReview(review.id)} style={{ backgroundColor: "#e74c3c", color: "white", padding: "8px 20px", borderRadius: "6px", border: "none", cursor: "pointer" }}>✗ Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* Accounts tab: flagged user profiles for suspension/ban */}
          {activeTab === 'accounts' && (
            flaggedAccounts.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", color: "#607593" }}>No flagged accounts at this time.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {flaggedAccounts.map(account => (
                  <div key={account.id} style={{ border: "1px solid #e2e8f0", borderRadius: "10px", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", backgroundColor: "#fef2f2" }}>
                    <div>
                      <div style={{ display: "flex", gap: "20px", marginBottom: "8px", alignItems: "center", flexWrap: "wrap" }}>
                        <span><strong>{account.name}</strong></span>
                        <span style={{ backgroundColor: account.accountType === "Doctor" ? "#dbeafe" : "#ede9fe", color: account.accountType === "Doctor" ? "#1d4ed8" : "#7c3aed", padding: "2px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "bold" }}>{account.accountType}</span>
                        <span style={{ backgroundColor: "#fee2e2", color: "#dc2626", padding: "2px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "bold" }}>{account.flagCount} flags</span>
                      </div>
                      <p style={{ margin: "0 0 5px 0", color: "#607593" }}><strong>Reason:</strong> {account.reason}</p>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: "#94a3b8", textTransform: "capitalize" }}>Status: {account.status.replace('_', ' ')}</p>
                    </div>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      <button onClick={() => handleSuspendAccount(account.id, account.accountType)} style={{ backgroundColor: "#e67e22", color: "white", padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "0.9rem" }}>⏸ Suspend</button>
                      <button onClick={() => handleBanAccount(account.id, account.accountType)} style={{ backgroundColor: "#e74c3c", color: "white", padding: "8px 16px", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "0.9rem" }}>🚫 Ban</button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {/* Credentials tab: new doctor registrations awaiting NHS verification */}
          {activeTab === 'credentials' && (
            pendingDoctors.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px", color: "#607593" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>✅</div>
                <p style={{ fontWeight: "600", color: "#374151" }}>All doctor credentials verified.</p>
                <p style={{ fontSize: "0.9rem" }}>No new registrations are waiting for review.</p>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <p style={{ margin: "0 0 4px 0", fontSize: "0.9rem", color: "#607593" }}>
                  Review each doctor's submitted details and NHS number before approving them to appear to patients.
                  A rejection reason is required before you can reject a registration.
                </p>

                {pendingDoctors.map(doc => (
                  <div key={doc.id} style={{ border: "1px solid #bae6fd", borderRadius: "12px", padding: "24px", backgroundColor: "#f0fdff" }}>

                    {/* Doctor summary row */}
                    <div style={{ display: "flex", gap: "16px", alignItems: "flex-start", marginBottom: "16px", flexWrap: "wrap" }}>
                      <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: "#0891b2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", color: "white", flexShrink: 0 }}>👨‍⚕️</div>
                      <div style={{ flex: 1 }}>
                        <p style={{ margin: "0 0 4px 0", fontWeight: "700", fontSize: "1.1rem", color: "#0c4a6e" }}>{doc.name}</p>
                        <p style={{ margin: 0, color: "#0891b2", fontSize: "0.9rem" }}>{doc.specialty} · {doc.location}</p>
                      </div>
                      <span style={{ backgroundColor: "#cffafe", color: "#0891b2", padding: "4px 12px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: "bold" }}>PENDING VERIFICATION</span>
                    </div>

                    {/* Credential details grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px", padding: "16px", backgroundColor: "white", borderRadius: "8px", border: "1px solid #e0f2fe" }}>
                      <div>
                        <p style={{ margin: "0 0 2px 0", fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase" }}>NHS Number</p>
                        <p style={{ margin: 0, fontWeight: "600", color: "#1e293b", fontFamily: "monospace", fontSize: "1rem" }}>{doc.nhsNumber}</p>
                      </div>
                      <div>
                        <p style={{ margin: "0 0 2px 0", fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase" }}>Languages</p>
                        <p style={{ margin: 0, fontWeight: "600", color: "#1e293b" }}>{doc.language}</p>
                      </div>
                      <div style={{ gridColumn: "1 / -1" }}>
                        <p style={{ margin: "0 0 2px 0", fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase" }}>Biography / Statement</p>
                        <p style={{ margin: 0, color: "#374151", lineHeight: "1.6", fontSize: "0.9rem" }}>{doc.bio}</p>
                      </div>
                      <div>
                        <p style={{ margin: "0 0 2px 0", fontSize: "0.75rem", color: "#94a3b8", fontWeight: "600", textTransform: "uppercase" }}>Submitted</p>
                        <p style={{ margin: 0, color: "#374151", fontSize: "0.85rem" }}>{new Date(doc.submittedAt).toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Moderator notes input — required for rejection, optional for approval */}
                    <div style={{ marginBottom: "16px" }}>
                      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                        Moderator Notes <span style={{ color: "#e74c3c" }}>*</span><span style={{ color: "#94a3b8", fontWeight: "normal" }}> (required to reject)</span>
                      </label>
                      <textarea
                        value={credentialNotes[doc.id] || ""}
                        onChange={(e) => setCredentialNotes(prev => ({ ...prev, [doc.id]: e.target.value }))}
                        placeholder="E.g. NHS number verified against national registry. / Unable to verify NHS number — please resubmit with correct details."
                        rows={3}
                        style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: "1px solid #bae6fd", fontSize: "0.9rem", resize: "vertical", boxSizing: "border-box", outline: "none", fontFamily: "inherit" }}
                      />
                    </div>

                    {/* Approve / Reject action buttons */}
                    <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                      <button
                        onClick={() => handleRejectDoctor(doc.id)}
                        style={{ backgroundColor: "#e74c3c", color: "white", padding: "10px 24px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold" }}>
                        ✗ Reject Registration
                      </button>
                      <button
                        onClick={() => handleApproveDoctor(doc.id)}
                        style={{ backgroundColor: "#27ae60", color: "white", padding: "10px 24px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold" }}>
                        ✓ Approve & Verify
                      </button>
                    </div>
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

export default ModeratorDashboard;