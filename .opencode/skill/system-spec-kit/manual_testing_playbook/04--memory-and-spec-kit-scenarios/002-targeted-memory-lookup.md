---
title: "M-002 -- Targeted Memory Lookup"
description: "This snippet preserves the canonical memory/spec-kit operator workflow for `M-002`."
---

# M-002 -- Targeted Memory Lookup

## 1. OVERVIEW

This snippet preserves the canonical memory/spec-kit operator workflow for `M-002`.

---

## 2. CURRENT REALITY

This scenario remains prose-first because it carries compound operator logic, supplemental checks, or shared closure rules that are clearer than a single-row matrix.

---

## 3. TEST EXECUTION

- Prompt: `Find rationale for <specific decision>`
- Commands:
  - `memory_search({query:"<decision rationale>", specFolder:"specs/<target-spec>", anchors:["decision-record","rationale"]})`
- Expected: precise fact-level retrieval.
- Evidence: fact + source snippet.
- Pass: question answered with traceable result.
- Fail triage: refine query terms; use focused mode.

---

## 4. REFERENCES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)

---

## 5. SOURCE METADATA

- Group: Dedicated Memory/Spec-Kit Scenarios
- Playbook ID: M-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `04--memory-and-spec-kit-scenarios/002-targeted-memory-lookup.md`
