---
title: "Verifi [system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/002-skill-advisor-graph/checklist]"
description: "Verification checklist for 011-skill-advisor-graph."
trigger_phrases:
  - "011-skill-advisor-graph"
  - "verification"
  - "checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/002-skill-advisor-graph"
    last_updated_at: "2026-04-13T12:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Created checklist"
    next_safe_action: "Implement graph metadata files"
    key_files: ["checklist.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
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

- [x] CHK-001: All 21 skill folders contain `graph-metadata.json` [EVIDENCE: compiler discovers 21 files (20 routable + skill-advisor)]
- [x] CHK-002: Every `skill_id` matches corresponding SKILL.md `name` field [EVIDENCE: compiler validation passes]
- [x] CHK-003: Every edge target references a valid existing skill_id [EVIDENCE: compiler validation passes]
- [x] CHK-004: All weights are in range [0.0, 1.0] [EVIDENCE: compiler validation passes]
- [x] CHK-005: `family` values are from allowed enum set [EVIDENCE: compiler validation passes]
- [x] CHK-006: `schema_version` is 1 or 2 in all files [EVIDENCE: compiler validates both versions; v2 requires `derived` block]
<!-- /ANCHOR:schema -->

---

<!-- ANCHOR:compiler -->
## Compiler (P0)

- [x] CHK-010: `skill_graph_compiler.py --validate-only` exits 0 with zero errors [EVIDENCE: "VALIDATION PASSED"]
- [x] CHK-011: `skill_graph_compiler.py` produces valid JSON output [EVIDENCE: skill-graph.json generated]
- [x] CHK-012: Compiled `skill-graph.json` is under 5KB (minified) [EVIDENCE: 4667 bytes with intent signals]
- [x] CHK-013: `hub_skills` list is correctly computed from inbound edge counts [EVIDENCE: 10 hub skills including cli-claude-code, cli-codex, cli-copilot, cli-gemini, mcp-code-mode, sk-code-full-stack, sk-code-opencode, sk-code-review, sk-code-web, system-spec-kit]
<!-- /ANCHOR:compiler -->

---

<!-- ANCHOR:integration -->
## Advisor Integration (P0)

- [x] CHK-020: `skill_advisor.py --health` reports `skill_graph_loaded: true` [EVIDENCE: health check output]
- [x] CHK-021: Graph boost reasons appear in output (e.g., `!graph:enhances(...)`) [EVIDENCE: "use figma" shows `!graph:depends(mcp-figma,0.9)`]
- [x] CHK-022: Existing 41+ regression cases pass with zero failures [EVIDENCE: 44/44 pass, 100% rate]
- [x] CHK-023: `_load_skill_graph()` returns None gracefully when file missing [EVIDENCE: try/except with OSError/JSONDecodeError]
<!-- /ANCHOR:integration -->

---

<!-- ANCHOR:behavior -->
## Behavioral Verification (P1)

- [x] CHK-030: Query "code review" routes correctly to sk-code-review at 0.95 [EVIDENCE: advisor output]
- [x] CHK-031: Query "use figma" shows dependency pull-up for mcp-code-mode [EVIDENCE: mcp-code-mode at 0.95 with `!graph:depends(mcp-figma,0.9)`]
- [x] CHK-032: Family affinity activates when one sk-code member has strong signal [EVIDENCE: verified via _apply_family_affinity() code path; activation requires strong member score > threshold in same family]
- [ ] CHK-033: Conflict penalty increases uncertainty for conflicting pairs [DEFERRED: no conflicts defined yet, mechanism is implemented and tested via code review]
<!-- /ANCHOR:behavior -->

---

<!-- ANCHOR:regression -->
## Regression Safety (P1)

- [x] CHK-040: No existing P0 regression case changes its top-1 recommendation [EVIDENCE: 12/12 P0 cases pass]
- [x] CHK-041: New graph-boost regression cases added and passing [EVIDENCE: P1-GRAPH-001/002/003 added, all pass]
<!-- /ANCHOR:regression -->
