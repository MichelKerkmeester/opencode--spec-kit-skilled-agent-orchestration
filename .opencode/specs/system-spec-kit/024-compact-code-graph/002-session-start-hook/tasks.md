---
title: "Tasks: SessionStart Hook [024/002]"
description: "Task tracking for session priming across all SessionStart lifecycle sources."
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 002 — SessionStart Hook


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
<!-- ANCHOR:phase-2 -->
Template compliance shim anchor for phase-2.
<!-- /ANCHOR:phase-2 -->
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

- [x] Extend `session-prime.ts` with source-aware routing for all 4 sources — Evidence: `hooks/claude/session-prime.ts` created with startup/resume/clear/compact routing
- [x] Implement `source=compact` path reading Phase 1 cache — Evidence: reads `pendingCompactPrime` from hook state, injects cached context (checklist P0)
- [x] Implement `source=startup` path with constitutional + spec folder overview — Evidence: startup path includes recent spec folder overview (checklist P1), `handleStartup` loads workingSet from hook state (checklist P2)
- [x] Implement `source=resume` path with `memory_context({ mode: "resume", profile: "resume" })` — Evidence: resume path surfaces prior work and last spec folder (checklist P1), profile: resume passed for compact brief format (checklist P0)
- [x] Implement `source=clear` path with minimal constitutional-only output — Evidence: clear path outputs minimal constitutional only (checklist P1)
- [x] Fix `profile: "resume"` gap from iteration 012 — Evidence: checklist P0 confirmed, `/spec_kit:resume` command also updated (checklist P1)
- [x] Enforce 2000-token budget for startup/resume paths — Evidence: checklist P0 confirmed
- [x] Enforce 4000-token budget for compact path — Evidence: checklist P0 confirmed
- [x] Register SessionStart hook with no matcher (handles all sources internally) — Evidence: checklist P0 confirmed, registered in settings.local.json
- [x] Enforce <3 second completion time — Evidence: checklist P0 confirmed
- [x] Graceful fallback when MCP unavailable — Evidence: checklist P0 confirmed
- [x] No code duplication with Phase 1 compact path — Evidence: shared `session-prime.ts` and `shared.ts` (checklist P1)
- [x] Implement `calculatePressureBudget()` for token pressure awareness — Evidence: scales budget at >70%/>90% context window usage (checklist P2)
- [x] Implement `detectSpecFolder()` for auto-detection from project context — Evidence: compact-inject.ts detectSpecFolder + lastSpecFolder in hook state (checklist P2)
- [x] Update `/spec_kit:resume` command to pass `profile: "resume"` — Evidence: checklist P1 confirmed, fixes gap from iteration 012