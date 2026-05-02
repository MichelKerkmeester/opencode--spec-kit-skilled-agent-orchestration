---
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
title: "Feature Specification: 002 Deep-Loop Workflow State-Machine Remediation [template:level_2/spec.md]"
description: "Resolve five findings F-010-B5-01..04 and F-019-D4-01 across spec_kit_deep-research_auto.yaml, spec_kit_deep-review_auto.yaml, and generate-context.ts. Closes lock-leak on terminal paths, malformed fallback iteration records in both deep-loop YAMLs, missing --no-resource-map flag plumbing, and stale phase-parent metadata after child saves."
trigger_phrases:
  - "F-010-B5"
  - "F-019-D4"
  - "deep-loop workflow state"
  - "deep-research lock leak"
  - "fallback iteration record"
  - "no-resource-map flag plumbing"
  - "phase parent stale metadata"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/002-deep-loop-workflow-state"
    last_updated_at: "2026-04-30T00:00:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Spec authored; ready for implementation"
    next_safe_action: "Apply five surgical fixes then validate strict and run stress"
    blockers: []
    key_files:
      - ".opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml"
      - ".opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml"
      - ".opencode/skill/system-spec-kit/scripts/memory/generate-context.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-002-deep-loop-state"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---
# Feature Specification: 002 Deep-Loop Workflow State-Machine Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (4 findings) + P2 (1 finding) |
| **Status** | In Progress |
| **Created** | 2026-04-30 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 10 |
| **Predecessor** | 001-code-graph-consistency |
| **Successor** | 003-advisor-quality |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Five findings flagged the deep-loop workflow state machine. (1) `step_acquire_lock` opens an exclusive advisory lock before classification but does not release it on terminal halt or cancel paths, leaving stale lock files that block subsequent runs. (2) and (3) The `on_missing_outputs` fallback in both deep-research and deep-review YAMLs emits an iteration record that omits required canonical fields (mode/sessionId/generation/durationMs in research; sessionId/generation in review), causing reducer drops and inconsistent state. (4) The `--no-resource-map` flag is documented in the markdown command and parsed there, but the YAML config-creation step hardcodes `resource_map.emit: true` so the flag is silently overwritten. (5) `updatePhaseParentPointersAfterSave` updates only the parent's `last_active_child_id` and `last_active_at`, leaving `children_ids` and key-files derived from child saves stale.

### Purpose
Land five surgical fixes so the deep-loop state machine is internally consistent: locks release on every exit path, fallback records carry the canonical schema fields, the `--no-resource-map` flag flows from markdown parsing into the live config, and child saves correctly refresh parent graph metadata.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Five surgical fixes, one per finding F-010-B5-01..04 and F-019-D4-01
- Strict validation pass on this packet
- Targeted test additions where the change is unit-testable (generate-context.ts)
- One commit pushed to `origin main`

### Out of Scope
- Restructuring the lock acquisition protocol beyond `finally`-style cleanup
- Redesigning the iteration record schema (adding required fields only; canonical schema unchanged)
- Adding new resource-map flag surfaces; only plumb the existing `--no-resource-map` flag through
- Children_ids reorganization beyond the parent-save propagation fix
- Behavioral changes outside the cited scope

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Modify | F-010-B5-01: lock cleanup on halt/cancel; F-010-B5-02: canonical fallback iteration record; F-010-B5-04: thread `resource_map.emit` from `--no-resource-map` flag through config |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Modify | F-010-B5-03: canonical fallback iteration record; F-010-B5-04: same `--no-resource-map` plumbing |
| `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` | Modify | F-019-D4-01: when bubbling a child save up to the parent, refresh `parent_id`-side `children_ids` and `last_save_at` so derived metadata stays current |
| `.opencode/skill/system-spec-kit/scripts/tests/phase-parent-pointer.vitest.ts` | Modify | Add a test that verifies parent `children_ids` is updated when a child saves |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional
- FR-1 (F-010-B5-01): `step_acquire_lock` carries explicit cleanup language for halt and cancel paths so the lock file is released regardless of terminal classification outcome. The minimal fix adds an `on_halt` / `on_cancel` cleanup directive that releases the lock before the workflow halts.
- FR-2 (F-010-B5-02): `on_missing_outputs.append_jsonl` in `spec_kit_deep-research_auto.yaml` emits an iteration record with the canonical fields documented in `state_format.md` §Iteration Records — at minimum `type, run, mode, status, focus, findingsCount, newInfoRatio, sessionId, generation, durationMs, timestamp`.
- FR-3 (F-010-B5-03): `on_missing_outputs.append_jsonl` in `spec_kit_deep-review_auto.yaml` emits an iteration record that adds the missing `sessionId, generation, durationMs` fields. The existing record already has `mode, dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks` — keep them.
- FR-4 (F-010-B5-04): `step_create_config` in both YAMLs populates `resource_map.emit` from the `--no-resource-map` flag (default true; false when the flag is present). The `step_create_state_log` config record uses the same parsed value so the JSONL state log agrees with config.
- FR-5 (F-019-D4-01): `updatePhaseParentPointersAfterSave` (and/or its `updatePhaseParentPointer` helper) refreshes the parent's `derived.last_save_at` and ensures the saved child's packet id appears in the parent's `children_ids` list (idempotent — no duplicate inserts).

### Non-Functional
- NFR-1: `validate.sh --strict` exit 0 (or non-blocking warnings only, mirroring sub-phase 010's pattern).
- NFR-2: `npm run stress` remains 56+ files / 163+ tests / exit 0.
- NFR-3: Each fix carries an inline `<!-- F-NNN-BN-NN -->` (or `// F-NNN-BN-NN` for TS) marker for traceability.
- NFR-4: No removal of existing canonical fields. Additive-only inside the fallback record.

### Constraints
- Stay on `main`; commit pushes immediately to `origin main`.
- Only the cited four files touched (three product files + one test).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] Spec authored
- [ ] All five findings closed with finding ID markers
- [ ] `validate.sh --strict` exit 0 (or warnings-only, same pattern as 010)
- [ ] `npm run stress` exit 0 with no count regression
- [ ] One commit pushed to `origin main`
- [ ] Findings closed table populated in implementation-summary.md
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|-----------|
| Lock-cleanup directive may behave differently across runtimes | Use the existing protocol-reference style — declare cleanup as a workflow contract, not a runtime-specific shell command; the directive matches the pattern already used in `step_classify_session.on_invalid_state.halt` |
| Adding fallback record fields could break the reducer | Reducer tolerates extra fields; canonical schema in `state_format.md` is the contract |
| Resource-map flag plumbing could conflict with reducer's existing `config.resource_map.emit` reads | Existing code already reads `config.resource_map.emit` (see line 910 reducer guard); we only fix the writer to honor the parsed flag |
| Parent metadata refresh creates a write race with concurrent child saves | The existing `updatePhaseParentPointersAfterSave` already runs read-modify-write atomically via `atomicWriteJson`; we extend the same pattern, and the existing concurrent-save test already checks eventual consistency |

Dependencies:
- Source of truth: `046-system-deep-research-bugs-and-improvements/research/research.md` §B5 (deep-loop workflow) and `019-*/research/research.md` §D4 (graph metadata)
- Validate: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- Test harness: `.opencode/skill/system-spec-kit/scripts/tests/phase-parent-pointer.vitest.ts`
- No other packet dependencies. Sub-phase 002 is independent within Wave 1.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:edges -->
## L2: EDGE CASES

| Edge | Trigger | Expected behavior |
|------|---------|-------------------|
| Lock acquired then halt before classification finishes | `step_classify_session.on_invalid_state.halt: true` | Lock cleanup runs first, then halt — lock file removed |
| Lock acquired then user pause | Pause sentinel detected mid-classification | Lock cleanup runs before pause sentinel processing |
| Iteration error before sessionId is bound | `current_iteration == 1`, classifier still in init | Fallback record uses the bound `config.lineage.sessionId` (already populated by `step_create_config`) and `config.lineage.generation` |
| `--no-resource-map` passed but resource-map.md does not exist | `resource_map_present == false` already | Both signals agree: emit=false AND present=false; no contradiction |
| Child save where parent's `children_ids` already contains the packet id | Idempotent re-save | No duplicate insert; only `last_save_at` and `last_active_child_id` refreshed |
| Child save where parent has no prior `children_ids` array | First child save | Initialize `children_ids: [child_id]` |
<!-- /ANCHOR:edges -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Finding | File | Effort (minutes) |
|---------|------|-----------------:|
| F-010-B5-01 | spec_kit_deep-research_auto.yaml (lock cleanup) | 15 |
| F-010-B5-02 | spec_kit_deep-research_auto.yaml (fallback record) | 10 |
| F-010-B5-03 | spec_kit_deep-review_auto.yaml (fallback record) | 10 |
| F-010-B5-04 | both YAMLs (resource-map flag plumbing) | 15 |
| F-019-D4-01 | generate-context.ts + test | 20 |
| **Total** | | **~70** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. Lock-release semantics on alternate runtimes deferred (out of scope) — the directive declares the contract; runtimes that honor `step_acquire_lock` already release on workflow exit through their own teardown.
<!-- /ANCHOR:questions -->
