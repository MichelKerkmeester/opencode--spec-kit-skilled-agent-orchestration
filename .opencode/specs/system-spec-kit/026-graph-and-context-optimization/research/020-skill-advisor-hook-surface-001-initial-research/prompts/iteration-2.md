# Deep-Research Iteration 2 — 020 Skill-Advisor Hook Surface

**Gate 3 pre-answered**: Option **E** (phase folder). Autonomous run. No gates.

## STATE

Iteration: 2 of 10. Last focus: hook trigger-point enumeration per runtime (iter 1 complete).

Focus Area (iter 2): **Deep-dive on code-graph buildStartupBrief pattern + shared-payload envelope.** Read:
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/startup-brief.ts` (producer, envelope usage, trustState mapping)
- `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/ensure-ready.ts` (freshness logic)
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts` (envelope contract, phase 018 R4)
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/opencode-transport.ts` (coercion + trustState vocabulary)
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py` (ranking pipeline + CLI invocation surface)

Output: **direct parallel extraction** — map code-graph patterns 1:1 onto skill-advisor equivalents. For each code-graph function/type, identify (a) direct reuse, (b) slight adaptation needed, (c) requires new design. Specifically:
- `buildStartupBrief()` → `buildSkillAdvisorBrief()` — shape, return type, caching hooks
- `getGraphFreshness()` → `getAdvisorFreshness()` — which mtimes to compare
- `trustStateFromGraphState()` → `trustStateFromAdvisorState()` — mapping table
- `buildGraphOutline()` → `buildSkillAdvisorOutline()` — format, token budget

Answers Q4 (freshness semantic design).

## STATE FILES

Config + state-log APPEND `"type":"iteration"` + strategy + registry + iterations/iteration-002.md + deltas/iter-002.jsonl.

## CONSTRAINTS

Soft 9 / hard 13. REQUIRED canonical JSONL + delta file.

## OUTPUT CONTRACT

1. `iterations/iteration-002.md`: narrative with code-graph→advisor parallel map + function-shape proposals.
2. Canonical JSONL record with `"type":"iteration"`.
3. `deltas/iter-002.jsonl` — structured delta.
