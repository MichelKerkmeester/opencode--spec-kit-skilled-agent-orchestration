---
title: "205 -- 7-layer tool architecture metadata"
description: "This scenario validates 7-layer tool architecture metadata for `205`. It focuses on verifying that the seven layers act as governance metadata with budgets and recommendations, not as a separate runtime dispatch router."
---

# 205 -- 7-layer tool architecture metadata

## 1. OVERVIEW

This scenario validates 7-layer tool architecture metadata for `205`. It focuses on verifying that the seven layers act as governance metadata with budgets and recommendations, not as a separate runtime dispatch router.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `205` and confirm the expected signals without contradicting evidence.

- Objective: Verify the 7-layer model supplies advisory budgets and layer recommendations while runtime dispatch still routes tools by name through the existing dispatcher modules
- Prompt: `Validate the 7-layer tool architecture metadata. Capture the evidence needed to prove the layer definitions module enumerates L1-L7 budgets, priorities, use-case guidance, and tool memberships; layer IDs still map to task types for recommendation metadata; runtime dispatch remains a name-based hop rather than a seven-layer router; and recommended layer hints surface without changing the underlying dispatch path. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: L1-L7 metadata includes budgets/priorities/guidance/tool membership; task-type mappings remain available for recommendations; runtime dispatch is still name-based and fans into the existing dispatcher modules; recommended-layer metadata is advisory rather than a routing prerequisite
- Pass/fail: PASS if the layer model behaves as governance metadata and dispatch remains name-based; FAIL if runtime behavior depends on a missing seven-layer router or if metadata/recommendation claims do not match the actual dispatch implementation

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 205 | 7-layer tool architecture metadata | Verify the 7-layer model supplies advisory budgets and layer recommendations while runtime dispatch still routes tools by name through the existing dispatcher modules | `Validate the 7-layer tool architecture metadata. Capture the evidence needed to prove the layer definitions module enumerates L1-L7 budgets, priorities, use-case guidance, and tool memberships; layer IDs still map to task types for recommendation metadata; runtime dispatch remains a name-based hop rather than a seven-layer router; and recommended layer hints surface without changing the underlying dispatch path. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Review the layer-definitions module and confirm all seven layers expose token budgets, priorities, guidance, and tool membership metadata 2) Verify layer IDs still map to task-type recommendation hints 3) Trace a representative tool invocation through the runtime entrypoint and confirm dispatch occurs by tool name into the existing dispatcher modules 4) Exercise or inspect one response path that surfaces recommended-layer metadata 5) Confirm that changing or reading layer metadata does not alter the fundamental name-based dispatch hop | L1-L7 metadata includes budgets/priorities/guidance/tool membership; task-type mappings remain available for recommendations; runtime dispatch is still name-based and fans into the existing dispatcher modules; recommended-layer metadata is advisory rather than a routing prerequisite | Layer-definition snapshot + dispatch trace + recommended-layer output example + comparison showing runtime path remains name-based | PASS if the layer model behaves as governance metadata and dispatch remains name-based; FAIL if runtime behavior depends on a missing seven-layer router or if metadata/recommendation claims do not match the actual dispatch implementation | Inspect `layer-definitions.ts` completeness; verify `context-server.ts` dispatch entrypoint and budget injection; review `tools/index.ts` fan-out modules; confirm handler metadata does not masquerade as an execution router |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [14--pipeline-architecture/20-7-layer-tool-architecture-metadata.md](../../feature_catalog/14--pipeline-architecture/20-7-layer-tool-architecture-metadata.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 205
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `14--pipeline-architecture/205-7-layer-tool-architecture-metadata.md`
