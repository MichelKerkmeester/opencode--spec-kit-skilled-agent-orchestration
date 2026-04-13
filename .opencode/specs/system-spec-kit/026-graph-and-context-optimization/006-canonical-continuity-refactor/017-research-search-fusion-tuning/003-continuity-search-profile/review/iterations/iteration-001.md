# Iteration 1: Continuity intent stops before the default Stage 3 MMR ranking pass

## Focus
Trace the new internal `continuity` intent from the handler into the ranking pipeline and confirm whether the final Stage 3 ordering still honors it when MMR is enabled.

## Findings

### P0

### P1
- **F001**: Stage 3 MMR ignores the internal continuity intent — `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:209` — `handleMemorySearch()` maps `profile === 'resume'` to `adaptiveFusionIntent = 'continuity'`, and Stage 1 passes that value into hybrid search, but Stage 3 MMR still selects its lambda from `config.detectedIntent` and the lambda map has no `continuity` entry. Because `SPECKIT_MMR` defaults to enabled, resume-profile searches lose their continuity-specific ranking behavior in the final ordering step. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:830`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:538`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:209`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:641`]

```json
{"type":"claim-adjudication","findingId":"F001","claim":"The continuity profile is only partially wired because Stage 3 MMR still ignores adaptiveFusionIntent and falls back to detectedIntent/default lambda.","evidenceRefs":[".opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:830",".opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:538",".opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:209",".opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:641"],"counterevidenceSought":"Read the handler wiring, Stage 1 pipeline handoff, Stage 3 MMR branch, and intent lambda map looking for a continuity-aware override or lambda entry; none exists.","alternativeExplanation":"The phase could have intended continuity to affect fusion only, but the packet claims internal pipeline callers were wired and the default final ranking stage still reinterprets intent, so the partial handoff remains a real runtime mismatch.","finalSeverity":"P1","confidence":0.89,"downgradeTrigger":"Downgrade if Stage 3 is updated to read adaptiveFusionIntent (or a continuity lambda is added and used) and a regression test proves resume-profile searches keep continuity semantics through MMR.","transitions":[{"iteration":1,"from":null,"to":"P1","reason":"Initial discovery"}]}
```

### P2

## Ruled Out
- Public intent API expansion bug: the phase intentionally keeps `continuity` out of the public intent union. [SOURCE: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning/003-continuity-search-profile/tasks.md:3`]

## Dead Ends
- Searching for a hidden continuity-aware Stage 3 lambda or override did not surface any alternate path. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:641`]

## Recommended Next Focus
Confirm the packet/runtime mismatch under default settings by checking MMR defaults and the current continuity-focused tests.

## Assessment
- New findings ratio: 1.00
- Dimensions addressed: correctness
- Novelty justification: This pass surfaced a new required fix because the default final ranking stage drops the internal continuity intent.
