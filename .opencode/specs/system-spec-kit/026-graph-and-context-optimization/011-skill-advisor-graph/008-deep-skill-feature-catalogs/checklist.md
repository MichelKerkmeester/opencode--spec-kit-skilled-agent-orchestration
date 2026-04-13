---
title: "Verification Checklist: Deep Skill Feature Catalogs"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/008-deep-skill-feature-catalogs"
    last_updated_at: "2026-04-13T00:00:00Z"
    last_updated_by: "claude-opus-4-6"
    key_files: ["checklist.md"]
---
# Verification Checklist: Deep Skill Feature Catalogs

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

## Format Compliance (P0)
- [ ] CHK-001: All 3 root catalogs use subsection format (not tables) [EVIDENCE: grep for ### and #### headings]
- [ ] CHK-002: All root catalogs have frontmatter with title and description
- [ ] CHK-003: All root catalogs have TABLE OF CONTENTS and OVERVIEW sections
- [ ] CHK-004: Every root catalog entry has Description, Current Reality, and Source Files subsections

## Content Accuracy (P0)
- [ ] CHK-010: sk-deep-research features match SKILL.md capabilities
- [ ] CHK-011: sk-deep-review features match SKILL.md capabilities
- [ ] CHK-012: sk-improve-agent features match SKILL.md capabilities

## Per-Feature Files (P1)
- [ ] CHK-020: Every root catalog entry links to a per-feature file that exists
- [ ] CHK-021: Per-feature files have Overview, Current Reality, Source Files, Source Metadata sections
- [ ] CHK-022: Root catalog feature count matches per-feature file count per category

## Structure (P1)
- [ ] CHK-030: Category directories use NN--category-name format
- [ ] CHK-031: Per-feature files use NN-feature-name.md format
