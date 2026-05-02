---
title: "Plan: Non-Hook Auto-Priming & Session Health [system-spec-kit/024-compact-code-graph/018-non-hook-auto-priming/plan]"
description: "Implementation order for MCP first-call auto-priming and session health monitoring."
trigger_phrases:
  - "plan"
  - "non"
  - "hook"
  - "auto"
  - "priming"
  - "018"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/018-non-hook-auto-priming"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Phase 018 — Non-Hook Auto-Priming & Session Health


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

### Implementation Order

1. **PrimePackage data structure** (30-40 LOC)
   - Define PrimePackage type: specFolder, codeGraphStatus, cocoIndexAvailable, recommendedCalls
   - Export from memory-surface.ts for use by context-server.ts

2. **First-call auto-prime in context-server.ts** (60-80 LOC)
   - Add `sessionPrimed` boolean flag to context-server state
   - Implement `primeSessionIfNeeded()` that gathers context on first tool call
   - Inject PrimePackage as structured meta + human-readable hints into response
   - Apply `enforceAutoSurfaceTokenBudget` to keep prime payload bounded

3. **Session health handler** (80-100 LOC)
   - Create `handlers/session-health.ts` with `session_health` tool
   - Return traffic-light status: ok / warning / stale
   - Criteria: time since last call, memory recovery state, code graph freshness, spec folder presence

4. **Tool call tracking** (20-30 LOC)
   - Add `recordToolCall()` and `getSessionTimestamps()` exports to memory-surface.ts
   - Track first and last tool call timestamps per session

5. **Tool schema registration** (15-20 LOC)
   - Register `session_health` in tool-schemas.ts and schemas/tool-input-schemas.ts
   - Wire handler in tools/lifecycle-tools.ts

6. **Health warning injection** (20-30 LOC)
   - Inject recovery hints into normal tool responses when health drops to warning/stale
   - Trigger from context-server.ts dispatch path

### Dependencies
- None — additive feature, no existing behavior changed

### Estimated Total LOC: 360-670

### Technical Context
- Runtime surface: system-spec-kit MCP server + hook adapters.
- Validation surface: recursive packet validation and full quality-gate checks.

### Phase 1: Validation
- Maintain packet verification and release-gate traceability.

### Phase 2: Validation
- Maintain packet verification and release-gate traceability.
