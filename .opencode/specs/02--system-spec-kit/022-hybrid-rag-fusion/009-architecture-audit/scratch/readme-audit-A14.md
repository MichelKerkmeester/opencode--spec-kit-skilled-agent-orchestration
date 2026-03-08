# README Audit A14 -- contracts, architecture, search

**Auditor**: Claude Opus 4.6
**Date**: 2026-03-08
**Scope**: 3 folders under `mcp_server/lib/`

---

## 1. `mcp_server/lib/contracts/`

**Status**: UPDATED

**Actual contents**: `README.md` only (0 code files)

**Issues found** (7):

| # | Issue | Severity |
|---|-------|----------|
| 1 | README lists `retrieval-trace.ts` as present in the folder -- file was relocated to `shared/contracts/retrieval-trace.ts` | Critical |
| 2 | `ContextEnvelope` interface documented with wrong fields: README had `results` (actual: `data`), `metadata: Record<string, unknown>` (actual: `EnvelopeMetadata` object) | Critical |
| 3 | `RetrievalTrace` interface documented with wrong fields: README had `inputCount`/`outputCount`/`degraded` (actual: `query`/`sessionId?`/`intent?`/`finalResultCount`) | Critical |
| 4 | `TraceEntry` missing `timestamp` and `metadata?` fields that exist in source | High |
| 5 | `DegradedModeContract` fields completely wrong: README had `stage`/`reason`/`confidenceImpact`/`retryRecommended` (actual: `failure_mode`/`fallback_mode`/`confidence_impact`/`retry_recommendation`/`degradedStages`) | Critical |
| 6 | Factory function signatures wrong: `createTrace(traceId, inputCount)` vs actual `createTrace(query, sessionId?, intent?)`; `createEntry` does not exist, replaced by `addTraceEntry`; `createDegradedContract` has entirely different parameter list | Critical |
| 7 | `RetrievalStage` described as "enum" but is actually a union type in source | Low |

**Actions taken**:
- Rewrote README as a proxy pointer to `shared/contracts/retrieval-trace.ts`
- Updated all interface field tables to match actual source code
- Updated all factory function signatures to match actual source code
- Updated usage examples with correct import paths and API calls
- Added `EnvelopeMetadata` interface documentation (was missing entirely)
- Corrected `RetrievalStage` from "enum" to "type" terminology
- Added `shared/contracts/retrieval-trace.ts` and `lib/telemetry/trace-schema.ts` to Related Modules
- Bumped version to 2.0.0

---

## 2. `mcp_server/lib/architecture/`

**Status**: PASS

**Actual contents**: `layer-definitions.ts`, `README.md` (2 files)

**Checks**:
- README lists all files: YES (`layer-definitions.ts` + `README.md`)
- File descriptions accurate: YES (7-layer hierarchy, token budgets, exported functions match)
- Module structure reflects actual code: YES
- YAML frontmatter present: YES (title, description, trigger_phrases)
- Numbered ALL CAPS H2 sections: YES (1. OVERVIEW through 5. RELATED RESOURCES)
- HVR-banned words: NONE found

**Evidence**: Structure tree matches, exported function table lists 7 functions consistent with the single `layer-definitions.ts` module. No files added or removed since last update.

---

## 3. `mcp_server/lib/search/`

**Status**: UPDATED

**Actual contents**: 47 `.ts` files at root + `pipeline/` subdirectory with 7 `.ts` files + 2 README files = 56 files total

**Issues found** (4):

| # | Issue | Severity |
|---|-------|----------|
| 1 | 3 files listed in Module Listing that no longer exist in this directory -- `rrf-fusion.ts`, `adaptive-fusion.ts`, `mmr-reranker.ts` were relocated to `shared/algorithms/` | High |
| 2 | 14 files present in directory but missing from Module Listing: `vector-index-types.ts`, `vector-index-schema.ts`, `vector-index-mutations.ts`, `vector-index-queries.ts`, `vector-index-aliases.ts`, `vector-index-store.ts`, `local-reranker.ts`, `search-types.ts`, `learned-feedback.ts`, `feedback-denylist.ts`, `anchor-metadata.ts`, `validation-metadata.ts`, `embedding-expansion.ts`, `retrieval-directives.ts`, `spec-folder-hierarchy.ts`, `encoding-intent.ts` | High |
| 3 | File count stated as "34 files" but actual count is 47 root + 7 pipeline = 54 `.ts` files | Medium |
| 4 | Migration Status footer still referenced "34 code files" and listed `rrf-fusion.ts` as local | Low |

**Actions taken**:
- Removed 3 relocated files from Module Listing (`rrf-fusion.ts`, `adaptive-fusion.ts`, `mmr-reranker.ts`)
- Added 16 missing files to Module Listing with accurate descriptions
- Added relocation note at bottom of Module Listing for the 3 moved files
- Updated total count from "34 files" to "47 root files + 7 pipeline files"
- Updated Migration Status to reflect relocations and split modules
- Bumped version from 2.0.0 to 2.1.0

**Not updated** (out of scope):
- The `pipeline/README.md` uses mixed-case `## Table of Contents` instead of `## TABLE OF CONTENTS`. This is a style inconsistency but was not in the audit scope for correction.

---

## Summary

| Folder | Status | Issues | Files Modified |
|--------|--------|--------|----------------|
| `mcp_server/lib/contracts/` | UPDATED | 7 (4 critical, 1 high, 1 low, 1 low) | `README.md` rewritten |
| `mcp_server/lib/architecture/` | PASS | 0 | None |
| `mcp_server/lib/search/` | UPDATED | 4 (2 high, 1 medium, 1 low) | `README.md` Module Listing + footer updated |

**HVR-banned words**: None found in any of the 3 READMEs (pre- or post-edit).
**YAML frontmatter**: Present in all 3 READMEs.
**Numbered ALL CAPS H2 sections**: Present in all 3 READMEs.
