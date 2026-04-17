# Segment 2 Synthesis — Phase 017 Deep-Review Meta-Research

**Session**: 2026-04-17T112720Z-p1-remediation-research
**Dispatcher**: Task tool @general / Opus 4.7 / parallel waves of 3
**Iterations**: 51-57 (7 iterations of segment 2; 57 cumulative with segment 1)
**Input**: review-report.md (2026-04-17T120827Z, verdict CONDITIONAL, 10 P1 + 18 P2)
**Output verdict**: CONDITIONAL-extended — severity ranking holds (0 P0 escalations), but segment 2 discovers that the default canonical-save path is structurally a metadata-freshness no-op (H-56-1), promotes 3 new compound P1s, and expands the Phase 017 remediation scope from 19 to 27 tasks with ~60h critical-path effort.

---

## 1. Summary

Segment 2 meta-audited the 10 P1 + 18 P2 findings from the 2026-04-17T120827Z deep-review, dispatching 6 discovery iterations (51-56) across four dimensions: root-cause depth (iters 51, 55), cross-cutting coverage (iter 52), blast-radius under expanded threat models (iter 53), remediation feasibility (iter 54), and compound-hypothesis testing (iter 56). The review's severity ranking survives expanded scrutiny — no P1 escalates to P0 under multi-UID / Docker / non-POSIX / MCP-injection / supply-chain / prototype-pollution / sibling-cache-poisoning attack classes. However, segment 2 surfaces ~15 net-new findings that materially extend the review's scope and sharpen the remediation plan.

The headline discovery is **H-56-1**: the default `/memory:save` canonical-save path is a **metadata-freshness no-op** under the documented `plannerMode = 'plan-only'` default. Composed from R51-P1-001 (workflow.ts:1259 `const ctxFileWritten = false` dead-code guard making the `savePerFolderDescription` block unreachable), R51-P1-002 (workflow.ts:1333 gates `refreshGraphMetadata` behind `plannerMode === 'full-auto'`), and R4-P1-002 (no auto-repair job compensates), H-56-1 reframes the review's "drift over time" narrative to the sharper "every default save writes zero metadata." The "16/16 sibling folders stale" symptom in R5-P1-001 is not a drift artifact — it is the structural outcome of a default path that never writes.

Segment 2 also catalogs two NEW clusters the review did not fully capture: **Cluster D** (code-graph sibling asymmetry, R52-P1-001 — 6 un-hardened siblings vs 1 hardened `query.ts`) and **Cluster E** (runtime-specific observability gap, R52-P1-002 — Copilot runtime lacks compact-cycle `trustState` writer+reader). Iteration 54 constructs a 27-task Phase 017 plan across four waves with ~60h critical-path and ~105h total effort. Iteration 55 confirms all 5 P2-masking-P1 hypotheses are genuinely P2 (no hidden upgrades). Iteration 56 tests 5 compound hypotheses: 3 CONFIRMED (H-56-1, H-56-4, H-56-5), 1 REFUTED (H-56-2 cross-handler cache poisoning — no in-tree caller composes both code-graph handlers), 1 PARTIAL (H-56-3 multi-container CAS — shared-tmpfs reaches hook state but not SQLite CAS).

---

## 2. Segment-2 Findings Inventory

### 2.1 New P1 findings (confirmed or upgrade-candidate)

| ID | Short title | File:line | Confidence | Extends |
|----|-------------|-----------|------------|---------|
| R51-P1-001 | Canonical save path has unreachable description.json writer (`const ctxFileWritten = false`) | `scripts/core/workflow.ts:1259` | 0.92 | R4-P1-002 |
| R51-P1-002 | Default `plan-only` planner mode skips `refreshGraphMetadata` | `scripts/core/workflow.ts:1333`, `scripts/memory/generate-context.ts:415` | 0.93 | R3-P2-001, R5-P1-001 |
| R51-P1-003 | `_memory.continuity` frontmatter has zero programmatic writers | skill-wide (grep miss) | 0.85 | Cluster B (NEW 4th surface) |
| R52-P1-001 | Code-graph family: 6 un-hardened siblings vs `query.ts` hardened (trustState/canonicalReadiness absent) | `handlers/code-graph/{scan,status,ccc-status,ccc-reindex,ccc-feedback}.ts` | 0.94 | R6-P1-001 |
| R52-P1-002 | Copilot hook runtime lacks compact-cycle `trustState` writer+reader | `hooks/copilot/session-prime.ts` + absent `hooks/copilot/compact-cache.ts` | 0.90 | R6-P1-001 (cross-runtime axis) |
| R53-P1w-001 | R2-P1-001 worsened under Docker shared-tmp + same-UID | `hooks/claude/hook-state.ts:161-167` | 0.70 | R2-P1-001 |
| R56-P1-upgrade-001 | Default canonical save is a metadata-freshness no-op (compound confirmed) | `scripts/core/workflow.ts:1259,1333` | 0.93 | R4-P1-002, R51-P1-001, R51-P1-002 |
| R56-P1-NEW-002 | Copilot autonomous-iteration observability blind spot (triple-layer gap) | `hooks/copilot/*` + R3-P1-001 + R1-P1-002 | 0.83 | R52-P1-002 |
| R56-P1-NEW-003 | Research-iteration folders invisible to memory layer | `research/NNN-*/iterations/` | 0.85 | R3-P1-002, R51-P1-003, R4-P1-002 |

### 2.2 New P2 findings

| ID | Short title | File:line | Confidence |
|----|-------------|-----------|------------|
| R51-P2-001 | `OnIndexSkipReason` weak-typed `Record<string, …>` enables silent variant loss | `handlers/save/post-insert.ts:302-316` | 0.82 |
| R52-P2-001 | Gemini `shared.ts` transitively couples to Claude for provenance escape | `hooks/gemini/shared.ts:7` | 0.82 |
| R52-P2-002 | `memory-context.ts` advertises non-canonical `readiness: 'ready'` in structural routing nudge | `handlers/memory-context.ts:200,425` | 0.75 |
| R55-P2-002 | `importance_tier != 'deprecated'` predicate helper underused (10+ inline duplicates vs `importance-tiers.ts:149` helper) | cross-file | 0.90 |
| R55-P2-003 | `executeConflict` precondition-block extraction opportunity (DRY, 4 shared steps) | `reconsolidation.ts:508-520,559-571` | 0.92 |
| R55-P2-004 | `scalarsEqual` TRUE/FALSE coercion dormant — reachability gap for future YAML evolution | `boolean-expr.ts:372-379` | 0.88 |

### 2.3 P0 escalation verdict

**Explicit: 0 P0 escalations confirmed under expanded scope.**

Quoting iteration 053 (KQ-51-3): "No P0 escalation confirmed under expanded scope. One P1-worsened (R2-P1-001 under Docker shared-tmp) and one P1 confirmation (R6-P1-001 sibling asymmetry is parity-only, no cache-poisoning). Supply-chain, MCP args injection, and prototype-pollution surfaces are clean. Confidence 0.88."

Quoting iteration 056 (compound-hypothesis audit): "P0 escalations: 0 (consistent with iteration-053's adversarial audit)."

The review's POSIX 0o600/0o700 + same-UID threat model correctly bounds R2-P1-001 severity. Docker shared-tmp worsening is operator-misconfiguration, not a framework flaw. Supply-chain (single benign `postinstall`), MCP args injection (traversal-checked + allow-listed), prototype pollution (no `Object.assign`/spread sinks, Zod strips unknown keys), and sibling cache poisoning (no caller composes both code-graph handlers in-tree) all ruled out.

---

## 3. Compound-Hypothesis Matrix

| Hypothesis | Components | Verdict | Confidence | Why |
|-----------|------------|---------|------------|-----|
| H-56-1 canonical-save paralysis | R51-P1-001 + R51-P1-002 + R4-P1-002 | **CONFIRMED** | 0.93 | Default `plan-only` + unreachable description writer + no auto-repair = every default save writes zero metadata. Headline finding. |
| H-56-2 cross-handler observability attack | R52-P1-001 + R6-P1-001 + R2-P1-001 | **REFUTED** | 0.88 | Grep confirms no in-tree caller composes `handleCodeGraphContext` + `handleCodeGraphQuery` results. Dispatcher is `switch` with one handler per request. External clients composing results is a client trust-choice, not framework flaw. |
| H-56-3 multi-container scope-confusion | R53-P1w-001 + R1-P1-001 + R4-P1-001 | **PARTIAL** | 0.82 | Shared-tmpfs reaches `hook-state.ts`, but SQLite CAS lives in project-tree DB (not `/tmp`). Hook-state compose cleanly; CAS scope does NOT ride along. |
| H-56-4 Copilot silent-failure cluster | R52-P1-002 + R3-P1-001 + R1-P1-002 | **CONFIRMED** (new compound P1) | 0.83 | Copilot runtime uniquely missing three observability layers: compact-cache trustState + CP-002 closing-pass telemetry + retry-exhaustion signal. Concurrency-3 per `feedback_copilot_concurrency_override.md` concentrates per-session failures. |
| H-56-5 graph-traversal blind spots | R3-P1-002 + R51-P1-003 + R4-P1-002 | **CONFIRMED** (new compound P1-broader) | 0.85 | Every skill-owned deep-research/review loop produces `research/NNN-*/iterations/iteration-NNN.md` without `description.json`. CLAUDE.md mandatory-metadata rule warns "invisible to memory search and graph traversal." Segment 2's own workflow is a standing instance. |

**Summary**: 3 CONFIRMED, 1 REFUTED, 1 PARTIAL.

---

## 4. Extended Cluster Analysis

### Cluster B — Canonical-save-surface (NOW 7+ findings with segment-2 extensions)

Pre-segment-2 (from review-report.md): R3-P2-001 (graph-metadata drift), R4-P1-002 (no auto-refresh), R5-P1-001 (16/16 sibling folders stale), R3-P2-002 (170/179 malformed evidence markers).

Segment-2 extensions:
- **R51-P1-001** — `scripts/core/workflow.ts:1259` hardcodes `const ctxFileWritten = false`; entire savePerFolderDescription block (lines 1261-1331) is structurally unreachable dead code. Even if reached, the block only touches `memorySequence`/`memoryNameHistory`, never `lastUpdated`. Two fixes required (remove stub + add timestamp writer), not one.
- **R51-P1-002** — `scripts/core/workflow.ts:1333` gates `refreshGraphMetadata` on `options.plannerMode === 'full-auto'`; default at `generate-context.ts:415` is `'plan-only'`. The happy path never refreshes graph-metadata.
- **R51-P1-003** — `_memory.continuity` frontmatter has ZERO programmatic writers anywhere in the codebase. All hits are prose documentation. CLAUDE.md permits AI hand-editing, but without a freshness validator, drift is structurally inevitable. Cluster B gains a 4th canonical surface.
- **R56-P1-upgrade-001 / H-56-1 (headline)** — The composition of R51-P1-001 + R51-P1-002 + R4-P1-002 confirms a structural-severity upgrade: **every default `/memory:save` is a metadata-freshness no-op**. Not "eventually stale" — "always stale after each save." The 16/16 sibling-folder staleness is the predictable symptom of a default path that writes zero metadata.
- **R56-P1-NEW-003** — Research-iteration folders under `research/NNN-*/iterations/` lack `description.json` + `graph-metadata.json`. Every skill-owned deep-research/review loop produces invisible artifacts.

**Remediation seed (consolidated)**: A single coordinated refactor — making `refreshGraphMetadata` + a new `refreshPerFolderDescriptionTimestamp` + a new `refreshContinuityFrontmatter` run unconditionally on every canonical save, extending coverage to nested `research/NNN-*/iterations/` folders — resolves R4-P1-002 + R51-P1-001/002/003 + R3-P1-002 + R56-P1-upgrade-001 + R56-P1-NEW-003 in one coordinated change. Cluster B is the dominant spine of Phase 017.

### Cluster D (NEW — segment-2 discovered): Code-graph sibling asymmetry

The review's R6-P1-001 captured only `handlers/code-graph/context.ts` as un-hardened relative to `query.ts`. Segment-2 token-grep sweep (iteration 052, §2.1) reveals the full asymmetry is **6:1**, not 2-pair:

| File | Token count (trustState/canonicalReadiness/lastPersistedAt) | Classification |
|------|------|---|
| `code-graph/query.ts` | 17 | Hardened (reference) |
| `code-graph/scan.ts` | 0 | Missing |
| `code-graph/status.ts` | 0 | Missing (HIGHEST priority — IS the canonical readiness probe) |
| `code-graph/context.ts` | 0 | Missing (already R6-P1-001) |
| `code-graph/ccc-status.ts` | 0 | Missing |
| `code-graph/ccc-reindex.ts` | 0 | Missing |
| `code-graph/ccc-feedback.ts` | 0 | Missing |

**Cluster D fix**: Extract `canonicalReadinessFromFreshness`, `queryTrustStateFromFreshness`, `buildQueryGraphMetadata`, `buildReadinessBlock` from `query.ts:225-300` into shared `lib/code-graph/readiness-contract.ts`; have all 7 handlers consume it. Must atomic-ship (or emit `trustState: 'unavailable'` stubs during staged rollout) to prevent naive consumers keying on `trustState !== undefined` from concluding scan/status/ccc-* failed.

### Cluster E (NEW — segment-2 discovered): Runtime-specific observability gap

Cross-runtime hook-family token audit (iteration 052, §2.5) reveals three distinct sibling asymmetries where Copilot is the odd-one-out:

| Hook role | Claude | Gemini | Copilot |
|-----------|--------|--------|---------|
| `session-prime.ts` reads `pendingCompactPrime.payloadContract?.provenance.trustState` | YES (line 70) | YES (line 77) | **NO** |
| `compact-inject.ts` / `compact-cache.ts` writes `trustState: 'cached'` | YES (compact-inject.ts:403) | YES (compact-cache.ts:174) | **absent — file does not exist** |
| `shared.ts` defines `wrapRecoveredCompactPayload` | YES (lines 125-129) | NO (transitively imports from Claude) | **absent — file does not exist** |

Cluster E compound (R56-P1-NEW-002 / H-56-4): Copilot is the ONLY runtime with simultaneous gaps in (a) compact-cache trustState persistence, (b) CP-002 closing-pass telemetry (R3-P1-001), and (c) retry-exhaustion signaling (R1-P1-002). Per `feedback_copilot_concurrency_override.md`, Copilot is Phase 017's Codex-fallback runtime limited to 3 parallel dispatches — making accumulated per-session silent failures consequential per session.

**Cluster E fix**: Extract `hooks/shared-provenance.ts` from `hooks/claude/shared.ts` FIRST (Wave A), add `hooks/copilot/compact-cache.ts` + extend `hooks/copilot/session-prime.ts` to read trustState SECOND (Wave B). Sequenced to prevent Copilot re-inlining `wrapRecoveredCompactPayload` as a third duplicate.

### Refutations / no-upgrades

Iteration 053 ruled out (7 directions):
- Multi-UID POSIX cross-UID read on macOS (per-user `/var/folders` tmpdir design)
- NFS `/tmp` cross-host attack (atypical deployment; trust model accepted)
- Prototype pollution via `JSON.parse` (no `Object.assign`/spread sinks; explicit field access + Zod strips unknown keys)
- Supply-chain via `postinstall` (single benign `record-node-version.js`, no network/shell)
- MCP args injection into `readFileSync`/`spawn` (traversal-checks + allow-list in `memory-ingest.ts`; other handlers don't reach fs/shell sinks)
- Sibling-asymmetry cache poisoning (no caller composes both code-graph handlers)
- Zod prototype pollution at MCP boundary (confirmed safe — strips unknown keys)

Iteration 055 ruled out (5 P2-upgrade candidates, all confirmed genuine P2):
- R4-P2-001 god-function hidden bug (5 try/catch blocks structurally identical)
- R4-P2-003 transaction divergence (preconditions shared by design)
- R4-P2-004 predicate typo/drift (10+ sites all `!= 'deprecated'` exactly)
- R3-P2-002 tool-authored corruption (no programmatic checklist writer; `)` pattern absent in current file — likely stale review snapshot)
- R2-P2-002 TRUE/FALSE coercion active bug (zero YAML predicates use boolean comparisons; unreachable)

Iteration 056 ruled out:
- H-56-2 cross-handler observability attack (no in-tree caller composes both handlers)
- Unification of R56-P1-NEW-002 and R56-P1-NEW-003 (different trees: runtime-layer vs workflow-layer)

---

## 5. Phase 017 Remediation Plan (consolidated)

Merges iteration-054 wave plan with NEW findings from iterations 51/52/56.

### 5.1 Critical path (6 working days, ~60h)

7-node sequential chain through Cluster B infrastructure spine:

```
T-CNS-01 → T-W1-CNS-04 → T-CNS-02 → T-CGC-01 → T-W1-CGC-03 → T-W1-CNS-05 → T-CNS-03
  (M/4h)    (M/+2h)       (M/4h)     (M/4h)     (L/16h)        (M/4h)        (L/16h)
```

Justification: (a) CNS-01 is the only task that removes `ctxFileWritten = false` stub and installs real `lastUpdated` writer — every Cluster B surface blocks on it. (b) W1-CNS-04 lifts `plannerMode === 'full-auto'` guard, same file same commit as CNS-01. (c) CNS-02 backfills rely on writers live. (d) CGC-01 extracts shared `lib/code-graph/readiness-contract.ts`; W1-CGC-03 then sweeps 5 siblings consuming that module. (e) W1-CNS-05 adds continuity-freshness validator. (f) CNS-03 is the terminal 16-folder tree-sweep.

### 5.2 Parallel lanes

- **Lane A — Cluster C sanitization** (~6h, S+S+S): T-SAN-01 → T-SAN-02 → T-SAN-03
- **Lane B — Cluster A + SRS auth** (~22h, M+S+L): T-SCP-01 + T-SCP-02 (one PR) || T-SRS-BND-01 solo
- **Lane C — Hooks runtime parity** (~8h, M+M): T-W1-HOK-02 → T-W1-HOK-01 (extract-before-consume ordering)
- **Lane D — Standalone maintainability P2s** (~40h, deferrable): T-EXH-01, T-PIN-GOD-01 → T-W1-PIN-02, T-RCB-DUP-01, T-YML-CP4-01, T-W1-HST-02

### 5.3 Rollout hazards + mitigations

1. **T-CNS-01 + T-W1-CNS-04 MUST ship atomic** — if CNS-01 alone lands, `description.json.lastUpdated` updates but `graph-metadata.json.derived.last_save_at` still lags (new divergence direction). Atomic ship eliminates transient-inconsistency window.
2. **T-CGC-01 + T-W1-CGC-03 MUST ship atomic OR staged with stub** — mid-rollout, naive consumers keying on `trustState !== undefined` would conclude scan/status/ccc-* failed. Remedy: atomic OR emit `trustState: 'unavailable'` on laggards during gap.
3. **T-W1-HOK-02 MUST precede T-W1-HOK-01** — extracting shared-provenance AFTER Copilot compact-cache means Copilot re-inlines `wrapRecoveredCompactPayload` as third duplicate.
4. **T-SAN-01 + T-SAN-03 MUST land together** — SAN-03 adds NFKC test cases that FAIL until SAN-01 lands. Red repo between split commits.
5. **T-CNS-03 is a 16-folder WRITE sweep** — never run until every preceding writer verified live on 1 test folder. Highest rollback cost in Phase 017.
6. **T-SCP-02 (lint) MUST follow T-SCP-01 (collapse) in same PR** — lint first breaks build because 4 duplicates still exist.
7. **T-EVD-01 evidence-marker lint must NOT activate in `--strict` mode before 016 checklist.md rewrap** — 170/179 items have `)` closers that would fail the validating packet.

### 5.4 Wave structure

**Wave A — Infrastructure primitives (~20h, 2.5 days — critical-path)**: T-CNS-01 + T-W1-CNS-04 (merged PR on workflow.ts), T-CGC-01 (extract readiness-contract.ts), T-W1-HOK-02 (extract shared-provenance.ts), T-SCP-01 (collapse normalizers). Blocks everything downstream.

**Wave B — Cluster consumers (~30h, 4 days — parallelizable across 3 sublanes)**: T-CNS-02 (research backfill), T-W1-CNS-05 (continuity validator), T-W1-CGC-03 (5-sibling readiness propagation), T-W1-HOK-01 (Copilot compact-cache + session-prime), T-SCP-02 (lint rule), T-SAN-01/02/03 (sanitization), T-SRS-BND-01 (session-resume auth), T-PIN-RET-01 (retry-exhaustion counter).

**Wave C — Tree-wide rollout and lints (~15h, 2 days)**: Rewrap 016 checklist.md evidence markers (170 `)` → `]`), T-EVD-01 (evidence-marker lint), T-CNS-03 (16-folder canonical-save sweep — verify on 1 test folder first), T-CPN-01 (closing-pass-notes CP-002 amend), T-RBD-03 (design-intent comments), T-W1-MCX-01 (rename readiness→advisoryPreset).

**Wave D — Non-urgent P2 maintainability (~40h, deferrable across phases)**: T-EXH-01 (assertNever + 8 union apps), T-PIN-GOD-01 (extract runEnrichmentStep), T-W1-PIN-02 (satisfies clause), T-RCB-DUP-01 (extract runAtomicReconsolidationTxn), T-YML-CP4-01 (typed predicate), T-W1-HST-02 (Docker `-v /tmp:/tmp` deployment note + optional UID-hash defense).

### 5.5 New task IDs from segment 2

| Task ID | Severity | Effort | Extends | Acceptance criteria |
|---------|----------|--------|---------|---------------------|
| T-W1-CNS-04 | P1 | M | R51-P1-002 | `refreshGraphMetadata` runs on plan-only default; `graph-metadata.json.derived.*` fresh after every `/memory:save` |
| T-W1-CNS-05 | P1 | M | R51-P1-003 | `_memory.continuity` freshness validator in `validate.sh --strict`; optional `writeContinuityFrontmatter()` helper invoked on canonical save |
| T-W1-CGC-03 | P1 | L | R52-P1-001 | 5 code-graph sibling handlers (scan, status, ccc-status, ccc-reindex, ccc-feedback) emit `canonicalReadiness` + `trustState` + `lastPersistedAt` via shared `lib/code-graph/readiness-contract.ts` |
| T-W1-HOK-01 | P1 | M | R52-P1-002 | `hooks/copilot/compact-cache.ts` writes `trustState: 'cached'`; `hooks/copilot/session-prime.ts` reads `payloadContract?.provenance.trustState` |
| T-W1-HOK-02 | P2 | M | R52-P2-001 | `hooks/shared-provenance.ts` exported; Claude/Gemini/Copilot `shared.ts` re-export; no transitive coupling |
| T-W1-MCX-01 | P2 | S | R52-P2-002 | `readiness` field in `StructuralRoutingNudgeMeta` renamed to `advisoryPreset` OR removed (always-literal field) |
| T-W1-PIN-02 | P2 | S | R51-P2-001 | `satisfies Record<OnIndexSkipReason, EnrichmentSkipReason>` at post-insert.ts:302; warn-log on unmapped variant |
| T-W1-HST-02 | P2 (advisory) | S | R53-P1w-001 | Deployment docs warn against `-v /tmp:/tmp` across Copilot MCP containers; OPTIONAL: `getProjectHash()` incorporates `process.getuid?.()` for defense-in-depth |

---

## 6. Convergence Report (segment 2)

| Iter | Dimension | Net-new findings | newInfoRatio | Status |
|------|-----------|------------------|--------------|--------|
| 51 | root-cause + cross-cut | 4 (3 P1, 1 P2) | 0.85 | complete |
| 52 | cross-cutting-coverage | 4 (2 P1, 2 P2) | 1.0 | complete |
| 53 | blast-radius | 3 (1 P1w, 1 P1 conf, 1 meta) | 0.10 | complete |
| 54 | remediation-feasibility | 27 tasks mapped (plan-synthesis, not discovery) | n/a | complete |
| 55 | root-cause (P2 audit) | 4 maintainability P2s, 0 upgrades | 0.70 | complete |
| 56 | blast-radius + root-cause | 3 compound P1s (1 upgrade, 2 new) | 0.60 | complete |
| 57 | synthesis | 0 | n/a | synthesis-only |

**Convergence verdict**: CONVERGED. Signal density is high but declining:
- Iter 51-52 produced 8 net-new findings (full discovery mode).
- Iter 53 produced 1 net-new (blast-radius bound is tight).
- Iter 55 produced 0 P2→P1 upgrades (masking hypothesis refuted).
- Iter 56 produced 3 compound P1s (H-56-1 confirms H-56-1 is the headline).

The segment has hit its intended 6-discovery + 1-synthesis cadence (matching segment-1's iter-7 synthesis pattern). Further discovery iterations would primarily refine Wave D P2s or explore speculative forward-looking KQs (invariant audit, gap analysis) — low value for current Phase 017 blockers.

**Combined with segment 1**: 57 total cumulative iterations. Segment 1 produced 137 raw findings; segment 2 produced ~15 net-new findings meta-auditing the review's findings. No P0 escalations across either segment under all explored threat models and compound-hypothesis compositions.

---

## 7. Combined Verdict (segments 1 + 2)

**Phase 017 remediation status**: CONDITIONAL (unchanged — no P0 escalations).

**Additional remediation scope vs review §5**: 8 new task IDs from segment 2 bring Phase 017 total from 19 to **27 tasks**. Effort estimate rises from review's ~80h to **~105h total / ~60h critical-path** with 4-wave parallel structure.

**Ship-or-fix decision**:
- Ship only after Wave A + Wave B critical path completes (~60h / 6 working days).
- Wave A carries H-56-1 fix (default `/memory:save` metadata no-op), which is the headline finding — without it, no downstream Cluster B consumer behavior changes observably.
- Wave D deferrable across phases without blocking ship.
- Copilot-primary execution (per `feedback_copilot_concurrency_override.md` / `feedback_phase_017_autonomous.md`) MUST include T-W1-HOK-01 + T-W1-HOK-02 (Cluster E / Wave A+B) before autonomous Copilot iteration launches — else H-56-4 observability blind spot activates during Phase 017 itself.

---

## 8. Ruled-out directions

Consolidated from iter 53 (7), iter 55 (5), iter 56 (2):

1. Multi-UID POSIX cross-UID read on macOS — per-user `/var/folders` tmpdir design
2. NFS `/tmp` cross-host attack — atypical deployment
3. Prototype pollution via `JSON.parse` — no `Object.assign`/spread into target; Zod strips unknown keys
4. Supply-chain via `postinstall` — single benign `record-node-version.js`
5. MCP args injection into fs/shell sinks — traversal-checks + allow-list
6. Sibling-asymmetry cache poisoning — no in-tree caller composes both code-graph handlers
7. Zod prototype pollution at MCP boundary — confirmed safe
8. R4-P2-001 god-function hidden bug — 5 try/catch blocks structurally identical
9. R4-P2-003 transaction divergence — preconditions shared by design
10. R4-P2-004 predicate typo/drift — 10+ sites all exact `!= 'deprecated'`
11. R3-P2-002 tool-authored corruption — no programmatic checklist writer; `)` pattern absent in current file
12. R2-P2-002 TRUE/FALSE coercion active bug — unreachable from current YAML corpus
13. H-56-2 cross-handler observability attack — no in-tree caller composes both code-graph handlers (refuted in iter 56 extending iter 53)
14. Unification of R56-P1-NEW-002 and R56-P1-NEW-003 — different trees (runtime-layer vs workflow-layer)

---

## 9. Open follow-ups (Phase 019+ candidates)

- **KQ-51-6 (pre-flight for W1-CNS-04 default-flip)**: Of 16 sibling 026-tree folders, which have custom `manual.*` fields in `graph-metadata.json` that an aggressive refresh might wipe? Pre-flight spot-check protects Wave C sweep.
- **KQ-51-7 (test-coverage audit for 8 new Wave-1 tasks)**: Does existing test suite cover regression scenarios for each new task, or is there test-debt count to sequence in Wave B alongside code changes?
- **Cross-finding invariant audit**: Do P0/P1 remediation commits introduce NEW coupling that creates future regression risk? Forward-looking dimension beyond segment 2's backward-looking scope.
- **Runtime-behavior gap analysis**: Are there runtime behaviors not covered by the 137 + 15 = 152-finding registry at all? Completeness dimension.
- **R55-P2-002 (underused `importance-tier` helper)**, **R55-P2-003 (executeConflict precondition DRY)**, **R55-P2-004 (YAML boolean-predicate evolution)**: Non-blocker maintainability parking-lot.
- **sqlite-vec alpha pin**: `sqlite-vec ^0.1.7-alpha.2` is pinned pre-1.0; minor supply-chain concern, not P1, but worth tracking.

---

## 10. Evidence citations (all file:line references)

Canonical-save surface:
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1235-1353` (dead-code guard, plan-only skip)
- `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:402-415` (`plannerMode = 'plan-only'` default)
- `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts:79` (create-time `lastUpdated`)
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:1050-1190` (refresh path)
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/folder-discovery.ts:660-760` (discovery-time repair)
- `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:513-555` (continuity read)
- `.opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts:361-372` (resume read)

Code-graph sibling asymmetry:
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:225-300` (hardened reference; 17 tokens)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/{scan,status,context,ccc-status,ccc-reindex,ccc-feedback}.ts` (0 tokens each)
- `.opencode/skill/system-spec-kit/mcp_server/tools/code-graph-tools.ts:55-85` (dispatcher — no caller composes handlers)

Hooks runtime parity:
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/{compact-inject.ts:403, session-prime.ts:70, shared.ts:125-129}`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/{compact-cache.ts:174, session-prime.ts:77, shared.ts:7}`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts:1-61` (no trustState read; absent compact-cache.ts)

Security bound (R53):
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:161-167, 179, 275-278` (0o700/0o600 + cwd-hashed dir)

Typed-union exhaustiveness:
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:636-682` (SharedPayloadTrustState, safe)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:302-316` (OnIndexSkipReason weak-typed lookup)
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-lifecycle.ts:128-140` (OnIndexSkipReason declaration)

P2-masking audit:
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts:133-376` (5 try/catch blocks)
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/reconsolidation.ts:507-605` (executeConflict duplicate txn)
- `.opencode/skill/system-spec-kit/mcp_server/lib/storage/importance-tiers.ts:149` (canonical predicate helper)
- `.opencode/skill/system-spec-kit/mcp_server/lib/governance/boolean-expr.ts:249-261, 316-340, 372-379` (scalarsEqual + parseScalarLiteral)

Handlers side-audit:
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:200,425` (non-canonical readiness literal)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-{resume,bootstrap,health}.ts` (M8 parity confirmed)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:165-202` (traversal-check + allow-list)

---

## 11. Related documents

- **Review report**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/016-foundational-runtime-deep-review/review-report.md`
- **Segment 1 synthesis**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/016-foundational-runtime-deep-review/FINAL-synthesis-and-review.md`
- **Segment 2 iteration files**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/016-foundational-runtime-deep-review/iterations/iteration-{051..057}.md`
- **Segment 2 deltas**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/016-foundational-runtime-deep-review/deltas/iter-{051..056}.jsonl`
- **Research state**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/016-foundational-runtime-deep-review/deep-research-state.jsonl`
- **Phase 017 commits**: afbb3bc7f..HEAD (27 fix(016) commits, landing M8 trust-state + scattered medium refactors + phase-5 test migration)
- **Operator feedback references**: `feedback_copilot_concurrency_override.md`, `feedback_phase_017_autonomous.md`

---

## 12. Next-command recommendations

| Condition | Command |
|-----------|---------|
| Ready to plan Phase 017 | `/spec_kit:plan phase-017-p1-remediation` |
| Save continuity for this research session | `/memory:save 026-graph-and-context-optimization/016-foundational-runtime-deep-review` |
| Drill deeper on a specific finding before planning | `/spec_kit:deep-research [focused-topic]` (e.g. `h-56-4-copilot-observability`) |
| Start Copilot-primary autonomous Phase 017 execution | REQUIRES T-W1-HOK-01 + T-W1-HOK-02 landed first (else H-56-4 observability gap activates during iteration) |
| Run deep-review ×7 on Wave A output | `/spec_kit:deep-review :auto` (per `feedback_phase_017_autonomous.md` gate protocol) |
