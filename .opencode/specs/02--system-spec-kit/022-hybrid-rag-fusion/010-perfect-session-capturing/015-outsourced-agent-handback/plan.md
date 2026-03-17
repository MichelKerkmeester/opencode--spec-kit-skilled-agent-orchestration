---
title: "Implementation Plan: Outsourced Agent Memory Capture"
description: "Align runtime memory-input handling, CLI handback docs, and spec evidence so explicit JSON-mode failures, next-step persistence, and verification status are all documented consistently."
trigger_phrases: ["outsourced agent memory", "memory handback plan", "cli agent protocol"]
importance_tier: "normal"
contextType: "general"
---
# Implementation Plan: Outsourced Agent Memory Capture
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript and Markdown |
| **Framework** | Spec Kit runtime save flow plus `cli-*` skill documentation |
| **Storage** | Markdown spec artifacts and Spec Kit Memory outputs |
| **Testing** | Targeted Vitest, `npm run lint` (`tsc --noEmit`), alignment-drift verification, `validate.sh` |

### Overview
This work now lands in four layers: runtime safeguards for explicit JSON-mode input handling, CLI handback documentation updates across all 8 relevant `cli-*` docs, a dedicated doc-regression test plus feature-catalog alignment, and spec-folder reconciliation so the written evidence matches the current repository state. The plan uses fresh 2026-03-16 verification instead of inherited 013-era claims.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] Runtime loader hard-fails explicit `dataFile` errors without fallback
- [x] Next-step normalization and `NEXT_ACTION` persistence are documented correctly
- [x] All 8 relevant `cli-*` docs reflect redact-and-scrub, snake_case acceptance, rejection-code guidance, and minimum-payload guidance
- [x] Feature-catalog and regression-test coverage protect the handback contract from drifting
- [x] Spec docs use fresh 2026-03-16 verification and no longer rely on stale 013-era evidence
- [x] Spec-folder validation run recorded
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Repository-side runtime hardening plus documentation alignment.

### Key Components
- **`data-loader.ts`**: Loads explicit JSON-mode input and now throws `EXPLICIT_DATA_FILE_LOAD_FAILED: ...` for missing, invalid, or invalid-shape input instead of falling back.
- **`input-normalizer.ts`**: Accepts `nextSteps` or `next_steps`, persists `Next: ...` / `Follow-up: ...`, and preserves mixed structured payload next steps when those facts are missing.
- **`session-extractor.ts`**: Reads the persisted `Next: ...` fact into `NEXT_ACTION`.
- **`runtime-memory-inputs.vitest.ts`**: Guards the explicit-failure path and next-step persistence behavior.
- **`outsourced-agent-handback-docs.vitest.ts`**: Keeps the 8 CLI handback docs and the feature catalog aligned on post-010 save-gate guidance.
- **4 `cli-*` skills + 4 prompt templates**: Tell the caller to extract handback data, redact and scrub it, include richer `FILES` metadata, and stop on explicit JSON-mode failures.
- **Feature catalog entry `.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/17-outsourced-agent-memory-capture.md`**: Tracks the handback protocol as a current phase `015` concern rather than a stale `013` snapshot.

### Data Flow
```text
Caller prepares /tmp/save-context-data.json
  -> Caller redacts and scrubs sensitive values
  -> Caller includes durable evidence (specific summary, richer FILES metadata, meaningful context)
  -> generate-context runtime loads explicit dataFile
  -> invalid file / JSON / shape throws EXPLICIT_DATA_FILE_LOAD_FAILED: ...
  -> valid input normalizes nextSteps or next_steps (including mixed structured payloads)
  -> first persisted fact becomes Next: ...
  -> session extractor maps Next: ... to NEXT_ACTION
  -> sufficiency / contamination / render validation evaluate the result
  -> saved memory and spec docs describe the same behavior
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Runtime Safeguards
- [x] Hard-fail explicit `dataFile` load, parse, and validation failures in `data-loader.ts`
- [x] Normalize `nextSteps` and `next_steps` in `input-normalizer.ts`, including mixed structured payload preservation without duplicate next-step facts
- [x] Feed the first persisted next step into `NEXT_ACTION` in `session-extractor.ts`
- [x] Add regression coverage in `runtime-memory-inputs.vitest.ts`

### Phase 2: CLI Handback Documentation
- [x] Update all 4 `cli-*` SKILL files with redact-and-scrub, rejection-code, and minimum-payload guidance
- [x] Update all 4 `cli-*` prompt templates with accepted snake_case fields, richer `FILES` examples, and explicit hard-fail behavior
- [x] Align the feature catalog entry to phase `015` and the post-010 gate contract
- [x] Add doc-regression coverage for the 8 handback docs plus the catalog entry

### Phase 3: Verification and Reconciliation (tasks.md: "Phase 3: Verification" per template)
- [x] Rerun the targeted runtime-plus-doc Vitest lane and record the actual `2 files / 32 tests` result
- [x] Verify alignment drift currently reports `244` scanned files, `0 findings`, and `0 warnings`
- [x] Record current `npm run lint` (`tsc --noEmit`) rerun status as passing evidence
- [x] Verify fresh JSON-mode handback behavior with one successful write and one thin-payload `INSUFFICIENT_CONTEXT_ABORT`
- [x] Run `validate.sh` on this spec folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Targeted regression | Explicit `dataFile` failure handling, next-step persistence, and doc-contract drift | `runtime-memory-inputs.vitest.ts`, `outsourced-agent-handback-docs.vitest.ts` |
| Static verification | TypeScript correctness for the task scope | `npm run lint` (`tsc --noEmit`) |
| Alignment verification | Drift between implementation and aligned standards | `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit/scripts` |
| Spec validation | Completeness and checklist consistency inside this folder | `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` |
| Manual follow-up | Fresh JSON-mode handback write plus thin-payload rejection | `generate-context.js` with representative rich and thin payloads |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `data-loader.ts` | Internal | Green | Explicit JSON-mode failures would drift from documented behavior |
| `input-normalizer.ts` + `session-extractor.ts` | Internal | Green | `nextSteps` / `next_steps` docs would not match persisted memory state |
| 4 `cli-*` skills + 4 prompt templates | Internal | Green | Callers would miss scrub guidance or hard-fail semantics |
| Feature catalog entry + new doc regression test | Internal | Green | Caller guidance could drift away from the runtime contract |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Reconciliation introduces contradictions, validation failures, or inaccurate proof claims.
- **Procedure**: Revert only the affected spec-folder markdown files and restore wording from the last validated state; do not touch `memory/` manually.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Runtime Safeguards) -> Phase 2 (CLI Docs) -> Phase 3 (Verify and Reconcile)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Runtime Safeguards | None | CLI Docs, Verify and Reconcile |
| CLI Docs | Runtime Safeguards | Verify and Reconcile |
| Verify and Reconcile | Runtime Safeguards, CLI Docs | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Runtime Safeguards | Med | Previously shipped and re-verified in this phase |
| CLI Handback Documentation | Med | One focused pass across 8 docs plus the catalog |
| Verification and Reconciliation | Med | Targeted test reruns, manual JSON-mode verification, and spec validation |
| **Total** | | **Level 2 scope maintained** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Source runtime files reviewed before updating docs
- [x] Existing Level 2 templates reviewed before editing spec artifacts
- [x] Verification commands identified before claiming completion

### Rollback Procedure
1. Restore the previous version of the 5 spec artifacts in this folder.
2. Re-run `validate.sh` to confirm the restored set is internally consistent.
3. Keep any historical verification notes that are still accurate.
4. Leave `memory/` contents unchanged.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
