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
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/019-system-hardening/006-015-residuals-restart"
    last_updated_at: "2026-04-18T23:50:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Remediation child scaffolded from 019/001/002 delta review"
    next_safe_action: "Dispatch implementation"
    blockers: []

---
# Feature Specification: 015 Residuals Restart

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

| Field | Value |
|-------|-------|
| **Parent Spec** | ../spec.md |
| **Source Review** | ../001-initial-research/002-delta-review-015/review-report.md |
| **Priority** | P1 |

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (10 P1 + 9 P2 across 6 clusters) |
| **Status** | Spec Ready |
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
- sk-code-full-stack SKILL.md non-resolvable path
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

- **R1**: All 10 P1 residuals land with regression tests
- **R2**: All 9 P2 residuals land (doc/hygiene items can be simpler)
- **R3**: No regression on phase 016/017/018 primitives (TrustState, CAS, shared-provenance)

### 4.2 P1 - Required

- **R4**: Each wave lands as discrete commit (or small series)
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [ ] All 19 residuals closed with evidence (commit SHA or test status)
- [ ] Regression coverage for each P1 residual
- [ ] Doc cluster changes pass validator
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|-----------|
| Some residuals surface new regressions | Per-cluster regression tests before wave commit |
| Doc changes missed by validator | Run `validate.sh --strict` post-C5 |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:open-questions -->
## 10. OPEN QUESTIONS

- Should `session_resume(minimal)` contract be breaking change for existing consumers?
- Should `coverage_gaps` semantic correction be versioned?
<!-- /ANCHOR:open-questions -->
