---
title: "Implementation Plan: 015 Residuals Restart"
description: "4-wave plan for 19 residuals across 6 clusters."
trigger_phrases: ["015 residuals plan"]
importance_tier: "critical"
contextType: "plan"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/019-system-hardening/006-015-residuals-restart"
    last_updated_at: "2026-04-18T23:50:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Plan scaffolded"
    next_safe_action: "Dispatch implementation"
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

4-wave sequential dispatch per 019/001/002 recommendation.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Delta review converged with clustered residual backlog

### Definition of Done
- [ ] All 19 residuals closed
- [ ] Per-wave regression green
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Additive bug fixes, no architecture changes.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: W0+A — C1 DB boundary + C3 resume minimal
- [ ] Fix realpath escape enforcement in config.ts
- [ ] Fix late-env-override drift
- [ ] Fix session_resume minimal contract
- [ ] Regression tests per finding

### Phase 2: W0+B — C4 review-graph
- [ ] Fix coverage_gaps semantics
- [ ] Fix coverage_gaps/uncovered_questions collapse
- [ ] Fix status fail-open
- [ ] Regression tests

### Phase 3: W0+C — C2 advisor degraded-state
- [ ] Fix corrupt source-metadata fail-open
- [ ] Fix continuation-record degraded visibility
- [ ] Fix cache-health false-green
- [ ] Regression tests

### Phase 4: W0+D — C5 docs + C6 hygiene
- [ ] Update mcp-code-mode README
- [ ] Update folder_routing.md
- [ ] Update troubleshooting.md, AUTO_SAVE_MODE reference
- [ ] Fix sk-code-full-stack path + cli-copilot duplicate tail
- [ ] Fix save-quality-gate whitespace triggers
- [ ] Fix session-prime regression hiding

### Phase 5: Verification
- [ ] Full test suite green
- [ ] validate.sh --strict green on updated docs
- [ ] Checklist verified
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
