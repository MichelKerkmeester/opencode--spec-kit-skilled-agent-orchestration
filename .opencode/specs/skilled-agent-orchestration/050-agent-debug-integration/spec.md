---
title: "Feature Specification: Debug Agent Integration — Truth-Up Aspirational Claims and Improve Discoverability"
description: "The @debug agent is shelfware: every runtime advertises auto-dispatch on failure_count >= 3, but no executable code wires that, and zero debug-delegation.md instances have ever been filled in. This spec rewrites the aspirational claims to match real (user-invoked, prompt-only) behavior and lifts the failure-threshold prompt above the buried A/B/C/D menu so the agent gets actually used."
trigger_phrases:
  - "debug agent integration"
  - "@debug user-invoked"
  - "failure_count prompt"
  - "debug-delegation scaffold"
  - "agent description sync"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/050-agent-debug-integration"
    last_updated_at: "2026-04-27T08:35:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Created spec.md from deep-dive findings"
    next_safe_action: "Write plan.md with concrete edit-by-edit steps"
    blockers: []
    key_files:
      - ".opencode/agent/debug.md"
      - ".opencode/agent/orchestrate.md"
      - ".opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml"
      - ".opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml"
      - ".claude/agents/debug.md"
      - ".codex/agents/debug.toml"
      - ".gemini/agents/debug.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-2026-04-27-debug-integration"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions:
      - "Should @debug be auto-dispatched? → NO (user constraint, hard rule)"
      - "Should the agent be deleted? → NO, keep and improve discoverability"
---
# Feature Specification: Debug Agent Integration — Truth-Up & Discoverability

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-27 |
| **Branch** | `050-agent-debug-integration` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A repo-wide audit of the `@debug` agent (`.opencode/agent/debug.md` plus three sibling runtime definitions in `.claude/`, `.codex/`, `.gemini/`) confirmed the agent is shelfware. Its description and the orchestrator routing both promise auto-dispatch on `failure_count >= 3`, but no executable code increments that counter or invokes the Task tool. Zero `debug-delegation.md` instances exist across all spec folders despite a fully formed template, and in the one place where a workflow does prompt the user (`spec_kit_implement_auto.yaml:413` / `spec_kit_complete_auto.yaml:898-910`), the prompt is a buried A/B/C/D menu that operators consistently skip.

### Purpose
Make `@debug` honest and reachable: replace every "auto-dispatch" claim with the actual user-invoked / prompted-offer semantics, and upgrade the existing failure-threshold prompt so operators can opt in with a single keystroke and a pre-filled `debug-delegation.md` scaffold.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite "auto-dispatch" / "Task tool dispatches" wording in the four runtime debug agent definitions (OpenCode, Claude, Codex, Gemini) so the description matches reality (user-invoked, optionally prompted at failure threshold).
- Rewrite the matching routing prose in `.opencode/agent/orchestrate.md` (Priority Routing Table row, REASSIGN step, Debug Delegation Trigger section).
- Rewrite the `failure_tracking` metadata wording in `spec_kit_implement_auto.yaml` and `spec_kit_complete_auto.yaml` so it reads as a *prompt threshold*, not an *auto-route trigger*.
- Replace the buried A/B/C/D failure-threshold menu (`spec_kit_implement_auto.yaml` ~L411-413 and `spec_kit_complete_auto.yaml` ~L898-910) with a single direct yes/no/skip prompt, plus a one-line summary of what `@debug` would do.
- On opt-in, generate a pre-filled `debug-delegation.md` scaffold inside the active spec folder using the Debug Context Handoff schema at `.opencode/agent/debug.md:60-89`.
- Drift check + sync across the four runtime debug definitions (per AGENTS.md sync rule).

### Out of Scope
- Wiring any form of autonomous routing to `@debug` — the user's hard constraint is no auto-dispatch under any condition.
- Modifying `@debug`'s 5-phase methodology, tool routing, output formats, or anti-patterns.
- Pruning or deleting the agent or any of its runtime definitions — the agent stays, just gets honest copy and better surfacing.
- Changes to other agent definitions (`@ultra-think`, `@orchestrate`, etc.) that may have similar adoption gaps. Tracked separately.
- Backfilling past spec folders with retroactive `debug-delegation.md` scaffolds.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/agent/debug.md` | Modify | Rewrite description (line 3) and lead paragraph (line 24) to user-invoked semantics; update Related Resources table (line 461) so "orchestrate dispatches debug after 3 failures" becomes "orchestrate prompts user to dispatch debug after 3 failures." |
| `.opencode/agent/orchestrate.md` | Modify | Rewrite Priority Routing Table row L99, REASSIGN step L492, Debug Delegation Trigger L537-539, and routing lookup row L595 to describe a prompted offer instead of automatic dispatch. |
| `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml` | Modify | Rename / annotate `failure_tracking` metadata (L212-216) to read as prompt threshold; rewrite `debug_delegation.action` (L413) from buried "user may dispatch" inside diagnostic dump into a clear `prompt_user_with_y_n_skip` block. |
| `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml` | Modify | Mirror changes from implement_auto.yaml at L321-328 and L898-910 (`debug_escalation` block — the actual A/B/C/D menu lives here). |
| `.claude/agents/debug.md` | Modify | Mirror description rewrite from `.opencode/agent/debug.md` (drift check first to confirm parity baseline). |
| `.codex/agents/debug.toml` | Modify | Mirror description rewrite (line 11 is the inline description string inside the TOML body). |
| `.gemini/agents/debug.md` | Modify | Mirror description rewrite. |
| `.opencode/skill/system-spec-kit/templates/debug-delegation.md` | Verify only | Confirm template field schema matches the Debug Context Handoff format at `.opencode/agent/debug.md:60-89`. Modify only if drift is found. |
| `.opencode/specs/skilled-agent-orchestration/050-agent-debug-integration/` | Create | This packet's spec/plan/tasks/checklist + implementation-summary post-impl. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The four runtime debug agent definitions (OpenCode, Claude, Codex, Gemini) describe `@debug` as user-invoked / prompted-offer at threshold, with NO "auto-dispatch" or "Task tool dispatches" language. | `grep -n "auto-dispatch\|Task tool dispatches a focused" .opencode/agent/debug.md .claude/agents/debug.md .codex/agents/debug.toml .gemini/agents/debug.md` returns zero matches. The four descriptions are mutually consistent (semantic parity, not byte-identical). |
| REQ-002 | `.opencode/agent/orchestrate.md` no longer claims that the orchestrator auto-dispatches `@debug` on failure_count threshold. The routing table, REASSIGN step, and Debug Delegation Trigger all describe a prompted offer that the user opts into. | Grep `orchestrate.md` for "Task tool dispatches a focused\|auto-dispatch\|automatically routes" returns zero matches. The Debug Delegation Trigger explicitly says "prepare a diagnostic summary AND prompt the user." |
| REQ-003 | `spec_kit_implement_auto.yaml` and `spec_kit_complete_auto.yaml` `failure_tracking` metadata reads as a prompt threshold (e.g., `prompt_threshold: 3`) and the failure-handling step contains a single direct yes/no/skip prompt — not a buried A/B/C/D menu. | Both YAML files use a renamed/annotated metadata block. Grep for the `prompt_threshold` keyword returns hits in both files. The pre-existing menu format is removed. |
| REQ-004 | When the user answers `y` to the failure-threshold prompt, the workflow generates `specs/<folder>/debug-delegation.md` populated with the failure trail in the Debug Context Handoff schema (Error Description, Files Involved, Reproduction Steps, Prior Attempts table, Environment). | A synthetic 3-failure rehearsal in a throwaway spec folder produces a `debug-delegation.md` whose sections match the schema in `.opencode/agent/debug.md:60-89`. No fields contain placeholder TODO text. |
| REQ-005 | No code path automatically invokes `@debug` via the Task tool without an explicit `y` from the user. | Grep across `.opencode/command/`, `.opencode/skill/system-spec-kit/scripts/`, and runtime hook configs for new `Task tool` / `subagent_type: "debug"` invocations introduced by this packet returns zero matches. Existing user-gated invocations are preserved. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The "decline" and "skip" branches of the new prompt preserve current behavior — operator can continue manually or skip the failing task without disruption. | Synthetic rehearsal exercising both branches confirms the workflow proceeds without dispatching `@debug` and without writing `debug-delegation.md`. |
| REQ-007 | `validate.sh --strict` passes on the new spec folder after each spec doc is written. | Exit code 0 or 1 (warnings allowed) — never 2 (errors). |
| REQ-008 | A short manual-testing playbook entry under `.opencode/skill/cli-*/manual_testing_playbook/` documents the failure-threshold prompt rehearsal so the path stays exercised. | New `.md` entry exists with steps to reproduce the synthetic 3-failure flow and verify the prompt + scaffold generation. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: After this packet ships, `grep -ri "auto-dispatch\|automatically routes.*debug\|Task tool dispatches" .opencode/agent .claude/agents .codex/agents .gemini/agents .opencode/command/spec_kit` returns zero matches.
- **SC-002**: A synthetic 3-failure spec rehearsal produces a fully scaffolded `debug-delegation.md` and the `@debug` invocation only fires after the user types `y` in the prompt.
- **SC-003**: The four runtime debug agent definitions describe identical semantics (user-invoked, prompted at threshold, opts-in via Task tool with optional pre-filled scaffold). No drift remains between OpenCode, Claude, Codex, Gemini.
- **SC-004**: The next time the failure-threshold prompt fires in a real implementation flow, the operator sees a single direct question rather than a four-option menu, and the option to dispatch `@debug` is the recommended (top-listed) path.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Wording drift between the four runtime debug definitions over time. | High — re-introduces the same shelfware problem after future edits. | Add a brief sync-check note to AGENTS.md sibling-sync rule referencing this packet so future debug.md edits remember the four-runtime mirror. |
| Risk | Removing the A/B/C/D menu may surprise operators expecting the old shape. | Low — menu was rarely used per audit. | Mention the change in the manual-testing playbook entry; the new prompt is strictly more direct. |
| Risk | Pre-fill scaffold writes inside an active spec folder, possibly clobbering an in-progress `debug-delegation.md`. | Medium — could lose user-authored content. | Generate scaffold only when no `debug-delegation.md` exists. If one exists, append to a versioned `debug-delegation-NNN.md` instead. |
| Dependency | `.opencode/agent/debug.md:60-89` Debug Context Handoff schema. | The pre-fill scaffold mirrors this schema exactly. | If the schema changes, update the scaffold generator. Add a post-write validator check that asserts schema parity (lint rule). |
| Dependency | `validate.sh --strict` for spec folder template compliance. | Required for REQ-007. | Already exists at `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`; no new tooling needed. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Documentation Synchronization
- **NFR-D01**: All four runtime debug definitions (OpenCode `.md`, Claude `.md`, Codex `.toml`, Gemini `.md`) MUST share semantically equivalent descriptions; byte-equality is not required across formats but no claim should diverge.
- **NFR-D02**: The orchestrator's debug routing prose, the YAML `failure_tracking` metadata, and the agent's own description MUST tell the same story (prompted offer at threshold, user opts in via Task tool).

### Maintainability
- **NFR-M01**: The pre-fill scaffold generator should live in a single shared utility (likely under `.opencode/skill/system-spec-kit/scripts/`), not duplicated between `implement_auto.yaml` and `complete_auto.yaml`.
- **NFR-M02**: Template-source markers (`<!-- SPECKIT_TEMPLATE_SOURCE: ... -->`) MUST be preserved in any debug-delegation scaffold output to keep validators happy.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Operator Decline Paths
- **Decline at prompt**: User answers anything other than `y` → no scaffold written, no agent dispatched, workflow continues with manual debugging path.
- **Skip at prompt**: User explicitly skips the failing task → workflow marks task as skipped per existing semantics, scaffold not generated.

### Pre-Existing Scaffold
- **`debug-delegation.md` already present**: Generator detects the file and writes `debug-delegation-002.md` (versioned) instead of overwriting. Operator is told the new path in the prompt confirmation.

### Failure-Trail Reconstruction
- **Empty failure trail** (counter hit threshold but no captured stdout/stderr): Scaffold uses placeholder `[failure trail not captured]` and instructs operator to fill in manually before dispatching `@debug`. Threshold is still hit; prompt still fires.
- **Multi-task failure attribution**: If the 3-failure threshold spans different tasks, the scaffold names all three in the Prior Attempts table rather than collapsing to one.

### Runtime Drift
- **Codex `.toml` format**: The TOML wraps the description in `developer_instructions = '''...'''`. Edits MUST go inside the multi-line string and preserve TOML escaping; cannot blindly run a markdown-only sed.
- **AGENTS.md sibling sync**: Per memory rule (`feedback_agents_md_sync_triad.md`), AGENTS.md changes must mirror to `AGENTS_Barter.md` and `AGENTS_example_fs_enterprises.md`. This packet does NOT modify AGENTS.md content (only edits agent files), so the triad sync does not apply, but should be re-checked at packet close.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 8-9 files modified, ~280 LOC of edits; spans 4 runtime profiles. |
| Risk | 10/25 | Low — purely documentation rewrites + a small scaffold generator; no production runtime behavior change. |
| Research | 4/20 | Already complete via deep dive (this packet's input plan file). |
| **Total** | **28/70** | **Level 2** — verification-grade docs, no architectural decisions. |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- (none — user constraint is firm: no auto-dispatch; deep-dive findings are concrete; scope is bounded)
<!-- /ANCHOR:questions -->

---

<!--
Spec docs Level 2 (~280 LOC).
Source plan: /Users/michelkerkmeester/.claude/plans/i-have-the-feeling-enchanted-cake.md
User constraint: debug must NEVER be auto-dispatched. Prompted offer at most.
-->
