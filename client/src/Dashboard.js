import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from './LogoIcon.png';
import { QUESTION_BANK } from './questionBank';

// ─── Badge Definitions ────────────────────────────────────────────────────────
const BADGE_DEFS = [
  { id: "first_consult",   icon: "🩺", label: "First consult",   desc: "1st chat with a doctor", color: "#dbeafe", textColor: "#1d4ed8" },
  { id: "quick_responder", icon: "⚡", label: "Quick responder", desc: "Replied within 5 min",    color: "#dcfce7", textColor: "#15803d" },
  { id: "kind_person",     icon: "❤️", label: "Kind person",     desc: "Left a positive review",  color: "#fce7f3", textColor: "#9d174d" },
  { id: "loyal_patient",   icon: "🏆", label: "Loyal patient",   desc: "5 chats completed",       color: "#fef9c3", textColor: "#854d0e" },
  { id: "top_reviewer",    icon: "⭐", label: "Top reviewer",    desc: "3 reviews submitted",     color: "#fae8ff", textColor: "#7e22ce" },
  { id: "verified_member", icon: "✅", label: "Verified member", desc: "Profile fully set up",    color: "#dcfce7", textColor: "#15803d" },
];

// ─── Points → Level helpers ───────────────────────────────────────────────────
// Level    = Math.floor(points / 50)
// Bar %    = (points % 50) / 50 * 100
// To next  = 50 - (points % 50)
const LEVEL_THEMES = [
  { icon: "🌱", color: "#64748b", bar: "#cbd5e1", name: "Novice"  },
  { icon: "📚", color: "#3b82f6", bar: "#93c5fd", name: "Learner" },
  { icon: "💪", color: "#8b5cf6", bar: "#c4b5fd", name: "Adept"   },
  { icon: "🔬", color: "#f59e0b", bar: "#fcd34d", name: "Expert"  },
  { icon: "🏆", color: "#10b981", bar: "#6ee7b7", name: "Master"  },
];

function getLevelInfo(points) {
  const level      = Math.floor(points / 50);
  const barPct     = ((points % 50) / 50) * 100;
  const toNext     = 50 - (points % 50);
  const themeIndex = Math.min(Math.floor(level / 2), LEVEL_THEMES.length - 1);
  const theme      = LEVEL_THEMES[themeIndex];
  return { level, barPct, toNext, theme };
}

// Points awarded per quiz difficulty
const PTS_MAP = { easy: 5, medium: 10, hard: 20 };

function pickQuestions(n = 5) {
  return [...QUESTION_BANK].sort(() => Math.random() - 0.5).slice(0, n);
}

// ─── Confetti ─────────────────────────────────────────────────────────────────
function Confetti({ active }) {
  const canvasRef = useRef(null);
  const animRef   = useRef(null);
  const particles = useRef([]);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const colors = ['#1b4cb6','#3b82f6','#93c5fd','#10b981','#f59e0b','#ec4899','#8b5cf6'];
    particles.current = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width, y: -10 - Math.random() * 80,
      r: 4 + Math.random() * 5, color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 3, vy: 2 + Math.random() * 3,
      spin: (Math.random() - 0.5) * 0.2, angle: Math.random() * Math.PI * 2,
      shape: Math.random() > 0.5 ? 'rect' : 'circle',
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current.forEach(p => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.angle += p.spin;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle);
        ctx.fillStyle = p.color; ctx.globalAlpha = Math.max(0, 1 - p.y / canvas.height);
        if (p.shape === 'rect') ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r * 1.6);
        else { ctx.beginPath(); ctx.arc(0, 0, p.r/2, 0, Math.PI*2); ctx.fill(); }
        ctx.restore();
      });
      particles.current = particles.current.filter(p => p.y < canvas.height + 20);
      if (particles.current.length > 0) animRef.current = requestAnimationFrame(draw);
    };
    animRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animRef.current);
  }, [active]);

  if (!active) return null;
  return (
    <canvas ref={canvasRef} style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 10, borderRadius: '20px',
    }} />
  );
}

// ─── Quiz Panel ───────────────────────────────────────────────────────────────
function QuizPanel({ points, onClose, onAwardPoints }) {
  const [screen,       setScreen]       = useState('intro');
  const [questions,    setQuestions]    = useState([]);
  const [current,      setCurrent]      = useState(0);
  const [selected,     setSelected]     = useState(null);
  const [answered,     setAnswered]     = useState(false);
  const [lives,        setLives]        = useState(3);
  const [score,        setScore]        = useState(0);
  const [ptsGained,    setPtsGained]    = useState(0);
  const [cardAnim,     setCardAnim]     = useState('enter');
  const [shakingHeart, setShakingHeart] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameOver,     setGameOver]     = useState(false);
  const [barAnimKey,   setBarAnimKey]   = useState(0);

  const { level, barPct, toNext, theme } = getLevelInfo(points);

  const startQuiz = () => {
    setQuestions(pickQuestions(5));
    setCurrent(0); setSelected(null); setAnswered(false);
    setLives(3); setScore(0); setPtsGained(0);
    setGameOver(false); setCardAnim('enter'); setScreen('quiz');
  };

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    const q = questions[current];
    const correct = idx === q.answer;
    if (correct) {
      setScore(s => s + 1);
      setPtsGained(p => p + PTS_MAP[q.difficulty]);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      setShakingHeart(true);
      setTimeout(() => setShakingHeart(false), 600);
      if (newLives === 0) {
        setTimeout(() => {
          // still award whatever was earned before dying
          onAwardPoints(ptsGained);
          setGameOver(true);
          setBarAnimKey(k => k + 1);
          setScreen('result');
        }, 1100);
        return;
      }
    }
  };

  const handleNext = () => {
    setCardAnim('exit');
    setTimeout(() => {
      const nextIdx = current + 1;
      if (nextIdx >= questions.length) {
        onAwardPoints(ptsGained);
        setShowConfetti(score >= 3);
        setBarAnimKey(k => k + 1);
        setTimeout(() => setShowConfetti(false), 3500);
        setScreen('result');
      } else {
        setCurrent(nextIdx); setSelected(null);
        setAnswered(false); setCardAnim('enter');
      }
    }, 260);
  };

  const q = questions[current];
  const diffColor = { easy: '#10b981', medium: '#f59e0b', hard: '#ef4444' };
  const diffBg    = { easy: '#d1fae5', medium: '#fef3c7', hard: '#fee2e2' };

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', position:'relative', overflow:'hidden' }}>
      <Confetti active={showConfetti} />

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 20px 12px', borderBottom:'1px solid #e2e8f0', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <span style={{ fontSize:'1.2rem' }}>🧠</span>
          <span style={{ fontSize:'0.98rem', fontWeight:'800', color:'#1e293b' }}>Health Quiz</span>
        </div>
        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          <div style={{ backgroundColor: theme.color + '22', border:`1.5px solid ${theme.color}44`, borderRadius:'20px', padding:'3px 10px', fontSize:'0.7rem', fontWeight:'700', color: theme.color }}>
            {theme.icon} {theme.name} · Lv.{level}
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', fontSize:'1.1rem', cursor:'pointer', color:'#94a3b8', padding:'2px 4px' }}>✕</button>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px 20px' }}>

        {/* ── INTRO ── */}
        {screen === 'intro' && (
          <div style={{ animation:'quizSlideIn 0.35s ease' }}>
            {/* Live points bar */}
            <div style={{ backgroundColor:'#f8fafc', borderRadius:'12px', padding:'14px 16px', marginBottom:'16px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.75rem', color:'#64748b', marginBottom:'6px' }}>
                <span>{theme.icon} Level {level}</span>
                <span style={{ fontWeight:'700', color: theme.color }}>{points} pts total</span>
              </div>
              <div style={{ height:'8px', backgroundColor:'#e2e8f0', borderRadius:'99px', overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${barPct}%`, background:`linear-gradient(90deg,${theme.color},${theme.bar})`, borderRadius:'99px', transition:'width 0.6s ease' }} />
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.68rem', color:'#94a3b8', marginTop:'4px' }}>
                <span>{points % 50} / 50 pts</span>
                <span>{toNext} pts to Level {level + 1}</span>
              </div>
            </div>

            <div style={{ textAlign:'center', padding:'8px 0 14px' }}>
              <div style={{ fontSize:'3rem', marginBottom:'8px' }}>🧬</div>
              <p style={{ fontSize:'0.88rem', color:'#475569', margin:'0 0 16px', lineHeight:'1.6' }}>
                5 questions · 3 lives ❤️<br/>Earn points for every correct answer!
              </p>
              <div style={{ display:'flex', justifyContent:'center', gap:'8px', marginBottom:'20px' }}>
                {[['Easy',`+${PTS_MAP.easy}pts`,'#10b981','#d1fae5'],['Medium',`+${PTS_MAP.medium}pts`,'#f59e0b','#fef3c7'],['Hard',`+${PTS_MAP.hard}pts`,'#ef4444','#fee2e2']].map(([d,x,c,bg]) => (
                  <div key={d} style={{ backgroundColor:bg, borderRadius:'8px', padding:'6px 10px', textAlign:'center' }}>
                    <div style={{ fontSize:'0.62rem', fontWeight:'700', color:c, textTransform:'uppercase' }}>{d}</div>
                    <div style={{ fontSize:'0.82rem', fontWeight:'800', color:c }}>{x}</div>
                  </div>
                ))}
              </div>
              <button onClick={startQuiz} style={{ backgroundColor:'#1b4cb6', color:'white', border:'none', borderRadius:'50px', padding:'12px 36px', fontSize:'0.92rem', fontWeight:'700', cursor:'pointer', boxShadow:'0 4px 14px rgba(27,76,182,0.3)', transition:'transform 0.15s' }}
                onMouseEnter={e => e.target.style.transform='scale(1.04)'}
                onMouseLeave={e => e.target.style.transform='scale(1)'}>
                Start Quiz 🚀
              </button>
            </div>
          </div>
        )}

        {/* ── QUIZ ── */}
        {screen === 'quiz' && q && (
          <div key={current} className={cardAnim === 'enter' ? 'quiz-card-enter' : 'quiz-card-exit'}>
            {/* HUD */}
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
              <div style={{ display:'flex', gap:'3px' }}>
                {[0,1,2].map(i => (
                  <span key={i} style={{
                    fontSize:'1.3rem', display:'inline-block',
                    filter: i < lives ? 'none' : 'grayscale(1) opacity(0.25)',
                    animation: i === lives && shakingHeart ? 'heartShake 0.5s ease' : 'none',
                    transition:'filter 0.3s ease',
                  }}>❤️</span>
                ))}
              </div>
              <span style={{ fontSize:'0.78rem', fontWeight:'700', color:'#64748b' }}>{current + 1} / {questions.length}</span>
              <div style={{ backgroundColor:'#eff6ff', borderRadius:'20px', padding:'3px 10px', fontSize:'0.75rem', fontWeight:'700', color:'#1b4cb6' }}>+{ptsGained} pts</div>
            </div>

            {/* Question progress bar */}
            <div style={{ height:'4px', backgroundColor:'#e2e8f0', borderRadius:'99px', marginBottom:'12px', overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${(current / questions.length) * 100}%`, background:'linear-gradient(90deg,#3b82f6,#1b4cb6)', borderRadius:'99px', transition:'width 0.4s ease' }} />
            </div>

            {/* Question */}
            <div style={{ backgroundColor:'#f8fafc', borderRadius:'14px', padding:'14px 16px', marginBottom:'12px' }}>
              <span style={{ fontSize:'0.65rem', fontWeight:'700', color:diffColor[q.difficulty], backgroundColor:diffBg[q.difficulty], padding:'3px 8px', borderRadius:'20px', textTransform:'uppercase', display:'inline-block', marginBottom:'8px' }}>
                {q.difficulty} · +{PTS_MAP[q.difficulty]} pts
              </span>
              <p style={{ fontSize:'0.9rem', fontWeight:'700', color:'#1e293b', margin:0, lineHeight:'1.5' }}>{q.q}</p>
            </div>

            {/* Options */}
            <div style={{ display:'flex', flexDirection:'column', gap:'8px', marginBottom:'12px' }}>
              {q.options.map((opt, i) => {
                let bg = 'white', border = '#e2e8f0', opacity = 1, anim = 'none';
                if (answered) {
                  if (i === q.answer)                         { bg = '#d1fae5'; border = '#10b981'; anim = 'correctPop 0.3s ease'; }
                  else if (i === selected && i !== q.answer) { bg = '#fee2e2'; border = '#ef4444'; anim = 'wrongShake 0.4s ease'; }
                  else                                        { opacity = 0.4; }
                }
                return (
                  <button key={i} disabled={answered} onClick={() => handleSelect(i)} style={{
                    width:'100%', textAlign:'left', background:bg, border:`2px solid ${border}`,
                    borderRadius:'10px', padding:'11px 14px', fontSize:'0.85rem', fontWeight:'500',
                    color:'#1e293b', cursor: answered ? 'default' : 'pointer', opacity,
                    transition:'border-color 0.15s, background 0.15s, transform 0.12s', animation:anim,
                  }}
                    onMouseEnter={e => { if (!answered) { e.currentTarget.style.borderColor='#93c5fd'; e.currentTarget.style.background='#eff6ff'; e.currentTarget.style.transform='translateX(4px)'; }}}
                    onMouseLeave={e => { if (!answered) { e.currentTarget.style.borderColor='#e2e8f0'; e.currentTarget.style.background='white'; e.currentTarget.style.transform='translateX(0)'; }}}>
                    <span style={{ display:'inline-flex', alignItems:'center', gap:'10px' }}>
                      <span style={{ width:'22px', height:'22px', borderRadius:'50%', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.72rem', fontWeight:'700', backgroundColor: answered && i === q.answer ? '#10b981' : answered && i === selected ? '#ef4444' : '#f1f5f9', color: answered && (i === q.answer || i === selected) ? 'white' : '#64748b', transition:'background 0.2s' }}>
                        {answered && i === q.answer ? '✓' : answered && i === selected && i !== q.answer ? '✗' : String.fromCharCode(65+i)}
                      </span>
                      {opt}
                    </span>
                  </button>
                );
              })}
            </div>

            {answered && (
              <button onClick={handleNext} style={{ width:'100%', backgroundColor:'#1b4cb6', color:'white', border:'none', borderRadius:'10px', padding:'12px', fontSize:'0.88rem', fontWeight:'700', cursor:'pointer', animation:'quizSlideIn 0.3s ease', boxShadow:'0 3px 10px rgba(27,76,182,0.25)' }}>
                {current + 1 >= questions.length ? 'See Results 🎉' : 'Next →'}
              </button>
            )}
          </div>
        )}

        {/* ── RESULT ── */}
        {screen === 'result' && (
          <div style={{ animation:'popIn 0.4s cubic-bezier(.4,0,.2,1)', textAlign:'center', position:'relative' }}>
            {gameOver ? (
              <>
                <div style={{ fontSize:'3rem', marginBottom:'8px' }}>💔</div>
                <h3 style={{ fontSize:'1.2rem', fontWeight:'800', color:'#ef4444', margin:'0 0 6px' }}>Game Over!</h3>
                <p style={{ color:'#64748b', fontSize:'0.85rem', margin:'0 0 6px' }}>
                  You got <strong style={{color:'#1e293b'}}>{score}</strong> correct before running out of hearts.
                </p>
                {ptsGained > 0 && (
                  <p style={{ color:'#3b82f6', fontSize:'0.82rem', margin:'0 0 14px', fontWeight:'600' }}>
                    Still earned +{ptsGained} pts!
                  </p>
                )}
              </>
            ) : (
              <>
                <div style={{ fontSize:'3rem', marginBottom:'8px' }}>{score === 5 ? '🏆' : score >= 3 ? '🎉' : '📚'}</div>
                <h3 style={{ fontSize:'1.2rem', fontWeight:'800', color:'#1e293b', margin:'0 0 4px' }}>
                  {score === 5 ? 'Perfect!' : score >= 3 ? 'Well Done!' : 'Keep Going!'}
                </h3>
                <p style={{ color:'#64748b', fontSize:'0.85rem', margin:'0 0 14px' }}>{score} / {questions.length} correct</p>
                <div style={{ backgroundColor:'#eff6ff', borderRadius:'12px', padding:'12px', marginBottom:'12px', animation:'popIn 0.4s ease 0.2s both' }}>
                  <div style={{ fontSize:'0.7rem', color:'#64748b', fontWeight:'600', marginBottom:'2px' }}>POINTS EARNED</div>
                  <div style={{ fontSize:'2rem', fontWeight:'800', color:'#1b4cb6' }}>+{ptsGained}</div>
                </div>
              </>
            )}

            {/* Live updated bar — points prop already updated by onAwardPoints */}
            <div style={{ marginBottom:'16px', textAlign:'left' }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.72rem', color:'#64748b', marginBottom:'4px' }}>
                <span>{theme.icon} Level {level}</span>
                <span style={{ color: theme.color, fontWeight:'700' }}>{points} pts</span>
              </div>
              <div style={{ height:'8px', backgroundColor:'#f1f5f9', borderRadius:'99px', overflow:'hidden' }}>
                <div key={barAnimKey} style={{ height:'100%', width:`${barPct}%`, background:`linear-gradient(90deg,${theme.color},${theme.bar})`, borderRadius:'99px', transition:'width 1.2s cubic-bezier(.4,0,.2,1)' }} />
              </div>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:'0.65rem', color:'#94a3b8', marginTop:'3px' }}>
                <span>{points % 50} / 50 pts this level</span>
                <span>{toNext} pts to Level {level + 1}</span>
              </div>
            </div>

            <div style={{ display:'flex', gap:'8px', justifyContent:'center' }}>
              <button onClick={startQuiz} style={{ backgroundColor:'#1b4cb6', color:'white', border:'none', borderRadius:'50px', padding:'10px 22px', fontSize:'0.85rem', fontWeight:'700', cursor:'pointer' }}>
                Play Again 🔄
              </button>
              <button onClick={onClose} style={{ backgroundColor:'white', color:'#334155', border:'2px solid #e2e8f0', borderRadius:'50px', padding:'10px 18px', fontSize:'0.85rem', fontWeight:'600', cursor:'pointer' }}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard({ isLoggedIn, username, userData, setIsLoggedIn, setUserData, setUsername }) {
  const navigate = useNavigate();
  const [quizOpen, setQuizOpen] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false); setUserData(null); setUsername('');
    localStorage.clear(); navigate('/');
  };

  // Adds pts to userData.points and syncs localStorage
const handleAwardPoints = async (pts) => {
  if (!pts || pts <= 0) return;

  try {
    const response = await fetch('/update_points', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Username': username // Ensure your Flask route can see this
      },
      body: JSON.stringify({ points_to_add: pts }),
    });

    if (response.ok) {
      const data = await response.json(); 
      // The server returns the OFFICIAL new point total
      setUserData(prev => ({
        ...prev,
        points: data.points // Update the state with the DB value
      }));
      
      // Update localStorage so it persists on refresh
      const localData = JSON.parse(localStorage.getItem('userData'));
      localStorage.setItem('userData', JSON.stringify({ ...localData, points: data.points }));
    }
  } catch (err) {
    console.error("Failed to sync points:", err);
  }
};

  const points = userData?.points ?? 0;
  const { level, barPct, toNext, theme } = getLevelInfo(points);

  const earnedBadges = userData?.badges || [];
  const badges = BADGE_DEFS.map(b => ({
    ...b,
    earned:    earnedBadges.includes(b.id),
    icon:      earnedBadges.includes(b.id) ? b.icon      : "🔒",
    color:     earnedBadges.includes(b.id) ? b.color     : "#f1f5f9",
    textColor: earnedBadges.includes(b.id) ? b.textColor : "#94a3b8",
  }));
  const earnedCount = badges.filter(b => b.earned).length;

  return (
    <div style={{ backgroundColor:"#f5f7fa", minHeight:"100vh", fontFamily:"'Segoe UI', system-ui, sans-serif" }}>

      <style>{`
        @keyframes quizSlideIn   { from{opacity:0;transform:translateY(18px);} to{opacity:1;transform:translateY(0);} }
        @keyframes quizSlideOut  { from{opacity:1;transform:translateY(0);} to{opacity:0;transform:translateY(-18px);} }
        @keyframes popIn         { 0%{transform:scale(0.85);opacity:0;} 65%{transform:scale(1.06);} 100%{transform:scale(1);opacity:1;} }
        @keyframes heartShake    { 0%,100%{transform:translateX(0) scale(1);} 20%{transform:translateX(-5px) scale(1.3);} 40%{transform:translateX(5px) scale(0.9);} 60%{transform:translateX(-3px);} 80%{transform:translateX(3px);} }
        @keyframes wrongShake    { 0%,100%{transform:translateX(0);} 20%{transform:translateX(-6px);} 40%{transform:translateX(6px);} 60%{transform:translateX(-4px);} 80%{transform:translateX(4px);} }
        @keyframes correctPop    { 0%{transform:scale(1);} 40%{transform:scale(1.03);} 100%{transform:scale(1);} }
        @keyframes panelSlideIn  { from{opacity:0;transform:translateX(340px);} to{opacity:1;transform:translateX(0);} }
        @keyframes quizBtnPulse  { 0%,100%{box-shadow:0 0 0 0 rgba(27,76,182,0.4);} 50%{box-shadow:0 0 0 8px rgba(27,76,182,0);} }
        .quiz-card-enter { animation: quizSlideIn  0.32s cubic-bezier(.4,0,.2,1) forwards; }
        .quiz-card-exit  { animation: quizSlideOut 0.24s cubic-bezier(.4,0,.2,1) forwards; }
      `}</style>

      {/* ── Navbar ── */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"10px 20px", backgroundColor:"white", borderBottom:"1px solid #e2e8f0" }}>
        <Link to="/" style={{ display:"flex", alignItems:"center", textDecoration:"none" }}>
          <img src={Icon} alt="Logo" style={{ width:"80px", height:"80px", marginRight:"10px" }} />
          <div style={{ fontSize:"1.8rem", color:"#1b4cb6", fontWeight:"800" }}>TreatMe</div>
        </Link>
        <div style={{ display:"flex", gap:"8px", alignItems:"center", flexWrap:"wrap", justifyContent:"flex-end" }}>
          <Link to="/post-request"><button style={{ backgroundColor:"#3b82f6", color:"white", padding:"8px 12px", borderRadius:"6px", border:"none", cursor:"pointer", fontWeight:"600", fontSize:"0.85rem", whiteSpace:"nowrap" }}>Custom Request</button></Link>
          <Link to="/search"><button style={{ backgroundColor:"#3b82f6", color:"white", padding:"8px 12px", borderRadius:"6px", border:"none", cursor:"pointer", fontWeight:"600", fontSize:"0.85rem", whiteSpace:"nowrap" }}>Find a Doctor</button></Link>
          <Link to="/chat"><button style={{ backgroundColor:"#3b82f6", color:"white", padding:"8px 12px", borderRadius:"6px", border:"none", cursor:"pointer", fontWeight:"600", fontSize:"0.85rem", whiteSpace:"nowrap" }}>Chats</button></Link>
          <Link to="/symptomchecker"><button style={{ backgroundColor:"#3b82f6", color:"white", padding:"8px 12px", borderRadius:"6px", border:"none", cursor:"pointer", fontWeight:"600", fontSize:"0.85rem", whiteSpace:"nowrap" }}>Easy Request</button></Link>
          <button onClick={handleLogout} style={{ backgroundColor:"#ef4444", color:"white", border:"none", padding:"8px 12px", borderRadius:"6px", cursor:"pointer", fontWeight:"600", fontSize:"0.85rem", whiteSpace:"nowrap" }}>Logout</button>
        </div>
      </div>

      {!isLoggedIn ? (
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", height:"60vh", gap:"16px" }}>
          <p style={{ fontSize:"1.2rem", color:"#607593" }}>You need to be logged in to view your profile.</p>
          <Link to="/login-choice"><button style={{ backgroundColor:"#3b82f6", color:"white", padding:"12px 28px", borderRadius:"8px", border:"none", cursor:"pointer", fontWeight:"bold", fontSize:"1rem" }}>Log In</button></Link>
        </div>
      ) : !userData ? (
        <div style={{ textAlign:"center", marginTop:"100px" }}>Loading...</div>
      ) : (

        <div style={{ display:"flex", justifyContent:"center", alignItems:"flex-start", gap:"24px", padding:"40px 20px", maxWidth:"1000px", margin:"0 auto" }}>

          {/* ── Profile card ── */}
          <div style={{ flex:"0 0 480px", maxWidth:"480px" }}>
            <div style={{ backgroundColor:"white", borderRadius:"20px", padding:"36px 32px", boxShadow:"0 4px 24px rgba(59,130,246,0.10)", marginBottom:"20px" }}>

              {/* Avatar */}
              <div style={{ textAlign:"center", marginBottom:"28px" }}>
                <div style={{ width:"88px", height:"88px", borderRadius:"50%", backgroundColor:"#dbeafe", border:"3px solid #bfdbfe", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 14px auto", boxShadow:"0 4px 12px rgba(59,130,246,0.15)" }}>
                  <svg width="52" height="52" viewBox="0 0 24 24" fill="#1b4cb6" stroke="none">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                  </svg>
                </div>
                <p style={{ fontSize:"1.5rem", fontWeight:"700", color:"#1e293b", margin:"0 0 4px" }}>
                  {userData?.first_name ? `${userData.first_name} ${userData.last_name}` : userData.username}
                </p>
                <p style={{ fontSize:"0.88rem", color:"#94a3b8", margin:0 }}>{userData?.username}</p>
              </div>

              {/* Info rows */}
              <div style={{ backgroundColor:"#f8fafc", borderRadius:"12px", padding:"16px 20px", marginBottom:"24px" }}>
                {[["Location", userData?.location || "Not set", null], ["Request Status","Active","#16a34a"], ["Date of Birth", userData?.date_of_birth || "Not set", null]].map(([label, val, accent], i, arr) => (
                  <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", paddingBottom: i < arr.length-1 ? "12px":"0", borderBottom: i < arr.length-1 ? "1px solid #e2e8f0":"none", marginBottom: i < arr.length-1 ? "12px":"0" }}>
                    <span style={{ fontSize:"0.85rem", color:"#94a3b8", fontWeight:"500" }}>{label}</span>
                    {accent
                      ? <span style={{ fontSize:"0.88rem", fontWeight:"600", color:accent, backgroundColor:"#dcfce7", padding:"3px 10px", borderRadius:"20px" }}>{val}</span>
                      : <span style={{ fontSize:"0.88rem", fontWeight:"600", color:"#1e293b" }}>{val}</span>}
                  </div>
                ))}
              </div>

              {/* ── Points / Level bar ── */}
              <div style={{ backgroundColor:"#eff6ff", borderRadius:"12px", padding:"16px 20px", marginBottom:"24px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"10px" }}>
                  <div style={{ display:"flex", alignItems:"baseline", gap:"6px" }}>
                    <span style={{ fontSize:"2rem", fontWeight:"800", color:"#1b4cb6" }}>{points}</span>
                    <span style={{ fontSize:"0.88rem", color:"#607593" }}>points</span>
                  </div>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:"0.78rem", fontWeight:"700", color: theme.color }}>{theme.icon} Level {level}</div>
                    <div style={{ fontSize:"0.68rem", color:"#94a3b8" }}>{earnedCount} / {badges.length} badges</div>
                  </div>
                </div>
                <div style={{ height:"8px", backgroundColor:"#bfdbfe", borderRadius:"99px", overflow:"hidden", marginBottom:"6px" }}>
                  <div style={{ height:"100%", width:`${barPct}%`, background:`linear-gradient(90deg,${theme.color},${theme.bar})`, borderRadius:"99px", transition:"width 0.6s ease" }} />
                </div>
                <div style={{ display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:"0.7rem", color:"#94a3b8" }}>{points % 50} / 50 pts</span>
                  <span style={{ fontSize:"0.7rem", color: theme.color, fontWeight:"600" }}>{toNext} pts to Level {level + 1}</span>
                </div>
              </div>

              {/* Badges */}
              <div style={{ marginBottom:"28px" }}>
                <p style={{ fontSize:"0.75rem", fontWeight:"700", color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:"12px" }}>Badges</p>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"10px" }}>
                  {badges.map((badge, i) => (
                    <div key={i} style={{ backgroundColor:badge.color, borderRadius:"12px", padding:"12px 8px", textAlign:"center", opacity: badge.earned ? 1 : 0.5 }}>
                      <div style={{ fontSize:"1.6rem", marginBottom:"5px" }}>{badge.icon}</div>
                      <div style={{ fontSize:"0.72rem", fontWeight:"700", color:badge.textColor, marginBottom:"2px" }}>{badge.label}</div>
                      <div style={{ fontSize:"0.62rem", color:badge.textColor, opacity:0.75 }}>{badge.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                <button onClick={() => setQuizOpen(o => !o)} style={{ width:"100%", background:"linear-gradient(135deg,#1b4cb6,#2563eb)", color:"white", padding:"12px", borderRadius:"10px", border:"none", cursor:"pointer", fontWeight:"700", fontSize:"0.95rem", animation: quizOpen ? 'none' : 'quizBtnPulse 2.5s infinite', boxShadow:"0 4px 14px rgba(27,76,182,0.3)", transition:"transform 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.transform='scale(1.02)'}
                  onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}>
                  {quizOpen ? '✕ Close Quiz' : '🧠 Play Health Quiz'}
                </button>
                <Link to="/Settings" style={{ textDecoration:"none" }}>
                  <button style={{ width:"100%", backgroundColor:"#3b82f6", color:"white", padding:"12px", borderRadius:"10px", border:"none", cursor:"pointer", fontWeight:"600", fontSize:"0.95rem" }}>Settings</button>
                </Link>
                <button onClick={handleLogout} style={{ width:"100%", backgroundColor:"white", color:"#ef4444", padding:"12px", borderRadius:"10px", border:"1.5px solid #fca5a5", cursor:"pointer", fontWeight:"600", fontSize:"0.95rem" }}>Log Out</button>
              </div>
            </div>
          </div>

          {/* ── Quiz side panel ── */}
          {quizOpen && (
            <div style={{ flex:"0 0 360px", width:"360px", backgroundColor:"white", borderRadius:"20px", boxShadow:"0 8px 40px rgba(27,76,182,0.18)", border:"1.5px solid #dbeafe", minHeight:"500px", maxHeight:"82vh", display:"flex", flexDirection:"column", position:"sticky", top:"20px", overflow:"hidden", animation:"panelSlideIn 0.38s cubic-bezier(.4,0,.2,1)" }}>
              <QuizPanel points={points} onClose={() => setQuizOpen(false)} onAwardPoints={handleAwardPoints} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;