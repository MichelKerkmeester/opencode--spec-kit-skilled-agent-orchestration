# Iteration 006 — Dimension(s): D6

## Scope this iteration
Reviewed the shipped test suite for advisor-hook functionality, cross-runtime parity, privacy, and plugin behavior. Focused on whether the existing suites would have caught the concrete drift already found in D1 and D5.

## Evidence read
- `.opencode/skill/system-spec-kit/mcp_server/tests/README.md:27-44` → test directory is broad and expects focused runs plus full-suite verification.
- `mcp_server/tests/advisor-*.vitest.ts` inventory shows dedicated suites for subprocess, freshness, observability, prompt policy, privacy, timing, renderer, producer, corpus parity, prompt cache, and runtime parity.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-privacy.vitest.ts:78-112` → privacy suite covers envelope, metrics, diagnostic JSONL, health output, and cache keys.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:21-24` and `:119-136` → parity suite covers Claude, Gemini, Copilot, Codex, and Copilot wrapper fallback only.
- `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:78-195` → plugin suite covers TTL caching, status output, disable flags, timeout, and spawn failure, but not parity against hook defaults.
- `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-observability.vitest.ts:15-134` → observability suite stays contract-level and does not exercise runtime emission or aggregation wiring.

## Findings

### P0 (Blocker)
None.

### P1 (Required)
None.

### P2 (Suggestion)
[P2-006-01] [D6] Coverage misses the two highest-signal drift vectors: subprocess privacy and plugin-vs-hook parity
- **Evidence**: `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-privacy.vitest.ts:78-112`; `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts:21-24`; `.opencode/skill/system-spec-kit/mcp_server/tests/spec-kit-skill-advisor-plugin.vitest.ts:78-195`
- **Suggestion**: Add one test that asserts the subprocess does not place raw prompt text on the command line, and one parity suite that runs the OpenCode plugin/bridge against the same canonical fixture set used by `advisor-runtime-parity.vitest.ts`.

## Metrics
- newInfoRatio: 0.56 (new D6 evidence plus one targeted coverage advisory)
- cumulative_p0: 0
- cumulative_p1: 3
- cumulative_p2: 1
- dimensions_advanced: [D6]
- stuck_counter: 0

## Next iteration focus
Advance D7 documentation accuracy next by checking whether the published privacy and parity claims still match the shipped code and test surfaces after the D1/D4/D5 findings.
