import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Minus, Plus, Sparkles } from "lucide-react";
import { innerCharacters, type InnerCharacter } from "@/data/mockPremiumData";
import SpotlightTutorial, { type SpotlightStep } from "./SpotlightTutorial";

interface InnerDictionaryProps {
  onBack: () => void;
  onViewMap: () => void;
  onStartSession: (characterId: string) => void;
}

const dictionaryTutorialSteps: SpotlightStep[] = [
  {
    id: "dict-intro",
    label: "Từ điển nội tâm",
    message: "Socrates phân tích ngầm sau mỗi phiên tâm sự để tìm ra các pattern tâm lý lặp lại. Mỗi pattern được đặt tên như một \"nhân vật\" — giúp bạn nhìn nhận chúng như thực thể riêng biệt, không phải khuyết điểm.",
    position: "center",
    delay: 500,
  },
  {
    id: "dict-character",
    label: "Nhân vật nội tâm",
    message: "Nhấn vào một nhân vật để xem chi tiết: Socrates đã nhận ra điều gì, trích dẫn từ chính bạn, và nút \"Phá vỡ vòng lặp\" — mở phiên tâm sự mới với câu hỏi được thiết kế riêng cho nhân vật đó.",
    targetSelector: "[data-tutorial='character-card-0']",
    position: "bottom",
    delay: 300,
  },
];

const CharacterCard = ({
  character, isExpanded, onToggle, onStartSession, index,
}: {
  character: InnerCharacter; isExpanded: boolean; onToggle: () => void; onStartSession: () => void; index: number;
}) => {
  const isLatest = index === 0;
  return (
    <motion.div
      data-tutorial={`character-card-${index}`}
      className="bg-card border border-border/60 rounded-xl overflow-hidden"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.1 }}
    >
      <button onClick={onToggle} className="w-full flex items-center gap-3 p-5 text-left hover:bg-muted/30 transition-colors">
        <span className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-display shrink-0" style={{ backgroundColor: `hsl(var(--${character.color}) / 0.15)`, color: `hsl(var(--${character.color}))` }}>
          {character.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display text-base text-foreground">{character.name}</h3>
            {isLatest && <span className="font-ui text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full">mới nhất</span>}
          </div>
          <p className="font-body text-sm text-muted-foreground mt-0.5 truncate">{character.description}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="font-ui text-[11px] text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">xuất hiện {character.appearances} lần</span>
            <span className="font-ui text-[11px] text-muted-foreground">lần đầu: {character.firstSeen}</span>
          </div>
        </div>
        <span className="text-muted-foreground shrink-0">{isExpanded ? <Minus size={16} /> : <Plus size={16} />}</span>
      </button>
      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <div className="px-5 pb-5 pt-0">
              <div className="border-t border-border/40 pt-4">
                <p className="font-body text-sm text-muted-foreground leading-relaxed">Socrates nhận ra: {character.socratesNote}</p>
                <div className="border-l-2 border-gold-muted/40 pl-4 mt-3">
                  <p className="font-body text-base italic text-foreground/80">"{character.quote}"</p>
                </div>
                <p className="font-ui text-[11px] text-muted-foreground mt-3">Xuất hiện gần nhất: {character.lastSeen} · phiên về {character.sessionTopic}</p>
                <motion.button
                  onClick={(e) => { e.stopPropagation(); onStartSession(); }}
                  className="w-full mt-4 py-3 rounded-xl border border-border text-foreground font-ui text-sm hover:bg-muted/50 transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  Bắt đầu phiên phá vỡ vòng lặp ↗
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const InnerDictionary = ({ onBack, onViewMap, onStartSession }: InnerDictionaryProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(innerCharacters[0].id);
  const [tutorialActive, setTutorialActive] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <SpotlightTutorial steps={dictionaryTutorialSteps} active={tutorialActive} onComplete={() => setTutorialActive(false)} />

      <motion.header className="flex items-center justify-between px-6 py-4 border-b border-border/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-lg hover:bg-card transition-colors text-muted-foreground">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-lg text-foreground">Từ điển nội tâm</h2>
              <span className="font-ui text-[10px] text-gold bg-gold/10 px-2 py-0.5 rounded-full flex items-center gap-1"><Sparkles size={10} /> Premium</span>
            </div>
            <p className="font-ui text-xs text-muted-foreground">{innerCharacters.length} nhân vật · cập nhật hôm nay</p>
          </div>
        </div>
      </motion.header>

      <div className="max-w-2xl mx-auto px-6 py-6">
        <motion.div className="grid grid-cols-3 gap-3 mb-6" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          {[
            { value: innerCharacters.length.toString(), label: "nhân vật" },
            { value: "12", label: "phiên tâm sự" },
            { value: "38", label: "ngày theo dõi" },
          ].map((s, i) => (
            <div key={i} className="bg-card border border-border/60 rounded-xl py-4 text-center">
              <p className="font-display text-2xl text-foreground">{s.value}</p>
              <p className="font-ui text-[11px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </motion.div>

        <div className="space-y-3">
          {innerCharacters.map((char, i) => (
            <CharacterCard
              key={char.id}
              character={char}
              index={i}
              isExpanded={expandedId === char.id}
              onToggle={() => setExpandedId(expandedId === char.id ? null : char.id)}
              onStartSession={() => onStartSession(char.id)}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default InnerDictionary;
