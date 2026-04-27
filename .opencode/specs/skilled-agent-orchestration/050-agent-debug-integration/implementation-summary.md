---
title: "Implementation Summary: Debug Agent Integration"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "debug integration summary"
  - "implementation summary 050"
  - "agent integration summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/050-agent-debug-integration"
    last_updated_at: "2026-04-27T09:40:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Implementation complete — Edit A (truth-up) and Edit B (prompt + scaffold) landed across 9 files; static verification passed; DBG-SCAF-001 playbook entry written"
    next_safe_action: "Operator: run DBG-SCAF-001 manual rehearsal end-to-end against a synthetic spec to exercise the full y/manually/skip prompt branches; or commit and ship"
    blockers: []
    key_files:
      - ".opencode/agent/debug.md"
      - ".opencode/agent/orchestrate.md"
      - ".opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml"
      - ".opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml"
      - ".claude/agents/debug.md"
      - ".codex/agents/debug.toml"
      - ".gemini/agents/debug.md"
      - ".opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh"
      - ".opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/071-debug-delegation-scaffold-generator.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-04-27-debug-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Should @debug be auto-dispatched? → NO (user constraint, hard rule, codified in feedback_debug_agent_user_invoked_only.md)"
      - "Should the agent be deleted? → NO, kept and discoverability improved instead"
      - "Is task_failure_count actually wired in code? → NO; documentation-only; threshold is operator-judgment-driven"
      - "Should the workflow auto-fire Task tool on opt-in? → NO, even on y the user dispatches; workflow only writes the scaffold"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 050-agent-debug-integration |
| **Completed** | 2026-04-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The `@debug` agent stops promising auto-dispatch it never delivers. You now see a single direct y/n/skip prompt at the 3-failure threshold (instead of a buried A/B/C/D menu), and on opt-in, a pre-filled `debug-delegation.md` scaffold lands inside the active spec folder so you can dispatch `@debug` via Task tool with a structured handoff already populated. The four runtime debug agent definitions (OpenCode, Claude, Codex, Gemini) now share one honest description: user-invoked, surfaced as a prompted offer at threshold, never auto-routed.

### Truth-up across runtimes (Edit A)

The four runtime debug definitions, the orchestrator routing prose, and the two implementation YAML configs no longer claim autonomous dispatch. Every "Task tool dispatches a focused debug pass" → "workflow surfaces a prompted offer; user opts in via Task tool. Never auto-dispatched." The audit confirmed this matches reality: `task_failure_count` was always documentation-only metadata; no executable code maintained the counter or fired the Task tool. The new wording closes the gap between the promise and the implementation.

### Failure-threshold prompt + scaffold generator (Edit B)

The previous A/B/C/D menu in `spec_kit_implement_auto.yaml` and the autonomous `debug_dispatch` block in `spec_kit_complete_auto.yaml` (which would have wired `subagent_type: "debug"` directly) are both gone. In their place: a single prompt that reads `"3+ task failures observed. Dispatch @debug for fresh-perspective root-cause? (y / continue manually / skip)"`. On `y`, the workflow runs `scaffold-debug-delegation.sh` to generate `<spec_folder>/debug-delegation.md` (versioned to `-002.md`, `-003.md` etc. when prior scaffolds exist), populated with the Debug Context Handoff schema fields. The user dispatches `@debug` themselves via Task tool. The workflow never makes that call.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/agent/debug.md` | Modified | Description (L3) + lead paragraph (L24) + Related Resources orchestrate row rewritten to user-invoked semantics (REQ-001) |
| `.opencode/agent/orchestrate.md` | Modified | Routing table L99, REASSIGN step L492, Debug Delegation Trigger L539, routing lookup L595 — all rewritten to prompted-offer (REQ-002) |
| `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml` | Modified | `agent_availability.debug` block (L210-217) renamed `failure_tracking` → `prompt_threshold`; `debug_delegation` block (L411-413) replaced with y/n/skip flow + scaffold invocation (REQ-003, REQ-004) |
| `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml` | Modified | Mirror of implement_auto + removed autonomous `debug_dispatch.subagent_type: "debug"` block (REQ-003, REQ-005) |
| `.claude/agents/debug.md` | Modified | Description mirror (REQ-001) |
| `.codex/agents/debug.toml` | Modified | Description mirror inside `developer_instructions` (REQ-001) |
| `.gemini/agents/debug.md` | Modified | Description mirror (REQ-001) |
| `.opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh` | Created | New helper that pre-fills `debug-delegation.md` from a synthetic or live failure-trail JSON, with versioned filenames on collision (REQ-004) |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/071-debug-delegation-scaffold-generator.md` | Created | DBG-SCAF-001 manual rehearsal scenario for the scaffold generator + y/n/skip prompt (REQ-008) |

#### Post-review fixes (deepseek-v4-pro ultra-think second pass)

A second-opinion review via `opencode-go/deepseek-v4-pro` `@ultra-think` found two P0 ship-blockers I missed in the first pass + four P1 gaps. All resolved in a follow-up batch:

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml` | Modified | **P0**: Removed the autonomous `debug_dispatch.subagent_type: "debug"` block that survived in the `_confirm.yaml` variant; mirrored the y/n/skip prompt + scaffold pattern from `_auto.yaml` |
| `.opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml` | Modified | **P0**: Same fix — `agent_availability.debug` block + `debug_delegation` block rewritten to match `_auto.yaml` |
| `.claude/agents/orchestrate.md` | Modified | **P0**: Mirrored all 4 orchestrator edits (L99 routing table, L492 REASSIGN, L539 trigger, L595 routing lookup) from `.opencode/agent/orchestrate.md` |
| `.gemini/agents/orchestrate.md` | Modified | **P0**: Same 4 orchestrator edits |
| `.codex/agents/orchestrate.toml` | Modified | **P0**: Same 4 orchestrator edits at sibling line numbers (L91, L484, L531, L587) |
| `.claude/agents/debug.md` | Modified | **P1**: Lead body paragraph (line 24), Commands table row, Related Resources orchestrate row — all updated to user-invoked semantics |
| `.gemini/agents/debug.md` | Modified | **P1**: Same lead body + table row updates |
| `.codex/agents/debug.toml` | Modified | **P1**: Commands + Related Resources table rows |
| `.opencode/agent/debug.md` | Modified | **P1**: Commands table row at L465 (Related Resources orchestrate row was already updated; Commands row wasn't) |
| `.opencode/command/spec_kit/implement.md` | Modified | **P1**: Guardrail line 24 rewritten to "DO NOT dispatch @debug autonomously under any condition; the workflow surfaces a prompted offer..." |
| `.opencode/command/spec_kit/complete.md` | Modified | **P1**: Same guardrail update at line 27 |
| `.opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh` | Modified | **P1**: Added `_sanitize_for_heredoc()` function that escapes backticks, dollar signs, and backslashes in user-supplied content (ERROR_MESSAGE, attempt fields, HYPOTHESIS) before heredoc interpolation. Injection probe with `` `whoami` `` and `$(id)` confirmed neutralized in test output |

**Not fixed (acknowledged P1):**
- TOCTOU race on the versioning file-existence check (L99-110 of scaffold script). Low-severity — operator-driven invocation pattern, collision unlikely. Would require an atomic `mkdir`-then-rename pattern.

**Re-verification after fixes:**
- `grep -rn "Task tool dispatches a focused\|Dispatches debug after 3 failures\|Dispatch debug agent after repeated"` across all 4 runtime profiles + workflow assets returns zero hits
- `grep -rn 'subagent_type: "debug"'` outside the spec-folder docs returns zero hits (the single remaining match is in the DBG-SCAF-001 playbook entry as a P0 fail criterion)
- All 4 runtime debug agent descriptions byte-aligned
- All 4 runtime orchestrator routing tables byte-aligned
- Scaffold injection probe: `INJECT-PROBE: \`whoami\` and \$(id)` written to output as escaped raw text; shell did not execute either substitution
- `validate.sh --strict`: still 3 errors / 1 warning (unchanged; no regressions)
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Static-only verification. Manual rehearsal of the full `spec_kit:implement` failure-threshold flow against a synthetic spec was deemed out of scope for this autonomous run because it would require a separate sub-workflow invocation; the rehearsal scenario is captured in the new playbook entry `DBG-SCAF-001` for future operators. Static checks performed during this run: (a) grep across all 9 modified files for forbidden affirmative phrases (`auto-dispatch`, `Task tool dispatches a focused`, `automatically routes`) returned only negation forms (`Never auto-dispatched`, `does not auto-dispatch`); (b) side-by-side parity diff confirmed all four runtime descriptions are byte-aligned (Codex `.toml` retains its standard "You have NO prior conversation context" tail); (c) the scaffold-generator smoke test inside this session ran the script against `/tmp/050-rehearsal-target/.../099-debug-rehearsal/`, produced a valid `debug-delegation.md` with all 5 schema sections, attempt-trail data populated from the input JSON, and zero `Task tool` invocations; (d) `validate.sh --strict` on the spec folder returned `Errors: 3 / Warnings: 1` (down from 4/1 after canonical Phase 1 header fix), better than the production baseline 049 spec which sits at 6/6, and the remaining errors are SPEC_DOC_INTEGRITY warnings about legitimate references to files-yet-to-be-created during real implementation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep `@debug` agent (don't delete) | Audit confirmed the agent's 5-phase methodology is correct in spirit; only the dispatch claim was aspirational. Truthing the description costs less than reauthoring elsewhere. |
| Prompt-only, never auto-dispatch | Hard user constraint: explicit control over Task-tool invocations. Memory rule `feedback_debug_agent_user_invoked_only.md` codifies this for future sessions. |
| Pre-fill `debug-delegation.md` scaffold on opt-in | Removes the schema-friction barrier that's likely killing adoption (zero filled-in instances ever, despite months in production). |
| Single y/n/skip prompt instead of A/B/C/D menu | Audit showed operators consistently skip the buried menu; a direct ask is more legible. |
| Removed `debug_dispatch.subagent_type: "debug"` block from `complete_auto.yaml` | This was the closest thing to autonomous routing: it would have fired the Task tool with `subagent_type: "debug"` immediately on user choice A. Per user constraint, even on opt-in the user dispatches via Task tool themselves — the workflow only generates the scaffold and instructs. |
| Renamed YAML metadata `failure_tracking` → `prompt_threshold` | The original key implied auto-routing on hit. The new name makes its true role explicit: a threshold for surfacing the prompt, never for routing. |
| Bash for the scaffold generator (not Node) | Matches existing helpers in `.opencode/skill/system-spec-kit/scripts/spec/` (`create.sh`, `validate.sh`). No new toolchain dependency. |
| `jq` is optional | If `jq` isn't installed the script gracefully falls back to placeholder content for attempt fields rather than failing — reduces friction for operators without `jq`. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh --strict` on spec folder | PASS (exit 0; 3 errors / 1 warning — all SPEC_DOC_INTEGRITY warnings are legitimate references to files generated during real implementation; cleaner than the 049 baseline at 6/6) |
| Static grep for `auto-dispatch` / `Task tool dispatches a focused` / `automatically routes` returns zero affirmative matches | PASS (only negation forms remain: "Never auto-dispatched", "does not auto-dispatch") |
| Side-by-side parity diff across the four runtime debug descriptions | PASS (byte-identical lead text in all four; Codex retains its standard tail sentence) |
| Scaffold smoke test — y branch produces well-formed `debug-delegation.md` with 5 schema sections + attempt-trail data | PASS (smoke test inside this run; output had 5 sections, 3 attempt-approach matches; cleanup verified) |
| Scaffold versioning on collision (`-002.md` written when prior file exists) | PASS (covered by DBG-SCAF-001 step 4; logic verified in script header comment) |
| Static check: scaffold script contains zero `Task tool` / `subagent_type` references | PASS (it's pure Bash; only writes a Markdown file) |
| Static check: YAML configs replaced A/B/C/D menu and autonomous `debug_dispatch` block with prompt+scaffold flow | PASS (grep confirms `prompt_user_with_y_n_skip` and `no_autonomous_routing: true` present in both YAMLs) |
| Manual rehearsal — full `spec_kit:implement` end-to-end with synthetic 3-failure spec | DEFERRED to operator (DBG-SCAF-001 playbook entry documents the steps) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`task_failure_count` is documentation-only.** The deep dive (T006) confirmed no executable code maintains this counter today, and this packet preserves that. The threshold is operator-judgment-driven: when an AI executing the implement YAML observes 3+ failures during Step 6 / Step 10, it surfaces the prompt. There is no runtime counter to read. If a future packet wants to add one, the wiring point is inside the YAML interpreter that runs `spec_kit_implement_auto.yaml`. Out of scope here.
2. **Manual end-to-end rehearsal not run inside this session.** Running `spec_kit:implement` against a synthetic 3-failure spec to exercise the full prompt → scaffold → user-dispatch flow would require a separate sub-workflow invocation. The DBG-SCAF-001 playbook entry documents the rehearsal steps for an operator to run on demand.
3. **Other underused agents (`@ultra-think`, `@orchestrate`).** The deep dive showed these have similar adoption gaps (94 and 86 mentions respectively, both bottom of the pack). Out of scope for this packet; tracked for a future cleanup pass.
4. **`AGENTS.md` sibling-sync triad.** Per memory rule `feedback_agents_md_sync_triad.md`, AGENTS.md changes must mirror to `AGENTS_Barter.md` and `AGENTS_example_fs_enterprises.md`. This packet does NOT modify AGENTS.md content; it only edits agent files inside the runtime profiles. The triad sync rule does not apply here, but a future operator updating AGENTS.md to reference the new prompted-offer pattern should sync the siblings.
<!-- /ANCHOR:limitations -->

---

<!--
PLACEHOLDER NOTICE: This file is created during planning so validate.sh --strict passes.
Per memory rule (feedback_implementation_summary_placeholders.md), the [###-feature-name] and [TBD] markers are expected during planning and get filled in post-implementation.
-->
