# Agent Improvement Dashboard

## Global Summary

| Field | Value |
| --- | --- |
| Total records | 4 |
| Target profiles | 2 |
| Prompt runs | 3 |
| Benchmark runs | 1 |
| Accepted candidates | 0 |
| Rejected candidates | 0 |
| Ties | 0 |
| Keep-baseline results | 0 |
| Benchmark passes | 1 |
| Benchmark fails | 0 |
| Infra failures | 0 |

## Sample Quality

| Field | Value |
| --- | --- |
| replayCount | n/a |
| stabilityCoefficient | n/a |
| insufficientSampleIterations | 0 |
| insufficientDataIterations | 0 |


## Journal Summary

| Field | Value |
| --- | --- |
| Last session start | 2026-05-02T16:16:17.343Z |
| Last session end | n/a |
| Total events | 4 |
| Stop reason | n/a |
| Session outcome | n/a |
| Latest legal-stop evaluation | n/a |
| Latest blocked stop | n/a |

### Event Types

- benchmark_completed: 1
- candidate_generated: 1
- candidate_scored: 1
- session_start: 1




## Candidate Lineage

| Field | Value |
| --- | --- |
| Lineage depth | 0 |
| Total candidates | 1 |
| Current leaf | iter-1-candidate-001 |

## Mutation Coverage

- Not available.


## Guardrails

- All targets evaluated via dynamic mode; promotion requires explicit per-target approval
- Mirror sync stays downstream packaging and is not counted as benchmark truth

## Stop Status

- Should stop: no
- Drift ambiguity: no
- Reasons: none

## default

- Family: sk-improve-agent
- Prompt runs: 0
- Benchmark runs: 1
- Accepted candidates: 0
- Rejected candidates: 0
- Benchmark passes: 1
- Benchmark fails: 0
- Infra failures: 0
- Best prompt score: n/a
- Best benchmark score: 100
- Latest recommendation: benchmark-pass

### Repeated Failure Modes

- none


## dynamic

- Family: dynamic
- Prompt runs: 3
- Benchmark runs: 0
- Accepted candidates: 0
- Rejected candidates: 0
- Benchmark passes: 0
- Benchmark fails: 0
- Infra failures: 0
- Best prompt score: n/a
- Best benchmark score: n/a
- Latest recommendation: n/a

### Repeated Failure Modes

- none



## Recommendation

Continue only when the next run has a clearer signal than the current best-known state.
