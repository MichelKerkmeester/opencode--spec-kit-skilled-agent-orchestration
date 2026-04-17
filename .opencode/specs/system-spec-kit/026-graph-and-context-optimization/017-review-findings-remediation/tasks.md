---
title: "Tasks: Phase 017 Review-Findings Remediation"
description: "27 tasks across 4 waves (A=5, B=9, C=5, D=8). Full acceptance criteria with finding crosswalk. Status tracking per task. Evidence citations pending implementation."
trigger_phrases: ["017 tasks", "phase 017 tasks", "t-cns-01", "t-w1-cgc-03", "t-w1-hok-01 copilot compact"]
importance_tier: "critical"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/017-review-findings-remediation"
    last_updated_at: "2026-04-17T14:10:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "27-task scaffolding from segment-2 synthesis"
    next_safe_action: "Begin Wave A implementation"
    blockers: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Phase 017 Review-Findings Remediation

<!-- ANCHOR:notation -->
## Notation

**Legend**: `[ ]` pending • `[x]` complete • `[~]` in progress • `[!]` blocked
**Effort**: S=≤2h • M=2-8h • L=≥1 day
**Severity**: P0 (blocker) • P1 (required) • P2 (suggestion)
**Task ID scheme**:
- `T-XXX-NN` — original review-report task IDs
- `T-W1-XXX-NN` — segment-2 (Wave 1 research-extension) task IDs
**Finding ID scheme**:
- `R<N>-P<sev>-NNN` — review findings (N=review-iter, sev=0/1/2)
- `R5<N>-P<sev>-NNN` — segment-2 iteration findings (N=iter 51-56)
- `H-56-N` — compound-hypothesis IDs from iter 56
**Wave-to-phase mapping**:
- Wave A = Phase 1 (infrastructure)
- Wave B = Phase 2 (consumers)
- Wave C = Phase 3 (rollout)
- Wave D = deferred maintainability (not a "phase" per template)
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Wave A — Infrastructure Primitives (5 tasks, 20h) [PHASE 1]

### T-CNS-01 — [ ] Canonical save writes description.json.lastUpdated

**Severity**: P1 | **Effort**: M (4h) | **Wave**: A
**Files**: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1259, 1261-1331`
**Resolves**: R4-P1-002, R51-P1-001, partial R3-P2-001, partial R5-P1-001

**Changes**:
1. Remove `const ctxFileWritten = false` stub at line 1259.
2. Wire actual return value from `savePerFolderDescription`.
3. Extend update block (lines 1261-1331) to write `lastUpdated: new Date().toISOString()` on every call.

**Acceptance**:
- [ ] Vitest asserts `description.json.lastUpdated` updated on successive saves with monotonic advancement
- [ ] Manual test: `/memory:save` on test folder sets `lastUpdated` to current time
- [ ] Grep confirms `'lastUpdated'` appears in `scripts/dist/memory/*.js` (expectation flipped from R4-P1-002's zero-grep)

**Evidence**: `[EVIDENCE: pending — commit hash after implementation]`

### T-W1-CNS-04 — [ ] Lift plan-only gate on refreshGraphMetadata

**Severity**: P1 | **Effort**: M (2h merge with T-CNS-01) | **Wave**: A (merged PR with T-CNS-01)
**Files**: `scripts/core/workflow.ts:1333`, `scripts/memory/generate-context.ts:415`
**Resolves**: R51-P1-002, R56-P1-upgrade-001 (H-56-1 compound headline)

**Changes**:
1. Remove `plannerMode === 'full-auto'` gate at workflow.ts:1333.
2. `refreshGraphMetadata` runs on every canonical save regardless of plannerMode.
3. Update default value at generate-context.ts:415 if needed for consistency.

**Acceptance**:
- [ ] `graph-metadata.json.derived.last_save_at` advances on every `/memory:save` invocation
- [ ] Manual test: plan-only mode (default) now refreshes metadata
- [ ] Vitest covers both plan-only and full-auto modes

**Atomic-ship**: MUST land in same PR as T-CNS-01.

**Evidence**: `[EVIDENCE: pending]`

### T-CGC-01 — [ ] Extract lib/code-graph/readiness-contract.ts

**Severity**: P1 | **Effort**: M (4h) | **Wave**: A
**Files**: New `mcp_server/lib/code-graph/readiness-contract.ts`; refactor `handlers/code-graph/query.ts:225-300`
**Resolves**: R6-P1-001 (prerequisite for T-W1-CGC-03)

**Changes**:
1. Extract `canonicalReadinessFromFreshness`, `queryTrustStateFromFreshness`, `buildQueryGraphMetadata`, `buildReadinessBlock`.
2. Export 4-state `TrustState` type.
3. Refactor `query.ts` to consume the shared module.

**Acceptance**:
- [ ] `query.ts` behavior unchanged post-refactor (vitest fixtures)
- [ ] Shared module exports signatures documented
- [ ] New module has own unit test suite

**Evidence**: `[EVIDENCE: pending]`

### T-W1-HOK-02 — [ ] Extract hooks/shared-provenance.ts

**Severity**: P2 → blocker for Wave B | **Effort**: M (4h) | **Wave**: A
**Files**: New `mcp_server/hooks/shared-provenance.ts`; refactor `hooks/claude/shared.ts:125-129`, `hooks/gemini/shared.ts:7`
**Resolves**: R52-P2-001 (prerequisite for T-W1-HOK-01)

**Changes**:
1. Move `wrapRecoveredCompactPayload` + provenance helpers to shared module.
2. Claude + Gemini re-export from shared.
3. Break Gemini → Claude transitive import.

**Acceptance**:
- [ ] Claude + Gemini compact cycles unchanged (existing vitest passes)
- [ ] Gemini `shared.ts` no longer imports from Claude
- [ ] New module has own unit test suite

**Must precede**: T-W1-HOK-01 (Wave B).

**Evidence**: `[EVIDENCE: pending]`

### T-SCP-01 — [ ] Collapse 4 local normalizers to canonical

**Severity**: P1 | **Effort**: M (4h) | **Wave**: A
**Files**: `mcp_server/handlers/save/reconsolidation-bridge.ts:228-234`, `lib/storage/lineage-state.ts:198-204`, `handlers/save/types.ts:348-352`, `lib/validation/preflight.ts:440-444`
**Resolves**: R1-P1-001 + R4-P1-001 (compound)

**Changes**: Delete 4 local `normalizeScopeValue`/`normalizeScopeMatchValue` variants; import `normalizeScopeContext` from `lib/governance/scope-governance.ts`.

**Acceptance**:
- [ ] Vitest semantic-equivalence matrix (`undefined`, `null`, `""`, whitespace, non-string) passes at all 5 call sites
- [ ] Grep `handlers/ lib/` confirms only `scope-governance.ts` declares `normalizeScope*` helper

**Evidence**: `[EVIDENCE: pending]`

### T-EVD-01-prep — [x] Rewrap 016 checklist.md evidence markers

**Severity**: P2 (data cleanup) | **Effort**: S (2h) | **Wave**: A (prerequisite for T-EVD-01 in Wave C)
**Files**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime-deep-review/checklist.md`
**Resolves**: R3-P2-002 (data side only)

**Changes**: Find-replace 170 `)` closers with `]` closers in `[EVIDENCE: ...]` markers.

**Acceptance**:
- [x] `grep -c '\[EVIDENCE:.*\)$' checklist.md` returns `0` [EVIDENCE: 7d85861a0 audit post-rewrap confirms 0 malformed across 1962 markers]
- [x] `grep -c '\[EVIDENCE:.*\]$' checklist.md` returns count equal to completed CHK items [EVIDENCE: 7d85861a0 checklist.md: 170 markers rewrapped, all CHK items closed with `]`]
- [x] Diff review confirms no content changes beyond closer character [EVIDENCE: 7d85861a0 commit diff + parser safety check — rewrap only rewrites single `)` char at closerOffset]

**Evidence**: `[EVIDENCE: 7d85861a0 bracket-depth parser + audit across 17 sibling 026-tree folders — 210 markers rewrapped (170 checklist.md + 30 plan.md + 10 tasks.md); post-rewrap 1962/1962 OK, 0 malformed, 0 unclosed; 19/19 vitest cases pass; typecheck clean]`

---

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Wave B — Cluster Consumers (9 tasks, 30h) [PHASE 2]

### Lane B1 — Cluster B consumers (4 tasks, 12h)

#### T-CNS-02 — [ ] Research folder backfill

**Severity**: P1 | **Effort**: M (4h) | **Lane**: B1
**Files**: New `scripts/memory/backfill-research-metadata.ts`; wire into `generate-context.js`
**Resolves**: R3-P1-002, R56-P1-NEW-003

**Acceptance**:
- [ ] All `research/NNN-*/iterations/` directories have `description.json` + `graph-metadata.json`
- [ ] Post-save wires `backfill-research-metadata` when target has `research/` child
- [ ] Vitest covers missing-both, missing-one, already-present cases

**Evidence**: `[EVIDENCE: pending]`

#### T-W1-CNS-05 — [ ] Continuity freshness validator

**Severity**: P1 | **Effort**: M (4h) | **Lane**: B1
**Files**: `scripts/spec/validate.sh`, new `scripts/validation/continuity-freshness.ts`
**Resolves**: R51-P1-003

**Acceptance**:
- [ ] `validate.sh --strict` warns when `_memory.continuity.last_updated_at < graph-metadata.derived.last_save_at - 10m`
- [ ] Passes for fresh folders, warns for stale

**Evidence**: `[EVIDENCE: pending]`

#### T-CGC-02 — [ ] context.ts explicit error branch

**Severity**: P1 (partial R6-P1-001 mitigation) | **Effort**: S (2h) | **Lane**: B1
**Files**: `handlers/code-graph/context.ts:98-105`
**Resolves**: Partial R6-P1-001

**Acceptance**:
- [ ] Silent catch replaced with `error → 'unavailable'` branch
- [ ] Emits `readiness_check_crashed` reason
- [ ] Vitest covers thrown exception path

**Evidence**: `[EVIDENCE: pending]`

#### T-RBD-03 — [ ] Design-intent comments at rollup sites

**Severity**: P2 | **Effort**: S (2h) | **Lane**: B1
**Files**: `handlers/save/post-insert.ts:344-369`, `handlers/save/response-builder.ts:136-201`
**Resolves**: R6-P2-001

**Acceptance**:
- [ ] Both rollup sites have design-intent comment blocks
- [ ] Comments cite T-RBD-01 / commit `709727e98`
- [ ] Explain post-insert tracks failure-with-recovery vs response surfaces MCP-client nuance

**Evidence**: `[EVIDENCE: pending]`

### Lane B2 — Cluster D + Cluster E (2 tasks, 16h)

#### T-W1-CGC-03 — [ ] 5-sibling code-graph readiness propagation

**Severity**: P1 | **Effort**: L (16h) | **Lane**: B2
**Files**: `handlers/code-graph/{scan,status,context,ccc-status,ccc-reindex,ccc-feedback}.ts`
**Resolves**: R52-P1-001 (Cluster D)

**Acceptance**:
- [ ] All 6 handlers import from `lib/code-graph/readiness-contract.ts`
- [ ] Each emits `canonicalReadiness` + `trustState` + `lastPersistedAt`
- [ ] 4-state vocabulary used exclusively
- [ ] `status.ts` parity verified (IS canonical readiness probe)
- [ ] Vitest covers each handler's emission

**Atomic-ship**: MUST land as one PR OR emit `trustState: 'unavailable'` stubs during staged rollout.

**Evidence**: `[EVIDENCE: pending]`

#### T-W1-HOK-01 — [ ] Copilot compact-cache + session-prime

**Severity**: P1 | **Effort**: M (6h) | **Lane**: B2
**Files**: New `hooks/copilot/compact-cache.ts`; extend `hooks/copilot/session-prime.ts`
**Resolves**: R52-P1-002 (Cluster E), R56-P1-NEW-002 (H-56-4)

**Acceptance**:
- [ ] `compact-cache.ts` writes `trustState: 'cached'` via `hooks/shared-provenance.ts`
- [ ] `session-prime.ts` reads `payloadContract?.provenance.trustState` at entry
- [ ] Parallel vitest to Claude + Gemini compact-cycle tests

**Constraint**: MUST follow T-W1-HOK-02 (reverse order creates third duplicate).

**Evidence**: `[EVIDENCE: pending]`

### Lane B3 — Cluster A + Cluster C + Standalone P1 (3 tasks, 12h)

#### T-SCP-02 — [ ] Normalizer lint rule

**Severity**: P2 | **Effort**: S (2h) | **Lane**: B3
**Files**: `.eslintrc.js` or `scripts/spec/validate.sh`
**Resolves**: R4-P1-001 prevention

**Acceptance**:
- [ ] Lint rejects new in-module `normalizeScope*` / `getOptionalString` helpers
- [ ] Exempts `scope-governance.ts` canonical file
- [ ] Lint passes against current tree (post T-SCP-01)

**Constraint**: MUST land in same PR as T-SCP-01.

**Evidence**: `[EVIDENCE: pending]`

#### T-SAN-01 + T-SAN-02 + T-SAN-03 — [ ] NFKC unicode normalization + tests

**Severity**: P1 + P2 | **Effort**: S+S+S (6h) | **Lane**: B3
**Files**: `shared/gate-3-classifier.ts:145-152`, `mcp_server/hooks/claude/shared.ts:100-119`, `scripts/tests/gate-3-classifier.vitest.ts`, `mcp_server/tests/p0-a-cross-runtime-tempdir-poisoning.vitest.ts:11, 67, 152-154`
**Resolves**: R2-P1-002, R2-P2-001, R3-P2-003, R5-P2-001

**Acceptance**:
- [ ] `normalizePrompt` applies `.normalize('NFKC')` + strips `[\u00AD\u200B-\u200F\uFEFF]`
- [ ] `sanitizeRecoveredPayload` mirrors NFKC pass
- [ ] 5+ unicode test cases: Cyrillic `е`, soft hyphen, zero-width space, Greek `Ε`, combined
- [ ] p0-a test renamed to "Claude and Gemini consumers" with OpenCode schema-share note

**Atomic-ship**: T-SAN-01 + T-SAN-03 same PR (tests fail until code lands).

**Evidence**: `[EVIDENCE: pending]`

#### T-PIN-RET-01 — [ ] Retry-exhaustion counter

**Severity**: P1 | **Effort**: M (4h) | **Lane**: B3
**Files**: `handlers/save/post-insert.ts:159-173, 347-365`; new `lib/enrichment/retry-budget.ts`
**Resolves**: R1-P1-002

**Acceptance**:
- [ ] Counter keyed on `(memoryId, step, reason)`
- [ ] Skip `runEnrichmentBackfill` after N=3 retries
- [ ] Structured warning log on exhaustion
- [ ] Vitest: 3rd retry attempted, 4th skipped with log

**Evidence**: `[EVIDENCE: pending]`

---

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Wave C — Rollout + Sweeps (5 tasks, 15h) [PHASE 3]

### T-EVD-01 — [ ] Evidence-marker lint

**Severity**: P2 | **Effort**: M (3h) | **Wave**: C
**Files**: `scripts/spec/validate.sh`, new `scripts/validation/evidence-marker-lint.ts`
**Resolves**: R3-P2-002 (tool side)

**Acceptance**:
- [ ] Lint asserts `[EVIDENCE: ...]` closes with `]`
- [ ] `--strict` mode exits 1 on `)` closer
- [ ] All existing spec folders pass (prerequisite T-EVD-01-prep in Wave A)

**Evidence**: `[EVIDENCE: pending]`

### T-CNS-03 — [ ] 16-folder canonical-save sweep

**Severity**: P1 | **Effort**: L (8h) | **Wave**: C
**Files**: All 16 `026-graph-and-context-optimization/*/` folders
**Resolves**: R5-P1-001, R3-P2-001 (data side)

**Acceptance**:
- [ ] 1 test folder sweep verified first; `jq '.lastUpdated' description.json` returns fresh time
- [ ] Remaining 15 folders swept sequentially
- [ ] Per-folder commit for rollback granularity
- [ ] Final verification: 16/16 folders have fresh `lastUpdated` ≤10m from `derived.last_save_at`

**Evidence**: `[EVIDENCE: pending]`

### T-CPN-01 — [ ] Closing-pass-notes CP-002 amend

**Severity**: P2 | **Effort**: S (1h) | **Wave**: C
**Files**: `research/016-foundational-runtime-deep-review/closing-pass-notes.md:72-88`
**Resolves**: R3-P1-001

**Acceptance**:
- [ ] CP-002 section marked `[STATUS: RESOLVED 2026-04-17]`
- [ ] Cites T-PIN-08 / commit `e774eef07`

**Evidence**: `[EVIDENCE: pending]`

### T-W1-MCX-01 — [ ] memory-context readiness field rename

**Severity**: P2 | **Effort**: S (2h) | **Wave**: C
**Files**: `handlers/memory-context.ts:200, 425`
**Resolves**: R52-P2-002

**Acceptance**:
- [ ] `readiness` field renamed to `advisoryPreset` OR removed if always-literal
- [ ] Consumer contract preserved (or advisory note added)

**Evidence**: `[EVIDENCE: pending]`

### T-SRS-BND-01 — [ ] Session-resume auth binding

**Severity**: P1 | **Effort**: L (staged rollout, 8h+monitoring) | **Wave**: C (or B3 if prioritized)
**Files**: `mcp_server/handlers/session-resume.ts:443-456`, `tools/lifecycle-tools.ts:67`
**Resolves**: R2-P1-001

**Acceptance**:
- [ ] `handleSessionResume` rejects mismatched `args.sessionId` vs caller MCP identity
- [ ] Permissive-mode flag for staged rollout
- [ ] Canary verification before full enable
- [ ] Vitest covers accept/reject cases

**Evidence**: `[EVIDENCE: pending]`

---

<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Wave D — P2 Maintainability (8 tasks, 40h — DEFERRABLE) [Deferred phase]

### T-EXH-01 — [ ] assertNever + 8 union applications

**Severity**: P2 | **Effort**: L (8h) | **Wave**: D
**Files**: New `lib/utils/assert-never.ts`; apply to 8 typed unions
**Resolves**: R4-P2-002

**Acceptance**:
- [ ] `assertNever` helper exported
- [ ] Applied to `OnIndexSkipReason`, `EnrichmentStepStatus`, `EnrichmentSkipReason`, `EnrichmentFailureReason`, `ConflictAbortStatus`, `HookStateLoadFailureReason`, `SharedPayloadTrustState`, `TriggerCategory`
- [ ] `satisfies` clauses at lookup sites

**Evidence**: `[EVIDENCE: pending]`

### T-PIN-GOD-01 — [ ] Extract runEnrichmentStep helper

**Severity**: P2 | **Effort**: L (8h) | **Wave**: D
**Files**: `handlers/save/post-insert.ts:133-376`
**Resolves**: R4-P2-001

**Acceptance**:
- [ ] `runEnrichmentStep(name, isEnabled, runner, options)` helper extracted
- [ ] `runPostInsertEnrichment` reduced from 243 LOC to ~80
- [ ] All 5 enrichment behaviors preserved
- [ ] Vitest unchanged

**Evidence**: `[EVIDENCE: pending]`

### T-W1-PIN-02 — [ ] OnIndexSkipReason satisfies clause

**Severity**: P2 | **Effort**: S (2h) | **Wave**: D
**Files**: `handlers/save/post-insert.ts:302-316`
**Resolves**: R51-P2-001

**Acceptance**:
- [ ] `satisfies Record<OnIndexSkipReason, EnrichmentSkipReason>` added
- [ ] Warn-log on unmapped variant

**Evidence**: `[EVIDENCE: pending]`

### T-RCB-DUP-01 — [ ] Extract runAtomicReconsolidationTxn

**Severity**: P2 | **Effort**: M (6h) | **Wave**: D
**Files**: `lib/storage/reconsolidation.ts:507-600`
**Resolves**: R4-P2-003

**Acceptance**:
- [ ] `runAtomicReconsolidationTxn(predecessorSnapshot, op, ops)` helper extracted
- [ ] Both deprecate-path + content-update-path consume helper
- [ ] Vitest unchanged

**Evidence**: `[EVIDENCE: pending]`

### T-YML-CP4-01 — [ ] Typed YAML predicate

**Severity**: P2 | **Effort**: M (4h) | **Wave**: D
**Files**: `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:1099`
**Resolves**: CP-004

**Acceptance**:
- [ ] Prose `when:` string replaced with BooleanExpr typed predicate
- [ ] Matches S7 YAML grammar (`shared/predicates/boolean-expr.ts`)
- [ ] YAML predicate vitest covers case

**Evidence**: `[EVIDENCE: pending]`

### T-W1-HST-02 — [ ] Docker deployment note

**Severity**: P2 (advisory) | **Effort**: S (2h) | **Wave**: D
**Files**: Deployment docs
**Resolves**: R53-P1w-001

**Acceptance**:
- [ ] Warns against `-v /tmp:/tmp` across Copilot MCP containers
- [ ] OPTIONAL: `getProjectHash()` incorporates `process.getuid?.()` for defense-in-depth

**Evidence**: `[EVIDENCE: pending]`

### Parking-lot (Phase 019+, not scheduled)

- **R55-P2-002** — Underused `importance-tier` helper at `importance-tiers.ts:149` (10+ inline duplicates)
- **R55-P2-003** — `executeConflict` precondition-block DRY opportunity
- **R55-P2-004** — YAML boolean-predicate evolution gap

---

<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

### Source documents
- **Spec**: `spec.md` (this folder) — frozen scope, cluster inventory, success criteria
- **Plan**: `plan.md` (this folder) — wave structure, architecture, quality gates
- **Checklist**: `checklist.md` (this folder) — verification items per task
- **Description**: `description.json` (this folder) — structured metadata
- **Graph**: `graph-metadata.json` (this folder) — dependency graph

### Upstream research
- **Review report**: `../review/016-foundational-runtime-deep-review/review-report.md`
- **Segment-1 synthesis (50 iters)**: `../research/016-foundational-runtime-deep-review/FINAL-synthesis-and-review.md`
- **Segment-2 synthesis (7 iters)**: `../research/016-foundational-runtime-deep-review/segment-2-synthesis.md`
- **Phase 017 implementation**: `../016-foundational-runtime-deep-review/implementation-summary.md`

### Related operator feedback
- `feedback_phase_018_autonomous` (user memory) — autonomous execution rules
- `feedback_copilot_concurrency_override` (user memory) — 3-concurrent limit
- `feedback_stop_over_confirming` (user memory) — skip A/B/C/D menus
- `feedback_worktree_cleanliness_not_a_blocker` (user memory) — dirty-state baseline

### Finding ID crosswalk table
Full crosswalk in `spec.md` §5 (Cluster Inventory). Every task line above includes a `Resolves:` field mapping to specific finding IDs.
<!-- /ANCHOR:cross-refs -->

---

## Progress Summary

| Wave | Tasks | Total effort | Status |
|------|-------|--------------|--------|
| Wave A (infrastructure) | 5 + 1 prep | 20h | pending |
| Wave B (consumers, 3 lanes) | 9 | 30h | pending |
| Wave C (rollout + sweeps) | 5 | 15h | pending |
| Wave D (P2 maintainability) | 8 | 40h | pending (deferrable) |
| **Total** | **27 + 1 prep** | **~105h** | **0/27 complete** |

**Critical path**: T-CNS-01 → T-W1-CNS-04 → T-CNS-02 → T-CGC-01 → T-W1-CGC-03 → T-W1-CNS-05 → T-CNS-03 (~50h sequential)

**Wave A atomic-ship groups**:
- Group 1: T-CNS-01 + T-W1-CNS-04 (single PR)
- Group 2: T-CGC-01 (enables T-W1-CGC-03 in Wave B)
- Group 3: T-W1-HOK-02 (enables T-W1-HOK-01 in Wave B)
- Group 4: T-SCP-01 + T-SCP-02 (lint follows collapse — but SCP-02 actually in Wave B Lane B3)
