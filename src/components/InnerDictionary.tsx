import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Sparkles, Compass, Eye, Shield, Target, Clock3, type LucideIcon } from "lucide-react";
import { innerCharacters, type InnerCharacter } from "@/data/mockPremiumData";
import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from "@/components/ui/carousel";

interface InnerDictionaryProps {
  onBack: () => void;
  onViewMap: () => void;
  onStartSession: (characterId: string) => void;
}

type DeckCard = { id: string; character: InnerCharacter };

const characterThemes: Record<string, { cardBg: string; artGlow: string; edge: string }> = {
  impostor: {
    cardBg: "linear-gradient(165deg, hsl(245 38% 20%) 0%, hsl(236 42% 10%) 100%)",
    artGlow: "radial-gradient(circle at 50% 20%, hsl(38 86% 62% / 0.45) 0%, transparent 65%)",
    edge: "hsl(38 72% 56% / 0.45)",
  },
  seeker: {
    cardBg: "linear-gradient(165deg, hsl(263 42% 22%) 0%, hsl(240 35% 11%) 100%)",
    artGlow: "radial-gradient(circle at 50% 20%, hsl(46 92% 70% / 0.45) 0%, transparent 62%)",
    edge: "hsl(46 88% 65% / 0.45)",
  },
  controller: {
    cardBg: "linear-gradient(165deg, hsl(223 34% 20%) 0%, hsl(232 41% 9%) 100%)",
    artGlow: "radial-gradient(circle at 50% 20%, hsl(205 75% 66% / 0.36) 0%, transparent 62%)",
    edge: "hsl(38 42% 62% / 0.35)",
  },
  avoider: {
    cardBg: "linear-gradient(165deg, hsl(188 36% 18%) 0%, hsl(215 38% 9%) 100%)",
    artGlow: "radial-gradient(circle at 50% 20%, hsl(168 62% 62% / 0.3) 0%, transparent 62%)",
    edge: "hsl(168 60% 62% / 0.35)",
  },
};

const getCharacterTheme = (characterId: string) =>
  characterThemes[characterId] ?? {
    cardBg: "linear-gradient(165deg, hsl(241 34% 19%) 0%, hsl(232 40% 10%) 100%)",
    artGlow: "radial-gradient(circle at 50% 20%, hsl(38 86% 62% / 0.35) 0%, transparent 65%)",
    edge: "hsl(38 70% 58% / 0.35)",
  };

const characterVisuals: Record<string, { Icon: LucideIcon; ring: string; aura: string }> = {
  impostor: {
    Icon: Shield,
    ring: "hsl(40 72% 62% / 0.55)",
    aura: "radial-gradient(circle at 50% 25%, hsl(45 90% 78% / 0.3), transparent 58%)",
  },
  seeker: {
    Icon: Eye,
    ring: "hsl(46 88% 66% / 0.52)",
    aura: "radial-gradient(circle at 50% 22%, hsl(52 90% 74% / 0.3), transparent 58%)",
  },
  controller: {
    Icon: Target,
    ring: "hsl(205 70% 68% / 0.5)",
    aura: "radial-gradient(circle at 50% 25%, hsl(205 75% 66% / 0.28), transparent 58%)",
  },
  avoider: {
    Icon: Clock3,
    ring: "hsl(168 60% 62% / 0.45)",
    aura: "radial-gradient(circle at 50% 22%, hsl(168 62% 66% / 0.24), transparent 58%)",
  },
};

const CharacterArtwork = ({ characterId }: { characterId: string }) => {
  const visual = characterVisuals[characterId] ?? characterVisuals.impostor;
  const Icon = visual.Icon;

  return (
    <div className="relative h-full rounded-2xl border border-white/10 bg-black/20 overflow-hidden">
      <div className="absolute inset-0" style={{ background: visual.aura }} />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/45 to-transparent" />

      {characterId === "impostor" && (
        <>
          <div className="absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2 w-[108px] h-[108px] rounded-[26px] rotate-45 border border-gold/30 bg-black/25" />
          <div className="absolute left-1/2 top-[54%] -translate-x-1/2 -translate-y-1/2 w-[74px] h-[74px] rounded-[18px] rotate-45 border border-gold/55" />
        </>
      )}

      {characterId === "seeker" && (
        <>
          <div className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[118px] h-[118px] rounded-full border border-gold/25" />
          <div className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[84px] h-[84px] rounded-full border border-gold/45" />
          <div className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[44px] h-[44px] rounded-full border border-gold/55 bg-black/30" />
        </>
      )}

      {characterId === "controller" && (
        <>
          <div className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[118px] h-[118px] rounded-full border border-sky-300/35" />
          <div className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[82px] h-[82px] rounded-full border border-sky-300/45" />
          <div className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[46px] h-[46px] rounded-full border border-sky-300/55 bg-black/30" />
          <div className="absolute left-[20%] right-[20%] top-1/2 h-px bg-sky-300/35" />
          <div className="absolute top-[22%] bottom-[22%] left-1/2 w-px bg-sky-300/35" />
        </>
      )}

      {characterId === "avoider" && (
        <>
          <div className="absolute left-1/2 top-[53%] -translate-x-1/2 -translate-y-1/2 w-[104px] h-[104px] rounded-full border border-emerald-300/35 bg-black/25" />
          <svg viewBox="0 0 220 120" className="absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2 w-[170px] h-[90px] opacity-70">
            <path d="M18 72 Q72 30 118 66 T202 72" fill="none" stroke="hsl(168 62% 66% / 0.55)" strokeWidth="3" strokeDasharray="6 8" />
          </svg>
        </>
      )}

      <div
        className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[64px] h-[64px] rounded-2xl border flex items-center justify-center"
        style={{ borderColor: visual.ring, boxShadow: "0 0 18px hsl(45 90% 70% / 0.18)", background: "hsl(232 20% 10% / 0.68)" }}
      >
        <Icon size={30} className="text-gold drop-shadow-[0_0_10px_rgba(255,215,130,0.5)]" />
      </div>
    </div>
  );
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
      size: 0.3 + rand() * 1.4,
      opacity: 0.2 + rand() * 0.7,
      twinkle: 2 + rand() * 6,
      delay: rand() * 3,
    });
  }

  return stars;
};

const InnerDictionary = ({ onBack, onViewMap, onStartSession }: InnerDictionaryProps) => {
  const [selectedId, setSelectedId] = useState(innerCharacters[0]?.id ?? "");
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  const deckCards = useMemo<DeckCard[]>(
    () => innerCharacters.map((character) => ({ id: character.id, character })),
    []
  );

  const selectedCharacter = useMemo(
    () => innerCharacters.find((char) => char.id === selectedId) ?? innerCharacters[0],
    [selectedId]
  );

  const activeCard = deckCards[activeIndex];

  const ambientStars = useMemo(() => generateAmbientStars(120, 7), []);

  useEffect(() => {
    if (!carouselApi) return;

    const handleSelect = () => {
      setActiveIndex(carouselApi.selectedScrollSnap());
    };

    handleSelect();
    carouselApi.on("select", handleSelect);
    carouselApi.on("reInit", handleSelect);

    return () => {
      carouselApi.off("select", handleSelect);
      carouselApi.off("reInit", handleSelect);
    };
  }, [carouselApi]);

  useEffect(() => {
    if (!activeCard) return;
    setSelectedId(activeCard.character.id);
  }, [activeCard]);

  return (
    <div
      className="fixed inset-0 overflow-y-auto overscroll-y-contain"
      style={{
        background:
          "radial-gradient(ellipse at 18% 12%, hsl(252 45% 14%) 0%, transparent 55%), radial-gradient(ellipse at 88% 86%, hsl(281 40% 16%) 0%, transparent 50%), radial-gradient(ellipse at 50% 45%, hsl(230 52% 8%) 0%, hsl(225 54% 4%) 100%)",
      }}
    >
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
        {ambientStars.map((star, index) => (
          <circle
            key={`ambient-star-${index}`}
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
      <div className="absolute right-[12%] bottom-[20%] h-72 w-72 rounded-full bg-violet-500/15 blur-[120px] pointer-events-none" />

      <motion.header
        className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 md:px-8 pt-5 md:pt-6"
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
              <h2 className="font-display text-base md:text-lg text-foreground">Từ điển nội tâm</h2>
              <span className="font-ui text-[10px] text-gold bg-gold/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles size={10} /> Premium
              </span>
            </div>
            <p className="font-ui text-[11px] text-muted-foreground">
              {innerCharacters.length} đã mở khóa
            </p>
          </div>
        </div>

        <button
          onClick={onViewMap}
          className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-xl border border-gold/30 bg-gold/10 text-gold font-ui text-[11px] md:text-xs tracking-wide hover:bg-gold/20 transition-colors"
        >
          <Compass size={14} />
          <span className="hidden sm:inline">Xem bản đồ sao</span>
        </button>
      </motion.header>

      <div
        className="relative z-20 min-h-screen flex flex-col pt-[86px] md:pt-[88px] pb-4 md:pb-5"
        style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
      >
        <motion.div
          className="px-4 md:px-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <p className="font-ui text-[10px] tracking-[0.3em] uppercase text-gold/80">Deck nhân vật</p>
          <h1 className="font-display text-xl md:text-2xl text-foreground leading-tight mt-1">
            Chọn nhân vật bạn muốn khám phá
          </h1>
          <p className="font-body text-xs md:text-sm text-foreground/70 italic mt-1 max-w-2xl">
            Vuốt ngang để đổi lá bài.
          </p>
        </motion.div>

        <div className="mt-1 px-1 md:px-5">
          <Carousel setApi={setCarouselApi} opts={{ align: "center", containScroll: "trimSnaps" }} className="w-full">
            <CarouselContent className="py-2">
              {deckCards.map((card, index) => {
                const isActive = index === activeIndex;

                const theme = getCharacterTheme(card.character.id);

                return (
                  <CarouselItem key={card.id} className="basis-[84%] sm:basis-[62%] lg:basis-[42%] 2xl:basis-[34%]">
                    <motion.button
                      type="button"
                      onClick={() => {
                        carouselApi?.scrollTo(index);
                        setSelectedId(card.character.id);
                      }}
                      className="w-full text-left"
                      animate={{ scale: isActive ? 1 : 0.93, opacity: isActive ? 1 : 0.72 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className="rounded-[30px] border backdrop-blur-xl overflow-hidden relative"
                        style={{
                          height: "clamp(210px, 31vh, 360px)",
                          background: theme.cardBg,
                          borderColor: isActive ? "hsl(var(--gold) / 0.55)" : "hsl(var(--border) / 0.6)",
                          boxShadow: isActive
                            ? "0 22px 52px hsl(226 58% 3% / 0.65), 0 0 0 1px hsl(38 72% 56% / 0.22)"
                            : "0 12px 30px hsl(226 58% 3% / 0.45)",
                        }}
                      >
                        <div className="absolute inset-0" style={{ background: theme.artGlow }} />
                        <div className="absolute inset-[12px] rounded-[22px] border" style={{ borderColor: theme.edge }} />

                        <div className="relative h-full p-4 md:p-5 flex flex-col">
                          <div className="flex items-center justify-between">
                            <span className="font-ui text-[10px] tracking-[0.28em] uppercase text-foreground/65">Character</span>
                            <span
                              className={`w-2.5 h-2.5 rounded-full ${
                                card.character.appearances >= 4
                                  ? "bg-destructive"
                                  : card.character.appearances >= 2
                                  ? "bg-gold"
                                  : "bg-primary"
                              }`}
                            />
                          </div>

                          <div className="mt-3 flex-1 rounded-2xl border border-white/10 bg-black/20 overflow-hidden relative">
                            <CharacterArtwork characterId={card.character.id} />
                          </div>

                          <div className="mt-3">
                            <p className="font-ui text-[10px] tracking-[0.28em] uppercase text-gold/70">
                              Xuất hiện {card.character.appearances} lần
                            </p>
                            <h3 className="font-display text-2xl md:text-3xl text-foreground leading-tight mt-1">
                              {card.character.name}
                            </h3>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  </CarouselItem>
                );
              })}
            </CarouselContent>
          </Carousel>

          <div className="mt-2 flex items-center justify-center gap-1.5">
            {deckCards.map((card, index) => (
              <button
                key={`dot-${card.id}`}
                onClick={() => carouselApi?.scrollTo(index)}
                className="h-2 rounded-full transition-all"
                style={{
                  width: index === activeIndex ? 24 : 8,
                  backgroundColor: index === activeIndex ? "hsl(var(--gold) / 0.95)" : "hsl(var(--gold) / 0.35)",
                }}
                aria-label={`Đi tới thẻ ${index + 1}`}
              />
            ))}
          </div>
        </div>

        <div className="mt-3 px-4 md:px-8 pb-3 md:pb-4">
          <AnimatePresence mode="wait">
            {selectedCharacter ? (
              <motion.div
                key={selectedCharacter.id}
                className="max-w-6xl w-full mx-auto rounded-[26px] border border-gold/20 p-3.5 md:p-4 backdrop-blur-2xl"
                initial={{ opacity: 0, y: 26, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 18, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                style={{
                  background:
                    "linear-gradient(165deg, hsl(228 35% 15% / 0.92) 0%, hsl(244 42% 11% / 0.93) 100%)",
                  boxShadow:
                    "0 -18px 42px hsl(225 55% 3% / 0.5), 0 0 0 1px hsl(38 60% 56% / 0.12), inset 0 1px 0 hsl(40 60% 70% / 0.16)",
                }}
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                  <p className="font-ui text-[10px] tracking-[0.3em] uppercase text-gold/75">
                    {selectedCharacter.appearances} lần xuất hiện
                  </p>
                  <button
                    onClick={() => onStartSession(selectedCharacter.id)}
                    className="w-full md:w-auto px-4 py-2 rounded-xl bg-gold/20 border border-gold/40 text-gold font-ui text-xs md:text-sm hover:bg-gold/30 transition-colors"
                  >
                    Phá vỡ vòng lặp ↗
                  </button>
                </div>

                <div className="grid gap-3 md:gap-4 md:grid-cols-[1.2fr_1fr]">
                  <div>
                    <h3 className="font-display text-xl md:text-2xl text-foreground mt-0.5">{selectedCharacter.name}</h3>
                    <p className="font-body text-sm md:text-base text-foreground/80 mt-1 leading-relaxed">
                      {selectedCharacter.description}
                    </p>

                    <div className="mt-2 rounded-2xl border border-border/60 bg-black/20 p-2.5 md:p-3">
                      <p className="font-body text-sm md:text-base text-foreground/90 italic leading-relaxed">"{selectedCharacter.quote}"</p>
                    </div>
                  </div>

                  <div>
                    <div className="rounded-2xl border border-border/60 bg-black/20 p-2.5 md:p-3">
                      <p className="font-ui text-[10px] tracking-[0.22em] uppercase text-gold/75 mb-1.5">Socrates nhận ra</p>
                      <p className="font-body text-sm md:text-base text-foreground/90 leading-relaxed italic">
                        {selectedCharacter.socratesNote}
                      </p>
                      <p className="font-ui text-[10px] md:text-[11px] text-muted-foreground mt-2">
                        Gần nhất: {selectedCharacter.lastSeen} · phiên {selectedCharacter.sessionTopic}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default InnerDictionary;
