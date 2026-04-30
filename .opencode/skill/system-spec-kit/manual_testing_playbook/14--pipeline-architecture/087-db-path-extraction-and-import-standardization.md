---
title: "087 -- DB_PATH extraction and import standardization"
description: "This scenario validates DB_PATH extraction and import standardization for `087`. It focuses on Confirm shared DB path resolution."
audited_post_018: true
---

# 087 -- DB_PATH extraction and import standardization

## 1. OVERVIEW

This scenario validates DB_PATH extraction and import standardization for `087`. It focuses on Confirm shared DB path resolution.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm shared DB path resolution.
- Real user request: `Please validate DB_PATH extraction and import standardization against the documented validation surface and tell me whether the expected signals are present: All scripts/tools resolve to the same DB path for identical env vars; precedence chain is respected; no hardcoded fallbacks diverge.`
- RCAF Prompt: `As a pipeline validation operator, validate DB_PATH extraction and import standardization against the documented validation surface. Verify all scripts/tools resolve to the same DB path for identical env vars; precedence chain is respected; no hardcoded fallbacks diverge. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: All scripts/tools resolve to the same DB path for identical env vars; precedence chain is respected; no hardcoded fallbacks diverge
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if all entry points resolve the same DB path and env var precedence is consistent across scripts/tools

---

## 3. TEST EXECUTION

### Prompt

```
As a pipeline validation operator, confirm shared DB path resolution against the documented validation surface. Verify all scripts/tools resolve to the same DB path for identical env vars; precedence chain is respected; no hardcoded fallbacks diverge. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. vary DB env vars
2. run scripts/tools
3. confirm shared resolver output

### Expected

All scripts/tools resolve to the same DB path for identical env vars; precedence chain is respected; no hardcoded fallbacks diverge

### Evidence

DB path resolver output from multiple scripts + env var configuration evidence

### Pass / Fail

- **Pass**: all entry points resolve the same DB path and env var precedence is consistent across scripts/tools
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Verify shared resolver module is imported by all consumers; check env var precedence order; inspect for hardcoded path fallbacks

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md](../../feature_catalog/14--pipeline-architecture/12-dbpath-extraction-and-import-standardization.md)

---

## 5. SOURCE METADATA

- Group: Pipeline Architecture
- Playbook ID: 087
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `14--pipeline-architecture/087-db-path-extraction-and-import-standardization.md`
