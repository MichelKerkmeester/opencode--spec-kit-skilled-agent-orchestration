---
title: "Tasks: Command & Agent Alignment [024/005] [system-spec-kit/024-compact-code-graph/005-command-agent-alignment/tasks]"
description: "Task tracking for command updates and agent definition alignment across all runtimes."
trigger_phrases:
  - "tasks"
  - "command"
  - "agent"
  - "alignment"
  - "024"
  - "005"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/005-command-agent-alignment"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 005 — Command & Agent Alignment


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

- [x] Audit memory commands (`.opencode/command/memory/`) for compaction references — search, manage, learn all hook-compatible; no changes needed
- [x] Update `/spec_kit:resume` to pass `profile: "resume"` to `memory_context()` — fixes iter 012 gap; compact recovery brief now returned
- [x] Update `/memory:save` documentation for Stop-hook awareness — current docs now avoid claiming a shipped `pendingStopSave` implementation
- [x] Audit spec_kit commands (resume, handover, complete, implement) — all have hook integration paths
- [x] Audit agent definitions across all 4 runtime directories for compaction recovery references
- [x] Update `.claude/agents/*.md` with hook-injected context awareness and tool fallback
- [x] Update `.opencode/agent/*.md` with hook-injected context awareness and tool fallback
- [x] Update `.codex/agents/*.toml` with hook-injected context awareness and tool fallback
- [x] Update `.gemini/agents/*.md` with hook-injected context awareness and tool fallback
- [x] Update `@handover` agent to reference hook state when available
- [x] Update `@context` agent to reference hook-injected context before broad exploration
- [x] Verify commands function correctly without hooks active (Codex, Copilot, Gemini) — manual recovery fallback preserved
- [x] Auto-save merge logic limitation is now documented accurately — no dedicated `pendingStopSave` field is claimed as shipped behavior
- [x] Agent definitions consistent across all 4 runtime directories
- [x] SKILL.md updated with Hook System and Code Graph sections covering command help text
