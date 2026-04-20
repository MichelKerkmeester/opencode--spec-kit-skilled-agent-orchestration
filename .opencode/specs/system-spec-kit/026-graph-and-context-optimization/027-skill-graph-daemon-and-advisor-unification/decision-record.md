---
title: "Phase 027 — Decision Record"
description: "ADRs capturing the architectural decisions from the r01 research synthesis (research/027-skill-graph-daemon-and-advisor-unification-pt-01/)."
importance_tier: "high"
contextType: "research"
---

# Phase 027 — Architectural Decision Records

Six ADRs capturing the load-bearing decisions from the converged r01 research (40 iters + 20 follow-up = 60 iterations, 43 adopt_now / 3 prototype_later / 0 reject). Each ADR names the research evidence that justifies it.

---

## ADR-001 — Chokidar + hash-aware SQLite indexer as daemon substrate

**Status:** Accepted (adopt_now; Research §4 A1, A3 + §13.2 E1)

**Context:** The skill-graph needs to auto-refresh when skills change. Options considered: raw Node `fs.watch`, macOS `fsevents` directly, Linux `inotify` directly, polling, and Chokidar (which wraps these). Indexer options: full rebuild vs. content-hash delta.

**Decision:** Use **Chokidar** as the watcher substrate and reuse the existing **TypeScript hash-aware SQLite indexer** as the daemon default. Reserve full re-index for explicit recovery or schema maintenance only.

**Rationale:**
- Chokidar handles macOS/Linux/Windows atomic-rename patterns, editor swap files, and de-duplicates events.
- Repo already depends on Chokidar elsewhere; watcher-behavior patterns + edge-case handling are already learned.
- Hash-aware delta indexing keeps re-index cost O(changed rows) instead of O(whole graph).

**Alternatives rejected:**
- Raw `fs.watch` — editor atomic-rename produces duplicate + `ENOENT` events; no built-in recursion.
- Direct `fsevents` — macOS-only; cross-platform matrix would require polyfills.
- Polling — wastes CPU; loses sub-10s reactivity target.
- Full-graph rebuild on every change — O(n) instead of O(delta); violates ≤1% idle CPU budget.

**Applied in:** 027/001.

---

## ADR-002 — Self-contained `mcp_server/skill-advisor/` package layout

**Status:** Accepted (user preference + Research §7 D2 + §10 R7 mitigation)

**Context:** Advisor code is currently split between `mcp_server/lib/skill-advisor/` (11 TS files from Phase 020-026) and `.opencode/skill/skill-advisor/scripts/` (Python). Consolidation target options: (A) keep in `mcp_server/lib/skill-advisor/` with tools + handlers scattered at top level, or (B) a self-contained `mcp_server/skill-advisor/` package with `lib/`, `tools/`, `handlers/`, `tests/` subfolders.

**Decision:** **(B) Self-contained `mcp_server/skill-advisor/` package.** Not `mcp_server/lib/skill-advisor/`. Advisor owns a cohesive domain (scoring, fusion, caches, MCP tool surface, compat adapters); co-locating package internals is clearer than scattering.

**Rationale:**
- Advisor is a first-class subsystem, not a library module — the current `lib/skill-advisor/` name undersells ownership.
- Ownership boundary stays sharp: `lib/skill-graph/` remains the graph authority; `lib/memory/` remains memory primitives; `skill-advisor/` is the whole package.
- Mitigates R7 (MCP consolidation blurring graph and advisor ownership).
- Easier for 027/003 Python→TS port: all new files land under one umbrella.

**Alternatives rejected:**
- Keep advisor code under `lib/` — scatters tools/handlers/tests across top-level directories; violates co-location principle.
- Promote advisor to its own MCP server — R7 + D6 research explicitly rejects new MCP server registration.

**Applied in:** 027/003, 027/004, 027/005, 027/006 (all target `mcp_server/skill-advisor/`).

**Baseline change:** 027 spec.md §3 D2 + research.md §7 D2 + §8 sketch + §10 R7 updated in commit `7ba7b349a`.

---

## ADR-003 — 5-lane analytical fusion with initial weights 0.45 / 0.30 / 0.15 / 0.10 / 0.00

**Status:** Accepted (adopt_now; Research §6 C4 + §13.4 G1, G2, G6)

**Context:** The existing Python advisor uses fixed-weight keyword scoring. Options for the unified scorer: (A) learned ranking (requires training corpus + shadow evaluation), (B) hybrid analytical + embedding, (C) deterministic analytical fusion with multiple lanes. Need initial calibration.

**Decision:** **Deterministic analytical fusion with 5 lanes and initial live weights:**
- `explicit_author: 0.45` — author-authored triggers, frontmatter Keywords, `intent_signals`
- `lexical: 0.30` — deterministic phrase / n-gram matching
- `graph_causal: 0.15` — bounded `skill_edges` traversal
- `derived_generated: 0.10` — auto-derived keywords (capped; enters as lower-trust lane per ADR-006 + Research B4)
- `semantic_shadow: 0.00` — shadow-only; no live contribution through first promotion wave (see ADR-006)

**Rationale:**
- Analytical fusion is interpretable + ablatable without training data.
- Explicit author intent dominates (0.45) because author-authored triggers are the highest-precision signal.
- Lexical (0.30) + graph_causal (0.15) provide recall for prompts not naming triggers directly.
- Derived_generated (0.10) is trust-lane-separated and capped to prevent masquerading as author intent.
- Semantic_shadow at 0.00 keeps the channel scored but inert; promotion requires the gates in ADR-006.

**Alternatives rejected:**
- Learned ranking as hot path — Research C6/G6: latency + overfitting risk; staged behind shadow cycles.
- Equal weights 0.2 × 5 — ignores precision-recall differential between lanes.
- No derived lane — Research B2/B4: derived signals are valuable when capped; full rejection loses recall.

**Applied in:** 027/003 (`lib/scorer/weights-config.ts`).

---

## ADR-004 — Workspace-scoped single-writer lease; one daemon writer per workspace

**Status:** Accepted (adopt_now; Research §13.2 E2, E3)

**Context:** Multiple concurrent AI sessions (Claude Code + Gemini + Copilot + Codex) can target the same repo. Each has access to a daemon. Options: (A) one daemon per session, each writing the same SQLite; (B) shared socket-based daemon pooled across sessions; (C) workspace-scoped single-writer lease with runtime-local readers.

**Decision:** **(C) Workspace-scoped single-writer lease.** First daemon to acquire the lease writes; others become readers. Lease expires on daemon death or explicit release. Runtime-local readers are unaffected.

**Rationale:**
- SQLite WAL mode degrades under multiple concurrent writers to `SQLITE_BUSY` storms (Research E3 evidence).
- Socket-based daemon sharing adds packaging/IPC complexity without solving the WAL problem.
- Single-writer + lease is the simplest model that respects SQLite's actual concurrency ceiling.
- Second-daemon attempts simply observe the lease + become readers; no error, no work duplication.

**Alternatives rejected:**
- No lease, multiple writers → SQLITE_BUSY hot path.
- Socket-based shared daemon → future work; Research E2 defers it.
- Cross-session coordination via SQLite advisory locks — works on some platforms, unreliable under atomic-replace writes.

**Applied in:** 027/001 (`lib/daemon/lease.ts`).

---

## ADR-005 — Schema v1↔v2 migration is additive + daemon-backfilled + rollback-additive

**Status:** Accepted (adopt_now; Research §13.3 F3, F4)

**Context:** Adding a `derived` block to `graph-metadata.json` = schema change. Options: (A) big-bang migration (all skills upgraded at once, requires downtime), (B) lazy-on-read backfill (skill upgraded on first advisor hit), (C) daemon-owned additive backfill (v1 readable during transition; daemon writes v2 `derived` additively).

**Decision:** **(C) Daemon-owned additive backfill.** v1 `graph-metadata.json` remains valid + routable during the transition. Daemon adds `derived` block to v2 candidates in the background. Rollback is additive strip: remove `derived` block, reset `schema_version` to 1, reindex. All author-authored fields preserved at all times.

**Rationale:**
- Big-bang requires dev downtime or scripted migration; out of scope for a daemon.
- Lazy-on-read misses skills never matched by any advisor call.
- Daemon-backfilled additive migration preserves forward compatibility (v1 consumers see v1 fields) and backward compatibility (rollback doesn't lose data).
- Author-authored fields (frontmatter `trigger_phrases`, `importance_tier`, etc.) are never touched during migration or rollback — this is the durability guarantee.

**Alternatives rejected:**
- Big-bang with migration script — dev friction + potential data loss if script fails mid-run.
- Lazy-on-read — uneven migration; skills unvisited stay v1 forever.
- Non-additive v2 (replace v1 fields) — breaks rollback safety.

**Applied in:** 027/002 (`lib/lifecycle/schema-migration.ts`).

---

## ADR-006 — Semantic live weight stays 0.00 through first promotion wave; bounded learned/adaptive live influence eligible first

**Status:** Accepted (adopt_now; Research §6 C6 + §13.4 G5, G6)

**Context:** Semantic (embedding-based) and learned ranking channels can improve accuracy but carry latency + overfitting risk. Options: (A) enable semantic live immediately with low weight, (B) keep semantic shadow-only indefinitely, (C) shadow-first path with explicit promotion gates.

**Decision:** **(C) Shadow-first with explicit promotion gates.** Semantic lane is scored but contributes 0.00 to live ranking through the first promotion wave. Only bounded learned/adaptive live influence is eligible before semantic promotion (max weight delta per promotion = 0.05). Promotion requires all 7 gates:
1. ≥75% full-corpus exact top-1
2. ≥72.5% stratified holdout top-1
3. Gold-`none` false-fire count no increase
4. Cache-hit p95 ≤50ms
5. Uncached deterministic p95 ≤60ms
6. Exact parity preservation (from 027/003)
7. Canonical regression fixtures green

Two positive shadow cycles required before promotion.

**Rationale:**
- Semantic lookup in the hot path is a latency risk (Research C6 evidence).
- Learned ranking trained on 200-prompt corpus risks overfitting; shadow cycles measure without promotion.
- Bounded adaptive adjustments (0.05 delta cap) are recoverable; unbounded changes are not.
- 7-gate policy aligns with existing advisor parity + safety contracts from Phase 025/026.

**Alternatives rejected:**
- Enable semantic live with low weight — no measurement; regression potential.
- Keep semantic shadow-only forever — loses accuracy gains if they're real + gated.
- Single-gate promotion (accuracy only) — misses safety + latency + parity regressions.

**Applied in:** 027/003 (`weights-config.ts` semantic lock) + 027/006 (`lib/promotion/gates.ts`).

---

## Cross-ADR relationships

- **ADR-001** (daemon substrate) enables **ADR-004** (lease needs a long-running writer).
- **ADR-002** (package layout) is applied by **ADR-003** (fusion), **ADR-005** (migration), **ADR-006** (promotion) — all new code lives in `mcp_server/skill-advisor/`.
- **ADR-003** (fusion weights) is the load-bearing decision that **ADR-006** (promotion gates) protects.
- **ADR-005** (migration additivity) ensures **ADR-004** (single-writer lease) can safely transition between schemas.

## Outstanding uncertainty (not ADRs)

- Watcher benchmark numbers under broad-scope watching (E1 `adopt_now` but measurement pending; broad watching gated in 001).
- Debounce calibration under burst save patterns (E4 `prototype_later` medium confidence; 2s + 1s stable-write provisional).
- Semantic lane real-world latency once promoted (depends on embedding provider + cache hit rate).

These are tracked inside the relevant child packets (001 E1 + E4, 006 semantic latency) rather than as ADRs.
