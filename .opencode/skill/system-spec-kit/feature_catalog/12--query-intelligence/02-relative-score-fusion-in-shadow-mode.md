# Relative score fusion in shadow mode

## Current Reality

RRF has been the fusion method since day one, but is it the best option? Relative Score Fusion runs alongside RRF in shadow mode to find out.

Three RSF variants are implemented: single-pair (fusing two ranked lists), multi-list (fusing N lists with proportional penalties for missing sources) and cross-variant (fusing results across query expansions with a +0.10 convergence bonus). RSF results are logged for evaluation comparison but do not affect actual ranking.

Kendall tau correlation between RSF and RRF rankings is computed at sprint exit to measure how much the two methods diverge. If RSF consistently outperforms, a future sprint can switch the primary fusion method with measured evidence.

**Sprint 8 update:** The `isRsfEnabled()` feature flag function was removed as dead code. The dead RSF branch in `hybrid-search.ts` (which was gated behind this flag returning `false`) was also removed. The RSF fusion module (`rsf-fusion.ts`) retains its core fusion logic for potential future activation, but the flag guard function is gone.

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/rsf-fusion.ts` | Lib | Relative score fusion |
| `shared/algorithms/rrf-fusion.ts` | Shared | RRF fusion algorithm |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/rrf-fusion.vitest.ts` | RRF fusion validation |
| `mcp_server/tests/rsf-fusion-edge-cases.vitest.ts` | RSF fusion edge cases |
| `mcp_server/tests/rsf-fusion.vitest.ts` | RSF fusion scoring |
| `mcp_server/tests/unit-rrf-fusion.vitest.ts` | RRF unit tests |

## Source Metadata

- Group: Query intelligence
- Source feature title: Relative score fusion in shadow mode
- Current reality source: feature_catalog.md
