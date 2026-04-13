# Iteration 1: Continuity intent still drops at the default Stage 3 MMR handoff

## Focus
Trace the shipped continuity profile from `memory-search.ts` into the live ranking pipeline and verify whether the final Stage 3 ordering still honors it under the default MMR-enabled runtime.

## Findings

### P0

### P1
- **F001**: Stage 3 MMR ignores the internal continuity handoff — `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:209` — `handleMemorySearch()` maps `profile === 'resume'` to `adaptiveFusionIntent = 'continuity'`, and Stage 1 forwards that internal intent into hybrid search, but Stage 3 still selects its lambda from `config.detectedIntent`. Because `SPECKIT_MMR` defaults to enabled, resume-oriented searches can lose the continuity profile in the final ordering step. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:830`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:538`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:209`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:641`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:69`]

```json
{"type":"claim-adjudication","findingId":"F001","claim":"The shipped continuity profile is only partially wired because the default Stage 3 MMR pass still ignores adaptiveFusionIntent and falls back to detectedIntent/default lambda selection.","evidenceRefs":[".opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:830",".opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:538",".opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:209",".opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts:641",".opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:69"],"counterevidenceSought":"Read the handler wiring, Stage 1 handoff, Stage 3 MMR branch, lambda map, and default MMR flag looking for a continuity-aware override or disabled default path; none exists.","alternativeExplanation":"Continuity could have been intended as a Stage 2-only profile, but the phase docs and implementation summary both claim the Stage 3 lambda landed, so the partial handoff is still a real runtime mismatch.","finalSeverity":"P1","confidence":0.93,"downgradeTrigger":"Downgrade if Stage 3 is updated to read adaptiveFusionIntent (or an equivalent continuity-aware override) and a regression test proves resume-profile ordering stays continuity-aware through MMR.","transitions":[{"iteration":1,"from":null,"to":"P1","reason":"Initial discovery"}]}
```

### P2

## Ruled Out
- Missing continuity profile in adaptive fusion: the runtime ships the researched `0.52 / 0.18 / 0.07 / 0.23` profile. [SOURCE: `.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts:68`]

## Dead Ends
- Searching for a hidden continuity-aware Stage 3 override did not surface any alternate path beyond `config.detectedIntent` and `INTENT_LAMBDA_MAP`. [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:209`]

## Recommended Next Focus
Verify the rest of the shipped runtime surfaces around reranker telemetry, rerank gating, and Tier 3 routing so the continuity defect is isolated cleanly.

## Assessment
- New findings ratio: 0.55
- Dimensions addressed: correctness
- Novelty justification: This pass surfaced a new required fix in the live ranking path rather than a documentation-only mismatch.
