import { useState, useEffect, useRef } from "react";
// Circle - trust-based referral feed
const PEOPLE = [
  { id: 1, name: "Maya Chen", avatar: "MC", mutuals: 4, tags: ["designer", "NYC"], note: "Incredible eye for product. Built the onboarding flow at Figma that everyone talks about.", vouchedBy: "Alex Rivera", vouchedByAvatar: "AR", category: "hire", strength: 0.95 },
  { id: 2, name: "James Okafor", avatar: "JO", mutuals: 7, tags: ["eng", "Boston"], note: "Best backend engineer I've worked with. Shipped the real-time sync at Notion solo.", vouchedBy: "Priya Sharma", vouchedByAvatar: "PS", category: "hire", strength: 0.88 },
  { id: 3, name: "Sofia Reyes", avatar: "SR", mutuals: 3, tags: ["founder", "SF"], note: "Thoughtful, sharp, and deeply kind. Would trust her with anything.", vouchedBy: "Maya Chen", vouchedByAvatar: "MC", category: "date", strength: 0.92 },
  { id: 4, name: "Alex Rivera", avatar: "AR", mutuals: 5, tags: ["PM", "NYC"], note: "The kind of roommate who remembers your coffee order and fixes the wifi.", vouchedBy: "James Okafor", vouchedByAvatar: "JO", category: "roommate", strength: 0.90 },
  { id: 5, name: "Priya Sharma", avatar: "PS", mutuals: 6, tags: ["eng", "Boston"], note: "Brilliant systems thinker. Also the person everyone calls when they need real advice.", vouchedBy: "Sofia Reyes", vouchedByAvatar: "SR", category: "hire", strength: 0.87 },
  { id: 6, name: "Liam Park", avatar: "LP", mutuals: 2, tags: ["creative", "LA"], note: "Makes everyone around him better. Genuine, funny, zero ego.", vouchedBy: "Alex Rivera", vouchedByAvatar: "AR", category: "date", strength: 0.93 },
];

const CATEGORIES = [
  { key: "all", label: "Everyone", icon: "✦" },
  { key: "hire", label: "Hire", icon: "⚡" },
  { key: "date", label: "Date", icon: "♡" },
  { key: "roommate", label: "Live with", icon: "⌂" },
];

const TrustMeter = ({ strength }) => {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setAnimated(strength), 300);
    return () => clearTimeout(t);
  }, [strength]);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ width: 80, height: 4, borderRadius: 2, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
        <div style={{
          height: "100%", borderRadius: 2,
          width: `${animated * 100}%`,
          background: animated > 0.9 ? "#4ade80" : animated > 0.85 ? "#facc15" : "#f87171",
          transition: "width 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        }} />
      </div>
      <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontFamily: "'JetBrains Mono', monospace", letterSpacing: 0.5 }}>
        {Math.round(animated * 100)}%
      </span>
    </div>
  );
};

const VouchBadge = ({ name, avatar }) => (
  <div style={{
    display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px 4px 4px",
    borderRadius: 20, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
  }}>
    <div style={{
      width: 20, height: 20, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 8, fontWeight: 700, color: "#fff", letterSpacing: 0.5,
    }}>{avatar}</div>
    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>vouched by <span style={{ color: "rgba(255,255,255,0.75)" }}>{name}</span></span>
  </div>
);

const PersonCard = ({ person, index, onClick, isExpanded }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
        border: `1px solid ${isExpanded ? "rgba(139, 92, 246, 0.3)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 20, padding: 20, cursor: "pointer",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
        animation: `fadeSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index * 0.08}s both`,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 16,
          background: `linear-gradient(135deg, ${person.category === "hire" ? "#686bf1, #3b82f6" : person.category === "date" ? "#ec4899, #f43f5e" : "#14b8a6, #06b6d4"})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: 1,
          flexShrink: 0,
        }}>
          {person.avatar}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#fff", fontFamily: "'Outfit', sans-serif" }}>
              {person.name}
            </h3>
            <span style={{
              fontSize: 10, fontWeight: 600, letterSpacing: 1.5, textTransform: "uppercase",
              color: person.category === "hire" ? "#818cf8" : person.category === "date" ? "#f472b6" : "#2dd4bf",
              fontFamily: "'JetBrains Mono', monospace",
            }}>
              {person.category}
            </span>
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 8, flexWrap: "wrap" }}>
            {person.tags.map(t => (
              <span key={t} style={{
                fontSize: 11, padding: "2px 8px", borderRadius: 6,
                background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.4)",
                fontFamily: "'JetBrains Mono', monospace",
              }}>{t}</span>
            ))}
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
              · {person.mutuals} mutual{person.mutuals !== 1 ? "s" : ""}
            </span>
          </div>
          <TrustMeter strength={person.strength} />
        </div>
      </div>

      {isExpanded && (
        <div style={{
          marginTop: 16, paddingTop: 16,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          animation: "fadeIn 0.3s ease",
        }}>
          <p style={{
            margin: "0 0 12px", fontSize: 14, lineHeight: 1.6,
            color: "rgba(255,255,255,0.65)", fontStyle: "italic",
            fontFamily: "'Newsreader', serif",
          }}>
            "{person.note}"
          </p>
          <VouchBadge name={person.vouchedBy} avatar={person.vouchedByAvatar} />
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button style={{
              flex: 1, padding: "10px 0", borderRadius: 12, border: "none",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer",
              fontFamily: "'Outfit', sans-serif", letterSpacing: 0.3,
              transition: "opacity 0.2s",
            }}
              onMouseEnter={e => e.target.style.opacity = 0.85}
              onMouseLeave={e => e.target.style.opacity = 1}
            >
              Request intro
            </button>
            <button style={{
              padding: "10px 16px", borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.1)", background: "transparent",
              color: "rgba(255,255,255,0.5)", fontSize: 13, cursor: "pointer",
              fontFamily: "'Outfit', sans-serif",
              transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.target.style.borderColor = "rgba(255,255,255,0.2)"; e.target.style.color = "rgba(255,255,255,0.7)"; }}
              onMouseLeave={e => { e.target.style.borderColor = "rgba(255,255,255,0.1)"; e.target.style.color = "rgba(255,255,255,0.5)"; }}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const VouchModal = ({ onClose, onSubmit }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("hire");
  const [note, setNote] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (name && note) { setSubmitted(true); setTimeout(() => { onSubmit({ name, category, note }); onClose(); }, 1500); }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.7)", backdropFilter: "blur(20px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      animation: "fadeIn 0.3s ease", padding: 20,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#111114", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 24, padding: 28, width: "100%", maxWidth: 400,
        animation: "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}>
        {submitted ? (
          <div style={{ textAlign: "center", padding: "30px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>✦</div>
            <h3 style={{ color: "#fff", fontFamily: "'Outfit', sans-serif", fontSize: 20, marginBottom: 6 }}>Vouch sent</h3>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>Your trust means everything.</p>
          </div>
        ) : (
          <>
            <h3 style={{ margin: "0 0 4px", color: "#fff", fontFamily: "'Outfit', sans-serif", fontSize: 20 }}>Vouch for someone</h3>
            <p style={{ margin: "0 0 20px", color: "rgba(255,255,255,0.4)", fontSize: 13 }}>Your reputation backs this. Make it count.</p>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 6, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>Who</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Their name" style={{
                width: "100%", padding: "10px 14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.03)", color: "#fff", fontSize: 14, outline: "none",
                fontFamily: "'Outfit', sans-serif", boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
                onFocus={e => e.target.style.borderColor = "rgba(139,92,246,0.4)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 6, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>For what</label>
              <div style={{ display: "flex", gap: 6 }}>
                {["hire", "date", "roommate"].map(c => (
                  <button key={c} onClick={() => setCategory(c)} style={{
                    flex: 1, padding: "8px 0", borderRadius: 10, border: `1px solid ${category === c ? "rgba(139,92,246,0.4)" : "rgba(255,255,255,0.08)"}`,
                    background: category === c ? "rgba(139,92,246,0.12)" : "transparent",
                    color: category === c ? "#a78bfa" : "rgba(255,255,255,0.4)",
                    fontSize: 12, fontWeight: 500, cursor: "pointer", textTransform: "capitalize",
                    fontFamily: "'Outfit', sans-serif", transition: "all 0.2s",
                  }}>{c}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 11, color: "rgba(255,255,255,0.35)", marginBottom: 6, letterSpacing: 1, textTransform: "uppercase", fontFamily: "'JetBrains Mono', monospace" }}>Your vouch</label>
              <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Why do you trust this person?" rows={3} style={{
                width: "100%", padding: "10px 14px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.03)", color: "#fff", fontSize: 14, outline: "none",
                fontFamily: "'Newsreader', serif", resize: "none", boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
                onFocus={e => e.target.style.borderColor = "rgba(139,92,246,0.4)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>
            <button onClick={handleSubmit} style={{
              width: "100%", padding: "12px 0", borderRadius: 14, border: "none",
              background: name && note ? "linear-gradient(135deg, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.05)",
              color: name && note ? "#fff" : "rgba(255,255,255,0.2)",
              fontSize: 14, fontWeight: 600, cursor: name && note ? "pointer" : "default",
              fontFamily: "'Outfit', sans-serif", letterSpacing: 0.3,
              transition: "all 0.3s",
            }}>
              Put your name on it
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default function Circle() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [showVouch, setShowVouch] = useState(false);
  const [people, setPeople] = useState(PEOPLE);
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = people
    .filter(p => activeCategory === "all" || p.category === activeCategory)
    .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));

  return (
    <div style={{
      minHeight: "100vh", background: "#09090b",
      fontFamily: "'Outfit', sans-serif",
      maxWidth: 480, margin: "0 auto",
      position: "relative",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Newsreader:ital,wght@0,400;1,400&family=JetBrains+Mono:wght@400;500;700&display=swap');
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        * { box-sizing: border-box; -webkit-font-smoothing: antialiased; }
        ::-webkit-scrollbar { width: 0; }
        input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>

      {/* Ambient glow */}
      <div style={{
        position: "fixed", top: -100, right: -100, width: 300, height: 300,
        background: "radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* Header */}
      <div style={{ padding: "20px 20px 0", animation: "fadeSlideIn 0.5s ease" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{
              fontSize: 20, color: "#8b5cf6",
              animation: "float 3s ease-in-out infinite",
            }}>✦</span>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, color: "#fff", letterSpacing: -0.5 }}>
              circle
            </h1>
          </div>
          <button onClick={() => setShowVouch(true)} style={{
            padding: "8px 16px", borderRadius: 12, border: "1px solid rgba(139,92,246,0.3)",
            background: "rgba(139,92,246,0.08)", color: "#a78bfa",
            fontSize: 12, fontWeight: 600, cursor: "pointer",
            fontFamily: "'Outfit', sans-serif", letterSpacing: 0.3,
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.target.style.background = "rgba(139,92,246,0.15)"; }}
            onMouseLeave={e => { e.target.style.background = "rgba(139,92,246,0.08)"; }}
          >
            + Vouch
          </button>
        </div>
        <p style={{ margin: "0 0 16px", fontSize: 13, color: "rgba(255,255,255,0.3)", fontWeight: 300 }}>
          People your people trust
        </p>

        {/* Search */}
        <div style={{ position: "relative", marginBottom: 14 }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.2)", fontSize: 14 }}>⌕</span>
          <input
            value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name or tag..."
            style={{
              width: "100%", padding: "10px 14px 10px 36px", borderRadius: 14,
              border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.03)",
              color: "#fff", fontSize: 13, outline: "none", fontFamily: "'Outfit', sans-serif",
              transition: "border-color 0.2s",
            }}
            onFocus={e => e.target.style.borderColor = "rgba(139,92,246,0.3)"}
            onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.06)"}
          />
        </div>

        {/* Category pills */}
        <div style={{ display: "flex", gap: 6, marginBottom: 6, overflowX: "auto", paddingBottom: 2 }}>
          {CATEGORIES.map(cat => (
            <button key={cat.key} onClick={() => { setActiveCategory(cat.key); setExpandedId(null); }}
              style={{
                padding: "7px 14px", borderRadius: 10, border: "1px solid",
                borderColor: activeCategory === cat.key ? "rgba(139,92,246,0.3)" : "rgba(255,255,255,0.06)",
                background: activeCategory === cat.key ? "rgba(139,92,246,0.1)" : "transparent",
                color: activeCategory === cat.key ? "#c4b5fd" : "rgba(255,255,255,0.35)",
                fontSize: 12, fontWeight: 500, cursor: "pointer", whiteSpace: "nowrap",
                fontFamily: "'Outfit', sans-serif", transition: "all 0.2s",
                display: "flex", alignItems: "center", gap: 5,
              }}
            >
              <span style={{ fontSize: 11 }}>{cat.icon}</span> {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Network stats bar */}
      <div style={{
        display: "flex", justifyContent: "space-around", padding: "14px 20px",
        margin: "0 20px", borderRadius: 14, background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.04)",
        animation: "fadeSlideIn 0.5s ease 0.1s both",
      }}>
        {[
          { label: "in your circle", value: people.length },
          { label: "mutual connections", value: people.reduce((a, p) => a + p.mutuals, 0) },
          { label: "avg trust", value: `${Math.round(people.reduce((a, p) => a + p.strength, 0) / people.length * 100)}%` },
        ].map((stat, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#fff", fontFamily: "'JetBrains Mono', monospace" }}>{stat.value}</div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: 0.5, marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* People list */}
      <div style={{ padding: "14px 20px 100px", display: "flex", flexDirection: "column", gap: 10 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.2)", fontSize: 14 }}>
            No one here yet. Start vouching.
          </div>
        ) : filtered.map((person, i) => (
          <PersonCard
            key={person.id} person={person} index={i}
            isExpanded={expandedId === person.id}
            onClick={() => setExpandedId(expandedId === person.id ? null : person.id)}
          />
        ))}
      </div>

      {/* Bottom attribution */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 480,
        padding: "20px 0 16px",
        background: "linear-gradient(transparent, #09090b 40%)",
        textAlign: "center", pointerEvents: "none",
      }}>
        <p style={{
          margin: 0, fontSize: 10, color: "rgba(255,255,255,0.15)",
          fontFamily: "'JetBrains Mono', monospace", letterSpacing: 1.5,
        }}>
          BUILT BY SANJANA POOJARY
        </p>
      </div>

      {showVouch && (
        <VouchModal
          onClose={() => setShowVouch(false)}
          onSubmit={({ name, category, note }) => {
            const initials = name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
            setPeople(prev => [{
              id: Date.now(), name, avatar: initials, mutuals: Math.floor(Math.random() * 5) + 1,
              tags: [category], note, vouchedBy: "You", vouchedByAvatar: "YO",
              category, strength: 0.85 + Math.random() * 0.1,
            }, ...prev]);
          }}
        />
      )}
    </div>
  );
}
