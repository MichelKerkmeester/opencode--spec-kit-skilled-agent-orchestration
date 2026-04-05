---
title: "Feature [system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/001-baseline-and-safety-rails/spec]"
description: "Level 3+ phase spec for Hydra roadmap baseline hardening, rollout controls, and verification safety rails."
trigger_phrases:
  - "phase 1"
  - "baseline and safety rails"
  - "hydra phase 1"
  - "checkpoint safety"
importance_tier: "critical"
contextType: "implementation"
SPECKIT_TEMPLATE_SOURCE: "spec-core + level2-verify + level3-arch + level3plus-govern | v2.2"
---
# Feature Specification: 001-baseline-and-safety-rails

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 1 establishes the safe operating baseline for the Hydra roadmap. It hardens runtime packaging, roadmap flag handling, baseline evaluation, migration checkpoint workflows, schema compatibility checks, and the documentation/testing surface used by the later phases that are now delivered.

**Key Decisions**: ship Hydra roadmap state through prefixed capability metadata with shared-rollout/default-on defaults and explicit opt-out semantics; treat checkpoint and compatibility tooling as first-class rollout gates before lineage work begins.

**Critical Dependencies**: existing MCP build/runtime packaging, migration scripts, current telemetry surfaces, and the two research documents in the parent spec folder.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 |
| **Status** | Complete - pending sign-off |
| **Created** | 2026-03-13 |
| **Updated** | 2026-03-14 |
| **Branch** | `022-hybrid-rag-fusion` |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | `../plan.md` |
| **Phase** | 1 of 6 |
| **Predecessor** | None |
| **Successor** | ../002-versioned-memory-state/spec.md |
| **Handoff Criteria** | Buildable runtime, roadmap-safe flags, checkpoint scripts, baseline snapshot coverage, and aligned docs all verified |

### Phase Context

This phase turns the roadmap from a loose planning artifact into a controlled execution program. Later phases assume the runtime builds cleanly, feature metadata does not drift from real behavior, checkpoint workflows exist, and the docs/test surface tells the truth about what is and is not shipped.

**Scope Boundary**: baseline control-plane and verification work only. No new lineage data model or graph retrieval behavior ships directly in this phase; those capabilities are introduced by later phases.

**Dependencies**:
- Parent ADR-001 through ADR-003 in `../decision-record.md`
- Existing MCP runtime and build packaging
- Existing telemetry, checkpoint, and vector schema modules

**Deliverables**:
- Buildable `dist` generation path
- Hydra roadmap capability snapshot contract
- Baseline evaluation and schema compatibility validation
- Checkpoint create/restore script hardening
- Updated feature catalog, playbook, and README coverage

---

<!-- ANCHOR:problem -->
<!-- /ANCHOR:metadata -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Hydra roadmap cannot safely progress while the baseline runtime and documentation disagree about what exists. Before lineage or graph work begins, the MCP server needs a reliable build path, explicit roadmap capability metadata, stable checkpoint workflows, compatibility validation, and documentation that reflects the actual shipped slice.

### Purpose
Create a trustworthy Phase 1 foundation so later Hydra phases can build on reproducible runtime behavior, rollback-safe data tooling, and verifiable documentation.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Runtime buildability and `dist` alignment for the MCP server package.
- Hydra roadmap capability metadata and phase snapshot defaults.
- Baseline evaluation helpers and schema compatibility validation.
- Checkpoint create/restore script hardening and documentation alignment.
- Focused automated verification plus manual smoke checks for the baseline slice.

### Out of Scope
- First-class lineage tables and temporal state queries.
- Graph-aware retrieval fusion inside the main search path.
- Adaptive ranking feedback loops, governance enforcement, or shared-memory rollout.
- Declaring the whole Hydra roadmap complete.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/package.json` | Modify | Add buildable runtime packaging path |
| `.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts` | Modify | Align roadmap capability metadata with the default-on rollout baseline while preserving explicit opt-out controls |
| `.opencode/skill/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts` | Modify | Stabilize baseline snapshot storage behavior |
| `.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/create-checkpoint.ts` | Modify | Export reusable checkpoint helpers and harden CLI path |
| `.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/restore-checkpoint.ts` | Modify | Mirror checkpoint hardening for restore flow |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Modify | Add schema compatibility validation surface |
| `.opencode/skill/system-spec-kit/mcp_server/tests/*.vitest.ts` | Create/Modify | Add targeted Phase 1 verification |
| `.opencode/skill/system-spec-kit/feature_catalog/**` | Modify/Create | Document delivered baseline features and flags |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md` | Modify | Add baseline validation playbook entries |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Provide a working MCP build path | `npm run build` succeeds and produces a `dist` runtime that reflects current baseline source |
| REQ-002 | Expose Hydra roadmap capability snapshots safely | `getMemoryRoadmapDefaults()` reports `shared-rollout`/all-capability-enabled defaults, supports explicit opt-out disables, and remains distinct from unrelated runtime flags |
| REQ-003 | Harden checkpoint tooling | Create/restore scripts support reusable helpers and pass focused tests |
| REQ-004 | Validate schema compatibility | Schema compatibility helper exists and is covered by automated tests |
| REQ-005 | Align docs with delivered baseline slice | Feature catalog, playbook, READMEs, install guide, and environment reference match the actual behavior |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Capture baseline evaluation state | Baseline snapshot helper stores and reports baseline state consistently |
| REQ-007 | Add focused manual smoke checks | Manual commands validate baseline and graph phase snapshots in built `dist` output |
| REQ-008 | Preserve truth-in-status across the rollout | Phase docs clearly distinguish this baseline slice from later phases while reflecting delivered default-on Phase 015 behavior |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The MCP package builds cleanly with `npm run build`.
- **SC-002**: Focused TypeScript and Vitest verification for Phase 1 passes.
- **SC-003**: Manual flag-smoke checks return the expected `baseline` and `graph` snapshot payloads.
- **SC-004**: Public docs no longer describe stale or missing baseline behavior.
- **SC-005**: Phase 1 docs distinguish delivered hardening work from later phase capabilities without claiming a deferred rollout posture.
- **SC-006**: Later phases can proceed and/or run under shared-rollout defaults without reopening build, checkpoint, or documentation drift blockers.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing MCP packaging and `dist` runtime contract | If broken, later rollout evidence is not trustworthy | Keep build path explicit and verify compiled output |
| Dependency | Existing checkpoint and vector schema modules | Baseline safety rails depend on these being stable | Add targeted tests before future migrations |
| Risk | Flag metadata diverges from runtime behavior | Medium | Keep roadmap flags prefixed, default-on by policy, and verified with explicit opt-out tests |
| Risk | Docs imply an outdated opt-in or deferred posture | High | Use explicit phase status language that reflects delivered default-on behavior |
| Risk | Checkpoint restore is assumed rather than verified | High | Exercise create/restore helpers in focused tests |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:requirements -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Baseline verification helpers add negligible overhead to normal retrieval paths.
- **NFR-P02**: Build and baseline smoke checks remain lightweight enough for repeated local execution.

### Security
- **NFR-S01**: Phase metadata defaults must stay explicit, with clear opt-out controls for operators.
- **NFR-S02**: Checkpoint scripts must avoid ambiguous destructive behavior and keep restore actions explicit.

### Reliability
- **NFR-R01**: Compiled `dist` output must reflect source-level baseline changes.
- **NFR-R02**: Checkpoint helpers must be deterministic across create/restore cycles.

### Operability
- **NFR-O01**: Phase 1 must provide rollback-safe artifacts for later schema work.
- **NFR-O02**: Documentation must support manual validation by maintainers without hidden assumptions.

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Runtime roadmap capabilities default to enabled when no explicit disable metadata is set.
- Baseline snapshots target an evaluation database path that differs from production storage.

### Error Scenarios
- `npm run build` is documented but missing from `package.json`.
- Checkpoint scripts are imported as helpers rather than used only as CLIs.
- Compiled `dist` output omits recently added source files or methods.

### Behavioral Cases
- Manual baseline smoke check forces `SPECKIT_GRAPH_UNIFIED=false`.
- Graph phase smoke check sets `SPECKIT_HYDRA_PHASE=graph` and `SPECKIT_HYDRA_GRAPH_UNIFIED=true`.
- Extended telemetry remains documented consistently with actual code behavior.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Runtime, tooling, tests, and documentation surfaces move together |
| Risk | 22/25 | Baseline drift here would contaminate every later phase |
| Research | 14/20 | Requires alignment between roadmap intent and live server behavior |
| Multi-Agent | 12/15 | Docs, tooling, and code surfaces must stay synchronized |
| Coordination | 14/15 | This phase is a hard dependency for all later phases |
| **Total** | **80/100** | **Level 3+** |

<!-- /ANCHOR:complexity -->
---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Build path stays stale or missing | High | Medium | Add build script and verify compiled output |
| R-002 | Hydra metadata leaks into runtime behavior | High | Medium | Use prefixed roadmap flags and focused tests |
| R-003 | Checkpoint scripts regress during later schema work | High | Medium | Export reusable helpers now and keep tests in place |
| R-004 | Docs drift again after Phase 1 | Medium | Medium | Update catalog, playbook, README, and install guide together |

---

## 11. USER STORIES

### US-001: Buildable Baseline (Priority: P0)

**As a** maintainer, **I want** the MCP server to build into a current `dist` runtime, **so that** later Hydra phases run against the code we actually reviewed and tested.

**Acceptance Criteria**:
1. ****Given**** current Phase 1 source, when `npm run build` runs, then the compiled runtime contains the Phase 1 baseline changes.
2. ****Given**** the built runtime, when manual smoke checks run, then the reported Hydra phase metadata matches the requested snapshot.

### US-002: Safe Rollout Metadata (Priority: P0)

**As a** roadmap owner, **I want** Hydra phase defaults to reflect the delivered shared-rollout baseline with explicit opt-out controls, **so that** docs and telemetry stay honest while operators can still disable capabilities deliberately.

**Acceptance Criteria**:
1. ****Given**** no prefixed roadmap override, when roadmap defaults are evaluated, then `shared-rollout` and six-capability-enabled defaults are returned.
2. ****Given**** an explicit prefixed disable override, when a phase snapshot is requested, then only the targeted capability is opted out.

---

## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | System-spec-kit maintainer | Approved | 2026-03-14 |
| Design Review | Memory MCP maintainer | Approved | 2026-03-14 |
| Implementation Review | System-spec-kit maintainer | Approved | 2026-03-14 |
| Launch Approval | Roadmap owner | Approved | 2026-03-14 |

---

## 13. COMPLIANCE CHECKPOINTS

### Security and Safety
- [x] Runtime flags reviewed for accidental enablement paths
- [x] Checkpoint scripts reviewed for destructive ambiguity
- [x] Baseline docs reviewed for false shipping claims

### Code and Process
- [x] `sk-code-opencode` alignment confirmed during implementation review
- [x] Automated verification commands recorded in `implementation-summary.md`
- [x] Manual smoke procedures recorded in the playbook

---

## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| System-spec-kit maintainer | Owner | High | Spec updates and implementation review |
| Memory MCP maintainer | Runtime reviewer | High | Test and rollout coordination |
| Documentation maintainer | Docs reviewer | Medium | Catalog and playbook updates |

---

## 15. CHANGE LOG

### v0.1 (2026-03-13)
- Created the Phase 1 Level 3+ execution package.
- Recorded the already-delivered baseline hardening slice and remaining open baseline work.

### v0.2 (2026-03-14)
- Updated roadmap-default language to match delivered Phase 015 default-on rollout behavior.
- Clarified explicit opt-out semantics for capability and governance metadata handling.

---

### Acceptance Scenarios

1. **Build path recovery**
   **Given** the MCP server package lacks a valid build script, when Phase 1 is executed, then maintainers can run `npm run build` successfully and inspect a current `dist` output.
2. **Roadmap metadata isolation**
   **Given** roadmap defaults are `shared-rollout` and capabilities are enabled by default, when prefixed Hydra overrides are absent, then the snapshot reflects delivered default-on behavior with no forced opt-in path.
3. **Checkpoint safety**
   **Given** a future migration needs rollback, when checkpoint create and restore helpers run, then the workflow is test-backed and documented before lineage changes start.

---

<!-- ANCHOR:questions -->
## 16. OPEN QUESTIONS

- Should the remaining Phase 1 baseline work absorb broader observability fields now, or stay narrowly focused on current hardening and documentation?
- Do we want a dedicated Phase 1 regression command alias in `package.json`, or is the focused verification command in documentation sufficient?

<!-- /ANCHOR:questions -->
---

## RELATED DOCUMENTS

- **Parent Roadmap**: `../spec.md`
- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Records**: `decision-record.md`
