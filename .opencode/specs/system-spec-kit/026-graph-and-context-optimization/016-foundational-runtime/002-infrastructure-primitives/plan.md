---
title: "Implementation Plan: Phase 017 Wave A — Infrastructure Primitives"
description: "Wave A plan: 5 tasks / ~20h / CRITICAL PATH. T-CNS-01 + T-W1-CNS-04 merged PR (canonical save metadata writer), T-CGC-01 readiness contract, T-W1-HOK-02 shared provenance, T-SCP-01 normalizer collapse, T-EVD-01-prep 016 checklist rewrap. Quality gate: /spec_kit:deep-review :auto ×7."
trigger_phrases: ["017 wave a plan", "phase 017 wave a implementation plan", "t-cns-01 implementation plan", "readiness-contract extraction plan", "shared-provenance extraction plan", "normalizer collapse plan wave a", "016 checklist evidence rewrap plan"]
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime/002-infrastructure-primitives"
    parent_packet: "system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime"
    last_updated_at: "2026-04-17T14:45:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Wave A child-phase plan scaffolded from parent plan §2 + operator-constraint feedback"
    next_safe_action: "Dispatch cli-codex for T-CNS-01 + T-W1-CNS-04 merged PR"
    blockers: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Phase 017 Wave A — Infrastructure Primitives

> **Parent packet**: `016-foundational-runtime/plan.md` §2 Wave A
> **Child phase**: `001-infrastructure-primitives` (Wave A of A/B/C/D decomposition)

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Wave A lands 5 infrastructure primitives that unblock Waves B/C/D downstream. Total effort ~20h / 2.5 working days with 1 engineer. Critical path. No parallelism within this wave — all tasks touch foundational contracts.

| Task | Files | Effort | Atomic-ship group |
|------|-------|--------|-------------------|
| T-CNS-01 + T-W1-CNS-04 | `workflow.ts:1259, 1333`; `generate-context.ts:415` | 6h (M+M) | G1 (MERGED PR) |
| T-CGC-01 | New `lib/code-graph/readiness-contract.ts`; refactor `query.ts:225-300` | 4h (M) | G2 standalone |
| T-W1-HOK-02 | New `hooks/shared-provenance.ts`; refactor `claude/shared.ts:125-129`, `gemini/shared.ts:7` | 4h (M) | G3 standalone |
| T-SCP-01 | 4 handler files (`reconsolidation-bridge.ts`, `lineage-state.ts`, `save/types.ts`, `preflight.ts`) | 4h (M) | G4 standalone |
| T-EVD-01-prep | `016 checklist.md` (170 rewrap sites) | 2h (S) | G5 standalone |
| **Total** | | **~20h** | **5 groups** |

**Execution model**: Per `feedback_phase_018_autonomous` (user memory), dispatch via cli-codex gpt-5.4 xhigh fast primary, cli-copilot gpt-5.4 high fallback (3-concurrent max). After Wave A code-complete, dispatch `/spec_kit:deep-review :auto` ×7.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### 2.1 Per-task gates

1. **TypeScript compile** — `npx tsc --noEmit` exits 0.
2. **Vitest** — task-specific suite passes (see §5 Testing).
3. **Validator** — `validate.sh --strict` on 017 spec folder exits 0 with 0 warnings.
4. **Operator-constraint respect** — no forbidden edits to out-of-scope files (Wave B/C/D).

### 2.2 Atomic-ship gates

- **G1 (T-CNS-01 + T-W1-CNS-04)**: Both changes in ONE commit / ONE PR. Pre-merge reviewer asserts both present. No staged rollout permitted (transient divergence window is the exact failure mode H-56-1 describes).
- **G3 (T-W1-HOK-02)**: Must precede T-W1-HOK-01 (Wave B). Enforced by wave ordering; G3 lands before Wave B dispatch begins.
- **G4 (T-SCP-01)**: Must precede T-SCP-02 (Wave B Lane B3 lint). Lint-first would break the build.
- **G5 (T-EVD-01-prep)**: Must complete before T-EVD-01 (Wave C) activates `--strict` mode. Activating lint before data is canonical causes 170-warning storm.

### 2.3 Wave-complete gate

After ALL 5 tasks merge:

1. `/spec_kit:deep-review :auto` ×7 on Wave A scope
   - Focus paths: `workflow.ts`, `lib/code-graph/readiness-contract.ts`, `hooks/shared-provenance.ts`, `lib/governance/scope-governance.ts`, `016 checklist.md`
   - Emits ZERO new P0 AND ZERO new P1 introduced by Wave A
   - ≤3 new P2 permissible (minor maintainability items acceptable)
2. `validate.sh --strict` on 017 spec folder exits 0.
3. Vitest full-suite passes on `main`.
4. Pre-Wave-B checkpoint: consumer waves may now dispatch.

### 2.4 Rollback trigger

If the Wave A gate fails (new P0 or >0 P1 introduced), HALT dispatch of Wave B and open rollback decision:
- Per-task `git revert` on the offending commit.
- Re-run vitest + validator to confirm baseline restored.
- Open decision-record.md note at parent 017 level documenting revert rationale.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### 3.1 Canonical save metadata pipeline (target post-Wave-A)

```
/memory:save or generate-context.js --json '<data>' ...
      |
      v
workflow.ts :: runCanonicalSave()
      |
      +--> savePerFolderDescription(specFolder, payload)   [WIRED in T-CNS-01]
      |         returns { ctxFileWritten: boolean, bytesWritten, path }
      |
      +--> description.json update block [EXTENDED in T-CNS-01]
      |         writes: lastUpdated: new Date().toISOString()  (UNCONDITIONAL)
      |
      +--> refreshGraphMetadata(specFolder, ...)   [UN-GATED in T-W1-CNS-04]
                writes: derived.last_save_at, derived.last_accessed_at, ...
                (runs regardless of plannerMode === 'full-auto' | 'plan-only')
```

**Before Wave A** (broken state, H-56-1):
- `workflow.ts:1259`: `const ctxFileWritten = false` stub — update block never fires.
- `workflow.ts:1333`: gated behind `plannerMode === 'full-auto'` — default plan-only skips.
- Net result: default `/memory:save` is a structural metadata-freshness no-op.

**After Wave A** (fixed state):
- Both writes execute on every save regardless of planner mode.
- Atomic-ship: same PR, no transient window.

### 3.2 Cluster D readiness contract

```
mcp_server/lib/code-graph/readiness-contract.ts   [NEW in T-CGC-01]
      |
      +-- export function canonicalReadinessFromFreshness(...)
      +-- export function queryTrustStateFromFreshness(...)
      +-- export function buildQueryGraphMetadata(...)
      +-- export function buildReadinessBlock(...)
      +-- export type TrustState = 'live' | 'stale' | 'absent' | 'unavailable'
      |
      +-- consumed by: handlers/code-graph/query.ts   [REFACTORED in T-CGC-01]
      +-- consumed by: handlers/code-graph/{scan,status,context,ccc-status,ccc-reindex,ccc-feedback}.ts
                         [Wave B T-W1-CGC-03 — NOT this child]
```

### 3.3 Cluster E hooks provenance

```
mcp_server/hooks/shared-provenance.ts   [NEW in T-W1-HOK-02]
      |
      +-- export function wrapRecoveredCompactPayload(...)
      +-- export <related provenance helpers>
      |
      +-- consumed by: hooks/claude/shared.ts   [REFACTORED in T-W1-HOK-02 — re-export only]
      +-- consumed by: hooks/gemini/shared.ts   [REFACTORED in T-W1-HOK-02 — re-export only]
      +-- consumed by: hooks/copilot/compact-cache.ts
                         [Wave B T-W1-HOK-01 — NOT this child]
```

Break transitive import (R52-P2-001): `gemini/shared.ts` no longer imports `from '../claude/shared.js'`.

### 3.4 Scope-governance canonicalization

```
mcp_server/lib/governance/scope-governance.ts :: normalizeScopeContext   [CANONICAL — unchanged]
      ^
      |  (imported & called)
      |
      +-- handlers/save/reconsolidation-bridge.ts:228   [REFACTOR — delete local copy]
      +-- lib/storage/lineage-state.ts:198              [REFACTOR — delete local copy]
      +-- handlers/save/types.ts:348                    [REFACTOR — delete local copy]
      +-- lib/validation/preflight.ts:440               [REFACTOR — delete local copy]
```

**Prevention**: T-SCP-02 (Wave B Lane B3 lint) rejects new local `normalizeScope*` / `getOptionalString` helpers — NOT landed in this child.

### 3.5 Out-of-scope (Wave B/C/D arch)

This child does NOT touch:
- `scan.ts`, `status.ts`, `context.ts`, `ccc-*.ts` handlers (Wave B T-W1-CGC-03 will)
- `hooks/copilot/compact-cache.ts`, `session-prime.ts` (Wave B T-W1-HOK-01 will)
- T-SCP-02 lint rule, T-SAN-* NFKC work, T-PIN-RET-01 retry budget (Wave B)
- 16-folder sweep, T-EVD-01 lint activation, T-SRS-BND-01 (Wave C)
- T-EXH-01, T-PIN-GOD-01, parking-lot items (Wave D)
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Wave A maps to child sub-phases (stop-the-bleed order):

### Phase A.1 — G1: Canonical save writer (6h) [MERGED PR]

**Task IDs**: T-CNS-01 + T-W1-CNS-04
**Files**: `scripts/core/workflow.ts:1259, 1261-1331, 1333`; `scripts/memory/generate-context.ts:415`

**Steps**:
1. Read `workflow.ts` lines 1250-1340 to confirm current state matches review findings.
2. Replace `const ctxFileWritten = false` with wired return-value destructure from `savePerFolderDescription`.
3. Extend update block to write `lastUpdated: new Date().toISOString()` unconditionally.
4. Delete `plannerMode === 'full-auto'` gate at line 1333; `refreshGraphMetadata` runs always.
5. Update `generate-context.ts:415` default value if needed for consistency.
6. Author vitest: `workflow.canonical-save.vitest.ts` — monotonic `lastUpdated` across 3 successive saves.
7. Author vitest: plan-only and full-auto parity for `derived.last_save_at` advancement.
8. Run `npx tsc --noEmit` + full vitest suite.
9. Commit single PR: "fix(017/A): canonical save metadata writer — T-CNS-01 + T-W1-CNS-04 (R4-P1-002, R51-P1-001, R51-P1-002, R56-P1-upgrade-001 / H-56-1)".

**Acceptance**:
- `grep 'ctxFileWritten = false' scripts/core/workflow.ts` returns no match.
- `grep "plannerMode === 'full-auto'" scripts/core/workflow.ts:1333` returns no match.
- Vitest monotonic assertion passes.
- Both plan-only and full-auto mode vitest covered.

### Phase A.2 — G2: Readiness contract extract (4h)

**Task ID**: T-CGC-01
**Files**: New `mcp_server/lib/code-graph/readiness-contract.ts`; refactor `handlers/code-graph/query.ts:225-300`

**Steps**:
1. Create `mcp_server/lib/code-graph/readiness-contract.ts`.
2. Move 4 helpers from `query.ts`: `canonicalReadinessFromFreshness`, `queryTrustStateFromFreshness`, `buildQueryGraphMetadata`, `buildReadinessBlock`.
3. Export 4-state `TrustState` type (`'live' | 'stale' | 'absent' | 'unavailable'`).
4. Import into `query.ts` and replace inline calls.
5. Author vitest: `readiness-contract.vitest.ts` with fixture input → output parity pre/post refactor.
6. Run `npx tsc --noEmit` + targeted vitest.
7. Commit: "refactor(017/A): extract lib/code-graph/readiness-contract.ts — T-CGC-01 (R6-P1-001 prereq)".

**Acceptance**:
- New file exists and exports 4 helpers + `TrustState` type.
- `query.ts` shared-fixture vitest passes byte-identical.
- Signatures documented in module-level JSDoc.

### Phase A.3 — G3: Shared-provenance extract (4h)

**Task ID**: T-W1-HOK-02
**Files**: New `mcp_server/hooks/shared-provenance.ts`; refactor `hooks/claude/shared.ts:125-129`, `hooks/gemini/shared.ts:7`

**Steps**:
1. Create `mcp_server/hooks/shared-provenance.ts`.
2. Move `wrapRecoveredCompactPayload` + related provenance helpers from `hooks/claude/shared.ts`.
3. Update `hooks/claude/shared.ts` to re-export from the new shared module.
4. Update `hooks/gemini/shared.ts:7` to import from `../shared-provenance.js` directly.
5. Remove the Gemini → Claude transitive import path.
6. Update any test file imports that referenced the old Claude-inlined helpers.
7. Author vitest: `shared-provenance.vitest.ts` — Claude/Gemini parity; intentionally includes a stub Copilot consumer assertion (for Wave B pre-wiring verification).
8. Run `npx tsc --noEmit` + Claude + Gemini compact-cycle tests.
9. Commit: "refactor(017/A): extract hooks/shared-provenance.ts — T-W1-HOK-02 (R52-P2-001, Copilot prereq)".

**Acceptance**:
- `test -f hooks/shared-provenance.ts` succeeds.
- `grep "from '../claude/" hooks/gemini/shared.ts` returns no match.
- Existing Claude + Gemini vitest passes.

### Phase A.4 — G4: Normalizer collapse (4h)

**Task ID**: T-SCP-01
**Files**: `handlers/save/reconsolidation-bridge.ts:228-234`, `lib/storage/lineage-state.ts:198-204`, `handlers/save/types.ts:348-352`, `lib/validation/preflight.ts:440-444`

**Steps**:
1. Inspect each of the 4 files to identify the local `normalizeScopeValue` / `normalizeScopeMatchValue` helper.
2. Delete each local definition (4 deletions).
3. Import `normalizeScopeContext` from `lib/governance/scope-governance.ts` at each call site.
4. Update call sites to use canonical signature.
5. Author vitest: `scope-governance.equivalence.vitest.ts` — matrix of `undefined`, `null`, `""`, whitespace, non-string across 4 handlers × canonical normalizer.
6. Verify no other files declare `normalizeScope*` via `grep -rn 'function normalizeScope' mcp_server/`.
7. Run `npx tsc --noEmit` + full vitest.
8. Commit: "refactor(017/A): collapse 4 local normalizers to canonical — T-SCP-01 (R1-P1-001 + R4-P1-001)".

**Acceptance**:
- `grep -rn 'function normalizeScope' mcp_server/` returns only `scope-governance.ts`.
- Semantic-equivalence matrix vitest passes at all 4 call sites.

### Phase A.5 — G5: 016 checklist evidence rewrap (2h)

**Task ID**: T-EVD-01-prep
**Files**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime/001-initial-research/checklist.md`

**Steps**:
1. Pre-check: `grep -c '\[EVIDENCE:.*\)$' 016-foundational-runtime/001-initial-research/checklist.md` records baseline.
2. Automated find-replace: `\[EVIDENCE:([^\]\)]*)\)$` → `[EVIDENCE:$1]` across the file (line-anchored to protect existing `]` closers).
3. Post-check: `grep -c '\[EVIDENCE:.*\)$'` returns `0`.
4. Diff review: `git diff 016-foundational-runtime/001-initial-research/checklist.md` confirms ONLY `)` → `]` changes, no content mutation.
5. Commit: "chore(017/A): rewrap 016 checklist evidence markers `)` → `]` — T-EVD-01-prep (R3-P2-002 data side)".

**Acceptance**:
- `grep -c '\[EVIDENCE:.*\)$' 016 checklist.md` returns `0`.
- `grep -c '\[EVIDENCE:.*\]$' 016 checklist.md` equals pre-change total completed-CHK count.
- No content mutation outside closer character.

### Phase A.6 — Wave A gate

**Dispatch**: `/spec_kit:deep-review :auto` ×7 with focus paths listed in §2.3.

**Success**: ZERO new P0, ZERO new P1 introduced. ≤3 new P2 permitted.

**Failure**: HALT Wave B dispatch; open rollback decision per §2.4.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

### 5.1 Unit tests (vitest)

| Test file | Task | Assertions |
|-----------|------|------------|
| `workflow.canonical-save.vitest.ts` | T-CNS-01 | Monotonic `lastUpdated` advancement across 3 saves; `derived.last_save_at` advances regardless of `plannerMode` (T-W1-CNS-04 parity). |
| `readiness-contract.vitest.ts` | T-CGC-01 | Shared-fixture parity; 4-state `TrustState` exhaustiveness; `query.ts` byte-identical output pre/post refactor. |
| `shared-provenance.vitest.ts` | T-W1-HOK-02 | Claude `wrapRecoveredCompactPayload` parity; Gemini no-longer-transitively-imports-from-Claude; stub Copilot consumer shape. |
| `scope-governance.equivalence.vitest.ts` | T-SCP-01 | Input matrix {undefined, null, "", "   ", non-string} × 4 call sites — semantic equivalence against canonical `normalizeScopeContext`. |

### 5.2 Integration / regression

- **Claude + Gemini compact-cycle tests** — unchanged outcome post T-W1-HOK-02 extract.
- **Full vitest suite** — green on `main` after every Wave A commit.
- **Validator** — `validate.sh --strict` on 017 folder exits 0 with 0 warnings.

### 5.3 Manual verification

- **Canary `/memory:save`** on a test spec folder → confirm `description.json.lastUpdated` freshly updated and `graph-metadata.json.derived.last_save_at` advanced in same save call.
- **Plan-only sanity**: run default `/memory:save` (plan-only) on a test folder → verify `derived.last_save_at` still updated (validates T-W1-CNS-04 gate lift).

### 5.4 Wave-level regression

- `/spec_kit:deep-review :auto` ×7 on Wave A focus paths. Dispatcher per `feedback_phase_018_autonomous` rules.
- Filter: "new P0/P1 introduced by Wave A changes" (pre-existing findings are parking-lot material, not Wave A blockers).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

### 6.1 External (none new)

No new npm packages.

### 6.2 Internal

- Parent 017 spec/plan/tasks (approved).
- `lib/governance/scope-governance.ts :: normalizeScopeContext` — canonical target for T-SCP-01; treated as unchanging during Wave A.
- `handlers/code-graph/query.ts` — source of truth for readiness helpers being extracted (T-CGC-01).
- `hooks/claude/shared.ts` — source of truth for provenance helpers being extracted (T-W1-HOK-02).

### 6.3 Ordering constraints (within Wave A)

- G1 (T-CNS-01 + T-W1-CNS-04) may run first (recommended; eliminates H-56-1 root cause earliest).
- G2/G3/G4/G5 have no ordering dependency relative to each other within Wave A.
- ALL 5 groups MUST land before Wave B dispatch.

### 6.4 Downstream dependencies (unblocked by Wave A)

- **Wave B Lane B1** (T-CNS-02, T-W1-CNS-05, T-CGC-02, T-RBD-03) — unblocked by T-CNS-01 + T-W1-CNS-04 + T-CGC-01.
- **Wave B Lane B2** (T-W1-CGC-03, T-W1-HOK-01) — unblocked by T-CGC-01 + T-W1-HOK-02.
- **Wave B Lane B3** (T-SCP-02, T-SAN-*, T-PIN-RET-01) — T-SCP-02 unblocked by T-SCP-01.
- **Wave C** (T-EVD-01) — unblocked by T-EVD-01-prep.

### 6.5 Runtime dispatch

Per `feedback_phase_018_autonomous` (user memory):
- cli-codex gpt-5.4 xhigh fast (primary executor for T-CNS-01, T-CGC-01, T-W1-HOK-02, T-SCP-01).
- cli-copilot gpt-5.4 high fallback (3-concurrent max; suitable for T-EVD-01-prep which is data-only).
- Opus 4.7 manual orchestration for gate review synthesis.

### 6.6 Operator constraints

- `feedback_phase_018_autonomous` — DELETE not archive, dispatch deep-review ×7 per gate.
- `feedback_copilot_concurrency_override` — 3-concurrent cap respected if fallback triggered.
- `feedback_stop_over_confirming` — no A/B/C/D menus during implementation; decisions are authoritative in this plan.
- `feedback_worktree_cleanliness_not_a_blocker` — dirty-state baseline accepted; parallel tracks permitted.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

### 7.1 Per-task rollback

Each atomic-ship group lands as a single commit. Rollback = `git revert <commit-hash>`.

| Group | Revert blast radius | Downstream impact |
|-------|---------------------|-------------------|
| G1 (T-CNS-01 + T-W1-CNS-04) | `workflow.ts` + `generate-context.ts` | Wave B cannot start (H-56-1 returns). |
| G2 (T-CGC-01) | `lib/code-graph/readiness-contract.ts` + `query.ts` | Wave B Lane B2 (T-W1-CGC-03) blocked. |
| G3 (T-W1-HOK-02) | `hooks/shared-provenance.ts` + Claude/Gemini re-exports | Wave B Lane B2 (T-W1-HOK-01) blocked. |
| G4 (T-SCP-01) | 4 handler files revert to local normalizers | Wave B Lane B3 lint (T-SCP-02) would fail immediately. |
| G5 (T-EVD-01-prep) | 170 closer characters in `016 checklist.md` | Wave C T-EVD-01 `--strict` lint would emit 170 warnings. |

### 7.2 Wave-level rollback

If multiple tasks fail the Wave A gate:
1. `git revert` per-group in reverse merge order.
2. Confirm `main` vitest + validator green.
3. Open decision-record.md at parent 017 level explaining rollback.
4. Re-dispatch corrected tasks; do not proceed to Wave B until gate passes cleanly.

### 7.3 Irreversible operations

**None at Wave A level**. All 5 tasks are either:
- Code changes (trivially revertable via `git revert`)
- Data changes in 016 checklist.md (trivially revertable; noisy diff but not destructive)

No persistent database state is modified by Wave A.

### 7.4 Recovery checklist

After any revert:
- [ ] `main` branch vitest passes.
- [ ] `validate.sh --strict` on 017 spec folder exits 0.
- [ ] `/memory:save` on a test folder verifies baseline freshness behavior.
- [ ] Downstream waves' start conditions re-evaluated.
<!-- /ANCHOR:rollback -->

---

## 8. EXECUTION CHECKLIST FOR DISPATCHER

When dispatching cli-codex for Wave A:

1. Read this `plan.md` §4 step list for the target phase.
2. Read parent `spec.md` for frozen scope boundaries.
3. Dispatch ONE group (G1 recommended first) with explicit file-path allow-list.
4. On return: run vitest + `validate.sh --strict`; confirm scope adherence.
5. Update `tasks.md` status marker from `[ ]` → `[x]` with `[EVIDENCE: <commit-hash> <description>]`.
6. Proceed to next group.
7. After all 5 groups merge: dispatch `/spec_kit:deep-review :auto` ×7.
8. On gate success: mark Wave A complete; unblock Wave B.
9. On gate failure: halt; execute §7 rollback.

**End of plan.md**
