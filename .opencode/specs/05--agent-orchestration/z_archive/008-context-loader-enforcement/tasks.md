---
title: "Tasks: Aggressive @context_loader Enforcement [008-context-loader-enforcement/tasks]"
description: "Objective: Search all agent files in .opencode/agent/ for @explore references (excluding context_loader.md)"
trigger_phrases:
  - "tasks"
  - "aggressive"
  - "context"
  - "loader"
  - "enforcement"
  - "008"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Aggressive @context_loader Enforcement

> **Spec Folder:** `.opencode/specs/05--agent-orchestration/z_archive/008-context-loader-enforcement/`
> **Created:** 2026-02-11

---

<!-- ANCHOR:notation -->
## Task List

| # | Task | Status | Priority | Depends On |
|---|------|--------|----------|------------|
| T1 | Audit all agent files for @explore references | ✅ Done | P0 | — |
| T2 | Audit all command files for @explore references | ✅ Done | P0 | — |
| T3 | Deep-read orchestrate.md explore refs in context | ✅ Done | P0 | — |
| T4 | Apply aggressive replacements | ✅ Done (no changes needed) | P0 | T1-T3 |
| T5 | Update spec folder with results | ✅ Done | P1 | T4 |

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Task Details

### T1: Audit All Agent Files ✅

**Objective**: Search all agent files in `.opencode/agent/` for @explore references (excluding context_loader.md)
**Method**: Grep + contextual read across 8 agent files
**Findings**:
- **research.md** line 39: "Explore existing code patterns" — generic English verb, NOT an agent reference. **KEEP**
- **orchestrate.md**: 11 occurrences across 8 lines — ALL already aggressively enforced (see T3)
- **review.md, debug.md, speckit.md, write.md, handover.md**: Zero matches

**Result**: 0 replacements needed in non-orchestrate agent files

<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
### T2: Audit All Command Files ✅

**Objective**: Search all command files in `.claude/commands/` and `.opencode/command/` for @explore references
**Method**: Grep across 38+ files in both directories
**Findings** (113 total matches):

| Category | Count | Description | Verdict |
|----------|-------|-------------|---------|
| `subagent_type: "explore"` | 4 | Literal Task tool parameter in YAML | KEEP — code value |
| Role/name labels | 52 | `role: "architecture_explorer"`, `name: "pattern_explorer"` etc. | KEEP — descriptive |
| Natural language verb | 40 | "Explore the codebase...", "Explored alternatives?" | KEEP — English word |
| Documentation labels | 17 | "Architecture Explorer — Project structure..." | KEEP — documentation |

**Result**: 0 replacements needed. No routing recommendations or agent dispatch directives found.

<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
### T3: Deep-Read orchestrate.md ✅

**Objective**: Re-examine all @explore references with aggressive enforcement lens
**Key Finding**: The old 9 "intentional" references from spec 007 are **GONE**. orchestrate.md has ALREADY been aggressively updated (likely in an intermediate session). Current state:

| Line | Content | Category |
|------|---------|----------|
| 130 | Built-in subagent_type table with "use @context_loader instead" warning | Factual + enforcement |
| 151 | "REQUIRED — never dispatch @explore directly" | Enforcement |
| 202 | **Rule 4: Never Dispatch @explore Directly** | Enforcement (NEW) |
| 204-205 | "ALWAYS dispatch @context_loader, NEVER @explore directly" + reasoning | Enforcement |
| 212 | Two-Tier Model: "@context_loader internally dispatches @explore" | Factual mechanism |
| 424 | "Explore Toast Patterns" — generic verb, routed to @context_loader on line 426 | English verb |
| 647 | "@explore is a built-in subagent type used only internally by @context_loader" | Factual summary |

**Result**: 0 replacements needed. Already aggressively enforced with explicit Rule 4.

<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:phase-4 -->
### T4: Apply Replacements ✅

**Objective**: Apply aggressive @context_loader replacements based on audit findings
**Result**: **No changes required.** All three audits (T1-T3) confirmed the codebase is already clean:
- orchestrate.md already has Rule 4 ("Never Dispatch @explore Directly")
- All old problematic references (example outputs, templates, routing) already replaced
- Command files contain only legitimate uses (Task tool params, role labels, English verbs)
- Other agent files contain zero @explore agent references

<!-- /ANCHOR:phase-4 -->

<!-- ANCHOR:completion -->
### T5: Update Spec Folder ✅

**Objective**: Document audit results in spec folder
**Deliverable**: This tasks.md with complete findings

<!-- /ANCHOR:completion -->
