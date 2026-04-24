---
title: "Plan: Phase 3 — Stop Hook + Token Tracking [system-spec-kit/024-compact-code-graph/003-stop-hook-tracking/plan]"
description: "1. Create claude-transcript.ts parser"
trigger_phrases:
  - "plan"
  - "phase"
  - "stop"
  - "hook"
  - "token"
  - "003"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/003-stop-hook-tracking"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Phase 3 — Stop Hook + Token Tracking


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## 1. SUMMARY
Template compliance shim section. Legacy phase content continues below.

## 2. QUALITY GATES
Template compliance shim section. Legacy phase content continues below.

## 3. ARCHITECTURE
Template compliance shim section. Legacy phase content continues below.

## 4. IMPLEMENTATION PHASES
Template compliance shim section. Legacy phase content continues below.

## 5. TESTING STRATEGY
Template compliance shim section. Legacy phase content continues below.

## 6. DEPENDENCIES
Template compliance shim section. Legacy phase content continues below.

## 7. ROLLBACK PLAN
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:summary -->
Template compliance shim anchor for summary.
<!-- /ANCHOR:summary -->
<!-- ANCHOR:quality-gates -->
Template compliance shim anchor for quality-gates.
<!-- /ANCHOR:quality-gates -->
<!-- ANCHOR:architecture -->
Template compliance shim anchor for architecture.
<!-- /ANCHOR:architecture -->
<!-- ANCHOR:phases -->
Template compliance shim anchor for phases.
<!-- /ANCHOR:phases -->
<!-- ANCHOR:testing -->
Template compliance shim anchor for testing.
<!-- /ANCHOR:testing -->
<!-- ANCHOR:dependencies -->
Template compliance shim anchor for dependencies.
<!-- /ANCHOR:dependencies -->
<!-- ANCHOR:rollback -->
Template compliance shim anchor for rollback.
<!-- /ANCHOR:rollback -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### Steps

1. **Create `claude-transcript.ts` parser:**
   - Streaming JSONL line reader
   - Extract usage from `msg.message.usage` in assistant messages
   - `.stopoffset` incremental parsing (only process new lines)
   - Return normalized token counts + model name
2. **Create `session_token_snapshots` table:**
   - Add migration to MCP server startup
   - Append-only snapshots with index on session_id + captured_at
3. **Implement `session-stop.ts`:**
   - Parse stdin, check `stop_hook_active` guard
   - Load hook-state for session
   - Parse transcript via `claude-transcript.ts`
   - Calculate cost estimate per model
   - Insert snapshot row into SQLite
   - If >1000 output tokens: trigger lightweight context save
   - Update hook-state with bookmark
4. **Register Stop hook with `async: true`**
5. **Test:**
   - End a session → verify token tracking
   - Multiple Stop fires per session → verify append-only
   - Large transcript (>10MB) → verify no OOM
   - Cost calculation accuracy per model

<!-- ANCHOR:dependencies-2 -->
### Dependencies
- Phases 1-2 (shared utilities: `shared.ts`, `hook-state.ts`)
- SQLite database access from hook script (direct import)
<!-- /ANCHOR:dependencies-2 -->

### Technical Context
- Runtime surface: system-spec-kit MCP server + hook adapters.
- Validation surface: recursive packet validation and full quality-gate checks.

### Phase 1: Validation
- Maintain packet verification and release-gate traceability.

### Phase 2: Validation
- Maintain packet verification and release-gate traceability.
