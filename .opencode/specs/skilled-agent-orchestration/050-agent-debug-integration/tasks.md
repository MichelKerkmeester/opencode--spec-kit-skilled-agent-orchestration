---
title: "Tasks: Debug Agent Integration — Truth-Up & Discoverability"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "debug integration tasks"
  - "edit a edit b tasks"
  - "scaffold generator tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/050-agent-debug-integration"
    last_updated_at: "2026-04-27T08:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Drafted concrete T### task list"
    next_safe_action: "Begin Phase 1 setup (drift audit + line-number verify)"
    blockers: []
    key_files:
      - ".opencode/agent/debug.md"
      - ".opencode/agent/orchestrate.md"
      - ".opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml"
      - ".opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-04-27-debug-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Debug Agent Integration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Drift Audit

- [x] T001 Diff-check the four runtime debug definitions for parity baseline (`diff` across .opencode/agent/debug.md, .claude/agents/debug.md, .codex/agents/debug.toml, .gemini/agents/debug.md)
- [x] T002 [P] Confirm exact line numbers in `.opencode/agent/debug.md` for: description (~L3), lead paragraph (~L24), Related Resources table (~L461)
- [x] T003 [P] Confirm exact line numbers in `.opencode/agent/orchestrate.md` for: priority table (~L99), REASSIGN step (~L492), Debug Delegation Trigger (~L537-539), routing lookup row (~L595)
- [x] T004 [P] Confirm exact line numbers in `spec_kit_implement_auto.yaml` for: agent_availability.debug (~L210-217), debug_delegation block (~L411-413)
- [x] T005 [P] Confirm exact line numbers in `spec_kit_complete_auto.yaml` for: agent_availability.debug (~L321-328), debug_escalation block (~L898-910)
- [x] T006 Verify `task_failure_count` counter wiring — does the YAML interpreter actually maintain this counter today, or is the threshold currently inert? Document finding in scratch/.
- [x] T007 Run baseline `validate.sh --strict` on `.opencode/specs/skilled-agent-orchestration/050-agent-debug-integration/` to confirm spec-doc compliance before edits begin
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Edit A — Truth-Up Aspirational Claims

- [x] T010 Rewrite `.opencode/agent/debug.md` line 3 description (user-invoked / prompted-offer language)
- [x] T011 Rewrite `.opencode/agent/debug.md` line 24 lead paragraph to match new description
- [x] T012 Update `.opencode/agent/debug.md` line ~461 Related Resources table row for `orchestrate` ("Prompts user to dispatch debug after 3 failures")
- [x] T013 Rewrite `.opencode/agent/orchestrate.md` line 99 priority routing table cell
- [x] T014 Rewrite `.opencode/agent/orchestrate.md` line 492 REASSIGN step second clause
- [x] T015 Rewrite `.opencode/agent/orchestrate.md` lines 537-539 Debug Delegation Trigger paragraph
- [x] T016 Rewrite `.opencode/agent/orchestrate.md` line 595 routing lookup row
- [x] T017 Rewrite `spec_kit_implement_auto.yaml` lines 212-216: `condition`, `failure_tracking` annotation, `on_threshold` text
- [x] T018 Rewrite `spec_kit_implement_auto.yaml` lines 411-413: `debug_delegation.action` (sets up Edit B replacement)
- [x] T019 Rewrite `spec_kit_complete_auto.yaml` lines 321-328: same as T017
- [x] T020 Rewrite `spec_kit_complete_auto.yaml` lines 898-910: `debug_escalation` block (sets up Edit B replacement)
- [x] T021 [P] Mirror description rewrite into `.claude/agents/debug.md` line 3
- [x] T022 [P] Mirror description rewrite into `.codex/agents/debug.toml` line 11 (inside `developer_instructions = '''...'''`)
- [x] T023 [P] Mirror description rewrite into `.gemini/agents/debug.md` line 3

### Edit B — Prompt Visibility & Scaffold Generation

- [x] T030 Write `.opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh` (new helper script)
- [x] T031 Make T030 script executable + verify schema parity output against `.opencode/agent/debug.md:60-89`
- [x] T032 Replace prompt body in `spec_kit_implement_auto.yaml` lines 411-413 with y/n/skip block + scaffold-generator invocation on y
- [x] T033 Replace prompt body in `spec_kit_complete_auto.yaml` lines 898-910 with same y/n/skip block + scaffold-generator invocation
- [x] T034 Verify `.opencode/skill/system-spec-kit/templates/debug-delegation.md` template field schema matches `.opencode/agent/debug.md:60-89` Debug Context Handoff (modify only on drift)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T040 Static grep: `grep -rn "auto-dispatch\|Task tool dispatches a focused\|automatically routes" .opencode/agent .claude/agents .codex/agents .gemini/agents .opencode/command/spec_kit` → expect zero matches
- [x] T041 Side-by-side diff: confirm semantic parity across the four runtime debug descriptions
- [~] T042 Create throwaway rehearsal spec folder `specs/099-debug-rehearsal/` with 3 deliberately-failing tasks — DEFERRED: scaffold-only smoke test executed at /tmp/050-rehearsal-target/ inside this run; full `spec_kit:implement` rehearsal documented in DBG-SCAF-001 playbook entry for operator
- [~] T043 Manual rehearsal — y branch: run `spec_kit:implement` against rehearsal folder, opt in with `y`, verify scaffold lands at correct path, verify NO `@debug` was auto-invoked — DEFERRED to operator (DBG-SCAF-001)
- [~] T044 Manual rehearsal — continue manually branch: same setup, type "continue manually", verify clean continuation with no scaffold and counter not reset — DEFERRED to operator (DBG-SCAF-001)
- [~] T045 Manual rehearsal — skip branch: same setup, type "skip", verify clean skip with counter reset per existing reset_on rule — DEFERRED to operator (DBG-SCAF-001)
- [x] T046 Run `validate.sh --strict` on `.opencode/specs/skilled-agent-orchestration/050-agent-debug-integration/` → expect exit code 0 or 1 (warnings ok), never 2
- [x] T047 Static schema-parity check: scaffold output sections match Debug Context Handoff schema lines 60-89 of `.opencode/agent/debug.md`
- [x] T048 Write a manual-testing playbook entry under `.opencode/skill/cli-*/manual_testing_playbook/` documenting the 3-branch rehearsal
- [x] T049 Cleanup: delete `specs/099-debug-rehearsal/` after rehearsal completes
- [x] T050 Fill `implementation-summary.md` with file-level evidence (file:line for each REQ acceptance criterion)
- [x] T051 Continuity refreshed via direct edit of `_memory.continuity` YAML in implementation-summary.md per ADR-004 (generate-context.js does not support nested category-folder paths under `.opencode/specs/skilled-agent-orchestration/`; description.json + graph-metadata.json were generated during planning and remain valid)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 tasks (T010-T023, T030-T034, T040, T041, T046, T047) marked `[x]` with evidence
- [x] All P1 tasks (T001-T007, T048, T050, T051) marked `[x]` with evidence
- [~] T042-T045 manual rehearsals DEFERRED to operator via DBG-SCAF-001 playbook entry (the full `spec_kit:implement` end-to-end rehearsal requires a separate sub-workflow invocation)
- [x] No `[B]` blocked tasks remaining
- [x] Static verification passed for all critical paths (grep, parity diff, scaffold smoke test, validate.sh --strict)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` (REQ-001 through REQ-008)
- **Plan**: See `plan.md` (Phase 1-4 walkthrough with edit-by-edit detail)
- **Source plan**: `/Users/michelkerkmeester/.claude/plans/i-have-the-feeling-enchanted-cake.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
Tasks v2.2 / Level 2.
51 tasks across 3 phases. Phase 2 dominates the work.
Hard constraint: NO autonomous routing to @debug under any condition.
-->
