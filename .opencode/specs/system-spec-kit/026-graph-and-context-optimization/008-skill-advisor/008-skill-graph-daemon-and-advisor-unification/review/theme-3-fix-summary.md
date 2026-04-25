---
title: "Theme 3 Fix Summary"
description: "Scorer correctness remediation summary for Skill Advisor scan findings."
date: "2026-04-21"
theme: 3
---

# Theme 3 Fix Summary

## Finding Status

| Finding ID | Status | Notes |
| --- | --- | --- |
| SCORE-P1-001 | Fixed | Derived lane age haircut now uses the projection `generatedAt` timestamp instead of `now`, allowing stale generated metadata to decay. |
| SCORE-P1-002 | Fixed | `includeAllCandidates` still returns all candidates for diagnostics, but `topSkill` and `unknown` are computed only from passing recommendations. |
| SCORE-P1-003 | Fixed | Confidence precision was increased before ambiguity checks, preventing two-decimal rounding from creating false ambiguity pressure. |
| SCORE-P1-004 | Fixed | Filesystem projection now mirrors SQLite projection by populating `derivedKeywords` from the same derived trigger set. |
| SCORE-P1-005 | Fixed | Negative causal edges no longer enqueue downstream positive propagation through their target nodes. |

## Modified Files

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/lanes/derived.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/projection.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/lanes/graph-causal.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/scorer/native-scorer.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/008-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/theme-3-fix-summary.md`

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
Tests       229 passed (229)
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
fix(skill-advisor): correct scorer threshold and projection semantics
```
