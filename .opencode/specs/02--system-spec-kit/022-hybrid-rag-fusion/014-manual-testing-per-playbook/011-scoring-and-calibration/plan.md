---
title: "Implementation Plan: scoring-and-calibration manual testing [template:level_1/plan.md]"
description: "Phase 011 defines how operators run the 16 scoring-and-calibration scenarios from the manual testing playbook. It preserves the exact prompts, separates non-destructive and destructive flows, and explains how evidence maps to review-protocol verdicts."
trigger_phrases:
  - "manual testing plan"
  - "scoring and calibration"
  - "phase 011"
  - "evidence collection"
  - "MCP runtime"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: scoring-and-calibration manual testing

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language** | Markdown |
| **Framework** | spec-kit L1 |
| **Storage** | Filesystem docs + MCP runtime traces |
| **Testing** | manual + MCP |

### Overview
Phase 011 turns the playbook rows for scoring and calibration into an execution-ready packet for human operators. The plan keeps the exact prompts intact, identifies which scenarios can run read-only versus inside a sandbox, and defines the evidence bundle needed for the review protocol to assign PASS, PARTIAL, or FAIL verdicts.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 011 scope is limited to the 16 assigned scoring-and-calibration tests.
- [x] Exact prompts, execution steps, evidence expectations, and acceptance criteria were extracted from the playbook.
- [x] Feature catalog links were verified for every test ID.
- [x] Review protocol verdict rules were loaded for PASS, PARTIAL, and FAIL handling.
- [x] Destructive scenarios were identified and given sandbox/reset guidance.

### Definition of Done
- [ ] `spec.md` and `plan.md` exist in `011-scoring-and-calibration/` and preserve all 16 test IDs.
- [ ] Every test row includes the exact playbook prompt and the correct execution type.
- [ ] Non-destructive and destructive flows are separated with rollback-safe guidance.
- [ ] Evidence requirements are clear enough for review-protocol verdict assignment.
- [ ] Phase validation passes without missing anchors, frontmatter, or required sections.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manual testing execution pipeline

### Key Components
- **Preconditions**: fixture state, feature flags, optional local model assets, and sandbox checkpoints before each scenario.
- **Execute**: run the exact prompt and playbook step sequence through manual inspection or MCP tool calls.
- **Evidence**: capture traces, logs, score outputs, and before/after comparisons required by the playbook.
- **Verdict**: apply the review protocol to mark the scenario PASS, PARTIAL, or FAIL and escalate blockers.

### Data Flow
`preconditions -> execute -> evidence -> verdict`

Operators first confirm the correct fixture state and runtime flags. They then execute the scenario exactly as written, capture the required evidence bundle, and compare that evidence to the playbook acceptance text and review protocol before assigning the verdict.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Preconditions
- [ ] Confirm the playbook, review protocol, and feature catalog are open to the Phase 011 rows.
- [ ] Prepare a sandbox dataset or checkpointed SQLite copy for scenarios that write cache, validation, access, or tier state.
- [ ] Verify trace capture is enabled where required (`includeTrace:true`, telemetry visibility, or log access).
- [ ] Confirm whether the host can satisfy `NEW-098` reranker prerequisites before starting that scenario.

### Phase 2: Non-Destructive Tests
- [ ] Run read-only or analysis-first scenarios: `NEW-023`, `NEW-024`, `NEW-027`, `NEW-029`, `NEW-030`, `NEW-066`, `NEW-074`, `NEW-079`, `NEW-098`, and `NEW-118`.
- [ ] Capture score ranges, traces, sensitivity comparisons, or log output immediately after each run.
- [ ] Confirm no unintended state mutation occurred before continuing to the destructive phase.

### Phase 3: Destructive Tests
- [ ] Run sandboxed scenarios that write or mutate state: `NEW-025`, `NEW-026`, `NEW-028`, `NEW-031`, `NEW-032`, and `NEW-121`.
- [ ] Sandbox rules: use isolated fixture data, restore a checkpoint or fresh DB copy between scenarios, and revert toggled feature flags after each test.
- [ ] Record any audit rows, cache timestamps, validation counters, or adaptive-signal deltas before the sandbox is reset.

### Phase 4: Evidence Collection and Verdict
- [ ] Bundle the prompt used, execution steps taken, raw outputs, and the evidence artifact named in the playbook for every scenario.
- [ ] Apply the review protocol acceptance checks: preconditions satisfied, prompt/command sequence matched, expected signals present, evidence complete, rationale explicit.
- [ ] Assign PASS, PARTIAL, or FAIL per scenario and flag any critical-path failure as phase-blocking until triaged.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test ID | Scenario Name | Exact Prompt | Execution Type |
|---------|---------------|--------------|----------------|
| NEW-023 | Score normalization | `Verify score normalization output ranges.` | MCP |
| NEW-024 | Cold-start novelty boost (N4) | `Confirm N4 novelty hot-path removal.` | manual |
| NEW-025 | Interference scoring (TM-01) | `Validate interference scoring (TM-01).` | MCP |
| NEW-026 | Classification-based decay (TM-03) | `Verify TM-03 classification-based decay.` | MCP |
| NEW-027 | Folder-level relevance scoring (PI-A1) | `Validate folder-level relevance scoring (PI-A1).` | MCP |
| NEW-028 | Embedding cache (R18) | `Verify embedding cache (R18).` | MCP |
| NEW-029 | Double intent weighting investigation (G2) | `Validate G2 guard in active pipeline.` | MCP |
| NEW-030 | RRF K-value sensitivity analysis (FUT-5) | `Run RRF K sensitivity analysis.` | MCP |
| NEW-031 | Negative feedback confidence signal (A4) | `Verify negative feedback confidence (A4).` | MCP |
| NEW-032 | Auto-promotion on validation (T002a) | `Validate auto-promotion on validation (T002a).` | MCP |
| NEW-066 | Scoring and ranking corrections | `Validate scoring and ranking corrections bundle.` | manual |
| NEW-074 | Stage 3 effectiveScore fallback chain | `Validate Stage 3 effectiveScore fallback chain.` | manual |
| NEW-079 | Scoring and fusion corrections | `Validate phase-017 scoring and fusion corrections.` | manual |
| NEW-098 | Local GGUF reranker via node-llama-cpp (P1-5) | `Validate RERANKER_LOCAL strict check and memory thresholds.` | manual |
| NEW-118 | Stage-2 score field synchronization (P0-8) | `Run a non-hybrid search with intent weighting and verify score fields stay synchronized.` | MCP |
| NEW-121 | Adaptive shadow proposal and rollback (Phase 4) | `Validate Phase 4 adaptive shadow proposal flow.` | MCP |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Manual testing playbook (`../../manual_testing_playbook/manual_testing_playbook.md`) | Internal | Green | Exact prompts, steps, evidence targets, and acceptance text cannot be reconstructed accurately. |
| Feature catalog (`../../feature_catalog/11--scoring-and-calibration/`) | Internal | Green | Scenario-to-feature traceability is lost and spec scope becomes ambiguous. |
| Review protocol (`../../manual_testing_playbook/review_protocol.md`) | Internal | Green | Verdicts may drift because PASS, PARTIAL, and FAIL rules are no longer standardized. |
| MCP runtime and trace/log access | Internal runtime | Green | MCP scenarios cannot produce the score traces and evidence required for review. |
| Sandbox/reset mechanism for mutating scenarios | Internal runtime | Yellow | Destructive tests risk contaminating later runs and invalidating evidence. |
| Local GGUF reranker asset for `NEW-098` | Optional runtime | Yellow | The reranker scenario may need to be marked blocked if the model path or memory threshold cannot be satisfied. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A destructive scenario pollutes shared state, a feature flag is left enabled, or the documented prompt/acceptance text drifts from the playbook.
- **Procedure**: Restore the sandbox checkpoint or fresh fixture copy, reset any scoring-related flags to their baseline values, rerun only the affected scenarios, and update this phase packet if the playbook source changed.
<!-- /ANCHOR:rollback -->

---
