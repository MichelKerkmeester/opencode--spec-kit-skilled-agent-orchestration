# Canonical ID dedup hardening

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. IN SIMPLE TERMS](#3--in-simple-terms)
- [4. SOURCE FILES](#4--source-files)
- [5. SOURCE METADATA](#5--source-metadata)

## 1. OVERVIEW
Tracks the fix for mixed ID format deduplication failures in hybrid search caused by string/number mismatches.

## 2. CURRENT REALITY
Mixed ID formats (`42`, `"42"`, `mem:42`) caused deduplication failures in hybrid search. Normalization was applied in `combinedLexicalSearch()` for the new pipeline and in legacy `hybridSearch()` for the dedup map. Regression tests `T031-LEX-05` and `T031-BASIC-04` verify the fix.

## 3. IN SIMPLE TERMS
The same memory was sometimes listed multiple times in search results because different parts of the system referred to it using slightly different labels. This fix standardizes how memories are identified internally so duplicates are correctly detected and merged in the results every time.
## 4. SOURCE FILES
### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/hybrid-search.ts` | Lib | Canonical ID normalization and dedup in `combinedLexicalSearch()` and legacy `hybridSearch()` merge paths |
| `mcp_server/handlers/memory-crud-types.ts` | Handler | CRUD type definitions |
| `mcp_server/handlers/save/dedup.ts` | Handler | Deduplication logic |
| `mcp_server/handlers/save/types.ts` | Handler | Type definitions |
| `mcp_server/hooks/mutation-feedback.ts` | Hook | Mutation feedback hook |
| `mcp_server/lib/config/memory-types.ts` | Lib | Memory type definitions |
| `mcp_server/lib/config/type-inference.ts` | Lib | Memory type inference |
| `mcp_server/lib/parsing/memory-parser.ts` | Lib | Memory file parser |
| `mcp_server/lib/scoring/importance-tiers.ts` | Lib | Importance tier definitions |
| `mcp_server/lib/utils/canonical-path.ts` | Lib | Canonical path resolution |
| `mcp_server/lib/utils/path-security.ts` | Lib | Path security validation |
| `shared/parsing/quality-extractors.ts` | Shared | Quality signal extraction |
| `shared/utils/path-security.ts` | Shared | Shared path security |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/hybrid-search.vitest.ts` | `T031-LEX-05` and `T031-BASIC-04` canonical-ID dedup regression coverage |
| `mcp_server/tests/content-hash-dedup.vitest.ts` | Content hash dedup tests |
| `mcp_server/tests/importance-tiers.vitest.ts` | Importance tier tests |
| `mcp_server/tests/integration-session-dedup.vitest.ts` | Session dedup integration |
| `mcp_server/tests/memory-parser-extended.vitest.ts` | Parser extended tests |
| `mcp_server/tests/memory-parser.vitest.ts` | Memory parser tests |
| `mcp_server/tests/memory-types.vitest.ts` | Memory type tests |
| `mcp_server/tests/unit-composite-scoring-types.vitest.ts` | Scoring type tests |
| `mcp_server/tests/unit-folder-scoring-types.vitest.ts` | Folder scoring type tests |
| `mcp_server/tests/unit-path-security.vitest.ts` | Path security unit tests |
| `mcp_server/tests/unit-tier-classifier-types.vitest.ts` | Tier classifier types |
| `mcp_server/tests/unit-transaction-metrics-types.vitest.ts` | Transaction metric types |
| `shared/parsing/quality-extractors.test.ts` | Quality Extractors.Ts |

## 5. SOURCE METADATA
- Group: Alignment remediation (Phase 016)
- Source feature title: Canonical ID dedup hardening
- Current reality source: feature_catalog.md

