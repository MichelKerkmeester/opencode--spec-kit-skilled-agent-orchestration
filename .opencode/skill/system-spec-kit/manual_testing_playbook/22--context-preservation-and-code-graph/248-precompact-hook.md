---
title: "248 -- PreCompact hook fires and caches context"
description: "This scenario validates PreCompact hook context caching for 248. It focuses on PreCompact hook precomputes context and caches to hook state."
---

# 248 -- PreCompact hook fires and caches context

## 1. OVERVIEW

This scenario validates PreCompact hook context caching.

---

## 2. CURRENT REALITY

- Objective: PreCompact hook precomputes context and caches to hook state
- Prompt: `Validate 248 PreCompact hook context caching behavior. Capture evidence for: All tests pass, cache payload stored in hook state. Return pass/fail verdict.`
- Expected signals: All tests pass, cache payload stored in hook state
- Pass/fail: PASS if all expected signals observed

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 248 | PreCompact hook context caching | PreCompact hook precomputes context and caches to hook state | `Validate 248 PreCompact hook context caching` | `cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/hook-precompact.vitest.ts` | All tests pass, cache payload stored in hook state | Test transcript + output snippets | PASS if all signals observed | Check source files and test fixtures |

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [22--context-preservation-and-code-graph/02-precompact-hook.md](../../feature_catalog/22--context-preservation-and-code-graph/02-precompact-hook.md)

---

## 5. SOURCE METADATA

- Group: Context Preservation and Code Graph
- Playbook ID: 248
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `22--context-preservation-and-code-graph/248-precompact-hook.md`
