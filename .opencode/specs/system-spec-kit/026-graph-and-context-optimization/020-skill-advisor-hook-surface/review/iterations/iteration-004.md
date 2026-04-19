# Iteration 004 — Dimension(s): D4

## Scope this iteration
Reviewed maintainability and internal contract alignment across the advisor producer, shared-payload envelope, and downstream measurement helpers. Focused on whether one canonical brief representation exists across shipped consumers.

## Evidence read
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:141-152` → producer-local `renderBrief()` formats strings as `Advisor: ... use <skill> (confidence X, uncertainty Y).`
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:189-200` → shared-payload sections and summary embed `args.brief`, i.e. the producer-local brief string.
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:100-137` → runtime renderer formats a different canonical string: `Advisor: <freshness>; use <skill> X/Y pass.`
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-fixtures/livePassingSkill.json:1-25` and `staleHighConfidenceSkill.json:1-26` → renderer fixtures explicitly mark predecessor `brief` fields as ignored.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-renderer.vitest.ts:17-27` → renderer contract asserts the semicolon/`pass.` output, not the producer-local wording.
- `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:607-612` → measurement computes `briefBytes` from `hook.brief`, not from `renderAdvisorBrief(hook)`.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
[P1-004-01] [D4] Producer and runtime keep two divergent advisor brief formats alive
- **Evidence**: `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:141-152`; `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/skill-advisor-brief.ts:189-200`; `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/render.ts:100-137`; `.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts:607-612`
- **Impact**: The system now has two brief authorities: the producer writes one string into `result.brief` and shared-payload sections, while the shipped hook adapters render a different string for model-visible injection. That drift already leaks into Track 024 measurement, which sizes the producer string instead of the actual rendered hook text, so the reported brief-byte and savings figures can diverge from runtime reality.
- **Remediation**: Collapse to a single canonical renderer shared by producer, envelope, and measurement code. Either persist only structured advisor fields and render at the edge everywhere, or have `buildSkillAdvisorBrief()` call the exported renderer and reuse that output for `result.brief`, shared payload, and measurement byte accounting.

### P2 (Suggestion)
None.

## Metrics
- newInfoRatio: 0.67 (new D4 evidence plus one new structural drift finding)
- cumulative_p0: 0
- cumulative_p1: 2
- cumulative_p2: 0
- dimensions_advanced: [D4]
- stuck_counter: 0

## Next iteration focus
Advance D5 integration and cross-runtime behavior next, with emphasis on the plugin/bridge path and any parity gaps between SDK, wrapper, and JSON-hook transports.
