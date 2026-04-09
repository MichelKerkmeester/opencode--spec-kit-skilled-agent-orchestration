# Feature Specification: Graph and Context Optimization (Parent Packet)

This parent packet records the research-aligned dependency order across the 026 child phases so planning and activation follow the actual prerequisite graph instead of numeric slug order.

## Phase Execution Order

This packet's phases form a research-aligned dependency graph. Logical execution order (independent of numeric slug):

- **005 (R1)** — Provisional measurement contract — foundational governance
- **006 (R10)** — Structural trust axis contract — parallel with 005/007
- **007 (R6)** — Detector regression floor — no R dependencies, parallel
- **010 (R7)** — FTS capability cascade floor — predecessor for 002
  - **002 (R2)** — Stop-hook metadata patch (producer, rescoped)
    - **012 (R3)** — Cached SessionStart consumer (gated)
- **011 (R5)** — Graph payload validator — requires 006
  - **008 (R4)** — Graph-first routing nudge — requires 011
  - **014 (side branch)** — Code graph upgrades — requires 007 + 011; sibling to 008 with explicit non-overlap
- **009 (R9)** — Auditable savings publication — requires 005 + external reader
- **013 (R8)** — Warm-start bundle conditional validation — terminal; requires 002, 012, 008

Packets 003-memory-quality-issues and 004-agent-execution-guardrails are orthogonal to R1-R10 and do not participate in this DAG.
