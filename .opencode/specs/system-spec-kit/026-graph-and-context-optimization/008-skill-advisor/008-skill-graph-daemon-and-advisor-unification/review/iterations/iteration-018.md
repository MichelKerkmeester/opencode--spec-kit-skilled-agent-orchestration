# Iteration 18 — security

## Files Reviewed

1. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-strategy.md`
2. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-state.jsonl`
3. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-014.md`
4. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/002-lifecycle-and-derived-metadata/spec.md`
5. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/sanitizer.ts`
6. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/anti-stuffing.ts`
7. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts`
8. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-policy.ts`
9. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-cache.ts`
10. `.opencode/skill/skill-advisor/scripts/skill_advisor.py`
11. `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`
12. `.opencode/plugins/spec-kit-skill-advisor.js`
13. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts`
14. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts`
15. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts`

## Findings by Severity (P0/P1/P2)

### P0

- None.

### P1

- None new this iteration. Re-reviewing the A7 write boundaries, MCP response surface, plugin bridge, and compat shim did not uncover a new release-blocking security defect beyond the previously logged packet findings from earlier security passes.
- The previously logged attribution/privacy concern remains unchanged rather than widened: `advisor_recommend` still exposes lane evidence only when `includeAttribution` is explicitly requested, while the compat shim continues to force `includeAttribution: false`, so this iteration found no additional prompt-leak path on top of the known issue. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts:77-105`], [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:128-141`]

### P2

- None new this iteration.

## Traceability Checks

- The A7 contract in Phase 027/002 still matches the implementation: the spec requires sanitization before any advisor-visible metadata is written, and `sanitizeDerivedValue()` rejects non-string, empty, overlong, or instruction-shaped values before reuse at `sqlite`, `graph-metadata`, `envelope`, and `diagnostic` boundaries. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/002-lifecycle-and-derived-metadata/spec.md:63-64`], [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/002-lifecycle-and-derived-metadata/spec.md:89-90`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/sanitizer.ts:12-57`]
- Adversarial stuffing rejection is still present at the derived-metadata boundary: instruction-shaped phrases short-circuit to rejection, sanitized arrays cap retained values, and high repetition density demotes or rejects the payload before it can influence routing. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/anti-stuffing.ts:48-97`]
- The MCP handler remains prompt-safe on the public surface in this pass: `handleAdvisorRecommend()` serializes recommendation data only, the prompt is used for scoring/cache lookup but not echoed in the response body, and the regression test explicitly asserts ambiguous responses do not contain the input email or prompt text. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts:54-125`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts:113-127`]
- Cache/privacy behavior is still bounded. The MCP exact cache derives opaque HMAC keys from prompt/runtime/source inputs rather than storing readable prompt text as the lookup key, while the OpenCode plugin hashes the prompt together with workspace/session/source signature before caching. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-cache.ts:61-88`], [SOURCE: `.opencode/plugins/spec-kit-skill-advisor.js:125-137`], [SOURCE: `.opencode/plugins/spec-kit-skill-advisor.js:303-326`]
- The compat bridge and Python shim continue to normalize outputs to prompt-safe fields only, and both compatibility tests still assert that secret email/prompt content does not reappear in stdout/brief output. [SOURCE: `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:99-140`], [SOURCE: `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:195-223`], [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:330-343`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts:52-61`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts:53-62`]

## Verdict

**PASS** for iteration 18. No new P0/P1 security finding surfaced; Phase 027's sanitizer, anti-stuffing, prompt-safe response, and cache-privacy controls remain stable in this pass, and the packet security posture is unchanged from prior logged issues.

## Next Dimension

**traceability** — re-check spec/checklist evidence links, ADR-007 parity references, and child-phase cross-references against the shipped code and current review packet.
