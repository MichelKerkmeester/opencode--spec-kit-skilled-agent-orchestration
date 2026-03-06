---
title: "Spec: Subfolder Resolution Fix"
description: "Fix 3 bugs in generate-context.js subfolder resolution preventing bare-name and relative-path inputs for 3-level-deep spec hierarchies"
importance_tier: "normal"
contextType: "implementation"
---
# Specification: Subfolder Resolution Fix
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec | v2.2 -->

---

<!-- ANCHOR:parent-ref -->
## Parent Reference

**Parent Spec:** `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/`
**Phase:** 012 of 023 (Hybrid RAG Fusion Refinement)
<!-- /ANCHOR:parent-ref -->

---

<!-- ANCHOR:problem -->
## Problem

`generate-context.js` fails with "Invalid spec folder format" when given:
1. A bare child name like `007-skill-command-alignment` (3 levels deep under `02--system-spec-kit/022-hybrid-rag-fusion/`)
2. A relative path like `02--system-spec-kit/022-hybrid-rag-fusion/007-skill-command-alignment`

Only the full path `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-skill-command-alignment` works.

Three interrelated bugs cause this:
1. `parseArguments` requires exactly 2 path segments (hard-coded `segments.length === 2`)
2. `findChildFolderSync` only searches 1 level deep (`specsDir/*/childName`)
3. Category folders (`02--system-spec-kit`) are invisible to `SPEC_FOLDER_PATTERN` (`/^\d{3}-[a-z][a-z0-9-]*$/`)
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:requirements -->
## Requirements

- REQ-001: Bare spec folder names must resolve via recursive search through category and parent folders
- REQ-002: Relative multi-segment paths must resolve against known specs directories
- REQ-003: Category folder pattern (`NN--name`) must be recognized as traversable during child folder search
- REQ-004: Existing 2-level nesting (`parent/child`) must continue to work
- REQ-005: Ambiguity detection must still return null when a child exists under multiple distinct parents
- REQ-006: All existing tests must pass; new tests added for deep nesting and category pattern
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:scope -->
## Scope

### In Scope
- `subfolder-utils.ts`: Add `CATEGORY_FOLDER_PATTERN`, recursive `findChildFolderSync`/`findChildFolderAsync`
- `generate-context.ts`: Multi-segment path handling, filesystem fallback in `isValidSpecFolder`
- `core/index.ts`: Export `CATEGORY_FOLDER_PATTERN`
- `test-subfolder-resolution.js`: Fix expectations, add category + deep nesting tests

### Out of Scope
- Changes to `create.sh` or other scripts
- Spec hierarchy restructuring
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:success-criteria -->
## Success Criteria

1. `node generate-context.js "008-subfolder-resolution-fix"` succeeds (bare name)
2. `node generate-context.js "02--system-spec-kit/023-.../012-..."` succeeds (relative path)
3. `test-subfolder-resolution.js`: 31/31 passed, 0 failed (26 original + 5 post-review)
4. `test-folder-detector-functional.js`: no new failures
5. TypeScript compiles cleanly
<!-- /ANCHOR:success-criteria -->

---

## Phase Navigation

| **Parent Spec** | ../spec.md |
- Predecessor: `007-skill-command-alignment`
- Successor: `021-cross-cutting-remediation`
