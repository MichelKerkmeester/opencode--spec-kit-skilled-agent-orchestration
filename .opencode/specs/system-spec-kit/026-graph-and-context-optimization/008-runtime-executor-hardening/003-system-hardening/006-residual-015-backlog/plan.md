---
title: "Implementation Plan: 015 Residuals Restart"
description: "4-wave plan for 19 residuals across 6 clusters."
trigger_phrases: ["015 residuals plan"]
importance_tier: "critical"
contextType: "plan"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/006-residual-015-backlog"
    last_updated_at: "2026-04-19T01:00:00+02:00"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Residual implementation and strict validation completed"
    next_safe_action: "Run orchestrator-owned commit handoff"
---
# Implementation Plan: 015 Residuals Restart

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Stack** | TypeScript (MCP server) + Python (advisor) + Markdown (docs) |
| **Clusters** | 6 (across 19 residuals) |

### Overview

4-wave sequential dispatch per 019/001/002 recommendation. All waves are implemented; commit and push remain orchestrator-owned per dispatch constraint.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Delta review converged with clustered residual backlog

### Definition of Done
- [x] All 19 residuals closed
- [x] Per-wave regression green
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Additive bug fixes, no architecture changes.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: W0+A — C1 DB boundary + C3 resume minimal
- [x] Fix realpath escape enforcement in config.ts
- [x] Fix late-env-override drift
- [x] Fix session_resume minimal contract
- [x] Regression tests per finding

### Phase 2: W0+B — C4 review-graph
- [x] Fix coverage_gaps semantics
- [x] Fix coverage_gaps/uncovered_questions collapse
- [x] Fix status fail-open
- [x] Regression tests

### Phase 3: W0+C — C2 advisor degraded-state
- [x] Fix corrupt source-metadata fail-open
- [x] Fix continuation-record degraded visibility
- [x] Fix cache-health false-green
- [x] Regression tests

### Phase 4: W0+D — C5 docs + C6 hygiene
- [x] Update mcp-code-mode README
- [x] Update folder_routing.md
- [x] Update troubleshooting.md, AUTO_SAVE_MODE reference
- [x] Fix sk-code-full-stack path + cli-copilot duplicate tail
- [x] Fix save-quality-gate whitespace triggers
- [x] Fix session-prime regression hiding

### Phase 5: Verification
- [x] Targeted regression suite and final build green
- [x] validate.sh --strict green on updated docs
- [x] Checklist verified
<!-- /ANCHOR:phases -->

### 4.1 Dispatch Command
```
/spec_kit:implement :auto --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --executor-timeout=1800
```

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Per-cluster regression | each residual | vitest / pytest |
| Doc validation | C5 docs | validate.sh |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| 019/001/002 review | Input | Converged |
| Phase 016/017/018 primitives | Source | Live |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Per-wave revert granularity
<!-- /ANCHOR:rollback -->
