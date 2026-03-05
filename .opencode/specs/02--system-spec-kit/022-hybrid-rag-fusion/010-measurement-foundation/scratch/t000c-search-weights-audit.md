# T000c: search-weights.json Audit

**File audited**: `.opencode/skill/system-spec-kit/mcp_server/configs/search-weights.json`
**Config version**: 1.8.0
**Captured**: 2026-02-27

---

## 1. File Contents (verbatim)

```json
{
  "_comment": "Search weight configuration for semantic memory v1.8.0",
  "_version": "1.8.0",

  "maxTriggersPerMemory": 10,

  "_note_documentTypeMultipliers": "Spec 126: document type scoring multipliers. Applied as a final multiplier to composite scores. Source of truth remains in composite-scoring.ts; this section is reference/future-config only.",
  "documentTypeMultipliers": {
    "spec": 1.4,
    "decision_record": 1.4,
    "plan": 1.3,
    "tasks": 1.1,
    "implementation_summary": 1.1,
    "checklist": 1.0,
    "handover": 1.0,
    "memory": 1.0,
    "constitutional": 2.0,
    "scratch": 0.6
  },

  "_note_smartRanking": "PARTIALLY DEAD CONFIG - read only by legacy vector-index-impl.js (line 2241-2243), not by vector-index.ts. Becomes fully dead when the JS file is removed.",
  "smartRanking": {
    "recencyWeight": 0.5,
    "accessWeight": 0.3,
    "relevanceWeight": 0.2
  },

  "_note_rrfFusion": "DEAD CONFIG - no .ts module loads this section. rrf-fusion.ts does not exist. Audit: agent-14, 2026-02-08.",
  "rrfFusion": {
    "_comment": "Reciprocal Rank Fusion configuration (REQ-011). Set env ENABLE_RRF_FUSION=false to disable.",
    "k": 60,
    "convergenceBonus": 0.10,
    "graphWeightBoost": 1.5
  },

  "_note_crossEncoder": "DEAD CONFIG - cross-encoder.ts hardcodes its own values and never reads this section. Config model differs fundamentally from code. Audit: agent-14, 2026-02-08.",
  "crossEncoder": {
    "_comment": "Cross-encoder reranking configuration (REQ-013). Set env ENABLE_CROSS_ENCODER=true to enable.",
    "maxCandidates": 20,
    "p95ThresholdMs": 500,
    "cacheTtlMs": 300000,
    "cacheMaxSize": 1000,
    "lengthPenalty": {
      "threshold": 100,
      "minPenalty": 0.8,
      "maxPenalty": 1.0
    }
  }
}
```

---

## 2. Section-by-Section Analysis

### 2.1 maxTriggersPerMemory

**Value**: `10`
**Status**: LIVE — actively read by production code

**Source**:
```
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:46
const MAX_TRIGGERS_PER_MEMORY = search_weights.maxTriggersPerMemory || 10;
```

**Behavior**: Caps the number of trigger phrases indexed per memory record. When a memory has more than 10 trigger phrases, only the first 10 are used for trigger-matching. The fallback default is also 10 (same as the config value), so the config has no net effect unless changed.

**Assessment**: Live and correct. The fallback `|| 10` means accidentally deleting this key from the JSON has no impact, which is a reasonable fail-safe.

---

### 2.2 documentTypeMultipliers

**Status**: PARTIALLY LIVE — documented as "reference/future-config only" in the `_note`, meaning `composite-scoring.ts` is the source of truth, not this file.

**_note annotation**: "Applied as a final multiplier to composite scores. Source of truth remains in composite-scoring.ts; this section is reference/future-config only."

**Assessment**: This section documents the weight values but does not drive them at runtime. The values here may drift from `composite-scoring.ts` over time without an alert mechanism. The config provides documentation value but no enforcement.

**Anomaly**: `scratch` type has `0.6` multiplier (deprioritization), which aligns with CLAUDE.md policy that scratch content should not surface prominently.

---

### 2.3 smartRanking

**Status**: PARTIALLY DEAD — read only by the legacy `dist/lib/search/vector-index-impl.js` file, NOT by `vector-index.ts` (the TypeScript source).

**_note annotation**: "PARTIALLY DEAD CONFIG - read only by legacy vector-index-impl.js (line 2241-2243), not by vector-index.ts. Becomes fully dead when the JS file is removed."

**Verification**: Confirmed — `vector-index-impl.ts` reads `search_weights.smartRanking` at lines 2802-2804:
```ts
const recency_weight = search_weights.smartRanking?.recencyWeight || 0.3;
const access_weight = search_weights.smartRanking?.accessWeight || 0.2;
const relevance_weight = search_weights.smartRanking?.relevanceWeight || 0.5;
```

The TypeScript source DOES read these values. However, the `_note` annotation says the `.js` file (in `dist/`) is the legacy reader. This contradicts the note.

**Discrepancy**: The `_note` says "not by vector-index.ts" — but the TypeScript file at lines 2802-2804 does read `smartRanking` fields. Either the annotation is outdated, or the `smartRanking` block in the JSON was moved/updated after the `_note` was written. The note was likely accurate when the smartScore function in vector-index.ts was removed or bypassed, but the code at lines 2802-2825 of `vector-index-impl.ts` shows smartScore is still being computed.

**Current config values vs fallback defaults**:

| Weight          | Config Value | Code Fallback | Net Effect                            |
| --------------- | ------------ | ------------- | ------------------------------------- |
| `recencyWeight` | 0.5          | 0.3           | Config overrides: boosts recency more |
| `accessWeight`  | 0.3          | 0.2           | Config overrides: boosts access count |
| `relevanceWeight` | 0.2        | 0.5           | Config REDUCES relevance weight       |

**This is anomalous**: The `relevanceWeight` in config (0.2) is significantly lower than the fallback (0.5). This means the config file actively deprioritizes semantic relevance in favor of recency and access frequency. Given that these weights appear in the smartRanking function which sorts results before other scoring pipeline stages, this has real ranking implications.

**Recommendation**: The annotation inaccuracy and the `relevanceWeight` inversion warrant a formal investigation in Sprint 0.

---

### 2.4 rrfFusion

**Status**: DEAD — no `.ts` module reads this section
**_note annotation**: "DEAD CONFIG - no .ts module loads this section. rrf-fusion.ts does not exist. Audit: agent-14, 2026-02-08."

**Verification**: `rrf-fusion.ts` exists at `lib/search/rrf-fusion.ts` but hardcodes its own values (k=60 is typical for RRF). It does not import or read `search-weights.json`.

**Conclusion**: Dead config. The `k=60` and `convergenceBonus=0.10` values are decoupled from runtime. They exist as documentation artifacts only.

---

### 2.5 crossEncoder

**Status**: DEAD — cross-encoder.ts hardcodes its own configuration values
**_note annotation**: "DEAD CONFIG - cross-encoder.ts hardcodes its own values and never reads this section."

**Assessment**: The config values here (`maxCandidates: 20`, `p95ThresholdMs: 500`, cache settings) may have informed the initial implementation but are no longer live. Any changes to this section have no effect.

**The `ENABLE_RRF_FUSION` and `ENABLE_CROSS_ENCODER` env var names** referenced in the section comments are legacy names; the active flags are `SPECKIT_RRF` and `SPECKIT_CROSS_ENCODER`.

---

## 3. Summary Table

| Section                   | Status         | Live Consumer                             | Anomaly?                                  |
| ------------------------- | -------------- | ----------------------------------------- | ----------------------------------------- |
| `maxTriggersPerMemory`    | LIVE           | `vector-index-impl.ts:46`                 | None (fallback same as value)             |
| `documentTypeMultipliers` | REFERENCE ONLY | `composite-scoring.ts` (own hardcoded)    | May drift from actual values              |
| `smartRanking`            | PARTIALLY LIVE | `vector-index-impl.ts:2802-2804` (and legacy `.js`) | `relevanceWeight: 0.2` vs fallback `0.5` — ANOMALY |
| `rrfFusion`               | DEAD           | None                                      | Config comment references wrong env names |
| `crossEncoder`            | DEAD           | None                                      | Config comment references wrong env names |

---

## 4. Recommendations

1. **Fix `_note_smartRanking` annotation**: It incorrectly states vector-index.ts does not read this. Lines 2802-2804 of `vector-index-impl.ts` do. Correct the note or remove the section if the goal is to fully deprecate it.

2. **Investigate `relevanceWeight: 0.2` in smartRanking**: The code fallback is `0.5`. This active config suppresses relevance score by 60% relative to default. This should be intentional and documented, not incidental.

3. **Remove dead sections** (`rrfFusion`, `crossEncoder`): These create maintenance confusion and may mislead future engineers. If they have documentation value, move them to a comment file or spec document.

4. **Add validation** for `documentTypeMultipliers`: The config documents values that `composite-scoring.ts` hardcodes separately. Consider either (a) making `composite-scoring.ts` read from this file, or (b) removing the section with a comment pointing to the authoritative source.

5. **Update env var names in comments**: `ENABLE_RRF_FUSION` and `ENABLE_CROSS_ENCODER` are the old names. Current names are `SPECKIT_RRF` and `SPECKIT_CROSS_ENCODER`.
