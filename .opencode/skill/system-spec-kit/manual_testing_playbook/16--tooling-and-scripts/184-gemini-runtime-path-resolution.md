---
title: "M-011 -- Gemini Runtime Path Resolution"
description: "This snippet preserves the canonical memory/spec-kit operator workflow for `M-011`."
---

# M-011 -- Gemini Runtime Path Resolution

## 1. OVERVIEW

This snippet preserves the canonical memory/spec-kit operator workflow for `M-011`.

---

## 2. CURRENT REALITY

This scenario remains prose-first because it carries compound operator logic, supplemental checks, or shared closure rules that are clearer than a single-row matrix.

---

## 3. TEST EXECUTION

- Prompt: `Audit Gemini runtime path resolution. Capture the evidence needed to prove .gemini is a symlink to .agents, .gemini/agents is the runtime-facing path, and the resolved Gemini file set matches the backing storage. Return a concise pass/fail verdict with the main reason.`
- Commands:
  ```bash
  test -L .gemini
  readlink .gemini
  diff -u <(find -L .gemini/agents -maxdepth 1 -type f -name '*.md' -exec basename {} \; | sort) <(find .agents/agents -maxdepth 1 -type f -name '*.md' -exec basename {} \; | sort)
  find -L .gemini/agents -maxdepth 1 -type f -name '*.md' | wc -l
  ```
- Expected: `readlink .gemini` returns `.agents`; basename diff is empty; resolved count is `9`.
- Evidence: readlink output, diff output (empty on pass), and file count.
- Pass: symlink target, resolved file set, and count all match.
- Fail triage: symlink missing, target mismatch, or file set divergence; collect evidence and identify root cause.

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/14-source-dist-alignment-enforcement.md](../../feature_catalog/16--tooling-and-scripts/14-source-dist-alignment-enforcement.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: M-011
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/184-gemini-runtime-path-resolution.md`
