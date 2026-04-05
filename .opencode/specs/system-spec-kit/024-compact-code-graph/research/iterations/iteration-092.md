# Iteration 92: Cross-reference scorecard for verification wave (076-091)

## Focus
Compile a single verification scorecard across iterations 076-091 (with iteration 090 still missing locally), separate what held up from what narrowed or failed, and close the remaining review gap by re-checking P1-7 through P1-9 against current source.

## Method
I re-read iterations 076-091, excluding 090 because the markdown artifact is still absent locally, then re-checked the live source for the three unverified review findings in:

- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts`

For the tally below, I counted **top-level adjudicated claims only** from the explicit verification iterations (`076-083`, `088`, `089`, `091`) plus the three review checks completed here for `092`. I treated `084-087` as **new verification-wave discoveries / runtime-deepening passes**, not as prior-claim verdict rows, so the aggregate does not mix brand-new design findings with old-claim adjudication.

[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-076.md:1-77]
[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-077.md:1-93]
[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-078.md:1-131]
[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-079.md:1-135]
[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-080.md:1-121]
[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-081.md:1-197]
[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-082.md:1-173]
[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-083.md:1-82]
[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-088.md:1-64]
[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-089.md:1-123]
[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-091.md:1-109]

## Consolidated Verdict Tally

### Per-iteration scorecard

| Iteration | Scope | Confirmed | Modified | Refuted | False positive |
| --- | --- | ---: | ---: | ---: | ---: |
| 076 | Q13 core findings | 3 | 1 | 0 | 0 |
| 077 | Q14 auto-enrichment claims | 1 | 4 | 0 | 0 |
| 078 | Q15 runtime-parity claims | 1 | 5 | 0 | 0 |
| 079 | Q16 CocoIndex/code-graph implementation claims | 1 | 1 | 5 | 0 |
| 080 | Phase A/B file-list and LOC estimates | 1 | 4 | 0 | 0 |
| 081 | Testing-strategy verification | 3 | 3 | 0 | 0 |
| 082 | Performance narrative verification | 0 | 4 | 2 | 0 |
| 083 | Error-recovery verification | 3 | 3 | 0 | 0 |
| 088 | Review P1-1 through P1-3 | 2 | 0 | 0 | 1 |
| 089 | Review P1-4 through P1-6 | 3 | 0 | 0 | 0 |
| 091 | Review P1-10 + key P2s | 5 | 0 | 0 | 0 |
| 092 | Review P1-7 through P1-9 | 3 | 0 | 0 | 0 |
| **Total** | **59 top-level adjudicated claims** | **26** | **25** | **7** | **1** |

### Aggregate interpretation
- **Confirmed (26 / 59, 44.1%)**: the strongest correctness findings held up, especially the structural-indexer defects, review P1 findings 1-2 and 4-10, and the review-aligned security/correctness findings from iteration 091.
- **Modified (25 / 59, 42.4%)**: most drift came from research that correctly identified a useful architecture or implementation seam, but described it too much like current shipped behavior. This was especially common in Q14-Q16, the Phase B wiring plan, testing-roadmap sizing, and the performance/error-recovery narratives.
- **Refuted (7 / 59, 11.9%)**: the outright misses clustered around Q16 "already implemented" assumptions and the stronger performance claims from iteration 082's target set.
- **False positive (1 / 59, 1.7%)**: only review P1-3 failed to match the current code; the claimed `isAutoSurface` stop-hook guard does not exist in the present implementation.

## What Stayed Valid
The verification wave strongly reinforces the original correctness core from Segment 6 and the deep review:

1. The `endLine` collapse bug is still live, still shrinks nodes to one line, and still degrades both multi-line `CALLS` extraction and enclosing-symbol seed resolution.[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-076.md:12-22][SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-089.md:26-47]
2. Missing graph vocabulary remains real: the three extra `EdgeType` values are still absent, the three ghost `SymbolKind`s are still ghost kinds, and JS/TS methods are still never emitted by `parseJsTs()`.[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-076.md:23-44][SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/review/iterations/iteration-003.md:38-44]
3. The review-correctness wave also held: the stop hook still reuses `pendingCompactPrime` as a surrogate auto-save slot, persistence failures in `hook-state.ts` still look like success to callers, `code_graph_scan` still trusts caller-controlled `rootDir`, compact-recovery freshness is still unchecked on reuse, cache buckets are still omitted from surfaced totals/costs, and internal exception text still crosses the MCP boundary.[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-088.md:21-31][SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-089.md:12-20][SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-091.md:14-65]

## What Narrowed or Broke
Most of the modified/refuted claims share one pattern: the underlying design direction was useful, but the wording outran the shipped code.

1. Q14/Q15/Q16 findings were often **architecturally right but implementation-overstated**. The runtime layering, first-call priming, graph-aware dispatch, hybrid search, stale-triggered reindex, and blended-confidence ideas remain good designs, but they are mostly not in the current product.[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-077.md:8-63][SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-078.md:8-97][SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-079.md:8-97]
2. The Phase A/B roadmap still points at the right area, but the live Phase B seam is more `context-server.ts`-centric than the original research implied.[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-080.md:31-45]
3. The testing roadmap still needs more graph coverage, but the current MCP server suite is much larger and more overlapping than iteration 069 assumed, so the revised plan is "3 clearly new files plus targeted extensions," not "6 entirely new suites."[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-081.md:8-25][SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-081.md:141-154]
4. The performance story from Segment 6 mixed measured constants with projected pipeline behavior. `HOOK_TIMEOUT_MS` is still `1800`, but the live timeout only wraps stdin parsing, and the richer graph/CocoIndex latency figures are not instrumented facts in the present hook path.[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-082.md:15-31][SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-082.md:82-113]
5. The error-recovery research also needed scope correction: `code-graph-db.ts` still lacks local recovery and busy handling, but the broader repo now has top-level request error boundaries and `SQLITE_BUSY` retry logic in other subsystems.[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-083.md:8-27]

## New Findings Discovered During Verification (Not in the Original Segment 6 Research)
These are the most important net-new discoveries that emerged only during the verification wave, not from the original research answers themselves:

1. **`context-server.ts` is the missing Phase B integration seam.** The original implementation roadmap did not emphasize that the real dispatch interception point lives in the request orchestration layer, not only in `memory-surface.ts`.[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-080.md:31-45]
2. **The MCP server test suite is now far larger and more reusable than expected (349 Vitest files).** That changes the rollout cost model: many runtime/session/auto-surface patterns already exist and should be extended instead of duplicated.[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-081.md:8-25][SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-081.md:141-154]
3. **The PreCompact timeout does not protect the full hook body.** `withTimeout(HOOK_TIMEOUT_MS)` guards only `parseHookStdin()`, not transcript read, merge, truncation, or state write.[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-082.md:15-31]
4. **Repo-wide recovery is stronger than the code-graph-specific research implied.** `context-server.ts` catches handler/tool failures at the top level, and `SQLITE_BUSY` retry logic already exists elsewhere in the MCP server even though the code-graph DB path still lacks it.[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-083.md:8-27]
5. **OpenCode/Codex/Copilot/Gemini parity depends on very different control surfaces.** OpenCode needs a reusable Session Start Protocol plus a resume-workflow insertion at `workflow.step_2_load_memory`; Codex should enforce startup via `CODEX.md` plus `@context`; Copilot's universal behavior belongs in auto-loaded instruction files rather than optional custom agents.[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-084.md:45-49][SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-085.md:28-93][SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-086.md:55-121]
6. **Earlier Copilot assumptions were stale.** The repo has no `.github/copilot/` directory, and the real Copilot CLI startup surface is `AGENTS.md` / `.github/copilot-instructions.md` / `.github/instructions/**/*.instructions.md`, not optional markdown agent files alone.[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-086.md:17-25][SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-086.md:55-68]
7. **Gemini should no longer be modeled as simply "hookless."** The repo still lacks `.gemini/settings.json`, but upstream Gemini CLI now supports hierarchical `GEMINI.md` loading and native hooks, so its parity ceiling is much higher than the original non-Claude-runtime framing implied.[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-087.md:41-69][SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-087.md:71-128]
8. **Two externally visible issues surfaced outside the original Segment 6 scope:** the startup Working Memory branch is effectively unreachable because no in-repo producer writes `workingSet`, and both `memory_context` and `code_graph_context` still reflect raw internal exception text back to callers.[SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-091.md:32-40][SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/research/iterations/iteration-091.md:56-65]

## Verification of Review P1 Findings 7-9

### P1-7: Stale inbound edges after re-indexing
**Verdict: CONFIRMED**

The review finding still matches current code. `replaceNodes(fileId, nodes)` deletes the file's prior nodes, but `replaceEdges(sourceIds, edges)` deletes only edges whose `source_id` belongs to the newly indexed file. During a normal incremental scan, `handleCodeGraphScan()` calls `upsertFile()` -> `replaceNodes()` -> `replaceEdges()` and never calls `cleanupOrphans()` afterward. That means inbound edges from unchanged files can continue to point at removed symbol IDs until a later cleanup pass happens.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:127-169][SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-db.ts:283-297][SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts:47-74][SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/review/iterations/iteration-003.md:30-36]

### P1-8: JavaScript/TypeScript methods never indexed
**Verdict: CONFIRMED**

`parseJsTs()` still recognizes top-level functions, const-assigned arrows, classes, interfaces, types, enums, imports, and exports, but it has no branch that emits `kind: 'method'` for JS/TS class bodies. Meanwhile, `extractEdges()` still expects `method` nodes for `CONTAINS` edges. The mismatch remains unchanged, so JS/TS class methods are still missing from the primary-language graph surface.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:29-107][SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/structural-indexer.ts:210-223][SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/review/iterations/iteration-003.md:38-44]

### P1-9: Spec/checklist overstate the "3-source hook merge"
**Verdict: CONFIRMED**

The nuance remains the same as the earlier D3 review: the hook *does* call `mergeCompactBrief()`, but the inputs are still not a real retrieval-backed Memory + Code Graph + CocoIndex merge. `constitutional` and `triggered` are still hardcoded to empty strings, `codeGraph` is built from transcript-derived active file paths, and `cocoIndex` is still only a literal advisory sentence telling the agent to run CocoIndex later. So the review finding stands: the docs overstate what the current hook path actually does.[SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts:141-203][SOURCE: .opencode/specs/system-spec-kit/024-compact-code-graph/review/iterations/iteration-004.md:7-11]

## Consolidated Scorecard
- **Still-valid core**: structural correctness bugs and most review P1 findings remain real.
- **Main correction theme**: many Segment 6 runtime/performance/integration findings are best kept as **design backlog** rather than described as present shipped behavior.
- **Missing artifact**: iteration 090 is still absent locally, but the remaining wave is now cross-referenced end-to-end.
- **Net result**: the verification wave increases confidence in the bug backlog, while substantially tightening the implementation-status wording for the runtime/parity and hybrid-search roadmap.

## Assessment
- `newInfoRatio`: 0.43
- Summary: This was primarily a synthesis pass, but it still closed the remaining review gap by verifying P1-7 through P1-9 directly against live code. The biggest value is the aggregate scorecard: the correctness backlog mostly survived intact, while the largest drift came from proposal-vs-implementation wording in the Segment 6 runtime, performance, and hybrid-search research.

## Reflection
- What worked and why: Re-reading the verification wave as a whole made the pattern obvious: correctness findings were durable, while implementation-plan and parity research needed repeated "design vs shipped" separation. Treating 084-087 as new-discovery passes instead of forcing them into the old-claim tally kept the scorecard cleaner.
- What did not work and why: iteration 090 is still missing, so the review wave still has one documentation gap even though the live-code gap for P1-7 through P1-9 is now closed.
- What I would do differently: If there is a final synthesis iteration, I would preserve this exact counting method (top-level adjudicated claims only) so later scorecards remain comparable instead of drifting in granularity.

## Recommended Next Focus
Use this scorecard as the basis for the final Segment 7 synthesis and roadmap rewrite:
1. Keep the confirmed correctness/review backlog as active implementation work.
2. Rewrite the Q14-Q16 and cross-runtime sections so they explicitly distinguish **implemented**, **partially implemented**, and **design-only** behavior.
3. Decide whether the runtime-parity plan should treat Gemini as a near-Claude target or keep it in the instruction-only bucket for the first release.
