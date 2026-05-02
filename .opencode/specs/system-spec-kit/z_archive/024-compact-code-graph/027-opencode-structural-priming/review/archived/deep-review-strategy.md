# Deep Review Strategy — 027-opencode-structural-priming

## Scope
- Non-hook structural bootstrap contract (`session-snapshot.ts`)
- Contract propagation (`memory-surface.ts`, `session-bootstrap.ts`, `session-resume.ts`, `session-health.ts`)
- OpenCode-first guidance mirrors (`context-server.ts`, `AGENTS.md`, `.opencode/agent/context-prime.md`)
- Parent/child packet traceability

## Initial Findings Focus
1. Ensure contract fields are consistently surfaced on all runtime entry points.
2. Align stale/missing recovery guidance wording.
3. Close packet completeness gaps (implementation summary, checklist evidence, strict validation).

## Remediation Plan
1. Keep contract source-of-truth in `session-snapshot.ts`.
2. Align handler guidance and hints.
3. Synchronize packet docs and strict validation outputs.

## Convergence Outcome
- Iterations completed: 10/10
- Active findings: P0=0, P1=0, P2=0
- Verdict: PASS
