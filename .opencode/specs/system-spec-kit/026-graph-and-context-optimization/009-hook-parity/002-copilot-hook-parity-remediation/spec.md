---
title: "Fea [system-spec-kit/026-graph-and-context-optimization/009-hook-parity/002-copilot-hook-parity-remediation/spec]"
description: "Claude Code's SessionStart:startup (code-graph context) and UserPromptSubmit (skill-advisor brief) hooks fire correctly, but the same hook payloads are absent under Copilot CLI — users get no startup context and no advisor brief in Copilot sessions. This phase investigates Copilot CLI's extension surface, determines whether hook parity is achievable, and either wires equivalent hooks or documents the gap with a workaround."
trigger_phrases:
  - "copilot hook parity"
  - "copilot cli hooks"
  - "copilot startup context"
  - "copilot advisor brief"
  - "026/009/004"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-parity/002-copilot-hook-parity-remediation"
    last_updated_at: "2026-04-28T19:30:00Z"
    last_updated_by: "codex-gpt-5-hygiene-pass"
    recent_action: "Hygiene pass - validator structure"
    next_safe_action: "Keep validators green"
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-parity/002-copilot-hook-parity-remediation/research/007-deep-review-remediation-pt-01/research.md"
      - ".opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/claude-user-prompt-submit-hook.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "026-009-004-synth-2026-04-22"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Outcome B selected: file-based custom instructions."
      - "Copilot hook output cannot mutate prompts."
      - "Real copilot smoke saw the managed advisor line."
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
| **Parent**   | `026-graph-and-context-optimization/009-hook-parity/` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../001-hook-parity-remediation/spec.md` |
| **Successor** | `../003-codex-hook-parity-remediation/spec.md` |

---

<!-- /ANCHOR:metadata -->
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


---

<!-- /ANCHOR:problem -->
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

### Custom-Instructions Lifecycle

Copilot remains **Outcome B: file-based workaround**. Repository hook wiring now routes `sessionStart` and `userPromptSubmitted` through repo-local wrappers under `.github/hooks/scripts/` before optional Superset notification. The `userPromptSubmitted` wrapper invokes the compiled Spec Kit writer, so the managed `SPEC-KIT-COPILOT-CONTEXT` block refreshes from the current prompt even though Copilot reads the refreshed file on the next prompt.

The managed block is scoped by workspace root. `custom-instructions.ts` renders a `Workspace:` line and tells Copilot to ignore the block when the active project differs. Writes use a per-target lock and atomic temp-file rename. Human-authored Copilot instructions must stay outside the managed markers; Spec Kit only replaces the managed block.

### Files Expected to Change

| Path                                                                              | Change Type    | Description                                                            |
| --------------------------------------------------------------------------------- | -------------- | ---------------------------------------------------------------------- |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/*.ts`                   | Create/Modify | Copilot file-backed custom-instructions transport and lifecycle contract |
| `.opencode/skill/system-spec-kit/mcp_server/tests/copilot-*.vitest.ts`            | Create (conditional) | Parity tests mirroring `claude-user-prompt-submit-hook.vitest.ts`      |
| `.github/hooks/superset-notify.json` + `.github/hooks/scripts/*.sh`               | Modify/Create | Route `sessionStart` / `userPromptSubmitted` through Spec Kit wrappers before Superset notification |
| `.opencode/skill/cli-copilot/SKILL.md` and `README.md`                            | Modify         | Document hook parity status (works / doesn't work / workaround)        |
| Parent ../implementation-summary.md                                             | Modify         | Record phase outcome and reference this packet                         |
| `decision-record.md` (this packet)                                                | Create         | ADR capturing the "wire hooks vs. document gap" decision after investigation |

---

<!-- /ANCHOR:scope -->
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
| REQ-006 | cli-copilot/SKILL.md + `README.md` document the final state (works / limitation / workaround)   | Both files updated; grep for "advisor brief" or "startup context" returns the current behavior clearly    |
| REQ-007 | Parent ../implementation-summary.md is updated with phase outcome and next actions | Parent summary references this phase with status and key decisions |

### P2 — Recommended

| ID      | Requirement                                                                                       | Acceptance Criteria                                                                                       |
| ------- | ------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| REQ-008 | If no direct parity is possible: ship a best-effort shell-wrapper workaround with usage docs      | `cli-copilot/assets/` or user-facing doc shows the wrapper pattern; works in a manual smoke test          |
| REQ-009 | Capture the investigation findings so a future parity attempt (Gemini, etc.) can reuse them       | research.md or equivalent at this phase's root summarizes what was tried for Copilot                    |

---

<!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A future engineer reading this phase folder can determine within 5 minutes whether Copilot CLI hook parity is shipped, partial, or deliberately deferred.
- **SC-002**: If hooks are wired, a fresh Copilot CLI session receives both SessionStart payload and UserPromptSubmit advisor brief, verified by the same empirical test the user ran on 2026-04-19 ("describe the startup context you were given" / "what skill did the advisor recommend").
- **SC-003**: If hooks are NOT wired, the `cli-copilot` skill docs state the limitation explicitly and link to this spec folder.
- **SC-004**: Claude Code hook behavior is unchanged — `claude-user-prompt-submit-hook.vitest.ts` still passes.

### Acceptance Scenarios

1. **Given** a maintainer reads this packet, when they check the status, then outcome B file-based workaround is visible within five minutes.
2. **Given** Copilot hook output is inspected, when `userPromptSubmitted` returns, then it returns `{}` and writes the managed custom-instructions block.
3. **Given** a fresh Copilot prompt follows a refresh, when Copilot reads custom instructions, then the managed advisor line is visible.
4. **Given** Claude hook behavior is checked, when focused regression tests run, then Claude prompt-submit coverage remains green.
5. **Given** Superset hook routing is checked, when `userPromptSubmitted` fires, then repo-local Spec Kit wrappers run before optional notification.
6. **Given** stale workspace context is possible, when Copilot reads the managed block, then the workspace-scoped contract tells it to ignore mismatched roots.

---

<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type       | Item                                                                     | Impact                                                   | Mitigation                                                                             |
| ---------- | ------------------------------------------------------------------------ | -------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Risk       | Copilot CLI has no usable extension surface at all                       | Phase closes with "documented limitation" not "fix"      | Plan explicitly gates implementation on Phase 1 findings; closure is valid outcome     |
| Risk       | Copilot CLI extension surface exists but requires features we can't ship (e.g., plugin marketplace review) | Implementation is blocked by external process            | Phase closure can include "blocked on upstream" as an accepted outcome                 |
| Risk       | Shared hook code refactor breaks Claude tests                            | Regression in known-working flow                         | Run existing Claude test before/after any shared-code change; REQ-004 gates completion |
| Dependency | Untracked files from spec 020 (`hooks/claude/user-prompt-submit.ts` + test) | This phase depends on that code existing                 | Reference the files directly; if they're still untracked at implementation, commit them first |

---

<!-- /ANCHOR:risks -->
<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Managed custom-instructions writes stay file-local and do not add network latency.

### Security
- **NFR-S01**: Human-authored Copilot instructions remain outside the Spec Kit managed markers.
- **NFR-S02**: Managed context is scoped by workspace root to reduce cross-project leakage.

### Reliability
- **NFR-R01**: Hook stdout remains `{}` because Copilot ignores prompt-mutation output for these events.
- **NFR-R02**: Writes use lock/atomic replacement semantics.

---

## 8. EDGE CASES

### Data Boundaries
- Empty advisor output: preserve the managed block shape and diagnostics.
- Existing human instructions: merge around markers without deletion.

### Error Scenarios
- Superset hook missing: repo-local wrapper still runs Spec Kit writer first.
- Copilot ignores hook output: expected; custom-instructions file is the supported transport.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Hooks, docs, tests, global custom-instructions file |
| Risk | 18/25 | Cross-runtime hook behavior and home-level file scope |
| Research | 18/20 | 10-iteration research synthesis informed outcome B |
| Multi-Agent | 8/15 | Cross-CLI parity context |
| Coordination | 8/15 | Superset wrapper and repo-local hooks |
| **Total** | **70/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Copilot reads refreshed file on next prompt, not current prompt. | Medium | High | Document next-prompt freshness and avoid claiming true in-turn parity. |
| R-002 | Global home-level instructions leak between workspaces. | High | Medium | Render workspace root and ignore-mismatch instruction. |
| R-003 | Superset wrapper regeneration bypasses repo-local writer. | Medium | Medium | ADR-004 records repo-local wrappers as source of truth. |

---

## 11. USER STORIES

### US-001: Discover Copilot Parity State (Priority: P0)

As a maintainer, I want the packet to state outcome B clearly, so that I do not re-investigate unsupported current-turn prompt mutation.

**Acceptance Criteria**:
1. Given the packet is opened, When the summary and ADRs are read, Then outcome B is explicit.

### US-002: Preserve Managed Instruction Scope (Priority: P1)

As a Copilot CLI user, I want managed Spec Kit context scoped to the current workspace, so that stale context from another repository is not treated as current.

**Acceptance Criteria**:
1. Given the managed block is written, When Copilot reads it in another workspace, Then the block instructs Copilot to ignore mismatched roots.

### AI Execution Protocol

#### Pre-Task Checklist
- Confirm the packet root is the only write scope.
- Preserve outcome B, completion status, and existing verification evidence.
- Avoid runtime code changes in this closure pass.

#### Execution Rules

| Rule | Handling |
|------|----------|
| Template restructuring only | Rewrite headings and anchors without changing outcome. |
| Evidence preservation | Keep test commands, smoke results, and ADR conclusions intact. |
| Validator loop | Run strict validation after edits and iterate within the authorized limit. |

#### Status Reporting Format
- Packet path.
- Strict validator exit code.
- PASS or FAIL with remaining issue count.

#### Blocked Task Protocol
- Stop after three validation iterations if errors remain.
- Report remaining validator rule names and the rationale in the temporary hygiene summary.

---

## 12. OPEN QUESTIONS

None for this closure pass. Historical investigation questions were answered by outcome B and the ADRs.

---

<!-- /ANCHOR:questions -->
## RELATED DOCUMENTS

- **Parent packet**: `../spec.md`, ../plan.md, ../implementation-summary.md
- **Predecessor phase**: `../001-hook-parity-remediation/`
- **Successor phase**: `../003-codex-hook-parity-remediation/`
- **Referenced spec**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/007-skill-advisor-hook-surface/` — established the Claude hook wiring this phase aims to parity-match
- **Referenced skill**: `.opencode/skill/cli-copilot/` — target of the documentation updates
- **Reference implementation**: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts`
