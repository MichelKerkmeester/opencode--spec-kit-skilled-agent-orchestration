---
title: "Feature Specification: scoring-and-calibration manual testing [template:level_2/spec.md]"
description: "Phase 011 documents the 22 manual testing scenarios for scoring and calibration features in the Spec Kit Memory system. Maps each playbook scenario to the matching feature catalog entry and preserves the required acceptance language for verdict review."
trigger_phrases:
  - "manual testing scoring and calibration"
  - "phase 011 scoring calibration"
  - "023-032 066 074 079 098 102 118 121 159 160 170-172"
importance_tier: "high"
contextType: "general"
---
# Feature Specification: scoring-and-calibration manual testing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-03-22 |
| **Branch** | `main` |
| **Parent Spec** | [../spec.md](../spec.md) |
| **Predecessor** | [010-graph-signal-activation](../010-graph-signal-activation/spec.md) |
| **Successor** | [012-query-intelligence](../012-query-intelligence/spec.md) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Manual test scenarios for scoring-and-calibration need structured per-phase documentation instead of a single playbook table buried inside the hybrid RAG fusion packet. Phase 011 must capture the exact test prompts, execution steps, evidence expectations, and verdict rules for all 22 scoring-focused playbook rows so operators can run the active scenarios consistently and reviewers can identify retired items that no longer exist in the MCP server.

### Purpose
Provide a canonical phase packet that maps every assigned scoring-and-calibration test ID to its feature catalog source when one exists and preserves the acceptance language needed for review outcomes. Includes Wave 2-4 additions: learned Stage 2 combiner, shadow feedback holdout evaluation, calibrated overlap bonus, and RRF K experimental tuning, plus a retired historical row for scenario 170.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Phase 011 documentation for all 22 assigned scoring-and-calibration playbook rows, including 21 active MCP-server-backed scenarios and retired row 170.
- Exact linkage from each test ID to the matching feature catalog file under `11--scoring-and-calibration/`.
- Manual-testing execution guidance covering prompts, evidence expectations, and review-protocol verdict inputs.

### Out of Scope
- Running the tests or recording live execution results.
- Editing feature catalog files, playbook source tables, or runtime code.
- Documenting automated-only scoring features that stay outside this manual phase.

### Phase 011 Test Coverage

| Test ID | Scenario Name | Feature Catalog | What It Validates |
|---------|---------------|-----------------|-------------------|
| 023 | Score normalization | [`../../feature_catalog/11--scoring-and-calibration/01-score-normalization.md`](../../feature_catalog/11--scoring-and-calibration/01-score-normalization.md) | Validates min-max normalization and edge-case guards. |
| 024 | Cold-start novelty boost (N4) | [`../../feature_catalog/11--scoring-and-calibration/02-cold-start-novelty-boost.md`](../../feature_catalog/11--scoring-and-calibration/02-cold-start-novelty-boost.md) | Checks that the disabled novelty logic stays out of the live path. |
| 025 | Interference scoring (TM-01) | [`../../feature_catalog/11--scoring-and-calibration/03-interference-scoring.md`](../../feature_catalog/11--scoring-and-calibration/03-interference-scoring.md) | Mutates fixture data to prove cluster penalty behavior. |
| 026 | Classification-based decay (TM-03) | [`../../feature_catalog/11--scoring-and-calibration/04-classification-based-decay.md`](../../feature_catalog/11--scoring-and-calibration/04-classification-based-decay.md) | Needs mixed fixtures so tier and class combinations can be compared. |
| 027 | Folder-level relevance scoring (PI-A1) | [`../../feature_catalog/11--scoring-and-calibration/05-folder-level-relevance-scoring.md`](../../feature_catalog/11--scoring-and-calibration/05-folder-level-relevance-scoring.md) | Confirms the pre-ranking layer runs before per-memory ranking. |
| 028 | Embedding cache (R18) | [`../../feature_catalog/11--scoring-and-calibration/06-embedding-cache.md`](../../feature_catalog/11--scoring-and-calibration/06-embedding-cache.md) | Writes cache state and timestamp metadata; requires isolated fixture. |
| 029 | Double intent weighting investigation (G2) | [`../../feature_catalog/11--scoring-and-calibration/07-double-intent-weighting-investigation.md`](../../feature_catalog/11--scoring-and-calibration/07-double-intent-weighting-investigation.md) | Requires trace capture from both hybrid and non-hybrid searches. |
| 030 | RRF K-value sensitivity analysis (FUT-5) | [`../../feature_catalog/11--scoring-and-calibration/08-rrf-k-value-sensitivity-analysis.md`](../../feature_catalog/11--scoring-and-calibration/08-rrf-k-value-sensitivity-analysis.md) | Needs a repeatable evaluation corpus and captured comparison output. |
| 031 | Negative feedback confidence signal (A4) | [`../../feature_catalog/11--scoring-and-calibration/09-negative-feedback-confidence-signal.md`](../../feature_catalog/11--scoring-and-calibration/09-negative-feedback-confidence-signal.md) | Mutates validation feedback and needs recovery evidence over time. |
| 032 | Auto-promotion on validation (T002a) | [`../../feature_catalog/11--scoring-and-calibration/10-auto-promotion-on-validation.md`](../../feature_catalog/11--scoring-and-calibration/10-auto-promotion-on-validation.md) | Mutates tier state and must leave an audit trail in the sandbox. |
| 066 | Scoring and ranking corrections | [`../../feature_catalog/11--scoring-and-calibration/11-scoring-and-ranking-corrections.md`](../../feature_catalog/11--scoring-and-calibration/11-scoring-and-ranking-corrections.md) | Regression bundle focused on corrected ranking math and anomalous value checks. |
| 074 | Stage 3 effectiveScore fallback chain | [`../../feature_catalog/11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md`](../../feature_catalog/11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md) | Needs crafted rows that intentionally miss successive score fields. |
| 079 | Scoring and fusion corrections | [`../../feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md`](../../feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md) | Covers the phase-017 correction bundle, including normalization and fusion weights. |
| 098 | Local GGUF reranker via node-llama-cpp (P1-5) | [`../../feature_catalog/11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md`](../../feature_catalog/11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md) | Requires host-level env control and optional model assets. |
| 102 | node-llama-cpp optionalDependencies | [`../../feature_catalog/11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md`](../../feature_catalog/11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md) | Verifies optional dependency installation and dynamic import fallback behavior. |
| 118 | Stage-2 score field synchronization (P0-8) | [`../../feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md`](../../feature_catalog/11--scoring-and-calibration/13-scoring-and-fusion-corrections.md) | Depends on includeTrace output from the active non-hybrid pipeline. |
| 121 | Adaptive shadow proposal and rollback (Phase 4) | [`../../feature_catalog/11--scoring-and-calibration/18-adaptive-shadow-ranking-bounded-proposals-and-rollback.md`](../../feature_catalog/11--scoring-and-calibration/18-adaptive-shadow-ranking-bounded-proposals-and-rollback.md) | Mutates adaptive signals and feature flags; needs rollback-safe isolation. |
| 159 | Learned Stage 2 Combiner (SPECKIT_LEARNED_STAGE2_COMBINER) | [`../../feature_catalog/11--scoring-and-calibration/19-learned-stage2-weight-combiner.md`](../../feature_catalog/11--scoring-and-calibration/19-learned-stage2-weight-combiner.md) | Validates shadow scoring output alongside the live Stage 2 combiner. |
| 160 | Shadow Feedback Holdout (SPECKIT_SHADOW_FEEDBACK) | [`../../feature_catalog/11--scoring-and-calibration/20-shadow-feedback-holdout-evaluation.md`](../../feature_catalog/11--scoring-and-calibration/20-shadow-feedback-holdout-evaluation.md) | Validates holdout evaluation pipeline for offline scoring comparison. |
| 170 | Fusion Policy Shadow v2 (historical playbook row) | Retired in active MCP server; no current feature-catalog file | Documents that `SPECKIT_FUSION_POLICY_SHADOW_V2` and related Fusion Lab code are no longer active in `mcp_server`. |
| 171 | Calibrated Overlap Bonus (SPECKIT_CALIBRATED_OVERLAP_BONUS) | [`../../feature_catalog/11--scoring-and-calibration/21-calibrated-overlap-bonus.md`](../../feature_catalog/11--scoring-and-calibration/21-calibrated-overlap-bonus.md) | Verifies calibrated overlap bonus replaces flat convergence bonus with beta=0.15 scaling and 0.06 cap. |
| 172 | RRF K Experimental (SPECKIT_RRF_K_EXPERIMENTAL) | [`../../feature_catalog/11--scoring-and-calibration/22-rrf-k-experimental.md`](../../feature_catalog/11--scoring-and-calibration/22-rrf-k-experimental.md) | Verifies per-intent K optimization selects best K from sweep grid using NDCG@10. |

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Rewrite | Phase 011 test specification for all 22 scoring-and-calibration scenarios |
| `plan.md` | Rewrite | Phase 011 execution plan with prompts, phase sequencing, and rollback rules |
| `tasks.md` | Rewrite | Task tracker — one task per scenario, all pending |
| `checklist.md` | Rewrite | Level 2 verification checklist — all items unchecked |
| `implementation-summary.md` | Rewrite | Blank template awaiting execution completion |

### Scenario Registry

| # | Scenario ID | Scenario Name | Feature Catalog Ref |
|---|-------------|---------------|---------------------|
| 1 | 023 | Score normalization | 11--scoring-and-calibration/01-score-normalization.md |
| 2 | 024 | Cold-start novelty boost (N4) | 11--scoring-and-calibration/02-cold-start-novelty-boost.md |
| 3 | 025 | Interference scoring (TM-01) | 11--scoring-and-calibration/03-interference-scoring.md |
| 4 | 026 | Classification-based decay (TM-03) | 11--scoring-and-calibration/04-classification-based-decay.md |
| 5 | 027 | Folder-level relevance scoring (PI-A1) | 11--scoring-and-calibration/05-folder-level-relevance-scoring.md |
| 6 | 028 | Embedding cache (R18) | 11--scoring-and-calibration/06-embedding-cache.md |
| 7 | 029 | Double intent weighting investigation (G2) | 11--scoring-and-calibration/07-double-intent-weighting-investigation.md |
| 8 | 030 | RRF K-value sensitivity analysis (FUT-5) | 11--scoring-and-calibration/08-rrf-k-value-sensitivity-analysis.md |
| 9 | 031 | Negative feedback confidence signal (A4) | 11--scoring-and-calibration/09-negative-feedback-confidence-signal.md |
| 10 | 032 | Auto-promotion on validation (T002a) | 11--scoring-and-calibration/10-auto-promotion-on-validation.md |
| 11 | 066 | Scoring and ranking corrections | 11--scoring-and-calibration/11-scoring-and-ranking-corrections.md |
| 12 | 074 | Stage 3 effectiveScore fallback chain | 11--scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md |
| 13 | 079 | Scoring and fusion corrections | 11--scoring-and-calibration/13-scoring-and-fusion-corrections.md |
| 14 | 098 | Local GGUF reranker via node-llama-cpp (P1-5) | 11--scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md |
| 15 | 102 | node-llama-cpp optionalDependencies | — |
| 16 | 118 | Stage-2 score field synchronization (P0-8) | 11--scoring-and-calibration/13-scoring-and-fusion-corrections.md |
| 17 | 121 | Adaptive shadow proposal and rollback (Phase 4) | 11--scoring-and-calibration/18-adaptive-shadow-ranking-bounded-proposals-and-rollback.md |
| 18 | 159 | Learned Stage 2 combiner (SPECKIT_LEARNED_STAGE2_COMBINER) | 11--scoring-and-calibration/19-learned-stage2-weight-combiner.md |
| 19 | 160 | Shadow feedback (SPECKIT_SHADOW_FEEDBACK) | 11--scoring-and-calibration/20-shadow-feedback-holdout-evaluation.md |
| 20 | 171 | Calibrated overlap bonus (SPECKIT_CALIBRATED_OVERLAP_BONUS) | 11--scoring-and-calibration/21-calibrated-overlap-bonus.md |
| 21 | 172 | RRF K experimental (SPECKIT_RRF_K_EXPERIMENTAL) | 11--scoring-and-calibration/22-rrf-k-experimental.md |
| 22 | 196 | Tool-level TTL cache | 11--scoring-and-calibration/15-tool-level-ttl-cache.md |
| 23 | 197 | Access-driven popularity scoring | 11--scoring-and-calibration/16-access-driven-popularity-scoring.md |
| 24 | 198 | Temporal-structural coherence scoring | 11--scoring-and-calibration/17-temporal-structural-coherence-scoring.md |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-023 | Execute 023 (Score normalization) with the exact prompt, execution sequence, evidence capture, and feature link. | PASS: All normalized scores in [0,1]; equal scores produce uniform output; single result = 1.0; FAIL: Out-of-range values or division-by-zero on equal scores |
| REQ-024 | Execute 024 (Cold-start novelty boost (N4)) with the exact prompt, execution sequence, evidence capture, and feature link. | PASS: Novelty contribution fixed to 0 in all search results; no hot-path novelty computation; FAIL: Non-zero novelty in telemetry or hot-path code still active |
| REQ-025 | Execute 025 (Interference scoring (TM-01)) with the exact prompt, execution sequence, evidence capture, and feature link. | PASS: Duplicates penalized with lower effective score; non-duplicates retain original scores; FAIL: No penalty applied or false positive penalties |
| REQ-026 | Execute 026 (Classification-based decay (TM-03)) with the exact prompt, execution sequence, evidence capture, and feature link. | PASS: Each class+tier combination produces distinct documented multiplier; scores decay accordingly; FAIL: Multipliers missing or do not match configuration matrix |
| REQ-027 | Execute 027 (Folder-level relevance scoring (PI-A1)) with the exact prompt, execution sequence, evidence capture, and feature link. | PASS: Folders ranked first; individual results ordered within folder context; global query returns folder-prioritized results; FAIL: Folder ranking missing or individual results ignore folder context |
| REQ-028 | Execute 028 (Embedding cache (R18)) with the exact prompt, execution sequence, evidence capture, and feature link. | PASS: Cache hit skips embedding call with <10ms latency; miss triggers embedding; hit updates lastAccessed timestamp; FAIL: Cache hit still calls embedding API or timestamps not updated |
| REQ-029 | Execute 029 (Double intent weighting investigation (G2)) with the exact prompt, execution sequence, evidence capture, and feature link. | PASS: Hybrid queries skip stage-2 intent weighting; non-hybrid queries apply it; no double-weight in any case; FAIL: Double intent weighting detected in hybrid path |
| REQ-030 | Execute 030 (RRF K-value sensitivity analysis (FUT-5)) with the exact prompt, execution sequence, evidence capture, and feature link. | PASS: Multiple K values tested with per-K metrics; optimal K documented with evidence; FAIL: Single K tested or no comparative analysis |
| REQ-031 | Execute 031 (Negative feedback confidence signal (A4)) with the exact prompt, execution sequence, evidence capture, and feature link. | PASS: Multiplier decreases with negatives, never below floor; recovery toward 1.0 over half-life; FAIL: Multiplier reaches 0 or no recovery observed |
| REQ-032 | Execute 032 (Auto-promotion on validation (T002a)) with the exact prompt, execution sequence, evidence capture, and feature link. | PASS: Promotion occurs at threshold count; throttle blocks re-promotion within window; audit row created; FAIL: Promotion at wrong threshold or throttle bypassed |
| REQ-066 | Execute 066 (Scoring and ranking corrections) with the exact prompt, execution sequence, evidence capture, and feature link. | PASS: Scoring corrections produce expected rank ordering and no anomalous score values |
| REQ-074 | Execute 074 (Stage 3 effectiveScore fallback chain) with the exact prompt, execution sequence, evidence capture, and feature link. | PASS: Fallback chain follows correct priority order and produces valid scores for all missing-field combinations |
| REQ-079 | Execute 079 (Scoring and fusion corrections) with the exact prompt, execution sequence, evidence capture, and feature link. | PASS: Scoring corrections produce mathematically correct results with proper normalization bounds |
| REQ-098 | Execute 098 (Local GGUF reranker via node-llama-cpp (P1-5)) with the exact prompt, execution sequence, evidence capture, and feature link. | PASS: Strict `=== 'true'` check works, custom model lowers threshold, and scoring is sequential |
| REQ-102 | Execute 102 (node-llama-cpp optionalDependencies) with the exact prompt, execution sequence, evidence capture, and feature link. | PASS: `node-llama-cpp` remains in optionalDependencies, installs cleanly, and dynamic import degrades gracefully when module is absent |
| REQ-118 | Execute 118 (Stage-2 score field synchronization (P0-8)) with the exact prompt, execution sequence, evidence capture, and feature link. | PASS: intentAdjustedScore synchronized with score via Math.max; resolveEffectiveScore returns the correct final value |
| REQ-121 | Execute 121 (Adaptive shadow proposal and rollback (Phase 4)) with the exact prompt, execution sequence, evidence capture, and feature link. | PASS: Shadow proposal emitted without mutating live order; disable flag removes proposal cleanly; FAIL: Live order changes under shadow mode or proposal persists after disable |
| REQ-159 | Execute 159 (Learned Stage 2 Combiner) with exact prompt, execution sequence, evidence capture, and feature link. Feature flag: `SPECKIT_LEARNED_STAGE2_COMBINER` (default: OFF). | PASS when flag ON: shadow scoring output emitted alongside live Stage 2 combiner, shadow weights logged, live ranking not affected; PASS when flag OFF: no shadow scoring output. FAIL when shadow output mutates live ranking |
| REQ-160 | Execute 160 (Shadow Feedback Holdout) with exact prompt, execution sequence, evidence capture, and feature link. Feature flag: `SPECKIT_SHADOW_FEEDBACK` (default: OFF). | PASS when flag ON: holdout pipeline runs on configured percentage, holdout results logged separately, live retrieval unaffected; PASS when flag OFF: no holdout pipeline runs. FAIL when holdout affects live results |
| REQ-170 | Document 170 (Fusion Policy Shadow v2) as verified-retired/removed from the active MCP server with evidence from the current codebase audit. | PASS: Phase docs explicitly state that `SPECKIT_FUSION_POLICY_SHADOW_V2`, `fusion-lab.js`, `isShadowFusionV2Enabled`, `runShadowComparison`, `minmax_linear`, and `zscore_linear` are verified-retired, with `fusion-lab.js` deleted in commit `56c67030f` and no active `mcp_server` matches; FAIL: Phase docs still claim scenario 170 is active |
| REQ-171 | Execute 171 (Calibrated Overlap Bonus) with exact prompt, execution sequence, evidence capture, and feature link. Feature flag: `SPECKIT_CALIBRATED_OVERLAP_BONUS` (default: OFF). | PASS when flag ON: calibrated overlap bonus replaces flat convergence bonus with beta=0.15 scaling and 0.06 cap; trace shows capped calibrated value; FAIL when cap is exceeded or calibrated scaling absent |
| REQ-172 | Execute 172 (RRF K Experimental) with exact prompt, execution sequence, evidence capture, and feature link. Feature flag: `SPECKIT_RRF_K_EXPERIMENTAL` (default: OFF). | PASS when flag ON: per-intent K optimization evaluates sweep grid, selects best K using NDCG@10, records winning K; FAIL when sweep grid is skipped or chosen K lacks NDCG@10 evidence |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 22 assigned playbook rows are documented with exact prompts, command sequences, evidence captures, and outcomes appropriate to current runtime state.
- **SC-002**: Every test row links to the correct scoring-and-calibration feature catalog file by relative path.
- **SC-003**: Destructive scenarios (025, 026, 028, 031, 032, 121) are executed in an isolated sandbox with pre/post state documented.
- **SC-004**: Reviewers can apply the review protocol verdict rules without reopening the monolithic playbook for missing scenario details.
### Acceptance Scenarios

**Given** the `011-scoring-and-calibration` phase packet, **when** a reviewer opens the scenario mapping, **then** every scenario listed for the phase has a bounded execution target and a documented acceptance rule.

**Given** the `011-scoring-and-calibration` phase packet, **when** execution evidence is reviewed, **then** verdict notes can be traced through `tasks.md`, `checklist.md`, and `implementation-summary.md`.

**Given** the `011-scoring-and-calibration` phase packet, **when** a reviewer checks neighboring navigation, **then** the packet points back to the parent and to the adjacent numbered phase where one exists.

**Given** strict validation runs on the `011-scoring-and-calibration` phase packet, **when** the validator checks structure, **then** the packet satisfies Level 2 requirement and acceptance-scenario minimums.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md` | Phase 011 cannot stay accurate if source prompts or pass/fail text drift | Treat the playbook as single source of truth; refresh this phase doc after playbook edits |
| Dependency | `../../feature_catalog/11--scoring-and-calibration/` | Missing or moved feature files would break traceability from scenario to feature | Keep relative links aligned with the catalog; re-run link audit after renames |
| Dependency | `../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md` | Verdicts could be inconsistent if reviewers do not apply the same PASS/PARTIAL/FAIL rules | Use the review protocol as the final verdict rubric for every executed scenario |
| Dependency | MCP runtime, flags, and sandbox fixture data | Several tests depend on trace output, toggled flags, or state-mutating validation flows | Run destructive scenarios in an isolated sandbox and reset state between tests |
| Dependency | `SPECKIT_LEARNED_STAGE2_COMBINER` feature flag | Required for 159; controls shadow scoring output alongside the live combiner | Confirm flag support in the runtime before running 159; default OFF preserves existing combiner behavior |
| Dependency | `SPECKIT_SHADOW_FEEDBACK` feature flag | Required for 160; controls the holdout evaluation pipeline | Confirm flag support and holdout percentage configuration before running 160; default OFF disables holdout |
| Dependency | Phase 011 code audit for retired scenario 170 | Required to prove 170 no longer exists in the active MCP server | Confirm the absence of active `mcp_server` matches before closing the phase packet |
| Dependency | `SPECKIT_CALIBRATED_OVERLAP_BONUS` feature flag | Required for 171; controls calibrated overlap bonus behavior | Confirm flag support before running 171; default OFF preserves prior overlap bonus |
| Dependency | `SPECKIT_RRF_K_EXPERIMENTAL` feature flag | Required for 172; controls per-intent K sweep | Confirm flag support before running 172; default OFF disables K sweep |
| Risk | Host-specific prerequisites for 098 local reranker checks | Missing model files or insufficient memory can block the reranker scenario | Record blocked status with evidence, or use a prepared host that satisfies model-path and memory thresholds |
| Risk | Sandbox reset needed between destructive scenarios | Missed reset could corrupt state for subsequent tests | Create a checkpoint before any state-mutating test and restore it immediately after |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should 098 be marked blocked on hosts without the local GGUF model asset, or should the phase require a dedicated reranker-ready machine?
- Which sandbox reset mechanism is preferred for destructive validation scenarios: checkpoint restore, fixture reload, or throwaway SQLite copy per test run?
- Do phase reviewers want a shared evidence naming convention for trace captures so cross-phase verdict bundles stay uniform?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Non-destructive scenarios must complete within normal MCP tool call latency bounds.
- **NFR-P02**: Sandbox checkpoint create/restore operations must complete before the next scenario begins.

### Reliability
- **NFR-R01**: All 22 playbook rows must produce a documented outcome — active scenarios use PASS/PARTIAL/FAIL, and retired scenario 170 must be labeled as retired/removed.
- **NFR-R02**: Evidence artifacts must be retained in `scratch/` for reviewer audit.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Sandbox state reset: required between scenarios 025, 026, 028, 031, 032, and 121.
- Feature flag toggling: active flag-dependent scenarios (159, 160, 171, 172) require explicit ON/OFF verification passes; scenario 170 requires retirement-status verification instead.
- Host prerequisites: 098 may be blocked by missing GGUF model; document blocked status with evidence rather than skipping.

### Error Scenarios
- Missing checkpoint: create a fresh checkpoint before any state-mutating test; do not proceed without it.
- Flag not supported: if a feature flag is absent from the runtime, mark the dependent scenario as BLOCKED and document the runtime version.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 22 scenarios across sandbox and non-sandbox execution paths |
| Risk | 15/25 | Destructive scenarios require sandbox isolation; flag-gated scenarios require confirmed runtime support |
| Research | 8/20 | Acceptance criteria defined in playbook; feature catalog provides implementation context |
| **Total** | **41/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---
