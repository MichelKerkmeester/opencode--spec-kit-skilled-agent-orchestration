---
title: "M-004 -- Main-Agent Review and Verdict Handoff"
description: "This snippet preserves the canonical memory/spec-kit operator workflow for `M-004`."
---

# M-004 -- Main-Agent Review and Verdict Handoff

## 1. OVERVIEW

This snippet preserves the canonical memory/spec-kit operator workflow for `M-004`.

---

## 2. SCENARIO CONTRACT


- Objective: This snippet preserves the canonical memory/spec-kit operator workflow for `M-004`.
- Real user request: `Please validate Main-Agent Review and Verdict Handoff against @review and tell me whether the expected signals are present: severity-ranked findings and final verdict.`
- RCAF Prompt: `As a tooling validation operator, validate Main-Agent Review and Verdict Handoff against @review. Verify severity-ranked findings and final verdict. Return a concise pass/fail verdict with the main reason and cited evidence.`
- Expected execution process: Execute the documented validation request against @review, capture the response and evidence, compare it against the expected signals, and return the pass/fail verdict.
- Expected signals: severity-ranked findings and final verdict
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: deterministic verdict issued with rationale.

---

## 3. TEST EXECUTION

### Prompt

`As a tooling validation operator, validate Main-Agent Review and Verdict Handoff against @review. Verify severity-ranked findings and final verdict. Return a concise pass/fail verdict with the main reason and cited evidence.`
### Expected

severity-ranked findings and final verdict.
### Evidence

review output with file:line findings.
### Pass/Fail

deterministic verdict issued with rationale.
### Failure Triage

collect missing evidence and rerun review.

---

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md](../../feature_catalog/16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: M-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/004-main-agent-review-and-verdict-handoff.md`
