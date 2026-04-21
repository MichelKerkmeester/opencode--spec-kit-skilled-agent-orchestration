# Deep Review Strategy

Target: `005-skill-advisor-docs-and-code-alignment`

Mode: `review`

Dimensions: correctness, security, traceability, maintainability.

Files under review:

| File | Role |
| --- | --- |
| `spec.md` | Requirements and scope |
| `plan.md` | Delivery plan and validation plan |
| `tasks.md` | Claimed task completion |
| `checklist.md` | Claimed verification evidence |
| `implementation-summary.md` | Completion narrative |
| `description.json` | Memory description and migration aliases |
| `graph-metadata.json` | Memory graph metadata |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/*` | Referenced docs and source implementation |

Non-goals:

- Do not modify production docs or TypeScript files.
- Do not run git commands.
- Do not write outside `review/**`.

Stop conditions:

- Stop at 10 iterations or earlier if convergence is legal.
- P0 findings block convergence.
- Synthesize verdict from the active findings registry.

Coverage result:

All four requested dimensions were reviewed. The run stopped at max iterations with active P1 findings, so the verdict is `CONDITIONAL`.
