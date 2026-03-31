---
title: "Implementation Plan: Architecture Audit [02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/plan]"
description: "Execution record for the completed scripts-versus-mcp_server architecture audit and its merged boundary-remediation follow-up work."
trigger_phrases:
  - "architecture audit plan"
  - "boundary remediation plan"
  - "scripts mcp server boundary"
importance_tier: "critical"
contextType: "decision"
---
# Implementation Plan: Architecture Audit

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, TypeScript references |
| **Framework** | Spec Kit architecture docs plus audit evidence |
| **Storage** | Filesystem only |
| **Testing** | Spec validation, targeted scripts checks, TypeScript/Vitest evidence captured in audit records |

### Overview
The detailed root plan text was overwritten by the later parent-coordination rewrite. This restored plan therefore keeps the recoverable completed phase map and the confirmed audit outcomes, rather than inventing a line-by-line replay of the lost root prose.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Boundary-audit problem and supporting evidence reviewed
- [x] ADRs for boundary contract, enforcement, consolidation, and late follow-up work available
- [x] Restored root docs scoped back to the completed standalone audit

### Definition of Done
- [x] Root docs describe the completed architecture audit instead of phase coordination
- [x] The recovered 15-phase audit map is represented accurately
- [x] Merged boundary-remediation work from former spec `030` remains in scope
- [x] No stale references to removed child-phase routing remain in the five restored docs
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Contract-first architecture remediation with enforcement and verification follow-through.

### Key Components
- **Boundary contract**: `scripts/`, `mcp_server/`, and `shared/` ownership definition
- **Structural cleanup**: shared-helper consolidation and handler-cycle elimination
- **Enforcement**: import-policy checks, allowlist governance, and later source-dist protection
- **Verification follow-up**: naming, CLI routing, README coverage, and documentation hardening

### Data Flow
Discover boundary drift -> define contract -> remediate violations -> enforce in tooling -> verify strict-pass behavior -> close audit-driven follow-ups
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

The recoverable original phase map shows 15 completed architecture-audit phases:

### Phase 0: Pipeline Infrastructure
- Establish audit scaffolding and prerequisite inventory work.

### Phase 1: Contract & Discoverability
- Publish the boundary contract and improve discoverability of ownership rules.

### Phase 2: Structural Cleanup
- Consolidate duplicate helpers, reduce cross-area drift, and remove the documented handler cycle.

### Phase 2b: Cleanup & Doc Gaps
- Close sidecar cleanup issues discovered during structural work without blocking Phase 2 completion.

### Phase 3: Enforcement
- Automate the boundary contract with import-policy and related guard rails.

### Phase 4: Review Remediation
- Address the triple ultra-think cross-AI review findings.

### Phase 5: Enforcement Gaps
- Close the follow-on enforcement gaps exposed by Phase 4.

### Phase 6: Feature Catalog Parity
- Align code, documentation, and feature-catalog references discovered during audit follow-up.

### Phase 7: Boundary Remediation Carry-Over
- Merge former spec `030-architecture-boundary-remediation` into this completed audit.

### Phase 8: Strict-Pass Remediation
- Resolve remaining README and documentation drift found during strict verification.

### Phase 9: Memory Naming Follow-Up
- Fix root-save naming regressions discovered after strict-pass closure.

### Phase 10: Direct-Save Naming Follow-Up
- Fix collector-path naming loss discovered after Phase 9.

### Phase 11: Explicit CLI Target Authority
- Close routing bugs in explicit CLI target handling for memory save.

### Phase 12: Phase-Folder Rejection Rule
- Add the guard rail that rejects invalid phase-folder targets during memory save flows.

### Phase 13: Indexed Direct-Save Quality
- Close render and quality issues discovered after Phase 10 verification.

### Later Completed Follow-Up Recorded Outside the Recovered Root Plan
- README audit closure is preserved in surviving audit artifacts as Phase 14.
- Symlink removal and canonical import restoration are preserved in ADR-007 as Phase 15A (`T130-T132`).
- Source-dist alignment enforcement is preserved in ADR-008 as Phase 15B (`T133-T135`).
- The 2026-03-21 self-audit also references a later completed task block `T140-T152`; the original detailed root plan prose for that block was overwritten and is not reconstructed here beyond this verified note.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract enforcement | Import-policy and allowlist governance | boundary-check scripts, standard validation flows |
| Structural verification | Handler cycle removal, helper consolidation | AST checks, TypeScript compile, targeted tests |
| Documentation verification | Boundary docs and README alignment | strict-pass review, validator runs |
| Follow-up regression checks | Naming, routing, symlink, source-dist alignment | targeted scripts, spec validation, self-audit evidence |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `decision-record.md` | Internal | Green | Architecture rationale becomes harder to verify |
| `research/research.md` | Internal | Green | Deep audit evidence becomes harder to recover |
| Enforcement tooling | Internal | Green | Boundary claims weaken without executable checks |
| `scratch/` and `memory/` evidence | Internal | Green | Later follow-up provenance is harder to trace |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Restored root docs reintroduce scope drift or unsupported historical claims
- **Procedure**: Restore the previous docs from version control, then re-apply only the confirmed standalone-audit summary
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```
Phase 0 -> Phase 1 -> Phase 2 -> Phase 3
          \-> Phase 2b (parallel sidecar)
Phase 4 -> Phase 5
Phase 6 -> Phase 7 -> Phase 8
Phase 9 -> Phase 10 -> Phase 11 -> Phase 12
                    \-> Phase 13
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 0 | None | 1 |
| 1 | 0 | 2, 2b, 3 |
| 2 | 1 | 3 |
| 2b | 1 | Documentation completeness |
| 3 | 2 | 4 |
| 4 | 3 | 5 |
| 5 | 4 | Later hardening |
| 6 | Audit follow-up discovery | 7 |
| 7 | 6 or direct carry-over readiness | 8 |
| 8 | 7 | 9 |
| 9 | 8 | 10 |
| 10 | 9 | 11, 13 |
| 11 | 10 | 12 |
| 12 | 11 | Closure confidence |
| 13 | 10 | Final quality closure |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
<!-- /ANCHOR:dependencies -->
## L2: EFFORT ESTIMATION

| Phase | Task Range | Notes |
|-------|------------|-------|
| 0 | `T000` | Infrastructure prerequisite |
| 1 | `T001-T006` | Contract and discoverability |
| 2 | `T007-T014` plus `T013a/T013b/T013c` | Structural cleanup and handler-cycle work |
| 2b | `T018-T020` | Cleanup sidecar discovered during Phase 2 |
| 3 | `T015-T017` | Enforcement |
| 4 | `T021-T045` | Cross-AI review remediation |
| 5 | `T046-T049` | Enforcement gaps |
| 6 | `T050-T073` | Feature catalog parity |
| 7 | `T074-T090` | Merged boundary remediation carry-over |
| 8 | `T091-T099` | Strict-pass documentation closure |
| 9 | `T100-T104` | Memory naming follow-up |
| 10 | `T105-T109` | Direct-save naming follow-up |
| 11 | `T110-T114` | Explicit CLI target authority |
| 12 | `T115-T118` | Phase-folder rejection rule |
| 13 | `T119-T123` | Indexed direct-save quality |
| Later follow-up | `T124-T135`, `T140-T152` | README audit, symlink removal, source-dist alignment, and later close-out work reflected in surviving artifacts |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
Boundary Contract
      |
      +--> Structural Cleanup ---> Enforcement
      |         |
      |         +--> Cleanup & Doc Gaps
      |
      +--> Review Remediation ---> Enforcement Gaps
      |
      +--> Feature/Doc Parity ---> Merged Boundary Remediation ---> Strict-Pass Closure
      |
      +--> Naming/Routing Follow-Ups ---> Quality Closure
      |
      +--> README / Symlink / Source-Dist Addenda
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Define the boundary contract** - CRITICAL
2. **Reduce structural drift and remove handler-cycle risk** - CRITICAL
3. **Automate enforcement** - CRITICAL
4. **Respond to review findings and close enforcement gaps** - CRITICAL
5. **Merge former spec `030` remediation and pass strict verification** - CRITICAL
6. **Close naming and routing regressions uncovered during verification** - CRITICAL
7. **Preserve later README, symlink, and source-dist hardening as completed addenda** - CRITICAL
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

---

**Navigation & Traceability**

- **Parent**: `022-hybrid-rag-fusion`
- **Scope**: Architecture audit planning and closure mapping for the Spec Kit Memory MCP server
- **Upstream**: Root 022 coordination packet
- **Downstream**: Implementation packages in `mcp_server/`, `scripts/`, and `shared/`, with runtime emphasis on `api/`, `core/`, `configs/`, `formatters/`, `handlers/`, `hooks/`, `lib/`, `schemas/`, `shared-spaces/`, `tools/`, and `utils/`

| Milestone | Description | Success Criteria |
|-----------|-------------|------------------|
| M1 | Boundary contract published | Ownership rules documented and discoverable |
| M2 | Structural cleanup complete | Shared helpers consolidated and handler cycle removed |
| M3 | Enforcement active | Boundary checks run in standard workflows |
| M4 | Review and enforcement gaps closed | Phase 4 and 5 outcomes verified |
| M5 | Former spec `030` remediation merged | Carry-over work represented as completed in this audit |
| M6 | Strict-pass and naming-quality follow-ups closed | Phases 8-13 complete |
| M7 | README, symlink, and source-dist hardening closed | Later follow-up addenda preserved accurately |
<!-- /ANCHOR:milestones -->
