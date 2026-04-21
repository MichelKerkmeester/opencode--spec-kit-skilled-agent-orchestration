---
title: "Implementation Plan: Template + Validator Joint Audit (SSK-DR-1)"
description: "Dispatch plan for SSK-DR-1 deep-review."
trigger_phrases:
  - "ssk-dr-1 dispatch plan"
importance_tier: "critical"
contextType: "plan"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/001-initial-research/006-template-validator-audit"
    last_updated_at: "2026-04-18T17:55:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Plan scaffolded"
    next_safe_action: "Wave 2 convergence then dispatch"

---
# Implementation Plan: Template + Validator Joint Audit

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Shell (validator) + Markdown (templates) + TypeScript (rule implementations) |
| **Framework** | sk-deep-review |
| **Storage** | `026/review/019-system-hardening/001-initial-research/006-template-validator-audit/` |

### Overview

Dispatch `/spec_kit:deep-review :auto` on template + validator coverage. Build matrix, identify mismatches, rank changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Charter approved.
- [ ] Wave 2 converged.
- [ ] Metadata generated.

### Definition of Done
- [ ] Converges.
- [ ] Coverage matrix + mismatch enumeration complete.
- [ ] Findings propagated.
<!-- /ANCHOR:quality-gates -->

---

### AI Execution Protocol

### Execution Rules

| Rule ID | Rule | Why |
|---------|------|-----|
| AI-DISPATCH-001 | Canonical `/spec_kit:deep-review :auto` | Gate 4 |
| AI-WAVE-ORDER | Wait Wave 2 | ADR-001 |

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Canonical sk-deep-review; coverage-matrix audit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold.
- [ ] Metadata.

### Phase 2: Implementation
- [ ] Wait Wave 2.
- [ ] Dispatch.
- [ ] Iterate 10-12.

### Phase 3: Verification
- [ ] Validate.
- [ ] Matrix review.
- [ ] Propagate.
<!-- /ANCHOR:phases -->

---

### 4.1 Dispatch Command

```
/spec_kit:deep-review :auto "Template v2.2 plus validator ruleset joint audit. Enumerate anchors and fields in .opencode/skill/system-spec-kit/templates/level_{1,2,3}/ (CORE plus ADDENDUM). Enumerate validator rules in scripts/spec/validate.sh strict-mode set (FILE_EXISTS, PLACEHOLDER_FILLED, SECTIONS_PRESENT, TEMPLATE_HEADERS, PHASE_LINKS, SPEC_DOC_INTEGRITY, ANCHORS_VALID, CROSS_ANCHOR_CONTAMINATION, POST_SAVE_FINGERPRINT, CONTINUITY_FRESHNESS, MERGE_LEGALITY, NORMALIZER_LINT, EVIDENCE_MARKER_LINT, TOC_POLICY, FRONTMATTER_MEMORY_BLOCK, SPEC_DOC_SUFFICIENCY, LEVEL_DECLARED, LEVEL_MATCH, LINKS_VALID, GRAPH_METADATA_PRESENT, PRIORITY_TAGS). Cross-reference into coverage matrix (rules by fields). Classify mismatches as orphan rule, orphan field, duplicate coverage, or unenforced invariant. Rank proposed changes by affected-packet count and validator-noise reduction. Review dimensions: correctness, contracts, documentation." --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --executor-timeout=1800
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
| `/spec_kit:deep-review :auto` | Internal | Green |
| Templates + validator | Internal | Green (read-only) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Budget exhausted.
- **Procedure**: Partial matrix + prioritized subset.
<!-- /ANCHOR:rollback -->
