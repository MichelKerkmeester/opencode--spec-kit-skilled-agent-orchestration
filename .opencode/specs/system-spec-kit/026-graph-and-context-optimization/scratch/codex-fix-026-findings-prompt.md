# Codex CLI Prompt — Fix all 6 P1 findings from 026 deep review

You are running as codex CLI (`gpt-5.4`, `reasoning_effort=high`, `service_tier=fast`, `sandbox=workspace-write`). This prompt is self-contained — you have no prior conversation context. Read the files I name, fix what I describe, run the verification commands at the end, report results in the exact format at the bottom.

## SCOPE

Fix all 6 P1 findings from the 026-graph-and-context-optimization deep review (canonical source: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/review-report.md`). Findings cluster on 4 packets: **009, 011, 012, 013**. Five other packets (005, 006, 007, 008, 010) are clean and must NOT regress.

There are **6 lanes** below. Execute them in the listed order — Lanes 1 and 2 are security gaps and ship first; the remaining 4 are correctness/honesty fixes. Each lane is self-contained with problem, evidence, fix, test additions, and doc updates.

## PRE-APPROVALS (do not ask)

- Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/` (PRE-APPROVED, skip Gate 3)
- Skill routing: pre-decided implementation work, skip Gate 2
- Sandbox: workspace-write, all named files in scope are pre-authorized
- This is a remediation task following an approved deep review; you are pre-authorized to modify the named files only

## MANDATORY READS (read once at start)

1. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/review-report.md` (the source of truth for the findings — read in full before starting)
2. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/deep-review-findings-registry.json` (machine-readable finding records with full evidenceRefs)
3. The current state of every file you are about to modify (do NOT edit blind)
4. `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/006-research-memory-redundancy/spec.md` §3A Downstream Impact Map (alignment contract — do NOT change packets classified "No change")

## REMEDIATION LANES (execute in this order)

### LANE 1 — Cross-session cached continuity leak (DR-026-I006, security, packets 002+012 cross-cut)

**Problem**: `loadMostRecentState()` in `mcp_server/hooks/claude/hook-state.ts:91-99` picks the newest hook-state file in the entire project by mtime. Three callsites pass no scope filter, so session A startup can surface session B's cached continuity summary. Cross-session leakage risk; violates `012/spec.md` REQ-002 (scope check) and REQ-007 (explicit invalidation).

**Affected files**:
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts:91-99` (the resolver)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:346` (callsite 1)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:467` (callsite 2)
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:121` (callsite 3)

**Fix**:
1. Add an optional `scope` parameter to `loadMostRecentState({ specFolder?: string; claudeSessionId?: string })`. When `scope` is provided, filter the candidate hook-state files to those whose persisted producer metadata matches `specFolder` and/or `claudeSessionId`.
2. Update the 3 callsites to pass scope:
   - `session-resume.ts:346` — derive scope from the resume request's `specFolder`/`sessionId` fields
   - `session-resume.ts:467` — same
   - `session-prime.ts:121` — derive from the active SessionStart event payload
3. If scope cannot be derived from the call context (true bare startup with no session id yet), default to **fail-closed**: return null and emit a structured log entry naming the rejection reason (`scope_unknown_fail_closed`).

**Test**: Add a vitest case to `mcp_server/tests/hook-state.vitest.ts` (or create `tests/hook-state-scope-isolation.vitest.ts`) where two sessions write parallel hook-state files with different `specFolder` values. Assert session A's `loadMostRecentState({ specFolder: "A" })` returns A's state, NOT B's. Add a case for the fail-closed default when no scope is derivable.

**Doc update**: Edit `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-cached-sessionstart-consumer-gated/spec.md` REQ-002 (freshness gate) and REQ-007 (explicit invalidation) to make scope-binding required at the candidate-selection level, not just at the gate level. Re-run `validate.sh --strict` on the 012 packet folder.

---

### LANE 2 — Bootstrap fail-closed on errored resume (DR-026-I005, security, cross-cuts 005/011/012)

**Problem**: When `handleSessionResume()` throws inside `session-bootstrap.ts:201`, the resume payload is reduced to `{ error }` but `session-bootstrap.ts:258` still calls `attachStructuralTrustFields(resumeData, ...)`, attaching synthesized trust to an errored object. That widens trust authority instead of failing closed.

**Affected file**: `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:201-258`

**Fix**:
1. After the resume try/catch, check `resumeData.error`. If set, do NOT call `attachStructuralTrustFields(resumeData, ...)`.
2. Keep the local-snapshot trust on the `structuralContextWithTrust` payload section (which is the structural-context section, distinct from the resume section). That stays valid because it's derived from the local graph snapshot, not from a failed remote call.
3. Optionally introduce a new payload section name (e.g., `'structural-snapshot'`) that explicitly carries the local-derived trust separate from the (errored) resume section. Document the section in code comments.

**Test**: Add a vitest case to `mcp_server/tests/hook-session-start.vitest.ts` (or a new `tests/session-bootstrap-error-fail-closed.vitest.ts`) that:
- Mocks `handleSessionResume` to throw a synthetic error
- Calls the bootstrap path
- Asserts the resulting bootstrap payload does NOT carry `structuralTrust` on the errored resume section
- Asserts the structural-context section still carries valid trust from the local snapshot

---

### LANE 3 — Packet 011 resume trust preservation (DR-026-I001, packet 011)

**Problem**: `session-resume.ts:533` emits the `structural-context` section with `certainty` only — no `structuralTrust`. `session-bootstrap.ts:251` then synthesizes trust from a local snapshot via the `??` fallback (`extractStructuralTrustFromPayload(resumePayload) ?? buildStructuralContextTrust(structuralContext)`). Packet 011's spec REQ-002 + impl-summary lines 36/46/79 claim end-to-end resume trust preservation; the runtime does NOT satisfy that claim. The graph-payload-validator vitest at `tests/graph-payload-validator.vitest.ts:138` mocks the resume payload with `structuralTrust` already attached, hiding the gap.

**Affected files**:
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:525-540` (the structural-context section emission)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:251` (the `??` fallback)
- `.opencode/skill/system-spec-kit/mcp_server/tests/graph-payload-validator.vitest.ts:138` (the mock that hides the gap)

**Fix**:
1. In `session-resume.ts`, build a `StructuralTrust` envelope for the structural-context section. Use the same `buildStructuralContextTrust(structuralContext)` helper that bootstrap currently uses (import from `mcp_server/lib/context/shared-payload.ts` if needed). Attach it to the structural-context payload section emitted at line 533, alongside `certainty`.
2. In `session-bootstrap.ts:251`, REMOVE the `??` fallback. Trust must come from `extractStructuralTrustFromPayload(resumePayload)` only. If extraction returns null AND `resumeData.error` is not set, that's a contract violation — throw a `StructuralTrustPayloadError` from `shared-payload.ts`. (If `resumeData.error` IS set, fall through to Lane 2's fail-closed behavior.)
3. Update `tests/graph-payload-validator.vitest.ts:138` — replace the mock that pre-stuffs `structuralTrust` with a real call to `handleSessionResume()` (mocking only the underlying data dependencies, not the handler itself). Assert the resume payload carries `structuralTrust` AND that bootstrap consumes it without falling back.

**Doc update**: Verify `011/spec.md` REQ-002 and `011/implementation-summary.md` lines 36/46/79 now match shipped behavior. If the runtime fix is correct, no doc rewrite is needed — just confirm alignment.

---

### LANE 4 — Packet 012 real-handler integration test (DR-026-I002, packet 012)

**Problem**: `scripts/tests/session-cached-consumer.vitest.ts.test.ts:6` imports only the helper-level gate/additive functions and scores a handcrafted baseline object. The test never instantiates `session_resume`, `session_bootstrap`, or `session-prime`. Packet 012's spec REQ-005 + REQ-008 + SC-004 + impl-summary lines 35/47/81 claim "frozen corpus equal-or-better" against live reconstruction — that claim is unverified against the named consumer surfaces.

**Affected files**:
- `.opencode/skill/system-spec-kit/scripts/tests/session-cached-consumer.vitest.ts.test.ts` (extend with integration tests, do NOT replace existing helper tests)
- Reference for test harness: `mcp_server/tests/hook-session-stop-replay.vitest.ts` (this is the existing pattern for mounting producer artifacts via hook-state)

**Fix**:
1. Keep all existing helper-level tests in `session-cached-consumer.vitest.ts.test.ts`. ADD new integration test cases below them.
2. New cases should:
   - Import `handleSessionResume` from `mcp_server/handlers/session-resume.ts`
   - Import the bootstrap path from `mcp_server/handlers/session-bootstrap.ts`
   - Import the prime hook from `mcp_server/hooks/claude/session-prime.ts`
3. For each scenario in the existing frozen corpus (1 stale, 1 scope-mismatch, 1 fidelity-failure, 1 valid):
   - Mount the producer artifact via the hook-state path (use the harness pattern from `tests/hook-session-stop-replay.vitest.ts`)
   - Call the real handler chain
   - Assert the cached path is accepted/rejected per scenario expectation
   - Compare the resulting payload's pass count against a live-reconstruction baseline that uses the same scenario but no cached state
4. The integration tests must demonstrably FAIL if the cached path returned the wrong outcome — i.e., not just check that gate functions return what they always return.

**Doc update**: Verify `012/spec.md` REQ-005, REQ-008, SC-004 + `012/implementation-summary.md` lines 35/47/81 now match shipped test coverage.

---

### LANE 5 — Packet 013 falsifiable benchmark (DR-026-I003, packet 013)

**Problem**: `mcp_server/lib/eval/warm-start-variant-runner.ts:82` defines `REQUIRED_FINAL_FIELDS = [title, triggers, evidenceBullets, continuationState, decisionRecordPointer, implementationSummaryPointer, followUpResolution]` — all 7 wrapper-derived fields populated by every scenario regardless of variant. Pass-rate is constant by construction (28/28 across all variants in `scratch/benchmark-matrix.md`). The R8 / REQ-006 "equal-or-better pass rate" gate is unfalsifiable. The benchmark reports cost dominance but cannot detect a pass-rate regression.

**Affected files**:
- `.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:82-90` (REQUIRED_FINAL_FIELDS)
- `.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:191` (variant runner logic)
- `.opencode/skill/system-spec-kit/mcp_server/lib/eval/warm-start-variant-runner.ts:215` (scoring function)
- `.opencode/skill/system-spec-kit/scripts/tests/warm-start-bundle-benchmark.vitest.ts.test.ts:176` (corpus)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-warm-start-bundle-conditional-validation/scratch/benchmark-matrix.md` (rewrite output)

**Fix**:
1. Add new scoring fields that vary per variant. Required additions:
   - `cachedReuseAccepted: boolean` — true only when the cached path was actually consumed (not just present)
   - `followUpResolutionAccuracy: number` (0-1) — how well the variant answered the follow-up task on this scenario
   - `liveReconstructionParity: boolean` — true when the variant matches a live baseline reference for this scenario
2. Add at least ONE corpus scenario where the cached path is REJECTED (e.g., scope mismatch from Lane 1) AND the live reconstruction also produces a degraded follow-up. A correctly-scored bundle should detect this and lose pass-rate.
3. Update the scoring function so pass-rate counts these new fields, not just wrapper completeness. Pass-rate must vary per variant on the rejection scenario.
4. Re-run the benchmark and rewrite `scratch/benchmark-matrix.md` with honest numbers (cost AND pass-rate, both varying per variant). The matrix must show the rejection scenario has different pass-rate per variant.
5. If the bundle no longer dominates baseline+component-only after the rewrite, that's the honest answer — update `013/implementation-summary.md` to reflect the truth (don't hide a regression).

**Doc update**: Update `013/implementation-summary.md` benchmark matrix section with the new numbers. Re-run `validate.sh --strict` on the 013 packet folder.

---

### LANE 6 — Packet 009 publication consumer (DR-026-I004, packet 009)

**Problem**: `lib/context/publication-gate.ts:47` ships as a helper. `tests/publication-gate.vitest.ts:3` is a unit test. NO handler in `mcp_server/handlers/` consumes the helper. Spec REQ-001/REQ-002 + SC-001/SC-002 require handler-level publication output behavior with surfaced exclusion reasons. The codex implementer's own LIMITATIONS section admitted "no row-oriented export handler exists yet" — but the packet was still marked Implemented.

**Affected files**:
- `.opencode/skill/system-spec-kit/mcp_server/lib/context/publication-gate.ts` (existing helper, KEEP unchanged)
- One reporting handler to wire up — pick ONE of:
  - **Option A (preferred)**: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` — already shapes response payloads
  - **Option B**: Create a minimal `.opencode/skill/system-spec-kit/mcp_server/handlers/export.ts` if no existing handler fits cleanly
- `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-search.vitest.ts` (or new tests for the chosen handler)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-auditable-savings-publication-contract/implementation-summary.md` (remove the LIMITATIONS admission)

**Fix**:
1. Pick the consumer (Option A unless `memory-search.ts` doesn't fit — explain why in BLOCKERS if you go Option B).
2. **Option A**: In `memory-search.ts`, after rows are assembled but before the response is returned, run each row through `publicationGate.evaluate(row)` (or whatever the exported function name is). Annotate excluded rows with their `exclusionReason` field. Either filter excluded rows out (configurable via env var with default = false to preserve current behavior) OR include them with the reason flagged so consumers can decide.
3. **Option B**: Create a thin handler that takes a row list and returns `{ publishable: Row[], excluded: { row: Row, reason: string }[] }`. Wire it into the MCP server router via the existing handler registration pattern.
4. Add tests:
   - A row with all required fields → publishable
   - Missing methodology → excluded with reason `missing_methodology`
   - Missing schema version → excluded with reason `missing_schema_version`
   - Missing provenance → excluded with reason `missing_provenance`
   - A row using a non-005 certainty status → excluded with reason `unsupported_certainty`
   - A multiplier row that lacks provider-counted authority → excluded via 005's `canPublishMultiplier` (cross-check 005's contract is actually called)

**Doc update**: Edit `009/implementation-summary.md` to remove the LIMITATIONS line that admitted the consumer didn't exist. Update REQ-001/REQ-002 verification rows to point at the new handler test names.

---

## VERIFICATION (run after each lane AND at the very end)

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

# Re-run validate.sh on the 4 affected packets
for pkt in 009-auditable-savings-publication-contract \
           011-graph-payload-validator-and-trust-preservation \
           012-cached-sessionstart-consumer-gated \
           013-warm-start-bundle-conditional-validation; do
  echo "=== $pkt ==="
  bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict \
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/$pkt"
done
```

ALL of the above MUST PASS. The 5 clean packets' tests (005/006/007/008/010 — covered via `shared-payload-certainty.vitest.ts`, `structural-trust-axis.vitest.ts`, `graph-first-routing-nudge.vitest.ts`, `sqlite-fts.vitest.ts`, `detector-regression-floor.vitest.ts.test.ts`) MUST continue to pass — they are the regression guard.

## CONSTRAINTS

- **READ FIRST**: read every file you're about to modify, in current state, before editing it.
- **SCOPE LOCK**: only touch the files named in the lanes above + the packet-local docs (`spec.md`, `implementation-summary.md`, `checklist.md`, `tasks.md`, `plan.md`) for **009/011/012/013 only**. Do NOT touch any file in 005/006/007/008/010 or any other packet folder.
- **ADDITIVE ONLY** for shared files: `shared-payload.ts`, `session-bootstrap.ts`, `contracts/README.md`, and `ENV_REFERENCE.md` are touched by multiple packets. Do NOT delete or weaken anything those packets shipped — only ADD on top of existing structure.
- **DO NOT** introduce a new subsystem, new owner surface, new agent, or new skill. The fixes are bounded patches to existing code.
- **DO NOT** weaken or delete existing tests. Add new tests; only modify existing tests when a lane explicitly requires it (Lane 3 modifies `graph-payload-validator.vitest.ts:138`).
- **DO NOT** modify the wrapper-contract runtime owned by `003-memory-quality-issues/006-memory-duplication-reduction/` or anything in the `001-research-graph-context-systems/` research tree.
- **DO NOT** commit. Leave all changes uncommitted for the operator to review.
- **HONESTY**: If a lane cannot be implemented (e.g., a dependency you need doesn't exist, or the named line numbers don't match the current state), report the blocker in the BLOCKERS section, leave that lane unfinished, and proceed to the next lane. Do NOT fall back to the doc-only-rewrite path unless I explicitly approve it after seeing your blocker report.
- **ALIGNMENT**: Per the 006-research-memory-redundancy §3A Downstream Impact Map, packets 005/006/007/008/009/010/011 are classified "No change" with respect to the wrapper contract — none of your fixes may modify the memory save generator, collector, body template, or memory-template-contract.

## OUTPUT FORMAT (print at the very end)

```
=== FIX_026_FINDINGS_RESULT ===
LANE_1_DR_I006_SCOPE_LEAK:    DONE | BLOCKED | DEFERRED  (notes)
LANE_2_DR_I005_FAIL_CLOSED:   DONE | BLOCKED | DEFERRED  (notes)
LANE_3_DR_I001_011_TRUST:     DONE | BLOCKED | DEFERRED  (notes)
LANE_4_DR_I002_012_CORPUS:    DONE | BLOCKED | DEFERRED  (notes)
LANE_5_DR_I003_013_BENCH:     DONE | BLOCKED | DEFERRED  (notes)
LANE_6_DR_I004_009_CONSUMER:  DONE | BLOCKED | DEFERRED  (notes)

FILES_MODIFIED: <newline-separated list>
NEW_TESTS_ADDED: <newline-separated list>
TYPECHECK: PASS | FAIL
VITEST: PASS | FAIL (test counts: <passed>/<failed>)
VALIDATE_SH:
  009: PASS | FAIL
  011: PASS | FAIL
  012: PASS | FAIL
  013: PASS | FAIL
PRIOR_PACKETS_REGRESSED: yes | no   (5 clean packets — 005/006/007/008/010 — must stay clean)
BLOCKERS: <list or "none">
NEXT_REVIEW_RECOMMENDATION: re-run /spec_kit:deep-review on 026 with maxIterations=10 convergenceThreshold=0.05 to verify the fixes hold
=== END_FIX_026_FINDINGS_RESULT ===
```

Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/` (pre-approved, skip Gate 3)
