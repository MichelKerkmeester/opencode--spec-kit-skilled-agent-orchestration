---
title: "Implementation Plan: Merge spec_kit:phase into plan and [03--commands-and-skills/037-cmd-merge-spec-kit-phase/plan]"
description: "Absorb the standalone /spec_kit:phase command into the plan and complete commands by adding a :with-phases optional workflow flag. This follows the identical pattern used by :wi..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "merge"
  - "spec"
  - "kit"
  - "037"
  - "cmd"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: Merge spec_kit:phase into plan and complete

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (command prompts), YAML (workflow configs) |
| **Framework** | SpecKit command system |
| **Storage** | File-based (`.opencode/command/spec_kit/`) |
| **Testing** | Manual verification via `/spec_kit:plan:auto :with-phases` |

### Overview
Absorb the standalone `/spec_kit:phase` command into the plan and complete commands by adding a `:with-phases` optional workflow flag. This follows the identical pattern used by `:with-research` in the complete command: an optional pre-workflow that creates phase folder structure before the normal planning/complete steps begin. The underlying `create.sh --phase` infrastructure and addendum templates remain unchanged.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `:with-phases` flag works in both plan and complete commands
- [ ] Standalone phase command files deleted
- [ ] Primary docs updated (CLAUDE.md, README.txt)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Optional workflow injection — same pattern as `:with-research` in the spec_kit:complete command.

### Key Components
- **Plan + complete commands**: Add `:with-phases` to mode parsing, argument-hint, and documentation
- **YAML auto/confirm assets**: Add `phase_decomposition` block under `optional_workflows` with 4 sub-steps
- **Setup phase**: Parse `--phases N`, `--phase-names "a,b,c"` from arguments; ask phase-specific questions only when `:with-phases` flag present

### Data Flow
```
User invokes /spec_kit:plan:auto "feature" :with-phases --phases 3
  -> Setup phase parses :with-phases flag + --phases/--phase-names
  -> Phase decomposition pre-workflow runs (4 steps):
     1. Analyze scope (recommend-level.sh --recommend-phases)
     2. Define decomposition (names, boundaries, dependencies)
     3. Create folders (create.sh --phase --phases N)
     4. Populate parent + children (addendum templates)
  -> Checkpoint: "Phase decomposition complete. Continue planning first child? [Y/n]"
  -> Normal plan workflow (Steps 1-7) targets first child phase folder
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Modify plan and complete command files
- [ ] Add `:with-phases` to argument-hint in frontmatter
- [ ] Add `:with-phases` to mode parsing in execution protocol
- [ ] Add phase decomposition section with workflow description
- [ ] Add `--phases N` and `--phase-names "list"` flag parsing
- [ ] Add phase-specific setup questions (conditional on `:with-phases`)
- [ ] Update command chain references
- [ ] Update examples section

### Phase 2: Modify YAML workflow assets (4 files)
- [ ] Add `phase_decomposition` to `optional_workflows` in plan auto YAML
- [ ] Add `phase_decomposition` to `optional_workflows` in plan confirm YAML
- [ ] Add `phase_decomposition` to `optional_workflows` in complete auto YAML
- [ ] Add `phase_decomposition` to `optional_workflows` in complete confirm YAML
- [ ] Each YAML gets: trigger, insert_point, 4-step workflow, checkpoint, template refs

### Phase 3: Delete phase command and update references
- [ ] Delete standalone phase command file
- [ ] Delete phase auto YAML asset
- [ ] Delete phase confirm YAML asset
- [ ] Update README.txt — remove phase row, add `:with-phases` documentation
- [ ] Update CLAUDE.md quick reference table
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Invoke `/spec_kit:plan:auto "test" :with-phases --phases 2` and verify folder creation | CLI |
| Manual | Invoke `/spec_kit:plan:auto "test"` (without `:with-phases`) and verify no regression | CLI |
| Manual | Verify `/spec_kit:phase` invocation fails gracefully after deletion | CLI |
| Manual | Verify YAML syntax validity of all 4 modified assets | Read + visual |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `create.sh --phase` | Internal script | Green | None — unchanged |
| Phase addendum templates | Internal templates | Green | None — unchanged |
| `recommend-level.sh --recommend-phases` | Internal script | Green | None — unchanged |
| `:with-research` pattern in complete command | Internal pattern | Green | Blueprint for implementation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Phase decomposition integration breaks existing plan/complete workflows
- **Procedure**: `git revert` the commit; restore phase command and YAML assets from git history
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
<!-- ANCHOR:dependencies -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Command files) ──► Phase 2 (YAML assets) ──► Phase 3 (Cleanup + Refs)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | None | Phase 2 (YAML must match command docs) |
| Phase 2 | Phase 1 | Phase 3 (assets must be valid before deleting old) |
| Phase 3 | Phase 2 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
<!-- /ANCHOR:dependencies -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Command files | Medium | 2 files, ~80 LOC each |
| Phase 2: YAML assets | Medium | 4 files, ~40 LOC each |
| Phase 3: Cleanup + Refs | Low | 3 deletes + 2 updates |
| **Total** | | **~320 LOC** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Git branch created before changes
- [ ] All 4 YAML files backed up (git handles this)

### Rollback Procedure
1. `git revert <commit>` — restores all deleted files and reverts modifications
2. Verify `/spec_kit:phase` command works again
3. Verify `/spec_kit:plan` and `/spec_kit:complete` work without `:with-phases` flag

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — pure file changes, fully reversible via git
<!-- /ANCHOR:enhanced-rollback -->
