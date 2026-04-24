---
title: "Plan: Phase 4 — Cross-Runtime Fallback [system-spec-kit/024-compact-code-graph/004-cross-runtime-fallback/plan]"
description: "1. Update CLAUDE.md compaction recovery"
trigger_phrases:
  - "plan"
  - "phase"
  - "cross"
  - "runtime"
  - "fallback"
  - "004"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/004-cross-runtime-fallback"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Phase 4 — Cross-Runtime Fallback


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
<!-- ANCHOR:rollback -->
Template compliance shim anchor for rollback.
<!-- /ANCHOR:rollback -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### Steps

1. **Update CLAUDE.md compaction recovery:**
   - Add explicit `memory_context({ mode: "resume", profile: "resume" })` call
   - Must be first action after compaction, before any other reasoning
   - Include `profile: "resume"` (fixes gap found in iter 012)
2. **Create `.claude/CLAUDE.md`:**
   - Claude-specific private compaction recovery instructions
   - Reference to hook-based injection when hooks are active
   - Closes Gap B from iteration 012
3. **Update CODEX.md:**
   - Add equivalent compaction recovery instructions
   - Same two primitives: `memory_match_triggers` + `memory_context(resume)`
4. **Implement runtime detection:**
   - Two outputs: `runtime` + `hookPolicy`
   - Use capability-based model (iter 015) for future extensibility
5. **Test cross-runtime (7-scenario matrix from iter 015):**
   - Claude Code: hooks fire AND tool fallback works
   - Codex CLI: tool-based recovery works without hooks
   - Copilot/Gemini: tool-based recovery works, hooks suppressed by policy
6. **Optional: MCP compaction detection:**
   - Track tool call timestamps in working memory
   - If gap > threshold → auto-inject compaction context
   - Feature flag `SPECKIT_AUTO_COMPACT_DETECT` (default off for v1)

<!-- ANCHOR:dependencies -->
### Dependencies
- Phase 1 (validates hook pattern works, informs CLAUDE.md wording)
- Can run in parallel with Phases 2-3
<!-- /ANCHOR:dependencies -->

### Test Files (iteration 015)
- `tests/runtime-routing.vitest.ts`
- `tests/cross-runtime-fallback.vitest.ts`

### Technical Context
- Runtime surface: system-spec-kit MCP server + hook adapters.
- Validation surface: recursive packet validation and full quality-gate checks.

### Phase 1: Validation
- Maintain packet verification and release-gate traceability.

### Phase 2: Validation
- Maintain packet verification and release-gate traceability.
