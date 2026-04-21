# Iteration 005 - Correctness

## Scope

Audited analyzer aggregation semantics and its tests:

- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-analyze.vitest.ts`

## Verification

- Git history checked: `d1a17353ee`, `9e982f366a`, `1146faeecc`
- Vitest: PASS, 2 files / 11 tests

## Findings

### F-004 - P1 - Analyzer collapses records by promptId alone

Evidence:

- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts:123`
- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts:154`
- `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-analyze.vitest.ts:75`

`collapsePromptRecords()` groups every record only by `promptId`, then emits one collapsed record using the first row's `selectedSkill`. If two sessions or adapters reuse a prompt id, or if the same prompt id is observed with different selected skills, later records disappear from totals and per-skill attribution.

Read-only reproduction: two records with `promptId: "same"` and selected skills `sk-a` and `sk-b` produced `totalRecords: 1` and only a `sk-a` per-skill row. The test at `smart-router-analyze.vitest.ts:75` covers duplicate prompt ids with the same selected skill only, so the cross-skill collision case is missing.

## Delta

New findings: 1. Churn: 0.20.
