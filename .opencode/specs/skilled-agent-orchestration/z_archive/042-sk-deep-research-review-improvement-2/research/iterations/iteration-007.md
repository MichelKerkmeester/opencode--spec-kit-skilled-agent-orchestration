# Iteration 7: D1 Research Convergence Signal Gap Audit

## Focus
This iteration stayed on D1 and compared the live deep-research stop path against the richer research-signal set already implemented in the shared coverage-graph stack. The goal was to separate concrete runtime gaps from signals that look intentionally not adopted by the current deep-research contract.

## Findings
- The live deep-research workflow still evaluates STOP with a local 3-signal vote only: rolling average, MAD noise floor, and question entropy, then falls through a generic `checkQualityGuards(state, strategy)` call. The active convergence step does not name `contradictionDensity`, `sourceDiversity`, `claimVerificationRate`, or `evidenceDepth` anywhere in the runtime algorithm (.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:250-277).
- `sourceDiversity` is not a speculative extra from the shared graph stack; the deep-research convergence contract already makes it a first-class `qualityGate.checks` sub-check inside the legal-stop bundle. That means the current lack of an explicit shared-graph bridge for this signal is a runtime integration gap, not a deliberate omission (.opencode/skill/sk-deep-research/references/convergence.md:214-220; .opencode/skill/sk-deep-research/references/convergence.md:246-260; .opencode/skill/sk-deep-research/references/convergence.md:297-303).
- `contradictionDensity` is also already part of the published deep-research convergence model: the contract says high contradiction density should block STOP and surface as a `qualityGate` semantic sub-check. Because the live workflow's active stop math still stops at the inline 3-signal vote, this is another concrete runtime gap rather than a merely hypothetical graph enhancement (.opencode/skill/sk-deep-research/references/convergence.md:363-386; .opencode/skill/sk-deep-research/references/convergence.md:411-423; .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:250-277).
- The shared coverage-graph stack already computes a richer research convergence payload with `questionCoverage`, `claimVerificationRate`, `contradictionDensity`, `sourceDiversity`, and `evidenceDepth`, then evaluates `sourceDiversity` and `evidenceDepth` as blocking guards and escalates high contradiction density or unverified claims into blockers/warnings. So the infrastructure gap is not in the graph/MCP layer; it is in the deep-research runtime not calling that layer (.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:35-41; .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:163-228; .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:175-275).
- `claimVerificationRate` and `evidenceDepth` look like deliberate non-adoptions in `sk-deep-research` rather than current regressions. The shared graph stack exposes both signals, but the published deep-research semantic extension still names `semanticNovelty`, `contradictionDensity`, and `citationOverlap` as the added semantic checks, not claim-verification or path-depth gates (.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:35-41; .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:163-228; .opencode/skill/sk-deep-research/references/convergence.md:341-457).
- The reducer still cannot surface graph-backed research convergence even when `graphEvents` are present. It derives its convergence score from `latestIteration.convergenceSignals?.compositeStop ?? latestIteration?.newInfoRatio`, while the same convergence reference says the reducer should derive additional graph signals when `graphEvents` exist. That leaves graph-side research signals operationally disconnected from packet-level status surfaces (.opencode/skill/sk-deep-research/scripts/reduce-state.cjs:244-249; .opencode/skill/sk-deep-research/references/convergence.md:1181-1205).

## Ruled Out
- This is not primarily a shared-infrastructure deficit: the graph/MCP layer already computes and evaluates the richer research signals, including blocker semantics for `sourceDiversity`, `evidenceDepth`, contradictions, and unverified claims (.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:163-228; .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:175-275).
- `claimVerificationRate` and `evidenceDepth` should not yet be treated as contract drift in `sk-deep-research`; the current research convergence reference still frames the semantic extension around `semanticNovelty`, `contradictionDensity`, and `citationOverlap` instead (.opencode/skill/sk-deep-research/references/convergence.md:341-457).

## Dead Ends
- I did not inspect confirm-mode workflows in this pass because the question was whether the active deep-research runtime currently bridges to the shared graph signal set; the auto workflow, convergence reference, reducer, and shared graph handler were sufficient to classify the signal gaps.

## Sources Consulted
- .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/deep-research-strategy.md:36-39
- .opencode/specs/skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/research/iterations/iteration-006.md:39-40
- .opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml:250-277
- .opencode/skill/sk-deep-research/SKILL.md:217-218
- .opencode/skill/sk-deep-research/references/convergence.md:214-320
- .opencode/skill/sk-deep-research/references/convergence.md:341-457
- .opencode/skill/sk-deep-research/references/convergence.md:1181-1205
- .opencode/skill/sk-deep-research/scripts/reduce-state.cjs:244-249
- .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:35-41
- .opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/coverage-graph-signals.ts:163-228
- .opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/convergence.ts:175-275

## Reflection
- What worked and why: Comparing the published research convergence contract directly against the shared graph signal schema made it easy to distinguish "already promised but unwired" from "available elsewhere but never adopted here."
- What did not work and why: The active YAML still hides quality-gate internals behind `checkQualityGuards(state, strategy)`, so some runtime-vs-contract comparisons had to be inferred from named signals rather than traced through a concrete implementation body.
- What I would do differently: I would next inspect one confirm-mode entrypoint only if we need to prove whether this classification is auto-only or universal across both command surfaces.

## Recommended Next Focus
Rotate to D2 and audit the new `sk-deep-review` reducer under partial-failure conditions rather than staying on research convergence. The next productive pass is to test whether `scripts/reduce-state.cjs` preserves finding lifecycle state, deduplication, and blocking gate evidence when an iteration file is malformed or only partially written, because that would answer the remaining D2 question about real-world reducer idempotency without reopening the already-covered contradiction/read-path ground.
