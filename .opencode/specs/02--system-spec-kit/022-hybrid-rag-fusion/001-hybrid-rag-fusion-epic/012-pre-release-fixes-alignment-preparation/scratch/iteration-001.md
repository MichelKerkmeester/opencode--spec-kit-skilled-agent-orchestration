# Review Iteration 1: Correctness - Core P0/P1 Implementation Fixes

## Focus
D1 Correctness -- Review implementation files for logic errors, incorrect return values, broken invariants. Focus on the highest-risk P0 fixes (T01, T02) and P1 code fixes (T05, T07, T09, T09b, T10).

## Scope
- Review target: P0/P1 implementation files
- Spec refs: spec.md, plan.md, tasks.md, checklist.md
- Dimension: correctness

## Scorecard
| File | Corr | Sec | Patt | Maint | Perf | Total |
|------|------|-----|------|-------|------|-------|
| mcp_server/package.json | 29/30 | -- | -- | -- | -- | 29 |
| shared/types.ts | 30/30 | -- | -- | -- | -- | 30 |
| shared/embeddings/factory.ts | 30/30 | -- | -- | -- | -- | 30 |
| mcp_server/context-server.ts | 29/30 | -- | -- | -- | -- | 29 |
| mcp_server/handlers/quality-loop.ts | 30/30 | -- | -- | -- | -- | 30 |
| scripts/memory/generate-context.ts | 30/30 | -- | -- | -- | -- | 30 |
| scripts/core/workflow.ts | 28/30 | -- | -- | -- | -- | 28 |
| scripts/core/frontmatter-editor.ts | 27/30 | -- | -- | -- | -- | 27 |
| scripts/core/topic-extractor.ts | 30/30 | -- | -- | -- | -- | 30 |
| scripts/utils/input-normalizer.ts | 28/30 | -- | -- | -- | -- | 28 |

## Findings

### P2-001: ensureMinTriggerPhrases fallback can re-inject full folder phrase with stopwords
- Dimension: correctness
- Evidence: [SOURCE: scripts/core/frontmatter-editor.ts:124]
- Impact: When `combined.length === 1` after stopword filtering, the fallback at line 124 returns `[combined[0], topicFromFolder.replace(/-/g, ' ').toLowerCase()]`. The `topicFromFolder` is the full folder name minus the leading number prefix (e.g., "pre release fixes alignment preparation"). This compound phrase contains "alignment" and other words that are individually in FOLDER_STOPWORDS. While these are filtered as individual tokens at line 117, the full compound phrase is NOT filtered.
- Skeptic: This is an edge case that only triggers when fewer than 2 non-stopword tokens exist in the folder name AND fewer than 2 triggers were extracted from content. In practice, content-derived triggers usually exceed 2, so `existing.length >= 2` at line 109 short-circuits. However, the contamination contract (T09 spec) explicitly aims to prevent path fragment injection, and this is a residual path.
- Referee: Confirmed P2. The fallback is rarely triggered and the compound phrase is less harmful than individual stopword tokens, but it represents incomplete application of the T09 contamination fix. Not a correctness bug -- a completeness gap in the fix.
- Final severity: P2

### P2-002: Duplicated FOLDER_STOPWORDS constant across workflow.ts and frontmatter-editor.ts
- Dimension: correctness
- Evidence: [SOURCE: scripts/core/workflow.ts:1106-1115] and [SOURCE: scripts/core/frontmatter-editor.ts:12-21]
- Impact: The same FOLDER_STOPWORDS set is duplicated in two files with a comment "duplicated from workflow.ts to avoid circular imports." If one is updated without the other, filtering diverges. Currently they are identical.
- Skeptic: The duplication is documented and intentional (avoid circular imports). Both are in the same codebase under the same team's control. The task spec T09 explicitly chose this approach.
- Referee: P2. The duplication is a known tech debt item, not a bug. The files are currently in sync. A shared constant module would be cleaner but was explicitly deferred.
- Final severity: P2

### P2-003: T09b exchange promotion overwrites userPrompts instead of merging
- Dimension: correctness
- Evidence: [SOURCE: scripts/utils/input-normalizer.ts:691-693]
- Impact: At line 691-693, when `promotedPrompts.length > 0`, the code replaces `normalized.userPrompts` entirely with `[...promotedPrompts, { prompt: sessionSummary }]`. If the slow-path had previously set any userPrompts from other sources (e.g., from data.userPrompts), they are overwritten. However, checking the slow-path flow: `normalized.userPrompts` is not set before this point in the slow path -- it's first assigned here. So this is not a bug in the current flow.
- Skeptic: The overwrite is the FIRST assignment of userPrompts in the slow path. The fast-path guard at line 660 (`normalized.userPrompts.length < 3`) is checked before promotion, but at that point normalized.userPrompts is undefined/empty. So the guard actually checks the input data's userPrompts, not previously-set ones. Wait -- `normalized.userPrompts` is not set yet at line 660. In JavaScript, checking `.length` on undefined would throw. Let me re-check.
- Referee: Investigating -- the guard at line 660 checks `!normalized.userPrompts || normalized.userPrompts.length < 3`. The `!normalized.userPrompts` clause handles the undefined case correctly via short-circuit. No runtime error. The overwrite at 691 is the first assignment. Not a bug.
- Final severity: Ruled out (not a bug)

### P1-001: T09b exchange promotion guard checks wrong source for fast-path detection
- Dimension: correctness
- Evidence: [SOURCE: scripts/utils/input-normalizer.ts:660]
- Impact: The fast-path guard `!normalized.userPrompts || normalized.userPrompts.length < 3` is intended to skip promotion if "userPrompts already has 3+ entries" (per checklist T09b). But at line 660 in the slow-path normalizer, `normalized.userPrompts` has NOT been set yet -- it is always undefined at this point. So the guard ALWAYS evaluates to true (`!undefined` is truthy), meaning the fast-path guard never actually prevents promotion. The spec intent was: "if the input data already provides 3+ userPrompts via the fast path, skip promotion." But this code is in the slow path, not the fast path.
- Skeptic: The slow path and fast path are DIFFERENT functions. The fast path has its own normalizer function that is NOT modified (per checklist: "fast-path function not modified"). The guard at line 660 is only in the slow path. In the slow path, `normalized.userPrompts` is indeed always undefined before line 691. So the guard is vacuous -- it always allows promotion. But is this harmful? The slow path by definition handles JSON-mode input where the original data lacks structured userPrompts. Promotion is ALWAYS desirable in the slow path. The fast-path guard protection happens at a higher level: fast-path data goes through a different function entirely. The checklist claim "skip promotion if userPrompts already has 3+ entries" is slightly misleading -- it should say "fast-path inputs never reach this code."
- Referee: The guard is vacuous but not harmful. The intent is preserved because fast-path and slow-path are separate code paths. However, the vacuous guard is dead code -- it creates false confidence that there's runtime protection. Downgrade from P1 to P2 (misleading dead guard, not a correctness bug).
- Final severity: P2

## Cross-Reference Results
- Confirmed: T01 (package.json exports) correctly adds `./api` before wildcard -- matches plan.md Fix 1
- Confirmed: T02 (networkError field + non-fatal startup) matches plan.md Fix 2 and checklist evidence
- Confirmed: T05 (quality-loop returns bestContent) at :657-661 matches plan.md and checklist
- Confirmed: T07 (sessionId forwarding) at generate-context.ts:550 matches plan.md
- Confirmed: T09 (post-filter reinsertion deleted, FOLDER_STOPWORDS expanded, applied in ensureMin functions)
- Confirmed: T09b (exchange promotion, toolCalls promotion, truncation 200->500 chars)
- Contradictions: None
- Unknowns: T10 (vector fallback) not yet reviewed in detail at the exact line

## Ruled Out
- T09b exchange overwrite of userPrompts: Not a bug -- first assignment in slow path, fast path is separate function
- T02 process.exit scope: Confirmed confined to context-server.ts only as documented

## Sources Reviewed
- [SOURCE: mcp_server/package.json:1-30]
- [SOURCE: shared/types.ts:110-118]
- [SOURCE: shared/embeddings/factory.ts:420-463]
- [SOURCE: mcp_server/context-server.ts:730-789]
- [SOURCE: mcp_server/handlers/quality-loop.ts:640-663]
- [SOURCE: scripts/memory/generate-context.ts:540-566]
- [SOURCE: scripts/core/workflow.ts:195-204, 1090-1139]
- [SOURCE: scripts/core/frontmatter-editor.ts:10-148]
- [SOURCE: scripts/core/topic-extractor.ts:25-44]
- [SOURCE: scripts/utils/input-normalizer.ts:270-289, 645-719]

## Assessment
- Confirmed findings: 3 (P2-001, P2-002, P2-003/P2 downgraded from P1)
- New findings ratio: 0.19
- noveltyJustification: 3 new P2 findings from reviewing 10 files; P1 candidate downgraded to P2 after skeptic/referee pass; all P0 fixes verified correct; no P0/P1 issues found
- Dimensions addressed: [correctness]

## Reflection
- What worked: Starting with highest-risk P0/P1 fixes and verifying the fix logic against spec claims. Reading actual code at claimed line numbers to verify.
- What did not work: N/A (first iteration)
- Next adjustment: Move to D2 Security, focusing on factory.ts validation paths and process.exit sites for injection/bypass risks.
