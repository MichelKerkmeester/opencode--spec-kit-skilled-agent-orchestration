# Iteration 1 — correctness

## Files Reviewed

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/review/027-skill-graph-daemon-and-advisor-unification-pt-01/deep-review-strategy.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/003-native-advisor-core/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/004-mcp-advisor-surface/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/005-compat-migration-and-bootstrap/spec.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-hook-package/002-skill-graph-daemon-and-advisor-unification/006-promotion-gates/spec.md`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-status.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/fusion.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/weights-config.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/projection.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/ambiguity.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/attribution.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/gate-bundle.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/promotion/semantic-lock.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/python-ts-parity.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-validate.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/promotion/promotion-gates.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/shim.vitest.ts`
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py`
- `.opencode/plugins/spec-kit-skill-advisor.js`
- `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs`

## Findings by Severity (P0/P1/P2)

### P0

- None.

### P1

#### R1-P1-001 — `advisor_validate` reports unmeasured deterministic gates as passing

- **Claim:** The exposed `advisor_validate` surface does not actually measure all of the deterministic slices it reports; it hard-codes passing values for explicit-skill regression and regression-suite status, so callers can receive a green validation result without those gates ever being exercised.
- **Evidence refs:** `.../004-mcp-advisor-surface/spec.md:90-99`; `.../handlers/advisor-validate.ts:180-193`; `.../handlers/advisor-validate.ts:223-244`; `.../tests/handlers/advisor-validate.vitest.ts:7-41`.
- **Counterevidence sought:** I looked for any imported parity harness or compat-regression runner inside `advisor-validate.ts` and for tests that asserted measured values rather than schema presence. I only found local corpus counting plus synthetic fixture booleans; the handler never invokes the parity suite in `tests/parity/python-ts-parity.vitest.ts` or any command-bridge regression harness.
- **Alternative explanation:** This could have been intended as a temporary schema scaffold while the real validation runner was still being wired up, but the phase is marked complete and the tool is already exposed as the authoritative MCP validation surface.
- **Final severity:** P1
- **Confidence:** 0.98
- **Downgrade trigger:** Downgrade if a higher-level publish path injects measured explicit-regression and compat-regression results before `advisor_validate` output is returned to users.

#### R1-P1-002 — promotion approval omits required §11 gate slices

- **Claim:** The promotion bundle can pass a candidate without checking several required correctness gates from the Phase 027 spec: UNKNOWN ceiling, explicit-skill regression, ambiguity stability, derived-lane attribution completeness, adversarial-stuffing rejection, and lifecycle redirect/archive/rollback slices are all absent from the gate evaluator inputs and logic.
- **Evidence refs:** `.../006-promotion-gates/spec.md:62-76`; `.../006-promotion-gates/spec.md:89-97`; `.../lib/promotion/gate-bundle.ts:24-54`; `.../lib/promotion/gate-bundle.ts:81-129`; `.../tests/promotion/promotion-gates.vitest.ts:110-140`.
- **Counterevidence sought:** I checked the gate-bundle input schema and tests for an upstream aggregator that might supply or enforce the omitted slices elsewhere. The evaluator only accepts the seven coarse inputs shown in `gate-bundle.ts`, and the tests explicitly assert `result.gates` has length 7, so the missing slices are not being checked by this promotion path.
- **Alternative explanation:** The phrase "all 7 gate criteria" in `006/spec.md` may have been treated as seven umbrella categories rather than the full bullet list beneath them, but the current implementation lacks the data needed to enforce the omitted sub-gates at all.
- **Final severity:** P1
- **Confidence:** 0.97
- **Downgrade trigger:** Downgrade if a separate promotion orchestrator blocks approval unless the omitted §11 slices are evaluated and merged with this bundle before any live-weight decision.

### P2

#### R1-P2-001 — MCP advisor tool contracts are narrower than the packet spec

- **Claim:** The shipped tool schemas/handlers omit required response fields from the Phase 027/004 contract: `advisor_recommend` does not expose freshness trust state, and `advisor_status` does not expose skill count or last scan time.
- **Evidence refs:** `.../004-mcp-advisor-surface/spec.md:88-99`; `.../schemas/advisor-tool-schemas.ts:45-76`; `.../handlers/advisor-recommend.ts:79-106`; `.../handlers/advisor-status.ts:65-93`.
- **Counterevidence sought:** I checked both the strict Zod schemas and the handler implementations for alternate field names carrying the same data. `freshness`/`generation` are present, but there is no `trustState` in `advisor_recommend` and no `skillCount`/`lastScanTime` equivalent in `advisor_status`.
- **Alternative explanation:** This may be deliberate scope trimming after the spec was written, but I did not find a superseding packet note or schema alias documenting that change.
- **Final severity:** P2
- **Confidence:** 0.90
- **Downgrade trigger:** Downgrade if a superseding contract or ADR narrowed the public MCP surface after `004/spec.md` was authored.

## Traceability Checks

- Checked correctness against Phase 027 parent spec plus child specs `003`, `004`, `005`, and `006`.
- Verified the deterministic-gate source of truth is still the parity/benchmark path in `tests/parity/python-ts-parity.vitest.ts:100-175` and not the MCP validation handler.
- Confirmed the promotion review surface currently enforces only the seven gates encoded in `lib/promotion/gate-bundle.ts`, matching its tests rather than the fuller §11 bullet list in the packet spec.
- Confirmed compat surfaces preserve the native-routing bridge and legacy array translation (`skill_advisor.py:294-343`), but those paths do not close the validation/promotion gaps above.
- ADR-007 parity intent appears preserved in the parity test (`pythonCorrect`/`regressions` checks), but that intent is not fully surfaced through `advisor_validate`.

## Verdict

**CONDITIONAL.** No new P0s, but two new P1 correctness gaps remain: the published validation endpoint can report unmeasured gates as passing, and the promotion bundle can approve a candidate without enforcing the full required deterministic slice set.

## Next Dimension

**security** — focus on A7 sanitizer coverage, prompt-safe handler behavior, and adversarial-stuffing rejection at every write/publication boundary.
