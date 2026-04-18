import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, TrendingUp, Calendar, MessageCircle, Sparkles } from "lucide-react";
import { emotionTimeline, type EmotionPoint } from "@/data/mockPremiumData";

interface EmotionChartProps {
  onBack: () => void;
}

const emotionColor = (score: number) => {
  if (score <= 3) return "hsl(var(--destructive))";
  if (score <= 5) return "hsl(var(--gold))";
  if (score <= 7) return "hsl(var(--sage))";
  return "hsl(var(--primary))";
};

const generateAmbientStars = (count: number, seed: number) => {
  const stars: { x: number; y: number; size: number; opacity: number; twinkle: number; delay: number }[] = [];
  let s = seed;
  const rand = () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };

  for (let i = 0; i < count; i++) {
    stars.push({
      x: rand() * 100,
      y: rand() * 100,
      size: 0.3 + rand() * 1.3,
      opacity: 0.2 + rand() * 0.7,
      twinkle: 2 + rand() * 6,
      delay: rand() * 3,
    });
  }

  return stars;
};

const EmotionChart = ({ onBack }: EmotionChartProps) => {
  const [selected, setSelected] = useState<EmotionPoint | null>(null);

  const maxScore = 10;
  const chartSize = 300;
  const center = chartSize / 2;
  const minRadius = 42;
  const maxRadius = 116;
  const dotSize = 10;

  const stars = useMemo(() => generateAmbientStars(110, 11), []);

  const radialPoints = useMemo(() => {
    const total = emotionTimeline.length;
    const startAngle = -230;
    const sweep = 280;

    return emotionTimeline.map((point, i) => {
      const t = total <= 1 ? 0 : i / (total - 1);
      const angleDeg = startAngle + t * sweep;
      const angleRad = (angleDeg * Math.PI) / 180;
      const radius = minRadius + (point.score / maxScore) * (maxRadius - minRadius);

      const x = center + Math.cos(angleRad) * radius;
      const y = center + Math.sin(angleRad) * radius;

      const labelRadius = maxRadius + 24;
      const lx = center + Math.cos(angleRad) * labelRadius;
      const ly = center + Math.sin(angleRad) * labelRadius;

      return { point, x, y, lx, ly, angleDeg, radius };
    });
  }, [center, maxRadius, maxScore, minRadius]);

  const linePath = useMemo(() => {
    if (radialPoints.length === 0) return "";
    return radialPoints.map((p, idx) => `${idx === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  }, [radialPoints]);

  const fillPath = useMemo(() => {
    if (radialPoints.length === 0) return "";
    return `M ${center} ${center} L ${radialPoints.map((p) => `${p.x} ${p.y}`).join(" L ")} Z`;
  }, [center, radialPoints]);

  const topTopic = useMemo(() => {
    const frequency = emotionTimeline.reduce<Record<string, number>>((acc, item) => {
      acc[item.topic] = (acc[item.topic] ?? 0) + 1;
      return acc;
    }, {});
    const sorted = Object.entries(frequency).sort((a, b) => b[1] - a[1]);
    return sorted[0]?.[0] ?? "-";
  }, []);

  const trendLabel = useMemo(() => {
    if (emotionTimeline.length < 2) return "Ổn định";
    const delta = emotionTimeline[emotionTimeline.length - 1].score - emotionTimeline[0].score;
    if (delta > 0) return "↗ Tích cực";
    if (delta < 0) return "↘ Đi xuống";
    return "→ Ổn định";
  }, []);

  return (
    <div
      className="fixed inset-0 overflow-y-auto overflow-x-hidden overscroll-y-contain"
      style={{
        background:
          "radial-gradient(ellipse at 18% 12%, hsl(252 45% 14%) 0%, transparent 55%), radial-gradient(ellipse at 88% 86%, hsl(281 40% 16%) 0%, transparent 50%), radial-gradient(ellipse at 50% 45%, hsl(230 52% 8%) 0%, hsl(225 54% 4%) 100%)",
        WebkitOverflowScrolling: "touch",
      }}
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {stars.map((star, index) => (
          <circle
            key={`emotion-star-${index}`}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.size}
            fill="hsl(38 45% 92%)"
            opacity={star.opacity * 0.65}
          >
            <animate
              attributeName="opacity"
              values={`${star.opacity * 0.35};${star.opacity};${star.opacity * 0.35}`}
              dur={`${star.twinkle}s`}
              begin={`${star.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>

      <div className="absolute left-[8%] top-[18%] h-56 w-56 rounded-full bg-gold/10 blur-[100px] pointer-events-none" />
      <div className="absolute right-[12%] bottom-[18%] h-72 w-72 rounded-full bg-violet-500/15 blur-[120px] pointer-events-none" />

      <motion.header
        className="absolute top-0 left-0 right-0 z-30 flex items-center px-4 md:px-8 pt-5 md:pt-6"
        style={{ paddingTop: "max(1.25rem, env(safe-area-inset-top))" }}
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 px-3 py-2 rounded-xl border border-border/40 bg-black/20 text-foreground/75 hover:text-foreground hover:bg-black/35 transition-colors"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-ui text-[10px] tracking-[0.25em] uppercase">Quay lại</span>
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-base md:text-lg text-foreground">Hành trình cảm xúc</h2>
              <span className="font-ui text-[10px] text-gold bg-gold/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles size={10} /> Premium
              </span>
            </div>
            <p className="font-ui text-[11px] text-muted-foreground">{emotionTimeline.length} phiên · tháng 3-4/2026</p>
          </div>
        </div>
      </motion.header>

      <div
        className="relative z-20 min-h-screen pt-[88px] md:pt-[92px] pb-4 md:pb-5 flex flex-col"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <motion.div className="px-4 md:px-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <p className="font-ui text-[10px] tracking-[0.3em] uppercase text-gold/80">Orbital timeline</p>
          <h1 className="font-display text-xl md:text-2xl text-foreground leading-tight mt-1">Quỹ đạo cảm xúc</h1>
        </motion.div>

        <motion.div
          className="grid grid-cols-3 gap-2 mt-3 mb-3 px-4 md:px-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {[
            { icon: Calendar, label: "phiên", value: emotionTimeline.length.toString() },
            { icon: TrendingUp, label: "xu hướng", value: trendLabel },
            { icon: MessageCircle, label: "chủ đề", value: topTopic },
          ].map((stat, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/60 p-2.5 text-center backdrop-blur-xl"
              style={{ background: "linear-gradient(165deg, hsl(231 32% 17% / 0.88), hsl(243 35% 12% / 0.9))" }}
            >
              <stat.icon size={13} className="mx-auto mb-1 text-gold-muted" />
              <p className="font-display text-base md:text-lg text-foreground">{stat.value}</p>
              <p className="font-ui text-[10px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="mx-4 md:mx-8 rounded-[24px] border border-gold/20 p-3.5 md:p-4 backdrop-blur-2xl"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            background: "linear-gradient(165deg, hsl(228 35% 16% / 0.92), hsl(242 40% 12% / 0.94))",
            boxShadow:
              "0 16px 40px hsl(225 50% 3% / 0.48), 0 0 0 1px hsl(38 50% 60% / 0.08), inset 0 1px 0 hsl(38 50% 70% / 0.13)",
          }}
        >
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="font-display text-base md:text-lg text-foreground">Quỹ đạo</h3>
            <span className="font-ui text-[9px] tracking-[0.2em] uppercase text-gold/70">Chạm vào điểm</span>
          </div>

          <div className="grid md:grid-cols-[1fr_180px] gap-3 items-center">
            <div className="w-full flex items-center justify-center">
              <svg viewBox={`0 0 ${chartSize} ${chartSize}`} className="w-full max-w-[330px]">
                <defs>
                  <radialGradient id="orbit-fill" cx="50%" cy="50%" r="60%">
                    <stop offset="0%" stopColor="hsl(40 80% 68% / 0.18)" />
                    <stop offset="100%" stopColor="hsl(40 80% 68% / 0)" />
                  </radialGradient>
                  <linearGradient id="orbit-line" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="hsl(38 52% 62%)" />
                    <stop offset="100%" stopColor="hsl(46 68% 70%)" />
                  </linearGradient>
                </defs>

                {[minRadius, (minRadius + maxRadius) / 2, maxRadius].map((r) => (
                  <circle
                    key={r}
                    cx={center}
                    cy={center}
                    r={r}
                    fill="none"
                    stroke="hsl(var(--border) / 0.45)"
                    strokeDasharray="2 8"
                  />
                ))}

                <path d={fillPath} fill="url(#orbit-fill)" />
                <path d={linePath} fill="none" stroke="url(#orbit-line)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />

                {radialPoints.map((p) => {
                  const isSelected = selected?.date === p.point.date;
                  return (
                    <g key={p.point.date}>
                      {isSelected && (
                        <circle
                          cx={p.x}
                          cy={p.y}
                          r={dotSize + 6}
                          fill="none"
                          stroke="hsl(var(--gold) / 0.6)"
                          strokeWidth="1"
                        />
                      )}
                      <circle
                        cx={p.x}
                        cy={p.y}
                        r={dotSize / 2}
                        fill={emotionColor(p.point.score)}
                        stroke="hsl(var(--background))"
                        strokeWidth="2"
                        style={{ cursor: "pointer" }}
                        onClick={() => setSelected(isSelected ? null : p.point)}
                      />
                    </g>
                  );
                })}

                {radialPoints.map((p, idx) => (
                  <text
                    key={`date-${p.point.date}`}
                    x={p.lx}
                    y={p.ly}
                    fill="hsl(var(--muted-foreground))"
                    fontSize="9"
                    textAnchor="middle"
                    opacity={idx % 2 === 0 ? 0.75 : 0.32}
                  >
                    {idx % 2 === 0 ? p.point.date : "•"}
                  </text>
                ))}
              </svg>
            </div>

            <div className="space-y-1.5 max-h-[220px] overflow-y-auto pr-1">
              {emotionTimeline.map((session) => {
                const isSelected = selected?.date === session.date;
                return (
                  <button
                    key={`chip-${session.date}`}
                    onClick={() => setSelected(isSelected ? null : session)}
                    className="w-full text-left rounded-xl border px-2.5 py-1.5 transition-colors"
                    style={{
                      borderColor: isSelected ? "hsl(var(--gold) / 0.5)" : "hsl(var(--border) / 0.55)",
                      background: isSelected ? "hsl(var(--gold) / 0.11)" : "hsl(var(--card) / 0.35)",
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-ui text-[10px] tracking-[0.2em] uppercase text-foreground/65">{session.date}</span>
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: emotionColor(session.score) }} />
                    </div>
                    <p className="font-display text-xs md:text-sm text-foreground mt-0.5 truncate">{session.label}</p>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        <div className="px-4 md:px-8 mt-3 pb-3">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.date}
                className="max-w-6xl w-full mx-auto rounded-[22px] border border-gold/20 p-4 md:p-5 backdrop-blur-2xl"
                initial={{ opacity: 0, y: 14, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                style={{
                  background: "linear-gradient(165deg, hsl(228 35% 16% / 0.9), hsl(244 42% 11% / 0.93))",
                }}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: emotionColor(selected.score) }} />
                    <span className="font-display text-lg md:text-xl text-foreground">{selected.label}</span>
                    <span className="font-ui text-xs text-muted-foreground bg-muted/35 px-2 py-0.5 rounded-full">
                      {selected.topic}
                    </span>
                  </div>
                  <span className="font-ui text-xs text-muted-foreground">{selected.date}/2026</span>
                </div>

                <p className="font-body text-base md:text-lg text-foreground/88 leading-relaxed mb-2.5">{selected.summary}</p>
                <div className="border-l-2 border-gold/35 pl-4">
                  <p className="font-body text-base md:text-lg italic text-foreground/90">"{selected.quote}"</p>
                </div>
              </motion.div>
            ) : (
              <motion.p
                className="text-center font-ui text-xs md:text-sm text-muted-foreground/55 mt-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Chạm vào một điểm để xem insight
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default EmotionChart;
