---
title: "Feature Specification: Copilot CLI Hook Parity Remediation"
description: "Claude Code's SessionStart:startup (code-graph context) and UserPromptSubmit (skill-advisor brief) hooks fire correctly, but the same hook payloads are absent under Copilot CLI — users get no startup context and no advisor brief in Copilot sessions. This phase investigates Copilot CLI's extension surface, determines whether hook parity is achievable, and either wires equivalent hooks or documents the gap with a workaround."
trigger_phrases:
  - "copilot hook parity"
  - "copilot cli hooks"
  - "copilot startup context"
  - "copilot advisor brief"
  - "026/009/004"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/004-copilot-hook-parity-remediation"
    last_updated_at: "2026-04-23T13:55:57Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Implemented Copilot file workaround and updated operator docs"
    next_safe_action: "Monitor Copilot ACP"
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/004-copilot-hook-parity-remediation/research/007-deep-review-remediation-pt-01/research.md"
      - ".opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/claude-user-prompt-submit-hook.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "026-009-004-synth-2026-04-22"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Should a separate cleanup packet address repo-wide unused-variable lint findings?"
    answered_questions:
      - "Empirical evidence confirmed: Copilot CLI does NOT surface SessionStart:startup or UserPromptSubmit hook content that Claude Code receives (user-verified 2026-04-19)."
      - "Copilot CLI DOES have a documented hook system (sessionStart, userPromptSubmitted, preToolUse, postToolUse, sessionEnd, errorOccurred) but hook outputs are IGNORED for the events that would enable parity — 'prompt modification is not currently supported in customer hooks' per the hook reference."
      - "Outcome classified: B (file-based workaround). Native hook parity is NOT achievable; file-based custom-instructions at $HOME/.copilot/copilot-instructions.md IS achievable."
      - "Recommended primary path: static-file rewrite to $HOME/.copilot/copilot-instructions.md on advisor recalculation. Supplementary: shell wrapper around `copilot -p` for programmatic mode."
      - "Deferred: ACP client wrapper (option 3) — viable but ~1-2 weeks engineering cost and depends on public-preview API that's still evolving."
      - "Implementation complete: userPromptSubmitted refreshes the managed SPEC-KIT-COPILOT-CONTEXT block and real copilot -p smoke confirmed the advisor line is visible."
---
# Feature Specification: Copilot CLI Hook Parity Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Spec 020 (`skill-advisor-hook-surface`) wired the Spec Kit Memory MCP to inject two payloads via Claude Code's native hook system: `SessionStart:startup` delivers code-graph freshness and structural highlights, and `UserPromptSubmit` delivers the skill-advisor brief (format: `Advisor: <skill> <conf>/<uncert> <status>`). Both hooks work correctly in Claude Code.

Under Copilot CLI, neither payload appears. Empirical test: user asked Copilot "describe the startup context you were given" → Copilot responded "no startup context observed"; user asked "what skill did the advisor recommend" → Copilot responded "no advisor brief observed". The hook transport in `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts` is explicitly under a `claude/` path — there is no Copilot counterpart.

**Key decisions**: Phase scope is investigation-first; implementation is conditional on Copilot CLI exposing a usable injection surface. If no such surface exists, the phase closes with a documented gap and a recommended workaround (e.g., pre-prompt shell wrapper, file-based context read, or accepting asymmetry and leaving Copilot sessions context-free).

**Critical dependencies**: existing hook wiring in `hooks/claude/user-prompt-submit.ts` and its test `tests/claude-user-prompt-submit-hook.vitest.ts` (still untracked at time of scaffold) provide the reference implementation to port.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field        | Value                                   |
| ------------ | --------------------------------------- |
| **Level**    | 3                                       |
| **Priority** | P1                                      |
| **Status** | Complete |
| **Created**  | 2026-04-19                              |
| **Parent**   | `026-graph-and-context-optimization/009-hook-daemon-parity/` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../003-hook-parity-remediation/spec.md` |
| **Successor** | `../005-codex-hook-parity-remediation/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Two distinct runtime behaviors diverge across CLIs:

1. **SessionStart:startup** — Claude Code receives structural code-graph metrics (file count, node count, edge count, freshness) at session start. Copilot CLI does not. Users in Copilot CLI have no signal about whether the code graph is stale or what it covers.

2. **UserPromptSubmit** — Claude Code receives the skill-advisor brief inline with every user prompt (advisor's skill recommendation, confidence, uncertainty, and pass/fail status). Copilot CLI does not. Users in Copilot CLI lose the advisor's routing signal and may pick the wrong skill — or bypass skills entirely — without knowing.

Both Copilot behaviors are silent: there is no error, no log entry, no fallback notice. The hook simply does not fire because the transport was never wired for Copilot.

### Purpose

Close the parity gap — either by wiring equivalent hooks for Copilot CLI (if its extension surface supports it), or by documenting the limitation and shipping a best-effort workaround that narrows the user-visible gap.

### Non-goals

- Re-implementing the advisor logic itself (already owned by spec 020).
- Supporting hooks in Gemini CLI or any other runtime — those are separate parity efforts.
- Inventing a Copilot plugin if no extension API exists; we won't ship vendored patches.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Survey Copilot CLI's documented extension surface (hooks, pre-prompt scripts, env injection, config directives, custom instructions files).
- Produce a decision matrix: what parity mechanisms are available, and what's the cost of each.
- If a mechanism exists: port `hooks/claude/user-prompt-submit.ts` logic to a `hooks/copilot/` equivalent with parity tests.
- If no mechanism exists: document the limitation in cli-copilot skill docs, update the 020 spec README to call out the Claude-only status, and recommend a best-effort workaround.
- Update `implementation-summary.md` at the parent packet level when complete.

### Out of Scope

- Changing the advisor logic or the brief format — both are upstream of this phase.
- Modifying Claude hook behavior — that's already stable and this phase must not regress it.
- Shipping a Copilot extension that isn't part of a supported Copilot CLI API.
- Any voice/tone changes — unrelated and already covered by spec 046.

### Files Expected to Change

| Path                                                                              | Change Type    | Description                                                            |
| --------------------------------------------------------------------------------- | -------------- | ---------------------------------------------------------------------- |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/*.ts`                   | Create (conditional) | Copilot equivalents of the Claude hook transport, if parity mechanism is found |
| `.opencode/skill/system-spec-kit/mcp_server/tests/copilot-*.vitest.ts`            | Create (conditional) | Parity tests mirroring `claude-user-prompt-submit-hook.vitest.ts`      |
| `.opencode/skill/cli-copilot/SKILL.md` and `README.md`                            | Modify         | Document hook parity status (works / doesn't work / workaround)        |
| Parent `../implementation-summary.md`                                             | Modify         | Record phase outcome and reference this packet                         |
| `decision-record.md` (this packet)                                                | Create         | ADR capturing the "wire hooks vs. document gap" decision after investigation |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 — Blockers (MUST complete)

| ID      | Requirement                                                                                                 | Acceptance Criteria                                                                                         |
| ------- | ----------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| REQ-001 | Document Copilot CLI's extension surface with primary sources cited (official docs, GitHub repo, release notes) | Research findings captured in this spec folder with ≥3 primary-source citations for Copilot CLI extensibility |
| REQ-002 | Produce a decision matrix with options ranked by implementation cost, reliability, and user-visible impact  | Matrix present in `decision-record.md` with columns: mechanism, feasibility, cost, risk, recommended?       |
| REQ-003 | Decide: either wire Copilot hooks OR document the gap with a workaround. The decision must be explicit.     | `decision-record.md` ADR with Status=Accepted and the rationale                                             |
| REQ-004 | Claude hook behavior must not regress from this phase's work                                                | Existing `claude-user-prompt-submit-hook.vitest.ts` still passes after any shared-code changes              |

### P1 — Required (complete OR user-approved deferral)

| ID      | Requirement                                                                                       | Acceptance Criteria                                                                                       |
| ------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| REQ-005 | If hook wiring is feasible: ship parity tests matching Claude's coverage                          | `tests/copilot-user-prompt-submit-hook.vitest.ts` (or equivalent) exists and passes                       |
| REQ-006 | `cli-copilot/SKILL.md` + `README.md` document the final state (works / limitation / workaround)   | Both files updated; grep for "advisor brief" or "startup context" returns the current behavior clearly    |
| REQ-007 | Parent `../implementation-summary.md` is updated with phase outcome and next actions | Parent summary references this phase with status and key decisions |

### P2 — Recommended

| ID      | Requirement                                                                                       | Acceptance Criteria                                                                                       |
| ------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| REQ-008 | If no direct parity is possible: ship a best-effort shell-wrapper workaround with usage docs      | `cli-copilot/assets/` or user-facing doc shows the wrapper pattern; works in a manual smoke test          |
| REQ-009 | Capture the investigation findings so a future parity attempt (Gemini, etc.) can reuse them       | `research.md` or equivalent at this phase's root summarizes what was tried for Copilot                    |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A future engineer reading this phase folder can determine within 5 minutes whether Copilot CLI hook parity is shipped, partial, or deliberately deferred.
- **SC-002**: If hooks are wired, a fresh Copilot CLI session receives both SessionStart payload and UserPromptSubmit advisor brief, verified by the same empirical test the user ran on 2026-04-19 ("describe the startup context you were given" / "what skill did the advisor recommend").
- **SC-003**: If hooks are NOT wired, the `cli-copilot` skill docs state the limitation explicitly and link to this spec folder.
- **SC-004**: Claude Code hook behavior is unchanged — `claude-user-prompt-submit-hook.vitest.ts` still passes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type       | Item                                                                     | Impact                                                   | Mitigation                                                                             |
| ---------- | ------------------------------------------------------------------------ | -------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Risk       | Copilot CLI has no usable extension surface at all                       | Phase closes with "documented limitation" not "fix"      | Plan explicitly gates implementation on Phase 1 findings; closure is valid outcome     |
| Risk       | Copilot CLI extension surface exists but requires features we can't ship (e.g., plugin marketplace review) | Implementation is blocked by external process            | Phase closure can include "blocked on upstream" as an accepted outcome                 |
| Risk       | Shared hook code refactor breaks Claude tests                            | Regression in known-working flow                         | Run existing Claude test before/after any shared-code change; REQ-004 gates completion |
| Dependency | Untracked files from spec 020 (`hooks/claude/user-prompt-submit.ts` + test) | This phase depends on that code existing                 | Reference the files directly; if they're still untracked at implementation, commit them first |
<!-- /ANCHOR:risks -->

---

## 7. OPEN QUESTIONS

1. Does Copilot CLI have a documented pre-prompt hook, agent-extension API, or plugin surface (as of April 2026)?
2. Is there a user-config file Copilot CLI reads at session start (analogous to `~/.codex/AGENTS.md` or `~/.claude/CLAUDE.md`) that could carry the context payload?
3. If we go the shell-wrapper workaround route, is the user willing to alias `copilot` in their shell, or does that break their muscle memory?
4. What's the expected latency budget for the advisor brief if it has to be fetched synchronously per prompt in Copilot (Claude has the hook doing it transparently)?

---

## 8. RELATED DOCUMENTS

- **Parent packet**: `../spec.md`, `../plan.md`, `../implementation-summary.md`
- **Predecessor phase**: `../003-hook-parity-remediation/`
- **Successor phase**: `../005-codex-hook-parity-remediation/`
- **Referenced spec**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/001-skill-advisor-hook-surface/` — established the Claude hook wiring this phase aims to parity-match
- **Referenced skill**: `.opencode/skill/cli-copilot/` — target of the documentation updates
- **Reference implementation**: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts`
