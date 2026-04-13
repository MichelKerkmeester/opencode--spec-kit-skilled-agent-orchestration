---
title: "Verification Checklist: Skill Graph Research Findings Fixes [template:level_2/checklist.md]"
description: "Verification checklist for 001-research-findings-fixes."
trigger_phrases:
  - "001-research-findings-fixes"
  - "verification"
  - "checklist"
importance_tier: "important"
contextType: "verification"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-skill-advisor-graph/001-research-findings-fixes"
    last_updated_at: "2026-04-13T16:00:00Z"
    last_updated_by: "claude-opus-4-6"
    recent_action: "Created checklist"
    next_safe_action: "Implement fixes"
    key_files: ["checklist.md"]

---
# Verification Checklist: Skill Graph Research Findings Fixes

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

<!-- ANCHOR:p0-ghost -->
## Ghost Candidate Prevention (P0)

- [ ] CHK-001: `_apply_graph_boosts()` skips targets with zero pre-graph score
- [ ] CHK-002: `_apply_family_affinity()` skips members with zero pre-graph score
- [ ] CHK-003: Query `"build something generic"` does NOT surface unrelated family members purely from graph
- [ ] CHK-004: Query `"code review"` still shows graph boosts for skills that already have lexical evidence
<!-- /ANCHOR:p0-ghost -->

---

<!-- ANCHOR:p0-edges -->
## Edge Gap Fixes (P0)

- [ ] CHK-010: system-spec-kit has 3+ outbound enhances edges
- [ ] CHK-011: sk-doc has enhances edge to system-spec-kit
- [ ] CHK-012: mcp-coco-index has enhances edge to system-spec-kit
- [ ] CHK-013: sk-improve-prompt has enhances edges to all 4 CLI skills
- [ ] CHK-014: Compiler validation still passes after all edge changes
<!-- /ANCHOR:p0-edges -->

---

<!-- ANCHOR:p0-compiler -->
## Compiler & Schema Fixes (P0)

- [ ] CHK-020: Compiled skill-graph.json includes `signals` field with intent_signals
- [ ] CHK-021: Compiled skill-graph.json includes `prerequisite_for` in adjacency
- [ ] CHK-022: Compiled file size under 4KB
- [ ] CHK-023: `--validate-only` still passes
<!-- /ANCHOR:p0-compiler -->

---

<!-- ANCHOR:p0-evidence -->
## Evidence Separation (P0)

- [ ] CHK-030: Graph-derived boosts tracked separately from direct evidence
- [ ] CHK-031: Confidence slightly reduced when majority of evidence is graph-derived
- [ ] CHK-032: Recommendations with only direct evidence are unaffected
<!-- /ANCHOR:p0-evidence -->

---

<!-- ANCHOR:p1-validation -->
## Compiler Validation Hardening (P1)

- [ ] CHK-040: Warning emitted for zero-edge skills
- [ ] CHK-041: Error emitted for self-referencing edges
- [ ] CHK-042: Warning emitted for dependency cycles
- [ ] CHK-043: Warning emitted for enhances weight asymmetry >0.3
<!-- /ANCHOR:p1-validation -->

---

<!-- ANCHOR:p1-other -->
## Other P1 Fixes

- [ ] CHK-050: `--audit-drift` flag works and reports phrase/graph overlap
- [ ] CHK-051: sk-deep-review and sk-deep-research no longer siblings
- [ ] CHK-052: Reason field groups by source type (direct, semantic, graph)
- [ ] CHK-053: CocoIndex failures produce diagnostic trace in boost_reasons
<!-- /ANCHOR:p1-other -->

---

<!-- ANCHOR:regression -->
## Regression Safety (P0)

- [ ] CHK-060: All existing regression cases pass
- [ ] CHK-061: New ghost-candidate prevention test cases added and passing
- [ ] CHK-062: New edge-gap test cases added and passing
<!-- /ANCHOR:regression -->
