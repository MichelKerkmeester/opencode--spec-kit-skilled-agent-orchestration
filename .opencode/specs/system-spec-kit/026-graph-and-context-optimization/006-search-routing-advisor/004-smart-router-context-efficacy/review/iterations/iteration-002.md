# Deep Review Iteration 002 - Security

## Focus

Dimension: security

Read prior iteration, registry, and state log. Reviewed root requirements, 001 security/adversarial research, and 002 enforcement findings.

## Findings

### P2 - DR-SEC-001 - Default-on plugin rollout lacks an explicit adversarial corpus gate in the packet requirements

Evidence:
- `spec.md:91-104` defines root P0/P1 requirements but does not require an adversarial corpus gate.
- `001-initial-research/research/research.md:35-37` says prompt-poisoning and instruction-shaped labels are covered by current renderer/policy tests and calls for a dedicated adversarial prompt corpus before default-on rollout.
- `001-initial-research/research/research.md:55-57` lists prompt injection, stale skill graph, latency, native-module ABI mismatch, opt-out failure, and blind following as risks.

Impact:
No production vulnerability is shown in this packet, but a follow-up plugin could move toward default-on behavior without converting a known adversarial test need into a requirement.

## Delta

New findings: 1 P2
Repeated findings: 0
Severity-weighted newFindingsRatio: 0.08

## Convergence Check

Continue. Security has been covered once, but traceability and maintainability remain uncovered.
