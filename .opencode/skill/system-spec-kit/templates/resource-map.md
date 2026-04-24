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

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

**Use `resource-map.md` when:**
- The set of files a packet touched spans more than a handful of paths (≥ ~8 files)
- Reviewers or auditors need a quick blast-radius view without reading `implementation-summary.md` end-to-end
- A phase child needs to hand a clean path ledger to its successor phase
- A deep-research or deep-review loop converges and you want to see coverage at a glance (emitted automatically by phase-013 integration)

**Optional at any level** (Level 1 through Level 3+). Pairs with `implementation-summary.md` — the summary narrates *what and why*; the map simply lists *which files*.

**Do NOT duplicate** narrative, decisions, or test evidence here. Those belong in `implementation-summary.md`, `decision-record.md`, or `checklist.md`.
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:summary -->
## Summary

- **Total references**: [YOUR_VALUE_HERE: count]
- **By category**: READMEs=[YOUR_VALUE_HERE: n], Documents=[YOUR_VALUE_HERE: n], Commands=[YOUR_VALUE_HERE: n], Agents=[YOUR_VALUE_HERE: n], Skills=[YOUR_VALUE_HERE: n], Specs=[YOUR_VALUE_HERE: n], Scripts=[YOUR_VALUE_HERE: n], Tests=[YOUR_VALUE_HERE: n], Config=[YOUR_VALUE_HERE: n], Meta=[YOUR_VALUE_HERE: n]
- **Missing on disk**: [YOUR_VALUE_HERE: n]
- **Scope**: [YOUR_VALUE_HERE: one-line scope, e.g. "all files created, updated, or analyzed during packet 026/012-resource-map-template"]
- **Generated**: [YOUR_VALUE_HERE: YYYY-MM-DDTHH:MM:SS±TZ]

> **Action vocabulary**: `Created` · `Updated` · `Analyzed` · `Removed` · `Cited` · `Validated` · `Moved` · `Renamed`.
> **Status vocabulary**: `OK` (exists on disk) · `MISSING` (referenced but absent) · `PLANNED` (intentional future path).
> **Omit categories** that have zero entries. See §Author Instructions for the category-precedence rule when a path fits multiple categories.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:readmes -->
## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| [YOUR_VALUE_HERE: path to README.md] | [YOUR_VALUE_HERE: Updated\|Created\|Analyzed] | [YOUR_VALUE_HERE: OK\|MISSING] | [YOUR_VALUE_HERE: short note, optional] |
<!-- /ANCHOR:readmes -->

---

<!-- ANCHOR:documents -->
## 2. Documents

> Long-form markdown artifacts that are not READMEs: guides, specs, references, install docs, catalogs, playbooks.

| Path | Action | Status | Note |
|------|--------|--------|------|
| [YOUR_VALUE_HERE: path to .md] | [YOUR_VALUE_HERE: Updated] | OK | [YOUR_VALUE_HERE: note] |
<!-- /ANCHOR:documents -->

---

<!-- ANCHOR:commands -->
## 3. Commands

> `.opencode/command/**` and any runtime-specific command surfaces.

| Path | Action | Status | Note |
|------|--------|--------|------|
| [YOUR_VALUE_HERE: path to command file] | [YOUR_VALUE_HERE: Updated] | OK | [YOUR_VALUE_HERE: note] |
<!-- /ANCHOR:commands -->

---

<!-- ANCHOR:agents -->
## 4. Agents

> `.opencode/agent/**`, `.claude/agents/**`, `.codex/agents/**`, `.gemini/agents/**`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| [YOUR_VALUE_HERE: path to agent file] | [YOUR_VALUE_HERE: Updated] | OK | [YOUR_VALUE_HERE: note] |
<!-- /ANCHOR:agents -->

---

<!-- ANCHOR:skills -->
## 5. Skills

> `.opencode/skill/**` including `SKILL.md`, `references/`, `assets/`, `feature_catalog/`, `manual_testing_playbook/`, `scripts/`, `shared/`, `mcp_server/`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| [YOUR_VALUE_HERE: path to skill artifact] | [YOUR_VALUE_HERE: Updated] | OK | [YOUR_VALUE_HERE: note] |
<!-- /ANCHOR:skills -->

---

<!-- ANCHOR:specs -->
## 6. Specs

> `.opencode/specs/**` — spec folders, phase children, packet docs, research, review, scratch. **Takes precedence over `Config`** for spec-folder JSON metadata (`description.json`, `graph-metadata.json`).

| Path | Action | Status | Note |
|------|--------|--------|------|
| [YOUR_VALUE_HERE: path to spec artifact] | [YOUR_VALUE_HERE: Created] | OK | [YOUR_VALUE_HERE: note] |
<!-- /ANCHOR:specs -->

---

<!-- ANCHOR:scripts -->
## 7. Scripts

> Executable or build/test scripts: `.sh`, `.js`, `.ts`, `.mjs`, `.cjs`, `.py`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| [YOUR_VALUE_HERE: path to script] | [YOUR_VALUE_HERE: Updated] | OK | [YOUR_VALUE_HERE: note] |
<!-- /ANCHOR:scripts -->

---

<!-- ANCHOR:tests -->
## 8. Tests

> Test files, fixtures, snapshots. Group unit, integration, and vitest/pytest paths here.

| Path | Action | Status | Note |
|------|--------|--------|------|
| [YOUR_VALUE_HERE: path to test file] | [YOUR_VALUE_HERE: Updated] | OK | [YOUR_VALUE_HERE: note] |
<!-- /ANCHOR:tests -->

---

<!-- ANCHOR:config -->
## 9. Config

> Machine-readable configuration: `.json`, `.jsonc`, `.yaml`, `.yml`, `.toml`, `.env.example`. Spec-folder metadata (`description.json`, `graph-metadata.json`) belongs under §Specs, not here (see precedence rule below).

| Path | Action | Status | Note |
|------|--------|--------|------|
| [YOUR_VALUE_HERE: path to config] | [YOUR_VALUE_HERE: Updated] | OK | [YOUR_VALUE_HERE: note] |
<!-- /ANCHOR:config -->

---

<!-- ANCHOR:meta -->
## 10. Meta

> Repository-wide governance artifacts: `AGENTS.md`, `CLAUDE.md`, `CODEX.md`, `GEMINI.md`, license, changelog. **Takes precedence over `READMEs`** for the root-level `README.md`.

| Path | Action | Status | Note |
|------|--------|--------|------|
| [YOUR_VALUE_HERE: path to meta artifact] | [YOUR_VALUE_HERE: Updated] | OK | [YOUR_VALUE_HERE: note] |
<!-- /ANCHOR:meta -->

---

<!-- ANCHOR:author-instructions -->
## Author Instructions

**Path conventions:**
- Paths are **relative to the repo root** (e.g., `.opencode/skill/system-spec-kit/SKILL.md`), not absolute.
- One path per row. Use glob suffixes (`/**`, `/*`) ONLY when every file under the glob received the same Action.

**Action column:** what this packet did to the file. If the file was only read for context, use `Analyzed` or `Cited`.

**Status column:** state at the moment this map was written. `MISSING` means referenced but not present on disk (expected deletion or a stale pointer); `PLANNED` means an intentional future path.

**Category precedence** (for paths that fit multiple categories):
1. `Specs` > `Config` — spec-folder JSON (`description.json`, `graph-metadata.json`) lives under §Specs
2. `Meta` > `READMEs` — root-level `README.md` lives under §Meta; all other READMEs under §READMEs
3. `Skills` > `Documents` — markdown inside `.opencode/skill/**` belongs to §Skills even when it looks like a general doc
4. `Tests` > `Scripts` — any `*.vitest.ts` / `*.test.*` / `*.spec.*` belongs to §Tests even when under a `scripts/` folder

**Category deletion:**
- Delete any category whose table is empty. Do not leave placeholder rows.
- **Do NOT renumber** remaining category headings when you delete one. Keep the original numbers (`## 1. READMEs`, `## 6. Specs`, etc.) so cross-packet comparisons stay aligned and deep links to anchors remain valid.

**Scope shape:**
- For phase-heavy packets, generate one resource-map per phase child OR a single parent-level map that aggregates across children — pick the shape that reads most cleanly, and state the choice in the `Scope` line of the Summary block.

**Size budget:**
- Keep this file ≤ ~250 lines of content. If it grows larger, split by sub-scope or promote detail into `implementation-summary.md` / `decision-record.md`.

**Reference reading:**
- `.opencode/skill/system-spec-kit/templates/README.md` (template architecture)
- `.opencode/skill/system-spec-kit/references/templates/level_specifications.md` (level-by-level usage)
- `.opencode/skill/system-spec-kit/SKILL.md` §3 Canonical Spec Docs
<!-- /ANCHOR:author-instructions -->
