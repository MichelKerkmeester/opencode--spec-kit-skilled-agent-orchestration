---
title: "102 -- node-llama-cpp optionalDependencies"
description: "This scenario validates node-llama-cpp optionalDependencies for `102`. It focuses on Confirm install succeeds without native build tools."
audited_post_018: true
---

# 102 -- node-llama-cpp optionalDependencies

## 1. OVERVIEW

This scenario validates node-llama-cpp optionalDependencies for `102`. It focuses on Confirm install succeeds without native build tools.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `102` and confirm the expected signals without contradicting evidence.

- Objective: Confirm install succeeds without native build tools
- Prompt: `As a scoring validation operator, validate node-llama-cpp optionalDependencies against mcp_server/package.json. Verify node-llama-cpp listed in optionalDependencies (not dependencies); npm install completes without error on clean env; dynamic import with graceful fallback when module absent. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: node-llama-cpp listed in optionalDependencies (not dependencies); npm install completes without error on clean env; dynamic import with graceful fallback when module absent
- Pass/fail: PASS if install succeeds and reranker gracefully falls back when module missing

---

## 3. TEST EXECUTION

### Prompt

```
As a scoring validation operator, confirm install succeeds without native build tools against mcp_server/package.json. Verify node-llama-cpp listed in optionalDependencies (not dependencies); npm install completes without error on clean env; dynamic import with graceful fallback when module absent. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. inspect `mcp_server/package.json` → verify `node-llama-cpp` is in `optionalDependencies` not `dependencies`
2. run `npm install` on a clean environment without C++ build tools → verify install completes without error
3. verify `local-reranker.ts` uses dynamic `import()` and gracefully degrades when module is absent

### Expected

node-llama-cpp listed in optionalDependencies (not dependencies); npm install completes without error on clean env; dynamic import with graceful fallback when module absent

### Evidence

package.json content + install output

### Pass / Fail

- **Pass**: install succeeds and reranker gracefully falls back when module missing
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check `package.json` optionalDependencies section

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: *(node-llama-cpp optionalDependencies — covered by `11--scoring-and-calibration/14`)*

---

## 5. SOURCE METADATA

- Group: Scoring and Calibration
- Playbook ID: 102
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `11--scoring-and-calibration/102-node-llama-cpp-optionaldependencies.md`
