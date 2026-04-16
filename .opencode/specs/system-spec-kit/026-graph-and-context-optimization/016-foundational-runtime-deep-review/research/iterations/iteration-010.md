# Iteration 10 — Compact-cache provenance replay seam (10/10)

## Investigation Thread
I traced how compact-cache provenance is serialized into `pendingCompactPrime.payloadContract`, then replayed back into runtime-visible recovery text across Claude and Gemini hooks. The focus was the trust boundary between persisted hook state, `wrapRecoveredCompactPayload()`, and the prompt text the runtimes inject after compaction.

## Findings

### Finding R10-001
- **File:** `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/session-prime.ts`
- **Lines:** `55-68`
- **Severity:** P1
- **Description:** Gemini's compact-recovery replay drops cached provenance metadata entirely. The cache writer stores a `payloadContract` with explicit `producer`, `trustState`, and `sourceSurface`, and the shared wrapper knows how to emit a `[PROVENANCE: ...]` line, but Gemini replay calls the wrapper without metadata in both `session-prime` and `compact-inject`. Claude preserves those fields on replay.
- **Evidence:** `hook-state.ts:35-39` defines `pendingCompactPrime.payloadContract`; `hooks/gemini/compact-cache.ts:158-180` stores a compaction payload contract with `producer: 'hook_cache'`, `trustState: 'cached'`, and `sourceSurface: 'gemini-compact-cache'`; `hooks/gemini/session-prime.ts:55-68` and `hooks/gemini/compact-inject.ts:43-54` call `wrapRecoveredCompactPayload(...)` without metadata, so `hooks/claude/shared.ts:115-120` emits no `[PROVENANCE: ...]` line at all. By contrast, `hooks/claude/session-prime.ts:65-70` forwards the cached provenance fields into the same wrapper. Existing regression coverage only proves the helper can emit provenance when metadata is supplied (`tests/hook-session-start.vitest.ts:78-88`); it does not cover Gemini replay.
- **Downstream Impact:** Gemini's post-compression recovery prompt loses the only structured provenance markers that distinguish cached context from ordinary recovered text. Operators and models can no longer tell whether the block came from `gemini-compact-cache`, Claude's merged `compact-cache`, or some future trust-state variant, and cross-runtime recovery output diverges even when both runtimes persist the same hook-state contract.

### Finding R10-002
- **File:** `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts`
- **Lines:** `109-123`
- **Severity:** P2
- **Description:** The recovered-compact provenance wrapper trusts persisted metadata too much: it sanitizes only the payload body, then interpolates `producer`, `trustState`, and `sourceSurface` directly into the `[PROVENANCE: ...]` line with no escaping or runtime validation. Claude replay feeds those fields straight from tempdir hook state.
- **Evidence:** `hooks/claude/hook-state.ts:83-87` loads hook state with `JSON.parse(raw) as HookState`; `hooks/claude/session-prime.ts:65-70` passes `pendingCompactPrime.payloadContract?.provenance.*` directly into `wrapRecoveredCompactPayload(...)`; `hooks/claude/shared.ts:114-123` sanitizes only `payload` and then string-interpolates metadata into the wrapper line. The only direct test here is the benign happy path in `tests/hook-session-start.vitest.ts:78-88`, which asserts a clean provenance line but never exercises newline/bracket-bearing or drifted metadata values.
- **Downstream Impact:** A structurally valid but drifted or corrupted `payloadContract.provenance` object in hook state can rewrite the provenance header that Claude injects back into the prompt after compaction. That turns tempdir state corruption from a passive cache-quality issue into prompt-visible metadata spoofing, undermining the very markers later recovery logic and human operators rely on to identify cached context.

## Novel Insights
- The cache/replay seam is asymmetric across runtimes: Gemini throws provenance away, while Claude preserves it but treats persisted provenance strings as trusted prompt material.
- This is a deeper contract split than the earlier shared-payload findings. The stored `SharedPayloadEnvelope` exists, but the replay layer neither validates it consistently nor preserves it consistently, so the same cached object produces different recovery evidence depending on runtime.

## Next Investigation Angle
Trace these recovered provenance markers into the consumers that strip or react to them, especially the anti-feedback guards in `hooks/claude/shared.ts`, Gemini/Claude compact writers, and any prompt-formatting layer that assumes `[SOURCE:]` and `[PROVENANCE:]` markers are trustworthy replay evidence rather than best-effort text.
