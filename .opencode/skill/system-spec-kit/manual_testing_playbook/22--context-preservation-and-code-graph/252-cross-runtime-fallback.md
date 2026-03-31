---
title: "252 -- Tool-based recovery on non-hook runtimes"
description: "This scenario validates Cross-runtime fallback for 252. It focuses on Runtime detection and tool-based fallback for Codex/Copilot/Gemini."
---

# 252 -- Tool-based recovery on non-hook runtimes

## 1. OVERVIEW

This scenario validates Cross-runtime fallback.

---

## 2. CURRENT REALITY

- Objective: Runtime detection and tool-based fallback for Codex/Copilot/Gemini
- Prompt: `Validate 252 Cross-runtime fallback behavior. Capture evidence for: Each runtime detected correctly, hookPolicy matches. Return pass/fail verdict.`
- Expected signals: Each runtime detected correctly, hookPolicy matches
- Pass/fail: PASS if all expected signals observed

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 252 | Cross-runtime fallback | Runtime detection and tool-based fallback for Codex/Copilot/Gemini | `Validate 252 Cross-runtime fallback` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/runtime-detection.vitest.ts` | Each runtime detected correctly, hookPolicy matches | Test transcript + output snippets | PASS if all signals observed | Check source files and test fixtures |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/05-cross-runtime-fallback.md](../../feature_catalog/22--context-preservation-and-code-graph/05-cross-runtime-fallback.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 252
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/252-cross-runtime-fallback.md`
