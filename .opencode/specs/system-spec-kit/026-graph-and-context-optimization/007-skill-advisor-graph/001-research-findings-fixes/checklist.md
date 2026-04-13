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

- [x] CHK-001: `_apply_graph_boosts()` skips targets with zero pre-graph score [EVIDENCE: snapshot check in _apply_graph_boosts()]
- [x] CHK-002: `_apply_family_affinity()` skips members with zero pre-graph score [EVIDENCE: snapshot check in _apply_family_affinity()]
- [x] CHK-003: Query `"build something generic"` does NOT surface unrelated family members purely from graph [EVIDENCE: verified in regression]
- [x] CHK-004: Query `"code review"` still shows graph boosts for skills that already have lexical evidence [EVIDENCE: sk-code-review at 0.95]
<!-- /ANCHOR:p0-ghost -->

---

<!-- ANCHOR:p0-edges -->
## Edge Gap Fixes (P0)

- [x] CHK-010: system-spec-kit has 3+ outbound enhances edges [EVIDENCE: sk-doc, sk-git, sk-code-opencode]
- [x] CHK-011: sk-doc has enhances edge to system-spec-kit [EVIDENCE: graph-metadata.json updated]
- [x] CHK-012: mcp-coco-index has enhances edge to system-spec-kit [EVIDENCE: graph-metadata.json updated]
- [x] CHK-013: sk-improve-prompt has enhances edges to all 4 CLI skills [EVIDENCE: 4 enhances edges added]
- [x] CHK-014: Compiler validation still passes after all edge changes [EVIDENCE: --validate-only passes]
<!-- /ANCHOR:p0-edges -->

---

<!-- ANCHOR:p0-compiler -->
## Compiler & Schema Fixes (P0)

- [x] CHK-020: Compiled skill-graph.json includes `signals` field with intent_signals [EVIDENCE: signals field present in skill-graph.json]
- [x] CHK-021: Compiled skill-graph.json includes `prerequisite_for` in adjacency [EVIDENCE: prerequisite_for edges in compiled output]
- [x] CHK-022: Compiled file size under 4KB [EVIDENCE: 3957 bytes]
- [x] CHK-023: `--validate-only` still passes [EVIDENCE: "VALIDATION PASSED"]
<!-- /ANCHOR:p0-compiler -->

---

<!-- ANCHOR:p0-evidence -->
## Evidence Separation (P0)

- [x] CHK-030: Graph-derived boosts tracked separately from direct evidence [EVIDENCE: _graph_boost_count field]
- [x] CHK-031: Confidence slightly reduced when majority of evidence is graph-derived [EVIDENCE: 10% penalty at >50% graph fraction]
- [x] CHK-032: Recommendations with only direct evidence are unaffected [EVIDENCE: regression suite 44/44]
<!-- /ANCHOR:p0-evidence -->

---

<!-- ANCHOR:p1-validation -->
## Compiler Validation Hardening (P1)

- [x] CHK-040: Warning emitted for zero-edge skills [EVIDENCE: compiler warns on orphans]
- [x] CHK-041: Error emitted for self-referencing edges [EVIDENCE: compiler errors on self-refs]
- [x] CHK-042: Warning emitted for dependency cycles [EVIDENCE: cycle detection implemented]
- [ ] CHK-043: Warning emitted for enhances weight asymmetry >0.3 [DEFERRED: P1-1 partial, low priority]
<!-- /ANCHOR:p1-validation -->

---

<!-- ANCHOR:p1-other -->
## Other P1 Fixes

- [ ] CHK-050: `--audit-drift` flag works and reports phrase/graph overlap [DEFERRED: P1-2]
- [x] CHK-051: sk-deep-review and sk-deep-research no longer siblings [EVIDENCE: both siblings arrays empty]
- [ ] CHK-052: Reason field groups by source type (direct, semantic, graph) [DEFERRED: P1-4]
- [ ] CHK-053: CocoIndex failures produce diagnostic trace in boost_reasons [DEFERRED: P1-5]
<!-- /ANCHOR:p1-other -->

---

<!-- ANCHOR:regression -->
## Regression Safety (P0)

- [x] CHK-060: All existing regression cases pass [EVIDENCE: 44/44 pass, 100% rate]
- [x] CHK-061: New ghost-candidate prevention test cases added and passing [EVIDENCE: P1-GRAPH cases pass]
- [x] CHK-062: New edge-gap test cases added and passing [EVIDENCE: regression suite green]
<!-- /ANCHOR:regression -->
