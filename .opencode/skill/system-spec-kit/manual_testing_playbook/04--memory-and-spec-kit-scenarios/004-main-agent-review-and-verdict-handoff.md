---
title: "M-004 -- Main-Agent Review and Verdict Handoff"
description: "This snippet preserves the canonical memory/spec-kit operator workflow for `M-004`."
---

# M-004 -- Main-Agent Review and Verdict Handoff

## 1. OVERVIEW

This snippet preserves the canonical memory/spec-kit operator workflow for `M-004`.

---

## 2. CURRENT REALITY

This scenario remains prose-first because it carries compound operator logic, supplemental checks, or shared closure rules that are clearer than a single-row matrix.

---

## 3. TEST EXECUTION

- Prompt:
  - `@review findings-first review with severity + verdict APPROVE/CHANGES_REQUESTED`
- Expected: severity-ranked findings and final verdict.
- Evidence: review output with file:line findings.
- Pass: deterministic verdict issued with rationale.
- Fail triage: collect missing evidence and rerun review.

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)

---

## 5. SOURCE METADATA

- Group: Dedicated Memory/Spec-Kit Scenarios
- Playbook ID: M-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--memory-and-spec-kit-scenarios/004-main-agent-review-and-verdict-handoff.md`
