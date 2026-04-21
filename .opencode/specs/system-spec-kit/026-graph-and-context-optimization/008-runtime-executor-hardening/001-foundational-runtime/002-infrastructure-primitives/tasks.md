---
title: "Tasks: Phase 017 Wave A — Infrastructure Primitives"
description: "5 Wave A tasks with full acceptance criteria, atomic-ship annotations, and evidence placeholders. T-CNS-01 + T-W1-CNS-04 merged PR, T-CGC-01 readiness contract, T-W1-HOK-02 shared provenance, T-SCP-01 normalizer collapse, T-EVD-01-prep 016 checklist rewrap."
trigger_phrases: ["017 wave a tasks", "phase 017 wave a task list", "t-cns-01 acceptance", "t-cgc-01 acceptance", "t-w1-hok-02 acceptance", "t-scp-01 acceptance", "t-evd-01-prep acceptance"]
importance_tier: "critical"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/001-foundational-runtime/002-infrastructure-primitives"
    parent_packet: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/001-foundational-runtime"
    last_updated_at: "2026-04-17T14:45:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Wave A task sheet scaffolded from parent tasks.md Wave A section"
    next_safe_action: "Dispatch cli-codex for G1 merged PR (T-CNS-01 + T-W1-CNS-04)"
    blockers: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Phase 017 Wave A — Infrastructure Primitives

> **Parent packet**: `016-foundational-runtime/tasks.md` Wave A section
> **Child phase**: `001-infrastructure-primitives`

---

<!-- ANCHOR:notation -->
## Notation

**Legend**: pending • complete • in progress • blocked
**Effort**: S=≤2h • M=2-8h • L=≥1 day
**Severity**: P0 (blocker) • P1 (required) • P2 (suggestion)
**Task ID scheme**:
- `T-XXX-NN` — original review-report task IDs
- `T-W1-XXX-NN` — segment-2 (Wave 1 research-extension) task IDs
**Finding ID scheme**:
- `R<N>-P<sev>-NNN` — review findings
- `R5<N>-P<sev>-NNN` — segment-2 iteration findings
- `H-56-N` — compound-hypothesis IDs
**Atomic-ship annotations**:
- `G1..G5` — atomic-ship groups within Wave A (see plan.md §2.2)
- Group MUST land as single PR where indicated
**Evidence marker format**: `[EVIDENCE: <commit-hash> <description>]` — canonical `]` closer per T-EVD-01 contract.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Wave A Tasks (5 tasks, ~20h) [PHASE 1 — CRITICAL PATH]

### T-CNS-01 — [x] Canonical save writes description.json.lastUpdated [EVIDENCE: aaf0f49a8]

**Severity**: P1 | **Effort**: M (4h) | **Group**: G1 (merged PR with T-W1-CNS-04)
**Files**: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1259, 1261-1331`
**Resolves**: R4-P1-002, R51-P1-001, partial R3-P2-001, partial R5-P1-001

**Context**:
`workflow.ts:1259` contains `const ctxFileWritten = false` stub that short-circuits the description.json update block (1261-1331). Every canonical save currently fails to write `lastUpdated`, so every consumer that reasons about metadata freshness sees stale data. Combined with T-W1-CNS-04, this composes into H-56-1 (default `/memory:save` is structural no-op).

**Changes**:
1. Remove `const ctxFileWritten = false` stub at line 1259.
2. Wire actual return value from `savePerFolderDescription` (boolean or `{ ctxFileWritten, bytesWritten }`).
3. Extend update block (lines 1261-1331) to write `lastUpdated: new Date().toISOString()` UNCONDITIONALLY on every call (not gated on `ctxFileWritten`).
4. Preserve existing field order and all adjacent field writes.

**Acceptance**:
- Verified: Vitest asserts `description.json.lastUpdated` updated on successive saves with monotonic advancement [EVIDENCE: aaf0f49a8]
- Verified: Manual test: `/memory:save` on test folder sets `lastUpdated` to current time (within 1s tolerance) [EVIDENCE: aaf0f49a8]
- Verified: `grep 'ctxFileWritten = false' scripts/core/workflow.ts` returns no match [EVIDENCE: aaf0f49a8]
- Verified: `grep "'lastUpdated'" scripts/dist/memory/*.js` confirms presence post-build (reverses R4-P1-002's zero-grep) [EVIDENCE: aaf0f49a8]

**Atomic-ship**: MUST land in same PR as T-W1-CNS-04 (G1). Splitting creates transient divergence window.

**Evidence**: [EVIDENCE: aaf0f49a8]

---

### T-W1-CNS-04 — [x] Lift plan-only gate on refreshGraphMetadata [EVIDENCE: aaf0f49a8]

**Severity**: P1 | **Effort**: M (2h merged with T-CNS-01) | **Group**: G1 (merged PR with T-CNS-01)
**Files**: `scripts/core/workflow.ts:1333`, `scripts/memory/generate-context.ts:415`
**Resolves**: R51-P1-002, R56-P1-upgrade-001 (H-56-1 compound headline)

**Context**:
`workflow.ts:1333` gates `refreshGraphMetadata` behind `plannerMode === 'full-auto'`. Default `/memory:save` runs in plan-only mode, so `graph-metadata.json.derived.last_save_at` never advances on default saves. With T-CNS-01, this composes H-56-1: canonical save is structural no-op.

**Changes**:
1. Remove `plannerMode === 'full-auto'` conditional at line 1333.
2. `refreshGraphMetadata` runs on every canonical save regardless of `plannerMode`.
3. Update `generate-context.ts:415` default value if needed for semantic consistency (plan-only remains the default, but it no longer suppresses metadata writes).
4. Preserve all other plannerMode-conditional behavior outside `refreshGraphMetadata`.

**Acceptance**:
- Verified: `graph-metadata.json.derived.last_save_at` advances on every `/memory:save` invocation regardless of `plannerMode` [EVIDENCE: aaf0f49a8]
- Verified: Manual test: default plan-only mode now refreshes metadata [EVIDENCE: aaf0f49a8]
- Verified: Vitest covers both plan-only and full-auto modes (both produce `derived.last_save_at` advancement) [EVIDENCE: aaf0f49a8]
- Verified: `grep "plannerMode === 'full-auto'" scripts/core/workflow.ts:1333` returns no match [EVIDENCE: aaf0f49a8]

**Atomic-ship**: MUST land in same PR as T-CNS-01 (G1).

**Evidence**: [EVIDENCE: aaf0f49a8]

---

### T-CGC-01 — [x] Extract lib/code-graph/readiness-contract.ts [EVIDENCE: 4a154c555]

**Severity**: P1 | **Effort**: M (4h) | **Group**: G2 (standalone)
**Files**: New `mcp_server/lib/code-graph/readiness-contract.ts`; refactor `handlers/code-graph/query.ts:225-300`
**Resolves**: R6-P1-001 (prerequisite for T-W1-CGC-03 in Wave B)

**Context**:
Query handler inlines the readiness-contract helpers at lines 225-300. The 5 other code-graph siblings (`scan.ts`, `status.ts`, `context.ts`, `ccc-status.ts`, `ccc-reindex.ts`, `ccc-feedback.ts`) cannot reuse these helpers — a 6:1 sibling asymmetry (Cluster D). Wave B's T-W1-CGC-03 refactors all 6 handlers, but first needs a shared module to consume.

**Changes**:
1. Create `mcp_server/lib/code-graph/readiness-contract.ts`.
2. Extract these helpers from `query.ts`:
   - `canonicalReadinessFromFreshness`
   - `queryTrustStateFromFreshness`
   - `buildQueryGraphMetadata`
   - `buildReadinessBlock`
3. Export 4-state `TrustState` type: `'live' | 'stale' | 'absent' | 'unavailable'`.
4. Refactor `query.ts:225-300` to import and use the shared helpers.
5. Preserve exported signatures so future Wave B consumers match.

**Acceptance**:
- Verified: `test -f mcp_server/lib/code-graph/readiness-contract.ts` succeeds [EVIDENCE: 4a154c555]
- Verified: `query.ts` behavior unchanged post-refactor (vitest shared fixtures match byte-identical) [EVIDENCE: 4a154c555]
- Verified: Shared module has own unit test suite with 4-state `TrustState` exhaustiveness [EVIDENCE: 4a154c555]
- Verified: Module-level JSDoc documents exported signatures for Wave B consumers [EVIDENCE: 4a154c555]
- Verified: `grep 'from .*readiness-contract' handlers/code-graph/query.ts` confirms import site [EVIDENCE: 4a154c555]

**Evidence**: [EVIDENCE: 4a154c555]

---

### T-W1-HOK-02 — [x] Extract hooks/shared-provenance.ts [EVIDENCE: 77da3013a]

**Severity**: P2 → blocker for Wave B T-W1-HOK-01 | **Effort**: M (4h) | **Group**: G3 (standalone, MUST precede T-W1-HOK-01)
**Files**: New `mcp_server/hooks/shared-provenance.ts`; refactor `hooks/claude/shared.ts:125-129`, `hooks/gemini/shared.ts:7`
**Resolves**: R52-P2-001 (prerequisite for T-W1-HOK-01)

**Context**:
`wrapRecoveredCompactPayload` and related provenance helpers live inside `hooks/claude/shared.ts`. Gemini's `hooks/gemini/shared.ts:7` transitively imports from Claude (R52-P2-001 — inappropriate cross-runtime dependency). Copilot's upcoming `compact-cache.ts` (Wave B T-W1-HOK-01) would be forced to re-inline the helper as a third duplicate if extraction does not happen first.

**Changes**:
1. Create `mcp_server/hooks/shared-provenance.ts`.
2. Move `wrapRecoveredCompactPayload` + related provenance helpers from `hooks/claude/shared.ts` into the new shared module.
3. Update `hooks/claude/shared.ts:125-129` to re-export the helpers from the shared module (no behavior change for Claude consumers).
4. Update `hooks/gemini/shared.ts:7` to import from `../shared-provenance.js` directly (break transitive Claude import).
5. Update any test files that import the Claude-inlined helpers to instead import from the shared module.
6. Preserve exported signatures so Wave B T-W1-HOK-01 (Copilot `compact-cache.ts`) can consume.

**Acceptance**:
- Verified: `test -f mcp_server/hooks/shared-provenance.ts` succeeds [EVIDENCE: 77da3013a]
- Verified: `grep "from '../claude/" hooks/gemini/shared.ts` returns no match [EVIDENCE: 77da3013a]
- Verified: `hooks/claude/shared.ts` re-exports from shared module (no own implementation of provenance helpers) [EVIDENCE: 77da3013a]
- Verified: Existing Claude + Gemini compact-cycle vitest passes unchanged [EVIDENCE: 77da3013a]
- Verified: Shared module has own unit test suite (Claude parity + Gemini parity) [EVIDENCE: 77da3013a]

**Constraint**: MUST precede T-W1-HOK-01 in Wave B. Reverse order would re-inline the helper in Copilot as a third duplicate.

**Evidence**: [EVIDENCE: 77da3013a]

---

### T-SCP-01 — [x] Collapse 4 local normalizers to canonical [EVIDENCE: b923623cc]

**Severity**: P1 | **Effort**: M (4h) | **Group**: G4 (standalone, MUST precede T-SCP-02 in Wave B)
**Files**: `mcp_server/handlers/save/reconsolidation-bridge.ts:228-234`, `lib/storage/lineage-state.ts:198-204`, `handlers/save/types.ts:348-352`, `lib/validation/preflight.ts:440-444`
**Resolves**: R1-P1-001 + R4-P1-001 (compound scope-normalization drift)

**Context**:
4 handlers declare their own `normalizeScopeValue` / `normalizeScopeMatchValue` helpers with subtly divergent semantics (R1-P1-001). The canonical `normalizeScopeContext` in `lib/governance/scope-governance.ts` is the authoritative implementation. Every save path touches at least one of these 4 handlers. Wave B Lane B3 adds a lint rule (T-SCP-02) that rejects new local normalizers — it MUST follow this collapse, otherwise the lint rule would fail the build immediately.

**Changes**:
1. Delete 4 local `normalizeScopeValue` / `normalizeScopeMatchValue` helper definitions:
   - `reconsolidation-bridge.ts:228-234`
   - `lineage-state.ts:198-204`
   - `save/types.ts:348-352`
   - `preflight.ts:440-444`
2. Import `normalizeScopeContext` from `lib/governance/scope-governance.ts` at each call site.
3. Update call-site signatures to match canonical function.
4. Preserve observable semantics (treat `undefined`, `null`, `""`, whitespace, non-string consistently with canonical).

**Acceptance**:
- Verified: Vitest semantic-equivalence matrix passes — inputs `{undefined, null, "", "   ", 42}` × 4 call sites × canonical normalizer [EVIDENCE: b923623cc]
- Verified: `grep -rn 'function normalizeScope' mcp_server/handlers mcp_server/lib/storage mcp_server/lib/validation` returns only `scope-governance.ts` [EVIDENCE: b923623cc]
- Verified: `grep -l 'normalizeScopeContext' mcp_server/` lists at least the 4 modified files + `scope-governance.ts` [EVIDENCE: b923623cc]
- Verified: Full vitest suite passes after refactor [EVIDENCE: b923623cc]

**Constraint**: MUST precede T-SCP-02 (Wave B Lane B3 lint rule). Lint-first would break the build.

**Evidence**: [EVIDENCE: b923623cc]

---

### T-EVD-01-prep — [x] Rewrap 016 checklist.md evidence markers [EVIDENCE: 7d85861a0]

**Severity**: P2 (data cleanup) | **Effort**: S (2h) | **Group**: G5 (standalone, prerequisite for T-EVD-01 in Wave C)
**Files**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/001-foundational-runtime/001-initial-research/checklist.md`
**Resolves**: R3-P2-002 (data side only; tool side deferred to T-EVD-01 in Wave C)

**Context**:
016 `checklist.md` contains 170 of 179 `[EVIDENCE: ...]` markers closed with `)` instead of `]`. Wave C's T-EVD-01 activates a lint rule that asserts `[EVIDENCE: ...]` must close with `]` — in `--strict` mode this would emit 170 warnings on the first sweep. This task cleans the data so lint activation is a non-event rather than a noise storm.

**Changes**:
1. Pre-check baseline: `grep -c '\[EVIDENCE:.*\)$' checklist.md` records original count.
2. Automated find-replace: rewrite the pattern `\[EVIDENCE:([^\]\)]*)\)$` → `[EVIDENCE:$1]` on line-anchored basis (do not disturb markers that already use `]`).
3. Post-check: `grep -c '\[EVIDENCE:.*\)$' checklist.md` returns `0`.
4. Diff review: confirm ONLY the closer character changed; no content mutation.

**Acceptance**:
- Verified: `grep -c '\[EVIDENCE:.*\)$' 016-foundational-runtime/001-initial-research/checklist.md` returns `0`
- Verified: `grep -c '\[EVIDENCE:.*\]$' 016-foundational-runtime/001-initial-research/checklist.md` returns a count equal to the pre-change total completed-CHK count
- Verified: `git diff 016-foundational-runtime/001-initial-research/checklist.md` shows only `)` → `]` replacements, no content mutation [EVIDENCE: 7d85861a0]
- Verified: No `[EVIDENCE:` line has mixed closers (e.g., stray `)` inside an otherwise-valid marker)

**Constraint**: MUST complete before T-EVD-01 (Wave C) activates `--strict` mode.

**Evidence**: [EVIDENCE: 7d85861a0]

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:completion -->
## Wave A Completion Criteria

Wave A is code-complete when:

1. All 5 tasks above transition pending → complete with populated `[EVIDENCE: <commit-hash> <description>]` markers.
2. G1 atomic-ship constraint verified (single merge commit contains both T-CNS-01 and T-W1-CNS-04).
3. Ordering constraints verified:
   - T-W1-HOK-02 merged (G3) before any Wave B Lane B2 task dispatches.
   - T-SCP-01 merged (G4) before T-SCP-02 (Wave B Lane B3) dispatches.
   - T-EVD-01-prep merged (G5) before T-EVD-01 (Wave C) activates `--strict` mode.
4. Wave A gate: `/spec_kit:deep-review :auto` ×7 emits ZERO new P0 and ZERO new P1 introduced by Wave A.
5. `validate.sh --strict` on 017 spec folder exits 0 with 0 warnings.
6. Full vitest suite green on `main`.

**Unblocks**: Wave B dispatch (`002-cluster-consumers/`).

**Does not require**:
- Full 27-task Phase 017 completion (this child only owns 5).
- Wave B/C/D task evidence (those are tracked in their respective child packets).

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

### Parent packet
- **Spec**: `../spec.md` — Phase 017 frozen scope, cluster inventory, success criteria
- **Plan**: `../plan.md` §2 Wave A — detailed wave-level spec
- **Tasks**: `../tasks.md` Wave A section — parent task list (this child mirrors only Wave A)
- **Checklist**: `../checklist.md` CHK-A-01..08 — parent verification items (this child mirrors subset)

### Sibling child phases
- **Wave B**: `../002-cluster-consumers/` (pending, awaits Wave A complete)
- **Wave C**: `../003-rollout-sweeps/` (pending, awaits Wave B complete)
- **Wave D**: `../004-p2-maintainability/` (pending, deferrable)

### Upstream research
- **Review report**: `../../review/016-foundational-runtime-pt-01/review-report.md`
- **Segment-1 synthesis**: `../../research/016-foundational-runtime-pt-01/FINAL-synthesis-and-review.md`
- **Segment-2 synthesis**: `../../research/016-foundational-runtime-pt-01/segment-2-synthesis.md`

### Operator feedback
- `feedback_phase_018_autonomous` — DELETE not archive, deep-review ×7 per gate, cli-codex primary
- `feedback_copilot_concurrency_override` — 3-concurrent cap
- `feedback_stop_over_confirming` — skip A/B/C/D menus when obvious
- `feedback_worktree_cleanliness_not_a_blocker` — dirty-state baseline accepted

### Finding ID crosswalk (Wave A subset)
| Task | Finding IDs |
|------|-------------|
| T-CNS-01 | R4-P1-002, R51-P1-001, partial R3-P2-001, partial R5-P1-001 |
| T-W1-CNS-04 | R51-P1-002, R56-P1-upgrade-001 (H-56-1 headline) |
| T-CGC-01 | R6-P1-001 prereq |
| T-W1-HOK-02 | R52-P2-001 |
| T-SCP-01 | R1-P1-001 + R4-P1-001 (compound) |
| T-EVD-01-prep | R3-P2-002 data side |
<!-- /ANCHOR:cross-refs -->

---

## Progress Summary

| Task | Severity | Effort | Group | Status |
|------|----------|--------|-------|--------|
| T-CNS-01 | P1 | M (4h) | G1 | complete [EVIDENCE: aaf0f49a8] |
| T-W1-CNS-04 | P1 | M (2h) | G1 | complete [EVIDENCE: aaf0f49a8] |
| T-CGC-01 | P1 | M (4h) | G2 | complete [EVIDENCE: 4a154c555] |
| T-W1-HOK-02 | P2→blocker | M (4h) | G3 | complete [EVIDENCE: 77da3013a] |
| T-SCP-01 | P1 | M (4h) | G4 | complete [EVIDENCE: b923623cc] |
| T-EVD-01-prep | P2 | S (2h) | G5 | complete [EVIDENCE: 7d85861a0] |
| **Total** | **4 P1, 1 P2, 1 P2→blocker** | **~20h** | **5 groups** | **26/26 complete** |

**Critical path within Wave A**: G1 (T-CNS-01 + T-W1-CNS-04) first — eliminates H-56-1 root cause. G2/G3/G4/G5 may run in parallel after G1 or alongside G1 at dispatcher discretion.

**Atomic-ship groups**:
- G1: T-CNS-01 + T-W1-CNS-04 (single PR mandatory)
- G2: T-CGC-01 (unblocks Wave B T-W1-CGC-03)
- G3: T-W1-HOK-02 (unblocks Wave B T-W1-HOK-01)
- G4: T-SCP-01 (unblocks Wave B T-SCP-02 lint)
- G5: T-EVD-01-prep (unblocks Wave C T-EVD-01 strict mode)

**End of tasks.md**
