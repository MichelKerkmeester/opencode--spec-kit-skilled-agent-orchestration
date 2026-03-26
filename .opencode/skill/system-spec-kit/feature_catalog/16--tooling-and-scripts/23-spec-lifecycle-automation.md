---
title: "Spec Lifecycle Automation"
description: "Coordinated shell-script lifecycle for recommending spec depth, creating spec folders and phases, upgrading documentation level, measuring completion, checking checklist readiness, and archiving finished work."
---

# Spec Lifecycle Automation

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

Spec Lifecycle Automation is the shell-script toolchain that moves Spec Kit work through its operational lifecycle instead of treating spec folders as static templates.

The lifecycle is intentionally split into focused commands. `recommend-level.sh` scores a task and recommends the documentation level and optional phasing strategy. `create.sh` materializes the parent spec, optional child phases, or versioned subfolders. `upgrade-level.sh` raises an existing spec folder to a richer documentation level without discarding authored content. `calculate-completeness.sh` measures placeholder burn-down and optional content quality, `check-completion.sh` enforces checklist completion and evidence rules, and `archive.sh` archives or restores completed work with a completeness gate.

---

## 2. CURRENT REALITY

The shipped lifecycle is modular rather than fully auto-chained.

Level recommendation is handled by `recommend-level.sh` as a standalone scoring tool. It accepts estimated LOC, file count, and risk flags for auth, API, database, and architectural work, converts those inputs into a 100-point score, maps the result to Level 0 through Level 3, and separately computes whether phased execution is recommended. Phase scoring uses its own 50-point signal model and only recommends phases when the phase score crosses the threshold and the recommended documentation level is Level 3 or higher.

Spec creation is handled by `create.sh`, which defaults to Level 1 unless `--level` is provided. The script creates `scratch/` and `memory/`, copies the level template set, optionally creates a git branch, writes `description.json` when the Node helper is available, and runs quiet post-create validation unless `SPECKIT_SKIP_POST_VALIDATE=1` is set. Beyond normal folder creation, it supports versioned subfolders with `--subfolder`, phased parent-plus-child creation with `--phase`, append-mode phase growth with `--parent`, named child phases with `--phase-names`, and Level 3 sharded spec sections with `--sharded`. The current implementation exposes complexity fields in its output, but the script itself still depends on explicit `--level` input rather than invoking `recommend-level.sh` automatically.

Upgrade automation is handled by `upgrade-level.sh`. It detects the current level from explicit markers in `spec.md` or from the presence of `checklist.md` and `decision-record.md`, validates that upgrades only move upward, creates timestamped `.backup-*` directories, and rolls back markdown changes if an upgrade step fails. The upgrade path is chained, so a request like Level 1 to Level 3 passes through the intermediate Level 2 transformations automatically. New files are introduced only when needed, such as `checklist.md` for Level 2 and `decision-record.md` for Level 3, while higher-level addendum sections are injected or appended into existing documents. `--dry-run`, `--json`, `--verbose`, and `--keep-backups` support inspection and automation use cases.

Completion measurement and completion gating are separated on purpose. `calculate-completeness.sh` scans the root spec files for placeholder markers such as `[PLACEHOLDER]`, `[TODO: ...]`, and `[NEEDS CLARIFICATION: ...]`, computes per-file and overall completion percentages with `bc`, and can add quality checks for minimum word counts and required sections. `check-completion.sh` then evaluates `checklist.md` as a release gate: it inherits priority from headings when needed, treats untagged items as blocking, requires evidence markers on completed P0 and P1 tasks, supports `--strict` to make P2 mandatory, and returns one of a fixed set of statuses such as `P0_INCOMPLETE`, `EVIDENCE_MISSING`, or `COMPLETE`.

Archival is handled by `archive.sh`. It archives spec folders into `specs/z_archive/`, restores archived folders back into `specs/`, and lists archived entries. Before archiving, it calls `calculate-completeness.sh --json` and enforces a default 90 percent minimum unless `--force` is used or the operator confirms archiving a less-complete spec. The script also validates `NNN-name` folder naming, refuses to archive outside the specs root, detects already archived folders, and uses a copy-to-temp-then-rename flow before deleting the source folder.

Taken together, the lifecycle tooling currently covers recommendation, creation, decomposition, upgrade, measurement, completion gating, and archival, but it does so through explicit script composition rather than one umbrella command.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/system-spec-kit/scripts/spec/create.sh` | Script | Creates new spec folders, versioned subfolders, phased parent-child structures, optional git branches, and post-create validation runs |
| `.opencode/skill/system-spec-kit/scripts/spec/archive.sh` | Script | Archives, lists, and restores spec folders while enforcing path safety and a completeness threshold |
| `.opencode/skill/system-spec-kit/scripts/spec/check-completion.sh` | Script | Enforces checklist completion rules, priority coverage, and evidence requirements before a spec can be claimed complete |
| `.opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh` | Script | Scores requested work to recommend documentation level and optional phase decomposition |
| `.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh` | Script | Upgrades existing spec folders to higher levels with backup creation, chained transformations, and rollback on failure |
| `.opencode/skill/system-spec-kit/scripts/spec/calculate-completeness.sh` | Script | Measures placeholder replacement progress and optional content quality across root spec documents |

## 4. SOURCE METADATA

- Group: Tooling and Scripts
- Source feature title: Spec Lifecycle Automation
- Source spec: Deep research remediation 2026-03-26
- Current reality source: direct implementation audit of lifecycle scripts
