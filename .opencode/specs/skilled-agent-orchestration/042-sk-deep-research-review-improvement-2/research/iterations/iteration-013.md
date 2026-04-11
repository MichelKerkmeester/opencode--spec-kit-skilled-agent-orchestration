# Iteration 13: D4 Reducer Anchor Boundary Audit

## Focus
This iteration rotated to D4 and audited whether the shipped reducers for `sk-deep-research`, `sk-deep-review`, and `sk-improve-agent` write outside their declared machine-owned zones. The scope was limited to reducer write paths, target markdown/state assets, and the published ownership contracts for strategy, dashboard, registry, and report surfaces.

## Findings
- `sk-deep-research` is anchor-scoped and fail-closed on strategy writes. Its reducer only replaces the `key-questions`, `answered-questions`, `what-worked`, `what-failed`, `exhausted-approaches`, `ruled-out-directions`, and `next-focus` anchor blocks, and it throws if any requested anchor is missing; that matches the research strategy contract declaring sections 3 and 6-11 reducer-rewritten while leaving sections 1, 2, 4, 5, 12, and 13 stable (`.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:20-21`, `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:317-331`, `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:353-366`).
- The same `sk-deep-research` reducer only writes three outputs in its normal pass: `findings-registry.json`, `deep-research-strategy.md`, and `deep-research-dashboard.md`. I found no reducer path that touches iteration markdown or any other human-authored research asset during refresh (`.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:478-507`).
- `sk-deep-review` also stays inside declared reducer surfaces during normal refresh: `reduceReviewState()` writes only `deep-review-findings-registry.json`, `deep-review-strategy.md`, and `deep-review-dashboard.md`, while the state-format contract separately classifies `review-report.md` as a synthesis-time mutable artifact and the dashboard as fully auto-generated/read-only (`.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:614-645`, `.opencode/skill/sk-deep-review/references/state_format.md:20-25`, `.opencode/skill/sk-deep-review/references/state_format.md:461-479`).
- `sk-deep-review` under-implements its own per-iteration strategy contract while remaining anchor-bounded. The state format says each iteration updates `what-worked`, `what-failed`, `ruled-out-directions`, `cross-reference-status`, and `files-under-review`, but `updateStrategyContent()` actually rewrites only `review-dimensions`, `completed-dimensions`, `running-findings`, `exhausted-approaches`, and `next-focus` (`.opencode/skill/sk-deep-review/references/state_format.md:292-327`, `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:447-481`).
- `sk-deep-review` is fail-open where `sk-deep-research` is fail-closed: if an expected anchor is missing, `replaceAnchorSection()` returns the original content instead of halting, and the reducer still writes the resulting strategy file back out. That prevents cross-anchor spill into adjacent human-owned sections, but it also means corrupted or missing machine-owned zones can silently persist (`.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:431-445`, `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:640-645`).
- `sk-improve-agent` has no mixed-ownership anchor write path in the shipped reducer. The runtime layout includes a mutable `agent-improvement-strategy.md`, but the reducer only regenerates `experiment-registry.json` and `agent-improvement-dashboard.md`, and the skill explicitly frames `reduce-state.cjs` as the dashboard/registry refresh step after ledger appends (`.opencode/skill/sk-improve-agent/references/quick_reference.md:74-85`, `.opencode/skill/sk-improve-agent/SKILL.md:203-204`, `.opencode/skill/sk-improve-agent/SKILL.md:374-382`, `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:482-503`).

## Ruled Out
- A normal-pass reducer path that rewrites `review-report.md`; the deep-review reducer writes strategy, registry, and dashboard only.
- A shipped `sk-improve-agent` reducer path that mutates `agent-improvement-strategy.md`; the reducer never opens or writes that file.

## Dead Ends
- I did not inspect synthesis-only report generators or YAML wrappers in this pass because the open D4 question was specifically about reducer write boundaries, and the reducer entry points were sufficient to answer it.

## Sources Consulted
- `.opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:20-21`
- `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:317-366`
- `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:478-507`
- `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:431-481`
- `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:614-645`
- `.opencode/skill/sk-deep-review/references/state_format.md:20-25`
- `.opencode/skill/sk-deep-review/references/state_format.md:292-327`
- `.opencode/skill/sk-deep-review/references/state_format.md:461-479`
- `.opencode/skill/sk-improve-agent/references/quick_reference.md:74-85`
- `.opencode/skill/sk-improve-agent/SKILL.md:203-204`
- `.opencode/skill/sk-improve-agent/SKILL.md:374-382`
- `.opencode/skill/sk-improve-agent/scripts/reduce-state.cjs:482-503`

## Reflection
- What worked and why: Comparing the reducer write sites directly against the published mutability tables made it possible to answer the anchor-boundary question without reopening older runtime debates.
- What did not work and why: The deep-review contract spreads ownership promises across state-format prose rather than a single machine-owned-anchor table, so proving under-compliance required stitching several sections together.
- What I would do differently: I would next quantify D5 from the live convergence math upward, so the next pass can measure whether coverage-graph influence is materially weighted or only nominal in the active stop logic.

## Recommended Next Focus
Rotate to D5 and inspect the live convergence math plus its callers to determine whether the coverage graph contributes materially to stop gating or only decorates already ratio-driven decisions. The most productive next pass is to trace the research/review convergence helpers and any YAML/runtime call sites that pass graph-derived signals, then compare the documented graph-aware stop language against the actual weight each graph-backed signal carries in the final composite and blocking decisions.
