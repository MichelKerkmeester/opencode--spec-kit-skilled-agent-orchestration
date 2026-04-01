---
title: "Implementation Plan: Search Retrieval Quality Fixes [02--system-spec-kit/023-esm-module-compliance/010-search-retrieval-quality-fixes/plan]"
description: "Six-fix implementation plan for memory_context/memory_search retrieval quality: intent propagation, folder auto-narrowing recovery, adaptive token truncation, folder boost signal, two-tier response, and intent confidence floor."
trigger_phrases:
  - "search retrieval fix plan"
  - "intent propagation fix plan"
  - "folder narrowing fix plan"
  - "token truncation fix plan"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: Search Retrieval Quality Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (compiled to ESM JS) |
| **Framework** | MCP Server (Spec Kit Memory) |
| **Primary File** | `mcp_server/handlers/memory-context.ts` |
| **Secondary Files** | `mcp_server/handlers/memory-search.ts`, `mcp_server/lib/search/folder-discovery.ts` |
| **Testing** | Manual verification via MCP tools |

### Overview

Fix six retrieval quality issues in the Spec Kit Memory search pipeline, prioritized from trivial bug fixes to architectural improvements. All fixes target the `memory-context.ts` handler (5 of 6) and `memory-search.ts` (1 of 6), with one touching `folder-discovery.ts`. The fixes are ordered so each is independently deployable and testable.

### Code Location Summary

| Fix | File | Key Lines | Function |
|-----|------|-----------|----------|
| RC3-A | `memory-context.ts` | 932-952 | `executeStrategy()` |
| RC3-A | `memory-context.ts` | 667-686, 730-751 | `executeDeepStrategy()`, `executeResumeStrategy()` |
| RC1-A | `memory-context.ts` | 1351-1364 | Folder-discovery recovery retry block |
| RC2-B | `memory-context.ts` | 473-485 | `enforceTokenBudget()` adaptive truncation pass |
| RC1-B | `memory-context.ts` | 908-922, 1287-1292 | `maybeDiscoverSpecFolder()` plus discovered-folder seeding |
| RC1-B | `folder-discovery.ts` | 960-979 | `discoverSpecFolder()` |
| RC2-A | `memory-context.ts` | 494-511 | `enforceTokenBudget()` metadata-only append |
| RC3-B | `memory-search.ts` | 591-597 | Intent confidence floor |

All paths relative to `.opencode/skill/system-spec-kit/`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause analysis complete with diagnostic evidence
- [x] Exact code locations identified for all 6 fixes
- [x] Fix order prioritized (quick wins first)
- [x] Verification queries defined

### Definition of Done
- [x] RC3-A: Explicit intent forwarded to all 4 strategy functions
- [x] RC1-A: Auto-retry without folder filter when discovery yields 0 results
- [x] RC2-B: Adaptive content truncation preserves 5+ of 20 results
- [x] RC1-B: Folder discovery records boost metadata and the narrow-folder retry clears `specFolder` when the first pass returns 0 results
- [x] RC2-A: Two-tier response returns metadata for all, content for top N
- [x] RC3-B: Intent confidence floor at 0.25, fallback to "understand"
- [x] All verification queries pass (VER-001 through VER-004)
- [x] TypeScript compiles without errors
- [x] MCP server restarts cleanly
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Current Flow (Broken)

```
memory_context({ input, intent: "understand", mode: "deep" })
  │
  ├─ resolveEffectiveMode() → detects intent ✓
  │
  ├─ maybeDiscoverSpecFolder() → discovers folder, applies as HARD FILTER
  │   └─ options.specFolder = "022-hybrid-rag-fusion/.../011-research-based-refinement"
  │
  ├─ executeStrategy("deep")
  │   └─ executeDeepStrategy(input, options)  ← intent NOT passed
  │       └─ handleMemorySearch({ autoDetectIntent: true })  ← re-detects as "fix_bug"
  │           └─ search scoped to discovered folder → 0 results
  │
  └─ enforceTokenBudget(result, 3500)
      └─ If results existed: truncate 20 → 1 (content too large)
```

### Target Flow (Fixed)

```
memory_context({ input, intent: "understand", mode: "deep" })
  │
  ├─ resolveEffectiveMode() → detects intent ✓
  │
  ├─ maybeDiscoverSpecFolder() → discovers folder, applies as BOOST (not filter)
  │   └─ options.folderBoost = { folder: "...", factor: 1.3 }
  │
  ├─ executeStrategy("deep")
  │   └─ executeDeepStrategy(input, intent, options)  ← intent FORWARDED
  │       └─ handleMemorySearch({ intent: "understand" })  ← explicit, no re-detection
  │           └─ search returns 20 candidates (no folder filter)
  │
  └─ enforceTokenBudget(result, 3500)
      └─ Two-tier: metadata for all 20, content for top 5
      └─ Per-result content truncation (500 chars) if needed
```

### Data Flow

```
Fix 1 (RC3-A): intent ──→ executeStrategy() ──→ all 4 strategy functions ──→ handleMemorySearch()
Fix 2 (RC1-A): 0 results ──→ check folderDiscovery.discovered ──→ retry without specFolder
Fix 3 (RC2-B): enforceTokenBudget() ──→ truncate content per-result (not drop results)
Fix 4 (RC1-B): maybeDiscoverSpecFolder() ──→ set folderBoost instead of specFolder
Fix 5 (RC2-A): enforceTokenBudget() ──→ metadata tier (always) + content tier (budget-fit)
Fix 6 (RC3-B): handleMemorySearch() ──→ if auto-detected confidence < 0.25 → "understand"
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Quick Wins (Fixes 1-3) — Bug Fixes

#### Fix 1: RC3-A — Intent Propagation (trivial)

**What:** Add `intent` parameter to `executeDeepStrategy()` and `executeResumeStrategy()` function signatures. `executeFocusedStrategy()` already accepts `intent`, and `executeStrategy()` forwards `args.intent` to deep, focused, and resume strategies while leaving quick trigger matching unchanged.

**Where:**
- `memory-context.ts` lines 939-951: `executeStrategy()` forwards `args.intent || null` to deep, resume, and focused branches; quick stays `executeQuickStrategy(input, options)`
- `memory-context.ts` lines 667-686: `executeDeepStrategy()` signature and `handleMemorySearch()` call use `intent: intent ?? undefined`
- `memory-context.ts` lines 730-751: `executeResumeStrategy()` signature and `handleMemorySearch()` call use `intent: intent ?? undefined`

**Risk:** Low — focused strategy already works this way; extending the pattern to others.

#### Fix 2: RC1-A — Folder Discovery Recovery (low effort)

**What:** After `memory_context` receives 0 results AND folder discovery was applied, retry the search without the folder filter.

**Where:**
- `memory-context.ts` lines 1351-1364: if a discovered folder produced 0 results, clear `options.specFolder` and re-execute the strategy.

**Logic:**
```
if (discoveredFolder && resultCount === 0) {
  // Retry without folder filter
  options.specFolder = undefined;
  result = await executeStrategy(mode, input, intent, options);
}
```

**Risk:** Low — only triggers when search already failed; worst case is a second search call.

#### Fix 3: RC2-B — Adaptive Content Truncation (low effort)

**What:** Instead of dropping entire results when over budget, truncate the `content` field of each result to fit more results within the budget.

**Where:**
- `memory-context.ts` lines 465-473: Modify the truncation loop in `enforceTokenBudget()`.

**Logic:**
```
// Before dropping results, try truncating content first
const MAX_CONTENT_CHARS = 500;
for (const result of currentResults) {
  if (result.content && result.content.length > MAX_CONTENT_CHARS) {
    result.content = result.content.substring(0, MAX_CONTENT_CHARS) + '...';
    result.contentTruncated = true;
  }
}
// Re-estimate tokens after truncation
// Only then fall back to dropping results if still over budget
```

**Risk:** Low — callers already handle partial content; adds a `contentTruncated` flag for transparency.

### Phase 2: Architecture (Fixes 4-6) — Proper Solutions

#### Fix 4: RC1-B — Folder Discovery as Boost Signal (medium effort)

**What:** Folder discovery now attaches a `folderBoost` signal for ranking, but the handler still seeds `options.specFolder` with the discovered folder before the first pass so session state and retry logic can detect over-narrow searches.

**Where:**
- `memory-context.ts` lines 908-922: `maybeDiscoverSpecFolder()` populates `options.folderBoost = { folder, factor }`
- `memory-context.ts` lines 1287-1292: the handler still copies the discovered folder into `options.specFolder` before the initial execution
- `memory-search.ts` lines 701-721: accept `folderBoost` and apply a post-pipeline similarity multiplier for matching file paths
- `folder-discovery.ts`: No changes needed (returns folder path, consumer decides how to use it)

**Design Decision:** The boost factor (1.3x) should be configurable via `SPECKIT_FOLDER_BOOST_FACTOR` env var with 1.3 default.

**Risk:** Medium — changes scoring behavior; requires testing with diverse queries to validate ranking quality.

#### Fix 5: RC2-A — Two-Tier Metadata+Content Response (medium effort)

**What:** Restructure `enforceTokenBudget()` to always include a metadata tier (title, score, folder, confidence, id) for ALL results, and a content tier (full file content) for only the top N results that fit within the remaining budget.

**Where:**
- `memory-context.ts` lines 286-543: Refactor `enforceTokenBudget()`.

**Logic:**
```
// Tier 1: Metadata for ALL results (compact, ~50 tokens each)
const metadataResults = results.map(r => ({
  id: r.id, title: r.title, similarity: r.similarity,
  specFolder: r.specFolder, confidence: r.confidence,
  importanceTier: r.importanceTier
}));

// Tier 2: Full content for top N that fit remaining budget
const remainingBudget = budgetTokens - estimateTokens(metadataResults);
const contentResults = packContentByBudget(results, remainingBudget);
```

**Risk:** Medium — changes response shape; callers that expect `content` on all results need adaptation.

#### Fix 6: RC3-B — Intent Confidence Floor (low effort)

**What:** In `handleMemorySearch()`, when auto-detected intent confidence is below 0.25, default to `understand` intent instead of applying a nonsense classification.

**Where:**
- `memory-search.ts` lines 591-597: After intent auto-detection, add confidence check.

**Logic:**
```
if (detectedIntent && intentConfidence < 0.25 && !explicitIntent) {
  detectedIntent = 'understand';
  intentConfidence = 1.0;
}
```

**Risk:** Low — only affects very low-confidence detections that are effectively random anyway.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Query | Expected After Fix | Validates |
|-----------|-------|-------------------|-----------|
| Manual | `memory_context({ input: "semantic search", mode: "deep", intent: "understand" })` | >0 results, intent=understand | RC3-A |
| Manual | `memory_context({ input: "semantic search", mode: "deep" })` | >0 results (folder recovery) | RC1-A |
| Manual | `memory_search({ query: "semantic search", includeContent: true, limit: 20 })` | >=5 results returned | RC2-B |
| Manual | `memory_search({ query: "semantic search" })` | Intent="understand" (not fix_bug) | RC3-B |
| Regression | `memory_context({ input: "resume previous work", mode: "resume" })` | Still works correctly | RC3-A |
| Regression | `memory_search({ query: "CocoIndex" })` | Still returns CocoIndex results | All |
| Regression | `memory_match_triggers({ prompt: "CocoIndex" })` | Trigger matching unaffected | None |
| Regression | `memory_health()` | Reports healthy | All |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 007 fixes (search pipeline) | Internal | Complete | Prerequisite met |
| TypeScript build pipeline | Internal | Green | Required for compilation |
| MCP server restart | Internal | Green | Required after changes |
| Voyage AI API | External | Green | Embedding generation working |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:critical-files -->
### Critical Files

| File | Role | Edit Type |
|------|------|-----------|
| `mcp_server/handlers/memory-context.ts` | Main handler — intent routing, folder discovery, budget enforcement | Modify (5 of 6 fixes) |
| `mcp_server/handlers/memory-search.ts` | Search handler — intent classification | Modify (Fix 6) |
| `mcp_server/lib/search/folder-discovery.ts` | Folder discovery utility | Read-only (Fix 4 may modify) |

All paths relative to `.opencode/skill/system-spec-kit/`.
<!-- /ANCHOR:critical-files -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any fix causes search regression or MCP server failures
- **Procedure**: Each fix is independent — revert specific changes via `git checkout` on affected files
- **Recovery**: Restart MCP server; search returns to pre-fix behavior (broken but stable)
- **Note**: Fixes 1-3 (quick wins) can be deployed independently of Fixes 4-6 (architecture)
<!-- /ANCHOR:rollback -->
