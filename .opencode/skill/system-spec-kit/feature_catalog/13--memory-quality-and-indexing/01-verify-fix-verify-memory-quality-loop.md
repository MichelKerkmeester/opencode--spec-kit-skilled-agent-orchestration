# Verify-fix-verify memory quality loop

## Current Reality

Every memory save operation now computes a quality score based on trigger phrase coverage, anchor format, token budget and content coherence. When the score falls below 0.6, the system attempts auto-fixes (re-extracting triggers, normalizing anchors, trimming content to budget) and re-scores. The loop allows 3 total attempts (1 initial evaluation + 2 auto-fix retries, `maxRetries=2`). If no fixes are applied during a retry, the loop breaks early. After all retries are exhausted without reaching the threshold, the memory is rejected.

The `CHARS_PER_TOKEN` ratio (default 4, configurable via `MCP_CHARS_PER_TOKEN` env var) is shared with `preflight.ts` for consistent token estimation. The quality loop feature gate (`SPECKIT_QUALITY_LOOP`) is routed through `search-flags.ts` following the centralized flag pattern.

Rejection rates are logged per spec folder so you can spot folders that consistently produce low-quality saves. This loop catches problems at write time rather than letting bad data pollute search results.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/quality-loop.ts` | Handler | Quality loop handler |
| `mcp_server/lib/eval/eval-db.ts` | Lib | Evaluation database |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/eval-db.vitest.ts` | Eval database operations |
| `mcp_server/tests/quality-loop.vitest.ts` | Quality loop tests |

## Source Metadata

- Group: Memory quality and indexing
- Source feature title: Verify-fix-verify memory quality loop
- Current reality source: feature_catalog.md
