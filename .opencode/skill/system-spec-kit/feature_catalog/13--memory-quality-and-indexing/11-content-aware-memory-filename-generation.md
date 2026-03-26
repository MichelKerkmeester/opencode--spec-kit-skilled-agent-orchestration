---
title: "Content-aware memory filename generation"
description: "Content-aware memory filename generation derives slugs from task context and session data instead of using the spec folder name alone."
---

# Content-aware memory filename generation

## 1. OVERVIEW

Content-aware memory filename generation derives slugs from task context and session data instead of using the spec folder name alone.

Previously, every saved memory in the same folder got nearly the same filename, making it impossible to tell them apart at a glance. This feature names each file based on what the memory is actually about, like labeling your photo albums by vacation instead of just numbering them. You can now scan a folder and instantly see what each file contains.

---

## 2. CURRENT REALITY

Memory filenames were previously derived solely from the spec folder name, producing identical slugs like `hybrid-rag-fusion-refinement.md` for every save in the same folder. The workflow now builds a `preferredMemoryTask` and uses it for slug/title generation in `generateContentSlug()`, with candidate precedence `task -> specTitle -> sessionCandidates (QUICK_SUMMARY/TITLE/SUMMARY) -> folderBase`. Candidate precedence prefers stronger session-derived names before folder fallback. Generic detection used by selection/enrichment includes `implementation-and-updates`, and slug fallback still uses the generic terms list (`development-session`, `session-summary`, `session-context`, `session`, `context`, `implementation`, `work-session`).

The slug is lowercased, non-alphanumeric characters replaced with hyphens, collapsed and truncated at a word boundary (hyphen) to a maximum of 50 characters. A minimum length of 8 characters ensures slugs are meaningful. This produces filenames like `04-03-26_17-25__sprint-019-impl-3-phases-81-files.md` instead of `04-03-26_17-25__hybrid-rag-fusion-refinement.md`. Batch type inference also now assigns synthetic fallback keys like `__pathless_0`, `__pathless_1`, and so on for inputs without a file path, so multiple pathless memories in the same batch no longer collapse onto the same Map entry before slug/title decisions are made. Always active with no feature flag. The same content slug is also used to derive the H1 body heading via `slugToTitle()`, ensuring filename and heading always match.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `scripts/utils/slug-utils.ts` | Script | Content-aware slug generation (`generateContentSlug()`) |
| `scripts/core/title-builder.ts` | Script | `slugToTitle()` derives H1 body heading from content slug |
| `scripts/utils/task-enrichment.ts` | Script | Enriches generic task names from `spec.md` titles during slug generation |
| `scripts/core/workflow.ts` | Script | Applies spec-title fallback and `preferredMemoryTask` selection before filename generation |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/slug-utils-boundary.vitest.ts` | Slug generation boundary tests |
| `scripts/tests/task-enrichment.vitest.ts` | Task enrichment, slug precedence, and workflow seam coverage |

---

## 4. SOURCE METADATA

- Group: Memory quality and indexing
- Source feature title: Content-aware memory filename generation
- Current reality source: FEATURE_CATALOG.md
