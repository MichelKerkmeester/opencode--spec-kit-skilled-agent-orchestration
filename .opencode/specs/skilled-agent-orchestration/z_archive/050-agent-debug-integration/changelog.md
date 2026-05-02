---
title: "Changelog: Debug Agent Integration — truth-up + prompted-offer scaffold [050]"
description: "Chronological changelog for Packet 050. Moves the @debug agent from shelfware (aspirational auto-dispatch claims unsupported by code) to honest user-invoked / prompted-offer-only semantics across all four CLI runtimes (OpenCode, Claude, Codex, Gemini). Adds a Bash scaffold generator that pre-fills debug-delegation.md from a failure-trail JSON, replaces the buried failure-threshold A/B/C/D menu with a single y/n/skip prompt, removes the latent autonomous subagent_type:debug dispatch block from the complete workflow, and ships a manual-testing playbook entry. Hard user constraint: @debug must NEVER be auto-dispatched."
importance_tier: "important"
contextType: "implementation"
---
# Changelog

## 2026-04-27

### Added

- **`.opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh`** — new executable Bash helper (~250 LOC) that generates a pre-filled `debug-delegation.md` inside any spec folder from an operator-supplied failure-trail JSON. Uses the Debug Context Handoff schema sourced from `.opencode/agent/debug.md` (lines 60-89). Atomic noclobber redirect (`set -C; : > $path`) for collision-safe versioning (`-002.md`, `-003.md` on subsequent runs). `_sanitize_for_heredoc()` escapes backticks, dollar signs, and backslashes in user-supplied content before heredoc interpolation — verified neutralized via injection probe (`` `whoami` `` and `$(id)` written as raw escaped text, shell did not execute either).
- **`.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/071-debug-delegation-scaffold-generator.md`** — DBG-SCAF-001 manual-testing scenario covering scaffold generation, versioned-filename collision handling, schema parity with the Debug Context Handoff format, and the y/n/skip prompt branches in `spec_kit_implement_*.yaml` and `spec_kit_complete_*.yaml`.
- **Memory feedback rule** — `feedback_debug_agent_user_invoked_only.md` saved at `~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/memory/` and indexed in `MEMORY.md`. Codifies the hard user constraint: `@debug` must never be auto-dispatched; only user-invoked or prompted-offer.

### Changed

- **`@debug` agent description across four CLI runtimes** — rewrote line 3 (and lead body line 24 where present) of `.opencode/agent/debug.md`, `.claude/agents/debug.md`, `.gemini/agents/debug.md`, and `.codex/agents/debug.toml` (line 11 inside `developer_instructions = '''...'''`). Replaced "Dispatched via Task tool when failure_count >= 3" with "User-invoked fresh-perspective debugging specialist. Surfaced as a prompted offer when an implementation workflow detects 3+ task failures (operator-judgment threshold), or invoked explicitly by the user via the Task tool. Never auto-dispatched." All four runtime descriptions byte-aligned.
- **Orchestrator routing prose across four CLI runtimes** — rewrote four spots in `.opencode/agent/orchestrate.md`, `.claude/agents/orchestrate.md`, `.gemini/agents/orchestrate.md`, and `.codex/agents/orchestrate.toml` (sibling line numbers L91, L484, L531, L587 for the TOML wrapper): the priority routing table debug row, the REASSIGN step under Retry → Reassign → Escalate, the Debug Delegation Trigger paragraph, and the routing lookup row. Every "Task tool dispatches a focused debug pass" became "workflow surfaces a prompted offer; user opts in via Task tool. Never auto-dispatched."
- **`spec_kit_implement_auto.yaml` and `spec_kit_implement_confirm.yaml`** — renamed `agent_availability.debug.failure_tracking` to `prompt_threshold` to make the role explicit (it gates a prompted offer, not autonomous routing). Replaced the `debug_delegation.action` field's buried "STOP → escalate to user with diagnostic summary; user may dispatch @debug via Task tool" with a multi-line action block that surfaces a single `y / continue manually / skip` prompt and, on `y`, runs `scaffold-debug-delegation.sh` to write a pre-filled scaffold. The workflow STOPS after writing the scaffold and waits — it never invokes Task tool → @debug itself.
- **`spec_kit_complete_auto.yaml` and `spec_kit_complete_confirm.yaml`** — same `failure_tracking` → `prompt_threshold` rename in the `agent_availability.debug` block (~L321-328). Rewrote `debug_escalation.on_threshold_reached` from the four-option A/B/C/D menu to the same y/n/skip prompt + scaffold-generator pattern.
- **`.opencode/command/spec_kit/implement.md` and `.opencode/command/spec_kit/complete.md`** — guardrail bullet rewritten from "DO NOT dispatch `@debug` unless `failure_count >= 3`" to "DO NOT dispatch `@debug` autonomously under any condition; the workflow surfaces a prompted offer when `failure_count >= 3` and the user dispatches via Task tool themselves with the pre-filled debug-delegation.md scaffold as the structured handoff." Mirror updates landed in the Gemini-side command-prompt TOMLs (`.gemini/commands/spec_kit/implement.toml`, `.gemini/commands/spec_kit/complete.toml`) which embed the markdown command text inside their `prompt = "..."` strings.
- **`.opencode/agent/debug.md` Related Resources tables** (~L461, L465) — updated the `Task tool -> @debug` Commands row and the `orchestrate` Agents row to reflect user-dispatched / prompted-offer semantics. Mirrored across `.claude/agents/debug.md`, `.gemini/agents/debug.md`, and `.codex/agents/debug.toml`.

### Removed

- **`debug_dispatch.subagent_type: "debug"` block** from `spec_kit_complete_auto.yaml` (L909-913) and `spec_kit_complete_confirm.yaml` (L929-933). This was the only place in the entire codebase where the workflow could autonomously fire the Task tool with `subagent_type: "debug"`. Per the hard user constraint, even on user choice A from the prior A/B/C/D menu, the user themselves must dispatch — the workflow only writes the scaffold and waits.

### Fixed

- **TOCTOU race in scaffold versioning loop** — replaced the original test-then-write pattern (`if [[ -e ... ]]; then loop`) with an atomic noclobber redirect (`set -C; : > "$OUTPUT_PATH"`) in `scaffold-debug-delegation.sh`. Two concurrent invocations targeting the same spec folder now produce `debug-delegation.md` and `debug-delegation-002.md` deterministically, never overwriting each other. Verified by three consecutive runs producing the expected versioned filenames.
- **Shell-injection risk in scaffold heredoc** — added `_sanitize_for_heredoc()` that escapes backslashes, backticks, and dollar signs in operator-supplied variables (`ERROR_MESSAGE`, attempt fields, `HYPOTHESIS_TEXT`, etc.) before they hit the unquoted `cat <<EOF` heredoc. The script-controlled values (`TASK_ID`, `NOW_ISO`, etc.) still expand normally; only operator content is sanitized. Injection probe with `` `whoami` `` and `$(id)` confirmed neutralized — both written to the scaffold as escaped raw text, no shell execution.

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/agent/debug.md` | Description (L3) + lead paragraph (L24) + Related Resources Commands row (L465) + orchestrate row rewritten to user-invoked semantics |
| `.opencode/agent/orchestrate.md` | Priority routing table row L99, REASSIGN step L492, Debug Delegation Trigger L539, routing lookup row L595 — all rewritten to prompted-offer language |
| `.claude/agents/debug.md` | Mirror of OpenCode debug.md description + body + Related Resources updates |
| `.claude/agents/orchestrate.md` | Mirror of OpenCode orchestrate.md routing edits (L99, L492, L539, L595) |
| `.gemini/agents/debug.md` | Mirror of OpenCode debug.md description + body + Related Resources updates |
| `.gemini/agents/orchestrate.md` | Mirror of OpenCode orchestrate.md routing edits |
| `.codex/agents/debug.toml` | Mirror inside `developer_instructions = '''...'''` (line 11 + Related Resources rows) |
| `.codex/agents/orchestrate.toml` | Mirror at sibling line numbers (L91, L484, L531, L587) |
| `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml` | `agent_availability.debug` block rewritten (L210-217); `debug_delegation.action` rewritten with y/n/skip prompt + scaffold invocation (L411-413) |
| `.opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml` | Same edits mirrored from the auto variant |
| `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml` | `agent_availability.debug` block rewritten (L321-328); `debug_escalation` block rewritten + autonomous `debug_dispatch.subagent_type:debug` block removed (L898-910) |
| `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml` | Same edits mirrored from the auto variant; autonomous dispatch block removed (L929-933) |
| `.opencode/command/spec_kit/implement.md` | Guardrail bullet rewritten to "no autonomous routing under any condition" |
| `.opencode/command/spec_kit/complete.md` | Same guardrail update |
| `.gemini/commands/spec_kit/implement.toml` | Mirror of `.opencode/command/spec_kit/implement.md` guardrail update inside the embedded `prompt = "..."` string |
| `.gemini/commands/spec_kit/complete.toml` | Mirror of `.opencode/command/spec_kit/complete.md` guardrail + the "Found bugs" Next Steps table verb update |
| `.opencode/skill/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh` | New executable Bash helper (~250 LOC) generating pre-filled debug-delegation.md scaffolds with atomic noclobber versioning + operator-input sanitization |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/071-debug-delegation-scaffold-generator.md` | New DBG-SCAF-001 manual-testing scenario |
| `.opencode/specs/skilled-agent-orchestration/050-agent-debug-integration/spec.md` | Level 2 specification (REQ-001 through REQ-008, NFRs, edge cases, complexity) |
| `.opencode/specs/skilled-agent-orchestration/050-agent-debug-integration/plan.md` | Edit-by-edit implementation walkthrough across Phases 1-4 |
| `.opencode/specs/skilled-agent-orchestration/050-agent-debug-integration/tasks.md` | 51 tasks across 3 phases; T042-T045 deferred to operator (DBG-SCAF-001) |
| `.opencode/specs/skilled-agent-orchestration/050-agent-debug-integration/checklist.md` | 25 verification items; 22 marked `[x]` with file:line evidence, 3 manual-rehearsal items deferred |
| `.opencode/specs/skilled-agent-orchestration/050-agent-debug-integration/implementation-summary.md` | Filled with what-built narrative + Files Changed table + Decisions + Verification + Known Limitations + Post-review fixes section |
| `.opencode/specs/skilled-agent-orchestration/050-agent-debug-integration/handover.md` | New handover with session log, decisions table, blockers table, files modified, and next-session guidance |
| `.opencode/specs/skilled-agent-orchestration/050-agent-debug-integration/graph-metadata.json` | Status updated from `planned` to `completed` |

### Verification

- **Static greps (multi-pattern, exact-substring):** zero hits across `.opencode`, `.claude`, `.codex`, `.gemini` for "Task tool dispatches a focused", "Dispatches debug after 3 failures", "Dispatch debug agent after repeated", "Dispatch a focused debugging", and "DO NOT** dispatch `@debug` unless" outside `specs/.../050-agent-debug-integration/` (this packet's own docs) and the historical research-iteration archive at `specs/.../042-sk-deep-research-review-improvement-2/review/iterations/iteration-018.md` (preserved as immutable artifact).
- **Autonomous-routing surface check:** `grep -rn 'subagent_type: "debug"'` outside this packet's spec docs returns zero hits (the only remaining match is in the DBG-SCAF-001 playbook entry as a deliberate P0 fail criterion — checking for the absence of this pattern).
- **Sibling parity:** all four runtime debug agent descriptions byte-aligned at the lead text; all four orchestrator routing tables byte-aligned. Codex `.toml` retains its standard "You have NO prior conversation context" tail sentence.
- **Scaffold smoke test (3 invocations):** first run produced `debug-delegation.md`, second `debug-delegation-002.md`, third `debug-delegation-003.md` — atomic noclobber versioning verified.
- **Schema parity:** scaffold output contains all 5 numbered sections matching `.opencode/agent/debug.md` lines 60-89 (PROBLEM SUMMARY, ATTEMPTED FIXES, CONTEXT FOR SPECIALIST, RECOMMENDED NEXT STEPS, HANDOFF CHECKLIST).
- **Injection probe:** `--error-message 'INJECT-PROBE: \`whoami\` and $(id) inside backticks'` produced raw escaped output `INJECT-PROBE: \`whoami\` and \$(id) inside backticks` in the scaffold; shell did not execute either substitution.
- **`validate.sh --strict` on packet folder:** exit 0 with 3 errors / 1 warning (cleaner than production baseline 049 spec at 6/6); remaining errors are SPEC_DOC_INTEGRITY warnings about legitimate file-yet-to-be-created references.
- **Second-opinion review:** dispatched `@ultra-think` agent via `cli-opencode` using `opencode-go/deepseek-v4-pro` model. The reviewer caught 2 P0 ship-blockers (autonomous `subagent_type:"debug"` block in `spec_kit_complete_confirm.yaml` and three sibling orchestrators not updated) and 4 P1 gaps (sibling debug agent body line 24, command-doc guardrails, scaffold TOCTOU race, heredoc shell-expansion risk). All P0+P1 findings resolved in a follow-up batch and re-verified.

### Commit

`619de83c9 feat(050): user-invoked @debug — truth-up aspirational auto-dispatch claims + prompted-offer scaffold` on `origin/main` (287 files, +2352 / -11037; the deletions are old research-iteration archive cleanup that was already in the working tree before this session).

### Constraint reaffirmed

`@debug` must NEVER be auto-dispatched under any condition. The workflow surfaces a prompted offer when 3+ task failures are observed and writes the structured handoff scaffold; the user dispatches via Task tool themselves. Codified in `feedback_debug_agent_user_invoked_only.md`.
