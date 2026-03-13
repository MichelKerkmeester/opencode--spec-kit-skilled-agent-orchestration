---
title: "Feature Specification: 001-baseline-and-safety-rails"
description: "Level 3+ phase spec for Hydra roadmap baseline hardening, rollout controls, and verification safety rails."
SPECKIT_TEMPLATE_SOURCE: "spec-core + level2-verify + level3-arch + level3plus-govern | v2.2"
trigger_phrases:
  - "phase 1"
  - "baseline and safety rails"
  - "hydra phase 1"
  - "checkpoint safety"
importance_tier: "critical"
contextType: "decision"
---
<!-- ANCHOR:document -->
# Feature Specification: 001-baseline-and-safety-rails

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 1 establishes the safe operating baseline for the Hydra roadmap. It hardens runtime packaging, roadmap flag handling, baseline evaluation, migration checkpoint workflows, schema compatibility checks, and the documentation/testing surface that later phases depend on.

**Key Decisions**: ship Hydra roadmap state behind prefixed capability metadata rather than live runtime flags; treat checkpoint and compatibility tooling as first-class rollout gates before lineage work begins.

**Critical Dependencies**: existing MCP build/runtime packaging, migration scripts, current telemetry surfaces, and the two research documents in the parent spec folder.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 |
| **Status** | Active |
| **Created** | 2026-03-13 |
| **Updated** | 2026-03-13 |
| **Branch** | `022-hybrid-rag-fusion` |
| **Parent Spec** | `../spec.md` |
| **Parent Plan** | `../plan.md` |
| **Phase** | 1 of 6 |
| **Predecessor** | None |
| **Successor** | `002-versioned-memory-state` |
| **Handoff Criteria** | Buildable runtime, roadmap-safe flags, checkpoint scripts, baseline snapshot coverage, and aligned docs all verified |

### Phase Context

This phase turns the roadmap from a loose planning artifact into a controlled execution program. Later phases assume the runtime builds cleanly, feature metadata does not drift from real behavior, checkpoint workflows exist, and the docs/test surface tells the truth about what is and is not shipped.

**Scope Boundary**: baseline control-plane and verification work only. No new lineage data model or graph retrieval behavior ships in this phase.

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

## 2. PROBLEM & PURPOSE

### Problem Statement
The Hydra roadmap cannot safely progress while the baseline runtime and documentation disagree about what exists. Before lineage or graph work begins, the MCP server needs a reliable build path, explicit roadmap capability metadata, stable checkpoint workflows, compatibility validation, and documentation that reflects the actual shipped slice.

### Purpose
Create a trustworthy Phase 1 foundation so later Hydra phases can build on reproducible runtime behavior, rollback-safe data tooling, and verifiable documentation.

---

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
| `.opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts` | Modify | Separate roadmap capability metadata from live runtime flags |
| `.opencode/skill/system-spec-kit/mcp_server/lib/eval/hydra-baseline.ts` | Modify | Stabilize baseline snapshot storage behavior |
| `.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/create-checkpoint.ts` | Modify | Export reusable checkpoint helpers and harden CLI path |
| `.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/restore-checkpoint.ts` | Modify | Mirror checkpoint hardening for restore flow |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts` | Modify | Add schema compatibility validation surface |
| `.opencode/skill/system-spec-kit/mcp_server/tests/*.vitest.ts` | Create/Modify | Add targeted Phase 1 verification |
| `.opencode/skill/system-spec-kit/feature_catalog/**` | Modify/Create | Document delivered baseline features and flags |
| `.opencode/skill/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md` | Modify | Add baseline validation playbook entries |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Provide a working MCP build path | `npm run build` succeeds and produces a `dist` runtime that reflects current baseline source |
| REQ-002 | Expose Hydra roadmap capability snapshots safely | `getHydraRolloutDefaults()` reports phase/capability metadata without hijacking default-on runtime flags |
| REQ-003 | Harden checkpoint tooling | Create/restore scripts support reusable helpers and pass focused tests |
| REQ-004 | Validate schema compatibility | Schema compatibility helper exists and is covered by automated tests |
| REQ-005 | Align docs with delivered baseline slice | Feature catalog, playbook, READMEs, install guide, and environment reference match the actual behavior |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Capture baseline evaluation state | Baseline snapshot helper stores and reports baseline state consistently |
| REQ-007 | Add focused manual smoke checks | Manual commands validate baseline and graph phase snapshots in built `dist` output |
| REQ-008 | Preserve truth-in-status for later phases | Phase docs clearly state that phases 2-6 remain roadmap work |

---

## 5. SUCCESS CRITERIA

- **SC-001**: The MCP package builds cleanly with `npm run build`.
- **SC-002**: Focused TypeScript and Vitest verification for Phase 1 passes.
- **SC-003**: Manual flag-smoke checks return the expected `baseline` and `graph` snapshot payloads.
- **SC-004**: Public docs no longer describe stale or missing baseline behavior.
- **SC-005**: Phase 1 docs distinguish delivered hardening work from future Hydra implementation work.
- **SC-006**: Phase 2 can begin without reopening build, checkpoint, or documentation drift blockers.

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing MCP packaging and `dist` runtime contract | If broken, later rollout evidence is not trustworthy | Keep build path explicit and verify compiled output |
| Dependency | Existing checkpoint and vector schema modules | Baseline safety rails depend on these being stable | Add targeted tests before future migrations |
| Risk | Flag metadata diverges from runtime behavior | Medium | Keep roadmap flags prefixed and test default-on runtime cases |
| Risk | Docs imply future phases are shipped | High | Use explicit phase status and non-shipping language everywhere |
| Risk | Checkpoint restore is assumed rather than verified | High | Exercise create/restore helpers in focused tests |

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Baseline verification helpers add negligible overhead to normal retrieval paths.
- **NFR-P02**: Build and baseline smoke checks remain lightweight enough for repeated local execution.

### Security
- **NFR-S01**: Phase metadata must not silently enable unsafe runtime capabilities.
- **NFR-S02**: Checkpoint scripts must avoid ambiguous destructive behavior and keep restore actions explicit.

### Reliability
- **NFR-R01**: Compiled `dist` output must reflect source-level baseline changes.
- **NFR-R02**: Checkpoint helpers must be deterministic across create/restore cycles.

### Operability
- **NFR-O01**: Phase 1 must provide rollback-safe artifacts for later schema work.
- **NFR-O02**: Documentation must support manual validation by maintainers without hidden assumptions.

---

## 8. EDGE CASES

### Data Boundaries
- Runtime graph features remain enabled by default when no explicit roadmap metadata is set.
- Baseline snapshots target an evaluation database path that differs from production storage.

### Error Scenarios
- `npm run build` is documented but missing from `package.json`.
- Checkpoint scripts are imported as helpers rather than used only as CLIs.
- Compiled `dist` output omits recently added source files or methods.

### Behavioral Cases
- Manual baseline smoke check forces `SPECKIT_GRAPH_UNIFIED=false`.
- Graph phase smoke check sets `SPECKIT_HYDRA_PHASE=graph` and `SPECKIT_HYDRA_GRAPH_UNIFIED=true`.
- Extended telemetry remains documented consistently with actual code behavior.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Runtime, tooling, tests, and documentation surfaces move together |
| Risk | 22/25 | Baseline drift here would contaminate every later phase |
| Research | 14/20 | Requires alignment between roadmap intent and live server behavior |
| Multi-Agent | 12/15 | Docs, tooling, and code surfaces must stay synchronized |
| Coordination | 14/15 | This phase is a hard dependency for all later phases |
| **Total** | **80/100** | **Level 3+** |

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

**As a** roadmap owner, **I want** Hydra phase defaults to describe planned capability state without mutating live runtime defaults, **so that** docs and telemetry stay honest while rollout remains safe.

**Acceptance Criteria**:
1. ****Given**** no prefixed roadmap override, when runtime graph behavior is evaluated, then default-on runtime behavior is preserved.
2. ****Given**** a prefixed Hydra roadmap override, when a phase snapshot is requested, then the snapshot reflects that roadmap state only.

---

## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | System-spec-kit maintainer | Pending | |
| Design Review | Memory MCP maintainer | Pending | |
| Implementation Review | System-spec-kit maintainer | Pending | |
| Launch Approval | Roadmap owner | Pending | |

---

## 13. COMPLIANCE CHECKPOINTS

### Security and Safety
- [ ] Runtime flags reviewed for accidental enablement paths
- [ ] Checkpoint scripts reviewed for destructive ambiguity
- [ ] Baseline docs reviewed for false shipping claims

### Code and Process
- [ ] `sk-code--opencode` alignment confirmed during implementation review
- [ ] Automated verification commands recorded in `implementation-summary.md`
- [ ] Manual smoke procedures recorded in the playbook

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

---

## 16. ACCEPTANCE SCENARIOS

1. **Build path recovery**
   **Given** the MCP server package lacks a valid build script, when Phase 1 is executed, then maintainers can run `npm run build` successfully and inspect a current `dist` output.
2. **Roadmap metadata isolation**
   **Given** runtime graph behavior defaults to on, when a roadmap snapshot is requested without prefixed Hydra overrides, then the snapshot records the intended roadmap state without rewriting live runtime defaults.
3. **Checkpoint safety**
   **Given** a future migration needs rollback, when checkpoint create and restore helpers run, then the workflow is test-backed and documented before lineage changes start.

---

## 17. OPEN QUESTIONS

- Should the remaining Phase 1 baseline work absorb broader observability fields now, or stay narrowly focused on current hardening and documentation?
- Do we want a dedicated Phase 1 regression command alias in `package.json`, or is the focused verification command in documentation sufficient?

---

## RELATED DOCUMENTS

- **Parent Roadmap**: `../spec.md`
- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Records**: `decision-record.md`

<!-- /ANCHOR:document -->
