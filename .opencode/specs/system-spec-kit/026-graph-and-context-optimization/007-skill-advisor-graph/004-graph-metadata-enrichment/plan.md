---
title: "Implementation Plan: Graph Metadata Enrichment"
description: "Plan for enriching all 20 per-skill graph-metadata.json with derived data blocks."
trigger_phrases:
  - "004-graph-metadata-enrichment"
  - "metadata enrichment plan"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/004-graph-metadata-enrichment"
    last_updated_at: "2026-04-13T22:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Created plan"
    next_safe_action: "Design enriched schema"
    key_files: ["plan.md"]
---
# Implementation Plan: Graph Metadata Enrichment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON (metadata), Python (compiler validation) |
| **Current schema** | v1 — 15-22 lines per file, edges + domains + intent_signals only |
| **Target schema** | v2 — v1 fields + `derived` block with trigger_phrases, key_files, entities, causal_summary |
| **Files to modify** | 20 graph-metadata.json + skill_graph_compiler.py |

### Overview

Add a `derived` data block to each of the 20 per-skill graph-metadata.json files, inspired by the spec-folder graph-metadata.json pattern but tailored for skill identity. The enriched metadata improves MCP search discovery, code graph linking, and routing intelligence. The compiler is updated to validate the new schema while remaining backwards-compatible with v1 files.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Current v1 schema reviewed (all 20 files, 15-22 lines each)
- [x] Spec-folder graph-metadata.json pattern analyzed (170 lines with derived block)
- [x] Gap analysis complete: 8 missing field categories identified
- [x] Backwards-compatibility requirement identified

### Definition of Done
- [ ] All 20 files enriched with derived block
- [ ] Compiler validates v2 schema
- [ ] Regression suite passes
- [ ] All key_files paths verified as real

---

## 3. APPROACH

### Phase 1: Schema Design

Define the v2 schema additions:

```json
"derived": {
  "trigger_phrases": [],    // Search/discovery phrases (broader than intent_signals)
  "key_topics": [],         // Extracted topic terms for clustering
  "key_files": [],          // Implementation files with full paths
  "entities": [],           // Named entities: {name, kind, path, source}
  "causal_summary": "",     // One-paragraph purpose description
  "source_docs": [],        // Documentation files (SKILL.md, references/)
  "created_at": "",         // ISO timestamp
  "last_updated_at": ""     // ISO timestamp
}
```

Entity kinds for skills: `skill`, `agent`, `script`, `config`, `reference`, `template`

### Phase 2: Enrichment Process (per skill)

For each of the 20 skills:
1. Read SKILL.md frontmatter for name, description, trigger_phrases
2. List files in the skill folder to populate key_files
3. Check for matching agent definition (`.claude/agents/` or `.opencode/agent/`)
4. Write causal_summary from the SKILL.md description
5. Populate source_docs from actual .md files in the skill folder
6. Build entities from key files and agents
7. Merge derived block into existing graph-metadata.json
8. Bump schema_version to 2

### Phase 3: Compiler Update

Update `skill_graph_compiler.py`:
- Accept both `schema_version: 1` and `schema_version: 2`
- When v2: validate derived block structure (trigger_phrases is array, key_files is array, etc.)
- Optional: propagate trigger_phrases into compiled graph for richer runtime signals

### Phase 4: Verification

- Regenerate skill-graph.json
- Run regression suite
- Verify all key_files paths exist on disk
- Check compiled size stays reasonable

---

## 4. RISKS

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Compiled graph exceeds size target | Medium | Only compile trigger_phrases from derived; keep other derived data in per-skill files only |
| Stale key_files paths | Medium | Verification step validates all paths exist; compiler can warn on missing files |
| Schema version mismatch breaks existing consumers | Low | Backwards-compatible: v1 files still pass validation, all new fields are in `derived` block |
| Enrichment data drifts from SKILL.md | Medium | Future: auto-generate derived from SKILL.md analysis |
