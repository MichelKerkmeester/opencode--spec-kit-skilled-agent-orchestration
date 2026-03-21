## Audit QA9-C13: Null/Undefined Safety — Copilot Cross-Cutting

Reviewed all existing `?.` and `??` usage in the three target files. Existing optional chaining/nullish coalescing in `input-normalizer.ts` is sufficient for current loader preconditions; the remaining findings are where sparse stateless payloads can still bypass safeguards or where `||` still conflates `0` with missing data.

### P0 Blockers: 0 — none

### P1 Required: 2 — [scripts/core/workflow.ts:583-592, scripts/extractors/collect-session-data.ts:580]
- **workflow.ts:583-592** — The stateless alignment guard only runs when `collectedData.observations` is truthy, even though the implementation already knows how to derive `allFilePaths` from `(collectedData.observations || [])` *and* `(collectedData.FILES || [])`. In sparse stateless captures where `observations` is `undefined` but `FILES` is populated, contamination screening is skipped entirely, so cross-spec saves can pass through without any null-safe fallback path.
- **collect-session-data.ts:580** — `recentContext?.[0]?.continuationCount || 1` should be nullish-based (`?? 1`), not truthy-based. If stateless/bootstrap data explicitly sets `continuationCount: 0`, the current code rewrites it to `1`, and `NEXT_CONTINUATION_COUNT` becomes `2`, silently corrupting continuation metadata instead of preserving a valid zero value.

### P2 Suggestions: 1 — [scripts/core/workflow.ts:757]
- **workflow.ts:757** — `filterPipeline.config.quality?.warnThreshold || 20` has the same falsy trap: an intentional threshold of `0` is treated as absent and reported as `20`. This does not crash the pipeline, but it makes null/undefined handling inconsistent with the rest of the workflow, which otherwise correctly uses `??` for numeric defaults.

### Score: 84

Notes:
- `collect-session-data.ts` uses `??` correctly for numeric learning metrics (`delta*`, preflight/postflight scores), so `0` survives stateless-mode hydration.
- `input-normalizer.ts` uses optional chaining correctly on tool input paths (`tool.input?.filePath`, etc.), and its remaining direct property reads are covered by earlier shape checks or loader preconditions.
