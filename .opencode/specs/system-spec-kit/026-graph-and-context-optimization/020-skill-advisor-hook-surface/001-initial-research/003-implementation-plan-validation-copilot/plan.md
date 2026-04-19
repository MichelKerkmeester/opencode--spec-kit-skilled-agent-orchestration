---
title: "Implementation Plan: 020 Wave-3 Validation Research"
description: "20-iteration cli-copilot gpt-5.4 high dispatch via /spec_kit:deep-research :auto. Validates the 8-child scaffold against wave-1 + wave-2 synthesis. No architecture re-opening."
trigger_phrases:
  - "020 wave 3 plan"
  - "wave 3 validation plan"
importance_tier: "critical"
contextType: "plan"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/001-initial-research/003-implementation-plan-validation-copilot"
    last_updated_at: "2026-04-19T10:00:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Plan scaffolded"
    next_safe_action: "Dispatch via /spec_kit:deep-research :auto"
    blockers: []

---
# Implementation Plan: 020 Wave-3 Validation Research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Executor** | cli-copilot gpt-5.4 high |
| **Iteration budget** | 20 |
| **Convergence threshold** | 0.05 (default) |
| **Dispatch command** | `/spec_kit:deep-research :auto` |
| **Artifact root** | ../../research/020-skill-advisor-hook-surface-pt-01-003-implementation-plan-validation-copilot/ |

### Overview

Third research wave that validates the scaffolded 8-child implementation plan against prior research convergence. Scoped to 10 validation angles (V1-V10). Output: research-validation.md with per-child delta table + severity-tagged findings.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Wave-1 converged (research.md)
- [x] Wave-2 converged (research-extended.md)
- [x] 8 children 002-009 scaffolded + metadata generated
- [x] Packet scaffolded at 020/001-initial-research/003-implementation-plan-validation-copilot/

### Definition of Done
- [ ] 20 iterations executed OR convergence
- [ ] research-validation.md synthesis written
- [ ] Per-child delta table (002-009) populated
- [ ] Severity-tagged action list (P0/P1/P2)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Canonical `/spec_kit:deep-research :auto` workflow: init → loop iterations → convergence → synthesize → save. Each iteration dispatches a cli-copilot subprocess via the loop manager; state externalized to JSONL + strategy files.

### Data Flow

```
/spec_kit:deep-research :auto "<topic>" <flags>
  ├─ init: create config, strategy.md, state.jsonl
  ├─ loop iterations 1..20:
  │   ├─ dispatch cli-copilot gpt-5.4 high with iter-N prompt pack
  │   ├─ copilot returns iteration-N.md + delta JSONL
  │   ├─ reducer merges into strategy.md + findings-registry.json
  │   ├─ convergence check (newInfoRatio < 0.05 × 3 + graph signals)
  │   └─ if STOP → synthesize
  ├─ synthesize: research-validation.md
  └─ save: continuity update + memory index refresh
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Dispatch
- [ ] Invoke `/spec_kit:deep-research :auto` with flags (see §4.1)
- [ ] Confirm config.json written + initial iter prompt pack rendered

### Phase 2: Iteration loop
- [ ] 20 iterations execute OR convergence at iter ≥ 4 with rolling-average < 0.05
- [ ] Each iteration produces iter-NNN.md + delta JSONL

### Phase 3: Synthesis
- [ ] research-validation.md written with executive summary + per-child delta + severity action list
- [ ] 020 parent implementation-summary.md updated with wave-3 convergence event
<!-- /ANCHOR:phases -->

---

### 4.1 Dispatch Command

```
/spec_kit:deep-research :auto "Wave-3 validation research for Phase 020 skill-advisor hook surface. Cross-check the 8-child implementation scaffold (020/002-009) against wave-1 research.md + wave-2 research-extended.md convergence. Read each child's spec.md + plan.md + tasks.md + checklist.md and flag: V1 gaps between scaffold content and prior research recommendations; V2 per-child risk hotspots (under-scoped, over-scoped, mis-ordered); V3 hidden dependency cycles beyond the linear 002-009 chain (shared types, helper modules, cache keys); V4 019/004 corpus adequacy for 005 hard gate (coverage of adversarial prompt class from wave-2 X5); V5 runtime-specific edge cases for 006/007/008 not captured in specs; V6 observability contract completeness (metric namespace speckit_advisor_hook_*, JSONL schema, alert thresholds, session_health section) per wave-2 X6; V7 fail-open correctness — walk every error mode from research.md Failure Modes + wave-2 X5 and confirm 004 producer + 006/007/008 adapter coverage; V8 migration compatibility when hook lands in existing sessions with pre-cache state per wave-2 X7; V9 privacy audit scope — every channel where prompt content could leak (envelope sources, metrics labels, stderr JSONL, session_health output, cache keys, generation counter file, hook-state); V10 hard-gate realism — timing budget math for 005's 100% top-1 parity + p95 cache hit 50 ms + cache hit rate 60% with 004's producer and 003's freshness design. Do NOT re-open architecture. Do NOT propose new children. Produce research-validation.md with per-child delta table (002-009) and severity-tagged findings P0/P1/P2. Dispatch on spec folder .opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/001-initial-research/003-implementation-plan-validation-copilot/ with iteration budget 20." --executor=cli-copilot --model=gpt-5.4 --reasoning-effort=high --max-iterations=20 --executor-timeout=1800 --spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/001-initial-research/003-implementation-plan-validation-copilot
```

Note: cli-copilot does not accept `--service-tier`; reasoning-effort is passed via executor wrapper translation.

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Convergence | newInfoRatio rolling avg < 0.05 × 3 + graph signal | deep-research loop manager |
| Quality guard | Source diversity + focus alignment | deep-research quality guards |
| Synthesis audit | research-validation.md references prior artifacts + scaffolded files | manual |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| Wave-1 research.md | Prior artifact | Converged |
| Wave-2 research-extended.md | Prior artifact | Converged |
| 8 children 002-009 scaffold | Target | Scaffolded + metadata generated |
| cli-copilot + gpt-5.4 | Runtime | Live |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

**Trigger**: wave-3 surfaces P0 finding that invalidates wave-1 or wave-2 architecture decisions.

**Procedure**: pause implementation of 020/002-009; convene user + re-plan. Wave-3 findings themselves do not get rolled back — they are captured for the record.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Estimated Effort |
|-------|------------------|
| Dispatch | 5 min |
| Iteration loop (20 × ~5-10 min) | 100-200 min |
| Synthesis | 10 min |
| **Total** | **~2-3.5 hours wall clock** |
<!-- /ANCHOR:effort -->
