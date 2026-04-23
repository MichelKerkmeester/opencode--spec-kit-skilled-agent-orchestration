---
title: "029 - Hook Parity Remediation Plan"
description: "Implementation plan for hook parity remediation across OpenCode, Codex, Copilot, and packet-local validation evidence."
trigger_phrases:
  - "026/009/003 plan"
  - "hook parity plan"
importance_tier: "high"
contextType: "implementation-plan"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/003-hook-parity-remediation"
    last_updated_at: "2026-04-21T15:33:58Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Deferred Vitest baseline failures closed"
    next_safe_action: "Run strict validation and close remaining review remediation gates"
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Implementation Plan: 029 - Runtime Hook Parity Remediation

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, JavaScript, Markdown, JSON |
| **Framework** | Vitest, Node.js, system-spec-kit validator |
| **Storage** | Spec metadata JSON and packet-local markdown docs |
| **Testing** | `npm run typecheck`, `npm run build`, targeted vitest, strict spec validation |

### Overview

The remediation is ordered by review severity and dependency: first repair strict validation, then evidence traceability, then stale acceptance gates, then OpenCode runtime diagnostics, then continuity metadata. The implementation keeps code changes scoped to the plugin, bridge, and targeted vitest file while all documentation changes stay inside the 009 packet.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented in `spec.md`.
- [x] User supplied the active spec folder and explicit write authority.
- [x] Deep-review source and findings are identified in the parent review report.

### Definition of Done

- [ ] Phase 003 strict validation exits 0.
- [ ] Parent and children 001/002/003 strict validation exits 0.
- [ ] Typecheck, build, and targeted vitest command exit 0.
- [ ] The parent remediation summary lists each finding with status, files, verification, and proposed commit message.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Thin runtime adapter with explicit diagnostics.

### Key Components

- **OpenCode plugin transform**: parses bridge output and injects runtime code-graph context.
- **OpenCode bridge**: invokes `session_resume` and serializes `opencodeTransport`.
- **Phase 003 docs**: record requirements, decisions, tasks, checklist evidence, and validation state.
- **Graph metadata**: exposes current packet status and file lineage to memory search.

### Data Flow

`session_resume` builds `data.opencodeTransport`; the bridge writes the handler JSON to stdout; the plugin parses stdout into a transport plan. When that parse fails or the transport plan is absent, the plugin or bridge must emit a visible diagnostic instead of silently returning the original system prompt.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Read Phase 003 spec docs before editing.
- [x] Run strict validation to capture current failures.
- [x] Confirm stale command-doc reference source and allowed fix path.

### Phase 2: Implementation

- [x] Repair Phase 003 template headers and required anchors.
- [x] Remove stale startup acceptance language that referenced a nonexistent Codex agent; retain `session_bootstrap` as the documented recovery path.
- [ ] Add OpenCode plugin/bridge diagnostic behavior for absent or unparsable transport plans.
- [ ] Add vitest coverage for the plugin diagnostic path.
- [ ] Refresh continuity and graph metadata across parent plus children 001, 002, and 003.

### Phase 3: Verification

- [ ] Run typecheck.
- [ ] Run build.
- [ ] Run targeted vitest for OpenCode plugin and session resume.
- [ ] Run strict validation on Phase 003, parent 009, child 001, and child 002.
- [ ] Write final remediation summary.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Typecheck | MCP server TypeScript sources | `npm run typecheck` |
| Build | MCP server compiled output | `npm run build` |
| Unit/contract | OpenCode plugin, bridge, session resume | `vitest run tests/opencode-plugin.vitest.ts tests/session-resume.vitest.ts` |
| Documentation | 009 parent and children | `validate.sh --strict --no-recursive` |

Targeted vitest is the primary behavioral gate for this review because the requested finding is in the OpenCode plugin diagnostic path. Any broader baseline failures are recorded as deferred only when they are outside the authorized write scope.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` | Internal | Required | Cannot close traceability findings without strict validation exit 0. |
| `.opencode/skill/system-spec-kit/mcp_server` npm scripts | Internal | Required | Cannot verify code changes without typecheck/build/vitest. |
| Existing 001/002 child docs | Internal | Required | Parent parity validation depends on child continuity staying coherent. |
| Sandbox write authority | External | Constrained | Git staging/commit is forbidden; summary file hands off to orchestrator. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Typecheck, build, targeted vitest, or strict validation remains red after scoped fixes.
- **Procedure**: Do not run git reset. Document the blocker in the parent remediation summary, leave evidence-backed changes in place, and hand off a precise follow-up to the orchestrator.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 validation repair | Read current docs and validator output | Phase 2 evidence updates |
| Phase 2 evidence updates | Phase 1 template compliance | Phase 3 startup gate cleanup |
| Phase 3 startup gate cleanup | ADR-002 recovery decision | Phase 4 plugin diagnostics |
| Phase 4 plugin diagnostics | Plugin and bridge reads | Phase 5 metadata refresh |
| Phase 5 metadata refresh | Current validation and verification output | Phase 6 summary |
| Phase 6 summary | All verification output | Orchestrator commit |
<!-- /ANCHOR:phase-deps -->

### AI Execution Protocol

#### Pre-Task Checklist

- Confirm the active spec folder and write authority.
- Read every file before editing it.
- Keep code edits scoped to the plugin, bridge, and targeted vitest file.

#### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Follow the user-specified phase order. |
| TASK-SCOPE | Do not edit files outside the authorized list. |
| TASK-VERIFY | Run the requested verification commands after edits. |
| TASK-TRUTH | Record failures as blocked or deferred with command output. |

#### Status Reporting Format

Status Format: finding ID, status, files modified, verification output, and proposed commit message.

#### Blocked Task Protocol

If a task is blocked by scope or sandbox constraints, mark it `DEFERRED` in the remediation summary and continue to the next safe in-scope phase.
