---
title: "Feature Specification: 015 Residuals Restart"
description: "Restart 015 Workstream 0+ scoped to the narrowed 19-finding residual backlog from 019/001/002 delta review. Six clusters: DB path boundary, advisor degraded-state, resume minimal-mode, review-graph correctness, doc/reference parity, save/startup hygiene. Sequenced W0+A through W0+D."
trigger_phrases:
  - "015 residuals restart"
  - "015 workstream 0 plus"
  - "db path boundary hardening"
  - "resume minimal contract"
importance_tier: "critical"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/019-system-hardening/006-residual-015-backlog"
    last_updated_at: "2026-04-19T01:00:00+02:00"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Residual 015 implementation completed with wave regression evidence"
    next_safe_action: "Run orchestrator-owned commit handoff"
    blockers: []

---
# Feature Specification: 015 Residuals Restart

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Source Review** | ../../review/019-system-hardening-pt-01/review-report.md |
| **Priority** | P1 |

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (10 P1 + 9 P2 across 6 clusters) |
| **Status** | Complete |
| **Effort Estimate** | 3-4 days |
| **Executor** | cli-codex gpt-5.4 high fast |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The 015 delta review reclassified 242 original findings: 61 ADDRESSED, 19 STILL_OPEN, 162 SUPERSEDED by phase 016/017/018 primitives, 0 UNVERIFIED. The sole P0 was ADDRESSED by commit `104f534bd0`. This packet implements the 19 STILL_OPEN residuals, sequenced in 4 sub-waves.

### Clusters

**C1 — DB Path Boundary (2 P1):**
- Realpath escape enforcement drifts in `resolveDatabasePaths()` at `mcp_server/core/config.ts:55-62`
- Late environment override support drifts from import-time snapshot at `mcp_server/core/config.ts:83-86`

**C2 — Advisor Degraded-State Surfacing (3 P1):**
- Corrupt source-metadata records fail open in `skill_advisor.py:149-170`
- Continuation records suppress degraded-state visibility at `skill_advisor.py:185-216`
- Cache-health reports false-green at `skill_advisor_runtime.py:230-303` + `skill_advisor.py:2442-2488`

**C3 — Resume Minimal-Mode Contract (1 P1):**
- `session_resume(minimal)` returns full payload, not minimal contract, at `session-resume.ts:547-640`

**C4 — Review-Graph Correctness (2 P1 + 1 P2):**
- `coverage_gaps` reports wrong thing for review graphs at `coverage-graph/query.ts:67-68`
- `coverage_gaps` + `uncovered_questions` collapse to same branch at `coverage-graph/query.ts:67-68`
- Status fails open at `coverage-graph/status.ts:55-65`

**C5 — Doc/Reference Parity (2 P1 + 5 P2):**
- mcp-code-mode README stale inventory + inflated surface
- folder_routing.md stale [packet]/memory/ contract + impossible moderate-alignment example
- troubleshooting.md stale packet-memory assumption
- AUTO_SAVE_MODE under-documented
- sk-code-full-stack review quick-reference path is non-resolvable
- cli-copilot integration doc duplicate merge tail

**C6 — Save/Startup Hygiene (2 P2):**
- Whitespace-only trigger phrases counted in save-quality gate at `save-quality-gate.ts:493-497`
- session-prime hides startup-brief regressions at `session-prime.ts:34-40`

### Purpose

Land all 19 residuals with evidence-backed regressions. Sequence per research recommendation: W0+A (C1+C3), W0+B (C4), W0+C (C2), W0+D (C5+C6).
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### 3.1 In Scope

- All 19 STILL_OPEN residuals across 6 clusters
- 4-wave sequencing per research recommendation
- Each wave shipped as one commit (or small series)

### 3.2 Out of Scope

- Re-opening ADDRESSED/SUPERSEDED 015 findings
- Any 015 finding not in the residual backlog

### 3.3 Files to Change

See cluster listings in §2 Problem Statement.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### 4.1 P0 - Blockers

- **REQ-001**: All 10 P1 residuals land with regression tests
- **REQ-002**: All 9 P2 residuals land with doc or hygiene evidence
- **REQ-003**: DB path resolution rejects symlink escapes and refreshes late database environment overrides
- **REQ-004**: `session_resume(minimal)` returns a minimal readiness payload without the full memory recovery body
- **REQ-005**: Review graph `coverage_gaps` and research-only `uncovered_questions` remain semantically distinct

### 4.2 P1 - Required

- **REQ-006**: Each wave records command evidence; commit and push are deferred to orchestrator handoff per dispatch constraint
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [x] All 19 residuals closed with evidence (test status)
- [x] Regression coverage for each P1 residual
- [x] Doc cluster changes pass validator

### Acceptance Scenarios

1. **Given** a database path configured through a repo-local symlink that resolves outside allowed roots, **When** the MCP config resolves database paths, **Then** the path is rejected before use.
2. **Given** `session_resume` is called with `minimal: true`, **When** the handler builds the response, **Then** the response includes readiness fields and omits full memory recovery fields.
3. **Given** a review graph query asks for uncovered questions, **When** the query handler evaluates the request, **Then** it rejects the research-only query and points callers to `coverage_gaps`.
4. **Given** advisor source metadata or cache records are malformed, **When** advisor health is checked, **Then** health reports degraded diagnostics instead of a false-green status.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|-----------|
| Some residuals surface new regressions | Per-cluster regression tests before wave commit |
| Doc changes missed by validator | Run `validate.sh --strict` post-C5 |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should `session_resume(minimal)` contract be breaking change for existing consumers?
- Should `coverage_gaps` semantic correction be versioned?
<!-- /ANCHOR:questions -->
