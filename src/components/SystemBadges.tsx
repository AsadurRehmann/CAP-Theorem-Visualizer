import { motion } from "framer-motion";

interface System {
  name: string;
  type: string; // CA, CP, AP
}

const systems: System[] = [
  { name: "Cassandra", type: "AP" },
  { name: "Redis", type: "CP" },
  { name: "Zookeeper", type: "CP" },
  { name: "DynamoDB", type: "AP" },
  { name: "MongoDB", type: "CP" },
];

interface SystemBadgesProps {
  c: boolean;
  a: boolean;
  p: boolean;
}

const SystemBadges = ({ c, a, p }: SystemBadgesProps) => {
  const activeKey = [c && "C", a && "A", p && "P"].filter(Boolean).join("");

  return (
    <div className="space-y-2">
      <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
        Real-world Systems
      </h4>
      <div className="flex flex-wrap gap-2">
        {systems.map((sys) => {
          const match = activeKey.length === 2 && sys.type === activeKey;
          return (
            <motion.span
              key={sys.name}
              layout
              animate={{
                scale: match ? 1.05 : 1,
              }}
              className={`
                inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-mono text-xs font-bold transition-colors duration-300
                ${match
                  ? "bg-primary/20 text-primary border border-primary/40 glow-blue"
                  : "bg-muted text-muted-foreground border border-border"
                }
              `}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${match ? "bg-primary" : "bg-muted-foreground/40"}`} />
              {sys.name}
              <span className="text-[10px] opacity-60">{sys.type}</span>
            </motion.span>
          );
        })}
      </div>
    </div>
  );
};

export default SystemBadges;
