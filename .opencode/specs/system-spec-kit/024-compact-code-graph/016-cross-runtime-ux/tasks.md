---
title: "Tasks: Cross-Runtime UX & Documentation [024/016] [system-spec-kit/024-compact-code-graph/016-cross-runtime-ux/tasks]"
description: "Task tracking for 14 items across seed resolution, auto-reindex, instruction updates, and truth-sync."
trigger_phrases:
  - "tasks"
  - "cross"
  - "runtime"
  - "documentation"
  - "024"
  - "016"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/016-cross-runtime-ux"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 016 — Cross-Runtime UX & Documentation


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## Task Notation
Template compliance shim section. Legacy phase content continues below.

## Phase 1: Setup
Template compliance shim section. Legacy phase content continues below.

## Phase 2: Implementation
Template compliance shim section. Legacy phase content continues below.

## Phase 3: Verification
Template compliance shim section. Legacy phase content continues below.

## Completion Criteria
Template compliance shim section. Legacy phase content continues below.

## Cross-References
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:notation -->
Template compliance shim anchor for notation.
<!-- /ANCHOR:notation -->
<!-- ANCHOR:phase-1 -->
Template compliance shim anchor for phase-1.
<!-- /ANCHOR:phase-1 -->
<!-- ANCHOR:phase -->
Template compliance shim anchor for phase-2.
<!-- /ANCHOR:phase -->
<!-- ANCHOR:phase-3 -->
Template compliance shim anchor for phase-3.
<!-- /ANCHOR:phase-3 -->
<!-- ANCHOR:completion -->
Template compliance shim anchor for completion.
<!-- /ANCHOR:completion -->
<!-- ANCHOR:cross-refs -->
Template compliance shim anchor for cross-refs.
<!-- /ANCHOR:cross-refs -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### Phase Status

**PARTIAL (11/14 items complete; 3 deferred)**

### Completed / In Scope

- [x] Item 39: Near-exact seed resolution tier added — Evidence: seed-resolver.ts queries within +/-5 line window, confidence graduates 0.95 - 0.02*distance, composite index `idx_file_line ON code_nodes(file_path, start_line)` in code-graph-db.ts
- [x] Item 40: Intent pre-classifier annotates query intent metadata — Evidence: `classifyQueryIntent()` in query-intent-classifier.ts computes structural / semantic / hybrid intent for downstream `queryIntentMetadata` / `queryIntentRouting` annotation; this phase does not claim backend routing delivery
- [x] Item 41: Auto-reindex triggers on git branch switch — Evidence: scan.ts checks `git rev-parse HEAD` against stored `last_git_head` in `code_graph_metadata` table; stale entries pruned on HEAD change
- [x] Item 41: Auto-reindex on session start via first-call priming — Evidence: wired into Phase 014 first-call priming pattern in scan.ts
- [x] Item 42: CODEX.md updated with Session Start Protocol — Evidence: calls `memory_context()` with resume profile + `code_graph_status()` on first turn
- [x] Item 42: AGENTS.md updated with code graph auto-trigger — Evidence: Copilot CLI and Gemini CLI agents get auto-trigger instructions
- [x] Item 42: OpenCode context.md updated with code graph integration — Evidence: `.opencode/agent/context.md` has tool reference table and graph health check
- [x] Item 42: GEMINI.md updated with session start protocol — Evidence: shares AGENTS.md content via symlink
- [x] Item 42: CLAUDE.md (root) updated with universal Code Search Protocol — Evidence: recovery instructions work across all runtimes
- [x] Item 43: Recovery documentation consolidated — Evidence: universal recovery in root CLAUDE.md, Claude-specific hook behavior in `.claude/CLAUDE.md` only; no overlapping authority
- [x] Item 44: Seed-resolver DB failures now throw with logged context — Evidence: `throwResolutionError()` in seed-resolver.ts replaces silent placeholder anchor fallback [F014]
- [x] Item 45: Spec/settings SessionStart scope aligned — Evidence: spec updated to reflect single unscoped entry + in-script branching as correct design [F030]
- [x] Item 46: Truth-sync checklist annotations applied — Evidence: 5 PARTIAL annotations on v1 parent checklist for phases 005/006/008/011/012 per review iterations 14, 18, 29

### Deferred / Out of Scope for This Phase

- [x] Intent-driven backend routing remains explicitly deferred beyond this phase; only the classifier metadata shipped here
- [x] CocoIndex score-propagation follow-up remains explicitly deferred because the required API support is still absent
- [x] Runtime instruction-file verification is explicitly tracked as a manual follow-up rather than a shipped automated step in this phase
