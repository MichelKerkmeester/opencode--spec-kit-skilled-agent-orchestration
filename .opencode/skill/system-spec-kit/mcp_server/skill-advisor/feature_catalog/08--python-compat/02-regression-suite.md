---
title: "Python Regression Suite (52/52)"
description: "skill_advisor_regression.py harness that runs the P0 regression dataset and reports 52 of 52 cases passing."
trigger_phrases:
  - "python regression suite"
  - "52 of 52 pass"
  - "skill_advisor_regression.py"
  - "p0 regression dataset"
---

# Python Regression Suite (52/52)

## TABLE OF CONTENTS

- [1. PURPOSE](#1--purpose)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. TEST COVERAGE](#4--test-coverage)
- [5. RELATED](#5--related)

---

## 1. PURPOSE

Guarantee the Python compatibility surface does not regress on hand-curated P0 cases that have been stable since pre-027.

---

## 2. CURRENT REALITY

`scripts/skill_advisor_regression.py` reads the JSONL dataset at `scripts/fixtures/skill_advisor_regression_cases.jsonl` and exercises the Python scorer against each case. The current baseline is 52 of 52 cases passing with zero regressions under the ADR-007 parity rules. Exit code is 0 only when every case passes.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_regression.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/` — Python/TS parity harness consuming the same corpus.
- Playbook scenario [PC-004](../../manual_testing_playbook/10--python-compat/004-regression-suite.md).

---

## 5. RELATED

- [01-cli-shim.md](./01-cli-shim.md).
- [03-bench-runner.md](./03-bench-runner.md).
- [`06--mcp-surface/03-advisor-validate.md`](../06--mcp-surface/03-advisor-validate.md).
