import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Question {
  scenario: string;
  hint: string;
  answer: "CA" | "CP" | "AP";
  explanation: string;
}

const QUESTIONS: Question[] = [
  {
    scenario: "Your app needs to work offline and sync data later when reconnected.",
    hint: "Think: network failures are expected, and the app must stay usable.",
    answer: "AP",
    explanation: "Partition tolerance is required (offline = partitioned), and availability keeps the app usable. Consistency is sacrificed — data syncs eventually.",
  },
  {
    scenario: "A banking ledger where every transaction must be immediately reflected and no stale reads are allowed.",
    hint: "Think: accuracy matters more than uptime during failures.",
    answer: "CP",
    explanation: "Consistency ensures correct balances. Partition tolerance handles network issues. The system may reject requests (unavailable) rather than show wrong data.",
  },
  {
    scenario: "A single-datacenter relational database powering a traditional web app with no geo-distribution.",
    hint: "Think: there's no network partition to worry about.",
    answer: "CA",
    explanation: "With no network partitions (single node/LAN), you get both consistency and availability. Partition tolerance isn't needed.",
  },
  {
    scenario: "A global DNS system that must always respond, even if some servers have slightly outdated records.",
    hint: "Think: uptime is king, and a slightly stale IP is fine.",
    answer: "AP",
    explanation: "DNS prioritizes availability (always resolves) and partition tolerance (global network). Stale records are acceptable — eventual consistency.",
  },
  {
    scenario: "A distributed lock service used to coordinate microservices. Incorrect locks could cause data corruption.",
    hint: "Think: a wrong answer is worse than no answer.",
    answer: "CP",
    explanation: "Lock correctness (consistency) is critical. The system must handle partitions but can refuse lock requests rather than grant conflicting ones.",
  },
  {
    scenario: "A social media feed that should always load, even if posts are a few seconds behind.",
    hint: "Think: users hate blank screens more than slightly old content.",
    answer: "AP",
    explanation: "Availability ensures feeds always load. Partition tolerance handles global distribution. Slightly stale posts are fine — eventual consistency.",
  },
  {
    scenario: "An inventory system for a single-warehouse operation where stock counts must always be accurate.",
    hint: "Think: no distributed nodes, and accuracy is essential.",
    answer: "CA",
    explanation: "Single warehouse = no partitions. Consistency keeps stock counts accurate. Availability ensures the system is always responsive.",
  },
];

const OPTIONS: { key: "CA" | "CP" | "AP"; label: string }[] = [
  { key: "CA", label: "CA" },
  { key: "CP", label: "CP" },
  { key: "AP", label: "AP" },
];

const QuizPanel = () => {
  const [currentIdx, setCurrentIdx] = useState(() => Math.floor(Math.random() * QUESTIONS.length));
  const [selected, setSelected] = useState<string | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const question = QUESTIONS[currentIdx];
  const isCorrect = selected === question.answer;
  const answered = selected !== null;

  const nextQuestion = useCallback(() => {
    let next = currentIdx;
    while (next === currentIdx && QUESTIONS.length > 1) {
      next = Math.floor(Math.random() * QUESTIONS.length);
    }
    setCurrentIdx(next);
    setSelected(null);
    setShowHint(false);
  }, [currentIdx]);

  const handleSelect = useCallback(
    (key: string) => {
      if (answered) return;
      setSelected(key);
      setScore((prev) => ({
        correct: prev.correct + (key === question.answer ? 1 : 0),
        total: prev.total + 1,
      }));
    },
    [answered, question.answer]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* Score */}
      <div className="flex items-center justify-between">
        <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Scenario Quiz
        </h3>
        {score.total > 0 && (
          <span className="font-mono text-xs text-muted-foreground">
            {score.correct}/{score.total} correct
          </span>
        )}
      </div>

      {/* Scenario Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="rounded-lg border border-border bg-card p-4 space-y-3"
        >
          <p className="text-sm text-foreground leading-relaxed">
            "{question.scenario}"
          </p>

          {/* Hint toggle */}
          {!answered && (
            <button
              onClick={() => setShowHint(!showHint)}
              className="font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              {showHint ? "▾ Hide hint" : "▸ Show hint"}
            </button>
          )}
          <AnimatePresence>
            {showHint && !answered && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="text-xs text-muted-foreground italic"
              >
                {question.hint}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Options */}
          <div className="flex gap-2">
            {OPTIONS.map((opt) => {
              const isThis = selected === opt.key;
              const correct = opt.key === question.answer;
              let style = "border-border bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground";

              if (answered) {
                if (correct) {
                  style = "border-[hsl(140,70%,50%,0.5)] bg-[hsl(140,70%,50%,0.1)] text-[hsl(140,70%,60%)]";
                } else if (isThis && !isCorrect) {
                  style = "border-destructive/50 bg-destructive/10 text-destructive";
                } else {
                  style = "border-border bg-muted/30 text-muted-foreground/40";
                }
              }

              return (
                <motion.button
                  key={opt.key}
                  onClick={() => handleSelect(opt.key)}
                  whileHover={!answered ? { scale: 1.05 } : {}}
                  whileTap={!answered ? { scale: 0.95 } : {}}
                  className={`
                    flex-1 rounded-md border px-3 py-2 font-mono text-sm font-bold transition-colors duration-200
                    ${answered ? "cursor-default" : "cursor-pointer"}
                    ${style}
                  `}
                >
                  {opt.label}
                </motion.button>
              );
            })}
          </div>

          {/* Feedback */}
          <AnimatePresence>
            {answered && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2 pt-1"
              >
                <p className={`font-mono text-xs font-bold ${isCorrect ? "text-[hsl(140,70%,60%)]" : "text-destructive"}`}>
                  {isCorrect ? "✓ Correct!" : `✗ Incorrect — the answer is ${question.answer}`}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {question.explanation}
                </p>
                <motion.button
                  onClick={nextQuestion}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="font-mono text-xs font-bold px-3 py-1.5 rounded-md border border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 transition-colors cursor-pointer"
                >
                  Next Question →
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuizPanel;
