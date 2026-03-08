---
title: "SpecKit Quality and Standards"
status: "in-progress"
level: 3
created: "2025-12-01"
updated: "2026-03-08"
description: "Consolidated from spec.md (merged from the former templates phase) and spec.md (merged from former phase 008)."
SPECKIT_TEMPLATE_SOURCE: "spec-core + level2-verify + level3-arch | v2.2"
trigger_phrases:
  - "consolidated"
  - "003-speckit-quality-and-standards"
importance_tier: "important"
contextType: "implementation"
---
# Consolidated spec.md

This document consolidates source documents from:
- `spec.md (merged from the former templates phase)`
- `spec.md (merged from former phase 008)`

## Source: `spec.md (merged from the former templates phase)`

---
title: "Feature Specification: SpecKit Template ToC Policy Enforcement [spec.md (merged from the former templates phase)]"
description: "Level 2 documentation-only scope to enforce the policy that only research document may contain a ToC and to retro-clean non-research spec artifacts."
trigger_phrases:
  - "spec kit"
  - "templates"
  - "toc policy"
  - "retro cleanup"
SPECKIT_TEMPLATE_SOURCE: "spec-core + level2-verify | v2.2"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: SpecKit Template ToC Policy Enforcement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-02-22 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Spec-folder artifacts currently contain inconsistent Table of Contents sections in non-research documents, which violates the target policy and creates validation/doc-style drift. The target spec folder for this work is also empty and needs complete Level 2 documentation for traceability.

### Purpose
Deliver a documentation-only update that applies the ToC policy consistently and records the work in a complete Level 2 spec folder.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Populate this folder with Level 2 documentation files using system-spec-kit template structure.
- Remove ToC sections from non-research standard artifacts in the specified existing spec folders.
- Validate all affected folders with `validate.sh` and capture outcomes.

### Out of Scope
- Any code or script logic changes in skill tooling.
- Any edits to research documents.
- Any edits in `memory/`, `scratch/`, or `context/` subtrees.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md (merged from the former templates phase)` | Create | Level 2 specification for this doc-only change |
| `plan.md (merged from the former templates phase)` | Create | Implementation/verification plan |
| `tasks.md (merged from the former templates phase)` | Create | Task tracking for execution |
| `checklist.md (merged from the former templates phase)` | Create | Verification checklist with evidence |
| `implementation-summary.md (merged from the former templates phase)` | Create | Completion summary and outcomes |
| `.opencode/specs/03--commands-and-skills/sk-code/z_archive/013-sk-code-opencode-alignment-hardening{spec,plan,tasks,checklist,decision-record,implementation-summary}.md` | Modify | Remove disallowed ToC sections |
| `removed visual skill hardening docs` | Modify | Remove disallowed ToC sections |
| `.opencode/specs/03--commands-and-skills/sk-code/014-code-review-skill/{spec,plan,tasks,checklist}.md` | Modify | Remove disallowed ToC sections |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Create complete Level 2 docs in the historical templates phase | All required files exist and contain non-placeholder task-specific content |
| REQ-002 | Remove ToC sections from specified non-research artifacts | No `## TABLE OF CONTENTS` remains in the listed standard artifacts |
| REQ-003 | Preserve policy boundaries | No changes made to the research document, `memory/`, `scratch/`, or `context/` |
| REQ-004 | Validate affected folders | `validate.sh` runs for all four target folders and outcomes are recorded |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Provide concise completion report | Report includes changed files and per-folder validation outcomes |
| REQ-006 | Keep scope docs-only | Git diff includes markdown-only changes in scoped spec folders |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: New the historical templates phase folder contains `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`.
- **SC-002**: All listed offender files no longer include ToC sections.
- **SC-003**: All four requested `validate.sh` runs execute and outcomes are documented.
- **SC-004**: No out-of-scope file classes are modified.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing spec docs have varied header patterns | ToC removal may miss variants | Use targeted scan after edits for standard artifact filenames |
| Risk | Over-removal in markdown blocks | Could remove non-ToC content | Restrict removal to explicit ToC heading/list pattern only |
| Risk | Validation mismatch in legacy docs | Could report warnings/errors unrelated to ToC policy | Record outcomes transparently and avoid scope creep |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Documentation validation for each target folder completes in normal shell execution time.
- **NFR-P02**: ToC scan/check commands complete without manual post-processing.

### Security
- **NFR-S01**: No secrets or credentials introduced in documentation.
- **NFR-S02**: No filesystem changes outside scoped spec markdown files.

### Reliability
- **NFR-R01**: Re-running ToC scan on targeted standard artifacts returns no matches.
- **NFR-R02**: `validate.sh` results are reproducible from the recorded commands.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- `README.md` files under spec folders may still contain ToC and are out of this cleanup scope.
- the research document is explicitly allowed to contain ToC and must remain unchanged.

### Error Scenarios
- Validation script may return warnings for pre-existing content style issues unrelated to this policy.
- Some files contain `## 0. OVERVIEW` and section guides; these are retained unless they are actual ToC blocks.

### State Transitions
- Empty target folder transitions to complete Level 2 documentation set.
- Existing spec artifacts transition from mixed ToC usage to policy-compliant non-research format.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:acceptance-scenarios -->
## L2: ACCEPTANCE SCENARIOS

1. **Given** the empty the historical templates phase folder, **When** Level 2 docs are authored, **Then** `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` all exist with real content.
2. **Given** scoped standard artifacts in `039`, **When** ToC cleanup is applied, **Then** no `## TABLE OF CONTENTS` section remains in `spec/plan/tasks/checklist/decision-record/implementation-summary`.
3. **Given** scoped standard artifacts in `040` and `041`, **When** ToC cleanup is applied, **Then** no `## TABLE OF CONTENTS` section remains in the listed non-research standard artifacts.
4. **Given** the ToC policy exception for the research document, **When** cleanup runs, **Then** research documents remain untouched.
5. **Given** the four requested validation commands, **When** `validate.sh` is executed, **Then** each folder returns a recorded outcome for reporting.
<!-- /ANCHOR:acceptance-scenarios -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 20 markdown files touched across 4 spec folders |
| Risk | 9/25 | Low functional risk; moderate documentation consistency risk |
| Research | 8/20 | Required file-level scan and policy application checks |
| **Total** | **35/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

## Source: `spec.md (merged from former phase 008)`

---
title: "Feature Specification: Spec Kit Code Quality Completion Run [spec.md (merged from former phase 008)]"
description: "Phase 008 executes full code-quality hardening for system-spec-kit and mcp_server: stabilize baseline failing tests, complete read-only review coverage, apply moderate modularization, modernize repo-owned READMEs, propagate sk-code--opencode standards when needed, and close with verification plus context save."
trigger_phrases:
  - "spec kit code quality"
  - "phase 008"
  - "baseline stabilization"
  - "modularization"
  - "readme modernization"
SPECKIT_TEMPLATE_SOURCE: "spec-core + level2-verify + level3-arch | v2.2"
importance_tier: "critical"
contextType: "implementation"
---
# Feature Specification: Spec Kit Code Quality Completion Run

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase merged phase-008 content is the closure hardening phase under parent `139-hybrid-rag-fusion`, following completed predecessor phase the historical templates phase. The phase will execute a strict quality run across `.opencode/skill/system-spec-kit` and `mcp_server`, with baseline defect stabilization, broad read-only review coverage, bounded modularization, documentation modernization, standards propagation, and final verification/context persistence.

**Key Decisions**: Baseline-first defect stabilization before structural changes; maximum six parallel read-only review lanes with bounded summaries.

**Critical Dependencies**: Stable test harness execution in `mcp_server` and strict README scope filtering to avoid vendor/generated drift.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-02-23 |
| **Parent Spec** | the parent spec document |
| **Predecessor Phase** | the historical templates phase (Complete) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The quality surface for `system-spec-kit` and `mcp_server` still has blocking failures and maintainability debt that prevent clean closure of the hybrid-rag-fusion program. Current baseline execution shows three canonical failing tests targeted for stabilization (`graph-search-fn`, `query-expander`, `memory-save-extended`) and one additional modularization gate failure tied to oversized handlers that must be addressed through moderate surgical refactor depth.

### Purpose
Deliver a controlled completion run that removes blocking quality debt, hardens maintainability, and leaves a verified, context-preserved baseline ready for follow-on work without reopening unresolved failures.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Stabilize the existing three baseline failing tests through targeted fixes and focused regression reruns.
- Execute a full read-only review wave with at most six parallel lanes and bounded summary outputs.
- Perform moderate surgical modularization in the highest-risk oversized handler paths.
- Modernize README files that are repository-owned under `system-spec-kit` (explicitly excluding vendor/generated trees such as `node_modules`, `dist`, caches).
- Propagate `sk-code--opencode` documentation/standards updates only when implementation introduces net-new enforced patterns.
- Complete final verification matrix and save session context using the official `generate-context.js` workflow.

### Out of Scope
- New product features unrelated to quality hardening.
- Deep architectural rewrite beyond moderate modularization boundaries.
- README edits in vendor/generated directories (`node_modules`, compiled `dist`, caches, temporary outputs).
- Manual memory file authoring under `memory/` (script-only memory save remains mandatory).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts` | Modify | Resolve graph search SQL/lookup contract drift |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts` | Modify | Align synonym expansion behavior with locked test contract |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modify | Resolve atomic save timeout/stability behavior |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts` | Modify | Moderate modularization for line-limit maintainability gate |
| `.opencode/skill/system-spec-kit/mcp_server/tests/{graph-search-fn,query-expander,memory-save-extended,modularization}.vitest.ts` | Modify | Keep failing contracts and modularization guardrails aligned to intended behavior |
| `.opencode/skill/system-spec-kit/**/README.md` (repo-owned only) | Modify | Modernize structure/clarity for maintained modules only |
| `.opencode/skill/sk-code--opencode/{README.md,skill guide,references/**/*.md}` | Conditional Modify | Propagate new enforceable standards if quality run introduces novel patterns |
| `merged phase-008 root docs` | Create/Modify | Phase documentation and closure evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Stabilize three baseline failing tests | `tests/graph-search-fn.vitest.ts`, `tests/query-expander.vitest.ts`, and `tests/memory-save-extended.vitest.ts` failing cases pass in focused and full reruns |
| REQ-002 | Complete full read-only review wave coverage | Six-or-fewer review lanes executed with bounded summary artifacts and explicit risk tags |
| REQ-003 | Apply moderate surgical modularization | Oversized handler paths are reduced via focused extraction without broad rewrite and modularization guard test passes |
| REQ-004 | Enforce README modernization scope boundaries | Only repo-owned READMEs under `system-spec-kit` are updated; no vendor/generated README files are modified |
| REQ-005 | Preserve behavior/security contracts | Path security, indexing safety, and existing MCP response contracts remain green after changes |
| REQ-006 | Execute final verification matrix | Lint/tests/spec validation commands complete with no unresolved P0 failures |
| REQ-007 | Save final context with official script | `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js 02--system-spec-kit/022-hybrid-rag-fusion/003-speckit-quality-and-standards` succeeds |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Propagate `sk-code--opencode` updates if needed | Any newly enforced coding pattern is reflected in skill docs/checklists, or an explicit no-delta finding is recorded |
| REQ-009 | Keep documentation synchronized | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` remain aligned during execution |
| REQ-010 | Provide traceable evidence bundle | Each major gate maps to command output or artifact path in checklist/implementation summary |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The three baseline failing tests are passing in focused reruns and remain passing in the full `mcp_server` suite.
- **SC-002**: `tests/modularization.vitest.ts` passes with moderate surgical modularization (no broad rewrite).
- **SC-003**: Read-only review wave covers all planned lanes with bounded summaries and a consolidated remediation queue.
- **SC-004**: README modernization touches only repo-owned paths under `system-spec-kit`; excluded directories remain unchanged.
- **SC-005**: `sk-code--opencode` propagation is completed or explicitly recorded as not required after diff review.
- **SC-006**: Final command matrix and phase-folder `validate.sh` run complete, followed by successful context save.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Stable Node/Vitest runtime for `system-spec-kit` workspace | Incomplete verification if runtime breaks | Pin commands to workspace scripts and record command outputs per gate |
| Dependency | Existing test fixtures for deferred DB flows | False negatives/positives if fixtures drift | Keep focused failure reproductions independent of deferred fixture paths |
| Risk | Baseline run reports extra failures beyond locked triad | Scope inflation and delayed closure | Treat locked triad as mandatory stabilization; route additional failures through modularization/review queue with explicit decisions |
| Risk | Over-modularization | Behavioral regression from unnecessary extraction | Enforce moderate-surgical boundary and preserve exported contracts |
| Risk | README modernization creeps into vendor/generated files | Unwanted churn and review noise | Use explicit include/exclude discovery filters and verify touched-path manifest |
| Risk | Standards propagation misses new pattern | Drift between code and `sk-code--opencode` guidance | Add conditional propagation checkpoint before final verification |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Focused failing-test reruns complete in under 3 minutes per cycle.
- **NFR-P02**: Full `mcp_server` test pass remains within normal suite runtime envelope for this repository.

### Security
- **NFR-S01**: No weakening of path traversal/file validation protections in save/index handlers.
- **NFR-S02**: No secrets, tokens, or local machine paths are newly exposed in README/doc updates.

### Reliability
- **NFR-R01**: Targeted stabilized failures remain green across at least one focused rerun plus one full-suite rerun.
- **NFR-R02**: Final verification commands are reproducible from documented command matrix entries.

### Maintainability
- **NFR-M01**: Modularization reduces hotspot complexity while retaining existing handler API contracts.
- **NFR-M02**: Documentation updates remain scoped and auditable with clear ownership boundaries.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- README discovery must ignore `node_modules`, `dist`, `.pytest_cache`, and cache-like directories even when nested under valid repo roots.
- Modularization extraction must preserve serialized response shapes consumed by existing integration tests.

### Error Scenarios
- Focused test reruns may pass while full suite fails; both states must be tracked before claiming stabilization.
- Timeout-sensitive `atomicSaveMemory` behavior may fail intermittently under external embedding provider delays.
- SQL path selection in graph search may diverge when FTS table availability probes run before fallback queries.

### State Transitions
- Baseline quality state transitions from "known failing triad + modularization gate debt" to "stabilized baseline + bounded structural cleanup."
- Read-only review findings transition into an explicit fix queue before final closure verification.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Cross-cutting updates across handlers, search modules, tests, and repo-owned READMEs |
| Risk | 18/25 | Failure stabilization + structural modularization in critical persistence/search paths |
| Research | 14/20 | Six-lane review wave with bounded synthesis and remediation ranking |
| Multi-Agent | 10/15 | Up to six parallel read-only lanes with controlled summary format |
| Coordination | 10/15 | Predecessor continuity, standards propagation, and final memory save gate |
| **Total** | **72/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Baseline triad fix introduces hidden regression | High | Medium | Enforce focused + full-suite reruns before closure |
| R-002 | Modularization exceeds moderate depth | Medium | Medium | Restrict refactor to helper extraction and preserved interfaces |
| R-003 | README scope filter leaks into vendor/generated trees | Medium | Low | Use strict include/exclude command and touched-file audit |
| R-004 | Review wave outputs exceed bounded summary budget | Low | Medium | Predefine lane template with fixed required fields |
| R-005 | `sk-code--opencode` propagation omitted when needed | Medium | Medium | Add conditional propagation gate before final verification |
| R-006 | Context save skipped at closure | Medium | Low | Make memory-save command a checklist P0 completion item |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Stabilize Baseline Defects (Priority: P0)

**As a** maintainer, **I want** the locked baseline failing tests stabilized, **so that** quality gates stop blocking closure.

**Acceptance Criteria**:
1. **Given** baseline failing cases, **When** targeted fixes are applied, **Then** all locked failing tests pass in focused reruns.
2. **Given** focused pass status, **When** the full suite runs, **Then** locked failures remain resolved.

---

### US-002: Complete Review Coverage (Priority: P0)

**As a** quality lead, **I want** full read-only review wave coverage, **so that** high-risk drift is surfaced before closure.

**Acceptance Criteria**:
1. **Given** six planned lanes, **When** reviews execute, **Then** each lane returns a bounded summary with risks and recommendations.

---

### US-003: Keep Refactor Depth Moderate (Priority: P0)

**As a** code owner, **I want** moderate modularization in oversized handlers, **so that** maintainability improves without destabilizing runtime contracts.

**Acceptance Criteria**:
1. **Given** oversized handler files, **When** helper extraction is applied, **Then** modularization tests pass and API behavior remains stable.

---

### US-004: Modernize Owned Documentation Only (Priority: P1)

**As a** documentation maintainer, **I want** README updates constrained to repo-owned files, **so that** vendor/generated content remains untouched.

**Acceptance Criteria**:
1. **Given** README modernization scope, **When** updates are committed, **Then** excluded directories show zero README diffs.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:acceptance-scenarios -->
## 12. ACCEPTANCE SCENARIOS

1. **Given** the three baseline failing tests, **When** Phase 1 completes, **Then** each targeted failing assertion is green.
2. **Given** the modularization gate failure, **When** moderate helper extraction completes, **Then** the line-limit test passes without broad rewrite.
3. **Given** the six-lane review plan, **When** review execution finishes, **Then** every lane has a bounded summary artifact.
4. **Given** README modernization work, **When** path filtering is applied, **Then** only repo-owned READMEs are touched.
5. **Given** potential standards drift, **When** `sk-code--opencode` diff review is run, **Then** propagation updates are either applied or explicitly waived with evidence.
6. **Given** closure readiness, **When** final verification runs, **Then** test/lint/validation gates pass and context save completes via `generate-context.js`.
<!-- /ANCHOR:acceptance-scenarios -->

---

<!-- ANCHOR:questions -->
## 13. OPEN QUESTIONS

- None. User decisions are locked for runtime path, parallel lane cap, baseline stabilization requirement, modularization depth, and README scope boundaries.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Predecessor Completion Reference**: See `./implementation-summary.md`
