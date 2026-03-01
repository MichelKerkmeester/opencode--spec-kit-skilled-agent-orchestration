---
title: "Feature Specification: Refactor /memory:learn → Constitutional Memory Manager [009-constitutional-learn-refactor/spec.md]"
description: "Refactor the /memory:learn command from a generic learning capture tool into a focused constitutional memory creator and manager."
trigger_phrases:
  - "memory learn refactor"
  - "constitutional memory"
  - "constitutional learn"
  - "memory learn constitutional"
SPECKIT_TEMPLATE_SOURCE: "spec-core + level2-verify | v2.2"
importance_tier: "critical"
contextType: "implementation"
---
# Feature Specification: Refactor /memory:learn → Constitutional Memory Manager

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

## EXECUTIVE SUMMARY

Refactor `/memory:learn` from a generic learning capture command (pattern, mistake, insight, optimization, constraint types saved to spec folder memory/) into a focused constitutional memory manager that creates, lists, edits, removes, and budget-checks constitutional memories in `.opencode/skill/system-spec-kit/constitutional/`.

**Key Decision**: Constitutional memories are fundamentally different from regular memories — they always surface, never decay, and have a hard ~2000 token budget. They deserve a dedicated creation workflow, not a generic learning classifier.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-02-23 |
| **Parent Spec** | `../spec.md` |
| **Predecessor Phase** | `../008-spec-kit-code-quality` (Complete) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The current `/memory:learn` command (620 lines) is a generic learning capture tool that classifies inputs into 5 types (pattern, mistake, insight, optimization, constraint) and saves them to spec folder `memory/` directories via `generate-context.js`. This provides negligible value over the existing `/memory:save` command.

### Root Cause

The command was designed for generic "learning" capture without a clear differentiation from `/memory:save`. Both save memories to spec folders; `/memory:learn` just adds a type classification layer that doesn't meaningfully change retrieval or surfacing behavior.

### Purpose

Repurpose `/memory:learn` as the dedicated constitutional memory manager — the only command for creating and managing always-surface rules that appear in every search result.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:solution -->
## 3. SOLUTION

### Approach

Complete rewrite of `.opencode/command/memory/learn.md` with:
- New role: Constitutional Memory Manager
- New destination: `.opencode/skill/system-spec-kit/constitutional/` (not spec folder memory/)
- New subcommands: `list`, `edit`, `remove`, `budget`
- Guided creation with frontmatter templates, trigger phrases, ANCHOR format
- Token budget awareness (~2000 max across all constitutional memories)

### What Changes
1. `.opencode/command/memory/learn.md` — complete rewrite (~620→~250 lines)
2. `.opencode/command/memory/README.txt` — update learn command description
3. `CLAUDE.md` (project root) — update Quick Reference table
4. `.opencode/skill/system-spec-kit/README.md` — update /memory:learn entry

### What Stays
- Constitutional tier logic in `importance-tiers.ts` — already correct
- `memory_save()` MCP handler — already supports constitutional indexing
- `tier-classifier.ts` — already handles constitutional (no decay, always HOT)
- No new MCP tools needed
<!-- /ANCHOR:solution -->

---

<!-- ANCHOR:scope -->
## 4. SCOPE

### In Scope
- Rewrite learn.md command definition
- Update cross-references in README.txt, CLAUDE.md, README.md
- New subcommand routing (list, edit, remove, budget)
- Token budget checking workflow

### Out of Scope
- Changes to MCP server code
- Changes to importance-tiers.ts or tier-classifier.ts
- New MCP tools
- Migration of existing "learnings" saved via old command
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:files -->
## 5. FILES

| File | Action | LOC Est. |
|------|--------|----------|
| `.opencode/command/memory/learn.md` | Rewrite | ~250 |
| `.opencode/command/memory/README.txt` | Edit | ~15 |
| `CLAUDE.md` | Edit | ~5 |
| `.opencode/skill/system-spec-kit/README.md` | Edit | ~3 |
<!-- /ANCHOR:files -->
