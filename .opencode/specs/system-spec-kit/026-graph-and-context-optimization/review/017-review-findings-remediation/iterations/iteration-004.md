---
iteration: 4
dimension: maintainability
dispatcher: claude-opus-4.7-1m (manual exec)
branch: main
cwd: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
created_at: 2026-04-17T20:00:00Z
convergence_candidate: false
---

# Iteration 004 — Maintainability

## Scope

Phase 017 new-module surface: `exhaustiveness.ts`, `caller-context.ts`,
`retry-budget.ts`, `readiness-contract.ts`, `shared-provenance.ts`, plus
the `runEnrichmentStep` + `executeAtomicReconsolidationTxn` extractions
(commit `0ac9cdcba`) and the `assertNever` rollout (`787bf4f88`). Also
cross-checked the `continuity-freshness.ts` / `evidence-marker-lint.ts` /
`evidence-marker-audit.ts` TS↔shell boundary and the Claude/Gemini
re-exports.

## Findings (4)

### F1 — P2 — `readiness-contract.ts` switches are exhaustive-at-compile-time but omit `assertNever` — inconsistent with Phase 017 rollout
Classification: maintainability / consistency; refines iter1 R1-P2-002.

`canonicalReadinessFromFreshness` (lines 61-72) and
`queryTrustStateFromFreshness` (lines 90-101) switch over
`ReadyResult['freshness']` with no `default: return assertNever(...)`
branch. Every OTHER switch in Phase 017 (`post-insert.ts:120, 138, 169,
186`; `reconsolidation.ts:987`; `shared-payload.ts:56, 665, 680`;
`hook-state.ts:480`; `gate-3-classifier.ts:264`; `response-builder.ts:109`)
ends with `default: return assertNever(x, '<label>')`. The two readiness
helpers are the ONLY Phase 017 switches that rely purely on implicit
`never` control-flow with no runtime sentinel. This is a maintainability
inconsistency: a new `GraphFreshness` variant compiles if the author
only updates one of the two switches, and the silently-returned
`undefined` narrows past the exported return types (`StructuralReadiness`,
`SharedPayloadTrustState`).

Impact: latent regression vector; failure mode is a malformed readiness
envelope reaching the 6 sibling handlers.

Evidence: `readiness-contract.ts:64-71,93-100` (no default branch);
`exhaustiveness.ts:12` (helper exists); `post-insert.ts:25` already
imports `assertNever` from the same `lib/utils` directory.

Recommended action: add `default: return assertNever(freshness,
'graph-freshness');` to both switches; the import path is available.

---

### F2 — P2 — `retry-budget.clearBudget` uses `memoryId === undefined` but has no overload signature — mixed-API callers will misread "omit vs pass undefined"
Classification: maintainability / API surface; refines iter1 R1-P2-001.

`clearBudget(memoryId?: number): void` treats `memoryId === undefined`
as "clear all" and any value as "clear that memory". In TypeScript the
optional-parameter contract is ambiguous when the caller threads through
a `number | undefined` variable (e.g. `clearBudget(maybeId)` — the
function happily clears the entire budget if `maybeId` happens to be
undefined at runtime, even though the caller's intent was "clear for
this memory or do nothing"). Canonical Phase 016/017 API patterns
(`scope-governance.normalizeScopeValue`, `shared-payload.ts`) use
explicit overloads or narrowing type guards to disambiguate. The
companion `getBudgetSize()` has no `memoryId` filter, so callers that
want "size for one memory" cannot get it without scanning keys — an
asymmetric API.

Evidence: `retry-budget.ts:68-79` — no overload, no union-tag pattern;
compare `scope-governance.ts` + `shared-payload.ts` patterns.

Recommended action: split into `clearAllBudgets()` + `clearBudget(id:
number)` — NO optional parameter. This is a common JS/TS anti-pattern
that breaks silent-all-clear accidents.

---

### F3 — P2 — `executeAtomicReconsolidationTxn` mode + operations-bag parameter shape is a code smell (mutually exclusive fields in the same object)
Classification: maintainability / type design; new finding.

```ts
mode: 'deprecate' | 'content_update',
operations: {
  deprecate?: () => boolean;
  contentUpdate?: () => boolean;
},
```

The contract is "exactly one of `deprecate`/`contentUpdate` must be set,
matching `mode`". This invariant is NOT encoded in the type; it's
enforced at runtime by `if (!applyOperation) throw new Error('Missing
reconsolidation transaction operation for mode ' + mode)`
(`reconsolidation.ts:956-958`). A discriminated union would compile-
time-forbid the misuse:

```ts
| { mode: 'deprecate'; apply: () => boolean }
| { mode: 'content_update'; apply: () => boolean }
```

Current shape allows `{ mode: 'deprecate', operations: { contentUpdate:
... } }` which throws at runtime — exactly the scenario a type-system
should catch. Both call sites (`reconsolidation.ts:505-542,549-...`)
happen to pass the correct pair, but the helper's ergonomics actively
invite a future-caller regression.

Evidence: `reconsolidation.ts:927-965` signature; callsites at :505 and
:549 each populate only one operations field.

Recommended action: refactor to discriminated-union input; the callsite
change is mechanical (replace the 2-key object with 1 flat function).

---

### F4 — P2 — `shared-provenance.ts` un-exports `normalizeRecoveredPayloadLineForMatching` despite iter1/iter2 citing it as the attack surface
Classification: maintainability / testability; cross-reference with iter1 R1-P1-001 + iter2 P1-1.

`normalizeRecoveredPayloadLineForMatching` (line 37-39) is the exact
helper where the homoglyph fold lives, yet it's a module-private
function with no `export`. That means:
1. The 2 prior deep-review iterations could only reason about its
   behaviour via reading source — no direct unit test exercises it.
2. Any fix (e.g. adopting a confusables library) will require a second
   export anyway to make tests tractable.
3. The sibling helpers `escapeProvenanceField` /
   `sanitizeRecoveredPayload` / `wrapRecoveredCompactPayload` ARE
   exported; the asymmetry is unexplained.

Compare `hooks-shared-provenance.vitest.ts` (per config line 83): the
test file exists but (per iter2 P1-1 evidence) only covers positive
Greek-Epsilon cases. Exporting `normalizeRecoveredPayloadLineForMatching`
would allow a Cyrillic-class negative-test matrix without touching the
public API.

Evidence: `shared-provenance.ts:37-39` (function declaration, no
`export`); `shared-provenance.ts:42,47,57` (siblings all exported).

Recommended action: export the helper with an "Exported for tests only"
TSDoc; update tests to cover the Cyrillic/Latin-accented homoglyph
matrix already cited in iter2 P1-1.

## Pass checks (3)

- **P1** `assertNever` is consistently invoked across 14 of 16 switch
  sites in Phase 017 modules (all `mcp_server/handlers/save/*`,
  `reconsolidation.ts`, `shared-payload.ts`, `hook-state.ts`,
  `gate-3-classifier.ts`). Two remaining gaps are F1 above —
  systemic inconsistency, not forgotten rollout.
- **P2** `runEnrichmentStep` extraction (`post-insert.ts:206-225`) is
  clean: 18 LOC helper, single try/catch, typed callbacks. The 5 lane
  runners (`runCausalLinksStep`, `runEntityExtractionStep`,
  `runSummariesStep`, `runEntityLinkingStep`, `runGraphLifecycleStep`)
  now invoke it uniformly with zero duplicated boilerplate. The new
  `runPostInsertEnrichment` coordinator is 30 LOC (:490-520) — aligned
  with the ~32 LOC target.
- **P3** Validation-script exit-code semantics are consistent:
  `continuity-freshness.ts` (0=pass/1=warn-strict/2=fail),
  `evidence-marker-lint.ts` (0=pass/1=warn-strict/2=error),
  `evidence-marker-audit.ts` (reports→0, exception→2). All three
  honour `--strict` identically.

## Metrics

- `findingsCount`: 4 (0×P0 + 0×P1 + 4×P2)
- severity-weighted new = (0 × 5.0) + (4 × 1.0) = **4.0**
- cumulative = 39 (iter1-3 baseline) + 4.0 = **43.0**
- `newFindingsRatio` = 4.0 / 43.0 = **0.093** (just above 0.08
  threshold — borderline convergence)
- `passCount`: 3
- `toolCallsUsed`: 11 (read × 10, grep × 6 in parallel batches → 11
  effective tool invocations)
- `convergedThisIter`: false (ratio 0.093 > threshold 0.08 but
  margin is narrow; recommend one more iter in a fresh dimension to
  confirm)

## Ruled out (3)

1. **`assertNever` module is over-engineered for one helper.** Ruled
   out — single-function modules are canonical TS practice when the
   helper is widely imported (14 callsites across 8 files). Bundling
   into a larger utils file would create false cohesion.
2. **`caller-context.ts` API is bloated.** Ruled out — 3 functions
   (`runWithCallerContext`, `getCallerContext`, `requireCallerContext`)
   form a minimal get/require/scope triad. Each has distinct return
   semantics and the JSDoc is adequate.
3. **Claude/Gemini re-exports of provenance helpers are duplicated
   boilerplate.** Ruled out — each re-export block is 5 lines with a
   distinct T-W1-HOK-02 comment. A shared barrel file would introduce
   import-cycle risk given Claude's `hookLog` dependency. Tolerable.

## Open questions

- Does the sk-code-opencode alignment pass (`48fc7db91`) inspect
  discriminated-union vs bag-of-optionals patterns? If yes, F3 should
  have been flagged there.
- Should `readiness-contract.ts` also export its switch-based mappers
  as data tables (Record<Freshness, State>)? Would eliminate F1
  entirely.

## Suggested next dimension

`cross-reference` — to correlate F1 (readiness-contract
non-assertNever) + F4 (un-exported homoglyph helper) with
iter1/iter2 findings; or `regression-verification` to actually run
the 17 vitest suites in the manifest and confirm the 74+ test
claims match reality.
