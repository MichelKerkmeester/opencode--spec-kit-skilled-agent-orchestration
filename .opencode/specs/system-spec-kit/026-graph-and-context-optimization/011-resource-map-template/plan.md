---
title: "Implementation Plan: Resource Map Template [system-spec-kit/026-graph-and-context-optimization/011-resource-map-template/plan]"
description: "Three-phase plan: restore local-owner deep-loop artifact placement (Phase 001), create and wire the resource-map template (Phase 002), integrate convergence-time emission into both deep-loop skills (Phase 003)."
trigger_phrases:
  - "011-resource-map-template plan"
  - "resource map template implementation plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-resource-map-template"
    last_updated_at: "2026-04-24T00:00:00Z"
    last_updated_by: "claude-sonnet-4-6"
    recent_action: "Created packet-root plan.md"
    next_safe_action: "Verify validate.sh --strict passes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:011-resource-map-template-root-plan"
      session_id: "011-resource-map-template-root-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Resource Map Template

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (CJS), TypeScript, Shell |
| **Framework** | Node.js, Vitest |
| **Storage** | Local filesystem (spec folder packet directories) |
| **Testing** | Vitest (unit + snapshot), bash validate.sh (spec-doc validation) |

### Overview

Three sequential sub-phases deliver the resource-map-template initiative. Phase 001 repairs the local-owner deep-loop artifact contract by rolling back the centralized placement policy and migrating misplaced child packets repo-wide. Phase 002 creates the reusable `resource-map.md` template and wires it into all discovery surfaces. Phase 003 builds a shared evidence extractor and integrates convergence-time resource-map emission into both deep-loop skills.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] Phase 001: `review-research-paths.cjs` local-owner rollback complete and tested
- [ ] Phase 002: Template file exists with correct frontmatter and ten category sections
- [ ] Phase 003: Phase 001 rollback confirmed; Phase 002 template shape locked

### Definition of Done

- [ ] All three sub-phases at completion_pct 100
- [ ] `validate.sh --strict` exits 0 on all three sub-phase folders and this packet root
- [ ] Vitest passes for shared evidence extractor
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Local-owner artifact resolution (filesystem policy) + optional cross-cutting template + convergence-hook plumbing.

### Key Components

- **`review-research-paths.cjs`**: Canonical resolver for local-owner packet paths — shared across all deep-loop invocations.
- **`resource-map.md` template**: Cross-cutting optional template; ten-category path ledger for any packet.
- **`extract-from-evidence.cjs`**: Shared extractor — ingests per-iteration delta JSON, emits filled `resource-map.md` string; supports both review and research shapes.
- **`reduce-state.cjs` (×2)**: Integration point in both `sk-deep-review` and `sk-deep-research`; calls extractor at convergence and writes to the resolved `{artifact_dir}`.

### Data Flow

Iteration deltas accumulate in `{artifact_dir}/deltas/`. At convergence, `reduce-state.cjs` calls the shared extractor with the accumulated deltas; the extractor categorizes paths and appends dimension-specific columns (findings counts for review, citation counts for research); the filled markdown is written to `{artifact_dir}/resource-map.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: 001-reverse-parent-research-review-folders (COMPLETE)

- [x] Roll back `review-research-paths.cjs` to local-owner path policy
- [x] Update command YAMLs, docs, mirrors, and tests to match restored contract
- [x] Repo-wide migration of misplaced child packets to owning phase folders
- [x] Document historical origin of the centralized behavior
- [x] Create phase-local rollback ledger `resource-map.md`
- [x] Rebase Phase 003 dependency docs onto restored local-owner contract

### Phase 2: 002-resource-map-template-creation (IN PROGRESS — 85%)

- [x] Create `resource-map.md` template at templates root with ten categories
- [x] Update all five level READMEs to list the template as optional
- [x] Update main templates README with structure row and workflow notes
- [x] Update SKILL.md and skill README to reference the template
- [x] Update `references/templates/level_specifications.md` cross-cutting row
- [x] Add `resource-map.md` to `SPEC_DOCUMENT_FILENAMES` in `spec-doc-paths.ts`
- [x] Create feature catalog entry and manual testing playbook entry
- [x] Update CLAUDE.md Documentation Levels note
- [ ] Rerun `validate.sh --strict` and confirm exit 0

### Phase 3: 003-resource-map-deep-loop-integration (COMPLETE)

- [x] Create `scripts/resource-map/extract-from-evidence.cjs` with both review/research shapes
- [x] Integrate extractor call into `sk-deep-review/scripts/reduce-state.cjs` at convergence
- [x] Integrate extractor call into `sk-deep-research/scripts/reduce-state.cjs` at convergence
- [x] Update all four YAML workflows with post-convergence emission step
- [x] Update both SKILL.md surfaces and command docs
- [x] Update both `convergence.md` references
- [x] Create feature catalog and manual testing playbook entries for both skills
- [x] Add Vitest coverage for shared extractor (both delta shapes, snapshot assertions)
- [x] Close F001–F004 from 7-iteration deep-review

### Phase 4: Verification

- [ ] `validate.sh --strict` on packet root exits 0
- [ ] All sub-phase checklists fully marked
- [ ] Packet-root Level 3 docs complete and synchronized
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Extractor both shapes; path resolver root/child/nested/rerun cases | Vitest |
| Integration | Deep-loop convergence writes correct local-owner `resource-map.md` | Manual + Vitest fixtures |
| Validation | All spec-doc structure, frontmatter, anchors | `validate.sh --strict` |
| Manual | Operator workflow: copy template, fill rows, run deep-loop, inspect output | Browser / CLI |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 rollback | Internal | Complete | Phase 003 cannot emit to correct paths |
| Phase 002 template shape | Internal | In Progress | Phase 003 extractor output format depends on stable template |
| `review-research-paths.cjs` resolver | Internal | Complete | Canonical path resolution for both deep-loop skills |
| Vitest in mcp_server | Internal | Partial (config issue) | T030 vitest command deferred; extractor assertions pass with root override |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Path resolver regression causing artifacts to land in wrong folder.
- **Procedure**: Revert `review-research-paths.cjs` to the pre-rollback commit; re-run migration in reverse; no database or external state affected.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 001 (Rollback) ──────────────► Phase 003 (Emission)
                                            ▲
Phase 002 (Template) ──────────────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 001-reverse | None | 003-integration |
| 002-template | None | 003-integration (template shape) |
| 003-integration | 001-reverse, 002-template | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| 001-reverse | High | Complete |
| 002-template | Medium | In Progress (~85%) |
| 003-integration | High | Complete |
| **Total** | | **~3 work sessions** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Local-owner path contract verified via resolver tests
- [x] Template wired to all discovery surfaces
- [x] Extractor vitest passing with snapshot assertions

### Rollback Procedure
1. Revert `review-research-paths.cjs` to the parent-root version (git revert target commit)
2. Re-run `migrate-deep-loop-local-owner.cjs` in reverse to restore centralized placement
3. Remove `resource-map.md` template entry from `SPEC_DOCUMENT_FILENAMES`
4. Revert YAML workflow changes in all four command YAMLs

### Data Reversal
- **Has data migrations?** Yes (packet directory relocations in Phase 001)
- **Reversal procedure**: Use git history to restore original packet paths; no DB rollback needed
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────────┐     ┌──────────────────────┐
│ 001-reverse-parent   │────►│ 003-deep-loop-integ   │
│ research-review      │     │ resource-map emission │
└──────────────────────┘     └──────────────────────┘
                                       ▲
┌──────────────────────┐               │
│ 002-template-        │───────────────┘
│ creation             │
└──────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| 001-reverse | None | Local-owner resolver | 003-integration |
| 002-template | None | `resource-map.md` template shape | 003-integration |
| 003-integration | 001, 002 | Auto-emitted resource maps at convergence | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 001 (Rollback)** - Complete - CRITICAL
2. **Phase 003 (Emission)** - Complete - CRITICAL (depends on 001)
3. **Phase 002 (Template)** - 85% - CRITICAL (blocking final validation)

**Total Critical Path**: Three phases; Phase 001 and 002 are now unblocked; Phase 003 complete.

**Parallel Opportunities**:
- Phase 001 and Phase 002 were parallelizable (no shared state)
- Phase 003 required both 001 and 002 to be stable before starting
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Local-owner contract restored | Resolver tests pass; migration complete | Phase 001 done |
| M2 | Template wired to all surfaces | validate.sh exits 0 on 002 packet | Phase 002 done |
| M3 | Convergence emission live | Deep-loop runs produce resource-map.md | Phase 003 done |
| M4 | Packet root docs complete | validate.sh exits 0 on root; all checklists marked | 2026-04-24 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Local-Owner vs. Parent-Root Artifact Placement

**Status**: Accepted

**Context**: A prior change introduced centralized parent-root placement for deep-loop artifacts, scattering child-phase history away from the owning spec.

**Decision**: Restore local-owner placement: root specs keep root-local `research/` and `review/`; child phases and sub-phases own their own local `research/` or `review/` packet folders.

**Consequences**:
- Reviewers find all loop artifacts beside the target spec.
- Parent-root folders are no longer the landing zone for child-phase runs.

**Alternatives Rejected**:
- Keep parent-root placement: rejected because it broke local ownership and made successor-phase navigation require ancestor traversal.
