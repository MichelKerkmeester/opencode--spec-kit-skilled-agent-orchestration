---
title: "185 -- /memory:search command routing"
description: "This scenario validates /memory:search command routing for `185`. It focuses on Verify the command's routing logic: no args prompts intent, query triggers retrieval mode, and analysis subcommands route correctly."
---

# 185 -- /memory:search command routing

## 1. OVERVIEW

This scenario validates /memory:search command routing for `185`. It focuses on Verify the command's routing logic: no args prompts intent, query triggers retrieval mode, and analysis subcommands route correctly.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `185` and confirm the expected signals without contradicting evidence.

- Objective: Verify `/memory:search` command routing logic covers no-args interactive prompt, query-based retrieval mode with intent detection, and all analysis subcommands (preflight, postflight, history, causal, link, unlink, causal-stats, ablation, dashboard)
- Prompt: `Validate /memory:search command routing across retrieval and analysis modes. Capture the evidence needed to prove No-args triggers interactive intent prompt; query text triggers retrieval mode with auto-detected intent and weighted anchors; analysis subcommands route to their respective tools. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: No-args triggers interactive intent prompt; query text triggers retrieval mode with intent detection; analysis subcommands (preflight, postflight, history, causal, link, unlink, causal-stats, ablation, dashboard) each route to the correct tool
- Pass/fail: PASS: No-args prompts for intent, retrieval returns intent-weighted results, each analysis subcommand invokes its dedicated tool; FAIL: No-args proceeds without prompt, retrieval ignores intent, or an analysis subcommand routes to the wrong tool

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 185 | /memory:search command routing | Verify `/memory:search` command routing logic covers no-args, retrieval, and analysis modes | `Validate /memory:search command routing across retrieval and analysis modes. Capture the evidence needed to prove No-args triggers interactive intent prompt; query text triggers retrieval mode with auto-detected intent and weighted anchors; analysis subcommands route to their respective tools. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Invoke `/memory:search` with no arguments and verify the interactive intent selection prompt appears (Add feature, Fix bug, Refactor, Security audit, Understand, Find spec, Find decision, Analysis tools) 2) Invoke `/memory:search "implement auth"` and verify retrieval mode activates with auto-detected `add_feature` intent and appropriate weight boosts (implementation 1.5x, architecture 1.3x, patterns 1.2x) 3) Invoke `/memory:search "auth bug" --intent:fix_bug` and verify the explicit intent override is respected 4) Invoke `/memory:search preflight specs/007-test T1` and verify `task_preflight()` is called 5) Invoke `/memory:search postflight specs/007-test T1` and verify `task_postflight()` is called 6) Invoke `/memory:search history specs/007-test` and verify `memory_get_learning_history()` is called 7) Invoke `/memory:search causal 42` and verify `memory_drift_why()` is called 8) Invoke `/memory:search ablation` and verify `eval_run_ablation()` is called 9) Invoke `/memory:search dashboard` and verify `eval_reporting_dashboard()` is called | No-args triggers interactive intent prompt; query text triggers retrieval mode with intent detection; analysis subcommands each route to the correct tool | Tool invocation logs for each subcommand; intent detection output for retrieval queries; interactive prompt display for no-args case | PASS: No-args prompts for intent, retrieval returns intent-weighted results, each analysis subcommand invokes its dedicated tool; FAIL: No-args proceeds without prompt, retrieval ignores intent, or an analysis subcommand routes to the wrong tool | Verify argument routing logic in Section 4 of search.md → Check intent detection keywords → Confirm analysis subcommand first-token matching → Inspect tool coverage matrix for correct tool-to-subcommand mapping |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [01--retrieval/01-unified-context-retrieval-memorycontext.md](../../feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md)
- Command file: [.opencode/command/memory/search.md](../../../../command/memory/search.md)

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: 185
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--retrieval/185-memory-search-command-routing.md`
