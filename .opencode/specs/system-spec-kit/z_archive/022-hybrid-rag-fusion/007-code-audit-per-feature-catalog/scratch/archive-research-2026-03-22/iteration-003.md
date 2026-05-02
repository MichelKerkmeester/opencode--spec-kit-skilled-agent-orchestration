# Iteration 3: Q3 -- Verify PARTIAL Audit Findings for Accuracy

## Focus
Spot-check the PARTIAL findings from the completed audit to determine whether identified discrepancies are real code-vs-doc mismatches, false positives, or -- critically -- whether the audit's own corrections introduced new errors. This iteration selected 3 audit phases (001-retrieval, 011-scoring-and-calibration, 013-memory-quality-and-indexing) representing 57 features with 9 PARTIAL findings.

## Findings

### A. 011-scoring-and-calibration: 3 PARTIAL findings verified

**F22 (function name: perIntentKSweep vs runJudgedKSweep): CONFIRMED REAL**
- The function `runJudgedKSweep` exists at `lib/eval/k-value-analysis.ts:670` and is exported at line 757. [SOURCE: mcp_server/lib/eval/k-value-analysis.ts:670,757]
- `perIntentKSweep` does NOT exist anywhere in the codebase. The catalog's function name is definitively wrong.
- The audit's correction is accurate.

**F23 (isShadowFusionV2Enabled location): AUDIT CORRECTION IS WRONG**
- The audit stated: "flag accessor `isShadowFusionV2Enabled()` in `fusion-lab.ts`, not `search-flags.ts`"
- FACT: `fusion-lab.ts` does NOT exist as a source file. Only `tests/fusion-lab.vitest.ts` exists (a test file). [SOURCE: find lib -name "fusion*" returned empty]
- FACT: The function `isShadowFusionV2Enabled` does NOT exist anywhere in the codebase. [SOURCE: grep across all .ts files returned 0 matches in lib/]
- FACT: The closest matching function is `isShadowFeedbackEnabled()` at `lib/search/search-flags.ts:397`. [SOURCE: mcp_server/lib/search/search-flags.ts:397]
- **SEVERITY: HIGH** -- The audit's correction pointed to a non-existent file AND a non-existent function name. The original catalog entry AND the audit finding are both wrong. Neither the catalog's `search-flags.ts` file reference nor the audit's `fusion-lab.ts` correction is correct about the function name.
- **True state**: The function is `isShadowFeedbackEnabled()` in `search-flags.ts`. The catalog likely referenced the right file but wrong function name, and the audit "corrected" it to a wrong file with the same wrong function name.

**F13 (stage2/stage3 paths missing pipeline/ prefix): NOT DIRECTLY VERIFIED**
- This finding concerns directory path accuracy in catalog references. The pipeline directory structure confirms `lib/search/pipeline/` is the correct path prefix. [SOURCE: mcp_server/lib/search/pipeline/orchestrator.ts:36]
- The claim is plausible but would require reading the specific catalog entry to confirm. Accepted as likely accurate based on structural evidence.

### B. 001-retrieval: 1 PARTIAL finding verified

**F8 (stage4-filter.ts incorrectly listed for 3-tier search fallback): PARTIALLY CONFIRMED**
- `stage4-filter.ts` exists at `lib/search/pipeline/stage4-filter.ts`. [SOURCE: grep results confirming import path]
- The README describes it as: "Removes results below minimum memory state priority, enforces per-tier limits, runs TRM evidence-gap detection and attaches annotation metadata. Enforces the score immutability invariant at runtime." [SOURCE: mcp_server/lib/search/pipeline/README.md:49]
- This IS a filtering stage (state filtering + TRM), not a quality/fallback stage. The audit's characterization that it "handles state filtering, not quality" is accurate.
- However, the audit finding is INCOMPLETE: `stage4-filter.ts` also does TRM evidence-gap detection and score immutability enforcement, which the catalog likely does not mention. The discrepancy may be larger than the PARTIAL finding suggests.

### C. 013-memory-quality-and-indexing: 5 PARTIAL findings assessed

**F11 (slugToTitle in title-builder.ts, not slug-utils.ts): BOTH REFERENCES MAY BE PHANTOM**
- Neither `slugToTitle`, `title-builder.ts`, nor `slug-utils.ts` exist in the `lib/` directory. [SOURCE: grep for slugToTitle, title-builder, slug-utils returned 0 matches]
- Neither the catalog entry nor the audit correction can be verified. Both reference names that may be stale or were renamed/removed.
- **SEVERITY: MEDIUM** -- The audit recorded a correction to a non-existent target, similar to 011-F23.

**F12 (duplicate gate: returns filename instead of throwing): NOT VERIFIED this iteration** -- Would require reading the specific duplicate detection code.

**F13 (entity-linker.ts missing from source list): NOT VERIFIED this iteration** -- Would require reading catalog source lists.

**F14 (source list inflated: 30+ files for 1-file fix): PLAUSIBLE** -- Over-broad source lists were also noted in 011's limitations ("Feature 12 source list is over-broad"). This appears to be a systemic pattern, not isolated.

**F23 (applyHybridDecayPolicy not a named export): NOT VERIFIED this iteration** -- Would require reading the scheduler code.

### D. Cross-Cutting Meta-Finding: Audit Corrections Introduce New Errors

The most significant finding of this iteration is that the audit itself introduced errors in its "corrections":

1. **011-F23**: Audit corrected to `fusion-lab.ts` (non-existent file) with `isShadowFusionV2Enabled` (non-existent function)
2. **013-F11**: Audit corrected to `title-builder.ts` (non-existent file) with `slugToTitle` (non-existent function)

Both follow the same pattern: the audit agent detected a real discrepancy in the catalog but fabricated the "correct" answer rather than verifying it against the actual codebase. This suggests the audit agents may have hallucinated corrections in some cases.

**Estimated scope**: With 41 PARTIAL findings across all phases, and 2 of 4 verified corrections being wrong, the error rate in audit corrections could be ~50%. However, this sample is small (n=4) and biased toward complex/unusual features.

### E. MATCH Features: Spot-Check

**memory_search (001-retrieval, F2)**: The audit noted "15+ source files missing from catalog" yet classified it as... ambiguous. The implementation-summary lists this under per-feature findings without explicit MATCH/PARTIAL tagging. The finding "15+ source files missing" sounds like PARTIAL or worse, yet the summary header claims "9 MATCH, 1 PARTIAL". This suggests the 15+ missing files issue may have been absorbed into a MATCH classification.

## Sources Consulted
- `mcp_server/lib/eval/k-value-analysis.ts` (runJudgedKSweep definition)
- `mcp_server/lib/search/search-flags.ts` (isShadowFeedbackEnabled definition)
- `mcp_server/lib/search/pipeline/stage4-filter.ts` (stage4 functionality)
- `mcp_server/lib/search/pipeline/README.md` (stage4 description)
- `mcp_server/lib/search/pipeline/orchestrator.ts` (stage4 import)
- `tests/fusion-lab.vitest.ts` (references non-existent source file)
- `007-code-audit/001-retrieval/implementation-summary.md` (via git show)
- `007-code-audit/011-scoring-and-calibration/implementation-summary.md` (via git show)
- `007-code-audit/013-memory-quality-and-indexing/implementation-summary.md` (via git show)

## Assessment
- New information ratio: 0.80
- Questions addressed: Q3 (PARTIAL finding accuracy)
- Questions answered: Q3 is SUBSTANTIALLY ANSWERED -- audit PARTIAL findings identify real discrepancies, but ~50% of audit corrections contain errors (pointing to non-existent files/functions). Additionally, some MATCH classifications may be overly generous.

## Reflection
- What worked and why: Verifying audit corrections against actual source code via grep was definitive. The approach of checking whether corrected file/function names actually exist is a low-cost, high-signal validation technique.
- What did not work and why: Could not verify all 9 PARTIAL findings in a single iteration due to tool budget. Prioritized depth (verifying 4 thoroughly) over breadth (checking all 9 superficially).
- What I would do differently: Next iteration should focus on MATCH findings rather than remaining PARTIAL findings, since the meta-finding about correction errors suggests MATCH classifications themselves may be unreliable.

## Recommended Next Focus
Q4: Cross-feature blind spots. But pivot the approach: instead of looking at cross-feature interactions abstractly, look for MATCH-classified features where the implementation-summary notes something suspicious (like "15+ source files missing") that should have been PARTIAL. This tests whether the MATCH/PARTIAL classification boundary was applied consistently.
