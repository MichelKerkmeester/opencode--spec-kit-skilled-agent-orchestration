---
title: "Implementation Plan: Phase 017 Wave D — P2 Maintainability"
description: "Wave D plan: 6 P2 maintainability tasks (~40h total, DEFERRABLE, OFF critical path). No intra-Wave-D dependencies — each task independently schedulable in parallel. Light gate: /spec_kit:deep-review :auto ×3 (not ×7). Parking-lot P2s cited but not scheduled."
trigger_phrases: ["017 wave d plan", "phase 017 wave d plan", "004 p2 maintainability plan", "p2 maintainability implementation plan"]
importance_tier: "standard"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime/005-p2-maintainability"
    last_updated_at: "2026-04-17T14:45:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Wave D plan scaffolded"
    next_safe_action: "Run any Wave D cluster independently"
    blockers: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Phase 017 Wave D — P2 Maintainability

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Wave D is the DEFERRABLE P2-maintainability tail of Phase 017. Six tasks totaling ~40h effort (pure refactor + typing + docs) with no critical-path role and no intra-Wave-D ordering dependencies. Each task can ship as its own PR, in any order, in parallel with Phase 018 or later. Light gate: `/spec_kit:deep-review :auto` ×3 (vs ×7 for Waves A/B/C) because all 6 tasks are behavior-preserving.

Parking-lot P2 items (R55-P2-002/003/004) are tracked but explicitly NOT scheduled in this wave — they roll forward to Phase 018+ parking lot.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

Wave D uses a **LIGHTER gate profile** than Waves A/B/C, per parent plan §5.7 ("Wave D gate: `/spec_kit:deep-review :auto` ×3 — lighter gate for maintainability-only wave").

After Wave D code-complete (full or partial):

1. **`/spec_kit:deep-review :auto` ×3** on Wave D scope emits ZERO new P0, ZERO new P1
   - If any iter flags P0/P1, escalate to ×7 (matching Wave A/B/C rigor)
2. **`validate.sh --strict` on 004 folder** exits 0 with 0 warnings
3. **`npx tsc --noEmit`** passes after each task (incremental gate)
4. **Vitest suite** passes on modified modules (`post-insert.ts`, `reconsolidation.ts`, YAML predicate tests)
5. **LOC budget verified** — `runPostInsertEnrichment` ≤80 LOC post T-PIN-GOD-01
6. **Behavior-preservation check** — diff review confirms zero runtime semantic change

### Rationale for light gate

All 6 Wave D tasks are behavior-preserving:
- T-EXH-01 — compiler-only exhaustiveness check (no runtime delta)
- T-PIN-GOD-01 — code motion refactor (identical behavior, smaller function)
- T-W1-PIN-02 — compiler-only satisfies constraint
- T-RCB-DUP-01 — code motion refactor (duplicate block → shared helper)
- T-YML-CP4-01 — typed predicate with identical semantics to prose string
- T-W1-HST-02 — docs only (no code touched)

Deep-review ×7 is overkill for behavior-preserving work. ×3 catches the rare regression while conserving review capacity.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### 3.1 New shared helper: `lib/utils/exhaustiveness.ts`

```
lib/utils/exhaustiveness.ts (NEW: T-EXH-01)
  ↑ imported by
  - post-insert.ts (OnIndexSkipReason, EnrichmentStepStatus, EnrichmentSkipReason, EnrichmentFailureReason)
  - conflict handlers (ConflictAbortStatus)
  - hooks/shared-provenance.ts (HookStateLoadFailureReason, SharedPayloadTrustState)
  - memory-context.ts or trigger dispatcher (TriggerCategory)
```

### 3.2 Extracted helper: `runEnrichmentStep`

```
post-insert.ts (POST T-PIN-GOD-01)
  runPostInsertEnrichment (~80 LOC)
    → runEnrichmentStep('on-index', ...)
    → runEnrichmentStep('backfill', ...)
    → runEnrichmentStep('conflict', ...)
    → runEnrichmentStep('consolidation', ...)
    → runEnrichmentStep('trigger', ...)
```

### 3.3 Extracted helper: `runAtomicReconsolidationTxn`

```
reconsolidation.ts (POST T-RCB-DUP-01)
  executeDeprecatePath
    → runAtomicReconsolidationTxn(predecessorSnapshot, op, ops)
  executeContentUpdatePath
    → runAtomicReconsolidationTxn(predecessorSnapshot, op, ops)
```

### 3.4 Canonical YAML timing note

```
spec_kit_complete_confirm.yaml:1099 (POST T-YML-CP4-01)
  after: "Immediately after the canonical spec document is refreshed on disk"
```

### 3.5 Dependency graph (intra-Wave-D)

```
[T-EXH-01] ── independent
[T-PIN-GOD-01] ┐
[T-W1-PIN-02] ──┴── same file, sequence or co-PR
[T-RCB-DUP-01] ── independent
[T-YML-CP4-01] ── independent
[T-W1-HST-02] ── independent
```

**No cross-task blocking**. File collisions: only T-PIN-GOD-01 + T-W1-PIN-02 share `post-insert.ts`. Recommended: T-PIN-GOD-01 first, then T-W1-PIN-02.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. PHASES

Wave D has NO sequenced phases. Each task is independently schedulable. For planning purposes, tasks are grouped into logical clusters, but the clusters carry no ordering constraint.

### 4.1 Cluster D1 — Typing hardening (10h)
- T-EXH-01 (8h L)
- T-W1-PIN-02 (2h S)

### 4.2 Cluster D2 — Extraction refactors (14h)
- T-PIN-GOD-01 (8h L)
- T-RCB-DUP-01 (6h M)

### 4.3 Cluster D3 — Typed predicate + docs (6h)
- T-YML-CP4-01 (4h M)
- T-W1-HST-02 (2h S)

### 4.4 Parallelism potential

With no intra-Wave-D blocking, all 3 clusters can ship in parallel (3 lanes). Total elapsed time with 3 concurrent engineers: ~14h (longest cluster D2 dominates). With 1 engineer sequential: ~30h.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING

### 5.1 Unit tests (vitest) — EXISTING suite must pass unchanged

- `post-insert.ts` enrichment tests — must pass post T-PIN-GOD-01 extraction
- `reconsolidation.ts` atomic-txn tests — must pass post T-RCB-DUP-01 extraction
- YAML predicate tests (if present) — must pass post T-YML-CP4-01

### 5.2 New unit tests (minimal, only where needed)

- `lib/utils/exhaustiveness.ts` — simple throw-on-unreachable test
- Typed YAML predicate vitest for CP-004 call site (if not already covered)

### 5.3 Compiler gate

- `npx tsc --noEmit` passes after each T-EXH-01 union application
- If `assertNever` reveals un-exhausted switch, FIX the missing case (do NOT silence with `default: /* noop */`)

### 5.4 Integration / regression tests

- `/spec_kit:deep-review :auto` ×3 per Wave D gate (lighter than A/B/C ×7)
- No new adversarial test additions required (behavior preserved)

### 5.5 Manual verification

- Diff review: T-PIN-GOD-01 line-by-line confirms identical semantics
- Diff review: T-RCB-DUP-01 confirms predecessor-snapshot handoff unchanged
- Docker note (T-W1-HST-02) reviewed for operational clarity
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

### 6.1 External dependencies
No new npm packages. No runtime infrastructure changes.

### 6.2 Internal file dependencies

Files touched:
- `mcp_server/lib/utils/exhaustiveness.ts` (NEW)
- `mcp_server/handlers/save/post-insert.ts` (T-PIN-GOD-01 + T-W1-PIN-02)
- `mcp_server/lib/storage/reconsolidation.ts` (T-RCB-DUP-01)
- `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml` (T-YML-CP4-01)
- `DEPLOYMENT.md` (T-W1-HST-02)
- 8 call sites for `assertNever` application (spread across handlers, hooks, lib modules)

### 6.3 Phase dependencies

- **Optional relationship to Wave A/B/C**: Wave D files do NOT overlap with Wave A/B/C scope. No atomic-ship constraints across waves.
- **Preferred ordering**: schedule Wave D AFTER Waves A/B/C ship, to avoid mixing behavior-changing and behavior-preserving PRs. NOT REQUIRED.
- **Blocks**: nothing. Wave D is a leaf in Phase 017.

### 6.4 Runtime dependencies

- cli-codex gpt-5.4 xhigh fast (primary executor, per feedback_phase_018_autonomous)
- cli-copilot gpt-5.4 high (fallback, 3-concurrent max)
- Opus 4.7 (manual diff review of extraction refactors)

### 6.5 Operator-constraint dependencies

- `feedback_phase_018_autonomous` — DELETE-not-archive still applies for any test-file cleanup
- `feedback_copilot_concurrency_override` — 3 concurrent max if running Cluster D1/D2/D3 in parallel
- `feedback_stop_over_confirming` — skip A/B/C/D menus when task is obvious (all 6 Wave D tasks are obvious)
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK STRATEGY

### 7.1 Per-task rollback

Each Wave D task lands as its own commit with no atomic-ship groups. Rollback = `git revert <commit>`. Low risk across the board.

| Task | Rollback action | Risk |
|------|-----------------|------|
| T-EXH-01 | `git revert` per-union commit OR revert `exhaustiveness.ts` creation | Low — compiler-only change |
| T-PIN-GOD-01 | `git revert` extraction commit | Low — behavior-preserving refactor |
| T-W1-PIN-02 | `git revert` satisfies-clause commit | Low — compiler-only |
| T-RCB-DUP-01 | `git revert` extraction commit | Low — behavior-preserving refactor |
| T-YML-CP4-01 | `git revert` YAML commit | Low — single-site grammar swap |
| T-W1-HST-02 | `git revert` docs commit | Trivial — docs only |

### 7.2 Wave-level rollback

Revert the full Wave D merge range via `git revert <first-commit>..<last-commit>`. No persistent state changes (no description.json writes, no DB migrations). Rollback is always safe.

### 7.3 Irreversible operations

**None.** Wave D touches only code and docs; zero persistent-state writes; zero user-facing breaking changes. Rollback is fully reversible at any point.

### 7.4 Partial-completion strategy

Because Wave D is deferrable, partial completion is a first-class outcome. If capacity constrains:

1. Land any subset of 6 tasks — each is independently mergeable
2. Update `checklist.md` CHK-D-* items that LANDED with `[x] [EVIDENCE: <commit>]`
3. Leave remaining CHK-D-* items as `[ ] pending — deferred to Phase 018+ parking lot`
4. Update `tasks.md` §parking-lot to cite carried-forward items
5. Phase 017 ship gate (CHK-SHIP-01..04) does NOT require Wave D completion
<!-- /ANCHOR:rollback -->

---

## CROSS-REFERENCES

- **Parent plan §5 Wave D**: `../plan.md`
- **Parent tasks §Wave D**: `../tasks.md`
- **Parent checklist CHK-D-01..06**: `../checklist.md`
- **Spec**: `./spec.md`
- **Tasks**: `./tasks.md`
- **Checklist**: `./checklist.md`
