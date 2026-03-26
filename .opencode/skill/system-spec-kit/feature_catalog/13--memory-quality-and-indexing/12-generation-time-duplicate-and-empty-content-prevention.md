---
title: "Generation-time duplicate and empty content prevention"
description: "Generation-time duplicate and empty content prevention blocks template-only files and exact-match duplicates before the atomic write operation."
---

# Generation-time duplicate and empty content prevention

## 1. OVERVIEW

Generation-time duplicate and empty content prevention blocks template-only files and exact-match duplicates before the atomic write operation.

This feature catches two common mistakes before a memory file is even written to disk: saving a file that is basically empty (just a template with no real content) and saving an exact copy of something already stored. It is like your email client warning you that you are about to send a blank message or a duplicate of something you already sent.

---

## 2. CURRENT REALITY

Two pre-write quality gates in `scripts/core/file-writer.ts` prevent empty and duplicate memory files at generation time, complementing the existing index-time dedup in `memory-save.ts`. The empty content gate (`validateContentSubstance`) strips YAML frontmatter, HTML comments, anchor markers, empty headings, table rows and empty list items, then rejects files with fewer than 200 characters of remaining substance. The duplicate gate (`checkForDuplicateContent`) computes a SHA-256 hash of the file content and compares it against all existing `.md` files in the target memory directory, rejecting exact matches.

Both gates run inside `writeFilesAtomically()` before the atomic write operation, after the existing `validateNoLeakedPlaceholders` check. Failures throw descriptive errors that halt the save and report which validation failed. This catches the two most common quality problems (SGQS-template-only files and repeated saves of identical content) at the earliest possible point. Always active with no feature flag.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `scripts/core/file-writer.ts` | Script | `validateContentSubstance()` and `checkForDuplicateContent()` pre-write quality gates; `writeFilesAtomically()` orchestration |
| `scripts/utils/validation-utils.ts` | Script | `validateNoLeakedPlaceholders` and `validateAnchors` checks called before substance/duplicate gates |
| `scripts/core/workflow.ts` | Script | Calls `writeFilesAtomically()` during memory save flow |
| `mcp_server/handlers/save/dedup.ts` | Handler | Index-time deduplication (complementary to generation-time duplicate gate) |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/content-hash-dedup.vitest.ts` | Content hash dedup tests |
| `scripts/tests/task-enrichment.vitest.ts` | Mocks `writeFilesAtomically()` for workflow integration coverage |

---

## 4. SOURCE METADATA

- Group: Memory quality and indexing
- Source feature title: Generation-time duplicate and empty content prevention
- Current reality source: FEATURE_CATALOG.md
