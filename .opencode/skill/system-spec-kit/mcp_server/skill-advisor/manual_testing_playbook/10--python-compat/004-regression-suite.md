---
title: "PC-004 Python Regression Suite 52/52"
description: "Manual validation that scripts/skill_advisor_regression.py runs the 52-case P0 regression suite to completion and reports 52/52 passes."
trigger_phrases:
  - "pc-004"
  - "python regression suite"
  - "52 of 52 pass"
  - "skill_advisor_regression.py"
---

# PC-004 Python Regression Suite 52/52

## TABLE OF CONTENTS

- [1. SCENARIO](#1--scenario)
- [2. SETUP](#2--setup)
- [3. STEPS](#3--steps)
- [4. EXPECTED](#4--expected)
- [5. FAILURE MODES](#5--failure-modes)
- [6. RELATED](#6--related)

---

## 1. SCENARIO

Validate that `scripts/skill_advisor_regression.py` runs the P0 regression dataset at `scripts/fixtures/skill_advisor_regression_cases.jsonl` and reports 52 of 52 cases passing against the Python scorer.

---

## 2. SETUP

- Repo root; Python 3 available.
- MCP server built so the shim has a native option to delegate to where relevant.
- Regression dataset present at the fixture path.

---

## 3. STEPS

1. Run the suite:

```bash
python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_regression.py \
  --dataset .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl
```

2. Capture stdout and exit code.
3. Inspect per-case results for any FAIL entry.
4. Confirm the summary line reports `52/52` or the current documented total.

---

## 4. EXPECTED

- Exit code is 0.
- Summary reports all cases passing (current baseline 52/52).
- No case is marked SKIP without an explicit reason.
- No prompt text is written to logs beyond what the dataset already contains.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Fewer than 52 cases | Dataset loaded partial | Verify JSONL integrity. |
| Regressions reported | One or more cases FAIL | Triage per case; block release until resolved. |
| Non-zero exit but zero failures | Suite exits abnormally | Inspect runner and post-run hooks. |

---

## 6. RELATED

- Scenario [PC-005](./005-bench-runner.md) — bench runner.
- Scenario [NC-003](../01--native-mcp-tools/003-native-validate-slices.md) — native validate.
- Feature [`08--python-compat/02-regression-suite.md`](../../feature_catalog/08--python-compat/02-regression-suite.md).
- Source: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_regression.py` and `scripts/fixtures/skill_advisor_regression_cases.jsonl`.
