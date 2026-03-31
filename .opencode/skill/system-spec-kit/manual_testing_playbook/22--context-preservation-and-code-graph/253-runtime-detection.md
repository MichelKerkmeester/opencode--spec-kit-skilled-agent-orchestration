---
title: "253 -- Runtime detection outputs"
description: "This scenario validates Runtime detection for 253. It focuses on runtime + hookPolicy for all 4 runtimes."
---

# 253 -- Runtime detection outputs

## 1. OVERVIEW

This scenario validates Runtime detection.

---

## 2. CURRENT REALITY

- Objective: runtime + hookPolicy for all 4 runtimes
- Prompt: `Validate 253 Runtime detection behavior. Capture evidence for: claude-code=enabled, codex=unavailable, copilot/gemini=disabled_by_scope. Return pass/fail verdict.`
- Expected signals: claude-code=enabled, codex=unavailable, copilot/gemini=disabled_by_scope
- Pass/fail: PASS if all expected signals observed

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 253 | Runtime detection | runtime + hookPolicy for all 4 runtimes | `Validate 253 Runtime detection` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/runtime-detection.vitest.ts` | claude-code=enabled, codex=unavailable, copilot/gemini=disabled_by_scope | Test transcript + output snippets | PASS if all signals observed | Check source files and test fixtures |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/06-runtime-detection.md](../../feature_catalog/22--context-preservation-and-code-graph/06-runtime-detection.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 253
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/253-runtime-detection.md`
