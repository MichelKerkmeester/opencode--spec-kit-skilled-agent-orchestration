# QA3 Audit O-07: Integration — Spec-Folder + Git Extractors into workflow.ts

**Auditor:** @review (Claude Opus 4.6)
**Date:** 2026-03-09
**Scope:** Integration contract between `spec-folder-extractor.ts`, `git-context-extractor.ts`, and `enrichStatelessData()` in `workflow.ts`
**Mode:** Focused integration audit (not individual file quality)

---

## Files Reviewed

| File | Lines | Focus |
|------|-------|-------|
| `scripts/core/workflow.ts` | 433–527 (`enrichStatelessData`) | Merge logic, dedup, ordering |
| `scripts/extractors/spec-folder-extractor.ts` | Full (293 lines) | Output shape, provenance markers |
| `scripts/extractors/git-context-extractor.ts` | Full (188 lines) | Output shape, provenance markers |
| `scripts/extractors/collect-session-data.ts` | 135–155 (CollectedDataFull), 679, 721–724 | Target type, downstream consumption |
| `scripts/extractors/file-extractor.ts` | 34–54, 278–318 | ObservationInput/ObservationDetailed mapping |
| `scripts/extractors/session-extractor.ts` | 71–80, 103–108 | Observation/RecentContextEntry types |
| `scripts/core/quality-scorer.ts` | 130–142 | Observation dedup scoring |

---

## Focus Area 1: Merge Ordering

**Question:** Is enrichment data from both extractors merged in the correct order (spec-folder first, then git-context to override)?

**Finding: CORRECT — ordering is sound.**

`enrichStatelessData()` (workflow.ts:449–521) processes:
1. `specContext` first (lines 449–493)
2. `gitContext` second (lines 497–521)

For observations, both are appended to the end of existing observations with spread:
```
collectedData.observations = [...existingObs, ...specContext.observations];
// then later:
collectedData.observations = [...existingObs, ...gitContext.observations];
```

This means git observations are appended AFTER spec-folder observations, which is the correct priority order. However, this is append-only, not override — git data does NOT replace spec-folder data; both coexist. For observations this is acceptable since they represent different types of knowledge (requirements vs. commit history).

For FILES, git entries can only add new files that are not already present (dedup by path). Since spec-folder files are merged first, they get priority — git files only fill gaps. This is intentionally correct: spec-folder file descriptions are typically more meaningful than "Uncommitted: modify during session".

**Verdict:** No issue. Ordering is correct and intentional.

---

## Focus Area 2: Dedup by Path

**Question:** When both extractors return file data, does deduplication by path work correctly?

**Finding: P2 — Minor inconsistency in dedup rebuild, but functionally correct.**

The dedup logic at workflow.ts:458–464 (spec-folder merge) and 505–512 (git merge) both use:
```ts
const existingPaths = new Set(
  existingFiles.map((f) => (f.FILE_PATH || f.path || '').toLowerCase())
);
const newFiles = specContext.FILES.filter(
  (f) => !existingPaths.has(f.FILE_PATH.toLowerCase())
);
```

**What works:**
- Case-insensitive dedup via `.toLowerCase()` — correct for file systems.
- Both merges handle the `FILE_PATH || path` dual-key pattern matching `CollectedDataFull.FILES` which allows both property names (lines 141–142).
- Spec-folder files are merged first, so their richer descriptions take priority over git's generic descriptions.

**Potential concern (P2):**
After the spec-folder merge (line 464), `collectedData.FILES` now includes spec-folder files. When the git merge runs at line 505–512, it rebuilds `existingPaths` from the already-updated `collectedData.FILES`. This means git files are correctly deduped against BOTH original files AND spec-folder files. This is the correct behavior.

However, there is a subtle inconsistency: the git extractor's FILES include an `ACTION` field (`ACTION?: string`) that the spec-folder extractor's FILES do not. When both reference the same file path, the spec-folder version wins (by dedup order), losing the `ACTION` metadata. This is acceptable since ACTION is only informational, but it could be improved by merging ACTION onto existing entries.

**Verdict:** Functionally correct. P2 suggestion only.

---

## Focus Area 3: Provenance Survival

**Question:** Do `_provenance` and `_synthetic` markers survive through the merge process in workflow.ts?

**Finding: P1 — Provenance markers survive into collectedData but are STRIPPED by buildObservationsWithAnchors.**

**Phase 1 — Enrichment (PASS):**
Both extractors tag their outputs with `_provenance` and `_synthetic`:
- `spec-folder-extractor.ts` line 23: `_provenance: 'spec-folder'` and `_synthetic: true` on observations
- `spec-folder-extractor.ts` line 25: `_provenance: 'spec-folder'` on FILES
- `git-context-extractor.ts` lines 34–35: `_provenance: 'git'` and `_synthetic: true` on observations
- `git-context-extractor.ts` line 42: `_provenance: 'git'` on FILES

The `enrichStatelessData()` merge uses spread operators that preserve all properties including `_provenance` and `_synthetic`. The `CollectedDataFull` interface (collect-session-data.ts:145–146) declares these optional fields. So provenance survives into `collectedData`.

**Phase 2 — Downstream Processing (PARTIAL LOSS):**

For **observations**: `buildObservationsWithAnchors()` (file-extractor.ts:278–318) maps observations to `ObservationDetailed` which does NOT include `_provenance` or `_synthetic`. The input type `ObservationInput` (line 34–41) also does NOT declare these fields. This means:
- TypeScript will not error (spread works at runtime), but the provenance data is silently dropped when the observation is mapped to `ObservationDetailed` at lines 306–317.
- The final template output and quality scorer never see provenance on observations.

For **FILES**: The `extractFilesFromData()` function in file-extractor.ts DOES handle `_provenance` and `_synthetic` (lines 139, 148, 150–154, 161, 172, 219). Files retain provenance through the file extraction pipeline.

**Adversarial Self-Check:**

| Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
|---------|----------------|-------------------|-----------------|----------------|
| Observation provenance stripped by buildObservationsWithAnchors | P1 | ObservationDetailed is a rendering type — provenance is metadata, not user-facing. The observations still contribute content. Loss is only of debuggability, not correctness. | Downgraded — provenance loss does not corrupt output, but does reduce traceability for debugging enrichment quality | P2 |

**Revised Verdict:** P2. Provenance markers survive through the merge into `collectedData`, and survive through the FILES pipeline. They are dropped only in the observation rendering path, which is a traceability concern, not a correctness concern. The markers serve their primary purpose (dedup and filtering in collect-session-data and file-extractor).

---

## Focus Area 4: Data Shape Compatibility

**Question:** Do the output shapes of both extractors match what workflow.ts expects as input?

**Finding: CORRECT — shapes are compatible.**

**SpecFolderExtraction shape vs. consumption in enrichStatelessData():**

| Field | Extractor Type | Consumed At | Compatible? |
|-------|---------------|-------------|-------------|
| `observations` | `Array<{type, title, narrative, timestamp, facts, files, _provenance, _synthetic}>` | workflow.ts:451–453 (spread into `Observation[]`) | YES — all fields match `Observation` interface (session-extractor.ts:71–80) |
| `FILES` | `Array<{FILE_PATH, DESCRIPTION, _provenance}>` | workflow.ts:457–464 (dedup merge) | YES — matches `CollectedDataFull.FILES` shape |
| `triggerPhrases` | `string[]` | workflow.ts:467–472 (spread into `_manualTriggerPhrases`) | YES |
| `decisions` | `Array<{title, rationale, chosen, _provenance}>` | workflow.ts:475–479 (spread into `_manualDecisions`) | YES |
| `summary` | `string` | workflow.ts:483–485 (conditional override) | YES |
| `recentContext` | `Array<{learning, request, files}>` | workflow.ts:488–492 (spread into `recentContext`) | YES — matches `RecentContextEntry` (session-extractor.ts:103–108) |

**GitContextExtraction shape vs. consumption in enrichStatelessData():**

| Field | Extractor Type | Consumed At | Compatible? |
|-------|---------------|-------------|-------------|
| `observations` | `Array<{type, title, narrative, timestamp, facts, files, _provenance, _synthetic}>` | workflow.ts:498–501 (spread) | YES |
| `FILES` | `Array<{FILE_PATH, DESCRIPTION, ACTION?, _provenance}>` | workflow.ts:504–512 (dedup merge) | YES — extra `ACTION` field is harmless |
| `summary` | `string` | workflow.ts:514–520 (append) | YES |
| `commitCount` | `number` | NOT consumed by workflow.ts | Unused but harmless |
| `uncommittedCount` | `number` | NOT consumed by workflow.ts | Unused but harmless |

**Verdict:** Full shape compatibility. No type mismatches. Unused fields (`commitCount`, `uncommittedCount`) are informational and do not cause issues.

---

## Focus Area 5: Empty Extraction Handling

**Question:** Does workflow handle the case where one or both extractors return no data?

**Finding: CORRECT — robust null/empty handling.**

**Both extractors fail:**
```ts
const [specContext, gitContext] = await Promise.all([
  extractSpecFolderContext(specFolder).catch(() => null),
  extractGitContext(projectRoot).catch(() => null),
]);
```
Both `.catch(() => null)` ensure exceptions produce `null`. The subsequent `if (specContext)` and `if (gitContext)` guards (lines 449, 497) skip processing for null results. The entire function is wrapped in try/catch (line 523–526) making enrichment failure non-fatal.

**One extractor returns empty data:**
- `extractGitContext` has an explicit `emptyResult()` factory (line 47–49) returning `{ observations: [], FILES: [], summary: '', commitCount: 0, uncommittedCount: 0 }`.
- `extractSpecFolderContext` returns empty arrays/strings for missing spec docs (via `readDoc` returning `null` propagating through parse functions).

When an extractor returns non-null but empty data:
- `specContext.observations` = `[]` → spread produces nothing, no harm.
- `specContext.FILES` = `[]` → filter produces nothing, no harm.
- `specContext.triggerPhrases.length > 0` = false → skipped.
- `specContext.decisions.length > 0` = false → skipped.
- `specContext.summary` = `''` → falsy, summary override skipped.
- `gitContext.summary` = `''` → falsy, summary append skipped.

**Edge case — specFolder path is invalid:**
`extractSpecFolderContext` calls `readDoc` which uses `try/catch` around `readFileSync` and returns `null` on error. All parse functions handle `null` input gracefully. So an invalid spec folder path produces an empty but valid result.

**Edge case — git not available:**
`extractGitContext` wraps the entire function body in `try/catch` (line 184) returning `emptyResult()`. The `runGitCommand` function can throw on timeout (5s limit) or non-zero exit, and all are caught.

**Verdict:** Robust. All empty/error paths are handled correctly.

---

## Additional Finding: Alignment Check Timing

**Finding: P2 — Alignment check runs BEFORE enrichment, which is architecturally correct but worth documenting.**

The alignment check (workflow.ts:583–610, Step 1.5) runs before `enrichStatelessData()` (line 660, Step 3.5). This means:
- In pure stateless mode (no JSON data file), `collectedData.observations` and `collectedData.FILES` at alignment-check time contain ONLY data from the live session (OpenCode tool calls, etc.).
- Spec-folder and git observations are NOT yet merged, so the alignment check evaluates only genuine session activity against the spec folder name.

This is **architecturally correct** because:
1. Adding spec-folder files (which always match the spec folder keywords) would inflate the overlap ratio and potentially mask a genuine misalignment.
2. The purpose of alignment checking is to verify the LIVE SESSION relates to the spec — synthetic data would defeat this purpose.

**Verdict:** P2 informational. No fix needed, but this ordering dependency should be documented to prevent future refactoring from accidentally moving enrichment before alignment.

---

## Additional Finding: Observation Dedup Not Applied Cross-Source

**Finding: P2 — Observations from different sources are not deduped against each other.**

The `deduplicateObservations()` function in file-extractor.ts:325 is called inside `buildObservationsWithAnchors()` AFTER all observations have been merged. This means cross-source dedup IS applied at the rendering stage. However, it deduplicates by title match only (merging consecutive duplicates), and spec-folder observations (e.g., "REQ-001: Add git context extraction") will have different titles from git observations (e.g., "feat(spec-kit): add git context extraction"). So in practice, cross-source observations are unlikely to be deduped even though they may describe the same change.

This is acceptable because:
- Spec-folder observations capture requirements/design intent.
- Git observations capture implementation history.
- These are complementary, not duplicative, even when describing the same feature.

**Verdict:** P2. No action needed, but worth noting for future quality scoring refinements.

---

## Summary

### Issue Counts

| Severity | Count | Items |
|----------|-------|-------|
| **P0** (Blocker) | 0 | — |
| **P1** (Required) | 0 | — |
| **P2** (Suggestion) | 4 | See below |

### P2 Findings

| # | Finding | Location | Recommendation |
|---|---------|----------|----------------|
| P2-1 | Git ACTION field lost when spec-folder file wins dedup | workflow.ts:457–464 | Consider merging ACTION onto existing entries when both sources reference same path |
| P2-2 | Observation `_provenance`/`_synthetic` stripped by rendering pipeline | file-extractor.ts:306–317 | Add optional provenance fields to `ObservationDetailed` for debug traceability |
| P2-3 | Alignment check timing dependency on enrichment ordering | workflow.ts:583 vs 660 | Add code comment documenting why enrichment MUST run after alignment |
| P2-4 | Cross-source observation dedup relies on title matching only | file-extractor.ts:325 | Consider semantic dedup or provenance-aware grouping in future iteration |

### Quality Score (Integration Contract Only)

| Dimension | Score | Notes |
|-----------|-------|-------|
| **Correctness** | 29/30 | All merge paths correct; edge cases handled |
| **Security** | 25/25 | No injection vectors; git commands timeout-bounded; path traversal guarded |
| **Patterns** | 19/20 | Consistent with project conventions; minor provenance gap in observation rendering |
| **Maintainability** | 13/15 | Clear structure; alignment-enrichment ordering dependency should be documented |
| **Performance** | 10/10 | Parallel extraction; bounded limits on all collections |
| **Total** | **96/100** | EXCELLENT |

### Recommendation

**PASS.** The integration contract between the two new extractors and `enrichStatelessData()` in workflow.ts is sound. Merge ordering, dedup by path, empty extraction handling, and data shape compatibility are all correct. The four P2 suggestions are quality improvements for future iterations, not blockers.

---

*Audit completed by @review agent. Read-only analysis — no files modified.*
