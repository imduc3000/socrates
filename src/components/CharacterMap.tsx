import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import { innerCharacters, characterLinks, type InnerCharacter, type CharacterLink } from "@/data/mockPremiumData";

interface CharacterMapProps {
  onBack: () => void;
}

const nodePositions: Record<string, { x: number; y: number }> = {
  impostor: { x: 38, y: 32 },
  seeker: { x: 72, y: 22 },
  controller: { x: 26, y: 62 },
  avoider: { x: 66, y: 72 },
};

const strengthStyle: Record<string, { dashArray: string; opacity: number; width: number; glow: number }> = {
  strong: { dashArray: "none", opacity: 0.7, width: 0.8, glow: 5 },
  medium: { dashArray: "2,5", opacity: 0.4, width: 0.6, glow: 3 },
  weak: { dashArray: "1,7", opacity: 0.22, width: 0.5, glow: 2 },
};

const generateStarfield = (count: number, seed = 1) => {
  const stars: { x: number; y: number; size: number; opacity: number; twinkle: number; delay: number }[] = [];
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = 0; i < count; i++) {
    stars.push({
      x: rand() * 100,
      y: rand() * 100,
      size: 0.3 + rand() * 1.5,
      opacity: 0.15 + rand() * 0.7,
      twinkle: 2 + rand() * 5,
      delay: rand() * 4,
    });
  }
  return stars;
};

const CharacterMap = ({ onBack }: CharacterMapProps) => {
  const [selected, setSelected] = useState<
    { type: "char"; data: InnerCharacter } | { type: "link"; data: CharacterLink } | null
  >(null);
  const [hoveredChar, setHoveredChar] = useState<string | null>(null);
  const [shootingStar, setShootingStar] = useState(0);

  const stars = useMemo(() => generateStarfield(200, 7), []);
  const microStars = useMemo(() => generateStarfield(90, 23), []);

  useEffect(() => {
    const interval = setInterval(() => setShootingStar((s) => s + 1), 7000);
    return () => clearInterval(interval);
  }, []);

  const maxAppearances = Math.max(...innerCharacters.map((c) => c.appearances));
  // Star "magnitude" 0..1 — drives core size, spike length, glow size
  const getMagnitude = (a: number) => 0.45 + (a / maxAppearances) * 0.55;

  const isLinkActive = (link: CharacterLink) => {
    if (!selected) return false;
    if (selected.type === "link" && selected.data === link) return true;
    if (selected.type === "char" && (link.from === selected.data.id || link.to === selected.data.id)) return true;
    return false;
  };

  const isCharActive = (id: string) => {
    if (!selected) return false;
    if (selected.type === "char" && selected.data.id === id) return true;
    if (selected.type === "link" && (selected.data.from === id || selected.data.to === id)) return true;
    return false;
  };

  return (
    <div
      className="fixed inset-0 overflow-hidden"
      style={{
        background:
          "radial-gradient(ellipse at 25% 15%, hsl(245 40% 12%) 0%, transparent 55%), radial-gradient(ellipse at 80% 85%, hsl(280 35% 14%) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, hsl(230 45% 7%) 0%, hsl(225 50% 4%) 100%)",
      }}
    >
      {/* Layer 1: Far micro stars */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {microStars.map((star, i) => (
          <circle
            key={`m-${i}`}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.size * 0.6}
            fill="hsl(35 30% 92%)"
            opacity={star.opacity * 0.5}
          >
            <animate
              attributeName="opacity"
              values={`${star.opacity * 0.2};${star.opacity * 0.6};${star.opacity * 0.2}`}
              dur={`${star.twinkle + 2}s`}
              repeatCount="indefinite"
              begin={`${star.delay}s`}
            />
          </circle>
        ))}
      </svg>

      {/* Layer 2: Main starfield + nebulae + shooting star */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <radialGradient id="nebula-gold" cx="50%" cy="50%">
            <stop offset="0%" stopColor="hsl(38 70% 60%)" stopOpacity="0.16" />
            <stop offset="100%" stopColor="hsl(38 70% 60%)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="nebula-violet" cx="50%" cy="50%">
            <stop offset="0%" stopColor="hsl(265 60% 60%)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="hsl(265 60% 60%)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="nebula-blue" cx="50%" cy="50%">
            <stop offset="0%" stopColor="hsl(210 70% 55%)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="hsl(210 70% 55%)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="35%" cy="40%" rx="280" ry="180" fill="url(#nebula-gold)" />
        <ellipse cx="75%" cy="65%" rx="240" ry="200" fill="url(#nebula-violet)" />
        <ellipse cx="20%" cy="80%" rx="180" ry="140" fill="url(#nebula-blue)" />

        {stars.map((star, i) => (
          <circle
            key={`s-${i}`}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.size}
            fill="hsl(35 50% 96%)"
            opacity={star.opacity}
          >
            <animate
              attributeName="opacity"
              values={`${star.opacity};${star.opacity * 0.25};${star.opacity}`}
              dur={`${star.twinkle}s`}
              repeatCount="indefinite"
              begin={`${star.delay}s`}
            />
          </circle>
        ))}

        <AnimatePresence>
          <motion.line
            key={shootingStar}
            stroke="hsl(35 70% 90%)"
            strokeWidth="1.2"
            strokeLinecap="round"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              x1: ["10%", "10%", "70%", "85%"],
              y1: ["20%", "20%", "55%", "65%"],
              x2: ["10%", "12%", "72%", "85%"],
              y2: ["20%", "22%", "57%", "65%"],
            }}
            transition={{ duration: 1.8, times: [0, 0.1, 0.9, 1], ease: "easeOut" }}
            style={{ filter: "drop-shadow(0 0 4px hsl(35 70% 90%))" }}
          />
        </AnimatePresence>

        {/* Constellation lines */}
        {characterLinks.map((link) => {
          const from = nodePositions[link.from];
          const to = nodePositions[link.to];
          if (!from || !to) return null;
          const style = strengthStyle[link.strength];
          const active = isLinkActive(link);
          return (
            <line
              key={`${link.from}-${link.to}`}
              x1={`${from.x}%`}
              y1={`${from.y}%`}
              x2={`${to.x}%`}
              y2={`${to.y}%`}
              stroke="hsl(var(--gold))"
              strokeWidth={active ? style.width + 0.6 : style.width}
              strokeDasharray={style.dashArray === "none" ? undefined : style.dashArray}
              opacity={active ? 1 : style.opacity}
              className="cursor-pointer transition-all duration-500 pointer-events-auto"
              onClick={() =>
                setSelected(selected?.type === "link" && selected.data === link ? null : { type: "link", data: link })
              }
              strokeLinecap="round"
              style={{
                filter: active
                  ? `drop-shadow(0 0 ${style.glow}px hsl(var(--gold) / 0.8))`
                  : "drop-shadow(0 0 1.5px hsl(var(--gold) / 0.3))",
              }}
            />
          );
        })}
      </svg>

      {/* Top: minimal back button */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-30 flex items-center px-8 py-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <button
          onClick={onBack}
          className="group flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-ui text-xs tracking-[0.25em] uppercase">Quay lại</span>
        </button>
      </motion.div>

      {/* Cosmos canvas — character stars rendered as HTML for crisp diffraction spikes */}
      <div className="absolute inset-0 z-10">
        {innerCharacters.map((char, i) => {
          const pos = nodePositions[char.id];
          if (!pos) return null;
          const m = getMagnitude(char.appearances);
          const active = isCharActive(char.id) || hoveredChar === char.id;
          // Sizes
          const coreSize = 6 + m * 6; // px — small bright core
          const spikeLen = 28 + m * 36; // px
          const spikeShort = 10 + m * 14;
          const haloSize = 80 + m * 100;
          const twinkleDur = 2.5 + i * 0.4;

          return (
            <motion.div
              key={char.id}
              className="absolute cursor-pointer"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              onClick={() =>
                setSelected(
                  selected?.type === "char" && selected.data.id === char.id ? null : { type: "char", data: char }
                )
              }
              onMouseEnter={() => setHoveredChar(char.id)}
              onMouseLeave={() => setHoveredChar(null)}
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.15, duration: 0.8 }}
            >
              {/* Soft outer halo */}
              <div
                className="absolute rounded-full pointer-events-none transition-opacity duration-500"
                style={{
                  width: haloSize,
                  height: haloSize,
                  left: -haloSize / 2,
                  top: -haloSize / 2,
                  background: `radial-gradient(circle, hsl(var(--gold) / ${active ? 0.18 : 0.1}) 0%, hsl(var(--gold) / 0) 65%)`,
                  animation: `pulse ${twinkleDur + 1.5}s ease-in-out infinite`,
                }}
              />

              {/* Inner warm glow */}
              <div
                className="absolute rounded-full pointer-events-none transition-opacity duration-500"
                style={{
                  width: coreSize * 5,
                  height: coreSize * 5,
                  left: -(coreSize * 5) / 2,
                  top: -(coreSize * 5) / 2,
                  background: `radial-gradient(circle, hsl(45 90% 92% / ${active ? 0.55 : 0.4}) 0%, hsl(45 90% 90% / 0) 60%)`,
                  filter: "blur(2px)",
                }}
              />

              {/* Diffraction spikes — 4 thin lines forming a cross */}
              <div
                className="absolute pointer-events-none"
                style={{
                  left: 0,
                  top: 0,
                  width: 0,
                  height: 0,
                }}
              >
                {/* Vertical spike (long) */}
                <div
                  className="absolute"
                  style={{
                    width: 1,
                    height: spikeLen * 2,
                    left: -0.5,
                    top: -spikeLen,
                    background:
                      "linear-gradient(to bottom, transparent 0%, hsl(45 90% 96% / 0.85) 35%, hsl(45 90% 98%) 50%, hsl(45 90% 96% / 0.85) 65%, transparent 100%)",
                    filter: "blur(0.3px) drop-shadow(0 0 3px hsl(45 90% 95% / 0.8))",
                    opacity: active ? 1 : 0.85,
                    transition: "opacity 0.3s",
                  }}
                />
                {/* Horizontal spike (long) */}
                <div
                  className="absolute"
                  style={{
                    width: spikeLen * 2,
                    height: 1,
                    left: -spikeLen,
                    top: -0.5,
                    background:
                      "linear-gradient(to right, transparent 0%, hsl(45 90% 96% / 0.85) 35%, hsl(45 90% 98%) 50%, hsl(45 90% 96% / 0.85) 65%, transparent 100%)",
                    filter: "blur(0.3px) drop-shadow(0 0 3px hsl(45 90% 95% / 0.8))",
                    opacity: active ? 1 : 0.85,
                    transition: "opacity 0.3s",
                  }}
                />
                {/* Diagonal spikes (short, subtle) */}
                <div
                  className="absolute"
                  style={{
                    width: 1,
                    height: spikeShort * 2,
                    left: -0.5,
                    top: -spikeShort,
                    background:
                      "linear-gradient(to bottom, transparent 0%, hsl(40 70% 90% / 0.5) 50%, transparent 100%)",
                    transform: "rotate(45deg)",
                    transformOrigin: "center",
                    opacity: active ? 0.7 : 0.45,
                    transition: "opacity 0.3s",
                  }}
                />
                <div
                  className="absolute"
                  style={{
                    width: 1,
                    height: spikeShort * 2,
                    left: -0.5,
                    top: -spikeShort,
                    background:
                      "linear-gradient(to bottom, transparent 0%, hsl(40 70% 90% / 0.5) 50%, transparent 100%)",
                    transform: "rotate(-45deg)",
                    transformOrigin: "center",
                    opacity: active ? 0.7 : 0.45,
                    transition: "opacity 0.3s",
                  }}
                />
              </div>

              {/* Star core — small, sharp, brilliant white */}
              <div
                className="absolute rounded-full"
                style={{
                  width: coreSize,
                  height: coreSize,
                  left: -coreSize / 2,
                  top: -coreSize / 2,
                  background:
                    "radial-gradient(circle, hsl(0 0% 100%) 0%, hsl(45 90% 97%) 40%, hsl(40 80% 90%) 100%)",
                  boxShadow:
                    "0 0 8px hsl(45 95% 95%), 0 0 16px hsl(45 90% 90% / 0.7), 0 0 32px hsl(40 80% 80% / 0.4)",
                  animation: `twinkle ${twinkleDur}s ease-in-out infinite`,
                }}
              />

              {/* Label */}
              <div
                className="absolute pointer-events-none select-none text-center whitespace-nowrap"
                style={{
                  left: 0,
                  top: coreSize / 2 + 18,
                  transform: "translateX(-50%)",
                }}
              >
                <span
                  className="font-display tracking-wide block transition-all duration-300"
                  style={{
                    color: active ? "hsl(var(--gold))" : "hsl(35 30% 88%)",
                    fontSize: active ? "15px" : "13px",
                    textShadow: "0 0 14px hsl(225 50% 4% / 0.95), 0 0 6px hsl(225 50% 4%)",
                  }}
                >
                  {char.name}
                </span>
                <span
                  className="font-ui text-[9px] tracking-[0.3em] uppercase mt-1 block"
                  style={{
                    color: "hsl(35 25% 60% / 0.65)",
                    textShadow: "0 0 8px hsl(225 50% 4%)",
                  }}
                >
                  {char.appearances} lần
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Slide-up insight panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="absolute bottom-0 left-0 right-0 z-40 pointer-events-none"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
          >
            <div className="max-w-5xl mx-auto px-4 md:px-6 pb-2 md:pb-4 pointer-events-auto">
              <div
                className="relative rounded-3xl p-6 md:p-8 border border-gold/20 backdrop-blur-2xl overflow-hidden"
                style={{
                  background: "linear-gradient(160deg, hsl(225 35% 16% / 0.92), hsl(245 40% 12% / 0.92))",
                  boxShadow:
                    "0 -20px 60px hsl(225 50% 3% / 0.6), 0 0 0 1px hsl(38 50% 60% / 0.08), inset 0 1px 0 hsl(38 50% 70% / 0.15)",
                }}
              >
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-5 right-5 p-2 rounded-full hover:bg-foreground/10 transition-colors text-foreground/50 hover:text-foreground"
                >
                  <X size={16} />
                </button>

                {selected.type === "link" && (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <span className="font-ui text-[10px] tracking-[0.3em] uppercase text-gold/80">
                        Liên kết ·{" "}
                        {selected.data.strength === "strong"
                          ? "Mạnh"
                          : selected.data.strength === "medium"
                          ? "Trung bình"
                          : "Yếu"}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mb-6 flex-wrap">
                      <span className="font-display text-xl text-foreground">
                        {innerCharacters.find((c) => c.id === selected.data.from)?.name}
                      </span>
                      <div className="flex-1 min-w-[40px] h-px bg-gradient-to-r from-gold/40 via-gold/60 to-gold/40" />
                      <span className="font-display text-xl text-foreground">
                        {innerCharacters.find((c) => c.id === selected.data.to)?.name}
                      </span>
                    </div>

                    <div className="border-l-2 border-gold/40 pl-5">
                      <p className="font-ui text-[10px] tracking-[0.25em] uppercase text-gold/70 mb-3">
                        Socrates thì thầm
                      </p>
                      <p className="font-body text-lg md:text-xl text-foreground/90 leading-relaxed italic">
                        {selected.data.insight}
                      </p>
                    </div>
                  </>
                )}

                {selected.type === "char" && (
                  <>
                    <div className="mb-5">
                      <p className="font-ui text-[10px] tracking-[0.3em] uppercase text-gold/70 mb-1">
                        Nhân vật · {selected.data.appearances} lần xuất hiện
                      </p>
                      <h3 className="font-display text-2xl md:text-3xl text-foreground mb-1">{selected.data.name}</h3>
                      <p className="font-body italic text-sm text-foreground/60">{selected.data.description}</p>
                    </div>

                    <div className="border-l-2 border-gold/40 pl-5">
                      <p className="font-ui text-[10px] tracking-[0.25em] uppercase text-gold/70 mb-3">
                        Socrates thì thầm
                      </p>
                      <p className="font-body text-lg md:text-xl text-foreground/90 leading-relaxed italic">
                        {selected.data.socratesNote}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Local keyframes for star twinkle */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(0.92); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.95; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.92); }
        }
      `}</style>
    </div>
  );
};

export default CharacterMap;
