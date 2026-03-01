---
title: "Feature Specification: generate-context.ts Subfolder Support [123-generate-context-subfolder/spec]"
description: "The generate-context.js memory save script only handles flat spec folder paths (e.g., specs/003-name/). Every spec folder in the project uses nested subfolders (e.g., specs/003-..."
trigger_phrases:
  - "feature"
  - "specification"
  - "generate"
  - "context"
  - "subfolder"
  - "spec"
  - "123"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: generate-context.ts Subfolder Support

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-02-15 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `generate-context.js` memory save script only handles flat spec folder paths (e.g., `specs/003-name/`). Every spec folder in the project uses nested subfolders (e.g., `specs/003-parent/121-child/`). When users pass a child folder name, the script fails to resolve it, causing memory files to be saved to the wrong location (parent instead of child).

**Root Cause — 5 Design Limitations:**
1. `config.ts:219` — `getSpecsDirectories()` returns only 2 flat base paths, no recursive discovery
2. `generate-context.ts:106` — `isValidSpecFolder()` uses `path.basename()` which strips parent context
3. `generate-context.ts:186` — `validateArguments()` does `readdirSync(specsDir)` listing only TOP-LEVEL entries
4. `folder-detector.ts:193` — `detectSpecFolder()` Priority 4 auto-detect uses `readdir()` on top-level only
5. `generate-context.ts:152` — `parseArguments()` prefix detection doesn't handle `parent/child` format

### Purpose
Enable the memory save script to correctly resolve nested subfolder paths in all supported input formats, so context is always saved to the correct spec folder.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `generate-context.ts` — 4 existing functions modified + 1 new function (`findChildFolder`)
- `folder-detector.ts` — 3 priority levels updated for nested path support
- `SKILL.md` — Memory save section updated with subfolder examples
- `sub_folder_versioning.md` — Updated with subfolder path examples
- `AGENTS.md` — Memory save rule updated with subfolder examples

### Out of Scope
- `config.ts` — No changes needed (base paths are correct, resolution logic lives elsewhere)
- `workflow.ts` — No changes needed (not involved in path resolution)
- Other scripts — Only `generate-context.ts` and `folder-detector.ts` need changes

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/scripts/src/memory/generate-context.ts` | Modify | Add nested path support to 4 functions + 1 new `findChildFolder()` |
| `.opencode/skill/system-spec-kit/scripts/src/memory/folder-detector.ts` | Modify | Update 3 priority levels for nested path resolution |
| `.opencode/skill/system-spec-kit/SKILL.md` | Modify | Add subfolder examples to memory save section |
| `.opencode/skill/system-spec-kit/references/sub_folder_versioning.md` | Modify | Add subfolder path resolution examples |
| `AGENTS.md` | Modify | Update memory save rule with subfolder examples |

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 6 input formats resolve correctly | Each format tested and resolves to correct absolute path |
| REQ-002 | Flat folder behavior unchanged | Existing `003-parent` style inputs still work identically |
| REQ-003 | `tsc --build` compiles without errors | Clean build with zero errors |
| REQ-004 | Bare child ambiguity produces clear error | When `121-child` exists under multiple parents, error message lists all matches |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Documentation updated | SKILL.md, sub_folder_versioning.md, AGENTS.md all include subfolder examples |
| REQ-006 | `detectSpecFolder()` all priorities support nested paths | P1 (CLI), P2 (JSON), P4 (Auto) all resolve nested formats |
| REQ-007 | Code review completed | All TS changes reviewed for correctness and edge cases |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 6 input formats resolve to the correct absolute spec folder path
- **SC-002**: Existing flat folder behavior is 100% backward compatible
- **SC-003**: Ambiguous bare child names produce a clear, actionable error message listing all matches

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Breaking existing flat-folder behavior | High | Additive branches only; existing code paths untouched |
| Risk | Performance of recursive scanning | Low | Only 2 levels deep, small directory counts (~20 folders) |
| Risk | Bare child ambiguity | Med | Require unique match, clear error listing all candidates |
| Dependency | TypeScript compiler (`tsc --build`) | Build must pass | Run after every change set |

<!-- /ANCHOR:risks -->

---

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Recursive directory scan completes in <50ms (only 2 levels deep, ~20 folders)
- **NFR-P02**: No measurable impact on existing flat-folder resolution path

### Security
- **NFR-S01**: Path resolution stays within project root (no directory traversal)
- **NFR-S02**: No user-supplied paths passed to shell commands

### Reliability
- **NFR-R01**: All error paths produce descriptive messages with suggested corrections
- **NFR-R02**: Partial matches never silently resolve to wrong folder

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: Existing behavior (falls through to auto-detect or error)
- Maximum nesting: Only 2 levels supported (`parent/child`), deeper nesting is out of scope
- Invalid format: Returns clear error with valid format examples

### Error Scenarios
- Child folder exists in multiple parents: Error lists all matches, asks user to qualify with parent
- Parent folder doesn't exist: Error states parent not found
- Child folder doesn't exist under specified parent: Error states child not found under parent

### State Transitions
- N/A (stateless CLI tool, each invocation is independent)

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 2 TS files (~150 LOC), 3 doc files, no new files |
| Risk | 8/25 | Backward compat risk mitigated by additive-only approach |
| Research | 5/20 | Root cause fully identified, approach designed |
| **Total** | **25/70** | **Level 2** |

<!-- /ANCHOR:complexity -->

---

## 8. ACCEPTANCE SCENARIOS

**Given** a user passes `02--system-spec-kit/121-script-audit` as the spec folder argument
**When** `generate-context.js` resolves the path
**Then** it joins with the specsDir base path and saves to `.opencode/specs/02--system-spec-kit/121-script-audit/memory/`

**Given** a user passes `specs/02--system-spec-kit/121-script-audit` (with `specs/` prefix)
**When** `generate-context.js` resolves the path
**Then** it strips the prefix and joins with PROJECT_ROOT to produce the correct absolute path

**Given** a user passes `121-script-audit` (bare child name) and it exists under exactly one parent
**When** `generate-context.js` searches all parent folders
**Then** it finds the unique match and resolves to the correct nested path

**Given** a user passes `121-child` (bare child name) and it exists under multiple parents
**When** `generate-context.js` searches all parent folders
**Then** it produces a clear error listing all matching locations and asks the user to qualify with the parent name

**Given** a user passes `02--system-spec-kit` (flat top-level folder, no child)
**When** `generate-context.js` resolves the path
**Then** it uses existing flat-folder behavior unchanged

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None currently. Root cause and approach are fully defined.

<!-- /ANCHOR:questions -->

---

## 6 INPUT FORMATS TO SUPPORT

| # | Input | Expected Resolution |
|---|-------|-------------------|
| 1 | `003-parent/121-child` | Join with specsDir to form nested path |
| 2 | `specs/003-parent/121-child` | Join with PROJECT_ROOT |
| 3 | `.opencode/specs/003-parent/121-child` | Join with PROJECT_ROOT |
| 4 | `/absolute/path/121-child` | Direct use (already works) |
| 5 | `121-child` (bare child) | Search ALL parents, unique match required, error on ambiguity |
| 6 | `003-parent` (flat) | Existing behavior, unchanged |

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
