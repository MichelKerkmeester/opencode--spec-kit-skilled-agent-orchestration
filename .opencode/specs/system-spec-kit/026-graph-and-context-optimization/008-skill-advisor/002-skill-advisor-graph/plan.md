---
title: "Implementat [system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/002-skill-advisor-graph/plan]"
description: "Implementation plan for adding graph metadata to all skills and integrating into the skill advisor."
trigger_phrases:
  - "011-skill-advisor-graph"
  - "implementation"
  - "plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/002-skill-advisor-graph"
    last_updated_at: "2026-04-13T12:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Created plan"
    next_safe_action: "Implement graph metadata files"
    key_files: ["plan.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
---
# Implementation Plan: Skill Advisor Graph

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python (compiler + advisor integration), JSON (metadata) |
| **Framework** | skill_advisor.py routing pipeline |
| **Storage** | Per-skill graph-metadata.json, compiled skill-graph.json |
| **Testing** | Existing regression harness (skill_advisor_regression.py) |

### Overview
Add structured graph metadata to all 20 skill folders, compile into a lightweight graph, and integrate graph-derived transitive boosts into the skill advisor's scoring pipeline. All additions are backwards-compatible.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Skill advisor codebase analyzed (1728 lines, 7-step pipeline)
- [x] All 20 skills identified with implicit relationships mapped
- [x] Spec-packet graph-metadata.json schema reviewed (different schema needed for skills)
- [x] Integration points in analyze_request() identified (lines 1392, 1394, 1481)

### Definition of Done
- [ ] All 20 graph-metadata.json files pass schema validation
- [ ] Compiled skill-graph.json is under 2KB
- [ ] Zero regressions on existing test cases
- [ ] Health check reports graph status
- [ ] Graph boost reasons visible in advisor output
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:approach -->
## 3. APPROACH

### Phase 1: Metadata & Compiler

1. Author 20 `graph-metadata.json` files using the edge inventory from research
2. Write `skill_graph_compiler.py` with discover, validate, compile functions
3. Generate `skill-graph.json` and verify size

### Phase 2: Advisor Integration

4. Add `_load_skill_graph()` lazy loader to `skill_advisor.py` (near line 46)
5. Implement `_apply_graph_boosts()` with snapshot pattern (insert after line 1392)
6. Implement `_apply_family_affinity()` (insert alongside graph boosts)
7. Implement `_apply_graph_conflict_penalty()` (insert after calibration, ~line 1481)
8. Extend `health_check()` with graph diagnostics (line 1530)

### Phase 3: Verification

9. Run existing regression suite — zero failures required
10. Add new test cases for graph boost behavior
11. Manual verification with sample queries

### Damping Constants

| Edge Type | Damping Factor | Rationale |
|-----------|---------------|-----------|
| `enhances` | 0.30 | Moderate transitive — overlay relationship is meaningful |
| `depends_on` | 0.20 | Pull-up dependency — lighter to avoid over-promoting infrastructure |
| `siblings` | 0.15 | Light affinity — family relationship is informational |
| `family` | 0.08 | Very light — prevents family flooding |
| Floor | 0.10 | Boosts below this are dropped as noise |
<!-- /ANCHOR:approach -->

---

<!-- ANCHOR:risks -->
## 4. RISKS

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Graph boosts cause regression | Medium | Damping factors are conservative; snapshot pattern prevents feedback; existing regression suite must pass |
| Compiled graph exceeds 2KB | Low | Sparse adjacency; 20 skills with ~2-4 edges each; minify option available |
| Graph metadata drifts | Medium | Compiler validates edge targets; health check reports status; `--validate-only` for CI |
| Schema collision with spec-packet graph-metadata.json | Low | Different `skill_id` vs `packet_id` fields; different directory trees |
<!-- /ANCHOR:risks -->
