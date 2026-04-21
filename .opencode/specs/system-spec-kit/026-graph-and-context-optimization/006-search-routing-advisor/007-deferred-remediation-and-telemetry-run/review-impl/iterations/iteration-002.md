# Iteration 002 - Security

## Scope

Audited path handling between the live wrapper and static route predictor:

- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts`
- `.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts`

## Verification

- Git history checked: `d1a17353ee`, `9e982f366a`, `1146faeecc`
- Vitest: PASS, 2 files / 11 tests

## Findings

### F-002 - P1 - Skill names are joined into filesystem paths without containment validation

Evidence:

- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:475`
- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:418`
- `.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts:125`

`predictSmartRouterRoute()` builds `skillDir` with `path.join(workspaceRoot, ".opencode", "skill", args.skill)` and then `parseRouterModel()` reads `SKILL.md` plus resource-tree sizes under that directory. `createLiveSessionWrapper().configure()` passes `input.selectedSkill` straight into that predictor when explicit route metadata is absent.

Because the skill name is not checked as a safe basename or validated to remain under `.opencode/skill`, a crafted selected skill can traverse out of the skill root before the code reads filesystem metadata. This is especially risky for runtime adapters, where the wrapper is intended to be a low-risk observe-only integration.

## Delta

New findings: 1. Churn: 0.20.
