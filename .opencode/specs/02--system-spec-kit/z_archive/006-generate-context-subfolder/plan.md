---
title: "Implementation Plan: generate-context.ts Subfolder Support [123-generate-context-subfolder/plan]"
description: "Add nested subfolder path resolution to generate-context.ts and folder-detector.ts. The approach is additive-only: new branches handle parent/child format inputs while existing ..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "generate"
  - "context"
  - "subfolder"
  - "123"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: generate-context.ts Subfolder Support

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

- **Level**: 2

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js) |
| **Framework** | None (standalone CLI script) |
| **Storage** | Filesystem (spec folders, memory files) |
| **Testing** | Manual CLI testing (6 input formats), `tsc --build` |

### Overview
Add nested subfolder path resolution to `generate-context.ts` and `folder-detector.ts`. The approach is additive-only: new branches handle `parent/child` format inputs while existing flat-folder code paths remain untouched. One new function (`findChildFolder`) performs recursive search for bare child names with ambiguity detection.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met (6 input formats resolve correctly)
- [ ] Tests passing (`tsc --build` clean, all 6 formats verified)
- [ ] Docs updated (SKILL.md, sub_folder_versioning.md, AGENTS.md)

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive branching in existing functions. No new files, no architectural changes.

### Key Components
- **`generate-context.ts`**: Main script — `isValidSpecFolder()`, `parseArguments()`, `validateArguments()`, new `findChildFolder()`
- **`folder-detector.ts`**: Priority-based folder detection — P1 (CLI), P2 (JSON), P4 (Auto-detect)

### Data Flow
```
User input (any of 6 formats)
    ↓
parseArguments() — detect prefix, normalize to relative or absolute path
    ↓
isValidSpecFolder() — validate format (now supports parent/child)
    ↓
validateArguments() — resolve to absolute path (now scans 2 levels deep)
    ↓
  ┌─ If parent/child format → join with specsDir
  ├─ If bare child name → findChildFolder() searches all parents
  └─ If flat name → existing behavior (unchanged)
    ↓
Resolved absolute path → generate memory context
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Core TypeScript Changes (generate-context.ts)
- [ ] T3: Modify `isValidSpecFolder()` for nested format validation
- [ ] T4: Modify `parseArguments()` for nested prefix detection
- [ ] T5: Modify `validateArguments()` for recursive scanning
- [ ] T6: Add new `findChildFolder()` function
- [ ] T13: Update `--help` text with subfolder examples

### Phase 2: Folder Detector Changes (folder-detector.ts)
- [ ] T7: Modify `detectSpecFolder()` Priority 1 (CLI) for nested paths
- [ ] T8: Modify `detectSpecFolder()` Priority 2 (JSON) for nested paths
- [ ] T9: Modify `detectSpecFolder()` Priority 4 (Auto) for recursive scanning

### Phase 3: Verification
- [ ] T10: Build with `tsc --build` (zero errors)
- [ ] T11: Test all 6 input formats manually
- [ ] T12: Test backward compatibility with flat folders
- [ ] T18: End-to-end verification

### Phase 4: Documentation
- [ ] T14: Update SKILL.md memory save section
- [ ] T15: Update sub_folder_versioning.md
- [ ] T16: Update AGENTS.md memory save rule

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Build | All TS changes compile cleanly | `tsc --build` |
| Manual | All 6 input formats resolve correctly | CLI invocation with each format |
| Regression | Flat folder behavior unchanged | CLI invocation with existing format |
| Edge case | Ambiguous bare child name produces error | CLI with child name in multiple parents |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| TypeScript compiler | Internal | Green | Cannot verify build |
| Existing spec folder structure | Internal | Green | Test data available |
| Node.js `fs` module | Internal | Green | Core filesystem operations |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any of the 6 input formats fails, or flat-folder regression detected
- **Procedure**: `git checkout` the two TS files to revert all changes; docs can remain

<!-- /ANCHOR:rollback -->

---

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (generate-context.ts) ──► Phase 2 (folder-detector.ts) ──► Phase 3 (Verify) ──► Phase 4 (Docs)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1: Core TS | None | Phase 2, Phase 3 |
| Phase 2: Detector | Phase 1 (shared patterns) | Phase 3 |
| Phase 3: Verify | Phase 1, Phase 2 | Phase 4 |
| Phase 4: Docs | Phase 3 (verified behavior) | None |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Core TS changes | Medium | ~90 LOC, 1-2 hours |
| Phase 2: Folder detector | Medium | ~50 LOC, 30-60 min |
| Phase 3: Verification | Low | 30 min |
| Phase 4: Documentation | Low | ~40 LOC, 30 min |
| **Total** | | **~180 LOC, 3-4 hours** |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Git working tree clean before starting
- [ ] No uncommitted changes to target files
- [ ] Build passes before changes

### Rollback Procedure
1. `git checkout -- .opencode/skill/system-spec-kit/scripts/src/memory/generate-context.ts`
2. `git checkout -- .opencode/skill/system-spec-kit/scripts/src/memory/folder-detector.ts`
3. Run `tsc --build` to verify clean revert
4. Doc changes can remain (additive, no breaking content)

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A

<!-- /ANCHOR:enhanced-rollback -->

---

## RISKS

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Breaking existing flat-folder behavior | Low | High | Additive branches only; existing code paths untouched |
| Performance of recursive scanning | Very Low | Low | Only 2 levels deep, ~20 folders total |
| Bare child ambiguity edge case | Medium | Medium | Require unique match, error lists all candidates with parent paths |

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
