---
title: "029 - Runtime Hook Parity Remediation"
description: "Fix 10 hook findings from the 2026-04-21 hook parity review, including OpenCode transport, Codex hook reliability, Copilot startup wiring, and documentation truth-sync."
trigger_phrases:
  - "026/009/003 hook parity"
  - "opencode plugin bridge"
  - "codex advisor hook"
importance_tier: "high"
contextType: "feature-specification"
packet_level: 3
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/003-hook-parity-remediation"
    last_updated_at: "2026-04-21T15:33:58Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Deferred Vitest baseline failures closed"
    next_safe_action: "Run strict validation and close remaining review remediation gates"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: 029 - Runtime Hook Parity Remediation

---

## EXECUTIVE SUMMARY

This phase closes hook parity defects discovered on 2026-04-21 across the OpenCode plugin bridge, Codex advisor hooks, Copilot startup routing, Codex PreToolUse safety, and runtime documentation. The implementation keeps each runtime on its real capability surface: OpenCode injects through the plugin bridge, Codex uses prompt/pre-tool hooks plus `session_bootstrap` for startup recovery, and Copilot starts through the repo-local wrapper.

**Key Decisions**: minimal `session_resume` returns `opencodeTransport`; Codex startup recovery is documented through `session_bootstrap`; PreToolUse remains read-only at hook runtime.

**Critical Dependencies**: system-spec-kit MCP server typecheck/build/vitest gates and strict spec validation.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 remediation |
| **Status** | Complete |
| **Created** | 2026-04-21 |
| **Branch** | `009-hook-daemon-parity` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../002-skill-graph-daemon-and-advisor-unification/spec.md` |
| **Successor** | `../004-copilot-hook-parity-remediation/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 2026-04-21 hook parity review found 10 runtime-hook issues. The highest customer-facing risks were an OpenCode plugin path that could silently deliver no code-graph context and Codex advisor hook flows that could return no visible advisory on timeout.

### Purpose

Restore reliable, visible hook behavior across OpenCode, Codex, and Copilot while keeping the documentation aligned with actual runtime capabilities.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- OpenCode plugin transport delivery and diagnostic behavior.
- Codex `UserPromptSubmit` reliability and policy detection.
- Copilot `sessionStart` wrapper routing.
- Codex PreToolUse denylist alias/casing coverage and read-only hook behavior.
- Runtime hook documentation that distinguishes prompt hooks from lifecycle hooks.
- Phase 003 evidence, checklist, validation, and continuity repair.

### Out of Scope

- Implementing a Codex `SessionStart` lifecycle hook, because the active Codex CLI hook surface does not expose one.
- Replacing the skill-advisor scoring or fusion math.
- Retiring the Python advisor shim.
- Editing historical or archived startup-agent mentions outside the authorized 009 packet scope.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/plugins/spec-kit-compact-code-graph.js` | Modify | Emit visible diagnostics when transport parsing fails. |
| `.opencode/plugins/spec-kit-compact-code-graph-bridge.mjs` | Modify | Emit stderr diagnostics when `opencodeTransport` is missing. |
| `.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts` | Modify | Assert the diagnostic path fires. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/**` | Modify | Repair validation, evidence, continuity, metadata, and remediation summary. |
| Command debug doc | Create if required | Restore an intentional referenced command doc only if validation proves the reference is current. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-000 | No P0 findings are present in this review. | Review report verdict remains 0 P0. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `session_resume({ minimal: true })` must deliver a parseable OpenCode transport plan. | Bridge stdout parses with `transportOnly: true`; plugin tests cover real bridge shape. |
| REQ-002 | OpenCode transform must not silently no-op when the transport plan is absent or unparsable. | Runtime-status entry or stderr diagnostic appears, and vitest asserts the diagnostic path. |
| REQ-003 | Codex prompt hook must surface visible advisor context or a stale diagnostic on timeout. | Compiled smoke emits `hookSpecificOutput.additionalContext` with `status:"ok"` or `status:"stale"`. |
| REQ-004 | Codex hook policy detection must use valid project evidence. | `.codex/settings.json` JSON validity is authoritative; `codex hooks list` is not required. |
| REQ-005 | Copilot startup routing must use the repo-local wrapper. | `.github/hooks/superset-notify.json` points `sessionStart` to `.github/hooks/scripts/session-start.sh`. |
| REQ-006 | Active docs must not claim a nonexistent Codex startup agent. | Active Phase 003 docs point to `session_bootstrap` and contain no stale startup-agent acceptance gate. |
| REQ-007 | Phase 003 strict validation must pass. | `validate.sh .../003-hook-parity-remediation --strict --no-recursive` exits 0. |

### P2 - Should complete where in scope

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Codex PreToolUse policy must support documented aliases and command casings. | Tests cover `bash_denylist`, `toolInput.command`, and bare `git reset --hard`. |
| REQ-009 | PreToolUse hook execution must avoid filesystem writes. | Missing policy uses in-memory defaults and does not create a file. |
| REQ-010 | Runtime docs must split prompt, lifecycle, compaction, and stop hook capabilities. | Hook system matrix shows Codex as prompt yes, lifecycle no, compaction no, stop no. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** OpenCode bridge `--minimal` output, **When** the plugin parser consumes stdout, **Then** it produces a valid transport plan.
- **SC-002**: **Given** missing bridge transport, **When** the bridge exits successfully, **Then** stderr reports the missing `opencodeTransport` condition.
- **SC-003**: **Given** malformed plugin transport output, **When** the transform runs, **Then** runtime status reports the parse failure.
- **SC-004**: **Given** the MCP server workspace, **When** typecheck and build run, **Then** both exit 0.
- **SC-005**: **Given** targeted hook vitest suites, **When** they run, **Then** they pass with the diagnostic assertions included.
- **SC-006**: **Given** parent and child spec folders, **When** strict non-recursive validation runs, **Then** each command exits 0.
- **SC-007**: **Given** Phase 003 task and checklist docs, **When** review traceability is inspected, **Then** each completed item cites concrete evidence and each unfinished item explains its deferral.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing test baseline | Full-suite vitest may still fail outside this remediation scope. | Run the user-requested targeted suites and document any out-of-scope failures honestly. |
| Risk | Plugin diagnostics could add noisy output. | Operators may see extra stderr/status entries during intentional no-context states. | Emit only when parsing fails or transport is missing, and test that path explicitly. |
| Risk | Documentation shape changes may obscure prior narrative evidence. | Review traceability could regress. | Preserve evidence as subsections under the required template headers. |
| Constraint | Sandbox forbids git staging/commits. | Cannot produce final commit. | Write the parent remediation summary with proposed commit message for the orchestrator. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: The OpenCode diagnostic path must not add heavy MCP work or block normal plugin injection.

### Security

- **NFR-S01**: PreToolUse remains read-only during hook execution and denies destructive shell commands through in-memory defaults when policy files are absent.

### Reliability

- **NFR-R01**: Hook failures surface visible diagnostics rather than silent no-op behavior.

---

## 8. EDGE CASES

### Data Boundaries

- Empty bridge output must return no transport plan plus a clear diagnostic.
- Malformed bridge output must not throw through the plugin transform; it must surface a visible status entry or stderr diagnostic.

### Error Scenarios

- Missing `opencodeTransport` from the bridge is a diagnostic condition.
- Cold-start advisor timeout is a stale advisory, not an empty fail-open.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Plugin, bridge, tests, and seven spec docs. |
| Risk | 18/25 | Runtime hook behavior and destructive-command policy. |
| Research | 14/20 | Deep-review findings and validation contract had to be reconciled. |
| Multi-Agent | 6/15 | Orchestrator will commit after this remediation. |
| Coordination | 12/15 | Parent plus three child spec folders must validate together. |
| **Total** | **70/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A diagnostic fix changes plugin transform output shape. | High | Medium | Keep the existing transport plan contract and assert only the failure path addition. |
| R-002 | Strict validation fixes accidentally overstate completion. | Medium | Medium | Mark only evidence-backed tasks `[x]`; keep true blockers documented as deferred. |
| R-003 | Metadata refresh drifts from graph-metadata schema. | Medium | Low | Preserve existing graph keys and update only derived/status/continuity fields. |

---

## 11. USER STORIES

### US-001: Visible OpenCode Plugin Failure (Priority: P1)

**As an** operator, **I want** a visible diagnostic when plugin transport parsing fails, **so that** code-graph context failures do not look like normal empty output.

**Acceptance Criteria**:
1. Given missing or malformed bridge transport, When the plugin transform runs, Then a runtime-status entry or stderr diagnostic explains the no-op.

---

### US-002: Truthful Hook Capability Docs (Priority: P1)

**As a** maintainer, **I want** Codex startup recovery documented as `session_bootstrap`, **so that** I do not chase a nonexistent lifecycle agent.

**Acceptance Criteria**:
1. Given Phase 003 docs, When startup recovery is described, Then it references `session_bootstrap` and carries no stale startup-agent acceptance gate.

---

## 12. OPEN QUESTIONS

- No blocking product questions remain for this remediation packet.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- `plan.md`
- `tasks.md`
- `checklist.md`
- `decision-record.md`
- `implementation-summary.md`
- `../review/review-report.md`
