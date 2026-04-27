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
    completion_pct: 35
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

- [ ] T001 Diff-check the four runtime debug definitions for parity baseline (`diff` across .opencode/agent/debug.md, .claude/agents/debug.md, .codex/agents/debug.toml, .gemini/agents/debug.md)
- [ ] T002 [P] Confirm exact line numbers in `.opencode/agent/debug.md` for: description (~L3), lead paragraph (~L24), Related Resources table (~L461)
- [ ] T003 [P] Confirm exact line numbers in `.opencode/agent/orchestrate.md` for: priority table (~L99), REASSIGN step (~L492), Debug Delegation Trigger (~L537-539), routing lookup row (~L595)
- [ ] T004 [P] Confirm exact line numbers in `spec_kit_implement_auto.yaml` for: agent_availability.debug (~L210-217), debug_delegation block (~L411-413)
- [ ] T005 [P] Confirm exact line numbers in `spec_kit_complete_auto.yaml` for: agent_availability.debug (~L321-328), debug_escalation block (~L898-910)
- [ ] T006 Verify `task_failure_count` counter wiring — does the YAML interpreter actually maintain this counter today, or is the threshold currently inert? Document finding in scratch/.
- [ ] T007 Run baseline `validate.sh --strict` on `.opencode/specs/skilled-agent-orchestration/050-agent-debug-integration/` to confirm spec-doc compliance before edits begin
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Edit A — Truth-Up Aspirational Claims

- [ ] T010 Rewrite `.opencode/agent/debug.md` line 3 description (user-invoked / prompted-offer language)
- [ ] T011 Rewrite `.opencode/agent/debug.md` line 24 lead paragraph to match new description
- [ ] T012 Update `.opencode/agent/debug.md` line ~461 Related Resources table row for `orchestrate` ("Prompts user to dispatch debug after 3 failures")
- [ ] T013 Rewrite `.opencode/agent/orchestrate.md` line 99 priority routing table cell
- [ ] T014 Rewrite `.opencode/agent/orchestrate.md` line 492 REASSIGN step second clause
- [ ] T015 Rewrite `.opencode/agent/orchestrate.md` lines 537-539 Debug Delegation Trigger paragraph
- [ ] T016 Rewrite `.opencode/agent/orchestrate.md` line 595 routing lookup row
- [ ] T017 Rewrite `spec_kit_implement_auto.yaml` lines 212-216: `condition`, `failure_tracking` annotation, `on_threshold` text
- [ ] T018 Rewrite `spec_kit_implement_auto.yaml` lines 411-413: `debug_delegation.action` (sets up Edit B replacement)
- [ ] T019 Rewrite `spec_kit_complete_auto.yaml` lines 321-328: same as T017
- [ ] T020 Rewrite `spec_kit_complete_auto.yaml` lines 898-910: `debug_escalation` block (sets up Edit B replacement)
- [ ] T021 [P] Mirror description rewrite into `.claude/agents/debug.md` line 3
- [ ] T022 [P] Mirror description rewrite into `.codex/agents/debug.toml` line 11 (inside `developer_instructions = '''...'''`)
- [ ] T023 [P] Mirror description rewrite into `.gemini/agents/debug.md` line 3

### Edit B — Prompt Visibility & Scaffold Generation

- [ ] T030 Write `.opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh` (new helper script)
- [ ] T031 Make T030 script executable + verify schema parity output against `.opencode/agent/debug.md:60-89`
- [ ] T032 Replace prompt body in `spec_kit_implement_auto.yaml` lines 411-413 with y/n/skip block + scaffold-generator invocation on y
- [ ] T033 Replace prompt body in `spec_kit_complete_auto.yaml` lines 898-910 with same y/n/skip block + scaffold-generator invocation
- [ ] T034 Verify `.opencode/skill/system-spec-kit/templates/debug-delegation.md` template field schema matches `.opencode/agent/debug.md:60-89` Debug Context Handoff (modify only on drift)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T040 Static grep: `grep -rn "auto-dispatch\|Task tool dispatches a focused\|automatically routes" .opencode/agent .claude/agents .codex/agents .gemini/agents .opencode/command/spec_kit` → expect zero matches
- [ ] T041 Side-by-side diff: confirm semantic parity across the four runtime debug descriptions
- [ ] T042 Create throwaway rehearsal spec folder `specs/099-debug-rehearsal/` with 3 deliberately-failing tasks
- [ ] T043 Manual rehearsal — y branch: run `spec_kit:implement` against rehearsal folder, opt in with `y`, verify scaffold lands at correct path, verify NO `@debug` was auto-invoked
- [ ] T044 Manual rehearsal — continue manually branch: same setup, type "continue manually", verify clean continuation with no scaffold and counter not reset
- [ ] T045 Manual rehearsal — skip branch: same setup, type "skip", verify clean skip with counter reset per existing reset_on rule
- [ ] T046 Run `validate.sh --strict` on `.opencode/specs/skilled-agent-orchestration/050-agent-debug-integration/` → expect exit code 0 or 1 (warnings ok), never 2
- [ ] T047 Static schema-parity check: scaffold output sections match Debug Context Handoff schema lines 60-89 of `.opencode/agent/debug.md`
- [ ] T048 Write a manual-testing playbook entry under `.opencode/skill/cli-*/manual_testing_playbook/` documenting the 3-branch rehearsal
- [ ] T049 Cleanup: delete `specs/099-debug-rehearsal/` after rehearsal completes
- [ ] T050 Fill `implementation-summary.md` with file-level evidence (file:line for each REQ acceptance criterion)
- [ ] T051 Run `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` to refresh `description.json` + `graph-metadata.json` and index continuity
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 tasks (T010-T023, T030-T034, T040-T047) marked `[x]`
- [ ] All P1 tasks (T001-T007, T048-T051) marked `[x]` or with documented user-approved deferral
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed for all three prompt branches (y, continue, skip)
- [ ] `checklist.md` P0 items all marked with evidence
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
