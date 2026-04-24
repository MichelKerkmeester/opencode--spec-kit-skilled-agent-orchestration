---
title: "Tasks: Gemini CLI Hook Porting [024/022] [system-spec-kit/024-compact-code-graph/022-gemini-hook-porting/tasks]"
description: "Task tracking for Gemini CLI hook implementation."
trigger_phrases:
  - "tasks"
  - "gemini"
  - "cli"
  - "hook"
  - "porting"
  - "022"
importance_tier: "normal"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/022-gemini-hook-porting"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["tasks.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 022 — Gemini CLI Hook Porting


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

- [x] Shared utilities — hooks/gemini/shared.ts (89 lines): parseGeminiStdin, formatGeminiOutput, GeminiHookInput/Output types
- [x] Session Prime (SessionStart) — hooks/gemini/session-prime.ts (165 lines): detects startup/resume/clear, outputs JSON additionalContext
- [x] Compact Cache (PreCompress) — hooks/gemini/compact-cache.ts (137 lines): caches context to temp file before compression, but `tailFile()` still uses unbounded `readFileSync`
- [x] Compact Inject (BeforeAgent) — hooks/gemini/compact-inject.ts (82 lines): reads cached context, injects sanitized payload (F055 fixed)
- [x] Session Stop (SessionEnd) — hooks/gemini/session-stop.ts (113 lines): runs on a single `SessionEnd` hook, saves session state, and only provides partial token tracking because Gemini transcript token usage is not parsed
- [x] Nested spec detection guard documented — `session-stop.ts` regex only captures shallow `.opencode/specs/<segment>/<segment>/` paths, so deeper phase paths can be truncated
- [x] Settings registration verified against the active workspace `.gemini/settings.json`
 
### Open / Deferred

- [x] F056 transcript-size hardening gap remains explicitly documented as still incomplete
- [x] Workspace-path verification for `.gemini/settings.json` is now complete for the active repo
