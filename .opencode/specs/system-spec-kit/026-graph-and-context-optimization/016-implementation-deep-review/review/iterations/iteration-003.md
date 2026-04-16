# Iteration 3 - inventory - pipeline+scripts

## Dispatcher
- iteration: 3 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T05:20:39.448Z

## Files Reviewed
- `.opencode/skill/system-spec-kit/scripts/core/frontmatter-editor.ts`
- `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts`
- `.opencode/skill/system-spec-kit/scripts/core/memory-metadata.ts`
- `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts`
- `.opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts`
- `.opencode/skill/system-spec-kit/scripts/core/title-builder.ts`
- `.opencode/skill/system-spec-kit/scripts/lib/anchor-generator.ts`
- `.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts`
- `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-contradictions.cjs`
- `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs`
- `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs`
- `.opencode/skill/system-spec-kit/scripts/wrap-all-templates.ts`
- `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`
- `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs`
- `.opencode/skill/sk-deep-review/scripts/runtime-capabilities.cjs`
- `.opencode/skill/system-spec-kit/scripts/tests/content-filter-parity.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/deep-research-reducer.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/post-save-review.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/review-reducer-fail-closed.vitest.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js`

## Findings - New
### P0 Findings
- None.

### P1 Findings
- **Deep-review reducer drops `blendedScore`, so review dashboards can report the wrong graph convergence score.** `coverage-graph-convergence.cjs` emits `{ graphScore, blendedScore, components }` as its public result shape, and the research-side reducer explicitly accepts `signals.blendedScore`; the review-side reducer does not. In `sk-deep-review/scripts/reduce-state.cjs`, `computeGraphConvergenceScore()` only checks `score`, `convergenceScore`, `compositeScore`, `stopScore`, and `decisionScore`, then falls back to averaging every numeric field in `signals` (`.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:586-607`). `buildGraphConvergenceRollup()` feeds that helper `latest.signals` directly (`.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:610-627`), so any review packet that records only `blendedScore` will persist an averaged surrogate instead of the producer's convergence decision value. This is not theoretical drift: the adjacent research reducer has dedicated regression coverage for `blendedScore` and even comments that alias as part of the compatibility contract (`.opencode/skill/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:194-267`), while the review-side tests never exercise graph convergence ingestion at all (`.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts:15-129`, `.opencode/skill/system-spec-kit/scripts/tests/review-reducer-fail-closed.vitest.ts:109-193`).

```json
{
  "claim": "The deep-review reducer can misreport graph convergence because it ignores the producer's blendedScore field and substitutes an average of arbitrary numeric signal members.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/scripts/lib/coverage-graph-convergence.cjs:295-351",
    ".opencode/skill/sk-deep-review/scripts/reduce-state.cjs:586-627",
    ".opencode/skill/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:194-267",
    ".opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts:15-129",
    ".opencode/skill/system-spec-kit/scripts/tests/review-reducer-fail-closed.vitest.ts:109-193"
  ],
  "counterevidenceSought": "Checked for a deep-review-side alias from blendedScore to score or for tests covering graph_convergence payloads; none were present in the reviewed reducer/tests.",
  "alternativeExplanation": "If every persisted deep-review graph_convergence event is guaranteed to include signals.score, the bug stays latent. That guarantee is not enforced in this reducer, and the neighboring research reducer still treats blendedScore as a supported compatibility shape.",
  "finalSeverity": "P1",
  "confidence": 0.96,
  "downgradeTrigger": "Downgrade if the deep-review event writer is proven to always materialize signals.score and never persists blendedScore-only records."
}
```

### P2 Findings
- **`wrapSectionsWithAnchors()` does not actually preserve all existing anchor layouts.** The guard that decides whether a heading is already wrapped only looks back two lines for `<!-- ANCHOR:... -->` (`.opencode/skill/system-spec-kit/scripts/lib/anchor-generator.ts:178-183`), but downstream parsing explicitly accepts anchor blocks with an optional HTML id and optional blank line before the heading (`.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:326-330`). In that allowed layout, the opening anchor can sit three lines above the `##` heading, so rerunning the wrapper can double-wrap an already-anchored section despite the function comment promising preservation (`.opencode/skill/system-spec-kit/scripts/lib/anchor-generator.ts:155-158,230-258`).
- **Test coverage is skewed toward helper smoke tests, not the shipped wrapping path.** The only anchor-generator module smoke test asserts `generateAnchorId()`, `categorizeSection()`, `validateAnchorUniqueness()`, and `slugify()` (`.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js:638-680`), while the production script that mutates templates calls `wrapSectionsWithAnchors()` directly (`.opencode/skill/system-spec-kit/scripts/wrap-all-templates.ts:58-67`). There is no focused test covering reruns of `wrapSectionsWithAnchors()` against pre-anchored sections, so the lookback bug above would pass current tests.

## Traceability Checks
- The graph convergence pipeline is only partially wired end-to-end: producer code standardizes on `blendedScore` (`coverage-graph-convergence.cjs`), research-side reduction preserves that compatibility shape (`graph-aware-stop.vitest.ts`), but review-side reduction does not. That is a concrete implementation drift inside the same feature family.
- Two suggested focus files from the dispatcher prompt, `scripts/core/canonical-continuity-shadow.ts` and `scripts/core/file-writer.ts`, were not present at the referenced paths. The review therefore covered the extant pipeline/script modules actually reachable in this packet.

## Confirmed-Clean Surfaces
- `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts` is a type-only shim with no executable logic beyond exported status enums/shapes, so there was no hidden side-effect surface to review.
- `.opencode/skill/sk-deep-review/scripts/runtime-capabilities.cjs` stays on local-file reads, resolves paths explicitly, and throws on malformed matrices instead of silently degrading.
- `.opencode/skill/system-spec-kit/scripts/lib/coverage-graph-core.cjs` and `coverage-graph-contradictions.cjs` correctly reject invalid graph shapes, prevent self-loops, clamp weights, and honor session scoping in their exposed collection/reporting helpers.

## Next Focus
- Iteration 4 should inspect the producer side of deep-review graph-convergence events and the canonical save/write pipeline to confirm whether any other review-only reducers are missing compatibility aliases or top-level score fallbacks.
