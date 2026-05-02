# Agent Improvement Dashboard

## Global Summary

| Field | Value |
| --- | --- |
| Total records | 16 |
| Target profiles | 2 |
| Prompt runs | 11 |
| Benchmark runs | 5 |
| Accepted candidates | 0 |
| Rejected candidates | 0 |
| Ties | 0 |
| Keep-baseline results | 0 |
| Benchmark passes | 0 |
| Benchmark fails | 5 |
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
| Last session start | 2026-05-02T18:08:03.490Z |
| Last session end | 2026-05-02T18:19:51.258Z |
| Total events | 19 |
| Stop reason | blockedStop |
| Session outcome | keptBaseline |
| Latest legal-stop evaluation | 2026-05-02T18:19:51.169Z |
| Latest blocked stop | 2026-05-02T18:19:51.214Z |

### Event Types

- benchmark_completed: 5
- blocked_stop: 1
- candidate_generated: 5
- candidate_scored: 5
- legal_stop_evaluated: 1
- session_end: 1
- session_start: 1

### Latest legal-stop evaluation

- Gates: behaviorGate, contractGate, evidenceGate, improvementGate, integrationGate

| Gate | Result |
| --- | --- |
| behaviorGate | pass |
| contractGate | fail |
| evidenceGate | pass |
| improvementGate | fail: best delta=0 |
| integrationGate | pass |

### Latest blocked stop

- Failed gates: none
- Reason: n/a


## Candidate Lineage

- Not available.

## Mutation Coverage

- Not available.


## Guardrails

- All targets evaluated via dynamic mode; promotion requires explicit per-target approval
- Mirror sync stays downstream packaging and is not counted as benchmark truth

## Stop Status

- Should stop: yes
- Drift ambiguity: no
- Reasons: default: weak benchmark runs 5/2

## default

- Family: sk-improve-agent
- Prompt runs: 0
- Benchmark runs: 5
- Accepted candidates: 0
- Rejected candidates: 0
- Benchmark passes: 0
- Benchmark fails: 5
- Infra failures: 0
- Best prompt score: n/a
- Best benchmark score: 0
- Latest recommendation: benchmark-fail

### Repeated Failure Modes

- missing-output: 5


## dynamic

- Family: dynamic
- Prompt runs: 11
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

Stop automatically: default: weak benchmark runs 5/2
