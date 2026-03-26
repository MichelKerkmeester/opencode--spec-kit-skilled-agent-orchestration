---
title: "102 -- node-llama-cpp optionalDependencies"
description: "This scenario validates node-llama-cpp optionalDependencies for `102`. It focuses on Confirm install succeeds without native build tools."
---

# 102 -- node-llama-cpp optionalDependencies

## 1. OVERVIEW

This scenario validates node-llama-cpp optionalDependencies for `102`. It focuses on Confirm install succeeds without native build tools.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `102` and confirm the expected signals without contradicting evidence.

- Objective: Confirm install succeeds without native build tools
- Prompt: `Validate node-llama-cpp as optionalDependency. Capture the evidence needed to prove node-llama-cpp listed in optionalDependencies (not dependencies); npm install completes without error on clean env; dynamic import with graceful fallback when module absent. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: node-llama-cpp listed in optionalDependencies (not dependencies); npm install completes without error on clean env; dynamic import with graceful fallback when module absent
- Pass/fail: PASS if install succeeds and reranker gracefully falls back when module missing

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 102 | node-llama-cpp optionalDependencies | Confirm install succeeds without native build tools | `Validate node-llama-cpp as optionalDependency. Capture the evidence needed to prove node-llama-cpp listed in optionalDependencies (not dependencies); npm install completes without error on clean env; dynamic import with graceful fallback when module absent. Return a concise user-facing pass/fail verdict with the main reason.` | 1) inspect `mcp_server/package.json` → verify `node-llama-cpp` is in `optionalDependencies` not `dependencies` 2) run `npm install` on a clean environment without C++ build tools → verify install completes without error 3) verify `local-reranker.ts` uses dynamic `import()` and gracefully degrades when module is absent | node-llama-cpp listed in optionalDependencies (not dependencies); npm install completes without error on clean env; dynamic import with graceful fallback when module absent | package.json content + install output | PASS if install succeeds and reranker gracefully falls back when module missing | Check `package.json` optionalDependencies section |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: *(node-llama-cpp optionalDependencies — covered by `11--scoring-and-calibration/14`)*

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 102
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `11--scoring-and-calibration/102-node-llama-cpp-optionaldependencies.md`
