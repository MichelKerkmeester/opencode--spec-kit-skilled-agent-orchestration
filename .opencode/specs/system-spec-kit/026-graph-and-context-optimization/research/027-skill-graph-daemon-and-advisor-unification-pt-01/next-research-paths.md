# Phase 027 — Next Research Paths (Follow-ups to r01)

> **Source:** [`research.md`](./research.md) + [`findings-registry.json`](./findings-registry.json) (r01 converged: 29 `adopt_now` / 2 `prototype_later` / 0 `reject`).
> **Purpose:** Identify high-value research questions that r01 left open, intentionally scoped out, or surfaced during the 4-track synthesis. Use this doc to decide whether to spawn additional `-pt-NN` research packets before committing implementation effort to 027/001-006.

---

## 1. What r01 Resolved

- Watcher substrate (Chokidar), transaction model (single-SQLite commit), daemon lifecycle, failure-mode contract, provenance-aware derived triggers, trust-lane separation, analytical fusion design, MCP-tool surface, migration layout, compat shim policy.
- All 4 cross-track coherence checks passed (X1-X4).
- Implementation roadmap has 6 sub-packets with explicit dependencies + effort estimates.

## 2. What r01 Explicitly Deferred (`prototype_later`)

| ID | Topic | r01 rationale | Why follow-up research helps |
|---|---|---|---|
| **A6** | Resource budget under broad watching | Chokidar v4 glob behavior + descriptor/RSS uncertainty for broad watching — narrow metadata-only is safe, broad is not | Need a measured benchmark before we know whether broad SKILL.md + references/** watching is tractable on large skill sets |
| **C6** | Prompt-time embedding/hybrid lookup | Hot-path latency risk; semantic channels stay shadow-only until promotion gates pass | Need shadow-cycle methodology + promotion-gate tuning before C6 can ever leave `prototype_later` |

Both deserve dedicated research iterations, not just implementation experimentation.

## 3. Gaps r01 Did Not Examine

The 4-track scope was deliberately narrowed. The following came up in synthesis but were not investigated:

### 3.1 Multi-scale scaling

- **Current:** ~50-100 skills, 10-20 asset dirs.
- **Unknowns:**
  - At 500+ skills, does debouncing + hash-compare still fit **≤1% idle CPU** (tightened from the original 5% defensive bound)? (ref A6 medium-confidence prototype_later)
  - Does the single-SQLite-commit model hit WAL contention before ~200 concurrent sessions?
  - When does `skill_edges` traversal stop being O(neighbors) in practice?
- **Why researchable:** r01 assumed current repo cardinality. Growth trajectory changes trade-offs.

### 3.2 Skill lifecycle + deprecation

- **Gap:** r01's derived-metadata pipeline handles create/modify/rename/delete events, but does NOT model:
  - Aged skills whose signal weight should decay
  - Superseded skills (sk-X-v1 → sk-X-v2) that should be routed around
  - "Archived" skills (moved to z_future/ or z_archive/) — how should the daemon treat them?
- **Why researchable:** Without explicit lifecycle rules, derived-trigger corpus stats (B6) get polluted by old skills.

### 3.3 Schema migration (v1 → v2 derived block)

- **Gap:** r01 mandates `graph-metadata.json.derived` lane with provenance fingerprint. Existing `graph-metadata.json` files lack this block.
- **Unknowns:**
  - Migration strategy: big-bang vs. lazy-on-read vs. daemon-driven backfill?
  - How does the daemon treat a skill whose `graph-metadata.json` is still v1 during the transition?
  - Rollback: if v2 breaks something, how do we demote to v1 without losing author-authored fields?
- **Why researchable:** 027/001 and 027/002 both assume v2 is present; transition plan is load-bearing but unscoped.

### 3.4 Daemon distribution across runtimes

- **Gap:** r01 assumes MCP-owned single daemon instance per workspace. But in practice:
  - Claude Code session + Gemini session + Copilot session + Codex CLI can all run simultaneously against the same repo.
  - Do they share one daemon or each spawn their own?
  - If shared, what's the lock/lease protocol?
  - If separate, how do they avoid duplicating the SQLite writer contention risk (R2)?
- **Why researchable:** Cross-runtime concurrent sessions are the norm (per user pattern memory), not an edge case.

### 3.5 Causal edge discovery

- **Gap:** r01 adopts "causal-style traversal over existing `skill_edges`" (C3). But:
  - How are `skill_edges` currently populated? Hand-authored? Derived?
  - What's the pipeline for discovering new edges as the skill set grows (e.g., sk-code-web uses sk-doc? sk-deep-research depends on sk-git?)
  - Can causal edges be inferred from SKILL.md cross-references, shared references, trigger-phrase co-occurrence?
- **Why researchable:** Without a discovery mechanism, causal traversal adds latency (C6 risk) without proportional value.

### 3.6 Analytical fusion weight tuning methodology

- **Gap:** C4 adopted "deterministic analytical fusion with normalized channels, caps, attribution." But:
  - What are the initial weight values for each lane (explicit_author, derived_generated, lexical, graph/causal, semantic-shadow)?
  - How do we tune without promoting learned weights (explicitly rejected for prompt-time)?
  - What's the ablation protocol to validate each lane independently?
- **Why researchable:** r01 specifies structure, not numerical calibration. 027/003 will need this before ship.

### 3.7 Denial-of-service resistance

- **Gap:** Adversarial R4 covers keyword stuffing. Not covered:
  - Rapid SKILL.md edits (user running find-and-replace; editor autosave loops) triggering reindex storm
  - Malformed SKILL.md causing repeated parser failures (does the daemon back off?)
  - Corrupted `graph-metadata.json` — does the daemon fall into a retry loop?
- **Why researchable:** Daemon stability under local-editor edge cases is under-specified in r01's failure-mode contract (A8).

### 3.8 Prompt-time native parity validation

- **Gap:** D4 accepts "native TypeScript, not PyOdide, behind parity." But:
  - What does parity mean operationally? Exact output match? Top-1 agreement? 99% agreement?
  - How many prompts need to run through dual-execution before we trust native?
  - Who owns the parity harness — 027/003 or its own sub-packet?
- **Why researchable:** "Behind parity" is a policy; the protocol that enforces it is not designed.

## 4. Proposed Follow-up Research Tracks

Prioritized by blocker-to-027/001 severity (high → low):

### Track E — Scaling + Daemon Distribution (blocks 027/001)

**Sub-questions:**
- E1 Watcher benchmark harness on current + 2x + 5x skill set — measured CPU/RSS/descriptor baseline (unblocks A6)
- E2 Cross-runtime daemon sharing protocol — shared socket vs per-runtime spawn vs OS-level lease
- E3 SQLite WAL contention ceiling — concurrent session threshold before SQLITE_BUSY becomes hot path
- E4 Debounce window empirical calibration — 10s default assumed; measure optimal for editor save patterns

**Expected verdict mix:** 3 `adopt_now` + 1 `prototype_later` — benchmark-driven.

### Track F — Lifecycle + Schema Migration (blocks 027/002)

**Sub-questions:**
- F1 Skill-aged signal decay model — exponential vs step function vs commit-graph-based
- F2 Supersession routing — how sk-X-v1 → sk-X-v2 should surface in advisor
- F3 v1 → v2 `derived` block migration protocol — big-bang vs daemon-backfill vs hybrid
- F4 Rollback path — demote v2 to v1 without losing author-authored fields
- F5 z_archive/ + z_future/ treatment — indexed for search but not for routing? Or excluded entirely?

**Expected verdict mix:** Mostly `adopt_now` — these are design decisions, not measurements.

### Track G — Fusion Calibration + Parity Enforcement (blocks 027/003, 027/004)

**Sub-questions:**
- G1 Initial analytical weight values per lane — baseline + ablation sensitivity
- G2 Ablation protocol — procedure + test fixtures for lane-by-lane validation
- G3 Parity definition for Python ↔ TS — exact / top-1 / distributional
- G4 Parity harness architecture — own sub-packet vs integrated into 027/003
- G5 Shadow-cycle methodology for semantic/learned channels (unblocks C6)
- G6 Promotion gates — concrete numeric thresholds beyond r01's 75% full-corpus / 72.5% holdout

**Expected verdict mix:** 4 `adopt_now` + 2 `prototype_later` (shadow protocols).

### Track H — Robustness + Edge Cases (spans 027/001-005)

**Sub-questions:**
- H1 Reindex-storm back-pressure — rate-limiter, exponential backoff, circuit breaker
- H2 Malformed SKILL.md handling — quarantine vs skip vs hard-fail
- H3 Corrupted SQLite recovery — auto-rebuild-from-source trigger conditions
- H4 Partial-write resilience — editor crash mid-save scenarios
- H5 Observability + alerting — health metrics beyond r01's `skill_graph_status`

**Expected verdict mix:** Mostly `adopt_now` — robustness patterns are well-studied.

### Track I — Causal Edge Infrastructure (blocks C3/C5 effectiveness)

**Sub-questions:**
- I1 How `skill_edges` are populated today (inventory)
- I2 Automated edge discovery candidates — SKILL.md cross-refs, shared references, trigger co-occurrence, command-bridge logs
- I3 Precision vs recall of each discovery signal
- I4 Maintenance burden — human review of auto-discovered edges

**Expected verdict mix:** Mixed — some signals likely `prototype_later` until validated on real data.

## 5. Suggested Next Research Packet

**Recommended: `-pt-02` — Single packet covering Tracks E + F + G (28-33 iterations), deferring H + I to `-pt-03` later.**

Rationale:
- E, F, G are all hard blockers for 027/001-004 implementation.
- H is important but can be addressed incrementally during implementation (robustness hardening pattern).
- I (causal edge discovery) is a nice-to-have for C3/C5 but traversal works with hand-authored edges short-term.

### Proposed `027-skill-graph-daemon-and-advisor-unification-pt-02` scope

| Track | Questions | Dispatch |
|---|---|---|
| E Scaling/Distribution | 4 (E1-E4) | Iters 1-4 |
| F Lifecycle/Migration | 5 (F1-F5) | Iters 5-9 |
| G Calibration/Parity | 6 (G1-G6) | Iters 10-15 |
| Cross-track coherence (E×F, E×G, F×G) | 3 | Iters 16-18 |
| Synthesis intermediates (sketch, roadmap delta, risk delta, measurement delta) | 4 | Iters 19-22 |
| **Total** | **22 iterations + synthesis** | **~1.5h wall with cli-codex fast** |

Executor: cli-codex gpt-5.4 high fast, per-iter fresh invocation, copilot fallback (proven r01 pattern).

## 6. Alternative: Skip pt-02, Resolve During Implementation

If research fatigue is a concern, each of Tracks E/F/G/H/I can be handled inline during the relevant 027/NNN sub-packet:

- E → 027/001 includes benchmark harness construction
- F → 027/002 includes migration protocol design as an ADR
- G → 027/003 includes weight tuning + parity protocol as part of the implementation
- H → 027/005 includes robustness hardening pass
- I → deferred to post-027 (separate phase)

This avoids another 2-3h research wall-clock but pushes unscoped decisions into implementation, risking 027/003 and 027/004 effort overruns.

## 7. Recommendation

**Spawn `-pt-02` covering E + F + G before dispatching 027/001 implementation.**

- Unblocks the three highest-risk sub-packets (027/001, 027/002, 027/003) with empirical + design answers.
- Keeps H and I as "inline during implementation" (acceptable trade-off).
- ~1.5h additional research wall-clock is cheap relative to ~20-30 engineering days of implementation in the roadmap.

Decision point is the user's — this doc is the evidence.

## 8. Cross-References

- r01 synthesis: [`research.md`](./research.md)
- r01 registry: [`findings-registry.json`](./findings-registry.json)
- r01 strategy (battle plan): [`deep-research-strategy.md`](./deep-research-strategy.md)
- Phase 027 spec: [`../../027-skill-graph-daemon-and-advisor-unification/spec.md`](../../027-skill-graph-daemon-and-advisor-unification/spec.md)
