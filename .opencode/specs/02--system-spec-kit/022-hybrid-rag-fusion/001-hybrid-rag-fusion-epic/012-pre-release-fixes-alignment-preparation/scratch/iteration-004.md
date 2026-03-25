# Iteration 004: Shared Modules Correctness

## Findings

### P1-004-1: The release packet still tracks `fusion-lab.js`, but the compiled shared artifact does not exist
- Severity: P1
- Evidence: `.opencode/skill/system-spec-kit/shared/dist/algorithms/index.js:20-22`, `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/011-research-based-refinement/001-fusion-scoring-intelligence/plan.md:64-76`, `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/012-pre-release-fixes-alignment-preparation/scratch/deep-review-strategy.md:73-77`
- Description: This review was asked to verify the active v5 correctness finding at `shared/dist/algorithms/fusion-lab.js:49-55`, but the current `shared/dist` bundle does not contain `fusion-lab.js` at all. The compiled algorithms surface exports only `rrf-fusion`, `adaptive-fusion`, and `mmr-reranker`, while the release packet still treats `fusion-lab.js` as a live shared-module target with an unresolved P1 normalizer defect.
- Impact: Pre-release alignment is currently unverifiable. Reviewers and follow-up fixes are being pointed at a compiled module that is no longer shipped, so the known `P1-003-1` normalizer issue cannot be closed against the actual artifact set.
- Recommendation: Either restore and ship `shared/dist/algorithms/fusion-lab.js` (and then re-check the NaN-normalizer path), or update the release packet to remove/replace all live references to that artifact and re-target the unresolved finding to the real implementation that now owns the logic.

### P2-004-2: Shadow-mode flag naming still invites disabling the wrong runtime path
- Severity: P2
- Evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:13-16`, `.opencode/skill/system-spec-kit/mcp_server/lib/eval/shadow-scoring.ts:245-256`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:429-436`, `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:928-955`, `.opencode/skill/system-spec-kit/references/config/environment_variables.md:211-237`
- Description: The legacy `SPECKIT_SHADOW_SCORING` path is now explicitly retired and always returns `null`, but the live shadow comparison used in Stage 2 still runs behind a different flag, `SPECKIT_LEARNED_STAGE2_COMBINER`, which is documented and implemented as default ON. That means the old v5 "shadow flag default-OFF vs default-ON" phrasing is no longer literally true, but the operator-facing ambiguity remains: a reader can still disable `SPECKIT_SHADOW_SCORING` and incorrectly assume all shadow scoring is off while the learned shadow combiner keeps running.
- Impact: This is mainly an operational correctness/alignment problem: reviewers and operators can apply the wrong toggle and get unexpected shadow-comparison logging/overhead in pre-release validation.
- Recommendation: Rename or cross-link the flags more explicitly in the release packet and env-var docs, e.g. state that `SPECKIT_SHADOW_SCORING` is retired/no-op while the active shadow combiner is controlled by `SPECKIT_LEARNED_STAGE2_COMBINER`.

### P2-004-3: Empty `anchors` arrays still suppress fallback anchor extraction
- Severity: P2
- Evidence: `.opencode/skill/system-spec-kit/shared/dist/parsing/memory-sufficiency.js:200-208`, `.opencode/skill/system-spec-kit/shared/dist/parsing/memory-sufficiency.js:252-255`
- Description: `collectSupportContexts()` uses `(snapshot.anchors || extractAnchorsFromContent(snapshot.content || '')).length > 0`. In JavaScript an empty array is truthy, so callers that pass `anchors: []` block the fallback extraction even when the markdown content actually contains anchors.
- Impact: `evaluateMemorySufficiency()` can undercount support evidence and anchor presence, which lowers the sufficiency score and can reject borderline-but-valid memories.
- Recommendation: Switch to an explicit length-aware fallback such as `snapshot.anchors?.length ? snapshot.anchors : extractAnchorsFromContent(...)`.

## Summary

- Reviewed all 31 `.js` files currently present under `.opencode/skill/system-spec-kit/shared/dist/`, including `algorithms/`, `scoring/`, `normalization.js`, `embeddings.js`, `trigger-extractor.js`, `parsing/`, `ranking/`, and `utils/`.
- The exact v5 `fusion-lab.js` NaN-corruption check could not be re-run against `shared/dist` because `fusion-lab.js` is not in the compiled artifact set anymore; that absence is itself the main alignment blocker in this pass.
- The older "shadow flag default-OFF vs default-ON" issue is not reproduced as a single flag mismatch anymore. Instead, the retired `SPECKIT_SHADOW_SCORING` flag now coexists with the active, default-ON `SPECKIT_LEARNED_STAGE2_COMBINER` shadow path, which is still easy to misread during release validation.
- Active findings in this pass: 3 total (`P0`: 0, `P1`: 1, `P2`: 2).

## JSONL

```jsonl
{"type":"iteration","run":4,"mode":"review","dimensions":["correctness"],"filesReviewedCount":31,"findingsSummary":{"P0":0,"P1":1,"P2":2},"findings":[{"id":"P1-004-1","severity":"P1","title":"Release packet still tracks fusion-lab.js, but the compiled shared artifact does not exist","file":"shared/dist/algorithms/index.js:20-22"},{"id":"P2-004-2","severity":"P2","title":"Shadow-mode flag naming still invites disabling the wrong runtime path","file":"mcp_server/lib/search/search-flags.ts:429-436"},{"id":"P2-004-3","severity":"P2","title":"Empty anchors arrays still suppress fallback anchor extraction","file":"shared/dist/parsing/memory-sufficiency.js:206-208"}]}
```
