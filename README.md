# CAP Theorem Explorer

**An interactive visual tool for understanding distributed systems tradeoffs**

CAP Theorem Explorer is a browser-based educational application that lets you toggle Consistency, Availability, and Partition Tolerance in real time and observe how each combination affects a distributed database cluster. It is designed for engineers learning distributed systems fundamentals, students preparing for system design interviews, and anyone who wants to understand why choosing a database is never a simple decision.

---

## What is the CAP Theorem

The CAP Theorem, formally proven by Eric Brewer in 2000, states that any distributed system can only guarantee two of the following three properties simultaneously — never all three.

**Consistency** means every node in the system returns the same, most recent data at all times. When you read from any node, you get the latest write.

**Availability** means the system always responds to every request. It never goes down or refuses to serve, even when parts of the infrastructure are failing.

**Partition Tolerance** means the system continues operating even when the network between nodes is broken and nodes cannot communicate with each other.

The fundamental tension arises during a network partition: if two groups of nodes cannot talk to each other, you must choose between keeping data consistent (and potentially refusing requests) or staying available (and potentially returning stale data). You cannot do both.

---

## What the Application Does

The explorer gives you three toggle controls — one for each CAP property. Selecting any two updates the entire interface in real time:

- An animated node diagram shows five distributed database nodes reacting to your selection. Nodes go offline, data versions diverge, and network partitions appear visually as the cluster responds to your configuration.
- A tradeoff panel explains in plain language what you gain and what you sacrifice with the active combination.
- A real-world systems panel highlights which well-known databases match your selected configuration, including Cassandra, DynamoDB, Zookeeper, HBase, Redis, PostgreSQL, and MySQL.
- The CAP rule is enforced automatically — the application prevents all three toggles from being active simultaneously and explains why when you try.

---

## CAP Combinations at a Glance

| Selection | What You Sacrifice | Real-world Examples |
|---|---|---|
| Consistency + Availability (CA) | Partition Tolerance | PostgreSQL (single node), MySQL |
| Consistency + Partition Tolerance (CP) | Availability | Zookeeper, HBase, Redis |
| Availability + Partition Tolerance (AP) | Consistency | Cassandra, DynamoDB, CouchDB |

---

## Features

- Three interactive toggle cards with real-time CAP rule enforcement
- Animated five-node cluster diagram built with Framer Motion
- Visual fault states: offline nodes, partitioned links, data version divergence
- Dynamic tradeoff explanation card that updates on every toggle change
- Real-world database badge row that highlights matching systems
- Simulate Request mode — fire an animated request through the cluster and watch it succeed, fail, or return inconsistent data depending on your configuration
- Quiz mode — test your understanding with scenario-based questions
- Fully client-side with no backend or API dependencies

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| State | React useState |
| Deployment | Vercel via GitHub |

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Installation

```bash
git clone https://github.com/your-username/cap-theorem-explorer.git
cd cap-theorem-explorer
npm install
npm run dev
```

The application will be available at `http://localhost:5173`.

### Production Build

```bash
npm run build
```

Output is written to the `dist` directory.

---

## Deployment

CAP Theorem Explorer is configured for zero-configuration deployment on Vercel.

```
Build Command:    npm run build
Output Directory: dist
Framework Preset: Vite
```

Every push to the `main` branch triggers an automatic redeploy. No environment variables are required.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com)

---

## Project Structure

```
cap-theorem-explorer/
  src/
    components/
      ToggleCard.jsx        # Individual C, A, P toggle with glow state
      TradeoffPanel.jsx     # Dynamic explanation card
      NodeDiagram.jsx       # Animated five-node cluster visualization
      DatabaseBadge.jsx     # Real-world system highlight chips
      Legend.jsx            # Diagram legend
    hooks/
      useCapState.js        # CAP toggle logic and rule enforcement
    App.jsx
  public/
  index.html
```

---

## Node Diagram Behavior

The diagram responds to your active CAP selection in the following ways:

**Partition Tolerance on** — A red dashed line splits the cluster into two isolated groups. Nodes on opposite sides of the partition cannot communicate.

**Partition Tolerance off** — All five nodes remain fully connected with no splits.

**Consistency on** — A sync pulse animation travels between nodes showing data replication in progress.

**Consistency off** — Nodes display different version badges (v1, v2, v3) indicating that each node holds a different version of the data.

**Availability off** — One or two nodes fade to grey with an offline indicator, showing that the system is refusing requests to maintain consistency.

---

## Use Cases

**System design interview preparation** — Understanding CAP tradeoffs is a foundational requirement for senior engineering interviews at most technology companies. This tool lets you develop intuition through interaction rather than memorization.

**Database selection** — When evaluating whether to use Cassandra versus Zookeeper versus PostgreSQL for a given workload, the CAP properties of each system directly determine which failure modes you are accepting.

**Teaching distributed systems** — The animated cluster diagram communicates partition behavior, stale reads, and node failures in a way that static diagrams cannot.

---

## License

MIT