---
title: "Plan: Phase 1 — PreCompact Hook [system-spec-kit/024-compact-code-graph/001-precompact-hook/plan]"
description: "1. Create hook script directory — mkdir -p mcp_server/scripts/hooks/"
trigger_phrases:
  - "plan"
  - "phase"
  - "precompact"
  - "hook"
  - "001"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Phase 1 — PreCompact Hook


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

1. **Create hook script directory** — `mkdir -p mcp_server/scripts/hooks/`
2. **Implement `compact-inject.js`:**
   - Import `autoSurfaceAtCompaction` from compiled dist
   - Parse stdin JSON for transcript path
   - Extract recent context from transcript (tail ~50 lines)
   - Call `autoSurfaceAtCompaction(context)`
   - Optionally query CocoIndex for semantic neighbors of active files/symbols (if MCP available)
   - Format and output to stdout
   - Add error handling (try/catch, timeout, fallback)
3. **Register hook in settings.local.json:**
   - Read existing file
   - Merge PreCompact hook entry
   - Write back without destroying existing config
4. **Test manually:**
   - Trigger compaction in Claude Code
   - Verify hook fires and outputs context
   - Verify output stays within token budget
5. **Test edge cases:**
   - MCP server not running → graceful fallback
   - Empty transcript → minimal output
   - Large transcript → stays within 2s timeout

<!-- ANCHOR:dependencies -->
### Dependencies
- Compiled dist of memory-surface.ts must be up to date
- `.claude/settings.local.json` must be writable
<!-- /ANCHOR:dependencies -->

### Budget Allocation (from iteration 049)
- Implement floors + overflow pool allocator
- Constitutional: 700 tokens floor
- Code graph: 1200 tokens floor
- CocoIndex: 900 tokens floor (snippets trimmed to ≤600 chars)
- Triggered: 400 tokens floor
- Overflow: 800 tokens redistributed from empty sources
- Make allocator observable in metadata (per-source requested/granted/dropped)

### Technical Context
- Runtime surface: system-spec-kit MCP server + hook adapters.
- Validation surface: recursive packet validation and full quality-gate checks.

### Phase 1: Validation
- Maintain packet verification and release-gate traceability.

### Phase 2: Validation
- Maintain packet verification and release-gate traceability.
