import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface NodeDiagramProps {
  c: boolean;
  a: boolean;
  p: boolean;
}

const NODE_POSITIONS = [
  { x: 200, y: 80 },
  { x: 340, y: 140 },
  { x: 300, y: 280 },
  { x: 130, y: 260 },
  { x: 90, y: 150 },
];

const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 0],
  [0, 2], [1, 3],
];

const GROUP_A = [0, 1, 4];
const GROUP_B = [2, 3];

const STALE_LABELS = ["v3", "v3", "v1", "v2", "v3"];

type SimResult = {
  id: number;
  path: [number, number][];
  outcome: "success" | "stale" | "error";
  responseLabels?: string[];
};

let simIdCounter = 0;

const NodeDiagram = ({ c, a, p }: NodeDiagramProps) => {
  const offlineNodes = !a ? [2, 3] : [];
  const isPartitioned = p;
  const showSync = c;
  const showStale = !c && (a || p);

  const [simulations, setSimulations] = useState<SimResult[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);

  const isCrossPartitionEdge = (i: number, j: number) => {
    return (GROUP_A.includes(i) && GROUP_B.includes(j)) || (GROUP_A.includes(j) && GROUP_B.includes(i));
  };

  const activeKey = [c && "C", a && "A", p && "P"].filter(Boolean).join("");

  const simulateRequest = useCallback(() => {
    if (isSimulating) return;
    setIsSimulating(true);

    // Pick a path through 2-3 edges starting from node 0
    const visitPath: [number, number][] = [[4, 0], [0, 1], [1, 2]];

    let outcome: SimResult["outcome"] = "success";
    let responseLabels: string[] | undefined;

    if (activeKey === "AP" || activeKey === "PA") {
      // AP: succeeds but stale data
      outcome = "stale";
      responseLabels = ["v3", "v3", "v1"];
    } else if (activeKey === "CP" || activeKey === "PC") {
      // CP: sometimes fails with 503
      outcome = Math.random() > 0.4 ? "error" : "success";
    }
    // CA or anything else: success

    const sim: SimResult = {
      id: ++simIdCounter,
      path: visitPath,
      outcome,
      responseLabels,
    };

    setSimulations((prev) => [...prev, sim]);

    // Clean up after animation
    setTimeout(() => {
      setSimulations((prev) => prev.filter((s) => s.id !== sim.id));
      setIsSimulating(false);
    }, 2400);
  }, [activeKey, isSimulating]);

  return (
    <div className="relative w-full max-w-[440px] mx-auto aspect-square">
      <svg viewBox="0 0 440 380" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="hsl(210 100% 56% / 0.04)" strokeWidth="0.5" />
          </pattern>
          <pattern id="grid-lg" width="150" height="150" patternUnits="userSpaceOnUse">
            <path d="M 150 0 L 0 0 0 150" fill="none" stroke="hsl(210 100% 56% / 0.08)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="440" height="380" fill="url(#grid)" />
        <rect width="440" height="380" fill="url(#grid-lg)" />
        {/* Edges */}
        {EDGES.map(([i, j]) => {
          const cross = isPartitioned && isCrossPartitionEdge(i, j);
          const anyOffline = offlineNodes.includes(i) || offlineNodes.includes(j);
          return (
            <motion.line
              key={`${i}-${j}`}
              x1={NODE_POSITIONS[i].x}
              y1={NODE_POSITIONS[i].y}
              x2={NODE_POSITIONS[j].x}
              y2={NODE_POSITIONS[j].y}
              animate={{
                stroke: cross ? "hsl(0 72% 51%)" : anyOffline ? "hsl(240 4% 20%)" : "hsl(210 100% 56% / 0.3)",
                strokeDasharray: cross ? "6 4" : "none",
                opacity: cross ? 0.7 : anyOffline ? 0.3 : 0.5,
              }}
              transition={{ duration: 0.5 }}
              strokeWidth={cross ? 2 : 1.5}
            />
          );
        })}

        {/* Partition crack effect */}
        <AnimatePresence>
          {isPartitioned && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Crack glow backdrop */}
              <motion.path
                d="M 228 10 L 222 45 L 234 58 L 218 78 L 238 95 L 215 118 L 240 138 L 212 165 L 236 185 L 210 210 L 232 232 L 208 258 L 230 278 L 214 300 L 236 318 L 218 340 L 228 370"
                stroke="hsl(0 72% 51% / 0.3)"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#crack-glow)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              {/* Main jagged crack */}
              <motion.path
                d="M 228 10 L 222 45 L 234 58 L 218 78 L 238 95 L 215 118 L 240 138 L 212 165 L 236 185 L 210 210 L 232 232 L 208 258 L 230 278 L 214 300 L 236 318 L 218 340 L 228 370"
                stroke="hsl(0 72% 60%)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
              {/* Inner bright core */}
              <motion.path
                d="M 228 10 L 222 45 L 234 58 L 218 78 L 238 95 L 215 118 L 240 138 L 212 165 L 236 185 L 210 210 L 232 232 L 208 258 L 230 278 L 214 300 L 236 318 L 218 340 L 228 370"
                stroke="hsl(0 100% 80%)"
                strokeWidth="0.8"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: [0, 1, 0.6] }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
              {/* Small branch cracks */}
              {[
                { d: "M 234 58 L 244 52 L 248 56", delay: 0.3 },
                { d: "M 215 118 L 205 112 L 200 118", delay: 0.35 },
                { d: "M 236 185 L 248 180 L 252 186", delay: 0.4 },
                { d: "M 208 258 L 196 254 L 192 260", delay: 0.45 },
                { d: "M 236 318 L 246 314 L 250 320", delay: 0.5 },
              ].map((branch, i) => (
                <motion.path
                  key={i}
                  d={branch.d}
                  stroke="hsl(0 72% 55% / 0.6)"
                  strokeWidth="1"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.7 }}
                  transition={{ duration: 0.2, delay: branch.delay, ease: "easeOut" }}
                />
              ))}
              <motion.text
                x="220"
                y="20"
                textAnchor="middle"
                fill="hsl(0 72% 51%)"
                fontSize="10"
                fontFamily="Space Mono"
                letterSpacing="2"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.9, 0.7] }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                PARTITION
              </motion.text>
            </motion.g>
          )}
        </AnimatePresence>

        {/* Nodes */}
        {NODE_POSITIONS.map((pos, idx) => {
          const offline = offlineNodes.includes(idx);
          return (
            <g key={idx}>
              {showSync && !offline && (
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r="22"
                  fill="none"
                  stroke="hsl(210 100% 56%)"
                  strokeWidth="1.5"
                  initial={{ r: 22, opacity: 0.5 }}
                  animate={{ r: 44, opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: idx * 0.3,
                    ease: "easeOut",
                  }}
                />
              )}

              <motion.circle
                cx={pos.x}
                cy={pos.y}
                r="22"
                animate={{
                  fill: offline ? "hsl(240 4% 16%)" : "hsl(210 100% 56% / 0.15)",
                  stroke: offline ? "hsl(240 4% 28%)" : "hsl(210 100% 56%)",
                  strokeWidth: offline ? 1 : 2,
                }}
                transition={{ duration: 0.4 }}
              />

              <motion.text
                x={pos.x}
                y={pos.y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="11"
                fontFamily="Space Mono"
                fontWeight="bold"
                animate={{
                  fill: offline ? "hsl(240 4% 28%)" : "hsl(210 100% 72%)",
                }}
                transition={{ duration: 0.4 }}
              >
                {offline ? "" : `N${idx + 1}`}
              </motion.text>

              {offline && (
                <motion.g
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <line x1={pos.x - 7} y1={pos.y - 7} x2={pos.x + 7} y2={pos.y + 7} stroke="hsl(0 72% 51%)" strokeWidth="2.5" strokeLinecap="round" />
                  <line x1={pos.x + 7} y1={pos.y - 7} x2={pos.x - 7} y2={pos.y + 7} stroke="hsl(0 72% 51%)" strokeWidth="2.5" strokeLinecap="round" />
                </motion.g>
              )}

              {showStale && !offline && (
                <motion.g
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <rect
                    x={pos.x + 14}
                    y={pos.y - 30}
                    width="24"
                    height="16"
                    rx="4"
                    fill="hsl(38 100% 55% / 0.2)"
                    stroke="hsl(38 100% 55% / 0.5)"
                    strokeWidth="1"
                  />
                  <text
                    x={pos.x + 26}
                    y={pos.y - 20}
                    textAnchor="middle"
                    fontSize="9"
                    fontFamily="Space Mono"
                    fontWeight="bold"
                    fill="hsl(38 100% 65%)"
                  >
                    {STALE_LABELS[idx]}
                  </text>
                </motion.g>
              )}
            </g>
          );
        })}

        {/* Animated request dots */}
        <AnimatePresence>
          {simulations.map((sim) =>
            sim.path.map(([from, to], segIdx) => {
              const fromPos = NODE_POSITIONS[from];
              const toPos = NODE_POSITIONS[to];
              const segDelay = segIdx * 0.6;
              const dotColor =
                sim.outcome === "error"
                  ? "hsl(0 72% 51%)"
                  : sim.outcome === "stale"
                  ? "hsl(38 100% 55%)"
                  : "hsl(140 70% 50%)";

              return (
                <motion.circle
                  key={`${sim.id}-${segIdx}`}
                  r="5"
                  fill={dotColor}
                  filter="url(#glow)"
                  initial={{ cx: fromPos.x, cy: fromPos.y, opacity: 0 }}
                  animate={{
                    cx: [fromPos.x, toPos.x],
                    cy: [fromPos.y, toPos.y],
                    opacity: [1, 1],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.55,
                    delay: segDelay,
                    ease: "easeInOut",
                  }}
                />
              );
            })
          )}
        </AnimatePresence>

        {/* Result badges that appear after animation */}
        <AnimatePresence>
          {simulations.map((sim) => {
            const lastEdge = sim.path[sim.path.length - 1];
            const endPos = NODE_POSITIONS[lastEdge[1]];
            const totalDelay = sim.path.length * 0.6 + 0.1;

            if (sim.outcome === "error") {
              return (
                <motion.g
                  key={`result-${sim.id}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: totalDelay, duration: 0.3 }}
                >
                  <rect
                    x={endPos.x - 18}
                    y={endPos.y - 46}
                    width="36"
                    height="18"
                    rx="4"
                    fill="hsl(0 72% 51% / 0.9)"
                  />
                  <text
                    x={endPos.x}
                    y={endPos.y - 34}
                    textAnchor="middle"
                    fontSize="10"
                    fontFamily="Space Mono"
                    fontWeight="bold"
                    fill="hsl(0 0% 100%)"
                  >
                    503
                  </text>
                </motion.g>
              );
            }

            if (sim.outcome === "stale") {
              return (
                <motion.g
                  key={`result-${sim.id}`}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: totalDelay, duration: 0.3 }}
                >
                  {sim.path.map(([, to], i) => {
                    const pos = NODE_POSITIONS[to];
                    const label = sim.responseLabels?.[i] || "v?";
                    return (
                      <g key={i}>
                        <rect
                          x={pos.x - 14}
                          y={pos.y + 26}
                          width="28"
                          height="16"
                          rx="4"
                          fill="hsl(38 100% 55% / 0.25)"
                          stroke="hsl(38 100% 55% / 0.6)"
                          strokeWidth="1"
                        />
                        <text
                          x={pos.x}
                          y={pos.y + 37}
                          textAnchor="middle"
                          fontSize="9"
                          fontFamily="Space Mono"
                          fontWeight="bold"
                          fill="hsl(38 100% 65%)"
                        >
                          {label}
                        </text>
                      </g>
                    );
                  })}
                </motion.g>
              );
            }

            // success
            return (
              <motion.g
                key={`result-${sim.id}`}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: totalDelay, duration: 0.3 }}
              >
                <rect
                  x={endPos.x - 14}
                  y={endPos.y - 46}
                  width="28"
                  height="18"
                  rx="4"
                  fill="hsl(140 70% 50% / 0.2)"
                  stroke="hsl(140 70% 50% / 0.5)"
                  strokeWidth="1"
                />
                <text
                  x={endPos.x}
                  y={endPos.y - 34}
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="Space Mono"
                  fontWeight="bold"
                  fill="hsl(140 70% 60%)"
                >
                  200
                </text>
              </motion.g>
            );
          })}
        </AnimatePresence>

        {/* Filters */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="crack-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Simulate Button */}
      <div className="absolute top-2 right-2">
        <motion.button
          onClick={simulateRequest}
          disabled={isSimulating || activeKey.length < 2}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`
            font-mono text-xs font-bold px-3 py-1.5 rounded-md border transition-all duration-200
            ${isSimulating || activeKey.length < 2
              ? "border-border bg-muted text-muted-foreground cursor-not-allowed opacity-50"
              : "border-primary/40 bg-primary/10 text-primary hover:bg-primary/20 glow-blue cursor-pointer"
            }
          `}
        >
          {isSimulating ? "Sending…" : "⚡ Simulate Request"}
        </motion.button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-wrap justify-center gap-4 text-[10px] font-mono text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-primary" /> Active Node
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-node-inactive" /> Offline
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-4 border-t-2 border-dashed border-partition" /> Partition
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-stale" /> Stale Data
        </span>
      </div>
    </div>
  );
};

export default NodeDiagram;
