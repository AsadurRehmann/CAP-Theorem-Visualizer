import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import CapToggleCard from "@/components/CapToggleCard";
import TradeoffCard from "@/components/TradeoffCard";
import SystemBadges from "@/components/SystemBadges";
import NodeDiagram from "@/components/NodeDiagram";
import QuizPanel from "@/components/QuizPanel";

const Index = () => {
  const [c, setC] = useState(false);
  const [a, setA] = useState(false);
  const [p, setP] = useState(false);
  const [tab, setTab] = useState<"explore" | "quiz">("explore");

  const handleToggle = useCallback(
    (which: "c" | "a" | "p") => {
      const next = { c, a, p, [which]: !{ c, a, p }[which] };
      const count = [next.c, next.a, next.p].filter(Boolean).length;

      if (count > 2) {
        toast("CAP Theorem: you can only guarantee 2 of 3", {
          description: "The third property was automatically disabled.",
          duration: 3000,
        });
        // Don't enable the third — keep current state
        return;
      }

      setC(next.c);
      setA(next.a);
      setP(next.p);
    },
    [c, a, p]
  );

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      {/* Left Panel */}
      <div className="w-full lg:w-[440px] xl:w-[480px] shrink-0 border-r border-border p-6 lg:p-8 flex flex-col gap-6 lg:overflow-y-auto lg:max-h-screen">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-mono text-2xl font-bold tracking-tight text-foreground"
          >
            CAP Theorem Explorer
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="font-mono text-sm text-muted-foreground mt-1"
          >
            Pick any two. Never all three.
          </motion.p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-1 rounded-lg bg-muted p-1">
          <button
            onClick={() => setTab("explore")}
            className={`flex-1 rounded-md px-3 py-1.5 font-mono text-xs font-bold transition-colors cursor-pointer ${
              tab === "explore"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => setTab("quiz")}
            className={`flex-1 rounded-md px-3 py-1.5 font-mono text-xs font-bold transition-colors cursor-pointer ${
              tab === "quiz"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Quiz Me
          </button>
        </div>

        <AnimatePresence mode="wait">
          {tab === "explore" ? (
            <motion.div
              key="explore"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-6"
            >
              <div className="flex flex-col gap-3">
                <CapToggleCard
                  letter="C"
                  title="Consistency"
                  description="Every read receives the most recent write or an error."
                  active={c}
                  onToggle={() => handleToggle("c")}
                  color="blue"
                />
                <CapToggleCard
                  letter="A"
                  title="Availability"
                  description="Every request receives a non-error response — without guaranteeing it's the most recent."
                  active={a}
                  onToggle={() => handleToggle("a")}
                  color="amber"
                />
                <CapToggleCard
                  letter="P"
                  title="Partition Tolerance"
                  description="System continues operating despite network partitions between nodes."
                  active={p}
                  onToggle={() => handleToggle("p")}
                  color="red"
                />
              </div>

              <TradeoffCard c={c} a={a} p={p} />
              <SystemBadges c={c} a={a} p={p} />
            </motion.div>
          ) : (
            <motion.div
              key="quiz"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              <QuizPanel />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Right Panel — Node Diagram */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 min-h-[400px]">
        <div className="w-full max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <NodeDiagram c={c} a={a} p={p} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8"
          >
            <p className="font-mono text-xs text-muted-foreground">
              Toggle properties on the left to see how distributed systems behave
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Index;
