---
title: "Feature Specification: Cache-Warning Hook System [template:level_3/spec.md]"
description: "Sequential 6-phase prototype implementation of cache-expiry warning hooks (state schema + replay harness + Stop writer + SessionStart estimator + UserPromptSubmit soft-block) with env kill-switches, driven by research findings F4-F7, F19-F20, F24."
trigger_phrases:
  - "cache warning hook"
  - "UserPromptSubmit hook"
  - "idle timestamp"
  - "session-prime resume estimator"
  - "hook replay harness"
  - "F19 prerequisite"
importance_tier: "important"
contextType: "planning"
---
# Feature Specification: Cache-Warning Hook System

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

This feature defines a strictly sequential six-phase prototype that makes Claude cache-expiry visible before an operator accidentally triggers a full-context rebuild. The design starts with deterministic shared state and replay isolation, then adds warning surfaces in increasing UX risk order, with the new `UserPromptSubmit` behavior landing last because it is the only hook that changes immediate send-flow behavior [F5][F19][F20][F24] [SOURCE: research.md §4].

**Key Decisions**: Extend the existing shared hook-state JSON instead of creating a parallel warning store; keep stale-warning ownership out of `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts`; ship every new capability behind env kill-switches so the prototype can default to observe-only behavior where possible [F5][F7][F8][F24] [SOURCE: research.md §4].

**Critical Dependencies**: Phase A must land before any downstream warning logic because `lastClaudeTurnAt` is the deterministic idle signal; Phase B must land before any hook validation because replay evidence is not trustworthy without isolated `TMPDIR`, autosave stubbing, and shared-state write boundaries [F19][F20][F24] [SOURCE: research.md §4].

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-04-06 |
| **Branch** | `026-graph-and-context-optimization/002-implement-cache-warning-hooks` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Cache-expiry is currently invisible across the existing Claude hook surfaces in this repo, which means long-idle sessions can resume or send a new turn without any warning that the next request may rebuild full context from scratch [F4][F5][F6][F7] [SOURCE: research.md §4]. The repo already has a shared hook-state store plus `Stop`, `SessionStart`, and `PreCompact` ownership boundaries, but it does not yet have the deterministic idle timestamp, isolated replay harness, or pre-send warning seam required to prototype cache-cliff mitigation safely [F19][F20][F24] [SOURCE: research.md §4].

### Purpose
Define a Level 3 implementation plan for a kill-switch-gated cache-warning prototype that is built in six sequential phases, preserves existing hook ownership boundaries, and reduces surprise from cache cliffs without overstating savings or shipping unvalidated UX behavior [F5][F6][F7][F22] [SOURCE: research.md §4; §10].
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Extend `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts` with deterministic idle-timestamp and cache-warning fields that all downstream phases share.
- Add an isolated replay harness under `.opencode/skill/system-spec-kit/mcp_server/test/hooks/` that can drive the `PreCompact`, `SessionStart`, `Stop`, and new `UserPromptSubmit` entry points against fixtures without contaminating production temp state.
- Modify `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts` and `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` to write/read the shared cache-warning contract in phase order.
- Create `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts`, register its compiled output in `.claude/settings.local.json`, and add the three new cache-warning env keys with safe defaults.
- Regenerate the compiled hook outputs under `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/` and add any inline scaffold needed to wire the new hook into the existing build/test flow.

### Out of Scope
- Transcript auditor, SQLite ingest pipeline, and dashboard work remain in phase `005-claudest`; this spec does not implement or depend on that observability stack [F14][F16] [SOURCE: research.md §4; §10].
- Cross-agent rollout and any broader skill-usage telemetry remain later work; this spec does not implement F17-style rollout infrastructure [SOURCE: research.md §10].
- Skill-gating auto-disable queue behavior remains deferred; this phase does not solve F15 baseline-window policy or automation [SOURCE: research.md §11].
- Edit-retry telemetry is not implemented here; F12 remains policy guidance only, not part of the hook prototype in this phase [SOURCE: research.md §10; §11].
- Warning ownership must not move into `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts`; changing `compact-inject.js` into the warning owner is explicitly rejected [F8] [SOURCE: research.md §4].

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts` | Modify | Add `lastClaudeTurnAt` and `cacheWarning` to `HookState`, plus default initialization in `updateState()`. |
| `.opencode/skill/system-spec-kit/mcp_server/test/hooks/replay-harness.ts` | Create | Add isolated fixture-driven replay scaffold for all four hook entry points. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts` | Modify | Write `lastClaudeTurnAt` after transcript parsing with no new user-facing stdout. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` | Modify | Add resume-only cache rebuild estimator and warning section logic. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts` | Create | Add stale-cache pre-send warning hook with observe-only and soft-block-once modes. |
| `.claude/settings.local.json` | Modify | Add `CACHE_WARNING_IDLE_THRESHOLD_MINUTES`, `CACHE_WARNING_RESUME_ESTIMATE_ENABLED`, `CACHE_WARNING_SOFT_BLOCK_ONCE`, and `UserPromptSubmit` hook registration. |
| `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/*.js` | Regenerate | Ship compiled JavaScript outputs that mirror the TypeScript hook changes. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Phase A extends the shared hook-state schema in `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts` with `lastClaudeTurnAt: string \| null` and `cacheWarning: { thresholdMinutes: number; lastAckAt: string \| null; warningsEmitted: number } \| null`. | `HookState` and `updateState()` defaults include both fields; `saveState()` remains the atomic write path; `loadState()` returns the same JSON contract to all consumers without a parallel state file [F19][F7] [SOURCE: research.md §4]. |
| REQ-002 | Phase B introduces an isolated replay harness at `.opencode/skill/system-spec-kit/mcp_server/test/hooks/replay-harness.ts` or an equivalent file in the same test area. | Harness provisions a unique `TMPDIR` per run, disables or stubs Stop-hook autosave, enforces shared-state write boundaries, and can replay fixtures for `compact-inject`, `session-prime`, `session-stop`, and `user-prompt-submit` without touching production temp state [F20][F24] [SOURCE: research.md §4]. |
| REQ-003 | Phase C extends `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts` so `main()` writes `lastClaudeTurnAt` after transcript parsing. | The Stop hook calls `updateState(sessionId, { lastClaudeTurnAt: new Date().toISOString() })` after transcript parsing is attempted, emits no new user-facing stdout, and preserves existing summary/spec-folder/autosave behavior [F4][F19] [SOURCE: research.md §4]. |
| REQ-004 | All new behavior ships behind env kill-switches with safe defaults in `.claude/settings.local.json`. | Config includes `CACHE_WARNING_IDLE_THRESHOLD_MINUTES=5`, `CACHE_WARNING_RESUME_ESTIMATE_ENABLED=true`, and `CACHE_WARNING_SOFT_BLOCK_ONCE=true`; implementation treats kill-switches as the activation gates for new behavior and defaults to observe-only where possible [F5][F6][F24] [SOURCE: research.md §4]. |
| REQ-005 | Phase D validates the shared hook-state seam without moving warning ownership into `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts`. | Replay fixtures prove that `compact-inject`, `session-prime`, `session-stop`, and `user-prompt-submit` all read/write the same atomic JSON contract via the shared helpers, while `compact-inject` keeps its existing cache-builder responsibility and gains no stale-warning decision logic [F7][F8] [SOURCE: research.md §4]. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Phase E extends `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` `handleResume()` with a cache rebuild estimate for resumed stale sessions. | On `source=resume`, the hook computes an estimate from `state.metrics.estimatedPromptTokens` plus elapsed time since `lastClaudeTurnAt`, and emits a warning section only when elapsed exceeds `CACHE_WARNING_IDLE_THRESHOLD_MINUTES` and `CACHE_WARNING_RESUME_ESTIMATE_ENABLED=true` [F6][F19] [SOURCE: research.md §4]. |
| REQ-007 | Resume warnings must obey source-based suppression rules. | `handleResume()` emits the new warning only for `source=resume`; `source=compact` and `source=clear` stay on their existing paths and never display the stale-resume estimate, avoiding duplicate or misplaced warnings [F6] [SOURCE: research.md §4]. |
| REQ-008 | Phase F creates `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts` and wires it into `.claude/settings.local.json` under `UserPromptSubmit`. | The hook reads `lastClaudeTurnAt`, computes idle gap, warns with the exact prototype copy, soft-blocks once only when `CACHE_WARNING_SOFT_BLOCK_ONCE=true` and no acknowledgement exists yet, persists `cacheWarning.lastAckAt` on resend, and otherwise runs in warning-only observe mode [F5][F7] [SOURCE: research.md §4]. |

### P2 - Nice-to-have (ship if low-risk)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Track lightweight observability counters for warning emission versus acknowledgement in the shared state. | `cacheWarning.warningsEmitted` increments on each warning path, `lastAckAt` is populated only after resend acknowledgement, and replay fixtures assert both counters without introducing a new telemetry pipeline or JSONL dependency [F5][F7] [SOURCE: research.md §4]. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All six phases ship behind env kill-switches with safe defaults, and user-flow-changing behavior can be disabled without code changes.
- **SC-002**: Replay harness validates every hook without contaminating production state, with isolated `TMPDIR` behavior explicitly proven by test setup and teardown.
- **SC-003**: Resume warning appears in `source=resume` sessions only, and never appears on `source=compact` or `source=clear`.
- **SC-004**: `UserPromptSubmit` soft-block fires at most once per idle gap, and acknowledgement persists across resend through shared state.
- **SC-005**: Existing `Stop`, `SessionStart`, and `PreCompact` behavior shows zero regressions under replay coverage after the new cache-warning fields and hook logic land.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | **R-001: `UserPromptSubmit` UX is explicitly unshipped in the source and remains prototype-only** [F5] [SOURCE: research.md §4]. | High | Land Phase F last, keep it kill-switch gated, default to observe-only semantics when soft-block is disabled, and require replay coverage before any broader rollout. |
| Dependency | **R-002: Replay side-effects contaminate evidence without isolation** [F24] [SOURCE: research.md §4]. | High | Treat Phase B as a hard prerequisite for every validation pass; isolate `TMPDIR`, stub autosave, and enforce shared-state boundaries before comparing results. |
| Risk | **R-003: SessionStart estimate is heuristic without deeper cache telemetry** [F6] [SOURCE: research.md §4]. | Medium | Frame Phase E as an estimate, not accounting; suppress it outside `source=resume`; do not attach savings claims until local measurement exists. |
| Dependency | **R-004: Schema drift between Stop writer and consumers breaks the seam if the shared contract is not enforced** [F7] [SOURCE: research.md §4]. | High | Keep one JSON contract in `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`, use the existing atomic helpers, and verify all four hook entry points against the same fixture set in Phase D. |
| Risk | **R-005: `compact-inject.js` responsibility blur creates warning overlap without solving resumed-session coverage** [F8] [SOURCE: research.md §4]. | Medium | Keep `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts` as a mitigation target only; it may recommend `/compact`, but it must not decide stale-cache warning ownership. |

### Hard Rules
- **Prototype-only gating:** Every new feature path in Phases A-F must be controlled by env kill-switches, and defaults must preserve observe-only behavior where possible so the prototype can be rolled back instantly [F5][F24] [SOURCE: research.md §4].
- **JSONL adapter rule:** This spec does not change the Claude JSONL parser. Any future observability work belongs in phase `005-claudest` as a guarded adapter with coverage counters, fail-closed parsing, parser-failure visibility, and an `unknown` bucket rather than a trusted core contract [F16] [SOURCE: research.md §4; §10].
- **Isolation rule:** The replay harness is a prerequisite, not a cleanup task. No hook phase can be called validated unless Phase B isolation exists and is exercised in the relevant replay path [F20][F24] [SOURCE: research.md §4].
- **Source discrepancy preservation:** Do not cite the post's `264 million tokens` or `$1,619` totals as settled fact. Preserve the `926` versus `858` session mismatch and the `18,903` versus `11,357` turn-denominator mismatch anywhere this prototype summarizes source economics [F13][F21] [SOURCE: research.md §4].
- **Remedy overhead:** This spec claims reduced surprise from cache cliffs, not net-positive savings. `/clear`, `/compact`, and plugin-memory recovery remain promising mitigations, but they are not locally net-costed yet [F22] [SOURCE: research.md §10].
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No hook may exceed the existing 1.8s timeout budget defined in `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts`; replay coverage must include timeout-sensitive paths.
- **NFR-P02**: Resume-estimate and pre-send warning logic must use existing state reads plus lightweight elapsed-time math only; no new transcript reread may be added to `handleResume()`.

### Security
- **NFR-S01**: The feature must continue using the existing per-session temp-state file model and atomic rename flow; no new external service calls or network dependencies may be introduced.
- **NFR-S02**: Hook stdout must remain reserved for Claude injection content only; diagnostics stay on stderr so hook registration remains startup-clean.

### Reliability
- **NFR-R01**: All four hook entry points must read/write the same JSON state atomically through `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`.
- **NFR-R02**: Missing or malformed cache-warning state must fail safe by suppressing warning behavior rather than crashing the hook process.

### Operability
- **NFR-O01**: Every user-visible warning path must have a corresponding env kill-switch so operators can disable it without modifying code.
- **NFR-O02**: Replay harness setup must make isolation choices explicit, including `TMPDIR`, autosave stubbing, and state-directory cleanup, so failures are diagnosable.

---

## 8. EDGE CASES

### Data Boundaries
- Missing state file: `session-prime` and `user-prompt-submit` must suppress warnings and continue with current fallback behavior when no prior Stop state exists.
- Missing `lastClaudeTurnAt`: Phase E and Phase F must not infer idleness from `updatedAt`; they must treat the warning seam as unavailable until Phase A data exists [F19] [SOURCE: research.md §4].
- Malformed or future timestamp: Warning logic must treat invalid elapsed-time math as "no warning" and log only to stderr.
- Zero or stale token metrics: Resume estimate may render qualitative copy, but it must not invent precise cost numbers when `estimatedPromptTokens` is missing or zero.

### Error Scenarios
- Autosave still active in replay: Harness must fail the test run rather than silently allowing prototype evidence to pollute live temp state [F24] [SOURCE: research.md §4].
- Repeated resend after soft-block: `UserPromptSubmit` must block at most once per idle gap; further resends after acknowledgement become warning-only.
- `source=compact` and `source=clear`: Phase E warning section must never appear on these sources, even if stale state exists [F6] [SOURCE: research.md §4].
- Concurrent hook writes: Validation must confirm that `saveState()` atomic rename behavior preserves a single JSON seam rather than partial writes.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Touches shared hook state, two existing hooks, one new hook, replay test infrastructure, build outputs, and runtime config. |
| Risk | 22/25 | Includes a new user-flow-changing hook, heuristic warning copy, and shared-state coupling across four entry points. |
| Research | 17/20 | Depends on multiple research findings plus preserved risk framing for F5-F8, F13, F16, F19-F24. |
| Multi-Agent | 3/15 | Work is sequential rather than parallel, but validation spans multiple hook surfaces and compiled/runtime layers. |
| Coordination | 12/15 | Requires strict phase ordering, kill-switch design, replay isolation, and source-of-truth parity between TS, dist JS, tests, and `.claude/settings.local.json`. |
| **Total** | **74/100** | **Level 3 because the feature crosses runtime boundaries, needs formal risk framing, and must preserve explicit prototype constraints.** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | `UserPromptSubmit` warning UX is still explicitly unshipped and may behave poorly under real send-flow conditions [F5] [SOURCE: research.md §4]. | High | Medium | Keep prototype-only, gate with env flags, and require replay coverage before rollout. |
| R-002 | Replay evidence is invalid if autosave or temp-state side effects leak into test runs [F24] [SOURCE: research.md §4]. | High | High | Make isolation mandatory in Phase B and fail tests when boundaries are crossed. |
| R-003 | Resume warning estimate can imply false precision because cached-token rebuild cost is only heuristic [F6] [SOURCE: research.md §4]. | Medium | High | Label the output as an estimate, suppress outside `source=resume`, and avoid savings claims. |
| R-004 | Shared-state schema drift could desynchronize Stop writer, SessionStart estimator, PreCompact seam, and `UserPromptSubmit` acknowledgement logic [F7][F19] [SOURCE: research.md §4]. | High | Medium | Keep one contract in `hook-state.ts` and validate all four entry points together in Phase D. |
| R-005 | Boundary blur in `compact-inject.js` would create overlapping ownership and still miss resumed sessions [F8] [SOURCE: research.md §4]. | Medium | Medium | Enforce "no warning ownership in PreCompact" as a hard scope rule. |
| R-006 | Source arithmetic is not ledger-grade because the source preserves denominator mismatches and inconsistent totals [F13][F21] [SOURCE: research.md §4]. | Low | Certain | Frame source economics qualitatively, preserve discrepancies explicitly, and do not cite the post's totals as settled accounting. |
| R-007 | Remedy bundle is not net-costed, so the mitigation path could add overhead that erodes claimed savings [F22] [SOURCE: research.md §10]. | Medium | High | Claim reduced surprise only; defer savings language until local measurement is complete. |

---

## 11. USER STORIES

### US-001: Warn Before Stale Send (Priority: P0)

**As a** developer with long-running Claude sessions, **I want** a warning before I send a message into a stale cache, **so that** I can `/clear` first and avoid a full cache rebuild.

**Acceptance Scenarios**:

- **Given** a session whose `lastClaudeTurnAt` exceeds the configured threshold, **When** I submit the next prompt, **Then** the system warns with the prototype copy before the expensive turn proceeds.
- **Given** soft-block mode is enabled and no acknowledgement exists yet, **When** I send the first stale prompt, **Then** the hook blocks once and records acknowledgement on resend.

---

### US-002: Replay Without Production Contamination (Priority: P0)

**As a** hook author, **I want** isolated replay fixtures, **so that** my prototype tests do not contaminate production state.

**Acceptance Scenarios**:

- **Given** replay execution starts, **When** the harness runs, **Then** it provisions a unique `TMPDIR`, prevents autosave from touching live memory paths, and cleans up its temp state afterward.
- **Given** fixture-driven coverage, **When** I replay any supported hook entry point, **Then** the shared-state writes stay inside the harness boundary only.

---

### US-003: Resume Warning Before First Prompt (Priority: P1)

**As a** `SessionStart` handler, **I want** to estimate cache rebuild cost, **so that** I can warn the user before the first prompt.

**Acceptance Scenarios**:

- **Given** `source=resume` and an idle gap above threshold, **When** `handleResume()` runs, **Then** it renders a warning section derived from stored token metrics and elapsed time.
- **Given** `source=compact` or `source=clear`, **When** `SessionStart` runs, **Then** the resume warning is suppressed entirely.

---

### US-004: Instant Rollback Controls (Priority: P2)

**As an** operator, **I want** env kill-switches on every new hook capability, **so that** I can roll back instantly without code changes.

**Acceptance Scenarios**:

- **Given** a production issue in any new warning path, **When** I disable the relevant env key, **Then** the feature stops emitting or blocking without removing the hook file.
- **Given** defaults are applied in `.claude/settings.local.json`, **When** the feature first ships, **Then** it starts from the safest supported mode for each phase.

---

## 12. OPEN QUESTIONS

The items below stay open, but the following guardrails are not open for debate in this phase: every new feature remains kill-switch gated, JSONL observability stays in phase `005-claudest` as a guarded adapter only, replay isolation is mandatory, source arithmetic remains qualitative, and this spec does not claim net-positive savings [F13][F16][F21][F22][F24] [SOURCE: research.md §4; §10; §11].

- **Q2 - Deferred-loading ergonomics:** No first-tool latency benchmark exists for `Code_Environment/Public`, so startup ergonomics and discoverability tradeoffs remain unmeasured [SOURCE: research.md §11].
- **Q8 - Edit-retry root causes:** The post reports 31 retry sequences but does not partition root causes across prompt quality, workflow design, or messaging, so this phase cannot attribute that waste confidently [SOURCE: research.md §11].
- **Q9 - Plugin overhead net costing:** What is the actual gross-savings-minus-remedy-overhead result for `/clear` plus plugin-memory recovery once injected context, hook writes, and skill surfaces are counted? [F22] [SOURCE: research.md §10; §11].
- **Q10 - Skill baseline window:** Not relevant to this hook phase's delivery, but still unresolved for phase `005-claudest` and any later skill-usage policy work [SOURCE: research.md §11].
- **Q11 - Replay-harness isolation boundary:** What exactly must be stubbed or isolated so Stop-hook autosave and shared temp-state writes cannot contaminate validation results? Phase B must resolve this before Phase C or later phases can be treated as verified [F24] [SOURCE: research.md §4; §11].
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Research Source**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/research/research.md`
- **Existing Hook State**: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`
- **Existing Stop Hook**: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`
- **Existing SessionStart Hook**: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`
- **Existing PreCompact Hook**: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts`
- **Shared Hook Utilities**: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts`
- **Runtime Hook Config**: `.claude/settings.local.json`
- **Follow-on Planning Docs**: `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`

---

<!--
LEVEL 3 SPEC (~165 lines)
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
-->
