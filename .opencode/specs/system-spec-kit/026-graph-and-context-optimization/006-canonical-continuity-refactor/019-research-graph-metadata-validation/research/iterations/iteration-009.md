# Iteration 9: Distribution Pressure and Timestamp Freshness

## Focus
Answer RQ-7 and RQ-8 with corpus-wide count distributions and `last_save_at` freshness checks.

## Findings
1. Trigger-phrase pressure is high: 216 folders exceed the intended 12-trigger-phrase ceiling, with the worst cases reaching 33. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
2. Key-file pressure is also high: 159 folders already sit at the 20-key-file cap, which suggests truncation is common rather than exceptional. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
3. Entity saturation is even stronger: 291 folders hit the 16-entity cap, confirming that downstream entity visibility is routinely clipped. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
4. `last_save_at` is stale in 130 folders when compared with current canonical-doc mtimes; legacy-format files are especially problematic because compatibility mode synthesizes epoch-like timestamps instead of preserving historical save times. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:122-160] [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]

## Ruled Out
- Treating legacy synthetic timestamps as meaningful save history.

## Dead Ends
- Looking only at median counts; cap-hit rates were more revealing.

## Sources Consulted
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:122-160`
- Live filesystem scan over `.opencode/specs` on 2026-04-13

## Assessment
- New information ratio: `0.4`
- Questions addressed: `RQ-7`, `RQ-8`
- Questions answered: `RQ-7`, `RQ-8`

## Reflection
- What worked and why: Cap-hit counts turned out to be a stronger signal than raw distributions alone.
- What did not work and why: Freshness metrics are noisy for legacy files because fallback parsing cannot recover original timestamps.
- What I would do differently: Separate "stale because docs changed" from "stale because legacy timestamps are synthetic" in future audits.

## Recommended Next Focus
Synthesize the cross-question picture and prioritize the highest-leverage parser/backfill fixes.
