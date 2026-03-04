---
title: "Plan: Subfolder Resolution Fix"
description: "Fix 3 interrelated bugs in generate-context.js subfolder resolution for 3-level-deep spec hierarchies"
importance_tier: "normal"
contextType: "implementation"
---
# Plan: Subfolder Resolution Fix
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan | v2.2 -->

---

<!-- ANCHOR:approach -->
## Approach

| Bug | Root Cause | Fix |
|-----|-----------|-----|
| `parseArguments` 2-segment limit | `segments.length === 2` hard-coded | Change to `>= 2`, resolve full segment path |
| `findChildFolderSync` 1-level search | Flat loop over `specsDir/*` | Recursive `searchDir` with `MAX_DEPTH=4` |
| Category folders excluded | `SPEC_FOLDER_PATTERN` requires `\d{3}-` | Add `CATEGORY_FOLDER_PATTERN` (`/^\d{2}--[a-z][a-z0-9-]*$/`) |
<!-- /ANCHOR:approach -->

---

<!-- ANCHOR:architecture -->
## Architecture

### New: `CATEGORY_FOLDER_PATTERN`
Matches organizational containers like `02--system-spec-kit`. Used only for traversal — not spec folders themselves.

### Modified: Recursive search
`findChildFolderSync`/`Async` use inner `searchDir(dir, depth)` with `isTraversableFolder()` checking both patterns. Aliased root deduplication via `realpathSync`.

### Modified: Multi-segment parsing
`parseArguments` accepts `segments.length >= 2`, joins all under each specs directory. `isValidSpecFolder` adds filesystem fallback when `isUnderApprovedSpecsRoot` fails.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## Execution

1. Fix `subfolder-utils.ts` — add pattern, recursive search, dedup
2. Fix `generate-context.ts` — multi-segment + validation fallback
3. Export from `core/index.ts`
4. Fix tests + add new ones
5. Build, run tests, end-to-end verify
<!-- /ANCHOR:phases -->

## Technical Context
Current plan scope remains documentation and validation normalization for this phase.

## Implementation
Apply repeatable documentation updates, then validate recursively until clean.

## Phase 1: Validation Alignment
- Normalize checklist metadata and evidence syntax.
- Re-run validator and resolve residual warnings.

## Phase 2: Validation Alignment
- Normalize checklist metadata and evidence syntax.
- Re-run validator and resolve residual warnings.
