---
title: "Implementation Plan: Deep Skill Feature Catalogs"
description: "Plan for creating feature catalogs for sk-deep-research, sk-deep-review, and sk-improve-agent."
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/008-deep-skill-feature-catalogs"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Created plan"
    next_safe_action: "Implement catalogs"
    key_files: ["plan.md"]
---
# Implementation Plan: Deep Skill Feature Catalogs

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

## 1. APPROACH

### Phase 1: sk-deep-research (parallel)
Read SKILL.md, references/, agent definition. Create root catalog + 4 categories + ~12 per-feature files.

### Phase 2: sk-deep-review (parallel)
Read SKILL.md, references/, agent definition. Create root catalog + 4 categories + ~12 per-feature files.

### Phase 3: sk-improve-agent (parallel)
Read SKILL.md, references/, agent definition. Create root catalog + 3 categories + ~8 per-feature files.

All 3 phases can run in parallel since they touch different skill directories.

## 2. PATTERN SOURCE

Use these as templates:
- Root catalog format: `.opencode/skill/skill-advisor/feature_catalog/feature_catalog.md` (subsection format)
- Per-feature file: `.opencode/skill/skill-advisor/feature_catalog/02--graph-system/04-transitive-boosts.md`
- Template: `.opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_template.md`
