import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const suggestions = [
  "Explain quantum computing simply",
  "Write a Python sorting algorithm",
  "What are the best practices for React?",
  "Help me plan a weekend trip",
];

interface WelcomeScreenProps {
  onSuggestion: (text: string) => void;
}

const WelcomeScreen = ({ onSuggestion }: WelcomeScreenProps) => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="mb-6 flex items-center justify-center">
          <Sparkles className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl font-medium mb-2">
          <span className="gemini-gradient-text">Hello there</span>
        </h1>
        <p className="text-lg text-muted-foreground mb-10">How can I help you today?</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-2xl w-full"
      >
        {suggestions.map((s, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSuggestion(s)}
            className="rounded-xl border border-border bg-card px-4 py-3.5 text-left text-sm text-foreground transition-colors hover:bg-secondary"
          >
            {s}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;
