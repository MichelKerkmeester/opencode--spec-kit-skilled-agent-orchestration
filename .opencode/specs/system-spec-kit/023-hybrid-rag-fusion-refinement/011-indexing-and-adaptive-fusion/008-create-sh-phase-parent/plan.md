---
title: "Implementation Plan: Append Nested Child Phases in create.sh [system-spec-kit/023-hybrid-rag-fusion-refinement/011-indexing-and-adaptive-fusion/008-create-sh-phase-parent]"
description: "Plan the create.sh changes that will add nested parent append support for .opencode/specs while preserving current flat-phase workflows."
trigger_phrases:
  - "create sh phase parent plan"
  - "nested phase append plan"
  - "phase-parent alias plan"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: Append Nested Child Phases in create.sh

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash shell script |
| **Framework** | `.opencode/skill/system-spec-kit/scripts/spec/create.sh` |
| **Storage** | Spec folder filesystem under `specs/` and `.opencode/specs/` |
| **Testing** | Script invocation checks and `validate.sh --strict` for planning docs |

### Overview

This phase defines how `create.sh` should support appending child phases to nested parent folders under `.opencode/specs/`. The real script facts that drive the plan are: `--phase-parent` does not exist today, `--parent` is the current phase append flag, `resolve_and_validate_spec_path()` validates only the basename against `^[0-9]{3}-[A-Za-z0-9._-]+$`, nested parent paths fail current expectations, and `SPECS_DIR` always points at `$REPO_ROOT/specs`. The planned fix is to accept `--phase-parent`, relax nested-path handling without weakening safety, and derive append output from the validated parent tree.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Current script behavior documented from source
- [x] Real failure modes listed in the phase spec
- [x] Scope limited to planning and documentation only

### Definition of Done
- [x] Implementation path is documented for argument parsing, path validation, and output resolution
- [x] Verification plan covers flat and nested trees plus bad-path rejection
- [x] ADR captures why parent-derived resolution is the chosen design
- [x] `create.sh` has been modified with all planned changes
<!-- /ANCHOR:quality-gates -->

---

### AI Execution Protocol

### Pre-Task Checklist
- Confirm the phase modifications to `create.sh` stay within nested append scope
- Confirm the known current facts still match the script: no `--phase-parent`, current `--parent`, and `SPECS_DIR` rooted at `$REPO_ROOT/specs`.
- Confirm the target nested parent example remains the same reproduction case.

### Execution Rules
- Keep edits scoped to nested phase append behavior only.
- Preserve backward compatibility expectations for `--phase --parent`.
- Verify parser, path, and numbering behavior after each change.

### Status Reporting Format
- Use `IN_PROGRESS`, `BLOCKED`, or `DONE` with the target script area, such as parser, path validation, or append numbering.

### Blocked Task Protocol
- If planned behavior cannot stay backward compatible, record the conflict explicitly and stop before widening the script change.
- If a reproduction path or validation expectation is unclear, document the open question and defer implementation rather than guessing.

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Minimal behavioral extension of the existing phase append flow.

### Key Components
- **Flag Parsing Layer**: Parse `--phase-parent` into the same internal variable currently used by `--parent` so callers get a clearer phase-specific flag without losing compatibility.
- **Path Validation Layer**: Keep approved-root checks, but validate the final resolved leaf folder while allowing multi-segment relative paths under approved roots.
- **Append Resolution Layer**: Once the parent is validated, use that parent directory as the source of truth for tree selection and child number scanning.
- **Verification Layer**: Prove behavior against nested `.opencode/specs/` parents, flat `specs/` parents, and rejected invalid paths.

### Data Flow
```
CLI args -> flag normalization -> parent path resolution -> approved-root check
approved-root check -> leaf folder validation -> append mode selection
append mode selection -> child number scan under parent -> child folder creation
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Script Design
- [x] Define how `--phase-parent` maps to the current internal parent variable
- [x] Define precedence and conflict rules if both `--parent` and `--phase-parent` are passed
- [x] Define allowed nested parent path forms for relative and absolute input

### Phase 2: Planned Core Changes
- [x] Update argument parsing in `create.sh`
- [x] Adjust `resolve_and_validate_spec_path()` behavior for nested paths under approved roots
- [x] Replace `SPECS_DIR` assumptions in append mode with parent-derived output resolution
- [x] Define child number scanning rules that ignore `memory/`, `scratch/`, and non-phase entries

### Phase 3: Planned Verification
- [x] Verify nested append under `.opencode/specs/`
- [x] Verify flat append under `specs/`
- [x] Verify invalid parent rejection
- [x] Verify help text and examples
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual script test | Nested `.opencode/specs/` parent append | Bash invocation of `create.sh` |
| Manual script test | Flat `specs/` parent append regression | Bash invocation of `create.sh` |
| Manual script test | Invalid parent path rejection | Bash invocation of `create.sh` |
| Structural | Placeholder-free documentation and template alignment | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Current `create.sh` parser and append flow | Internal | Required | Cannot design a compatible fix |
| `resolve_and_validate_spec_path()` | Internal | Required | Nested path handling stays broken or unsafe |
| Nested parent folder under `.opencode/specs/` | Internal | Required | No realistic reproduction case for the target bug |
| Existing flat parent append flow | Internal | Required | Regression risk stays unmeasured |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The planned fix appears to break flat behavior or weakens path safety during implementation.
- **Procedure**: Keep the existing append flow intact, back out the parent-derived changes, and reintroduce nested support in smaller steps with explicit regression cases.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
design decisions -> parser and path changes -> verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Script Design | Current behavior facts | Planned Core Changes |
| Planned Core Changes | Script Design | Planned Verification |
| Planned Verification | Planned Core Changes | Phase closure |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Script Design | Medium | 30-60 minutes |
| Planned Core Changes | High | 1.5-3 hours |
| Planned Verification | Medium | 45-90 minutes |
| **Total** | | **2.75-5.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Confirm both `--parent` and `--phase-parent` behavior are documented before implementation begins
- [ ] Confirm nested `.opencode/specs/` reproduction case exists
- [ ] Confirm no unrelated script cleanup is folded into the change

### Rollback Procedure
1. Remove `--phase-parent` parsing if it destabilizes the append flow
2. Restore the last known-good append behavior for flat parents
3. Reintroduce nested path handling behind smaller, testable changes
4. Re-run append verification on both flat and nested trees

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Delete only incorrectly created phase folders if a bad test run creates them.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
current script facts
        |
        v
  flag design and precedence
        |
        v
  nested path validation rules
        |
        v
  parent-derived append resolution
        |
        v
  numbering and output checks
        |
        v
      verification
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Flag design | Current parser behavior | Clear CLI contract | Validation changes |
| Validation changes | Flag design | Safe nested path acceptance | Output resolution |
| Output resolution | Validation changes | Correct target tree | Numbering checks |
| Numbering checks | Output resolution | Correct child folder creation | Verification |
| Verification | All implementation changes | Confidence in flat and nested behavior | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Define flag and precedence behavior** - 20-30 minutes - CRITICAL
2. **Implement nested path validation safely** - 45-90 minutes - CRITICAL
3. **Switch append resolution to the validated parent tree** - 30-60 minutes - CRITICAL
4. **Verify flat and nested append cases** - 45-90 minutes - CRITICAL

**Total Critical Path**: about 2.5-4.5 hours

**Parallel Opportunities**:
- Help text updates can happen while verification cases are being prepared
- Flat regression checks and nested checks can run independently once the code path is stable
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Design locked | Flag, validation, and append-resolution rules agreed | Start of implementation |
| M2 | Core script update ready | Parser and append logic support nested parents | Mid implementation |
| M3 | Verification complete | Flat and nested append cases both pass | End of implementation |
| M4 | Documentation updated | Help output and phase docs match real behavior | Phase close |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for the formal ADRs for this phase.

### ADR-P001: Resolve Append Output from the Validated Parent Folder

**Status**: Proposed

**Context**: `SPECS_DIR` currently points at `$REPO_ROOT/specs`, which is wrong for nested `.opencode/specs/` work. Append mode already knows the parent folder path, so using a global root is unnecessary and brittle.

**Decision**: In append mode, derive child creation, numbering, and output placement from the validated parent folder rather than from `SPECS_DIR`. Keep `SPECS_DIR` for new top-level creation only unless later work finds a better unification path.

**Consequences**:
- Nested `.opencode/specs/` parents can work without special-case output rewrites
- Flat `specs/` parents still work because the parent folder remains the source of truth
- The implementation must be careful not to accidentally alter non-append creation flows

**Alternatives Rejected**:
- Teach `SPECS_DIR` to switch roots globally based on the current task. Rejected because it spreads context-sensitive behavior farther than needed.
