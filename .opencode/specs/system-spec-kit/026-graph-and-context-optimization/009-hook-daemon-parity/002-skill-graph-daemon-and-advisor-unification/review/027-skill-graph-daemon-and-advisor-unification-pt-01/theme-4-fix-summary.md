---
title: "Theme 4 Fix Summary"
description: "Freshness and daemon remediation summary for Skill Advisor scan findings."
date: "2026-04-21"
theme: 4
---

# Theme 4 Fix Summary

## Finding Status

| Finding ID | Status | Notes |
| --- | --- | --- |
| FRESH-P1-001 | Fixed | Watcher processing now treats deleted watched paths as meaningful changes, reindexes, removes stale hashes, and publishes generation. |
| FRESH-P1-002 | Fixed | Generation publication now uses a lock file around read-increment-write publication to avoid lost local increments. |
| FRESH-P1-003 | Fixed | Lease heartbeat/release now mark the holder inactive when zero rows are affected, preventing lost lease holders from continuing as owners. |
| FRESH-P1-004 | Fixed | Cache invalidation fan-out now isolates listener failures so later listeners still receive generation invalidations. |
| MERGE-P1-004 | Fixed | Explicit skill graph scans and context-server skill graph indexing now publish skill graph generation and invalidate advisor caches after successful scans. |
| FRESH-P2-001 | Fixed | Advisor subprocess timeouts now report `TIMEOUT` instead of `SIGNAL_KILLED`; real non-timeout `SIGKILL` remains `SIGNAL_KILLED`. |
| FRESH-P2-002 | Fixed | Freshness fingerprints now include SHA-256 content hashes for skill files, metadata, scripts, and artifacts, not only path/mtime/size. |

## Modified Files

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/daemon/watcher.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/generation.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/daemon/lease.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/cache-invalidation.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/subprocess.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/daemon-freshness-foundation.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-subprocess.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-freshness.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-brief-producer.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-privacy.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-timing.vitest.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/theme-4-fix-summary.md`

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
Tests       233 passed (233)
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
fix(skill-advisor): harden freshness and daemon publication
```
