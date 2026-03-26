---
title: "247 -- Memory Quality KPI Reporting"
description: "This scenario validates memory quality KPI reporting for `247`. It focuses on confirming global and scoped scans, JSON output, and the stderr summary line."
---

# 247 -- Memory Quality KPI Reporting

## 1. OVERVIEW

This scenario validates memory quality KPI reporting for `247`. It focuses on confirming global and scoped scans, JSON output, and the stderr summary line.

---

## 2. CURRENT REALITY

Operators verify that the KPI reporter can scan the full active specs tree or one scoped spec path, always prints structured JSON to stdout, and emits the compact operator summary to stderr without converting defect findings into hard failures.

- Objective: Confirm global and scoped KPI scans, JSON output, and stderr summary behavior
- Prompt: `Validate the memory quality KPI reporting surface. Capture the evidence needed to prove quality-kpi.sh scans the full active specs tree and a scoped spec folder, prints JSON to stdout, emits the KPI Summary line to stderr, and leaves the run successful even when defect rates are non-zero. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: full and scoped scans both emit JSON; stderr summary line is present; scoped output contains `scope`; command exits 0
- Pass/fail: PASS if both scan modes produce structured output and the summary line matches the documented contract

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 247 | Memory Quality KPI Reporting | Confirm global and scoped KPI scans, JSON output, and stderr summary behavior | `Validate the memory quality KPI reporting surface. Capture the evidence needed to prove quality-kpi.sh scans the full active specs tree and a scoped spec folder, prints JSON to stdout, emits the KPI Summary line to stderr, and leaves the run successful even when defect rates are non-zero. Return a concise user-facing pass/fail verdict with the main reason.` | 1) `bash .opencode/skill/system-spec-kit/scripts/kpi/quality-kpi.sh` 2) `bash .opencode/skill/system-spec-kit/scripts/kpi/quality-kpi.sh 02--system-spec-kit/022-hybrid-rag-fusion` 3) `bash .opencode/skill/system-spec-kit/scripts/kpi/quality-kpi.sh 02--system-spec-kit/022-hybrid-rag-fusion > /tmp/quality-kpi.json` 4) `node -e "const fs=require('fs'); const data=JSON.parse(fs.readFileSync('/tmp/quality-kpi.json','utf8')); console.log(data.scope, data.totalFiles, data.rates.emptyTriggerPhrasesRate)"` | Both commands emit JSON; stderr includes `KPI Summary:`; scoped run preserves the requested scope and exits 0 | Full-run transcript, scoped-run transcript, and parsed `/tmp/quality-kpi.json` output | PASS if the script returns JSON plus the stderr summary for both modes and the scoped JSON reflects the requested spec path | Inspect `scripts/kpi/quality-kpi.sh`, markdown traversal logic, and trigger-phrase counting if scope handling or JSON generation is wrong |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/33-memory-quality-kpi-reporting.md](../../feature_catalog/16--tooling-and-scripts/33-memory-quality-kpi-reporting.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 247
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/247-memory-quality-kpi-reporting.md`
