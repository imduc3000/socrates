import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, TrendingUp, BookOpen, GitBranch } from "lucide-react";
import SpotlightTutorial, { type SpotlightStep } from "./SpotlightTutorial";

interface PremiumHubProps {
  onBack: () => void;
  onViewChart: () => void;
  onViewDictionary: () => void;
  onViewMap: () => void;
  /** Which feature index to introduce next (0, 1, 2). Managed by parent. */
  nextFeatureIndex?: number;
  /** Called after a feature tutorial is shown, so parent can advance the index */
  onFeatureIntroduced?: () => void;
}

const featureTutorials: SpotlightStep[] = [
  {
    id: "emotion-chart",
    label: "Hành trình cảm xúc",
    message: "Biểu đồ ghi nhận mỗi phiên tâm sự. Nhấn vào bất kỳ điểm nào để xem tóm tắt — giúp bạn theo dõi xu hướng cảm xúc theo thời gian.",
    targetSelector: "[data-tutorial='feature-emotion']",
    position: "bottom",
    delay: 500,
  },
  {
    id: "dictionary",
    label: "Từ điển nội tâm",
    message: "Socrates phát hiện pattern tâm lý lặp lại và đặt tên cho chúng như \"nhân vật\" — giúp bạn đối thoại và phá vỡ vòng lặp tiêu cực.",
    targetSelector: "[data-tutorial='feature-dictionary']",
    position: "bottom",
    delay: 500,
  },
  {
    id: "map",
    label: "Bản đồ nhân vật",
    message: "Trực quan hoá mối liên hệ giữa các nhân vật nội tâm. Kích thước và đường nối chỉ ra những vòng lặp đang vận hành ngầm.",
    targetSelector: "[data-tutorial='feature-map']",
    position: "top",
    delay: 500,
  },
];

const PremiumHub = ({
  onBack, onViewChart, onViewDictionary, onViewMap,
  nextFeatureIndex = 0, onFeatureIntroduced,
}: PremiumHubProps) => {
  const [tutorialActive, setTutorialActive] = useState(false);

  // Show tutorial for the next feature that hasn't been introduced
  useEffect(() => {
    if (nextFeatureIndex < featureTutorials.length) {
      const timer = setTimeout(() => setTutorialActive(true), 400);
      return () => clearTimeout(timer);
    }
  }, [nextFeatureIndex]);

  const handleTutorialComplete = () => {
    setTutorialActive(false);
    onFeatureIntroduced?.();
  };

  const currentTutorialStep = nextFeatureIndex < featureTutorials.length
    ? [featureTutorials[nextFeatureIndex]]
    : [];

  const features = [
    {
      icon: TrendingUp,
      title: "Hành trình cảm xúc",
      description: "Biểu đồ tổng hợp tất cả phiên tâm sự, theo dõi xu hướng cảm xúc theo thời gian.",
      onClick: onViewChart,
      tutorialId: "feature-emotion",
    },
    {
      icon: BookOpen,
      title: "Từ điển nội tâm",
      description: "Khám phá các nhân vật ẩn trong suy nghĩ — những pattern tâm lý lặp lại được đặt tên và phân tích.",
      onClick: onViewDictionary,
      tutorialId: "feature-dictionary",
    },
    {
      icon: GitBranch,
      title: "Bản đồ nhân vật",
      description: "Trực quan hoá mối liên hệ giữa các pattern tâm lý và nhận diện vòng lặp ngầm.",
      onClick: onViewMap,
      tutorialId: "feature-map",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {currentTutorialStep.length > 0 && (
        <SpotlightTutorial
          steps={currentTutorialStep}
          active={tutorialActive}
          onComplete={handleTutorialComplete}
        />
      )}

      <motion.header
        className="flex items-center gap-3 px-6 py-4 border-b border-border/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-card transition-colors text-muted-foreground">
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-display text-lg text-foreground">Premium</h2>
      </motion.header>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="font-display text-xs tracking-[0.25em] uppercase text-gold mb-3">✦ Premium</p>
          <h1 className="font-display text-2xl md:text-3xl text-foreground mb-3">
            Hiểu sâu hơn về chính mình
          </h1>
          <p className="font-body text-muted-foreground italic max-w-md mx-auto">
            Những công cụ giúp bạn nhìn thấy điều mà bản thân không thể tự nhận ra.
          </p>
          <div className="w-12 h-px bg-gold-muted mx-auto mt-5" />
        </motion.div>

        <div className="space-y-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.button
                key={i}
                data-tutorial={feature.tutorialId}
                onClick={feature.onClick}
                className="w-full p-6 rounded-xl border border-border/60 bg-card/50 text-left hover:border-gold-muted/50 hover:bg-card transition-all group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + i * 0.15 }}
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold-muted/20 flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                    <Icon size={20} className="text-gold" />
                  </div>
                  <div>
                    <h3 className="font-display text-base text-foreground mb-1">{feature.title}</h3>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PremiumHub;
