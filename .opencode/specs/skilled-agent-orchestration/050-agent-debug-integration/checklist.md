---
title: "Verification Checklist: Debug Agent Integration"
description: "Verification Date: TBD on completion"
trigger_phrases:
  - "debug integration verification"
  - "checklist debug-delegation"
  - "p0 p1 debug"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/050-agent-debug-integration"
    last_updated_at: "2026-04-27T08:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Drafted Level 2 verification checklist"
    next_safe_action: "Begin implementation, mark items with evidence as work completes"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/050-agent-debug-integration/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-04-27-debug-integration"
      parent_session_id: null
    completion_pct: 40
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Debug Agent Integration

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

- [ ] CHK-001 [P0] Requirements documented in spec.md (REQ-001 through REQ-008)
- [ ] CHK-002 [P0] Technical approach defined in plan.md (Phase 1-4)
- [ ] CHK-003 [P1] Dependencies identified and available (`validate.sh`, `debug-delegation.md` template, Debug Context Handoff schema)
- [ ] CHK-004 [P0] User constraint captured: NO auto-dispatch under any condition (memory: `feedback_debug_agent_user_invoked_only.md`)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] No "auto-dispatch" / "Task tool dispatches a focused" / "automatically routes" wording in any of the 9 modified files (grep returns zero matches)
- [ ] CHK-011 [P0] Four runtime debug agent descriptions semantically aligned (side-by-side diff confirms parity)
- [ ] CHK-012 [P0] Scaffold generator script is executable and produces well-formed Markdown matching the Debug Context Handoff schema
- [ ] CHK-013 [P1] No new TypeScript / JavaScript / Bash code paths invoke `Task tool → @debug` without explicit user `y` confirmation
- [ ] CHK-014 [P1] YAML edits preserve the existing `agent_availability.debug` block structure (just rename / annotate metadata, don't restructure the schema)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Manual rehearsal — y branch: prompt fires, scaffold lands, NO auto-dispatch (REQ-004, REQ-005)
- [ ] CHK-021 [P0] Manual rehearsal — continue manually branch: clean continuation, no scaffold, counter not reset (REQ-006)
- [ ] CHK-022 [P0] Manual rehearsal — skip branch: clean skip, counter resets per existing reset_on rule (REQ-006)
- [ ] CHK-023 [P0] Static grep for forbidden phrases returns zero matches across all 9 modified files (REQ-001, REQ-002)
- [ ] CHK-024 [P1] Edge case: `debug-delegation.md` already exists → scaffold writes versioned `debug-delegation-002.md` instead of overwriting
- [ ] CHK-025 [P1] Edge case: empty failure trail → scaffold uses `[failure trail not captured]` placeholder, prompt still fires
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets in scaffold generator or YAML edits
- [ ] CHK-031 [P0] Scaffold generator validates spec-folder path stays within approved roots (`specs/` or `.opencode/specs/`) per existing `resolve_and_validate_spec_path` semantics
- [ ] CHK-032 [P1] Generator does not execute arbitrary commands from failure-trail content (treat all input strings as untrusted markdown content)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] spec.md / plan.md / tasks.md / checklist.md / implementation-summary.md present and synchronized (REQ-007 — `validate.sh --strict` passes)
- [ ] CHK-041 [P1] Code comments adequate (scaffold generator has a header comment explaining inputs / outputs / schema source)
- [ ] CHK-042 [P0] Manual-testing playbook entry written under `.opencode/skill/cli-*/manual_testing_playbook/` for the 3-branch rehearsal (REQ-008)
- [ ] CHK-043 [P1] `implementation-summary.md` cites file:line evidence for every REQ acceptance criterion
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp / scratch artifacts in `scratch/` only
- [ ] CHK-051 [P1] `scratch/` cleaned before completion
- [ ] CHK-052 [P1] Throwaway rehearsal folder `specs/099-debug-rehearsal/` deleted after Phase 4 verification
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | [ ]/13 |
| P1 Items | 12 | [ ]/12 |
| P2 Items | 0 | [ ]/0 |

**Verification Date**: TBD
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - 25 verification items across 6 categories.
P0 must complete with file:line evidence.
P1 may be deferred with explicit user approval.
-->
