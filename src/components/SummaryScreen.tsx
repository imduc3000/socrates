import { useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, Lightbulb, Compass, Sparkles } from "lucide-react";
import socratesBust from "@/assets/socrates-bust.png";

interface SummaryScreenProps {
  onBack: () => void;
  onNewSession: () => void;
  onPremium: () => void;
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

const SummaryScreen = ({ onBack, onNewSession, onPremium }: SummaryScreenProps) => {
  const stars = useMemo(() => generateAmbientStars(55, 37), []);

  const insights = [
    {
      icon: Eye,
      title: "Điểm mù nhận ra",
      content:
        "Bạn có xu hướng đặt kỳ vọng rất cao vào bản thân nhưng lại không cho phép mình được nghỉ ngơi. Sự mệt mỏi không đến từ công việc — mà đến từ việc bạn luôn cảm thấy mình chưa đủ tốt.",
    },
    {
      icon: Lightbulb,
      title: "Cảm xúc cốt lõi",
      content:
        "Phía sau sự lo âu là nỗi sợ bị bỏ rơi và không được công nhận. Đây là một cảm xúc rất con người và hoàn toàn có thể hiểu được.",
    },
    {
      icon: Compass,
      title: "Góc nhìn đa chiều",
      content:
        "Thay vì hỏi \"Mình đã làm đủ chưa?\", hãy thử hỏi \"Mình đang sống đúng với giá trị của mình không?\". Câu hỏi thứ hai mang lại sự bình yên hơn.",
    },
  ];

  return (
    <div
      className="fixed inset-0 overflow-y-auto md:overflow-hidden overscroll-y-contain"
      style={{
        background:
          "radial-gradient(ellipse at 18% 12%, hsl(252 45% 14%) 0%, transparent 55%), radial-gradient(ellipse at 88% 86%, hsl(281 40% 16%) 0%, transparent 50%), radial-gradient(ellipse at 50% 45%, hsl(230 52% 8%) 0%, hsl(225 54% 4%) 100%)",
      }}
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {stars.map((star, index) => (
          <circle
            key={`summary-star-${index}`}
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

      <div className="absolute left-[9%] top-[18%] h-56 w-56 rounded-full bg-gold/8 blur-[95px] pointer-events-none" />
      <div className="absolute right-[12%] bottom-[14%] h-72 w-72 rounded-full bg-violet-500/10 blur-[120px] pointer-events-none" />

      <motion.header
        className="absolute top-0 left-0 right-0 z-30 flex items-center gap-3 px-4 md:px-6 pb-3 border-b border-border/30 backdrop-blur-xl bg-black/15"
        style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-white/5 transition-colors text-muted-foreground"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-display text-lg text-foreground">Đúc kết</h2>
      </motion.header>

      <div
        className="relative z-20 min-h-screen md:h-screen w-full px-4 md:px-10 xl:px-16 pt-[90px] md:pt-[98px] pb-7 flex flex-col"
        style={{ paddingBottom: "max(1.75rem, env(safe-area-inset-bottom))" }}
      >
        <motion.div
          className="text-center mb-5 md:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img src={socratesBust} alt="Socrates" className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-2 animate-float" />
          <h1 className="font-display text-[2rem] md:text-[2.6rem] text-foreground leading-tight">Tổng kết cuộc trò chuyện</h1>
          <p className="font-body text-sm md:text-base text-muted-foreground italic mt-1">"Biết chính mình là khởi đầu của mọi trí tuệ."</p>
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-gold-muted to-transparent mx-auto mt-2.5" />
        </motion.div>

        <div className="flex-1 flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 xl:gap-7">
            {insights.map((insight, i) => {
              const Icon = insight.icon;
              return (
                <motion.div
                  key={i}
                  className="rounded-2xl border border-gold/15 p-4 md:p-5.5 flex flex-col backdrop-blur-xl min-h-[170px] md:h-[236px]"
                  style={{
                    background: "linear-gradient(165deg, hsl(229 30% 16% / 0.84), hsl(244 32% 12% / 0.88))",
                    boxShadow:
                      "0 10px 24px hsl(225 50% 3% / 0.22), 0 0 0 1px hsl(38 50% 60% / 0.05), inset 0 1px 0 hsl(38 50% 70% / 0.08)",
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: 0.15 + i * 0.1 }}
                >
                  <div className="flex items-center gap-2.5 mb-2.5 md:mb-3">
                    <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg border border-gold/30 bg-gold/10 flex items-center justify-center shrink-0">
                      <Icon size={19} className="text-gold" />
                    </div>
                    <h3 className="font-display text-base md:text-lg text-foreground leading-tight">{insight.title}</h3>
                  </div>
                  <p
                    className="font-body text-[13px] md:text-[14px] leading-relaxed text-foreground/80"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {insight.content}
                  </p>
                </motion.div>
              );
            })}
          </div>

          <motion.div
            className="mt-6 px-4 py-2.5 rounded-xl border border-border/45 text-center backdrop-blur-xl"
            style={{ background: "hsl(232 28% 16% / 0.72)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.5 }}
          >
            <p className="font-body text-xs md:text-sm text-muted-foreground/90">
              ⚠️ Socrates không thay thế bác sĩ tâm lý. Nếu bạn cần hỗ trợ chuyên môn, hãy liên hệ chuyên gia tâm lý.
            </p>
          </motion.div>

          <motion.div
            className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.65 }}
          >
            <button
              onClick={onPremium}
              className="px-3 md:px-4 py-2.5 md:py-3 rounded-2xl bg-gold/10 border border-gold-muted/40 text-gold font-ui text-xs md:text-sm tracking-wide hover:bg-gold/20 hover:border-gold-muted transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles size={14} />
              Khám phá Premium
            </button>
            <button
              onClick={onNewSession}
              className="px-3 md:px-4 py-2.5 md:py-3 rounded-2xl bg-primary text-primary-foreground font-ui text-xs md:text-sm tracking-wide hover:shadow-lg hover:shadow-gold/20 transition-all"
            >
              Bắt đầu cuộc trò chuyện mới
            </button>
            <button
              onClick={onBack}
              className="px-3 md:px-4 py-2.5 md:py-3 rounded-2xl bg-card/40 border border-border text-foreground font-ui text-xs md:text-sm hover:border-gold-muted transition-colors"
            >
              Quay lại trò chuyện
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SummaryScreen;
