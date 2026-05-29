import { motion } from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

interface AuthCardProps {
  children: React.ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: EASE }}
      className="w-full rounded-[28px] p-8"
      style={{
        background: "rgba(255,252,248,0.96)",
        border: "1px solid rgba(232,226,216,0.9)",
        boxShadow:
          "0 4px 24px rgba(58,53,48,0.07), 0 1px 4px rgba(58,53,48,0.04), 0 0 0 1px rgba(232,226,216,0.4)",
        backdropFilter: "blur(8px)",
      }}
    >
      {children}
    </motion.div>
  );
}
