---
title: "Feature Specification: Skill Graph Metadata Enrichment"
description: "Enrich all 20 per-skill graph-metadata.json files from barebones (15-22 lines) to rich metadata matching the spec-folder graph-metadata.json pattern, tailored for the skill graph context."
trigger_phrases:
  - "004-graph-metadata-enrichment"
  - "graph metadata enrichment"
  - "skill metadata enrichment"
  - "rich graph metadata"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level3-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/004-graph-metadata-enrichment"
    last_updated_at: "2026-04-13T22:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Created spec"
    next_safe_action: "Design enriched schema and implement"
    key_files: ["spec.md"]
---
# Feature Specification: Skill Graph Metadata Enrichment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level3-verify | v2.2 -->

---

## EXECUTIVE SUMMARY

Enrich all 20 per-skill `graph-metadata.json` files from their current barebones format (15-22 lines with only `skill_id`, `family`, `category`, `edges`, `domains`, `intent_signals`) to a rich metadata format that includes derived data (trigger_phrases, key_topics, key_files, entities, causal_summary, timestamps). The enriched schema is inspired by the spec-folder `graph-metadata.json` pattern but tailored for the skill graph context — skills have different identity fields (`skill_id` vs `packet_id`), different relationship semantics, and different discovery needs.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-04-13 |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `001-research-findings-fixes` |

---

## 2. PROBLEM STATEMENT

### Current State (all 20 skills)

Every skill graph-metadata.json is 15-22 lines with this schema:

```json
{
  "schema_version": 1,
  "skill_id": "sk-deep-review",
  "family": "sk-deep",
  "category": "autonomous-loop",
  "edges": {
    "depends_on": [...],
    "enhances": [...],
    "siblings": [...],
    "conflicts_with": [],
    "prerequisite_for": []
  },
  "domains": ["review", "audit", ...],
  "intent_signals": ["deep review", "review loop", ...]
}
```

### Target State (spec-folder pattern, adapted)

The spec-folder `graph-metadata.json` includes rich `derived` data (170 lines):
- `trigger_phrases` — search/discovery phrases
- `key_topics` — extracted topic terms
- `key_files` — implementation files with paths
- `entities` — named entities with kind and path
- `causal_summary` — one-paragraph description of what the skill does and why
- `timestamps` — created_at, last_save_at
- `source_docs` — list of source documentation files

### Gap

| Field | Skill (current) | Spec folder | Value for Skills |
|-------|-----------------|-------------|-----------------|
| `trigger_phrases` | Missing | Yes | Improves MCP search discovery |
| `key_topics` | Missing | Yes | Topic-based routing and clustering |
| `key_files` | Missing | Yes | Links metadata to implementation files |
| `entities` | Missing | Yes | Named entity references for code graph |
| `causal_summary` | Missing | Yes | Human-readable skill purpose description |
| `timestamps` | Missing | Yes | Staleness detection |
| `source_docs` | Missing | Yes | Links to SKILL.md and references |
| `version` | Missing | N/A | Track schema evolution |

---

## 3. SCOPE

### In Scope
- Design enriched skill graph-metadata.json schema (v2) with `derived` block
- Enrich all 20 existing graph-metadata.json files with derived data
- Update `skill_graph_compiler.py` to validate the enriched schema (backwards-compatible with v1)
- Update compiler to optionally extract/propagate derived data into compiled graph
- Ensure `skill_advisor.py` can leverage enriched metadata for better routing

### Out of Scope
- Changing the spec-folder graph-metadata.json schema
- Auto-generating graph-metadata.json from SKILL.md (future work)
- Changing the compiled skill-graph.json format (only additive fields)
- Modifying the core advisor scoring pipeline

---

## 4. PROPOSED ENRICHED SCHEMA

```json
{
  "schema_version": 2,
  "skill_id": "sk-deep-review",
  "family": "sk-deep",
  "category": "autonomous-loop",
  "edges": {
    "depends_on": [...],
    "enhances": [...],
    "siblings": [...],
    "conflicts_with": [],
    "prerequisite_for": []
  },
  "domains": ["review", "audit", "iterative", "convergence", "severity"],
  "intent_signals": ["deep review", "review loop", "iterative review"],
  "derived": {
    "trigger_phrases": ["deep review", "autonomous review", "review loop", "iterative code audit", "convergence detection"],
    "key_topics": ["review", "audit", "severity", "convergence", "P0", "P1", "P2", "findings"],
    "key_files": [
      ".opencode/skill/sk-deep-review/SKILL.md",
      ".opencode/skill/sk-deep-review/references/deep-review-protocol.md",
      ".opencode/agent/deep-review.md"
    ],
    "entities": [
      { "name": "sk-deep-review", "kind": "skill", "path": ".opencode/skill/sk-deep-review/SKILL.md", "source": "derived" },
      { "name": "@deep-review", "kind": "agent", "path": ".opencode/agent/deep-review.md", "source": "derived" }
    ],
    "causal_summary": "Autonomous iterative code review loop executing single review cycles with externalized JSONL + strategy.md state, severity-weighted findings (P0/P1/P2), dimension coverage tracking, and convergence detection.",
    "source_docs": ["SKILL.md", "references/deep-review-protocol.md"],
    "created_at": "2026-04-13T00:00:00Z",
    "last_updated_at": "2026-04-13T22:00:00Z"
  }
}
```

---

## 5. KEY FILES

| File | Action |
|------|--------|
| `.opencode/skill/*/graph-metadata.json` (20 files) | Enrich with derived block |
| `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py` | Update validation for v2 schema |
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | Optional: leverage enriched metadata |
| `.opencode/skill/skill-advisor/scripts/skill-graph.json` | Regenerate after enrichment |

---

## 6. SUCCESS CRITERIA

- [ ] All 20 graph-metadata.json files contain a `derived` block with at minimum: trigger_phrases, key_files, causal_summary, source_docs
- [ ] Schema version bumped to 2 in all enriched files
- [ ] Compiler validates v2 schema (backwards-compatible with v1)
- [ ] Compiler `--validate-only` passes with zero errors
- [ ] Compiled skill-graph.json stays under 8KB (enriched data may increase size)
- [ ] Regression suite passes: 44/44 cases, all gates green
- [ ] Each enriched file has accurate key_files pointing to real paths on disk
