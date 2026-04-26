---
title: "188 -- AST-level section retrieval tool"
description: "This scenario validates the deferred AST-level section retrieval tool entry for `188`. It focuses on Verify the feature remains planned, unimplemented, and explicitly deferred in favor of the current anchor-aware thinning approach."
audited_post_018: true
---

# 188 -- AST-level section retrieval tool

## 1. OVERVIEW

This scenario validates the deferred AST-level section retrieval tool entry for `188`. It focuses on Verify the feature remains planned, unimplemented, and explicitly deferred in favor of the current anchor-aware thinning approach.

---

## 2. SCENARIO CONTRACT

Operators review the exact feature entry and nearby retrieval references for `188` and confirm the deferred status without contradicting evidence.

- Objective: Verify `read_spec_section(filePath, heading)` remains a planned AST-based retrieval tool, no implementation/source files exist yet, and R7 anchor-aware thinning remains the active approach until spec docs routinely exceed about 1000 lines
- Prompt: `As a retrieval validation operator, validate AST-level section retrieval tool against feature_catalog/01--retrieval/07-ast-level-section-retrieval-tool.md. Verify read_spec_section(filePath, heading) remains a planned AST-based retrieval tool, no implementation/source files exist yet, and R7 anchor-aware thinning remains the active approach until spec docs routinely exceed about 1000 lines. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected signals: Feature is marked planned/deferred; `read_spec_section(filePath, heading)` is described as future work; no implementation/source files are present; R7 anchor-aware thinning is still documented as the current approach
- Pass/fail: PASS: Deferred status, no implementation, and current-approach notes all align; FAIL: the repo contains a live implementation without catalog updates, or the entry claims shipped behavior

---

## 3. TEST EXECUTION

### Prompt

```
As a retrieval validation operator, verify deferred AST heading-level retrieval remains unshipped and correctly bounded against feature_catalog/01--retrieval/07-ast-level-section-retrieval-tool.md. Verify feature is marked planned/deferred; no implementation/source files are present; current retrieval remains anchor-aware thinning. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Read `feature_catalog/01--retrieval/07-ast-level-section-retrieval-tool.md` and confirm it states `PLANNED (Sprint 019): DEFERRED`
2. Verify the entry names `read_spec_section(filePath, heading)` as the planned interface and says Markdown AST parsing via `remark` is deferred until docs routinely exceed about 1000 lines
3. Search the repository for `read_spec_section(` and confirm there is no production implementation or source file for the tool yet
4. Confirm current retrieval references still point to R7 anchor-aware thinning as the active approach rather than heading-level AST extraction

### Expected

Feature is marked planned/deferred; no implementation/source files are present; current retrieval remains anchor-aware thinning

### Evidence

Feature catalog excerpt showing deferred status; repository search output showing no implementation; reference showing R7 anchor-aware thinning is still current

### Pass / Fail

- **Pass**: Deferred status, no implementation, and current-approach notes all align
- **Fail**: code or runtime wiring exists without catalog updates, or the feature entry no longer matches reality

### Failure Triage

Reconcile documentation drift if implementation exists; update the feature catalog if status changed; if docs are routinely above threshold, confirm whether implementation should move from deferred to active

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [01--retrieval/07-ast-level-section-retrieval-tool.md](../../feature_catalog/01--retrieval/07-ast-level-section-retrieval-tool.md)

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: 188
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--retrieval/188-ast-level-section-retrieval-tool.md`
