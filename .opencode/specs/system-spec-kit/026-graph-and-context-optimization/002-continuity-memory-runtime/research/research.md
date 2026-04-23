# Deep Research — 002-continuity-memory-runtime

## Summary
This investigation focused on correctness gaps, race behavior, doc-code drift, and uncovered failure modes across the continuity-memory runtime packet and its nested save/resume phases. The most serious live issue is a routed `full-auto` save race: canonical merge preparation runs before the folder lock is acquired, so concurrent saves can overwrite each other even though the promotion/indexing phase is serialized. A second cluster of issues is contract drift: the shipped runtime no longer matches the documented handover/archive semantics taught by Gate D and Gate E. The remaining problems are mostly verification and discoverability debt, including skipped concurrency tests, TODO filtering coverage, a broken research breadcrumb, and stale packet numbering. Overall, the packet has converged on one P0 data-integrity risk, five P1 contract/verification risks, and two P2 discoverability drifts. Evidence basis: `iteration-05.md#Findings`, `iteration-02.md#Findings`, `iteration-03.md#Findings`, `iteration-04.md#Findings`, `iteration-07.md#Findings`, `iteration-08.md#Findings`, `iteration-01.md#Findings`, `iteration-09.md#Findings`.

## Scope
The research covered the active parent packet `002-continuity-memory-runtime`, its nested child packets `001-cache-warning-hooks`, `002-memory-quality-remediation`, `003-continuity-refactor-gates`, and `004-memory-save-rewrite`, plus the live save/resume runtime under `.opencode/skill/system-spec-kit/mcp_server/`. Investigation concentrated on:

- resume-ladder behavior and recovery-source precedence (`iteration-02.md#Findings`)
- Gate D and Gate E reader/runtime migration contracts (`iteration-03.md#Findings`, `iteration-04.md#Findings`)
- canonical routed save behavior under concurrent `full-auto` writes (`iteration-05.md#Findings`)
- lock scope, process boundaries, and test evidence for race safety (`iteration-06.md#Findings`, `iteration-07.md#Findings`, `iteration-08.md#Findings`)
- packet-local research/discoverability and numbering drift (`iteration-01.md#Findings`, `iteration-09.md#Findings`)

Primary evidence threads: `iteration-02.md#Findings`, `iteration-03.md#Findings`, `iteration-04.md#Findings`, `iteration-05.md#Findings`, `iteration-06.md#Findings`, `iteration-07.md#Findings`, `iteration-08.md#Findings`, `iteration-09.md#Findings`.

## Key Findings
### P0
- `F-001` `correctness`: Concurrent routed `full-auto` saves can lose earlier writes because canonical merge preparation reads and transforms the target document before `withSpecFolderLock()` is acquired. Gate C documents the opposite guarantee. Evidence: `iteration-05.md`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts:299-332`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1427-1563`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/003-gate-c-writer-ready/spec.md:134-136`

### P1
- `F-002` `correctness`: Resume precedence is freshness-first in code but handover-first in docs. The helper picks whichever of handover or continuity is newer, while bootstrap and packet prose still promise `handover.md -> _memory.continuity -> spec docs`. Evidence: `iteration-02.md`, `.opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts:601-605`, `.opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts:679-688`, `.opencode/skill/system-spec-kit/mcp_server/tests/resume-ladder.vitest.ts:187-214`
- `F-003` `docs`: Gate D still teaches a four-level ladder with archived fallback and D0 archive thresholds, but the live resume handler and tests hard-disable archived and legacy fallback. Evidence: `iteration-03.md`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/004-gate-d-reader-ready/spec.md:70-72`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:902-916`
- `F-004` `docs`: Gate E teaches parent-handover recovery via `../handover.md`, but the helper only checks `folderPath/handover.md`, so a phase-child resume will not consult the documented parent source. Evidence: `iteration-04.md`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/005-gate-e-runtime-migration/spec.md:27-29`, `.opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts:627-644`
- `F-005` `architecture`: The save mutex is process-local only. Because save workflows can originate from both slash-command and direct-script paths, cross-process `full-auto` saves remain unguarded. This is an inference from the implementation and save-entrypoint docs, not an observed production incident. Evidence: `iteration-06.md`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts:9-27`, `.opencode/skill/system-spec-kit/references/memory/save_workflow.md:17-21`, `.opencode/skill/system-spec-kit/references/memory/save_workflow.md:27-37`
- `F-006` `other`: Critical verification is still missing where the runtime is riskiest. The routed concurrent-save handler test is skipped, and Gate D canonical-filtering relies on TODO DB-backed assertions for archive and legacy suppression. Evidence: `iteration-07.md`, `iteration-08.md`, `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:2728-2732`, `.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-intent-routing.vitest.ts:459-474`

### P2
- `F-007` `docs`: The active parent packet points readers to a canonical research path that does not exist, so packet-local research discovery was broken before this run. Evidence: `iteration-01.md`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/spec.md:157-165`
- `F-008` `docs`: `004-memory-save-rewrite` still self-identifies as `014-memory-save-rewrite` in internal metadata and summaries, while the parent phase map uses `004`. That numbering split weakens search and packet-level traceability. Evidence: `iteration-09.md`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/004-memory-save-rewrite/spec.md:2-14`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/004-memory-save-rewrite/implementation-summary.md:44-49`

## Evidence Trail
- `iteration-02.md`: showed the core resume contradiction. The helper comment promises handover-first ordering, but the winner-selection branch promotes fresher continuity instead.
- `iteration-03.md`: established that Gate D docs still speak in archived-fallback language while `memory_context` returns `archivedTierEnabled: false`.
- `iteration-04.md`: connected Gate E's `../handover.md` story to the actual folder-local lookup in `resume-ladder.ts`.
- `iteration-05.md`: isolated the highest-risk correctness issue by following the exact routed save path from pre-lock doc read through post-lock promotion.
- `iteration-07.md` and `iteration-08.md`: showed that the most important concurrency and filtering guarantees are still partially verified or explicitly TODO.
- `iteration-01.md` and `iteration-09.md`: captured packet-level research and numbering drift that can mislead future synthesis or resume tooling.

## Recommended Fixes
- `[P0][save runtime]` Move canonical routed-save preparation under the folder lock, or re-run target-doc read plus merge generation after lock acquisition so the second writer always merges against current on-disk state. (`iteration-05.md#Findings`)
- `[P1][tests]` Unskip and harden a real routed concurrent-save integration test that exercises `buildCanonicalAtomicPreparedSave()` with two saves hitting the same target doc and different anchors. (`iteration-07.md#Findings`)
- `[P1][resume contract]` Choose one contract for resume precedence: either make runtime truly handover-first, or rewrite bootstrap, Gate D, and Gate E docs to the freshness-winner rule that is actually shipped. (`iteration-02.md#Findings`, `iteration-03.md#Findings`, `iteration-04.md#Findings`)
- `[P1][docs]` Update Gate D to the shipped three-level no-archive ladder, or restore the archived tier in code if that older design is still intended. (`iteration-03.md#Findings`)
- `[P1][docs/runtime]` Remove or implement the Gate E `../handover.md` rule. The current helper is folder-local, so parent-handover wording should not remain implicit. (`iteration-04.md#Findings`)
- `[P1][locking]` Decide whether cross-process canonical saves are supported. If yes, replace the in-memory mutex with an interprocess lock or lease; if not, document the single-process guarantee explicitly near the save contract. (`iteration-06.md#Findings`)
- `[P2][discoverability]` Repair the parent packet's research breadcrumb and normalize the `004-memory-save-rewrite` packet's internal numbering to the active flattened path, keeping any old `014` value as an alias only if needed. (`iteration-01.md#Findings`, `iteration-09.md#Findings`)

## Convergence Report
The investigation converged without early stop. New information stayed above the early-stop floor but dropped from `0.72` in Iteration 01 to `0.07` in Iteration 10. The most informative iterations were: (`deep-research-state.jsonl`, `iteration-05.md#Findings`, `iteration-02.md#Findings`, `iteration-03.md#Findings`, `iteration-07.md#Findings`, `iteration-08.md#Findings`)

- `Iteration 05`: exposed the concrete lost-update window in routed concurrent saves. (`iteration-05.md#Findings`)
- `Iteration 02`: established the handover-first versus freshness-first mismatch. (`iteration-02.md#Findings`)
- `Iteration 03`: showed that archived fallback is absent in code even though Gate D still documents it. (`iteration-03.md#Findings`)
- `Iterations 07-08`: confirmed that the riskiest save and filter behaviors are not fully covered by active tests. (`iteration-07.md#Findings`, `iteration-08.md#Findings`)

## Open Questions
- Should the next fix packet prioritize the P0 routed-save race before all doc cleanups, or can doc/runtime reconciliation land first without risking data loss? (`iteration-05.md#Findings`)
- Is cross-process canonical saving a supported deployment mode today, or only a theoretical exposure? (`iteration-06.md#Findings`)
- Does product intent still want parent-handover or archived-tier recovery, or have the docs simply drifted behind the simplified runtime? (`iteration-02.md#Findings`, `iteration-03.md#Findings`, `iteration-04.md#Findings`)
- Are there more flattened child packets in this parent tree that still carry stale pre-flatten numbering or research pointers? (`iteration-01.md#Findings`, `iteration-09.md#Findings`)

## References
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/003-gate-c-writer-ready/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/004-gate-d-reader-ready/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/005-gate-e-runtime-migration/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/004-memory-save-rewrite/spec.md`
- `.opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/atomic-index-memory.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/spec-folder-mutex.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/resume-ladder.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-context.resume-gate-d.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap-gate-d.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/atomic-index-memory.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/gate-d-regression-intent-routing.vitest.ts`
- `.opencode/skill/system-spec-kit/references/memory/save_workflow.md`
