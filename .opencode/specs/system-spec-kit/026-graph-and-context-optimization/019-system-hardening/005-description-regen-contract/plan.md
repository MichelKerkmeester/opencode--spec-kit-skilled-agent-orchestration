---
title: "Implementation Plan: Description Regen Contract"
description: "Formalize field-level merge policy with shared schema."
trigger_phrases: ["description regen plan"]
importance_tier: "critical"
contextType: "plan"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/019-system-hardening/005-description-regen-contract"
    last_updated_at: "2026-04-18T23:47:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Plan scaffolded"
    next_safe_action: "Dispatch implementation"
---
# Implementation Plan: Description Regen Contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Stack** | TypeScript + Zod |
| **Target** | description.json write pipeline |

### Overview

Introduce shared schema + unified merge helper. Route both lanes through the helper. Add field-level merge contract with 5 classes.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Research converged with strategy selection

### Definition of Done
- [ ] All 28 rich description.json files regen without field loss
- [ ] Shared schema + unified merge helper land
- [ ] Regression tests cover 5 field classes
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Extract-shared-schema + unify-lanes refactor. Additive field classification without structural storage change.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Shared schema
- [ ] Create `scripts/lib/description-schema.ts` with 5 field-class definitions
- [ ] Define Zod schema for FolderDescription superset
- [ ] Add type exports

### Phase 2: Unified merge helper
- [ ] Create `scripts/lib/description-merge.ts` with field-level merge logic
- [ ] Route `getDescriptionWritePayload()` through helper
- [ ] Route 018 R4 `mergePreserveRepair()` through helper
- [ ] Unit tests per field class

### Phase 3: Regression sweep
- [ ] Run regen on 28 rich description.json files
- [ ] Verify no authored field loss
- [ ] Add regression fixture with unknown-key passthrough

### Phase 4: Verification
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
| Unit | Field-class merge | vitest |
| Integration | Both lanes via helper | vitest |
| Regression | 28 rich description.json sweep | script |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| 019/001/004 research | Input | Converged |
| 018 R4 helper | Source | Active |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Revert helper + schema files; existing behavior intact (both lanes still work, just not unified)
<!-- /ANCHOR:rollback -->
