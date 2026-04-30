---
title: "125: Memory roadmap capability flags"
description: "Manual-testing reference for validating the live memory roadmap capability resolvers."
audited_post_018: true
phase_018_change: updated to use the dedicated roadmap-capability catalog reference and corrected the snapshot count
---

# 125: Memory roadmap capability flags

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for the 125 memory roadmap capability flags scenario.

---

## 1. OVERVIEW

This scenario validates memory roadmap capability flags for `125`. It focuses on verifying that the runtime resolvers use the canonical `SPECKIT_MEMORY_*` keys, keep roadmap metadata distinct from live runtime graph flags, and leave adaptive-ranking roadmap defaults off until explicitly enabled.

### Why This Matters

A real user does not ask for raw environment-variable proofs. They ask the orchestrator to explain or validate rollout behavior without accidentally mutating the wrong runtime defaults. This scenario tests whether the orchestrator can convert that request into the correct local verification flow and return a clear, trustworthy conclusion.

---

## 2. SCENARIO CONTRACT


- Objective: Verify runtime roadmap resolvers use the canonical `SPECKIT_MEMORY_*` keys, remain distinct from live runtime flags, and keep adaptive-ranking defaults off until explicitly enabled.
- Real user request: `Check whether the spec-doc record roadmap flags still stay separate from live runtime defaults, prove that adaptive ranking stays off by default in roadmap snapshots, and show that the canonical SPECKIT_MEMORY_* flags behave correctly when toggled.`
- RCAF Prompt: `As a feature-flag validation operator, verify runtime roadmap resolvers use the canonical SPECKIT_MEMORY_* keys, remain distinct from live runtime flags, and keep adaptive-ranking defaults off until explicitly enabled against cd .opencode/skill/system-spec-kit/mcp_server. Verify first snapshot remains phase:\"scope-governance\" with capabilities.graphUnified:true and capabilities.adaptiveRanking:false; second snapshot reports phase:\"graph\" with capabilities.graphUnified:false; third snapshot reports capabilities.adaptiveRanking:true; fourth snapshot confirms canonical opt-out by returning capabilities.adaptiveRanking:false. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: First snapshot remains `phase:\"scope-governance\"` with `capabilities.graphUnified:true` and `capabilities.adaptiveRanking:false`; second snapshot reports `phase:\"graph\"` with `capabilities.graphUnified:false`; third snapshot reports `capabilities.adaptiveRanking:true`; fourth snapshot reports `capabilities.adaptiveRanking:false` after the canonical opt-out
- Desired user-visible outcome: The final response explains that roadmap defaults still stay distinct from live runtime flags and adaptive ranking remains dormant by default until explicitly enabled.
- Pass/fail: PASS if the runtime `SPECKIT_GRAPH_UNIFIED` flag does not flip roadmap metadata, adaptive ranking stays off by default in roadmap snapshots, and explicit canonical env vars can opt roadmap capabilities in and out as expected

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in rollout-language, not just environment-variable language.
2. Choose local execution over delegation because the test is blocked on immediate runtime output.
3. Run the four deterministic snapshots exactly as written.
4. Compare the outputs and explicitly map them back to the user-facing conclusion.
5. Return a short final answer that distinguishes default-off roadmap behavior from explicit canonical opt-in behavior.

### Prompt

```
As a feature-flag validation operator, verify runtime roadmap resolvers use the canonical SPECKIT_MEMORY_* keys, remain distinct from live runtime flags, and keep adaptive-ranking defaults off until explicitly enabled against cd .opencode/skill/system-spec-kit/mcp_server. Verify first snapshot remains phase:\"scope-governance\" with capabilities.graphUnified:true and capabilities.adaptiveRanking:false; second snapshot reports phase:\"graph\" with capabilities.graphUnified:false; third snapshot reports capabilities.adaptiveRanking:true; fourth snapshot confirms canonical opt-out by returning capabilities.adaptiveRanking:false. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `cd .opencode/skill/system-spec-kit/mcp_server`
2. `SPECKIT_GRAPH_UNIFIED=false node -e "const { getMemoryRoadmapDefaults } = require('./dist/lib/config/capability-flags.js'); console.log(JSON.stringify(getMemoryRoadmapDefaults('manual-125-a')))"`
3. `SPECKIT_MEMORY_ROADMAP_PHASE=graph SPECKIT_MEMORY_GRAPH_UNIFIED=false node -e "const { getMemoryRoadmapDefaults } = require('./dist/lib/config/capability-flags.js'); console.log(JSON.stringify(getMemoryRoadmapDefaults('manual-125-b')))"`
4. `SPECKIT_MEMORY_ADAPTIVE_RANKING=true node -e "const { getMemoryRoadmapDefaults } = require('./dist/lib/config/capability-flags.js'); console.log(JSON.stringify(getMemoryRoadmapDefaults('manual-125-c')))"`
5. `SPECKIT_MEMORY_ADAPTIVE_RANKING=false node -e "const { getMemoryRoadmapDefaults } = require('./dist/lib/config/capability-flags.js'); console.log(JSON.stringify(getMemoryRoadmapDefaults('manual-125-d')))"`

### Expected

First snapshot remains `phase:\"scope-governance\"` with `capabilities.graphUnified:true` and `capabilities.adaptiveRanking:false`; second snapshot reports `phase:\"graph\"` with `capabilities.graphUnified:false`; third snapshot reports `capabilities.adaptiveRanking:true`; fourth snapshot confirms canonical opt-out by returning `capabilities.adaptiveRanking:false`

### Evidence

Four JSON snapshots from the dist build

### Pass / Fail

- **Pass**: the runtime `SPECKIT_GRAPH_UNIFIED` flag does not flip roadmap metadata, adaptive ranking stays off by default in roadmap snapshots, and explicit opt-in/opt-out behavior stays correct
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `capability-flags.ts`; verify dist build is fresh; confirm only the listed env vars are set in each run

## 4. SOURCE FILES

- Feature catalog: [19--feature-flag-reference/11-memory-roadmap-capability-flags.md](../../feature_catalog/19--feature-flag-reference/11-memory-roadmap-capability-flags.md)

### Playbook Sources

| File | Role |
|---|---|
| [manual_testing_playbook.md](../manual_testing_playbook.md) | Root directory page and scenario summary |
| [19--feature-flag-reference/11-memory-roadmap-capability-flags.md](../../feature_catalog/19--feature-flag-reference/11-memory-roadmap-capability-flags.md) | Feature-catalog source describing the roadmap-flag contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `mcp_server/lib/config/capability-flags.ts` | Runtime roadmap-default resolver behavior |
| `mcp_server/tests/feature-flag-reference-docs.vitest.ts` | Regression check that keeps root summary and feature-file detail aligned |

---

## 5. SOURCE METADATA

- Group: Feature Flag Reference
- Playbook ID: 125
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `19--feature-flag-reference/125-memory-roadmap-capability-flags.md`
