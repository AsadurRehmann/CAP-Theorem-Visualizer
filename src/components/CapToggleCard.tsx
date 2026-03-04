import { motion } from "framer-motion";

interface CapToggleCardProps {
  letter: string;
  title: string;
  description: string;
  active: boolean;
  onToggle: () => void;
  color: "blue" | "amber" | "red";
}

const styles = {
  blue: {
    activeBorder: "border-[hsl(210,100%,56%,0.6)]",
    activeBg: "bg-[hsl(210,100%,56%,0.08)]",
    iconActive: "bg-primary text-primary-foreground",
    dotActive: "bg-primary",
    shadow: "0 0 20px hsl(210 100% 56% / 0.25), 0 0 50px hsl(210 100% 56% / 0.1), inset 0 1px 0 hsl(210 100% 56% / 0.15)",
  },
  amber: {
    activeBorder: "border-[hsl(38,100%,55%,0.6)]",
    activeBg: "bg-[hsl(38,100%,55%,0.08)]",
    iconActive: "bg-secondary text-secondary-foreground",
    dotActive: "bg-secondary",
    shadow: "0 0 20px hsl(38 100% 55% / 0.25), 0 0 50px hsl(38 100% 55% / 0.1), inset 0 1px 0 hsl(38 100% 55% / 0.15)",
  },
  red: {
    activeBorder: "border-[hsl(0,72%,51%,0.6)]",
    activeBg: "bg-[hsl(0,72%,51%,0.08)]",
    iconActive: "bg-destructive text-destructive-foreground",
    dotActive: "bg-destructive",
    shadow: "0 0 20px hsl(0 72% 51% / 0.3), 0 0 50px hsl(0 72% 51% / 0.12), inset 0 1px 0 hsl(0 72% 51% / 0.15)",
  },
};

const CapToggleCard = ({ letter, title, description, active, onToggle, color }: CapToggleCardProps) => {
  const s = styles[color];

  return (
    <motion.button
      onClick={onToggle}
      layout
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      animate={{
        boxShadow: active ? s.shadow : "0 0 0px transparent",
      }}
      transition={{ duration: 0.4 }}
      className={`
        relative w-full rounded-lg border p-4 text-left transition-colors duration-300 cursor-pointer overflow-hidden
        ${active ? `${s.activeBorder} ${s.activeBg}` : "border-border bg-card"}
      `}
    >
      {/* Glow highlight bar at top */}
      <motion.div
        animate={{ opacity: active ? 1 : 0, scaleX: active ? 1 : 0 }}
        transition={{ duration: 0.4 }}
        className={`absolute top-0 left-0 right-0 h-[1px] origin-left ${
          color === "blue" ? "bg-primary" : color === "amber" ? "bg-secondary" : "bg-destructive"
        }`}
      />

      <div className="flex items-center gap-3">
        <motion.div
          animate={{
            boxShadow: active
              ? color === "blue"
                ? "0 0 12px hsl(210 100% 56% / 0.5)"
                : color === "amber"
                ? "0 0 12px hsl(38 100% 55% / 0.5)"
                : "0 0 12px hsl(0 72% 51% / 0.5)"
              : "0 0 0px transparent",
          }}
          transition={{ duration: 0.3 }}
          className={`
            flex h-10 w-10 shrink-0 items-center justify-center rounded-md font-mono text-lg font-bold transition-colors duration-300
            ${active ? s.iconActive : "bg-muted text-muted-foreground"}
          `}
        >
          {letter}
        </motion.div>
        <div className="min-w-0">
          <h3 className="font-mono text-sm font-bold tracking-wide text-foreground">{title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        </div>
        <motion.div
          animate={{
            scale: active ? [1, 1.4, 1] : 1,
            boxShadow: active
              ? color === "blue"
                ? "0 0 8px hsl(210 100% 56% / 0.6)"
                : color === "amber"
                ? "0 0 8px hsl(38 100% 55% / 0.6)"
                : "0 0 8px hsl(0 72% 51% / 0.6)"
              : "0 0 0px transparent",
          }}
          transition={{ duration: 0.3 }}
          className={`ml-auto h-3 w-3 shrink-0 rounded-full transition-colors duration-300 ${active ? s.dotActive : "bg-muted"}`}
        />
      </div>
    </motion.button>
  );
};

export default CapToggleCard;
