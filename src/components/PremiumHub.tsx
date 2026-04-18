import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, BookOpen, GitBranch, Sparkles } from "lucide-react";

interface PremiumHubProps {
  onBack: () => void;
  onViewChart: () => void;
  onViewDictionary: () => void;
  onViewMap: () => void;
}

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
      size: 0.3 + rand() * 1.25,
      opacity: 0.2 + rand() * 0.7,
      twinkle: 2 + rand() * 6,
      delay: rand() * 3,
    });
  }

  return stars;
};

const FeaturePreview = ({ type }: { type: "emotion" | "dictionary" | "map" }) => {
  if (type === "emotion") {
    return (
      <div className="w-full h-full rounded-[22px] border border-white/10 bg-black/30 p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,hsl(45_90%_70%_/_.14),transparent_55%),radial-gradient(circle_at_80%_85%,hsl(220_80%_60%_/_.18),transparent_62%)]" />
        <svg viewBox="0 0 260 180" className="w-full h-full relative z-10">
          <defs>
            <linearGradient id="premium-preview-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="hsl(38 58% 62%)" />
              <stop offset="100%" stopColor="hsl(46 68% 70%)" />
            </linearGradient>
          </defs>
          <polyline
            points="8,122 42,128 86,88 124,104 162,70 208,94 252,66"
            fill="none"
            stroke="url(#premium-preview-line)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {["8,122", "42,128", "86,88", "124,104", "162,70", "208,94", "252,66"].map((p, i) => {
            const [cx, cy] = p.split(",");
            return <circle key={i} cx={cx} cy={cy} r="5" fill={i % 3 === 0 ? "hsl(var(--destructive))" : "hsl(var(--gold))"} />;
          })}
        </svg>
      </div>
    );
  }

  if (type === "dictionary") {
    return (
      <div className="w-full h-full rounded-[22px] border border-white/10 bg-black/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,hsl(45_90%_70%_/_.12),transparent_55%),radial-gradient(circle_at_82%_86%,hsl(265_70%_60%_/_.14),transparent_58%)]" />
        <div className="absolute left-[20%] top-[20%] w-[34%] h-[64%] rounded-2xl border border-gold/30 bg-gradient-to-b from-white/10 to-transparent rotate-[-10deg]" />
        <div className="absolute left-[38%] top-[14%] w-[34%] h-[64%] rounded-2xl border border-gold/45 bg-gradient-to-b from-gold/20 to-transparent" />
        <div className="absolute left-[54%] top-[22%] w-[34%] h-[64%] rounded-2xl border border-gold/32 bg-gradient-to-b from-white/10 to-transparent rotate-[9deg]" />
        <div className="absolute left-[50%] top-[46%] -translate-x-1/2 text-gold text-3xl">◉</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-[22px] border border-white/10 bg-black/30 p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,hsl(45_90%_70%_/_.12),transparent_55%),radial-gradient(circle_at_80%_84%,hsl(220_80%_60%_/_.16),transparent_60%)]" />
      <svg viewBox="0 0 260 180" className="w-full h-full relative z-10">
        <line x1="34" y1="128" x2="112" y2="84" stroke="hsl(var(--gold) / 0.6)" strokeWidth="2.6" />
        <line x1="112" y1="84" x2="204" y2="70" stroke="hsl(var(--gold) / 0.75)" strokeWidth="2.6" />
        <line x1="112" y1="84" x2="186" y2="132" stroke="hsl(var(--gold) / 0.35)" strokeWidth="2" strokeDasharray="3 6" />
        {["34,128", "112,84", "204,70", "186,132"].map((p, i) => {
          const [cx, cy] = p.split(",");
          return <circle key={i} cx={cx} cy={cy} r={i === 1 ? "5.5" : "4.2"} fill="hsl(40 90% 92%)" />;
        })}
      </svg>
    </div>
  );
};

const PremiumHub = ({
  onBack,
  onViewChart,
  onViewDictionary,
  onViewMap,
}: PremiumHubProps) => {
  const stars = useMemo(() => generateAmbientStars(64, 19), []);

  const features = [
    {
      icon: TrendingUp,
      title: "Hành trình cảm xúc",
      description: "Theo dõi nhịp cảm xúc và mở lại insight theo từng phiên.",
      preview: "emotion" as const,
      accent: "linear-gradient(165deg, hsl(227 36% 17% / 0.92), hsl(246 40% 12% / 0.94))",
      onClick: onViewChart,
    },
    {
      icon: BookOpen,
      title: "Từ điển nội tâm",
      description: "Khám phá các archetype tâm lý và ngữ cảnh lặp lại của bạn.",
      preview: "dictionary" as const,
      accent: "linear-gradient(165deg, hsl(241 36% 18% / 0.92), hsl(262 42% 13% / 0.94))",
      onClick: onViewDictionary,
    },
    {
      icon: GitBranch,
      title: "Bản đồ nhân vật",
      description: "Nhìn mối liên hệ giữa các nhân vật nội tâm dưới dạng chòm sao.",
      preview: "map" as const,
      accent: "linear-gradient(165deg, hsl(225 36% 16% / 0.92), hsl(238 40% 11% / 0.94))",
      onClick: onViewMap,
    },
  ];

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
            key={`premium-star-${index}`}
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

      <div className="absolute left-[8%] top-[20%] h-56 w-56 rounded-full bg-gold/10 blur-[95px] pointer-events-none" />
      <div className="absolute right-[14%] bottom-[12%] h-64 w-64 rounded-full bg-violet-500/12 blur-[110px] pointer-events-none" />

      <motion.header
        className="absolute top-0 left-0 right-0 z-30 flex items-center gap-3 px-4 md:px-8 pt-5 md:pt-6"
        style={{ paddingTop: "max(1.25rem, env(safe-area-inset-top))" }}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <button
          onClick={onBack}
          className="group flex items-center gap-2 px-3 py-2 rounded-xl border border-border/40 bg-black/20 text-foreground/75 hover:text-foreground hover:bg-black/35 transition-colors"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          <span className="font-ui text-[10px] tracking-[0.25em] uppercase">Quay lại</span>
        </button>
      </motion.header>

      <div
        className="relative z-20 min-h-dvh md:min-h-screen max-w-7xl mx-auto px-4 md:px-7 pt-[88px] md:pt-[90px] pb-3 md:pb-4 flex flex-col"
        style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}
      >
        <motion.div
          className="text-center mb-4 md:mb-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-ui text-[10px] tracking-[0.3em] uppercase text-gold mb-2">✦ Premium</p>
          <h1 className="font-display text-2xl md:text-4xl text-foreground mb-2 leading-tight">
            Hiểu sâu hơn về chính mình
          </h1>
          <p className="font-body text-xs md:text-sm text-foreground/70 italic max-w-2xl mx-auto">
            Những công cụ giúp bạn nhìn thấy điều mà bản thân không thể tự nhận ra.
          </p>
          <div className="w-14 h-px bg-gold-muted/60 mx-auto mt-3" />
        </motion.div>

        <div className="flex-1 min-h-0">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4 md:h-full pb-3 md:pb-0">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.button
                key={i}
                onClick={feature.onClick}
                className="w-full h-[336px] sm:h-[360px] md:h-[420px] xl:h-[450px] rounded-[30px] border border-border/55 text-left transition-all group overflow-hidden"
                style={{ background: feature.accent, willChange: "transform, opacity" }}
                initial={{ opacity: 0, y: 12, scale: 0.99 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, delay: 0.12 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.01, y: -2 }}
              >
                <div className="h-full flex flex-col">
                  <div className="h-[54%] p-3.5 pb-2.5 md:p-4 md:pb-3">
                    <FeaturePreview type={feature.preview} />
                  </div>

                  <div className="h-[46%] px-3.5 pb-3.5 md:px-4 md:pb-4 flex flex-col">
                    <div className="min-w-0">
                      <p className="font-ui text-[10px] tracking-[0.22em] uppercase text-gold/75 mb-1.5">Premium Insight</p>
                      <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold-muted/20 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors mb-2">
                        <Icon size={17} className="text-gold" />
                      </div>
                      <h3 className="font-display text-[1.25rem] md:text-[1.4rem] text-foreground mb-1 leading-tight">{feature.title}</h3>
                      <p className="font-body text-sm md:text-[15px] text-foreground/75 leading-relaxed line-clamp-3">{feature.description}</p>
                    </div>

                    <div className="flex items-center justify-between gap-2 mt-auto pt-2">
                      <span className="font-ui text-[11px] text-muted-foreground tracking-wide">Tap để mở</span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/16 border border-gold/30 text-gold font-ui text-[11px] tracking-wide">
                        Khám phá
                        <Sparkles size={12} />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumHub;
