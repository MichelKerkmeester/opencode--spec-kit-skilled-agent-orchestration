# QA8-O17: Cross-Cutting Contamination Guard Bypass Analysis

**Auditor:** Claude Opus 4.6 (@review agent)
**Date:** 2026-03-09
**Scope:** Can spec 013 enrichment data bypass spec 012 contamination guards?
**Files Under Review:**
- `scripts/extractors/contamination-filter.ts`
- `scripts/core/workflow.ts` (enrichment timing + alignment guards)
- `scripts/utils/input-normalizer.ts`
- `scripts/extractors/spec-folder-extractor.ts`
- `scripts/extractors/git-context-extractor.ts`
- `scripts/extractors/quality-scorer.ts`
- `scripts/extractors/session-extractor.ts`

**Verdict:** 3 confirmed bypass vectors, 2 architectural weaknesses. CONDITIONAL PASS -- no P0 blockers, but P1 gaps require mitigation.

---

## 1. Timing Verification

### Finding: Enrichment Runs AFTER Alignment Guard -- CONFIRMED SAFE

**Evidence (workflow.ts lines 578-610 and 657-662):**

The pipeline executes in this strict order:

```
Step 1:   Load collected data
Step 1.5: ALIGNMENT CHECK (lines 578-610)
          - Checks specKeywords overlap with file paths
          - Throws ALIGNMENT_BLOCK if overlap < 5%
Step 2:   Detect spec folder
Step 3:   Setup context directory
Step 3.5: ENRICHMENT (lines 657-662)
          - enrichStatelessData() runs here
          - Adds spec-folder and git context
Steps 4-7: Parallel extraction
Step 7.5:  CONTAMINATION FILTER (lines 737-748)
           - filterContamination() on userPrompts
```

**Timing conclusion:** The alignment check at Step 1.5 inspects `collectedData.observations` and `collectedData.FILES` BEFORE enrichment adds spec-folder/git data at Step 3.5. This ordering is correct -- the alignment guard validates the ORIGINAL session data, not the enriched version.

**Self-Check:** If enrichment ran BEFORE alignment, the alignment check would always pass (enriched data would contain spec-folder paths matching spec keywords). The current order prevents this false-positive scenario.

---

## 2. Post-Enrichment Contamination Bypass

### Finding: CONFIRMED BYPASS -- Enriched Data Skips Contamination Filter

**Severity: P1 (REQUIRED)**

**Evidence (workflow.ts lines 736-748):**

```typescript
const rawUserPrompts = collectedData?.userPrompts || [];
const allMessages = rawUserPrompts.map((m) => {
  const filtered = filterContamination(m.prompt || '');
  // ...
});
```

The contamination filter (`filterContamination`) is applied ONLY to `userPrompts`. However, `enrichStatelessData()` (lines 433-527) injects data into:
- `collectedData.observations` (spec-folder and git observations)
- `collectedData.FILES` (spec-folder and git file entries)
- `collectedData._manualTriggerPhrases` (spec-folder trigger phrases)
- `collectedData._manualDecisions` (spec-folder decisions)
- `collectedData.SUMMARY` (overwritten or appended)
- `collectedData.recentContext` (merged)

**None of these enriched fields pass through `filterContamination()`.**

**Risk Assessment:**
The contamination filter targets AI orchestration chatter (e.g., "I'll execute this step by step", "Let me analyze"). Enrichment sources are:
1. **spec-folder-extractor**: Reads static markdown files (spec.md, plan.md, tasks.md, checklist.md, decision-record.md). These are human-authored or structured template content -- LOW risk of containing AI chatter patterns.
2. **git-context-extractor**: Reads `git status`, `git log`, `git diff` output. Git commit messages CAN contain AI-generated text (e.g., commit messages from Claude Code). MEDIUM risk.

**Specific scenario:** A commit message like "I'll start by implementing the feature, then I need to fix the tests" contains multiple denylist patterns. If this commit message flows through git enrichment into `collectedData.observations[].narrative`, it enters the rendered memory file unfiltered.

**Impact:** Contaminated commit messages appear verbatim in the narrative field of observations, degrading memory quality. The quality scorer (`quality-scorer.ts`) does NOT check `_provenance` or `_synthetic` markers, so contaminated enrichment data receives the same quality treatment as clean data.

### Adversarial Self-Check

| Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
|---------|----------------|-------------------|-----------------|----------------|
| Enriched observations skip contamination filter | P1 | Spec-folder content is static markdown, unlikely to contain AI chatter. Git commit messages are the real risk, but limited to `narrative` field. | Confirmed: git commit messages are a plausible contamination vector | P1 |

---

## 3. Field Name Evasion

### Finding: CONFIRMED BYPASS -- Enriched Data Uses Non-Filtered Field Names

**Severity: P1 (REQUIRED)**

**Evidence:**

The contamination filter ONLY processes `userPrompts[].prompt` (a string field). Enrichment adds data under entirely different field names:

| Enrichment Source | Field Path | Contamination Filter Applied? |
|---|---|---|
| spec-folder | `observations[].narrative` | NO |
| spec-folder | `observations[].title` | NO |
| spec-folder | `observations[].facts[]` | NO |
| spec-folder | `FILES[].DESCRIPTION` | NO |
| spec-folder | `_manualTriggerPhrases[]` | NO |
| spec-folder | `_manualDecisions[].title` | NO |
| spec-folder | `_manualDecisions[].rationale` | NO |
| spec-folder | `recentContext[].learning` | NO |
| spec-folder | `recentContext[].request` | NO |
| spec-folder | `SUMMARY` | NO |
| git | `observations[].narrative` | NO |
| git | `observations[].title` | NO |
| git | `FILES[].DESCRIPTION` | NO |
| git | `summary` (appended to SUMMARY) | NO |

The contamination filter operates on a `string` input and returns a `FilterResult`. It has no awareness of observation structures, file entries, or any other enrichment-injected data shapes.

**Mitigating factor:** The content-filter pipeline (`createFilterPipeline()`) at lines 751-753 processes `allMessages` for quality scoring, but this pipeline also only receives the userPrompts-derived messages, not enrichment data.

### Adversarial Self-Check

| Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
|---------|----------------|-------------------|-----------------|----------------|
| Field name evasion allows unfiltered enrichment | P1 | This is by design -- enrichment sources are trusted (spec files, git). The filter targets live AI output, not static documents. | Downgraded: Architecturally intentional, but git commit messages remain a gap | P1 (confirmed for git path) |

---

## 4. Cross-Spec Leakage via Git Enrichment

### Finding: CONFIRMED BYPASS -- Git Extractor Has No Spec-Folder Scoping

**Severity: P1 (REQUIRED)**

**Evidence (git-context-extractor.ts lines 117-187):**

```typescript
export async function extractGitContext(projectRoot: string): Promise<GitContextExtraction> {
  // ...
  const statusEntries = runGitCommand(projectRoot, 'git status --porcelain')
  // ...
  const commits = parseCommits(
    runGitCommand(projectRoot, `git log --format="..." --since="24 hours ago" -${MAX_COMMITS}`)
  );
```

The git extractor operates at `projectRoot` scope, not spec-folder scope. It captures:
- ALL uncommitted changes across the entire repository (`git status --porcelain`)
- ALL commits from the last 24 hours across all branches (`git log --since="24 hours ago"`)
- ALL file changes from the last 5 commits (`git diff HEAD~5`)

**Contrast with input-normalizer.ts (lines 399-528):** The `transformOpencodeCapture` function has a `specFolderHint` parameter that filters tool calls and exchanges by relevance keywords. The git extractor has NO equivalent scoping mechanism.

**Scenario:** User is working on spec 013 (improve-stateless-mode). Git history contains commits for specs 008, 010, 011, 012 from the same day. All of these commits flow into the spec 013 memory file via enrichment.

**Evidence of scope in enrichStatelessData (workflow.ts lines 433-527):**

```typescript
const [specContext, gitContext] = await Promise.all([
  extractSpecFolderContext(specFolder).catch(() => null),   // Scoped to specFolder
  extractGitContext(projectRoot).catch(() => null),          // Scoped to ENTIRE project
]);
```

The spec-folder extractor is properly scoped (reads only from the target spec folder). The git extractor is NOT scoped -- it dumps repo-wide context.

**Impact:** Cross-spec data leakage through git observations. Memory files for spec 013 contain commit messages, file changes, and observations from unrelated specs. This defeats the purpose of the alignment guard (Step 1.5), which validated the original session data but cannot re-validate after git enrichment adds cross-spec content.

### Adversarial Self-Check

| Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
|---------|----------------|-------------------|-----------------|----------------|
| Git extractor has no spec-folder scoping | P0 | The alignment guard at Step 1.5 prevents cross-spec SESSIONS, not cross-spec git history. Git history IS repo-wide by nature. However, `MAX_COMMITS=20` and `--since="24 hours ago"` limits scope. | Downgraded to P1: Cross-spec leakage is real but bounded by time window and commit count. Not a security vulnerability -- it's a data quality issue | P1 |

---

## 5. Synthetic Data Masking

### Finding: NO BYPASS -- `_synthetic` Markers Are Informational Only

**Severity: P2 (SUGGESTION)**

**Evidence:**

Searched all TypeScript source files for `_synthetic` and `_provenance` usage:

1. **Spec-folder-extractor** sets `_provenance: 'spec-folder'` and `_synthetic: true` on all observations and file entries.
2. **Git-context-extractor** sets `_provenance: 'git'` and `_synthetic: true` on all observations and file entries.
3. **File-extractor** (file-extractor.ts lines 139-161) propagates these markers during file merging.
4. **Session-extractor** (session-extractor.ts lines 78-79) declares the types but does not filter on them.
5. **Quality-scorer** (quality-scorer.ts) has ZERO references to `_synthetic` or `_provenance`.
6. **Contamination-filter** (contamination-filter.ts) has ZERO references to `_synthetic` or `_provenance`.
7. **Workflow.ts** has ZERO references to `_synthetic` or `_provenance`.

**Conclusion:** The `_synthetic` and `_provenance` markers are carried through the pipeline but NEVER inspected by any guard, filter, or quality check. They are purely informational metadata that appears in the rendered output. They cannot be used to "skip" contamination checks because no check queries these markers in the first place.

**This is architecturally neutral** -- the markers don't create a bypass because the guards don't use them. However, this represents a missed opportunity: quality scoring COULD weight synthetic observations differently from live-captured ones.

### Adversarial Self-Check

| Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
|---------|----------------|-------------------|-----------------|----------------|
| `_synthetic` markers could skip checks | P1 | No code path checks `_synthetic` to bypass anything. The markers are write-only metadata. | Dropped: No bypass exists. The original concern was a phantom issue. | P2 (suggestion to use markers in scoring) |

---

## 6. Alignment Guard Completeness

### Finding: ARCHITECTURAL WEAKNESS -- Alignment Guard Only Checks Original Data

**Severity: P2 (SUGGESTION)**

**Evidence (workflow.ts lines 578-610):**

The alignment check at Step 1.5 validates that `collectedData.observations` file paths match the target spec folder. After passing, `enrichStatelessData()` at Step 3.5 can add observations and files from ANY spec folder (via spec-folder extractor, scoped) and ANY part of the repo (via git extractor, unscoped).

There is no POST-enrichment alignment recheck. This means:

1. Original session data: 10 file paths, 8 match spec keywords = 80% overlap (PASS)
2. After enrichment: 60 file paths (50 added from git), only 8 match = 13% overlap
3. No recheck occurs, so the enriched data with 13% relevance proceeds to rendering

**Mitigating factor:** The alignment check's 5% threshold (line 601) is intentionally low. Even after git enrichment adds cross-spec paths, the guard's purpose (preventing COMPLETE session mismatches) is still served.

---

## 7. Summary of Confirmed Bypass Vectors

| # | Vector | Severity | Status | Evidence |
|---|--------|----------|--------|----------|
| 1 | Enriched observations skip contamination filter | P1 | Confirmed | workflow.ts:736-748 only filters userPrompts |
| 2 | Field name evasion (enrichment uses non-filtered fields) | P1 | Confirmed | contamination-filter.ts operates on string input only |
| 3 | Git enrichment leaks cross-spec data | P1 | Confirmed | git-context-extractor.ts:120-133 uses project-wide scope |
| 4 | `_synthetic` markers bypass checks | Dropped | No bypass exists | Markers are informational only, never inspected |
| 5 | No post-enrichment alignment recheck | P2 | Architectural gap | workflow.ts alignment guard at Step 1.5 only |

---

## 8. Recommended Mitigations

### For P1-1 (Enriched observations skip contamination filter):
Apply `filterContamination()` to git commit subjects and bodies before creating observation objects in `git-context-extractor.ts`. Spec-folder content is low-risk (static markdown) and can remain unfiltered.

### For P1-2 (Field name evasion):
Extend contamination filter to accept structured data (observations, file entries) in addition to raw strings. Or create a wrapper that applies the filter to all string fields in enrichment output.

### For P1-3 (Git enrichment leaks cross-spec data):
Add a `specFolderHint` parameter to `extractGitContext()` (mirroring `transformOpencodeCapture`'s existing pattern). Filter git status entries and commit history to only include files whose paths contain spec-folder keywords. This matches the existing relevance-filtering pattern already used for OpenCode capture data.

### For P2-5 (No post-enrichment alignment recheck):
Consider adding a lightweight post-enrichment relevance ratio check that logs a warning (but does not block) if enrichment significantly dilutes spec-folder relevance.

---

## 9. Confidence Assessment

| Dimension | Confidence | Basis |
|-----------|-----------|-------|
| Timing verification | HIGH | Direct line-by-line trace of workflow.ts step ordering |
| Contamination filter scope | HIGH | Complete source review of contamination-filter.ts (91 lines) |
| Git cross-spec leakage | HIGH | Direct evidence from git-context-extractor.ts command construction |
| `_synthetic` marker analysis | HIGH | Full-text search across all .ts files, zero guard references found |
| Quality scorer gap | HIGH | Complete source review of quality-scorer.ts (128 lines) |

**Overall Confidence: HIGH** -- All files were read completely, all findings cite specific line numbers, all bypass vectors were adversarially self-checked.
