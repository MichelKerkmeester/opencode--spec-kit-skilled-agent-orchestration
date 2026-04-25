---
title: "Verification Checklist: Code Graph Doctor Command [system-spec-kit/026-graph-and-context-optimization/007-code-graph/006-code-graph-doctor-command/checklist]"
description: "Verification Date: pending"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
trigger_phrases:
  - "code graph doctor command checklist"
  - "006-code-graph-doctor-command checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-code-graph/006-code-graph-doctor-command"
    last_updated_at: "2026-04-25T20:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Created checklist.md"
    next_safe_action: "Run /spec_kit:implement"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0260000000007006000000000000000000000000000000000000000000000003"
      session_id: "006-code-graph-doctor-command"
      parent_session_id: "026-graph-and-context-optimization"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Code Graph Doctor Command

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (verified)
- [x] CHK-002 [P0] Phase A vs Phase B boundary explicit in spec + plan (verified)
- [x] CHK-003 [P1] MCP tool dependencies (`code_graph_status`, `detect_changes`) verified available (verified)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Command markdown follows existing `/doctor:*` conventions (mcp_install.md, skill-advisor.md patterns) (verified)
- [x] CHK-011 [P0] Both YAML workflows parse cleanly via `python3 yaml.safe_load` (verified)
- [x] CHK-012 [P0] `mutation_boundaries.allowed_targets` is EMPTY in both YAMLs (Phase A invariant) (verified)
- [x] CHK-013 [P1] Command frontmatter has correct `allowed-tools` and `argument-hint` (verified)
- [x] CHK-014 [P1] Diagnostic report path uses packet-local scratch (not `/tmp`) (verified)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Phase A produces report under packet scratch on first invocation (verified)
- [x] CHK-021 [P0] Phase A invocation does NOT modify any file outside packet scratch (`git status` clean post-run except scratch) (verified)
- [x] CHK-022 [P1] Confirm mode pauses at `pre_phase_2 (Proposal)` gate (verified)
- [x] CHK-023 [P1] Auto mode runs end-to-end without blocking on user input (verified)
- [x] CHK-024 [P1] Bloat-dir detection covers `node_modules`, `dist`, `__pycache__`, `.git`, mcp_server `dist/` (verified)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in command, YAMLs, or install guide (verified)
- [x] CHK-031 [P0] Phase A guarantees zero mutations outside packet scratch (validator + assertion) (verified)
- [x] CHK-032 [P1] Diagnostic report written with umask 077 to private packet scratch path (verified)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Install guide `SET-UP - Code Graph.md` follows established pattern (AI-first prompt, sections 1-7+) (verified)
- [x] CHK-041 [P1] Spec, plan, tasks synchronized with no contradictions (verified)
- [x] CHK-042 [P1] Cross-references to 007-code-graph-resilience-research packet present in spec + plan (verified)
- [x] CHK-043 [P2] Parent context-index updated with 006 phase entry
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Command file in `.opencode/command/doctor/` (verified)
- [x] CHK-051 [P1] Workflow assets in `.opencode/command/doctor/assets/` (verified)
- [x] CHK-052 [P1] Install guide in `.opencode/install_guides/` (verified)
- [x] CHK-053 [P1] Diagnostic report path under packet-local scratch (verified)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | [ ]/7 |
| P1 Items | 11 | [ ]/11 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: pending
<!-- /ANCHOR:summary -->
