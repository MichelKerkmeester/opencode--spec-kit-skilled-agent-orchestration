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
- [x] Boundary docs and API contract docs merged.
- [x] Import-policy enforcement active.
- [x] Handler cycle reduced/removed and verified.
- [x] Duplicate helper ownership clarified and consolidated.
- [x] Checklist P0 items verified with command/file evidence.
- [ ] Triple ultra-think review P0 blockers resolved (Phase 4).
- [ ] Review remediation checklist items verified.
- [ ] Feature catalog implementation-doc parity remediation completed (Phase 6).
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

<!-- ANCHOR:effort -->
## EFFORT ESTIMATION

| Phase | Tasks | Estimated LOC | Effort | Risk |
|-------|-------|---------------|--------|------|
| Phase 0: Pipeline Infrastructure | T000 | ~20 | Low (1-2h) | Low |
| Phase 1: Contract & Discoverability | T001-T006 | ~300 (docs) | Medium (4-6h) | Low |
| Phase 2: Structural Cleanup | T007-T014 | ~200 (code) | Medium-High (6-8h) | Medium |
| Phase 2b: Cleanup & Doc Gaps | T018-T020 | ~100 (docs+code) | Low (2-3h) | Low |
| Phase 3: Enforcement | T015-T017 | ~150 (code) | Medium (3-4h) | Medium |
| Phase 4: Review Remediation | T021-T045 | ~300 (code+docs) | Medium-High (6-10h) | Medium |
| Phase 5: Enforcement Gaps | T046-T049 | ~80 (code+docs) | Low (1-2h) | Low |
| Phase 6: Feature Catalog Parity | T050-T070 | ~350 (code+docs+tests) | Medium-High (8-12h) | Medium |
| **Total** | **70 tasks** | **~1500** | **~31-45h** | **Medium** |

**Critical path**: Phase 0 → Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 6 (sequential dependency).
Phase 2b can run in parallel with Phase 2 after Phase 1 completes.
Phase 4 P1/P2 items can run in parallel after P0 blockers are resolved.
<!-- /ANCHOR:effort -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0: Pipeline Infrastructure (Prerequisite)
- [ ] Establish lint/check scripts in `scripts/package.json` (required by Phase 3 enforcement).

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

### Phase 4: Review Remediation (Post-Review)
Addresses findings from the triple ultra-think cross-AI review (Claude Opus 4.6 + Gemini 3.1 Pro + Codex 5.3).

#### P0 Blockers
- [ ] Integrate `check-api-boundary.sh` into `npm run check` pipeline for bidirectional enforcement.
- [ ] Add missing `reindex-embeddings.ts` exception to `ARCHITECTURE_BOUNDARIES.md`.
- [ ] Expand `PROHIBITED_PATTERNS` to cover `@spec-kit/mcp-server/core/*` paths.

#### P1 Should-Fix
- [ ] Add dynamic `import()` expression detection to enforcement script.
- [ ] Add additional relative path variant patterns (3+ depth levels).
- [ ] Update `shared/README.md` structure tree with Phase 8 modules.
- [ ] Add allowlist governance fields (`approvedBy`, `createdAt`, `expiresAt`).
- [ ] Ban or sunset wildcard exceptions with explicit module lists.
- [ ] Update `evals/README.md` with missing `run-chk210-quality-backfill.ts` exception.

#### P2 Nice-to-Have
- [ ] Add block comment tracking to import checker.
- [ ] Add behavioral tests for `quality-extractors.ts` edge cases.
- [ ] Add bidirectional cross-links in `ARCHITECTURE_BOUNDARIES.md`.
- [ ] Define growth policy for `handler-utils.ts`.
- [ ] Consider AST-based parsing upgrade for enforcement script.
- [ ] Add transitive dependency checks for re-export evasion.

### Phase 6: Feature Catalog Parity (Implementation vs Documentation)
Derived from the 5-agent phase audit of `feature_catalog` groups 01-18.

#### Code Fixes First (behavioral)
- [ ] Fix `memory_match_triggers` cognitive-path limit leak so final output never exceeds caller limit.
- [ ] Add per-channel failure isolation in `eval_run_ablation` so one channel error does not abort the full run.
- [ ] Enforce learned-feedback shadow-period semantics end-to-end (record + query paths).
- [ ] Remove learned-feedback double scaling (0.7x applied twice).
- [ ] Process incremental `toDelete` paths in `memory_index_scan` flow.
- [ ] Align auto-promotion thresholds with positive-validation semantics (not total validation count).
- [ ] Wire per-channel eval logging if retained in current telemetry contract.
- [ ] Finalize and enforce one `memory_search.limit` contract (50 or 100) across schema + docs.

#### Documentation Alignment Sweep
- [ ] Remove stale fallback narrative for `SPECKIT_PIPELINE_V2` (V2-only runtime).
- [ ] Align MPAB documentation with actual runtime stage placement.
- [ ] Align content-normalization docs with current embedding/BM25 behavior.
- [ ] Align checkpoint docs with real `skipCheckpoint` and restore semantics.
- [ ] Align evaluation metrics count and edge-density denominator wording.
- [ ] Align graph/community docs with runtime wiring and cache invalidation behavior.
- [ ] Align governance docs (flag caps, active knobs, inventory counts) to current code.
- [ ] Align eval logging docs (sync vs async, and per-channel event coverage).
- [ ] Remove stale implementation-detail claims (line-count and call-site drift) across phase snippets.

#### Memory Quality Gates (Generation-Time Prevention)
- [x] Create `slug-utils.ts` with content-aware slug generation (task → slug, fallback to folder name).
- [x] Add empty content gate (200-char minimum after stripping boilerplate) to `file-writer.ts`.
- [x] Add duplicate detection (SHA-256 hash check against existing memory files) to `file-writer.ts`.
- [x] Integrate content slug in `workflow.ts` (replace `folderBase` with `generateContentSlug(implSummary.task, folderBase)`).

#### Validation
- [ ] Re-run phase audit for groups 01-18 and ensure no unresolved high-severity doc-vs-runtime mismatches remain.
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

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Team agreement on API-first policy | Internal | Yellow | Delays enforcement rollout |
| Existing tests around parser/index paths | Internal | Yellow | Higher refactor risk |
| CI pipeline hook for import-policy check | Internal | Yellow | Rules remain advisory only |

<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Behavior regressions or broken operational workflows after boundary refactors.
- **Procedure**:
1. Revert structural code changes in helper/cycle refactors.
2. Keep docs and ADR decisions as accepted intent.
3. Switch import-policy checks to warning mode until gaps are addressed.

<!-- /ANCHOR:rollback -->

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
4. Review remediation P0 blockers (critical).
5. Feature catalog parity code fixes + documentation sweep (critical).

**Parallel Opportunities**:
- README alignment can run in parallel with API consumer docs.
- Token estimator and quality extractor consolidation can run in parallel after shared ownership is agreed.

## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Boundary clarity | Contract and API docs published | Phase 1 |
| M2 | Drift reduction | Duplicate helpers and cycle concerns addressed | Phase 2 |
| M3 | Guardrail active | Import-policy checks enforced in default workflow | Phase 3 |
| M4 | Review remediation | P0 blockers resolved, enforcement hardened, doc drift fixed | Phase 4 |
| M5 | Feature parity | Feature catalog and snippets align with implemented runtime behavior | Phase 6 |

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
