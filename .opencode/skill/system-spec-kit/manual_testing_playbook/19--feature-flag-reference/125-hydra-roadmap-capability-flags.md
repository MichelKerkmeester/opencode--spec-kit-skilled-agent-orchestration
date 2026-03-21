---
title: "125: Hydra roadmap capability flags"
description: "Manual-testing reference for validating that prefixed Hydra roadmap flags remain default-on unless explicitly opted out, without changing the live runtime flag contract."
---

# 125: Hydra roadmap capability flags

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for the 125 Hydra roadmap capability flags scenario.

---

## 1. OVERVIEW

This scenario validates Hydra roadmap capability flags for `125`. It focuses on Verify prefixed Hydra roadmap flags stay distinct from live runtime flags while remaining default-on unless explicitly opted out.

### Why This Matters

A real user does not ask for raw environment-variable proofs. They ask the orchestrator to explain or validate rollout behavior without accidentally mutating the wrong runtime defaults. This scenario tests whether the orchestrator can convert that request into the correct local verification flow and return a clear, trustworthy conclusion.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `125` and confirm the expected signals without contradicting evidence.

- Objective: Verify prefixed Hydra roadmap flags stay distinct from live runtime flags while remaining default-on unless explicitly opted out
- Real user request: `Check whether the Hydra roadmap flags are still default-on by default, and prove that opting out with the prefixed flags does not accidentally change the live runtime defaults.`
- Orchestrator prompt: `Validate memory roadmap flag snapshots without changing live graph-channel defaults. Work locally in the system-spec-kit mcp_server package, capture the exact commands and outputs, and summarize the result in user language. Capture the evidence needed to prove First snapshot remains phase:"shared-rollout" with capabilities.graphUnified:true; second snapshot reports phase:"graph" with capabilities.graphUnified:false. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected process: Keep execution local because the answer depends on immediate runtime inspection; do not delegate the critical verification step. Run the two snapshots, compare roadmap metadata, and explain why the first run proves default-on behavior while the second proves explicit opt-out behavior.
- Expected signals: First snapshot remains `phase:\"shared-rollout\"` with `capabilities.graphUnified:true`; second snapshot reports `phase:\"graph\"` with `capabilities.graphUnified:false`
- Desired user-visible outcome: The final response explains that roadmap defaults remain default-on unless explicitly opted out, and that the prefixed Hydra flags affect roadmap metadata without silently flipping the live runtime flag contract.
- Pass/fail: PASS if the runtime `SPECKIT_GRAPH_UNIFIED` flag does not flip roadmap metadata and the prefixed Hydra compatibility flag can explicitly opt out of the roadmap snapshot

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in rollout-language, not just environment-variable language.
2. Choose local execution over delegation because the test is blocked on immediate runtime output.
3. Run the two deterministic snapshots exactly as written.
4. Compare the outputs and explicitly map them back to the user-facing conclusion.
5. Return a short final answer that distinguishes default-on roadmap behavior from explicit prefixed opt-out behavior.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 125 | Hydra roadmap capability flags | Verify prefixed Hydra roadmap flags stay distinct from live runtime flags while remaining default-on unless explicitly opted out | `Validate memory roadmap flag snapshots without changing live graph-channel defaults. Work locally in the system-spec-kit mcp_server package, capture the exact commands and outputs, and summarize the result in user language. Capture the evidence needed to prove First snapshot remains phase:"shared-rollout" with capabilities.graphUnified:true; second snapshot reports phase:"graph" with capabilities.graphUnified:false. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `cd .opencode/skill/system-spec-kit/mcp_server` 2) `SPECKIT_GRAPH_UNIFIED=false node -e "const { getMemoryRoadmapDefaults } = require('./dist/lib/config/capability-flags.js'); console.log(JSON.stringify(getMemoryRoadmapDefaults('manual-125-a')))"` 3) `SPECKIT_HYDRA_PHASE=graph SPECKIT_HYDRA_GRAPH_UNIFIED=false node -e "const { getMemoryRoadmapDefaults } = require('./dist/lib/config/capability-flags.js'); console.log(JSON.stringify(getMemoryRoadmapDefaults('manual-125-b')))"` | First snapshot remains `phase:\"shared-rollout\"` with `capabilities.graphUnified:true`; second snapshot reports `phase:\"graph\"` with `capabilities.graphUnified:false` | Two JSON snapshots from the dist build | PASS if the runtime `SPECKIT_GRAPH_UNIFIED` flag does not flip roadmap metadata and the prefixed Hydra compatibility flag can explicitly opt out of the roadmap snapshot | Inspect `capability-flags.ts`; verify dist build is fresh; confirm only `SPECKIT_HYDRA_*` env vars are set in the second run |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual_testing_playbook.md](../manual_testing_playbook.md) | Root directory page and scenario summary |
| [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../../feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md) | Feature-catalog source describing the roadmap-flag contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `mcp_server/lib/config/capability-flags.ts` | Runtime roadmap-default and prefixed-flag behavior |
| `mcp_server/tests/feature-flag-reference-docs.vitest.ts` | Regression check that keeps root summary and feature-file detail aligned |

---

## 5. SOURCE METADATA

- Group: Feature Flag Reference
- Playbook ID: 125
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `19--feature-flag-reference/125-hydra-roadmap-capability-flags.md`
