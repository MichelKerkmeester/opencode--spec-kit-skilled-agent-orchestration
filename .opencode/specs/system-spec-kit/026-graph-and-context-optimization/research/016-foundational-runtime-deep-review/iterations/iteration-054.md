# Iteration 054 — Cross-cluster dependency mapping (KQ-51-4)

**Segment**: 2 | **Dimension**: remediation-feasibility | **Dispatched**: Opus 4.7 via Task tool
**Focus KQ**: KQ-51-4 — What cross-cluster dependencies should inform Phase 017 task ordering?

---

## 1. Method

Constructed a task-dependency graph from the union of (a) the 19 remediation tasks in review-report.md §5 and (b) the 11 net-new findings surfaced by iterations 051/052/053. For each task I identified four classes of edges:

1. **File-collision edges** — two tasks that edit the same file's same lines; must serialize or merge.
2. **Infrastructure-dependency edges** — task B reads / depends on a primitive or field that task A creates.
3. **Test-coupling edges** — tasks whose regression tests depend on each other's fixtures.
4. **Rollout-ordering edges** — task B's behavior only observable after task A has landed tree-wide.

Dependencies sourced from:
- `review-report.md §5` (19 tasks with file targets, effort S/M/L)
- `iteration-051.md` (workflow.ts:1259 + workflow.ts:1333 + post-insert.ts:302 colliders)
- `iteration-052.md` (code-graph family hardening contract, hooks-runtime copilot gap)
- `iteration-053.md` (R53-P1w-001 Docker shared-tmp deployment-note mitigation)

Then I compressed the dependency graph into an orderable 4-wave plan where each wave's predecessors satisfy every edge into it.

---

## 2. Dependency graph

### 2.1 Task node inventory

I expand the review backlog with the 8 new findings from iter 51-53 that need remediation tasks assigned. Task IDs prefixed `T-W1-` are new (Wave-1 derived):

| ID | Cluster | Severity | Target file(s) | Effort | Source |
|----|---------|----------|----------------|--------|--------|
| T-SCP-01 | A | P1 | reconsolidation-bridge.ts, lineage-state.ts, types.ts, preflight.ts | M | review §5 |
| T-SCP-02 | A | P2 | `.eslintrc.js` or validate.sh | S | review §5 |
| T-CNS-01 | B | P1 | `scripts/core/workflow.ts:1259`, `scripts/dist/memory/generate-context.js` | M | review §5 + R51-P1-001 collision |
| T-CNS-02 | B | P1 | `generate-context.js` + new `backfill-research-metadata.js` | M | review §5 |
| T-CNS-03 | B | P1 | all 16 sibling 026-tree folders (sweep) | L | review §5 |
| T-CGC-01 | B | P1 | `handlers/code-graph/context.ts:87-210` | M | review §5 |
| T-CGC-02 | B | P1 | `handlers/code-graph/context.ts:98-105` | S | review §5 |
| T-EVD-01 | B | P2 | `scripts/spec/validate.sh` + new evidence-marker-linter | M | review §5 |
| T-RBD-03 | B | P2 | `post-insert.ts:344-369`, `response-builder.ts:136-201` | S | review §5 |
| T-SAN-01 | C | P1 | `shared/gate-3-classifier.ts:145-152` | S | review §5 |
| T-SAN-02 | C | P2 | `hooks/claude/shared.ts:100-119` | S | review §5 |
| T-SAN-03 | C | P2 | `p0-a-cross-runtime-tempdir-poisoning.vitest.ts`, `gate-3-classifier.vitest.ts` | S | review §5 |
| T-PIN-RET-01 | Standalone | P1 | `post-insert.ts:159-173` | M | review §5 |
| T-SRS-BND-01 | Standalone | P1 | `session-resume.ts:443-456`, `tools/lifecycle-tools.ts:67` | L | review §5 |
| T-CPN-01 | Standalone | P2 | `closing-pass-notes.md:72-88` | S | review §5 |
| T-YML-CP4-01 | Standalone | P2 | `spec_kit_complete_confirm.yaml:1099` | M | review §5 |
| T-EXH-01 | Standalone | P2 | 7+ typed unions | L | review §5 |
| T-PIN-GOD-01 | Standalone | P2 | `post-insert.ts:133-376` | L | review §5 |
| T-RCB-DUP-01 | Standalone | P2 | `reconsolidation.ts:507-600` | M | review §5 |
| **T-W1-CNS-04** | B | P1 | `scripts/core/workflow.ts:1333`, `scripts/memory/generate-context.ts:415` | M | R51-P1-002 |
| **T-W1-CNS-05** | B | P1 | `scripts/spec/validate.sh` + `writeContinuityFrontmatter()` helper | M | R51-P1-003 |
| **T-W1-PIN-02** | Standalone | P2 | `post-insert.ts:302-316` (satisfies-clause) | S | R51-P2-001 |
| **T-W1-CGC-03** | B | P1 | `handlers/code-graph/scan.ts`, `status.ts`, `ccc-status.ts`, `ccc-reindex.ts`, `ccc-feedback.ts` | L | R52-P1-001 |
| **T-W1-HOK-01** | B | P1 | new `hooks/copilot/compact-cache.ts`, extend `hooks/copilot/session-prime.ts` | M | R52-P1-002 |
| **T-W1-HOK-02** | B | P2 | extract `hooks/shared-provenance.ts` from `hooks/claude/shared.ts` | M | R52-P2-001 |
| **T-W1-MCX-01** | B | P2 | `handlers/memory-context.ts:200,425` rename readiness→advisoryPreset | S | R52-P2-002 |
| **T-W1-HST-02** | Standalone | P2 (advisory) | `hooks/claude/hook-state.ts:162` + deployment docs | S | R53-P1w-001 (doc + optional uid-hash) |

**Total**: 19 review tasks + 8 Wave-1-derived tasks = **27 tasks**.

### 2.2 Dependency edges (MUST-BEFORE)

Each edge below is `A → B` meaning "A MUST land before B." Justification is one sentence.

**Cluster B infrastructure spine (the single critical path):**

1. `T-CNS-01 → T-W1-CNS-04` — Both edit `scripts/core/workflow.ts`; CNS-01 must remove the `ctxFileWritten = false` stub and add a `lastUpdated` writer at line 1259, then CNS-04 flips the `plannerMode === 'full-auto'` guard at line 1333 so both fixes land in one coherent commit without merge conflict on a 75-line span.
2. `T-CNS-01 → T-CNS-02` — Backfill-research-metadata.js piggy-backs on the same `savePerFolderDescription` writer path that CNS-01 unlocks; attempting to write backfills before the writer exists produces no-op or double-write.
3. `T-W1-CNS-04 → T-CNS-02` — CNS-02 writes `description.json` + `graph-metadata.json` together; `graph-metadata.json.derived.*` refresh only works once CNS-04 lifts the `full-auto`-gate, otherwise backfills write stale `derived.*`.
4. `T-CNS-01 + T-W1-CNS-04 + T-CNS-02 + T-W1-CNS-05 → T-CNS-03` — The 16-folder tree-sweep assumes all four writers are live; sweeping before writers exist produces either stale data or missing files.
5. `T-W1-CNS-05 → T-CNS-03` — Continuity-freshness validator must exist before the sweep marks folders as "fresh," otherwise sweep passes but continuity blocks still drift.

**Cluster B observability contract (serial chain inside context-ts handlers):**

6. `T-CGC-01 → T-CGC-02` — CGC-02 is the deferred fallback (silent-catch → explicit unavailable branch) for when CGC-01 is not applied; if CGC-01 lands, CGC-02 is merged into it (same file:line 98-105 vs 87-210). One-or-the-other edge; never both.
7. `T-CGC-01 → T-W1-CGC-03` — Both back-port the `canonicalReadiness`/`trustState`/`lastPersistedAt` triad from `query.ts`; extract shared `lib/code-graph/readiness-contract.ts` FIRST via CGC-01 on `context.ts`, then sweep across 5 more siblings (scan.ts, status.ts, ccc-*) via W1-CGC-03. Reverse order (sweep first, shared module last) forces 6 near-duplicate inline implementations that must all be ripped out later.

**Cluster B hooks-runtime cross-runtime parity:**

8. `T-W1-HOK-02 → T-W1-HOK-01` — HOK-02 extracts `hooks/shared-provenance.ts` from Claude's shared.ts; HOK-01 adds Copilot compact-cache + session-prime trustState support. If HOK-01 lands first, Copilot re-inlines the `wrapRecoveredCompactPayload` helper that HOK-02 is supposed to extract — three-way duplication instead of one-way.
9. `T-W1-HOK-02 → (implicit)` — Extracting shared-provenance also resolves Gemini's transitive import (R52-P2-001) because Gemini's shared.ts can re-export from the new shared-provenance module.

**Cluster C sanitization (parallel within the cluster, but C tests depend on C code):**

10. `T-SAN-01 → T-SAN-03` — SAN-03 adds 5+ NFKC/unicode cases to `gate-3-classifier.vitest.ts`; those cases PASS only after SAN-01 adds the NFKC normalization to `normalizePrompt`. Landing SAN-03 first produces red tests.
11. `T-SAN-02 → T-SAN-03` — SAN-03 also renames `p0-a` test; SAN-02 adds NFKC to `sanitizeRecoveredPayload`. These are independent code changes on different files — no file-collision — but both test-adjacent, so batching SAN-01+SAN-02 before SAN-03 is simpler.

**Cluster A normalizer collapse:**

12. `T-SCP-01 → T-SCP-02` — Collapsing 4 local normalizers INTO `normalizeScopeContext` must land before the ESLint/grep-precommit rule that rejects new local definitions. If SCP-02 lands first, the existing 4 duplicates trigger the lint rule and break the repo.

**Standalone P1s (no inter-cluster dependency):**

13. `T-PIN-RET-01` — independent (touches `post-insert.ts:159-173`, orthogonal to T-W1-PIN-02 at :302-316 and T-PIN-GOD-01 at :133-376 god function).
14. `T-SRS-BND-01` — independent (authentication layer, no other P1 depends on it).
15. `T-CPN-01` — independent (docs-only amend to closing-pass-notes.md).
16. `T-YML-CP4-01` — independent (YAML predicate rewrite in spec_kit_complete_confirm.yaml).

**Standalone P2 maintainability (ordering within this group only):**

17. `T-PIN-RET-01 → T-PIN-GOD-01` — PIN-RET-01 adds a retry-exhaustion counter to an existing try/catch block in runPostInsertEnrichment; PIN-GOD-01 then extracts the whole god function into `runEnrichmentStep(...)` helpers. Extracting first forces PIN-RET-01 to land inside the already-extracted helper (merge cost).
18. `T-PIN-GOD-01 → T-W1-PIN-02` — W1-PIN-02 adds a `satisfies Record<OnIndexSkipReason, …>` clause at `post-insert.ts:302-316`; if GOD-01 has already extracted that block into a helper, the satisfies goes in the helper, else it stays inline. Either is fine but order matters for where the line lands.
19. `T-RCB-DUP-01` — independent (extracts runAtomicReconsolidationTxn helper; no other P1/P2 touches `reconsolidation.ts:507-600`).
20. `T-EXH-01` — independent (apply `assertNever` across 8 unions; orthogonal to the single W1-PIN-02 satisfies site).

### 2.3 File-collision edges

Three critical file-collision groups where multiple tasks touch the same file:

| File | Tasks colliding | Resolution |
|------|----------------|------------|
| `scripts/core/workflow.ts` | T-CNS-01 (line 1259), T-W1-CNS-04 (line 1333) | **Merge into one commit** — same file, same author, 75-line span, two related fixes. |
| `mcp_server/handlers/code-graph/context.ts` | T-CGC-01 (87-210), T-CGC-02 (98-105) | **Drop T-CGC-02** if T-CGC-01 lands (CGC-02 is the deferred fallback; review §5 says "partial R6-P1-001 mitigation if T-CGC-01 is deferred"). Only land CGC-02 alone if CGC-01 is deferred to a later phase. |
| `mcp_server/handlers/save/post-insert.ts` | T-PIN-RET-01 (159-173), T-W1-PIN-02 (302-316), T-PIN-GOD-01 (133-376), T-RBD-03 (344-369) | **Serialize**: PIN-RET-01 first (surgical retry-counter) → T-RBD-03 (comment-only) → T-PIN-GOD-01 (large extraction) → T-W1-PIN-02 (satisfies in the already-extracted helper). |
| `mcp_server/hooks/claude/shared.ts` | T-SAN-02 (100-119), T-W1-HOK-02 (extract shared-provenance) | **Serialize**: HOK-02 first extracts `wrapRecoveredCompactPayload` into shared-provenance.ts, then SAN-02 adds NFKC to the now-smaller `sanitizeRecoveredPayload` that remains in shared.ts. |
| `mcp_server/handlers/memory-context.ts` | T-W1-MCX-01 (rename readiness→advisoryPreset) | Solo — no collision. |
| `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` | T-EVD-01 (evidence-marker lint), T-W1-CNS-05 (continuity-freshness lint), T-SCP-02 (normalizer grep lint) | **Batch three lint-rule additions into one validate.sh commit** to avoid three serial merges on the same file. |

### 2.4 Test-coupling edges

| Test file | Tasks coupled | Coupling |
|-----------|--------------|----------|
| `gate-3-classifier.vitest.ts` | T-SAN-01 (code), T-SAN-03 (tests) | Code change → tests pass; tests-first → red. |
| `p0-a-cross-runtime-tempdir-poisoning.vitest.ts` | T-SAN-03 (rename `it()`) | Independent test rename; no coupling beyond SAN-02 NFKC additions. |
| `generate-context-lastUpdated-refresh.vitest.ts` (new) | T-CNS-01 (code), also validates T-W1-CNS-04 (CNS-04 flip) | Net-new test asserts lastUpdated monotonic advancement; cannot land before CNS-01+CNS-04. |
| `post-insert-rollup-divergence.vitest.ts` (new) | T-RBD-03 (comment), T-PIN-GOD-01 (refactor) | Review §6 notes the rollup divergence has no dedicated test today; adding one before GOD-01 hardens the intent before the big refactor. |

---

## 3. Findings

### R54-F-001 | Critical path — 7-node sequential chain

`T-CNS-01` → `T-W1-CNS-04` → `T-CNS-02` → `T-CGC-01` → `T-W1-CGC-03` → `T-W1-CNS-05` → `T-CNS-03`

**Reason**:
- CNS-01 is the only task that removes the hard-coded `ctxFileWritten = false` stub and installs a real `lastUpdated` writer. Nothing else in the tree can refresh `description.json.lastUpdated`, so every Cluster B surface blocks on it.
- W1-CNS-04 lifts the `plannerMode === 'full-auto'` guard on `refreshGraphMetadata`; must follow CNS-01 because both touch `workflow.ts` in an overlapping span.
- CNS-02 adds backfill for research folders; relies on both writers being live.
- CGC-01 back-ports the `canonicalReadiness/trustState/lastPersistedAt` triad to `context.ts`; must land before W1-CGC-03 extracts the same triad across 5 more siblings (sharing the readiness-contract module).
- W1-CGC-03 propagates the triad to scan/status/ccc-*.
- W1-CNS-05 adds continuity-freshness validator (needs all above writers emitting fresh timestamps so validator can score "recent").
- CNS-03 sweeps 16 folders at end — mandatorily last in the chain because the sweep consumes every preceding writer.

**Duration estimate** (effort sum, S=2h / M=4h / L=16h — lower-bound):
- T-CNS-01 (M, 4h) + T-W1-CNS-04 (M, 4h, folded-in = marginal 2h) + T-CNS-02 (M, 4h) + T-CGC-01 (M, 4h) + T-W1-CGC-03 (L, 16h) + T-W1-CNS-05 (M, 4h) + T-CNS-03 (L, 16h) = **~50h (6 working days)**.

Every other task in Phase 017 is parallelizable around this spine.

### R54-F-002 | Parallel lanes (3 independent lanes after Wave A lands)

**Lane A — Cluster C sanitization** (S+S+S=6h parallel to critical path): T-SAN-01 → T-SAN-02 → T-SAN-03. Independent from Cluster B infrastructure. Only touches `gate-3-classifier.ts`, `hooks/claude/shared.ts`, and 2 test files. No edges into critical path.

**Lane B — Cluster A + SRS auth** (M+S+L=22h parallel to critical path): T-SCP-01 → T-SCP-02 in one batch; T-SRS-BND-01 solo. All target files are in `handlers/save/*`, `lib/storage/*`, `lib/validation/*`, `lib/governance/*`, `handlers/session-resume.ts` — zero overlap with Cluster B save pipeline.

**Lane C — Hooks runtime parity** (M+M=8h parallel to critical path, but Wave-B level): T-W1-HOK-02 → T-W1-HOK-01. Touches `hooks/shared-provenance.ts` (new), `hooks/copilot/*` (new/extended). Independent of code-graph handlers and the save pipeline.

**Lane D — Standalone maintainability P2s** (L+L+M=36h parallel, lowest priority): T-EXH-01, T-PIN-GOD-01 → T-W1-PIN-02, T-RCB-DUP-01, T-YML-CP4-01. These can drift across phases; do not block Phase 017 ship.

### R54-F-003 | Rollout hazards (must-deploy-together or regress-if-split)

1. **T-CNS-01 + T-W1-CNS-04 MUST ship atomic.** If CNS-01 ships alone, `description.json.lastUpdated` starts updating but `graph-metadata.json.derived.last_save_at` still lags (plan-only default). Consumers reading both fields see a NEW divergence: description is fresh, graph-metadata is stale — opposite of today's "both stale" failure mode. Atomic ship eliminates the transient-inconsistency window.

2. **T-CGC-01 + T-W1-CGC-03 MUST ship atomic (or be staged with a feature flag).** If CGC-01 lands but W1-CGC-03 is deferred, consumers routing on `trustState` see inconsistent vocabulary across the code-graph family: `query.ts` and `context.ts` emit full 4-state vocabulary, but `scan.ts`/`status.ts`/`ccc-*` emit nothing. A naive consumer that keys off `trustState !== undefined` would now incorrectly conclude that scan/status/ccc-* failed. Remedy: atomic ship OR emit a stub `trustState: 'unavailable'` on the laggard siblings during the gap.

3. **T-W1-HOK-02 MUST precede T-W1-HOK-01.** Extracting shared-provenance after adding Copilot compact-cache means Copilot re-inlines `wrapRecoveredCompactPayload` as a literal copy of the Claude implementation — a third duplicate that HOK-02 then has to remove. Pre-extract = one file, one copy, clean consumer list.

4. **T-SAN-01 and T-SAN-03 MUST land together.** SAN-03 adds 5+ NFKC/unicode test cases to `gate-3-classifier.vitest.ts`. These cases FAIL until SAN-01 lands. Splitting across two commits means the repo is red between them. Mitigation: land SAN-01 first, then SAN-03 same PR / same day.

5. **T-CNS-03 is a 16-folder WRITE sweep.** If any of the preceding writers (CNS-01, CNS-04, CNS-02, W1-CNS-05) are not live, the sweep writes stale values that persist until the next sweep. This is the single highest rollback cost in Phase 017 — **never run CNS-03 until every preceding writer is verified live** via a small smoke-test (write 1 test folder first, verify all 4 fields fresh, then fan out).

6. **T-SCP-02 (lint) MUST follow T-SCP-01 (collapse) in the same PR.** Landing the lint first breaks the build because the 4 duplicates still exist.

7. **T-EVD-01 evidence-marker lint must not activate in `--strict` mode before the checklist.md rewrapping ships.** 170/179 completed items in the 016 checklist.md use `)` instead of `]` (R3-P2-002). Activating the lint before the rewrap means the validator fails the existing packet itself. Sequence: (a) rewrap 170 markers in 016 checklist.md, (b) land T-EVD-01 lint, (c) lint becomes effective for all future packets.

---

## 4. Proposed Phase 017 wave plan

### Wave A — Infrastructure primitives (blocks everything downstream)

**Goal**: Make Cluster B canonical-save pipeline self-healing and land the code-graph readiness contract shared module.

- **T-CNS-01** + **T-W1-CNS-04** (merged PR) — `scripts/core/workflow.ts` fixes: remove dead `ctxFileWritten = false` stub, add real `lastUpdated` writer, lift `plannerMode === 'full-auto'` guard so refreshGraphMetadata runs on every save. *Why first:* everything in Cluster B is downstream of these two writers.
- **T-CGC-01** — `handlers/code-graph/context.ts`: extract `lib/code-graph/readiness-contract.ts` (shared module) and consume it from context.ts. *Why first:* W1-CGC-03 needs the extracted module to exist before it can sweep 5 more siblings.
- **T-W1-HOK-02** — extract `hooks/shared-provenance.ts` from `hooks/claude/shared.ts`. *Why first:* HOK-01 (copilot hooks) and SAN-02 (NFKC in shared.ts) both depend on the shape of the refactored shared.ts.
- **T-SCP-01** — collapse 4 local `normalizeScope*` helpers to canonical `normalizeScopeContext`. *Why first:* T-SCP-02 lint rule depends on this.

**Wave A effort**: ~20h (2.5 days) — entirely on critical path.

### Wave B — Cluster consumers (depend on Wave A primitives)

**Goal**: Consume the Wave-A primitives across every surface that needs them.

- **T-CNS-02** — backfill research folders (consumes CNS-01 writer + CNS-04 refresh).
- **T-W1-CNS-05** — continuity-freshness validator (consumes CNS-01 timestamps).
- **T-W1-CGC-03** — propagate readiness-contract across 5 code-graph siblings (scan, status, ccc-status, ccc-reindex, ccc-feedback).
- **T-W1-HOK-01** — Copilot compact-cache + session-prime trustState (consumes HOK-02's shared-provenance).
- **T-SCP-02** — ESLint/grep rule rejecting new local normalizers (consumes SCP-01 collapse).
- **T-SAN-01** — `gate-3-classifier.ts` NFKC + zero-width stripping (independent, but batch with Cluster C).
- **T-SAN-02** — `sanitizeRecoveredPayload` NFKC (consumes HOK-02 shared.ts refactor).
- **T-SAN-03** — NFKC/unicode test additions + p0-a rename (consumes SAN-01 + SAN-02).
- **T-SRS-BND-01** — session-resume authentication (independent, high-value P1 — can ship anytime in Wave B).
- **T-PIN-RET-01** — retry-exhaustion counter at post-insert.ts:159-173 (independent).

**Wave B effort**: ~30h (4 days) — parallelizable across 3 lanes.

### Wave C — Tree-wide rollout and new lints (depend on Wave B writers)

**Goal**: Apply the now-working writers and validators across the tree; activate strict-mode lints.

- **Rewrap 016 checklist.md evidence markers** (170/179 `)` → `]`) — manual or scripted; no task ID because review §5 treats as part of T-EVD-01 deployment.
- **T-EVD-01** — evidence-marker lint in validate.sh (now safe to activate).
- **T-CNS-03** — canonical-save sweep across 16 sibling 026-tree folders. MUST run after Wave A+B are verified live; verify on 1 test folder before fan-out.
- **T-CPN-01** — amend closing-pass-notes.md §CP-002 with `[STATUS: RESOLVED 2026-04-17]`.
- **T-RBD-03** — design-intent comment blocks at `post-insert.ts:344-369` + `response-builder.ts:136-201`.
- **T-W1-MCX-01** — rename `readiness` → `advisoryPreset` in `memory-context.ts:200,425`.

**Wave C effort**: ~15h (2 days) — mostly rollout + docs.

### Wave D — Non-urgent P2 maintainability (parallel, can slip)

**Goal**: High-leverage P2 hardening without blocking Phase 017 ship.

- **T-EXH-01** — `assertNever` utility + 8 typed-union applications. *Independent.*
- **T-PIN-GOD-01** — extract `runEnrichmentStep` helper; refactor `runPostInsertEnrichment` from 243 LOC to ~80. *Independent but PIN-RET-01 must precede to avoid merge cost.*
- **T-W1-PIN-02** — `satisfies Record<OnIndexSkipReason, …>` at post-insert.ts:302. *Depends on PIN-GOD-01 for location.*
- **T-RCB-DUP-01** — extract `runAtomicReconsolidationTxn` helper for duplicate transaction blocks. *Independent.*
- **T-YML-CP4-01** — replace prose `when:` string with typed predicate at `spec_kit_complete_confirm.yaml:1099`. *Independent.*
- **T-W1-HST-02** — deployment note advising against `-v /tmp:/tmp` across Copilot MCP containers; optional `getProjectHash()` uid-hash defense-in-depth. *Independent.*

**Wave D effort**: ~40h (5 days) — fully parallel to Waves A-C; can split across multiple PRs / multiple phases.

**Total Phase 017 effort**: ~105h (13 working days) with parallelization; ~60h on the critical path (Waves A → B → C, ~7 days).

---

## 5. Resolved questions

- [x] **KQ-51-4**: The dependency graph has one dominant spine (Cluster B infrastructure: workflow.ts writers → research-backfill → code-graph readiness-contract → continuity-validator → 16-folder sweep) and three independent lanes (Cluster C sanitization; Cluster A + SRS auth; hooks-runtime parity). The 4-wave plan serialises the spine in Wave A→B→C, runs the three lanes parallel to Wave B, and defers Wave D P2s without blocking Phase 017 ship. Confidence 0.88 — all edges are file-level verifiable; effort estimates are lower-bound (S=2h, M=4h, L=16h) per review §5 grading.

---

## 6. Ruled-out directions

- **"Land T-CNS-03 first to expose the pipeline gaps"**: Ruled out. CNS-03 is a write-sweep; running it before the writers are live produces stale data that persists until the next sweep. CNS-03 is strictly last in Wave C.
- **"Parallelize T-CGC-01 and T-W1-CGC-03 by having both write into `lib/code-graph/readiness-contract.ts` concurrently"**: Ruled out. The shared module's API is defined by CGC-01's refactor of context.ts. W1-CGC-03 consumes that API. Parallel drift risks API split.
- **"Defer T-W1-HOK-02 (shared-provenance extraction) to after Phase 017"**: Ruled out by the review's atomic-ship hazard: if HOK-01 lands before HOK-02, Copilot re-inlines the `wrapRecoveredCompactPayload` helper as a third duplicate. Cheaper to extract first.
- **"Land T-EVD-01 evidence-marker lint in strict mode immediately"**: Ruled out. 170/179 markers in the 016 checklist.md are malformed; strict-mode activation fails the validating packet. Sequence is: rewrap first, lint second.
- **"Ship T-EXH-01 (assertNever + 8 union applications) as part of Wave A"**: Ruled out. EXH-01 is L-effort, touches 8+ files across handlers/ and lib/, and has zero infrastructure dependency. Belongs in Wave D.
- **"Merge T-SCP-01 and T-SCP-02 into a single PR"**: Kept (they must ship together to avoid the lint breaking the build during the collapse). But noting this as an explicit constraint in the wave plan, not a separate edge.

---

## 7. Metrics

- Tasks analyzed: 27 (19 review + 8 Wave-1-derived)
- Dependency edges identified: 20 (12 must-before + 5 file-collision + 3 test-coupling — some overlap)
- Critical path length: 7 nodes, ~50h lower-bound
- Parallel lanes: 4 (Lane A, B, C, D above; Waves A-C are sequential on the spine but Lanes run parallel to B)
- Rollout hazards flagged: 7
- Rulings ruled out: 6
- newInfoRatio: 1.0 (this is a plan-synthesis iteration, all findings are net-new derived from cross-cluster inspection)

---

## 8. Next-focus recommendation

Segment 2 now has:
- Iter 51 — Cluster B depth (4 canonical-save surfaces)
- Iter 52 — Sibling-asymmetry recurrence (code-graph family + hooks family)
- Iter 53 — Blast-radius expansion (no P0 escalation under 5 threat classes)
- Iter 54 — **Dependency graph and Wave plan (this iteration)**

Recommended next focus:

1. **KQ-51-6 (verification-scope mapping)**: Of the 16 sibling 026-tree folders, which have custom `manual.*` fields in `graph-metadata.json` that an overly-aggressive refresh in W1-CNS-04 might wipe? A pre-flight spot-check protects the tree-wide sweep.
2. **KQ-51-7 (test coverage gaps on the new tasks)**: The 8 Wave-1-derived tasks each imply regression tests. Does the existing test suite cover them, or is there a test-debt count that belongs in Wave B alongside the code changes?
3. **KQ-51-8 (convergence check)**: Segment-2 has surfaced 11 net-new findings across 4 iterations. Measure newFindingsRatio against the cumulative P1/P2 weighted total — is segment 2 converging (<0.10) or does a further iter 55 discovery dimension merit dispatch?

Dimension (3) is the most defensible next step — it tests whether segment 2 has hit its own 6-iteration target per the original review convergence cadence (iter 6 fell below threshold at 0.0923; segment 2 might do the same at iter 54 or iter 55). If it has converged, the proper next move is a synthesis iteration (like review's iter 7) that rolls segment-2 findings into an updated remediation backlog. If not, KQ-51-6 or KQ-51-7 become the next discovery KQs.
