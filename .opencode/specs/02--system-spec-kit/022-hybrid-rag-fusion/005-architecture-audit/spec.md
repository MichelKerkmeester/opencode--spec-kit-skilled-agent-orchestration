---
title: "Feature Specification: Architecture Audit [02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/spec]"
description: "Audit and remediate ownership boundaries between root scripts (build-time and CLI tooling) and mcp_server (runtime MCP server), including merged follow-up boundary remediation work from former spec 030."
trigger_phrases:
  - "architecture audit"
  - "scripts boundary"
  - "mcp server boundary"
  - "boundary enforcement"
  - "handler cycle removal"
importance_tier: "critical"
contextType: "decision"
---
# Feature Specification: Architecture Audit

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

This completed Level 3 spec captures the architecture audit of `.opencode/skill/system-spec-kit/` with focus on the ownership boundary between root `scripts/` and `mcp_server/`. The work established a boundary contract, reduced cross-area drift, hardened enforcement, merged the former `030-architecture-boundary-remediation` follow-up, and closed later verification-driven issues around naming, README coverage, symlinked runtime paths, and source-dist alignment.

**Key Decisions**: adopt an API-first boundary for cross-area consumers, consolidate duplicate helpers into shared modules, break handler cycles with focused local utilities, and enforce the contract with layered checks rather than documentation alone.

**Critical Dependencies**: `decision-record.md`, `research/research.md`, import-policy enforcement scripts, and the audit evidence preserved under `scratch/` and `memory/`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-03-04 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../004-ux-hooks-automation/spec.md |
| **Successor** | ../006-feature-catalog/spec.md |
---

<!-- ANCHOR:problem -->
<!-- /ANCHOR:metadata -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The codebase had blurred ownership between build-time and CLI tooling in root `scripts/` and runtime concerns in `mcp_server/`. Cross-boundary imports, duplicated helper logic, incomplete contract documentation, weak enforcement, and handler-level dependency cycles made architecture drift easy to introduce and difficult to detect.

### Purpose
Define the boundary contract clearly, remediate the highest-risk violations, automate enforcement where possible, and document the final architecture state as a completed standalone audit.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Boundary contract and ownership documentation for `scripts/`, `mcp_server/`, and `shared/`
- API-first routing for supported cross-boundary consumption
- Import-policy enforcement and allowlist governance hardening
- Structural cleanup, including shared-helper consolidation and handler-cycle elimination
- Merged follow-up remediation from former spec `030-architecture-boundary-remediation`
- Verification-driven follow-up work discovered during audit closure, including naming, routing, README, symlink, and source-dist alignment fixes

### Out of Scope
- ESM module compliance work tracked separately in spec `023-esm-module-compliance`
- Unrelated feature development outside architecture-boundary and audit-driven remediation scope
- Rewriting historical scratch and memory evidence

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Restore | Standalone completed architecture-audit spec |
| `plan.md` | Restore | Completed audit phase map and implementation plan |
| `tasks.md` | Restore | Architecture-audit task map and recovered ranges |
| `checklist.md` | Restore | Architecture-audit verification checklist |
| `implementation-summary.md` | Restore | Completed audit summary without coordination overlay |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Boundary contract is documented and discoverable | Readers can identify supported ownership for `scripts/`, `mcp_server/`, and `shared/` without following stale phase links |
| REQ-002 | Cross-boundary consumption uses governed entry points | Unsupported direct imports are blocked or explicitly allowlisted with review metadata |
| REQ-003 | Structural drift is reduced in core runtime/script seams | Duplicate helpers are consolidated and the documented handler cycle is removed |
| REQ-004 | Boundary remediation from former spec `030` is absorbed into this spec | Carry-over work is represented as completed architecture-audit scope rather than as a sibling spec |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Enforcement is automated, not only documented | Import-policy and related boundary checks run in normal validation workflows |
| REQ-006 | Verification-driven follow-up work is captured honestly | Later naming, routing, README, symlink, and source-dist fixes are represented as completed audit follow-up work |
| REQ-007 | Root docs read as a completed standalone spec | No stale parent-coordination or child-phase routing language remains in the restored root docs |
| REQ-008 | Supporting evidence remains traceable | Readers can follow decisions and research through `decision-record.md`, `research/research.md`, `scratch/`, and `memory/` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Ownership boundaries between root scripts and `mcp_server` are explicit and enforceable.
- **SC-002**: Known cross-boundary architectural issues called out by the audit are remediated or governed.
- **SC-003**: The merged boundary-remediation follow-up from former spec `030` is represented as completed work inside this audit.
- **SC-004**: The root doc set reads as one completed architecture audit, not as a coordination wrapper.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Boundary contract docs and ADRs | Readers need policy plus rationale | Keep `decision-record.md` and architecture docs aligned |
| Risk | Allowlist or tooling drift can weaken enforcement claims | Medium | Keep checks in standard validation flows and re-verify evidence periodically |
| Risk | Follow-up bug-fix phases can blur original audit scope | Medium | Preserve them as audit-driven closure work, not as unrelated feature work |
| Risk | Historical root prose was overwritten by the later coordination rewrite | Medium | Restore accurate standalone summaries and avoid inventing unrecoverable detail |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
<!-- ANCHOR:requirements -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Boundary checks must be fast enough to remain part of routine validation.

### Security
- **NFR-S01**: Boundary hardening must not weaken runtime isolation or permission assumptions.

### Reliability
- **NFR-R01**: Verification should catch new cross-boundary regressions before they become default behavior.
- **NFR-R02**: Source-of-truth docs and enforcement scripts should remain synchronized enough for maintainers to trust the contract.

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Transitional wrappers may still exist, but canonical ownership remains with the documented primary surface.
- Shared helpers may serve both build-time and runtime code, but must stay neutral and not back-import area-specific internals.

### Error Scenarios
- A script imports private runtime internals directly: the contract should route it through `api/*` or an explicit allowlist review.
- A helper extraction breaks locality or creates a new cycle: keep handler utilities narrowly scoped and re-run cycle checks.
- Documentation says a boundary exists but automation does not enforce it: treat this as incomplete, not finished.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Assessment | Notes |
|-----------|------------|-------|
| Scope | High | Multi-phase audit spanning documentation, code cleanup, and enforcement |
| Risk | High | Cross-boundary contracts, migration pressure, and later verification regressions |
| Research | High | Deep audit evidence, cross-AI review, and merged follow-up scope |
| Multi-Agent | High | Prior audit waves and review synthesis informed the work |
| Coordination | High | Scope expanded across merged and verification-driven follow-up work |

Archived review notes scored the completed audit at **87/100**, which remains a fair summary of its Level 3 complexity and scope evolution.

<!-- /ANCHOR:complexity -->
---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Boundary docs and enforcement drift apart | H | M | Periodic audit plus checklist evidence refresh |
| R-002 | New helper sharing recreates hidden cycles | M | M | Keep shared modules neutral and cycle checks active |
| R-003 | Transitional wrappers outlive their intended role | M | M | Keep ADR-backed governance and canonical runbook ownership |
| R-004 | Later audit follow-ups are misread as separate workstreams | M | L | Document them as completed audit-closure work in the root summaries |

---

## 11. USER STORIES

### US-001: Architecture Maintainer (Priority: P0)

**As a** maintainer, **I want** clear ownership boundaries between `scripts` and `mcp_server`, **so that** runtime refactors do not silently break tooling workflows.

### US-002: New Contributor (Priority: P1)

**As a** contributor, **I want** discoverable boundary docs and READMEs, **so that** I can locate the correct module without reading hidden implementation history.

### US-003: Tooling Owner (Priority: P1)

**As a** tooling owner, **I want** automated import and structure checks, **so that** new boundary violations fail fast instead of becoming tribal knowledge.

### Acceptance Scenarios

1. **Given** a scripts consumer needs runtime functionality, **when** the maintainer checks the boundary contract, **then** the supported API path is explicit and discoverable.
2. **Given** a direct `scripts -> lib/*` import is introduced, **when** enforcement runs, **then** the check fails or requires an explicit allowlisted exception.
3. **Given** duplicate helper logic exists across scripts and runtime modules, **when** consolidation work lands, **then** both call sites use the shared implementation rather than private copies.
4. **Given** handler-level utility cycles are present, **when** the structural cleanup completes, **then** the documented cycle is removed without changing the ownership contract.
5. **Given** transitional wrapper entry points still exist, **when** a maintainer reads the README surfaces, **then** the canonical runbook ownership points to the root scripts docs.
6. **Given** later audit follow-up work closes naming, symlink, or source-dist drift, **when** the packet is reviewed, **then** those closures are represented as completed audit addenda rather than separate feature work.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None for this restored standalone spec. The audit is complete; remaining work is future maintenance, not unresolved restructuring.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Decision Records**: See `decision-record.md`
- **Research**: See `research/research.md`
- **Evidence**: See `scratch/` and `memory/`

---

**Navigation & Traceability**

- **Parent**: `022-hybrid-rag-fusion`
- **Scope**: Architecture audit of the Spec Kit Memory MCP server
- **Upstream**: Root 022 coordination packet
- **Downstream**: Implementation packages in `mcp_server/`, `scripts/`, and `shared/`
- **Current MCP server surface**: `api/`, `core/`, `configs/`, `formatters/`, `handlers/`, `hooks/`, `lib/`, `schemas/`, `shared/`, `shared-spaces/`, `tools/`, and `utils/`
- **Current `lib/` runtime domains**: `search/` plus `architecture/`, `cache/`, `chunking/`, `cognitive/`, `collab/`, `config/`, `contracts/`, `errors/`, `eval/`, `extraction/`, `feedback/`, `governance/`, `graph/`, `interfaces/`, `learning/`, `manage/`, `ops/`, `parsing/`, `providers/`, `response/`, `scoring/`, `session/`, `spec/`, `storage/`, `telemetry/`, `utils/`, and `validation/`
