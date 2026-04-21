# Iteration 2: Live prompt and operational launch surfaces after promotion

## Focus
Reviewed the promoted `002-content-routing-accuracy` prompt assets and root spec metadata to verify that the packet-local operational launch surfaces were updated when the continuity research work moved under `010-search-and-routing-tuning`.

## Findings

### P0

### P1
- **F001**: The live deep-research prompt for `002-content-routing-accuracy` still dispatches against the retired 006 path — `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/prompts/deep-research-prompt.md:8` — The packet-local invocation still uses `--spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates/002-content-routing-accuracy`, even though the promoted root packet now lives under `010-search-and-routing-tuning`. Re-running the prompt from the current tree would therefore open the wrong research folder. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/prompts/deep-research-prompt.md:8`] [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/spec.md:6`]

{"type":"claim-adjudication","findingId":"F001","claim":"The promoted 002 packet still ships a live launch prompt that targets the old 006 continuity-refactor-gates path.","evidenceRefs":[".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/prompts/deep-research-prompt.md:8",".opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/002-content-routing-accuracy/spec.md:6"],"counterevidenceSought":"I checked whether another local prompt or config wrapper overrides the stale spec-folder path before launch.","alternativeExplanation":"If operators always launch deep research manually, impact is lower, but the packet-local prompt is still a live operational artifact and currently wrong.","finalSeverity":"P1","confidence":0.99,"downgradeTrigger":"Downgrade if the packet-local prompt invocation is updated to the promoted 010 path or is explicitly marked historical-only."}

### P2

## Ruled Out
- The root `002` spec itself already points at the promoted parent under `010-search-and-routing-tuning`, so the migration break is in the prompt surface, not the main root identity fields.

## Dead Ends
- There was no need to inspect runtime code yet; the issue is already provable in the live packet-local prompt artifact.

## Recommended Next Focus
Compare the promoted `001-search-fusion-tuning` root review artifacts against the current Stage 3 runtime and regression coverage to see whether the migration also left stale review conclusions behind.

## Assessment
- New findings ratio: 0.55
- Dimensions addressed: traceability
- Novelty justification: This pass found a second high-signal migration defect in a live operator-facing launch surface.
