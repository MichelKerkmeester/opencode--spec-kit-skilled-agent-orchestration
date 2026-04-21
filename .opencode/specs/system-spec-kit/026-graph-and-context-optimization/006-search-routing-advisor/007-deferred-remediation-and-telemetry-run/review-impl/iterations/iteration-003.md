# Iteration 003 - Robustness

## Scope

Audited observe-only failure behavior in the live session wrapper:

- `.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts`

## Verification

- Git history checked: `d1a17353ee`, `9e982f366a`, `1146faeecc`
- Vitest: PASS, 2 files / 11 tests

## Findings

### F-003 - P1 - Observe-only wrapper can throw during configure

Evidence:

- `.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:118`
- `.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:125`
- `.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:156`

The wrapper promises observe-only behavior, and `onToolCall()` is wrapped in a broad `try/catch`. The configure path is not. If route prediction throws because runtime input is malformed or unexpected, the exported `configureSmartRouterSession()` can throw before the runtime session starts.

Read-only reproduction: calling `configureSmartRouterSession({ promptId: "p", selectedSkill: undefined, workspaceRoot: "../../..", prompt: "x" })` threw `The "path" argument must be of type string. Received undefined`.

## Delta

New findings: 1. Churn: 0.20.
