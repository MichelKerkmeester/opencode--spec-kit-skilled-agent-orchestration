# Iteration 001 - Correctness

## Scope

Audited the static measurement harness and its fixture coverage:

- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-measurement.vitest.ts`

## Verification

- Git history checked: `d1a17353ee`, `9e982f366a`, `1146faeecc`
- Vitest: PASS, 2 files / 11 tests

## Findings

### F-001 - P1 - Static router parser marks shipped router styles as unknown

Evidence:

- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:285`
- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:477`
- `.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-measurement.vitest.ts:60`

`detectVariant()` only recognizes three router signatures. If the skill uses a router model based on `LANGUAGE_KEYWORDS`, or an `INTENT_MODEL` without `LOAD_LEVELS`, it returns `unknown`. The later branch maps that to `predictedRoute: ["UNKNOWN"]`, `allowedResources: ["__unknown_unparsed__"]`, and `allowedResourceCount: 0`, so the measurement report can claim resource-routing metrics while missing actual router resources for shipped skills.

Reproduction evidence from read-only execution: `predictSmartRouterRoute({ skill: "sk-code-opencode", prompt: "fix vitest jsonl typescript schema" })` returned `variant: "unknown"`, `unknown: true`, and `allowedResourceCount: 0`.

## Delta

New findings: 1. Churn: 0.20.
