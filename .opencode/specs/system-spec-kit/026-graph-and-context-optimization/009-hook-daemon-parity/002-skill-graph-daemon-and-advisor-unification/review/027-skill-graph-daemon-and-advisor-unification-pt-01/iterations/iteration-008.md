# Iteration 8 — maintainability

## Files Reviewed

1. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-strategy.md`
2. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-state.jsonl`
3. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/iterations/iteration-004.md`
4. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/generation.ts`
5. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness.ts`
6. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/generation.ts`
7. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts`
8. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/daemon/lifecycle.ts`
9. `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-freshness.vitest.ts`
10. `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/daemon-freshness-foundation.vitest.ts`

## Findings by Severity (P0/P1/P2)

### P0

- None.

### P1

- None.

### P2

- **R8-P2-001 — advisor freshness ownership is split across two persisted generation ledgers with overlapping names.**
  - **Claim:** Maintainability is weakened because Phase 027 leaves two live "generation" contracts in the same package: legacy advisor freshness still reads and mutates `.advisor-state/generation.json` through `skill-advisor/lib/generation.ts`, while the daemon/native status path separately reads and publishes `.advisor-state/skill-graph-generation.json` through `skill-advisor/lib/freshness/generation.ts`. Both ledgers remain under test and both are still wired into runtime code, so future freshness work has to know which "generation" API to touch rather than relying on a single boundary.
  - **evidenceRefs:** [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/generation.ts:44-49`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/generation.ts:167-191`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness.ts:16-20`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/generation.ts:7-8`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness/generation.ts:56-99`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts:8-9`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/daemon/lifecycle.ts:4-5`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/tests/advisor-freshness.vitest.ts:16-24`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/daemon-freshness-foundation.vitest.ts:14-17`]
  - **counterevidenceSought:** I looked for a shared facade, explicit deprecation wrapper, or packet-level note that one generation surface is legacy-only while the other is the sole source of truth for current freshness. In the reviewed code, both modules stay directly imported by production paths and both keep their own tests, so the ownership split is still live.
  - **alternativeExplanation:** The dual-ledger layout may be a deliberate transition boundary: the older advisor freshness path still supports the legacy Python-backed brief flow, while the new daemon/native stack uses skill-graph generation metadata.
  - **finalSeverity:** P2
  - **confidence:** 0.89
  - **downgradeTrigger:** Downgrade if there is a documented ownership split or a single exported freshness facade that guarantees the two ledgers cannot drift independently during future changes.

## Traceability Checks

- **Package boundaries:** Mostly clean at the MCP entrypoints, but freshness ownership is not singular: `skill-advisor/lib/freshness.ts` still depends on the legacy generation counter while `advisor-status` and the daemon lifecycle depend on the newer `lib/freshness/generation.ts` surface.
- **Import-path consistency:** Imports are internally consistent inside each subsystem, yet "generation" now names two persisted state contracts under the same `.advisor-state/` directory, which increases cognitive overhead for maintainers.
- **Tests colocated:** Yes. Legacy freshness coverage remains in `mcp_server/tests/advisor-freshness.vitest.ts`, and daemon-native freshness coverage remains colocated under `skill-advisor/tests/daemon-freshness-foundation.vitest.ts`.
- **Regression suites preserved:** Yes. The split is covered by separate suites rather than being untested.

## Verdict

**PASS** (`hasAdvisories=true`). No new P0/P1 maintainability defects surfaced this iteration; one new P2 advisory remains around the duplicated freshness-generation ownership model.

## Next Dimension

**correctness follow-up** — revisit the already-open P1 correctness/security/traceability issues now that maintainability coverage has been refreshed with the daemon/native freshness boundary in view.
