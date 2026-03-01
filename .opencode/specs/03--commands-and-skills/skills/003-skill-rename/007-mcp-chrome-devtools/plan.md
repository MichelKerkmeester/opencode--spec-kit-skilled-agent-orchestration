---
title: "Implementation Plan: Phase 007 — Finalize mcp-chrome-devtools Rename [007-mcp-chrome-devtools/plan]"
description: "Phase implementation and verification are complete for the rename and reference updates across the targeted 57 files (21 internal + 36 external), including smoke tests for both ..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "phase"
  - "007"
  - "finalize"
  - "mcp"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Phase 007 — Finalize mcp-chrome-devtools Rename

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Python, Shell |
| **Framework** | OpenCode skill system |
| **Storage** | Filesystem |
| **Testing** | grep verification, skill_advisor.py smoke tests |

### Overview
Phase implementation and verification are complete for the rename and reference updates across the targeted 57 files (21 internal + 36 external), including smoke tests for both `take screenshot` and `devtools`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] Folder renamed to `mcp-chrome-devtools`
- [x] Zero old-name grep matches in active targets
- [x] MCP categorization correct for `devtools`
- [x] Phrase smoke test: `python3 skill_advisor.py "take screenshot"` returns `mcp-chrome-devtools`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Mechanical find-and-replace with prefix change. No architectural changes.

### Key Components
- **Skill folder**: 21 files
- **skill_advisor.py**: 20 lines
- **Agent files**: 4 orchestrate.md
- **Install guides**: 4 files
- **Root docs**: 3 files
- **system-spec-kit**: 2 files

### Data Flow
No changes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Step 1: Filesystem Rename
- [x] Verify target folder `.opencode/skill/mcp-chrome-devtools` exists and legacy workflows-prefixed folder is absent

### Step 2: Internal File Updates (21 files)
- [x] SKILL.md, index.md, nodes/, references/, assets/, scripts/

### Step 3: External Reference Updates (36 files)
- [x] skill_advisor.py (20 lines)
- [x] orchestrate.md (4 runtimes)
- [x] Install guides (4 files)
- [x] Root docs (3 files)
- [x] system-spec-kit (2 files)
- [x] Other external refs

### Step 4: Changelog
- [x] Verify target changelog folder `11--mcp-chrome-devtools` exists and legacy workflows-prefixed changelog folder is absent

### Step 5: Verification
- [x] grep: 0 matches for `workflows-.*chrome-devtools` in active targets
- [x] skill_advisor.py phrase smoke test for `take screenshot` (`mcp-chrome-devtools`, confidence `0.95`)
- [x] skill_advisor.py generic smoke test for `devtools` (`mcp-chrome-devtools`)
- [x] MCP alignment check (`mcp-chrome-devtools`, `mcp-figma`, `mcp-code-mode`)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep | Active files | `rg -n "workflows-.*chrome-devtools" ...` |
| Smoke test | skill_advisor.py | `python3 skill_advisor.py "take screenshot"` + `"devtools"` |
| MCP check | Naming | Verify alignment with mcp-figma, mcp-code-mode |
| Directory | Filesystem | `ls -d`, `find ... | wc -l` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 3, 1, 2 complete | Internal | Complete | Unblocked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Broken MCP integration
- **Procedure**: `git checkout -- .`
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 2 ──► Phase 7 (This Phase) ──► Phase 4
                  │
                  ├── Step 1 ──► Steps 2-4 ──► Step 5
```
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Step 1: Rename | Low | 1 `git mv` |
| Step 2: Internal (21) | Low | Small folder |
| Step 3: External (36) | Med | Moderate refs |
| Step 4: Changelog | Low | 1 `git mv` |
| Step 5: Verification | Low | grep + smoke |
| **Total** | **Medium-High** | **~57 files** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Phases 3, 1, 2 confirmed complete
- [x] Clean git state

### Rollback Procedure
1. `git checkout -- .`

### Data Reversal
- **Has data migrations?** No
<!-- /ANCHOR:enhanced-rollback -->
