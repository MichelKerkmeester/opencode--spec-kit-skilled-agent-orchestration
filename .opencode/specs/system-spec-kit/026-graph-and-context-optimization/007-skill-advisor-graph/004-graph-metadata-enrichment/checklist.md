---
title: "Verification Checklist: Graph Metadata Enrichment"
description: "Checklist for verifying enriched graph-metadata.json files across all 20 skills."
trigger_phrases:
  - "004-graph-metadata-enrichment"
  - "enrichment checklist"
importance_tier: "important"
contextType: "verification"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/004-graph-metadata-enrichment"
    last_updated_at: "2026-04-13T22:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Created checklist"
    next_safe_action: "Design enriched schema"
    key_files: ["checklist.md"]
---
# Verification Checklist: Graph Metadata Enrichment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | HARD BLOCKER | Cannot claim done until complete |
| **P1** | Required | Complete or explicitly defer with rationale |
| **P2** | Optional | Can defer with documented reason |

---

## Schema Compliance (P0)

- [ ] CHK-001: All 20 files have `schema_version: 2`
- [ ] CHK-002: All 20 files retain existing v1 fields (skill_id, family, category, edges, domains, intent_signals)
- [ ] CHK-003: All 20 files contain a `derived` block
- [ ] CHK-004: All `derived` blocks contain `trigger_phrases` (array, non-empty)
- [ ] CHK-005: All `derived` blocks contain `key_files` (array, non-empty)
- [ ] CHK-006: All `derived` blocks contain `causal_summary` (string, non-empty)
- [ ] CHK-007: All `derived` blocks contain `source_docs` (array, non-empty)

---

## Data Quality (P0)

- [ ] CHK-010: All `key_files` paths exist on disk (zero phantom references)
- [ ] CHK-011: All `source_docs` entries reference real files within the skill folder
- [ ] CHK-012: `causal_summary` accurately describes each skill's purpose
- [ ] CHK-013: `trigger_phrases` are broader than `intent_signals` (superset)

---

## Compiler (P0)

- [ ] CHK-020: `--validate-only` passes with zero errors on all 20 v2 files
- [ ] CHK-021: Compiler still validates v1 files without errors (backwards-compatible)
- [ ] CHK-022: Compiled `skill-graph.json` under 8KB
- [ ] CHK-023: Regression suite passes: 44/44 cases, all gates green

---

## Entities (P1)

- [ ] CHK-030: Each skill has at least one entity (the skill itself)
- [ ] CHK-031: Entity `kind` values are from allowed set (skill, agent, script, config, reference, template)
- [ ] CHK-032: Entity paths point to real files on disk

---

## Timestamps (P1)

- [ ] CHK-040: All files have `created_at` and `last_updated_at` in derived block
- [ ] CHK-041: Timestamps are valid ISO 8601 format
