# Iteration 26 — security

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-strategy.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-state.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-022.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/002-lifecycle-and-derived-metadata/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/006-promotion-gates/spec.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/projection.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-cache.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/sync.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/sanitizer.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/compat/redirect-metadata.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/redirect-metadata.vitest.ts`
- `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py`

## Findings by Severity (P0/P1/P2)

### P0

None.

### P1

None new this iteration.

### P2

None.

## Traceability Checks

- **A7 sanitizer coverage:** derived metadata still passes through the shared sanitizer before write/publication boundaries at the generation path, matching 027/002 REQ-004-P0-008 (`lib/derived/sync.ts:75-108`, `lib/derived/sanitizer.ts:41-80`, `002-lifecycle-and-derived-metadata/spec.md:82-91`).
- **MCP privacy / no prompt leakage:** the recommend handler still emits prompt-safe envelopes and the prompt cache key remains HMAC-based rather than prompt-echoed (`handlers/advisor-recommend.ts:54-114`, `lib/prompt-cache.ts:61-74`, `tests/handlers/advisor-recommend.vitest.ts:113-127`, `004-mcp-advisor-surface/spec.md:101-123`).
- **Compat redirect/status hardening:** the compat redirect helper continues to sanitize lifecycle metadata before brief rendering, and the bridge tests still assert disabled-path prompt suppression (`lib/compat/redirect-metadata.ts:41-78`, `tests/compat/redirect-metadata.vitest.ts:6-47`, `tests/compat/plugin-bridge.vitest.ts:52-61`, `005-compat-migration-and-bootstrap/spec.md:95-145`).
- **Adversarial-stuffing rejection remains intact:** the native validation surface still keeps the stuffing-blocked safety check wired into output slices, consistent with the promotion-gates security expectations (`handlers/advisor-validate.ts:157-249`, `006-promotion-gates/spec.md:62-79`).
- **Recheck result:** iteration 22's redirect-metadata concern did not expand into a distinct new security regression in the current snapshot; this pass found no additional write-boundary, privacy, or stuffing-breakage beyond the already known review history.

## Verdict

**PASS.** No new P0/P1 security findings were identified in iteration 26.

## Next Dimension

traceability
