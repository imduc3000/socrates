import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import WelcomeScreen from "@/components/WelcomeScreen";
import ChatInterface from "@/components/ChatInterface";
import SummaryScreen from "@/components/SummaryScreen";
import PremiumHub from "@/components/PremiumHub";
import EmotionChart from "@/components/EmotionChart";
import InnerDictionary from "@/components/InnerDictionary";
import CharacterMap from "@/components/CharacterMap";

type Screen = "welcome" | "chat" | "summary" | "premium" | "emotion-chart" | "inner-dictionary" | "character-map";

const Index = () => {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [premiumFeatureIndex, setPremiumFeatureIndex] = useState(0);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={screen}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {screen === "welcome" && <WelcomeScreen onStart={() => setScreen("chat")} />}
        {screen === "chat" && (
          <ChatInterface
            onSummarize={() => setScreen("summary")}
            onPremium={() => setScreen("premium")}
          />
        )}
        {screen === "summary" && (
          <SummaryScreen
            onBack={() => setScreen("chat")}
            onNewSession={() => setScreen("chat")}
            onPremium={() => setScreen("premium")}
          />
        )}
        {screen === "premium" && (
          <PremiumHub
            onBack={() => setScreen("chat")}
            onViewChart={() => setScreen("emotion-chart")}
            onViewDictionary={() => setScreen("inner-dictionary")}
            onViewMap={() => setScreen("character-map")}
            nextFeatureIndex={premiumFeatureIndex}
            onFeatureIntroduced={() => setPremiumFeatureIndex((p) => p + 1)}
          />
        )}
        {screen === "emotion-chart" && <EmotionChart onBack={() => setScreen("premium")} />}
        {screen === "inner-dictionary" && (
          <InnerDictionary
            onBack={() => setScreen("premium")}
            onViewMap={() => setScreen("character-map")}
            onStartSession={() => setScreen("chat")}
          />
        )}
        {screen === "character-map" && <CharacterMap onBack={() => setScreen("premium")} />}
      </motion.div>
    </AnimatePresence>
  );
};

export default Index;
