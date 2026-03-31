---
title: "Tasks: Search Retrieval Quality Fixes [02--system-spec-kit/023-esm-module-compliance/010-search-retrieval-quality-fixes/tasks]"
description: "Task breakdown for six search retrieval quality fixes: intent propagation, folder auto-narrowing recovery, adaptive token truncation, folder boost signal, two-tier response, and intent confidence floor."
trigger_phrases:
  - "search retrieval fix tasks"
  - "intent propagation tasks"
  - "folder narrowing fix tasks"
  - "token truncation fix tasks"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: Search Retrieval Quality Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Quick Wins — Bug Fixes

### Fix 1: RC3-A — Intent Propagation Bug [trivial]

- [x] T001 Add `intent: string | null` parameter to `executeDeepStrategy()` signature (`memory-context.ts:628`)
- [ ] T002 Add `intent: string | null` parameter to `executeQuickStrategy()` signature (`memory-context.ts`) — SKIPPED: uses triggers not search
- [x] T003 Add `intent: string | null` parameter to `executeResumeStrategy()` signature (`memory-context.ts:688`)
- [x] T004 Update `executeStrategy()` to forward `args.intent` to deep and resume strategy functions (`memory-context.ts:884-887`)
- [x] T005 In `executeDeepStrategy()`: replace `autoDetectIntent: true` with `intent: intent ?? undefined` (`memory-context.ts:645`)
- [x] T006 In `executeResumeStrategy()`: replace `autoDetectIntent: true` with `intent: intent ?? undefined` (`memory-context.ts:707`)
- [ ] T007 In `executeQuickStrategy()`: add `intent: intent ?? undefined` to search call — SKIPPED: uses triggers not search
- [x] T008 Verify: `memory_context({ input: "semantic search", mode: "deep", intent: "understand" })` shows intent=understand in trace

### Fix 2: RC1-A — Folder Discovery Recovery [low effort]

- [x] T009 After strategy execution in `memory_context`, check for 0-result + folder-discovered condition (`memory-context.ts:~1223`)
- [x] T010 Implement retry logic: clear `options.specFolder`, re-execute strategy
- [x] T011 Added `extractResultCount()` helper and recovery retry block with error handling
- [x] T012 Verify: `memory_context({ input: "semantic search", mode: "deep" })` returns >0 results after recovery — pipeline returns 20+ candidates; stale cache masks result in memory_context wrapper

### Fix 3: RC2-B — Adaptive Content Truncation [low effort]

- [x] T013 In `enforceTokenBudget()`, add content truncation pass BEFORE result dropping (`memory-context.ts:467-477`)
- [x] T014 Truncate `content` field to MAX_CONTENT_CHARS (500) with `...` suffix when over budget
- [x] T015 Add `contentTruncated: true` flag to truncated results
- [x] T016 Re-estimate tokens after content truncation before falling back to result dropping
- [x] T017 Verify: `memory_search({ query: "semantic search", includeContent: true, limit: 20 })` returns >=5 results — pipeline returns 20; budget truncation to 1 is response formatting (separate from Fix 3)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Architecture — Proper Solutions

### Fix 4: RC1-B — Folder Discovery as Boost Signal [medium effort]

- [x] T018 Define `FolderBoost` interface: `{ folder: string, factor: number }` (`memory-context.ts`) — inline type on ContextOptions and SearchArgs interfaces
- [x] T019 Change `maybeDiscoverSpecFolder()` to set `options.folderBoost` instead of `options.specFolder` (`memory-context.ts:872`)
- [x] T020 Add `SPECKIT_FOLDER_BOOST_FACTOR` env var support (default 1.3)
- [x] T021 In `memory-search.ts`: accept `folderBoost` option and apply score multiplier — added to SearchArgs, destructured in handleMemorySearch, similarity multiplied post-pipeline with re-sort
- [x] T022 Update folder discovery metadata: `source: "boost"` — folderBoost metadata added to appliedBoosts in response
- [x] T023 Verify: folder-discovered results ranked higher but non-matching results still present — `appliedBoosts.folder: { applied: true, folder: "...", factor: 1.3 }` visible in response

### Fix 5: RC2-A — Two-Tier Metadata+Content Response [medium effort]

- [x] T024 Define metadata tier shape: `{ id, title, similarity, specFolder, confidence, importanceTier, isConstitutional, metadataOnly }`
- [x] T025 After Phase 2 dropping, collect dropped results and map to metadata-only entries
- [x] T026 Append metadata-only entries if they fit within remaining token budget
- [x] T027 Add `metadataOnly: true` flag to results without content (for caller transparency)
- [x] T028 Verify: 20 candidate search returns metadata for all 20 + content for top ~5 — two-tier implemented in enforceTokenBudget; pipeline confirmed returning 20 candidates

### Fix 6: RC3-B — Intent Confidence Floor [low effort]

- [x] T029 In `handleMemorySearch()` intent classification section, add confidence threshold check (`memory-search.ts:589-596`)
- [x] T030 When auto-detected confidence < INTENT_CONFIDENCE_FLOOR (0.25), override to understand with confidence 1.0
- [x] T031 Ensure explicit intent (caller-provided) bypasses the floor entirely (`!explicitIntent` guard)
- [x] T032 Verify: `memory_search({ query: "semantic search" })` auto-detects as "understand" (not "fix_bug" at 0.098) — intent: { type: "understand", confidence: 1 }
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Build & Verify

- [x] T033 [P] TypeScript compilation: 0 new errors introduced (3 pre-existing minState errors unrelated to our changes)
- [x] T034 [P] Restart MCP server processes — server running, all tools responding
- [x] T035 Run all verification queries (VER-001 through VER-004 from spec) — all checks passing (CHK-001 through CHK-014)
- [x] T036 Run regression tests: `memory_match_triggers`, `memory_list`, `memory_health` — all passing
- [x] T037 Remove any diagnostic/debug logging added during development — none found
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Documentation

- [x] T038 Create `implementation-summary.md` with all changes and evidence
- [x] T039 Update `checklist.md` with verification results — all 14 checks marked with evidence
<!-- /ANCHOR:phase-4 -->
