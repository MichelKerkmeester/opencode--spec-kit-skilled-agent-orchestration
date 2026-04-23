# Deep Research — 001-research-and-baseline

## Summary
This 10-iteration rerun shows that the archived 2026-04-08 master synthesis is still directionally useful, but its blocker map is no longer current. Several formerly "missing" contracts now exist in shipped packets and runtime code: shared trust axes, planner-first memory-save, code-graph readiness primitives, Codex hook injection, and search-routing measurement scaffolding. The center of risk has shifted from concept discovery to operational acceptance, cross-runtime parity, and scan correctness. The most important stale assumptions are the archived hidden-prerequisite list and the implied equivalence between research convergence and operational completion. The strongest remaining open items are live `memory_index_scan` acceptance after packet 010, code-graph full-scan recovery, Copilot wrapper reapply, and live routing telemetry beyond predictive measurements.

## Scope
- Re-read the phase root docs: `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `checklist.md`, `decision-record.md`.
- Re-read nested child-packet docs under `001-claude-optimization-settings` through `006-research-memory-redundancy`.
- Archived the prior research corpus into `research/archive/v-pre-20260423/` and re-read the archived `research.md`, `deep-research-dashboard.md`, `deep-research-state.jsonl`, and `findings-registry.json`.
- Read sibling phase docs under `002-continuity-memory-runtime` through `010-memory-indexer-lineage-and-concurrency-fix` where they changed the old gap map.
- Inspected current runtime code for shared trust payloads, code-graph readiness, memory index/save fixes, routing, and Codex hook surfaces.
- Attempted CocoIndex semantic search for unfamiliar code paths; the MCP call returned `user cancelled MCP tool call`, so code inspection fell back to direct file reads and exact search.

## Key Findings
### P0
- **F-001 — The archived blocker map is stale enough to mis-sequence follow-on work.** The old corpus converged with 11 hidden prerequisites still framed as current blockers, but later packets shipped several of those contracts in code and packet truth. Continuing to prioritize strictly from the archived root without recalibration now risks treating shipped substrate as still-missing work. Evidence: `research/iterations/iteration-01.md#Findings`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/research/archive/v-pre-20260423/deep-research-dashboard.md:13-29`; `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:671-713`
- **F-002 — The main live blocker has shifted to operational acceptance around indexing and scan correctness.** Packet 010 lands the right save-path fixes, but the acceptance rerun is still pending; packet 003/003 ships scan-scope remediation but also records a 33-file regression and duplicate symbol IDs that require a recovery packet. Evidence: `research/iterations/iteration-04.md#Findings`; `research/iterations/iteration-07.md#Findings`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-lineage-and-concurrency-fix/implementation-summary.md:97-104`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/003-code-graph-context-and-scan-scope/implementation-summary.md:15-18`

### P1
- **F-003 — Search-routing efficacy is still not converged.** The measurement layer now exists, but the best current result is a predictive 112/200 top-1 static match rate, with live-session evidence still observe-only and one Codex configuration track blocked. Evidence: `research/iterations/iteration-05.md#Findings`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/007-deferred-remediation-and-telemetry-run/implementation-summary.md:48-64`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/007-deferred-remediation-and-telemetry-run/implementation-summary.md:117-123`
- **F-004 — Hook parity improved sharply, but cross-runtime parity is still reopened by config reverts.** Codex native hooks are implemented and live-verified, while Copilot wrapper schema and writer wiring are both marked reverted-needs-reapply. Evidence: `research/iterations/iteration-06.md#Findings`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/005-codex-hook-parity-remediation/implementation-summary.md:99-110`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/010-copilot-wrapper-schema-fix/implementation-summary.md:22-25`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/011-copilot-writer-wiring/implementation-summary.md:53-55`
- **F-005 — Trust-axis separation is now partly implemented, but the master narrative still talks about it like a future prerequisite.** Shared-payload validators, readiness mappings, and measurement-contract enforcement are live code, so the remaining work is consumer coverage and end-to-end acceptance rather than schema invention. Evidence: `research/iterations/iteration-02.md#Findings`; `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:684-713`; `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/readiness-contract.ts:93-157`; `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:30-37`

### P2
- **F-006 — The old continuity gap should be renamed.** Planner-first `/memory:save`, explicit follow-up APIs, and compact-wrapper guidance mean the old "missing Stop-summary artifact" framing is no longer accurate as stated; the residual question is now consumer-side live behavior and artifact shape. Evidence: `research/iterations/iteration-03.md#Findings`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/004-memory-save-rewrite/implementation-summary.md:57-69`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/002-memory-quality-remediation/implementation-summary.md:44-47`
- **F-007 — Prior iterations left the multi-plane routing architecture underexplored.** The current repo now has both a front-door subsystem ordering and an inner memory-search complexity router, but no single root artifact explains how those planes interact operationally. Evidence: `research/iterations/iteration-05.md#Findings`; `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:17`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:64-72`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:154-157`
- **F-008 — Convergence should be split into synthesis and operational modes.** The archived dashboard used one convergence label for a bundle that still had warning carryover, registry-promotion ambiguity, and later implementation drift. Evidence: `research/iterations/iteration-09.md#Findings`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/research/archive/v-pre-20260423/deep-research-dashboard.md:4-16`; `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/research/archive/v-pre-20260423/findings-registry.json:2-5`

## Evidence Trail
- `iteration-01.md`: "research convergence" in the archived corpus meant coverage closure, not clean operational closure; this is the basis for reclassifying the old blocker list as stale.
- `iteration-02.md`: trust-axis separation is no longer just a recommendation because the validator now rejects collapsed structural trust payloads.
- `iteration-03.md`: planner-first save plus compact-wrapper guidance changes the continuity question from "missing artifact" to "how should consumers use the artifact."
- `iteration-04.md`: the indexer story moved from abstract concern to a concrete acceptance tail around `fromScan`, `candidate_changed`, and rerun requirements.
- `iteration-05.md`: routing measurement now exists, but the strongest current signal is still predictive rather than live-behavior proof.
- `iteration-06.md`: Codex hook parity is real and verified, yet Copilot parity is currently a reapply problem rather than a design problem.
- `iteration-07.md`: code-graph enrichment landed, but scan correctness reopened through the 33-file regression and duplicate symbol IDs.
- `iteration-08.md`: foundational runtime hardening changed the substrate enough that several archived effort assumptions should now be recalibrated.
- `iteration-09.md`: the archived registry/dashboard bundle was good enough for synthesis, but not precise enough to serve as an operational completion ledger.
- `iteration-10.md`: what remains unexplored is mostly end-to-end live composition across packet trains, not discovery of new concept gaps.

## Recommended Fixes
- **[P0][root + 001 + sibling packets]** Replace the archived hidden-prerequisite table with a four-state ledger: `implemented`, `narrowed`, `reopened`, `still-open`. This packet should own the refresh because the old blocker map is now materially stale.
- **[P0][003/003 + 010 + 009]** Run a network-enabled live acceptance sweep: restart the MCP server, rerun `memory_index_scan` on `026/009-hook-daemon-parity`, and resolve the `003-code-graph-context-and-scan-scope` recovery packet before treating scan/index counts as authoritative.
- **[P1][009/010/011]** Reapply the Copilot wrapper schema and writer wiring, then rerun the cross-runtime smoke matrix so parity claims can be current rather than partly historical.
- **[P1][006/024]** Upgrade routing claims from predictive to live by completing the blocked Codex config step and capturing real wrapper telemetry before publishing stronger efficacy language.
- **[P1][docs + code]** Document the current dual routing planes explicitly: front-door subsystem dispatch versus inner memory-search channel routing. This is mainly a docs-and-tests clarity fix, not necessarily a code rewrite.
- **[P2][002 + 006]** Rename the old continuity gap from "missing Stop-summary artifact" to a current contract label that reflects planner-first save, follow-up freshness APIs, and compact-wrapper ownership.
- **[P2][research surfaces]** Split future convergence reporting into `synthesis_converged` and `operational_converged` so dashboards, registries, and later packet updates do not blur coverage with live acceptance.

## Convergence Report
This rerun converged on a clear answer after 10 iterations without early stop: the archived master packet is no longer wrong in direction, but it is stale in state. The biggest new information came from iterations 01, 02, 04, 06, and 07 because those iterations compared archived assumptions directly against newer implementation packets and runtime code. Later iterations mostly tightened classification boundaries rather than discovering new domains. The `newInfoRatio` trended from `0.58` to `0.06`, which is consistent with a diminishing-return pass that still found enough fresh drift to justify a full 10-iteration run. Confidence is high for packet-state drift, medium for runtime-operational conclusions that still depend on restart- or network-bound acceptance.

## Open Questions
- Which root or sibling packet should own the recommended `implemented / narrowed / reopened / still-open` roadmap refresh so the archived ordering stops serving as the default current-state map?
- After MCP restart and network-enabled reruns, does packet 010 actually clear `candidate_changed` and `E_LINEAGE` in the target live scan path?
- Once packet 003/003 recovery lands, what is the stable expected file count for a full Public code-graph scan, and which downstream packet should record it as the authoritative baseline?
- After packet 010 and 011 are reapplied, what runtime-specific gaps remain for Copilot compared with Codex, Claude, and Gemini?
- What level of live-session routing telemetry is sufficient to replace the current predictive 112/200 advisor score with a stronger compliance or efficacy claim?

## References
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/plan.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/tasks.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/checklist.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/decision-record.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/research/archive/v-pre-20260423/research.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/research/archive/v-pre-20260423/deep-research-dashboard.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/010-memory-indexer-lineage-and-concurrency-fix/`
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/readiness-contract.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts`
- `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/session-start.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts`
