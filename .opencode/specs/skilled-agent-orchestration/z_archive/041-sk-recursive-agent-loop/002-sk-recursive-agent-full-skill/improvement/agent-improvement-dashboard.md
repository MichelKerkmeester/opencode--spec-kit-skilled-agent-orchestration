# Agent Improvement Dashboard

## Global Summary

| Field | Value |
| --- | --- |
| Total records | 9 |
| Target profiles | 2 |
| Prompt runs | 4 |
| Benchmark runs | 5 |
| Accepted candidates | 0 |
| Rejected candidates | 1 |
| Ties | 0 |
| Keep-baseline results | 1 |
| Benchmark passes | 3 |
| Benchmark fails | 2 |
| Infra failures | 0 |

## Guardrails

- Canonical promotion target remains ".opencode/agent/handover.md"
- Candidate-only target remains ".opencode/agent/context-prime.md"
- Mirror sync stays downstream packaging and is not counted as benchmark truth

## Stop Status

- Should stop: no
- Drift ambiguity: no
- Reasons: none

## context-prime

- Family: session-bootstrap
- Prompt runs: 2
- Benchmark runs: 2
- Accepted candidates: 0
- Rejected candidates: 1
- Benchmark passes: 1
- Benchmark fails: 1
- Infra failures: 0
- Best prompt score: 100
- Best benchmark score: 100
- Latest recommendation: reject-candidate

### Repeated Failure Modes

- forbidden-patterns: 1
- graceful-failure: 1
- missing-headings: 1
- missing-required-patterns: 1
- no-indexing: 1

## handover

- Family: session-handover
- Prompt runs: 2
- Benchmark runs: 3
- Accepted candidates: 0
- Rejected candidates: 0
- Benchmark passes: 2
- Benchmark fails: 1
- Infra failures: 0
- Best prompt score: 100
- Best benchmark score: 100
- Latest recommendation: keep-baseline

### Repeated Failure Modes

- actual-source-reading: 1
- forbidden-patterns: 1
- leaf-only: 1
- missing-headings: 1
- missing-required-patterns: 1


## Recommendation

Fix repeated benchmark failures before broadening scope or promoting any target.
