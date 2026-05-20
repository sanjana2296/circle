import { useState, useEffect, useRef, useCallback } from "react";

/* ───────────────────────── DATA ───────────────────────── */
const PEOPLE = [
  { id: 1, name: "Maya Chen", avatar: "MC", mutuals: 4, tags: ["designer", "NYC"], note: "Incredible eye for product. Built the onboarding flow at Figma that everyone talks about.", vouchedBy: 2, category: "hire", strength: 0.95, joinedWeeksAgo: 12 },
  { id: 2, name: "James Okafor", avatar: "JO", mutuals: 7, tags: ["eng", "Boston"], note: "Best backend engineer I've worked with. Shipped the real-time sync at Notion solo.", vouchedBy: 5, category: "hire", strength: 0.88, joinedWeeksAgo: 10 },
  { id: 3, name: "Sofia Reyes", avatar: "SR", mutuals: 3, tags: ["founder", "SF"], note: "Thoughtful, sharp, and deeply kind. Would trust her with anything.", vouchedBy: 1, category: "date", strength: 0.92, joinedWeeksAgo: 8 },
  { id: 4, name: "Alex Rivera", avatar: "AR", mutuals: 5, tags: ["PM", "NYC"], note: "The kind of roommate who remembers your coffee order and fixes the wifi.", vouchedBy: 2, category: "roommate", strength: 0.90, joinedWeeksAgo: 6 },
  { id: 5, name: "Priya Sharma", avatar: "PS", mutuals: 6, tags: ["eng", "Boston"], note: "Brilliant systems thinker. Also the person everyone calls when they need real advice.", vouchedBy: 3, category: "hire", strength: 0.87, joinedWeeksAgo: 14 },
  { id: 6, name: "Liam Park", avatar: "LP", mutuals: 2, tags: ["creative", "LA"], note: "Makes everyone around him better. Genuine, funny, zero ego.", vouchedBy: 4, category: "date", strength: 0.93, joinedWeeksAgo: 4 },
  { id: 7, name: "Noor Hadid", avatar: "NH", mutuals: 3, tags: ["designer", "SF"], note: "Her portfolio doesn't do her justice — working with her does. She sees things nobody else sees.", vouchedBy: 1, category: "hire", strength: 0.91, joinedWeeksAgo: 9 },
  { id: 8, name: "Ethan Morales", avatar: "EM", mutuals: 4, tags: ["founder", "NYC"], note: "Turned a side project into a company in 3 months. Relentless and kind — rare combo.", vouchedBy: 6, category: "hire", strength: 0.89, joinedWeeksAgo: 3 },
];

const VOUCH_CHAINS = {
  1: [{ from: "James Okafor", fromAvatar: "JO", note: "Incredible eye for product." }, { from: "You", fromAvatar: "YO", note: "James is one of the most reliable engineers I know." }],
  2: [{ from: "Priya Sharma", fromAvatar: "PS", note: "Best backend engineer I've worked with." }, { from: "Sofia Reyes", fromAvatar: "SR", note: "Priya is the person everyone calls for real advice." }],
  3: [{ from: "Maya Chen", fromAvatar: "MC", note: "Thoughtful, sharp, and deeply kind." }, { from: "James Okafor", fromAvatar: "JO", note: "Maya's product sense is unmatched." }],
  4: [{ from: "James Okafor", fromAvatar: "JO", note: "The kind of roommate who remembers your coffee order." }, { from: "Priya Sharma", fromAvatar: "PS", note: "James is one of the most reliable people I know." }],
  5: [{ from: "Sofia Reyes", fromAvatar: "SR", note: "Brilliant systems thinker." }, { from: "Maya Chen", fromAvatar: "MC", note: "Sofia sees problems before anyone else." }],
  6: [{ from: "Alex Rivera", fromAvatar: "AR", note: "Makes everyone around him better." }, { from: "James Okafor", fromAvatar: "JO", note: "Alex brings energy and clarity to every room." }],
  7: [{ from: "Maya Chen", fromAvatar: "MC", note: "She sees things nobody else sees." }, { from: "Priya Sharma", fromAvatar: "PS", note: "Maya is the kind of creative leader I aspire to be." }],
  8: [{ from: "Liam Park", fromAvatar: "LP", note: "Relentless and kind — rare combo." }, { from: "Alex Rivera", fromAvatar: "AR", note: "Liam's creativity is infectious." }],
};

const CATEGORIES = [
  { key: "all", label: "Everyone", icon: "✦" },
  { key: "hire", label: "Hire", icon: "⚡" },
  { key: "date", label: "Date", icon: "♡" },
  { key: "roommate", label: "Live with", icon: "⌂" },
];

const ONBOARDING_STEPS = [
  { title: "Welcome to Circle", subtitle: "Your next opportunity is one friend away.", icon: "✦", description: "Circle surfaces people vouched for by people you trust — for hiring, dating, roommates, and everything that matters." },
  { title: "Trust is earned", subtitle: "Every person here was put here by someone you know.", icon: "◐", description: "No algorithms. No strangers. Just people your friends believe in, with their name on the line." },
  { title: "Vouch for someone", subtitle: "Your reputation backs this. Make it count.", icon: "◈", description: "When you vouch, you're saying 'I trust this person.' Your name stays attached — that's what makes it meaningful." },
];

/* ───────────────────────── STYLES ───────────────────────── */
const COLORS = {
  bg: "#07070a",
  card: "rgba(255,255,255,0.02)",
  cardHover: "rgba(255,255,255,0.04)",
  border: "rgba(255,255,255,0.06)",
  borderActive: "rgba(168,130,255,0.3)",
  text: "#fff",
  textMuted: "rgba(255,255,255,0.4)",
  textDim: "rgba(255,255,255,0.2)",
  accent: "#a882ff",
  accentSoft: "rgba(168,130,255,0.1)",
  hire: { from: "#6366f1", to: "#3b82f6" },
  date: { from: "#ec4899", to: "#f43f5e" },
  roommate: { from: "#14b8a6", to: "#06b6d4" },
};

const getGradient = (cat) => COLORS[cat] ? `linear-gradient(135deg, ${COLORS[cat].from}, ${COLORS[cat].to})` : `linear-gradient(135deg, ${COLORS.hire.from}, ${COLORS.hire.to})`;
const getCatColor = (cat) => cat === "hire" ? "#818cf8" : cat === "date" ? "#f472b6" : "#2dd4bf";
const getPerson = (id) => PEOPLE.find(p => p.id === id);

/* ───────────────────────── COMPONENTS ───────────────────────── */

const TrustMeter = ({ strength, size = "default" }) => {
  const [animated, setAnimated] = useState(0);
  useEffect(() => { const t = setTimeout(() => setAnimated(strength), 300); return () => clearTimeout(t); }, [strength]);
  const w = size === "large" ? 120 : 80;
  const h = size === "large" ? 6 : 4;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: w, height: h, borderRadius: h / 2, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: h / 2, width: `${animated * 100}%`,
          background: animated > 0.9 ? "#4ade80" : animated > 0.85 ? "#facc15" : "#f87171",
          transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        }} />
      </div>
      <span style={{ fontSize: size === "large" ? 13 : 11, color: "rgba(255,255,255,0.35)", fontFamily: "'DM Mono', monospace", letterSpacing: 0.5 }}>
        {Math.round(animated * 100)}%
      </span>
    </div>
  );
};

/* ── Onboarding ── */
const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [exiting, setExiting] = useState(false);

  const next = () => {
    if (step === ONBOARDING_STEPS.length - 1) {
      setExiting(true);
      setTimeout(onComplete, 500);
    } else {
      setStep(s => s + 1);
    }
  };

  const s = ONBOARDING_STEPS[step];
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200, background: COLORS.bg,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 32, opacity: exiting ? 0 : 1, transition: "opacity 0.5s ease",
    }}>
      <div style={{
        position: "absolute", top: "15%", left: "50%", transform: "translateX(-50%)",
        width: 200, height: 200, borderRadius: "50%",
        background: `radial-gradient(circle, rgba(168,130,255,0.12) 0%, transparent 70%)`,
        animation: "breathe 4s ease-in-out infinite", pointerEvents: "none",
      }} />

      <div key={step} style={{ textAlign: "center", maxWidth: 340, animation: "fadeSlideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)" }}>
        <div style={{
          fontSize: 56, marginBottom: 24, animation: "float 3s ease-in-out infinite",
          color: COLORS.accent,
        }}>{s.icon}</div>
        <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 600, color: COLORS.text, fontFamily: "'Outfit', sans-serif", letterSpacing: -0.5 }}>
          {s.title}
        </h1>
        <p style={{ margin: "0 0 16px", fontSize: 15, color: COLORS.accent, fontFamily: "'DM Mono', monospace", fontWeight: 400 }}>
          {s.subtitle}
        </p>
        <p style={{ margin: "0 0 40px", fontSize: 14, lineHeight: 1.7, color: COLORS.textMuted, fontFamily: "'Source Serif 4', serif" }}>
          {s.description}
        </p>

        {/* Progress dots */}
        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 32 }}>
          {ONBOARDING_STEPS.map((_, i) => (
            <div key={i} style={{
              width: i === step ? 24 : 6, height: 6, borderRadius: 3,
              background: i === step ? COLORS.accent : "rgba(255,255,255,0.1)",
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }} />
          ))}
        </div>

        <button onClick={next} style={{
          padding: "14px 48px", borderRadius: 16, border: "none",
          background: `linear-gradient(135deg, ${COLORS.accent}, #7c5ce0)`,
          color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer",
          fontFamily: "'Outfit', sans-serif", letterSpacing: 0.3,
          transition: "transform 0.2s, box-shadow 0.2s",
          boxShadow: "0 4px 24px rgba(168,130,255,0.25)",
        }}
          onMouseEnter={e => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 8px 32px rgba(168,130,255,0.35)"; }}
          onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 24px rgba(168,130,255,0.25)"; }}
        >
          {step === ONBOARDING_STEPS.length - 1 ? "Enter Circle" : "Continue"}
        </button>

        {step === 0 && (
          <button onClick={() => { setExiting(true); setTimeout(onComplete, 500); }}
            style={{ display: "block", margin: "16px auto 0", background: "none", border: "none", color: COLORS.textDim, fontSize: 12, cursor: "pointer", fontFamily: "'DM Mono', monospace" }}>
            skip intro
          </button>
        )}
      </div>
    </div>
  );
};

/* ── Trust Graph ── */
const TrustGraph = ({ people, onClose }) => {
  const canvasRef = useRef(null);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [positions, setPositions] = useState([]);
  const animFrame = useRef(null);
  const mousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width = canvas.offsetWidth * 2;
    const H = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    const w = W / 2, h = H / 2;
    const cx = w / 2, cy = h / 2;

    // Position nodes in a force-like layout
    const nodes = people.map((p, i) => {
      const angle = (i / people.length) * Math.PI * 2 - Math.PI / 2;
      const radius = Math.min(w, h) * 0.32;
      return {
        ...p,
        x: cx + Math.cos(angle) * radius,
        y: cy + Math.sin(angle) * radius,
        targetX: cx + Math.cos(angle) * radius,
        targetY: cy + Math.sin(angle) * radius,
        vx: 0, vy: 0,
        radius: 22 + p.mutuals * 2,
      };
    });

    // Add "You" node at center
    nodes.unshift({ id: 0, name: "You", avatar: "YO", x: cx, y: cy, targetX: cx, targetY: cy, vx: 0, vy: 0, radius: 28, strength: 1, category: "all", mutuals: people.length });

    // Build edges from vouch relationships
    const edges = people.map(p => ({
      from: nodes.findIndex(n => n.id === p.vouchedBy) >= 0 ? nodes.findIndex(n => n.id === p.vouchedBy) : 0,
      to: nodes.findIndex(n => n.id === p.id),
      strength: p.strength,
    }));
    // Connect everyone to center "You" node
    people.forEach((_, i) => edges.push({ from: 0, to: i + 1, strength: 0.5 }));

    let frame = 0;
    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, w, h);

      // Draw edges
      edges.forEach(e => {
        const a = nodes[e.from], b = nodes[e.to];
        if (!a || !b) return;
        const pulse = Math.sin(frame * 0.02 + e.from) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(168, 130, 255, ${0.08 * pulse * e.strength})`;
        ctx.lineWidth = 1 + e.strength;
        ctx.stroke();

        // Animated particle along edge
        const t = ((frame * 0.005 + e.from * 0.3) % 1);
        const px = a.x + (b.x - a.x) * t;
        const py = a.y + (b.y - a.y) * t;
        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(168, 130, 255, ${0.4 * pulse})`;
        ctx.fill();
      });

      // Draw nodes
      nodes.forEach((node, i) => {
        const isHovered = hoveredNode === i;
        const breathe = Math.sin(frame * 0.015 + i) * 2;
        const r = node.radius + breathe + (isHovered ? 4 : 0);

        // Glow
        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 2.5);
        glow.addColorStop(0, `rgba(168, 130, 255, ${isHovered ? 0.15 : 0.05})`);
        glow.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(node.x, node.y, r * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Node circle
        ctx.beginPath();
        ctx.arc(node.x, node.y, r, 0, Math.PI * 2);
        const grad = ctx.createLinearGradient(node.x - r, node.y - r, node.x + r, node.y + r);
        if (i === 0) {
          grad.addColorStop(0, COLORS.accent);
          grad.addColorStop(1, "#7c5ce0");
        } else {
          const cat = node.category || "hire";
          grad.addColorStop(0, COLORS[cat]?.from || "#6366f1");
          grad.addColorStop(1, COLORS[cat]?.to || "#3b82f6");
        }
        ctx.fillStyle = grad;
        ctx.fill();
        ctx.strokeStyle = `rgba(255,255,255,${isHovered ? 0.3 : 0.1})`;
        ctx.lineWidth = 1;
        ctx.stroke();

        // Avatar text
        ctx.fillStyle = "#fff";
        ctx.font = `bold ${r * 0.55}px 'Outfit', sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(node.avatar, node.x, node.y);

        // Name label
        ctx.fillStyle = isHovered ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.5)";
        ctx.font = `${isHovered ? 500 : 400} 11px 'Outfit', sans-serif`;
        ctx.fillText(node.name, node.x, node.y + r + 14);
      });

      setPositions(nodes.map(n => ({ x: n.x, y: n.y, radius: n.radius })));
      animFrame.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animFrame.current);
  }, [people, hoveredNode]);

  const handleMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mousePos.current = { x, y };
    const found = positions.findIndex(p => Math.hypot(p.x - x, p.y - y) < p.radius + 5);
    setHoveredNode(found >= 0 ? found : null);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 150, background: "rgba(0,0,0,0.85)",
      backdropFilter: "blur(30px)", animation: "fadeIn 0.3s ease",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, color: COLORS.text, fontFamily: "'Outfit', sans-serif" }}>Trust Graph</h2>
          <p style={{ margin: "2px 0 0", fontSize: 12, color: COLORS.textMuted, fontFamily: "'DM Mono', monospace" }}>
            how your circle is connected
          </p>
        </div>
        <button onClick={onClose} style={{
          width: 36, height: 36, borderRadius: 10, border: `1px solid ${COLORS.border}`,
          background: "rgba(255,255,255,0.03)", color: COLORS.textMuted, fontSize: 18,
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}>×</button>
      </div>
      <canvas ref={canvasRef} onMouseMove={handleMouseMove}
        style={{ flex: 1, width: "100%", cursor: hoveredNode !== null ? "pointer" : "default" }}
      />
      <div style={{ padding: "12px 20px", display: "flex", justifyContent: "center", gap: 16 }}>
        {[{ label: "Hire", color: COLORS.hire.from }, { label: "Date", color: COLORS.date.from }, { label: "Roommate", color: COLORS.roommate.from }].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: l.color }} />
            <span style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: "'DM Mono', monospace" }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ── Vouch Chain Detail ── */
const PersonDetail = ({ person, onClose }) => {
  const chain = VOUCH_CHAINS[person.id] || [];
  const voucher = getPerson(person.vouchedBy);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 150, background: "rgba(0,0,0,0.8)",
      backdropFilter: "blur(30px)", animation: "fadeIn 0.3s ease",
      overflowY: "auto",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        maxWidth: 480, margin: "0 auto", minHeight: "100vh", padding: "0 0 40px",
        animation: "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        {/* Header */}
        <div style={{ padding: "20px 20px 0", display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{
            width: 36, height: 36, borderRadius: 10, border: `1px solid ${COLORS.border}`,
            background: "rgba(255,255,255,0.03)", color: COLORS.textMuted, fontSize: 18, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>×</button>
        </div>

        {/* Profile hero */}
        <div style={{ textAlign: "center", padding: "12px 20px 28px" }}>
          <div style={{
            width: 80, height: 80, borderRadius: 28, margin: "0 auto 16px",
            background: getGradient(person.category),
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26, fontWeight: 700, color: "#fff", letterSpacing: 1,
            boxShadow: `0 8px 32px ${COLORS[person.category]?.from || COLORS.hire.from}33`,
            animation: "fadeSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}>{person.avatar}</div>

          <h2 style={{ margin: "0 0 6px", fontSize: 24, fontWeight: 600, color: COLORS.text, fontFamily: "'Outfit', sans-serif", letterSpacing: -0.3 }}>
            {person.name}
          </h2>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
            {person.tags.map(t => (
              <span key={t} style={{
                fontSize: 11, padding: "3px 10px", borderRadius: 6,
                background: "rgba(255,255,255,0.05)", color: COLORS.textMuted,
                fontFamily: "'DM Mono', monospace",
              }}>{t}</span>
            ))}
            <span key="cat" style={{
              fontSize: 11, padding: "3px 10px", borderRadius: 6,
              background: COLORS.accentSoft, color: getCatColor(person.category),
              fontFamily: "'DM Mono', monospace", textTransform: "uppercase", fontWeight: 600, letterSpacing: 1,
            }}>{person.category}</span>
          </div>
          <TrustMeter strength={person.strength} size="large" />
        </div>

        {/* The vouch */}
        <div style={{ padding: "0 20px", marginBottom: 24 }}>
          <div style={{
            background: "rgba(255,255,255,0.02)", border: `1px solid ${COLORS.border}`,
            borderRadius: 20, padding: 20,
            animation: "fadeSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both",
          }}>
            <p style={{
              margin: "0 0 14px", fontSize: 16, lineHeight: 1.7,
              color: "rgba(255,255,255,0.7)", fontStyle: "italic",
              fontFamily: "'Source Serif 4', serif",
            }}>"{person.note}"</p>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 24, height: 24, borderRadius: 8,
                background: `linear-gradient(135deg, ${COLORS.accent}, #7c5ce0)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 9, fontWeight: 700, color: "#fff",
              }}>{voucher?.avatar || "??"}</div>
              <span style={{ fontSize: 12, color: COLORS.textMuted }}>
                vouched by <span style={{ color: "rgba(255,255,255,0.7)" }}>{voucher?.name || "Unknown"}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Trust stats */}
        <div style={{ padding: "0 20px", marginBottom: 24 }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 11, color: COLORS.textDim, fontFamily: "'DM Mono', monospace", letterSpacing: 1.5, textTransform: "uppercase" }}>
            Trust Breakdown
          </h3>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8,
            animation: "fadeSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) 0.15s both",
          }}>
            {[
              { label: "Mutuals", value: person.mutuals, sub: "shared connections" },
              { label: "Voucher rep", value: `${Math.round((voucher?.strength || 0.85) * 100)}%`, sub: "voucher's own score" },
              { label: "In circle", value: `${person.joinedWeeksAgo}w`, sub: "ago" },
            ].map((stat, i) => (
              <div key={i} style={{
                padding: 14, borderRadius: 14, background: "rgba(255,255,255,0.02)",
                border: `1px solid ${COLORS.border}`, textAlign: "center",
              }}>
                <div style={{ fontSize: 20, fontWeight: 600, color: COLORS.text, fontFamily: "'DM Mono', monospace" }}>{stat.value}</div>
                <div style={{ fontSize: 10, color: COLORS.textDim, marginTop: 2, fontFamily: "'DM Mono', monospace" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Vouch chain */}
        <div style={{ padding: "0 20px", marginBottom: 28 }}>
          <h3 style={{ margin: "0 0 12px", fontSize: 11, color: COLORS.textDim, fontFamily: "'DM Mono', monospace", letterSpacing: 1.5, textTransform: "uppercase" }}>
            Trust Chain
          </h3>
          <div style={{ position: "relative", paddingLeft: 20 }}>
            {/* Vertical line */}
            <div style={{
              position: "absolute", left: 7, top: 8, bottom: 8, width: 2,
              background: `linear-gradient(to bottom, ${COLORS.accent}, transparent)`,
              borderRadius: 1,
            }} />

            {chain.map((link, i) => (
              <div key={i} style={{
                position: "relative", marginBottom: 16, paddingLeft: 16,
                animation: `fadeSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + i * 0.1}s both`,
              }}>
                {/* Dot on the line */}
                <div style={{
                  position: "absolute", left: -17, top: 8,
                  width: 10, height: 10, borderRadius: 5,
                  background: COLORS.accent, border: `2px solid ${COLORS.bg}`,
                }} />

                <div style={{
                  padding: 14, borderRadius: 14, background: "rgba(255,255,255,0.02)",
                  border: `1px solid ${COLORS.border}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: 7,
                      background: `linear-gradient(135deg, ${COLORS.accent}, #7c5ce0)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 8, fontWeight: 700, color: "#fff",
                    }}>{link.fromAvatar}</div>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.7)", fontFamily: "'Outfit', sans-serif" }}>
                      {link.from}
                    </span>
                  </div>
                  <p style={{
                    margin: 0, fontSize: 13, lineHeight: 1.6,
                    color: COLORS.textMuted, fontStyle: "italic",
                    fontFamily: "'Source Serif 4', serif",
                  }}>"{link.note}"</p>
                </div>
              </div>
            ))}

            {/* Terminal node */}
            <div style={{
              position: "relative", paddingLeft: 16,
              animation: `fadeSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${0.2 + chain.length * 0.1}s both`,
            }}>
              <div style={{
                position: "absolute", left: -17, top: 8,
                width: 10, height: 10, borderRadius: 5,
                background: getCatColor(person.category), border: `2px solid ${COLORS.bg}`,
              }} />
              <div style={{ padding: "8px 0", fontSize: 12, color: COLORS.textMuted, fontFamily: "'DM Mono', monospace" }}>
                → {person.name} is in your circle
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ padding: "0 20px", display: "flex", gap: 8 }}>
          <button style={{
            flex: 1, padding: "14px 0", borderRadius: 14, border: "none",
            background: `linear-gradient(135deg, ${COLORS.accent}, #7c5ce0)`,
            color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer",
            fontFamily: "'Outfit', sans-serif", letterSpacing: 0.3,
            boxShadow: "0 4px 20px rgba(168,130,255,0.2)",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 6px 24px rgba(168,130,255,0.3)"; }}
            onMouseLeave={e => { e.target.style.transform = "translateY(0)"; e.target.style.boxShadow = "0 4px 20px rgba(168,130,255,0.2)"; }}
          >Request intro</button>
          <button style={{
            padding: "14px 20px", borderRadius: 14,
            border: `1px solid ${COLORS.border}`, background: "transparent",
            color: COLORS.textMuted, fontSize: 14, cursor: "pointer",
            fontFamily: "'Outfit', sans-serif", transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.target.style.borderColor = "rgba(255,255,255,0.15)"; e.target.style.color = "rgba(255,255,255,0.7)"; }}
            onMouseLeave={e => { e.target.style.borderColor = COLORS.border; e.target.style.color = COLORS.textMuted; }}
          >Save</button>
        </div>
      </div>
    </div>
  );
};

/* ── Vouch Modal ── */
const VouchModal = ({ onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("hire");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const charCount = note.length;
  const minChars = 30;

  const handleSubmit = () => {
    if (name && note.length >= minChars) { setSubmitted(true); setTimeout(() => { onSubmit({ name, category, note }); onClose(); }, 1800); }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 200,
      background: "rgba(0,0,0,0.8)", backdropFilter: "blur(30px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      animation: "fadeIn 0.3s ease", padding: 20,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#111114", border: `1px solid ${COLORS.border}`,
        borderRadius: 24, padding: 28, width: "100%", maxWidth: 400,
        animation: "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        {submitted ? (
          <div style={{ textAlign: "center", padding: "30px 0", animation: "fadeSlideIn 0.5s ease" }}>
            <div style={{ fontSize: 48, marginBottom: 16, animation: "float 2s ease-in-out infinite", color: COLORS.accent }}>✦</div>
            <h3 style={{ color: COLORS.text, fontFamily: "'Outfit', sans-serif", fontSize: 22, margin: "0 0 8px" }}>Vouch sent</h3>
            <p style={{ color: COLORS.textMuted, fontSize: 14, margin: 0, fontFamily: "'Source Serif 4', serif", fontStyle: "italic" }}>Your trust means everything.</p>
          </div>
        ) : (
          <>
            <h3 style={{ margin: "0 0 4px", color: COLORS.text, fontFamily: "'Outfit', sans-serif", fontSize: 20 }}>Vouch for someone</h3>
            <p style={{ margin: "0 0 22px", color: COLORS.textMuted, fontSize: 13, fontFamily: "'Source Serif 4', serif", fontStyle: "italic" }}>Your reputation backs this. Make it count.</p>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 10, color: COLORS.textDim, marginBottom: 6, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>Who</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Their name"
                style={{
                  width: "100%", padding: "11px 14px", borderRadius: 12, border: `1px solid ${COLORS.border}`,
                  background: "rgba(255,255,255,0.03)", color: COLORS.text, fontSize: 14, outline: "none",
                  fontFamily: "'Outfit', sans-serif", boxSizing: "border-box", transition: "border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor = COLORS.borderActive}
                onBlur={e => e.target.style.borderColor = COLORS.border}
              />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 10, color: COLORS.textDim, marginBottom: 6, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>For what</label>
              <div style={{ display: "flex", gap: 6 }}>
                {["hire", "date", "roommate"].map(c => (
                  <button key={c} onClick={() => setCategory(c)} style={{
                    flex: 1, padding: "9px 0", borderRadius: 10,
                    border: `1px solid ${category === c ? COLORS.borderActive : COLORS.border}`,
                    background: category === c ? COLORS.accentSoft : "transparent",
                    color: category === c ? COLORS.accent : COLORS.textMuted,
                    fontSize: 12, fontWeight: 500, cursor: "pointer", textTransform: "capitalize",
                    fontFamily: "'Outfit', sans-serif", transition: "all 0.2s",
                  }}>{c}</button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 22 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label style={{ fontSize: 10, color: COLORS.textDim, letterSpacing: 1.5, textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>Your vouch</label>
                <span style={{ fontSize: 10, fontFamily: "'DM Mono', monospace", color: charCount >= minChars ? "#4ade80" : COLORS.textDim }}>
                  {charCount}/{minChars} min
                </span>
              </div>
              <textarea value={note} onChange={e => setNote(e.target.value)}
                placeholder="What would you trust this person with? Be specific — it matters."
                rows={4}
                style={{
                  width: "100%", padding: "11px 14px", borderRadius: 12, border: `1px solid ${COLORS.border}`,
                  background: "rgba(255,255,255,0.03)", color: COLORS.text, fontSize: 14, outline: "none",
                  fontFamily: "'Source Serif 4', serif", resize: "none", boxSizing: "border-box",
                  transition: "border-color 0.2s", lineHeight: 1.6,
                }}
                onFocus={e => e.target.style.borderColor = COLORS.borderActive}
                onBlur={e => e.target.style.borderColor = COLORS.border}
              />
            </div>

            <button onClick={handleSubmit} style={{
              width: "100%", padding: "13px 0", borderRadius: 14, border: "none",
              background: name && charCount >= minChars ? `linear-gradient(135deg, ${COLORS.accent}, #7c5ce0)` : "rgba(255,255,255,0.05)",
              color: name && charCount >= minChars ? "#fff" : COLORS.textDim,
              fontSize: 14, fontWeight: 600, cursor: name && charCount >= minChars ? "pointer" : "default",
              fontFamily: "'Outfit', sans-serif", letterSpacing: 0.3, transition: "all 0.3s",
              boxShadow: name && charCount >= minChars ? "0 4px 20px rgba(168,130,255,0.2)" : "none",
            }}>
              Put your name on it
            </button>
          </>
        )}
      </div>
    </div>
  );
};

/* ── Person Card ── */
const PersonCard = ({ person, index, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const voucher = getPerson(person.vouchedBy);
  return (
    <div onClick={onClick} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? COLORS.cardHover : COLORS.card,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 20, padding: 18, cursor: "pointer",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        animation: `fadeSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.06}s both`,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{
          width: 46, height: 46, borderRadius: 16, background: getGradient(person.category),
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: 1, flexShrink: 0,
        }}>{person.avatar}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
            <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: COLORS.text, fontFamily: "'Outfit', sans-serif" }}>
              {person.name}
            </h3>
            <span style={{
              fontSize: 9, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase",
              color: getCatColor(person.category), fontFamily: "'DM Mono', monospace",
            }}>{person.category}</span>
          </div>

          <p style={{
            margin: "0 0 8px", fontSize: 13, lineHeight: 1.5,
            color: "rgba(255,255,255,0.5)", fontStyle: "italic",
            fontFamily: "'Source Serif 4', serif",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>"{person.note}"</p>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{
                width: 18, height: 18, borderRadius: 6,
                background: `linear-gradient(135deg, ${COLORS.accent}, #7c5ce0)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 7, fontWeight: 700, color: "#fff",
              }}>{voucher?.avatar || "??"}</div>
              <span style={{ fontSize: 11, color: COLORS.textDim }}>
                {voucher?.name || "Unknown"} · {person.mutuals} mutual{person.mutuals !== 1 ? "s" : ""}
              </span>
            </div>
            <TrustMeter strength={person.strength} />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ───────────────────────── MAIN APP ───────────────────────── */
export default function Circle() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [showGraph, setShowGraph] = useState(false);
  const [showVouch, setShowVouch] = useState(false);
  const [people, setPeople] = useState(PEOPLE);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("feed");

  const filtered = people
    .filter(p => activeCategory === "all" || p.category === activeCategory)
    .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

  return (
    <div style={{ minHeight: "100vh", background: COLORS.bg, fontFamily: "'Outfit', sans-serif", maxWidth: 480, margin: "0 auto", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&family=DM+Mono:wght@400;500&display=swap');
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
        @keyframes breathe { 0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.12; } 50% { transform: translateX(-50%) scale(1.1); opacity: 0.18; } }
        @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { width: 0; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>

      {/* Ambient */}
      <div style={{ position: "fixed", top: -120, right: -120, width: 300, height: 300, background: `radial-gradient(circle, rgba(168,130,255,0.06) 0%, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -100, left: -100, width: 250, height: 250, background: `radial-gradient(circle, rgba(99,102,241,0.04) 0%, transparent 70%)`, pointerEvents: "none" }} />

      {showOnboarding && <Onboarding onComplete={() => setShowOnboarding(false)} />}
      {showGraph && <TrustGraph people={people} onClose={() => setShowGraph(false)} />}
      {selectedPerson && <PersonDetail person={selectedPerson} onClose={() => setSelectedPerson(null)} />}
      {showVouch && <VouchModal onClose={() => setShowVouch(false)} onSubmit={({ name, category, note }) => {
        const initials = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
        setPeople(prev => [{ id: Date.now(), name, avatar: initials, mutuals: Math.floor(Math.random() * 5) + 1, tags: [category], note, vouchedBy: 1, category, strength: 0.85 + Math.random() * 0.1, joinedWeeksAgo: 0 }, ...prev]);
      }} />}

      {/* Header */}
      <div style={{ padding: "20px 20px 0", animation: "fadeSlideIn 0.5s ease" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20, color: COLORS.accent, animation: "float 3s ease-in-out infinite" }}>✦</span>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: COLORS.text, letterSpacing: -0.5 }}>circle</h1>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={() => setShowGraph(true)} style={{
              padding: "8px 12px", borderRadius: 10, border: `1px solid ${COLORS.border}`,
              background: "rgba(255,255,255,0.02)", color: COLORS.textMuted,
              fontSize: 12, cursor: "pointer", fontFamily: "'DM Mono', monospace",
              transition: "all 0.2s", display: "flex", alignItems: "center", gap: 5,
            }}
              onMouseEnter={e => { e.target.style.borderColor = COLORS.borderActive; e.target.style.color = COLORS.accent; }}
              onMouseLeave={e => { e.target.style.borderColor = COLORS.border; e.target.style.color = COLORS.textMuted; }}
            >◉ Graph</button>
            <button onClick={() => setShowVouch(true)} style={{
              padding: "8px 14px", borderRadius: 10, border: `1px solid ${COLORS.borderActive}`,
              background: COLORS.accentSoft, color: COLORS.accent,
              fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "'Outfit', sans-serif",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => e.target.style.background = "rgba(168,130,255,0.15)"}
              onMouseLeave={e => e.target.style.background = COLORS.accentSoft}
            >+ Vouch</button>
          </div>
        </div>
        <p style={{ margin: "0 0 16px", fontSize: 13, color: COLORS.textDim, fontWeight: 300, fontFamily: "'Source Serif 4', serif", fontStyle: "italic" }}>
          people your people trust
        </p>

        {/* Tab switcher */}
        <div style={{ display: "flex", gap: 0, marginBottom: 14, background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: 3, border: `1px solid ${COLORS.border}` }}>
          {[{ key: "feed", label: "Feed" }, { key: "orbits", label: "Orbits" }].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              flex: 1, padding: "8px 0", borderRadius: 10, border: "none",
              background: activeTab === tab.key ? "rgba(168,130,255,0.12)" : "transparent",
              color: activeTab === tab.key ? COLORS.accent : COLORS.textMuted,
              fontSize: 12, fontWeight: 500, cursor: "pointer",
              fontFamily: "'Outfit', sans-serif", transition: "all 0.2s",
            }}>{tab.label}</button>
          ))}
        </div>

        {activeTab === "feed" && (
          <>
            {/* Search */}
            <div style={{ position: "relative", marginBottom: 12 }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: COLORS.textDim, fontSize: 14 }}>⌕</span>
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by name or tag..."
                style={{
                  width: "100%", padding: "10px 14px 10px 36px", borderRadius: 12,
                  border: `1px solid ${COLORS.border}`, background: "rgba(255,255,255,0.02)",
                  color: COLORS.text, fontSize: 13, outline: "none", fontFamily: "'Outfit', sans-serif",
                  transition: "border-color 0.2s", boxSizing: "border-box",
                }}
                onFocus={e => e.target.style.borderColor = COLORS.borderActive}
                onBlur={e => e.target.style.borderColor = COLORS.border}
              />
            </div>

            {/* Category pills */}
            <div style={{ display: "flex", gap: 6, marginBottom: 6, overflowX: "auto", paddingBottom: 2 }}>
              {CATEGORIES.map(cat => (
                <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
                  style={{
                    padding: "7px 14px", borderRadius: 10,
                    border: `1px solid ${activeCategory === cat.key ? COLORS.borderActive : COLORS.border}`,
                    background: activeCategory === cat.key ? COLORS.accentSoft : "transparent",
                    color: activeCategory === cat.key ? "#c4b5fd" : COLORS.textMuted,
                    fontSize: 12, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap",
                    fontFamily: "'Outfit', sans-serif", transition: "all 0.2s",
                    display: "flex", alignItems: "center", gap: 5,
                  }}
                ><span style={{ fontSize: 11 }}>{cat.icon}</span> {cat.label}</button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Stats bar */}
      <div style={{
        display: "flex", justifyContent: "space-around", padding: "14px 20px",
        margin: "8px 20px 0", borderRadius: 14, background: "rgba(255,255,255,0.02)",
        border: `1px solid ${COLORS.border}`,
        animation: "fadeSlideIn 0.5s ease 0.1s both",
      }}>
        {[
          { label: "in circle", value: people.length },
          { label: "connections", value: people.reduce((a, p) => a + p.mutuals, 0) },
          { label: "avg trust", value: `${Math.round(people.reduce((a, p) => a + p.strength, 0) / people.length * 100)}%` },
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: COLORS.text, fontFamily: "'DM Mono', monospace" }}>{stat.value}</div>
            <div style={{ fontSize: 9, color: COLORS.textDim, letterSpacing: 0.5, marginTop: 2, fontFamily: "'DM Mono', monospace" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: "12px 20px 100px" }}>
        {activeTab === "feed" ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: COLORS.textDim, fontSize: 14, fontFamily: "'Source Serif 4', serif", fontStyle: "italic" }}>
                No one here yet. Start vouching.
              </div>
            ) : filtered.map((person, i) => (
              <PersonCard key={person.id} person={person} index={i} onClick={() => setSelectedPerson(person)} />
            ))}
          </div>
        ) : (
          /* Orbits tab */
          <div style={{ animation: "fadeSlideIn 0.5s ease" }}>
            <p style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 16, lineHeight: 1.6, fontFamily: "'Source Serif 4', serif", fontStyle: "italic" }}>
              Orbits are AI-curated groups of people who could change your life — surfaced from vouches, mutuals, and shared context.
            </p>

            {[
              { name: "Creative collaborators", emoji: "◈", members: [PEOPLE[0], PEOPLE[6], PEOPLE[7]], reason: "All described as creative thinkers by 3+ vouchers" },
              { name: "Boston engineers", emoji: "⚡", members: [PEOPLE[1], PEOPLE[4]], reason: "Both in Boston, both vouched for engineering excellence" },
              { name: "People to meet IRL", emoji: "◐", members: [PEOPLE[2], PEOPLE[5], PEOPLE[3]], reason: "High trust scores + you share 3+ mutuals with each" },
            ].map((orbit, oi) => (
              <div key={oi} style={{
                marginBottom: 14, padding: 18, borderRadius: 18,
                background: "rgba(255,255,255,0.02)", border: `1px solid ${COLORS.border}`,
                animation: `fadeSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${oi * 0.1}s both`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 18, color: COLORS.accent }}>{orbit.emoji}</span>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 600, color: COLORS.text, fontFamily: "'Outfit', sans-serif" }}>{orbit.name}</h3>
                </div>
                <p style={{ margin: "0 0 12px", fontSize: 12, color: COLORS.textMuted, fontFamily: "'DM Mono', monospace" }}>{orbit.reason}</p>
                <div style={{ display: "flex", gap: -4 }}>
                  {orbit.members.map((m, mi) => (
                    <div key={mi} onClick={() => setSelectedPerson(m)} style={{
                      width: 36, height: 36, borderRadius: 12,
                      background: getGradient(m.category),
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700, color: "#fff",
                      border: `2px solid ${COLORS.bg}`, marginLeft: mi > 0 ? -8 : 0,
                      cursor: "pointer", transition: "transform 0.2s", position: "relative", zIndex: orbit.members.length - mi,
                    }}
                      onMouseEnter={e => e.target.style.transform = "translateY(-3px)"}
                      onMouseLeave={e => e.target.style.transform = "translateY(0)"}
                    >{m.avatar}</div>
                  ))}
                  <div style={{ marginLeft: 8, display: "flex", alignItems: "center", fontSize: 12, color: COLORS.textDim, fontFamily: "'DM Mono', monospace" }}>
                    {orbit.members.map(m => m.name.split(" ")[0]).join(", ")}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom nav */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480, padding: "12px 20px 16px",
        background: `linear-gradient(transparent, ${COLORS.bg} 30%)`,
        textAlign: "center", pointerEvents: "none",
      }}>
        <p style={{ margin: 0, fontSize: 9, color: "rgba(255,255,255,0.1)", fontFamily: "'DM Mono', monospace", letterSpacing: 2 }}>
          BUILT BY SANJANA POOJARY
        </p>
      </div>
    </div>
  );
}
