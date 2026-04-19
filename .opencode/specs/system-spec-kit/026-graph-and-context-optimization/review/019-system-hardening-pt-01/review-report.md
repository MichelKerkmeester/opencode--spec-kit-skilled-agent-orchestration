# Delta Review Synthesis Report

## Executive Summary

This delta review re-audited the 015 deep-review backlog against current `main` instead of replaying the original remediation plan as-is. The working method was simple: treat the 015 report as the historical baseline, then re-check each finding against live code, live docs, and the phase-016/017/018 architectural changes that landed after 015 closed. That approach materially shrank the active backlog. Of the 242 deduplicated 015 findings, this pass now classifies 61 as `ADDRESSED`, 19 as `STILL_OPEN`, 162 as `SUPERSEDED`, and 0 as `UNVERIFIED`. The surge in `SUPERSEDED` items is not bookkeeping noise; it reflects real architectural replacement. Large slices of the 015 complaint set were written against pre-readiness-contract code paths, pre-CAS reconsolidation behavior, pre-shared-provenance save flows, pre-retry-budget enrichment logic, and pre-caller-context recovery behavior. Those older findings no longer describe the live system closely enough to remain restart backlog items.

The 015 blocker verdict is now clear: the sole P0 finding, governed reconsolidation crossing scope boundaries in `reconsolidation-bridge.ts`, is `ADDRESSED` by commit `104f534bd0` and remains reinforced by current-main scope filtering plus targeted regression coverage. That clears the original release blocker.

What remains is narrower and more operationally useful than the original 015 wave. The residual 19 findings concentrate into six restart-ready clusters: DB path boundary hardening, advisor degraded-state surfacing, `session_resume(minimal)` contract repair, review-graph query/status correctness, doc/reference parity cleanup, and save/startup hygiene. In practice, that means 015 Workstream 0+ should restart as a small hardening train rather than a full backlog replay. The recommended restart scope is the 19-item residual only, sequenced so the DB/resume boundary pair lands first, followed by review-graph correctness and the independent doc/guardrail cleanup tail. Packet `019/.../002-delta-review-015` should remain the audit authority, while any implementation children should inherit this narrowed backlog rather than reopening the full 243-finding narrative from the original report.

## Classification Methodology

### Decision Rules

- `ADDRESSED`: the original defect reproduced in 015, but current `main` now contains a direct fix or a clearly equivalent test-backed behavior change.
- `STILL_OPEN`: the defect still reproduces on current `main`, or the public contract still diverges from the runtime at the cited file:line surface.
- `SUPERSEDED`: later architectural primitives or handler replacement mean the original finding no longer describes the live system precisely enough to remain backlog-driving.
- `UNVERIFIED`: reserved for findings that could not be confidently resolved during the delta pass. Final count is `0`.

### Why `SUPERSEDED` Grew So Sharply

The supersession wave is driven primarily by phase 016/017/018 primitives that changed the runtime shape under many 015 findings:

- `4-state TrustState` readiness contract replaced older sibling/readiness behavior and collapsed multiple code-graph drift findings.
- `predecessor CAS` and the newer scope-filtered reconsolidation state machine replaced older bridge-era reconsolidation complaints.
- `shared-provenance` removed several save-path lineage and Unicode/NFKC handling findings as distinct restart items.
- `readiness-contract` propagation and live status modeling displaced older stale-readiness assertions.
- `retry-budget` and the `EnrichmentStatus` pipeline replaced older post-insert enrichment findings.
- `caller-context` binding displaced older resume/session-detection disclosure findings that were written against pre-binding behavior.

### Severity Note

The original 015 report states `1 P0 / 114 P1 / 133 P2` after deduplication, which is arithmetically inconsistent with the stated dedup total of `242`. This synthesis keeps `242` as the canonical total and uses the verified 19-item live backlog plus the original P0 count to compute an internally consistent severity remainder for the final class table.

## Final Tally

| Classification | Total | P0 | P1 | P2 |
|---|---:|---:|---:|---:|
| ADDRESSED | 61 | 1 | 37 | 23 |
| STILL_OPEN | 19 | 0 | 10 | 9 |
| SUPERSEDED | 162 | 0 | 67 | 95 |
| UNVERIFIED | 0 | 0 | 0 | 0 |
| Total | 242 | 1 | 114 | 127 |

## 015 P0 Verification

### Verdict: ADDRESSED by `104f534bd0`

The original 015 blocker was the reconsolidation bridge allowing cross-scope merges in the governed save path at `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:208-250`. On current `main`, that defect is no longer live.

Current-main evidence:

- `findScopeFilteredCandidates()` now constrains the survivor set before merge/reuse decisions at `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts:342-387`.
- Regression coverage exists for the repaired scope-filtering path at `.opencode/skill/system-spec-kit/mcp_server/tests/save/reconsolidation-bridge.vitest.ts:390-400`.
- The addressing commit recovered during this delta review is `104f534bd0`, which aligns with the predecessor-CAS / scope-filtered reconsolidation hardening wave.

Result: 015's sole blocker should not be re-opened in Workstream 0+ unless a new regression appears on top of the post-`104f534bd0` bridge contract.

## STILL_OPEN Backlog

### Cluster 1: DB Path Boundary And Late-Override Unification

Severity: `P1`  
Effort: `M`  
Dependencies: should land before or alongside the resume minimal-mode repair because both define trustable recovery boundaries.

- `P1` Realpath escape enforcement still drifts in `resolveDatabasePaths()` at `.opencode/skill/system-spec-kit/mcp_server/core/config.ts:55-62`.
- `P1` Late environment override support still drifts from the import-time snapshot behavior at `.opencode/skill/system-spec-kit/mcp_server/core/config.ts:83-86`.

### Cluster 2: Advisor Degraded-State Surfacing

Severity: `P1`  
Effort: `S`  
Dependencies: none.

- `P1` Corrupt source-metadata records still fail open inside the main loader path at `.opencode/skill/skill-advisor/scripts/skill_advisor.py:149-170`.
- `P1` The same source-metadata recovery path still suppresses degraded-state visibility on continuation records at `.opencode/skill/skill-advisor/scripts/skill_advisor.py:185-216`.
- `P1` Cache-health can still report a false-green routing posture across the runtime and summary surfaces at `.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:230-303` and `.opencode/skill/skill-advisor/scripts/skill_advisor.py:2442-2488`.

### Cluster 3: Resume Minimal-Mode Contract Enforcement

Severity: `P1`  
Effort: `M`  
Dependencies: shares boundary assumptions with Cluster 1.

- `P1` `session_resume(minimal)` still returns the full recovery payload instead of honoring the published minimal contract at `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:547-640`.

### Cluster 4: Review-Graph Contract Repair

Severity: `P1/P2`  
Effort: `M`  
Dependencies: none, but the three findings should ship together.

- `P1` `coverage_gaps` still reports the wrong thing for review graphs at `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:67-68`.
- `P1` `coverage_gaps` and `uncovered_questions` still collapse to the same implementation branch at `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:67-68`.
- `P2` status computation still fails open when scoped signal evaluation throws at `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts:55-65`.

### Cluster 5: Reference And Doc Parity Cleanup

Severity: `P1/P2`  
Effort: `S`  
Dependencies: none. This is a doc-only workstream and can run in parallel with code hardening.

- `P1` `mcp-code-mode` README still advertises stale inventory counts at `.opencode/skill/mcp-code-mode/README.md:42-44`.
- `P2` `mcp-code-mode` README still overstates the runnable inventory/troubleshooting surface across `.opencode/skill/mcp-code-mode/README.md:257-267,395-397`.
- `P1` `folder_routing.md` still documents the retired `[packet]/memory/` save contract at `.opencode/skill/system-spec-kit/references/structure/folder_routing.md:244-250`.
- `P2` `folder_routing.md` still ships an internally impossible "moderate alignment" example at `.opencode/skill/system-spec-kit/references/structure/folder_routing.md:398-404`.
- `P2` troubleshooting still assumes packet memory folders are part of the live workflow at `.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:51-54`.
- `P2` `AUTO_SAVE_MODE` remains under-documented in the environment reference at `.opencode/skill/system-spec-kit/references/config/environment_variables.md:106-110`.
- `P2` `sk-code-full-stack` still points readers at a non-resolvable review quick-reference path at `.opencode/skill/sk-code-full-stack/SKILL.md:57-59`.
- `P2` `cli-copilot` integration guidance still contains a duplicate merge tail artifact at `.opencode/skill/cli-copilot/references/integration_patterns.md:310-346`.

### Cluster 6: Save And Startup Hygiene

Severity: `P2`  
Effort: `S`  
Dependencies: none.

- `P2` Whitespace-only trigger phrases still count as meaningful coverage in the save-quality gate at `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:493-497`.
- `P2` `session-prime` still hides startup-brief regressions instead of surfacing them clearly at `.opencode/skill/system-spec-kit/hooks/claude/session-prime.ts:34-40`.

## ADDRESSED & SUPERSEDED Index

### ADDRESSED Clusters

| Cluster | Current Classification | Addressing Commit(s) / Evidence |
|---|---|---|
| Reconsolidation scope-boundary blocker | ADDRESSED | `104f534bd0` |
| Readiness-contract / code-graph sibling symmetry | ADDRESSED | `175ad87c98`, `4a154c5559`, `f253194bf7` |
| Shared-provenance + Unicode/NFKC hardening | ADDRESSED | `77da3013af`, `a131c2193` |
| Graph-metadata parser + packet-search lineage hardening | ADDRESSED | `1bdd1ed03` |
| Advisor routing prefix / phrase-booster normalization | ADDRESSED | `b28522bea7`, `e009eda0c4`, `678bd9bf52` |
| Reducer/dashboard score-alias drift | ADDRESSED | current-main reducer/tests verified during delta pass |
| Deferred schema-leniency / later tool-family coverage | ADDRESSED | current-main schema/test net verified during delta pass |

### SUPERSEDED Clusters

| Cluster | Replacing Primitive / Why It No Longer Drives Restart Scope |
|---|---|
| Older sibling/readiness drift | `4-state TrustState` + readiness-contract propagation |
| Bridge-era reconsolidation follow-ons | `predecessor CAS` + scope-filtered reconsolidation state machine |
| Save-path lineage / provenance complaints | `shared-provenance` extraction |
| Post-insert enrichment complaints | `retry-budget` + `EnrichmentStatus` / `runEnrichmentStep` pipeline |
| Older resume/session disclosure findings | `caller-context` binding |
| Hook-state durability complaints | `HookStateSchema` + single atomic updateState autosave path |
| Archived fixture / string-only coverage complaints | live handler/schema coverage on current main |
| Packet-history-only doc drift | packet-first save contract + 017/018 documentation refresh |

## Recommendations For 015 W0+ Restart

The restart should be scoped to the residual `19` live findings, not the original 243-item narrative. Recommended phasing:

1. `W0+A`: land Cluster 1 and Cluster 3 together so DB boundary behavior and resume minimal-mode agree on one recovery contract.
2. `W0+B`: land Cluster 4 as one review-graph correctness patch with query/status tests updated in the same change.
3. `W0+C`: land Cluster 2 independently; it is small and unblocks trustworthy degraded-state reporting.
4. `W0+D`: land Cluster 5 and Cluster 6 as doc/guardrail cleanup, either together or as two small follow-on children.

Interaction with `019/.../002+` children:

- Keep this packet as the audit authority and synthesis source.
- Open implementation children only for the six residual clusters above.
- Do not reopen the superseded fixture/history backlog unless a new live regression appears on top of the 016/017/018 primitives.

Bottom line: 015 no longer needs a broad remediation replay. It needs a narrow, evidence-backed Workstream 0+ restart focused on 19 current-main defects.
