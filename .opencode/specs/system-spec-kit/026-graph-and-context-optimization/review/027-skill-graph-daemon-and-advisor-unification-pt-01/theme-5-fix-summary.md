---
title: "Theme 5 Fix Summary"
description: "Derived metadata, lifecycle rollback, and promotion atomicity remediation summary."
date: "2026-04-21"
theme: 5
---

# Theme 5 Fix Summary

## Finding Status

| Finding ID | Status | Notes |
| --- | --- | --- |
| DERIVED-P1-001 | Fixed | `syncDerivedMetadata()` now rejects `skillDir` values that resolve outside `workspaceRoot`. |
| DERIVED-P1-002 | Fixed | Anti-stuffing demotion is now written into derived metadata, projected into `SkillProjection`, and applied by the derived scorer lane. |
| DERIVED-P1-003 | Fixed | `rollbackGraphMetadataFile()` now writes through an atomic temp-file + fsync + rename helper. |
| DERIVED-P1-004 | Fixed | Promotion rollback now always returns a rollback trace after weights are restored, even if cache invalidation or telemetry throws; hook failures are captured in trace fields. |
| DERIVED-P2-001 | Fixed | Semantic live weight lock now rejects any non-zero semantic weight during the first promotion wave, including malformed negative values. |

## Modified Files

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/skill-derived-v2.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/types.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/sync.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/projection.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/lanes/derived.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/lifecycle/rollback.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/rollback.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/semantic-lock.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/lifecycle-derived-metadata.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/scorer/native-scorer.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/promotion/promotion-gates.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/theme-5-fix-summary.md`

## Verification Output

```text
cd .opencode/skill/system-spec-kit/mcp_server && npm run typecheck
> @spec-kit/mcp-server@1.8.0 typecheck
> tsc --noEmit --composite false -p tsconfig.json
Exit 0
```

```text
cd .opencode/skill/system-spec-kit/mcp_server && npm run build
> @spec-kit/mcp-server@1.8.0 build
> tsc --build
Exit 0
```

```text
cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run skill-advisor/tests/ code-graph/tests/ --reporter=default
Test Files  30 passed (30)
Tests       239 passed (239)
Exit 0
```

```text
python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_regression.py --dataset .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl
total_cases: 52
passed_cases: 52
failed_cases: 0
overall_pass: true
Exit 0
```

## Proposed Commit Message

```text
fix(skill-advisor): harden derived rollback and promotion safety
```
