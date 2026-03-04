---
title: "Implementation Plan: Scripts vs mcp_server Architecture Refinement [template:level_3/plan.md]"
description: "Execution plan for boundary clarification and reorganization recommendations derived from the Phase 8 architecture audit."
SPECKIT_TEMPLATE_SOURCE: "plan-core | v2.2"
trigger_phrases:
  - "boundary plan"
  - "architecture refinement"
  - "scripts mcp_server"
  - "phase 8 plan"
importance_tier: "critical"
contextType: "architecture"
---
# Implementation Plan: Scripts vs mcp_server Architecture Refinement

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

## 1. SUMMARY
<!-- ANCHOR:summary -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js, shell scripts, markdown docs |
| **Framework** | system-spec-kit tooling + mcp_server runtime |
| **Storage** | SQLite memory/index stores (existing runtime concern) |
| **Testing** | lint/policy checks, targeted dependency checks, existing Vitest suites |

### Overview
The plan prioritizes high-value low-risk changes first: architecture contract documentation and import-policy guardrails. After boundary expectations are explicit and enforceable, structural cleanup actions (duplicate helper consolidation and cycle breaking) can be implemented in smaller, verifiable increments.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Full inventory available in this spec folder scratch artifacts.
- [x] Evaluation ratings and evidence mapped to concrete paths.
- [x] Recommended actions include effort/risk/impact assessment.

### Definition of Done
- [ ] Boundary docs and API contract docs merged.
- [ ] Import-policy enforcement active.
- [ ] Handler cycle reduced/removed and verified.
- [ ] Duplicate helper ownership clarified and consolidated.
- [ ] Checklist P0 items verified with command/file evidence.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Contract-first layered architecture.

### Key Components
- **Runtime layer (`mcp_server/`)**: request handlers, search, scoring, storage, tools.
- **Build/CLI layer (`scripts/`)**: generation, indexing orchestration, eval runners, operational scripts.
- **Shared layer (`shared/`)**: neutral reusable modules with stable ownership.
- **Public boundary (`mcp_server/api/*`)**: only approved cross-boundary consumption surface.

### Data Flow
1. Scripts initiate build/maintenance/eval workflows.
2. Cross-boundary runtime access occurs through API surface where possible.
3. Runtime handlers operate on internal `lib/*` and storage concerns.
4. Enforcement checks prevent new inward dependency drift.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Publish Boundary Contract (documentation-first)
- [ ] Create canonical boundary document and API consumer guidance.
- [ ] Clarify compatibility-wrapper posture and canonical reindex runbook location.
- [ ] Align README coverage for runtime vs scripts ownership.

### Phase 2: Reduce Structural Drift
- [ ] Consolidate duplicate utility concerns (token estimation, quality extraction).
- [ ] Replace direct duplicate implementations with shared modules.
- [ ] Break handler cycle with minimal orchestration extraction.

### Phase 3: Enforce and Verify
- [ ] Add automated import-policy checks for scripts.
- [ ] Add temporary exception allowlist with owner and removal criteria.
- [ ] Validate no new violations and update checklist evidence.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static dependency checks | Forbidden import patterns and cycle detection | custom script + lint integration |
| Unit parity checks | Consolidated helper behavior | Vitest targeted tests |
| Integration checks | Reindex compatibility path and API-first workflows | existing CLI + manual verification |
| Documentation checks | README cross-links and boundary clarity | markdown review + validation scripts |
<!-- /ANCHOR:testing -->

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Team agreement on API-first policy | Internal | Yellow | Delays enforcement rollout |
| Existing tests around parser/index paths | Internal | Yellow | Higher refactor risk |
| CI pipeline hook for import-policy check | Internal | Yellow | Rules remain advisory only |

## 7. ROLLBACK PLAN

- **Trigger**: Behavior regressions or broken operational workflows after boundary refactors.
- **Procedure**:
1. Revert structural code changes in helper/cycle refactors.
2. Keep docs and ADR decisions as accepted intent.
3. Switch import-policy checks to warning mode until gaps are addressed.

## L3: DEPENDENCY GRAPH

```
Contract Docs (Phase 1) -----> Structural Cleanup (Phase 2) -----> Enforcement (Phase 3)
        |                                 |                                |
        +-----> API consumer migration ---+-----> cycle refactor ----------+
```

## L3: CRITICAL PATH

1. Boundary contract + API docs (critical).
2. Handler cycle removal and helper consolidation (critical).
3. Import-policy enforcement in pipeline (critical).

**Parallel Opportunities**:
- README alignment can run in parallel with API consumer docs.
- Token estimator and quality extractor consolidation can run in parallel after shared ownership is agreed.

## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Boundary clarity | Contract and API docs published | Phase 1 |
| M2 | Drift reduction | Duplicate helpers and cycle concerns addressed | Phase 2 |
| M3 | Guardrail active | Import-policy checks enforced in default workflow | Phase 3 |

## AI Execution Protocol

### Pre-Task Checklist
- Confirm scope lock for this phase folder before edits.
- Confirm validator command and target path.

### Execution Rules
| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Execute fixes in warning-category order and re-validate after each pass. |
| TASK-SCOPE | Do not modify files outside this phase folder unless explicitly required by parent-link checks. |

### Status Reporting Format
Status Reporting Format: `DONE | IN_PROGRESS | BLOCKED` with file path and validator evidence per update.

### Blocked Task Protocol
If BLOCKED, record blocker, attempted remediation, and next safe action before proceeding.
