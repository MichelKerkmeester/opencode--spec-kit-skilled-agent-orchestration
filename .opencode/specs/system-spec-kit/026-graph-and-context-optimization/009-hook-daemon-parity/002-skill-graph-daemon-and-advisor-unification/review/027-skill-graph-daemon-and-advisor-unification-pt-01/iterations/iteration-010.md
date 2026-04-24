# Iteration 10 — security

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-strategy.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-state.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-002.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-006.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/006-promotion-gates/spec.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/compat/redirect-metadata.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/compat/daemon-probe.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/sanitizer.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/anti-stuffing.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/sync.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/projection.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/text.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/lanes/explicit.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/lanes/lexical.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/lanes/derived.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/lanes/graph-causal.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-cache.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/gate-bundle.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`
- `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-status.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-validate.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/redirect-metadata.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/promotion/promotion-gates.vitest.ts`

## Findings by Severity (P0/P1/P2)

### P0

- None.

### P1

- **R10-P1-001 — `advisor_recommend` leaks prompt-derived evidence when `includeAttribution` is enabled.**
  - **Claim:** The public MCP response for `advisor_recommend` includes `laneBreakdown[].evidence` when `includeAttribution` is requested, and those evidence strings are built directly from matched prompt tokens/phrases (`token:${token}`, `phrase:${phrase}`, `author:${phrase}`, `derived:${phrase}`), which violates the Phase 027 privacy contract forbidding raw prompt content in response envelopes. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/spec.md:101-104,122`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts:79-90,117-126`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts:221-232`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/lanes/explicit.ts:127-137,157-165`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/lanes/lexical.ts:67-78`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/lanes/derived.ts:17-23`]
  - **evidenceRefs:** [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/spec.md:71,101-104,122`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/text.ts:29-34`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/lanes/explicit.ts:122-137,156-165`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/lanes/lexical.ts:51-86`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/lanes/derived.ts:9-23,34-40`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts:27-31,34-56`]
  - **counterevidenceSought:** I looked for a downstream redaction layer or a privacy regression test that exercises `includeAttribution` with sensitive prompt text. None exists: the handler passes lane evidence through unchanged, the schema exposes `laneBreakdown.evidence`, and the recommend privacy tests only assert non-leakage for the default path without `includeAttribution`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts:85-89`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts:223-232`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts:92-111,113-127`]
  - **alternativeExplanation:** The implementation may be treating `includeAttribution` as an operator-debug surface where revealing matched terms is acceptable, but the shipped schema exposes it on the same public MCP tool and the packet text does not carve out any privacy exception for attribution mode. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts:25-31,34-56`], [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/spec.md:101-104,122`]
  - **finalSeverity:** P1
  - **confidence:** 0.95
  - **downgradeTrigger:** Downgrade if attribution evidence is redacted to opaque lane-local identifiers that cannot reconstruct prompt text, or if the privacy contract is explicitly revised to exempt `includeAttribution` response envelopes.

### P2

- None.

## Traceability Checks

- **Privacy contract vs implementation:** 027/004 still claims no raw prompt content appears in response envelopes, but `includeAttribution` currently routes prompt-derived evidence into `laneBreakdown`, so the shipped MCP surface does not satisfy that requirement. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/spec.md:101-104,122`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts:79-90`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/lanes/explicit.ts:127-137,157-165`]
- **Previously logged compat-boundary sanitizer gap:** The older redirect/status metadata sanitizer gap from iterations 002/006 remains real, but it is not counted as a new iteration-010 finding because it was already recorded in the review packet. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-002.md:46-54`], [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-006.md:35-42`]
- **Adversarial-stuffing rejection remains present:** The validator still carries the stuffing-blocked safety slice, and the promotion bundle continues to preserve shadow-gate regression checks; no new regression surfaced there during this pass. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:157-168,181-193,233-245`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/promotion/promotion-gates.vitest.ts:110-141`]
- **Status / validate / compat default paths stay prompt-safe on the reviewed lines:** The new issue is isolated to `advisor_recommend` attribution output, not the already-covered default privacy assertions in status/validate/shim/bridge tests. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-status.vitest.ts:73-82`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-validate.vitest.ts:25-30`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts:53-62`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts:52-61`]

## Verdict

**CONDITIONAL.** No new P0 surfaced, but iteration 10 found a new P1 privacy regression: the public `advisor_recommend` MCP surface can echo prompt-derived evidence when attribution is enabled.

## Next Dimension

**traceability** — re-check 027/004 checklist/privacy claims and the parent packet’s checklist/ADR cross-references against the now-confirmed iteration-002 / iteration-006 / iteration-010 security gaps.
