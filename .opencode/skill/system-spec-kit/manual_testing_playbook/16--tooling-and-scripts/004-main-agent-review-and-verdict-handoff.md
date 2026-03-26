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

- Prompt: `@review findings-first review with severity + verdict APPROVE/CHANGES_REQUESTED. Capture the evidence needed to prove severity-ranked findings and final verdict. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected: severity-ranked findings and final verdict.
- Evidence: review output with file:line findings.
- Pass: deterministic verdict issued with rationale.
- Fail triage: collect missing evidence and rerun review.

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md](../../feature_catalog/16--tooling-and-scripts/03-progressive-validation-for-spec-documents.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: M-004
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/004-main-agent-review-and-verdict-handoff.md`
