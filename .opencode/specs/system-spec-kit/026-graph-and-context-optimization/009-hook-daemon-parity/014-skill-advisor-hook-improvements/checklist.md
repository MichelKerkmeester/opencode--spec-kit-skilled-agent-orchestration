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
    recent_action: "packet-014-checklist-written"
    next_safe_action: "archive-or-track-build-blockers"
    completion_pct: 100
---
# Verification Checklist: Skill-Advisor Hook Improvements

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->

---

## Verification Protocol
<!-- ANCHOR:protocol -->

### P0 - Blockers

- [x] REQ-001 Complete 10 sk-deep-research iterations on the topic defined in spec Section 2. [Evidence: `../../research/014-skill-advisor-hook-improvements-pt-02/iterations/iteration-01.md` through `../../research/014-skill-advisor-hook-improvements-pt-02/iterations/iteration-10.md`; `../../research/014-skill-advisor-hook-improvements-pt-02/deep-research-state.jsonl`]
- [x] REQ-002 Final research synthesis written with required sections. [Evidence: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/research/014-skill-advisor-hook-improvements-pt-02/research.md`]
- [x] REQ-003 Findings registry JSON emitted. [Evidence: `../../research/014-skill-advisor-hook-improvements-pt-02/findings-registry.json`]
<!-- /ANCHOR:protocol -->

## Pre-Implementation
<!-- ANCHOR:pre-impl -->

### P1 - Required

- [x] REQ-004 Every finding cites code paths or prior-research sections with line-level specificity. [Evidence: `../../research/014-skill-advisor-hook-improvements-pt-02/findings-registry.json` entries cite `path:line` anchors.]
- [x] REQ-005 Recommended fixes grouped by logical bucket. [Evidence: `findings-registry.json` plus the packet-02 research synthesis bucketed recommendations section.]

### Task Tracking

- [x] [P1] T-001 Add OpenCode threshold/render regression scaffolds. [Evidence: `applied/T-001.md`]
- [x] [P1] T-002 Add Codex shared-brief parity fixtures. [Evidence: `applied/T-002.md`]
- [x] [P1] T-003 Establish explicit workspaceRoot and threshold-semantic baseline assertions. [Evidence: `applied/T-003.md`]
- [x] [P1] T-004 Capture durable-diagnostics and outcome-event baseline expectations. [Evidence: `applied/T-004.md`]
- [x] [P1] T-005 Implement OpenCode effective-threshold unification. [Evidence: `applied/T-005.md`]
- [x] [P1] T-006 Route OpenCode native rendering onto shared brief invariants. [Evidence: `applied/T-006.md`]
- [x] [P1] T-007 Normalize the Codex prompt-time fast path against the shared builder. [Evidence: `applied/T-007.md`]
- [x] [P1] T-008 Add explicit workspace selection across public advisor tools. [Evidence: `applied/T-008.md`]
- [x] [P1] T-009 Publish aggregate-vs-runtime threshold semantics in validation outputs. [Evidence: `applied/T-009.md`]
- [x] [P1] T-010 Add a durable prompt-safe diagnostics sink and health surface. [Evidence: `applied/T-010.md`]
- [x] [P1] T-011 Add accepted/corrected/ignored outcome capture. [Evidence: `applied/T-011.md`]
- [x] [P1] T-012 Run OpenCode parity regressions. [Evidence: `applied/T-012.md`]
- [x] [P1] T-013 Run Codex parity regressions. [Evidence: `applied/T-013.md`]
- [x] [P1] T-014 Run validator and cross-consistency checks. [Evidence: `applied/T-014.md`]
- [x] [P1] T-015 Run telemetry persistence and outcome-learning verification. [Evidence: `applied/T-015.md`]
<!-- /ANCHOR:pre-impl -->

## Code Quality
<!-- ANCHOR:code-quality -->

- [x] Focused OpenCode parity suite passed. [Evidence: `applied/T-012.md`]
- [x] Focused validator suite passed. [Evidence: `applied/T-014.md`]
- [x] Full-package build blocker documented honestly. [Evidence: `implementation-summary.md` verification table.]
<!-- /ANCHOR:code-quality -->

## Testing
<!-- ANCHOR:testing -->

- [x] Direct bridge smoke returned the unified threshold metadata. [Evidence: `applied/T-012.md`]
- [x] Direct Codex hook and prompt-wrapper smokes returned prompt-safe output. [Evidence: `applied/T-013.md`]
- [x] Validator telemetry smoke returned retained diagnostics and 3 recorded outcome events. [Evidence: `applied/T-015.md`]
<!-- /ANCHOR:testing -->

## Security
<!-- ANCHOR:security -->

- [x] Durable telemetry remains prompt-safe and excludes raw prompt text. [Evidence: `applied/T-004.md`, `applied/T-010.md`]
- [x] Public outputs expose thresholds and workspace roots without exposing prompt bodies. [Evidence: `applied/T-003.md`, `applied/T-009.md`]
<!-- /ANCHOR:security -->

## Documentation
<!-- ANCHOR:docs -->

- [x] Public README now documents `workspaceRoot`, `effectiveThresholds`, and `thresholdSemantics`. [Evidence: `applied/T-003.md`, `applied/T-009.md`]
- [x] Hook reference now documents the plugin-helper bridge path and the `0.8 / 0.35` OpenCode contract. [Evidence: `applied/T-005.md`]
<!-- /ANCHOR:docs -->

## File Organization
<!-- ANCHOR:file-org -->

- [x] All per-task applied reports were written under `applied/T-###.md`. [Evidence: `applied/T-001.md` through `applied/T-015.md`]
- [x] Packet implementation summary was written. [Evidence: `implementation-summary.md`]
- [x] Packet verification checklist was written. [Evidence: this file]
<!-- /ANCHOR:file-org -->

## Verification Summary
<!-- ANCHOR:summary -->

- [x] Packet implementation is complete for tasks T-001 through T-015. [Evidence: `applied/T-001.md` through `applied/T-015.md`]
- [x] The remaining validation failure is packet-preexisting and outside the allowed edit scope (`spec.md`, `plan.md`, `tasks.md`). [Evidence: strict validator output captured during this implementation pass.]
<!-- /ANCHOR:summary -->
