---
title: "Tasks: Phase 017 Wave B — Cluster Consumers"
description: "Wave B task manifest: 9 tasks / 30h across 3 parallel lanes. Lane B1 (4 tasks / 12h), Lane B2 (2 tasks / 16h), Lane B3 (3 tasks / 12h). Full acceptance criteria with finding crosswalk + atomic-ship constraints."
trigger_phrases: ["017 wave b tasks", "t-cns-02 t-w1-cns-05 t-cgc-02 t-rbd-03", "t-w1-cgc-03 t-w1-hok-01", "t-scp-02 t-san-01 t-san-02 t-san-03 t-pin-ret-01", "017 lane b1 tasks", "017 lane b2 tasks", "017 lane b3 tasks"]
importance_tier: "critical"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime/003-cluster-consumers"
    last_updated_at: "2026-04-17T14:41:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Child 002 Wave B tasks scaffolded from parent tasks.md Wave B section"
    next_safe_action: "Begin Lane B1/B2/B3 dispatch after Wave A merge"
    blockers: ["Wave A merge prerequisite"]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Phase 017 Wave B — Cluster Consumers

<!-- ANCHOR:notation -->
## Notation

**Legend**: pending • complete • in progress • blocked

**Effort**: S=≤2h • M=2-8h • L=≥1 day

**Severity**: P0 (blocker) • P1 (required) • P2 (suggestion)

**Task ID scheme**:
- `T-XXX-NN` — original review-report task IDs
- `T-W1-XXX-NN` — segment-2 (Wave 1 research-extension) task IDs

**Finding ID scheme**:
- `R<N>-P<sev>-NNN` — review findings (N=review-iter, sev=0/1/2)
- `R5<N>-P<sev>-NNN` — segment-2 iteration findings (N=iter 51-56)
- `H-56-N` — compound-hypothesis IDs from iter 56

**Lane-to-phase mapping**:
- Lane B1 (Cluster B consumers) = Phase 1
- Lane B2 (Cluster D + E) = Phase 2
- Lane B3 (Cluster A + C + Standalone P1) = Phase 3

**Wave B runs all 3 "phases" in parallel** — numbering preserves SpecKit template convention, not sequential ordering.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Lane B1 — Cluster B Consumers (4 tasks, 12h) [PHASE 1]

### T-CNS-02 — [x] Research folder backfill [EVIDENCE: 88063287b]

**Severity**: P1 | **Effort**: M (4h) | **Lane**: B1
**Files**: New `.opencode/skill/system-spec-kit/scripts/memory/backfill-research-metadata.ts`; wire into `generate-context.js`
**Resolves**: R3-P1-002, R56-P1-NEW-003

**Changes**:
1. Walk `research/NNN-*/iterations/` directories under the target spec folder.
2. For each missing `description.json` OR `graph-metadata.json`, auto-create from template.
3. Run as post-step of canonical save when target spec folder has a `research/` child.
4. Missing-only semantics — DO NOT overwrite existing metadata.

**Acceptance**:
- Verified: All `research/NNN-*/iterations/` directories have `description.json` + `graph-metadata.json` post-run [EVIDENCE: 88063287b]
- Verified: Post-save wires `backfill-research-metadata` when target has `research/` child [EVIDENCE: 88063287b]
- Verified: Vitest covers missing-both, missing-one, already-present cases [EVIDENCE: 88063287b]
- Verified: Existing metadata files untouched (diff-check on an already-backfilled folder returns 0) [EVIDENCE: 88063287b]

**Evidence**: [EVIDENCE: 88063287b]

### T-W1-CNS-05 — [x] Continuity freshness validator [EVIDENCE: 32a180bba]

**Severity**: P1 | **Effort**: M (4h) | **Lane**: B1
**Files**: `scripts/spec/validate.sh`, new `scripts/validation/continuity-freshness.ts`
**Resolves**: R51-P1-003

**Changes**:
1. Parse `implementation-summary.md` frontmatter `_memory.continuity`.
2. Warn if `_memory.continuity.last_updated_at` older than `graph-metadata.json.derived.last_save_at` by more than 10m.
3. Wire into `--strict` mode.
4. Optional: `writeContinuityFrontmatter()` helper — deferred to Phase 019 candidate list.

**Acceptance**:
- Verified: `validate.sh --strict` warns when `_memory.continuity.last_updated_at < graph-metadata.derived.last_save_at - 10m` [EVIDENCE: 32a180bba]
- Verified: Passes for fresh folders [EVIDENCE: 32a180bba]
- Verified: Warns for stale (induced fixture + real stale folder smoke test) [EVIDENCE: 32a180bba]
- Verified: 10m boundary is inclusive of 10m exactly, excluded at 10m+1s [EVIDENCE: 32a180bba]

**Evidence**: [EVIDENCE: 32a180bba]

### T-CGC-02 — [x] context.ts explicit error branch [EVIDENCE: db36c3194]

**Severity**: P1 (partial R6-P1-001 mitigation) | **Effort**: S (2h) | **Lane**: B1
**Files**: `handlers/code-graph/context.ts:98-105`
**Resolves**: Partial R6-P1-001

**Changes**: Replace silent catch into `freshness: 'empty'` stub with explicit `error → 'unavailable'` branch emitting `readiness_check_crashed` reason.

**Acceptance**:
- Verified: Silent catch replaced with `error → 'unavailable'` branch [EVIDENCE: db36c3194]
- Verified: Emits `readiness_check_crashed` reason on thrown exception [EVIDENCE: db36c3194]
- Verified: Vitest covers thrown-exception path [EVIDENCE: db36c3194]
- Verified: Prior happy-path behavior unchanged [EVIDENCE: db36c3194]

**Note**: Layered observability improvement. T-W1-CGC-03 (Lane B2) adds the full readiness vocabulary; T-CGC-02 is a narrow mitigation that stands alone even if CGC-03 deferred.

**Evidence**: [EVIDENCE: db36c3194]

### T-RBD-03 — [x] Design-intent comments at rollup sites [EVIDENCE: f42c5d3b6]

**Severity**: P2 | **Effort**: S (2h) | **Lane**: B1
**Files**: `handlers/save/post-insert.ts:344-369`, `handlers/save/response-builder.ts:136-201`
**Resolves**: R6-P2-001

**Changes**: Add design-intent comment blocks at both rollup sites citing T-RBD-01 / commit `709727e98`. Comments explain:
- post-insert tracks failure-with-recovery
- response surfaces nuance to MCP clients

**Acceptance**:
- Verified: Both rollup sites have design-intent comment blocks [EVIDENCE: f42c5d3b6]
- Verified: Comments cite T-RBD-01 / commit `709727e98` [EVIDENCE: f42c5d3b6]
- Verified: Post-insert comment explicitly mentions "failure-with-recovery" [EVIDENCE: f42c5d3b6]
- Verified: Response-builder comment explicitly mentions "MCP-client nuance" [EVIDENCE: f42c5d3b6]

**Evidence**: [EVIDENCE: f42c5d3b6]

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Lane B2 — Cluster D + Cluster E (2 tasks, 16h) [PHASE 2]

### T-W1-CGC-03 — [x] 5-sibling code-graph readiness propagation [EVIDENCE: f253194bf]

**Severity**: P1 | **Effort**: L (16h) | **Lane**: B2
**Files**: `handlers/code-graph/scan.ts`, `status.ts`, `context.ts`, `ccc-status.ts`, `ccc-reindex.ts`, `ccc-feedback.ts`
**Resolves**: R52-P1-001 (Cluster D)

**Changes**:
1. Each handler imports from `lib/code-graph/readiness-contract.ts` (created in Wave A T-CGC-01).
2. Emit `canonicalReadiness` + `trustState` + `lastPersistedAt` in each handler's return payload.
3. `status.ts` is HIGHEST priority (IS the canonical readiness probe) — verify parity with Wave A `query.ts`.
4. Use 4-state vocabulary EXCLUSIVELY: `'live' | 'stale' | 'absent' | 'unavailable'`. No new values.

**Acceptance**:
- Verified: All 6 handlers import from `lib/code-graph/readiness-contract.ts` [EVIDENCE: f253194bf]
- Verified: Each emits `canonicalReadiness` + `trustState` + `lastPersistedAt` [EVIDENCE: f253194bf]
- Verified: 4-state vocabulary used exclusively (no `'cached'` or other values added) [EVIDENCE: f253194bf]
- Verified: `status.ts` parity verified with `query.ts` behavior (IS canonical readiness probe) [EVIDENCE: f253194bf]
- Verified: Vitest per-handler: 6 test files each asserting 3-field emission [EVIDENCE: f253194bf]
- Verified: Shared-contract fixture test asserts all 6 handlers agree with `query.ts` [EVIDENCE: f253194bf]

**Atomic-ship**: MUST land as ONE PR OR emit `trustState: 'unavailable'` stubs in un-refactored handlers during staged rollout.

**Evidence**: [EVIDENCE: f253194bf]

### T-W1-HOK-01 — [x] Copilot compact-cache + session-prime [EVIDENCE: 5923737c7]

**Severity**: P1 | **Effort**: M (6h) | **Lane**: B2
**Files**: New `hooks/copilot/compact-cache.ts`; extend `hooks/copilot/session-prime.ts`
**Resolves**: R52-P1-002 (Cluster E), R56-P1-NEW-002 (H-56-4)

**Changes**:
1. Create `compact-cache.ts` that writes `trustState: 'cached'` using helpers from `hooks/shared-provenance.ts` (Wave A T-W1-HOK-02).
2. Extend `session-prime.ts` to read `payloadContract?.provenance.trustState` at entry.
3. Vitest: parallel test to Claude + Gemini compact-cycle tests.

**Acceptance**:
- Verified: `compact-cache.ts` exists and writes `trustState: 'cached'` via `hooks/shared-provenance.ts` [EVIDENCE: 5923737c7]
- Verified: `session-prime.ts` reads `payloadContract?.provenance.trustState` at entry [EVIDENCE: 5923737c7]
- Verified: Parallel vitest to Claude + Gemini compact-cycle tests passes [EVIDENCE: 5923737c7]
- Verified: No re-inlined `wrapRecoveredCompactPayload` in Copilot path (import from shared-provenance only) [EVIDENCE: 5923737c7]
- Verified: `SharedPayloadTrustState` vocabulary for hooks is separate from code-graph `TrustState` (not conflated) [EVIDENCE: 5923737c7]

**Constraint**: MUST follow T-W1-HOK-02 (Wave A) — reverse order creates third duplicate of `wrapRecoveredCompactPayload`.

**Evidence**: [EVIDENCE: 5923737c7]

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Lane B3 — Cluster A + Cluster C + Standalone P1 (3 tasks, 12h) [PHASE 3]

### T-SCP-02 — [x] Normalizer lint rule [EVIDENCE: ded5ece07]

**Severity**: P2 (prevention) | **Effort**: S (2h) | **Lane**: B3
**Files**: `.eslintrc.js` or `scripts/spec/validate.sh`
**Resolves**: R4-P1-001 prevention

**Changes**: Add lint that rejects new in-module `normalizeScope*` or `getOptionalString` helpers (exempt `scope-governance.ts`).

**Acceptance**:
- Verified: Lint rejects new in-module `normalizeScope*` / `getOptionalString` helpers [EVIDENCE: ded5ece07]
- Verified: Exempts `scope-governance.ts` canonical file [EVIDENCE: ded5ece07]
- Verified: Lint passes against current tree (post Wave A T-SCP-01 collapse) [EVIDENCE: ded5ece07]
- Verified: Scratch-branch smoke test: introducing `const normalizeScopeFoo = (x) => x` in any handler fails lint [EVIDENCE: ded5ece07]
- Verified: `getOptionalString` same test path — lint fires on net-new declaration [EVIDENCE: ded5ece07]

**Constraint**: MUST follow Wave A T-SCP-01. Lint before collapse would break build (multiple extant declarations).

**Evidence**: [EVIDENCE: ded5ece07]

### T-SAN-01 + T-SAN-02 + T-SAN-03 — [x] NFKC unicode normalization + tests [EVIDENCE: 1bd7856a9]

**Severity**: P1 + P2 | **Effort**: S+S+S (6h total) | **Lane**: B3
**Files**:
- `shared/gate-3-classifier.ts:145-152` (T-SAN-01)
- `mcp_server/hooks/claude/shared.ts:100-119` (T-SAN-02)
- `scripts/tests/gate-3-classifier.vitest.ts` (T-SAN-03)
- `mcp_server/tests/p0-a-cross-runtime-tempdir-poisoning.vitest.ts:11, 67, 152-154` (T-SAN-03 renames)

**Resolves**: R2-P1-002, R2-P2-001, R3-P2-003, R5-P2-001

**Changes**:
1. **T-SAN-01**: Add `.normalize('NFKC')` + `/[\u00AD\u200B-\u200F\uFEFF]/g` stripping to `normalizePrompt`. Order: NFKC first, then strip.
2. **T-SAN-02**: Mirror NFKC pass to `sanitizeRecoveredPayload` regex preprocessing.
3. **T-SAN-03**: Add 5+ unicode test cases; rename p0-a test it() block.

**Acceptance**:
- Verified: `normalizePrompt` applies `.normalize('NFKC')` [EVIDENCE: 1bd7856a9]
- Verified: `normalizePrompt` strips `[\u00AD\u200B-\u200F\uFEFF]` [EVIDENCE: 1bd7856a9]
- Verified: Order: NFKC first, then strip (verified by single combined-homoglyph+zero-width fixture) [EVIDENCE: 1bd7856a9]
- Verified: `sanitizeRecoveredPayload` mirrors NFKC pass [EVIDENCE: 1bd7856a9]
- Verified: 5+ unicode test cases present in `gate-3-classifier.vitest.ts`: [EVIDENCE: 1bd7856a9]
  - Cyrillic `е` → Latin `e`
  - Soft hyphen `\u00AD`
  - Zero-width space `\u200B`
  - Greek `Ε` → Latin `E`
  - Combined homoglyph + zero-width (e.g. `SYST\u0395M:\u200B`)
- Verified: p0-a test `it()` block renamed to "Claude and Gemini consumers" [EVIDENCE: 1bd7856a9]
- Verified: Schema-share note added for OpenCode in p0-a test [EVIDENCE: 1bd7856a9]

**Atomic-ship**: T-SAN-01 + T-SAN-03 MUST land in same PR (tests fail until code lands). T-SAN-02 recommended same PR.

**Evidence**: [EVIDENCE: 1bd7856a9]

### T-PIN-RET-01 — [x] Retry-exhaustion counter [EVIDENCE: 61f93c9bf]

**Severity**: P1 | **Effort**: M (4h) | **Lane**: B3
**Files**: `handlers/save/post-insert.ts:159-173, 347-365`; new `lib/enrichment/retry-budget.ts`
**Resolves**: R1-P1-002

**Changes**:
1. Add retry-exhaustion counter keyed on `(memoryId, step, reason)`.
2. Skip `runEnrichmentBackfill` after N=3 retries for `partial_causal_link_unresolved` outcomes.
3. Emit structured warning log on exhaustion.
4. Vitest: assert 3rd retry attempted; 4th attempt skipped with log.

**Acceptance**:
- Verified: `lib/enrichment/retry-budget.ts` exists [EVIDENCE: 61f93c9bf]
- Verified: Counter keyed on `(memoryId, step, reason)` tuple [EVIDENCE: 61f93c9bf]
- Verified: Skip after N=3 retries for `partial_causal_link_unresolved` [EVIDENCE: 61f93c9bf]
- Verified: Structured warning log emitted on exhaustion (`retry_exhausted` signal) [EVIDENCE: 61f93c9bf]
- Verified: Vitest: 3rd retry attempted, 4th skipped with log [EVIDENCE: 61f93c9bf]
- Verified: Counter scope is per-process / per-enrichment-context (NOT session-global) [EVIDENCE: 61f93c9bf]
- Verified: Counter does not persist across process restart (documented assumption) [EVIDENCE: 61f93c9bf]

**Evidence**: [EVIDENCE: 61f93c9bf]

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Wave B Gate — Completion Criteria

After all 9 tasks across 3 lanes merge:

### Mandatory gate checks

- Completed: `/spec_kit:deep-review :auto` ×7 on Wave B scope emits ZERO new P0
- Completed: `/spec_kit:deep-review :auto` ×7 on Wave B scope emits ZERO new P1
- Completed: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict` on 017 folder exits 0 with 0 warnings
- Completed: Vitest suite passes end-to-end
- Completed: T-W1-CGC-03 atomic-ship verified (`git log --follow handlers/code-graph/`)
- Completed: T-W1-HOK-01 ordering verified (T-W1-HOK-02 landed first in Wave A)
- Completed: T-SAN-01 + T-SAN-03 atomic-ship verified (single merge commit)

### Lane-specific gates

- Completed: **Lane B1 gate**: CHK-B1-01..04 all verified (see `checklist.md`)
- Completed: **Lane B2 gate**: CHK-B2-01..02 all verified
- Completed: **Lane B3 gate**: CHK-B3-01..03 all verified

### Artifact refresh

- Completed: Parent `implementation-summary.md` updated with Wave B outcomes
- Completed: Parent `checklist.md` CHK-B1/B2/B3 items marked complete with `[EVIDENCE:]` citations
- Completed: All Wave B `tasks.md` entries above carry `[EVIDENCE: <commit-hash>]` closers (canonical `]`, not `)`)

### Downstream unblock

- Completed: Wave C kickoff signal fired (child 003 `spec.md` status flips from blocked to ready_for_implementation)
- Completed: Cluster E closure confirmed — autonomous Copilot iteration can proceed past H-56-4 blocker

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

### Source documents (this child)

- **Spec**: `spec.md` (this folder) — frozen Wave B scope, 9-task inventory, FC-3/4/5/6/8 ownership
- **Plan**: `plan.md` (this folder) — 3-lane execution map, quality gates, architecture
- **Checklist**: `checklist.md` (this folder) — CHK-B1/B2/B3 verification items + CHK-B-GATE
- **Description**: `description.json` (this folder) — structured metadata
- **Graph**: `graph-metadata.json` (this folder) — dependency graph

### Parent (017 remediation packet)

- `../spec.md` — frozen 27-task scope, cluster inventory
- `../plan.md` — 4-wave execution plan, §3 Wave B detailed breakdowns
- `../tasks.md` — 27-task manifest (Wave B section mirrored here)
- `../checklist.md` — P0/P1/P2 verification (CHK-B1-*/B2-*/B3-* items)
- `../implementation-summary.md` — wave-by-wave outcomes (updated post Wave B)

### Upstream (Wave A child 001 — blocker)

- `../001-infrastructure-primitives/spec.md` — must be merged to `main` before Wave B
- `../001-infrastructure-primitives/implementation-summary.md` — Wave A closure

### Upstream research

- `../../../review/016-foundational-runtime-001-initial-research/review-report.md`
- `../../../research/016-foundational-runtime-001-initial-research/FINAL-synthesis-and-review.md`
- `../../../research/016-foundational-runtime-001-initial-research/segment-2-synthesis.md`

### Related operator feedback

- `feedback_phase_018_autonomous` (user memory) — dispatch deep-review ×7 per gate
- `feedback_copilot_concurrency_override` (user memory) — 3-concurrent Copilot limit
- `feedback_stop_over_confirming` (user memory) — skip A/B/C/D menus
- `feedback_worktree_cleanliness_not_a_blocker` (user memory) — dirty-state baseline acceptable

### Finding ID crosswalk (Wave B subset)

- **Cluster A**: R4-P1-001 (prevention) → T-SCP-02
- **Cluster B**: R3-P1-002 → T-CNS-02; R51-P1-003 → T-W1-CNS-05; R6-P1-001 (partial) → T-CGC-02; R6-P2-001 → T-RBD-03; R56-P1-NEW-003 → T-CNS-02
- **Cluster C**: R2-P1-002 → T-SAN-01+03; R2-P2-001 → T-SAN-02; R3-P2-003 → T-SAN-03; R5-P2-001 → T-SAN-03
- **Cluster D**: R52-P1-001 → T-W1-CGC-03
- **Cluster E**: R52-P1-002 → T-W1-HOK-01; R56-P1-NEW-002 → T-W1-HOK-01
- **Standalone**: R1-P1-002 → T-PIN-RET-01
<!-- /ANCHOR:cross-refs -->

---

## Progress Summary

| Lane | Tasks | Total effort | Status |
|------|-------|--------------|--------|
| Lane B1 (Cluster B consumers) | 4 | 12h | complete |
| Lane B2 (Cluster D + E) | 2 | 16h | complete |
| Lane B3 (Cluster A + C + Standalone P1) | 3 | 12h | complete |
| **Wave B total** | **9** | **30h** | **61/61 complete** |

**Wall-clock**: ~16h (bottleneck = Lane B2 T-W1-CGC-03)

**Wave B atomic-ship groups**:
- Group 1: T-W1-CGC-03 — single PR (6 handlers) OR staged with `trustState: 'unavailable'` stubs
- Group 2: T-SAN-01 + T-SAN-03 — single PR (tests fail without code)
- Group 3: T-W1-HOK-01 — depends on Wave A T-W1-HOK-02 landed first

**Wave B ordering constraints** (within parallel lanes):
- T-SCP-02 after Wave A T-SCP-01 merged
- T-W1-HOK-01 after Wave A T-W1-HOK-02 merged
- T-CNS-02 post Wave A T-CNS-01 + T-W1-CNS-04 merged (post-save hook requires canonical writer)
- T-W1-CNS-05 post Wave A T-W1-CNS-04 merged (freshness validator needs refreshed `derived.last_save_at`)
