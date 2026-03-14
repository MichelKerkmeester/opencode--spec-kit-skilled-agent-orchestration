# Agent I01: Spec 013 Plan-to-Code Alignment

**Date**: 2026-03-08
**Reviewer**: Claude Opus 4.6 (Agent I01, Leaf)
**Scope**: Spec 013 Phases 0-2 plan tasks vs. current codebase
**Confidence**: HIGH — all referenced files read and verified

---

## Summary

Spec 013 ("Improve Stateless Mode Quality") targets 11 tasks across Phases 0-2. Of these, **9 are DONE**, **1 is PARTIAL**, and **1 is DONE with a caveat**. The core enrichment architecture (spec-folder-extractor, git-context-extractor, enrichStatelessData, ACTION field preservation) is fully implemented and matches the plan. The two areas requiring attention are both in Phase 0: (a) the snake_case/camelCase mismatch fix is implemented at the tool-call level but the OpencodeCapture interface's top-level `metadata` field still accepts only a generic `Record<string, unknown>` (no explicit snake_case mapping for `tool_calls`); and (b) prompt-level relevance filtering is implemented for *assistant responses and tool calls* but not for the `userPrompts` array itself.

---

## Phase 0 Status: OpenCode-Path Hardening

### Task 0.1: Fix snake_case/camelCase metadata mismatch in input-normalizer.ts
**Status: DONE**

**Evidence:**
- `CaptureToolCall.input` interface (line 96-102) explicitly declares both `filePath` and `file_path`
- `buildToolObservationTitle()` (line 367) reads `input.filePath || input.file_path || input.path`
- `isToolRelevant()` (line 420) reads `tool.input?.filePath || tool.input?.file_path || tool.input?.path`
- Tool observation file extraction (lines 488-494) handles both `input.filePath` and `input.file_path`
- FILES extraction (line 510) handles both conventions

The plan said `opencode-capture.ts` emits snake_case fields and `input-normalizer.ts:399+` reads camelCase. The code now reads both conventions everywhere a tool call input is accessed. The `OpencodeCapture` interface (line 106-113) uses `toolCalls` (camelCase) at the top level, but this is the normalized interface — the actual reading of raw data would occur in the data loader, not the normalizer.

### Task 0.2: Add prompt-level relevance filtering in input-normalizer.ts
**Status: DONE**

**Evidence:**
- `transformOpencodeCapture()` accepts `specFolderHint` parameter (line 399)
- Lines 407-416: Relevance keywords extracted from spec folder path segments
- Lines 418-424: `isToolRelevant()` function filters tool calls by spec-folder relevance
- Lines 426-428: `filteredToolCalls` applies the filter when hint is provided
- Lines 452-461: Assistant response observations also filtered by relevance keywords — exchanges where neither the response nor the user input mentions relevant keywords are skipped

**Note**: The `userPrompts` array (line 430-433) is NOT filtered — all exchanges still become userPrompts regardless of relevance. The plan said "filter prompts by spec-folder relevance to prevent V8 cross-spec contamination", and the implementation filters observations and tool calls but passes all prompts through. This is a design choice (prompts are thin metadata, not content), but worth noting as a minor divergence from the plan's literal wording.

### Task 0.3: Backfill SPEC_FOLDER from CLI-known folder name in collect-session-data.ts
**Status: PARTIAL**

**Evidence:**
- At line 713, `buildObservationsWithAnchors` uses `collectedData.SPEC_FOLDER || folderName`
- At line 724-730, `collectedData.SPEC_FOLDER` is used for `detectRelatedDocs()` with path traversal guard
- The `folderName` variable is derived from `specFolderName` (CLI argument) at line 617

**Gap**: The plan says "When `collectedData.SPEC_FOLDER` is missing but `specFolderName` is known from CLI, set it." The current code does NOT explicitly backfill `collectedData.SPEC_FOLDER = folderName`. Instead, `folderName` is used as a fallback in some places (line 713) but the `specFolderPath` variable at line 724 is ONLY set from `collectedData.SPEC_FOLDER`, meaning `detectRelatedDocs()` (the critical function the plan wanted to re-enable) still won't run when `collectedData.SPEC_FOLDER` is missing. The backfill to `collectedData.SPEC_FOLDER` does not appear to exist in the code.

**However**: The enrichment layer in `workflow.ts` (Step 3.5, line 655-658) runs `enrichStatelessData()` BEFORE `collectSessionData()` is called at line 676. The `enrichStatelessData()` function merges spec-folder observations and files directly into `collectedData`, and the spec-folder-extractor produces provenance-tagged content. So the _effect_ of SPEC_FOLDER backfill (getting related docs into the output) is partially achieved through the enrichment pathway, just not through the specific mechanism the plan described.

---

## Phase 1 Status: Enrichment Hook + Spec Folder Mining

### Task 1.1: Create spec-folder-extractor.ts
**Status: DONE**

**Evidence** (`scripts/extractors/spec-folder-extractor.ts`, 293 lines):
- [x] Parse `description.json` for metadata: lines 208-216, 231-253
- [x] Parse `spec.md` YAML frontmatter for title, trigger_phrases, importance_tier: lines 120-152
- [x] Parse `spec.md` problem/purpose sections for summary text: lines 125-130
- [x] Parse `spec.md` files-to-change table for file list: lines 131-137
- [x] Parse `plan.md` phases and implementation steps: lines 154-163
- [x] Parse `tasks.md` checkbox status for completion percentage: lines 165-171
- [x] Parse `checklist.md` for verification status: lines 173-184
- [x] Parse `decision-record.md` for decisions: lines 186-196
- [x] Return `SpecFolderExtraction` with observations, FILES, recentContext, summary, triggerPhrases, decisions, sessionPhase: lines 277-293
- [x] All items include `_provenance: 'spec-folder'` marker: confirmed in interfaces (lines 14-31) and all observation/file constructors
- [x] All items include `_synthetic: true` flag: confirmed in all observation constructors

### Task 1.2: Add enrichStatelessData() in workflow.ts
**Status: DONE**

**Evidence** (`scripts/core/workflow.ts`, lines 433-527):
- [x] Gate: only runs for non-file source (line 439: `if (collectedData._source === 'file') return`)
- [x] Calls `extractSpecFolderContext(specFolder)` and `extractGitContext(projectRoot)` in parallel (lines 443-446)
- [x] Merges spec observations, FILES, trigger phrases, decisions, summary, recentContext (lines 449-493)
- [x] Merges git observations, FILES, summary (lines 497-521)
- [x] FILE deduplication by path (lines 458-464, 506-512)
- [x] Error handling: non-fatal catch (lines 523-526)
- [x] Called at Step 3.5 AFTER alignment check (Step 1.5) and spec folder resolution (Step 2): line 654-658
- [x] Provenance-aware merge: downstream can distinguish via `_provenance` field

### Task 1.3: Ensure synthetic timestamps use stable ordering
**Status: DONE**

**Evidence:**
- `spec-folder-extractor.ts` line 11: `const SYNTHETIC_TIMESTAMP = new Date(0).toISOString()` (epoch 0)
- `git-context-extractor.ts` line 13: `const SYNTHETIC_TIMESTAMP = new Date(0).toISOString()` (epoch 0)
- All synthetic observations use `SYNTHETIC_TIMESTAMP` (epoch 0), which sorts before any real timestamp
- Both modules also tag `_synthetic: true` on every observation
- Commit observations in git-context-extractor use the actual commit timestamp (line 164), which is appropriate since those are real timestamps

---

## Phase 2 Status: Git Context Mining

### Task 2.1: Create git-context-extractor.ts
**Status: DONE**

**Evidence** (`scripts/extractors/git-context-extractor.ts`, 188 lines):
- [x] `git status --porcelain` for uncommitted changes -> FILES with ACTION: lines 120-123, 145
- [x] `git diff --name-status HEAD~N` for committed changes -> FILES: lines 127-130, 146
- [x] Check available rev count: `git rev-list --count HEAD` (line 124)
- [x] `git log --format` for recent commits -> observations: lines 132-134, 159-170
- [x] Map conventional commit prefixes: COMMIT_TYPE_MAP (lines 14-21), `detectCommitType()` (lines 103-106)
- [x] `git diff --stat` for change magnitude: lines 131, 86-96
- [x] Error handling: graceful fallback (lines 184-186: catch returns emptyResult)
- [x] Performance: MAX_COMMITS=20 (line 11), 24h window (line 133), MAX_FILES=50 (line 10)
- [x] All items include `_provenance: 'git'` marker: confirmed in interfaces and constructors
- [x] All items include `_synthetic: true`: confirmed in observation constructors (lines 156, 168)

### Task 2.2: Extend enrichStatelessData() to call git-context-extractor
**Status: DONE**

**Evidence** (`workflow.ts` lines 443-521):
- [x] Calls `extractGitContext(projectRoot)` in parallel with spec-folder extraction (line 445)
- [x] Merges git-derived FILES with deduplication (lines 504-512)
- [x] Merges git-derived observations (lines 498-502)
- [x] Builds enriched summary from git context (lines 515-520)
- [x] Provenance-aware: git items carry `_provenance: 'git'`

### Task 2.3: Preserve ACTION field in file-extractor.ts
**Status: DONE**

**Evidence** (`scripts/extractors/file-extractor.ts`):
- [x] `FileChange` interface has `ACTION?: string` (line 28)
- [x] `extractFilesFromData()` internal `addFile()` accepts optional `action` parameter (line 113)
- [x] Source 1 (FILES array) extracts ACTION: line 135 `const action = (fileInfo as any).ACTION || (fileInfo as any).action`
- [x] `filesMap` stores `action` alongside description (line 108, 123, 126)
- [x] Output includes ACTION when present: line 182 `...(data.action ? { ACTION: data.action } : {})`
- [x] `SemanticFileInfo` interface includes `action` field (line 65)
- [x] `enhanceFilesWithSemanticDescriptions()` preserves/normalizes ACTION (lines 202, 228)

### Task 2.4: Verify observation title uniqueness
**Status: DONE**

**Evidence:**
- `buildToolObservationTitle()` in `input-normalizer.ts` (lines 358-393) generates descriptive titles from tool context
- `deduplicateObservations()` in `file-extractor.ts` (lines 288-342) merges observations with identical titles
- These two functions together address the plan's concern about generic `Tool: read` titles and title uniqueness
- The plan noted this might already be fixed and to "only add changes if dedup ratio still below 0.7" — the existing implementation handles both title generation and deduplication

---

## Task Matrix

| Phase | Task | Plan Description | Status | File:Line Evidence |
|-------|------|-----------------|--------|-------------------|
| 0 | 0.1 | Fix snake_case/camelCase metadata mismatch | DONE | input-normalizer.ts:96-102, 367, 420, 488-494, 510 |
| 0 | 0.2 | Add prompt-level relevance filtering | DONE | input-normalizer.ts:399-461 (tool calls + responses filtered; userPrompts unfiltered) |
| 0 | 0.3 | Backfill SPEC_FOLDER from CLI | PARTIAL | collect-session-data.ts:713 (fallback used) but no explicit backfill to collectedData.SPEC_FOLDER; detectRelatedDocs at line 724-730 still gated on collectedData.SPEC_FOLDER |
| 1 | 1.1 | Create spec-folder-extractor.ts | DONE | spec-folder-extractor.ts (293 lines, full implementation) |
| 1 | 1.2 | Add enrichStatelessData() in workflow.ts | DONE | workflow.ts:433-527 (function), 654-658 (call site after alignment guards) |
| 1 | 1.3 | Synthetic timestamps stable ordering | DONE | spec-folder-extractor.ts:11, git-context-extractor.ts:13 (epoch 0) |
| 2 | 2.1 | Create git-context-extractor.ts | DONE | git-context-extractor.ts (188 lines, full implementation) |
| 2 | 2.2 | Extend enrichStatelessData() for git | DONE | workflow.ts:443-521 |
| 2 | 2.3 | Preserve ACTION field in file-extractor.ts | DONE | file-extractor.ts:28, 108, 113, 135, 182 |
| 2 | 2.4 | Verify observation title uniqueness | DONE | input-normalizer.ts:358-393, file-extractor.ts:288-342 |

---

## Findings

### P1 — SPEC_FOLDER Backfill Missing (Phase 0, Task 0.3)

**File**: `scripts/extractors/collect-session-data.ts:724-730`
**Impact**: When `collectedData.SPEC_FOLDER` is missing (common in stateless mode), `specFolderPath` is null, and `detectRelatedDocs()` at line 732-739 never runs. The plan explicitly called for backfilling `collectedData.SPEC_FOLDER` from the CLI-known folder name to re-enable this function. The enrichment layer partially compensates (spec-folder-extractor provides similar content), but `SPEC_FILES` in the session data output will be empty unless `collectedData.SPEC_FOLDER` is set.

**Adversarial Self-Check:**

| Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
|---------|----------------|-------------------|-----------------|----------------|
| SPEC_FOLDER not backfilled; detectRelatedDocs gated | P1 | enrichStatelessData compensates by injecting spec-folder content upstream; SPEC_FILES may be populated via alternate paths | Confirmed — the enrichment populates observations/FILES but does NOT set collectedData.SPEC_FOLDER, so the specific detectRelatedDocs path (which provides SPEC_FILES for the template) remains dead. The compensation is partial, not full. | P1 |

**Suggested fix** (~2 LOC): Before line 659 in `collect-session-data.ts`, add:
```typescript
if (!collectedData.SPEC_FOLDER && folderName) {
  collectedData.SPEC_FOLDER = folderName;
}
```

### P2 — userPrompts array unfiltered by relevance (Phase 0, Task 0.2)

**File**: `scripts/utils/input-normalizer.ts:430-433`
**Impact**: The plan said "filter prompts by spec-folder relevance". Tool calls and assistant response observations are filtered, but the `userPrompts` output array includes all exchanges. In practice, userPrompts are short metadata used for message counting and timestamp extraction, so the contamination risk is low. The filtering of observations and tool calls addresses the substantive V8 concern.

### P2 — enrichStatelessData gate uses `_source === 'file'` not stateless detection (Phase 1, Task 1.2)

**File**: `scripts/core/workflow.ts:439`
**Impact**: The plan says "Gate: only runs for stateless path (match existing detection at workflow.ts:447)". The function gates on `collectedData._source === 'file'` rather than matching the `isStatelessMode` boolean used at the call site (line 655). This is equivalent in effect — the call site already gates on `isStatelessMode`, so the inner check is defense-in-depth. The `_source` check is actually broader (it would also skip enrichment for pre-loaded file-backed data passed via API), which is correct behavior. Not a bug, but the implementation chose a different (arguably better) gating mechanism than the plan specified.

---

## Verdict

**Score: 91/100 — EXCELLENT**

| Dimension | Score | Notes |
|-----------|-------|-------|
| Correctness | 27/30 | All features implemented; SPEC_FOLDER backfill gap (P1) prevents detectRelatedDocs from running in stateless mode |
| Security | 25/25 | Path traversal guard present (collect-session-data.ts:725-729); provenance markers prevent synthetic data from being treated as authoritative; contamination guard runs before enrichment |
| Patterns | 19/20 | Follows existing project patterns (interfaces, provenance, error handling); minor divergence in gate mechanism (P2) |
| Maintainability | 14/15 | Clean modular extractors; good separation of concerns; synthetic timestamp approach is clear |
| Performance | 10/10 | Git commands bounded (MAX_COMMITS=20, 24h window, 5s timeout); parallel extraction in enrichStatelessData; file caps enforced |

**Implementation completeness**: 9/11 tasks DONE, 1 PARTIAL, 1 DONE (minor divergence). Phases 0-2 are substantially complete. The one P1 finding (SPEC_FOLDER backfill) is a ~2-line fix that would fully close the remaining gap.

**Recommendation**: PASS with 1 required fix (P1: SPEC_FOLDER backfill in collect-session-data.ts).
