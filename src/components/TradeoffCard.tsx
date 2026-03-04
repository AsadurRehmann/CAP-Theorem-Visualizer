import { motion, AnimatePresence } from "framer-motion";

interface TradeoffCardProps {
  c: boolean;
  a: boolean;
  p: boolean;
}

const tradeoffs: Record<string, { label: string; description: string; example: string }> = {
  CA: {
    label: "CA — No Partition Tolerance",
    description: "Only works on a single node or LAN. If a network partition occurs, the system must shut down.",
    example: "PostgreSQL (single node), Traditional RDBMS",
  },
  CP: {
    label: "CP — Sacrifices Availability",
    description: "System may reject requests during partitions to maintain consistency across nodes.",
    example: "HBase, Zookeeper, MongoDB (strong reads)",
  },
  AP: {
    label: "AP — Sacrifices Consistency",
    description: "Nodes may return stale or divergent data during partitions to stay available.",
    example: "Cassandra, CouchDB, DynamoDB",
  },
};

const TradeoffCard = ({ c, a, p }: TradeoffCardProps) => {
  const key = [c && "C", a && "A", p && "P"].filter(Boolean).join("");
  const tradeoff = tradeoffs[key];

  const activeCount = [c, a, p].filter(Boolean).length;

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
        Tradeoff Analysis
      </h4>
      <AnimatePresence mode="wait">
        {tradeoff ? (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <p className="font-mono text-sm font-bold text-foreground mb-1">{tradeoff.label}</p>
            <p className="text-sm text-muted-foreground leading-relaxed mb-2">{tradeoff.description}</p>
            <p className="text-xs text-secondary font-mono">⚡ {tradeoff.example}</p>
          </motion.div>
        ) : (
          <motion.p
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-sm text-muted-foreground"
          >
            {activeCount === 0
              ? "Toggle two properties to see the tradeoff."
              : activeCount === 1
              ? "Select one more property to see the tradeoff."
              : "Select exactly two properties."}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TradeoffCard;
