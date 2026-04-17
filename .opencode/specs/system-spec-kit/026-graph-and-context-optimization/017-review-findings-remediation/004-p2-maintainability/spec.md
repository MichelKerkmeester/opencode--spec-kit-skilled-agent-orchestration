---
title: "Spec: Phase 017 Wave D — P2 Maintainability (Deferrable)"
description: "Child phase 004 of Phase 017 remediation. 6 P2 maintainability tasks (~40h): assertNever helper + 8 unions, runEnrichmentStep extraction, OnIndexSkipReason satisfies, runAtomicReconsolidationTxn extraction, typed YAML predicate for CP-004, Docker deployment note. Deferrable — no critical-path dependency. Parking-lot P2s tracked for Phase 018+."
trigger_phrases: ["017 wave d", "017 p2 maintainability", "phase 017 wave d", "t-exh-01 assertnever", "t-pin-god-01 runenrichmentstep", "t-rcb-dup-01 runatomicreconsolidationtxn", "t-yml-cp4-01", "004-p2-maintainability"]
importance_tier: "standard"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/017-review-findings-remediation/004-p2-maintainability"
    last_updated_at: "2026-04-17T14:45:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Wave D spec scaffolded"
    next_safe_action: "Schedule Wave D work opportunistically"
    blockers: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Spec: Phase 017 Wave D — P2 Maintainability (Deferrable)

---

<!-- ANCHOR:metadata -->
## 1. METADATA

- **Parent packet**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/017-review-findings-remediation/`
- **Child slug**: `004-p2-maintainability`
- **Wave**: D (P2 maintainability — DEFERRABLE, non-urgent)
- **Level**: 2 (100-499 LOC, QA validation expected)
- **Kind**: maintainability (NOT remediation — pure refactor + typing hardening + docs)
- **Effort budget**: ~40h total (6 tasks + parking lot)
- **Critical-path status**: **OFF the critical path.** Can land in parallel with Phase 018 or later phases
- **Gate profile**: Light — `/spec_kit:deep-review :auto` ×3 (not ×7) per parent plan §5.7
- **Dependency on Waves A/B/C**: Optional. Wave D tasks touch independent files with no shared-write conflicts against Wave A/B/C scope
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM STATEMENT

Phase 017 deep-review surfaced 6 P2-severity maintainability findings that degrade type safety, inflate function length, or leave anti-patterns undocumented — none of which break correctness today, but each of which will compound as the surrounding code evolves.

The constituent problems:

1. **R4-P2-002** — 8 typed unions lack exhaustive `switch` checks. Silent fall-through on new variants.
2. **R4-P2-001** — `runPostInsertEnrichment` at `post-insert.ts:133-376` is a 243-LOC "god function" with 5 intermixed enrichment behaviors. High cognitive load; bug surface area scales with LOC.
3. **R51-P2-001** — `OnIndexSkipReason` lookup table at `post-insert.ts:302-316` has no `satisfies` constraint; new variants silently map to `undefined`.
4. **R4-P2-003** — Duplicate reconsolidation transaction block at `reconsolidation.ts:507-600` — deprecate-path and content-update-path share ~80 LOC of identical transaction orchestration.
5. **CP-004** — YAML `when:` clause at `spec_kit_complete_confirm.yaml:1099` uses prose string instead of typed predicate. Breaks S7 YAML grammar evolution.
6. **R53-P1w-001** — Docker deployment anti-pattern (`-v /tmp:/tmp` across Copilot MCP containers) undocumented. Operators risk cross-container tmpfs poisoning.

**Why P2 and not P1:** none of these change runtime behavior today. They are all "future-proofing the abstraction" changes: compiler catches variant bugs earlier (T-EXH-01, T-W1-PIN-02), smaller functions diff cleaner in code review (T-PIN-GOD-01, T-RCB-DUP-01), typed predicate survives YAML grammar rev (T-YML-CP4-01), docs prevent operational misconfiguration (T-W1-HST-02).

**Why deferrable:** no downstream phase blocks on these. Phase 019 (changelog) has no cross-references. No consumer breakage risk. Pure hygiene.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### 3.1 IN SCOPE — 6 tasks

| Task ID | Description | Effort | Files |
|---------|-------------|--------|-------|
| T-EXH-01 | `assertNever` helper + apply to 8 typed unions | 8h (L) | New `lib/utils/exhaustiveness.ts`; 8 call sites |
| T-PIN-GOD-01 | Extract `runEnrichmentStep` helper; reduce `runPostInsertEnrichment` 243→80 LOC | 8h (L) | `handlers/save/post-insert.ts:133-376` |
| T-W1-PIN-02 | `OnIndexSkipReason` `satisfies Record<...>` clause + warn-log on unmapped variant | 2h (S) | `handlers/save/post-insert.ts:302-316` |
| T-RCB-DUP-01 | Extract `runAtomicReconsolidationTxn(predecessorSnapshot, op, ops)` | 6h (M) | `lib/storage/reconsolidation.ts:507-600` |
| T-YML-CP4-01 | Move prose `when:` timing note to canonical `after:` field | 4h (M) | `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:1099` |
| T-W1-HST-02 | Docker `-v /tmp:/tmp` anti-pattern note in deployment docs | 2h (S) | `DEPLOYMENT.md` |

**Total**: 6 tasks, ~30h scheduled work + ~10h review/integration buffer = ~40h effort budget.

### 3.2 8 typed unions for T-EXH-01

1. `OnIndexSkipReason`
2. `EnrichmentStepStatus`
3. `EnrichmentSkipReason`
4. `EnrichmentFailureReason`
5. `ConflictAbortStatus`
6. `HookStateLoadFailureReason`
7. `SharedPayloadTrustState`
8. `TriggerCategory`

### 3.3 PARKING LOT — tracked, NOT scheduled in this phase

Deferred to Phase 018+ candidates (not in this wave's 40h):

- **R55-P2-002** — underused `importance-tier` helper at `importance-tiers.ts:149` (10+ inline duplicates untouched)
- **R55-P2-003** — `executeConflict` precondition-block DRY opportunity
- **R55-P2-004** — YAML boolean-predicate evolution gap (broader than CP-004 single-site fix)

### 3.4 OUT OF SCOPE

Explicitly NOT touched in this wave:

- Any Wave A/B/C scope (infrastructure primitives, cluster consumers, rollout sweeps)
- Other `post-insert.ts` refactors beyond the `runEnrichmentStep` extraction + `satisfies` clause
- Other reconsolidation refactors beyond the `runAtomicReconsolidationTxn` extraction
- Parking-lot items R55-P2-002/003/004 (tracked-only, scheduled Phase 018+)
- Behavior changes — all 6 tasks are pure refactor/typing/docs; zero runtime-behavior delta permitted

**Scope lock**: Per §1 Critical Rule 2, no adjacent "while we're here" cleanups. If a task touches `post-insert.ts:133-376`, ONLY the `runEnrichmentStep` extraction or `OnIndexSkipReason` satisfies clause change lands. Other lines stay untouched.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### 4.1 Functional requirements

- **FR-D-01** — `assertNever(x: never): never` helper exists at `lib/utils/exhaustiveness.ts` with standard error-throwing body. Exported as named export.
- **FR-D-02** — All 8 unions in §3.2 have at least one `switch` statement that terminates with `default: return assertNever(variable)` (or equivalent `satisfies` lookup check).
- **FR-D-03** — `runEnrichmentStep(name, isEnabled, runner, options)` helper exists. `runPostInsertEnrichment` consumes it for all 5 enrichment behaviors with preserved semantics.
- **FR-D-04** — `post-insert.ts:302-316` lookup table has `satisfies Record<OnIndexSkipReason, EnrichmentSkipReason>` clause. Unmapped variant triggers warn-log.
- **FR-D-05** — `runAtomicReconsolidationTxn(predecessorSnapshot, op, ops)` helper exists. Both deprecate-path and content-update-path consume it with preserved semantics.
- **FR-D-06** — `spec_kit_complete_confirm.yaml:1099` no longer stores prose timing under `when:`. The timing note lives under canonical `after:` per `shared/predicates/boolean-expr.ts`.
- **FR-D-07** — Deployment docs warn against `-v /tmp:/tmp` across Copilot MCP containers. Optional: `getProjectHash()` incorporates `process.getuid?.()` for defense-in-depth.

### 4.2 Non-functional requirements

- **NFR-D-01** — All 6 tasks are BEHAVIOR-PRESERVING. Vitest suite passes with zero new test additions required (existing tests remain green).
- **NFR-D-02** — `runPostInsertEnrichment` post-refactor is ≤80 LOC (down from 243).
- **NFR-D-03** — No new circular imports introduced by `lib/utils/exhaustiveness.ts`.
- **NFR-D-04** — Parking-lot items explicitly cited in `tasks.md` completion section — no silent drops.

### 4.3 Quality gate

- **QG-D-01** — `/spec_kit:deep-review :auto` ×3 (lighter gate, per parent plan §5.7) on Wave D scope emits ZERO new P0, ZERO new P1.
- **QG-D-02** — `validate.sh --strict` on 004 folder exits 0 with 0 warnings.
- **QG-D-03** — `npx tsc --noEmit` passes after each task lands.
- **QG-D-04** — Existing vitest suite on `post-insert.ts`, `reconsolidation.ts`, and YAML predicate tests passes unchanged.

### 4.4 Success criteria

**NONE REQUIRED** — Wave D is deferrable P2 maintainability. No binary success signal gates other phases on completion. Partial completion (any subset of 6 tasks) is acceptable if capacity constrains.

**If fully completed**, evidence captured in `checklist.md` CHK-D-01..06 with commit hashes per task.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

Deferrable status means there is **no hard success criterion** for Wave D. The wave is "successful" in either of two senses:

1. **Full completion**: All 6 CHK-D-* items green with evidence citations. `runPostInsertEnrichment` ≤80 LOC. All 8 unions guarded by `assertNever`.
2. **Partial completion**: Any subset lands opportunistically. Remaining items roll forward to Phase 018+ with parking-lot entries updated.

If no Wave D task lands in Phase 017, **that is also acceptable** — the parent phase ships on Wave A+B+C completion per parent spec.

**Non-goal**: Wave D does NOT gate Phase 017 `CONDITIONAL → PASS` verdict upgrade. That upgrade depends on Wave A/B/C per parent `checklist.md` CHK-SHIP-01..04.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

### 6.1 Risk matrix

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|-------------|
| T-PIN-GOD-01 extraction regresses enrichment behavior | Low | Medium | Behavior-preservation tests (existing vitest); line-by-line diff review; LOC-budget check (≤80) |
| T-RCB-DUP-01 extraction regresses atomic transaction semantics | Low | Medium | Unchanged vitest; manual trace of predecessor-snapshot handoff in both consumer paths |
| T-EXH-01 `assertNever` introduces new build errors from un-exhausted switches | Medium | Low | Staged application (apply 1 union, verify `tsc --noEmit`, proceed); roll back per-union if any issue |
| T-YML-CP4-01 typed predicate diverges from S7 YAML grammar | Low | Low | Reference `shared/predicates/boolean-expr.ts` directly; add YAML predicate vitest |
| T-W1-HST-02 doc placement ambiguity resolved to repo-root `DEPLOYMENT.md` | Low | Low | The user explicitly requested `DEPLOYMENT.md`, so the note now lives there. |
| Parking-lot items silently drop | Low | Low | Explicit parking-lot citations in `tasks.md` + `checklist.md`; carry forward to Phase 018+ parking lot |
| Wave D deferral creates perpetual backlog | Medium | Low | Phase 019 parking-lot entry explicit; revisit after Phase 018 completion |

### 6.2 Dependencies

- **Internal (to this packet)**: None. Each task is independently schedulable; no intra-Wave-D ordering.
- **Parent Wave A/B/C**: No strict dependency — Wave D files do not overlap with Wave A/B/C file scope. Optional scheduling preference: land Wave D after A+B+C for cleaner single-wave PR history, but not required.
- **External**: No new npm packages. No runtime infrastructure changes.

### 6.3 File-collision analysis

- `handlers/save/post-insert.ts` — T-PIN-GOD-01 + T-W1-PIN-02 both touch. Sequence as: T-PIN-GOD-01 first (larger refactor), T-W1-PIN-02 second (satisfies clause on post-refactor code). OR land both in one PR.
- `lib/utils/exhaustiveness.ts` — T-EXH-01 only. No collision.
- `lib/storage/reconsolidation.ts` — T-RCB-DUP-01 only. No collision with Wave A/B/C.
- `spec_kit_complete_confirm.yaml` — T-YML-CP4-01 only.
- Deployment docs — T-W1-HST-02 only.

No atomic-ship groups required in Wave D (unlike Wave A). Each task can ship as its own PR.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- **Q-D-01** — Should T-EXH-01 apply `assertNever` to ALL 8 unions in one PR, or stagger 1-union-per-PR for smaller review surface? **Default**: one PR per union, sequenced over time; acceptable to batch if reviewer prefers single-PR for all 8.
- **Q-D-02** — Should T-PIN-GOD-01 preserve the existing enrichment ordering exactly, or is reorder permitted for cleaner helper signature? **Default**: preserve exact ordering to minimize regression risk.
- **Q-D-03** — Should T-YML-CP4-01 migrate OTHER prose `when:` clauses across the YAML command tree, or only the CP-004 call site? **Default**: CP-004 only — broader migration is R55-P2-004 parking-lot.
- **Q-D-04** — Resolved: T-W1-HST-02 uses repo-root `DEPLOYMENT.md`, per the implementation request.
- **Q-D-05** — For parking-lot items (R55-P2-002/003/004), should they be tracked here or deferred to Phase 018 spec scaffold? **Default**: tracked here in `tasks.md` §parking-lot; carry-forward noted in implementation-summary.md when Phase 018 starts.
- **Q-D-06** — Is ×3 deep-review sufficient for Wave D (vs Wave A/B/C ×7)? **Default**: yes — parent plan §5.7 explicitly specifies lighter gate for P2-only wave. If any iter flags P0/P1, escalate to ×7.
<!-- /ANCHOR:questions -->

---

## CROSS-REFERENCES

- **Parent spec**: `../spec.md` (Phase 017 frozen scope)
- **Parent plan §5 Wave D**: `../plan.md` (detailed task specs)
- **Parent tasks §Wave D**: `../tasks.md` (acceptance criteria)
- **Parent checklist CHK-D-01..06**: `../checklist.md` (verification items)
- **Sibling children**: `../001-infrastructure-primitives/`, `../002-cluster-consumers/`, `../003-rollout-sweeps/`
