---
title: "Implementation Plan: 020 Extended Research (cli-copilot)"
description: "Dispatch plan for 10-iteration extended research wave."
trigger_phrases: ["020 extended plan"]
importance_tier: "critical"
contextType: "plan"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/001-initial-research/002-extended-wave-copilot"
    last_updated_at: "2026-04-19T09:05:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Plan scaffolded"
    next_safe_action: "Dispatch iter 1"
---
# Implementation Plan: 020 Extended Research (cli-copilot)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

10-iteration research wave via `copilot -p ... --model gpt-5.4 --allow-all-tools --no-ask-user`. Sequential dispatch (1 at a time to stay well inside copilot 3-concurrent cap).
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Wave 1 converged
- [x] 10 extended angles defined

### Definition of Done
- [ ] 10 iterations OR converged
- [ ] research-extended.md + delta vs wave-1
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Sequential sk-deep-research loop with per-iteration delta files. Each iteration targets a distinct research angle from §3.1 of spec.md.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold artifact tree
- [ ] Metadata via generate-context.js

### Phase 2: Implementation
- [ ] 10 iterations via cli-copilot (one per research angle)

### Phase 3: Verification
- [ ] research-extended.md written
- [ ] Delta analysis vs wave-1
<!-- /ANCHOR:phases -->

### 4.1 Dispatch Command

```
copilot -p "Read and follow instructions at @PROMPT_PATH exactly. Do not deviate." --model gpt-5.4 --allow-all-tools --no-ask-user
```

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Packet | validate.sh --strict --no-recursive |
| Convergence | iteration loop | state.jsonl newInfoRatio |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status |
|------------|--------|
| cli-copilot | Green (v1.0.31) |
| Wave 1 research.md | Converged |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Budget exhausted without convergence → write partial synthesis
- Copilot unavailable → fall back to cli-codex per feedback memory
<!-- /ANCHOR:rollback -->
