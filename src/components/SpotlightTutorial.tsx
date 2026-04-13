import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface SpotlightStep {
  id: string;
  /** The main explanatory text */
  message: string;
  /** Optional small label above the message */
  label?: string;
  /** CSS selector to spotlight — if omitted, shows centered */
  targetSelector?: string;
  /** Where to place the tooltip relative to the spotlight */
  position?: "top" | "bottom" | "left" | "right" | "center";
  /** Delay before showing this step (ms) */
  delay?: number;
}

interface SpotlightTutorialProps {
  steps: SpotlightStep[];
  onComplete: () => void;
  /** If true, starts automatically */
  active: boolean;
}

const SpotlightTutorial = ({ steps, onComplete, active }: SpotlightTutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const [spotlightRect, setSpotlightRect] = useState<DOMRect | null>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const step = steps[currentStep];

  // Find and measure target element
  const measureTarget = useCallback(() => {
    if (!step?.targetSelector) {
      setSpotlightRect(null);
      return;
    }
    const el = document.querySelector(step.targetSelector);
    if (el) {
      const rect = el.getBoundingClientRect();
      setSpotlightRect(rect);
    } else {
      setSpotlightRect(null);
    }
  }, [step]);

  useEffect(() => {
    if (!active || !step) {
      setVisible(false);
      return;
    }
    setVisible(false);
    setSpotlightRect(null);
    const timer = setTimeout(() => {
      measureTarget();
      setVisible(true);
    }, step.delay || 400);
    return () => clearTimeout(timer);
  }, [active, currentStep, step, measureTarget]);

  // Remeasure on resize
  useEffect(() => {
    if (!visible) return;
    const handler = () => measureTarget();
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [visible, measureTarget]);

  const handleNext = useCallback(() => {
    if (currentStep >= steps.length - 1) {
      setVisible(false);
      setTimeout(() => {
        setCurrentStep(0);
        onComplete();
      }, 300);
    } else {
      setVisible(false);
      setTimeout(() => setCurrentStep((p) => p + 1), 250);
    }
  }, [currentStep, steps.length, onComplete]);

  if (!active || !step || !visible) return null;

  const pad = 12;
  const hasSpotlight = spotlightRect !== null;

  // Calculate tooltip position with viewport clamping
  const getTooltipStyle = (): React.CSSProperties => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 16;
    const tooltipWidth = Math.min(vw - margin * 2, vw < 768 ? 320 : 440);
    const tooltipHeight = vw < 768 ? 250 : 290;
    const gap = pad + 16;
    const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

    if (!hasSpotlight || !spotlightRect) {
      return {
        left: clamp((vw - tooltipWidth) / 2, margin, vw - tooltipWidth - margin),
        top: clamp((vh - tooltipHeight) / 2, margin, vh - tooltipHeight - margin),
        transform: "none",
        width: `min(${tooltipWidth}px, calc(100vw - 2rem))`,
      };
    }

    const pos = step.position || "bottom";
    const centerX = spotlightRect.left + spotlightRect.width / 2;
    const centerY = spotlightRect.top + spotlightRect.height / 2;
    let left = centerX - tooltipWidth / 2;
    let top = centerY - tooltipHeight / 2;

    if (pos === "bottom") {
      top = spotlightRect.bottom + gap;
    } else if (pos === "top") {
      top = spotlightRect.top - tooltipHeight - gap;
    } else if (pos === "left") {
      left = spotlightRect.left - tooltipWidth - gap;
      top = centerY - tooltipHeight / 2;
    } else if (pos === "right") {
      left = spotlightRect.right + gap;
      top = centerY - tooltipHeight / 2;
    }

    // Vertical fallback first to keep tooltip visible.
    if (top + tooltipHeight > vh - margin) {
      const fallbackTop = spotlightRect.top - tooltipHeight - gap;
      if (fallbackTop >= margin) {
        top = fallbackTop;
      }
    }
    if (top < margin) {
      const fallbackBottom = spotlightRect.bottom + gap;
      if (fallbackBottom + tooltipHeight <= vh - margin) {
        top = fallbackBottom;
      }
    }

    left = clamp(left, margin, vw - tooltipWidth - margin);
    top = clamp(top, margin, vh - tooltipHeight - margin);

    return {
      left,
      top,
      transform: "none",
      width: `min(${tooltipWidth}px, calc(100vw - 2rem))`,
    };
  };

  // SVG mask for spotlight cutout
  const renderMask = () => {
    if (!hasSpotlight || !spotlightRect) return null;
    const r = 12;
    return (
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        <defs>
          <mask id="spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            <rect
              x={spotlightRect.left - pad}
              y={spotlightRect.top - pad}
              width={spotlightRect.width + pad * 2}
              height={spotlightRect.height + pad * 2}
              rx={r}
              ry={r}
              fill="black"
            />
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="hsl(var(--background))"
          fillOpacity="0.75"
          mask="url(#spotlight-mask)"
        />
      </svg>
    );
  };

  // Spotlight glow ring
  const renderGlow = () => {
    if (!hasSpotlight || !spotlightRect) return null;
    return (
      <motion.div
        className="absolute pointer-events-none rounded-xl"
        style={{
          left: spotlightRect.left - pad,
          top: spotlightRect.top - pad,
          width: spotlightRect.width + pad * 2,
          height: spotlightRect.height + pad * 2,
          zIndex: 2,
          boxShadow: "0 0 0 3px hsl(var(--gold) / 0.5), 0 0 40px 8px hsl(var(--gold) / 0.15)",
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        className="fixed inset-0 z-[100]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Background overlay — either SVG mask or simple dim */}
        {hasSpotlight ? (
          <>
            {renderMask()}
            {renderGlow()}
          </>
        ) : (
          <div className="absolute inset-0 bg-background/75 backdrop-blur-sm" style={{ zIndex: 1 }} />
        )}

        {/* Click catcher */}
        <div
          className="absolute inset-0"
          style={{ zIndex: 3 }}
          onClick={handleNext}
        />

        {/* Tooltip card */}
        <motion.div
          key={step.id}
          className="fixed z-[104]"
          style={getTooltipStyle()}
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.96 }}
          transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-card border border-gold-muted/40 rounded-2xl p-6 md:p-8 shadow-2xl shadow-gold/10 relative max-h-[calc(100vh-2rem)] overflow-y-auto">
            {/* Decorative top accent */}
            <div className="absolute -top-px left-1/2 -translate-x-1/2 w-16 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent rounded-full" />

            {step.label && (
              <p className="font-display text-xs tracking-[0.2em] uppercase text-gold mb-3 text-center">
                {step.label}
              </p>
            )}

            <p className="font-body text-lg md:text-xl leading-relaxed text-foreground text-center">
              {step.message}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3 mt-6">
              {/* Step indicator */}
              <div className="flex gap-2">
                {steps.map((_, i) => (
                  <motion.div
                    key={i}
                    className="h-1 rounded-full transition-all duration-300"
                    style={{ width: i === currentStep ? 24 : 8 }}
                    animate={{
                      backgroundColor: i === currentStep
                        ? "hsl(var(--gold))"
                        : i < currentStep
                          ? "hsl(var(--gold-muted))"
                          : "hsl(var(--muted-foreground) / 0.2)",
                    }}
                  />
                ))}
              </div>

              {/* Next button */}
              <motion.button
                onClick={handleNext}
                className="px-5 py-2 rounded-full bg-gold/10 border border-gold-muted/30 text-gold font-ui text-sm hover:bg-gold/20 transition-colors shrink-0"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {currentStep >= steps.length - 1 ? "Bắt đầu ✦" : "Tiếp theo →"}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SpotlightTutorial;
