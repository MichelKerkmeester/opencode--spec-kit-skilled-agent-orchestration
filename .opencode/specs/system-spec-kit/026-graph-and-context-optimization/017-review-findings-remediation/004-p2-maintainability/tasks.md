---
title: "Tasks: Phase 017 Wave D — P2 Maintainability"
description: "6 P2 maintainability tasks (~40h total, DEFERRABLE) with full acceptance criteria and finding crosswalk. Parking-lot P2s (R55-P2-002/003/004) cited for Phase 018+ scheduling. No intra-Wave-D ordering dependencies — tasks are independently schedulable."
trigger_phrases: ["017 wave d tasks", "004 p2 maintainability tasks", "t-exh-01", "t-pin-god-01", "t-w1-pin-02", "t-rcb-dup-01", "t-yml-cp4-01", "t-w1-hst-02"]
importance_tier: "standard"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/017-review-findings-remediation/004-p2-maintainability"
    last_updated_at: "2026-04-17T14:45:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Wave D tasks scaffolded from parent tasks §Wave D + parking-lot section"
    next_safe_action: "Begin any single Wave D task opportunistically; no ordering blocks execution"
    blockers: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Phase 017 Wave D — P2 Maintainability

<!-- ANCHOR:notation -->
## Notation

**Legend**: `[ ]` pending • `[x]` complete • `[~]` in progress • `[!]` blocked
**Effort**: S=≤2h • M=2-8h • L=≥1 day
**Severity**: All Wave D tasks are P2 (maintainability suggestion — non-blocking)
**Task ID scheme**:
- `T-XXX-NN` — original review-report task IDs
- `T-W1-XXX-NN` — segment-2 (Wave 1 research-extension) task IDs
**Finding ID scheme**:
- `R<N>-P<sev>-NNN` — review findings (N=review-iter, sev=0/1/2)
- `CP-NNN` — closing-pass notes from research review
**Wave status**: DEFERRABLE. Each task independently schedulable. No intra-Wave-D ordering.
**Gate profile**: `/spec_kit:deep-review :auto` ×3 (lighter than Waves A/B/C ×7).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Cluster D1 — Typing Hardening (2 tasks, 10h)

### T-EXH-01 — [ ] assertNever helper + 8 union applications

**Severity**: P2 | **Effort**: L (8h) | **Cluster**: D1
**Files**:
- New `mcp_server/lib/utils/assert-never.ts`
- 8 call sites for `OnIndexSkipReason`, `EnrichmentStepStatus`, `EnrichmentSkipReason`, `EnrichmentFailureReason`, `ConflictAbortStatus`, `HookStateLoadFailureReason`, `SharedPayloadTrustState`, `TriggerCategory`

**Resolves**: R4-P2-002

**Changes**:
1. Create `lib/utils/assert-never.ts` exporting `export function assertNever(x: never): never { throw new Error(...) }`.
2. Locate each of the 8 unions. Find primary `switch` statement per union.
3. Add `default: return assertNever(variable)` (or equivalent throw path) at each switch.
4. Where the codebase uses lookup tables (not switches), add `satisfies Record<Union, ValueType>` constraint at table declaration.
5. Verify `npx tsc --noEmit` passes after each union application.

**Acceptance**:
- [ ] `assertNever` helper exported from `lib/utils/assert-never.ts`
- [ ] Applied to `OnIndexSkipReason` (post-insert.ts region)
- [ ] Applied to `EnrichmentStepStatus`
- [ ] Applied to `EnrichmentSkipReason`
- [ ] Applied to `EnrichmentFailureReason`
- [ ] Applied to `ConflictAbortStatus`
- [ ] Applied to `HookStateLoadFailureReason`
- [ ] Applied to `SharedPayloadTrustState`
- [ ] Applied to `TriggerCategory`
- [ ] `satisfies` clauses at lookup sites
- [ ] `npx tsc --noEmit` passes post each union
- [ ] Trivial unit test asserts `assertNever` throws

**Evidence**: `[EVIDENCE: pending — commit hash after implementation]`

### T-W1-PIN-02 — [ ] OnIndexSkipReason satisfies clause + warn-log

**Severity**: P2 | **Effort**: S (2h) | **Cluster**: D1
**Files**: `mcp_server/handlers/save/post-insert.ts:302-316`

**Resolves**: R51-P2-001

**Changes**:
1. Add `satisfies Record<OnIndexSkipReason, EnrichmentSkipReason>` clause to the mapping declaration at lines 302-316.
2. Emit structured warn-log when lookup returns `undefined` on an unmapped variant (defensive — the `satisfies` constraint should prevent this at compile time, but a runtime guard catches union-evolution races).
3. Sequence note: if T-PIN-GOD-01 lands first, line numbers shift — apply to the post-refactor lookup table.

**Acceptance**:
- [ ] `satisfies Record<OnIndexSkipReason, EnrichmentSkipReason>` present at `post-insert.ts:302` (or post-refactor equivalent)
- [ ] Warn-log emits structured payload on unmapped variant
- [ ] `npx tsc --noEmit` passes
- [ ] Existing vitest on post-insert.ts unchanged

**Evidence**: `[EVIDENCE: pending]`

---

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Cluster D2 — Extraction Refactors (2 tasks, 14h)

### T-PIN-GOD-01 — [ ] Extract runEnrichmentStep helper

**Severity**: P2 | **Effort**: L (8h) | **Cluster**: D2
**Files**: `mcp_server/handlers/save/post-insert.ts:133-376`

**Resolves**: R4-P2-001

**Changes**:
1. Extract `runEnrichmentStep(name, isEnabled, runner, options)` helper with a standard signature:
   - `name: string` — step label for logs
   - `isEnabled: boolean` — short-circuit gate
   - `runner: () => Promise<Result>` — the enrichment body
   - `options: { timeout?, skipReason?, ... }` — per-step config
2. Refactor `runPostInsertEnrichment` to call the helper for each of the 5 enrichment behaviors:
   - on-index enrichment
   - backfill enrichment
   - conflict enrichment
   - consolidation enrichment
   - trigger enrichment
3. **Preserve exact ordering** of the 5 behaviors (no reorder permitted — answers Q-D-02 default).
4. **Preserve exact semantics** — identical skip reasons, identical retry logic, identical error classification.
5. Reduce `runPostInsertEnrichment` from 243 LOC to ~80 LOC.

**Acceptance**:
- [ ] `runEnrichmentStep` helper extracted with documented signature
- [ ] `runPostInsertEnrichment` body ≤80 LOC (measured post-refactor)
- [ ] All 5 enrichment behaviors preserved (identical ordering, semantics)
- [ ] Existing vitest on post-insert.ts passes unchanged (no test modifications)
- [ ] Diff review confirms zero runtime-semantic change
- [ ] `npx tsc --noEmit` passes

**Evidence**: `[EVIDENCE: pending]`

### T-RCB-DUP-01 — [ ] Extract runAtomicReconsolidationTxn

**Severity**: P2 | **Effort**: M (6h) | **Cluster**: D2
**Files**: `mcp_server/lib/storage/reconsolidation.ts:507-600`

**Resolves**: R4-P2-003

**Changes**:
1. Identify the duplicate transaction block between `executeDeprecatePath` and `executeContentUpdatePath` (~80 LOC shared at lines 507-600).
2. Extract `runAtomicReconsolidationTxn(predecessorSnapshot, op, ops)` helper with signature:
   - `predecessorSnapshot` — prior-state snapshot for rollback
   - `op` — operation descriptor
   - `ops` — sub-operations list
3. Both consumer paths (deprecate + content-update) call the helper with their respective args.
4. Preserve exact transaction semantics: same snapshot handoff, same commit/rollback order, same error propagation.

**Acceptance**:
- [ ] `runAtomicReconsolidationTxn` helper extracted
- [ ] `executeDeprecatePath` consumes helper (duplicate block removed)
- [ ] `executeContentUpdatePath` consumes helper (duplicate block removed)
- [ ] Existing vitest on reconsolidation.ts passes unchanged
- [ ] Diff review confirms identical predecessor-snapshot handoff
- [ ] `npx tsc --noEmit` passes

**Evidence**: `[EVIDENCE: pending]`

---

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Cluster D3 — Typed Predicate + Docs (2 tasks, 6h)

### T-YML-CP4-01 — [ ] Typed YAML predicate for CP-004

**Severity**: P2 | **Effort**: M (4h) | **Cluster**: D3
**Files**: `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:1099`

**Resolves**: CP-004

**Changes**:
1. Locate prose `when:` string at line 1099 in the YAML file.
2. Replace with typed BooleanExpr AST matching `shared/predicates/boolean-expr.ts` grammar.
3. Preserve exact boolean semantics (the typed predicate must evaluate identically to the prose string for all input cases).
4. **Scope lock**: ONLY this single call site. Broader migration of other prose `when:` clauses is R55-P2-004 parking-lot.

**Acceptance**:
- [ ] Prose `when:` string replaced with BooleanExpr typed predicate
- [ ] Predicate matches `shared/predicates/boolean-expr.ts` grammar
- [ ] YAML predicate vitest covers the CP-004 case (add if not present)
- [ ] Semantic equivalence verified via test matrix (all truthy/falsy inputs match prose-string behavior)
- [ ] No OTHER prose `when:` clauses touched in this PR

**Evidence**: `[EVIDENCE: pending]`

### T-W1-HST-02 — [ ] Docker deployment note (`-v /tmp:/tmp` anti-pattern)

**Severity**: P2 (advisory) | **Effort**: S (2h) | **Cluster**: D3
**Files**: `.opencode/skill/system-spec-kit/README.md` (primary) OR new `DEPLOYMENT.md` if README lacks a deployment section

**Resolves**: R53-P1w-001

**Changes**:
1. Locate existing deployment section in `system-spec-kit/README.md`. If absent, create new `DEPLOYMENT.md` at skill root (answers Q-D-04 default: extend README first).
2. Add clearly-flagged warning: "DO NOT mount `-v /tmp:/tmp` across Copilot MCP containers — creates shared-tmpfs poisoning surface documented in R53-P1w-001 / iter 56 adversarial analysis."
3. OPTIONAL: Note that `getProjectHash()` may incorporate `process.getuid?.()` for defense-in-depth, but this is NOT in scope for T-W1-HST-02 (code change would be separate follow-up).

**Acceptance**:
- [ ] Docker anti-pattern documented in deployment docs
- [ ] Warning clearly flagged (visually distinct — `> WARNING:` blockquote or similar)
- [ ] Cites R53-P1w-001 finding ID and segment-2 synthesis source
- [ ] OPTIONAL `getuid()` note included (if added, scoped as advisory-only, no code change)

**Evidence**: `[EVIDENCE: pending]`

---

<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Parking Lot — Phase 018+ Candidates (NOT scheduled in Wave D)

The following P2 findings are tracked but explicitly NOT in Wave D scope. They roll forward to Phase 018 or later.

### R55-P2-002 — Underused `importance-tier` helper

**Source**: `importance-tiers.ts:149`
**Issue**: Helper exists but 10+ inline duplicates scattered across codebase (spec-kit docs, save handlers, memory operations) do not consume it.
**Effort estimate**: 6-8h M (identify all duplicates + replace with helper call)
**Deferral rationale**: No correctness impact; pure DRY opportunity. Low-priority backlog.
**Carry-forward**: Add to Phase 018 parking lot or open Phase 019 maintenance spec.

### R55-P2-003 — `executeConflict` precondition-block DRY

**Source**: `executeConflict` precondition validation blocks (multiple call sites)
**Issue**: Precondition-check boilerplate duplicated across conflict-resolution paths; extractable into shared validator.
**Effort estimate**: 4-6h M
**Deferral rationale**: Behavior-preserving refactor; no runtime benefit; reviewer-comfort improvement only.
**Carry-forward**: Phase 018 parking lot.

### R55-P2-004 — YAML boolean-predicate evolution gap

**Source**: YAML command tree (broader than just `spec_kit_complete_confirm.yaml:1099`)
**Issue**: Multiple prose `when:` strings across the YAML ecosystem bypass the typed predicate grammar. T-YML-CP4-01 addresses ONE site; this finding covers the systemic gap.
**Effort estimate**: 12-16h L (audit all YAML `when:` clauses; migrate each to typed predicate)
**Deferral rationale**: Too large for Wave D; requires YAML-ecosystem audit before migration.
**Carry-forward**: Phase 019 dedicated YAML-predicate migration spec.

---

<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

### Source documents (parent)
- **Parent spec**: `../spec.md` — Phase 017 frozen scope + cluster inventory
- **Parent plan §5 Wave D**: `../plan.md` — detailed task specs
- **Parent tasks §Wave D**: `../tasks.md` — original acceptance criteria
- **Parent checklist CHK-D-01..06**: `../checklist.md` — verification items

### This packet
- **Spec**: `./spec.md` — Wave D scope, requirements, deferrable status
- **Plan**: `./plan.md` — Wave D architecture, quality gates (×3)
- **Checklist**: `./checklist.md` — CHK-D-01..06 verification
- **Description**: `./description.json` — structured metadata (kind=maintainability, deferrable=true)
- **Graph metadata**: `./graph-metadata.json` — packet graph edges

### Upstream research
- **Review report**: `../../review/016-foundational-runtime-deep-review/review-report.md`
- **Segment-2 synthesis**: `../../research/016-foundational-runtime-deep-review/segment-2-synthesis.md`

### Related operator feedback
- `feedback_phase_018_autonomous` — autonomous execution rules
- `feedback_copilot_concurrency_override` — 3-concurrent limit (applies if running Cluster D1/D2/D3 in parallel)
- `feedback_stop_over_confirming` — skip A/B/C/D menus; tasks are obvious

### Finding ID crosswalk
- T-EXH-01 → R4-P2-002
- T-PIN-GOD-01 → R4-P2-001
- T-W1-PIN-02 → R51-P2-001
- T-RCB-DUP-01 → R4-P2-003
- T-YML-CP4-01 → CP-004
- T-W1-HST-02 → R53-P1w-001
- Parking lot → R55-P2-002, R55-P2-003, R55-P2-004
<!-- /ANCHOR:cross-refs -->

---

## Progress Summary

| Cluster | Tasks | Total effort | Status |
|---------|-------|--------------|--------|
| Cluster D1 (typing hardening) | 2 | 10h | pending |
| Cluster D2 (extraction refactors) | 2 | 14h | pending |
| Cluster D3 (typed predicate + docs) | 2 | 6h | pending |
| **Scheduled total** | **6** | **~30h** | **0/6 complete** |
| Parking lot (deferred) | 3 findings | — | tracked only |

**Effort budget envelope**: ~40h (30h scheduled work + ~10h review/integration buffer).

**Critical path**: NONE. Wave D is DEFERRABLE. All tasks independently schedulable.

**Gate**: `/spec_kit:deep-review :auto` ×3 (lighter than Waves A/B/C ×7) per parent plan §5.7.

**Partial completion**: FIRST-CLASS outcome. Any subset of 6 tasks that lands counts as Wave D progress. Remaining items carry forward to Phase 018+ parking lot.
