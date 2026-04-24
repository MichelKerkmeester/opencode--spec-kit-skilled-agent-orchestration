---
title: "Task [system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/002-cli-executor-remediation/tasks]"
description: "~30 tasks across 8 waves. R1-R12 remediations. Atomic-ship groups honored."
trigger_phrases:
  - "020 tasks"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/002-cli-executor-remediation"
    last_updated_at: "2026-04-24T10:30:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Synced shipped R1-R11 work into the task ledger"
    next_safe_action: "Treat remaining unchecked items as deferred or packet-admin closeout only"
    blockers: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Phase 020 Research-Findings Remediation

Status sync: `implementation-summary.md` is the authoritative shipped record for R1-R11. Checked items below reflect landed work; remaining unchecked items are either the deferred R12 branch or packet-admin closeout steps not evidenced in the packet docs.

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[A]` | Atomic-ship group member |

Task ID format: `T-<CAT>-NN` where CAT ∈ {AUD, VAL, YML, REP, LIN, FEN, RET, CTX, DOC, CLG, SUM}.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup (Waves A + B — P0 remediations)

### Wave A — Shared Deep-Loop Provenance (R1 + R2)

- [x] **T-AUD-01** [A] Add `writeFirstRecordExecutor(stateLogPath, executor, iter)` to `executor-audit.ts`. Idempotent; merges if already present.
- [x] **T-AUD-02** [A] Add `emitDispatchFailure(stateLogPath, executor, reason, iter)` to `executor-audit.ts`. Writes a typed `{type:'event',event:'dispatch_failure',executor,reason,iteration,timestamp}` record.
- [x] **T-VAL-01** [A] Update `post-dispatch-validate.ts`: when executor kind is non-native, REQUIRE `executor` field on the first iteration JSONL record.
- [x] **T-VAL-02** [A] Tolerate `dispatch_failure` records during validation (don't emit schema_mismatch on a pre-existing failure event).
- [x] **T-YML-01** [A] Reorder Research auto YAML: `pre_dispatch_audit` step for non-native before dispatch branch; keep post-dispatch audit as idempotent merge.
- [x] **T-YML-02** [A] Mirror into Research confirm YAML.
- [x] **T-YML-03** [A] Mirror into Review auto YAML.
- [x] **T-YML-04** [A] Mirror into Review confirm YAML.
- [x] **T-TST-01** [A] Extend `executor-audit.vitest.ts` with first-write + failure-emit cases.
- [x] **T-TST-02** [A] Extend `post-dispatch-validate.vitest.ts` with non-native provenance required + dispatch_failure tolerated.
- [x] **T-TST-03** [A] New `dispatch-failure.vitest.ts` covering crash/timeout/missing-output fallback.

### Wave B — description.json Repair Safety (R4 + R5)

- [x] **T-REP-01** [A] Refactor `generate-description.ts` loader to return `{ok, data|reason|partial}` discriminated result.
- [x] **T-REP-02** [A] New module `.opencode/skill/system-spec-kit/mcp_server/lib/description/repair.ts` exporting `mergePreserveRepair(partial, target, canonicalOverrides)`. Canonical wins; authored narrative + non-canonical keys preserved.
- [x] **T-REP-03** [A] Update `generate-description.ts` save path: route schema_error → mergePreserveRepair; parse_error → minimal replacement.
- [x] **T-REP-04** [A] Feature flag `SPECKIT_DESCRIPTION_REPAIR_MERGE_SAFE` default-on once R4 ships.
- [x] **T-TST-04** [A] New `description-repair.vitest.ts` covering merge logic, canonical wins, authored preserved.
- [x] **T-TST-05** [A] New `description-repair-specimens.vitest.ts` with rich 017 packet fixtures in `tests/spec-folder/fixtures/`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation (Waves C + D + E)

### Wave C — Copilot @path Fallback (R3)

- [x] **T-YML-05** Extend `if_cli_copilot` branch (Research auto): size-check prompt file; if >16KB, use `@path` wrapper prompt.
- [x] **T-YML-06** Mirror into Research confirm + Review auto + Review confirm YAMLs.
- [x] **T-TST-06** Extend `cli-matrix.vitest.ts` with oversized-prompt test asserting `@path` invocation shape.
- [x] **T-DOC-01** Update Copilot bootstrap docs in `.opencode/skill/cli-copilot/SKILL.md` to resolve contradictions (vs machine-readable matrix).

### Wave D — Metadata Lineage (R6 + R7)

- [x] **T-LIN-01** [A] Extend `graph-metadata-schema.ts` `derivedSchema`: add `save_lineage: z.enum(['description_only','graph_only','same_pass']).optional()` during transition; tighten to required after backfill.
- [x] **T-LIN-02** [A] Update canonical save path in `scripts/core/workflow.ts` to set correct lineage tag per branch.
- [x] **T-LIN-03** [A] Update `scripts/graph/backfill-graph-metadata.ts` to stamp `save_lineage: 'graph_only'` on existing files.
- [x] **T-LIN-04** [A] Add `normalizeTimestampPrecision` helper for date-only values in continuity validator.
- [x] **T-DOC-02** Update continuity-threshold docs in SKILL.md and phase 017 references: "one-sided policy budget, heuristic."
- [x] **T-TST-07** [A] New `graph-metadata-lineage.vitest.ts`.
- [x] **T-TST-08** [A] Extend continuity validator tests with date-only normalization.

### Wave E — Evidence-Marker Fence Parser (R9)

- [x] **T-FEN-01** [A] Fix indented-fence handling in evidence-marker audit parser.
- [x] **T-FEN-02** [A] Fix nested line-start triple-backtick handling (track open fence state).
- [x] **T-FEN-03** [A] Add regression fixtures: indented-fence sample, nested-fence sample, mismatched-fence sample (document false-negative expectation).
- [x] **T-TST-09** [A] Extend `evidence-marker-audit.vitest.ts` with new cases.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification (Waves F + G + H)

### Wave F — Smaller Slices Bundle (R8 + R10 + R11)

- [x] **T-RET-01** Retry-budget module emits structured telemetry `{memoryId, step, reason, attempt, outcome}` without changing N=3.
- [x] **T-DOC-03** Update retry-budget docs in SKILL.md + relevant references: "heuristic; calibration pending telemetry".
- [x] **T-CTX-01** Extend `caller-context.vitest.ts` with `setImmediate`, `queueMicrotask`, `timers/promises` cases.
- [x] **T-DOC-04** Narrow readiness-contract docs in `sk-deep-research/SKILL.md` + `sk-deep-review/SKILL.md`: list only the 4 reachable TrustState values (`live`, `stale`, `absent`, `unavailable`). Mark others as "type-level compatibility vocabulary; not emitted by the 7-handler set".
- [x] **T-DOC-05** Resolve Copilot bootstrap contradictions between the cli-copilot SKILL.md machine-readable matrix and prose.
- [x] **T-TST-10** New `retry-budget-telemetry.vitest.ts`.

### Wave G — R55-P2-004 Review (R12, conditional)

Wave G remains the explicit deferred branch from the implementation summary. These tasks stay unchecked because the packet records R12 as out of scope rather than shipped in this pass.

- [ ] **T-YML-07** Audit YAML assets touched in Waves A + C.
- [ ] **T-DOC-06** If R55-P2-004 scope overlaps: merge fixes into this packet. Else: add note to Phase 017 deferred list confirming it remains out of scope.

### Wave H — Ship

- [ ] **T-CLG-01** Write `.opencode/changelog/12--sk-deep-research/v1.10.0.0.md` per canonical template.
- [ ] **T-CLG-02** Write `.opencode/changelog/13--sk-deep-review/v1.7.0.0.md`.
- [ ] **T-CLG-03** Write `.opencode/changelog/01--system-spec-kit/v3.4.0.3.md` (covers generate-description.ts + graph-metadata lineage work).
- [x] **T-SUM-01** Populate `implementation-summary.md` with shipped state.
- [ ] **T-SUM-02** Refresh description.json + graph-metadata.json via generate-description.js.
- [ ] **T-VAL-03** Run `validate.sh --strict` on 020; confirm 0 errors.
- [ ] **T-VAL-04** Commit + push to main.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All 12 R-IDs landed OR user-approved deferral documented
- All tests green (existing + new)
- `tsc --noEmit` clean
- `validate.sh --strict` on 020 exits 0 after implementation-summary lands
- 3 changelogs shipped per canonical template

### Atomic-Ship Groups

- **Group A** (R1 + R2): all Wave A tasks (T-AUD-01/02 + T-VAL-01/02 + T-YML-01..04 + T-TST-01/02/03)
- **Group B** (R3): all Wave C tasks
- **Group C** (R4 + R5): all Wave B tasks
- **Group D** (R6 + R7): all Wave D tasks (T-LIN-01..04 + T-DOC-02 + T-TST-07/08)
- **Group E** (R9): all Wave E tasks
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Research source**: `../../research/017-sk-deep-cli-runtime-execution-pt-01/research.md`
- **Predecessors**: `../001-executor-feature/`, `../002-runtime-matrix/`
<!-- /ANCHOR:cross-refs -->
</content>
</invoke>
