# Iteration 6: Security adversarial self-check

## Focus
Security adversarial self-check of the rollout-gate bypass.

## Files Reviewed
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts`
- `checklist.md`

## Findings
### P0 - Blocker
- **F001**: Full-auto canonical saves bypass the advertised Tier 3 rollout gate and can exfiltrate content to the LLM endpoint - `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1343` - The blocker survives the adversarial check. Even though the path needs both a configured endpoint and `plannerMode === 'full-auto'`, the code still lets planner mode override the documented routing flag before the outbound POST happens. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1040`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1343`] [SOURCE: `implementation-summary.md:94`]

### P1 - Required
- **F003**: The phase packet documents the wrong Tier 3 enable flag and rollout model - `implementation-summary.md:53` - The adversarial pass strengthens the packet mismatch: if the docs were accurate, the security blocker would not exist under the documented disabled state. [SOURCE: `implementation-summary.md:53`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1366`]

## Ruled Out
- Requiring a configured endpoint is not enough mitigation. That endpoint is already a normal deployment input for other LLM helper paths, so it cannot double as the Tier 3 rollout gate.

## Dead Ends
- No narrower security guard exists between `tier3Enabled` and the POST to `/chat/completions`.

## Recommended Next Focus
Return to traceability and inspect the packet metadata itself after the recent phase renumbering.

## Assessment
- Dimensions addressed: security
- newFindingsRatio: 0.09
- Cumulative findings: P0=1, P1=2, P2=1
