---
title: "Implementation Plan: skill references assets alignment [template:level_3/plan.md]"
description: "Three-phase audit plan for SKILL.md, references, and Markdown assets."
trigger_phrases:
  - "skill references assets alignment plan"
  - "round 5 plan"
  - "system spec kit references audit"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "scaffold/005-skill-references-assets-alignment"
    last_updated_at: "2026-05-02T06:36:10Z"
    last_updated_by: "codex"
    recent_action: "Defined three-phase audit plan"
    next_safe_action: "Execute inventory and grep"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/SKILL.md"
      - ".opencode/skill/system-spec-kit/references/"
      - ".opencode/skill/system-spec-kit/assets/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/005-skill-references-assets-alignment"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: skill references assets alignment

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, shell verification, TypeScript test harness |
| **Framework** | system-spec-kit Level contract |
| **Storage** | Local repository files |
| **Testing** | `rg`, vitest, `validate.sh --strict`, Markdown readability checks |

### Overview
This packet audits the final AI-facing system-spec-kit documentation surface not covered by earlier cleanup rounds. The approach is inventory-first: grep for named stale patterns, inspect surrounding context, apply narrow documentation edits, then verify workflow invariance and packet validation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified from packets 003 and 004

### Definition of Done
- [x] All acceptance criteria met
- [x] Workflow-invariance vitest passing
- [x] 005, 003, 004, and sentinel validations recorded
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation audit with contextual triage.

### Key Components
- **Skill entry doc**: `SKILL.md`, the highest-traffic skill routing surface.
- **Reference docs**: recursive `references/` Markdown that explains hooks, structure, templates, validation, and workflows.
- **Assets**: Markdown matrices and mappings used by authors and agents.

### Data Flow
Inventory produces the file set. Grep produces candidate stale and vocabulary hits. Manual context review classifies each hit. Edits update the docs. Verification checks prove no stale named patterns remain and the validation workflow still passes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: SKILL.md sweep
- [ ] Inventory `SKILL.md` hits.
- [ ] Remove stale references and rewrite current behavior.
- [ ] Keep current-feature mentions brief and command-oriented.

### Phase 2: references sweep
- [ ] Audit `references/hooks/`.
- [ ] Audit `references/structure/` and `references/templates/`.
- [ ] Audit `references/validation/` and `references/workflows/`.
- [ ] Audit root reference Markdown files.

### Phase 3: assets sweep and verification
- [ ] Audit Markdown files in `assets/`.
- [ ] Add new-feature mentions where they naturally belong.
- [ ] Run Gates A through E and populate final packet docs.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Search gate | Stale deleted-path references | `rg` |
| Workflow regression | Workflow invariance | vitest |
| Spec validation | 005 plus 003, 004, and sentinel packets | `validate.sh --strict` |
| Readability | In-scope Markdown parses as text and has no unreadable binary content | `find`, shell reads |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 004 validation orchestrator | Internal | Green | Current-feature documentation would lack a reliable source |
| Existing vitest install | Internal | Unknown until run | Gate B may block completion if workflow invariance fails |
| Historical packet paths | Internal | Unknown until run | Regression validation may need path-specific notes |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A verification gate shows the documentation edits broke workflow guidance or validation behavior.
- **Procedure**: Revert only the 005 packet's edits to in-scope skill docs, reference docs, assets, and parent metadata, then rerun the failing gate.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (SKILL.md) ─────┐
                        ├──► Phase 3 (Assets + Verify)
Phase 2 (References) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| SKILL.md sweep | Packet docs | Final verification |
| References sweep | Packet docs | Final verification |
| Assets and verification | SKILL.md sweep, references sweep | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| SKILL.md sweep | Low | 5-10 minutes |
| References sweep | Medium | 25-35 minutes |
| Assets and verification | Medium | 15-20 minutes |
| **Total** | | **45-65 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Work stays on `main`.
- [x] No commits are created.
- [ ] Verification commands record actual output.

### Rollback Procedure
1. Identify files modified by this packet with `git diff --name-only`.
2. Revert only this packet's in-scope documentation edits.
3. Preserve unrelated existing working tree changes.
4. Rerun the failed verification gate.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐
│ Packet Docs │────►│ Inventory   │
└─────────────┘     └──────┬──────┘
                           │
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ SKILL.md    │     │ References  │     │ Assets      │
└──────┬──────┘     └──────┬──────┘     └──────┬──────┘
       └───────────────────┴───────────────────┘
                           ▼
                    ┌─────────────┐
                    │ Verification│
                    └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Packet docs | Scaffold | Audit boundary and plan | Inventory |
| Inventory | Packet docs | File count and hit lists | Edits |
| Documentation edits | Inventory | Aligned docs | Verification |
| Verification | Documentation edits | Gate evidence | Completion summary |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Scaffold and packet docs** - 10 minutes - CRITICAL
2. **Inventory and grep triage** - 15 minutes - CRITICAL
3. **Apply documentation edits** - 25 minutes - CRITICAL
4. **Run Gates A through E** - 10 minutes - CRITICAL

**Total Critical Path**: 60 minutes

**Parallel Opportunities**:
- Inventory commands can run while reviewing generated packet docs.
- Hit triage can be grouped by directory to keep edits small.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Target | Evidence |
|-----------|--------|----------|
| M1 | Packet docs authored | 005 spec docs validate |
| M2 | Stale references removed | Gate A grep returns no hits |
| M3 | Regression checked | Gates B through E recorded |
<!-- /ANCHOR:milestones -->
