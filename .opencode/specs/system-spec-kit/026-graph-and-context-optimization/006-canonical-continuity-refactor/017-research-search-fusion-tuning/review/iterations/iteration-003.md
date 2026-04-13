# Iteration 3: Core search docs now overstate continuity-aware Stage 3 behavior

## Focus
Audit the requested operator-facing doc surfaces against the live Stage 3 code path, with special attention to the new continuity-related wording added during packet `005-doc-surface-alignment`.

## Findings

### P0

### P1
- **F002**: Search docs claim a continuity-aware Stage 3 lambda that the runtime still does not execute — `.opencode/command/memory/search.md:102` — the command contract, architecture doc, config README, repo README, and feature-catalog summaries now all say the final Stage 3 MMR pass uses continuity lambda `0.65`, but Stage 3 still selects lambda from `config.detectedIntent` rather than the internal continuity handoff used earlier in the pipeline. [SOURCE: `.opencode/command/memory/search.md:102`] [SOURCE: `.opencode/skill/system-spec-kit/ARCHITECTURE.md:150`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/configs/README.md:49`] [SOURCE: `README.md:393`] [SOURCE: `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:209`]

```json
{"type":"claim-adjudication","findingId":"F002","claim":"The updated search docs overstate current reality by documenting a continuity-aware Stage 3 MMR lambda that the live runtime still does not execute.","evidenceRefs":[".opencode/command/memory/search.md:102",".opencode/skill/system-spec-kit/ARCHITECTURE.md:150",".opencode/skill/system-spec-kit/mcp_server/configs/README.md:49","README.md:393",".opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts:209"],"counterevidenceSought":"Read the named doc surfaces plus the live Stage 3 branch looking for wording that scoped continuity to Stage 2 only or a runtime override that made the docs true; neither exists.","alternativeExplanation":"The docs could have intended continuity lambda language as future-state guidance, but the packet is framed as doc alignment to shipped behavior, so presenting it as current reality is still inaccurate.","finalSeverity":"P1","confidence":0.91,"downgradeTrigger":"Downgrade if either the runtime Stage 3 handoff is fixed to match the docs or the docs are corrected to describe continuity as Stage 1/2-only until that fix lands.","transitions":[{"iteration":3,"from":null,"to":"P1","reason":"Initial discovery"}]}
```

### P2

## Ruled Out
- `SKILL.md` drift on this exact point: the skill-level search summary is broad about continuity, rerank gating, and telemetry, but it does not explicitly promise the continuity Stage 3 lambda is already active. [SOURCE: `.opencode/skill/system-spec-kit/SKILL.md:592`]

## Dead Ends
- Looking for a compensating repo doc that explicitly corrected the Stage 3 continuity claim did not surface any such note; the same claim is repeated across the updated surfaces instead. [SOURCE: `.opencode/command/memory/search.md:103`]

## Recommended Next Focus
Trace the same claim through the feature catalog and packet-local `005-doc-surface-alignment` evidence so the traceability drift is separated from the public doc drift.

## Assessment
- New findings ratio: 0.42
- Dimensions addressed: traceability, maintainability
- Novelty justification: This pass added a new major doc-accuracy finding because multiple updated surfaces now present an unshipped Stage 3 behavior as current reality.
