---
title: "...aph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/003-nfkc-unification-hardening/plan]"
description: "Staged rollout of HP1-HP6 from 019/001/003 research."
trigger_phrases:
  - "nfkc hardening plan"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/003-nfkc-unification-hardening"
    last_updated_at: "2026-04-18T23:42:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Plan scaffolded"
    next_safe_action: "Dispatch implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
# Implementation Plan: NFKC Unification Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Stack** | TypeScript + Node Unicode normalization |
| **Surfaces** | Gate 3, shared-provenance, trigger-phrase-sanitizer, hook-state |

### Overview

Implement HP1→HP2→HP3→HP4→HP5→HP6 in staged order. Each stage passes its own regression before next stage starts.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Research converged

### Definition of Done
- [ ] All 6 proposals land
- [ ] Adversarial corpus green across 4 surfaces
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Extract-shared-utility refactor (HP1), then additive hardening (HP2-HP6). HP1 is the foundational change; HP2-HP5 layer on top; HP6 locks behavior.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: HP1 — Shared normalization utility
- [ ] Create `scripts/lib/unicode-normalization.ts`
- [ ] Extract fold pipeline from gate-3-classifier + shared-provenance
- [ ] Route trigger-phrase-sanitizer through shared utility
- [ ] Parity tests across 3 surfaces

### Phase 2: HP2 — Post-normalization denylist
- [ ] Move contamination/suspicious-prefix checks after canonicalization

### Phase 3: HP3 — Confusable coverage expansion
- [ ] Add Greek-omicron and adjacent high-risk instruction lookalikes to fold table

### Phase 4: HP4 — Semantic recovered-payload contract
- [ ] Add semantic gate in hook-state + session-prime consumers

### Phase 5: HP5 — Provenance enforcement
- [ ] Require provenance metadata + sanitizer-version fingerprint on compact-cache

### Phase 6: HP6 — Adversarial corpus
- [ ] Build shared corpus: width forms, hidden chars, combining marks, confusables, runtime fingerprint
- [ ] Wire corpus into tests for all 4 surfaces

### Phase 7: Verification
- [ ] All adversarial cases blocked or quarantined
- [ ] Full test suite green
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
| Unit | Shared utility fold | vitest |
| Integration | Gate 3 + shared-provenance + trigger-phrase parity | vitest |
| Adversarial | RT1-RT10 corpus | vitest |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| Node Unicode APIs | Runtime | Green |
| 019/001/003 research | Input | Converged |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Per-phase: revert the specific phase's changes; earlier phases remain
- Semantic gate quarantine-first (reversible without data loss)
<!-- /ANCHOR:rollback -->
