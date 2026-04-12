---
title: "Deep Review Iteration 016 — Verification of 6 P1 Fixes"
iteration: 016
dimension: D1 Correctness + D2 Security
session_id: 2026-04-09T03:59:45Z
timestamp: 2026-04-09T08:27:12Z
status: insight
---

# Iteration 016 — Verification of 6 P1 Fixes

## Focus
This iteration verified the uncommitted remediation against the six P1 findings recorded in `review-report.md` and `deep-review-findings-registry.json`. The verification standard was runtime-first: confirm the fix exists in the current owner file, confirm additive test coverage exists that would fail if the fix were reverted, run the required typecheck and vitest suites, and re-run strict packet validation for both the four remediated packets and the five packets that were previously clean.

## Files Reviewed
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/review-report.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/deep-review-findings-registry.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/deep-review-config.json`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/publication-gate.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-first-routing-nudge.vitest.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tests/sqlite-fts.vitest.ts`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/009-auditable-savings-publication-contract/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/011-graph-payload-validator-and-trust-preservation/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/012-cached-sessionstart-consumer-gated/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/013-warm-start-bundle-conditional-validation/implementation-summary.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/research-governance-contracts/013-warm-start-bundle-conditional-validation/scratch/benchmark-matrix.md`

## Per-Finding Verdict

### DR-026-I001 — Packet 011 resume trust preservation
Status: `RESOLVED`

`session-resume.ts` now emits `structuralTrust` on the `structural-context` section instead of certainty-only output, and `session-bootstrap.ts` no longer synthesizes trust through the previous `??` fallback on non-error paths. The bootstrap consumer now requires `extractStructuralTrustFromPayload(resumePayload)` to succeed or throws `StructuralTrustPayloadError`, which closes the original spec/runtime gap instead of masking it. The regression test in `tests/graph-payload-validator.vitest.ts` now drives the real `handleSessionResume()` and `handleSessionBootstrap()` chain rather than a pre-stuffed mock, so reverting the resume emission would break the test.

### DR-026-I002 — Packet 012 frozen corpus integration
Status: `RESOLVED`

`scripts/tests/session-cached-consumer.vitest.ts.test.ts` retains the helper-level tests and adds handler-level integration coverage for `handleSessionResume`, `handleSessionBootstrap`, and the `handleStartup` prime path. The four required frozen scenarios (`stale`, `scope mismatch`, `fidelity failure`, `valid`) are mounted through real hook-state artifacts and compared against a live-reconstruction baseline with the same scenario but no cached state. The assertions check both accept/reject behavior and pass-count parity, so the test would fail if cached behavior diverged from live.

### DR-026-I003 — Packet 013 falsifiable benchmark
Status: `RESOLVED`

`warm-start-variant-runner.ts` now scores variant-sensitive fields (`cachedReuseAccepted`, `followUpResolutionAccuracy`, `liveReconstructionParity`) rather than wrapper-completeness-only proxies. The benchmark corpus includes a rejection scenario that changes pass-rate depending on the variant, and `tests/warm-start-bundle-benchmark.vitest.ts.test.ts` asserts non-constant totals across variants. The published matrix in `013/.../scratch/benchmark-matrix.md` is now falsifiable and honest: the rejection scenario shows different pass outcomes per variant instead of invariant 28/28 style reporting.

### DR-026-I004 — Packet 009 publication consumer
Status: `RESOLVED`

`memory-search.ts` is now the live consumer for `publication-gate.ts`. The gate is applied in `applyPublicationGateToResponse()` after response row shaping, and the result is threaded back into the returned payload via `publishable` / `exclusionReason` annotations. `tests/handler-memory-search.vitest.ts` adds the required cases for missing methodology, schema version, provenance, unsupported certainty, and multiplier authority failure, so reverting the handler wiring would be observable.

### DR-026-I005 — Bootstrap fail-closed on errored resume
Status: `RESOLVED`

`session-bootstrap.ts` now branches explicitly on `resumeData.error` before any trust attachment. Errored resume payloads are left unannotated, while the independently derived structural snapshot keeps its own trust metadata on the structural-context section. `tests/hook-session-start.vitest.ts` now mocks `handleSessionResume()` to throw and asserts that the errored resume branch does not carry `structuralTrust`, which directly exercises the original failure mode. I did not find another path in `session-bootstrap.ts` that re-attaches trust to an errored resume object.

### DR-026-I006 — Cross-session cached continuity leak
Status: `RESOLVED`

`loadMostRecentState()` now requires a scope binding (`specFolder` and/or `claudeSessionId`) for selection and fails closed with a structured `scope_unknown_fail_closed` rejection when no scope can be derived. All three callsites now pass scope, including the startup path in `session-prime.ts`, which binds to the real `SessionStart` payload (`session_id` and optional `specFolder`) rather than a synthetic placeholder. `tests/hook-state.vitest.ts` proves both scoped isolation and the fail-closed behavior, so reverting to unscoped global-mtime selection would fail the suite.

## Regression Check Results
All five packets that were clean in the original review remained clean.

| Packet | Result | Verification |
|--------|--------|--------------|
| `005-provisional-measurement-contract` | CLEAN | strict validator passed; `shared-payload.ts` still exports `SHARED_PAYLOAD_CERTAINTY_VALUES` and `canPublishMultiplier` |
| `006-structural-trust-axis-contract` | CLEAN | strict validator passed; `ParserProvenance`, `EvidenceStatus`, and `FreshnessAuthority` remain distinct types |
| `007-detector-provenance-and-regression-floor` | CLEAN | strict validator passed; `tests/detector-regression-floor.vitest.ts.test.ts` passed unchanged |
| `008-graph-first-routing-nudge` | CLEAN | strict validator passed; `tests/graph-first-routing-nudge.vitest.ts` still enforces advisory-only, readiness-gated nudges |
| `010-fts-capability-cascade-floor` | CLEAN | strict validator passed; `tests/sqlite-fts.vitest.ts` still distinguishes the forced-degrade lexical-path states without overstating `fts4_match` |

## Metrics
- resolvedP1: 6/6
- partialP1: 0/6
- stillOpenP1: 0/6
- newRegressionsP1: 0
- typecheck: PASS
- vitest: PASS (105/0)
- validate.sh packets `005-013`: PASS
- verificationPass: true
