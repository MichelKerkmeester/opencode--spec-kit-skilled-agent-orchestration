---
iteration: 3
focus: RQ3 - W5 shadow learned weights data pipeline
newInfoRatio: 0.78
status: complete
---

# Iteration 003 - W5 Shadow Learned Weights

## Focus

Trace where `_shadow` output goes and determine whether it is logged to an audit table, written to a file, consumed by an offline learner, or only emitted to callers.

## Evidence Reviewed

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lane-registry.ts:5` defines live and shadow weights.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lane-registry.ts:10` keeps `semantic_shadow` live weight at `0.00` and shadow weight at `0.05`.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts:270` constructs lane contributions.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/fusion.ts:276` gives shadow-only lanes `weightedScore: 0` in live scoring.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts:176` computes public shadow recommendations.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts:270` emits `_shadow`.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts:280` schema-validates output.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts:281` stores parsed output in prompt cache.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts:79` defines the optional `_shadow` schema.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py:360` translates native advisor output to the legacy CLI recommendation array.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py:373` builds legacy recommendation items without `_shadow`.
- `rg "_shadow|shadow_scoring|adaptive_shadow_runs" .opencode/skill/system-spec-kit/mcp_server` found durable shadow tables for other systems, but not a W5 advisor shadow sink.

## Findings

### F-W5-001 - P1 - Shadow diagnostics have no durable advisor learning sink

Hunter: `_shadow` exists in `advisor_recommend` output, but there is no advisor-specific insert into an audit or training table.

Skeptic: prompt cache stores the parsed output, so the data is not instantly lost inside the MCP handler process.

Referee: prompt cache is not an offline-learning sink, and the Python compatibility path drops `_shadow`. W5 is safe for live behavior, but not yet useful as a learned-weight feedback loop unless callers preserve response payloads externally.

## Wiring Verdict

W5 is output-only diagnostics. Live weights remain frozen, and shadow deltas are not durably captured for learning.

## Opportunities

- Add an advisor shadow audit table or append-only JSONL sink.
- Preserve `_shadow` in CLI compatibility output under an opt-in field.
- Link shadow deltas to prompt, chosen skill, final user override, and later correction outcome.

## Next Focus

Iteration 004 should inspect W6 duplicate-density telemetry and whether it fires in live CocoIndex/code-graph paths.
