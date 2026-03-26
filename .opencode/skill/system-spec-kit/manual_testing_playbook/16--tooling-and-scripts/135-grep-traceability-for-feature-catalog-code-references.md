---
title: "135 -- Grep traceability for feature catalog code references"
description: "This scenario validates Grep traceability for feature catalog code references for `135`. It focuses on Verify `grep -r \"// Feature catalog: <feature>\" mcp_server/` returns handler + lib hits."
---

# 135 -- Grep traceability for feature catalog code references

## 1. OVERVIEW

This scenario validates Grep traceability for feature catalog code references for `135`. It focuses on Verify `grep -r "// Feature catalog: <feature>" mcp_server/` returns handler + lib hits.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `135` and confirm the expected signals without contradicting evidence.

- Objective: Verify `grep -r "// Feature catalog: <feature>" mcp_server/` returns handler + lib hits
- Prompt: `Validate feature catalog grep traceability. Capture the evidence needed to prove Each feature grep returns at least 2 hits spanning handlers and lib layers; all referenced files exist. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Each feature grep returns at least 2 hits spanning handlers and lib layers; all referenced files exist
- Pass/fail: PASS if all 3 features return multi-layer hits with no orphaned file references

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 135 | Grep traceability for feature catalog code references | Verify `grep -r "// Feature catalog: <feature>" mcp_server/` returns handler + lib hits | `Validate feature catalog grep traceability. Capture the evidence needed to prove Each feature grep returns at least 2 hits spanning handlers and lib layers; all referenced files exist. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Pick 3 features with known multi-layer implementations (e.g., "Hybrid search pipeline", "Classification-based decay", "Prediction-error save arbitration") 2) For each: `grep -r "// Feature catalog: <feature>" .opencode/skill/system-spec-kit/mcp_server/` 3) Verify each grep returns hits in both `handlers/` and `lib/` directories 4) Verify all returned files exist and contain the annotation | Each feature grep returns at least 2 hits spanning handlers and lib layers; all referenced files exist | Grep output for 3 features showing file paths and line numbers | PASS if all 3 features return multi-layer hits with no orphaned file references | Check annotation placement after MODULE: header → Verify feature name spelling matches catalog H3 heading exactly |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/11-feature-catalog-code-references.md](../../feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-references.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 135
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/135-grep-traceability-for-feature-catalog-code-references.md`
