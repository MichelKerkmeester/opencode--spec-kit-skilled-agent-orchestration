---
title: "Implementation Plan: Memory Command Dashboard Visual Design [03--commands-and-skills/014-cmd-memory-output/plan]"
description: "This plan defines a Memory Dashboard Visual Design System — a shared set of output components (headers, dividers, tables, status bars, box frames, metric displays) — and applies..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "memory"
  - "command"
  - "dashboard"
  - "036"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: Memory Command Dashboard Visual Design System

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (command instruction files) |
| **Framework** | OpenCode memory command system |
| **Storage** | N/A (documentation only) |
| **Testing** | Visual inspection, manual comparison |

### Overview

This plan defines a Memory Dashboard Visual Design System — a shared set of output components (headers, dividers, tables, status bars, box frames, metric displays) — and keeps the packet aligned with the current 4-command memory surface: `/memory:search`, `/memory:save`, `/memory:manage`, and `/memory:learn`. Shared-memory lifecycle output is treated as part of `/memory:manage shared`, not as a standalone command. No runtime code is modified; this active packet now serves as the truthful current-state reference for the output template sections within `.opencode/command/memory/`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] All live memory command docs analyzed and documented
- [x] 12 design system components defined
- [x] Dependencies identified (none external)

### Definition of Done

- [ ] Visual design system reference defined (12 components, all with examples)
- [ ] All live memory command docs updated with consistent output templates
- [ ] Zero emoji characters in any output template
- [ ] All status lines follow `STATUS=<OK|FAIL> [KEY=value]...` pattern
- [ ] Visual comparison confirms consistent headers, dividers, tables, and indicators
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Component-based design system

### Key Components

- **Visual Design System Reference**: Central definition of all 12 reusable output components — the shared vocabulary that all commands draw from. Defined once, referenced in the live memory command docs.
- **Command-level output templates**: Per-command application of shared components. Each command's output sections are updated to use the design system components in place of ad-hoc formatting.

### Data Flow

Design system reference is defined first, then applied to each live command's output sections. At runtime, the AI agent reads a command file and renders the output templates literally — no code execution involved. The flow is:

```
Design System Reference (12 components)
  └──► /memory:search output templates
  └──► /memory:save output templates
  └──► /memory:manage output templates (+ /memory:manage shared)  ──► AI agent renders at runtime
  └──► /memory:learn output templates
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Define Visual Design System

Define all 12 shared output components. This is the core reference deliverable — a shared vocabulary that every command draws from. All subsequent phases depend on this being complete and stable.

Components to define:

- [ ] **COMMAND HEADER** — `MEMORY: <COMMAND_NAME>` + double-line (`═`) divider. Used at top of every command output.
- [ ] **SECTION HEADER** — em-dash prefix, Title Case name, trailing dashes to width. Used to separate major sections.
- [ ] **KEY-VALUE PAIR** — 2-space indent, padded field name (14 chars, left-aligned), value. Used for labeled data display.
- [ ] **DATA TABLE** — 2-space indent, column headers, thin-dash separator, data rows. Used for multi-row structured data.
- [ ] **RESULT ITEM** — `#id` + title on first line, pipe-separated metadata on second, content preview on third. Used for memory search results.
- [ ] **STATUS BAR** — Always last line, starts with `STATUS=`, space-separated `KEY=value` pairs. Machine-readable terminator on every output.
- [ ] **METRIC ROW** — Pipe-separated `label: value` pairs on a single line. Used for stats and counts.
- [ ] **ACTION MENU** — Section header labeled "Actions" followed by bracketed single-letter options. Used for interactive prompts.
- [ ] **INDICATOR SYSTEM** — `[ok]`, `[!!]`, `[FAIL]`, `[--]`, `[..]` — square-bracketed ASCII indicators, consistent across all commands.
- [ ] **PROGRESS/TIER DISPLAY** — `label:<N>` space-separated entries. Used for tier breakdowns.
- [ ] **BOX FRAME** — Square corners (`┌┐└┘`), single-line borders. Used sparingly: recovery summaries, confirmation prompts, critical warnings only.
- [ ] **EMPTY STATE** — 2-space indent, parenthesized message `(no results found)`. Used when no data is available.

### Phase 2: Apply to Each Command

Apply the design system to each live command doc. Update the output template sections within each file to use the shared components.

- [ ] **2A. Update `/memory:search`** — Treat `.opencode/command/memory/search.md` as the live retrieval and analysis surface and keep its output templates aligned with the shared design system.
- [ ] **2B. Update `/memory:save`** — Replace ad-hoc header and dividers with COMMAND HEADER. Replace key-value display with KEY-VALUE PAIR component. Replace post-save menu with ACTION MENU component.
- [ ] **2C. Update `/memory:manage`** — Apply design system to all subcommand outputs in `.opencode/command/memory/manage.md`: stats dashboard, scan output, cleanup table, tier change, trigger edit, validate, delete, health check, checkpoint operations, and `/memory:manage shared` flows.
- [ ] **2D. Update `/memory:learn`** — Apply design system to learning capture output, correction preview, and history listing.

### Phase 3: Verification

- [ ] Visual comparison of all live command outputs side-by-side
- [ ] Verify consistent COMMAND HEADER pattern across all commands
- [ ] Verify consistent SECTION HEADER divider style across all commands
- [ ] Verify all status lines follow `STATUS=<OK|FAIL> [KEY=value]...` format
- [ ] Verify zero emoji characters across the live memory command docs
- [ ] Verify all indicator usage matches INDICATOR SYSTEM (`[ok]`, `[!!]`, `[FAIL]`, `[--]`, `[..]`)
- [ ] Verify all action menus follow ACTION MENU format
- [ ] Verify empty state messages follow EMPTY STATE format
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual visual inspection | Each live command's output templates read and reviewed individually | Read tool + human review |
| Cross-command comparison | `/memory:search`, `/memory:save`, `/memory:manage`, and `/memory:learn` headers, dividers, status lines, and tables compared side-by-side | Read tool + manual diff |
| Edge case review | Empty states, long content truncation, action menus | Manual review against design system reference |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| No external dependencies | N/A | Green | N/A — documentation-only changes, no build system or runtime required |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Visual regression discovered post-update, readability degraded, or output templates break AI rendering
- **Procedure**: `git revert` the commit(s) affecting the command files; the live memory command docs return to their prior state in a single revert operation
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Design System) ──► Phase 2 (Apply to Commands) ──► Phase 3 (Verify)
```

Phase 1 must be fully stable before Phase 2 begins. Changes to the design system after Phase 2 starts require re-reviewing affected command files.

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1: Define Design System | None | Phase 2A–2D, Phase 3 |
| Phase 2A: /memory:search | Phase 1 | Phase 3 |
| Phase 2B: /memory:save | Phase 1 | Phase 3 |
| Phase 2C: /memory:manage | Phase 1 | Phase 3 |
| Phase 2D: /memory:learn | Phase 1 | Phase 3 |
| Phase 3: Verification | Phase 2A–2D | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
<!-- /ANCHOR:dependencies -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Define Design System (12 components) | Med | 1–2 sessions |
| Phase 2A: Apply to `/memory:search` | Med | 1 session |
| Phase 2B: Apply to `/memory:save` | Med | 1 session |
| Phase 2C: Apply to `/memory:manage` | Med | 1–2 sessions (largest file, most subcommand outputs, including `/memory:manage shared`) |
| Phase 2D: Apply to `/memory:learn` | Med | 1 session |
| Phase 3: Verification | Low | 1 session |
| **Total** | | **5–6 sessions** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] N/A — no deployment step; changes are documentation files committed to the repository
- [ ] Git commit made before changes begin (clean baseline)

### Rollback Procedure

1. Run `git log --oneline .opencode/command/memory/` to identify the commit(s) to revert
2. Run `git revert <commit-hash>` to restore affected command files to their prior state
3. Verify rollback by reading each file and confirming the previous output templates are restored
4. No stakeholder notification required — changes are internal CLI formatting only

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: N/A — no data layer touched, no migrations involved
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
