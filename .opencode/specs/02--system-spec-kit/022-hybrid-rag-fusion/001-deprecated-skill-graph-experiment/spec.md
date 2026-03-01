---
title: "Feature Specification: 013 - Deprecate Skill Graph and README/Skill-Ref [001-deprecated-skill-graph-experiment/spec]"
description: "This completion pass finalizes deprecation of skill graph and README/skill-reference indexing behavior across memory MCP, commands, skills, and agents. It closes residual cleanu..."
trigger_phrases:
  - "feature"
  - "specification"
  - "013"
  - "deprecate"
  - "skill"
  - "spec"
  - "001"
  - "deprecated"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: 013 - Deprecate Skill Graph and README/Skill-Ref Indexing (Completion Pass 2)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

This completion pass finalizes deprecation of skill graph and README/skill-reference indexing behavior across memory MCP, commands, skills, and agents. It closes residual cleanup in create workflows, MCP naming/descriptor residue, and README table-of-contents anchor gaps, then captures completion-grade verification evidence.

**Key Decisions**: fully remove SGQS and skill-ref/readme-indexing surfaces; keep causal graph retrieval features and related controls intact.

**Critical Dependencies**: synchronized updates in `.opencode/command`, `.opencode/skill`, `.opencode/agent`, and `.opencode/skill/system-spec-kit/mcp_server` with passing compile/test gates.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec ID** | 013 |
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-02-21 |
| **Parent** | `N/A (root docs intentionally removed)` |
| **Predecessor** | `002-hybrid-rag-fusion` |
| **Successor** | `002-hybrid-rag-fusion` |
| **Phase Folder** | `001-deprecated-skill-graph-experiment` |
| **Canonical Skill-Graph Folder** | `001-deprecated-skill-graph-experiment/` |
| **Legacy Skill-Graph Archive Root** | `../z_archive/skill-graph-legacy/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 012 removed most SGQS/readme-indexing functionality, but completion artifacts still needed a final pass that verified all residual references were gone and that adjacent cleanup changes were captured. Without this pass, release documentation and verification records stayed incomplete for a broad, cross-cutting deprecation.

### Purpose

Provide completion-grade closure for deprecating skill graph + README/skill-ref/workflows-code asset indexing features, with explicit evidence that in-scope code/docs are clean and validated.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Finalize and document removal of SGQS/skill-graph/readme-indexing/skill-ref indexing references in memory MCP sources.
- Capture command cleanup completion:
  - `graph_node` asset type removed from create skill-asset workflows.
  - README auto-indexing notes removed from create-folder-readme auto/confirm YAML.
- Confirm and document missing README table-of-contents anchor additions in:
  - `.opencode/skill/mcp-chrome-devtools/README.md`
  - `.opencode/skill/sk-doc/README.md`
  - `.opencode/skill/system-spec-kit/templates/addendum/README.md`
- Capture MCP residual cleanup:
  - `SkillGraphLike` renamed to `MemoryGraphLike`.
  - stale README descriptor line corrected.
- Capture rebuild/restoration completion for MCP runtime test assets:
  - `mcp_server/dist/database`
  - `mcp_server/dist/configs/search-weights.json`

### Coverage Targets

- `.opencode/command/**`
- `.opencode/skill/**`
- `.opencode/agent/**`
- `.opencode/skill/system-spec-kit/mcp_server/**`

### Out of Scope

- New retrieval features outside deprecation/cleanup scope.
- Any behavior changes to causal graph retrieval and related controls.
- Editing files outside this `013` spec folder for documentation artifacts.

### Files to Change (Documentation Artifacts)

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-deprecated-skill-graph-experiment/spec.md` | Create | Completion specification and frozen scope |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-deprecated-skill-graph-experiment/plan.md` | Create | Delivery/verification plan with closed phases |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-deprecated-skill-graph-experiment/tasks.md` | Create | Completed task ledger |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-deprecated-skill-graph-experiment/checklist.md` | Create | P0/P1/P2 verification evidence |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-deprecated-skill-graph-experiment/decision-record.md` | Create | ADRs for deprecation and retained causal graph |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-deprecated-skill-graph-experiment/implementation-summary.md` | Create | Concise completion summary |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-deprecated-skill-graph-experiment/merge-manifest.md` | Create | Legacy skill-graph source mapping + archive manifest |

### Legacy Consolidation Inputs

The following legacy skill-graph-related folders are consolidated into this active `013` phase via merge documentation and archived intact under `../z_archive/skill-graph-legacy/`:

- `002-skill-graph-integration/`
- `003-unified-graph-intelligence/`
- `006-skill-graph-utilization/`
- `007-skill-graph-improvement/`
- `009-skill-graph-score-recovery/`
- `012-deprecate-skill-graph-and-readme-indexing/`
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | SGQS/skill-graph/readme-indexing/skill-ref forbidden terms are absent from active memory MCP source surface | `rg` sweeps in `mcp_server` return no matches for `sgqs|skill-ref|readme-indexing|skill-graph` |
| REQ-002 | create command assets no longer include deprecated `graph_node` type | `rg -n "graph_node" .opencode/command/create` returns no matches |
| REQ-003 | create-folder-readme YAML no longer contains README auto-indexing notes | `rg` sweep for README indexing terms in auto/confirm YAML returns no matches |
| REQ-004 | mcp_server compiles after cleanup | `npx tsc -p tsconfig.json` in `mcp_server` succeeds |
| REQ-005 | full mcp_server test suite passes after cleanup | `npm test` in `mcp_server` completes with pass summary |
| REQ-006 | decision record preserves explicit boundary: causal graph features remain active | ADRs state deprecations and retained causal graph behavior |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | README table-of-contents anchor fixes are documented | Evidence references the three README files and anchor entries |
| REQ-008 | MCP residual rename/descriptor cleanup is documented | Evidence references `MemoryGraphLike` presence and no stale symbol |
| REQ-009 | Rebuild/runtime asset restoration evidence is documented | Evidence references `dist/database` and `dist/configs/search-weights.json` |
| REQ-010 | Level 3 documentation bundle validates | Spec validation and placeholder checks pass for this `013` folder |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Forbidden-term scans are clean for target patterns in `mcp_server` and `create` command assets.
- **SC-002**: `npx tsc -p tsconfig.json` passes in `.opencode/skill/system-spec-kit/mcp_server`.
- **SC-003**: `npm test` (`vitest run`) passes full suite with `155` files passed, `0` failed, `19` skipped.
- **SC-004**: Decision record explicitly documents deprecations and retained causal graph behavior.
- **SC-005**: All six Level 3 documents exist and validate with no placeholders.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Residual references remain in less-traveled docs/scripts | Medium | Multi-pattern `rg` sweeps over declared coverage targets |
| Risk | Deprecation may accidentally remove causal graph behavior | High | Explicit ADR boundary and targeted naming checks (`MemoryGraphLike`) |
| Dependency | mcp_server build/test determinism | Medium | Record compile and full-suite test evidence with command output summary |
| Dependency | Dist/runtime asset presence for tests | Medium | Verify `dist/database` and `dist/configs/search-weights.json` paths |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability

- **NFR-R01**: Deprecation completion must not regress core MCP compile/test stability.

### Maintainability

- **NFR-M01**: Deprecated contract surface is removed from docs and code references to avoid operator confusion.

### Operability

- **NFR-O01**: Verification commands and file evidence are reproducible from documented paths.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Behavior Boundaries

- Causal graph features (causal edges, causal boosting/routing) remain supported and are not part of this deprecation.
- Existing historical spec/memory text may still mention SGQS in archived context and is not runtime behavior.

### Environment Edge Cases

- Test behavior can vary with embedding-provider env; completion evidence captures a stable passing full-suite run.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 23/25 | Cross-cutting cleanup across command/skill/agent/mcp_server surfaces |
| Risk | 20/25 | Deprecation boundaries must avoid removing causal graph behavior |
| Research | 15/20 | Multiple residual sweeps and evidence capture |
| Multi-Agent | 7/15 | Single execution path, broad artifacts |
| Coordination | 12/15 | Sync between code cleanup status and completion docs |
| **Total** | **77/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Deprecated terms remain in active target trees | H | M | Pattern sweeps plus checklist evidence |
| R-002 | Causal graph behavior regressed by over-removal | H | L | ADR boundary and symbol-level verification |
| R-003 | Build/test evidence not reproducible | M | M | Record exact commands and result summaries |
| R-004 | Runtime dist assets missing for tests | M | M | Verify concrete dist paths and files |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Cleanup Completion Proof (Priority: P0)

**As a** maintainer, **I want** final deprecation evidence documented, **so that** the phase can be closed without ambiguity.

### US-002: Contract Clarity (Priority: P0)

**As an** operator, **I want** removed SGQS/readme-indexing surfaces gone from active docs and source, **so that** prompts and tooling do not reference dead capabilities.

### US-003: Safe Boundary Retention (Priority: P1)

**As a** platform owner, **I want** causal graph features explicitly retained, **so that** deprecation does not remove intended retrieval behavior.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:acceptance-scenarios -->
## 12. ACCEPTANCE SCENARIOS

1. **Given** mcp_server source files, **When** forbidden-term sweep runs for `sgqs|skill-ref|readme-indexing|skill-graph`, **Then** no matches are returned.
2. **Given** create command assets, **When** `graph_node` scan runs, **Then** no matches are returned.
3. **Given** create-folder-readme auto/confirm YAML files, **When** README indexing note scan runs, **Then** no matches are returned.
4. **Given** mcp_server root, **When** `npx tsc -p tsconfig.json` runs, **Then** compile exits successfully.
5. **Given** mcp_server root, **When** `npm test` runs in stable environment context, **Then** suite summary reports all files passed with no failures.
6. **Given** decision records and checklist evidence, **When** reviewers inspect deprecation boundaries, **Then** SGQS/readme-indexing surfaces are deprecated while causal graph behavior is explicitly retained.
<!-- /ANCHOR:acceptance-scenarios -->

---

<!-- ANCHOR:questions -->
## 13. OPEN QUESTIONS

- None for this completion pass.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Records**: `decision-record.md`
- **Implementation Summary**: `implementation-summary.md`
