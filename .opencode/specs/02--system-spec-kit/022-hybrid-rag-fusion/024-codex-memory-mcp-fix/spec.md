---
title: "Feature Specification: Codex Memory MCP Fix"
description: "Codex could not start the spec_kit_memory MCP server reliably because startup combined a workspace-local writable SQLite path assumption with structured logs that could contaminate transport output. This packet retroactively captures the landed startup fix and defines the next broader remediation backlog without rewriting the older 020 packet."
trigger_phrases:
  - "codex memory mcp fix"
  - "spec_kit_memory codex startup fix"
  - "memory mcp writable db path"
  - "stderr startup transport"
  - "broader remediation backlog"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Codex Memory MCP Fix

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Codex-facing `spec_kit_memory` startup is now stable because the runtime writes its SQLite database to a writable home path and keeps structured logs on stderr instead of stdout. This packet records that landed remediation as a narrow green slice, then turns the remaining broader runtime, documentation, and release-control cleanup into explicit follow-up tasks so future work does not keep stretching `020-pre-release-remediation`.

**Key Decisions**: Create a new numbered packet instead of reopening `020`; treat the Codex startup fix and the spec-doc indexing caveat fix as landed evidence while keeping broader `022` remediation open.

**Critical Dependencies**: `../020-pre-release-remediation/review/review-report.md`, Codex launcher config surfaces, `context-server` startup behavior, and packet-local validation.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-03-28 |
| **Branch** | `024-codex-memory-mcp-fix` |
| **Parent Spec** | `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/` |
| **Related Packets** | `020-pre-release-remediation`, `022-spec-doc-indexing-bypass`, `023-ablation-benchmark-integrity` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Codex could fail to initialize `spec_kit_memory` because the MCP server assumed it could create a SQLite database under the workspace and because startup-time structured logs could leak onto stdout during background memory scans. The narrow runtime fix is now landed, but it was still living inside a broader `020-pre-release-remediation` packet whose checklist intentionally preserves an overall `FAIL` posture for the larger `022` program.

That made the Codex-specific improvement hard to resume cleanly: the fix was real, the follow-up caveat around spec-doc indexing tests was also fixed, but the remaining backlog still needed a dedicated packet that says what is already green and what is still pending.

### Purpose

Create a retroactive Level 3 packet that records the landed Codex `spec_kit_memory` MCP remediation, preserves honest scope boundaries with `020`, and carries forward the broader unresolved remediation work as concrete to-do tasks.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Record the landed Codex startup remediation: writable home `MEMORY_DB_PATH` plus stderr-only structured logging for MCP transport safety.
- Record the follow-up caveat fix: numeric spec-leaf path matching, `SPEC_DOCUMENT_FILENAMES` public re-export, and modularization-threshold drift correction.
- Create a new numbered packet under `022-hybrid-rag-fusion` so future Codex MCP work has its own execution and resume surface.
- Carry forward the most relevant broader remediation tasks from `020` into an explicit backlog for runtime hardening, docs truth-sync, and release-control follow-up.
- Keep the packet honest about what is already verified versus what still remains open in the larger `022` remediation program.

### Out of Scope

- Declaring the full `022-hybrid-rag-fusion` tree release-ready.
- Rewriting the canonical review packet inside `../020-pre-release-remediation/review/`.
- Closing unrelated `020` remediation items that were not part of the Codex MCP startup slice.
- Performing new runtime implementation beyond the packet creation and backlog capture requested in this turn.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/024-codex-memory-mcp-fix/README.md` | Create | Packet overview and quick navigation |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/024-codex-memory-mcp-fix/spec.md` | Create | Scope, requirements, risk model, and user stories |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/024-codex-memory-mcp-fix/plan.md` | Create | Execution plan and verification strategy |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/024-codex-memory-mcp-fix/tasks.md` | Create | Retroactive done items plus broader remediation backlog |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/024-codex-memory-mcp-fix/checklist.md` | Create | Packet-local verification state |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/024-codex-memory-mcp-fix/decision-record.md` | Create | ADR explaining why this packet exists and how it relates to `020` |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/024-codex-memory-mcp-fix/implementation-summary.md` | Create | Truthful summary of this retroactive packet creation |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/024-codex-memory-mcp-fix/description.json` | Create | Packet identity and indexing metadata |
| `.opencode/skill/system-spec-kit/scripts/utils/logger.ts` | Reference | Landed stderr-only structured logging fix tracked by this packet |
| `opencode.json`, `.mcp.json`, `.codex/config.toml`, `.claude/mcp.json`, `.vscode/mcp.json`, `.gemini/settings.json` | Reference | Landed writable home DB-path alignment across launcher surfaces |
| `.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts` | Reference | Landed caveat-fix surfaces that keep the remediation slice green |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The new `024` packet explicitly records the real Codex startup failure causes and the landed narrow fixes. | `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md` all describe the writable home DB-path fix and stderr transport fix consistently. |
| REQ-002 | The packet distinguishes between the landed Codex startup slice and the still-open broader `022` remediation work. | Packet text states the Codex slice is green while the broader remediation verdict remains open in `020`. |
| REQ-003 | The packet captures the follow-up spec-doc indexing caveat fix as part of the same remediation narrative. | The spec and tasks mention numeric spec-leaf path matching, the `SPEC_DOCUMENT_FILENAMES` re-export, and the modularization threshold update. |
| REQ-004 | The packet must provide a concrete broader-remediation backlog instead of vague future-work notes. | `tasks.md` includes named pending tasks for runtime hardening, docs truth-sync, and release-control follow-up. |
| REQ-005 | The packet must validate locally with no template drift or placeholder leftovers. | `validate.sh <packet> --no-recursive` exits cleanly. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | `description.json` is present and aligned to the new packet slug and parent chain. | JSON parses and points at `02--system-spec-kit/022-hybrid-rag-fusion/024-codex-memory-mcp-fix`. |
| REQ-007 | The packet explains why a new numbered folder is better than expanding `020`. | `decision-record.md` records the alternative and rationale. |
| REQ-008 | The packet links back to `020-pre-release-remediation` as the broader source of truth for unresolved findings. | Cross-references are present in README/spec/tasks/checklist. |
| REQ-009 | The implementation summary stays honest that this turn creates documentation and backlog control, not new runtime code. | `implementation-summary.md` explicitly states no new runtime code was changed in this turn. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `024-codex-memory-mcp-fix` exists with completed Level 3 packet files and packet-local validation passes.
- **SC-002**: The packet provides a clear resume point for future Codex MCP work by separating landed evidence from open backlog.
- **SC-003**: The packet captures both the startup remediation and the caveat fix without claiming the entire `022` remediation program is done.
- **SC-004**: Broader remediation tasks are concrete enough that a later implementation wave can start from `tasks.md` without re-discovering scope.

### Acceptance Scenarios

**Given** a future Codex session, **when** it opens this packet first, **then** it can see that the startup slice is green without misreading the entire `022` program as complete.

**Given** a maintainer reviews launcher configuration drift, **when** they check the backlog here, **then** the writable-home `MEMORY_DB_PATH` surfaces are already named.

**Given** startup logging changes in the future, **when** the packet is used for resume context, **then** stderr-only transport safety is still called out as a hard expectation.

**Given** the spec-doc indexing caveat resurfaces, **when** a later wave resumes from `024`, **then** the numeric spec-leaf and export drift fixes are already part of the recorded evidence chain.

**Given** the broader remediation program is still open, **when** someone reads this packet, **then** they are redirected to `../020-pre-release-remediation/review/review-report.md` for the canonical broader review state.

**Given** the next implementation wave grows beyond focused Codex MCP remediation, **when** the team reviews `tasks.md`, **then** the packet already flags the option to open a new numbered follow-on folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `../020-pre-release-remediation/review/review-report.md` remains the canonical broader review source | Packet could contradict the parent remediation story | Keep `024` narrow and explicitly cross-reference `020` as the broader source of truth |
| Dependency | Codex and sibling launcher configs stay aligned on `MEMORY_DB_PATH` | Future drift could reintroduce client-specific startup failures | Track launcher parity as an explicit backlog item in `tasks.md` |
| Risk | This new packet could be mistaken for a release-ready verdict change | Teams might overstate the health of the broader remediation program | Repeat in spec, checklist, and summary that only the Codex startup slice is green |
| Risk | Future runtime changes can stale the retroactive evidence captured here | Packet could age into historical-only prose | Require future implementation waves to refresh tests and startup smoke evidence before closing backlog items |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The packet must preserve the expectation that Codex startup reaches "Context MCP server running on stdio" with `stdout_bytes=0` during smoke validation.
- **NFR-P02**: Future launcher-parity updates must not add startup steps that materially lengthen the current Codex MCP bootstrap path.

### Security
- **NFR-S01**: No packet content may introduce secrets, fake environment values, or undocumented trust claims.
- **NFR-S02**: Broader follow-up work must continue to treat caller-controlled identity and provider-error leakage as open remediation topics, not closed assumptions.

### Reliability
- **NFR-R01**: Packet-local documentation must remain template-compliant so resume flows can rely on it.
- **NFR-R02**: Backlog tasks must map to real files or review findings so the next implementation wave is auditable.

---

## 8. EDGE CASES

### Data Boundaries
- Empty or missing user-home DB path: future work must keep the writable-path assumption explicit and testable.
- Numeric packet leaves such as `003/100` folder chains: the packet must continue to treat those as valid spec packets in the recorded caveat fix.

### Error Scenarios
- Startup scan emits structured contamination-audit logs during initialize: packet must preserve the stderr-only transport requirement.
- A later refactor removes the public `SPEC_DOCUMENT_FILENAMES` export again: targeted spec-doc indexing tests should catch the regression.

### State Transitions
- The Codex startup slice stays green while broader remediation remains open: packet must avoid collapsing these two truths into one status line.
- A future implementation wave grows beyond focused Codex MCP remediation: `tasks.md` must call out when a new numbered packet should be opened instead of overloading `024`.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Retroactive packet creation plus cross-packet backlog mapping across runtime, config, tests, and docs |
| Risk | 16/25 | Startup reliability, transport safety, launcher drift, and release-control truthfulness |
| Research | 10/20 | Requires prior failure analysis, caveat investigation, and canonical review alignment |
| Multi-Agent | 6/15 | Multiple workstreams, but this turn remains single-agent packet creation |
| Coordination | 11/15 | Depends on `020`, Codex config surfaces, and future runtime follow-up sequencing |
| **Total** | **61/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Packet status is misread as broader release readiness | High | Medium | Repeat narrow-slice wording in spec, checklist, and summary |
| R-002 | Launcher parity drifts and Codex regresses later | High | Medium | Keep config surfaces grouped in backlog tasks and future verification gates |
| R-003 | Broader remediation grows beyond focused scope and overloads `024` | Medium | Medium | Add an explicit task to open a new packet if scope escapes Codex MCP remediation |

---

## 11. USER STORIES

### US-001: Reliable Codex Startup (Priority: P0)

**As a** Codex operator, **I want** `spec_kit_memory` to initialize cleanly, **so that** memory commands work without MCP handshake failure.

**Acceptance Criteria**:
1. Given the Codex launcher configuration, when the MCP server starts, then it uses a writable home DB path instead of a repo-local write target.
2. Given startup scans emit structured diagnostics, when the server initializes, then stdout remains reserved for MCP protocol output.

---

### US-002: Truthful Remediation Tracking (Priority: P1)

**As a** system-spec-kit maintainer, **I want** the landed Codex fix separated from the broader unresolved remediation work, **so that** future sessions can resume from a precise packet instead of re-deriving scope.

**Acceptance Criteria**:
1. Given the new `024` packet, when a future session resumes, then it can see what is already green and what remains pending.
2. Given `020` still holds the broader remediation verdict, when reading `024`, then the packet points back to `020` instead of replacing it.

---

### US-003: Actionable Broader Backlog (Priority: P1)

**As a** reviewer or implementer, **I want** concrete broader-remediation tasks tied to real files and findings, **so that** the next implementation wave can start immediately.

**Acceptance Criteria**:
1. Given `tasks.md`, when selecting the next work item, then runtime, docs, and release-control follow-ups are clearly separated.
2. Given the backlog grows, when the scope no longer fits a focused Codex packet, then the packet already flags that a new numbered phase may be needed.

---

## 12. OPEN QUESTIONS

- Should the next runtime implementation stay in `024`, or should the first non-trivial post-Codex wave open `025` to keep this packet focused?
- Do we want future Codex-specific launcher documentation changes handled here, or kept in a separate docs-only packet if runtime behavior is already stable?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Broader Remediation Source**: `../020-pre-release-remediation/spec.md`
- **Canonical Review**: `../020-pre-release-remediation/review/review-report.md`
- **Ground Truth Follow-on**: `../021-ground-truth-id-remapping/spec.md`
- **Spec-Doc Indexing Context**: `../022-spec-doc-indexing-bypass/spec.md`

---
