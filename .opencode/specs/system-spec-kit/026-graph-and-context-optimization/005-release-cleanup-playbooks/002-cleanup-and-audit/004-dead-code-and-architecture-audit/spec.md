---
title: "Feature Specification: 018 / 013 — dead code and architecture audit"
description: "Audit and clean the active system-spec-kit runtime after the canonical continuity refactor so dead code, stale architecture docs, and README coverage gaps are removed with full verification."
trigger_phrases: ["013 spec", "dead code audit", "architecture audit", "readme audit", "canonical continuity cleanup"]
importance_tier: "critical"
contextType: "implementation"
status: "complete"
level: 3
parent: "008-cleanup-and-audit"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-release-cleanup-playbooks/002-cleanup-and-audit/004-dead-code-and-architecture-audit"
    last_updated_at: "2026-04-12T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Closed the dead code and architecture audit"
    next_safe_action: "Review packet"
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "decision-record.md", "implementation-summary.md"]
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: 018 / 013 — dead code and architecture audit

---

## EXECUTIVE SUMMARY

Phases 010-012 changed the canonical continuity runtime quickly enough that the active `system-spec-kit` code accumulated dead imports, stale helper paths, outdated architecture descriptions, and missing per-directory README coverage. This phase removes that ballast, rewrites the package architecture narrative around the current runtime, refreshes the legacy 006 resource map, and closes with compiler, typecheck, test, grep, cycle, and strict packet validation evidence.

**Key Decisions**: delete dead code instead of marking it deprecated; treat structured stderr logging as the production runtime standard; keep the audit focused on runtime code plus the explicitly requested packet and shared docs.

**Critical Dependencies**: the `mcp_server` and `scripts` workspaces, the package architecture document, the legacy 006 resource map, targeted Vitest suites, and the packet validator.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-04-12 |
| **Branch** | `system-speckit/026-graph-and-context-optimization` |
| **Parent Metadata** | `../graph-metadata.json` |
| **Parent Description** | `../description.json` |
| **Predecessor** | `012-mcp-config-and-feature-flag-cleanup` |
| **Successor** | `014-playbook-prompt-rewrite` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The canonical continuity refactor removed large legacy surfaces, introduced new routing and resume modules, and shifted packet behavior toward canonical spec docs. The runtime kept working, but the surrounding code and docs were no longer uniformly clean: unused imports survived, dead compatibility helpers remained, raw runtime logging still existed in parts of the save pipeline, the architecture doc no longer matched the code layout, and many new source directories still lacked README coverage.

### Purpose

Bring the active `system-spec-kit` runtime back to a trustworthy current state by deleting dead code, confirming there are no surviving concept branches for removed rollout ideas, aligning the architecture document with reality, completing source README coverage, refreshing the legacy 006 resource map, and attaching full verification evidence to the phase packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Runtime cleanup in `.opencode/skill/system-spec-kit/mcp_server/` and `.opencode/skill/system-spec-kit/scripts/`
- Dead import, dead local, dead helper, and dead concept cleanup
- Production runtime logging cleanup for active save-path modules
- Architecture and README alignment for the active package
- Refresh of the legacy 006 resource map
- Packet-local closeout docs and strict validation

### Out of Scope

- New feature implementation beyond cleanup and alignment
- Broader doc fanout outside the requested shared docs
- Tests-only or README-example stdout conventions

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/**` | Modify | Remove dead imports/helpers and verify runtime layering |
| `.opencode/skill/system-spec-kit/scripts/**` | Modify | Remove dead imports/helpers and replace raw runtime logging in the save path |
| `.opencode/skill/system-spec-kit/ARCHITECTURE.md` | Rewrite | Match the current package topology and runtime flows |
| `.opencode/skill/system-spec-kit/mcp_server/**/README.md` | Create/verify | Complete README coverage for active source directories |
| `../../003-continuity-refactor-gates/resource-map.md` | Rewrite | Reflect the current legacy-006 runtime ownership after the packet promotion |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md` | Update | Record implementation and verification evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Unused imports and dead locals are removed from the active runtime | Both workspaces pass compiler sweeps with `--noUnusedLocals --noUnusedParameters` |
| REQ-002 | Removed continuity-era concept branches do not survive in active code | Active-source grep for `shadow_only`, `dual_write`, `archived_hit_rate`, and `observation_window` returns no matches |
| REQ-003 | Production runtime paths do not emit raw `console.log` | Scoped grep across handlers, libs, and the save pipeline returns doc-only matches |
| REQ-004 | The architecture narrative matches the live runtime | The package architecture doc is rewritten around the current resume, routing, merge, search, graph, feedback, and coverage surfaces |
| REQ-005 | Strict packet validation passes | `validate.sh --strict` exits 0 on this packet |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | README coverage is complete for source directories that require it | Source-only README inventory returns no missing directories |
| REQ-007 | Handler cycles and architecture boundaries remain clean | Cycle and boundary checks exit 0 |
| REQ-008 | Both workspace typechecks pass | `npm run --workspace=@spec-kit/mcp-server typecheck` and `npm run --workspace=@spec-kit/scripts typecheck` exit 0 |
| REQ-009 | Affected tests pass | Targeted runtime and scripts Vitest suites exit 0 |
| REQ-010 | The legacy 006 resource map reflects current reality | The resource map no longer lists deleted shared-memory-era surfaces and now covers the active runtime |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: **Given** the runtime workspaces are scanned for unused symbols, **then** both compiler sweeps pass with no unused locals or parameters.
- **SC-002**: **Given** the active source tree is searched for removed continuity-era concepts, **then** no active-code matches remain.
- **SC-003**: **Given** production runtime paths are searched for raw stdout logging, **then** only documentation examples or standalone utility scripts remain outside scope.
- **SC-004**: **Given** the package architecture doc is read after the rewrite, **then** it describes the current resume, routing, merge, and save-path runtime correctly.
- **SC-005**: **Given** the source README inventory is rerun, **then** no qualifying source directory is missing README coverage.
- **SC-006**: **Given** final verification is run, **then** workspace typechecks, targeted tests, cycle checks, boundary checks, and strict packet validation all pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Conservative orphan-file scans over-report entrypoints and CLI helpers | Medium | Record triage results instead of deleting files without proof |
| Risk | Logging cleanup accidentally changes intended stdout behavior in standalone tools | Medium | Limit structured logging replacement to production runtime modules |
| Dependency | Workspace compiler and typecheck commands | High | Use them as the primary dead-code safety gate |
| Dependency | Cycle and architecture boundary scripts | High | Use them before claiming architecture clean |
| Dependency | Parent resource map | Medium | Rewrite it to current reality before closeout |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The cleanup must not add measurable overhead to normal save, search, or resume flows.

### Security
- **NFR-S01**: Production runtime diagnostics stay on structured stderr logging so stdout remains safe for machine-facing flows.

### Reliability
- **NFR-R01**: The cleanup must preserve existing runtime behavior while removing dead code.

### Maintainability
- **NFR-M01**: Source directories that matter operationally must have local README coverage and a package-level architecture document that matches reality.

---

## 8. EDGE CASES

### Data Boundaries
- Runtime code paths that only appear in tests or README examples are not treated as production logging violations.
- Entry modules and direct CLI tools are not deleted just because a conservative orphan scan cannot prove reachability.

### Error Scenarios
- If typecheck or tests fail after a cleanup edit, the fix must happen before closeout.
- If the packet validator reports template drift, the packet docs must be normalized before completion.

### State Transitions
- Packet docs start as planned and close as complete only after all verification gates pass.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 19/25 | Runtime cleanup plus architecture, README, and packet alignment |
| Risk | 18/25 | Incorrect cleanup could break save, search, or resume behavior |
| Research | 12/20 | Requires code and doc reality checks rather than new design research |
| Multi-Agent | 6/15 | Multiple independent audit buckets but one runtime family |
| Coordination | 9/15 | Shared docs and packet evidence must stay synchronized |
| **Total** | **64/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Dead-code cleanup removes a still-needed helper | H | M | Use compiler, typecheck, and affected tests after edits |
| R-002 | Architecture doc remains stale after runtime cleanup | M | M | Rewrite from representative live module reads rather than patching old prose |
| R-003 | README coverage misses newly added Phase 006 directories | M | M | Run a source-only directory inventory after README creation |
| R-004 | Packet evidence drifts from actual verification | H | L | Record command evidence only after the commands succeed |

---

## 11. USER STORIES

### US-001: Runtime Maintainer (Priority: P0)

**As a** runtime maintainer, **I want** dead code removed from the active workspaces, **so that** future changes are made against a smaller and more trustworthy codebase.

**Acceptance Criteria**:
1. **Given** the workspaces are scanned, **when** cleanup completes, **then** the unused-symbol compiler sweeps pass.

---

### US-002: Operator Resuming Work (Priority: P1)

**As a** packet operator, **I want** the package architecture and local READMEs to match the live runtime, **so that** I can navigate the post-refactor system without relying on stale docs.

**Acceptance Criteria**:
1. **Given** the architecture and README pass completes, **when** the docs are reread, **then** they describe the current runtime and directory contents accurately.

---

### US-003: Release Gate Owner (Priority: P1)

**As a** release gate owner, **I want** the audit packet to close with attached verification evidence, **so that** cleanup claims are backed by compiler, test, and validator output.

**Acceptance Criteria**:
1. **Given** the packet is marked complete, **when** the implementation summary is reviewed, **then** it contains the final command evidence.

---

## 12. OPEN QUESTIONS

- None. The phase is an implementation and verification audit, not an open design exploration.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
