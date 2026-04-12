# Root Cause Investigation — Memory Save Quality Gates

## Executive Summary

- Issue 1 is a HIGH-severity contract gap: file-mode structured JSON accepts `sessionSummary`, `triggerPhrases`, and tier/context fields, but rejects explicit `title` and `description`, so the workflow falls back to auto-generated render text. `009-post-save-render-fixes` never touched that input contract because it fenced out broader collector-to-contract work. (`/tmp/save-context-data.json:2-4`, `/tmp/memory-save-output2.log:5-10`, `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:74-114`, `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:950-975`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/009-post-save-render-fixes/spec.md:68-94`)
- Issue 2 is a HIGH-severity sanitizer bug: `009` made authored trigger phrases authoritative at merge time, but Phase-6 sanitizer logic still rejects any phrase containing an embedded `NNN-slug` token, so DR finding IDs are dropped and then PSR-2 asks the operator to add them back manually. (`/tmp/save-context-data.json:7-32`, `/tmp/memory-save-output2.log:49-50`, `/tmp/memory-save-output2.log:85-103`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1275-1319`, `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:24-26`, `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:124-126`, `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:633-657`)
- Issue 3 is a MEDIUM-severity validator bug that becomes blocking as soon as Issue 2 is fixed: V8 still uses a broad `SPEC_ID_REGEX` from 2026-03-21, so range expressions and DR IDs are treated as foreign spec references. The over-match is real, but two prompt examples are not reproduced by the live body because the rendered file contains `2026-04-09` and `session-177...`, not standalone `026-04-09` or `098-...`. (`.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:209`, `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:478-487`, `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:540-594`, `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:741-815`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/memory/09-04-26_20-18__post-compaction-continuation-session-that-landed.md:53-55`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/memory/09-04-26_20-18__post-compaction-continuation-session-that-landed.md:64-65`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/memory/09-04-26_20-18__post-compaction-continuation-session-that-landed.md:146-150`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/memory/09-04-26_20-18__post-compaction-continuation-session-that-landed.md:252-257`)
- Issue 4 is a HIGH-severity save-path bug with a second-order matcher weakness: the validator already knows to skip V12 for `*/memory/*` files, but the save workflow calls it without `filePath`, so the skip never fires. When it does run, the matcher is a raw lowercase substring test with no slug/prose normalization. `026` did not touch either behavior. (`/tmp/memory-save-output2.log:54-60`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1604-1607`, `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:858-904`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md:4-8`)
- Issue 5 is a MEDIUM-severity stacked defect: Phase 4 did ship conservative predecessor discovery, but D5 still fires when the auto-generated rendered title contains `continuation`, and file-mode structured JSON still cannot reliably carry explicit `causal_links.supersedes`. Most of the false positive is downstream of Issue 1. (`/tmp/memory-save-output2.log:81-91`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1391-1414`, `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:412-419`, `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:896-904`, `.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:63-72`, `.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:215-280`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/004-heuristics-refactor-guardrails/spec.md:81-85`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/004-heuristics-refactor-guardrails/spec.md:108-112`)

## Issue 1 — Title/Description fields rejected

### Current runtime behavior

The payload explicitly supplied both `title` and `description`. The save log shows those keys were warned as unknown and ignored before normalization completed. The same save then rendered an auto-generated heading based on the slugified `sessionSummary`, and the description generator fell back to truncating summary/title text because no explicit description survived into the workflow. (`/tmp/save-context-data.json:2-4`, `/tmp/memory-save-output2.log:5-10`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1204-1238`, `.opencode/skill/system-spec-kit/scripts/core/title-builder.ts:44-59`, `.opencode/skill/system-spec-kit/scripts/lib/memory-frontmatter.ts:97-122`)

There is no supported file-mode alias such as `sessionTitle` or `summaryTitle` in the manual JSON contract. The only nearby `sessionTitle` field belongs to the separate OpenCode capture structure, not the `RawInputData` schema used by `data-loader.ts`. (`.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:74-114`, `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:184-192`, `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:97-105`)

### Root cause (cite file:line for every claim)

`data-loader.ts` reads file-mode JSON, validates it, then immediately normalizes it; that means file-mode saves only keep fields declared in `RawInputData` and propagated by `normalizeInputData()`. (`.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:97-105`, `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:559-930`)

`RawInputData` does not declare `title` or `description`, and `KNOWN_RAW_INPUT_FIELDS` does not allow them, so the validator treats both keys as typos. (`.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:74-114`, `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:950-975`, `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:990-995`)

`normalizeInputData()` explicitly forwards `triggerPhrases`, `importanceTier`, `contextType`, `projectPhase`, `sessionStatus`, and `completionPercent`, but there is no equivalent propagation for `title` or `description`. The workflow therefore has no explicit-title field to consult and always derives `memoryTitle` and `memoryDescription` from summary-derived candidates. (`.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:575-579`, `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:881-924`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1204-1238`)

`009-post-save-render-fixes` never claimed this schema work. Its scope fence explicitly excluded broader collector-to-contract data-flow changes, and its files-to-change list stayed in render helpers plus extractor plumbing, not the structured JSON input schema. (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/009-post-save-render-fixes/spec.md:68-94`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/009-post-save-render-fixes/implementation-summary.md:34-36`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/009-post-save-render-fixes/implementation-summary.md:54-69`)

### Minimum fix (code change OR documentation change OR schema change — be specific, show the exact patch)

Minimum code fix: make `title` and `description` first-class manual JSON fields, propagate them through normalization, and let workflow prefer them over auto-generated render text.

```diff
diff --git a/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts b/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
@@
 export interface RawInputData {
+  title?: string;
+  description?: string;
   specFolder?: string;
@@
 export interface NormalizedData {
+  title?: string;
+  description?: string;
   SPEC_FOLDER?: string;
@@
 const KNOWN_RAW_INPUT_FIELDS: Set<string> = new Set([
+  'title', 'description',
   'specFolder', 'spec_folder', 'SPEC_FOLDER',
@@
   if (typeof slowPathContextType === 'string' && slowPathContextType.length > 0) {
     normalized.contextType = slowPathContextType;
   }
+  if (typeof data.title === 'string' && data.title.trim().length > 0) {
+    normalized.title = data.title.trim();
+  }
+  if (typeof data.description === 'string' && data.description.trim().length > 0) {
+    normalized.description = data.description.trim();
+  }
diff --git a/.opencode/skill/system-spec-kit/scripts/types/session-types.ts b/.opencode/skill/system-spec-kit/scripts/types/session-types.ts
@@
 export interface CollectedDataBase {
+  title?: string;
+  description?: string;
   recentContext?: RecentContextEntry[];
diff --git a/.opencode/skill/system-spec-kit/scripts/core/workflow.ts b/.opencode/skill/system-spec-kit/scripts/core/workflow.ts
@@
+  const explicitTitle = typeof collectedData.title === 'string' && collectedData.title.trim().length > 0
+    ? collectedData.title.trim()
+    : null;
+  const explicitDescription = typeof collectedData.description === 'string' && collectedData.description.trim().length > 0
+    ? collectedData.description.trim()
+    : null;
-  const memoryTitle = buildMemoryTitle(preferredMemoryTask, specFolderName, sessionData.DATE, contentSlug);
+  const memoryTitle = explicitTitle ?? buildMemoryTitle(preferredMemoryTask, specFolderName, sessionData.DATE, contentSlug);
@@
-  const memoryDescription = deriveMemoryDescription({
-    summary: sessionData.SUMMARY,
-    title: memoryTitle,
-  });
+  const memoryDescription = explicitDescription ?? deriveMemoryDescription({
+    summary: sessionData.SUMMARY,
+    title: memoryTitle,
+  });
```

Documentation follow-up: update `generate-context.ts` help text and `scripts/memory/README.md` examples so the advertised JSON contract matches the accepted schema. (`.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:85-124`, `.opencode/skill/system-spec-kit/scripts/memory/README.md:56-68`)

### Risk of fix (new false positives? breaking changes to callers?)

Low risk. The change is additive and preserves existing auto-generation as fallback. Existing callers that omit `title`/`description` keep current behavior. The only behavior change is that explicit operator-authored values become authoritative, which is already consistent with the CLAUDE/AGENTS memory-save rule cited in the packet. (`/tmp/save-context-data.json:2-4`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1204-1238`)

## Issue 2 — Trigger phrase extractor drops DR-finding-ID phrases

### Current runtime behavior

The payload supplied 24 trigger phrases, including five `DR-...` finding IDs. The save log says the workflow pre-extracted only 19 trigger phrases, and PSR-2 then reported the same five DR phrases as missing manual phrases that should be added back. The current saved file has already been manually patched, so the live artifact no longer reflects the original drop; the log is the authoritative evidence for the first-try failure. (`/tmp/save-context-data.json:7-32`, `/tmp/memory-save-output2.log:49-50`, `/tmp/memory-save-output2.log:85-103`)

### Root cause (cite file:line for every claim)

`workflow.ts` correctly prepends manual trigger phrases and only falls back to auto-extracted phrases when the manual list is empty. That part of `009` worked. (`.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1275-1314`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/009-post-save-render-fixes/implementation-summary.md:46-47`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/009-post-save-render-fixes/implementation-summary.md:91-95`)

The drop happens one line later: `sanitizeTriggerPhrases()` still applies `PATH_LIKE_SLUG_PATTERN = /(?:^|\\b)\\d{3}-[a-z0-9_-]+(?:$|\\b)/i`, and any phrase containing a substring such as `002-I003-P1-001` is rejected as `path_fragment`. Because the regex is not anchored to the whole phrase, authored prose like `DR-002-I003-P1-001 blocked status drift` is treated the same as a bare folder slug. (`.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1316-1319`, `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:24-26`, `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:103-126`)

PSR-2 uses `collectedData._manualTriggerPhrases` as the source of truth and compares the rendered list against that original manual list. It therefore detects the drop and asks the operator to restore the same phrases the sanitizer just removed. (`.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:633-657`)

This survived `009` because the packet explicitly fenced out sanitizer work, and its round-trip test only covered simple phrases like `canonical sources`, `render quality`, and `memory save`, not DR-ID-prefixed phrases. (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/009-post-save-render-fixes/spec.md:68-94`, `.opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:75-126`)

### Minimum fix (code change OR documentation change OR schema change — be specific, show the exact patch)

Minimum code fix: only reject bare slug phrases, not arbitrary prose that happens to contain a slug-like substring. Keep the slash-based `PATH_FRAGMENT_PATTERN` intact so real file/path fragments still fail.

```diff
diff --git a/.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts b/.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts
@@
-const PATH_LIKE_SLUG_PATTERN = /(?:^|\b)\d{3}-[a-z0-9_-]+(?:$|\b)/i;
+const PATH_LIKE_SLUG_PATTERN = /^\d{3}-[a-z0-9_-]+$/i;
```

Why this is the minimum safe change:

- `003-memory-quality-issues` and other bare spec-folder slugs still fail as `path_fragment`. (`.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:24-26`, `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:124-126`)
- Slash paths such as `foo/bar.ts` still fail via `PATH_FRAGMENT_PATTERN`. (`.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:24-25`, `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:124-126`)
- Authored phrases with embedded DR IDs now survive, which aligns the renderer with PSR-2's own manual-phrase expectation. (`/tmp/save-context-data.json:16-21`, `/tmp/memory-save-output2.log:87-88`, `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:645-656`)

### Risk of fix (new false positives? breaking changes to callers?)

Low risk. The change narrows one blocker from substring match to whole-phrase match. It deliberately allows embedded spec-like tokens inside authored prose, which is exactly the class of phrases the operator is supplying here. Bare slugs and actual path fragments still fail, so the original anti-noise goal stays intact. (`.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:24-26`, `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:124-126`)

## Issue 3 — V8 SPEC_ID_REGEX over-matches

### Current runtime behavior

The underlying bug is real: `SPEC_ID_REGEX` treats any `NNN-...` token as a spec identifier, so range expressions like `002-014` and DR finding IDs like `002-I003-P1-001` are counted before the allowlist is consulted. Once Issue 2 allows those DR phrases through, V8 will misclassify them as foreign spec contamination unless the regex is tightened first. (`.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:209`, `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:478-487`, `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:741-815`)

Two prompt examples are not reproduced by the actual saved body. The file contains `2026-04-09` and `session-1775716659098-be14cbc33dbe`, not standalone `026-04-09` or `098-be14cbc33dbe`, so those two are not current-body matches under the shipped word-boundary regex. That part of the prompt is a misattributed example, not the live failure surface for this specific save. (`.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:209`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/memory/09-04-26_20-18__post-compaction-continuation-session-that-landed.md:53-55`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/memory/09-04-26_20-18__post-compaction-continuation-session-that-landed.md:64-65`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/memory/09-04-26_20-18__post-compaction-continuation-session-that-landed.md:252-257`)

### Root cause (cite file:line for every claim)

V8 is extraction-first, not allowlist-first. It first finds all `SPEC_ID_REGEX` matches in body/frontmatter, then subtracts the allowlist built from the current spec folder, child phases, sibling phases, and `related_specs`. Anything not in that allowlist becomes foreign contamination. That means non-spec tokens are misclassified before the allowlist even has a chance to say "this is not a spec slug." (`.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:209`, `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:478-487`, `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:540-594`, `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:741-808`)

This regex predates the `009` packet and shipped unchanged through the 026 memory-quality work. The current implementation was introduced on 2026-03-21, while the trigger-sanitizer and predecessor-discovery work landed on 2026-04-08. That makes Issue 3 an untouched pre-existing validator bug, not a regression from `009`. (`.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:209`, `.opencode/skill/system-spec-kit/scripts/lib/trigger-phrase-sanitizer.ts:124-126`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1395-1405`)

### Minimum fix (code change OR documentation change OR schema change — be specific, show the exact patch)

Minimum regex-only fix: require the first post-prefix segment to be alphabetic, not numeric or alpha+digits. That removes the six observed false positives while preserving every legitimate 026 packet slug in the evidence list.

```diff
diff --git a/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts b/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts
@@
-const SPEC_ID_REGEX = /\b\d{3}-[a-z0-9][a-z0-9-]*\b/g;
+const SPEC_ID_REGEX = /\b\d{3}-[a-z]+(?:-[a-z0-9]+)*\b/g;
```

Verification against the 15 evidence tokens:

| Token | Proposed regex matches? |
| --- | --- |
| `002-014` | No |
| `002-i003-p1-001` | No |
| `002-implement-cache-warning-hooks` | Yes |
| `003-memory-quality-issues` | Yes |
| `008-graph-first-routing-nudge` | Yes |
| `008-i001-p1-001` | No |
| `010-fts-capability-cascade-floor` | Yes |
| `010-i001-p1-001` | No |
| `013-i003-p1-001` | No |
| `013-warm-start-bundle-conditional-validation` | Yes |
| `005-code-graph-upgrades` | Yes |
| `014-i001-p1-001` | No |
| `026-04-09` | No |
| `026-graph-and-context-optimization` | Yes |
| `098-be14cbc33dbe` | No |

If the project expects future spec slugs whose first segment contains digits, the safer follow-up is a second-stage repo-backed existence filter. For the current 026 corpus, the regex change above is the smallest patch that eliminates the false positives the operator surfaced. (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md:21-23`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/memory/09-04-26_20-18__post-compaction-continuation-session-that-landed.md:146-150`)

### Risk of fix (new false positives? breaking changes to callers?)

Low-to-medium risk. It fixes the present evidence set cleanly, but it would miss future spec slugs whose first post-prefix segment is alphanumeric rather than alphabetic, such as a hypothetical `010-fts5-*`. If that naming pattern becomes real, replace the regex-only fix with regex + repo-backed existence filtering. For the current 026 packet family, no such slug appears in the affected set. (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md:21-23`)

## Issue 4 — V12 naive substring match

### Current runtime behavior

The save log shows V12 failed during the live save and semantic indexing was skipped. (`/tmp/memory-save-output2.log:54-60`)

The validator already documents that V12 should skip files under `*/memory/*`, but the save workflow calls `validateMemoryQualityContent()` without any `filePath`, so `isMemoryDirFile` is always false in the live save path. (`.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1604-1607`, `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:858-869`)

When V12 does run, it lowercases content and spec phrases and performs a plain `includes()` check. The parent packet's trigger phrases are spaced prose forms, while the rendered memory naturally contains slug-form references such as `system-spec-kit/026-graph-and-context-optimization`. That means the matcher declares "zero overlap" even when the packet slug is present many times. (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/spec.md:4-8`, `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:899-904`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/memory/09-04-26_20-18__post-compaction-continuation-session-that-landed.md:55-56`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/memory/09-04-26_20-18__post-compaction-continuation-session-that-landed.md:104-105`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/memory/09-04-26_20-18__post-compaction-continuation-session-that-landed.md:134-149`)

### Root cause (cite file:line for every claim)

There are two defects here:

1. The save pipeline never passes `filePath` into the validator, so the validator's own memory-dir skip path is dead code during fresh saves. (`.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1604-1607`, `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:858-869`)
2. The fallback matcher is a naive raw substring comparison with no slug/prose normalization. (`.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:899-904`)

Issue 4 was not part of `009` scope. That packet focused on render helpers and canonical-source/trigger rendering, not validator call sites or V12 semantics. (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/009-post-save-render-fixes/spec.md:68-94`)

### Minimum fix (code change OR documentation change OR schema change — be specific, show the exact patch)

Minimum gate-closing fix: pass the real memory file path so V12 follows its already-documented `*/memory/*` skip policy. That closes the live save failure with zero matcher expansion and zero new false positives.

```diff
diff --git a/.opencode/skill/system-spec-kit/scripts/core/workflow.ts b/.opencode/skill/system-spec-kit/scripts/core/workflow.ts
@@
-  const qualityValidation = validateMemoryQualityContent(files[ctxFilename]);
+  const qualityValidation = validateMemoryQualityContent(files[ctxFilename], {
+    filePath: path.join(contextDir, ctxFilename),
+  });
```

If the product decision is to keep V12 active on fresh memory saves, then add a second patch after the `filePath` fix:

```diff
diff --git a/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts b/.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts
@@
-      const hasOverlap = specTriggerPhrases.some(phrase => lowerContent.includes(phrase.toLowerCase()));
+      const hasOverlap = specTriggerPhrases.some((phrase) => {
+        const normalized = phrase.toLowerCase();
+        const slugNormalized = normalized.replace(/\s+/g, '-');
+        return lowerContent.includes(normalized) || lowerContent.includes(slugNormalized);
+      });
```

### Risk of fix (new false positives? breaking changes to callers?)

Primary fix risk is very low. It only activates an existing skip rule that the validator already advertises for memory files. The optional normalization patch is also low risk, but it changes matching semantics rather than simply enabling the already-documented save-path behavior. (`.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:858-904`)

## Issue 5 — D5 continuation-check

### Current runtime behavior

The save log shows a continuation signal was detected and D5 emitted a MEDIUM warning because `causal_links.supersedes` was empty. The rendered heading still says `Post Compaction Continuation Session That Landed`, while the saved metadata shows `supersedes: []` and only `derived_from` populated. (`/tmp/memory-save-output2.log:81-91`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/memory/09-04-26_20-18__post-compaction-continuation-session-that-landed.md:47-47`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/memory/09-04-26_20-18__post-compaction-continuation-session-that-landed.md:247-257`)

### Root cause (cite file:line for every claim)

Phase 4 did implement the intended behavior: predecessor discovery exists, is conservative, and only runs for JSON saves that have no explicit `supersedes` yet. (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/004-heuristics-refactor-guardrails/spec.md:81-85`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/004-heuristics-refactor-guardrails/spec.md:108-112`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/004-heuristics-refactor-guardrails/implementation-summary.md:34-42`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1391-1414`, `.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:63-72`, `.opencode/skill/system-spec-kit/scripts/core/find-predecessor-memory.ts:215-280`)

The shipped helper simply did not find a qualifying predecessor on this save, so `supersedes` remained empty. That is consistent with the rendered output and with the design goal to prefer omission over fabricated lineage. (`.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1407-1414`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/memory/09-04-26_20-18__post-compaction-continuation-session-that-landed.md:247-257`)

The false-positive feel comes from two separate contract gaps:

- Issue 1 forced the workflow to auto-generate a continuation-style rendered title from the slugified summary instead of honoring the caller's explicit non-continuation title. The payload title at save time did not contain the word `continuation`. (`/tmp/save-context-data.json:3-4`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1204-1238`, `.opencode/skill/system-spec-kit/scripts/core/title-builder.ts:44-59`)
- File-mode manual JSON does not reliably carry caller-supplied `causal_links` into the collected-data object even though downstream types and metadata builders already know how to consume them. `session-types.ts` and `memory-metadata.ts` support `causal_links`, but `RawInputData` and `KNOWN_RAW_INPUT_FIELDS` do not, and `normalizeInputData()` does not forward them in the manual JSON path. (`.opencode/skill/system-spec-kit/scripts/types/session-types.ts:128-196`, `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:235-252`, `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:74-114`, `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:820-930`, `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:950-975`)

So Issue 5 is not "Phase 4 forgot predecessor discovery." The shipped discovery exists. The remaining bug is that the common file-mode JSON path still cannot express "this is not a continuation title" or "this continuation explicitly supersedes X" with full fidelity.

### Minimum fix (code change OR documentation change OR schema change — be specific, show the exact patch)

Minimum fix: do not broaden predecessor discovery. Instead, finish the JSON contract so file-mode saves can carry explicit causal links and so Issue 1's explicit title override can suppress false D5 hits on non-continuation saves.

```diff
diff --git a/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts b/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
@@
 export interface RawInputData {
+  causal_links?: Record<string, unknown>;
+  causalLinks?: Record<string, unknown>;
@@
 export interface NormalizedData {
+  causal_links?: Record<string, unknown>;
+  causalLinks?: Record<string, unknown>;
@@
 const KNOWN_RAW_INPUT_FIELDS: Set<string> = new Set([
+  'causal_links', 'causalLinks',
@@
+  if (data.causal_links && typeof data.causal_links === 'object') {
+    normalized.causal_links = cloneInputData(data.causal_links) as Record<string, unknown>;
+  }
+  if (data.causalLinks && typeof data.causalLinks === 'object') {
+    normalized.causalLinks = cloneInputData(data.causalLinks) as Record<string, unknown>;
+  }
```

That patch should ship alongside Issue 1's explicit-title support. Together they let the caller do both things the current runtime blocks:

- avoid accidental continuation wording on non-continuation saves
- explicitly populate `causal_links.supersedes` when a true continuation save already knows its predecessor

### Risk of fix (new false positives? breaking changes to callers?)

Low risk. The change is additive, and the conservative auto-discovery remains unchanged. Existing saves that do not pass `causal_links` continue to rely on the current bounded helper. The only new behavior is that file-mode callers can finally preserve a field the downstream pipeline already knows how to read. (`.opencode/skill/system-spec-kit/scripts/types/session-types.ts:185-187`, `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts:235-252`)

## What the 026 memory-quality work actually fixed vs missed

- Issue 1 was never actually addressed. `009-post-save-render-fixes` improved rendered titles and descriptions after data reached the workflow, but it explicitly fenced out broader collector-to-contract data-flow work, so the file-mode JSON schema never learned `title` or `description`. (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/009-post-save-render-fixes/spec.md:68-94`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/009-post-save-render-fixes/implementation-summary.md:34-36`)
- Issue 2 was partially addressed and then stopped one layer too early. `009` fixed manual-trigger precedence in `workflow.ts`, but it deliberately left the sanitizer untouched, so authored DR phrases still died at the next filter. The acceptance test never exercised that case. (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/009-post-save-render-fixes/implementation-summary.md:46-47`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/009-post-save-render-fixes/spec.md:68-94`, `.opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:75-126`)
- Issue 3 was missed entirely. The offending V8 regex predates the April 9 remediation packets and stayed unchanged through them. It only becomes visible once Issue 2 stops dropping DR IDs upstream. (`.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:209`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1316-1319`)
- Issue 4 was missed entirely. No 026 packet in the cited remediation lane updated the validator call site or V12 matcher. The save-path bug is still exactly where it was: workflow omits `filePath`, and V12 stays a naive substring test when it does run. (`.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1604-1607`, `.opencode/skill/system-spec-kit/scripts/lib/validate-memory-quality.ts:858-904`)
- Issue 5 was only partially fixed in Phase 4. Conservative predecessor discovery shipped and the reviewer correctly checks for empty `supersedes`, but the file-mode JSON contract still cannot carry explicit title override or `causal_links` through the common `/tmp/save-context-data.json` path. That leaves D5 stacked on top of Issue 1 instead of fully closed. (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/004-heuristics-refactor-guardrails/spec.md:81-85`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/004-heuristics-refactor-guardrails/implementation-summary.md:34-42`, `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:74-114`, `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:950-975`)

## Recommended remediation order

1. Fix Issue 1 first. It restores the operator's authored `title`/`description`, removes the generic-title failure mode, and eliminates most of the accidental D5 noise in the same change.
2. Fix Issue 4 second. That immediately stops the current first-try semantic-index skip without broadening any matcher logic.
3. Land Issue 2 and Issue 3 together. Once DR finding IDs survive the sanitizer, V8 becomes the next false-positive gate; shipping them separately just moves the failure one step downstream.
4. Finish Issue 5 in the same schema patch series as Issue 1 by adding file-mode `causal_links` passthrough. The predecessor helper itself does not need expansion; the missing piece is caller expressiveness on the structured JSON path.
