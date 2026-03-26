---
title: "188 -- AST-level section retrieval tool"
description: "This scenario validates the deferred AST-level section retrieval tool entry for `188`. It focuses on Verify the feature remains planned, unimplemented, and explicitly deferred in favor of the current anchor-aware thinning approach."
---

# 188 -- AST-level section retrieval tool

## 1. OVERVIEW

This scenario validates the deferred AST-level section retrieval tool entry for `188`. It focuses on Verify the feature remains planned, unimplemented, and explicitly deferred in favor of the current anchor-aware thinning approach.

---

## 2. CURRENT REALITY

Operators review the exact feature entry and nearby retrieval references for `188` and confirm the deferred status without contradicting evidence.

- Objective: Verify `read_spec_section(filePath, heading)` remains a planned AST-based retrieval tool, no implementation/source files exist yet, and R7 anchor-aware thinning remains the active approach until spec docs routinely exceed about 1000 lines
- Prompt: `Validate the AST-level section retrieval tool feature entry. Capture the evidence needed to prove the feature remains PLANNED and DEFERRED; no live implementation or source files exist yet; current retrieval still relies on anchor-aware thinning until spec documents routinely exceed about 1000 lines. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Feature is marked planned/deferred; `read_spec_section(filePath, heading)` is described as future work; no implementation/source files are present; R7 anchor-aware thinning is still documented as the current approach
- Pass/fail: PASS: Deferred status, no implementation, and current-approach notes all align; FAIL: the repo contains a live implementation without catalog updates, or the entry claims shipped behavior

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 188 | AST-level section retrieval tool | Verify deferred AST heading-level retrieval remains unshipped and correctly bounded | `Validate the AST-level section retrieval tool feature entry. Capture the evidence needed to prove the feature remains PLANNED and DEFERRED; no live implementation or source files exist yet; current retrieval still relies on anchor-aware thinning until spec documents routinely exceed about 1000 lines. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Read `feature_catalog/01--retrieval/07-ast-level-section-retrieval-tool.md` and confirm it states `PLANNED (Sprint 019): DEFERRED` 2) Verify the entry names `read_spec_section(filePath, heading)` as the planned interface and says Markdown AST parsing via `remark` is deferred until docs routinely exceed about 1000 lines 3) Search the repository for `read_spec_section(` and confirm there is no production implementation or source file for the tool yet 4) Confirm current retrieval references still point to R7 anchor-aware thinning as the active approach rather than heading-level AST extraction | Feature is marked planned/deferred; no implementation/source files are present; current retrieval remains anchor-aware thinning | Feature catalog excerpt showing deferred status; repository search output showing no implementation; reference showing R7 anchor-aware thinning is still current | PASS: Deferred status, no implementation, and current-approach notes all align; FAIL: code or runtime wiring exists without catalog updates, or the feature entry no longer matches reality | Reconcile documentation drift if implementation exists; update the feature catalog if status changed; if docs are routinely above threshold, confirm whether implementation should move from deferred to active |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [01--retrieval/07-ast-level-section-retrieval-tool.md](../../feature_catalog/01--retrieval/07-ast-level-section-retrieval-tool.md)

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: 188
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--retrieval/188-ast-level-section-retrieval-tool.md`
