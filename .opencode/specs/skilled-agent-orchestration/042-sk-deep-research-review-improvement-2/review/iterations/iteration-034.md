---
iteration: 34
dimension: maintainability
sessionId: rvw-2026-04-12T16-00-00Z
engine: copilot-gpt-5.4-high
phase: round-3-workflow-validation
startedAt: 2026-04-12T16:45:10Z
completedAt: 2026-04-12T16:50:20Z
---

# Deep Review Iteration 034 — maintainability (Round 3)

**Focus:** UPDATED WORKFLOW: Verify wave executor fixes. Check wave-segment-planner.cjs for composite hotspot scoring. Check wave-lifecycle.cjs for adjacent-transition matrix. Check wave-coordination-board.cjs for 5-key composite merge and board transition API. Check coverage-graph-core.cjs session normalization.

---

● skill(sk-deep-review)

I’m pulling the spec context and the four focus files together first so I can review the updated workflow as one system rather than as isolated patches.

● Read quick_reference.md
  │ .claude/skills/sk-deep-review/references/quick_reference.md
  └ 234 lines read

● List directory .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvemen…
  └ 20 files found

● Search (glob)
  │ "**/{wave-segment-planner.cjs,wave-lifecycle.cjs,wave-coordination-board.cjs,coverage-graph-core
  │ .cjs}"
  └ 4 files found

● Search (grep)
  │ "wave-segment-planner\.cjs|wave-lifecycle\.cjs|wave-coordination-board\.cjs|coverage-graph-core\
  │ .cjs" (.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2)
  └ 7 lines found

● memory_match_triggers (MCP: spec_kit_memory) · prompt: "Deep review iteration 34 maintainability …
  └ {"summary":"Matched 3 memories via trigger phrases","data":{"matchType":"trig...

I found the implementation files; next I’m cross-checking what the spec bundle says changed against how those helpers now fit together.

● Read implementation-summary.md
  │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/implementa
  │ tion-summary.md
  └ L1:260 (129 lines read)

● Read spec.md
  │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md
  └ L1:260 (260 lines read)

● Read fix-dispatch.sh
  │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/fix
  │ -dispatch.sh
  └ L1:220 (191 lines read)

● Search (grep)
  │ "wave executor|wave-segment-planner|wave-lifecycle|wave-coordination-board|coverage-graph-core|c
  │ omposite hotspot|adjacent-transition|5-key|session normalization" in *.{md,sh,json,yaml,yml}
  │ (.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2)
  └ 6 lines found

● code_graph_query (MCP: spec_kit_memory) · operation: "outline", subject: ".opencode/skill/system-…
  └ {"status":"ok","data":{"operation":"outline","filePath":".opencode/skill/syst...

● code_graph_query (MCP: spec_kit_memory) · operation: "outline", subject: ".opencode/skill/system-…
  └ {"status":"ok","data":{"operation":"outline","filePath":".opencode/skill/syst...

● code_graph_query (MCP: spec_kit_memory) · operation: "outline", subject: ".opencode/skill/system-…
  └ {"status":"ok","data":{"operation":"outline","filePath":".opencode/skill/syst...

● code_graph_query (MCP: spec_kit_memory) · operation: "outline", subject: ".opencode/skill/system-…
  └ {"status":"ok","data":{"operation":"outline","filePath":".opencode/skill/syst...

The spec and fix-dispatch line up on the same four maintainability targets, so I’m reading the actual helper implementations now and tracing how callers depend on them.

● Read wave-segment-planner.cjs
  │ .opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs
  └ L1:400 (400 lines read)

● Read wave-lifecycle.cjs
  │ .opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs
  └ L1:320 (320 lines read)

● Read wave-coordination-board.cjs
  │ .opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs
  └ L1:420 (420 lines read)

● Read coverage-graph-core.cjs
  │ .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs
  └ L1:320 (319 lines read)

● Search (grep)
  │ "computeHotspotSpread|assignCluster|allowed-transition|transition|merge|session
  │ normalization|normalizeSession|sessionId" in {wave-segment-planner.cjs,wave-lifecycle.cjs,wave-c
  │ oordination-board.cjs,coverage-graph-core.cjs} (.opencode/skill/system-spec-kit/scripts/lib)
  └ 7 lines found

● Read wave-segment-planner.cjs
  │ .opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs
  └ L400:760 (301 lines read)

● Read wave-lifecycle.cjs
  │ .opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs
  └ L320:620 (127 lines read)

● Read wave-coordination-board.cjs
  │ .opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs
  └ L420:760 (284 lines read)

● Read coverage-graph-core.cjs
  │ .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs
  └ L320:620 (53 lines read)

● Read coverage-graph-session.cjs
  │ .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-session.cjs
  └ L1:260 (129 lines read)

● Search (grep)
  │ "advanceBoardStatus\(|transitionBoardStatus\(|advancePhase\(|computeHotspotSpread\(|assignCluste
  │ r\(|matchesSession\(" in **/*.{cjs,ts,yaml,yml,md} (.opencode/skill/system-spec-kit)
  └ 7 lines found

● Search (grep)
  │ "matchesSession\(|normalizeSessionId\(|getNodeSessionId\(|getEdgeSessionId\(" in **/*.{cjs,ts}
  │ (.opencode/skill/system-spec-kit)
  └ 7 lines found

● Search (grep)
  │ "advanceBoardStatus\(|transitionBoardStatus\(" in **/*.{cjs,ts}
  │ (.opencode/skill/system-spec-kit)
  └ 41 lines found

● Search (grep)
  │ "advancePhase\(" in **/*.{cjs,ts} (.opencode/skill/system-spec-kit)
  └ 44 lines found

● Search (grep)
  │ "computeHotspotSpread\(|computeClusterDiversity\(|generateHotspotInventory\(|generateDomainLedge
  │ r\(" in **/*.{cjs,ts} (.opencode/skill/system-spec-kit)
  └ 7 lines found

● Read deep-loop-wave-executor.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-executor.vitest.ts
  └ L1:340 (301 lines read)

● Read deep-loop-wave-merge.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts
  └ L1:260 (260 lines read)

● Read session-isolation.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts
  └ L1:260 (260 lines read)

● Search (grep)
  │ "wave-coordination-board|wave-lifecycle|wave-segment-planner|coverage-graph-core"
  │ (.opencode/skill/system-spec-kit/scripts/tests)
  └ 10 files found

● Read deep-loop-wave-planner.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-planner.vitest.ts
  └ L1:320 (293 lines read)

● Read coverage-graph-core.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-core.vitest.ts
  └ L1:320 (257 lines read)

● Read coverage-graph-cross-layer.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-cross-layer.vitest.ts
  └ L1:260 (260 lines read)

● Read coverage-graph-signals.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/coverage-graph-signals.vitest.ts
  └ L1:260 (247 lines read)

● Search (grep)
  │ "createWaveContext\(|dispatchWave\(|joinWave\(" in **/*.{cjs,ts,md,yaml,yml}
  │ (.opencode/skill/system-spec-kit)
  └ 7 lines found

● Search (grep)
  │ "\.status\b|status: 'initialized'|phase: 'prepass'" in **/*.{cjs,ts,md,yaml,yml}
  │ (.opencode/skill/system-spec-kit)
  └ 7 lines found

● Read deep-loop-wave-resume.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-resume.vitest.ts
  └ L200:340 (83 lines read)

● Search (grep)
  │ "status" (.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs)
  └ 23 lines found

● Search (grep)
  │ "createWaveContext\(|dispatchWave\(|joinWave\(" in deep-loop-wave-*.vitest.ts
  │ (.opencode/skill/system-spec-kit/scripts/tests)
  └ 114 lines found

● Search (grep)
  │ "getNodes\(|getEdges\(|getEdgesFrom\(|getEdgesTo\(" in coverage-graph-*.cjs
  │ (.opencode/skill/system-spec-kit/scripts/lib)
  └ 23 lines found

● Search (grep)
  │ "normalizeSessionId\(|getNodeSessionId\(|getEdgeSessionId\(" in coverage-graph-*.cjs
  │ (.opencode/skill/system-spec-kit/scripts/lib)
  └ 74 lines found

● Search (grep)
  │ "traverseProvenance\(" in **/*.{cjs,ts,md} (.opencode/skill/system-spec-kit)
  └ 53 lines found

I found one broader pattern worth checking: the new session helper was added, but I’m verifying whether the neighboring coverage-graph libraries actually converged on it or only the core did.

● Read coverage-graph-contradictions.cjs
  │ .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs
  └ L1:240 (202 lines read)

● Search (grep)
  │ "coverage-graph-session\.cjs|getEdgeSessionId\(|getNodeSessionId\(|matchesSession\(" in
  │ coverage-graph-*.cjs (.opencode/skill/system-spec-kit/scripts/lib)
  └ 7 lines found

● Search (grep)
  │ "deriveBoardStatus\(|status\s*===\s*'completed'|status\s*===\s*'merging'" in
  │ **/*.{cjs,ts,md,yaml,yml} (.opencode/skill/system-spec-kit)
  └ 29 lines found

● Search (grep)
  │ "wave-join|sessionId \|\| 'wave-join'|generation: typeof firstResult\.generation" in
  │ **/*.{cjs,ts,md,yaml,yml} (.opencode/skill/system-spec-kit)
  └ 9 lines found

● Search (grep)
  │ "joinWave\(" in **/*.{cjs,ts,yaml,yml,md} (.opencode/skill/system-spec-kit)
  └ 40 lines found

● Search (grep)
  │ "dispatchWave\(" in **/*.{cjs,ts,yaml,yml,md} (.opencode/skill/system-spec-kit)
  └ 27 lines found

● Search (grep)
  │ "createCanonicalMergeBoard|wave-join" in **/*.{cjs,ts,yaml,yml,md}
  │ (.opencode/skill/system-spec-kit)
  └ 30 lines found

● Read wave-segment-state.cjs
  │ .opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs
  └ L330:390 (61 lines read)

● Search (grep)
  │ "FINDING_MERGE_KEYS|MERGE_KEYS|sessionId: firstState\.sessionId|wave-join"
  │ (.opencode/skill/system-spec-kit/scripts/lib/wave-segment-state.cjs)
  └ 38 lines found

● Read coverage-graph-convergence.cjs
  │ .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs
  └ L1:220 (220 lines read)

● Search (grep)
  │ "require\('./coverage-graph-contradictions\.cjs'\)|scanContradictions\(|reportContradictions\(|c
  │ ontradictionDensity\(" in coverage-graph-*.cjs (.opencode/skill/system-spec-kit/scripts/lib)
  └ 21 lines found

● Read coverage-graph-signals.cjs
  │ .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs
  └ L1:220 (220 lines read)

● Read spec.md
  │ .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-e
  │ xecutor/spec.md
  └ L1:260 (222 lines read)

● Search (grep)
  │ "board transition|coordination board|merge key|5-key|wave-join|status|completed|merging|session
  │ normalization" in *.md (.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-
  │ improvement-2/003-wave-executor)
  └ 6 lines found

I’ve narrowed this to three concrete maintainability problems: one around merge provenance, one around the board lifecycle surface, and one around incomplete session-helper adoption. I’m pulling tight line-level citations now.

● Read wave-lifecycle.cjs
  │ .opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs
  └ L400:408 (9 lines read)

● Read wave-lifecycle.cjs
  │ .opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs
  └ L208:225 (18 lines read)

● Read wave-lifecycle.cjs
  │ .opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs
  └ L261:283 (23 lines read)

● Read wave-coordination-board.cjs
  │ .opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs
  └ L143:191 (48 lines read)

● Read wave-coordination-board.cjs
  │ .opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs
  └ L215:237 (23 lines read)

● Read wave-coordination-board.cjs
  │ .opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs
  └ L453:507 (55 lines read)

● Read coverage-graph-session.cjs
  │ .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-session.cjs
  └ L15:85 (71 lines read)

● Read coverage-graph-contradictions.cjs
  │ .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs
  └ L37:60 (24 lines read)

● Read coverage-graph-signals.cjs
  │ .opencode/skill/system-spec-kit/scripts/lib/coverage-graph-signals.cjs
  └ L11:16 (5 lines read)

● Read deep-loop-wave-merge.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/deep-loop-wave-merge.vitest.ts
  └ L140:160 (21 lines read)

## Findings

### F-034-001
- **Severity:** P1
- **Dimension:** Maintainability
- **File:** `.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs`; `.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs`
- **Line:** `wave-lifecycle.cjs:208-225, 261-273, 400-407`; `wave-coordination-board.cjs:215-221`
- **Title:** `joinWave()` still makes the 5-key merge namespace implicit
- **Description:** The wave lifecycle now depends on a 5-key composite merge contract, but `dispatchWave()` does not carry that namespace on each dispatch result, and `joinWave()` silently reconstructs it from the first result or hard-coded defaults. Because `buildFindingRecord()` stamps merge keys from the merge board rather than from each result, the API only stays correct when callers remember an undocumented precondition: every result passed into `joinWave()` must already be enriched with canonical session/generation metadata.
- **Evidence:** `dispatchWave()` emits dispatch records with `dispatchId`, `waveId`, `segmentId`, `segmentIndex`, `status`, timestamps, `result`, and `error`, but no per-record `sessionId`/`generation`/`loopType` fields (`wave-lifecycle.cjs:208-225`). `joinWave()` then creates a board from `firstResult.sessionId || 'wave-join'` and `firstResult.generation || 1` (`wave-lifecycle.cjs:400-407`) and passes that board into `buildFindingRecord()` (`wave-lifecycle.cjs:261-273`), where the canonical merge keys are sourced from `board.sessionId` and `board.generation` (`wave-coordination-board.cjs:215-221`).
- **Recommendation:** Make the merge namespace explicit at the API boundary: either require `sessionId`, `generation`, and `loopType` on every result passed to `joinWave()`, or require a separate canonical namespace argument and reject fallback values like `'wave-join'`.

### F-034-002
- **Severity:** P1
- **Dimension:** Maintainability
- **File:** `.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs`
- **Line:** `143-190, 347-444, 453-507`; supporting evidence in `scripts/tests/deep-loop-wave-merge.vitest.ts:146-157`
- **Title:** The new board-transition API is not wired into the normal board lifecycle
- **Description:** The module now exposes an authoritative transition API, but the normal `updateBoard()` path never reaches a terminal `completed` state on its own. That leaves `board.status` stuck at `merging` after all segments are terminal unless some external caller knows to perform a second status transition, which makes the "authoritative" API easy to forget and hard to use safely.
- **Evidence:** `updateBoard()` always routes status changes through `advanceBoardStatus(board, deriveBoardStatus(board))` (`wave-coordination-board.cjs:188-190`). But `deriveBoardStatus()` only returns `planning`, `executing`, or `merging`; when every segment is terminal, it still returns `merging` (`wave-coordination-board.cjs:467-473`). `renderDashboard()` prints `board.status` directly as the canonical status surface (`wave-coordination-board.cjs:497-507`). The explicit transition API is exercised in the test (`deep-loop-wave-merge.vitest.ts:146-157`), but I found no shipped runtime caller outside the board module itself.
- **Recommendation:** Either finalize to `completed` inside `updateBoard()` once merge inputs are fully applied, or add a single exported `finalizeBoard()` path that runtime workflows must call so terminal board state is not a test-only behavior.

### F-034-003
- **Severity:** P2
- **Dimension:** Maintainability
- **File:** `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs`
- **Line:** `37-60`; comparison points in `coverage-graph-session.cjs:19-85` and `coverage-graph-signals.cjs:11-15`
- **Title:** Session normalization is centralized in name only
- **Description:** The session-normalization fix landed as a shared helper, but `coverage-graph-contradictions.cjs` still carries its own private `getNodeSessionId()`, `getEdgeSessionId()`, and `matchesSession()` logic. That leaves the CJS graph stack split between shared and local implementations, so future session-rule changes have to be kept in sync manually and contradiction scans can drift from the rest of the stack.
- **Evidence:** `coverage-graph-session.cjs` trims and normalizes requested and actual session IDs before comparison (`coverage-graph-session.cjs:19-85`), and `coverage-graph-signals.cjs` already imports that shared helper (`coverage-graph-signals.cjs:11-15`). By contrast, `coverage-graph-contradictions.cjs` reimplements the same functions with raw string checks and a direct `===` comparison on `sessionId` (`coverage-graph-contradictions.cjs:37-60`).
- **Recommendation:** Replace the local contradiction helper functions with imports from `coverage-graph-session.cjs` and add a parity test that exercises contradiction scanning with whitespace-padded session IDs.

## Iteration Summary

**Result:** 3 maintainability findings (`0x P0`, `2x P1`, `1x P2`).

The named fixes themselves mostly landed correctly: the composite hotspot scoring path in `wave-segment-planner.cjs` looks coherent, and the adjacent-transition matrix in `wave-lifecycle.cjs` is enforced as intended. The remaining debt is in the glue around those fixes: merge provenance is still implicit, the board lifecycle surface is not fully wired, and session-helper consolidation is incomplete.

## Coverage Assessment

Reviewed:
- Packet context:  
  `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/spec.md`  
  `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/implementation-summary.md`  
  `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/review/fix-dispatch.sh`  
  `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/003-wave-executor/spec.md`
- Focus files:  
  `.opencode/skill/system-spec-kit/scripts/lib/wave-segment-planner.cjs`  
  `.opencode/skill/system-spec-kit/scripts/lib/wave-lifecycle.cjs`  
  `.opencode/skill/system-spec-kit/scripts/lib/wave-coordination-board.cjs`  
  `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs`
- Tightly coupled support files/tests:  
  `coverage-graph-session.cjs`, `coverage-graph-contradictions.cjs`, `coverage-graph-signals.cjs`  
  `deep-loop-wave-planner.vitest.ts`, `deep-loop-wave-executor.vitest.ts`, `deep-loop-wave-merge.vitest.ts`, `deep-loop-wave-resume.vitest.ts`, `coverage-graph-core.vitest.ts`, `coverage-graph-cross-layer.vitest.ts`, `coverage-graph-signals.vitest.ts`, `session-isolation.vitest.ts`

**No new maintainability issue found** in:
- `wave-segment-planner.cjs:559-620` composite hotspot scoring path
- `wave-lifecycle.cjs:45-53, 310-358` adjacent-transition matrix enforcement
- `wave-coordination-board.cjs:60-66, 615-631` 5-key composite key construction itself

## Confidence

**High.** I reviewed the named focus files plus the supporting test and helper surfaces that define how the new workflow is actually used. The two P1 findings are line-level, behaviorally grounded, and tied directly to the updated wave-executor changes.

## Next Priorities

1. Make wave merge namespace explicit and fail-closed instead of synthesizing `wave-join`.
2. Wire a single canonical completion/finalization path for `board.status`.
3. Finish the session-helper consolidation by moving contradiction filtering onto `coverage-graph-session.cjs`.


Changes   +0 -0
Requests  1 Premium (5m 8s)
Tokens    ↑ 2.1m • ↓ 16.6k • 1.9m (cached) • 9.6k (reasoning)
