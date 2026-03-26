---
title: "M-009 -- Runtime Family Count Census"
description: "This snippet preserves the canonical memory/spec-kit operator workflow for `M-009`."
---

# M-009 -- Runtime Family Count Census

## 1. OVERVIEW

This snippet preserves the canonical memory/spec-kit operator workflow for `M-009`.

---

## 2. CURRENT REALITY

This scenario remains prose-first because it carries compound operator logic, supplemental checks, or shared closure rules that are clearer than a single-row matrix.

---

## 3. TEST EXECUTION

- Prompt: `Audit runtime agent family counts. Capture the evidence needed to prove OpenCode (base), Claude, Codex, and Gemini each expose exactly 9 runtime agent files. Return a concise pass/fail verdict with the main reason.`
- Commands:
  ```bash
  find .opencode/agent -maxdepth 1 -type f -name '*.md' | wc -l
  find .claude/agents -maxdepth 1 -type f -name '*.md' | wc -l
  find .codex/agents -maxdepth 1 -type f -name '*.toml' | wc -l
  find -L .gemini/agents -maxdepth 1 -type f -name '*.md' | wc -l
  ```
- Expected: all four commands return `9`.
- Evidence: command output showing each family count.
- Pass: every family count is `9`.
- Fail triage: any family missing files or has extras; collect counts and identify discrepancy.

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/14-source-dist-alignment-enforcement.md](../../feature_catalog/16--tooling-and-scripts/14-source-dist-alignment-enforcement.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: M-009
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/182-runtime-family-count-census.md`
