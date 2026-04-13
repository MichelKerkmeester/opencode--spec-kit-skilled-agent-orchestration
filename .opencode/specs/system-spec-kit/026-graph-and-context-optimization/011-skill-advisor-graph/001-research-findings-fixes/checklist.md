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
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-skill-advisor-graph/001-research-findings-fixes"
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

- [x] CHK-001: `_apply_graph_boosts()` skips targets with zero pre-graph score [EVIDENCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py` function `_apply_graph_boosts()` gates graph propagation on the pre-graph snapshot.]
- [x] CHK-002: `_apply_family_affinity()` skips members with zero pre-graph score [EVIDENCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py` function `_apply_family_affinity()` checks the same pre-graph snapshot before sibling/family boosts.]
- [x] CHK-003: Query `"build something generic"` does NOT surface unrelated family members purely from graph [EVIDENCE: regression command `python3 .opencode/skill/skill-advisor/scripts/skill_advisor_regression.py --dataset .opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` returned 44/44 with the graph guard cases included in the dataset.]
- [x] CHK-004: Query `"code review"` still shows graph boosts for skills that already have lexical evidence [EVIDENCE: dataset case `P1-REVIEW-001` in `.opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` keeps `sk-code-review` as an expected top skill.]
<!-- /ANCHOR:p0-ghost -->

---

<!-- ANCHOR:p0-edges -->
## Edge Gap Fixes (P0)

- [x] CHK-010: system-spec-kit has 3+ outbound enhances edges [EVIDENCE: `.opencode/skill/system-spec-kit/graph-metadata.json` lists `sk-doc`, `sk-git`, and `sk-code-opencode` as outbound enhances targets.]
- [x] CHK-011: sk-doc has enhances edge to system-spec-kit [EVIDENCE: `.opencode/skill/sk-doc/graph-metadata.json` contains `target: "system-spec-kit"` under `enhances`.]
- [x] CHK-012: mcp-coco-index has enhances edge to system-spec-kit [EVIDENCE: `.opencode/skill/mcp-coco-index/graph-metadata.json` contains `target: "system-spec-kit"` under `enhances`.]
- [x] CHK-013: sk-improve-prompt has enhances edges to all 4 CLI skills [EVIDENCE: `.opencode/skill/sk-improve-prompt/graph-metadata.json` contains `target` entries for `cli-claude-code`, `cli-codex`, `cli-copilot`, and `cli-gemini`.]
- [x] CHK-014: Compiler validation still passes after all edge changes [EVIDENCE: `python3 .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py --validate-only` exited 0 with `VALIDATION PASSED`.]
<!-- /ANCHOR:p0-edges -->

---

<!-- ANCHOR:p0-compiler -->
## Compiler & Schema Fixes (P0)

- [x] CHK-020: Compiled skill-graph.json includes `signals` field with intent_signals [EVIDENCE: `.opencode/skill/skill-advisor/scripts/skill-graph.json` has a top-level `signals` object keyed by skill id.]
- [x] CHK-021: Compiled skill-graph.json includes `prerequisite_for` in adjacency [EVIDENCE: `.opencode/skill/skill-advisor/scripts/skill-graph.json` includes `prerequisite_for` for `mcp-code-mode` and `sk-code-review`.]
- [x] CHK-022: Compiled file size under 4KB [EVIDENCE: `wc -c .opencode/skill/skill-advisor/scripts/skill-graph.json` returned `3958`.]
- [x] CHK-023: `--validate-only` still passes [EVIDENCE: `python3 .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py --validate-only` returned `VALIDATION PASSED`.]
<!-- /ANCHOR:p0-compiler -->

---

<!-- ANCHOR:p0-evidence -->
## Evidence Separation (P0)

- [x] CHK-030: Graph-derived boosts tracked separately from direct evidence [EVIDENCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py` writes `_graph_boost_count` into each recommendation before calibration.]
- [x] CHK-031: Confidence slightly reduced when majority of evidence is graph-derived [EVIDENCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py` applies the post-calibration 10% penalty when `_graph_boost_count / num_matches > 0.5`.]
- [x] CHK-032: Recommendations with only direct evidence are unaffected [EVIDENCE: regression command `python3 .opencode/skill/skill-advisor/scripts/skill_advisor_regression.py --dataset .opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` still returned 44/44 passing.]
<!-- /ANCHOR:p0-evidence -->

---

<!-- ANCHOR:p1-validation -->
## Compiler Validation Hardening (P1)

- [x] CHK-040: Warning emitted for zero-edge skills [EVIDENCE: `python3 .opencode/skill/skill-advisor/scripts/skill_graph_compiler.py --validate-only` currently emits `ZERO-EDGE WARNINGS` for `sk-deep-research` and `sk-git`.]
- [x] CHK-041: Error emitted for self-referencing edges [EVIDENCE: `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py` `validate_skill_metadata()` rejects self-targeting edges.]
- [x] CHK-042: Warning emitted for dependency cycles [EVIDENCE: `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py` cycle validation runs before compile output generation.]
- [ ] CHK-043: Warning emitted for enhances weight asymmetry >0.3 [DEFERRED: P1-1 partial, low priority]
<!-- /ANCHOR:p1-validation -->

---

<!-- ANCHOR:p1-other -->
## Other P1 Fixes

- [ ] CHK-050: `--audit-drift` flag works and reports phrase/graph overlap [DEFERRED: P1-2]
- [x] CHK-051: sk-deep-review and sk-deep-research no longer siblings [EVIDENCE: `.opencode/skill/sk-deep-review/graph-metadata.json` and `.opencode/skill/sk-deep-research/graph-metadata.json` both contain `"siblings": []`.]
- [ ] CHK-052: Reason field groups by source type (direct, semantic, graph) [DEFERRED: P1-4]
- [ ] CHK-053: CocoIndex failures produce diagnostic trace in boost_reasons [DEFERRED: P1-5]
<!-- /ANCHOR:p1-other -->

---

<!-- ANCHOR:regression -->
## Regression Safety (P0)

- [x] CHK-060: All existing regression cases pass [EVIDENCE: `python3 .opencode/skill/skill-advisor/scripts/skill_advisor_regression.py --dataset .opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` returned `44/44` passing.]
- [x] CHK-061: New ghost-candidate prevention test cases added and passing [EVIDENCE: `.opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl` includes `P1-GRAPH-001`, `P1-GRAPH-002`, and `P1-GRAPH-003`, and the regression run passed all three.]
- [x] CHK-062: New edge-gap test cases added and passing [EVIDENCE: dataset case `P1-FIGMA-001` plus the `P1-GRAPH-*` cases passed in the same `44/44` regression run.]
<!-- /ANCHOR:regression -->
