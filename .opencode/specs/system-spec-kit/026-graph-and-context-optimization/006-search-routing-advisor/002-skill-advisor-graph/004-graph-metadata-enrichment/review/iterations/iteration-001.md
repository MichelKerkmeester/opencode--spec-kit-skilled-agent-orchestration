# Iteration 001: Correctness

## Focus

Correctness pass over completion claims, validator evidence, and command-backed assertions.

## Files Reviewed

- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md`
- `implementation-summary.md`
- `description.json`
- `graph-metadata.json`

## Findings

| ID | Severity | Finding | Evidence |
|---|---|---|---|
| F001 | P1 | Packet completion depends on `review/deep-review-findings.md`, but that file was absent before this review created `review/`. Strict validation also reports missing references to that path. | `spec.md:51`, `spec.md:144`, `checklist.md:43`, `tasks.md:46` |
| F002 | P1 | The recorded compiler command uses `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py`, which is not present in the current repo layout. The current script is under `system-spec-kit/mcp_server/skill-advisor/scripts/`, and running it returned validation failure rather than the documented pass. | `spec.md:134`, `plan.md:109`, `checklist.md:68`, `implementation-summary.md:81` |
| F003 | P1 | The exact corpus-count command recorded as proof now returns `22`, not `21`, because it includes `.opencode/skill/system-spec-kit/scripts/test-fixtures/053-template-compliant-level2/graph-metadata.json`. | `checklist.md:65`, `tasks.md:106`, `implementation-summary.md:78` |

## Delta

New findings: P1=3, P2=0. No P0 found.

## Convergence Check

Continue. Only correctness has been covered, and three new P1 findings exceed the convergence threshold.
