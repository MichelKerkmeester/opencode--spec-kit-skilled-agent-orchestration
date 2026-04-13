---
title: "Implementation Plan: Skill Advisor Packaging"
description: "Plan for feature catalog creation, reference updates, and graph-metadata.json for skill-advisor."
trigger_phrases:
  - "003-skill-advisor-packaging"
  - "packaging plan"
  - "feature catalog plan"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/003-skill-advisor-packaging"
    last_updated_at: "2026-04-13T21:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Created plan"
    next_safe_action: "Implement feature catalog and reference updates"
    key_files: ["plan.md"]
---
# Implementation Plan: Skill Advisor Packaging

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (documentation), JSON (metadata) |
| **Templates** | sk-doc feature catalog snippet template |
| **Reference** | system-spec-kit feature catalog examples |

### Overview

Create a feature catalog (~18 per-feature files + root) documenting all skill advisor capabilities, add graph-metadata.json for the skill-advisor folder, and update CLAUDE.md references from `scripts/` to `skill-advisor/`.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] sk-doc feature catalog snippet template reviewed
- [x] system-spec-kit feature catalog examples analyzed
- [x] Feature inventory identified (18 features across 4 categories)
- [x] Skill-advisor folder structure confirmed at `.opencode/skill/skill-advisor/`
- [x] CLAUDE.md `scripts/` references identified

### Definition of Done
- [ ] Root FEATURE_CATALOG.md created matching system-spec-kit format
- [ ] All 18 per-feature catalog files created using sk-doc snippet template
- [ ] graph-metadata.json added for skill-advisor folder
- [ ] CLAUDE.md updated: `scripts/` → `skill-advisor/`
- [ ] Phase 002 spec updated to reference skill-advisor path

---

## 3. APPROACH

### Phase 1: Feature Catalog Root

Create `.opencode/skill/skill-advisor/feature_catalog/FEATURE_CATALOG.md`:
- Match system-spec-kit root catalog format (frontmatter, numbered H2s, summary table per category)
- 4 categories with feature summaries linking to per-feature files:
  - 01--routing-pipeline (6 features)
  - 02--graph-system (8 features)
  - 03--semantic-search (2 features)
  - 04--testing (2 features)

### Phase 2: Routing Pipeline Features (6 files)

Create `feature_catalog/01--routing-pipeline/`:

| ID | File | Feature |
|----|------|---------|
| RP-01 | `01-skill-discovery.md` | Automatic skill folder discovery and SKILL.md parsing |
| RP-02 | `02-request-normalization.md` | Input normalization (lowercase, strip punctuation) |
| RP-03 | `03-keyword-boosting.md` | Keyword-to-skill mapping with configurable weights |
| RP-04 | `04-phrase-intent-boosting.md` | Multi-word phrase matching for intent detection |
| RP-05 | `05-confidence-calibration.md` | Score normalization and threshold application |
| RP-06 | `06-result-filtering.md` | Threshold filtering and top-N selection |

### Phase 3: Graph System Features (8 files)

Create `feature_catalog/02--graph-system/`:

| ID | File | Feature |
|----|------|---------|
| GS-01 | `01-graph-metadata-schema.md` | Per-skill graph-metadata.json schema and authoring |
| GS-02 | `02-graph-compiler.md` | Discover, validate, compile pipeline |
| GS-03 | `03-compiled-graph.md` | Runtime skill-graph.json with sparse adjacency |
| GS-04 | `04-transitive-boosts.md` | enhances/depends_on/sibling boost propagation |
| GS-05 | `05-family-affinity.md` | Family-aware cross-skill boosting |
| GS-06 | `06-conflict-penalty.md` | Uncertainty increase for conflicting skills |
| GS-07 | `07-ghost-candidate-guard.md` | Pre-graph evidence requirement |
| GS-08 | `08-evidence-separation.md` | Graph boost tracking and confidence penalty |

### Phase 4: Semantic Search + Testing Features (4 files)

Create `feature_catalog/03--semantic-search/`:

| ID | File | Feature |
|----|------|---------|
| SS-01 | `01-cocoindex-integration.md` | CocoIndex semantic search subprocess |
| SS-02 | `02-auto-triggers.md` | Automatic trigger phrase matching |

Create `feature_catalog/04--testing/`:

| ID | File | Feature |
|----|------|---------|
| TE-01 | `01-regression-harness.md` | JSONL regression test runner |
| TE-02 | `02-health-check.md` | --health diagnostic endpoint |

### Phase 5: Reference Updates

1. Update CLAUDE.md: replace `scripts/` with `skill-advisor/` in Gate 2 path
2. Add `graph-metadata.json` for `.opencode/skill/skill-advisor/`
3. Update 002-manual-testing-playbook spec to reference `skill-advisor/` path

---

## 4. RISKS

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Feature catalog descriptions diverge from actual implementation | Low | Each feature file cites specific source files and line ranges |
| CLAUDE.md update breaks Gate 2 routing | Low | Test `skill_advisor.py --health` after path update |
| Missing features in catalog | Medium | Cross-reference with skill_advisor.py function list and graph-metadata.json edges |
