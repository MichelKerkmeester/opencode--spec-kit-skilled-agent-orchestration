---
title: "135 -- Grep traceability for feature catalog code references"
description: "This scenario validates Grep traceability for feature catalog code references for `135`. It focuses on Verify `grep -r \"// Feature catalog: <feature>\" mcp_server/` returns handler + lib hits."
---

# 135 -- Grep traceability for feature catalog code references

## 1. OVERVIEW

This scenario validates Grep traceability for feature catalog code references for `135`. It focuses on Verify `grep -r "// Feature catalog: <feature>" mcp_server/` returns handler + lib hits.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `135` and confirm the expected signals without contradicting evidence.

- Objective: Verify `grep -r "// Feature catalog: <feature>" mcp_server/` returns handler + lib hits
- Prompt: `As a tooling validation operator, validate Grep traceability for feature catalog code references against grep -r "// Feature catalog: <feature>" .opencode/skill/system-spec-kit/mcp_server/. Verify grep -r "// Feature catalog: <feature>" mcp_server/ returns handler + lib hits. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Each feature grep returns at least 2 hits spanning handlers and lib layers; all referenced files exist
- Pass/fail: PASS if all 3 features return multi-layer hits with no orphaned file references

---

## 3. TEST EXECUTION

### Prompt

```
As a tooling validation operator, verify grep -r "// Feature catalog: <feature>" mcp_server/ returns handler + lib hits against grep -r "// Feature catalog: <feature>" .opencode/skill/system-spec-kit/mcp_server/. Verify each feature grep returns at least 2 hits spanning handlers and lib layers; all referenced files exist. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Pick 3 features with known multi-layer implementations (e.g., "Hybrid search pipeline", "Classification-based decay", "Prediction-error save arbitration")
2. For each: `grep -r "// Feature catalog: <feature>" .opencode/skill/system-spec-kit/mcp_server/`
3. Verify each grep returns hits in both `handlers/` and `lib/` directories
4. Verify all returned files exist and contain the annotation

### Expected

Each feature grep returns at least 2 hits spanning handlers and lib layers; all referenced files exist

### Evidence

Grep output for 3 features showing file paths and line numbers

### Pass / Fail

- **Pass**: all 3 features return multi-layer hits with no orphaned file references
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Check annotation placement after MODULE: header → Verify feature name spelling matches catalog H3 heading exactly

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/11-feature-catalog-code-references.md](../../feature_catalog/16--tooling-and-scripts/11-feature-catalog-code-references.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 135
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/135-grep-traceability-for-feature-catalog-code-references.md`
