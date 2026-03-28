---
title: "M-010 -- Runtime Lineage Naming Parity"
description: "This snippet preserves the canonical memory/spec-kit operator workflow for `M-010`."
---

# M-010 -- Runtime Lineage Naming Parity

## 1. OVERVIEW

This snippet preserves the canonical memory/spec-kit operator workflow for `M-010`.

---

## 2. CURRENT REALITY

This scenario remains prose-first because it carries compound operator logic, supplemental checks, or shared closure rules that are clearer than a single-row matrix.

---

## 3. TEST EXECUTION

- Prompt: `Audit runtime agent naming parity. Capture the evidence needed to prove base (.opencode/agent/) matches Claude and Gemini, Codex traces lineage to base after extension normalization, deep-research is the active name, and stale research naming is absent. Return a concise pass/fail verdict with the main reason.`
- Commands:
  ```bash
  diff -u <(find .opencode/agent -maxdepth 1 -type f -name '*.md' -exec basename {} \; | sort) <(find .claude/agents -maxdepth 1 -type f -name '*.md' -exec basename {} \; | sort)
  diff -u <(find .opencode/agent -maxdepth 1 -type f -name '*.md' -exec basename {} \; | sort) <(find -L .gemini/agents -maxdepth 1 -type f -name '*.md' -exec basename {} \; | sort)
  diff -u <(find .opencode/agent -maxdepth 1 -type f -name '*.md' -exec basename {} \; | sort) <(find .codex/agents -maxdepth 1 -type f -name '*.toml' -exec basename {} \; | sed 's/\.toml$/.md/' | sort)
  rg -n 'research\.md' .opencode/agent .claude/agents .codex/agents .gemini/agents
  ```
- Expected: all diff commands produce no output; rg finds no active `research/research.md`.
- Evidence: diff output (empty on pass) and rg output (empty on pass).
- Pass: normalized basenames match and no stale naming.
- Fail triage: any mismatch or `research/research.md` hit; collect diff output and identify divergence.

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [16--tooling-and-scripts/14-source-dist-alignment-enforcement.md](../../feature_catalog/16--tooling-and-scripts/14-source-dist-alignment-enforcement.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: M-010
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `16--tooling-and-scripts/183-runtime-lineage-naming-parity.md`
