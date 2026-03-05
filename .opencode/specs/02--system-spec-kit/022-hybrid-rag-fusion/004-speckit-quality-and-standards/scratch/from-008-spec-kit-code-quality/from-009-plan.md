---
title: "Implementation Plan: Spec Kit Code Quality Initiative [002-spec-kit-code-quality/plan.md]"
description: "Execution plan for complete quality review/refactor/documentation hardening across system-spec-kit and mcp_server with standards propagation and end-to-end verification."
trigger_phrases:
  - "implementation plan"
  - "phase 002"
  - "code quality initiative"
  - "verification matrix"
SPECKIT_TEMPLATE_SOURCE: "plan-core + level2-verify + level3-arch | v2.2"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: Spec Kit Code Quality Initiative

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, JavaScript, Shell, Python, Markdown |
| **Framework** | OpenCode skill workflow for `system-spec-kit` and `mcp_server` |
| **Storage** | Filesystem, SQLite-backed memory/index operations in `mcp_server` |
| **Testing** | Vitest, npm workspace scripts, spec validation scripts |

### Overview
This plan executes a review-first quality workflow that covers all in-scope code and docs. It identifies hotspot files, applies bounded KISS+DRY refactors, performs README modernization using latest workflow template and HVR standards, and completes standards propagation in `sk-code--opencode` where evidence shows it is needed. The phase closes only after verification commands and spec validation pass.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Scope boundary confirmed: `system-spec-kit` + `mcp_server` + conditional `sk-code--opencode` updates.
- [ ] Review matrix prepared for all in-scope directories.
- [ ] Baseline verification commands run and captured.
- [ ] Hotspot criteria defined (size, complexity, duplication, churn).

### Definition of Done
- [ ] Full in-scope review completed with findings severity labels.
- [ ] KISS+DRY hotspot refactors completed and verified.
- [ ] README modernization completed for all in-scope READMEs.
- [ ] `sk-code--opencode` artifacts updated or no-delta documented.
- [ ] Verification matrix passes.
- [ ] Phase folder validation succeeds.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Staged quality-hardening pipeline with review-first discovery, bounded refactor implementation, and verification closure.

### Key Components
- **Coverage Review Matrix**: Ensures every in-scope directory is reviewed using `sk-code--review` criteria.
- **Hotspot Ranking Engine (manual rubric)**: Scores bloated scripts/modules for KISS+DRY refactor priority.
- **Refactor Workstream**: Applies minimal-risk modular splits and deduplication.
- **README Modernization Workstream**: Updates in-scope READMEs to latest workflow template and HVR standards.
- **Standards Propagation Gate**: Syncs `sk-code--opencode` with newly enforced patterns.
- **Verification Gate**: Runs targeted and full-suite checks and validates spec documentation.

### Data Flow
1. Establish baseline and coverage matrix.
2. Execute full code review sweep and hotspot ranking.
3. Implement prioritized KISS+DRY refactors in bounded batches.
4. Apply README and standards updates.
5. Run verification matrix and spec validation.
6. Publish closure evidence and blockers/deferred list.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:ai-protocol -->
## 4. AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Read target files before any modifications.
- [ ] Confirm each edit maps to a requirement ID.
- [ ] Keep scope lock: no unrelated cleanup.

### Execution Rules

| Rule ID | Rule | Enforcement |
|--------|------|-------------|
| TASK-SEQ-001 | Complete full review pass before broad refactors | Prevents changing code before understanding hotspots |
| TASK-SCOPE-002 | Keep edits inside approved paths only | Avoids scope creep and hidden regressions |
| TASK-KISS-003 | Prefer smallest refactor that removes duplication/complexity | Enforces KISS+DRY without over-engineering |
| TASK-DOC-004 | README updates must follow latest workflow template + HVR | Maintains doc consistency |
| TASK-STD-005 | Update `sk-code--opencode` artifacts only with evidence-backed deltas | Avoids unnecessary standards churn |

### Status Reporting Format
`[PHASE:<id>] [STATE:pending|in_progress|blocked|done] [REQ:<id>] [EVIDENCE:<artifact-or-command>]`

### Blocked Task Protocol
1. Mark blocked task as `[B]` in `tasks.md` with blocker reason.
2. Record impacted requirement IDs and candidate workaround.
3. Continue non-blocked tasks when safe.
4. Re-verify dependent tasks after unblock.
<!-- /ANCHOR:ai-protocol -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

### Phase 1: Baseline and Review Matrix Setup
- [ ] Capture current command baseline for tests/lint/validation.
- [ ] Build directory-level review matrix for all in-scope code surfaces.
- [ ] Define hotspot scoring rubric for bloated files.

### Phase 2: Full-Scope Code Review
- [ ] Review `mcp_server` handlers/libs/tests with `sk-code--review` lenses.
- [ ] Review root `system-spec-kit` scripts (`ts/sh/py/js/mjs`) for complexity and duplication.
- [ ] Produce prioritized hotspot list and remediation recommendations.

### Phase 3: KISS+DRY Refactor Planning and Execution
- [ ] Select top hotspot candidates with the lowest-risk/highest-impact ratio.
- [ ] Implement bounded modular splits and deduplication.
- [ ] Run targeted verification for each refactor batch.

### Phase 4: README Modernization and HVR Alignment
- [ ] Inventory all in-scope README files.
- [ ] Apply latest workflows-documentation template structure.
- [ ] Normalize voice and clarity to HVR standards.

### Phase 5: Standards Propagation (`sk-code--opencode`)
- [ ] Compare implemented patterns against current standards artifacts.
- [ ] Update `SKILL.md`, references, assets, index, and nodes where needed.
- [ ] Record no-delta rationale if no standards changes are required.

### Phase 6: Final Verification and Documentation Closure
- [ ] Run full command matrix.
- [ ] Resolve or explicitly defer remaining P1/P2 findings.
- [ ] Validate phase folder and finalize checklist evidence state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Baseline snapshot | Current state before refactors | npm scripts + vitest |
| Targeted regression | Touched modules/scripts per batch | vitest targeted runs |
| Integration/full | End-to-end `system-spec-kit` test suite | `npm --prefix .opencode/skill/system-spec-kit test` |
| Lint/style | `mcp_server` and related script quality gates | `npm --prefix .opencode/skill/system-spec-kit/mcp_server run lint` |
| Spec validation | Phase documentation integrity | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <folder>` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `mcp_server` test environment | Internal | Available | Cannot verify refactor safety |
| `system-spec-kit` script runtime | Internal | Available | Hotspot validation cannot be executed |
| README template/HVR guidance | Internal | Available | Documentation modernization may drift |
| `sk-code--opencode` artifact ownership | Internal | Available | Standards propagation cannot complete |
| Spec validation scripts | Internal | Available | Completion claim cannot be validated |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

- **Trigger**: New regressions, broken contracts, or failing verification gates after refactor/documentation updates.
- **Procedure**:
1. Revert latest refactor batch.
2. Re-run targeted checks for reverted scope.
3. Re-run full matrix if regression impact was broad.
4. Re-open hotspot item with revised plan.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## 9. L2: PHASE DEPENDENCIES

```
Phase 1 (Baseline/Matrix) -> Phase 2 (Review Sweep) -> Phase 3 (Refactor)
                                               \-> Phase 4 (README/HVR) -> Phase 5 (Standards) -> Phase 6 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Baseline/Matrix | None | All downstream work |
| Review Sweep | Baseline/Matrix | Refactor prioritization |
| Refactor | Review Sweep | Verification closure |
| README/HVR | Review Sweep | Final docs quality |
| Standards | Refactor + README/HVR | Final closure |
| Verify | All previous phases | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 10. L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Baseline and Matrix | Medium | 1-2 hours |
| Full Review Sweep | High | 3-5 hours |
| Refactor Execution | High | 4-8 hours |
| README/HVR Modernization | Medium | 2-4 hours |
| Standards Propagation | Medium | 1-3 hours |
| Verification and Closure | Medium | 1-2 hours |
| **Total** | | **12-24 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## 11. L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline results captured.
- [ ] Refactor batch boundaries documented.
- [ ] README scope manifest captured.

### Rollback Procedure
1. Revert in reverse order: standards/docs, then refactors.
2. Re-run targeted commands for reverted modules.
3. Re-run full suite and lint gates.
4. Update risk register with rollback cause.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Not applicable (code and docs only).
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## 12. L3: DEPENDENCY GRAPH

```
+-------------------------+
| Phase 1 Baseline/Matrix |
+-----------+-------------+
            |
            v
+-------------------------+
| Phase 2 Review Sweep    |
+------+------------+-----+
       |            |
       v            v
+-----------+   +----------------+
| Phase 3   |   | Phase 4 README |
| Refactor  |   | and HVR        |
+-----+-----+   +--------+-------+
      |                  |
      +--------+---------+
               v
      +-------------------+
      | Phase 5 Standards |
      +---------+---------+
                v
      +-------------------+
      | Phase 6 Verify    |
      +-------------------+
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Review matrix | Baseline inventory | Coverage control | Review completion |
| Hotspot ranking | Full review sweep | Refactor queue | Refactor batching |
| Refactor batches | Hotspot ranking | Cleaner module boundaries | Final verification |
| README/HVR updates | README inventory + template rules | Modernized docs | Closure quality gate |
| Standards propagation | Implemented pattern diff | Updated enforcement artifacts | Future consistency |
| Verification matrix | All code/doc updates | Final quality evidence | Completion claim |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## 13. L3: CRITICAL PATH

1. **Review matrix and full sweep** - 4-7 hours - CRITICAL
2. **Refactor implementation and targeted retests** - 4-8 hours - CRITICAL
3. **Standards/docs alignment + final verification** - 3-5 hours - CRITICAL

**Total Critical Path**: 11-20 hours

**Parallel Opportunities**:
- README/HVR modernization can run in parallel with late refactor batches once ownership boundaries are fixed.
- Standards draft updates can begin while final refactor verification is in progress.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## 14. L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Review Complete | 100% in-scope coverage matrix closed | End of Phase 2 |
| M2 | Refactor Complete | Priority hotspot refactors verified | End of Phase 3 |
| M3 | Docs and Standards Complete | README/HVR and standards gates closed | End of Phase 5 |
| M4 | Release Ready | Verification matrix and validate.sh pass | End of Phase 6 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:commands -->
## 15. VERIFICATION COMMAND MATRIX

| Gate | Command | Expected Result |
|------|---------|-----------------|
| Baseline lint | `npm --prefix .opencode/skill/system-spec-kit/mcp_server run lint` | No blocking lint errors |
| Baseline/full tests | `npm --prefix .opencode/skill/system-spec-kit test` | Suite completes without new P0 regressions |
| Targeted tests | `npm --prefix .opencode/skill/system-spec-kit/mcp_server run test -- <target-files>` | Refactor batch remains stable |
| Spec validation | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-spec-kit-code-quality` | Exit 0 (preferred) or 1 with documented warnings |
| Optional standards check | `rg --files .opencode/skill/sk-code--opencode` and related diff checks | Artifacts are aligned with applied rules |
<!-- /ANCHOR:commands -->

