# Iteration 5: Temporal Gaps -- Code Changes During and After the Audit

## Focus
Investigated Q5: Are there recently added or modified source files that the audit could not have covered? The feature catalog audit was completed on 2026-03-22 at 19:08 (commit 4a477420d). The audit window spans from the 022 renumbering (2026-03-16, commit 3cf8b0912) through the audit completion commit. The key question: did source code change during or after the audit in ways that invalidate the audit findings?

## Findings

### F1: MASSIVE concurrent code churn during audit window
234 `.ts` files were modified across 27 commits touching `mcp_server/` between the catalog renumbering (Mar 16) and the audit completion (Mar 22). This represents modification of approximately 82% of all 286 source files. The audit was conducted against a codebase that was simultaneously being refactored, extended, and fixed.
[SOURCE: git diff --name-only 3cf8b0912..4a477420d -- mcp_server/ | grep '.ts$' | wc -l = 234]

### F2: 27 entirely NEW source files were added during the audit window
These are not modifications to existing files -- they are brand new `.ts` source files that did not exist when the feature catalog was initially created. 27 new source files (non-test) and 63 new test files were added.
[SOURCE: git diff --diff-filter=A --name-only 3cf8b0912..4a477420d -- mcp_server/ | grep '.ts$']

### F3: 6 of 27 new source files have ZERO catalog mentions
Cross-referencing the 27 new source files against the feature catalog reveals 6 that are entirely uncataloged:
1. **`lib/feedback/batch-learning.ts`** -- Batch learning feedback loop
2. **`lib/search/confidence-scoring.ts`** -- Search result confidence scoring
3. **`lib/search/graph-calibration.ts`** -- Graph signal calibration
4. **`lib/search/llm-cache.ts`** -- LLM response caching for query reformulation
5. **`lib/search/recovery-payload.ts`** -- Empty result recovery payload construction
6. **`lib/search/result-explainability.ts`** -- Result explainability/provenance traces

These files were created during the audit window and never incorporated into any catalog category.
[SOURCE: grep -rl across 007-code-audit-per-feature-catalog/ for each filename, zero hits for these 6]

### F4: 21 of 27 new source files ARE in the catalog
Notably, 21 of the 27 new files DO appear in the catalog, suggesting the audit was partially updated for concurrent changes. The coverage gap is partial, not total.
[SOURCE: same cross-reference, positive hits for 21 files]

### F5: Zero post-audit drift (no files changed after audit completion)
No commits touching `mcp_server/` exist after the audit completion commit (4a477420d). The audit is current as of HEAD. This means the only temporal gap is concurrent changes DURING the audit, not post-audit drift.
[SOURCE: git log --oneline 4a477420d..HEAD -- mcp_server/ returns empty]

### F6: The audit window included 4 major implementation waves
The 27 commits during the audit window include substantial feature work:
- Wave 1-4 implementation of 29 research recommendations (commits 429cb19e3 through 2841e714a, Mar 21)
- Feature flag graduation to default ON (commit 09acbe8ce, Mar 21)
- 60 audit findings from 10-agent code review (commit bfe222cfc, Mar 21)
- Phase 016 review with test coverage fixes (commit 6514c01d6, Mar 22)
- Wave 2 deep research findings (commit 18c3f9bdb, Mar 22)

These waves added new modules, refactored existing ones, and graduated experimental features -- all while the catalog audit was running.
[SOURCE: git log --oneline --format="%h %ai %s" 3cf8b0912..4a477420d -- mcp_server/]

### F7: Synthesis -- three layers of temporal gap
The temporal gap problem operates at three levels:
1. **Uncataloged new files (6 files)**: Created during audit window, never added to catalog, never audited
2. **Modified existing files (234 files)**: Audited against stale catalog descriptions that may not reflect post-modification behavior
3. **Graduated feature flags**: Features moved from experimental to default-ON during the audit, potentially changing which code paths are active in production

Layer 2 is the most impactful: the audit verified ~179 features as MATCH, but the underlying source files for many of those features were modified by 27 commits during the same period. A MATCH finding may have been accurate at time of verification but invalidated by a subsequent commit within the same audit window.
[INFERENCE: based on F1, F5, F6 -- the combination of 234 modified files, 4 implementation waves, and a point-in-time audit creates a moving-target problem]

## Sources Consulted
- git diff --name-only 3cf8b0912..4a477420d -- mcp_server/
- git diff --diff-filter=A --name-only 3cf8b0912..4a477420d -- mcp_server/
- git log --oneline 4a477420d..HEAD -- mcp_server/
- git log --oneline 3cf8b0912..4a477420d -- mcp_server/
- grep -rl across 007-code-audit-per-feature-catalog/ for each new filename

## Assessment
- New information ratio: 0.85 (6 of 7 findings are genuinely new; F4 partially confirms prior iter 2 findings)
- Questions addressed: Q5 (temporal gaps)
- Questions answered: Q5 fully answered

## Reflection
- What worked and why: Git log analysis with precise commit boundaries gave definitive temporal data. Using `--diff-filter=A` isolated truly new files from modifications, which was crucial for distinguishing the 3 layers of temporal gap.
- What did not work and why: N/A -- the approach was clean and well-matched to the question.
- What I would do differently: Would also check `git diff --stat` for the most heavily modified files to quantify the degree of change (lines added/removed), not just which files changed.

## Recommended Next Focus
Generate new research questions from the synthesis of iterations 1-5. Three high-value follow-up questions emerge:
1. **Q6 (Feature flag graduation impact)**: Which specific features graduated from experimental to default-ON during the audit, and do their catalog descriptions reflect production behavior or experimental behavior?
2. **Q7 (PARTIAL re-verification priority)**: Of the 41 PARTIAL findings, which ones involve files that were ALSO modified during the audit window (compounding temporal + correction errors)?
3. **Q8 (Quantitative gap model)**: Can we produce a single weighted risk score per audit phase combining: uncataloged file count, PARTIAL correction error rate, cross-cutting blind spot count, and temporal modification count?
