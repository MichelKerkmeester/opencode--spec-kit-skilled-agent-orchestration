---
title: "Implementation Plan: Advisor Renderer + 200-Prompt Regression Harness"
description: "Pure renderer + fixture library + 200-prompt parity harness + timing lanes + observability + privacy suite. Hard gate before runtime rollout in 006/007/008."
trigger_phrases:
  - "020 005 plan"
  - "advisor renderer plan"
importance_tier: "critical"
contextType: "plan"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness"
    last_updated_at: "2026-04-19T09:30:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Plan scaffolded"
    next_safe_action: "Dispatch /spec_kit:implement :auto after 004 converges"
    blockers: []
    key_files: []

---
# Implementation Plan: Advisor Renderer + 200-Prompt Regression Harness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (strict) |
| **New Files** | 3 lib + 5 test files + 7 fixtures |
| **Corpus** | 019/004 200 labeled prompts |
| **Hard gate** | Yes — blocks 006/007/008 merges |

### Overview

Deliver the single trust-boundary renderer (whitelist-only, Unicode label sanitization) + the full regression harness that gates runtime rollout. Implements every open validation question from the research packet: 200-prompt parity, 4 timing lanes, observability contract, privacy assertions.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] 002 + 003 + 004 merged
- [x] 019/004 corpus available at documented path
- [x] Renderer contract from research-extended §X9 confirmed

### Definition of Done
- [ ] All 5 test suites green
- [ ] 200/200 corpus parity (top-1 match)
- [ ] Cache-hit lane p95 ≤ 50 ms (cache-hit lane only; cold/warm/miss lanes measured but not gated)
- [ ] Cache hit rate ≥ 60% on corrected 30-turn replay: **10 unique prompts + 20 repeats = 20/30 = 66.7% nominal**
- [ ] Metrics + privacy verified
- [ ] `tsc --noEmit` clean
- [ ] Wall-clock target for full 4-lane timing suite: ≤ 15 minutes on CI (50 invocations × 4 lanes × avg latency, with margin for CI jitter)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Pure renderer for the trust boundary. Normalized adapter output type for cross-runtime comparator. Metrics namespace is additive to existing metrics module. Harness tests are CI-runnable (no interactive).

### Key Components

```
mcp_server/
  lib/skill-advisor/
    render.ts                        NEW — renderAdvisorBrief() + label sanitizer
    normalize-adapter-output.ts      NEW — NormalizedAdvisorRuntimeOutput
    metrics.ts                       NEW — speckit_advisor_hook_* namespace
  tests/
    advisor-fixtures/
      livePassingSkill.json
      staleHighConfidenceSkill.json
      noPassingSkill.json
      failOpenTimeout.json
      skippedShortCasual.json
      ambiguousTopTwo.json
      unicodeInstructionalSkillLabel.json
    advisor-renderer.vitest.ts       NEW — snapshots + sanitization
    advisor-corpus-parity.vitest.ts  NEW — 200-prompt gate
    advisor-timing.vitest.ts         NEW — 4-lane harness
    advisor-observability.vitest.ts  NEW — metrics + health section
    advisor-privacy.vitest.ts        NEW — raw prompt audit
```

### Data Flow

```
renderAdvisorBrief(result, options)
  ├─ if (status ∈ {fail_open, skipped}) → null
  ├─ if (!recommendations.topPassing) → null
  ├─ label = canonicalFold(recommendations.topPassing.skillSlug)
  ├─ label = normalizeToSingleLine(label)
  ├─ if (looksLikeInstruction(label)) → null
  ├─ if (freshness === "unavailable") → null
  ├─ format = chooseFormat(options, status)  // default|ambiguous
  └─ return format(freshness, label, confidence, uncertainty)
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Renderer + fixtures
- [ ] Create `render.ts` with `renderAdvisorBrief()`
- [ ] Implement sanitization pipeline (fold → single-line → instruction-regex)
- [ ] Write 7 canonical fixtures in `advisor-fixtures/`
- [ ] Write `advisor-renderer.vitest.ts` with 7 snapshot scenarios + sanitization

### Phase 2: Normalized comparator + metrics
- [ ] Create `normalize-adapter-output.ts` with `NormalizedAdvisorRuntimeOutput` + per-runtime transformers (stubs for adapters not yet implemented)
- [ ] Create `metrics.ts` with `speckit_advisor_hook_*` namespace
- [ ] Write `advisor-observability.vitest.ts`

### Phase 3: 200-prompt parity harness
- [ ] Create `advisor-corpus-parity.vitest.ts`
- [ ] Read 019/004 corpus JSONL
- [ ] Invoke direct CLI + hook path for each prompt; compare top-1
- [ ] Report per-prompt failures with deltas

### Phase 4: Timing harness
- [ ] Create `advisor-timing.vitest.ts` with 4 lanes × 50 invocations each (cold / warm / cache-hit / cache-miss)
- [ ] Record p50/p95/p99 across all 4 lanes
- [ ] **Hard gate 1**: cache-hit lane p95 ≤ 50 ms (cache-hit lane only; cold/warm/miss lanes are diagnostic, not gated)
- [ ] **Hard gate 2**: cache hit rate ≥ 60% on corrected 30-turn replay (**10 unique prompts + 20 repeats** = 20/30 = 66.7% nominal; single-flake tolerance keeps it at ≥ 19/30 = 63.3%)
- [ ] Wall-clock for this phase: ≤ 10 minutes (200 invocations × avg ~1-2 s cold + ≤ 50 ms warm hits = ~3-5 min typical, 10 min with CI jitter)

### Phase 5: Privacy audit
- [ ] Create `advisor-privacy.vitest.ts`
- [ ] Assert raw prompt absent from: envelope sources, metrics labels, stderr JSONL, `advisor-hook-health`, cache keys

### Phase 6: Verification
- [ ] All 5 test suites green
- [ ] 200/200 parity gate
- [ ] `tsc --noEmit` clean
- [ ] Record all bench numbers in implementation-summary.md
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Renderer + sanitization | vitest (snapshots) |
| Integration | 200-prompt corpus parity | vitest (subprocess + hook) |
| Bench | 4 timing lanes | vitest |
| Contract | Metrics namespace | vitest |
| Privacy | Raw-prompt absence | vitest + grep |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| 002 + 003 + 004 | Predecessors | Pending |
| 019/004 corpus | Fixture | Live |
| `shared/unicode-normalization.ts` | Phase 019/003 | Live |
| `skill_advisor.py` | Python subprocess | Live |
| vitest bench | Dev | Live |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

**Trigger**: parity < 100% OR cache hit p95 > 50 ms OR cache hit rate < 60% OR privacy audit fails.

**Procedure**: revert commits; runtime rollout (006/007/008) stays blocked until gates are restored. Research child 001 may be re-opened if a gap is surfaced that the harness cannot close.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Renderer) ──► Phase 2 (Normalizer + Metrics) ──► Phase 3 (Corpus)
Phase 1 ────────────► Phase 4 (Timing)
Phase 1-2 ──────────► Phase 5 (Privacy) ──► Phase 6 (Verify)
```
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Renderer + fixtures | Med | 3-4 hours |
| Normalizer + metrics | Low | 1-2 hours |
| 200-prompt parity | High | 3-5 hours |
| Timing harness | Med | 2-3 hours |
| Privacy audit | Med | 2-3 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **12-19 hours (1-2.25 days)** |
<!-- /ANCHOR:effort -->
