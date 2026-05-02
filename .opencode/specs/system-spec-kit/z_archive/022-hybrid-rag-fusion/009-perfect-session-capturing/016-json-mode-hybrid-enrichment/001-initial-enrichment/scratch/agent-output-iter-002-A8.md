# Iteration A8 (Wave 2): Q7 (Contamination Filter Scope) + Q8 (projectPhase Detection)

## Focus
Investigate which fields bypass contamination cleaning (Q7) and how projectPhase detection works in JSON mode including whether it should accept an explicit override (Q8). Trace each field from JSON input through normalization to template output, identifying which pass through `filterContamination` and which do not.

## Findings

### Q7: Contamination Filter Scope — Which Fields Need Cleaning Passes?

**Finding 1: filterContamination is called in exactly ONE place in the pipeline** (workflow.ts lines 548-602). The `cleanContaminationText` closure and `cleanObservations` helper are defined there. They are applied to exactly two data categories:

1. **observations** — title, narrative, and each fact string (via `cleanObservations()` at line 599)
2. **SUMMARY** — the collectedData.SUMMARY string field (line 600-601)

No other field anywhere in the codebase calls `filterContamination`. Confirmed by grep: only workflow.ts:550 is a non-test call site.
[SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:548-602]

**Finding 2: Fields that bypass contamination cleaning entirely** — traced from JSON input through input-normalizer.ts to collect-session-data.ts output:

| Field | Path Through Pipeline | Contamination Risk | Severity |
|---|---|---|---|
| `sessionSummary` | Becomes observation title+narrative (slow path, line 550) OR passed raw as `_JSON_SESSION_SUMMARY` (collect-session-data.ts:990) | **HIGH** — The raw `_JSON_SESSION_SUMMARY` passthrough is used as a title candidate (RC1) and is never cleaned. The observation version IS cleaned, but the raw version is not. | Critical |
| `keyDecisions` | Transformed to decision observations via `transformKeyDecision()` (line 484-487) | **MEDIUM** — Decision observations ARE cleaned via `cleanObservations()`, but only after transformation. The `_manualDecisions` array (line 477) preserves the original uncleaned text for separate template consumption. | High |
| `nextSteps` | Becomes a followup observation via `buildNextStepsObservation()` (line 447-448, 573-574) | **LOW** — The observation IS cleaned. However, the nextSteps text also feeds `extractNextAction()` via observation facts pattern matching, and the matched text is the post-clean version. | Low |
| `blockers` | Extracted by `extractBlockers()` from observation narratives (session-extractor.ts:304-338) | **LOW** — Operates on observations which are already cleaned. The blocker text in the output inherits the cleaned version. | Low |
| `recentContext` | Passed through as-is (input-normalizer.ts:425-429, collect-session-data.ts:948, output at line 1202) | **HIGH** — Never passes through any cleaning. The `recentContext[].learning` and `recentContext[].request` strings go directly to output. `extractFromRecentContext()` (session-extractor.ts:276-281) also reads this uncleaned data to extract nextAction. | Critical |
| `technicalContext` | Mapped to `TECHNICAL_CONTEXT` array of `{KEY, VALUE}` (input-normalizer.ts:457-459, collect-session-data.ts:995-996) | **MEDIUM** — Neither keys nor values are cleaned. Technical context strings could contain AI preambles. | High |

[SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:414-491]
[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:988-996]

**Finding 3: The `_JSON_SESSION_SUMMARY` passthrough is the most dangerous gap.** At collect-session-data.ts line 990, the raw `sessionSummary` from JSON input is passed through as `_JSON_SESSION_SUMMARY` without any cleaning. This value is then used in title generation (line 918 shows it as first candidate: `sessionData._JSON_SESSION_SUMMARY || ''`). If the AI writes "Let me analyze the session and save context" as `sessionSummary`, the contamination phrase "Let me analyze" would survive into the memory title.
[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:918, 990]

**Finding 4: `_manualDecisions` preserves uncleaned decision text.** When `keyDecisions` is provided in JSON, it is cloned to `_manualDecisions` (input-normalizer.ts:477) BEFORE the observations are cleaned. The `_manualDecisions` array is used separately in template rendering for the DECISIONS section. This means decision titles and rationales could contain contamination phrases that the observation cleaning already caught.
[SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:476-477]

### Q8: projectPhase Detection — Always 'RESEARCH' in JSON Mode

**Finding 5: projectPhase detection depends entirely on toolCounts, which are always zero in JSON mode.** The `detectProjectPhase()` function (session-extractor.ts:188-207) first sums all tool counts. When `total === 0` (which is always true for JSON-mode input because tool counts come from observation fact parsing, and JSON-mode observations rarely contain tool usage facts), it immediately returns `'RESEARCH'`.

The detection logic is:
```
total === 0 → 'RESEARCH' (JSON mode always hits this)
writeTools/total > 0.4 → 'IMPLEMENTATION'
hasDecisions && writeTools < readTools → 'PLANNING'
hasFeatures && writeTools > 0 → 'REVIEW'
readTools/total > 0.6 → 'RESEARCH'
default → 'IMPLEMENTATION'
```

[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:188-207]

**Finding 6: Unlike `contextType` and `importanceTier`, there is NO explicit override mechanism for `projectPhase`.** The session-extractor.ts exports `detectProjectPhase` but not a `resolveProjectPhase` function. Compare:
- `contextType`: Has explicit override via `explicitContextType` parameter in `detectSessionCharacteristics()` (session-extractor.ts:550-562). Input-normalizer propagates `contextType` through both fast-path (line 466-468) and slow-path.
- `importanceTier`: Has explicit override via `resolveImportanceTier()` (session-extractor.ts:162-175). Input-normalizer propagates `importanceTier` through both fast-path (line 461-464) and slow-path.
- `projectPhase`: Called as `detectProjectPhase(toolCounts, observations, messageCount)` in `buildProjectStateSnapshot()` (session-extractor.ts:580). No explicit parameter, no override mechanism, no propagation in input-normalizer.

[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts:545-569, 576-587]

**Finding 7: Impact of incorrect projectPhase on output.** The `projectPhase` flows to:
1. `PROJECT_PHASE` in the output data (collect-session-data.ts:1012) — rendered in the memory YAML frontmatter
2. `generateContextSummary()` (collect-session-data.ts:635, 548) — embedded in the context summary narrative as `**Phase:** ${projectPhase}`
3. Memory files permanently record `project_phase: RESEARCH` even for implementation-heavy sessions

The downstream impact: MCP search queries filtering by phase would return wrong results. A session that implemented 50 files would be tagged as RESEARCH. The quality scorer and importance tier don't directly use projectPhase, so the impact is primarily on metadata accuracy and search relevance.
[SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:543-548, 1012]

## Sources Consulted
- `.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts` (full file, 200 lines)
- `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts` (full file, 611 lines)
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` (lines 530-610)
- `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` (lines 1-520)
- `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts` (lines 600-1030)
- Grep results for `filterContamination` across scripts/ (22 results, only 1 non-test call site)
- Grep results for `projectPhase` across scripts/ (14 results)

## Assessment
- New information ratio: 0.86 (6 of 7 findings are fully new; Finding 5 partially confirmed known A4 finding about RESEARCH default)
- Questions addressed: Q7, Q8
- Questions answered: Q7 (fully), Q8 (fully)

## Reflection
- What worked and why: Direct source reading of the contamination filter call site in workflow.ts (lines 548-602) was the most productive action -- it immediately revealed the scope boundary. Then tracing each JSON field through input-normalizer.ts showed exactly which paths bypass that boundary. The comparison of contextType/importanceTier override patterns vs projectPhase absence was a clean structural proof.
- What did not work: N/A -- all research actions were productive this iteration.
- What I would do differently: Could have also checked template-renderer.ts to see how `_JSON_SESSION_SUMMARY` and `_manualDecisions` are rendered, but the input-side trace was sufficient to prove the contamination gap.

## Recommended Next Focus
The A8 findings reveal two concrete implementation opportunities:
1. **Extend contamination cleaning** to `_JSON_SESSION_SUMMARY`, `_manualDecisions`, `recentContext`, and `technicalContext` -- add `cleanContaminationText()` calls for each in workflow.ts
2. **Add `projectPhase` explicit override** following the established contextType/importanceTier pattern: add `resolveProjectPhase()` in session-extractor.ts, propagate through input-normalizer.ts fast/slow paths, wire into `buildProjectStateSnapshot()`
