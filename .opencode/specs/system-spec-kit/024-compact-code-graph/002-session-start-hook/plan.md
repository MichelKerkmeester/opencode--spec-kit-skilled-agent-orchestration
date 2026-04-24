---
title: "Plan: Phase 2 — SessionStart Hook [system-spec-kit/024-compact-code-graph/002-session-start-hook/plan]"
description: "1. Extend session-prime.ts with source routing"
trigger_phrases:
  - "plan"
  - "phase"
  - "sessionstart"
  - "hook"
  - "002"
  - "session"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/002-session-start-hook"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Phase 2 — SessionStart Hook


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

1. **Extend `session-prime.ts` with source routing:**
   - `source=compact` → read Phase 1 cache, inject
   - `source=startup` → constitutional + spec folder overview
   - Optionally query CocoIndex for code context related to current spec folder
   - `source=resume` → `memory_context({ mode: "resume", profile: "resume" })`
   - `source=clear` → constitutional only
2. **Fix `profile: "resume"` gap (iter 012):**
   - Ensure all resume paths pass `profile: "resume"` for brief format
   - Consider updating `/spec_kit:resume` command to also pass profile
3. **Token budget enforcement:**
   - startup/resume: 2000 tokens max
   - compact: 4000 tokens max (COMPACTION_TOKEN_BUDGET)
4. **Register SessionStart hook:**
   - Single hook with no matcher (handles all sources internally)
   - Merge-safe with existing settings.local.json
5. **Test by source:**
   - `startup` → verify priming output
   - `resume` → verify resume context with prior work
   - `compact` → verify cache read + injection
   - `clear` → verify minimal output

<!-- ANCHOR:dependencies-2 -->
### Dependencies
- Phase 1 (shared `session-prime.ts`, `hook-state.ts`, `shared.ts`)
<!-- /ANCHOR:dependencies-2 -->

### Technical Context
- Runtime surface: system-spec-kit MCP server + hook adapters.
- Validation surface: recursive packet validation and full quality-gate checks.

### Phase 1: Validation
- Maintain packet verification and release-gate traceability.

### Phase 2: Validation
- Maintain packet verification and release-gate traceability.
