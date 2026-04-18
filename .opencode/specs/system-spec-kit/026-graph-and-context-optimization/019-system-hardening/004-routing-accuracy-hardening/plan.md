---
title: "Implementation Plan: Routing Accuracy Hardening"
description: "2-wave plan: advisor normalization, Gate 3 deep-loop markers. Wave C optional."
trigger_phrases: ["routing accuracy plan"]
importance_tier: "critical"
contextType: "plan"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/019-system-hardening/004-routing-accuracy-hardening"
    last_updated_at: "2026-04-18T23:45:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Plan scaffolded"
    next_safe_action: "Dispatch implementation"
---
# Implementation Plan: Routing Accuracy Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Stack** | TypeScript (gate-3) + Python (skill-advisor) |
| **Regression fixture** | corpus/labeled-prompts.jsonl (from 019/001/005 research) |

### Overview

Land Wave A + Wave B. Measure corpus delta. Decide Wave C based on residual error mass.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Research converged with ranked proposals + measured gains
- [x] Labeled corpus available as regression fixture

### Definition of Done
- [ ] Wave A + B land with target accuracy gain
- [ ] No regression on historical false-positives
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Additive rule changes. Both Waves are independent; can run in parallel. Wave C deferred pending re-measurement.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Wave A — Advisor normalization
- [ ] Add command-bridge → owning-skill mapping in skill_advisor.py
- [ ] Add explicit-invocation guard (quoted command + implementation-target carve-outs)
- [ ] Regression: 200-prompt corpus, accuracy ≥ 60%

### Phase 2: Wave B — Gate 3 deep-loop markers
- [ ] Extend classifyPrompt() positive trigger list with deep-loop markers
- [ ] Regression: 200-prompt corpus, Gate 3 F1 ≥ 83%, no `analyze/decompose/phase` regression

### Phase 3: Re-measurement
- [ ] Compute joint matrix after Wave A+B
- [ ] Compare to research projection: TT≥108, FT≤12, FF≤15
- [ ] Decide Wave C based on residual FF mass

### Phase 4: Optional Wave C (conditional)
- [ ] Add resume/context markers
- [ ] Add mixed-tail write exception

### Phase 5: Verification
- [ ] Full regression suite green
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
| Unit | Classifier fold/guard logic | vitest / pytest |
| Regression | 200-prompt corpus | scripts |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| 019/001/005 research + corpus | Input | Converged |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Wave A: revert normalization logic, restore pre-change advisor
- Wave B: remove added positive triggers
- Both are independent reverts with no data migration
<!-- /ANCHOR:rollback -->
