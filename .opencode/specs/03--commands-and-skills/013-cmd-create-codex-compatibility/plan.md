---
title: "Implementation Plan: Create Commands Codex Compatibility [012-create-codex-compatibility/plan]"
description: "level: 3"
trigger_phrases:
  - "implementation"
  - "plan"
  - "create"
  - "commands"
  - "codex"
  - "012"
importance_tier: "important"
contextType: "decision"
completed: 2026-02-17
created: 2026-02-17
level: 3
status: done
---
<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Implementation Plan: Create Commands Codex Compatibility

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML, Markdown (no runtime code) |
| **Framework** | OpenCode command infrastructure |
| **Storage** | File system (command definitions, workflow templates) |
| **Testing** | Manual grep verification (7 checks) |

### Overview
This implementation applies the proven three-pronged Codex compatibility approach from spec 010 to all 20 create command files. Change A strips `## Agent Routing` sections and HTML comment guards from `.md` files. Change B adds `## CONSTRAINTS` sections with explicit anti-dispatch rules. Change C restructures YAML `agent_routing:` blocks to `agent_availability:` with non-imperative language. Change D cleans up stale emoji optionality language across all files.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Spec 010 approach proven and verified
- [x] All 20 target files identified
- [x] Success criteria measurable (7 grep checks)

### Definition of Done
- [x] All 7 verification checks pass
- [x] All 20 files modified
- [x] Documentation updated (spec/plan/tasks/checklist)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Three-pronged Codex compatibility approach (identical to spec 010):

1. **Strip** -- Remove agent routing sections and weak guards from `.md` files
2. **Constrain** -- Add explicit `## CONSTRAINTS` with anti-dispatch rules to `.md` files
3. **Restructure** -- Rename and reformat YAML agent metadata to non-imperative language

### Key Differences from Spec 010
- In create commands, `agent_routing:` is embedded inside individual workflow steps (better encapsulation than spec_kit top-level blocks)
- Two complexity tiers: `skill.md` and `agent.md` have 3 agents each; 4 other `.md` files have 1 agent each
- Additional Change D (emoji cleanup) bundled to avoid revisiting 14 YAML files

### Data Flow
Command file read by agent --> `.md` read for instructions --> YAML loaded for workflow steps --> Agent availability metadata consulted at each step
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Spec Folder Creation (COMPLETE)
- [x] Create spec folder `012-create-codex-compatibility`
- [x] Write initial spec.md

### Phase 2: skill.md + 2 YAMLs (COMPLETE)
- [x] Strip 3-agent `## Agent Routing` from `skill.md`
- [x] Remove `<!-- REFERENCE ONLY/END -->` guards from `skill.md`
- [x] Add `## CONSTRAINTS` section to `skill.md`
- [x] Restructure 3 `agent_routing:` blocks in `create_skill_auto.yaml`
- [x] Restructure 3 `agent_routing:` blocks in `create_skill_confirm.yaml`

### Phase 3: agent.md + 2 YAMLs (COMPLETE)
- [x] Strip 3-agent `## Agent Routing` from `agent.md`
- [x] Remove guards, add CONSTRAINTS to `agent.md`
- [x] Restructure 3 blocks in `create_agent_auto.yaml`
- [x] Restructure 3 blocks in `create_agent_confirm.yaml`

### Phase 4: folder_readme.md + 2 YAMLs (COMPLETE)
- [x] Strip 1-agent `## Agent Routing` from `folder_readme.md`
- [x] Remove guards, add CONSTRAINTS, remove emoji line from `folder_readme.md`
- [x] Restructure 1 block + emoji cleanup + rename `emoji_conventions:` to `section_icons:` in `create_folder_readme_auto.yaml`
- [x] Restructure 1 block + emoji cleanup + rename in `create_folder_readme_confirm.yaml`

### Phase 5: install_guide.md + 2 YAMLs (COMPLETE)
- [x] Strip 1-agent `## Agent Routing` from `install_guide.md`
- [x] Remove guards, add CONSTRAINTS to `install_guide.md`
- [x] Restructure 1 block + emoji cleanup in `create_install_guide_auto.yaml`
- [x] Restructure 1 block + emoji cleanup in `create_install_guide_confirm.yaml`

### Phase 6: skill_asset.md + 2 YAMLs (COMPLETE)
- [x] Strip 1-agent `## Agent Routing` from `skill_asset.md`
- [x] Remove guards, add CONSTRAINTS to `skill_asset.md`
- [x] Restructure 1 block + emoji cleanup in `create_skill_asset_auto.yaml`
- [x] Restructure 1 block + emoji cleanup in `create_skill_asset_confirm.yaml`

### Phase 7: skill_reference.md + 2 YAMLs (COMPLETE)
- [x] Strip 1-agent `## Agent Routing` from `skill_reference.md`
- [x] Remove guards, add CONSTRAINTS to `skill_reference.md`
- [x] Restructure 1 block + emoji cleanup in `create_skill_reference_auto.yaml`
- [x] Restructure 1 block + emoji cleanup in `create_skill_reference_confirm.yaml`

### Phase 8: Emoji Cleanup Pass (COMPLETE)
- [x] Remove all emoji optionality language from remaining files
- [x] Rename `emoji_conventions:` to `section_icons:` in folder_readme YAMLs
- [x] Verify `[Ee]moji` returns 0 matches across all create/ files

### Phase 9: Final Verification (COMPLETE)
- [x] Run all 7 grep verification checks
- [x] All checks pass with expected counts
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep Verification | 7 pattern checks across 20 files | `grep -r` / `rg` |
| Manual Inspection | Spot-check restructured YAML blocks | Text editor |
| Functional | Verify commands still load correctly | Claude command execution |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Spec 010 approach proven | Internal | Green | Cannot reuse pattern without precedent |
| Write access to create/ | Internal | Green | Cannot modify files |
| Spec 011 emoji policy | Internal | Green | Aligns emoji cleanup direction |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Command files fail to load or agents dispatch incorrectly
- **Procedure**:
  1. Git revert commit(s) that modified create command files
  2. Verify all 20 files restored to pre-change state
  3. Document failure reason in decision-record.md
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Spec)
    |
    v
Phases 2-7 (Per-command changes) ──► Phase 8 (Emoji cleanup) ──► Phase 9 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | None | Phases 2-7 |
| Phases 2-7 | Phase 1 | Phase 8 |
| Phase 8 | Phases 2-7 | Phase 9 |
| Phase 9 | Phase 8 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1 (Spec) | Low | 0.5 hours |
| Phases 2-3 (3-agent .md + YAMLs) | Medium | 1.5 hours |
| Phases 4-7 (1-agent .md + YAMLs) | Low | 2 hours |
| Phase 8 (Emoji cleanup) | Low | 0.5 hours |
| Phase 9 (Verification) | Low | 0.5 hours |
| **Total** | | **5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Current file state documented (git tracked)
- [x] Verification checks defined (7 grep patterns)
- [x] Backup available via git history

### Rollback Procedure
1. Identify failing command or incorrect agent dispatch
2. Git revert commit(s) modifying `.opencode/command/create/`
3. Re-run 7 verification checks against reverted files
4. Document root cause

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (static file changes only)
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
                 ┌──────────────┐
                 │   Phase 1    │
                 │ Spec Folder  │
                 └──────┬───────┘
                        │
         ┌──────────────┼──────────────┐
         │              │              │
    ┌────▼────┐    ┌────▼────┐   ┌────▼────┐
    │Phase 2  │    │Phase 3  │   │Phase 4-7│
    │skill.md │    │agent.md │   │ 4 x 1-  │
    │+ 2 YAML │    │+ 2 YAML │   │agent .md│
    └────┬────┘    └────┬────┘   └────┬────┘
         │              │              │
         └──────────────┼──────────────┘
                        │
                 ┌──────▼───────┐
                 │   Phase 8    │
                 │ Emoji Cleanup│
                 └──────┬───────┘
                        │
                 ┌──────▼───────┐
                 │   Phase 9    │
                 │ Verification │
                 └──────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Spec folder | None | Documentation structure | All phases |
| Per-command changes | Spec folder | Modified .md + .yaml files | Emoji cleanup |
| Emoji cleanup | Per-command changes | Clean emoji references | Verification |
| Verification | All changes complete | 7 passing checks | Completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1** - 0.5 hours - Create spec folder
2. **Phases 2-7** - 3.5 hours - Modify all 20 files (can be parallelized per command)
3. **Phase 8** - 0.5 hours - Emoji cleanup pass
4. **Phase 9** - 0.5 hours - Final verification

**Total Critical Path**: 5 hours

**Parallel Opportunities**:
- Phases 2-7 are independent and can be executed in parallel
- Each phase modifies one .md file + its 2 YAML workflow files
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Status |
|-----------|-------------|------------------|--------|
| M1 | Spec folder created | spec.md written | COMPLETE |
| M2 | 3-agent commands done | skill.md + agent.md + 4 YAMLs modified | COMPLETE |
| M3 | 1-agent commands done | 4 remaining .md + 8 YAMLs modified | COMPLETE |
| M4 | Emoji cleanup done | `[Ee]moji` returns 0 matches | COMPLETE |
| M5 | All verified | 7/7 grep checks pass | COMPLETE |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORDS

### ADR-001: Reuse Three-Pronged Approach from Spec 010

**Status**: Accepted

**Context**: Create command files exhibit the same Codex compatibility issues as spec_kit commands (agent routing interpreted as dispatch instructions). We need to decide whether to apply the same approach or develop a create-specific strategy.

**Decision**: Apply identical three-pronged strategy (strip, constrain, restructure) for consistency across the entire command infrastructure.

**Consequences**:
- Consistent approach across spec_kit and create commands
- Proven pattern reduces implementation risk
- Easier to verify (same grep patterns work)
- Cannot optimize for create-specific structure (acceptable trade-off)

**Alternatives Rejected**:
- Create-specific approach: Unnecessary divergence, higher risk, harder to maintain

---

### ADR-002: Bundle Emoji Cleanup (Change D)

**Status**: Accepted

**Context**: Spec 011 established that emoji enforcement should be removed. Create command files still contain stale emoji optionality language. We need to decide whether to clean this up now or in a separate pass.

**Decision**: Bundle emoji cleanup into this spec to avoid revisiting 14 YAML files in a separate pass.

**Consequences**:
- Single pass over all 14 YAML files (efficient)
- Aligned with spec 011 policy
- Slightly larger scope for this spec (acceptable)
- All emoji references removed from create/ in one operation

**Alternatives Rejected**:
- Separate spec: Would re-edit the same 14 YAML files, doubling touch points

---

<!--
LEVEL 3 PLAN
- Core + L2 + L3 addendums
- Dependency graphs, milestones, ADRs
- Status: COMPLETE (2026-02-17)
-->
