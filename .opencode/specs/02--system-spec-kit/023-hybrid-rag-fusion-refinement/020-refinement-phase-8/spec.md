---
title: "Feature Specification: System-Spec-Kit Scripts vs mcp_server Architecture Audit [template:level_3/spec.md]"
description: "Audit and clarify ownership boundaries between root scripts (build-time and CLI tooling) and mcp_server (runtime MCP server), with concrete reorganization recommendations and risk assessment."
SPECKIT_TEMPLATE_SOURCE: "spec-core + level2-verify + level3-arch | v2.2"
trigger_phrases:
  - "architecture audit"
  - "mcp server boundary"
  - "scripts boundary"
  - "concern separation"
  - "phase 8 refinement"
importance_tier: "critical"
contextType: "architecture"
---
# Feature Specification: System-Spec-Kit Scripts vs mcp_server Architecture Audit

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

## EXECUTIVE SUMMARY

This phase performs a full architecture audit of `.opencode/skill/system-spec-kit/` with specific focus on the boundary between root `scripts/` and `mcp_server/`. The audit confirms overlapping concerns in memory/index/eval/tooling, partial boundary enforcement, and concrete dependency-direction risks that should be addressed with documentation and guardrails first, then selective refactoring.

**Key Decisions**: Define a strict runtime-vs-CLI boundary contract; use API-first imports for cross-boundary consumers.

**Critical Dependencies**: Boundary documentation, import-policy enforcement, and cycle reduction in handler orchestration.

## 1. METADATA
<!-- ANCHOR:metadata -->

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-03-04 |
| **Branch** | `023-hybrid-rag-fusion-refinement/020-refinement-phase-8` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The current code organization mixes concerns across two major areas:
- Root skill workspace (`scripts/`, `shared/`, templates/references/config) that contains build-time and CLI workflows.
- Runtime MCP server (`mcp_server/`) that serves tool requests at runtime.

The audit baseline found:
- `scripts/` + root-level sources: **152** source files.
- `mcp_server/` sources: **431** source files.
- Known overlap and coupling in memory/index/eval logic, including direct `scripts` imports from `@spec-kit/mcp-server/lib/*` and a compatibility wrapper back-edge via `mcp_server/scripts/reindex-embeddings.ts`.

### Purpose
Produce a complete inventory, evaluate architecture quality with evidence, and define actionable reorganization recommendations that improve separation, discoverability, and long-term maintainability.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Full tree inventory for:
  - `.opencode/skill/system-spec-kit/` (all depths, excluding `node_modules/`, `dist/`)
  - `.opencode/skill/system-spec-kit/mcp_server/` (all depths, excluding `node_modules/`, `dist/`)
- Per-source-file inventory for `.ts`, `.js`, `.mjs`, `.cjs`, `.sh` in both target areas.
- README and config relationship inventory.
- Architecture evaluation across 6 criteria.
- Reorganization recommendations with effort/risk/impact.

### Out of Scope
- Implementing the full refactor in this phase.
- Behavior changes to MCP runtime tools.
- Non-boundary feature additions.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/020-refinement-phase-8/spec.md` | Update | Level 3 audit specification |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/020-refinement-phase-8/plan.md` | Update | Reorganization implementation plan |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/020-refinement-phase-8/tasks.md` | Update | Atomic task map |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/020-refinement-phase-8/checklist.md` | Create | P0/P1/P2 architecture verification checklist |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/020-refinement-phase-8/decision-record.md` | Create | ADRs for boundary, compatibility, and consolidation |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/020-refinement-phase-8/scratch/agent1-root-tree-readme-config.md` | Existing evidence | Complete root tree/readme/config inventory |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/020-refinement-phase-8/scratch/agent2-mcp-tree-readme-config.md` | Existing evidence | Complete mcp_server tree/readme/config inventory |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/020-refinement-phase-8/scratch/agent3-root-source-inventory.md` | Existing evidence | Per-file root source mapping |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/020-refinement-phase-8/scratch/agent4-mcp-source-inventory.md` | Existing evidence | Per-file mcp source mapping |
| `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/020-refinement-phase-8/scratch/agent5-architecture-analysis.md` | Existing evidence | Cross-boundary architecture findings |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Complete source-file accounting across both scopes | Counts match filesystem scan: 152 root-scripts scope, 431 mcp scope |
| REQ-002 | Boundary classification runtime vs build/CLI is explicit | Documentation contains explicit belongs-here / does-not-belong-here matrix |
| REQ-003 | Six evaluation criteria scored with evidence | Ratings table includes files/directories per criterion |
| REQ-004 | Recommendations include WHY before WHAT with concrete paths | Each recommendation includes source/destination or target path and rationale |
| REQ-005 | Level 3 docs exist in this spec folder | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md` present |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | README coverage assessed | README inventory includes scope statement and gaps |
| REQ-007 | Config relationships documented | package/tsconfig/eslint relationships captured with evidence |
| REQ-008 | Dependency-direction concerns identified | Circular and cross-layer concerns listed with concrete file paths |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every source file in scope is represented in inventory artifacts.
- **SC-002**: A new maintainer can distinguish runtime MCP concerns from build/CLI concerns without reading most source code.
- **SC-003**: Recommendations are prioritized by impact-to-effort and actionable without additional discovery work.
- **SC-004**: Documentation is fully contained in this phase folder and no longer uses `mcp_server/specs/`.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Refactor scope expansion while fixing boundaries | Delays and regressions | Phase work: docs and policy first, code refactors second |
| Risk | Compatibility wrapper removal too early | Operational breakage | Keep wrapper as transitional path with explicit deprecation policy |
| Dependency | Accurate import graph for scripts and handlers | Incomplete recommendations | Use per-file inventory + cycle evidence before code changes |
| Dependency | Team alignment on API-first policy | Drift in future imports | Add automated guardrail in CI/lint pipeline |
<!-- /ANCHOR:risks -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Policy checks introduced by recommendations should not add more than 10% to lint/check time.

### Reliability
- **NFR-R01**: Compatibility operational flows (reindex) remain runnable during migration.

### Maintainability
- **NFR-M01**: Ownership boundaries must be documented at canonical locations and linked from both code areas.

## 8. EDGE CASES

- Partial migration with temporary exceptions.
- Mixed import style (`api/*` and `lib/*`) during transition.
- Handler cycle reduction that accidentally alters ordering in save/link workflows.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 24/25 | 500+ files inventoried, two major code areas |
| Risk | 20/25 | Cross-boundary contracts, cycle risk, migration complexity |
| Research | 18/20 | Full tree/source/readme/config mapping and dependency tracing |
| Multi-Agent | 12/15 | Parallel inventory streams and synthesis |
| Coordination | 13/15 | Documentation, policy, and architecture alignment |
| **Total** | **87/100** | **Level 3** |

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Boundary policy not enforced in code checks | High | Medium | Add explicit check for forbidden `@spec-kit/mcp-server/lib/*` imports in scripts |
| R-002 | Duplicate helper consolidation changes behavior | Medium | Medium | Add parity tests and staged migration |
| R-003 | Cycle break in handlers introduces regressions | High | Medium | Extract minimal shared orchestration and verify call order paths |

## 11. USER STORIES

### US-001: Architecture Maintainer (P0)
As a maintainer, I need clear ownership boundaries between `scripts` and `mcp_server` so I can change one without accidental breakage in the other.

### US-002: New Contributor (P1)
As a new contributor, I need discoverable directory and README structure so I can find the right module quickly.

### US-003: Tooling Owner (P1)
As a tooling owner, I need enforceable import policies so boundary violations are caught automatically.

## 12. OPEN QUESTIONS

- Should compatibility wrappers in `mcp_server/scripts/` be renamed now or only retitled during transition?
- Should API-first migration be strict immediately, or staged with an allowlist expiry window?

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Records**: `decision-record.md`

---

## Phase Navigation

| **Parent Spec** | ../spec.md |
- Predecessor: `019-sprint-9-extra-features`

## Acceptance Scenarios (Validator Coverage)
1. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
2. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
3. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
4. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
5. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
6. **Given** the existing documented scope is retained, **When** validation is run, **Then** structural checks pass without introducing new implementation claims.
