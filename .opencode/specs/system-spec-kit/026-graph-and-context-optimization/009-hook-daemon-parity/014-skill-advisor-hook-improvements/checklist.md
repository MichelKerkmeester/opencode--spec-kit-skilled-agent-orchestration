---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->"
title: "Verification Checklist: Skill-Advisor Hook Improvements"
description: "Evidence-backed completion checklist for packet 014 skill-advisor runtime parity, MCP surface normalization, and telemetry durability."
trigger_phrases:
  - "014 skill-advisor checklist"
  - "026/009/014 verification"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/014-skill-advisor-hook-improvements"
    last_updated_at: "2026-04-24T08:13:17Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Completed implementation reports, summary, and verification checklist"
    next_safe_action: "Archive packet or carry forward the unrelated full-build blockers separately if desired"
    completion_pct: 100
---
# Verification Checklist: Skill-Advisor Hook Improvements

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->

---

## Per-Task Completion

- [x] T-001 Add OpenCode threshold/render regression scaffolds. [Evidence: `applied/T-001.md`]
- [x] T-002 Add Codex shared-brief parity fixtures. [Evidence: `applied/T-002.md`]
- [x] T-003 Establish explicit workspaceRoot and threshold-semantic baseline assertions. [Evidence: `applied/T-003.md`]
- [x] T-004 Capture durable-diagnostics and outcome-event baseline expectations. [Evidence: `applied/T-004.md`]
- [x] T-005 Implement OpenCode effective-threshold unification. [Evidence: `applied/T-005.md`]
- [x] T-006 Route OpenCode native rendering onto shared brief invariants. [Evidence: `applied/T-006.md`]
- [x] T-007 Normalize the Codex prompt-time fast path against the shared builder. [Evidence: `applied/T-007.md`]
- [x] T-008 Add explicit workspace selection across public advisor tools. [Evidence: `applied/T-008.md`]
- [x] T-009 Publish aggregate-vs-runtime threshold semantics in validation outputs. [Evidence: `applied/T-009.md`]
- [x] T-010 Add a durable prompt-safe diagnostics sink and health surface. [Evidence: `applied/T-010.md`]
- [x] T-011 Add accepted/corrected/ignored outcome capture. [Evidence: `applied/T-011.md`]
- [x] T-012 Run OpenCode parity regressions. [Evidence: `applied/T-012.md`]
- [x] T-013 Run Codex parity regressions. [Evidence: `applied/T-013.md`]
- [x] T-014 Run validator and cross-consistency checks. [Evidence: `applied/T-014.md`]
- [x] T-015 Run telemetry persistence and outcome-learning verification. [Evidence: `applied/T-015.md`]

## P0 Blockers

- [x] REQ-001 Complete 10 sk-deep-research iterations on the topic defined in spec Section 2. [Evidence: `../../research/014-skill-advisor-hook-improvements-pt-02/iterations/iteration-01.md` through `iteration-10.md`; `../../research/014-skill-advisor-hook-improvements-pt-02/deep-research-state.jsonl`]
- [x] REQ-002 Final `research.md` synthesis written with required sections. [Evidence: `../../research/014-skill-advisor-hook-improvements-pt-02/research.md`]
- [x] REQ-003 Findings registry JSON emitted. [Evidence: `../../research/014-skill-advisor-hook-improvements-pt-02/findings-registry.json`]

## P1 Required

- [x] REQ-004 Every finding cites code paths or prior-research sections with line-level specificity. [Evidence: `../../research/014-skill-advisor-hook-improvements-pt-02/findings-registry.json` entries cite `path:line` anchors.]
- [x] REQ-005 Recommended fixes grouped by logical bucket. [Evidence: `../../research/014-skill-advisor-hook-improvements-pt-02/research.md#recommended-fixes`]

## Completion Gate

- [x] All per-task applied reports were written under `applied/T-###.md`. [Evidence: `applied/T-001.md` ... `applied/T-015.md`]
- [x] Packet implementation summary was written. [Evidence: `implementation-summary.md`]
- [x] Packet verification checklist was written. [Evidence: this file]
- [x] Focused OpenCode parity verification passed. [Evidence: `applied/T-012.md`]
- [x] Focused validator verification passed. [Evidence: `applied/T-014.md`]
- [x] Telemetry persistence and outcome-learning verification passed. [Evidence: `applied/T-015.md`]
- [x] Full-package build blocker was documented honestly instead of suppressed. [Evidence: `implementation-summary.md#verification` and `Known Limitations`]
