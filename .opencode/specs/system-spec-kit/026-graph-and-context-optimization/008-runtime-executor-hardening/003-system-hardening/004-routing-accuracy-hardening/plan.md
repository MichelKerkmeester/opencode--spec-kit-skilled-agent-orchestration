---
title: "Implementation Plan: Routing Accuracy Hardening"
description: "2-wave plan: advisor normalization, Gate 3 deep-loop markers. Wave C optional."
trigger_phrases: ["routing accuracy plan"]
importance_tier: "critical"
contextType: "plan"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/004-routing-accuracy-hardening"
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
- [x] Wave A + B land with target accuracy gain [Evidence: Wave A advisor 60.0%; Wave B Gate 3 F1 84.9%; final Wave C Gate 3 F1 97.66%]
- [x] No regression on historical false-positives [Evidence: final corpus historical false-positive regressions 0]
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Additive rule changes. Both Waves are independent; can run in parallel. Wave C deferred pending re-measurement.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Wave A — Advisor normalization
- [x] Add command-bridge → owning-skill mapping in skill_advisor.py [Evidence: `COMMAND_BRIDGE_OWNER_NORMALIZATION`]
- [x] Add explicit-invocation guard (quoted command + implementation-target carve-outs) [Evidence: T243-SA-018]
- [x] Regression: 200-prompt corpus, accuracy ≥ 60% [Evidence: advisor accuracy 60.0%]

### Phase 2: Wave B — Gate 3 deep-loop markers
- [x] Extend classifyPrompt() positive trigger list with deep-loop markers [Evidence: expanded `RESUME_TRIGGERS`]
- [x] Regression: 200-prompt corpus, Gate 3 F1 ≥ 83%, no `analyze/decompose/phase` regression [Evidence: final Gate 3 F1 97.66%; historical regressions 0]

### Phase 3: Re-measurement
- [x] Compute joint matrix after Wave A+B [Evidence: Wave B TT 105 / FT 15 / FF 22]
- [x] Compare to research projection: TT≥108, FT≤12, FF≤15 [Evidence: final TT 115 / FT 5 / FF 1]
- [x] Decide Wave C based on residual FF mass [Evidence: Wave C shipped because Wave B FF 22 > 20]

### Phase 4: Optional Wave C (conditional)
- [x] Add resume/context markers [Evidence: `resume the packet`, `resume the phase folder`, `reconstruct continuity`]
- [x] Add mixed-tail write exception [Evidence: `hasMixedWriteTail()` with precision guards]

### Phase 5: Verification
- [x] Full regression suite green [Evidence: advisor PASS 44/44; Gate 3 Vitest PASS 47/47; final corpus overall_pass true]
- [x] Checklist verified [Evidence: checklist.md status Passed]
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
