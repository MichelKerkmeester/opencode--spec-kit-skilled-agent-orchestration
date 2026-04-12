---
title: "125: Memory roadmap capability flags"
description: "Manual-testing reference for validating the runtime roadmap capability resolvers, including canonical SPECKIT_MEMORY_* precedence over legacy Hydra aliases."
audited_post_018: true
phase_018_change: updated to use the dedicated roadmap-capability catalog reference and corrected the snapshot count
---

# 125: Memory roadmap capability flags

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for the 125 memory roadmap capability flags scenario.

---

## 1. OVERVIEW

This scenario validates memory roadmap capability flags for `125`. It focuses on verifying that the runtime resolvers prefer canonical `SPECKIT_MEMORY_*` keys, keep roadmap metadata distinct from live runtime graph flags, and leave adaptive-ranking roadmap defaults off until explicitly enabled.

### Why This Matters

A real user does not ask for raw environment-variable proofs. They ask the orchestrator to explain or validate rollout behavior without accidentally mutating the wrong runtime defaults. This scenario tests whether the orchestrator can convert that request into the correct local verification flow and return a clear, trustworthy conclusion.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `125` and confirm the expected signals without contradicting evidence.

- Objective: Verify runtime roadmap resolvers use canonical `SPECKIT_MEMORY_*` keys first, remain distinct from live runtime flags, and keep adaptive-ranking defaults off until explicitly enabled
- Real user request: `Check whether the memory roadmap flags still stay separate from live runtime defaults, prove that adaptive ranking stays off by default in roadmap snapshots, and show that the canonical SPECKIT_MEMORY_* flags win over legacy Hydra aliases when both are present.`
- Orchestrator prompt: `Validate memory roadmap flag resolution without changing live graph-channel defaults. Work locally in the system-spec-kit mcp_server package, capture the exact commands and outputs, and summarize the result in user language. Capture the evidence needed to prove First snapshot remains phase:"scope-governance" with capabilities.graphUnified:true and capabilities.adaptiveRanking:false even when SPECKIT_GRAPH_UNIFIED=false is set; second snapshot uses canonical SPECKIT_MEMORY_ROADMAP_PHASE=graph and SPECKIT_MEMORY_GRAPH_UNIFIED=false to report phase:"graph" with capabilities.graphUnified:false; third snapshot uses SPECKIT_MEMORY_ADAPTIVE_RANKING=true and reports capabilities.adaptiveRanking:true; fourth snapshot sets SPECKIT_MEMORY_ADAPTIVE_RANKING=false plus SPECKIT_HYDRA_ADAPTIVE_RANKING=true and still reports capabilities.adaptiveRanking:false because the canonical key wins. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected process: Keep execution local because the answer depends on immediate runtime inspection; do not delegate the critical verification step. Run the four snapshots, compare roadmap metadata, and explain why the default runs stay aligned with the live graph channel while canonical keys override legacy aliases.
- Expected signals: First snapshot remains `phase:\"scope-governance\"` with `capabilities.graphUnified:true` and `capabilities.adaptiveRanking:false`; second snapshot reports `phase:\"graph\"` with `capabilities.graphUnified:false`; third snapshot reports `capabilities.adaptiveRanking:true`; fourth snapshot still reports `capabilities.adaptiveRanking:false` because `SPECKIT_MEMORY_ADAPTIVE_RANKING=false` overrides the legacy `SPECKIT_HYDRA_ADAPTIVE_RANKING=true`
- Legacy alias equivalence note: when canonical keys are unset, `SPECKIT_HYDRA_GRAPH_UNIFIED=false` should still produce `capabilities.graphUnified:false`, and `SPECKIT_HYDRA_ADAPTIVE_RANKING=true` should still produce `capabilities.adaptiveRanking:true`.
- Desired user-visible outcome: The final response explains that roadmap defaults still stay distinct from live runtime flags, adaptive ranking remains dormant by default until explicitly enabled, and canonical `SPECKIT_MEMORY_*` env vars override legacy Hydra aliases.
- Pass/fail: PASS if the runtime `SPECKIT_GRAPH_UNIFIED` flag does not flip roadmap metadata, adaptive ranking stays off by default in roadmap snapshots, canonical env vars override legacy aliases, and either env family can explicitly opt roadmap capabilities in when canonical values are absent

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in rollout-language, not just environment-variable language.
2. Choose local execution over delegation because the test is blocked on immediate runtime output.
3. Run the five deterministic snapshots exactly as written.
4. Compare the outputs and explicitly map them back to the user-facing conclusion.
5. Return a short final answer that distinguishes default-off roadmap behavior from explicit canonical or legacy opt-in behavior, while calling out canonical-key precedence.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 125 | Memory roadmap capability flags | Verify runtime roadmap resolvers use canonical `SPECKIT_MEMORY_*` keys first, remain distinct from live runtime flags, and keep adaptive-ranking defaults off until explicitly enabled | `Validate memory roadmap flag resolution without changing live graph-channel defaults. Work locally in the system-spec-kit mcp_server package, capture the exact commands and outputs, and summarize the result in user language. Capture the evidence needed to prove First snapshot remains phase:"scope-governance" with capabilities.graphUnified:true and capabilities.adaptiveRanking:false even when SPECKIT_GRAPH_UNIFIED=false is set; second snapshot uses canonical SPECKIT_MEMORY_ROADMAP_PHASE=graph and SPECKIT_MEMORY_GRAPH_UNIFIED=false to report phase:"graph" with capabilities.graphUnified:false; third snapshot uses SPECKIT_MEMORY_ADAPTIVE_RANKING=true and reports capabilities.adaptiveRanking:true; fourth snapshot sets SPECKIT_MEMORY_ADAPTIVE_RANKING=false plus SPECKIT_HYDRA_ADAPTIVE_RANKING=true and still reports capabilities.adaptiveRanking:false because the canonical key wins. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `cd .opencode/skill/system-spec-kit/mcp_server` 2) `SPECKIT_GRAPH_UNIFIED=false node -e "const { getMemoryRoadmapDefaults } = require('./dist/lib/config/capability-flags.js'); console.log(JSON.stringify(getMemoryRoadmapDefaults('manual-125-a')))"` 3) `SPECKIT_MEMORY_ROADMAP_PHASE=graph SPECKIT_MEMORY_GRAPH_UNIFIED=false node -e "const { getMemoryRoadmapDefaults } = require('./dist/lib/config/capability-flags.js'); console.log(JSON.stringify(getMemoryRoadmapDefaults('manual-125-b')))"` 4) `SPECKIT_MEMORY_ADAPTIVE_RANKING=true node -e "const { getMemoryRoadmapDefaults } = require('./dist/lib/config/capability-flags.js'); console.log(JSON.stringify(getMemoryRoadmapDefaults('manual-125-c')))"` 5) `SPECKIT_MEMORY_ADAPTIVE_RANKING=false SPECKIT_HYDRA_ADAPTIVE_RANKING=true node -e "const { getMemoryRoadmapDefaults } = require('./dist/lib/config/capability-flags.js'); console.log(JSON.stringify(getMemoryRoadmapDefaults('manual-125-d')))"` | First snapshot remains `phase:\"scope-governance\"` with `capabilities.graphUnified:true` and `capabilities.adaptiveRanking:false`; second snapshot reports `phase:\"graph\"` with `capabilities.graphUnified:false`; third snapshot reports `capabilities.adaptiveRanking:true`; fourth snapshot confirms canonical precedence by keeping `capabilities.adaptiveRanking:false` | Four JSON snapshots from the dist build | PASS if the runtime `SPECKIT_GRAPH_UNIFIED` flag does not flip roadmap metadata, adaptive ranking stays off by default in roadmap snapshots, canonical env vars override legacy aliases, and explicit opt-in behavior stays correct | Inspect `capability-flags.ts`; verify dist build is fresh; confirm only the listed env vars are set in each run |

---

## 4. SOURCE FILES

- Feature catalog: [19--feature-flag-reference/11-memory-roadmap-capability-flags.md](../../feature_catalog/19--feature-flag-reference/11-memory-roadmap-capability-flags.md)

### Playbook Sources

| File | Role |
|---|---|
| [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md) | Root directory page and scenario summary |
| [19--feature-flag-reference/11-memory-roadmap-capability-flags.md](../../feature_catalog/19--feature-flag-reference/11-memory-roadmap-capability-flags.md) | Feature-catalog source describing the roadmap-flag contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `mcp_server/lib/config/capability-flags.ts` | Runtime roadmap-default and canonical-plus-legacy resolver behavior |
| `mcp_server/tests/feature-flag-reference-docs.vitest.ts` | Regression check that keeps root summary and feature-file detail aligned |

---

## 5. SOURCE METADATA

- Group: Feature Flag Reference
- Playbook ID: 125
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `19--feature-flag-reference/125-hydra-roadmap-capability-flags.md`
