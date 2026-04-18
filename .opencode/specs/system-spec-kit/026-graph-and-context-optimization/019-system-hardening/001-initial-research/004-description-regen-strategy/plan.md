---
title: "Implementation Plan: description.json Regen Strategy (RR-2)"
description: "Dispatch plan for RR-2 deep-research."
trigger_phrases:
  - "rr-2 dispatch plan"
importance_tier: "critical"
contextType: "plan"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/019-system-hardening/001-initial-research/004-description-regen-strategy"
    last_updated_at: "2026-04-18T17:50:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Plan scaffolded"
    next_safe_action: "Wave 1 convergence then dispatch"

---
# Implementation Plan: description.json Regen Strategy

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript + JSON schemas |
| **Framework** | sk-deep-research |
| **Storage** | `026/research/019-system-hardening/001-initial-research/004-description-regen-strategy/` |

### Overview

Dispatch `/spec_kit:deep-research :auto` on description.json preservation. Audit 86 files, evaluate 4 strategies, recommend one with migration path.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Charter approved.
- [ ] Wave 1 converged.
- [ ] Metadata generated.

### Definition of Done
- [ ] Dispatch converges.
- [ ] Strategy recommended with migration path.
- [ ] Findings propagated.
<!-- /ANCHOR:quality-gates -->

---

### AI Execution Protocol

### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| AI-DISPATCH-001 | Canonical `/spec_kit:deep-research :auto` | Gate 4 |
| AI-WAVE-ORDER | Wait Wave 1 | ADR-001 |

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Canonical sk-deep-research; empirical audit + strategy evaluation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold.
- [ ] Metadata.

### Phase 2: Implementation
- [ ] Wait Wave 1.
- [ ] Dispatch.
- [ ] Iterate 8-12.

### Phase 3: Verification
- [ ] Validate.
- [ ] Review.
- [ ] Propagate.
<!-- /ANCHOR:phases -->

---

### 4.1 Dispatch Command

```
/spec_kit:deep-research :auto "description.json rich-content preservation research under canonical-save regen. Audit 86 description.json files in 026's tree. Classify fields as always-derived (safe to regen) vs can-be-authored (must preserve). Evaluate 4 strategies: opt-in regen flag, hash-based change detection, schema-versioned authored layer with derived overlay, field-level merge policy by content-type marker. Verify compatibility with phase 018 R4 parse/schema split + merge-preserving repair. Recommend one strategy with schema changes, migration path, and validation fixtures. Cite 29 rich description.json files identified in 018 research.md §5." --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --executor-timeout=1800
```

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | This packet | `validate.sh --strict --no-recursive` |
| Convergence | Iteration loop | dashboard |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| `/spec_kit:deep-research :auto` | Internal | Green |
| 86 description.json files | Internal | Green |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Budget exhausted.
- **Procedure**: Partial recommendation; defer final strategy to follow-on.
<!-- /ANCHOR:rollback -->
