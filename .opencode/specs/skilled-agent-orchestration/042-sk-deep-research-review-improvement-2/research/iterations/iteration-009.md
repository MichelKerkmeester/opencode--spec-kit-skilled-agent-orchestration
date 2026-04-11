# Iteration 9: D2 Scale Reducer Stress Audit

## Focus
This iteration stayed on D2 and stress-tested the live `sk-deep-review` reducer with a disposable 60-bullet synthetic packet spread across four iterations. The goal was to verify whether Map-by-`findingId` dedup and severity transition histories stay stable at 50+ findings, and whether blocked-stop recovery evidence is still lost once the packet is large enough that operators would depend on reducer-owned summaries.

## Findings
- A disposable 4-iteration harness with 60 finding bullets and 34 unique finding IDs still collapsed cleanly to 33 open findings plus 1 resolved finding, which matches the reducer's `Map`-based merge design and shows that repeated IDs do not explode the registry at this scale (`.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:236-295`).
- Transition ordering remained stable under the scaled packet because the reducer walks sorted iteration files once and appends severity changes in encounter order. In the harness, upgrade/downgrade chains for `F001`, `F010`, and `F020` were preserved as ordered histories rather than being reordered or duplicated (`.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:239-267`, `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:629-634`).
- The `repeatedFindings` surface is stable but coarse at scale: it classifies any open finding with `lastSeen - firstSeen >= 1` as repeated, so long-lived same-severity findings and upgrade/downgrade churn both collapse into the same bucket. That keeps counts deterministic, but it weakens triage value once a packet contains many transition-heavy findings (`.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:377-390`).
- The blocked-stop observability gap from iteration 8 becomes more operationally serious at scale. Even when every iteration record carries `stopReason: "blockedStop"` plus a full `legalStop.gateResults` bundle, the reducer-owned dashboard still renders only focus, dimensions, novelty ratio, findings summary, and status because `renderDashboard()` never reads `stopReason`, `legalStop.blockedBy`, or `legalStop.gateResults` (`.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:484-512`, `.opencode/skill/sk-deep-review/references/convergence.md:44-87`, `.opencode/skill/sk-deep-review/references/convergence.md:364-411`).
- The scale harness shows the reducer's D2 weakness is now primarily recovery-summary omission rather than merge instability. `buildFindingRegistry()` still pulls resolution state only from JSONL `resolvedFindings`, while lifecycle severity remains markdown-authoritative, so large packets can preserve finding histories yet still strand the legal-stop explanation outside registry/dashboard surfaces (`.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:271-289`, `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:484-512`).

## Ruled Out
- A 50+ finding packet does not by itself break `Map`-by-`findingId` dedup or transition ordering; the remaining reducer risk is visibility loss, not merge corruption.

## Dead Ends
- I did not pursue confirm-mode workflow differences in this pass because the open question was reducer behavior under a large persisted packet, and the reducer entrypoint plus the shared convergence contract were enough to answer that.

## Sources Consulted
- `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:39-40`
- `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:421-425`
- `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-008.md:17-18`
- `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:116-156`
- `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:236-295`
- `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:377-390`
- `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:484-512`
- `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:614-658`
- `.opencode/skill/sk-deep-review/references/convergence.md:44-87`
- `.opencode/skill/sk-deep-review/references/convergence.md:364-411`
- `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml:432-437`

## Reflection
- What worked and why: The disposable 60-bullet harness turned the scale question into an observed reducer run instead of a code-reading inference, which made the stable merge behavior and missing blocked-stop summaries easy to separate.
- What did not work and why: Static inspection alone could not tell whether transition histories would stay ordered under heavy churn, so the evidence needed a real reducer pass rather than another pure source audit.
- What I would do differently: I would next pair the scale harness with a dimension-skewed packet so the remaining legal-stop effectiveness question can be tested against real dimension-coverage drift instead of only blocked-stop visibility.

## Recommended Next Focus
Stay on D2 one final time, but shift from scale stability to gate effectiveness: build or locate a packet where findings are plentiful yet review-dimension coverage is intentionally uneven, then trace whether the legal-stop bundle actually blocks STOP for the right reasons and whether the recorded `blockedBy` set stays actionable for recovery. That closes the remaining D2 question about how the review loop behaves when dimension coverage, not reducer merge logic, is the pressure point.
