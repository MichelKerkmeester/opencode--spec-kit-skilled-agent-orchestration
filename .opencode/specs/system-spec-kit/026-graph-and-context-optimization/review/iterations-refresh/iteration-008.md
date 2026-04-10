# Iteration 008 — Runtime Regression Sweep

## Dimension
D1

## Focus area
Runtime regression sweep: read the 5 new vitest files + 7 modified existing vitest files and verify no test is asserting wrong behavior

## Findings

No findings — dimension clean for this focus area.

The modified legacy suites still assert the intended runtime contracts rather than stale pre-fix behavior: the shared truncation helper remains boundary-safe, [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase1.vitest.ts:23-60] PR-5 still validates saved trigger hygiene rather than preserved junk, [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase3-pr5.vitest.ts:115-175] PR-6 still keeps authored decisions authoritative without losing degraded fallback, [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/memory-quality-phase3-pr6.vitest.ts:32-121] the post-save render round trip still checks the wrapper render contract end to end, [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/post-save-render-round-trip.vitest.ts:60-140] and post-save review still treats matching frontmatter as a clean pass. [SOURCE: .opencode/skill/system-spec-kit/scripts/tests/post-save-review.vitest.ts:22-67]

On the MCP-server side, the sampled packet-adjacent suites also still encode the corrected behavior rather than the old overclaims. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:14-27] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts:67-86] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts:154-207]

## Counter-evidence sought

I looked for tests that still expected the pre-remediation routing hint, the old degraded lexical label, or the earlier save-path behavior that packet `010` replaced. I did not find stale assertions in the sampled suites.

## Iteration summary

The regression layer is generally healthy. I re-ran both the targeted scripts-side packet-010 suite and a focused MCP-server suite, and both passed, which supports the clean read on the tests themselves.
