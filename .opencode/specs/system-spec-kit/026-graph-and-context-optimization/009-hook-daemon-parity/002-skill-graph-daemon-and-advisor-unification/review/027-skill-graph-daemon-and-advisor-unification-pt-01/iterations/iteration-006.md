# Iteration 6 — security

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-strategy.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-state.jsonl`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/002-lifecycle-and-derived-metadata/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/spec.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/sanitizer.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/sync.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/compat/redirect-metadata.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/lifecycle/supersession.ts`
- `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`
- `.opencode/plugins/spec-kit-skill-advisor.js`
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-status.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-validate.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts`

## Findings by Severity (P0/P1/P2)

### P0

- None.

### P1

- **R6-P1-001 — Compat bridge and Python shim publish unsanitized native metadata after sanitizing only the human brief.**
  - **Claim:** The compat publication layer still exposes raw `skillId` / `status` / `redirect*` values in structured metadata and legacy shim output, so the A7 prompt-safe contract is not enforced at the final bridge/shim boundary.
  - **evidenceRefs:** [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/002-lifecycle-and-derived-metadata/spec.md:63-64,90-91`], [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/spec.md:102-104,120-122`], [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/spec.md:95-99,117-128,139-145`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/sanitizer.ts:41-57,79-80`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/compat/redirect-metadata.ts:41-74`], [SOURCE: `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:110-140,209-223`], [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:294-325`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts:34-56`]
  - **counterevidenceSought:** Re-read the native publication helpers and compat tests looking for a second sanitizer pass or a malicious-label regression test on bridge/shim metadata. The only sanitizer-backed helpers are the redirect helpers and derived sanitizer, while the compat tests cover prompt leakage but not hostile `skillId` / `redirect*` payloads [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts:31-61`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts:53-70`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts:113-127`].
  - **alternativeExplanation:** Upstream scorer/projection data may currently keep `skillId` and redirect labels benign in practice, so the unsanitized copies may not be immediately exploitable with today's fixtures.
  - **finalSeverity:** P1
  - **confidence:** 0.90
  - **downgradeTrigger:** Downgrade if the runtime contract is tightened so recommendation labels are guaranteed prompt-safe before they reach compat surfaces, or if bridge/shim outputs apply the same sanitizer before emitting structured metadata / legacy JSON.

### P2

- None.

## Traceability Checks

- **A7 sanitizer boundary contract:** The spec explicitly requires sanitization before advisor-visible metadata is written or published, including graph metadata and envelope/diagnostic surfaces [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/002-lifecycle-and-derived-metadata/spec.md:63-64,90-91`]. The dedicated sanitizer exists and redirect helpers consume it [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/sanitizer.ts:41-57,79-80`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/compat/redirect-metadata.ts:41-74`], but the compat bridge/shim bypass that last-mile protection [SOURCE: `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:209-223`], [SOURCE: `.opencode/skill/skill-advisor/scripts/skill_advisor.py:304-325`].
- **MCP privacy/no-prompt-leak contract:** The MCP/tool-layer privacy checks for raw prompt leakage are present and specifically exercised for recommend/status/validate [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/spec.md:102-104,120-122`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts:113-127`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-status.vitest.ts:73-82`], [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-validate.vitest.ts:25-30`].
- **Adversarial-stuffing rejection:** The safety gate still exists in `advisor_validate`, including the stuffing fixture that must abstain [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:157-168,183-191,233-237`].
- **Compat prompt-safe redirect surfaces:** 027/005 requires prompt-safe redirect/status metadata for superseded/archived/future/rolled-back skills [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/spec.md:95-99,117-128,139-145`]. The bridge currently sanitizes the rendered brief text but not the parallel structured metadata returned alongside it [SOURCE: `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:116-140,209-223`].

## Verdict

**CONDITIONAL.** No new P0 surfaced, but the compat publication path still misses the required prompt-safe sanitizer enforcement on structured metadata / legacy JSON output.

## Next Dimension

**traceability** — verify checklist/ADR/spec cross-links, confirm 027 child requirements map to concrete file:line evidence, and check that review-state claims still match shipped code/tests.
