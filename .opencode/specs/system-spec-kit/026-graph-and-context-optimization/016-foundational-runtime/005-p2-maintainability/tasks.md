---
title: "Tasks: Phase 017 Wave D — P2 Maintainability"
description: "6 P2 maintainability tasks (~40h total, DEFERRABLE) with full acceptance criteria and finding crosswalk. Parking-lot P2s (R55-P2-002/003/004) cited for Phase 018+ scheduling. No intra-Wave-D ordering dependencies — tasks are independently schedulable."
trigger_phrases: ["017 wave d tasks", "004 p2 maintainability tasks", "t-exh-01", "t-pin-god-01", "t-w1-pin-02", "t-rcb-dup-01", "t-yml-cp4-01", "t-w1-hst-02"]
importance_tier: "standard"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime/005-p2-maintainability"
    last_updated_at: "2026-04-17T14:45:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Wave D tasks scaffolded"
    next_safe_action: "Continue any open Wave D cluster"
    blockers: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Phase 017 Wave D — P2 Maintainability

<!-- ANCHOR:notation -->
## Notation

**Legend**: pending • complete • in progress • blocked
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

### T-EXH-01 — [x] assertNever helper + 8 union applications [EVIDENCE: 787bf4f88]

**Severity**: P2 | **Effort**: L (8h) | **Cluster**: D1
**Files**:
- New `mcp_server/lib/utils/exhaustiveness.ts`
- 8 call sites for `OnIndexSkipReason`, `EnrichmentStepStatus`, `EnrichmentSkipReason`, `EnrichmentFailureReason`, `ConflictAbortStatus`, `HookStateLoadFailureReason`, `SharedPayloadTrustState`, `TriggerCategory`

**Resolves**: R4-P2-002

**Changes**:
1. Create `lib/utils/exhaustiveness.ts` exporting `export function assertNever(x: never): never { throw new Error(...) }`.
2. Locate each of the 8 unions. Find primary `switch` statement per union.
3. Add `default: return assertNever(variable)` (or equivalent throw path) at each switch.
4. Where the codebase uses lookup tables (not switches), add `satisfies Record<Union, ValueType>` constraint at table declaration.
5. Verify `npx tsc --noEmit` passes after each union application.

**Acceptance**:
- [x] `assertNever` helper exported from `lib/utils/exhaustiveness.ts`
- [x] Applied to `OnIndexSkipReason` (post-insert.ts region)
- [x] Applied to `EnrichmentStepStatus`
- [x] Applied to `EnrichmentSkipReason`
- [x] Applied to `EnrichmentFailureReason`
- [x] Applied to `ConflictAbortStatus`
- [x] Applied to `HookStateLoadFailureReason`
- [x] Applied to `SharedPayloadTrustState`
- [x] Applied to `TriggerCategory`
- [x] `satisfies` clauses at lookup sites
- [x] `npx tsc --noEmit` passes post each union
- [x] Trivial unit test asserts `assertNever` throws

**Evidence**: [EVIDENCE: 787bf4f88]

### T-W1-PIN-02 — [x] OnIndexSkipReason satisfies clause + warn-log [EVIDENCE: 787bf4f88]

**Severity**: P2 | **Effort**: S (2h) | **Cluster**: D1
**Files**: `mcp_server/handlers/save/post-insert.ts:302-316`

**Resolves**: R51-P2-001

**Changes**:
1. Add `satisfies Record<OnIndexSkipReason, EnrichmentSkipReason>` clause to the mapping declaration at lines 302-316.
2. Emit structured warn-log when lookup returns `undefined` on an unmapped variant (defensive — the `satisfies` constraint should prevent this at compile time, but a runtime guard catches union-evolution races).
3. Sequence note: if T-PIN-GOD-01 lands first, line numbers shift — apply to the post-refactor lookup table.

**Acceptance**:
- [x] `satisfies Record<OnIndexSkipReason, EnrichmentSkipReason>` present at the post-insert lookup table
- [x] Warn-log emits structured payload on unmapped variant
- [x] `npx tsc --noEmit` passes
- [x] Existing vitest on post-insert.ts unchanged

**Evidence**: [EVIDENCE: 787bf4f88]

---

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Cluster D2 — Extraction Refactors (2 tasks, 14h)

### T-PIN-GOD-01 — [x] Extract runEnrichmentStep helper [EVIDENCE: 0ac9cdcba]

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
- [x] `runEnrichmentStep` helper extracted with documented signature
- [x] `runPostInsertEnrichment` body ≤80 LOC (measured post-refactor)
- [x] All 5 enrichment behaviors preserved (identical ordering, semantics)
- [x] Existing vitest on post-insert.ts passes unchanged (no test modifications)
- [x] Diff review confirms zero runtime-semantic change
- [x] `npx tsc --noEmit` passes

**Evidence**: [EVIDENCE: 0ac9cdcba]

### T-RCB-DUP-01 — [x] Extract runAtomicReconsolidationTxn [EVIDENCE: 0ac9cdcba]

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
- [x] Shared atomic reconsolidation helper extracted
- [x] Distinct-id deprecate path consumes helper (duplicate block removed)
- [x] Content-update path consumes helper (duplicate block removed)
- [x] Existing vitest on reconsolidation.ts passes unchanged
- [x] Diff review confirms identical predecessor-snapshot handoff
- [x] `npx tsc --noEmit` passes

**Evidence**: [EVIDENCE: 0ac9cdcba]

---

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Cluster D3 — Typed Predicate + Docs (2 tasks, 6h)

### T-YML-CP4-01 — [x] Canonical YAML timing-note fix for CP-004 [EVIDENCE: b26514cbc]

**Severity**: P2 | **Effort**: M (4h) | **Cluster**: D3
**Files**: `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:1099`

**Resolves**: CP-004

**Changes**:
1. Locate prose `when:` string at line 1099 in the YAML file.
2. Replace the prose `when:` with the canonical `after:` field required by `shared/predicates/boolean-expr.ts`.
3. Preserve exact timing semantics without forcing prose into the BooleanExpr grammar.
4. **Scope lock**: ONLY this single call site. Broader migration of other prose `when:` clauses is R55-P2-004 parking-lot.

**Acceptance**:
- [x] Prose `when:` string moved to canonical `after:` timing note
- [x] Result matches `shared/predicates/boolean-expr.ts` guidance for prose timing
- [x] Shared predicate test covers the CP-004 call site
- [x] Asset-level regression confirms `post_save_indexing` no longer stores prose under `when:`
- [x] No OTHER prose `when:` clauses touched in this PR

**Evidence**: [EVIDENCE: b26514cbc]

### T-W1-HST-02 — [x] Docker deployment note (`-v /tmp:/tmp` anti-pattern) [EVIDENCE: b26514cbc]

**Severity**: P2 (advisory) | **Effort**: S (2h) | **Cluster**: D3
**Files**: `DEPLOYMENT.md`

**Resolves**: R53-P1w-001

**Changes**:
1. Create `DEPLOYMENT.md` at repo root, which is the file requested for this wave.
2. Add clearly-flagged warning: "DO NOT mount `-v /tmp:/tmp` across Copilot MCP containers — creates shared-tmpfs poisoning surface documented in R53-P1w-001 / iter 56 adversarial analysis."
3. OPTIONAL: Note that `getProjectHash()` may incorporate `process.getuid?.()` for defense-in-depth, but this is NOT in scope for T-W1-HST-02 (code change would be separate follow-up).

**Acceptance**:
- [x] Docker anti-pattern documented in deployment docs
- [x] Warning clearly flagged with a blockquote warning
- [x] Cites R53-P1w-001 and the segment-2 synthesis context
- [x] Advisory note stays doc-only, with no `getuid()` code change folded into this wave

**Evidence**: [EVIDENCE: b26514cbc]

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
- **Review report**: `../../review/016-foundational-runtime-001-initial-research/review-report.md`
- **Segment-2 synthesis**: `../../research/016-foundational-runtime-001-initial-research/segment-2-synthesis.md`

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
| Cluster D1 (typing hardening) | 2 | 10h | complete |
| Cluster D2 (extraction refactors) | 2 | 14h | complete |
| Cluster D3 (typed predicate + docs) | 2 | 6h | complete |
| **Scheduled total** | **6** | **~30h** | **37/37 complete** |
| Parking lot (deferred) | 3 findings | — | tracked only |

**Effort budget envelope**: ~40h (30h scheduled work + ~10h review/integration buffer).

**Critical path**: NONE. Wave D is DEFERRABLE. All tasks independently schedulable.

**Gate**: `/spec_kit:deep-review :auto` ×3 (lighter than Waves A/B/C ×7) per parent plan §5.7.

**Partial completion**: FIRST-CLASS outcome. Any subset of 6 tasks that lands counts as Wave D progress. Remaining items carry forward to Phase 018+ parking lot.
