# Spec: Agent-Improver Self-Test

| Field | Value |
| --- | --- |
| Status | Complete |
| Priority | P1 |
| Level | 2 |
| Parent | 041-sk-agent-improver-loop |
| Phase | 009 |
| Estimated LOC | 0 (test-only phase, no new code) |

## Problem

The sk-agent-improver skill has been validated against handover, debug, orchestrate, and review agents (Phases 001-008), but never against itself. The agent-improver's own agent definition (`.opencode/agent/agent-improver.md`) has never been a target. This is the only agent in the system that describes the improvement workflow itself, creating a unique self-referential case where the integration scanner discovers its own surfaces, the profile generator extracts its own rules, and the scorer evaluates its own quality.

## Solution

Execute a real end-to-end `/improve:agent` run targeting `.opencode/agent/agent-improver.md` using the Phase 009 spec folder as the runtime root. Run the full loop (scan, profile, candidate, score, benchmark, reduce, stop-check) for 3 bounded iterations in `:confirm` mode with dynamic scoring. Record all runtime artifacts and document self-referential observations.

## Scope

### In Scope

- Run the full `/improve:agent` command targeting `.opencode/agent/agent-improver.md`
- Use dynamic scoring mode (5-dimension)
- Use the Phase 009 spec folder as the runtime root
- Use `:confirm` mode (interactive gates for observation)
- Run 3 iterations maximum
- Record all runtime artifacts (ledger, dashboard, registry, candidates, integration report, dynamic profile)
- Document observations about self-referential behavior
- Update parent spec.md, implementation-summary.md, and changelog.md

### Out of Scope

- New script code or script modifications
- Promotion of any candidate to canonical (observation/test phase only)
- Changing agent-improver.md based on test results
- Fixing any issues discovered (those become Phase 010 work)

## Requirements

| ID | Requirement | Acceptance Criteria |
| --- | --- | --- |
| REQ-001 | Full loop runs without infra failure | All 8 scripts execute successfully when targeting agent-improver.md |
| REQ-002 | Integration scanner discovers agent-improver's own surfaces | Report includes canonical, mirrors, commands, YAML workflows, skills, and global doc references |
| REQ-003 | Dynamic profile is generated from agent-improver.md | Profile contains structural checks, rule coherence checks, output checks |
| REQ-004 | 5-dimension scores are produced | All 5 dimensions produce numeric scores between 0-100 |
| REQ-005 | Reducer generates a dimensional dashboard | Dashboard shows per-dimension progress and stop status |
| REQ-006 | Stop condition fires correctly | Loop exits via plateau detection, max iterations, or operator decision |
| REQ-007 | Self-referential edge cases are documented | Observations about scoring bias, circular discovery, and anomalies are recorded |

## Success Criteria

- SC-001: The improvement loop completes without `infra_failure` status in any script output
- SC-002: The integration report shows all expected surfaces (canonical, 3 mirrors, command refs, skill refs, YAML workflows)
- SC-003: The dynamic profile includes ALWAYS/NEVER rules from Operating Rules and output checks from Self-Validation Protocol
- SC-004: At least 1 candidate is generated, scored across 5 dimensions, and reduced into the dashboard
- SC-005: The final dashboard and registry are present and readable
- SC-006: Self-referential observations are documented in the implementation summary
