---
title: "Feature Specification: Refactor /memory:learn → Constitutional Memory Manager"
status: "Complete"
level: 2
created: "2025-12-01"
updated: "2026-03-08"
description: "Refactor the /memory:learn command from a generic learning capture tool into a focused constitutional memory creator and manager."
trigger_phrases:
  - "memory learn refactor"
  - "constitutional memory"
  - "constitutional learn"
  - "memory learn constitutional"
importance_tier: "critical"
contextType: "implementation"
---
# Feature Specification: Refactor /memory:learn → Constitutional Memory Manager

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-02-23 |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../002-indexing-normalization/spec.md |
| **Successor** | ../004-ux-hooks-automation/spec.md |
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

<!-- ANCHOR:scope -->
## 3. SCOPE

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
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- REQ-001: learn.md MUST be rewritten as a constitutional memory manager, replacing all 5 generic learning types
- REQ-002: Old subcommands (correct, undo, history) MUST be removed and replaced with (list, edit, remove, budget)
- REQ-003: Constitutional memory creation MUST include a budget check step enforcing ~2000 token limit
- REQ-004: File creation MUST use Write tool targeting `.opencode/skill/system-spec-kit/constitutional/`
- REQ-005: Indexing MUST use `memory_save()` MCP call (not `generate-context.js`)
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:acceptance -->
## 5. ACCEPTANCE CRITERIA

**Given** the learn command is invoked with no subcommand, **When** a user provides a rule, **Then** the CREATE workflow triggers with qualification, structuring, budget-check, and write+index steps.

**Given** the learn command is invoked with `list`, **When** constitutional memories exist, **Then** all files in `.opencode/skill/system-spec-kit/constitutional/` are listed with token usage.

**Given** the learn command is invoked with `budget`, **When** constitutional memories exist, **Then** current token usage vs ~2000 limit is displayed.

**Given** the old learning types (pattern, mistake, insight), **When** grepping the learn command document, **Then** zero matches are found (except safe contextual uses).
<!-- /ANCHOR:acceptance -->

---

<!-- ANCHOR:scope -->
## 6. SCOPE

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
## 7. FILES

| File | Action | LOC Est. |
|------|--------|----------|
| `.opencode/command/memory/learn.md` | Rewrite | ~550 (est. ~250, see implementation-summary.md) |
| `.opencode/command/memory/README.txt` | Edit | ~15 |
| `CLAUDE.md` | Edit | ~5 |
| `.opencode/skill/system-spec-kit/README.md` | Edit | ~3 |
<!-- /ANCHOR:files -->

---

<!-- ANCHOR:success-criteria -->
## 8. SUCCESS CRITERIA

- **SC-001**: `/memory:learn` is rewritten as a constitutional memory manager with 5 subcommands
- **SC-002**: No stale references to old learning types remain in active command/workspace/agent docs
- **SC-003**: Regression test prevents future documentation drift
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 9. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Existing users expect old behavior | M | Update all cross-references simultaneously |
| Dependency | Constitutional directory exists | L | Already exists at `.opencode/skill/system-spec-kit/constitutional/` |
| Dependency | `memory_save()` supports constitutional tier | L | Already implemented |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

No open questions remain. All were resolved during implementation.
<!-- /ANCHOR:questions -->

---

## Phase Navigation

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Previous Phase** | ../002-indexing-normalization/spec.md |
| **Next Phase** | ../004-ux-hooks-automation/spec.md |
