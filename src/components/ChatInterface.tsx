import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Sparkles } from "lucide-react";
import socratesBust from "@/assets/socrates-bust.png";
import SpotlightTutorial, { type SpotlightStep } from "./SpotlightTutorial";

interface Message {
  id: number;
  text: string;
  sender: "user" | "socrates";
}

const socratesResponses = [
  "Điều gì khiến bạn cảm thấy như vậy vào lúc này?",
  "Nếu bạn bước ra khỏi tình huống đó và nhìn lại, bạn sẽ thấy điều gì?",
  "Cảm xúc đó đang cố gắng nói với bạn điều gì?",
  "Bạn nghĩ điều gì sẽ thay đổi nếu bạn nhìn từ góc độ của người kia?",
  "Trong tất cả những điều bạn vừa kể, điều nào khiến bạn đau nhất?",
  "Bạn muốn mọi thứ thay đổi theo hướng nào?",
  "Nỗi sợ thực sự phía sau cảm xúc này là gì?",
  "Nếu một người bạn thân kể cho bạn câu chuyện này, bạn sẽ hỏi họ điều gì?",
];

const chatTutorialSteps: SpotlightStep[] = [
  {
    id: "intro",
    label: "Cách trò chuyện",
    message: "Đây là không gian riêng tư của bạn. Hãy chia sẻ bất cứ điều gì — Socrates sẽ lắng nghe và đặt những câu hỏi phản tư giúp bạn hiểu rõ hơn chính mình.",
    targetSelector: "[data-tutorial='socrates-question']",
    position: "bottom",
    delay: 4500,
  },
  {
    id: "summarize-hint",
    label: "Khi đã sẵn sàng",
    message: "Nhấn \"Đúc kết\" để Socrates phân tích cuộc trò chuyện.",
    targetSelector: "[data-tutorial='summarize-btn']",
    position: "bottom",
    delay: 600,
  },
];

interface ChatInterfaceProps {
  onSummarize: () => void;
  onPremium: () => void;
}

type Phase = "greeting" | "idle-waiting" | "user-typing" | "transitioning" | "socrates-speaking";

const ChatInterface = ({ onSummarize, onPremium }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [liveText, setLiveText] = useState("");
  const [phase, setPhase] = useState<Phase>("greeting");
  const [socratesQuestion, setSocratesQuestion] = useState("");
  const [fadedMessages, setFadedMessages] = useState<Message[]>([]);
  const [showTutorial, setShowTutorial] = useState(true);
  const [summarizeTutorialShown, setSummarizeTutorialShown] = useState(false);
  const [tutorialSteps, setTutorialSteps] = useState<SpotlightStep[]>([chatTutorialSteps[0]]);
  const [exchangeCount, setExchangeCount] = useState(0);
  const responseIndex = useRef(0);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (phase === "idle-waiting" || phase === "user-typing") {
      hiddenInputRef.current?.focus();
    }
  }, [phase]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const greeting = "Chào bạn. Tôi là Socrates.\nTôi không ở đây để khuyên bạn điều gì —\ntôi chỉ muốn lắng nghe và cùng bạn suy ngẫm.\n\nHãy kể cho tôi, hôm nay bạn cảm thấy thế nào?";
      setSocratesQuestion(greeting);
      setPhase("socrates-speaking");
      setTimeout(() => setPhase("idle-waiting"), 3500);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Show summarize tutorial after 3 exchanges
  useEffect(() => {
    if (exchangeCount >= 3 && !summarizeTutorialShown) {
      setSummarizeTutorialShown(true);
      setTutorialSteps([chatTutorialSteps[1]]);
      setShowTutorial(true);
    }
  }, [exchangeCount, summarizeTutorialShown]);

  const handleTutorialComplete = useCallback(() => {
    setShowTutorial(false);
    setTimeout(() => hiddenInputRef.current?.focus(), 100);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (phase !== "idle-waiting" && phase !== "user-typing") return;
    if (e.key === "Enter" && !e.shiftKey && liveText.trim()) {
      e.preventDefault();
      const userMsg: Message = { id: Date.now(), text: liveText.trim(), sender: "user" };
      setMessages((prev) => [...prev, userMsg]);
      setFadedMessages((prev) => [...prev, userMsg]);
      setPhase("transitioning");
      setLiveText("");

      setTimeout(() => {
        const response = socratesResponses[responseIndex.current % socratesResponses.length];
        responseIndex.current++;
        const socratesMsg: Message = { id: Date.now() + 1, text: response, sender: "socrates" };
        setMessages((prev) => [...prev, socratesMsg]);
        setSocratesQuestion(response);
        setFadedMessages((prev) => [...prev, socratesMsg]);
        setPhase("socrates-speaking");
        setExchangeCount((prev) => prev + 1);
        setTimeout(() => setPhase("idle-waiting"), 3000);
      }, 1500);
    }
  }, [phase, liveText]);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (phase !== "idle-waiting" && phase !== "user-typing") return;
    setLiveText(e.target.value);
    if (e.target.value.length > 0 && phase === "idle-waiting") setPhase("user-typing");
    if (e.target.value.length === 0 && phase === "user-typing") setPhase("idle-waiting");
  }, [phase]);

  const handleScreenClick = useCallback(() => {
    if (phase === "idle-waiting" || phase === "user-typing") hiddenInputRef.current?.focus();
  }, [phase]);

  const showCursor = phase === "idle-waiting" || phase === "user-typing";

  return (
    <div className="min-h-screen flex flex-col bg-background/90 relative overflow-hidden cursor-text" onClick={handleScreenClick}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] rounded-full bg-gold/3 blur-[120px] animate-breathe" />
      </div>

      <input
        ref={hiddenInputRef}
        value={liveText}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        className="absolute opacity-0 pointer-events-none"
        style={{ position: "fixed", top: -100 }}
        autoFocus
      />

      <SpotlightTutorial steps={tutorialSteps} active={showTutorial} onComplete={handleTutorialComplete} />

      {/* Top bar */}
      <motion.header
        className="flex items-center justify-between px-6 py-4 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <motion.img
            src={socratesBust}
            alt="Socrates"
            className="w-9 h-9 rounded-full object-cover bg-sage-light"
            animate={{ opacity: phase === "socrates-speaking" ? 1 : 0.5, scale: phase === "socrates-speaking" ? 1.05 : 1 }}
            transition={{ duration: 0.8 }}
          />
          <AnimatePresence mode="wait">
            <motion.span key={phase} className="font-ui text-xs text-muted-foreground tracking-wide" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
              {phase === "socrates-speaking" ? "Socrates đang suy ngẫm..." : phase === "transitioning" ? "Đang lắng nghe..." : ""}
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            onClick={(e) => { e.stopPropagation(); onPremium(); }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-gold-muted/30 text-gold font-ui text-sm hover:border-gold-muted hover:bg-card transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Sparkles size={14} />
            Premium
          </motion.button>
          <motion.button
            data-tutorial="summarize-btn"
            onClick={(e) => { e.stopPropagation(); onSummarize(); }}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border/40 text-muted-foreground font-ui text-sm hover:border-gold-muted hover:text-foreground transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <BookOpen size={15} />
            Đúc kết
          </motion.button>
        </div>
      </motion.header>

      {/* Center stage */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-full max-w-lg flex flex-col items-center gap-2 pointer-events-none">
          <AnimatePresence>
            {fadedMessages.slice(-4).map((msg, i, arr) => (
              <motion.p key={msg.id} className={`text-center font-body text-sm leading-relaxed max-w-md ${msg.sender === "socrates" ? "italic text-gold-muted" : "text-muted-foreground"}`} initial={{ opacity: 0.4 }} animate={{ opacity: Math.max(0.06, (i + 1) / arr.length * 0.2) }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
                {msg.text.length > 80 ? msg.text.slice(0, 80) + "…" : msg.text}
              </motion.p>
            ))}
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {(phase === "socrates-speaking" || phase === "idle-waiting" || phase === "user-typing") && socratesQuestion && (
            <motion.div
              key="socrates-q"
              data-tutorial="socrates-question"
              className="flex flex-col items-center text-center max-w-lg px-4 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: phase === "user-typing" ? 0.4 : 1, y: phase === "user-typing" ? -20 : 0, scale: phase === "user-typing" ? 0.95 : 1 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <motion.span className="font-display text-xs text-gold-muted/60 tracking-[0.2em] uppercase mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>Socrates</motion.span>
              <p className="font-body text-xl md:text-2xl leading-relaxed whitespace-pre-line italic text-foreground">{socratesQuestion}</p>
              <motion.div className="w-12 h-px bg-gold-muted/30 mt-6" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.4, duration: 0.6 }} />
            </motion.div>
          )}
        </AnimatePresence>

        {showCursor && (
          <motion.div className="max-w-lg w-full px-4 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            <p className="font-body text-xl md:text-2xl leading-relaxed text-foreground min-h-[2em] inline">
              {liveText}
              <motion.span className="inline-block w-[2px] h-[1.2em] bg-gold ml-0.5 align-text-bottom" animate={{ opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }} />
            </p>
            {phase === "idle-waiting" && !liveText && (
              <motion.p className="font-body text-lg text-muted-foreground/30 italic" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>Hãy bắt đầu gõ để chia sẻ...</motion.p>
            )}
          </motion.div>
        )}

        <AnimatePresence>
          {phase === "transitioning" && (
            <motion.div className="flex gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              {[0, 1, 2].map((i) => (
                <motion.div key={i} className="w-2 h-2 rounded-full bg-gold-muted/50" animate={{ opacity: [0.2, 0.8, 0.2], y: [0, -4, 0] }} transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <motion.div className="relative z-10 px-6 pb-6 pt-2">
        <motion.p className="text-center font-ui text-[11px] text-muted-foreground/30 tracking-wide" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
          Nhấn Enter để gửi · Nhấn "Đúc kết" khi bạn muốn dừng lại
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ChatInterface;
