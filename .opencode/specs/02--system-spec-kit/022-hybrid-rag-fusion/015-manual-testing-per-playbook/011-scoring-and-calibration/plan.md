---
title: "Implementation Plan: scoring-and-calibration manual testing [template:level_2/plan.md]"
description: "Execution plan for Phase 011 manual testing of 22 scoring-and-calibration scenarios. Covers preconditions, execution sequencing, evidence capture, and verdict assignment per the review protocol."
trigger_phrases:
  - "phase 011 execution plan"
  - "scoring calibration manual test plan"
  - "scoring and calibration execution"
  - "phase 011 plan"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: scoring-and-calibration manual testing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Runtime** | MCP server (`spec_kit_memory`) |
| **Tools** | `memory_search`, `memory_validate`, `checkpoint_create`, `checkpoint_restore` |
| **Sandbox** | Isolated SQLite copy or MCP checkpoint for destructive tests |
| **Review Protocol** | `../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md` |

### Overview
Phase 011 covers 22 scoring-and-calibration playbook rows drawn from the Spec Kit Memory playbook. Twenty-one rows remain active MCP-server-backed scenarios. Non-destructive scenarios (023, 024, 027, 029, 030, 066, 074, 079, 098, 102, 118) are run directly against the live index. Destructive/stateful scenarios (025, 026, 028, 031, 032, 121) require a checkpoint snapshot before execution and restore after. Active feature-flag scenarios (159, 160, 171, 172) require explicit flag ON and flag OFF passes, while historical row 170 requires a retirement-status code audit instead of active execution.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Manual testing playbook loaded and Phase 011 scenario rows identified
- [ ] Review protocol loaded and verdict criteria confirmed
- [ ] MCP runtime available and `memory_search` tool confirmed working
- [ ] Checkpoint capability confirmed (`checkpoint_create` / `checkpoint_restore`)
- [ ] Active feature flag support confirmed for 159, 160, 171, and 172; retirement status for 170 confirmed by code audit

### Definition of Done
- [ ] All 22 scenarios executed with evidence captured in `scratch/`
- [ ] Every scenario has a PASS, PARTIAL, or FAIL verdict with review-protocol rationale
- [ ] Sandbox state restored after each destructive scenario
- [ ] `checklist.md` fully verified with evidence references
- [ ] `implementation-summary.md` completed with verdict summary table
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Manual test execution using MCP tools plus source code inspection for gated behaviors.

### Key Components
- **Non-destructive execution**: Direct MCP `memory_search` with `includeTrace: true` to capture scoring telemetry.
- **Destructive execution**: MCP `checkpoint_create` before mutation, MCP `checkpoint_restore` after.
- **Feature-flag execution**: Set flag ON, run scenario, capture trace; set flag OFF, run scenario, confirm no shadow output.
- **Source code inspection**: Supplement MCP traces with direct code inspection for behaviors not emitted as trace metadata.

### Data Flow
Playbook prompts → MCP tool invocation → trace capture → evidence documentation → review protocol verdict → checklist update
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Load playbook and identify all 22 Phase 011 scenario rows with exact prompts and command sequences
- [ ] Confirm runtime has `memory_search`, `memory_validate`, `checkpoint_create`, and `checkpoint_restore` available
- [ ] Create a pre-execution checkpoint to enable global rollback if needed

### Phase 2: Non-Destructive Execution (11 scenarios)
Execute the following scenarios directly against the live index using `includeTrace: true`:

| Test ID | Scenario | Exact Prompt |
|---------|----------|--------------|
| 023 | Score normalization | `Verify score normalization output ranges.` |
| 024 | Cold-start novelty boost (N4) | `Confirm N4 novelty hot-path removal.` |
| 027 | Folder-level relevance scoring (PI-A1) | `Validate folder-level relevance scoring (PI-A1).` |
| 029 | Double intent weighting investigation (G2) | `Validate G2 guard in active pipeline.` |
| 030 | RRF K-value sensitivity analysis (FUT-5) | `Run RRF K sensitivity analysis.` |
| 066 | Scoring and ranking corrections | `Validate scoring and ranking corrections bundle.` |
| 074 | Stage 3 effectiveScore fallback chain | `Validate Stage 3 effectiveScore fallback chain.` |
| 079 | Scoring and fusion corrections | `Validate phase-017 scoring and fusion corrections.` |
| 098 | Local GGUF reranker via node-llama-cpp (P1-5) | `Validate RERANKER_LOCAL strict check and memory thresholds.` |
| 102 | node-llama-cpp optionalDependencies | `Verify node-llama-cpp optional dependency installation and dynamic import fallback.` |
| 118 | Stage-2 score field synchronization (P0-8) | `Run a non-hybrid search with intent weighting and verify score fields stay synchronized.` |

- [ ] 023 executed and evidence captured
- [ ] 024 executed and evidence captured
- [ ] 027 executed and evidence captured
- [ ] 029 executed and evidence captured
- [ ] 030 executed and evidence captured
- [ ] 066 executed and evidence captured
- [ ] 074 executed and evidence captured
- [ ] 079 executed and evidence captured
- [ ] 098 executed and evidence captured (or BLOCKED status documented)
- [ ] 102 executed and evidence captured
- [ ] 118 executed and evidence captured

### Phase 3: Destructive / Sandbox Execution (6 scenarios)
Create sandbox checkpoint before each group; restore after:

| Test ID | Scenario | Exact Prompt | Mutation Risk |
|---------|----------|--------------|---------------|
| 025 | Interference scoring (TM-01) | `Validate interference scoring (TM-01).` | Similarity fixture data |
| 026 | Classification-based decay (TM-03) | `Verify TM-03 classification-based decay.` | Tier + class fixture state |
| 028 | Embedding cache (R18) | `Verify embedding cache (R18).` | Cache state + timestamps |
| 031 | Negative feedback confidence signal (A4) | `Verify negative feedback confidence (A4).` | Validation feedback records |
| 032 | Auto-promotion on validation (T002a) | `Validate auto-promotion on validation (T002a).` | Tier state + audit log |
| 121 | Adaptive shadow proposal and rollback (Phase 4) | `Validate Phase 4 adaptive shadow proposal flow.` | Adaptive signals + flags |

- [ ] Sandbox checkpoint created before destructive group
- [ ] 025 executed and evidence captured; sandbox restored
- [ ] 026 executed and evidence captured; sandbox restored
- [ ] 028 executed and evidence captured; sandbox restored
- [ ] 031 executed and evidence captured; sandbox restored
- [ ] 032 executed and evidence captured; sandbox restored
- [ ] 121 executed and evidence captured; sandbox restored

### Phase 4: Feature-Flag Execution and Retirement Audit (5 playbook rows)
For active scenarios: run with flag ON, capture trace; run with flag OFF, confirm no shadow output. For row 170: confirm the feature is retired/removed from the active MCP server:

| Test ID | Scenario | Feature Flag | Exact Prompt |
|---------|----------|--------------|--------------|
| 159 | Learned Stage 2 Combiner | `SPECKIT_LEARNED_STAGE2_COMBINER` | `Verify SPECKIT_LEARNED_STAGE2_COMBINER shadow scoring output alongside the live Stage 2 combiner.` |
| 160 | Shadow Feedback Holdout | `SPECKIT_SHADOW_FEEDBACK` | `Verify SPECKIT_SHADOW_FEEDBACK holdout evaluation pipeline in lib/feedback/shadow-scoring.ts for offline scoring comparison.` |
| 170 | Fusion Policy Shadow v2 (historical row) | Retired in active MCP server | `Confirm the active MCP server no longer contains SPECKIT_FUSION_POLICY_SHADOW_V2 or the Fusion Lab shadow-comparison implementation.` |
| 171 | Calibrated Overlap Bonus | `SPECKIT_CALIBRATED_OVERLAP_BONUS` | `Verify SPECKIT_CALIBRATED_OVERLAP_BONUS replaces flat convergence bonus with beta=0.15 scaling and 0.06 cap.` |
| 172 | RRF K Experimental | `SPECKIT_RRF_K_EXPERIMENTAL` | `Verify SPECKIT_RRF_K_EXPERIMENTAL per-intent K optimization selects best K from sweep grid using NDCG@10.` |

- [ ] 159 executed (flag ON + flag OFF) and evidence captured
- [ ] 160 executed (flag ON + flag OFF) and evidence captured
- [ ] 170 retirement status documented with absence evidence from the current `mcp_server` tree
- [ ] 171 executed (flag ON + flag OFF) and evidence captured
- [ ] 172 executed (flag ON + flag OFF) and evidence captured

### Phase 5: Verdict and Verification
- [ ] Assign PASS/PARTIAL/FAIL to all 22 scenarios using review protocol acceptance criteria
- [ ] Complete `checklist.md` with evidence references for each item
- [ ] Write `implementation-summary.md` with verdict summary table
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Non-destructive MCP | 023, 024, 027, 029, 030, 066, 074, 079, 098, 102, 118 | `memory_search` with `includeTrace: true` |
| Sandbox / destructive | 025, 026, 028, 031, 032, 121 | `checkpoint_create`, `checkpoint_restore`, `memory_validate` |
| Feature-flag | 159, 160, 171, 172 | Flag toggle + `memory_search` + trace inspection |
| Source code inspection | 098, 102, 118, 170 (supplement) | Direct code review when trace metadata is absent or when a historical row must be confirmed retired |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md` | Internal | Confirm before start | Cannot execute without exact playbook prompts |
| `../../manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md` | Internal | Confirm before start | Cannot assign verdicts without protocol rules |
| `../../feature_catalog/11--scoring-and-calibration/` | Internal | Confirm before start | Traceability links break if files are missing or renamed |
| MCP runtime + `memory_search` | Runtime | Confirm | All scenarios blocked if MCP is unavailable |
| `checkpoint_create` / `checkpoint_restore` | Runtime | Confirm | Destructive scenarios blocked if checkpoint tools unavailable |
| `SPECKIT_LEARNED_STAGE2_COMBINER` | Feature flag | Confirm | 159 blocked if flag absent from runtime |
| `SPECKIT_SHADOW_FEEDBACK` | Feature flag | Confirm | 160 blocked if flag absent from runtime |
| Historical playbook row 170 | Documentation/runtime audit | Confirm | Phase packet would misstate active MCP behavior if retirement status is not verified |
| `SPECKIT_CALIBRATED_OVERLAP_BONUS` | Feature flag | Confirm | 171 blocked if flag absent from runtime |
| `SPECKIT_RRF_K_EXPERIMENTAL` | Feature flag | Confirm | 172 blocked if flag absent from runtime |
| GGUF model file (host) | External | Confirm per host | 098 blocked if model asset absent |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any destructive scenario leaves sandbox in unexpected state after restore attempt.
- **Procedure**: Restore the pre-execution global checkpoint created in Phase 1 Setup.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ─────────────┐
                              ├──► Phase 2 (Non-Destructive) ──┐
                              ├──► Phase 3 (Destructive)       ├──► Phase 5 (Verdict)
                              └──► Phase 4 (Feature-Flag) ─────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | All execution phases |
| Non-Destructive | Setup | Verdict |
| Destructive | Setup | Verdict |
| Feature-Flag | Setup | Verdict |
| Verdict | Non-Destructive, Destructive, Feature-Flag | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes |
| Non-Destructive Execution (11 scenarios) | Medium | 2-3 hours |
| Destructive Execution (6 scenarios) | High | 2-3 hours |
| Feature-Flag Execution (5 scenarios) | Medium | 1-2 hours |
| Verdict and Verification | Medium | 1-2 hours |
| **Total** | | **6-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Execution Checklist
- [ ] Global pre-execution checkpoint created
- [ ] Per-sandbox checkpoints documented with IDs before each destructive group
- [ ] Feature flags confirmed at default (OFF) before flag-toggle tests

### Rollback Procedure
1. Restore the pre-execution global checkpoint via `checkpoint_restore`
2. Verify memory count matches pre-execution snapshot
3. Confirm feature flags have been returned to default values
4. Document any partial evidence already captured before the rollback event

### Data Reversal
- **Has data mutations?** Yes — scenarios 025, 026, 028, 031, 032, 121
- **Reversal procedure**: MCP `checkpoint_restore` to the named pre-destructive checkpoint
<!-- /ANCHOR:enhanced-rollback -->

---
