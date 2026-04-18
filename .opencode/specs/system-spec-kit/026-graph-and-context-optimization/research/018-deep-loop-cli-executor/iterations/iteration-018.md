# Iteration 018

## Focus

Q7: inspect the remaining Copilot-specific observability and autonomous-execution hardening gaps after Cluster E, especially whether any executor-specific callback or recovery path widens the current transport-context surface without comparable tests.

## Actions Taken

1. Read [cli-copilot/SKILL.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/cli-copilot/SKILL.md:1) to confirm what the Copilot workflow still promises around cloud delegation, autonomous execution, and `--allow-all-tools` style operation.
2. Read [copilot-hook-wiring.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/copilot-hook-wiring.vitest.ts:1) to see which Copilot hook callbacks are actually covered after Cluster E.
3. Read [copilot-compact-cycle.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/copilot-compact-cycle.vitest.ts:1) to check how much of the compact-cache plus `session-prime` recovery contract is asserted for Copilot.
4. Read [post-dispatch-validate.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/post-dispatch-validate.vitest.ts:1) to confirm what the generic executor validation layer requires from a non-native run.
5. Cross-checked those results against Iteration 017's caller-context conclusion so this pass could separate a real transport-context widening bug from a pure observability-coverage gap.

## Findings

### P1. I did not find a reproduced Copilot-only transport-context widening bug in the shipped Cluster E hook and compact path, but the Copilot-specific tests still stop short of autonomous or delegated execution

Reproduction path:
- Read [cli-copilot/SKILL.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/cli-copilot/SKILL.md:1).
- Read [copilot-hook-wiring.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/copilot-hook-wiring.vitest.ts:1).
- Read [copilot-compact-cycle.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/copilot-compact-cycle.vitest.ts:1).

Evidence:
- The Copilot skill still advertises cloud delegation and autonomous execution surfaces, including workflows that assume broad tool autonomy, but the checked-in Copilot runtime tests do not exercise those surfaces directly.
- `copilot-hook-wiring.vitest.ts` only proves that four hook events route through `copilot-hook.sh`, that `sessionStart` prints the startup banner plus snapshot note, and that a non-banner hook wrapper returns `{}` as valid JSON.
- `copilot-compact-cycle.vitest.ts` only proves the happy path for compact-cache provenance (`trustState=cached`) and successful recovered compact output. It does not cover delegated execution, autopilot-like task runs, or any callback that reads transport caller context after the hook entrypoint.

Impact:
- Q7 is narrowed: the current repo evidence does not show Cluster E itself widening the transport-context surface the way Q6 worried about.
- The remaining Copilot-specific risk is a blind spot around autonomous and delegated execution, not a reproduced leak in the hook or compact cycle already under test.

Risk-ranked remediation candidates:
- P1: add one Copilot executor regression that simulates an autonomous or delegated run and asserts the resulting provenance, recovery metadata, and caller-context capture strategy through the end of the callback chain.
- P2: document explicitly that post-hook work needing transport identity must capture it before leaving the wrapper entrypoint, mirroring the guidance identified in Iteration 017.

### P1. The shared post-dispatch validator still treats non-native executor observability as optional, so a Copilot run can pass validation without proving executor attribution survived the recovery path

Reproduction path:
- Read [post-dispatch-validate.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop/post-dispatch-validate.vitest.ts:1).
- Compare with the non-native executor audit contract described in [sk-deep-research/SKILL.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/sk-deep-research/SKILL.md:85).

Evidence:
- The validator tests only require `type`, `iteration`, `newInfoRatio`, `status`, and `focus` on the final JSONL line.
- None of the validator cases require an `executor` block, executor kind, model, reasoning effort, service tier, or any recovery classification that would distinguish a Copilot executor failure from a generic iteration failure.
- That means a Copilot-specific callback or recovery path could silently drop executor attribution while still satisfying the current "artifact exists and required fields are present" contract.

Impact:
- The biggest remaining Copilot observability gap is not the hook banner or compact-cache trust marker. It is that downstream iteration validation cannot tell whether executor-specific telemetry survived a failure or recovery event.
- If Phase 019 depends on non-native executor parity, the current validator is too weak to enforce it.

Risk-ranked remediation candidates:
- P1: extend post-dispatch validation so non-native runs must carry `executor.kind` at minimum, or add a companion audit validator that fails when non-native executor metadata is absent.
- P2: add a reducer or validator test that covers a malformed or partially written Copilot iteration record and proves recovery preserves enough metadata to attribute the run.

### P2. Copilot recovery coverage is still happy-path biased, so failure-path observability remains thin even after the compact-cache and `session-prime` parity work

Reproduction path:
- Read [copilot-compact-cycle.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/copilot-compact-cycle.vitest.ts:1).
- Read [copilot-hook-wiring.vitest.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/copilot-hook-wiring.vitest.ts:1).

Evidence:
- The compact-cycle test suite has two assertions total: cache success and recovered output success.
- The hook-wiring suite has no negative-path coverage for malformed input, missing state, wrapper failure, or mismatched JSON contract on post-tool events.
- So although Cluster E established provenance parity for the successful cached path, it still leaves failure-path breadcrumbs mostly untested on the Copilot-specific side.

Impact:
- A future Copilot autonomous or recovery regression is still more likely to fail as "generic recovery weirdness" than as a precisely attributable Copilot-specific failure.
- That weakens Phase 019 readiness because the remaining risk is not only correctness, but diagnosability under failure.

Risk-ranked remediation candidates:
- P2: add negative-path Copilot tests for corrupt compact state, missing cached payload, and malformed hook input so recovery behavior becomes observable instead of inferred.
- P2: include one assertion that degraded recovery still emits machine-parseable provenance or an explicit executor-specific fallback marker.

## Questions Answered

- Q7, narrowed: I did not find evidence that the shipped Cluster E Copilot hook plus compact-cache path currently widens the transport-context surface beyond what Iteration 017 already cleared.
- The remaining Copilot-specific gaps are observability and hardening gaps: autonomous or delegated execution is not covered by comparable Copilot-specific tests, and the shared post-dispatch validator does not enforce executor attribution for non-native runs.

## Questions Remaining

- Where does the actual `cli-copilot` deep-loop executor append its JSONL audit block, and does that metadata survive every failure and recovery path the way the skill contract says it should?
- Do any Copilot-specific wrappers or future delegated task flows call into post-dispatch callbacks that execute outside the current `runWithCallerContext(...)` boundary?
- Should Phase 019 treat non-native executor attribution as a required contract in validation, instead of a best-effort audit field?

## Next Focus

Stay on Q7 for one tighter pass: inspect the actual `cli-copilot` executor implementation and any reducer or audit code that writes iteration JSONL so we can confirm whether executor attribution and recovery metadata survive failure, stuck-recovery, and partial-write cases in code rather than in documentation alone.
