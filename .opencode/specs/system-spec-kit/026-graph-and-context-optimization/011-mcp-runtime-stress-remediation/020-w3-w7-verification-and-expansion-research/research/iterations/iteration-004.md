---
iteration: 4
focus: RQ4 - W6 CocoIndex adaptive overfetch promotion
newInfoRatio: 0.69
status: complete
---

# Iteration 004 - W6 CocoIndex Calibration

## Focus

Determine whether duplicate-density telemetry actually fires in runtime paths and whether W6 should be promoted to default-on after Phase E showed +0.667 precision.

## Evidence Reviewed

- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cocoindex-calibration.ts:31` reads `SPECKIT_COCOINDEX_ADAPTIVE_OVERFETCH`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cocoindex-calibration.ts:36` implements `calibrateCocoIndexOverfetch`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cocoindex-calibration.ts:39` applies adaptive overfetch only when the flag is enabled and duplicate density is at least `0.35`.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cocoindex-calibration.ts:41` uses multiplier `4` when applied.
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/cocoindex-calibration.ts:76` counts path classes.
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w6-cocoindex-calibration.vitest.ts:3` imports the helper in tests.
- `.opencode/skill/system-spec-kit/mcp_server/stress_test/search-quality/w6-cocoindex-calibration.vitest.ts:7` asserts flagged and unflagged behavior.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:27` preserves CocoIndex raw/path telemetry as additive metadata only.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/seed-resolver.ts:131` copies raw score/path class/ranking signals into artifact refs.
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/context.ts:242` normalizes snake-case and camelCase CocoIndex telemetry.
- `rg "calibrateCocoIndexOverfetch|cocoindex-calibration" .opencode/skill/system-spec-kit/mcp_server` found only the module itself and `stress_test/search-quality/w6-cocoindex-calibration.vitest.ts`.

## Findings

### F-W6-001 - P1 - Calibration telemetry is test-only, not live

Hunter: the module correctly computes duplicate density and effective limits, but no production consumer calls it.

Skeptic: existing CocoIndex telemetry passthrough is intentionally additive and may be a safer first step than live ranking changes.

Referee: the promotion question is premature. Phase E's +0.667 precision came from synthetic W6 fixture behavior, and the adaptive multiplier does not yet fire in a live query path.

## Wiring Verdict

Keep W6 opt-in. Before default-on promotion, wire telemetry into the actual CocoIndex candidate acquisition path and measure cost, duplicate reduction, and precision under production-like corpora.

## Opportunities

- Integrate calibration at the first point where CocoIndex candidates and requested limit are both available.
- Emit `duplicateDensity`, `effectiveLimit`, and `adaptiveOverfetchApplied` into search trace/audit metadata.
- Add operator docs for `SPECKIT_COCOINDEX_ADAPTIVE_OVERFETCH`.

## Next Focus

Iteration 005 should verify whether W7 stress files exercise real degraded-readiness envelopes or static fixture outputs.
