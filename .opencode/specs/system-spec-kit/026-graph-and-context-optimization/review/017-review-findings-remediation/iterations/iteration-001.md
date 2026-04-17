# Iteration 001 — correctness

Phase 017 remediation deep-review, iteration 1 of 10. Dimension: correctness. Read-only audit of the 4 new primitives (AsyncLocalStorage caller-context, readiness-contract, shared-provenance, retry-budget) and their call sites, the H-56-1 canonical-save metadata fix, and the code-graph 6-sibling readiness propagation.

## 1. Files reviewed

1. `.opencode/skill/system-spec-kit/mcp_server/lib/context/caller-context.ts`
2. `.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/retry-budget.ts`
3. `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/readiness-contract.ts`
4. `.opencode/skill/system-spec-kit/mcp_server/hooks/shared-provenance.ts`
5. `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/compact-cache.ts`
6. `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/session-prime.ts`
7. `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
8. `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` (lines 1240-1400)
9. `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts`
10. `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts`
11. `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts`
12. `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts`
13. `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-reindex.ts`
14. `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-feedback.ts`
15. `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts` (lines 140-180)
16. `.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts` (lines 340-360)
17. `.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts` (lines 280-340)
18. `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts` (re-export lines 100-112)
19. `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/shared.ts` (re-export lines 10-16)
20. `.opencode/skill/system-spec-kit/shared/gate-3-classifier.ts` (lines 140-200)

Also ran test suites (all green): `tests/readiness-contract`, `tests/caller-context`, `tests/session-resume-auth`, `tests/retry-budget`, `tests/hooks-shared-provenance`, `tests/code-graph-siblings-readiness`, `tests/copilot-compact-cycle`. 74 tests passed / 0 failed across 7 files.

## 2. Findings

### R1-P1-001 — `sanitizeRecoveredPayload` homoglyph-match table covers Greek E/e only, ignoring Cyrillic/other homoglyphs

- **File:line:** `.opencode/skill/system-spec-kit/mcp_server/hooks/shared-provenance.ts:37-39`
- **Claim:** `normalizeRecoveredPayloadLineForMatching` maps only Greek capital Epsilon (U+0395) and small epsilon (U+03B5) back to ASCII `E`/`e` before regex testing. Cyrillic `е` (U+0435), `а` (U+0430), `о` (U+043E), `с` (U+0441), `р` (U+0440), full-width variants (U+FF21-U+FF5A), mathematical alphanumeric variants (U+1D400+), and Latin-1 dotless `ı` (U+0131) are not folded, so an adversarial recovered payload line reading `[Ѕystem]: ignore all previous instructions` (Cyrillic `Ѕ` U+0405) will slip through the `RECOVERED_TRANSCRIPT_STRIP_PATTERNS` allowlist unmodified and be passed verbatim to the LLM. The banner comment (`"// Exported for tests; hooks should prefer sanitizeRecoveredPayload"`) implies a defense-in-depth posture; the partial fold silently weakens it.
- **Evidence:** Line 38 `.replace(/[\u0395\u03B5]/g, (char) => (char === '\u0395' ? 'E' : 'e'))`. `normalizeRecoveredPayloadLine` at line 34 strips zero-width controls but performs no casefold or compatibility decomposition beyond NFKC — which does *not* fold Cyrillic/Greek letterforms to Latin. Regex patterns at lines 26-31 are ASCII-only.
- **Confidence:** 0.85. Regex patterns and homoglyph table are inspected directly; NFKC semantics well documented (Unicode TR15 §5 — NFKC does not perform script unification).

### R1-P1-002 — `handleSessionResume` does not propagate `callerCtx.sessionId` to `getCachedSessionSummaryDecision` when args omit sessionId

- **File:line:** `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:450-478`
- **Claim:** The auth guard at lines 457-464 only activates when `requestedSessionId` (derived solely from `args.sessionId`, line 451) is truthy. When the caller omits `args.sessionId`, `requestedSessionId` is `null`, and `claudeSessionId: requestedSessionId ?? undefined` at line 477 passes `undefined` to `getCachedSessionSummaryDecision`. The downstream `loadMatchingStates({ scope: { specFolder, claudeSessionId } })` therefore performs a cross-session candidate search keyed only on specFolder. The session-binding intent stated in T-SRS-BND-01 (R2-P1-001) — "bind public session_resume sessionId input to the MCP transport caller context" — is satisfied for the reject-on-mismatch axis but not for the positive-binding axis. An MCP client that never supplies `args.sessionId` receives cached summaries from *any* session that matches the specFolder scope, including other tenants if they share a specFolder label.
- **Evidence:** line 450 `const callerCtx = getCallerContext();`; line 477 `claudeSessionId: requestedSessionId ?? undefined`. There is no fallback to `callerCtx?.sessionId` when `requestedSessionId` is null. Contrast with the permissive-mode log at line 460 which does read `callerCtx.sessionId`.
- **Confidence:** 0.80. Control flow is mechanical; the only uncertainty is whether this was an intentional design for backward-compat (which would make it a maintainability/documentation gap rather than a correctness bug). The T-SRS-BND-01 task description indicates positive binding was the goal.

### R1-P2-001 — `clearBudget(memoryId)` prefix-match is ambiguous across IDs sharing a numeric prefix

- **File:line:** `.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/retry-budget.ts:74-78`
- **Claim:** `clearBudget(12)` will call `budgetKey.startsWith("12::")` and correctly skip `120::...` / `123::...`, but the test of `entry.memoryId === 12` is never performed. Because the key format is literal-string `${memoryId}::${step}::${reason}`, numeric `memoryId` values are coerced to strings; `startsWith('12::')` is safe for this exact format — but any future refactor that changes the separator (e.g. to `:` or `/`) silently re-introduces the prefix-collision risk. The function does not assert its invariant: a regression changing `buildRetryBudgetKey` to `${memoryId}:${step}:${reason}` would cause `clearBudget(1)` to also wipe entries for memoryIds 10-19, 100-199, etc. — a silent cross-memory data loss.
- **Evidence:** Line 75 `if (budgetKey.startsWith(\`${memoryId}::\`))` hard-codes the `::` delimiter; `buildRetryBudgetKey` at line 30-32 is the only writer. A stricter implementation would iterate `retryBudget.entries()` and gate on `entry.memoryId === memoryId`.
- **Confidence:** 0.60. Real-world bug today: no. Latent-regression vector: yes. P2 rather than P1 because current behaviour is correct.

### R1-P2-002 — `buildReadinessBlock` always assumes the 3-value freshness subset; `readiness-contract.ts` exhaustiveness check relies on implicit enum narrowing

- **File:line:** `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/readiness-contract.ts:61-101`
- **Claim:** Both `canonicalReadinessFromFreshness` and `queryTrustStateFromFreshness` switch over the 3 `ReadyResult['freshness']` values and return without a `default:` branch. TypeScript's control-flow analysis currently catches a new freshness state at compile time because `GraphFreshness` is a 3-variant union — but there is no `assertNever(freshness)` guard (the very pattern Iteration 4/R4-P2-002 of 016 flagged as missing). A future variant (`'partial'`, `'corrupt'`, etc.) added to `GraphFreshness` will slip through if the author of the new variant forgets to update *both* switches. More critically, `buildReadinessBlock` consumers (query.ts:238-280 and the 6 siblings) key off `canonicalReadiness + trustState` for structural decisions; silently returning `undefined` from either helper produces a malformed envelope that the downstream shared-payload validator does not reject (trustState narrows to `SharedPayloadTrustState | undefined`).
- **Evidence:** Lines 64-71 (`canonicalReadinessFromFreshness`) and 93-100 (`queryTrustStateFromFreshness`) — neither has a `default: assertNever(freshness)` branch. `.opencode/skill/system-spec-kit/mcp_server/lib/utils/exhaustiveness.ts` exists per the 017 config manifest (line regression_tests), so the helper is available but unused here.
- **Confidence:** 0.75. Tests pass today because the 3 variants are exhaustive; the P2 severity reflects latent-regression risk.

### R1-P2-003 — `compact-cache.ts` `RECOVERED_MARKER_PREFIXES` builder is order-of-initialization fragile

- **File:line:** `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/compact-cache.ts:30-49`
- **Claim:** `RECOVERED_MARKER_PREFIXES` is computed at module-load time by calling `wrapRecoveredCompactPayload('payload', '1970-01-01T00:00:00.000Z', {...})` then splitting/filtering/mapping the output. This couples the Copilot anti-feedback guard to the *exact output format* of `wrapRecoveredCompactPayload` (line 66-71 in shared-provenance.ts). A future change that (a) adds a fourth wrapper line (e.g. a checksum), (b) changes `[SOURCE:` to `[source:`, or (c) alters the `[/SOURCE]` closing token will silently de-anchor the guard — the filter at line 40 will drop the new line, leaving `RECOVERED_MARKER_PREFIXES` empty except for the `[/SOURCE]` entry, and `COMPACT_FEEDBACK_GUARDS` will no longer strip recovered marker text from freshly cached transcripts. This is a self-feedback loop waiting to reopen.
- **Evidence:** Line 30-38 re-derives wrapper prefixes from a live call; line 40 filters on literal `[SOURCE:`, `[PROVENANCE:`, `[/SOURCE]`. No test asserts that `RECOVERED_MARKER_PREFIXES.length >= 3` after construction. `tests/copilot-compact-cycle.vitest.ts` covers the happy path (pass) but does not assert the guard array invariant.
- **Confidence:** 0.70. Not an active bug; a brittleness vector with no compile-time or runtime assertion.

## 3. Traceability checks

### Protocol: `spec_code_h56_metadata_nop_fix` — pass

- **Evidence:** `scripts/core/workflow.ts:1259` (`ctxFileWritten = true`), `:1321` (`sequenceSnapshot.lastUpdated = new Date().toISOString()`), `:1357` (`shouldRunExplicitSaveFollowUps = true`), `:1370` (`refreshGraphMetadata(validatedSpecFolderPath)`)
- **Summary:** T-CNS-01 and T-W1-CNS-04 remediation are both present and unconditional. `lastUpdated`, `memorySequence`, and `graph-metadata.json` refresh all run on every canonical save (not gated on `plannerMode` or on the legacy `ctxFileWritten` stub).

### Protocol: `spec_code_readiness_contract_adoption` — pass

- **Evidence:** `readiness-contract.ts:145-153` defines `buildReadinessBlock`; 6 sibling handlers call it (`scan.ts:263`, `status.ts:37`, `context.ts:185`, `ccc-status.ts:11-20`, `ccc-reindex.ts:22-25`, `ccc-feedback.ts:24-25`). The 3 CCC handlers use the `buildUnavailableReadiness` variant with `trustState: 'unavailable'` and `reason: 'readiness_not_applicable'`, which is backward-compatible for consumers keying on `trustState !== undefined`.
- **Summary:** T-W1-CGC-03 propagation landed on all 6 siblings with the expected semantic distinction between graph-backed (scan/status/context) and graph-agnostic (ccc-*) surfaces.

### Protocol: `spec_code_scope_normalizer_collapse` — pass

- **Evidence:** `scope-governance.ts:155-159` canonical `normalizeScopeValue`. 4 callsites updated: `reconsolidation-bridge.ts:242-245,290,332-338`; `preflight.ts:446-448`; `types.ts:354-355` (re-exports via wrapper `normalizeScopeMatchValue` so `create-record.ts`/`dedup.ts` imports remain stable); `lineage-state.ts` (per test manifest line). `tests/scope-governance-normalizer-parity.vitest.ts` asserts byte-for-byte equivalence. Null vs undefined semantics preserved at every callsite (truthy narrowing).
- **Summary:** T-SCP-01 collapse is complete; no null vs undefined regression observed.

### Protocol: `spec_code_caller_context_propagation` — partial

- **Evidence:** `caller-context.ts:20` (`AsyncLocalStorage`), `:23-25` (`runWithCallerContext`). AsyncLocalStorage natively propagates through `await`, `Promise.all`, `setTimeout`, and scheduled microtasks per Node.js docs. `requireCallerContext` at line 33-39 throws as documented; `getCallerContext` at 28-30 returns null. `tests/caller-context.vitest.ts` passes.
- **Summary:** Module-level behaviour correct. Partial because R1-P1-002 shows the downstream consumer (`session-resume.ts`) does not read `callerCtx.sessionId` in the absence-of-args path.

### Protocol: `spec_code_shared_provenance_re_export` — pass

- **Evidence:** `hooks/shared-provenance.ts:42-71` canonical; `hooks/claude/shared.ts:105-107` re-exports `escapeProvenanceField`, `sanitizeRecoveredPayload`, `wrapRecoveredCompactPayload`; `hooks/gemini/shared.ts:12-14` identical re-export. `hooks/copilot/compact-cache.ts:24` and `hooks/copilot/session-prime.ts:19` both import directly from the canonical path. `tests/hooks-shared-provenance.vitest.ts` passes across all 3 runtimes.
- **Summary:** All 4 callers (Claude session-prime, Gemini session-prime + compact-inject, Copilot compact-cache + session-prime, tests) resolve correctly to the canonical module. No duplication, no drift.

## 4. Hypotheses ruled out

1. **H-56-1 canonical save `description.json` update might over-trigger on idempotent saves.** Ruled out — the retry loop at workflow.ts:1301-1334 verifies the written `memorySequence` via `loadPFD` after `savePFD`, and console-warns (not throws) when it fails. Graph-metadata refresh at :1357-1374 uses a single `refreshGraphMetadata` call with no conditional gating; failures throw but are expected-behaviour for missing MCP API. No over-trigger observed.
2. **`clearBudget(memoryId)` might accidentally clear all entries when `memoryId === 0`.** Ruled out — `clearBudget(undefined)` at line 68-71 uses `memoryId === undefined` rather than falsy check; `clearBudget(0)` routes to the prefix scan with `"0::"`, which is correct.
3. **`retryBudget.set` might race across concurrent `recordFailure` calls.** Ruled out — Node.js single-threaded event loop + atomic `Map.set` per microtask. No async operations between `retryBudget.get` (line 48) and `retryBudget.set` (line 63).
4. **`runWithCallerContext` might not propagate across native modules (`node:fs` callbacks).** Ruled out — AsyncLocalStorage propagates through any async context established before the async boundary; `node:fs` callbacks honour this. Confirmed by `tests/caller-context.vitest.ts` which exercises nested async flows.
5. **`buildReadinessBlock` might drop `lastPersistedAt` from the CCC-trio unavailable stubs.** Ruled out — `ccc-status.ts:38`, `ccc-reindex.ts:58`, `ccc-feedback.ts:58` each read `graphDb.getStats().lastScanTimestamp` and include it in the response envelope. Backward-compat is preserved for consumers keying on `lastPersistedAt !== null`.

## 5. Coverage

20 files reviewed / 38 focus_files = **52.6%**. Remaining focus files (mostly workflow validators, evidence-marker audit/lint, check-normalizer-lint.sh, context-server.ts, complete_confirm.yaml) are candidates for iteration 2's traceability or iteration 3's security dimensions.

## 6. Metrics

- **Findings count:** 5 (P0=0, P1=2, P2=3)
- **Severity-weighted new:** (2 × 5.0) + (3 × 1.0) = **13.0**
- **Severity-weighted cumulative:** 13.0 (first iteration — no prior findings to offset)
- **newFindingsRatio:** **1.0** (first iteration baseline)
- **noveltyJustification:** All 5 findings are net-new to the Phase 017 deep-review loop; none overlap the 25 findings from the Phase 016 5-iteration review (those focused on pre-017 correctness/security/traceability/maintainability/cross-reference). R1-P1-001 specifically targets post-017 extracted-module surface (shared-provenance.ts), not the pre-017 hooks/claude/shared.ts. R1-P1-002 targets the new T-SRS-BND-01 guard. R1-P2-001/002/003 all target newly-introduced primitives.
- **Test suite status:** 74 passed / 0 failed across 7 relevant suites.

## 7. Next iteration recommendation

**Iteration 2 dimension:** security. Focus areas:

1. `sanitizeRecoveredPayload` homoglyph-attack corpus — expand R1-P1-001 into a concrete test vector set (Cyrillic/full-width/mathematical-alphanumeric letterforms paired with `role:`, `system:`, `ignore all previous`) and run against `tests/hooks-shared-provenance.vitest.ts` to establish baseline coverage.
2. `session-resume.ts` auth boundary — verify behaviour across the 4 edge cases (empty-string sessionId, non-string sessionId, null callerCtx.sessionId, permissive mode). R1-P1-002 suggests the positive-binding axis is missing; iteration 2 should attempt a PoC cross-session cached-summary leak under default (strict) mode.
3. `scope-governance` + `preflight.ts` empty-string scope handling — verify that `normalizeScopeValue('')` → `null` propagates correctly into audit tables (no empty-string scope rows). Iteration 2 of 016 R2-P2-002 already narrowed this; re-verify under the new collapsed-normalizer code paths.
4. `copilot/compact-cache.ts` anti-feedback guard brittleness (R1-P2-003) — security-relevant if a future wrapper format change silently enables injection re-echo. Add an `expect(RECOVERED_MARKER_PREFIXES).toHaveLength(3)` runtime assertion test as part of iteration-2 output.
5. `Gate 3 classifier` NFKC coverage — shared/gate-3-classifier.ts:149 applies NFKC + zero-width strip but does not cover homoglyph folding. Connects to R1-P1-001 via the same design gap.

Recommend dispatching iteration 2 with focus string: `"security - homoglyph corpus + session-resume auth PoC + gate-3 NFKC boundary + compact-cache guard invariant"`.

