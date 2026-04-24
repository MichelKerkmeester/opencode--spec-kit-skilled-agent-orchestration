# Iteration 18: D7 Provenance-only <=10-line Patch (Q15)

## Focus
D7 in the canonical synthesis is still the same defect: JSON-mode saves never receive git provenance because Step 3.5 only runs for captured-session inputs, so `head_ref`, `commit_ref`, and `repository_state` stay empty or fall back to `"unavailable"` in rendered memory files. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:146-155] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-890]

Iteration 9 narrowed the acceptable fix: do not reuse the full captured-session enrichment branch, because that branch also merges spec-folder observations, FILES, trigger phrases, decisions, and summary text. This pass converts that narrowing into an exact provenance-only patch that calls `extractGitContext()` directly from the JSON-mode path and copies only the four provenance fields already consumed by template rendering. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-009.md:35-44] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:458-459] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:482-560]

## Approach
- Re-read the Gen-2 strategy plus the D7 synthesis and prior narrowing notes to lock the allowed fix shape. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:182-195] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:146-155]
- Inspect `workflow.ts` at the capture-only gate and the Step 3.5 enrichment block. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923]
- Inspect `extractGitContext()` itself to confirm its signature, fallback contract, and detached-HEAD behavior. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:47-85] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:325-343] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:359-503]
- Design the smallest possible workflow-only insertion that copies provenance fields without invoking `enrichCapturedSessionData()`. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:453-560] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923]
- Check edge cases against extractor internals: detached HEAD, shallow history, non-git, CI detached checkout, and submodule-rooted execution. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:325-343] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:344-355] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:359-503]

## extractGitContext signature and return shape
- Location: [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:359-359]
- Signature: `export async function extractGitContext(projectRoot: string, specFolderHint?: string): Promise<GitContextExtraction>` [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:359-359]
- Return shape: `GitContextExtraction` includes `observations`, `FILES`, `summary`, `commitCount`, `uncommittedCount`, `headRef`, `commitRef`, `repositoryState`, and `isDetachedHead`. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:47-72]
- Synchronous or async?: Async; it awaits `resolveSpecScope(...)` and returns a `Promise<GitContextExtraction>`. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:359-363]
- Error handling: returns `emptyResult()` when the directory is not a git work tree, when `rev-list --count HEAD` is non-finite, or when any exception is caught; `emptyResult()` sets `headRef = null`, `commitRef = null`, `repositoryState = 'unavailable'`, and `isDetachedHead = false`. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:73-85] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:359-371] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:499-502]

## Current JSON-mode blank-provenance site
- File: `workflow.ts`
- Line range: [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-890]
- Current code (verbatim, <=15 lines):
```ts
    // Step 3.5: Enrich captured-session data with spec folder and git context
    if (isCapturedSessionMode) {
      // Capture pre-enrichment file references so the post-check only judges
      // paths introduced by enrichment (not caller-provided direct inputs).
      const preEnrichmentPaths = new Set(
        ((collectedData.observations || [])
          .flatMap((obs: { files?: string[] }) => obs.files || [])
          .concat((collectedData.FILES || []).map((f: { FILE_PATH?: string; path?: string }) => f.FILE_PATH || f.path || '')))
          .map((fp: string) => fp.trim())
          .filter((fp: string) => fp.length > 0)
      );

      log('Step 3.5: Enriching captured-session data...');
      collectedData = await enrichCapturedSessionData(collectedData, specFolder, CONFIG.PROJECT_ROOT);
```

## Proposed <=10-line patch (unified diff format)
```diff
--- a/.opencode/skill/system-spec-kit/scripts/core/workflow.ts
+++ b/.opencode/skill/system-spec-kit/scripts/core/workflow.ts
@@ -921,3 +921,9 @@
       }
       log();
     }
+    if (!isCapturedSessionMode) {
+      const gitContext = await extractGitContext(CONFIG.PROJECT_ROOT, specFolder).catch(() => null);
+      collectedData.headRef = gitContext?.headRef ?? null;
+      collectedData.commitRef = gitContext?.commitRef ?? null;
+      collectedData.repositoryState = gitContext?.repositoryState ?? 'unavailable';
+      collectedData.isDetachedHead = gitContext?.isDetachedHead ?? false;
+    }
```

## Edge-case handling
- **Detached HEAD**: `getGitSnapshot()` sets `isDetachedHead = !branchRef && Boolean(commitRef)`, `headRef = branchRef || (isDetachedHead ? 'HEAD' : null)`, and keeps the short commit SHA in `commitRef`. The patch copies those fields directly, so detached checkouts become visible in JSON mode without inventing a branch name. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:325-343]
- **Shallow clone**: the extractor uses `rev-list --count HEAD` plus bounded diff logic (`HEAD`, `HEAD~N..HEAD`, or `show HEAD`) and does not require deep history just to fill provenance fields. The patch only consumes the returned metadata, so missing history depth does not add a new failure mode. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:344-355] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:369-373] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:491-498]
- **Non-git directory**: `extractGitContext()` returns `emptyResult()` when `rev-parse --is-inside-work-tree` is not `true`, and its outer catch also degrades to `emptyResult()`. The patch adds one extra Promise-level `.catch(() => null)` so even an unexpected rejection still writes `repositoryState = 'unavailable'` and leaves refs null. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:359-362] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:499-502]
- **CI environment (detached + env-provided ref)**: the extractor is git-command-driven, not env-driven; it consults `symbolic-ref` and `rev-parse`, not CI-specific variables. In a detached CI checkout with a valid local `HEAD`, the patch will therefore still surface `headRef = 'HEAD'`, `commitRef = <sha>`, and `isDetachedHead = true`. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:325-343]
- **Submodule**: the patch preserves current scope because it calls `extractGitContext(CONFIG.PROJECT_ROOT, specFolder)` exactly like capture-mode enrichment does. Provenance remains anchored to the configured project root; if that root is a superproject, submodule changes can still affect repo dirtiness, but the patch does not add any new submodule-specific traversal or side effects. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:890-890] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:91-98] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:359-368]

## Why it doesn't reuse the capture-mode enrichment branch
The patch never calls `enrichCapturedSessionData()` for JSON-mode inputs. That matters because `enrichCapturedSessionData()` is explicitly marked capture-only and, beyond provenance, also merges spec-folder observations, FILES, trigger phrases, decisions, recent context, and summary text. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:458-459] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:482-560]

By calling `extractGitContext()` directly and copying only `headRef`, `commitRef`, `repositoryState`, and `isDetachedHead`, the patch stays provenance-only: no additional observations, no summary mutation, no trigger/decision contamination, and no reuse of the post-enrichment alignment branch. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:530-560] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923]

## Findings
1. JSON-mode inputs skip Step 3.5 entirely because `isCapturedSessionMode` is false when `_source === 'file'`, so the only existing git-enrichment call site never runs. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-890]
2. `enrichCapturedSessionData()` is the wrong fix surface for JSON mode because it merges far more than provenance, directly violating the iteration-9 narrowing. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:458-459] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:482-560]
3. `extractGitContext()` already centralizes the safe provenance contract needed by JSON mode: async extraction, detached-HEAD signaling, and empty-result degradation. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:47-85] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:325-343] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:359-503]
4. Detached HEAD is represented as `headRef = 'HEAD'`, `commitRef = <short SHA>`, `isDetachedHead = true`; the patch preserves that exact contract instead of guessing a branch name. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:329-343]
5. Shallow history does not block this fix because provenance is derived from bounded `rev-list`, `rev-parse`, and `show/diff` calls that already degrade safely. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:330-355] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:369-373]
6. A six-line JSON-mode insertion after Step 3.5 is sufficient; no new helper, no template change, and no post-save contract change are required for Q15 itself. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-923] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:359-503]

## Ruled out / not reproducible
Reusing `enrichCapturedSessionData()` for JSON mode was ruled out because its merge surface is much wider than provenance and would reintroduce exactly the contamination risk iteration 9 flagged. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-009.md:35-44] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:482-560]

Inlining git-shell commands directly into `workflow.ts` was also rejected; it would duplicate the extractor's existing fallback rules (`emptyResult()`, detached-HEAD detection, bounded diff logic) for no gain. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:73-85] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:325-355] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:499-502]

## New questions raised
Should JSON mode preserve caller-supplied provenance when `headRef` / `commitRef` are already present, or is live git state always the desired source of truth?

## Next focus recommendation
Iteration 19 should execute Q16 (post-save reviewer contract upgrade). See strategy §14.
