---
title: "Theme 2 Fix Summary"
description: "API correctness remediation summary for Skill Advisor scan findings."
date: "2026-04-21"
theme: 2
---

# Theme 2 Fix Summary

## Finding Status

| Finding ID | Status | Notes |
| --- | --- | --- |
| API-P1-001 | Fixed | Advisor prompt cache keys now include confidence/uncertainty thresholds and response-shape options (`includeAttribution`, `includeAbstainReasons`) in addition to `topK`. |
| API-P1-002 | Fixed | Advisor status freshness now compares the SQLite artifact mtime against nested `graph-metadata.json` mtimes instead of the top-level skill directory mtime. |
| API-P1-003 | Fixed | `advisor_validate` now requires `confirmHeavyRun: true` through the Zod schema, public tool descriptor, and MCP allowlist before running the heavy validation bundle. |
| API-P2-001 | Fixed | `createTrustState()` now preserves caller-provided `lastLiveAt`, so live status reads report the generation live time rather than the read time. |

## Modified Files

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-cache.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/trust-state.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tools/advisor-validate.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-status.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-validate.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/theme-2-fix-summary.md`

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
Tests       224 passed (224)
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
fix(skill-advisor): harden api correctness contracts
```
