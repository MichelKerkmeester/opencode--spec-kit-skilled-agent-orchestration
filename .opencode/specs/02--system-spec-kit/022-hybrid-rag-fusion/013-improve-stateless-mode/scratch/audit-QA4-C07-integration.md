## Audit QA4-C07: integration — Copilot Cross-Validation
### P0 Blockers: [0] — None
### P1 Required: [1] — [scripts/extractors/spec-folder-extractor.ts:29, scripts/core/workflow.ts:475-479, scripts/extractors/decision-extractor.ts:122-141] Spec-folder decisions are merged as `{title, rationale, chosen}`, but downstream `_manualDecisions` handling only reads `decision` or `title`; the chosen outcome and rationale are therefore dropped, so decision enrichment degrades to title-only text instead of preserving the authored decision record.
### P2 Suggestions: [1] — [scripts/core/workflow.ts:505-512, scripts/extractors/git-context-extractor.ts:37-42] Merge ordering is otherwise correct (spec-folder first, git second), but duplicate-path file merges keep the existing/spec-folder entry and discard git `ACTION` metadata for the same path; augmenting the existing entry would preserve both curated descriptions and live git state.
### Score: [91]

- Verified data-shape compatibility for `observations`, `FILES`, `triggerPhrases`, `summary`, and `recentContext`; only the decision object shape loses meaning when carried into `_manualDecisions`.
- Verified empty extraction handling: both extractors can return empty data safely, and `workflow.ts` skips empty/null enrichment without failing the run.
- Verified merge ordering: spec-folder enrichment lands before git enrichment, which correctly prioritizes spec descriptions and then appends git summary/context.
