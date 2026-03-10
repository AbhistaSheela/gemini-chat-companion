import { motion } from "framer-motion";

const TypingIndicator = () => (
  <div className="flex gap-4 px-4 py-6 md:px-0">
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-card border border-border shrink-0">
      <span className="text-primary text-xs font-bold">G</span>
    </div>
    <div className="flex items-center gap-1 pt-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="h-2 w-2 rounded-full bg-primary"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  </div>
);

export default TypingIndicator;
