import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { innerCharacters, characterLinks, type InnerCharacter, type CharacterLink } from "@/data/mockPremiumData";
import SpotlightTutorial, { type SpotlightStep } from "./SpotlightTutorial";

interface CharacterMapProps {
  onBack: () => void;
}

const nodePositions: Record<string, { x: number; y: number }> = {
  impostor: { x: 35, y: 25 },
  seeker: { x: 65, y: 30 },
  controller: { x: 30, y: 65 },
  avoider: { x: 68, y: 72 },
};

const strengthStyle: Record<string, { dashArray: string; opacity: number; width: number }> = {
  strong: { dashArray: "none", opacity: 0.7, width: 2.5 },
  medium: { dashArray: "6,4", opacity: 0.5, width: 1.8 },
  weak: { dashArray: "3,5", opacity: 0.3, width: 1.2 },
};

const mapTutorialSteps: SpotlightStep[] = [
  {
    id: "map-legend",
    label: "Cách đọc bản đồ",
    message: "Kích thước mỗi node tỉ lệ với số lần xuất hiện — nhân vật nào lớn hơn đang \"chiếm nhiều không gian\" trong tâm trí bạn hơn. Ba kiểu đường nối thể hiện độ mạnh yếu của liên kết giữa các nhân vật.",
    targetSelector: "[data-tutorial='map-legend']",
    position: "bottom",
    delay: 500,
  },
  {
    id: "map-interact",
    label: "Tương tác",
    message: "Nhấn vào bất kỳ nhân vật hoặc đường nối nào để đọc insight từ Socrates — đây là nơi ngôn ngữ diễn giải những gì hình ảnh không thể: ý nghĩa đằng sau mỗi mối liên hệ.",
    targetSelector: "[data-tutorial='map-canvas']",
    position: "bottom",
    delay: 300,
  },
];

const CharacterMap = ({ onBack }: CharacterMapProps) => {
  const [selectedLink, setSelectedLink] = useState<CharacterLink | null>(null);
  const [selectedChar, setSelectedChar] = useState<InnerCharacter | null>(null);
  const [tutorialActive, setTutorialActive] = useState(true);

  const maxAppearances = Math.max(...innerCharacters.map((c) => c.appearances));
  const getNodeSize = (appearances: number) => 48 + (appearances / maxAppearances) * 40;

  return (
    <div className="min-h-screen bg-background">
      <SpotlightTutorial steps={mapTutorialSteps} active={tutorialActive} onComplete={() => setTutorialActive(false)} />

      <motion.header className="flex items-center gap-3 px-6 py-4 border-b border-border/50" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-card transition-colors text-muted-foreground">
          <ArrowLeft size={20} />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg text-foreground">Bản đồ nhân vật</h2>
            <span className="font-ui text-[10px] text-gold bg-gold/10 px-2 py-0.5 rounded-full flex items-center gap-1"><Sparkles size={10} /> Premium</span>
          </div>
          <p className="font-ui text-xs text-muted-foreground">Mối liên hệ giữa các nhân vật nội tâm</p>
        </div>
      </motion.header>

      <div className="max-w-2xl mx-auto px-6 py-6">
        <motion.div data-tutorial="map-legend" className="flex items-center gap-6 mb-4 justify-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          {[
            { label: "Liên kết mạnh", dash: "none", w: 2.5 },
            { label: "Trung bình", dash: "6,4", w: 1.8 },
            { label: "Yếu", dash: "3,5", w: 1.2 },
          ].map((l) => (
            <div key={l.label} className="flex items-center gap-2">
              <svg width="24" height="6">
                <line x1="0" y1="3" x2="24" y2="3" stroke="hsl(var(--gold-muted))" strokeWidth={l.w} strokeDasharray={l.dash === "none" ? undefined : l.dash} />
              </svg>
              <span className="font-ui text-[10px] text-muted-foreground">{l.label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div data-tutorial="map-canvas" className="relative bg-card border border-border/60 rounded-xl overflow-hidden" style={{ height: 400 }} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {characterLinks.map((link) => {
              const from = nodePositions[link.from];
              const to = nodePositions[link.to];
              if (!from || !to) return null;
              const style = strengthStyle[link.strength];
              return (
                <line key={`${link.from}-${link.to}`} x1={`${from.x}%`} y1={`${from.y}%`} x2={`${to.x}%`} y2={`${to.y}%`}
                  stroke="hsl(var(--gold-muted))" strokeWidth={style.width}
                  strokeDasharray={style.dashArray === "none" ? undefined : style.dashArray}
                  opacity={style.opacity} className="pointer-events-auto cursor-pointer"
                  onClick={() => setSelectedLink(selectedLink === link ? null : link)} strokeLinecap="round"
                />
              );
            })}
          </svg>

          {innerCharacters.map((char, i) => {
            const pos = nodePositions[char.id];
            if (!pos) return null;
            const size = getNodeSize(char.appearances);
            const isSelected = selectedChar?.id === char.id;
            return (
              <motion.button key={char.id} className="absolute rounded-full flex flex-col items-center justify-center border-2 cursor-pointer transition-shadow"
                style={{
                  left: `${pos.x}%`, top: `${pos.y}%`, width: size, height: size,
                  transform: "translate(-50%, -50%)",
                  backgroundColor: `hsl(var(--${char.color}) / 0.15)`,
                  borderColor: isSelected ? `hsl(var(--${char.color}))` : `hsl(var(--${char.color}) / 0.3)`,
                  boxShadow: isSelected ? `0 0 20px hsl(var(--${char.color}) / 0.3)` : "none",
                }}
                onClick={() => { setSelectedChar(isSelected ? null : char); setSelectedLink(null); }}
                initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.1, type: "spring", stiffness: 200 }}
                whileHover={{ scale: 1.1 }}
              >
                <span className="text-sm font-display" style={{ color: `hsl(var(--${char.color}))` }}>{char.icon}</span>
              </motion.button>
            );
          })}

          {innerCharacters.map((char) => {
            const pos = nodePositions[char.id];
            if (!pos) return null;
            const size = getNodeSize(char.appearances);
            return (
              <div key={`label-${char.id}`} className="absolute pointer-events-none text-center" style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: `translate(-50%, ${size / 2 + 8}px)` }}>
                <span className="font-display text-xs text-foreground">{char.name}</span>
                <span className="block font-ui text-[10px] text-muted-foreground/60">{char.appearances} lần</span>
              </div>
            );
          })}
        </motion.div>

        <AnimatePresence mode="wait">
          {(selectedLink || selectedChar) && (
            <motion.div key={selectedLink ? `link-${selectedLink.from}-${selectedLink.to}` : `char-${selectedChar?.id}`} className="mt-4 bg-card border border-border/60 rounded-xl p-5" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              {selectedLink && (
                <>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-display text-sm text-foreground">{innerCharacters.find((c) => c.id === selectedLink.from)?.name}</span>
                    <svg width="20" height="6"><line x1="0" y1="3" x2="20" y2="3" stroke="hsl(var(--gold-muted))" strokeWidth={strengthStyle[selectedLink.strength].width} strokeDasharray={strengthStyle[selectedLink.strength].dashArray === "none" ? undefined : strengthStyle[selectedLink.strength].dashArray} /></svg>
                    <span className="font-display text-sm text-foreground">{innerCharacters.find((c) => c.id === selectedLink.to)?.name}</span>
                  </div>
                  <p className="font-ui text-xs text-gold-muted mb-2">Socrates nhận thấy</p>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{selectedLink.insight}</p>
                </>
              )}
              {selectedChar && !selectedLink && (
                <>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="w-8 h-8 rounded-full flex items-center justify-center text-sm" style={{ backgroundColor: `hsl(var(--${selectedChar.color}) / 0.15)`, color: `hsl(var(--${selectedChar.color}))` }}>{selectedChar.icon}</span>
                    <div>
                      <h4 className="font-display text-sm text-foreground">{selectedChar.name}</h4>
                      <p className="font-ui text-[11px] text-muted-foreground">{selectedChar.description}</p>
                    </div>
                  </div>
                  <p className="font-ui text-xs text-gold-muted mb-2">Socrates nhận thấy</p>
                  <p className="font-body text-sm text-muted-foreground leading-relaxed">{selectedChar.socratesNote}</p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!selectedLink && !selectedChar && (
          <motion.p className="text-center font-ui text-sm text-muted-foreground/50 mt-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
            Nhấn vào nhân vật hoặc đường nối để xem insight
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default CharacterMap;
