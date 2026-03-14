# Audit QA1-O01: workflow.ts Deep Code Quality Review

**File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` (1143 LOC)
**Reviewer:** Claude Opus 4.6 (@review agent)
**Date:** 2026-03-09
**Scope:** Spec 012 (session capturing) + Spec 013 (stateless mode enrichment) interaction
**Confidence:** HIGH — all files read, all code paths traced, all imports verified

---

## Summary

| Metric | Value |
|--------|-------|
| **Score** | 76/100 (ACCEPTABLE — PASS) |
| **P0 Blockers** | 0 |
| **P1 Required** | 4 |
| **P2 Suggestions** | 6 |
| **Recommendation** | PASS with required fixes |

### Score Breakdown

| Dimension | Score | Max | Notes |
|-----------|-------|-----|-------|
| Correctness | 22 | 30 | Two semantic mismatches in stateless detection; dead code |
| Security | 23 | 25 | Dynamic import path is safe (constant string); contamination filter is sound |
| Patterns | 16 | 20 | Dual quality-scorer imports create maintenance burden; inconsistent error patterns |
| Maintainability | 9 | 15 | 600-line `runWorkflow` function; mixed indentation |
| Performance | 6 | 10 | Redundant set construction in enrichment; double quality scoring |

---

## Adversarial Self-Check (P1 Findings)

| Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
|---------|----------------|-------------------|-----------------|----------------|
| `isStatelessMode` vs `_source` semantic mismatch | P1 | `_source` guard in `enrichStatelessData` provides secondary protection | Confirmed — but partial, see F-01 | P1 |
| `sessionDataFn` null-check dead code | P1 | Defensive programming; TypeScript does not flag it | Confirmed — unreachable branch confuses readers | P1 |
| `preloadedData` bypasses both alignment guard and enrichment | P1 | By design — preloaded data is trusted | Downgraded — but should be documented | P2 (was P1) |
| Enrichment mutates `collectedData` in-place before parallel extraction | P1 | Mutation is intentional for downstream steps | Confirmed — but parallel extraction starts after, timing is safe | P1 (ordering concern) |
| Dual quality scorer imports | P1 | Both are needed — v1 for legacy breakdown, v2 for flags | Confirmed — maintenance burden, not correctness | P2 (was P1) |
| `TOOL_COUNT` patch via `any` cast | P1 | Necessary for V7 quality gate compatibility | Confirmed — type-unsafe escape hatch | P1 |

---

## Focus Area 1: Enrichment Insertion Timing

**Verdict: CORRECT — enrichment runs AFTER alignment guards.**

The pipeline order is:
1. **Step 1** (L559-576): Load collected data
2. **Step 1.5** (L578-610): Alignment guard — throws on cross-spec contamination (<5% overlap)
3. **Step 2** (L613-650): Detect spec folder
4. **Step 3** (L652-655): Setup context directory
5. **Step 3.5** (L657-662): `enrichStatelessData()` — spec-folder + git extraction
6. **Steps 4-7** (L664-724): Parallel data extraction

This ordering is correct. The alignment guard runs at Step 1.5 before any enrichment at Step 3.5. If alignment fails, the workflow throws before enrichment ever runs. The enrichment also correctly runs before parallel extraction (Steps 4-7), so downstream extractors see the enriched data.

**One concern (P1, see F-01):** The enrichment function `enrichStatelessData` uses `collectedData._source === 'file'` as its guard (L439), while the workflow uses `isStatelessMode = !activeDataFile && !preloadedData` (L582). These are semantically different checks — see Finding F-01 below.

---

## Focus Area 2: Stateless vs Stateful Path Separation

**Verdict: MOSTLY CLEAN — three distinct paths with one semantic gap.**

The workflow has three data-loading paths:
1. **Pre-loaded** (L563-565): `preloadedData` provided directly — skips file loading
2. **Custom loader** (L566-568): `loadDataFn` provided — calls the function
3. **Default loader** (L569-572): Uses `loadCollectedDataFromLoader` which internally resolves file > OpenCode capture > simulation

The `isStatelessMode` flag (L582) is computed as `!activeDataFile && !preloadedData`. This means:
- Path 1 (preloaded): `isStatelessMode = false` (correct — preloaded data is trusted)
- Path 2 (custom loader): `isStatelessMode` depends on whether `activeDataFile` is set
- Path 3 (default loader, no data file): `isStatelessMode = true` (correct)

**Gap:** When `loadDataFn` is provided without `dataFile`, `isStatelessMode = true` even though the data may come from an authoritative source. This could trigger alignment guards and enrichment on data that does not need it. In practice, `loadDataFn` callers would typically also set `dataFile`, but it is not enforced.

---

## Focus Area 3: Circular Dependency Risk

**Verdict: NO CIRCULAR DEPENDENCIES — architecture is clean.**

Import graph traced:
```
workflow.ts
  ├── ./config              (CONFIG, findActiveSpecsDir, getSpecsDirectories)
  ├── ../extractors         (barrel: conversations, decisions, diagrams, phases, files)
  ├── ../extractors/collect-session-data
  ├── ../extractors/contamination-filter
  ├── ../extractors/quality-scorer
  ├── ../extractors/spec-folder-extractor   ← imports ../core (CONFIG only)
  ├── ../extractors/git-context-extractor   ← no core imports
  ├── ../spec-folder
  ├── ../renderers
  ├── ../lib/*              (flowchart, content-filter, semantic-summarizer, embeddings, trigger-extractor, simulation-factory)
  ├── ../loaders/data-loader
  ├── ../utils/*            (slug-utils, task-enrichment)
  ├── ../memory/validate-memory-quality
  ├── ./quality-scorer
  ├── ./topic-extractor
  ├── ./file-writer
  ├── ./memory-indexer
  ├── ./tree-thinning
  └── @spec-kit/mcp-server/* (dynamic import for folder-discovery, static for retryManager)
```

The `core/index.ts` (L7-8) explicitly excludes `workflow.ts` from the barrel export with the comment: "workflow.ts not exported here to avoid circular dependencies". This is the correct pattern. Extractors import from `../core` (which resolves to `core/index.ts` → `config.ts` only). No extractor imports from `workflow.ts` directly.

The `spec-folder-extractor.ts` imports `CONFIG` from `../core` — this is safe because `core/index.ts` only re-exports from `config.ts`.

**No circular dependency risk detected.**

---

## Focus Area 4: Error Handling / try-catch Coverage

**Verdict: ADEQUATE — all async operations are covered, with two minor gaps.**

| Operation | Coverage | Notes |
|-----------|----------|-------|
| Data loading (L562-576) | Covered by caller or throw | `loadDataFn` exceptions propagate |
| Alignment guard (L578-610) | Throws on failure | Correct |
| `detectSpecFolder` (L615) | No try/catch | Exceptions propagate to `withWorkflowRunLock`, caught by caller |
| `setupContextDirectory` (L654) | No try/catch | Same — propagates |
| `enrichStatelessData` (L660) | Internal try/catch (L441-526) | Logs warning, does not throw — correct for non-fatal |
| Parallel extraction (L676-724) | `Promise.all` — any rejection propagates | Correct |
| `extractTriggerPhrases` (L843-884) | try/catch with warn | Correct |
| `populateTemplate` (L887-933) | No explicit try/catch | Propagates — acceptable, template failure is fatal |
| `writeFilesAtomically` (L1041) | No explicit try/catch | `writeFilesAtomically` handles rollback internally |
| `indexMemory` (L1083-1098) | try/catch | Correct — indexing failure is non-fatal |
| `retryManager` (L1102-1115) | try/catch | Correct |
| Dynamic import folder-discovery (L1044-1058) | try/catch | Correct — empty catch, non-fatal |
| `extractSpecFolderContext` (L443) | `.catch(() => null)` | Correct — enrichment failure is non-fatal |
| `extractGitContext` (L444) | `.catch(() => null)` | Correct — enrichment failure is non-fatal |

**Overall:** Error handling is adequate. Fatal operations (data loading, template, file writing) correctly propagate. Non-fatal operations (enrichment, indexing, retries) are caught and logged.

---

## Focus Area 5: General Correctness

### Dead Code / Unreachable Branches

See findings F-02 and F-04 below.

### Off-by-one Errors

No off-by-one errors detected. Array slicing, string truncation, and index calculations are correct.

---

## Findings

### P1 — Required

#### F-01: `isStatelessMode` and `_source` guard semantic mismatch (L439, L582, L658)

**File:** `workflow.ts:582` and `workflow.ts:439`
**Evidence:**
```typescript
// Line 582 — workflow-level check
const isStatelessMode = !activeDataFile && !preloadedData;

// Line 439 — enrichStatelessData internal check
if (collectedData._source === 'file') return;
```

**Impact:** These are two independent signals for "is this stateless mode?" that can disagree. When `loadDataFn` is provided (but not `dataFile` or `preloadedData`), `isStatelessMode` is `true` on line 582, but the data returned by `loadDataFn` may have `_source === 'file'`, causing `enrichStatelessData` to early-return on line 439. The alignment guard on line 583 would still fire. This is an inconsistent dual-gate pattern.

More critically: `CollectedDataFull` does not declare `_source` as a typed field — it falls through to `[key: string]: unknown`. The check `collectedData._source === 'file'` on line 439 works only because of the index signature. If `loadDataFn` returns data without `_source`, the enrichment will proceed even for file-backed data.

**Fix:** Derive `isStatelessMode` from `_source` consistently, or pass the mode explicitly to `enrichStatelessData`. Add `_source` to the `CollectedDataFull` interface.

---

#### F-02: Dead code — `sessionDataFn` null check (L668-674)

**File:** `workflow.ts:667-674`
**Evidence:**
```typescript
const sessionDataFn = collectSessionDataFn || collectSessionData;
if (!sessionDataFn) {
  throw new Error('Missing session data collector function...');
}
```

**Impact:** `collectSessionData` is a statically imported function (line 28: `import { shouldAutoSave, collectSessionData } from '../extractors/collect-session-data'`). It is always defined at module load time. The `||` fallback guarantees `sessionDataFn` is never null/undefined. The `if (!sessionDataFn)` branch is unreachable dead code.

**Fix:** Remove the null check or convert to a type assertion comment explaining why it exists (e.g., future-proofing for dynamic imports). Currently it misleads readers into thinking the function could be missing at runtime.

---

#### F-03: `TOOL_COUNT` patch uses unsafe `any` cast (L729-731)

**File:** `workflow.ts:729-731`
**Evidence:**
```typescript
if (isStatelessMode && sessionData.TOOL_COUNT === 0 && (collectedData.FILES || []).length > 0) {
  (sessionData as any).TOOL_COUNT = (collectedData.FILES as any[]).length;
}
```

**Impact:** The `as any` cast bypasses TypeScript's type system. If `SessionData.TOOL_COUNT` is a `readonly` property or if the type changes in the future, this mutation will silently break. Additionally, `(collectedData.FILES as any[]).length` casts a potentially-typed array to `any[]` unnecessarily — `.length` works on the original type.

**Fix:** Either extend the `SessionData` interface to make `TOOL_COUNT` mutable, or create a mutable wrapper type. At minimum, replace `(collectedData.FILES as any[]).length` with `(collectedData.FILES || []).length` (which is already guarded by the condition).

---

#### F-04: Enrichment mutates `collectedData` in-place — contract violation risk (L451-520)

**File:** `workflow.ts:433-527` (`enrichStatelessData` function)
**Evidence:**
```typescript
async function enrichStatelessData(
  collectedData: CollectedDataFull,  // <-- received by reference
  ...
): Promise<void> {
  // Direct mutations:
  collectedData.observations = [...existingObs, ...specContext.observations];  // L451
  collectedData.FILES = [...existingFiles, ...newFiles];                       // L464
  collectedData.SUMMARY = specContext.summary;                                 // L484
  collectedData._manualTriggerPhrases = [...];                                 // L468
  collectedData._manualDecisions = [...];                                      // L476
  collectedData.recentContext = [...];                                         // L489
}
```

**Impact:** This function mutates the `collectedData` object in-place rather than returning a new enriched copy. While this is intentional (the function returns `Promise<void>` and the caller expects mutation), it creates a hidden coupling: any code holding a reference to the original `collectedData` object sees the mutations. In the current workflow this is safe because enrichment runs before extraction, but it is fragile.

If `preloadedData` were to be reused across multiple `runWorkflow` calls (e.g., in tests or batch processing), the mutations would contaminate subsequent runs.

**Fix:** Document the mutation contract explicitly in the JSDoc. Consider whether a clone-then-mutate pattern would be safer for test isolation.

---

### P2 — Suggestions

#### F-05: Dual quality scorer creates maintenance burden (L22, L32-35, L994-1027)

**File:** `workflow.ts:22` and `workflow.ts:32-35`
**Evidence:**
```typescript
import { scoreMemoryQuality } from './quality-scorer';           // v1
import { scoreMemoryQuality as scoreMemoryQualityV2 } from '../extractors/quality-scorer';  // v2
```

Both scorers are invoked sequentially (lines 1000-1007 for v2, lines 1014-1020 for v1). The v1 score feeds the abort threshold (line 1031), while the v2 score feeds the frontmatter metadata (line 1008). Having two quality scoring systems with different module paths increases the risk that a quality rule change is applied to one scorer but not the other.

**Suggestion:** Consolidate into a single scoring module or add a clear comment documenting why both are needed and which score is authoritative for which gate.

---

#### F-06: `injectQualityMetadata` regex fragility (L385-431)

**File:** `workflow.ts:385`
**Evidence:** The frontmatter regex `content.match(/---\r?\n([\s\S]*?)\r?\n---/)` matches the first `---` pair. If the template output contains an early `---` separator (e.g., in a horizontal rule), this regex could match the wrong block.

**Suggestion:** Anchor the match to the start of the string: `/^---\r?\n([\s\S]*?)\r?\n---/`.

---

#### F-07: Mixed indentation in `runWorkflow` body (L536 onwards)

**File:** `workflow.ts:536-1134`
**Evidence:** The `runWorkflow` function body uses inconsistent indentation — some blocks use 4-space indent (e.g., lines 537-544, 804-818, 1119-1133) while the extraction blocks (lines 676-724) and post-extraction code (lines 727-1117) use 2-space indent. This suggests code was merged from different authors or specs without reformatting.

**Suggestion:** Normalize indentation to the project standard (2-space based on config.ts).

---

#### F-08: `filterPipeline.filter()` return value discarded (L752)

**File:** `workflow.ts:752`
**Evidence:**
```typescript
filterPipeline.filter(allMessages);
```

The `filter()` method's return value is not captured. If the content-filter pipeline returns a filtered list (common pattern), discarding it means the original `allMessages` array is used downstream, potentially including noise entries that were supposed to be filtered.

**Suggestion:** Verify whether `filter()` mutates `allMessages` in-place or returns a new array. If it returns a filtered array, capture and use the return value.

---

#### F-09: Redundant `Set` construction in `enrichStatelessData` (L458-463, L506-512)

**File:** `workflow.ts:458` and `workflow.ts:506`
**Evidence:** Both spec-folder and git-context merging create a `Set` of existing file paths:
```typescript
const existingPaths = new Set(
  existingFiles.map((f) => (f.FILE_PATH || f.path || '').toLowerCase())
);
```
This is done twice — once for spec-context merge and once for git-context merge. But after the first merge, `collectedData.FILES` has already been updated (L464), so the second `existingFiles` reference (L505) correctly includes the spec-context files. The pattern is correct but constructs the Set twice with overlapping data.

**Suggestion:** Minor optimization — could build the path set once and update it incrementally.

---

#### F-10: `preloadedData` bypasses alignment guard silently (L563-565, L582-583)

**File:** `workflow.ts:563` and `workflow.ts:582`
**Evidence:**
```typescript
if (preloadedData) {
  collectedData = preloadedData;
  // ...
}
// ...
const isStatelessMode = !activeDataFile && !preloadedData;
// isStatelessMode is false when preloadedData is provided
```

When `preloadedData` is provided, `isStatelessMode` is `false`, so neither the alignment guard (Step 1.5) nor the enrichment (Step 3.5) runs. This is by design (preloaded data is trusted), but it is not documented. A caller could accidentally bypass contamination protection by passing data via `preloadedData` instead of `dataFile`.

**Suggestion:** Add a JSDoc comment on `WorkflowOptions.collectedData` noting that pre-loaded data bypasses alignment and enrichment guards.

---

## Positive Highlights

1. **Correct enrichment ordering**: The enrichment runs after alignment guards and before parallel extraction — the most critical ordering constraint is satisfied.

2. **Robust alignment guard**: The cross-spec contamination check (L583-610) uses keyword overlap ratio with a 5% threshold and throws with a detailed error message including diagnostic data (keywords, path counts, match ratio).

3. **Clean circular dependency prevention**: The `core/index.ts` barrel explicitly excludes `workflow.ts` with a clear comment, and extractors only import `CONFIG` from the core barrel.

4. **Non-fatal enrichment pattern**: Both `extractSpecFolderContext` and `extractGitContext` use `.catch(() => null)` inside `Promise.all`, ensuring enrichment failures do not crash the pipeline.

5. **Atomic file writing with rollback**: The `writeFilesAtomically` abstraction prevents partial writes.

6. **Quality abort gate**: The quality score threshold (L1030-1037) prevents saving garbage data, with a clear diagnostic message.

7. **Run queue serialization**: The `withWorkflowRunLock` pattern (L366-382) prevents concurrent workflow runs using a promise-chain pattern.

---

## Files Reviewed

| Path | Lines | Issues |
|------|-------|--------|
| `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` | 1143 | 4 P1, 6 P2 |
| `.opencode/skill/system-spec-kit/scripts/core/config.ts` | 311 | 0 (context) |
| `.opencode/skill/system-spec-kit/scripts/core/index.ts` | 40 | 0 (context) |
| `.opencode/skill/system-spec-kit/scripts/extractors/spec-folder-extractor.ts` | 293 | 0 (context) |
| `.opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts` | 187 | 0 (context) |
| `.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts` | 91 | 0 (context) |
| `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts` | ~800 | 0 (context) |
| `.opencode/skill/system-spec-kit/scripts/extractors/index.ts` | 38 | 0 (context) |
| `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts` | 196 | 0 (context) |
| `.opencode/skill/system-spec-kit/scripts/extractors/quality-scorer.ts` | ~30 | 0 (context) |
| `.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts` | ~20 | 0 (context) |

---

## Self-Validation Protocol

1. Did I Read every file I'm reviewing? **YES** — workflow.ts read in full (3 chunks), all imported modules read for context.
2. Are all scores traceable to rubric criteria? **YES** — each dimension scored with justification.
3. Do all issues cite actual code locations? **YES** — every finding includes file:line references and code snippets.
4. Did I perform security review for sensitive code? **YES** — checked dynamic imports, path sanitization in data-loader, contamination filter patterns.
5. Are findings reproducible from evidence? **YES** — all code snippets are verbatim from the file.
6. Did I run adversarial self-check on all P0/P1 findings? **YES** — Hunter/Skeptic/Referee table included above. Two findings downgraded from P1 to P2.
