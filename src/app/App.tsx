import { useState, useEffect, useRef, useCallback } from "react";
const musicSrc = new URL("public/musics/Ariana Grande - hate that i made you love me (official lyric video) [v1t4MTqdfyI].mp3", import.meta.url).href;
// ═══════════════════════════════════════════════════════════════════════════════
//  CUSTOMIZATION — edit everything in this block
// ═══════════════════════════════════════════════════════════════════════════════
const PARTNER_NAME = "Yangka";
const MY_NAME = "KT";
const MAIN_QUESTION = "Will you be my FOREVER?";

// Replace src values with your own image paths or URLs.
// Place images in /public/ folder, then use "/photo1.jpg" etc.
const PHOTOS = [
  { src: "public/images/her6.jpeg", caption: "One of my favorite moments, Her, the Kurta, & absolute magic✨" },
  { src: "public/images/her2.jpeg", caption: "This smile means everything🥹" },
  { src: "public/images/her3.jpeg", caption: "A memory I love - Chekpost dinner hit different😌" },
  { src: "public/images/her4.jpeg", caption: "More memories coming soon - The Beach and Volleyball!!" },
  { src: "public/images/her5.jpeg", caption: "A day I'll never forget ...KTtttt!! I love you😭" },
  { src: "public/images/her7.jpeg", caption: "You and me, ALWAYS💫🍀" },
];

const REASONS = [
  { emoji: "🌸", title: "You make ordinary days feel special", detail: "Every moment with you turns into a beautiful memory I want to keep forever." },
  { emoji: "😊", title: "Your smile is my favorite thing", detail: "It lights up every room and my whole world at the same time." },
  { emoji: "💫", title: "Your Support means everything", detail: "No one else makes me feel motivated the way you do." },
  { emoji: "✨", title: "You are kind, beautiful, and unforgettable", detail: "Inside and out, you are simply the most wonderful person." },
  { emoji: "☀️", title: "Talking to you always makes my day better", detail: "Your words are sunshine for my soul — always warm." },
  { emoji: "🍀", title: "I feel lucky to have you in my life", detail: "Of all the people in this world, I found you — and I'm grateful every day." },
];

const LOVE_MESSAGES_GAME = [
  "You are loved ❤️",
  "You are special ✨",
  "You are my favorite person 🥰",
  "You make me smile 😊",
  "You are my sunshine 🌸",
  "You are wonderful 💕",
  "My heart is yours 💗",
];

const LOVE_LETTER_TEXT = `From the moment you came into my life,
you made everything feel brighter.

I may not always say it perfectly,
but I hope this little website shows
how special you are to me.

So today, I just wanted to ask you
in a cute way…

Will you be my FOREVER? 💕`;

const FINAL_ROMANTIC_MESSAGE = `I knew you would say yes ❤️

Thank you for making my heart so happy.
This is only the beginning of more
beautiful memories together.`;

const NO_MESSAGES = [
  "Are you sure? 🥺",
  "Please think again 😭",
  "Don't break my heart 💔",
  "I'll give you chocolate 🍫",
  "What if I ask nicely? 🥹",
  "You're making my heart sad 😢",
  "Last chance… maybe?",
  "The Yes button is waiting for you 😌",
  "No is getting tired now…",
  "Okay, now you have only one real choice ❤️",
];
// ═══════════════════════════════════════════════════════════════════════════════

type Page = "opening" | "question" | "celebration" | "gallery" | "reasons" | "game" | "letter" | "finale";

const HEART_COLORS = ["#ff4081", "#e91e63", "#ff80ab", "#f48fb1", "#ff1744", "#ff6d9d", "#fce4ec"];
const CONFETTI_COLORS = ["#ff4081", "#e91e63", "#ff80ab", "#ffb3c6", "#ff1744", "#fff", "#ffd700", "#c62828"];

interface FloatHeart { id: number; x: number; size: number; dur: number; delay: number; opacity: number; color: string }
interface ConfettiPiece { id: number; x: number; color: string; size: number; dur: number; delay: number; rot: number; shape: "circle" | "rect" | "heart" }
interface GameHeart { id: number; x: number; y: number; msg: string; popped: boolean }

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const GLOBAL_CSS = `
  @keyframes floatUp {
    0%   { transform: translateY(0) scale(1); opacity: 1; }
    80%  { opacity: 0.6; }
    100% { transform: translateY(-115vh) scale(0.6); opacity: 0; }
  }
  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    14%       { transform: scale(1.2); }
    28%       { transform: scale(1); }
    42%       { transform: scale(1.1); }
  }
  @keyframes confettiFall {
    0%   { transform: translateY(-30px) rotate(0deg) scale(1); opacity: 1; }
    100% { transform: translateY(110vh) rotate(540deg) scale(0.5); opacity: 0.1; }
  }
  @keyframes fadeSlideUp {
    0%   { opacity: 0; transform: translateY(28px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes pop {
    0%   { opacity: 0; transform: scale(0.7); }
    70%  { transform: scale(1.05); }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-6px) rotate(-3deg); }
    40%       { transform: translateX(6px) rotate(3deg); }
    60%       { transform: translateX(-4px); }
    80%       { transform: translateX(4px); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes envelopeBounce {
    0%, 100% { transform: translateY(0) rotate(-2deg); }
    50%       { transform: translateY(-18px) rotate(2deg); }
  }
  @keyframes sparkle {
    0%, 100% { opacity: 0; transform: scale(0); }
    50%       { opacity: 1; transform: scale(1); }
  }
  @keyframes slideInUp {
    0%   { opacity: 0; transform: translateY(40px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  @keyframes flipCard {
    0%   { transform: rotateY(0deg); }
    100% { transform: rotateY(180deg); }
  }
  @keyframes gamePop {
    0%   { transform: scale(0) rotate(-15deg); opacity: 0; }
    60%  { transform: scale(1.3) rotate(5deg); opacity: 1; }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }
  @keyframes msgBubble {
    0%   { opacity: 0; transform: scale(0.5) translateY(10px); }
    60%  { transform: scale(1.1) translateY(-4px); opacity: 1; }
    100% { transform: scale(1) translateY(0); opacity: 1; }
  }
  @keyframes pageTransition {
    0%   { opacity: 0; transform: scale(0.97) translateY(16px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes firework {
    0%   { transform: scale(0); opacity: 1; }
    100% { transform: scale(3); opacity: 0; }
  }
  @keyframes badgePop {
    0%   { transform: scale(0) rotate(-10deg); opacity: 0; }
    60%  { transform: scale(1.15) rotate(3deg); }
    100% { transform: scale(1) rotate(0deg); opacity: 1; }
  }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: 'Nunito', sans-serif; }
  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: #fce4ec; }
  ::-webkit-scrollbar-thumb { background: #f48fb1; border-radius: 99px; }
  .flip-card { perspective: 900px; cursor: pointer; }
  .flip-card-inner { transition: transform 0.55s cubic-bezier(.4,0,.2,1); transform-style: preserve-3d; position: relative; }
  .flip-card.flipped .flip-card-inner { transform: rotateY(180deg); }
  .flip-card-front, .flip-card-back { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
  .flip-card-back { transform: rotateY(180deg); }
`;

// ─── SHARED: FLOATING HEARTS ──────────────────────────────────────────────────
function FloatingBg({ count = 14 }: { count?: number }) {
  const hearts = useRef<FloatHeart[]>([]);
  const [, forceRender] = useState(0);
  useEffect(() => {
    hearts.current = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 12 + Math.random() * 30,
      dur: 5 + Math.random() * 7,
      delay: Math.random() * 5,
      opacity: 0.2 + Math.random() * 0.45,
      color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
    }));
    forceRender(n => n + 1);
  }, [count]);
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
      {hearts.current.map(h => (
        <span key={h.id} style={{
          position: "absolute", left: `${h.x}%`, bottom: "-50px",
          fontSize: `${h.size}px`, color: h.color, opacity: h.opacity,
          animation: `floatUp ${h.dur}s ease-in ${h.delay}s infinite`,
        }}>♥</span>
      ))}
    </div>
  );
}

// ─── SHARED: CONFETTI ─────────────────────────────────────────────────────────
function Confetti({ active }: { active: boolean }) {
  const pieces = useRef<ConfettiPiece[]>([]);
  const [, fr] = useState(0);
  useEffect(() => {
    if (!active) return;
    const shapes: ConfettiPiece["shape"][] = ["circle", "rect", "heart"];
    pieces.current = Array.from({ length: 90 }, (_, i) => ({
      id: i, x: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 5 + Math.random() * 11, dur: 2.5 + Math.random() * 3,
      delay: Math.random() * 2.5, rot: Math.random() * 720 - 360,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    }));
    fr(n => n + 1);
  }, [active]);
  if (!active) return null;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 100 }}>
      {pieces.current.map(p => (
        <span key={p.id} style={{
          position: "absolute", left: `${p.x}%`, top: "-20px",
          width: p.shape === "rect" ? `${p.size * 0.5}px` : `${p.size}px`,
          height: p.shape === "rect" ? `${p.size * 1.5}px` : `${p.size}px`,
          background: p.shape !== "heart" ? p.color : "transparent",
          color: p.color, fontSize: p.shape === "heart" ? `${p.size + 4}px` : undefined,
          borderRadius: p.shape === "circle" ? "50%" : p.shape === "rect" ? "2px" : undefined,
          animation: `confettiFall ${p.dur}s ease-in ${p.delay}s forwards`,
        }}>{p.shape === "heart" ? "♥" : ""}</span>
      ))}
    </div>
  );
}

// ─── SHARED: CARD WRAPPER ─────────────────────────────────────────────────────
function Card({ children, style, className }: { children: React.ReactNode; style?: React.CSSProperties; className?: string }) {
  return (
    <div className={className} style={{
      background: "rgba(255,255,255,0.88)",
      backdropFilter: "blur(14px)",
      borderRadius: "28px",
      boxShadow: "0 8px 40px rgba(233,30,99,0.14), 0 2px 10px rgba(233,30,99,0.08)",
      border: "1.5px solid rgba(233,30,99,0.12)",
      ...style,
    }}>{children}</div>
  );
}

// ─── SHARED: SECTION HEADING ──────────────────────────────────────────────────
function SHeading({ children }: { children: React.ReactNode }) {
  return <h2 style={{ fontFamily: "'Pacifico', cursive", color: "#c2185b", fontSize: "clamp(1.4rem,5vw,2rem)", textAlign: "center", margin: 0 }}>{children}</h2>;
}

// ─── SHARED: PRIMARY BUTTON ───────────────────────────────────────────────────
function PrimaryBtn({ children, onClick, style }: { children: React.ReactNode; onClick?: () => void; style?: React.CSSProperties }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} style={{
      fontFamily: "'Nunito', sans-serif", fontWeight: 800,
      fontSize: "clamp(1rem,3vw,1.15rem)",
      padding: "0.75em 2em",
      background: hov ? "linear-gradient(135deg,#c2185b,#e91e63)" : "linear-gradient(135deg,#e91e63,#ff4081)",
      color: "#fff", border: "none", borderRadius: "999px", cursor: "pointer",
      boxShadow: hov ? "0 6px 28px rgba(233,30,99,0.5)" : "0 4px 20px rgba(233,30,99,0.35)",
      transform: hov ? "scale(1.04)" : "scale(1)",
      transition: "all 0.18s ease",
      ...style,
    }}>{children}</button>
  );
}

// ─── MUSIC BUTTON ─────────────────────────────────────────────────────────────
function MusicBtn() {
  const [muted, setMuted] = useState(true);
  // To add music: set the src attribute on the audio element below.
  // Example: <audio src="/your-song.mp3" loop ref={audioRef} />
  const audioRef = useRef<HTMLAudioElement>(null);
  const toggle = () => {
    setMuted(m => {
      if (audioRef.current) {
        if (m) { audioRef.current.play().catch(() => {}); }
        else { audioRef.current.pause(); }
      }
      return !m;
    });
  };
  return (
    <>
      <audio ref={audioRef} loop preload="auto" src={musicSrc} />
      <button onClick={toggle} title={muted ? "Play music" : "Mute music"} style={{
        position: "fixed", top: "16px", right: "16px", zIndex: 999,
        background: "rgba(255,255,255,0.82)", backdropFilter: "blur(10px)",
        border: "1.5px solid rgba(233,30,99,0.2)", borderRadius: "50%",
        width: "44px", height: "44px", fontSize: "1.2rem", cursor: "pointer",
        boxShadow: "0 2px 12px rgba(233,30,99,0.2)", display: "flex", alignItems: "center", justifyContent: "center",
      }}>{muted ? "🔇" : "🎵"}</button>
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  SCREEN 1 — OPENING
// ─────────────────────────────────────────────────────────────────────────────
function OpeningScreen({ next }: { next: () => void }) {
  return (
    <div style={{
      minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "2rem",
      background: "linear-gradient(160deg,#fff0f3 0%,#fce4ec 55%,#fff9fb 100%)",
      animation: "pageTransition 0.6s ease both",
    }}>
      <FloatingBg count={16} />
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: "clamp(5rem,18vw,8rem)", animation: "envelopeBounce 2.5s ease-in-out infinite", lineHeight: 1 }}>💌</div>

        {/* Sparkles */}
        {["✨", "💫", "⭐", "✨"].map((s, i) => (
          <span key={i} style={{
            position: "absolute",
            top: `${[10, 20, -10, 30][i]}%`, left: `${[-30, 60, 80, -20][i]}%`,
            fontSize: `${1 + i * 0.3}rem`,
            animation: `sparkle ${1.5 + i * 0.5}s ease-in-out ${i * 0.3}s infinite`,
          }}>{s}</span>
        ))}

        <Card style={{ padding: "2rem 2.5rem", maxWidth: "420px" }}>
          <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, color: "#ad5870", fontSize: "clamp(1rem,3vw,1.1rem)", margin: "0 0 1.5rem", lineHeight: 1.6 }}>
            My Dear <span style={{ color: "#e91e63", fontWeight: 900 }}>{PARTNER_NAME}</span>,<br />
            I made something special for you…
          </p>
          <PrimaryBtn onClick={next}>Open it ❤️</PrimaryBtn>
        </Card>

        <p style={{ fontFamily: "'Nunito', sans-serif", color: "#f48fb1", fontSize: "0.8rem", opacity: 0.7 }}>
          tap to begin your journey 💕
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  SCREEN 2 — QUESTION
// ─────────────────────────────────────────────────────────────────────────────
function QuestionScreen({ next }: { next: () => void }) {
  const [noCount, setNoCount] = useState(0);
  const [noPos, setNoPos] = useState({ x: 0, y: 0, fixed: false });
  const [shaking, setShaking] = useState(false);
  const [burstKey, setBurstKey] = useState(0);
  const burstHearts = useRef<FloatHeart[]>([]);

  const message = noCount === 0 ? MAIN_QUESTION + " ❤️" : NO_MESSAGES[Math.min(noCount - 1, NO_MESSAGES.length - 1)];
  const yesSize = Math.min(1.1 + noCount * 0.38, 4.5);
  const noSize = Math.max(1.05 - noCount * 0.09, 0.3);
  const noOpacity = Math.max(1 - noCount * 0.09, 0.2);

  const handleNo = useCallback(() => {
    const c = noCount + 1;
    setNoCount(c);
    setShaking(true);
    setTimeout(() => setShaking(false), 500);

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    setNoPos({ x: 30 + Math.random() * (vw - 200), y: 40 + Math.random() * (vh - 100), fixed: true });

    burstHearts.current = Array.from({ length: 6 }, (_, i) => ({
      id: Date.now() + i, x: 20 + Math.random() * 60,
      size: 10 + Math.random() * 18, dur: 2 + Math.random() * 2,
      delay: Math.random() * 0.3, opacity: 0.8 + Math.random() * 0.2,
      color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
    }));
    setBurstKey(k => k + 1);
  }, [noCount]);

  return (
    <div style={{
      minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "2rem",
      background: "linear-gradient(160deg,#fff0f3 0%,#fce4ec 55%,#fff9fb 100%)",
      animation: "pageTransition 0.6s ease both",
    }}>
      <FloatingBg count={14} />

      {/* Burst hearts */}
      <div key={burstKey} style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        {burstHearts.current.map(h => (
          <span key={h.id} style={{
            position: "absolute", left: `${h.x}%`, bottom: "-40px",
            fontSize: `${h.size}px`, color: h.color, opacity: h.opacity,
            animation: `floatUp ${h.dur}s ease-in ${h.delay}s both`,
          }}>♥</span>
        ))}
      </div>

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem", width: "100%", maxWidth: "520px" }}>
        {/* Pulsing heart */}
        <div style={{ fontSize: "clamp(3.5rem,12vw,5.5rem)", animation: "heartbeat 1.1s ease-in-out infinite", lineHeight: 1 }}>❤️</div>

        {/* Card */}
        <Card style={{ padding: "2.5rem 2rem", width: "100%", textAlign: "center" }}>
          {/* Sad emoji reaction on No */}
          {noCount > 0 && (
            <div key={`emoji-${noCount}`} style={{ fontSize: "2.5rem", animation: "pop 0.35s ease both", marginBottom: "0.5rem" }}>
              {["🥺", "😭", "💔", "🍫", "🥹", "😢", "😬", "😌", "😩", "❤️"][Math.min(noCount - 1, 9)]}
            </div>
          )}

          <p key={message} style={{
            fontFamily: "'Pacifico', cursive", color: "#c2185b",
            fontSize: noCount === 0 ? "clamp(1.4rem,5vw,2rem)" : "clamp(1.1rem,4vw,1.5rem)",
            lineHeight: 1.3, margin: "0 0 2rem",
            animation: "msgBubble 0.4s cubic-bezier(.34,1.56,.64,1) both",
          }}>{message}</p>

          {/* YES */}
          <button onClick={next} style={{
            fontFamily: "'Nunito', sans-serif", fontWeight: 900,
            fontSize: `${yesSize}rem`,
            padding: "0.45em 1.1em",
            background: "linear-gradient(135deg,#e91e63,#ff4081)",
            color: "#fff", border: "none", borderRadius: "999px", cursor: "pointer",
            boxShadow: `0 ${4 + noCount}px ${20 + noCount * 4}px rgba(233,30,99,${0.35 + noCount * 0.04})`,
            transition: "font-size 0.35s cubic-bezier(.34,1.56,.64,1), padding 0.35s, box-shadow 0.35s",
            animation: noCount > 0 ? "pop 0.35s cubic-bezier(.34,1.56,.64,1) both" : undefined,
            display: "block", margin: "0 auto",
          }}>Yes 💖</button>

          {noCount === 0 && (
            <p style={{ fontFamily: "'Nunito', sans-serif", color: "#ad5870", fontSize: "0.85rem", marginTop: "1.5rem" }}>
              Choose wisely 😉
            </p>
          )}
        </Card>

        {/* NO — fixed after first click */}
        {noSize > 0.2 && (
          <button onClick={handleNo} style={!noPos.fixed ? {
            fontFamily: "'Nunito', sans-serif", fontWeight: 700,
            fontSize: `${noSize}rem`, padding: "0.5em 1.3em",
            background: "#fce4ec", color: "#c2185b",
            border: "1.5px solid #f48fb1", borderRadius: "999px", cursor: "pointer",
            transition: "font-size 0.3s",
          } : {
            fontFamily: "'Nunito', sans-serif", fontWeight: 700,
            fontSize: `${noSize}rem`, padding: "0.4em 1em",
            background: "#fce4ec", color: "#c2185b",
            border: "1.5px solid #f48fb1", borderRadius: "999px",
            cursor: noSize < 0.5 ? "default" : "pointer",
            position: "fixed", left: `${noPos.x}px`, top: `${noPos.y}px`,
            zIndex: 300, opacity: noOpacity,
            pointerEvents: noSize < 0.4 ? "none" : "auto",
            transition: "left 0.28s cubic-bezier(.34,1.56,.64,1), top 0.28s cubic-bezier(.34,1.56,.64,1), font-size 0.35s",
            animation: shaking ? "shake 0.5s ease both" : undefined,
          }}>No</button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  SCREEN 3 — CELEBRATION
// ─────────────────────────────────────────────────────────────────────────────
function CelebrationScreen({ next }: { next: () => void }) {
  const [showBtn, setShowBtn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShowBtn(true), 1800); return () => clearTimeout(t); }, []);

  return (
    <div style={{
      minHeight: "100svh", display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", padding: "2rem", textAlign: "center",
      background: "linear-gradient(160deg,#fff0f3 0%,#fce4ec 55%,#fff9fb 100%)",
      animation: "pageTransition 0.6s ease both",
    }}>
      <FloatingBg count={22} />
      <Confetti active />

      {/* Firework rings */}
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          position: "fixed", left: `${20 + i * 30}%`, top: `${15 + i * 20}%`,
          width: "80px", height: "80px", borderRadius: "50%",
          border: `3px solid ${HEART_COLORS[i]}`,
          animation: `firework 1.2s ease-out ${i * 0.4}s both`,
          pointerEvents: "none", zIndex: 0,
        }} />
      ))}

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", maxWidth: "500px" }}>
        <div style={{ fontSize: "clamp(4rem,14vw,6.5rem)", animation: "heartbeat 0.8s ease-in-out infinite", lineHeight: 1 }}>🎉❤️🎉</div>

        <h1 style={{
          fontFamily: "'Pacifico', cursive", color: "#c2185b",
          fontSize: "clamp(1.8rem,7vw,3rem)", lineHeight: 1.2, margin: 0,
          animation: "slideInUp 0.7s ease both",
        }}>Yayyy! You said YES! ❤️</h1>

        <p style={{
          fontFamily: "'Nunito', sans-serif", fontWeight: 700, color: "#ad5870",
          fontSize: "clamp(1rem,3vw,1.2rem)", margin: 0,
          animation: "slideInUp 0.7s 0.2s ease both", opacity: 0, animationFillMode: "forwards",
        }}>Now you are officially my Valentine! 💕</p>

        <div style={{ fontSize: "3.5rem", animation: "heartbeat 1s 0.5s ease-in-out infinite" }}>💗</div>

        {showBtn && (
          <div style={{ animation: "pop 0.5s cubic-bezier(.34,1.56,.64,1) both" }}>
            <PrimaryBtn onClick={next}>Continue our little journey 💕</PrimaryBtn>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  SCREEN 4 — GALLERY
// ─────────────────────────────────────────────────────────────────────────────
function GalleryScreen({ next }: { next: () => void }) {
  return (
    <div style={{
      minHeight: "100svh", padding: "3rem 1.5rem 4rem",
      background: "linear-gradient(160deg,#fff0f3 0%,#fce4ec 55%,#fff9fb 100%)",
      animation: "pageTransition 0.6s ease both",
    }}>
      <FloatingBg count={10} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: "860px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem", alignItems: "center" }}>
        <div style={{ textAlign: "center", animation: "fadeSlideUp 0.6s ease both" }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>📸</div>
          <SHeading>Our Memories 💕</SHeading>
          <p style={{ fontFamily: "'Nunito', sans-serif", color: "#ad5870", marginTop: "0.5rem", fontSize: "0.9rem" }}>
            Every picture tells a piece of our story
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "16px", width: "100%",
        }}>
          {PHOTOS.map((p, i) => (
            <PhotoCard key={i} photo={p} delay={i * 0.08} />
          ))}
        </div>

        <PrimaryBtn onClick={next} style={{ marginTop: "0.5rem" }}>Next surprise 💗</PrimaryBtn>
      </div>
    </div>
  );
}

function PhotoCard({ photo, delay }: { photo: { src: string; caption: string }; delay: number }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        borderRadius: "20px", overflow: "hidden", background: "#fce4ec",
        boxShadow: hov ? "0 10px 32px rgba(233,30,99,0.25)" : "0 4px 16px rgba(233,30,99,0.12)",
        border: "2px solid rgba(233,30,99,0.14)",
        transform: hov ? "scale(1.03) rotate(-1deg)" : "scale(1)",
        transition: "all 0.22s ease",
        animation: `fadeSlideUp 0.5s ${delay}s ease both`,
        animationFillMode: "backwards",
      }}
    >
      <div style={{ aspectRatio: "1/1", overflow: "hidden" }}>
        <img src={photo.src} alt={photo.caption}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 0.3s", transform: hov ? "scale(1.08)" : "scale(1)" }} />
      </div>
      <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 600, color: "#7d1a3a", fontSize: "0.85rem", margin: 0, padding: "10px 14px", textAlign: "center" }}>
        {photo.caption}
      </p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  SCREEN 5 — REASONS (FLIP CARDS)
// ─────────────────────────────────────────────────────────────────────────────
function ReasonsScreen({ next }: { next: () => void }) {
  const [flipped, setFlipped] = useState<number[]>([]);
  const toggle = (i: number) => setFlipped(f => f.includes(i) ? f.filter(x => x !== i) : [...f, i]);

  return (
    <div style={{
      minHeight: "100svh", padding: "3rem 1.5rem 4rem",
      background: "linear-gradient(160deg,#fff0f3 0%,#fce4ec 55%,#fff9fb 100%)",
      animation: "pageTransition 0.6s ease both",
    }}>
      <FloatingBg count={10} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "2rem", alignItems: "center" }}>
        <div style={{ textAlign: "center", animation: "fadeSlideUp 0.6s ease both" }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>💗</div>
          <SHeading>Reasons Why You Are Special to Me 💗</SHeading>
          <p style={{ fontFamily: "'Nunito', sans-serif", color: "#ad5870", marginTop: "0.5rem", fontSize: "0.9rem" }}>
            Tap each card to reveal 🌸
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: "16px", width: "100%" }}>
          {REASONS.map((r, i) => (
            <div key={i} className={`flip-card${flipped.includes(i) ? " flipped" : ""}`}
              onClick={() => toggle(i)}
              style={{ height: "200px", animation: `fadeSlideUp 0.5s ${i * 0.09}s ease both`, animationFillMode: "backwards" }}
            >
              <div className="flip-card-inner" style={{ width: "100%", height: "100%" }}>
                {/* Front */}
                <div className="flip-card-front" style={{
                  position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: "12px",
                  background: "rgba(255,255,255,0.88)", backdropFilter: "blur(12px)",
                  borderRadius: "20px", border: "1.5px solid rgba(233,30,99,0.14)",
                  boxShadow: "0 4px 18px rgba(233,30,99,0.12)", padding: "1.2rem",
                }}>
                  <span style={{ fontSize: "2.8rem" }}>{r.emoji}</span>
                  <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, color: "#7d1a3a", textAlign: "center", margin: 0, fontSize: "0.92rem", lineHeight: 1.4 }}>{r.title}</p>
                  <span style={{ fontSize: "0.72rem", color: "#f48fb1" }}>tap to reveal ↻</span>
                </div>
                {/* Back */}
                <div className="flip-card-back" style={{
                  position: "absolute", inset: 0, display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  background: "linear-gradient(135deg,#e91e63,#ff4081)",
                  borderRadius: "20px", padding: "1.5rem", textAlign: "center",
                }}>
                  <span style={{ fontSize: "2rem", marginBottom: "10px" }}>💕</span>
                  <p style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, color: "#fff", margin: 0, fontSize: "0.9rem", lineHeight: 1.5 }}>{r.detail}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <PrimaryBtn onClick={next} style={{ marginTop: "0.5rem" }}>One more surprise 🎁</PrimaryBtn>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  SCREEN 6 — HEART CATCH GAME
// ─────────────────────────────────────────────────────────────────────────────
function GameScreen({ next }: { next: () => void }) {
  const [hearts, setHearts] = useState<GameHeart[]>([]);
  const [caught, setCaught] = useState(0);
  const [done, setDone] = useState(false);
  const [popMsg, setPopMsg] = useState<{ id: number; msg: string; x: number; y: number } | null>(null);
  const idRef = useRef(0);
  const TARGET = 5;

  useEffect(() => {
    if (done) return;
    const spawn = () => {
      if (done) return;
      const id = ++idRef.current;
      const msg = LOVE_MESSAGES_GAME[Math.floor(Math.random() * LOVE_MESSAGES_GAME.length)];
      setHearts(h => [...h.slice(-12), { id, x: 5 + Math.random() * 85, y: 10 + Math.random() * 75, msg, popped: false }]);
    };
    spawn();
    const iv = setInterval(spawn, 1800);
    return () => clearInterval(iv);
  }, [done]);

  const catchHeart = (h: GameHeart, e: React.MouseEvent) => {
    if (h.popped) return;
    setHearts(prev => prev.map(x => x.id === h.id ? { ...x, popped: true } : x));
    setPopMsg({ id: h.id, msg: h.msg, x: e.clientX, y: e.clientY });
    setTimeout(() => setPopMsg(null), 1600);
    const next = caught + 1;
    setCaught(next);
    if (next >= TARGET) { setTimeout(() => setDone(true), 600); }
  };

  return (
    <div style={{
      minHeight: "100svh", padding: "3rem 1.5rem 4rem",
      background: "linear-gradient(160deg,#fff0f3 0%,#fce4ec 55%,#fff9fb 100%)",
      animation: "pageTransition 0.6s ease both", position: "relative", overflow: "hidden",
    }}>
      <FloatingBg count={8} />
      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem", textAlign: "center" }}>
        <div style={{ fontSize: "3rem" }}>💕</div>
        <SHeading>Catch the Hearts 💕</SHeading>

        {!done ? (
          <>
            <p style={{ fontFamily: "'Nunito', sans-serif", color: "#ad5870", fontSize: "0.95rem", margin: 0 }}>
              Tap the floating hearts! Caught: <strong style={{ color: "#e91e63" }}>{caught}</strong> / {TARGET}
            </p>

            {/* Progress dots */}
            <div style={{ display: "flex", gap: "10px" }}>
              {Array.from({ length: TARGET }).map((_, i) => (
                <div key={i} style={{
                  width: "16px", height: "16px", borderRadius: "50%",
                  background: i < caught ? "#e91e63" : "#fce4ec",
                  border: "2px solid #f48fb1",
                  transition: "background 0.3s, transform 0.3s",
                  transform: i < caught ? "scale(1.2)" : "scale(1)",
                }} />
              ))}
            </div>
          </>
        ) : (
          <div style={{ animation: "pop 0.5s cubic-bezier(.34,1.56,.64,1) both", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <div style={{ fontSize: "3rem" }}>🎉</div>
            <p style={{ fontFamily: "'Pacifico', cursive", color: "#e91e63", fontSize: "1.4rem", margin: 0 }}>
              You collected all my love!
            </p>
            <PrimaryBtn onClick={next}>Read my letter 💌</PrimaryBtn>
          </div>
        )}
      </div>

      {/* Game hearts */}
      {!done && hearts.filter(h => !h.popped).map(h => (
        <button key={h.id} onClick={(e) => catchHeart(h, e)} style={{
          position: "fixed", left: `${h.x}%`, top: `${h.y}%`,
          background: "none", border: "none", cursor: "pointer", padding: 0,
          fontSize: "clamp(2rem,5vw,3rem)",
          animation: `gamePop 0.5s cubic-bezier(.34,1.56,.64,1) both`,
          zIndex: 50, filter: "drop-shadow(0 2px 6px rgba(233,30,99,0.4))",
          transform: "translate(-50%,-50%)",
        }}>❤️</button>
      ))}

      {/* Pop message bubble */}
      {popMsg && (
        <div style={{
          position: "fixed", left: `${popMsg.x}px`, top: `${popMsg.y - 48}px`,
          transform: "translate(-50%,-100%)",
          background: "linear-gradient(135deg,#e91e63,#ff4081)",
          color: "#fff", fontFamily: "'Nunito', sans-serif", fontWeight: 700,
          fontSize: "0.88rem", padding: "8px 16px", borderRadius: "999px",
          boxShadow: "0 4px 16px rgba(233,30,99,0.4)",
          animation: "msgBubble 0.35s ease both", zIndex: 200, whiteSpace: "nowrap",
          pointerEvents: "none",
        }}>{popMsg.msg}</div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  SCREEN 7 — LOVE LETTER
// ─────────────────────────────────────────────────────────────────────────────
function LetterScreen({ next }: { next: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      minHeight: "100svh", padding: "3rem 1.5rem 4rem", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "linear-gradient(160deg,#fff0f3 0%,#fce4ec 55%,#fff9fb 100%)",
      animation: "pageTransition 0.6s ease both",
    }}>
      <FloatingBg count={10} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: "520px", width: "100%", display: "flex", flexDirection: "column", gap: "2rem", alignItems: "center", textAlign: "center" }}>
        <div style={{ fontSize: "3rem" }}>💌</div>
        <SHeading>A Little Note for You 💌</SHeading>

        {/* Envelope */}
        {!open ? (
          <div style={{ animation: "envelopeBounce 2.5s ease-in-out infinite" }}>
            <button onClick={() => setOpen(true)} style={{
              background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem",
            }}>
              <div style={{
                width: "160px", height: "120px", position: "relative",
                filter: "drop-shadow(0 6px 20px rgba(233,30,99,0.3))",
              }}>
                <svg viewBox="0 0 160 120" fill="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
                  <rect x="4" y="4" width="152" height="112" rx="12" fill="#fce4ec" stroke="#f48fb1" strokeWidth="2"/>
                  <path d="M4 20 L80 68 L156 20" stroke="#f48fb1" strokeWidth="2" fill="none"/>
                  <path d="M4 20 L48 64" stroke="#f48fb1" strokeWidth="1.5" fill="none"/>
                  <path d="M156 20 L112 64" stroke="#f48fb1" strokeWidth="1.5" fill="none"/>
                  <text x="80" y="90" textAnchor="middle" fill="#e91e63" fontSize="22">💌</text>
                </svg>
              </div>
              <span style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, color: "#ad5870", fontSize: "0.9rem" }}>
                Tap to open 💕
              </span>
            </button>
          </div>
        ) : (
          <div style={{ animation: "pop 0.5s cubic-bezier(.34,1.56,.64,1) both", width: "100%" }}>
            <div style={{
              background: "linear-gradient(160deg,rgba(255,255,255,0.95),rgba(252,228,236,0.88))",
              backdropFilter: "blur(14px)",
              borderRadius: "24px", padding: "2rem 2.5rem",
              boxShadow: "0 8px 40px rgba(233,30,99,0.18)",
              border: "1.5px solid rgba(233,30,99,0.14)",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: "12px", right: "18px", fontSize: "5rem", opacity: 0.06, lineHeight: 1 }}>❤️</div>
              <p style={{
                fontFamily: "'Nunito', sans-serif", fontWeight: 600, color: "#7d1a3a",
                fontSize: "clamp(0.9rem,2.5vw,1rem)", lineHeight: 1.9, margin: 0, whiteSpace: "pre-line", textAlign: "left",
              }}>{LOVE_LETTER_TEXT}</p>
              <p style={{ fontFamily: "'Pacifico', cursive", color: "#e91e63", marginTop: "1.5rem", textAlign: "right", margin: "1.5rem 0 0" }}>
                — {MY_NAME} ❤️
              </p>
            </div>
          </div>
        )}

        {open && (
          <div style={{ animation: "fadeSlideUp 0.5s 0.3s ease both", animationFillMode: "backwards" }}>
            <PrimaryBtn onClick={next}>Open final surprise 🎁</PrimaryBtn>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
//  SCREEN 8 — FINALE
// ─────────────────────────────────────────────────────────────────────────────
function FinaleScreen({ onReplay }: { onReplay: () => void }) {
  const [screenshotMsg, setScreenshotMsg] = useState(false);

  return (
    <div style={{
      minHeight: "100svh", padding: "3rem 1.5rem 4rem", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "linear-gradient(160deg,#fff0f3 0%,#fce4ec 55%,#fff9fb 100%)",
      animation: "pageTransition 0.6s ease both", textAlign: "center",
    }}>
      <FloatingBg count={24} />
      <Confetti active />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "520px", display: "flex", flexDirection: "column", gap: "2rem", alignItems: "center" }}>

        {/* Big heart */}
        <div style={{ fontSize: "clamp(5rem,16vw,8rem)", animation: "heartbeat 0.9s ease-in-out infinite", lineHeight: 1 }}>❤️</div>

        <h1 style={{
          fontFamily: "'Pacifico', cursive", color: "#c2185b",
          fontSize: "clamp(1.6rem,6vw,2.5rem)", lineHeight: 1.2, margin: 0,
          animation: "slideInUp 0.7s ease both",
        }}>The End… or the Beginning? ❤️</h1>

        {/* Valentine accepted badge */}
        <div style={{
          animation: "badgePop 0.8s 0.4s cubic-bezier(.34,1.56,.64,1) both",
          animationFillMode: "backwards",
        }}>
          <div style={{
            background: "linear-gradient(135deg,#e91e63,#ff4081)",
            borderRadius: "999px", padding: "14px 32px",
            boxShadow: "0 6px 28px rgba(233,30,99,0.4)",
            border: "3px solid rgba(255,255,255,0.6)",
          }}>
            <p style={{ fontFamily: "'Pacifico', cursive", color: "#fff", fontSize: "1.1rem", margin: 0 }}>
              💝 Valentine Accepted 💝
            </p>
          </div>
        </div>

        {/* Final message */}
        <Card style={{ padding: "2rem 2.5rem", animation: "fadeSlideUp 0.7s 0.6s ease both", animationFillMode: "backwards" }}>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", top: "-8px", right: "-8px", fontSize: "3.5rem", opacity: 0.07 }}>❤️</div>
            <p style={{
              fontFamily: "'Nunito', sans-serif", fontWeight: 600, color: "#7d1a3a",
              fontSize: "clamp(0.95rem,2.5vw,1.05rem)", lineHeight: 1.8, margin: 0, whiteSpace: "pre-line",
            }}>{FINAL_ROMANTIC_MESSAGE}</p>
            <p style={{ fontFamily: "'Pacifico', cursive", color: "#e91e63", marginTop: "1.2rem", margin: "1.2rem 0 0" }}>
              — {MY_NAME} ❤️
            </p>
          </div>
        </Card>

        <div style={{ fontSize: "2.5rem", animation: "heartbeat 1.1s ease-in-out infinite" }}>❤️ 💕 ❤️</div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center", animation: "fadeSlideUp 0.6s 0.9s ease both", animationFillMode: "backwards" }}>
          <PrimaryBtn onClick={onReplay}>Replay from the beginning 🔁</PrimaryBtn>
          <button onClick={() => { setScreenshotMsg(true); setTimeout(() => setScreenshotMsg(false), 2500); }} style={{
            fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "0.95rem",
            padding: "0.75em 1.5em", background: "#fce4ec", color: "#c2185b",
            border: "1.5px solid #f48fb1", borderRadius: "999px", cursor: "pointer",
            transition: "all 0.18s",
          }}>Send me a screenshot 😌</button>
        </div>

        {screenshotMsg && (
          <div style={{
            background: "linear-gradient(135deg,#e91e63,#ff4081)", color: "#fff",
            fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: "0.9rem",
            padding: "10px 24px", borderRadius: "999px",
            boxShadow: "0 4px 16px rgba(233,30,99,0.4)",
            animation: "msgBubble 0.35s ease both",
          }}>📸 Screenshot taken in your heart! 💕</div>
        )}
      </div>
    </div>
  );
}

// ─── GLOBAL CSS ───────────────────────────────────────────────────────────────
const globalStyles = GLOBAL_CSS;

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState<Page>("opening");
  const go = (p: Page) => setPage(p);

  return (
    <>
      <style>{globalStyles}</style>
      <MusicBtn />
      {page === "opening"     && <OpeningScreen     next={() => go("question")} />}
      {page === "question"    && <QuestionScreen    next={() => go("celebration")} />}
      {page === "celebration" && <CelebrationScreen next={() => go("gallery")} />}
      {page === "gallery"     && <GalleryScreen     next={() => go("reasons")} />}
      {page === "reasons"     && <ReasonsScreen     next={() => go("game")} />}
      {page === "game"        && <GameScreen        next={() => go("letter")} />}
      {page === "letter"      && <LetterScreen      next={() => go("finale")} />}
      {page === "finale"      && <FinaleScreen      onReplay={() => go("opening")} />}
    </>
  );
}
