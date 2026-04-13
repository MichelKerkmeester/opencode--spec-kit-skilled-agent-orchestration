---
title: "Verification Checklist: Skill Advisor Graph [template:level_2/checklist.md]"
description: "Verification checklist for 007-skill-advisor-graph."
trigger_phrases:
  - "007-skill-advisor-graph"
  - "verification"
  - "checklist"
importance_tier: "important"
contextType: "verification"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph"
    last_updated_at: "2026-04-13T12:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Created checklist"
    next_safe_action: "Implement graph metadata files"
    key_files: ["checklist.md"]

---
# Verification Checklist: Skill Advisor Graph

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | HARD BLOCKER | Cannot claim done until complete |
| **P1** | Required | Complete or explicitly defer with rationale |
| **P2** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:schema -->
## Schema & Metadata (P0)

- [ ] CHK-001: All 20 skill folders contain `graph-metadata.json`
- [ ] CHK-002: Every `skill_id` matches corresponding SKILL.md `name` field
- [ ] CHK-003: Every edge target references a valid existing skill_id
- [ ] CHK-004: All weights are in range [0.0, 1.0]
- [ ] CHK-005: `family` values are from allowed enum set
- [ ] CHK-006: `schema_version` is 1 in all files
<!-- /ANCHOR:schema -->

---

<!-- ANCHOR:compiler -->
## Compiler (P0)

- [ ] CHK-010: `skill_graph_compiler.py --validate-only` exits 0 with zero errors
- [ ] CHK-011: `skill_graph_compiler.py` produces valid JSON output
- [ ] CHK-012: Compiled `skill-graph.json` is under 2KB (minified)
- [ ] CHK-013: `hub_skills` list is correctly computed from inbound edge counts
<!-- /ANCHOR:compiler -->

---

<!-- ANCHOR:integration -->
## Advisor Integration (P0)

- [ ] CHK-020: `skill_advisor.py --health` reports `skill_graph_loaded: true`
- [ ] CHK-021: Graph boost reasons appear in output (e.g., `!graph:enhances(...)`)
- [ ] CHK-022: Existing 41+ regression cases pass with zero failures
- [ ] CHK-023: `_load_skill_graph()` returns None gracefully when file missing
<!-- /ANCHOR:integration -->

---

<!-- ANCHOR:behavior -->
## Behavioral Verification (P1)

- [ ] CHK-030: Query "code review" shows graph-derived boost for sk-code-opencode
- [ ] CHK-031: Query "use figma" shows dependency pull-up for mcp-code-mode
- [ ] CHK-032: Family affinity activates when one CLI skill has strong signal
- [ ] CHK-033: Conflict penalty increases uncertainty for conflicting pairs
<!-- /ANCHOR:behavior -->

---

<!-- ANCHOR:regression -->
## Regression Safety (P1)

- [ ] CHK-040: No existing regression case changes its top-1 recommendation
- [ ] CHK-041: New graph-boost regression cases added and passing
<!-- /ANCHOR:regression -->
