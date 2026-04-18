import { motion } from "framer-motion";
import socratesBust from "@/assets/socrates-bust.png";

interface WelcomeScreenProps {
  onStart: () => void;
}

const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-background/90">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/12 via-transparent to-black/16" />
      {/* Ambient light layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top-left warm glow */}
        <motion.div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(40 50% 50% / 0.04) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.06, 1], opacity: [0.28, 0.42, 0.28] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Center breathing glow behind bust */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] w-[600px] h-[600px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(37 44% 58% / 0.15) 0%, hsl(40 48% 46% / 0.06) 40%, transparent 72%)",
          }}
          animate={{ scale: [1, 1.02, 1], opacity: [0.28, 0.42, 0.28] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Bottom-right subtle glow */}
        <motion.div
          className="absolute -bottom-20 -right-20 w-[400px] h-[400px] rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(30 30% 44% / 0.05) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Decorative golden line from top */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-40 bg-gradient-to-b from-transparent via-gold/40 to-transparent"
        initial={{ opacity: 0, scaleY: 0 }}
        animate={{ opacity: 1, scaleY: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
      />

      {/* Socrates bust with 3D-like entrance */}
      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 60, rotateX: 15, scale: 0.85 }}
        animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        style={{ perspective: "1000px" }}
      >
        {/* Glow ring behind bust */}
        <motion.div
          className="absolute inset-0 -m-6 rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(40 48% 46% / 0.06) 0%, transparent 60%)",
            filter: "blur(20px)",
          }}
          animate={{ scale: [1, 1.04, 1], opacity: [0.24, 0.36, 0.24] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.img
          src={socratesBust}
          alt="Socrates"
          width={240}
          height={240}
          className="relative z-10 drop-shadow-2xl"
          style={{
            filter: "drop-shadow(0 14px 26px hsl(26 28% 18% / 0.28)) drop-shadow(0 0 30px hsl(40 50% 48% / 0.08))",
          }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Title with dramatic entrance */}
      <motion.h1
        className="font-display text-5xl md:text-7xl tracking-wide mt-10 text-foreground relative z-10"
        initial={{ opacity: 0, y: 30, letterSpacing: "0.3em" }}
        animate={{ opacity: 1, y: 0, letterSpacing: "0.05em" }}
        transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        Socrates
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="font-body text-lg md:text-xl text-muted-foreground mt-4 text-center max-w-md italic relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1 }}
      >
        Tấm gương soi chiếu cảm xúc
      </motion.p>

      {/* Divider */}
      <motion.div
        className="w-20 h-px bg-gradient-to-r from-transparent via-gold to-transparent mt-6 relative z-10"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 1.3 }}
      />

      {/* CTA Button with glow */}
      <motion.button
        onClick={onStart}
        className="mt-12 px-10 py-4 rounded-full bg-primary text-primary-foreground font-ui text-sm tracking-wider uppercase relative z-10 transform-gpu will-change-transform transition-[transform,box-shadow,filter] duration-300 ease-out hover:scale-[1.03] hover:shadow-lg active:scale-[0.985]"
        style={{
          boxShadow: "0 0 12px hsl(40 48% 46% / 0.12), 0 4px 16px hsl(26 28% 18% / 0.2)",
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2 }}
      >
        Bắt đầu tâm sự
      </motion.button>

      {/* Bottom decorative line */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-28 bg-gradient-to-t from-transparent via-gold/20 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1.5, delay: 1 }}
      />
    </div>
  );
};

export default WelcomeScreen;
