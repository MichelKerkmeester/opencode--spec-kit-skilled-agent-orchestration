---
title: "Feature Specification: Indexing and Adaptive Fusion Enablement [02--system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/spec]"
description: "Restore indexing channels after workspace path drift and ensure adaptive fusion defaults are explicitly documented and configured."
trigger_phrases:
  - "indexing enablement"
  - "adaptive fusion"
  - "cocoindex path drift"
  - "code graph init"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Indexing and Adaptive Fusion Enablement

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Review |
| **Created** | 2026-03-31 |
| **Branch** | `system-speckit/024-compact-code-graph` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 010-search-retrieval-quality-fixes |
| **Successor** | 012-memory-save-quality-pipeline |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After repository path changes, indexing subsystems were inconsistent: CocoIndex environment paths were stale, code-graph initialization could fail lazily, and adaptive fusion defaults were not explicitly represented across MCP config surfaces. Lexical score visibility through fusion traces was also incomplete.

### Purpose
Stabilize indexing and fusion behavior so channel availability and trace visibility are consistent across environments.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Restore CocoIndex environment/config health for current workspace location.
- Ensure code-graph DB initialization path is resilient on first access.
- Ensure adaptive fusion ON-default behavior is represented consistently in MCP configs.
- Surface lexical score fallback data after fusion.

### Out of Scope
- New retrieval channel design.
- Ranking algorithm redesign.
- Historical phase-subfolder backfills outside this phase.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.cocoindex_code/settings.yml` | Modify | Align include/exclude patterns with real workspace |
| `mcp_server/lib/code-graph/code-graph-db.ts` | Modify | Ensure lazy init path resolves DB safely |
| `mcp_server/formatters/search-results.ts` | Modify | Preserve lexical score fallback in trace output |
| `opencode.json` and MCP config variants | Modify | Explicit adaptive fusion env alignment |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | CocoIndex path/config drift resolved | Indexing runs against current repo location without stale-path failures |
| REQ-002 | Code graph initialization resilient | First access no longer fails due uninitialized DB handle |
| REQ-003 | Adaptive fusion defaults explicit in config surfaces | Config docs/env blocks consistently represent expected ON behavior |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Lexical score fallback preserved in trace output | Fused results still expose keyword/fts/bm25 provenance |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Recursive strict validator reports no structural errors for Phase 011 docs.
- **SC-002**: Indexing/fusion stabilization scope is documented consistently across phase files.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->

### Acceptance Scenarios

**Given** the phase scope and requirements are loaded, **when** implementation starts, **then** only in-scope files and behaviors are changed.

**Given** the phase deliverables are implemented, **when** verification runs, **then** required checks complete without introducing regressions.

**Given** this phase depends on predecessor outputs, **when** those dependencies are present, **then** this phase behavior composes correctly with adjacent phases.

**Given** this phase modifies documented behavior, **when** packet docs are reviewed, **then** spec/plan/tasks/checklist remain internally consistent.

**Given** this phase is rerun in a clean environment, **when** the same commands are executed, **then** outcomes are reproducible.

**Given** completion is claimed, **when** evidence is inspected, **then** each required acceptance outcome is explicitly supported.

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Local index/db artifacts | Validation confidence can vary with local state | Keep runtime verification explicit and separate from structural edits |
| Risk | Config divergence across repos | Behavior confusion between environments | Keep env key/value alignment documented per surface |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should adaptive fusion env defaults be centralized into one generated config source?
- Should channel-availability health checks run automatically on startup for all clients?
<!-- /ANCHOR:questions -->

---

## PHASE DOCUMENTATION MAP

> This phase uses child phase decomposition. Each child folder is an independently executable phase packet.

| Phase | Folder | Focus | Deps | Status |
|-------|--------|-------|------|--------|
| 1 | 001-wire-promotion-gate/ | Wire promotion-gate heuristics into adaptive boost pipeline | None | Complete |
| 2 | 002-persist-tuned-thresholds/ | Persist tuned threshold values and retrieval defaults | 001-wire-promotion-gate | Complete |
| 3 | 003-real-feedback-labels/ | Promote real feedback labels into scoring signals | 002-persist-tuned-thresholds | Complete |
| 4 | 004-fix-access-signal-path/ | Correct access-signal routing and state updates | 003-real-feedback-labels | Complete |
| 5 | 005-e2e-integration-test/ | Validate end-to-end fusion behavior under real scenarios | 004-fix-access-signal-path | Complete |
| 6 | 006-default-on-boost-rollout/ | Roll out default-on boost behavior and guardrails | 005-e2e-integration-test | Complete |
| 7 | 007-external-graph-memory-research/ | External graph-memory validation and findings | 006-default-on-boost-rollout | Complete |
| 8 | 008-create-sh-phase-parent/ | Parent-phase wiring and packet structure completion | 007-external-graph-memory-research | Complete |
| 9 | 009-graph-retrieval-improvements/ | Graph retrieval quality improvements and parity checks | 008-create-sh-phase-parent | Complete |
