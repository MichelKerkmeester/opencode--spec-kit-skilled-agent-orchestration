# Iteration 13: D2 Call-graph and Precedence Gate Design (Q10)

## Focus
This iteration resolves the concrete design question left open by the iteration-9 narrowing: if D2 should ship as a precedence-only fix, exactly where does the raw JSON decision path meet the lexical fallback that emits placeholder decisions, and which branch must be gated so well-formed `keyDecisions` win without removing degraded fallback behavior for decision-less payloads. That is the core concern behind the P2 D2 remediation ordering in `research.md` section 10, which explicitly says D2 should ship with "precedence hardening and regression fixtures rather than a broad mode-based behavior change." [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:184-189]

The live source shows the key nuance: there is no raw-JSON parser inside `decision-extractor.ts` itself. Raw `keyDecisions` are promoted upstream by `normalizeInputData()` in `input-normalizer.ts`, and `extractDecisions()` only sees the normalized carriers `_manualDecisions` and `observations`. The D2 gate therefore belongs at the lexical fallback predicate inside `extractDecisions()`, not at a later merge point. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:566-584] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:676-752] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:381-388]

## Approach
1. Read the reopened Gen-2 packet state: strategy, canonical research synthesis, and the prior D2-focused iterations (003 and 009). [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/deep-research-strategy.md:182-189] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-003.md:17-30] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-009.md:17-24]
2. Open the live `decision-extractor.ts` and inventory every function, including the placeholder-emitting lexical helper and the main `extractDecisions()` merge logic. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:38-615]
3. Trace the caller chain from `runWorkflow()` to `normalizeInputData()` and then to `extractDecisions()` to identify where raw `keyDecisions` become normalized carriers. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:588-637] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1014-1031] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:447-589] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:676-752]
4. Compare that path with `conversation-extractor.ts`, which still reads raw `keyDecisions` directly, to confirm the asymmetry is specific to decision extraction. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:58-107]
5. Isolate the exact predicate that admits lexical fallback and determine whether D2 is a precedence issue, a merge/clobber issue, or an upstream handoff gap. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:367-388] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:572-615]

## Decision-extractor function inventory
| Function | File:lines | Inputs | Outputs | Purpose |
|----------|-----------|--------|---------|---------|
| `normalizeConfidence` | `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:38-41` | `number` | `number` | Clamp confidence into the 0..1 range, including percent-style inputs. |
| `isSpecificChoice` | `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:43-46` | `string` | `boolean` | Reject placeholder choices like `Chosen Approach` or `Option A` when scoring confidence. |
| `hasTradeoffSignals` | `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:48-50` | `string[]` | `boolean` | Detect tradeoff/pro-con language in decision evidence. |
| `buildDecisionConfidence` | `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:52-107` | scoring params object | `{ choiceConfidence, rationaleConfidence, confidence }` | Compute per-decision confidence from explicit fields or heuristic evidence. |
| `extractSentenceAroundCue` | `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:109-135` | `string` | `string \| null` | Find the sentence around a decision cue verb for degraded lexical extraction. |
| `buildLexicalDecisionObservations` | `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:137-176` | `CollectedDataSubset<'_manualDecisions' \| 'SPEC_FOLDER' \| 'userPrompts' \| 'observations'>` | array of synthetic decision observations | Mine `observations` and `userPrompts` for decision-like sentences and emit placeholder-titled observations such as `observation decision 1`. |
| `extractDecisions` | `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-615` | `CollectedDataSubset<'_manualDecisions' \| 'SPEC_FOLDER' \| 'userPrompts' \| 'observations'> \| null` | `Promise<DecisionData>` | Process manual decisions, suppress overlapping observation decisions, optionally fall back to lexical mining, then compute anchors/counters for the final decisions payload. |

## Call graph (ASCII or indented tree)
```text
workflow.ts::runWorkflow
  ├─ normalizeInputData(preloadedData)                                   [raw JSON promotion stage]
  │   ├─ keyDecisions/key_decisions -> _manualDecisions                  [SOURCE: input-normalizer.ts:566-573,751-752]
  │   └─ transformKeyDecision(item) -> observations[type="decision"]     [SOURCE: input-normalizer.ts:575-584,681-687,200-260]
  └─ decision-extractor.ts::extractDecisions(collectedData)              [SOURCE: workflow.ts:1014-1031]
       ├─ manualDecisions = collectedData?._manualDecisions || []        [normalized raw path enters here]
       ├─ processedManualDecisions = manualDecisions.map(...)            [SOURCE: decision-extractor.ts:185-365]
       ├─ decisionObservations = observations.filter(type==="decision")  [SOURCE: decision-extractor.ts:367-377]
       ├─ lexicalDecisionObservations =                                   [fallback gate]
       │    decisionObservations.length === 0 &&
       │    processedManualDecisions.length === 0
       │      ? buildLexicalDecisionObservations(collectedData)
       │      : []                                                       [SOURCE: decision-extractor.ts:381-384]
       └─ allDecisions = [...processedManualDecisions, ...decisions]     [SOURCE: decision-extractor.ts:572-615]
```

## Precedence gate analysis
- Current precedence: **other**. The raw `keyDecisions` path is upstream-normalized first in `normalizeInputData()`, and the lexical path only runs inside `extractDecisions()` when both normalized decision carriers are empty. This is not a raw-vs-lexical concat race and not a lexical clobber of already-processed manual decisions. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:617-637] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:566-584] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:676-752] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:375-388] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:572-615]
- Why D2 occurs: `extractDecisions()` never reads raw `keyDecisions` directly; it only checks `_manualDecisions` and decision-typed observations. If normalization fails to populate those carriers, the lexical predicate still passes and `buildLexicalDecisionObservations()` emits placeholder titles. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:381-384] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:137-176]
- Exact branch predicate to gate: `decisionObservations.length === 0 && processedManualDecisions.length === 0` at [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:381-384]
- Proposed <=15-line precedence-only patch sketch (not a final diff, but a structural proposal):
  ```ts
  const rawKeyDecisions = getRawKeyDecisions(collectedData);

  if (processedManualDecisions.length === 0 && rawKeyDecisions.length > 0) {
    processedManualDecisions = rawKeyDecisions.map(processRawDecisionLikeCurrentManualPath);
  }

  const lexicalDecisionObservations =
    decisionObservations.length === 0 &&
    processedManualDecisions.length === 0 &&
    rawKeyDecisions.length === 0
      ? buildLexicalDecisionObservations(collectedData)
      : [];
  ```
- Risk: if the guard is too broad (for example, disabling lexical fallback for all JSON/file-mode inputs instead of only when authoritative raw arrays exist), degraded payloads that legitimately omit `keyDecisions` would lose the current fallback behavior and produce no decision section at all. That is the specific regression iteration 9 warned against. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-009.md:17-24] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/research.md:202-207]

## Findings
1. `runWorkflow()` is the entry point that normalizes preloaded JSON first and only then dispatches `extractDecisions(collectedData)` inside the extractor Promise group. [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:588-637] [SOURCE: .opencode/skill/system-spec-kit/scripts/core/workflow.ts:1014-1031]
2. The raw `keyDecisions` list is handled upstream by `normalizeInputData()`, not by `decision-extractor.ts`: the normalizer copies it into `_manualDecisions` and, when needed, synthesizes decision observations via `transformKeyDecision()`. [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:566-584] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:676-752] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:200-260]
3. Inside `decision-extractor.ts`, the raw path intersects the fallback path only at the `extractDecisions()` boundary where `_manualDecisions` becomes `manualDecisions`; there is no direct `keyDecisions` reader in this file. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185]
4. The placeholder strings `observation decision N` and `user decision N` are emitted only by `buildLexicalDecisionObservations()`, which mines cue-bearing sentences from observations and user prompts. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:137-176]
5. The exact lexical admission gate is the ternary predicate `decisionObservations.length === 0 && processedManualDecisions.length === 0`; that is the branch condition a precedence-only D2 fix must tighten. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:381-384]
6. This is not a merge/clobber bug: when manual decisions exist, `extractDecisions()` explicitly clears `decisionObservations`, skips lexical mining, and later concatenates processed manual decisions into the final array. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:375-388] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:572-615]
7. `conversation-extractor.ts` still reads raw `keyDecisions` directly when building synthetic messages, which confirms the raw-field asymmetry is specific to decision extraction rather than a repo-wide absence of raw JSON handling. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:58-107]
8. The correct D2 patch boundary is therefore inside `extractDecisions()`: either rehydrate manual decisions from raw arrays there when normalization missed, or at minimum add `rawKeyDecisions.length === 0` to the lexical predicate so authoritative raw arrays block placeholder generation. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:381-384] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:566-584]

## Ruled out / not reproducible
The live source does **not** support a "lexical fallback clobbers already-parsed raw decisions" theory. Once `processedManualDecisions.length > 0`, `decisionObservations` are cleared, lexical extraction is skipped, and the final return concatenates manual decisions first; there is no later overwrite branch to reproduce. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:375-388] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:572-615]

The live source also does **not** support a "raw parser exists inside `decision-extractor.ts` but loses a precedence fight" theory. The file never reads `keyDecisions`/`key_decisions`; that handling exists only upstream in `normalizeInputData()` and separately in `conversation-extractor.ts`. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:182-185] [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:566-584] [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/conversation-extractor.ts:87-107]

## New questions raised
- What concrete payload shape caused `_manualDecisions` to be absent in the broken F1/F2 saves even though the normalizer has explicit `keyDecisions` promotion logic? [SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:566-584] [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-quality-issues/research/iterations/iteration-003.md:17-30]
- Should the D2 hardening reuse the existing manual-decision mapping logic inline, or extract that mapping into a shared helper so raw-rehydration and normalized-manual processing cannot drift? [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:193-365]

## Next focus recommendation
Iteration 14 should execute Q11 (D5 continuation-signal corpus). See strategy section 14.
