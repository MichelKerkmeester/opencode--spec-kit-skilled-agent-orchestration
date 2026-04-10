# Deep Research Dashboard

## Run Summary
- Session: `dr-028-2026-04-03-v1`
- Spec Folder: `.opencode/specs/skilled-agent-orchestration/040-sk-deep-research-review-improvement-1`
- Iterations Completed: `90 / 90`
- Stop Reason: `max_iterations (wave-3 external repo expansion)`
- Status: `complete`

## Coverage by Track
| Track | Iterations | Primary Objective |
|---|---:|---|
| `internal-research` | 1-8 | Root-cause map for `sk-deep-research` |
| `internal-review` | 9-14 | Root-cause map for `sk-deep-review` |
| `workflow-surface` | 15-20 | YAML/prompt/contract execution gaps |
| `runtime-parity` | 21-24 | Codex/OpenCode/Claude/Gemini parity and startup compatibility |
| `external-patterns` | 25-27 | Pattern extraction from external repos |
| `compatibility` | 28 | Hook vs non-hook runtime contract |
| `synthesis` | 29-30 | Initial target architecture + migration rollout |
| `lifecycle-deep-dive` | 31-36 | Executability gaps for resume/restart/fork/completed-session |
| `state-contract-deep-dive` | 37-44 | Artifact naming drift, reducer requirements, migration semantics |
| `runtime-deep-dive` | 45-48 | Orchestrate/context-prime/runtime-surface contract parity |
| `external-deep-dive` | 49-55 | Detailed extraction from Auto-Deep-Research, AutoAgent, autoresearch |
| `implementation-synthesis` | 56-60 | Concrete architecture, migration, and validation blueprint |
| `external-auto-deep-research` | 61-70 | Runtime portability, handoff, registry, and provenance lessons from `Auto-Deep-Research-main` |
| `external-autoagent` | 71-80 | Capability gating, workflow generation, tool-safety, and handoff lessons from `AutoAgent-main` |
| `external-autoresearch` | 81-90 | Small mutable surface, trust-boundary, and simplicity-discipline lessons from `autoresearch-master` |

## Information Yield Trend
| Phase | Avg `newInfoRatio` |
|---|---:|
| Iterations 1-10 | 0.79 |
| Iterations 11-20 | 0.50 |
| Iterations 21-30 | 0.51 |
| Iterations 31-40 | 0.59 |
| Iterations 41-50 | 0.56 |
| Iterations 51-60 | 0.45 |
| Iterations 61-70 | 0.54 |
| Iterations 71-80 | 0.51 |
| Iterations 81-90 | 0.49 |

Interpretation:
- Wave-2 sustained yield while moving from discovery into executable architecture and migration design.
- Wave-3 did not overturn the internal diagnosis; it sharpened the boundary between importable runtime ideas and non-transferable lineage assumptions.
- `Auto-Deep-Research-main` and `AutoAgent-main` contributed the strongest portability and explicit-handoff patterns.
- `autoresearch-master` contributed the strongest discipline lessons around mutable surface, trust boundaries, and simplicity.
- Final convergence remained healthy because external evidence reinforced, rather than destabilized, the disk-first packet direction.

## High-Impact Findings
1. Research restart/fork/archive behavior is offered in UX but not implemented as executable state transitions.
2. Review state naming is inconsistent (`deep-review-*` vs `deep-research-*`), increasing pause/resume and migration ambiguity.
3. Runtime parity is incomplete (notably Gemini orchestrator contract and context-prime routing gaps).
4. External repos provide strong portability, handoff, and loop-discipline patterns but still weak longitudinal research/review ledger models.
5. Completed-session flows short-circuit to synthesis and do not support first-class lineage continuation.
6. No canonical reducer reconciles JSONL, iteration files, strategy, dashboard, and synthesis into one machine-checked truth model.
7. The strongest external lesson from `autoresearch-master` is to keep the mutable core small and the evaluation boundary fixed.
8. Drift currently propagates because there is no hard parity gate connecting command assets, skill docs, runtime mirrors, and playbooks.

## Recommended Next Execution Block
1. Implement canonical lineage metadata + executable restart/fork/archive branches.
2. Add research-mode legacy rehome step (matching review-mode migration discipline).
3. Introduce canonical in-loop findings registry + reducer pass per iteration.
4. Add a runtime capability matrix + portability adapter layer for provider/tool compatibility.
5. Enforce runtime parity gates in CI for orchestrate/context-prime/deep-review/deep-research mirrors.
6. Add end-to-end lifecycle tests for hook and non-hook runtimes, including completed-session continuation and pause sentinel semantics.
