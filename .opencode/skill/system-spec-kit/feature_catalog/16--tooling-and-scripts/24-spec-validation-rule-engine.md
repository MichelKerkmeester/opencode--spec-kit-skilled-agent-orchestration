---
title: "Spec Validation Rule Engine"
description: "Validation orchestrator that detects spec level, loads configured or alphabetical rule scripts, applies severity policy, supports recursive phase validation, and emits human-readable or JSON results."
---

# Spec Validation Rule Engine

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

Spec Validation Rule Engine is the executable validation surface behind Spec Kit's documentation quality gates.

The engine is centered on `validate.sh`, which acts as an orchestrator for a directory of rule scripts under `scripts/rules/`. It detects the target spec level, resolves which rules to run, applies severity mapping, executes each rule in-process, and aggregates the result into terminal-friendly output or JSON for automation.

---

## 2. CURRENT REALITY

`validate.sh` is a rule runner, not a single monolithic validator. It begins with hard skip controls: `SPECKIT_SKIP_VALIDATION` exits immediately, and `SPECKIT_VALIDATION=false` also disables execution. From there it parses CLI flags for JSON, strict mode, verbose mode, quiet mode, and recursive validation, then loads optional configuration from `.speckit.yaml` in the target folder or repository root.

Rule selection is configurable but deterministic. If `SPECKIT_RULES` is set, the engine canonicalizes the requested subset and only runs those rules. If `.speckit.yaml` declares `rule_order`, that order is respected. Otherwise the engine runs every `check-*.sh` file in `scripts/rules/` alphabetically. Canonical rule names are mapped to script basenames such as `FILE_EXISTS -> check-files.sh` and `PHASE_LINKS -> check-phase-links.sh`.

Rule execution is dynamic but guarded. For each selected rule script, the orchestrator resolves the real path, verifies that it remains inside `RULES_DIR`, requires a `.sh` extension, sources the file, and calls its `run_check` function with the target folder and detected level. Each rule reports through shared `RULE_NAME`, `RULE_STATUS`, `RULE_MESSAGE`, `RULE_DETAILS`, and `RULE_REMEDIATION` variables, which `validate.sh` then converts into pass, warn, error, or info output. Verbose mode adds per-rule timing.

Severity is partly centralized in the orchestrator. Missing files, placeholders, anchor issues, table-of-contents policy, template-header mismatches, and spec-doc integrity failures are treated as errors. Section, priority, evidence, and phase-link issues are warnings by default. Level declaration is informational. `--strict` upgrades warning-bearing runs into exit-code failure without changing the underlying rule outputs.

Level detection is shared infrastructure for the whole engine. `validate.sh` first looks for explicit level markers in `spec.md`, including `<!-- SPECKIT_LEVEL: ... -->`, metadata tables, bullet metadata, YAML frontmatter, or line-anchored `Level:` text. If no explicit declaration is present, it infers Level 3 from `decision-record.md`, Level 2 from `checklist.md`, and Level 1 otherwise.

Phase awareness is built into the engine. If the target folder contains child directories matching `NNN-*/`, recursive validation is auto-enabled unless `--no-recursive` is passed. In recursive mode, the parent is validated first, then each child phase is validated with its own detected level, and JSON output includes a separate `phases[]` result set plus aggregate counts.

The current rule engine therefore behaves like a shell-based plugin host: central orchestration, distributed checks, configurable order, shared severity policy, and optional recursive traversal across phased spec packets.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` | Orchestrator | Parses flags and config, detects level, resolves rule order, sources rule scripts, aggregates results, and handles recursive phase validation |

### Rule Inventory

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/system-spec-kit/scripts/rules/check-ai-protocols.sh` | Validation rule | Rule script discovered and executed by the orchestrator for the AI protocols domain |
| `.opencode/skill/system-spec-kit/scripts/rules/check-anchors.sh` | Validation rule | Rule script discovered and executed by the orchestrator for anchor validation |
| `.opencode/skill/system-spec-kit/scripts/rules/check-complexity.sh` | Validation rule | Rule script discovered and executed by the orchestrator for complexity matching |
| `.opencode/skill/system-spec-kit/scripts/rules/check-evidence.sh` | Validation rule | Rule script discovered and executed by the orchestrator for evidence citation checks |
| `.opencode/skill/system-spec-kit/scripts/rules/check-files.sh` | Validation rule | Rule script discovered and executed by the orchestrator for required file checks |
| `.opencode/skill/system-spec-kit/scripts/rules/check-folder-naming.sh` | Validation rule | Rule script discovered and executed by the orchestrator for folder naming checks |
| `.opencode/skill/system-spec-kit/scripts/rules/check-frontmatter.sh` | Validation rule | Rule script discovered and executed by the orchestrator for frontmatter validation |
| `.opencode/skill/system-spec-kit/scripts/rules/check-level-match.sh` | Validation rule | Rule script discovered and executed by the orchestrator for level matching checks |
| `.opencode/skill/system-spec-kit/scripts/rules/check-level.sh` | Validation rule | Rule script discovered and executed by the orchestrator for level declaration checks |
| `.opencode/skill/system-spec-kit/scripts/rules/check-links.sh` | Validation rule | Rule script discovered and executed by the orchestrator for link validation |
| `.opencode/skill/system-spec-kit/scripts/rules/check-phase-links.sh` | Validation rule | Rule script discovered and executed by the orchestrator for parent-child phase linkage checks |
| `.opencode/skill/system-spec-kit/scripts/rules/check-placeholders.sh` | Validation rule | Rule script discovered and executed by the orchestrator for placeholder detection |
| `.opencode/skill/system-spec-kit/scripts/rules/check-priority-tags.sh` | Validation rule | Rule script discovered and executed by the orchestrator for checklist priority-tag checks |
| `.opencode/skill/system-spec-kit/scripts/rules/check-section-counts.sh` | Validation rule | Rule script discovered and executed by the orchestrator for section-count validation |
| `.opencode/skill/system-spec-kit/scripts/rules/check-sections.sh` | Validation rule | Rule script discovered and executed by the orchestrator for required section checks |
| `.opencode/skill/system-spec-kit/scripts/rules/check-spec-doc-integrity.sh` | Validation rule | Rule script discovered and executed by the orchestrator for spec document integrity checks |
| `.opencode/skill/system-spec-kit/scripts/rules/check-template-headers.sh` | Validation rule | Rule script discovered and executed by the orchestrator for template-header validation |
| `.opencode/skill/system-spec-kit/scripts/rules/check-template-source.sh` | Validation rule | Rule script discovered and executed by the orchestrator for template-source validation |
| `.opencode/skill/system-spec-kit/scripts/rules/check-toc-policy.sh` | Validation rule | Rule script discovered and executed by the orchestrator for table-of-contents policy checks |

## 4. SOURCE METADATA

- Group: Tooling and Scripts
- Source feature title: Spec Validation Rule Engine
- Source spec: Deep research remediation 2026-03-26
- Current reality source: direct audit of `validate.sh` plus filesystem inventory of `scripts/rules/*.sh`
