# Review Iteration 1: Correctness - File:Line Citation Verification

## Focus
D1 Correctness -- Verify that research.md file:line citations match actual source code. Check contamination map accuracy against current codebase state.

## Scope
- Review target: research.md (all 7 sections), spec.md, checklist.md
- Source verification: workflow.ts, frontmatter-editor.ts, topic-extractor.ts, input-normalizer.ts, memory-frontmatter.ts, post-save-review.ts
- Dimension: correctness

## Scorecard
| File | Corr | Sec | Patt | Maint | Perf | Total |
|------|------|-----|------|-------|------|-------|
| research.md | 18/30 | -- | -- | -- | -- | 18/30 |
| spec.md | 22/30 | -- | -- | -- | -- | 22/30 |
| checklist.md | 20/30 | -- | -- | -- | -- | 20/30 |

## Findings

### P1-001: Research describes pre-fix state as current -- topic-extractor.ts:31-36
- Dimension: correctness
- Evidence: [SOURCE: scripts/core/topic-extractor.ts:33-35] -- Code now reads: "T09: Do NOT push spec folder name into weightedSegments -- folder path fragments contaminate topics". The fix is already applied with a comment explaining why.
- Cross-reference: [SOURCE: research.md section 1, row 5] -- States "pushes specFolderName into weightedSegments" as active contamination.
- Impact: Research presents an already-fixed issue as a current root cause. Misleading for anyone implementing fixes based on this research.
- Skeptic: The research may have been written BEFORE the fix was applied, and the fix may have been informed BY the research. If so, the research is historically accurate but currently stale. However, research.md does not note any temporal caveat.
- Referee: P1 confirmed. The research should clearly state which findings have been remediated since the investigation. Without this, implementers may waste effort re-fixing solved problems.
- Final severity: P1

### P1-002: Research claims ensureMinTriggerPhrases lacks FOLDER_STOPWORDS -- already fixed
- Dimension: correctness
- Evidence: [SOURCE: scripts/core/frontmatter-editor.ts:12-21,117] -- `FOLDER_STOPWORDS` is declared at line 12 and used in `ensureMinTriggerPhrases` at line 117: `.filter((token) => token.length >= 3 && !FOLDER_STOPWORDS.has(token))`.
- Cross-reference: [SOURCE: research.md section 1, row 4] -- States "Blocked tokens like memory, quality can re-enter" via ensureMinTriggerPhrases. [SOURCE: research.md section 7] -- Ultra-think review recommends "Apply FOLDER_STOPWORDS inside ensureMinTriggerPhrases" as a fix needed.
- Impact: The research's #1 recommended fix action (ultra-think Step A) targets code that already implements it. Implementers would find the "bug" doesn't exist.
- Skeptic: Same temporal caveat as P1-001. The fix may have been applied between research and review. But the ultra-think review in section 7 was done as part of the same spec and should have caught this.
- Referee: P1 confirmed. Both the main research AND the ultra-think review missed that this was already fixed. Critical accuracy gap.
- Final severity: P1

### P1-003: Research claims exchanges/toolCalls not promoted to messages -- already implemented
- Dimension: correctness
- Evidence: [SOURCE: scripts/utils/input-normalizer.ts:658-693] -- Code at lines 658-693 implements T09b: "Promote exchanges to multi-message userPrompts for richer semantic input" and "Promote toolCalls to implementation observations". Complete with dedup logic, 10-exchange cap, and fast-path guard.
- Cross-reference: [SOURCE: research.md section 2] -- States exchanges are "Retained raw, NOT promoted to messages" with "Highest missed opportunity". [SOURCE: research.md section 3, Step 4] -- Recommends "Enrich JSON normalization" as P1 fix. [SOURCE: research.md section 7, Step B/PR2] -- Ultra-think recommends "promote exchanges to userPrompts" as separate PR.
- Impact: The entire PR2 recommendation (research.md section 7, ~25 LOC estimate) targets functionality that already exists. This is the largest factual error in the research.
- Skeptic: The T09b implementation uses the exact same design the research recommends (10-exchange cap, dedup vs sessionSummary, fast-path guard when userPrompts >= 3). This strongly suggests the implementation was done BASED on this research, making the research historically accurate but its recommendations stale.
- Referee: P1 confirmed. The research is useful as historical record but dangerous as current implementation guide.
- Final severity: P1

### P1-004: workflow.ts unshift() claim is factually incorrect
- Dimension: correctness
- Evidence: [SOURCE: scripts/core/workflow.ts:1099-1125] -- After `filterTriggerPhrases()` at :1101, the code does NOT use `unshift()` to re-add the full folder phrase. Instead, it: (1) splits folderNameForTriggers into tokens at :1103, (2) checks each token against FOLDER_STOPWORDS at :1118, (3) pushes non-stopped tokens at :1122 via `push()` (not `unshift()`).
- Cross-reference: [SOURCE: research.md section 1, row 2] -- Claims "workflow.ts:1101-1106 re-adds full folder phrase via unshift() AFTER filtering".
- Impact: The claim that the full folder phrase is forcibly re-inserted after filtering is wrong. The actual code adds individual tokens (not the full phrase), filters them through stopwords, and uses push (not unshift). The "Guarantees at least one folder-derived trigger" assessment is overstated.
- Skeptic: The research may be describing an older version of the code before CG-04 changes. The line references don't match the described behavior at all.
- Referee: P1 confirmed. Factual error in the contamination map that mischaracterizes the post-filter behavior.
- Final severity: P1

### P2-001: Minor line number offsets in workflow.ts references
- Dimension: correctness
- Evidence: [SOURCE: scripts/core/workflow.ts:1059-1060] -- `folderNameForTriggers` creation and push. Research says :1056-1058.
- Impact: 3-line offset. Not blocking but could confuse developers navigating by line number.
- Final severity: P2

### P2-002: ensureMinSemanticTopics also uses FOLDER_STOPWORDS but research doesn't note it
- Dimension: correctness
- Evidence: [SOURCE: scripts/core/frontmatter-editor.ts:130-144] -- `ensureMinSemanticTopics` at line 139 filters with `!FOLDER_STOPWORDS.has(token)`.
- Cross-reference: [SOURCE: research.md section 1, row 6] -- Describes ensureMinSemanticTopics as "falls back to first folder token" with "No path-aware filter".
- Impact: Another already-fixed item presented as current.
- Final severity: P2 (same pattern as P1-001/002, lower impact because already covered by those findings)

### P2-003: FOLDER_STOPWORDS in workflow.ts already includes generation, epic, audit
- Dimension: correctness
- Evidence: [SOURCE: scripts/core/workflow.ts:1114] -- FOLDER_STOPWORDS includes 'generation', 'epic', 'audit', 'enforcement', 'remediation'.
- Cross-reference: [SOURCE: research.md section 1, Filter Gap Summary] -- States FOLDER_STOPWORDS misses "generation, epic, dynamic naming patterns". [SOURCE: research.md section 7, Step A] -- Recommends "expand FOLDER_STOPWORDS (add generation, epic, audit, alignment, enforcement, remediation)".
- Impact: The recommended expansion was already applied.
- Final severity: P2

## Cross-Reference Results
- Confirmed: buildSpecTokens() location at memory-frontmatter.ts:50-57; filterTriggerPhrases() at workflow.ts:122-158; PATH_FRAGMENT_PATTERNS at post-save-review.ts:184-193; deriveMemoryTriggerPhrases NOT called from workflow.ts (confirmed by grep)
- Contradictions: 4 findings describe already-fixed code as current bugs (P1-001 through P1-003, P2-002, P2-003); unshift() claim factually wrong (P1-004)
- Unknowns: Whether research was conducted before fixes were applied (temporal ordering unclear)

## Ruled Out
- Security issues in file:line citations: no sensitive data exposed in citations. Not an issue.
- Research fabrication: The research findings are internally consistent and demonstrate deep code understanding. The issue is staleness, not fabrication.

## Sources Reviewed
- [SOURCE: scripts/core/workflow.ts:1025-1134]
- [SOURCE: scripts/core/workflow.ts:115-159]
- [SOURCE: scripts/core/topic-extractor.ts:25-44]
- [SOURCE: scripts/core/frontmatter-editor.ts:1-21, 108-144]
- [SOURCE: scripts/lib/memory-frontmatter.ts:45-165]
- [SOURCE: scripts/utils/input-normalizer.ts:565-694]
- [SOURCE: scripts/core/post-save-review.ts:178-198]
- [SOURCE: research.md sections 1-7]
- [SOURCE: spec.md]
- [SOURCE: checklist.md]

## Assessment
- Confirmed findings: 7 (4 P1, 3 P2)
- New findings ratio: 1.00
- noveltyJustification: First iteration, all findings are new. 4 P1 findings represent significant correctness issues where research describes already-fixed code as current problems.
- Dimensions addressed: correctness

## Reflection
- What worked: Systematically verifying each file:line citation against actual code. Reading the actual source files revealed a clear pattern of staleness.
- What did not work: N/A (first iteration)
- Next adjustment: Focus on spec-alignment next -- verify whether spec.md success criteria and checklist claims hold given the correctness findings.
