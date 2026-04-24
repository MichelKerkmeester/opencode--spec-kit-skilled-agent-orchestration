---
title: "Tasks: Cross-Runtime Instruction [system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity/tasks]"
description: "Task tracking for instruction file parity and @context-prime agent."
trigger_phrases:
  - "tasks"
  - "cross"
  - "runtime"
  - "instruction"
  - "021"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/021-cross-runtime-instruction-parity"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 021 — Cross-Runtime Instruction Parity


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

### Completed

- [x] No Hook Transport section added to CODEX.md — trigger table with session/resume/compaction flows
- [x] No Hook Transport section added to AGENTS.md — trigger table with code graph auto-trigger
- [x] No Hook Transport section added to GEMINI.md — trigger table adapted for Gemini lifecycle
- [x] @context-prime agent created — .opencode/agent/context-prime.md (227 lines) with `session_resume()` plus optional `session_health()`
- [x] @context-prime added to CLAUDE.md Agent Definitions — entry in agent routing table
- [x] Session lifecycle guidance documented — AGENTS.md defines `@context-prime` and includes No Hook Transport guidance
- [x] F059: Orchestrator delegation to @context-prime verified — `.opencode/agent/orchestrate.md` lines 18-21 delegate on first turn or after `/clear`

### Deferred

- [x] Residual Claude-hook wording cleanup in non-Claude agent files is now complete in `.codex/agents/*.toml` and `.gemini/agents/*.md`
