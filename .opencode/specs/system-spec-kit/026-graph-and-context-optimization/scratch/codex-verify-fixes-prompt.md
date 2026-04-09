# Codex CLI Prompt — Verification review of 026 P1 fixes

You are running as codex CLI (`gpt-5.4`, `reasoning_effort=high`, `service_tier=fast`, `sandbox=workspace-write`). This prompt is self-contained — you have no prior conversation context. You are running a **focused verification review pass** on remediation work that just landed for 6 P1 findings from a deep review of the 026 packet family.

This is NOT a fresh deep-review loop. It is a targeted adversarial verification: read each finding's recommended fix from the original review report, read the current state of the cited files, decide whether the fix is RESOLVED / STILL_OPEN / NEW_FINDING. Then run the regression suite. Single iteration, single output.

## SCOPE

Verify all 6 P1 findings from the 026-graph-and-context-optimization deep review (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/review-report.md`) are now resolved by the remediation that just landed (uncommitted in the working tree). Confirm none of the 5 clean packets (005, 006, 007, 008, 010) regressed.

## PRE-APPROVALS (do not ask)

- Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/` (PRE-APPROVED, skip Gate 3)
- Skill routing: pre-decided verification work, skip Gate 2
- Sandbox: workspace-write — but **review target is READ-ONLY**. You may write only to:
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/iterations/iteration-016.md` (the verification iteration file)
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/deep-review-state.jsonl` (append one record)
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/deep-review-findings-registry.json` (rewrite with updated finding statuses)
- This is a verification follow-on to the deep-review session at `2026-04-09T03:59:45Z`. Do not start a new session; treat this as iteration 16 of the same lineage.

## MANDATORY READS (read once at start)

1. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/review-report.md` — sections §3 FINDINGS and §6 REMEDIATION LANES (the source of truth for what each fix should look like)
2. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/deep-review-findings-registry.json` — the 6 finding records with full evidenceRefs
3. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/deep-review-config.json` — for boundaries and session id
4. The current state of every file you spot-check in the verification per-finding section below

## VERIFICATION PROTOCOL (per finding)

For each of the 6 findings below, do exactly this:

1. **Re-read the original evidenceRefs in their CURRENT state** (the codex remediation may have changed the line numbers — search for the surrounding code, not by line number alone)
2. **Verify the recommended fix is present** (the recommendation is in §6 REMEDIATION LANES of review-report.md)
3. **Verify the fix's test coverage** (a new or extended vitest case must exist that would FAIL if the fix were reverted)
4. **Spot-check against the original failure mode** — try to reason about whether the fix actually addresses the root cause, or whether it only addresses the surface symptom
5. **Decide a status**: `RESOLVED` / `PARTIAL` / `STILL_OPEN` / `NEW_REGRESSION_INTRODUCED`
6. **If STILL_OPEN or NEW_REGRESSION_INTRODUCED**: write a typed claim-adjudication packet (same format as the original deep-review iterations) with claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger

### Finding 1 — DR-026-I006 (security, cross-session leak)
- **Original symptom**: `loadMostRecentState()` in `hook-state.ts` selected newest hook-state by mtime project-wide; 3 unscoped callsites in `session-resume.ts` and `session-prime.ts`
- **Verify**: `loadMostRecentState()` now requires a scope parameter (specFolder and/or claudeSessionId). When scope is missing, function returns null with a structured log entry naming `scope_unknown_fail_closed`. All 3 callsites pass scope. New vitest case proves cross-session isolation (session A only sees A's state).
- **Spot-check**: trace the data flow from a real bare SessionStart event into `session-prime.ts:121` — does the scope come from a real source or is it a placeholder?

### Finding 2 — DR-026-I005 (security, bootstrap fail-closed)
- **Original symptom**: `session-bootstrap.ts:201-258` attached synthesized `structuralTrust` to errored resume payloads via `attachStructuralTrustFields(resumeData, ...)` even when `resumeData.error` was set
- **Verify**: When `resumeData.error` is truthy, `attachStructuralTrustFields(resumeData, ...)` is NOT called. The local-snapshot trust still attaches to the structural-context payload section (which is separate from the resume section). New vitest case mocks `handleSessionResume` to throw and asserts the errored resume payload does NOT carry `structuralTrust`.
- **Spot-check**: are there any other code paths in `session-bootstrap.ts` that could attach trust to an errored payload?

### Finding 3 — DR-026-I001 (correctness, packet 011 resume trust preservation)
- **Original symptom**: `session-resume.ts:533` emitted structural-context with `certainty` only, no `structuralTrust`. `session-bootstrap.ts:251` synthesized trust from local snapshot via `??` fallback. Test `tests/graph-payload-validator.vitest.ts:138` used a mock that pre-stuffed `structuralTrust`, hiding the gap.
- **Verify**: `session-resume.ts` now emits `structuralTrust` on the structural-context payload section. The `??` fallback in `session-bootstrap.ts` is removed — bootstrap requires `extractStructuralTrustFromPayload(resumePayload)` to return a real value on non-error paths, otherwise throws `StructuralTrustPayloadError`. The graph-payload-validator vitest test no longer relies on a pre-stuffed mock; it exercises the real handler chain.
- **Spot-check**: is there any code path where `session-resume.ts` could emit a structural-context section WITHOUT `structuralTrust`? Are all branches of the resume builder covered?

### Finding 4 — DR-026-I002 (correctness, packet 012 frozen corpus integration)
- **Original symptom**: `scripts/tests/session-cached-consumer.vitest.ts.test.ts:6` imported only helper-level functions; never instantiated `session_resume`, `session_bootstrap`, or `session-prime`
- **Verify**: The test file now contains integration cases that instantiate the real `handleSessionResume`, `handleSessionBootstrap`, and the prime hook. The 4 frozen scenarios (stale, scope-mismatch, fidelity-failure, valid) are exercised through the real handler chain. The existing helper-level cases were preserved (additive, not replaced).
- **Spot-check**: does the integration test compare cached-path output against a live-reconstruction baseline that uses the same scenario but no cached state? If yes, would the test FAIL if cached behavior diverged from live?

### Finding 5 — DR-026-I003 (correctness, packet 013 falsifiable benchmark)
- **Original symptom**: `warm-start-variant-runner.ts:82` defined `REQUIRED_FINAL_FIELDS` as 7 wrapper-derived fields populated by every scenario regardless of variant. Pass-rate was constant by construction (28/28 across all variants).
- **Verify**: New scoring fields exist that VARY per variant (e.g., `cachedReuseAccepted`, `followUpResolutionAccuracy`, `liveReconstructionParity`). The corpus has at least one rejection scenario (e.g., scope mismatch) where cached path is rejected and live reconstruction is degraded. The benchmark matrix in `scratch/benchmark-matrix.md` shows pass-rate VARYING per variant on the rejection scenario (i.e., not constant).
- **Spot-check**: read `scratch/benchmark-matrix.md` — is the matrix honest? Does the rejection scenario show different pass-rates per variant? If the bundle no longer dominates, has 013's `implementation-summary.md` been updated to reflect that?

### Finding 6 — DR-026-I004 (correctness, packet 009 publication consumer)
- **Original symptom**: `lib/context/publication-gate.ts:47` shipped as a helper. NO handler in `mcp_server/handlers/` consumed it. Spec REQ-001/REQ-002 + SC-001/SC-002 required handler-level enforcement.
- **Verify**: A real handler (recommended `memory-search.ts`) now calls `publication-gate` evaluation on its rows. The handler annotates excluded rows with `exclusionReason`. New tests cover: pass row, missing methodology, missing schema version, missing provenance, non-005 certainty status, multiplier row without authority. Packet 009's `implementation-summary.md` LIMITATIONS section no longer admits the consumer doesn't exist.
- **Spot-check**: trace the data flow — when a row hits `memory-search.ts`, where exactly is `publication-gate` invoked? Is the gate result threaded through to the response payload?

## REGRESSION CHECK (5 clean packets must stay clean)

For each of the 5 packets that PASSED clean in the original review (005, 006, 007, 008, 010):

1. Run the packet's strict validator: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/{packet}"` — must PASS with errors=0 warnings=0
2. Confirm the packet's test files still PASS (covered in the verification commands below)
3. **Critical**: confirm that none of the lane fixes from this remediation accidentally weakened the contracts those packets shipped:
   - 005: `CertaintyStatus` vocabulary still in shared-payload.ts, `canPublishMultiplier` still exported
   - 006: `ParserProvenance`/`EvidenceStatus`/`FreshnessAuthority` types still separate (NOT collapsed into a single scalar)
   - 007: detector regression floor test still runs and passes
   - 008: graph-first routing nudge is still advisory-only and readiness-gated
   - 010: FTS lexical-path metadata still distinguishes the 4 forced-degrade cases without overstating `fts4_match`

If any of these contracts have been weakened by the remediation, that is a NEW_REGRESSION_INTRODUCED finding and must be flagged as P1.

## VERIFICATION COMMANDS (run all, all must PASS)

```bash
cd .opencode/skill/system-spec-kit/mcp_server
TMPDIR=./.tmp/tsc-tmp npm run typecheck
TMPDIR=./.tmp/vitest-tmp npx vitest run \
  tests/hook-state.vitest.ts \
  tests/hook-session-start.vitest.ts \
  tests/hook-session-stop.vitest.ts \
  tests/hook-session-stop-replay.vitest.ts \
  tests/session-token-resume.vitest.ts \
  tests/shared-payload-certainty.vitest.ts \
  tests/structural-trust-axis.vitest.ts \
  tests/graph-payload-validator.vitest.ts \
  tests/graph-first-routing-nudge.vitest.ts \
  tests/sqlite-fts.vitest.ts \
  tests/handler-memory-search.vitest.ts \
  tests/publication-gate.vitest.ts
cd -

cd .opencode/skill/system-spec-kit/scripts
TMPDIR=./.tmp/vitest-tmp npx vitest run \
  tests/session-cached-consumer.vitest.ts.test.ts \
  tests/warm-start-bundle-benchmark.vitest.ts.test.ts \
  tests/detector-regression-floor.vitest.ts.test.ts
cd -

# Strict validate.sh on all 9 packets (4 affected + 5 clean)
for pkt in 005-provisional-measurement-contract \
           006-structural-trust-axis-contract \
           007-detector-provenance-and-regression-floor \
           008-graph-first-routing-nudge \
           009-auditable-savings-publication-contract \
           010-fts-capability-cascade-floor \
           011-graph-payload-validator-and-trust-preservation \
           012-cached-sessionstart-consumer-gated \
           013-warm-start-bundle-conditional-validation; do
  bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict --quiet \
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/$pkt" \
    | sed "s/^/[$pkt] /"
done
```

## STATE FILE UPDATES (write these before printing the result block)

1. **Append iteration 16 record to `review/deep-review-state.jsonl`**:
```json
{"type":"iteration","run":16,"mode":"review","status":"insight","focus":"verification-of-6-p1-fixes","dimensions":["D1 Correctness","D2 Security"],"filesReviewed":["<list of files spot-checked>"],"findingsCount":<new findings count>,"findingsSummary":{"P0":0,"P1":<resolved count>,"P2":0},"findingsNew":{"P0":0,"P1":<new regression count>,"P2":0},"traceabilityChecks":{"summary":{"required":6,"executed":6,"pass":<resolved count>,"partial":0,"fail":<still open count>,"blocked":0,"notApplicable":0,"gatingFailures":0},"results":[{"id":"DR-026-I001","status":"RESOLVED|PARTIAL|STILL_OPEN"},{"id":"DR-026-I002",...}, ...]},"newFindingsRatio":<new findings / total>,"timestamp":"<ISO_8601_NOW>","verificationPass":true}
```

2. **Write `review/iterations/iteration-016.md`** with frontmatter + sections: Focus, Files Reviewed, Per-Finding Verdict (one subsection per DR-026-I00N), Regression Check Results, Metrics. Use the same structure as iterations 001-015 but emphasize the verification verdict.

3. **Update `review/deep-review-findings-registry.json`**:
   - Move RESOLVED findings from `openFindings` to `resolvedFindings` (preserve full record, add `resolvedAt: <ISO_8601_NOW>`, `resolvedIteration: 16`)
   - Leave STILL_OPEN findings in `openFindings`
   - Append any NEW_REGRESSION_INTRODUCED findings to `openFindings` with new IDs `DR-026-I016-P1-001`, `DR-026-I016-P1-002`, etc.
   - Update `openFindingsCount`, `resolvedFindingsCount`, `convergenceScore`, `findingsBySeverity`

## CONSTRAINTS

- **READ ONLY for the review target**: do NOT modify any file in `mcp_server/`, `scripts/`, `lib/`, or any 026 packet folder OUTSIDE the `review/` subdirectory.
- **NO new findings invented**: only flag NEW_REGRESSION_INTRODUCED if you have a concrete file:line evidence that a contract from a clean packet has been weakened by the remediation.
- **NO fix work**: this is verification only. Do NOT attempt to fix any STILL_OPEN finding — your job is to verify and report.
- **NO commits**: leave changes uncommitted for the operator to review.
- **TOOL CALL BUDGET**: target 12 tool calls, soft max 16, hard max 20. Verification is more focused than implementation; don't sprawl.
- **HONESTY**: if a finding is partially resolved (e.g., the runtime is fixed but the test is missing), mark it `PARTIAL` not `RESOLVED`. If a finding looks resolved on the surface but the spot-check reveals the fix only addresses the symptom not the root cause, mark it `STILL_OPEN` and explain why.

## OUTPUT FORMAT (print at the very end)

```
=== VERIFY_026_FIXES_RESULT ===
SESSION_LINEAGE: 2026-04-09T03:59:45Z (verification iteration 16)
TIMESTAMP: <ISO_8601_NOW>

PER_FINDING_VERDICT:
  DR-026-I001 (011 resume trust):       RESOLVED | PARTIAL | STILL_OPEN | NEW_REGRESSION  (notes)
  DR-026-I002 (012 corpus integration): RESOLVED | PARTIAL | STILL_OPEN | NEW_REGRESSION  (notes)
  DR-026-I003 (013 falsifiable bench):  RESOLVED | PARTIAL | STILL_OPEN | NEW_REGRESSION  (notes)
  DR-026-I004 (009 publication consumer): RESOLVED | PARTIAL | STILL_OPEN | NEW_REGRESSION  (notes)
  DR-026-I005 (bootstrap fail-closed):  RESOLVED | PARTIAL | STILL_OPEN | NEW_REGRESSION  (notes)
  DR-026-I006 (cross-session leak):     RESOLVED | PARTIAL | STILL_OPEN | NEW_REGRESSION  (notes)

REGRESSION_CHECK (5 clean packets):
  005 measurement contract:           CLEAN | DEGRADED  (notes)
  006 structural trust axis:          CLEAN | DEGRADED  (notes)
  007 detector regression floor:      CLEAN | DEGRADED  (notes)
  008 graph-first routing nudge:      CLEAN | DEGRADED  (notes)
  010 FTS capability cascade floor:   CLEAN | DEGRADED  (notes)

VERIFICATION_TOTALS:
  resolved_p1: <n> of 6
  partial_p1: <n> of 6
  still_open_p1: <n> of 6
  new_regressions_p1: <n>

TYPECHECK: PASS | FAIL
VITEST: PASS | FAIL (test counts: <passed>/<failed>)
VALIDATE_SH:
  005: PASS | FAIL
  006: PASS | FAIL
  007: PASS | FAIL
  008: PASS | FAIL
  009: PASS | FAIL
  010: PASS | FAIL
  011: PASS | FAIL
  012: PASS | FAIL
  013: PASS | FAIL

VERDICT_TRAJECTORY:
  before_remediation: CONDITIONAL (6 P1 findings)
  after_remediation:  PASS | CONDITIONAL | FAIL  (rationale)

NEXT_STEP_RECOMMENDATION:
  - If verdict = PASS: ready to commit + push the remediation
  - If verdict = CONDITIONAL: fix the remaining P1 findings before commit
  - If verdict = FAIL: revert the remediation and re-plan

=== END_VERIFY_026_FIXES_RESULT ===
```

Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/` (pre-approved, skip Gate 3)
