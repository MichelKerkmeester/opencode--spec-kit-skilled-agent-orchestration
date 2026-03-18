---
title: "M-001 -- Context Recovery and Continuation"
description: "This snippet preserves the canonical memory/spec-kit operator workflow for `M-001`."
---

# M-001 -- Context Recovery and Continuation

## 1. OVERVIEW

This snippet preserves the canonical memory/spec-kit operator workflow for `M-001`.

---

## 2. CURRENT REALITY

This scenario remains prose-first because it carries compound operator logic, supplemental checks, or shared closure rules that are clearer than a single-row matrix.

---

## 3. TEST EXECUTION

- Prompt: `/memory:continue specs/<target-spec>`
- Commands:
  - `memory_search({query:"state next-steps blockers decisions", specFolder:"specs/<target-spec>", anchors:["state","next-steps","blockers","decisions"]})`
- Expected: Resume-ready state summary and next steps.
- Evidence: returned context + extracted next actions.
- Pass: Continuation context is actionable and specific.
- Fail triage: broaden anchors; verify spec folder path.

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)

---

## 5. SOURCE METADATA

- Group: Dedicated Memory/Spec-Kit Scenarios
- Playbook ID: M-001
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--memory-and-spec-kit-scenarios/001-context-recovery-and-continuation.md`
