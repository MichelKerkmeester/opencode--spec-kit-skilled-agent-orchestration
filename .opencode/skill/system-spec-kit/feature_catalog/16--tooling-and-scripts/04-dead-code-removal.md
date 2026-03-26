---
title: "Dead code removal"
description: "Completed remediation record for removed dead branches, feature flags, module-level state and function exports."
---

# Dead code removal

## 1. OVERVIEW

This entry records the completed dead-code cleanup rather than a live runtime feature. Approximately 360 lines of dead code across four categories have been verified absent from the source tree.

---

## 2. CURRENT REALITY

The codebase is clean across four dead-code categories:

**Hot-path branches:** `hybrid-search.ts` contains no RSF or shadow-scoring branches. Those code paths do not exist.

**Feature flag functions:** `isShadowScoringEnabled()` and `isRsfEnabled()` do not exist in the codebase. `isInShadowPeriod()` in `learned-feedback.ts` is active as the R11 shadow-period safeguard.

**Module-level state:** The following variables do not exist: `stmtCache` (archival-manager.ts), `lastComputedAt` (community-detection.ts), `activeProvider` (cross-encoder.ts), `flushCount` (access-tracker.ts), and the config fields `decayInterval`, `attentionDecayRate`, `minAttentionScore` (working-memory.ts).

**Functions and exports:** `computeCausalDepthScores` is the live batch API in `graph-signals.ts`; no single-node `computeCausalDepth` variant exists. `getSubgraphWeights`, `RECOVERY_HALF_LIFE_DAYS`, the `'related'` weight entry, `logCoActivationEvent`, and `CoActivationEvent` do not exist in the codebase.

**Preserved but not part of the removal set:** `computeStructuralFreshness` and `computeGraphCentrality` still exist as exported utilities in `fsrs.ts`. They remain in the source tree, but this entry does not treat them as active runtime search features or pending activations.

---

## 3. SOURCE EVIDENCE

### 1) Hot-path dead branches (RSF + shadow-scoring)

- **Files where branch logic was removed**
  - `mcp_server/lib/search/hybrid-search.ts`
  - `mcp_server/lib/eval/shadow-scoring.ts`
  - `mcp_server/lib/search/search-flags.ts`
- **Audit evidence**
  - `git show b4f85e327 -- mcp_server/lib/search/hybrid-search.ts` contains removed branch conditions and imports:
    - `-if (isRsfEnabled()) { ... }`
    - `-if (isShadowScoringEnabled()) { ... }`
    - `-import { ... isShadowScoringEnabled } from './search-flags'`
    - `-import { ... isRsfEnabled } from './rsf-fusion'`
  - `git show --numstat b4f85e327 -- mcp_server/lib/search/hybrid-search.ts mcp_server/lib/eval/shadow-scoring.ts` reports `-114` and `-75`.
  - HEAD verification:
    - `rg "isRsfEnabled|isShadowScoringEnabled|fuseResultsRsf" mcp_server/lib/search/hybrid-search.ts` shows no branch calls.
    - `rg "rsfShadow|_s4shadow" mcp_server/lib/search/hybrid-search.ts` confirms metadata passthrough remains.
- **Approx LOC removed:** `~189` (`hybrid-search.ts -114`, `shadow-scoring.ts -75`, commit `b4f85e327`).

### 2) Dead feature-flag functions

- **Files where feature-flag helpers were removed**
  - `mcp_server/lib/search/search-flags.ts` (`isShadowScoringEnabled`)
  - `mcp_server/lib/search/rsf-fusion.ts` (`isRsfEnabled`)
- **Audit evidence**
  - `git show b4f85e327 -- mcp_server/lib/search/search-flags.ts` contains:
    - `-export function isShadowScoringEnabled(): boolean { ... }`
  - `git show b4f85e327 -- mcp_server/lib/search/rsf-fusion.ts` contains:
    - `-function isRsfEnabled(): boolean { ... }`
  - `isInShadowPeriod` is intentionally retained and active:
    - `mcp_server/lib/search/learned-feedback.ts` (HEAD: lines `306`, `411`, `452`).
  - HEAD verification:
    - `rg "export\\s+function\\s+(isShadowScoringEnabled|isRsfEnabled)" mcp_server/lib` => no matches.
    - `rg -n "isRsfEnabled" mcp_server/lib/search/rsf-fusion.ts` => comment-only mention, no live declaration.
- **Approx LOC removed:** `~21` (`search-flags.ts -9`, `rsf-fusion.ts -12`, commit `b4f85e327`).

### 3) Dead module-level state

- **Files where unused state was removed**
  - `mcp_server/lib/cognitive/archival-manager.ts` (`stmtCache`)
  - `mcp_server/lib/graph/community-detection.ts` (`lastComputedAt`)
  - `mcp_server/lib/search/cross-encoder.ts` (`activeProvider`)
  - `mcp_server/lib/storage/access-tracker.ts` (`flushCount`)
  - `mcp_server/lib/cognitive/working-memory.ts` (`decayInterval`, `attentionDecayRate`, `minAttentionScore`)
- **Audit evidence**
  - `git show b4f85e327` includes removals:
    - `-const stmtCache ...`
    - `-let lastComputedAt ...`
    - `-let activeProvider ...`
    - `-flushCount ...`
    - `-decayInterval`, `-attentionDecayRate`, `-minAttentionScore`
  - HEAD verification:
    - `rg "\\b(?:const|let|var)\\s+(stmtCache|lastComputedAt|activeProvider|flushCount)\\b" mcp_server/lib` => no matches.
- **Approx LOC removed:** `~20` (sum of file-level removals in `b4f85e327` for the state-only files above).

### 4) Dead functions and exports

- **Files where dead APIs/constants were removed**
  - `mcp_server/lib/graph/graph-signals.ts` (`computeCausalDepth`)
  - `mcp_server/lib/search/graph-search-fn.ts` (`getSubgraphWeights`)
  - `mcp_server/lib/scoring/negative-feedback.ts` (`RECOVERY_HALF_LIFE_DAYS`)
  - `mcp_server/lib/cognitive/co-activation.ts` (`CoActivationEvent`, `logCoActivationEvent`)
  - `mcp_server/lib/storage/causal-edges.ts` (`'related'` relation weight entry)
- **Audit evidence**
  - `git show b4f85e327 -- mcp_server/lib/graph/graph-signals.ts` contains:
    - `-export function computeCausalDepth(...)`
  - `git show b4f85e327 -- mcp_server/lib/search/graph-search-fn.ts` contains:
    - `-function getSubgraphWeights(...)`
    - `-getSubgraphWeights,`
  - `git show b4f85e327 -- mcp_server/lib/scoring/negative-feedback.ts` contains:
    - `-export const RECOVERY_HALF_LIFE_DAYS = 30;`
  - `git show b4f85e327 -- mcp_server/lib/cognitive/co-activation.ts` contains:
    - `-interface CoActivationEvent`
    - `-function logCoActivationEvent(...)`
  - `git show b4f85e327 -- mcp_server/lib/storage/causal-edges.ts` contains:
    - `-  related:      1.0,`
  - HEAD verification:
    - `rg "export\\s+(function|const|type|interface)\\s+(computeCausalDepth|getSubgraphWeights|RECOVERY_HALF_LIFE_DAYS|CoActivationEvent)\\b" mcp_server/lib` => no matches.
    - `rg -n "computeCausalDepth\\b|computeCausalDepthScores" mcp_server/lib/graph/graph-signals.ts` => only `computeCausalDepthScores` is present and used.
- **Approx LOC removed:** `~118` (`graph-signals -65`, `graph-search-fn -16`, `negative-feedback -5`, `co-activation -20`, `causal-edges -12`, commit `b4f85e327`).

---

## 4. SOURCE FILES

Cross-cutting evidence is distributed across:

- `mcp_server/lib/search/hybrid-search.ts`
- `mcp_server/lib/search/search-flags.ts`
- `mcp_server/lib/search/rsf-fusion.ts` (module fully deleted in v3 remediation)
- `mcp_server/lib/search/learned-feedback.ts`
- `mcp_server/lib/eval/shadow-scoring.ts`
- `mcp_server/lib/cognitive/archival-manager.ts`
- `mcp_server/lib/graph/community-detection.ts`
- `mcp_server/lib/search/cross-encoder.ts`
- `mcp_server/lib/storage/access-tracker.ts`
- `mcp_server/lib/cognitive/working-memory.ts`
- `mcp_server/lib/graph/graph-signals.ts`
- `mcp_server/lib/search/graph-search-fn.ts`
- `mcp_server/lib/scoring/negative-feedback.ts`
- `mcp_server/lib/cognitive/co-activation.ts`
- `mcp_server/lib/storage/causal-edges.ts`

---

## 5. SOURCE METADATA

- Group: Comprehensive remediation (Sprint 8)
- Source feature title: Dead code removal
- Current reality source: FEATURE_CATALOG.md
