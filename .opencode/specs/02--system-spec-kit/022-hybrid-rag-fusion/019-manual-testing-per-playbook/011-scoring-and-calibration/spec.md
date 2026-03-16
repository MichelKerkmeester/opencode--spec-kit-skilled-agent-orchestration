---
title: "Feature Specification: scoring-and-calibration manual testing [template:level_1/spec.md]"
description: "Phase 011 documents the 16 manual testing scenarios for scoring and calibration features in the Spec Kit Memory system. It maps each playbook scenario to the matching feature catalog entry and preserves the required acceptance language for verdict review."
trigger_phrases:
  - "manual testing"
  - "scoring and calibration"
  - "phase 011"
  - "playbook"
  - "spec kit memory"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: scoring-and-calibration manual testing

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-03-16 |
| **Branch** | `main` |
| **Parent** | [`../spec.md`](../spec.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Manual test scenarios for scoring-and-calibration need structured per-phase documentation instead of a single playbook table buried inside the hybrid RAG fusion packet. Phase 011 must capture the exact test prompts, execution steps, evidence expectations, and verdict rules for the 16 scoring-focused scenarios so operators can run them consistently and reviewers can score them against the review protocol.

### Purpose
Provide a canonical phase packet that maps every assigned scoring-and-calibration test ID to its feature catalog source and preserves the pass/fail acceptance language needed for PASS, PARTIAL, or FAIL verdicts.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Phase 011 documentation for all 16 assigned scoring-and-calibration playbook scenarios.
- Exact linkage from each test ID to the matching feature catalog file under `11--scoring-and-calibration/`.
- Manual-testing execution guidance covering prompts, evidence expectations, and review-protocol verdict inputs.

### Out of Scope
- Running the tests or recording live execution results.
- Editing feature catalog files, playbook source tables, or runtime code.
- Documenting the automated-only scoring features that stay outside this manual phase.

### Phase 011 Test Coverage

| Test ID | Scenario Name | Feature Catalog | What It Validates |
|---------|---------------|-----------------|-------------------|
| NEW-023 | Score normalization | [`../../feature_catalog/11--scoring-and-calibration/01-score-normalization.md`](../../feature_catalog/11--scoring-and-calibration/01-score-normalization.md) | Validates min-max normalization and edge-case guards. |
| NEW-024 | Cold-start novelty boost (N4) | [`../../feature_catalog/11--scoring-and-calibration/02-cold-start-novelty-boost.md`](../../feature_catalog/11--scoring-and-calibration/02-cold-start-novelty-boost.md) | Checks that the disabled novelty logic stays out of the live path. |
| NEW-025 | Interference scoring (TM-01) | [`../../feature_catalog/11--scoring-and-calibration/03-interference-scoring.md`](../../feature_catalog/11--scoring-and-calibration/03-interference-scoring.md) | Mutates fixture data to prove cluster penalty behavior. |
| NEW-026 | Classification-based decay (TM-03) | [`../../feature_catalog/11--scoring-and-calibration/04-classification-based-decay.md`](../../feature_catalog/11--scoring-and-calibration/04-classification-based-decay.md) | Needs mixed fixtures so tier and class combinations can be compared. |
| NEW-027 | Folder-level relevance scoring (PI-A1) | [`../../feature_catalog/11--scoring-and-calibration/05-folder-level-relevance-scoring.md`](../../feature_catalog/11--scoring-and-calibration/05-folder-level-relevance-scoring.md) | Confirms the pre-ranking layer runs before per-memory ranking. |
| NEW-028 | Embedding cache (R18) | [`../../feature_catalog/11--scoring-and-calibration/06-embedding-cache.md`](../../feature_catalog/11--scoring-and-calibration/06-embedding-cache.md) | Writes cache state and timestamp metadata, so it belongs in an isolated fixture. |
| NEW-029 | Double intent weighting investigation (G2) | [`../../feature_catalog/11--scoring-and-calibration/07-double-intent-weighting-investigation.md`](../../feature_catalog/11--scoring-and-calibration/07-double-intent-weighting-investigation.md) | Requires trace capture from both hybrid and non-hybrid searches. |
| NEW-030 | RRF K-value sensitivity analysis (FUT-5) | [`../../feature_catalog/11--scoring-and-calibration/08-rrf-k-value-sensitivity-analysis.md`](../../feature_catalog/11--scoring-and-calibration/08-rrf-k-value-sensitivity-analysis.md) | Needs a repeatable evaluation corpus and captured comparison output. |
| NEW-031 | Negative feedback confidence signal (A4) | [`../../feature_catalog/11--scoring-and-calibration/09-negative-feedback-confidence-signal.md`](../../feature_catalog/11--scoring-and-calibration/09-negative-feedback-confidence-signal.md) | Mutates validation feedback and needs recovery evidence over time. |
| NEW-032 | Auto-promotion on validation (T002a) | [`../../feature_catalog/11--scoring-and-calibration/10-auto-promotion-on-validation.md`](../../feature_catalog/11--scoring-and-calibration/10-auto-promotion-on-validation.md) | Mutates tier state and must leave an audit trail in the sandbox. |
| NEW-066 | Scoring and ranking corrections | [`../../feature_catalog/11--scoring-and-calibration/11-scoring-and-ranking-corrections.md`](../../feature_catalog/11--scoring-and-calibration/11-scoring-and-ranking-corrections.md) | Regression bundle focused on corrected ranking math and anomalous value checks. |
| NEW-074 | Stage 3 effectiveScore fallback chain | [`../../feature_catalog/11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md`](../../feature_catalog/11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md) | Needs crafted rows that intentionally miss successive score fields. |
| NEW-079 | Scoring and fusion corrections | [`../../feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md`](../../feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md) | Covers the phase-017 correction bundle, including normalization and fusion weights. |
| NEW-098 | Local GGUF reranker via node-llama-cpp (P1-5) | [`../../feature_catalog/11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md`](../../feature_catalog/11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md) | Requires host-level env control and optional model assets, so it may be blocked on missing hardware or files. |
| NEW-118 | Stage-2 score field synchronization (P0-8) | [`../../feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md`](../../feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md) | Depends on includeTrace output from the active non-hybrid pipeline. |
| NEW-121 | Adaptive shadow proposal and rollback (Phase 4) | [`../../feature_catalog/11--scoring-and-calibration/18-adaptive-shadow-ranking-bounded-proposals-and-rollback.md`](../../feature_catalog/11--scoring-and-calibration/18-adaptive-shadow-ranking-bounded-proposals-and-rollback.md) | Mutates adaptive signals and feature flags, so it needs rollback-safe isolation. |

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Phase 011 test specification for scoring-and-calibration scenarios |
| `plan.md` | Create | Phase 011 execution plan with prompts, phase sequencing, and rollback rules |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-023 | Document NEW-023 (Score normalization) with the exact prompt, execution sequence, evidence target, and feature link. | PASS: All normalized scores in [0,1]; equal scores produce uniform output; single result = 1.0; FAIL: Out-of-range values or division-by-zero on equal scores |
| REQ-024 | Document NEW-024 (Cold-start novelty boost (N4)) with the exact prompt, execution sequence, evidence target, and feature link. | PASS: Novelty contribution fixed to 0 in all search results; no hot-path novelty computation; FAIL: Non-zero novelty in telemetry or hot-path code still active |
| REQ-025 | Document NEW-025 (Interference scoring (TM-01)) with the exact prompt, execution sequence, evidence target, and feature link. | PASS: Duplicates penalized with lower effective score; non-duplicates retain original scores; FAIL: No penalty applied or false positive penalties |
| REQ-026 | Document NEW-026 (Classification-based decay (TM-03)) with the exact prompt, execution sequence, evidence target, and feature link. | PASS: Each class+tier combination produces distinct documented multiplier; scores decay accordingly; FAIL: Multipliers missing or do not match configuration matrix |
| REQ-027 | Document NEW-027 (Folder-level relevance scoring (PI-A1)) with the exact prompt, execution sequence, evidence target, and feature link. | PASS: Folders ranked first; individual results ordered within folder context; global query returns folder-prioritized results; FAIL: Folder ranking missing or individual results ignore folder context |
| REQ-028 | Document NEW-028 (Embedding cache (R18)) with the exact prompt, execution sequence, evidence target, and feature link. | PASS: Cache hit skips embedding call with <10ms latency; miss triggers embedding; hit updates lastAccessed timestamp; FAIL: Cache hit still calls embedding API or timestamps not updated |
| REQ-029 | Document NEW-029 (Double intent weighting investigation (G2)) with the exact prompt, execution sequence, evidence target, and feature link. | PASS: Hybrid queries skip stage-2 intent weighting; non-hybrid queries apply it; no double-weight in any case; FAIL: Double intent weighting detected in hybrid path |
| REQ-030 | Document NEW-030 (RRF K-value sensitivity analysis (FUT-5)) with the exact prompt, execution sequence, evidence target, and feature link. | PASS: Multiple K values tested with per-K metrics; optimal K documented with evidence; FAIL: Single K tested or no comparative analysis |
| REQ-031 | Document NEW-031 (Negative feedback confidence signal (A4)) with the exact prompt, execution sequence, evidence target, and feature link. | PASS: Multiplier decreases with negatives, never below floor; recovery toward 1.0 over half-life; FAIL: Multiplier reaches 0 or no recovery observed |
| REQ-032 | Document NEW-032 (Auto-promotion on validation (T002a)) with the exact prompt, execution sequence, evidence target, and feature link. | PASS: Promotion occurs at threshold count; throttle blocks re-promotion within window; audit row created; FAIL: Promotion at wrong threshold or throttle bypassed |
| REQ-066 | Document NEW-066 (Scoring and ranking corrections) with the exact prompt, execution sequence, evidence target, and feature link. | PASS if scoring corrections produce expected rank ordering and no anomalous score values |
| REQ-074 | Document NEW-074 (Stage 3 effectiveScore fallback chain) with the exact prompt, execution sequence, evidence target, and feature link. | PASS if fallback chain follows correct priority order and produces valid scores for all missing-field combinations |
| REQ-079 | Document NEW-079 (Scoring and fusion corrections) with the exact prompt, execution sequence, evidence target, and feature link. | PASS if scoring corrections produce mathematically correct results with proper normalization bounds |
| REQ-098 | Document NEW-098 (Local GGUF reranker via node-llama-cpp (P1-5)) with the exact prompt, execution sequence, evidence target, and feature link. | PASS if strict `=== 'true'` check works, custom model lowers threshold, and scoring is sequential |
| REQ-118 | Document NEW-118 (Stage-2 score field synchronization (P0-8)) with the exact prompt, execution sequence, evidence target, and feature link. | PASS if intentAdjustedScore is synchronized with score via Math.max and resolveEffectiveScore returns the correct final value |
| REQ-121 | Document NEW-121 (Adaptive shadow proposal and rollback (Phase 4)) with the exact prompt, execution sequence, evidence target, and feature link. | PASS: Shadow proposal emitted without mutating live order; disable flag removes proposal cleanly; FAIL: Live order changes under shadow mode or proposal persists after disable |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 16 assigned test IDs are documented in this phase packet with exact prompts, execution steps, evidence targets, and verdict criteria.
- **SC-002**: Every test row links to the correct scoring-and-calibration feature catalog file by relative path.
- **SC-003**: The paired `plan.md` defines the execution pipeline from preconditions through evidence capture and verdict assignment.
- **SC-004**: Reviewers can apply the review protocol without reopening the monolithic playbook for missing scenario details.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `../../manual_testing_playbook/manual_testing_playbook.md` | Phase 011 cannot stay accurate if the source prompts or pass/fail text drift. | Treat the playbook as the single source of truth and refresh this phase doc after playbook edits. |
| Dependency | `../../feature_catalog/11--scoring-and-calibration/` | Missing or moved feature files would break traceability from scenario to feature. | Keep relative links aligned with the catalog and re-run a link audit after renames. |
| Dependency | `../../manual_testing_playbook/review_protocol.md` | Verdicts could be inconsistent if reviewers do not apply the same PASS/PARTIAL/FAIL rules. | Use the review protocol as the final verdict rubric for every executed scenario. |
| Dependency | MCP runtime, flags, and sandbox fixture data | Several tests depend on trace output, toggled flags, or state-mutating validation flows. | Run destructive scenarios in an isolated sandbox and reset state between tests. |
| Risk | Playbook rows with abbreviated cross-reference entries (`NEW-066`, `NEW-074`, `NEW-079`, `NEW-098`, `NEW-118`, `NEW-121`) | The cross-reference table alone does not carry full acceptance detail. | Preserve the full scenario rows from the main playbook table inside `plan.md` and this spec. |
| Risk | Host-specific prerequisites for `NEW-098` local reranker checks | Missing model files or insufficient memory can block the reranker scenario. | Record blocked status with evidence, or use a prepared host that satisfies the model-path and memory thresholds. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `NEW-098` be marked blocked on hosts without the local GGUF model asset, or should the phase require a dedicated reranker-ready machine?
- Which sandbox reset mechanism is preferred for destructive validation scenarios: a checkpoint restore, a fixture reload, or a throwaway SQLite copy per test run?
- Do phase reviewers want a shared evidence naming convention for trace captures so cross-phase verdict bundles stay uniform?
<!-- /ANCHOR:questions -->

---
