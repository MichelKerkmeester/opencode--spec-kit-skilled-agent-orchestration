# Iteration 001 - Correctness

## Scope

Reviewed the packet completion claims against the live graph metadata parser and graph metadata schema regression tests.

## Findings

| ID | Severity | Finding | Evidence |
|----|----------|---------|----------|
| F002 | P1 | The packet says the 16-entity cap was preserved, but the live parser returns up to 24 entities and the current regression test asserts 24. This makes the checked verification claim false even though the parser behavior itself is internally consistent. | `plan.md:16`; `tasks.md:10`; `checklist.md:12`; `implementation-summary.md:53`; `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:912`; `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:514-522` |

## Ruled Out

- The shared upsert helper is present and used for both key-file and extracted-entity insertion paths at `graph-metadata-parser.ts:872-909`.
- The `spec.md` and `plan.md` collision tests do assert canonical path preference and single entity names.

## Delta

New findings: P0 0, P1 1, P2 0. New findings ratio: 0.45.
