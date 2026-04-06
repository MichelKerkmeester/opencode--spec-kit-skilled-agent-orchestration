# Iteration 7: D7 Root Cause - Empty Git Provenance

## Focus
Trace defect D7 to the literal JSON-mode gate that suppresses git enrichment, then do two cheap confirmation passes: whether the trigger merge already deduplicates phrases (D6) and whether the summary/overview anchor mismatch is authored directly in the template (D8).

## D7 Root cause + verification
The root cause is the captured-session gate in `workflow.ts`, not a failed git lookup in the JSON-mode path. `runWorkflow()` computes `isCapturedSessionMode` as `collectedData._source !== 'file' && collectedData._isSimulation !== true`, and Step 3.5 only runs when that flag is true. JSON-mode payloads arrive with `_source === 'file'`, so the enrichment block that would add spec-folder and git context is skipped entirely. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-890`]

The same gate is duplicated inside the enrichment helper itself. `enrichCapturedSessionData()` immediately returns unchanged input when `_source === 'file'`; only non-file inputs call `extractGitContext(projectRoot, specFolder)` and then copy `gitContext.headRef`, `gitContext.commitRef`, and `gitContext.repositoryState` back onto the collected payload for rendering. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:453-471`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:530-560`]

That explains the rendered symptom precisely. `collectSessionData()` maps `data.headRef` and `data.commitRef` into `HEAD_REF` and `COMMIT_REF` only when they are strings, and otherwise falls back to `null`; `REPOSITORY_STATE` falls back to `"unavailable"` when no git value was injected. The template then renders unconditional metadata lines for `head_ref`, `commit_ref`, and `repository_state`, so JSON-mode writes empty git refs and `"unavailable"` without ever attempting enrichment. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1085-1089`, `.opencode/skill/system-spec-kit/templates/context_template.md:749-753`]

There is a degraded fallback path in the extractor, but it is secondary to the JSON-mode defect. `git-context-extractor.ts` does return `emptyResult()` with `headRef: null`, `commitRef: null`, and `repositoryState: 'unavailable'` when git is unavailable or an exception occurs. That fallback would matter for captured-session runs that actually call the extractor; it does not explain JSON-mode by itself because JSON-mode never reaches the extractor call site. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:73-84`, `.opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:359-371`, `.opencode/skill/system-spec-kit/scripts/extractors/git-context-extractor.ts:499-502`]

## D6 Root cause + verification
The inspected merge site already contains a case-insensitive dedup pass, so D6 is not rooted in the manual-plus-auto trigger merge slice that iteration 4 identified. `workflow.ts` builds `mergedTriggers`, tracks lowercase phrases in `seenMergedTriggers`, and only appends unseen manual or auto-extracted phrases. After that, folder-token additions are also guarded by a lowercase `existingLower` set before being appended. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1233-1272`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1274-1298`]

Quick-check conclusion: exact or case-only duplicates should be filtered out at this merge stage, so the duplicate phrase seen in F7 likely comes from a different stage or from a phrase-shape difference that survives lowercase equality. This iteration did not trace beyond the merge slice, so D6 remains only partially characterized. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1235-1267`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1274-1295`]

## D8 Root cause + verification
D8 is a literal template-authored mismatch, not a discrepancy introduced by a later renderer. The table of contents links `OVERVIEW` to `#overview`, while the body section is preceded by `<!-- ANCHOR:summary -->` and then `<a id="overview"></a>`. Both names are present in the same `context_template.md` block, so the mismatch originates in the template source itself. [CITATION: `.opencode/skill/system-spec-kit/templates/context_template.md:172-183`, `.opencode/skill/system-spec-kit/templates/context_template.md:330-352`]

## Findings
1. D7 is caused by the JSON-mode `_source === 'file'` gate, which makes `isCapturedSessionMode` false and skips the only Step 3.5 branch that performs spec-folder and git enrichment. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:877-890`]
2. The only code path that calls `extractGitContext()` is `enrichCapturedSessionData()`, and that helper also short-circuits immediately for file-backed JSON input. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:458-471`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:556-560`]
3. JSON-mode therefore renders empty git refs by default: `collectSessionData()` maps missing git fields to `null` and `"unavailable"`, and the template emits those metadata keys unconditionally. [CITATION: `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1085-1089`, `.opencode/skill/system-spec-kit/templates/context_template.md:749-753`]
4. D6 is not explained by the merge site in `workflow.ts`; the merged trigger list and the later folder-token additions both have explicit lowercase dedup guards. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1235-1272`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1274-1298`]
5. D8 is authored directly in `context_template.md`, where `ANCHOR:summary` and `id="overview"` coexist in the same overview section block. [CITATION: `.opencode/skill/system-spec-kit/templates/context_template.md:177-177`, `.opencode/skill/system-spec-kit/templates/context_template.md:330-352`]

## Question status
Q6 RESOLVED: git provenance is supposed to come from captured-session enrichment via `extractGitContext()`, but JSON-mode never enters that branch because `_source === 'file'`. The empty fields are the expected fallback render for missing injected git metadata, not proof that the extractor ran and failed. [CITATION: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:453-471`, `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:658-659`, `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:1085-1089`]

D6 quick note: the inspected trigger merge already deduplicates case-insensitively, so the duplicate-phrase defect is not proven at this site and likely needs a downstream pass.

D8 quick note: the anchor mismatch is literal in the template and should be fixable with a one-file naming alignment.

## Next focus: Q7
Synthesize the remediation matrix for D1-D8 with file:function targets, indicate which defects need new pre-render logic versus template cleanup versus post-save validation, and pair each fix with a verification route.
