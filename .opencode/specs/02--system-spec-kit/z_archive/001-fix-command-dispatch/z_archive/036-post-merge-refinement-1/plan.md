---
title: "Post-Merger Refinement Plan [036-post-merge-refinement-1/plan]"
description: "id: 036-post-merge-refinement"
trigger_phrases:
  - "post"
  - "merger"
  - "refinement"
  - "plan"
  - "036"
importance_tier: "important"
contextType: "decision"
id: 036-post-merge-refinement
phase: Planning
---
# Implementation Plan

## Phase 1: Critical Fixes (P0)

### 1.1 Create validate-spec.sh Script
**Priority**: P0 - BLOCKER
**Effort**: Medium (2-3 hours)

**Tasks**:
1. Review SKILL.md:537-636 for documented behavior
2. Create `scripts/validate-spec.sh` implementing:
   - Exit codes: 0=pass, 1=warning, 2=error
   - 7 validation rules from documentation
   - Strict mode via SPECKIT_STRICT
   - Configuration options
3. Test with existing spec folders
4. Verify Gate 6 integration

**Alternative**: Remove 100+ lines of documentation if script not needed

### 1.2 Fix MCP Tool Naming in SKILL.md
**Priority**: P0
**Effort**: Low (30 min)

**Tasks**:
1. Update SKILL.md:107-112 to use full `semantic_memory_*` prefix
2. Update SKILL.md:389-397 tool table
3. Add note explaining shorthand vs actual names
4. Verify all tool references in document

### 1.3 Create or Remove recommend-level.sh
**Priority**: P0
**Effort**: Low-Medium

**Decision Required**:
- Option A: Create script that analyzes LOC and recommends level
- Option B: Remove reference from SKILL.md:172

## Phase 2: High-Priority Fixes (P1)

### 2.1 Fix Placeholder Validation
**Priority**: P1
**Effort**: Low (15 min)

**Tasks**:
1. Update `check-placeholders.sh` to also detect `\{\{[^}]+\}\}` pattern
2. Test against memory/context.md template

### 2.2 Consolidate Lib Directories
**Priority**: P1
**Effort**: Medium-High (3-4 hours)

**Tasks**:
1. Audit overlap between `scripts/lib/` and `mcp_server/lib/`
2. Choose canonical location (recommend: `mcp_server/lib/`)
3. Update imports in `scripts/generate-context.js`
4. Remove duplicate files
5. Test both entry points

### 2.3 Fix Missing YAML Assets
**Priority**: P1
**Effort**: Low (30 min)

**Tasks**:
1. Check if YAMLs exist with different names
2. Create `spec_kit_plan_auto.yaml` if missing
3. Create `spec_kit_plan_confirm.yaml` if missing
4. Or update `plan.md` to reference correct files

### 2.4 Add Constitutional Tier to Context Template
**Priority**: P1
**Effort**: Low (15 min)

**Tasks**:
1. Update `context_template.md:32-64` importance tier section
2. Update `context_template.md:466` tier list
3. Ensure 6 tiers documented consistently

### 2.5 Fix memory_load Phantom Reference
**Priority**: P1
**Effort**: Low (15 min)

**Tasks**:
1. Update `resume.md:407-409`
2. Replace `memory_load` with `memory_search({ includeContent: true })`
3. Update any other phantom tool references

## Phase 3: Documentation & Cleanup (P2-P3)

### 3.1 Fix Command Path Separators
- Standardize on `:` separator throughout

### 3.2 Update Template Count
- Fix SKILL.md:740 to show correct count (11 not 13)

### 3.3 Update Spec Status
- Change 035 spec.md status from "Draft" to "Complete"

### 3.4 Document Undocumented MCP Parameters
- Add missing parameters to memory command docs

## Testing Strategy

### Validation Tests
1. Run validate-spec.sh on 5 existing spec folders
2. Verify exit codes match expected behavior
3. Confirm Gate 6 workflow executes

### Integration Tests
1. Execute full `/spec_kit:complete` workflow
2. Execute `/memory:save` workflow
3. Verify no errors from tool naming

### Regression Tests
1. Confirm existing functionality unchanged
2. Memory search still works
3. Checkpoint operations still work

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Breaking existing workflows | Medium | High | Comprehensive testing before merge |
| Lib consolidation side effects | Medium | Medium | Careful import updates, staged rollout |
| Missing edge cases in validate-spec.sh | Low | Low | Start with core rules, iterate |

## Timeline

| Phase | Duration | Dependencies |
|-------|----------|--------------|
| Phase 1 (P0) | 1 session | None |
| Phase 2 (P1) | 1-2 sessions | Phase 1 complete |
| Phase 3 (P2-P3) | 1 session | Phase 2 complete |

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2025-12-25 | Create spec folder 036 | Track post-merger refinements separately |
| 2025-12-25 | Prioritize P0 fixes first | Blocking issues affect daily workflows |
