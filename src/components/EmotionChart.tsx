import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, TrendingUp, Calendar, MessageCircle } from "lucide-react";
import { emotionTimeline, type EmotionPoint } from "@/data/mockPremiumData";
import SpotlightTutorial, { type SpotlightStep } from "./SpotlightTutorial";

interface EmotionChartProps {
  onBack: () => void;
}

const emotionColor = (score: number) => {
  if (score <= 3) return "hsl(var(--destructive))";
  if (score <= 5) return "hsl(var(--gold))";
  if (score <= 7) return "hsl(var(--sage))";
  return "hsl(var(--primary))";
};

const chartTutorialSteps: SpotlightStep[] = [
  {
    id: "chart-stats",
    label: "Tổng quan",
    message: "Đây là tổng quan nhanh về hành trình của bạn — số phiên tâm sự, xu hướng cảm xúc chung, và chủ đề bạn chia sẻ nhiều nhất.",
    targetSelector: "[data-tutorial='chart-stats']",
    position: "bottom",
    delay: 600,
  },
  {
    id: "chart-dots",
    label: "Biểu đồ cảm xúc",
    message: "Mỗi chấm đại diện cho một phiên tâm sự. Vị trí cao = cảm xúc tích cực, thấp = tiêu cực. Hãy nhấn vào bất kỳ chấm nào để xem lại tóm tắt và trích dẫn từ chính bạn.",
    targetSelector: "[data-tutorial='chart-area']",
    position: "bottom",
    delay: 300,
  },
];

const EmotionChart = ({ onBack }: EmotionChartProps) => {
  const [selected, setSelected] = useState<EmotionPoint | null>(null);
  const [tutorialActive, setTutorialActive] = useState(true);

  const maxScore = 10;
  const chartHeight = 200;
  const dotSize = 14;

  return (
    <div className="min-h-screen bg-background">
      <SpotlightTutorial steps={chartTutorialSteps} active={tutorialActive} onComplete={() => setTutorialActive(false)} />

      <motion.header className="flex items-center gap-3 px-6 py-4 border-b border-border/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-card transition-colors text-muted-foreground">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="font-display text-lg text-foreground">Hành trình cảm xúc</h2>
          <p className="font-ui text-xs text-muted-foreground">9 phiên · tháng 3-4/2026</p>
        </div>
      </motion.header>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <motion.div data-tutorial="chart-stats" className="grid grid-cols-3 gap-3 mb-8" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          {[
            { icon: Calendar, label: "phiên tâm sự", value: "9" },
            { icon: TrendingUp, label: "xu hướng", value: "↗ Tích cực" },
            { icon: MessageCircle, label: "chủ đề chính", value: "Công việc" },
          ].map((stat, i) => (
            <div key={i} className="bg-card border border-border/60 rounded-xl p-4 text-center">
              <stat.icon size={16} className="mx-auto mb-2 text-gold-muted" />
              <p className="font-display text-lg text-foreground">{stat.value}</p>
              <p className="font-ui text-[11px] text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        <motion.div data-tutorial="chart-area" className="bg-card border border-border/60 rounded-xl p-6 mb-6" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h3 className="font-display text-sm text-foreground mb-6">Biểu đồ cảm xúc theo thời gian</h3>
          <div className="flex gap-3">
            <div className="flex flex-col justify-between text-right" style={{ height: chartHeight }}>
              <span className="font-ui text-[10px] text-muted-foreground/60">Tích cực</span>
              <span className="font-ui text-[10px] text-muted-foreground/60">Trung tính</span>
              <span className="font-ui text-[10px] text-muted-foreground/60">Tiêu cực</span>
            </div>
            <div className="flex-1 relative" style={{ height: chartHeight }}>
              {[0, 0.25, 0.5, 0.75, 1].map((pct) => (
                <div key={pct} className="absolute left-0 right-0 border-t border-border/30" style={{ top: `${pct * 100}%` }} />
              ))}
              <svg className="absolute inset-0 w-full h-full" viewBox={`0 0 100 ${chartHeight}`} preserveAspectRatio="none">
                <polyline
                  fill="none"
                  stroke="hsl(var(--gold-muted))"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={emotionTimeline.map((p, i) => {
                    const x = (i / (emotionTimeline.length - 1)) * 100;
                    const y = chartHeight - (p.score / maxScore) * chartHeight;
                    return `${x},${y}`;
                  }).join(" ")}
                />
              </svg>
              {emotionTimeline.map((point, i) => {
                const x = (i / (emotionTimeline.length - 1)) * 100;
                const y = ((maxScore - point.score) / maxScore) * 100;
                const isSelected = selected?.date === point.date;
                return (
                  <motion.button
                    key={point.date}
                    className="absolute rounded-full border-2 border-background cursor-pointer z-10 hover:scale-125 transition-transform"
                    style={{
                      left: `${x}%`, top: `${y}%`, width: dotSize, height: dotSize,
                      transform: "translate(-50%, -50%)",
                      backgroundColor: emotionColor(point.score),
                      boxShadow: isSelected ? `0 0 12px ${emotionColor(point.score)}` : "none",
                    }}
                    onClick={() => setSelected(isSelected ? null : point)}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 + i * 0.05 }}
                    whileHover={{ scale: 1.3 }}
                  />
                );
              })}
            </div>
          </div>
          <div className="flex justify-between mt-3 ml-12">
            {emotionTimeline.map((p) => (
              <span key={p.date} className="font-ui text-[10px] text-muted-foreground/50">{p.date}</span>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          {selected && (
            <motion.div key={selected.date} className="bg-card border border-border/60 rounded-xl p-6" initial={{ opacity: 0, y: 15, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -10, height: 0 }} transition={{ duration: 0.4 }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: emotionColor(selected.score) }} />
                  <span className="font-display text-base text-foreground">{selected.label}</span>
                  <span className="font-ui text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{selected.topic}</span>
                </div>
                <span className="font-ui text-xs text-muted-foreground">{selected.date}/2026</span>
              </div>
              <p className="font-body text-base text-muted-foreground leading-relaxed mb-4">{selected.summary}</p>
              <div className="border-l-2 border-gold-muted/40 pl-4">
                <p className="font-body text-base italic text-foreground/80">"{selected.quote}"</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!selected && (
          <motion.p className="text-center font-ui text-sm text-muted-foreground/50 mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            Nhấn vào một điểm trên biểu đồ để xem chi tiết phiên tâm sự
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default EmotionChart;
