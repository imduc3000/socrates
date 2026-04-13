import { motion } from "framer-motion";
import { ArrowLeft, Eye, Lightbulb, Compass, Sparkles } from "lucide-react";
import socratesBust from "@/assets/socrates-bust.png";

interface SummaryScreenProps {
  onBack: () => void;
  onNewSession: () => void;
  onPremium: () => void;
}

const SummaryScreen = ({ onBack, onNewSession, onPremium }: SummaryScreenProps) => {
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
    <div className="min-h-screen bg-background">
      <motion.header
        className="flex items-center gap-3 px-6 py-4 border-b border-border/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-card transition-colors text-muted-foreground">
          <ArrowLeft size={20} />
        </button>
        <h2 className="font-display text-lg text-foreground">Đúc kết</h2>
      </motion.header>

      <div className="max-w-2xl mx-auto px-6 py-8">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img src={socratesBust} alt="Socrates" className="w-20 h-20 mx-auto mb-4 animate-float" />
          <h1 className="font-display text-2xl md:text-3xl text-foreground mb-2">Tổng kết cuộc trò chuyện</h1>
          <p className="font-body text-muted-foreground italic">"Biết chính mình là khởi đầu của mọi trí tuệ."</p>
          <div className="w-12 h-px bg-gold-muted mx-auto mt-4" />
        </motion.div>

        <div className="space-y-5">
          {insights.map((insight, i) => {
            const Icon = insight.icon;
            return (
              <motion.div
                key={i}
                className="bg-card border border-border/60 rounded-xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.2 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-lg bg-sage-light flex items-center justify-center">
                    <Icon size={18} className="text-gold" />
                  </div>
                  <h3 className="font-display text-base text-foreground">{insight.title}</h3>
                </div>
                <p className="font-body text-base leading-relaxed text-muted-foreground">{insight.content}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="mt-8 p-5 rounded-xl bg-card/50 border border-border/40 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          <p className="font-body text-sm text-muted-foreground">
            ⚠️ Socrates không thay thế bác sĩ tâm lý. Nếu bạn cần hỗ trợ chuyên môn, hãy liên hệ chuyên gia tâm lý.
          </p>
        </motion.div>

        <motion.div
          className="mt-8 flex flex-col sm:flex-row gap-3 justify-center"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.5 }}
        >
          <button
            onClick={onPremium}
            className="px-6 py-3 rounded-full bg-gold/10 border border-gold-muted/40 text-gold font-ui text-sm tracking-wide hover:bg-gold/20 hover:border-gold-muted transition-all flex items-center justify-center gap-2"
          >
            <Sparkles size={14} />
            Khám phá Premium
          </button>
          <button
            onClick={onNewSession}
            className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-ui text-sm tracking-wide hover:shadow-lg hover:shadow-gold/20 transition-all"
          >
            Bắt đầu cuộc trò chuyện mới
          </button>
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-full bg-card border border-border text-foreground font-ui text-sm hover:border-gold-muted transition-colors"
          >
            Quay lại trò chuyện
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default SummaryScreen;
