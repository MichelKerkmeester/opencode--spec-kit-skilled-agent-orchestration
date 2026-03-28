---
title: "Feature Specification: Codex Memory MCP Fix"
description: "Codex-facing spec_kit_memory reliability required both the earlier startup stabilization work and the newly landed DB-isolation fix that keeps initializeDb(':memory:') or custom-path connections from leaking fixture writes into the shared live DB. This packet records that narrow remediation slice, the verification evidence, and the remaining broader follow-on recommendations without rewriting the older 020 packet."
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

Codex-facing `spec_kit_memory` runtime reliability is now stable across the narrow slice owned by this packet: startup writes the SQLite database to a writable home path, structured logs stay on stderr, and `initializeDb(':memory:')` / custom-path test flows now promote their connection into the active shared DB state so later reads and writes stay isolated from the persistent live database. This packet records that landed remediation as a narrow green slice, then captures the remaining broader runtime, documentation, and release-control cleanup as explicit follow-on recommendations so future work does not keep stretching `020-pre-release-remediation`.

**Key Decisions**: Keep `024` as the focused packet instead of reopening `020`; treat the Codex startup fix, the vector-index-store DB-isolation fix, and the spec-doc indexing caveat fix as landed evidence; keep broader `022` remediation in later execution waves.

**Critical Dependencies**: `../020-pre-release-remediation/review/review-report.md`, Codex launcher config surfaces, `context-server` startup behavior, and packet-local validation.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-03-28 |
| **Branch** | `024-codex-memory-mcp-fix` |
| **Parent Spec** | `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/` |
| **Related Packets** | `020-pre-release-remediation`, `022-spec-doc-indexing-bypass`, `023-ablation-benchmark-integrity` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Codex could fail to initialize `spec_kit_memory` because the MCP server assumed it could create a SQLite database under the workspace and because startup-time structured logs could leak onto stdout during background memory scans. A second reliability gap also existed in the direct DB lifecycle helpers: tests that called `initializeDb(':memory:')` did not promote that in-memory connection into the shared default DB state used by later operations, so fixture writes could leak into the persistent live database.

That made the Codex-specific improvement hard to resume cleanly: the startup fix was real, the direct DB-isolation fix is now also landed, the follow-up caveat around spec-doc indexing tests was also fixed, but the remaining backlog still needed a dedicated packet that says what is already green and what is still pending.

### Purpose

Keep this Level 3 packet truthful by updating it to record the landed Codex `spec_kit_memory` remediation slice, including the runtime DB-isolation fix from this session, while preserving honest scope boundaries with `020` and carrying forward the broader unresolved remediation work as concrete follow-on recommendations.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Record the landed Codex startup remediation: writable home `MEMORY_DB_PATH` plus stderr-only structured logging for MCP transport safety.
- Record the landed DB-isolation remediation in `vector-index-store`: initializing a custom-path or `:memory:` DB now promotes that connection and DB path into the active shared state, and cached custom-path connections also become active.
- Record the follow-up caveat fix: numeric spec-leaf path matching, `SPEC_DOCUMENT_FILENAMES` public re-export, and modularization-threshold drift correction.
- Create a new numbered packet under `022-hybrid-rag-fusion` so future Codex MCP work has its own execution and resume surface.
- Carry forward the most relevant broader remediation recommendations from `020` for runtime hardening, docs truth-sync, and release-control follow-up.
- Close this packet as completed documentation while keeping the larger `022` remediation program outside its completion gate.

### Out of Scope

- Declaring the full `022-hybrid-rag-fusion` tree release-ready.
- Rewriting the canonical review packet inside `../020-pre-release-remediation/review/`.
- Closing unrelated `020` remediation items that were not part of the Codex MCP startup slice.
- Performing unrelated broader runtime, docs, or release-control implementation beyond this narrow Codex/spec_kit_memory slice.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/024-codex-memory-mcp-fix/README.md` | Update | Packet overview and quick navigation now include the landed DB-isolation fix |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/024-codex-memory-mcp-fix/spec.md` | Update | Scope, requirements, risk model, and user stories reflect the runtime fix truthfully |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/024-codex-memory-mcp-fix/plan.md` | Update | Execution plan and verification strategy sync to the landed runtime fix |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/024-codex-memory-mcp-fix/tasks.md` | Update | Completed items and remaining follow-on capture stay truthful |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/024-codex-memory-mcp-fix/checklist.md` | Update | Packet-local completion and verification evidence reflect the new runtime fix |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/024-codex-memory-mcp-fix/decision-record.md` | Update | ADR stays aligned to the current narrow remediation slice |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/024-codex-memory-mcp-fix/implementation-summary.md` | Update | Truthful summary of the landed runtime fix plus packet truth-sync |
| `.opencode/skill/system-spec-kit/scripts/utils/logger.ts` | Reference | Landed stderr-only structured logging fix tracked by this packet |
| `opencode.json`, `.mcp.json`, `.codex/config.toml`, `.claude/mcp.json`, `.vscode/mcp.json`, `.gemini/settings.json` | Reference | Landed writable home DB-path alignment across launcher surfaces |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/vector-index-store-remediation.vitest.ts` | Reference | Landed DB-isolation remediation and regression coverage for `initializeDb(':memory:')` / custom-path flows |
| `.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts`, `.opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/modularization.vitest.ts` | Reference | Landed caveat-fix surfaces that keep the remediation slice green |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The `024` packet explicitly records the real Codex failure causes and the landed narrow fixes. | `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md` all describe the writable home DB-path fix, stderr transport fix, and DB-isolation fix consistently. |
| REQ-002 | The packet distinguishes between the landed Codex startup slice and the still-open broader `022` remediation work. | Packet text states the Codex slice is green while the broader remediation verdict remains open in `020`. |
| REQ-003 | The packet captures the follow-up spec-doc indexing caveat fix as part of the same remediation narrative. | The spec and tasks mention numeric spec-leaf path matching, the `SPEC_DOCUMENT_FILENAMES` re-export, and the modularization threshold update. |
| REQ-004 | The packet must provide a concrete broader-remediation follow-on capture instead of vague future-work notes. | `tasks.md` includes named later-wave recommendations for runtime hardening, docs truth-sync, and release-control follow-up. |
| REQ-005 | The packet must validate locally with no template drift or placeholder leftovers. | `validate.sh <packet> --no-recursive` exits cleanly. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | `description.json` is present and aligned to the new packet slug and parent chain. | JSON parses and points at `02--system-spec-kit/022-hybrid-rag-fusion/024-codex-memory-mcp-fix`. |
| REQ-007 | The packet explains why a new numbered folder is better than expanding `020`. | `decision-record.md` records the alternative and rationale. |
| REQ-008 | The packet links back to `020-pre-release-remediation` as the broader source of truth for unresolved findings. | Cross-references are present in README/spec/tasks/checklist. |
| REQ-009 | The implementation summary stays honest about what landed in runtime code versus what remains open. | `implementation-summary.md` explicitly names the landed DB-isolation fix, the verification results, and the still-open broader follow-on work. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `024-codex-memory-mcp-fix` exists with completed Level 3 packet files and packet-local validation passes.
- **SC-002**: The packet provides a clear resume point for future Codex MCP work by separating landed evidence from recorded follow-on recommendations.
- **SC-003**: The packet captures the startup remediation, the DB-isolation remediation, and the caveat fix without claiming the entire `022` remediation program is done.
- **SC-004**: Broader remediation recommendations are concrete enough that a later implementation wave can start from `tasks.md` without re-discovering scope.

### Acceptance Scenarios

**Given** a future Codex session, **when** it opens this packet first, **then** it can see that the startup slice is green without misreading the entire `022` program as complete.

**Given** a maintainer reviews launcher configuration drift, **when** they check the backlog here, **then** the writable-home `MEMORY_DB_PATH` surfaces are already named.

**Given** startup logging changes in the future, **when** the packet is used for resume context, **then** stderr-only transport safety is still called out as a hard expectation.

**Given** tests initialize `:memory:` or custom-path SQLite state, **when** later vector-index operations use the shared default DB helpers, **then** the packet records that those operations must stay inside the promoted active connection instead of leaking into the persistent live DB.

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
| Dependency | Codex and sibling launcher configs stay aligned on `MEMORY_DB_PATH` | Future drift could reintroduce client-specific startup failures | Track launcher parity as an explicit follow-on item in `tasks.md` |
| Risk | This new packet could be mistaken for a release-ready verdict change | Teams might overstate the health of the broader remediation program | Repeat in spec, checklist, and summary that only the Codex startup slice is green |
| Risk | Future runtime changes can stale the retroactive evidence captured here | Packet could age into historical-only prose | Require future implementation waves to refresh tests and startup smoke evidence before closing later-wave follow-on items |
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
- **NFR-R02**: Follow-on recommendations must map to real files or review findings so the next implementation wave is auditable.
- **NFR-R03**: Direct DB lifecycle helpers must keep `initializeDb(':memory:')` and custom-path flows isolated by promoting the active shared connection and DB path before later default reads or writes occur.

---

## 8. EDGE CASES

### Data Boundaries
- Empty or missing user-home DB path: future work must keep the writable-path assumption explicit and testable.
- `:memory:` or custom-path test databases: direct lifecycle helpers must not leave the shared default DB pointing at the persistent live store after custom initialization.
- Numeric packet leaves such as `003/100` folder chains: the packet must continue to treat those as valid spec packets in the recorded caveat fix.

### Error Scenarios
- Startup scan emits structured contamination-audit logs during initialize: packet must preserve the stderr-only transport requirement.
- `initializeDb(':memory:')` seeds fixtures and later helpers call default reads or writes: packet must preserve the active-connection promotion fix so test data stays isolated.
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

### US-003: Actionable Broader Follow-On Capture (Priority: P1)

**As a** reviewer or implementer, **I want** concrete broader-remediation recommendations tied to real files and findings, **so that** the next implementation wave can start immediately.

**Acceptance Criteria**:
1. Given `tasks.md`, when selecting the next work item, then runtime, docs, and release-control follow-ups are clearly separated.
2. Given the backlog grows, when the scope no longer fits a focused Codex packet, then the packet already flags that a new numbered phase may be needed.

---

## 12. OPEN QUESTIONS

- Should the next runtime implementation open `025` if it grows beyond the focused Codex MCP slice? Current routing guidance says yes.
- Should a later docs-only truth-sync change use a dedicated docs packet if runtime behavior is already stable? Current routing guidance says yes.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Broader Remediation Source**: `../020-pre-release-remediation/spec.md`
- **Canonical Review**: `../020-pre-release-remediation/review/review-report.md`
- **Ground Truth Follow-on**: `../021-ground-truth-id-remapping/spec.md`
- **Spec-Doc Indexing Context**: `../022-spec-doc-indexing-bypass/spec.md`

---
