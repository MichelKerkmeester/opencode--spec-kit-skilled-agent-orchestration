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

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Guarantee the Python compatibility surface does not regress on hand-curated P0 cases that have been stable since pre-027.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`scripts/skill_advisor_regression.py` reads the JSONL dataset at `scripts/fixtures/skill_advisor_regression_cases.jsonl` and exercises the Python scorer against each case. The current baseline is 52 of 52 cases passing with zero regressions under the ADR-007 parity rules. Exit code is 0 only when every case passes.

<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor_regression.py` | Script | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` | Script | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/parity/` | Automated test | Python/TS parity harness consuming the same corpus |
| `Playbook scenario [PC-004](../../manual_testing_playbook/10--python-compat/004-regression-suite.md).` | Manual playbook | Source reference |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Python compat
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `08--python-compat/02-regression-suite.md`

Related references:

- [01-cli-shim.md](./01-cli-shim.md).
- [03-bench-runner.md](./03-bench-runner.md).
- [`06--mcp-surface/03-advisor-validate.md`](../06--mcp-surface/03-advisor-validate.md).
<!-- /ANCHOR:source-metadata -->
