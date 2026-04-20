# Iteration 22 — security

## Files Reviewed

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/projection.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-cache.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/sanitizer.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/sync.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/anti-stuffing.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/compat/redirect-metadata.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/lifecycle/supersession.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/metrics.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-status.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/redirect-metadata.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/lifecycle-derived-metadata.vitest.ts`
- `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/002-lifecycle-and-derived-metadata/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/003-native-advisor-core/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/spec.md`

## Findings by Severity (P0/P1/P2)

### P0

None.

### P1

#### R22-P1-001 — Native advisor metadata bypasses prompt-safe redirect sanitization

- **Claim:** The A7/prompt-safe contract is enforced in derived metadata generation and compat brief rendering, but the native recommendation publication path still forwards `redirectTo` / `redirectFrom` values from projection into MCP output and bridge metadata without re-sanitizing them. A poisoned or manually edited `graph-metadata.json` can therefore surface instruction-shaped redirect labels in JSON output even though the human-readable brief is sanitized.
- **Evidence refs:**  
  - Spec requires sanitizer coverage at every advisor-visible publication boundary, including envelope publication and prompt-safe status surfaces: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/002-lifecycle-and-derived-metadata/spec.md:89-91`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/spec.md:101-105`, `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/027-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/spec.md:124-129`
  - Projection reads root `graph-metadata.json` redirect fields without sanitization and prefers them over sanitized derived values: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/projection.ts:146-149`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/projection.ts:247-248`
  - Fusion copies those redirect fields into recommendation objects unchanged: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts:256-268`
  - `advisor_recommend` serializes recommendation redirect metadata directly into MCP output: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts:79-107`
  - The native plugin bridge then republishes `top.redirectTo` / `top.redirectFrom` into JSON metadata without sanitization: `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:209-223`
- **Counterevidence sought:** The derived sync path sanitizes redirect metadata before writing v2 `derived` blocks, and compat-only redirect helpers sanitize human-facing redirect labels before brief rendering: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/sync.ts:85-107`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/compat/redirect-metadata.ts:41-74`, `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs:110-140`. The lifecycle test suite also proves A7 coverage at sqlite/graph/envelope/diagnostic boundaries conceptually: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/lifecycle-derived-metadata.vitest.ts:215-223`.
- **Alternative explanation:** If every root-level `graph-metadata.json.redirect_*` field is guaranteed to be machine-written from already sanitized inputs, the raw copies may remain benign in practice. But the publication boundary itself does not enforce that invariant, and the scorer explicitly prefers root metadata over sanitized derived fields.
- **Final severity:** P1
- **Confidence:** 0.95
- **Downgrade trigger:** Downgrade if an unseen normalization step sanitizes recommendation redirect metadata before any MCP/bridge JSON leaves the process, or if root `graph-metadata.json.redirect_*` fields are schema-validated and sanitized universally before projection.

### P2

None.

## Traceability Checks

- **A7 sanitizer on write boundaries:** Verified for derived metadata generation and anti-stuffing rejection at the write path (`sanitizeDerivedValue`, `applyAntiStuffing`, `syncDerivedMetadata`) with regression coverage in `tests/lifecycle-derived-metadata.vitest.ts`. Evidence: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/sanitizer.ts:41-80`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/anti-stuffing.ts:48-97`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/sync.ts:75-115`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/lifecycle-derived-metadata.vitest.ts:215-239`
- **MCP handler privacy / prompt leakage:** Recommend/status/shim/plugin tests cover prompt text suppression and HMAC cache keys, but they do not cover prompt-safe sanitization for redirect metadata in the native JSON path. Evidence: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/prompt-cache.ts:61-74`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-recommend.vitest.ts:113-127`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-status.vitest.ts:73-82`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts:53-62`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/plugin-bridge.vitest.ts:52-61`
- **Adversarial-stuffing rejection:** Verified in both fixture validation and core anti-stuffing logic. Evidence: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts:157-192`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/anti-stuffing.ts:58-97`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/lifecycle-derived-metadata.vitest.ts:225-239`

## Verdict

**CONDITIONAL.** No new P0 surfaced, but `R22-P1-001` shows the native MCP/compat JSON publication path still relies on upstream data discipline instead of enforcing prompt-safe redirect sanitization at the final envelope boundary.

## Next Dimension

Traceability.
