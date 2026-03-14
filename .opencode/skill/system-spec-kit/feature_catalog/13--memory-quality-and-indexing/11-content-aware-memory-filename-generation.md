# Content-aware memory filename generation

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. IN SIMPLE TERMS](#3--in-simple-terms)
- [4. SOURCE FILES](#4--source-files)
- [5. SOURCE METADATA](#5--source-metadata)

## 1. OVERVIEW
Content-aware memory filename generation derives slugs from task context and session data instead of using the spec folder name alone.

## 2. CURRENT REALITY
Memory filenames were previously derived solely from the spec folder name, producing identical slugs like `hybrid-rag-fusion-refinement.md` for every save in the same folder. The workflow now builds a `preferredMemoryTask` and uses it for slug/title generation in `generateContentSlug()`, with candidate precedence `task -> specTitle -> sessionCandidates (QUICK_SUMMARY/TITLE/SUMMARY) -> folderBase`. In stateless mode, generic task strings can be enriched from the `spec.md` frontmatter title before candidate selection. In JSON/file-backed mode, that enrichment override remains disabled, but candidate precedence still prefers stronger session-derived names before folder fallback. Generic detection used by selection/enrichment includes `implementation-and-updates`, and slug fallback still uses the generic terms list (`development-session`, `session-summary`, `session-context`, `session`, `context`, `implementation`, `work-session`).

The slug is lowercased, non-alphanumeric characters replaced with hyphens, collapsed and truncated at a word boundary (hyphen) to a maximum of 50 characters. A minimum length of 8 characters ensures slugs are meaningful. This produces filenames like `04-03-26_17-25__sprint-019-impl-3-phases-81-files.md` instead of `04-03-26_17-25__hybrid-rag-fusion-refinement.md`. Always active with no feature flag.

## 3. IN SIMPLE TERMS
Previously, every saved memory in the same folder got nearly the same filename, making it impossible to tell them apart at a glance. This feature names each file based on what the memory is actually about, like labeling your photo albums by vacation instead of just numbering them. You can now scan a folder and instantly see what each file contains.
## 4. SOURCE FILES
### Implementation

| File | Layer | Role |
|------|-------|------|
| `scripts/utils/slug-utils.ts` | Script | Content-aware slug generation |
| `scripts/utils/task-enrichment.ts` | Script | Decides when stateless saves may enrich generic task names from `spec.md` titles |
| `scripts/core/workflow.ts` | Script | Applies spec-title fallback and `preferredMemoryTask` selection before filename generation |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/slug-utils-boundary.vitest.ts` | Slug generation boundary tests |
| `scripts/tests/task-enrichment.vitest.ts` | Stateless-vs-file-backed task enrichment, slug precedence, and workflow seam coverage |

## 5. SOURCE METADATA
- Group: Memory quality and indexing
- Source feature title: Content-aware memory filename generation
- Current reality source: feature_catalog.md

