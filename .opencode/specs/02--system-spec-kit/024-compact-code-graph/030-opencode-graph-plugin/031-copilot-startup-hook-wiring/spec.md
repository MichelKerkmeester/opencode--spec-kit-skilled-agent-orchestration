---
title: "Feature Specification: Copilot Startup Hook Wiring [02--system-spec-kit/024-compact-code-graph/030-opencode-graph-plugin/031-copilot-startup-hook-wiring]"
description: "Implements the Phase 031 follow-on that closes the live Copilot sessionStart wiring gap and truth-syncs runtime detection with the actual repo hook configuration."
trigger_phrases:
  - "copilot startup hook wiring"
  - "phase 031"
  - "packet 030 copilot"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Copilot Startup Hook Wiring

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 031 is the bounded follow-on under packet `030-opencode-graph-plugin` that closes the last Copilot-specific startup parity gap exposed by live CLI testing. The shared Copilot session-start hook code already existed, but the repo hook registration still routed `sessionStart` through a Superset notifier that only emitted `{}`. As a result, the live Copilot CLI session never received the shared startup banner even though the hook binary itself worked.

**Key Decisions**: Keep Copilot on the shared `startup-brief.ts` surface, route `sessionStart` through a repo-local wrapper that emits the banner first, preserve Superset notifications as best-effort fan-out, and make Copilot runtime detection depend on actual repo hook wiring rather than a hardcoded `disabled_by_scope`.

**Critical Dependencies**: `.github/hooks/superset-notify.json`, new repo-local hook wrapper scripts, `hooks/copilot/session-prime.ts`, `runtime-detection.ts`, and the packet-030 startup parity contract.

---

### Phase Context

This is **Phase 031** of the OpenCode Graph Plugin phased execution specification.

| Field | Value |
|-------|-------|
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Phase** | 6 |
| **Predecessor** | `005-code-graph-auto-reindex-parity` |
| **Successor** | None |
| **Handoff Criteria** | Copilot live startup wiring, runtime detection, packet docs, and verification evidence are sufficient for future recovery. |

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-04 |
| **Branch** | `main` |
| **Parent Spec** | `030-opencode-graph-plugin` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Copilot CLI live verification proved that the shared startup banner code existed and emitted the right output when run directly, but the repo-level `sessionStart` hook registration still pointed at a Superset notifier that outputs `{}`. That left packet 030 overstating Copilot startup parity: the hook implementation was present, but the actual live runtime path never surfaced it automatically.

### Purpose
Close the real runtime gap instead of just refining wording. After this phase, Copilot should receive the shared startup banner through a tracked repo hook path, Superset notifications should still work best-effort, runtime detection should report Copilot as hook-enabled when the repo wiring exists, and the packet/docs/tests should all describe that reality accurately.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Replace the Copilot `sessionStart` hook target in the tracked repo hook config
- Add repo-local wrapper scripts so Copilot can emit the shared startup banner and still notify Superset
- Keep non-startup Copilot events valid by returning JSON from the notification wrapper
- Make `runtime-detection.ts` treat Copilot hook availability as repo-config-driven
- Update runtime-detection tests and Copilot hook wiring tests
- Truth-sync packet 030 parent/child docs and related runtime-detection docs

### Out of Scope
- Changing Claude, Gemini, Codex, or OpenCode startup behavior
- Reworking Superset itself
- Adding a new Copilot retrieval path or second memory surface
- Extending packet 030 into broader per-user Copilot provisioning outside this repo

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.github/hooks/superset-notify.json` | Modify | Route Copilot `sessionStart` through a repo-local wrapper |
| `.github/hooks/scripts/session-start.sh` | Create | Emit the shared startup banner, then fan out to Superset silently |
| `.github/hooks/scripts/superset-notify.sh` | Create | Provide a repo-local best-effort Superset notifier for non-banner events |
| `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/runtime-detection.ts` | Modify | Make Copilot hookPolicy depend on actual repo hook config |
| `.opencode/skill/system-spec-kit/mcp_server/tests/runtime-detection.vitest.ts` | Modify | Cover enabled and missing-config Copilot branches |
| `.opencode/skill/system-spec-kit/mcp_server/tests/cross-runtime-fallback.vitest.ts` | Modify | Align recovery expectations to dynamic Copilot hook policy |
| `.opencode/skill/system-spec-kit/mcp_server/tests/copilot-hook-wiring.vitest.ts` | Create | Verify the repo hook wiring and wrapper output |
| `../spec.md` | Modify | Record Phase 031 as the completed Copilot follow-on |
| `../plan.md` | Modify | Add the new wiring repair to the packet execution history |
| `../tasks.md` | Modify | Close the packet tasks for Phase 031 |
| `../checklist.md` | Modify | Reflect six completed phases and the Phase 031 evidence |
| `../decision-record.md` | Modify | Record the new follow-on under the same packet boundary |
| `../implementation-summary.md` | Modify | Note the Copilot wiring repair and dynamic runtime detection |
| `../004-cross-runtime-startup-surfacing-parity/*` | Modify | Remove stale “local/untracked Copilot config” wording |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/252-cross-runtime-fallback.md` | Modify | Reflect dynamic Copilot/Gemini fallback rules |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/22--context-preservation-and-code-graph/253-runtime-detection.md` | Modify | Reflect dynamic Copilot/Gemini hook policy detection |
| `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/05-cross-runtime-fallback.md` | Modify | Refresh the fallback feature summary |
| `.opencode/skill/system-spec-kit/feature_catalog/22--context-preservation-and-code-graph/06-runtime-detection.md` | Modify | Refresh the runtime detection feature summary |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Copilot live `sessionStart` emits the shared startup banner | The tracked repo hook config routes `sessionStart` through a wrapper that emits the `Session context received. Current state:` surface |
| REQ-002 | Superset notification behavior remains preserved best-effort | The startup wrapper still fans out to Superset silently, and non-startup hook events still return valid JSON |
| REQ-003 | Copilot hook policy is truthful | `runtime-detection.ts` reports `enabled` when repo `.github/hooks/*.json` exposes `sessionStart`, and `disabled_by_scope` when the config is absent |
| REQ-004 | Packet/docs no longer overstate or understate Copilot parity | Parent and child docs stop claiming the config is local/untracked and instead describe the repo-local tracked wiring accurately |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Tests cover Copilot wiring and dynamic detection | Targeted Vitest suites prove wrapper output and both detection branches |
| REQ-006 | Existing startup banner content remains unchanged in meaning | Copilot still uses the shared startup brief and snapshot note instead of a forked one-off string |
| REQ-007 | Non-Copilot runtime behavior remains unchanged | Claude, Gemini, Codex, and OpenCode logic are not rewritten during this phase |
| REQ-008 | Packet 030 remains a bounded runtime packet | The new follow-on stays inside startup/runtime truth-sync rather than expanding into Superset architecture or user-machine provisioning |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A live Copilot `sessionStart` hook path now surfaces the shared startup banner automatically from tracked repo config.
- **SC-002**: Runtime detection reports Copilot as hook-enabled in this repo and still proves the no-config `disabled_by_scope` branch in tests.
- **SC-003**: Packet 030 no longer contains the stale “Copilot config is local/untracked” claim.
- **SC-004**: Strict validation passes after the runtime, test, and doc truth-sync changes land.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
### Acceptance Scenarios

**Given** Copilot starts in this workspace, **when** the tracked `sessionStart` hook runs, **then** the shared startup banner reaches the live runtime instead of `{}`.

**Given** the Superset helper is installed, **when** the repo-local wrappers run, **then** the wrappers still notify Superset without contaminating the banner output.

**Given** Copilot runtime detection runs in this repo, **when** `.github/hooks/*.json` exposes `sessionStart`, **then** hookPolicy resolves to `enabled`.

**Given** Copilot runtime detection runs in a temp repo without `.github/hooks/*.json`, **when** `detectRuntime()` runs, **then** hookPolicy resolves to `disabled_by_scope`.

**Given** packet 030 is reviewed later, **when** the parent packet and Phase 004 docs are opened, **then** they no longer claim Copilot registration is merely local/untracked.

**Given** a small stale file delta occurs after Copilot startup, **when** the first structural read runs, **then** the code-graph readiness block can still report bounded `selective_reindex` behavior without changing the startup banner contract.

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing Copilot hook binary | High | Keep the wrapper thin and reuse `dist/hooks/copilot/session-prime.js` |
| Dependency | Superset notifier behavior | Medium | Preserve it as best-effort fan-out behind a repo-local wrapper |
| Risk | SessionStart wrapper breaks Copilot hook expectations | High | Keep banner output on `sessionStart` only; return `{}` for the non-banner wrapper |
| Risk | Runtime detection becomes hardcoded to this repo | Medium | Prove both enabled and no-config branches in tests |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The Copilot startup wrapper should remain fast enough for the existing 5-second hook timeout.
- **NFR-P02**: Non-startup hooks should still return immediately with valid JSON.

### Security
- **NFR-S01**: No secrets or credentials appear in the startup banner or wrapper scripts.
- **NFR-S02**: Optional Superset forwarding must remain best-effort and non-fatal.

### Reliability
- **NFR-R01**: The startup wrapper must still produce a fallback banner if the built hook file is missing or fails.
- **NFR-R02**: Runtime detection should not throw when `.github/hooks/` is missing or contains malformed JSON.

---

## 8. EDGE CASES

### Data Boundaries
- Repo hook config exists but contains no `sessionStart` entry.
- Superset helper path is absent on a collaborator machine.

### Error Scenarios
- Copilot startup wrapper must not fail hard when Superset forwarding fails.
- Invalid `.github/hooks/*.json` should not prevent detection from checking other files.

### State Transitions
- Repo with `sessionStart` hook -> Copilot `enabled`
- Repo without `sessionStart` hook -> Copilot `disabled_by_scope`
- Missing/failed hook binary -> fallback startup banner still emitted

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | Runtime config, shell wrappers, tests, and packet truth-sync |
| Risk | 20/25 | Startup behavior and runtime detection must stay truthful |
| Research | 16/20 | Backed by live Copilot CLI report and direct config inspection |
| Multi-Agent | 3/15 | One bounded follow-on stream |
| Coordination | 8/15 | Parent/child docs plus runtime-detection docs all need alignment |
| **Total** | **67/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Copilot sessionStart still emits no banner | H | M | Route `sessionStart` through the repo-local wrapper and add a wiring test |
| R-002 | Superset notifications regress | M | M | Keep best-effort forwarding inside a separate helper wrapper |
| R-003 | Docs still claim Copilot is untracked or disabled_by_scope here | M | M | Truth-sync parent, child, playbook, and feature docs together |

---

## 11. USER STORIES

### US-001: See the Startup Banner in Live Copilot (Priority: P0)

**As a Copilot user, I want the shared startup banner to appear automatically, so that Copilot startup parity matches the other repo-managed runtimes.**

**Acceptance Criteria**:
1. Given Copilot starts in this workspace, when `sessionStart` fires, then the startup banner appears automatically.
2. Given the built Copilot hook fails, when the wrapper runs, then a minimal fallback banner still appears.

### US-002: Trust Runtime Detection (Priority: P1)

**As a maintainer, I want Copilot hookPolicy to reflect the actual repo hook config, so that runtime diagnostics and fallback guidance stay truthful.**

**Acceptance Criteria**:
1. Given this repo’s hook config exists, when `detectRuntime()` runs under Copilot env vars, then `hookPolicy` is `enabled`.
2. Given a repo with no hook config, when `detectRuntime()` runs under Copilot env vars, then `hookPolicy` is `disabled_by_scope`.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- No blocking open questions remain for this phase.
- Broader cross-repo Copilot rollout is intentionally left outside packet 030.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Specification**: See `../spec.md`
- **Parent Plan**: See `../plan.md`
- **Phase 004**: See `../004-cross-runtime-startup-surfacing-parity/spec.md`
- **Phase 005**: See `../005-code-graph-auto-reindex-parity/spec.md`
