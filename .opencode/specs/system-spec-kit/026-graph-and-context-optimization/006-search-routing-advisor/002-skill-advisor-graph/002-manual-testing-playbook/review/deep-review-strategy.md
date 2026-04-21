# Deep Review Strategy

Target: `002-manual-testing-playbook`

Scope: review the spec packet documents and their declared production references. Production and packet files outside `review/**` are read-only.

## Dimensions

| Dimension | Iterations | Status |
| --- | ---: | --- |
| correctness | 001, 005, 009 | covered |
| security | 002, 006, 010 | covered |
| traceability | 003, 007 | covered |
| maintainability | 004, 008 | covered |

## Files Under Review

| File | Role |
| --- | --- |
| `spec.md` | Normative scope and success criteria |
| `plan.md` | Planned execution and risks |
| `tasks.md` | Completion claims and evidence |
| `checklist.md` | Verification state |
| `decision-record.md` | ADR rationale |
| `description.json` | Memory and migration metadata |
| `graph-metadata.json` | Derived graph state |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/**` | Live playbook evidence |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/**` | Live feature-catalog evidence |

## Non-Goals

- Do not fix the packet.
- Do not edit Skill Advisor code, playbooks, feature catalog, or spec docs.
- Do not run git commands that mutate state.

## Stop Conditions

- Stop after 10 iterations or earlier if convergence is legal.
- P0 blocks convergence.
- This run reached max iterations with five active P1 findings, so synthesis verdict is CONDITIONAL.
