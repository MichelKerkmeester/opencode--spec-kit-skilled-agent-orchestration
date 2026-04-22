---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
title: "Feature Specification: Codex CLI Hook Parity Remediation"
description: "Codex CLI exposes SessionStart / UserPromptSubmit / Stop hooks in ~/.codex/hooks.json but no Spec Kit Memory hook was wired. This phase implements native Codex startup context and advisor brief parity."
trigger_phrases:
  - "codex hook parity"
  - "codex cli hooks"
  - "codex startup context"
  - "codex advisor brief"
  - "codex UserPromptSubmit"
  - "codex SessionStart"
  - "026/007/008"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/008-codex-hook-parity-remediation"
    last_updated_at: "2026-04-22T11:23:05Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Codex parity shipped"
    next_safe_action: "Validate and save"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/hooks/codex/session-start.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts"
      - "~/.codex/hooks.json"
      - "~/.codex/config.toml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "026-007-008-synth-2026-04-22"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Codex 0.122.0 hooks inject developer context via hookSpecificOutput.additionalContext."
      - "codex_hooks must be true in ~/.codex/config.toml."
      - "Superset notify hooks remain registered."
---
# Feature Specification: Codex CLI Hook Parity Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

User-verified on 2026-04-22 that Codex CLI sessions return "no startup context observed" and "no advisor brief observed" — identical user-visible symptoms to the Copilot CLI gap (sibling phase 007). Root cause is different: **Codex natively supports the hook transport**. The file `~/.codex/hooks.json` already registers `SessionStart`, `UserPromptSubmit`, and `Stop` hooks — but only wires Superset's `notify.sh` (notification script), not Spec Kit Memory's advisor/context emitter.

The reference implementation in `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts` was wired during spec 020 but only registered for Claude Code. No Codex equivalent exists. This phase is primarily **IMPLEMENTATION**, preceded by a tight investigation to confirm the exact Codex hook contract (stdin payload, stdout injection semantics, error/timeout behavior) so the port doesn't ship against assumptions.

**Key decisions**: outcome A (full hook parity) is the overwhelmingly likely path — the transport exists, the schema is known, only the contract details need confirming. Outcomes B (workaround) and C (documented limitation) are emergency fallbacks if the investigation uncovers a hard constraint (e.g., Codex hooks are notification-only and can't inject into model context).

**Critical dependencies**: reference implementation from spec 020 (`hooks/claude/user-prompt-submit.ts` + test). Both files are currently untracked in the working tree — will need to commit them before this phase's code lands.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field        | Value                                   |
| ------------ | --------------------------------------- |
| **Level**    | 3                                       |
| **Priority** | P1                                      |
| **Status**   | Draft                                   |
| **Created**  | 2026-04-22                              |
| **Parent**   | `026-graph-and-context-optimization/007-deep-review-remediation/` |
| **Sibling**  | `007-copilot-hook-parity-remediation/` (same user-visible symptom, different root cause) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Codex CLI sessions do not receive the two payloads Claude Code receives:

1. **SessionStart:startup** — code-graph freshness, structural highlights. Absent.
2. **UserPromptSubmit** — skill-advisor brief (format: `Advisor: <skill> <conf>/<uncert> <status>`). Absent.

Empirical evidence: user ran `codex` and typed "Before I ask anything else: what repository state was injected into your startup context?" — response: "no startup context observed". Then asked about advisor brief — response: "no advisor brief observed".

Root cause (confirmed by direct inspection of `~/.codex/hooks.json`): Codex CLI natively supports hooks, but no Spec Kit Memory hook command is registered. The existing entries only wire `~/.superset/hooks/notify.sh`, a notification-only script. Spec 020 wired these payloads for Claude Code (via `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts`) but no Codex counterpart was created.

### Purpose

Wire Spec Kit Memory hooks into Codex CLI's existing hook surface so Codex sessions receive the same startup-context and advisor-brief payloads Claude Code does. This is an implementation phase with a precursor investigation to confirm the exact hook contract before shipping.

### Non-goals

- Re-implementing the advisor logic itself (owned by spec 020, unchanged).
- Parity work for Copilot CLI (that's phase 007, sibling; different root cause — possibly no hook API at all).
- Parity for Gemini CLI or other runtimes.
- Modifying the Superset notify.sh hook — it stays as-is; we add additional hook entries alongside.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- **Phase 1 — Contract investigation**: confirm the exact Codex hook contract (stdin payload format, stdout injection semantics, exit-code meaning, timeout budget, concurrency/ordering, full event taxonomy).
- **Phase 2 — Port implementation**: create `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/` mirroring the Claude structure. Port `user-prompt-submit.ts` and any session-start handler. Create parity tests. Register in `~/.codex/hooks.json` alongside the existing notify.sh entries.
- **Phase 3 — Documentation**: update `.opencode/skill/cli-codex/SKILL.md` and `.opencode/skill/cli-codex/README.md` to document the parity. Update the parent handover.

### Out of Scope

- Changing the advisor logic or brief format.
- Modifying Claude hook behavior (REQ-004: must not regress).
- Shipping across other runtimes (Copilot, Gemini).
- Replacing or modifying the Superset notify.sh hook.

### Files Expected to Change

| Path                                                                              | Change Type    | Description                                                           |
| --------------------------------------------------------------------------------- | -------------- | --------------------------------------------------------------------- |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts`    | Create         | Port of Claude's hook, adapted to Codex's stdin payload format        |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/session-start.ts`         | Create (conditional) | If Codex supports SessionStart context injection, mirror Claude    |
| `.opencode/skill/system-spec-kit/mcp_server/tests/codex-user-prompt-submit-hook.vitest.ts` | Create | Parity tests mirroring Claude's test surface                          |
| `~/.codex/hooks.json`                                                             | Modify (user-local) | Add entries alongside Superset's notify.sh pointing at new Codex hooks |
| `.opencode/skill/cli-codex/SKILL.md` and `.opencode/skill/cli-codex/README.md`     | Modify         | Document parity status (shipped / feature available)                  |
| Parent `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/handover.md` | Modify | Record phase outcome |
| `decision-record.md` (this packet)                                                | Create         | ADR capturing contract-investigation findings + implementation decision |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID      | Requirement                                                                                                | Acceptance Criteria                                                                                             |
| ------- | ---------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| REQ-001 | Document Codex hook contract with primary sources + empirical evidence                                     | Parent research synthesis cites primary sources and an empirical probe |
| REQ-002 | Produce decision matrix for implementation path                                                            | `decision-record.md` ADR-003 matrix filled with concrete mechanism/feasibility/cost/risk entries                |
| REQ-003 | Ship a working Codex UserPromptSubmit hook that emits the advisor brief                                    | `hooks/codex/user-prompt-submit.ts` exists + registered in `~/.codex/hooks.json` + fresh Codex session shows the advisor line verbatim |
| REQ-004 | Claude hook behavior must not regress                                                                      | Existing `claude-user-prompt-submit-hook.vitest.ts` still passes after any shared-code changes                  |
| REQ-005 | Do not modify or overwrite the existing Superset notify.sh hook entries in `~/.codex/hooks.json`           | Diff of `hooks.json` adds a new entry to each event's hooks array without touching the existing notify.sh entries |

### P1 — Required (complete OR user-approved deferral)

| ID      | Requirement                                                                                       | Acceptance Criteria                                                                                             |
| ------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| REQ-006 | Ship a Codex SessionStart hook that emits code-graph context (if SessionStart supports injection) | `hooks/codex/session-start.ts` exists + fresh session shows startup metrics; OR decision-record documents why not |
| REQ-007 | Ship parity tests matching Claude's coverage                                                      | `tests/codex-user-prompt-submit-hook.vitest.ts` exists and passes                                               |
| REQ-008 | cli-codex skill and README document hook parity status                                           | Both files updated; grep for "advisor brief" / "startup context" returns current-state language                 |
| REQ-009 | Parent handover updated with phase outcome                                                        | Handover has a bulleted entry referencing this phase with status + key decisions                                |

### P2 — Recommended

| ID      | Requirement                                                                                       | Acceptance Criteria                                                                                             |
| ------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| REQ-010 | Capture investigation findings so the methodology is reusable for future CLI hook parity efforts  | Parent research synthesis has a methodology section with stdin probe and event-taxonomy discovery patterns      |
| REQ-011 | Document the hook authoring contract in the cli-codex skill so future hook authors don't re-investigate | A reference doc (likely under `.opencode/skill/cli-codex/references/`) captures the stdin/stdout/exit-code/timeout/ordering contract |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: In a fresh Codex CLI session, asking "what repository state was injected into your startup context?" returns a non-empty answer including code-graph metrics (file count, node count, edge count, freshness).
- **SC-002**: In a fresh Codex CLI session, asking "what skill did the advisor recommend?" returns the verbatim advisor line (`Advisor: <skill> <conf>/<uncert> <status>`).
- **SC-003**: Claude Code hook behavior is unchanged — `claude-user-prompt-submit-hook.vitest.ts` still passes.
- **SC-004**: The Superset notify.sh hook continues to fire on the same events it fired on before this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type       | Item                                                                             | Impact                                                          | Mitigation                                                                                         |
| ---------- | -------------------------------------------------------------------------------- | --------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Risk       | Codex hook stdout is notification-only (not injected into model context)         | Phase falls back to outcome B (workaround) instead of A         | Phase 1 must empirically confirm stdout injection before Phase 2 begins                            |
| Risk       | Codex hook timeout is too short for synchronous advisor brief generation         | Latency budget blown per-prompt                                 | Measure in Phase 1; if tight, pre-compute brief async and cache at `~/.codex/.advisor-cache`       |
| Risk       | Multi-hook ordering is undefined — Spec Kit Memory hook races with notify.sh     | Unpredictable output to user                                    | Phase 1 probes ordering; if unsafe, document the serial-registration pattern                       |
| Risk       | Shared-code refactor breaks Claude tests                                         | Regression in known-working flow                                | Run Claude test before + after any shared-code change; REQ-004 gates completion                    |
| Dependency | Untracked files from spec 020 (Claude hook + test) must be committed first       | This phase's port depends on stable reference code              | Commit spec 020 files before starting Phase 2 implementation                                       |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- Hook commands should complete within the configured 3s timeout.
- Direct smoke measurements: SessionStart 42.22ms; UserPromptSubmit 71ms.

### Reliability

- Hooks must fail open with `{}` so Codex turns continue if advisor/context retrieval fails.
- Hook execution must avoid hook-time disk writes to stay safe with concurrent dispatch.

### Compatibility

- Codex 0.122.0 marks `codex_hooks` as under development; future schema changes require re-running the hook contract smoke checks.

---

## 8. EDGE CASES

- Invalid or empty hook stdin returns `{}` and exits 0.
- `SessionStart` sources `startup`, `resume`, and `clear` are accepted.
- `UserPromptSubmit` emits a stale-status advisor brief when the skill graph is stale.
- Existing Superset notify hooks remain present even when Spec Kit hooks are appended.

---

## 9. COMPLEXITY ASSESSMENT

This is Level 3 because the change spans runtime hooks, live user configuration, CLI skill documentation, validation docs, and regression coverage across Claude and Codex hook adapters.

---

## 10. RISK MATRIX

| Risk | Impact | Mitigation |
|------|--------|------------|
| Codex hook schema changes while under development | Startup/advisor context could stop injecting | `.opencode/skill/cli-codex/references/hook_contract.md` documents source links and smoke checks |
| Live hooks run concurrently | Race conditions if hooks write shared state | Spec Kit hooks are stdout-only |
| Superset notification side effects | Unexpected local notification behavior | Existing notify commands were preserved exactly and remain user-owned |

---

## 11. USER STORIES

- As a Codex user, I receive startup repository context at session start.
- As a Codex user, I receive a compact skill advisor brief after each prompt.
- As a maintainer, I can verify the hook contract without rediscovering upstream behavior.
- As a Superset user, my notification hook registrations remain intact.

### Acceptance Scenarios

- **Given** a fresh Codex session starts, **When** SessionStart fires, **Then** startup context is available as developer context.
- **Given** a Codex prompt is submitted, **When** UserPromptSubmit fires, **Then** the advisor brief is available as developer context.
- **Given** the skill graph is stale, **When** the advisor hook runs, **Then** it reports stale status without blocking the turn.
- **Given** the SessionStart payload is invalid, **When** the hook runs, **Then** it exits 0 with `{}`.
- **Given** the existing Superset notification hook is registered, **When** Spec Kit hooks are added, **Then** the notify entry remains present.
- **Given** `codex_hooks` is enabled, **When** `codex features list` runs, **Then** the feature reports true.

---

## 12. OPEN QUESTIONS

1. What's the exact stdin payload format Codex passes to UserPromptSubmit hooks — JSON, plain text, nothing? Does it include the user's prompt, the session context, both?
2. Does stdout from a hook get injected into the model context at all, or is it purely informational (surfaced to the user's terminal but not the model)? If injected, is it prepended, appended, or replacing?
3. What events does Codex expose beyond the three wired locally (SessionStart, UserPromptSubmit, Stop)? Is there PostToolUse, PreCompact, anything else Claude has?
4. Exit-code semantics: does non-zero abort the turn (like Claude's UserPromptSubmit blocker pattern)? Or is it just logged?
5. Timeout budget: how long before Codex considers a hook stuck and kills/skips it?
6. Concurrency/ordering when multiple hooks are registered for the same event: serial-in-order, parallel, undefined?
7. Does the hook run with the user's full env vars, or a restricted set?
8. Can a hook emit ANSI escape codes / multi-line output safely, or does Codex truncate / escape?
<!-- /ANCHOR:questions -->

---

## 8. RELATED DOCUMENTS

- **Parent packet**: `../spec.md`, `../plan.md`, `../implementation-summary.md`
- **Sibling phase**: `../007-copilot-hook-parity-remediation/` — same user-visible symptom, different root cause, investigation-heavy
- **Referenced spec**: `.opencode/specs/026-graph-and-context-optimization/020-skill-advisor-hook-surface/` — Claude reference implementation this phase parity-matches
- **Referenced skill**: `.opencode/skill/cli-codex/` — target of documentation updates
- **Reference implementation**: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts`
- **Evidence of hook support**: `~/.codex/hooks.json` (inspected 2026-04-22)
