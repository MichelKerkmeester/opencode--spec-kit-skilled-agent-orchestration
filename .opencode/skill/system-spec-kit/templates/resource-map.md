---
title: "Resource Map [template:resource-map.md]"
description: "Lean, scannable catalog of every file path analyzed, created, updated, or removed during this packet, grouped by resource category."
trigger_phrases:
  - "resource map"
  - "path catalog"
  - "files touched"
  - "paths analyzed"
  - "paths updated"
  - "paths created"
importance_tier: "normal"
contextType: "general"
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.0 -->

A `resource-map.md` is a **lean** companion to `implementation-summary.md`. Where the summary narrates *what was done and why*, the resource map simply lists **every file path touched** during the packet — grouped by category and easy to scan.

It is supported at every documentation level (Level 1 through Level 3+) and is **optional but recommended**. Use it when the set of files spans more than a handful of paths, when audits or reviewers need a quick map of the blast radius, or when a phase child needs to hand a clean path ledger to its successor.

Keep this file **paths-only** — no narrative, no decisions, no test evidence. Those belong in `implementation-summary.md`, `decision-record.md`, or `checklist.md`.

---

## Summary

- **Total references**: [count]
- **By category**: READMEs=[n], Documents=[n], Commands=[n], Agents=[n], Skills=[n], Specs=[n], Scripts=[n], Tests=[n], Config=[n], Meta=[n]
- **Missing on disk**: [n]
- **Scope**: [one-line scope — e.g., "all files created, updated, or analyzed during packet 026/012-resource-map-template"]
- **Generated**: [YYYY-MM-DDTHH:MM:SS±TZ]

> Action vocabulary: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> Status vocabulary: `OK` (exists on disk) · `MISSING` (referenced but absent) · `PLANNED` (intentional future path).
> Omit categories that have zero entries. Keep tables tight — one path per row.

---

## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| [path to README.md] | [Updated\|Created\|Analyzed] | [OK\|MISSING] | [short note, optional] |

---

## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| [path to .md] | [Updated] | OK | [note] |

---

## 3. Commands

> `.opencode/command/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| [path to command file] | [Updated] | OK | [note] |

---

## 4. Agents

> `.opencode/agent/**`, `.claude/agents/**`, `.codex/agents/**`, `.gemini/agents/**`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| [path to agent file] | [Updated] | OK | [note] |

---

## 5. Skills

> `.opencode/skill/**` including `SKILL.md`, `references/`, `assets/`, `feature_catalog/`, `manual_testing_playbook/`, `scripts/`, `shared/`, `mcp_server/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| [path to skill artifact] | [Updated] | OK | [note] |

---

## 6. Specs

> `.opencode/specs/**` — spec folders, phase children, packet docs, research, review, scratch.

| Path | Action | Status | Note |
|------|--------|--------|------|
| [path to spec artifact] | [Created] | OK | [note] |

---

## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| [path to script] | [Updated] | OK | [note] |

---

## 8. Tests

> Test files, fixtures, snapshots. Group unit, integration, and vitest/pytest paths here.

| Path | Action | Status | Note |
|------|--------|--------|------|
| [path to test file] | [Updated] | OK | [note] |

---

## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`, `description.json`, `graph-metadata.json`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| [path to config] | [Updated] | OK | [note] |

---

## 10. Meta

> Repository-wide or governance artifacts: `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`, root-level `README.md`, license, changelog.

| Path | Action | Status | Note |
|------|--------|--------|------|
| [path to meta artifact] | [Updated] | OK | [note] |

---

<!--
INSTRUCTIONS FOR AUTHORS

- Paths are **relative to the repo root** (e.g., `.opencode/skill/system-spec-kit/SKILL.md`), not absolute.
- One path per row. Use glob suffixes (`/**`, `/*`) only when every file under the glob received the same Action.
- Action = what this packet did to the file. If the file was only read for context, use `Analyzed` or `Cited`.
- Status = state at the moment this map was written. `MISSING` means referenced but not present on disk (expected deletion or a stale pointer); note which.
- Delete any category whose table is empty. Do not leave placeholder rows.
- For phase-heavy packets, generate one resource-map per phase child OR a single parent-level map that aggregates across children — pick the shape that reads most cleanly, and state the choice in `Scope`.
- Keep this file ≤ ~250 lines of content. If it grows larger, split by sub-scope or promote detail into `implementation-summary.md` / `decision-record.md`.

Reference reading:
- `.opencode/skill/system-spec-kit/templates/README.md` (template architecture)
- `.opencode/skill/system-spec-kit/references/templates/level_specifications.md` (level-by-level usage)
- `.opencode/skill/system-spec-kit/SKILL.md` §3 Canonical Spec Docs
-->
