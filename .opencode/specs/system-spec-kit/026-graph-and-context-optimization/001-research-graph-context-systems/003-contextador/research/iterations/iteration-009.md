# Iteration 9 -- 003-contextador

## Metadata
- Run: 9 of 13
- Focus: Test coverage audit for core modules: self-healing entry path, janitor stages, routing, regeneration, freshness, stats, pointers, and hit-log cleanup placeholders
- Agent: cli-codex (gpt-5.4, model_reasoning_effort=high)
- Started: UNKNOWN
- Finished: 2026-04-06T12:20:56Z
- Tool calls used: 12

## Reading order followed
1. `.opencode/skill/sk-deep-research/SKILL.md` `1-220`
2. `research/iterations/iteration-008.md` `1-95`
3. `external/src/lib/core/feedback.test.ts` `1-145`
4. `external/src/lib/core/janitor.test.ts` `1-22`
5. `external/src/lib/core/headmaster.test.ts` `1-38`
6. `external/src/lib/core/generator.test.ts` `1-68`
7. `external/src/lib/core/freshness.test.ts` `1-40`
8. `external/src/lib/core/stats.test.ts` `1-52`
9. `external/src/lib/core/pointers.test.ts` `1-127`
10. `external/src/lib/core/hitlog.test.ts` `1-36`

## Findings

Evidence posture for this iteration:
- Source-proven claims below come only from the traced test files under `external/src/lib/core/*.test.ts`.
- Evidence-type changes for prior findings F3, F5, F6, F7, and F10 are test-backed only where the tests make explicit assertions; uncovered behavior remains source-only or inferred.
- No README claims were needed for this pass.

### Test Coverage Audit Table

| Module | Test file | Behaviors covered (concrete) | Behaviors NOT covered or aspirational | Confidence delta vs source-only finding |
|--------|-----------|------------------------------|----------------------------------------|-----------------------------------------|
| Feedback / self-healing entry path | `external/src/lib/core/feedback.test.ts` | `missing_context` appends missing files into `Key Files` and adds `feedback_failures: 1` (`external/src/lib/core/feedback.test.ts:50-72`); `build_failure` and `wrong_location` increment failures and enqueue janitor work (`external/src/lib/core/feedback.test.ts:74-112`); repeated failures increment counters (`external/src/lib/core/feedback.test.ts:114-133`); `recordSuccess()` increments `feedback_successes` (`external/src/lib/core/feedback.test.ts:135-145`). | No assertions for malformed or absent `CONTEXT.md`, queue deduplication/idempotency, multiple scope interactions, or end-to-end repair completion after enqueue; the whole file uses small happy-path temp fixtures only (`external/src/lib/core/feedback.test.ts:7-48`, `external/src/lib/core/feedback.test.ts:50-145`). | F5 upgrades from source-only to test-confirmed for metadata mutation and queue-enqueue side effects, but remains partial for the full self-healing loop. |
| Janitor / repair stages | `external/src/lib/core/janitor.test.ts` | Empty queue returns `processed = 0` (`external/src/lib/core/janitor.test.ts:8-14`); `detectNewScopes()` finds directories that contain code but lack `CONTEXT.md` (`external/src/lib/core/janitor.test.ts:16-22`). | No tests exercise actual repair-queue item execution, staged janitor regeneration, stale cleanup, hit-log pruning integration, or artifact rewriting; coverage is only a no-op and discovery check across the full file (`external/src/lib/core/janitor.test.ts:1-22`). | F7 does not materially upgrade here; janitor-stage claims should stay hedged because the tested surface is much narrower than the earlier source trace. |
| Headmaster / routing | `external/src/lib/core/headmaster.test.ts` | A specific nested-scope query routes directly to the most specific scope and returns a non-empty context chain (`external/src/lib/core/headmaster.test.ts:8-22`); an ambiguous cross-cutting query triggers fan-out with multiple targets (`external/src/lib/core/headmaster.test.ts:24-38`). | No tests cover ranking among competing matches, fallback to broader scopes, false-positive routing, zero-result handling, or mixed-quality `CONTEXT.md` inputs; the entire file covers only two positive-path scenarios (`external/src/lib/core/headmaster.test.ts:1-38`). | F3 upgrades from source-only to test-confirmed for the two headline routing branches, but only at a smoke-test level. |
| Generator / regeneration | `external/src/lib/core/generator.test.ts` | `summarizeDirectory()` includes code files, skips `node_modules`, and ignores non-code extensions (`external/src/lib/core/generator.test.ts:7-25`); depth limiting stops traversal beyond depth 4 (`external/src/lib/core/generator.test.ts:27-44`); `generateContextContent()` emits frontmatter plus a non-empty body (`external/src/lib/core/generator.test.ts:46-68`). | No assertions cover semantic summary quality, deterministic ordering, generated section structure, repair-triggered regeneration, large-directory behavior, or preservation of prior manual edits; all tests stay at small synthetic fixtures (`external/src/lib/core/generator.test.ts:7-68`). | F6 upgrades from source-only to test-confirmed for directory scanning and minimal output-shape guarantees, but not for regeneration quality or integration behavior. |
| Freshness helpers | `external/src/lib/core/freshness.test.ts` | Frontmatter parsing extracts SHA/date and strips frontmatter from the body (`external/src/lib/core/freshness.test.ts:4-19`); missing-frontmatter fallback returns nulls and leaves the body intact (`external/src/lib/core/freshness.test.ts:21-27`); frontmatter construction is exact (`external/src/lib/core/freshness.test.ts:29-32`); `daysSince()` handles today/yesterday math (`external/src/lib/core/freshness.test.ts:34-40`). | No tests cover freshness thresholds, stale-warning decisions, rebasing on Git history, invalid date handling, timezone edge cases beyond yesterday/today, or any janitor integration; the file is helper-focused only (`external/src/lib/core/freshness.test.ts:1-40`). | F7 gets only a small helper-level upgrade; broader freshness-heuristic claims remain mostly source-only. |
| Stats / token-savings math | `external/src/lib/core/stats.test.ts` | New projects load zeroed stats (`external/src/lib/core/stats.test.ts:8-14`); query recording increments counts, cache hits, and token totals (`external/src/lib/core/stats.test.ts:16-25`); feedback increments its counter (`external/src/lib/core/stats.test.ts:27-34`); `estimateTokensSaved()` enforces the fixed arithmetic used for `saved`, `used`, and `net` (`external/src/lib/core/stats.test.ts:36-52`). | No tests validate the 25k-token assumption against measured requests, persistence corruption, concurrent writes, long-run drift, or whole-system instrumentation accuracy; the math is verified as encoded, not empirically benchmarked (`external/src/lib/core/stats.test.ts:36-52`). | F10 upgrades from source-only to test-confirmed for the internal formula and counters, but the business-value claim still depends on an unmeasured constant. |
| Pointers / payload extraction | `external/src/lib/core/pointers.test.ts` | Full extraction covers scope, purpose, key files, dependencies, API surface, and tests from a well-formed document (`external/src/lib/core/pointers.test.ts:37-68`); missing sections and missing frontmatter degrade gracefully (`external/src/lib/core/pointers.test.ts:70-97`); serialization emits a compact block and omits empty sections (`external/src/lib/core/pointers.test.ts:100-126`). | No tests cover extra headings, malformed bullets, multi-paragraph purpose sections, narrative lossiness measurement, or compatibility with richer real-world markdown; the file proves the supported grammar, not the failure envelope (`external/src/lib/core/pointers.test.ts:37-126`). | This strengthens the earlier F4/F8 parser-shape findings, but lossiness magnitude remains inferred rather than test-measured. |
| Hit log / cleanup placeholder | `external/src/lib/core/hitlog.test.ts` | Keyword hashing is stable and order-independent, and distinct keywords hash differently (`external/src/lib/core/hitlog.test.ts:4-20`); pruning trims oversized logs and removes old entries (`external/src/lib/core/hitlog.test.ts:22-36`). | No tests cover persistence, janitor wiring, collision behavior beyond tiny samples, or interaction with routing/cache logic; this is a utility-level placeholder check only (`external/src/lib/core/hitlog.test.ts:1-36`). | This offers minor support for the F7 cleanup story, but not enough to treat janitor cleanup as test-confirmed end-to-end. |

### F9.1 -- F3 routing now has real test support, but only for two canonical branches
- The strongest routing evidence is no longer source-only: one test proves short-circuiting to the deepest specific scope with a populated context chain, and another proves ambiguous fan-out across multiple targets (`external/src/lib/core/headmaster.test.ts:8-22`, `external/src/lib/core/headmaster.test.ts:24-38`).
- That should raise confidence in Public adoption for the basic "precise route vs. fan-out" decision shape.
- It should not yet raise confidence in ranking quality, fallback behavior, or robustness to messy project trees, because none of those cases are asserted anywhere in the file (`external/src/lib/core/headmaster.test.ts:1-38`).

### F9.2 -- F5 self-healing is test-confirmed at the intake boundary, not across the full loop
- `processFeedback()` is concretely verified to mutate `CONTEXT.md` metadata, append missing files, and enqueue janitor work for failure modes (`external/src/lib/core/feedback.test.ts:50-145`).
- That makes the intake boundary one of the strongest test-backed behaviors in this codebase snapshot and a meaningful positive signal for adoption.
- The hedge is important: these tests stop at enqueue/counter mutation and never show janitor consumption, repair deduplication, or successful end-to-end healing after feedback (`external/src/lib/core/feedback.test.ts:7-48`, `external/src/lib/core/feedback.test.ts:50-145`; `external/src/lib/core/janitor.test.ts:1-22`).

### F9.3 -- F6 regeneration is partly grounded by filesystem-shape tests, but not by content-quality tests
- The generator suite proves file discovery filters, depth capping, and the existence of frontmatter plus non-empty generated body output (`external/src/lib/core/generator.test.ts:7-68`).
- That is useful for Public adoption because it confirms the regeneration path is not wholly aspirational at the filesystem and file-shape level.
- It is still unsafe to over-claim content quality, stable formatting, or repair-driven rewrite behavior because no test inspects semantic accuracy or integration with the repair queue (`external/src/lib/core/generator.test.ts:46-68`).

### F9.4 -- F7 freshness and janitor-stage claims should be downgraded to helper-level confidence
- Freshness coverage is limited to frontmatter parsing/building and a simple day-difference helper (`external/src/lib/core/freshness.test.ts:4-40`).
- Janitor coverage is even thinner: empty-queue no-op plus new-scope detection only (`external/src/lib/core/janitor.test.ts:8-22`).
- Hit-log cleanup is validated only as a small utility, not as a janitor-integrated maintenance stage (`external/src/lib/core/hitlog.test.ts:22-36`).
- Taken together, the prior F7 storyline should remain explicitly hedged in synthesis: parts of the plumbing exist, but the operational freshness/cleanup loop is not strongly test-backed.

### F9.5 -- F10 stats claims are test-confirmed as encoded arithmetic, not as empirical savings
- The stats suite confirms counter persistence and the exact savings formula currently hard-coded into the project (`external/src/lib/core/stats.test.ts:16-25`, `external/src/lib/core/stats.test.ts:36-52`).
- That means any Public-facing statement about "how the tool computes savings" can now be upgraded to test-confirmed.
- Any statement about "actual realized savings" still needs caution because the crucial 25k-token-per-query constant is asserted, not measured, and there are no integration or benchmark tests around it (`external/src/lib/core/stats.test.ts:36-52`).

## Newly answered key questions
- F3 is now test-confirmed at the branch level for specific-scope short-circuiting and ambiguous fan-out, though not for route ranking or fallback behavior (`external/src/lib/core/headmaster.test.ts:8-38`).
- F5 is now test-confirmed at the self-healing intake boundary: feedback mutates counters, injects missing files, and enqueues repairs (`external/src/lib/core/feedback.test.ts:50-145`).
- F6 is now test-confirmed for directory traversal filters and minimal generated-file shape, but not for summary quality (`external/src/lib/core/generator.test.ts:7-68`).
- F10 is now test-confirmed for the internal stats math and counters, but still not empirically validated as real savings (`external/src/lib/core/stats.test.ts:8-52`).

## Open questions still pending
- F7 remains only lightly test-backed: the suites do not prove stale-warning policy, janitor-stage execution, or cleanup integration beyond helper utilities (`external/src/lib/core/freshness.test.ts:1-40`, `external/src/lib/core/janitor.test.ts:1-22`, `external/src/lib/core/hitlog.test.ts:1-36`).
- Pointer lossiness remains source-proven plus inferred rather than benchmarked; the tests prove the accepted grammar and serializer shape, not how much real-world context is dropped (`external/src/lib/core/pointers.test.ts:37-126`).

## Recommended next focus (iteration 10)
- Mainframe test + budget audit: read `external/src/lib/mainframe/budget.test.ts`, `external/src/lib/mainframe/budget.ts`, `external/src/lib/mainframe/client.test.ts`, `external/src/lib/mainframe/dedup.test.ts`, `external/src/lib/mainframe/rooms.test.ts`, and `external/src/lib/mainframe/summarizer.test.ts`.
- Goal: validate F8 and F9 (Mainframe shared cache and privacy/conflict findings) against test coverage and fully document the budget subsystem, especially where the earlier loop read tests but not the `budget.ts` source.

## Self-assessment
- newInfoRatio (estimate, 0.0-1.0): 0.41
- status: insight
- findingsCount: 5
