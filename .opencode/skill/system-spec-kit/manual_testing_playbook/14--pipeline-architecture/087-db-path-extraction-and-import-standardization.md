---
title: "087 -- DB_PATH extraction and import standardization"
description: "This scenario validates DB_PATH extraction and import standardization for `087`. It focuses on Confirm shared DB path resolution."
audited_post_018: true
---

# 087 -- DB_PATH extraction and import standardization

## 1. OVERVIEW

This scenario validates DB_PATH extraction and import standardization for `087`. It focuses on Confirm shared DB path resolution.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `087` and confirm the expected signals without contradicting evidence.

- Objective: Confirm shared DB path resolution
- Prompt: `As a pipeline validation operator, validate DB_PATH extraction and import standardization against the documented validation surface. Verify all scripts/tools resolve to the same DB path for identical env vars; precedence chain is respected; no hardcoded fallbacks diverge. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: All scripts/tools resolve to the same DB path for identical env vars; precedence chain is respected; no hardcoded fallbacks diverge
- Pass/fail: PASS if all entry points resolve the same DB path and env var precedence is consistent across scripts/tools

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 087 | DB_PATH extraction and import standardization | Confirm shared DB path resolution | `As a pipeline validation operator, confirm shared DB path resolution against the documented validation surface. Verify all scripts/tools resolve to the same DB path for identical env vars; precedence chain is respected; no hardcoded fallbacks diverge. Return a concise pass/fail verdict with the main reason and cited evidence.` | 1) vary DB env vars 2) run scripts/tools 3) confirm shared resolver output | All scripts/tools resolve to the same DB path for identical env vars; precedence chain is respected; no hardcoded fallbacks diverge | DB path resolver output from multiple scripts + env var configuration evidence | PASS if all entry points resolve the same DB path and env var precedence is consistent across scripts/tools | Verify shared resolver module is imported by all consumers; check env var precedence order; inspect for hardcoded path fallbacks |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md](../../feature_catalog/14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 087
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `14--pipeline-architecture/087-db-path-extraction-and-import-standardization.md`
