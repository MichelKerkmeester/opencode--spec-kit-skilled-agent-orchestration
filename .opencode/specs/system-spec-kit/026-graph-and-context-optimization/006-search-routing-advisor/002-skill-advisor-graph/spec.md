---
title: "Feature Specification: Skill Advisor Graph [template:level_2/spec.md]"
description: "Add structured graph metadata to all 20 skill folders, compile into a lightweight skill-graph.json, and integrate graph-derived boosts into skill_advisor.py routing."
trigger_phrases:
  - "011-skill-advisor-graph"
  - "skill advisor graph"
  - "skill graph metadata"
  - "026-graph-and-context-optimization"
importance_tier: "important"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph"
    last_updated_at: "2026-04-13T12:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Created spec folder"
    next_safe_action: "Implement graph metadata files"
    key_files: ["spec.md"]

---
# Feature Specification: Skill Advisor Graph

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

## EXECUTIVE SUMMARY

Add a `graph-metadata.json` to each of the 21 skill folders (20 routable + skill-advisor itself) capturing structured relationships (dependencies, overlays, siblings, conflicts), compile them into a single lightweight `skill-graph.json` (~1-2KB), and integrate graph-derived boosts into the `skill_advisor.py` routing pipeline. This replaces implicit relationship knowledge hardcoded across 170+ intent boosters with an explicit, maintainable graph.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Implemented |
| **Created** | 2026-04-13 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Predecessor** | ../001-search-and-routing-tuning/spec.md |
| **Successor** | ../003-advisor-phrase-booster-tailoring/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM STATEMENT

The skill advisor (`skill_advisor.py`, 1728 lines) routes user requests to the correct skill among 20 options. All relationship knowledge between skills is **hardcoded** in three booster maps:

- 170 single-skill intent boosters
- 32 multi-skill boosters
- 131 phrase intent boosters

There is no structured representation of how skills relate. Relationships like "sk-code-review overlays sk-code-opencode" or "mcp-figma depends on mcp-code-mode" are embedded in scoring weights, invisible to session bootstrap, and impossible to reason about programmatically.

**Consequences:**
1. Adding a new skill requires editing 3+ booster maps manually
2. Session start has no graph context about skill topology
3. No conflict detection or family-aware routing
4. Relationship drift goes undetected
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:solution -->
## 3. SOLUTION DESIGN

### 3.1 Per-Skill Graph Metadata Schema

Each skill folder gets a `graph-metadata.json` (distinct from the spec-packet `graph-metadata.json` schema):

```json
{
  "schema_version": 1,
  "skill_id": "sk-code-review",
  "family": "sk-code",
  "category": "code-quality",
  "edges": {
    "depends_on": [],
    "enhances": [
      { "target": "sk-code-opencode", "weight": 0.7, "context": "overlay" }
    ],
    "siblings": [
      { "target": "sk-deep-review", "weight": 0.6, "context": "deep-review dispatches review" }
    ],
    "conflicts_with": [],
    "prerequisite_for": []
  },
  "domains": ["review", "audit", "security", "quality-gate"],
  "intent_signals": ["code review", "pr review", "security review"]
}
```

**Schema fields:**

| Field | Type | Description |
|-------|------|-------------|
| `schema_version` | integer | 1 or 2. Version 2 adds required `derived` metadata block |
| `skill_id` | string | Must match `name` in SKILL.md frontmatter |
| `family` | enum | `cli`, `mcp`, `sk-code`, `sk-deep`, `sk-util`, `system` |
| `category` | enum | `cli-orchestrator`, `mcp-tool`, `code-quality`, `autonomous-loop`, `utility`, `system` |
| `edges` | object | 5 directional relationship types |
| `domains` | string[] | Semantic domains for affinity matching |
| `intent_signals` | string[] | High-confidence trigger phrases |

**Edge types:**

| Type | Semantics | Weight Range |
|------|-----------|-------------|
| `depends_on` | Cannot function without target | 0.7-1.0 |
| `enhances` | Adds value alongside target (overlay) | 0.3-0.7 |
| `siblings` | Peer with shared characteristics | 0.4-0.6 |
| `conflicts_with` | Should not be recommended together | 0.5-1.0 |
| `prerequisite_for` | Inverse of depends_on | 0.7-1.0 |

### 3.2 Compiled Skill Graph

Single file at `.opencode/skill/skill-advisor/scripts/skill-graph.json`:

```json
{
  "schema_version": 1,
  "generated_at": "2026-04-13T...",
  "skill_count": 20,
  "families": { "cli": [...], "mcp": [...], ... },
  "adjacency": { "sk-code-review": { "enhances": {"sk-code-opencode": 0.7} } },
  "conflicts": [],
  "hub_skills": ["system-spec-kit", "mcp-code-mode"]
}
```

Sparse adjacency list with intent signals. Target size: <5KB minified (current: 4667 bytes).

### 3.3 Skill Advisor Integration

Three additive functions, all backwards-compatible (no-op when graph file absent):

1. **`_apply_graph_boosts()`** — Transitive boosts from graph edges (damped: 30% enhances, 15% siblings, 20% depends_on)
2. **`_apply_family_affinity()`** — 8% boost to family members when one has strong signal
3. **`_apply_graph_conflict_penalty()`** — +0.15 uncertainty for conflicting skill pairs

Pipeline insertion: after PHRASE_INTENT_BOOSTERS, before explicit variant matching.
<!-- /ANCHOR:solution -->

---

<!-- ANCHOR:scope -->
## 4. SCOPE

### In Scope
- 21 per-skill `graph-metadata.json` files (20 routable skills + skill-advisor)
- `skill_graph_compiler.py` generator script
- Compiled `skill-graph.json` output
- 4 new functions in `skill_advisor.py`
- 3 call-site insertions in `analyze_request()`
- Health check extension
- New regression test cases

### Out of Scope
- Modifying existing INTENT_BOOSTERS/MULTI_SKILL_BOOSTERS/PHRASE_INTENT_BOOSTERS (future work: could replace with graph-derived boosters)
- Session bootstrap injection (future: inject graph summary into session context)
- Graph visualization tooling
- Automated edge generation from code analysis
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:success -->
## 5. SUCCESS CRITERIA

- [x] All 21 skill folders contain valid `graph-metadata.json` (20 routable + skill-advisor)
- [x] `skill_graph_compiler.py --validate-only` passes with zero errors
- [x] Compiled `skill-graph.json` is under 5KB (4667 bytes)
- [x] `skill_advisor.py --health` reports `skill_graph_loaded: true`
- [x] 44/44 regression cases pass with zero failures
- [x] Graph boost reasons appear in advisor output (e.g., `!graph:depends(mcp-figma,0.9)`)
<!-- /ANCHOR:success -->

---

<!-- ANCHOR:files -->
## 6. KEY FILES

| File | Action |
|------|--------|
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | Modify |
| `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py` | Create |
| `.opencode/skill/skill-advisor/scripts/skill-graph.json` | Create (generated) |
| `.opencode/skill/*/graph-metadata.json` (20 files) | Create |
| `.opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` | Modify |
<!-- /ANCHOR:files -->
