---
title: "Decision Record: Deep Research and Deep Review Runtime Improvement Bundle [042]"
description: "Parent ADR index for Packet 042, pointing to child phase decision sources."
trigger_phrases:
  - "042"
  - "decision record"
  - "adr index"
  - "parent packet"
importance_tier: "important"
contextType: "planning"
---
# Decision Record: Deep Research and Deep Review Runtime Improvement Bundle

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Parent Packet Uses Child Phase Decision Sources

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-10 |
| **Deciders** | Packet 042 planning author |

### Context

Packet 042 now spans four child phases, but only Phase 1 currently has a standalone child `decision-record.md`. The parent packet still needs one place to route readers to the detailed ADR source without re-copying the full ADR prose into the root.

### Decision

Use the parent `decision-record.md` as an index. Detailed ADR prose stays in the child source of truth that owns the decision. Phase 1 uses a standalone ADR file; Phases 2-4 keep architecture decisions embedded in their child specs/plans until they need separate ADR files.

### Consequences

- Positive: the parent packet stays concise and the child packets remain authoritative.
- Positive: future phase-specific ADRs can be added without bloating the root packet.
- Tradeoff: readers must follow links into child phases for full rationale.

### ADR Index

| ADR | Title | Status | Phase Folder | Source |
|-----|-------|--------|--------------|--------|
| **ADR-001** | Shared Stop-Reason Taxonomy and Legal Done Gate | Accepted | `001-runtime-truth-foundation` | [./001-runtime-truth-foundation/decision-record.md](./001-runtime-truth-foundation/decision-record.md) |
| **ADR-002** | Claim-Verification Ledger Uses JSONL Canonical Storage With Rendered Summaries | Accepted | `001-runtime-truth-foundation` | [./001-runtime-truth-foundation/decision-record.md](./001-runtime-truth-foundation/decision-record.md) |
| **ADR-003** | Dashboards Stay Generated Markdown, Backed by Structured Metrics | Accepted | `001-runtime-truth-foundation` | [./001-runtime-truth-foundation/decision-record.md](./001-runtime-truth-foundation/decision-record.md) |
| **ADR-004** | Council Synthesis Is Opt-In and Lives Inside Deep Research | Accepted | `001-runtime-truth-foundation` | [./001-runtime-truth-foundation/decision-record.md](./001-runtime-truth-foundation/decision-record.md) |
| **ADR-005** | Coordination Board State Is Packet-Local and Structured | Accepted | `001-runtime-truth-foundation` | [./001-runtime-truth-foundation/decision-record.md](./001-runtime-truth-foundation/decision-record.md) |
| **ADR-006** | Reducer Snapshot and Compaction Strategy | Accepted | `001-runtime-truth-foundation` | [./001-runtime-truth-foundation/decision-record.md](./001-runtime-truth-foundation/decision-record.md) |
| **ADR-007** | Behavioral Testing Moves Forward in the Delivery Order | Accepted | `001-runtime-truth-foundation` | [./001-runtime-truth-foundation/decision-record.md](./001-runtime-truth-foundation/decision-record.md) |
| **ADR-008** | Semantic Convergence Uses a Typed Decision Trace | Accepted | `001-runtime-truth-foundation` | [./001-runtime-truth-foundation/decision-record.md](./001-runtime-truth-foundation/decision-record.md) |
| **ADR-009** | Recovery Uses a Five-Tier Ladder With Provenance | Accepted | `001-runtime-truth-foundation` | [./001-runtime-truth-foundation/decision-record.md](./001-runtime-truth-foundation/decision-record.md) |
| **ADR-010** | Journals and Ledgers Stay Separate Packet-Local Append-Only Artifacts | Accepted | `001-runtime-truth-foundation` | [./001-runtime-truth-foundation/decision-record.md](./001-runtime-truth-foundation/decision-record.md) |

### Inline Architecture Decisions By Phase

| Phase | Decision Posture | Source |
|-------|------------------|--------|
| **Phase 2** | Architecture decisions are embedded in the child spec and plan: reuse-first graph extraction, dedicated `deep-loop-graph.sqlite`, four MCP tools, explicit reducer/MCP contract, fallback authority chain | [./002-semantic-coverage-graph/spec.md](./002-semantic-coverage-graph/spec.md) |
| **Phase 3** | Architecture decisions are embedded in the child spec and plan: fan-out/join prerequisite, orchestrator-layer parallelism, reducer-owned `board.json`, deterministic keyed merge, activation-gated wave mode | [./003-wave-executor/spec.md](./003-wave-executor/spec.md) |
| **Phase 4** | Architecture decisions are embedded in the child spec and plan: deterministic `4a` optimizer now, `4b` deferred, advisory-only promotion until prerequisites exist, prompt work via packs/patches not direct agent edits | [./004-offline-loop-optimizer/spec.md](./004-offline-loop-optimizer/spec.md) |

### Implementation

- Keep new detailed ADR prose in the child phase that owns the decision.
- Update this index whenever a child phase adds or removes standalone ADR files.
- Preserve the parent packet as a routing surface, not a second detailed ADR store.
<!-- /ANCHOR:adr-001 -->
