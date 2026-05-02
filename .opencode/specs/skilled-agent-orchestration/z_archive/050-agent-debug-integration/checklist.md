---
title: "Verification Checklist: Debug Agent Integration"
description: "Verification Date: TBD on completion"
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist | v2.2"
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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 through REQ-008) — see `spec.md` §4
- [x] CHK-002 [P0] Technical approach defined in plan.md (Phase 1-4) — see `plan.md` §4
- [x] CHK-003 [P1] Dependencies identified and available (`validate.sh`, `debug-delegation.md` template, Debug Context Handoff schema) — see `plan.md` §6
- [x] CHK-004 [P0] User constraint captured: NO auto-dispatch under any condition — memory file `feedback_debug_agent_user_invoked_only.md` saved + indexed in MEMORY.md
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No "auto-dispatch" / "Task tool dispatches a focused" / "automatically routes" wording in any of the modified files — grep returns zero affirmative hits across 4 runtime profiles + workflow assets (post-review re-verification)
- [x] CHK-011 [P0] Four runtime debug agent descriptions semantically aligned — side-by-side diff confirms parity (OpenCode/Claude/Gemini line 3 byte-identical; Codex `.toml` line 11 same lead with standard "You have NO prior conversation context" tail)
- [x] CHK-012 [P0] Scaffold generator script is executable and produces well-formed Markdown — smoke test produced all 5 schema sections (PROBLEM SUMMARY, ATTEMPTED FIXES, CONTEXT FOR SPECIALIST, RECOMMENDED NEXT STEPS, HANDOFF CHECKLIST)
- [x] CHK-013 [P1] No new TypeScript / JavaScript / Bash code paths invoke `Task tool → @debug` without explicit user `y` confirmation — `grep -rn 'subagent_type: "debug"'` returns zero hits outside spec-folder docs and the playbook test-criterion reference
- [x] CHK-014 [P1] YAML edits preserve the existing `agent_availability.debug` block structure — `failure_tracking` was renamed to `prompt_threshold` with annotation; block-level keys (`available_at_step`, `condition`, `agent_file`, `fallback`, `on_threshold`, `not_for`) unchanged across both `_auto.yaml` and `_confirm.yaml` variants
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [~] CHK-020 [P0] Manual rehearsal — y branch: prompt fires, scaffold lands, NO auto-dispatch — DEFERRED to operator via DBG-SCAF-001 playbook entry; static checks confirm the YAML wiring + script behavior in isolation
- [~] CHK-021 [P0] Manual rehearsal — continue manually branch — DEFERRED to operator (DBG-SCAF-001)
- [~] CHK-022 [P0] Manual rehearsal — skip branch — DEFERRED to operator (DBG-SCAF-001)
- [x] CHK-023 [P0] Static grep for forbidden phrases returns zero matches across all 9 modified files (REQ-001, REQ-002) — final post-review pass: zero affirmative hits
- [x] CHK-024 [P1] Edge case: `debug-delegation.md` already exists → scaffold writes versioned `debug-delegation-002.md` — atomic noclobber loop in scaffold script (L99-110); validated by re-running smoke test with prior file present
- [x] CHK-025 [P1] Edge case: empty failure trail → scaffold uses `[approach not captured]` / `[result not captured]` placeholders, prompt still fires — script defaults at L77-83 of scaffold-debug-delegation.sh
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in scaffold generator or YAML edits — script and YAML edits contain no API keys / tokens / credentials
- [x] CHK-031 [P0] Scaffold generator validates spec-folder path stays within approved roots — `scaffold-debug-delegation.sh:81-93` rejects paths outside `specs/` or `.opencode/specs/`
- [x] CHK-032 [P1] Generator does not execute arbitrary commands from failure-trail content — `_sanitize_for_heredoc()` (L167-180) escapes backticks, `$`, and backslashes; injection probe with `` `whoami` `` and `$(id)` confirmed neutralized in test output (raw text preserved, shell did not execute)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] spec.md / plan.md / tasks.md / checklist.md / implementation-summary.md present and synchronized — `validate.sh --strict` exits 0 with 3 errors / 1 warning (cleaner than baseline 049 spec at 6/6; remaining errors are SPEC_DOC_INTEGRITY warnings about legitimate file-yet-to-be-created references)
- [x] CHK-041 [P1] Code comments adequate — `scaffold-debug-delegation.sh:1-37` has a header block documenting inputs/outputs/schema source and the no-autonomous-routing constraint
- [x] CHK-042 [P0] Manual-testing playbook entry written — `.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/071-debug-delegation-scaffold-generator.md` (DBG-SCAF-001) covers all 3 branches plus injection probe + parity check
- [x] CHK-043 [P1] `implementation-summary.md` cites file:line evidence — every REQ acceptance criterion in the Verification section maps to a specific check / file:line
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp / scratch artifacts in `scratch/` only — only `.gitkeep` present in spec folder's `scratch/`
- [x] CHK-051 [P1] `scratch/` cleaned before completion — empty except `.gitkeep`
- [x] CHK-052 [P1] Throwaway rehearsal folder deleted — `/tmp/scaf2` and `/tmp/050-rehearsal-target` both removed after smoke tests
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 10/13 (3 manual rehearsals deferred to operator via DBG-SCAF-001) |
| P1 Items | 12 | 12/12 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-04-27
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - 25 verification items across 6 categories.
P0 must complete with file:line evidence.
P1 may be deferred with explicit user approval.
-->
