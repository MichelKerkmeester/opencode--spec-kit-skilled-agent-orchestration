---
title: "Scoring Algorithms"
description: "Multi-factor scoring system for memory retrieval with composite weighting, importance tiers, folder ranking and confidence tracking."
trigger_phrases:
  - "scoring algorithms"
  - "importance tiers"
  - "composite scoring"
---

# Scoring Algorithms

> Multi-factor scoring system for memory retrieval with composite weighting, importance tiers, folder ranking and confidence tracking.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. KEY CONCEPTS](#2--key-concepts)
- [3. STRUCTURE](#3--structure)
- [4. USAGE](#4--usage)
- [5. RELATED RESOURCES](#5--related-resources)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

### What is the Scoring Module?

The scoring module provides multi-factor algorithms for ranking memories in the Spec Kit Memory system. It combines similarity scores with temporal decay, importance tiers, usage patterns and validation feedback to surface the most relevant memories.

### Key Features

| Feature | Description |
|---------|-------------|
| **5-Factor Composite** | REQ-017 compliant scoring with temporal, usage, importance, pattern and citation factors |
| **6-Tier Importance** | Constitutional (always surface) to deprecated (hidden from search) |
| **Document-Type Scoring** | Applies document-type multipliers used by spec folder retrieval |
| **Intent-Aware Weighting** | Supports 7 intent types including `find_spec` and `find_decision` |
| **Folder Scoring** | Rank spec folders by recency, activity and importance |
| **Confidence Tracking** | User feedback loop for memory promotion |
| **FSRS Decay** | Spaced repetition formula for retrievability |
| **Event-Based Decay** | Event-driven decay model replacing pure time-based decay (Spec 136) |
| **HVR Integration** | Human Validation Rate integration for confidence-weighted scoring (Spec 137) |
| **Phase-Aware Scoring** | Phase-context scoring adjustments for spec phase workflows (Spec 139) |
| **Graph Signals** | Optional post-score momentum and causal-depth bonuses applied after core scoring |

### Module Statistics

| Category | Count | Details |
|----------|-------|---------|
| Modules | 7 | Core scoring algorithms (.ts source files) |
| Importance Tiers | 6 | constitutional, critical, important, normal, temporary, deprecated |
| Scoring Factors | 5 | temporal, usage, importance, pattern, citation |
| Export Functions | 40+ | Scoring utilities and helpers |

<!-- /ANCHOR:overview -->

---

## 2. KEY CONCEPTS
<!-- ANCHOR:key-concepts -->

### 5-Factor Composite Weights (REQ-017)

| Factor | Weight | Description |
|--------|--------|-------------|
| **Temporal** | 0.25 | FSRS retrievability decay based on stability |
| **Usage** | 0.15 | Access frequency boost (min 1.5x) |
| **Importance** | 0.25 | Tier-based multiplier (constitutional=2x, critical=1.5x) |
| **Pattern** | 0.20 | Query alignment (title, anchor, type matching) |
| **Citation** | 0.15 | Recency of last citation/access |

### 6-Factor Weight Reference

| Factor | Weight | Description |
|--------|--------|-------------|
| **Similarity** | 0.30 | Vector similarity score |
| **Importance** | 0.25 | Base importance weight |
| **Retrievability** | 0.15 | FSRS-based decay |
| **Popularity** | 0.15 | Access count boost |
| **Recency** | 0.10 | Time since update |
| **Tier Boost** | 0.05 | Importance tier multiplier |

### Importance Tier Configuration

| Tier | Value | Search Boost | Decay | Auto-Expire | Behavior |
|------|-------|--------------|-------|-------------|----------|
| **constitutional** | 1.0 | 3.0x | No | Never | Always surface at top |
| **critical** | 1.0 | 2.0x | No | Never | Never expire, surface first |
| **important** | 0.8 | 1.5x | No | Never | High priority, no decay |
| **normal** | 0.5 | 1.0x | Yes | Never | Standard memory |
| **temporary** | 0.3 | 0.5x | Yes | 7 days | Session-scoped, auto-expires |
| **deprecated** | 0.1 | 0.0x | No | Never | Hidden from search |

### Folder Score Weights

| Factor | Weight | Description |
|--------|--------|-------------|
| **Recency** | 0.40 | Days since last update (primary for "resume work") |
| **Importance** | 0.30 | Weighted average of memory tiers |
| **Activity** | 0.20 | Memory count (capped at 5 for max) |
| **Validation** | 0.10 | User feedback score (placeholder) |

### Document-Type Multipliers

The scoring layer includes document-type multipliers for active document types (for example `spec`, `plan`, `tasks`, `checklist`, `decision-record`, `implementation-summary`, `memory`, `constitutional`, `research`, `handover`, `scratch`). These multipliers are used by folder scoring and document retrieval ranking.

### Event-Based Decay Model (Spec 136)

The scoring module supports an event-based decay model that replaces pure time-based decay with event-driven signals. Instead of decaying scores solely based on elapsed time, the model tracks meaningful events (access, citation, validation) and adjusts decay rates based on event frequency and recency. This provides more accurate relevance scoring for memories that are actively referenced versus those that are merely recent.

**Key properties:**
- Decay triggered by event gaps rather than wall-clock time
- Event types: `access`, `citation`, `validation`, `modification`
- Memories with frequent events decay slower; idle memories decay faster
- Backward-compatible with FSRS decay (falls back when no event data available)

### Human Validation Rate (HVR) Integration (Spec 137)

HVR integration extends the confidence tracking system by incorporating human validation signals into composite scoring. The HVR score reflects how often users confirm a memory as useful versus not useful, creating a feedback-weighted confidence metric.

**Key properties:**
- HVR score = validated_useful_count / total_validation_count
- Integrates with the Confidence Tracking factor in composite scoring
- High-HVR memories receive score boosts during retrieval
- Low-HVR memories are candidates for demotion or deprecation
- Works alongside the existing promotion pipeline in `confidence-tracker.ts`

### Phase-Aware Scoring (Spec 139)

Phase-aware scoring adjusts retrieval relevance based on the active spec phase context. When a user is working within a specific phase of a phased spec folder, memories belonging to that phase (or its parent/sibling phases) receive scoring adjustments.

**Key properties:**
- Phase context derived from spec folder structure (e.g., `003-parent/001-phase-child`)
- Same-phase memories receive a boost; unrelated-phase memories receive a penalty
- Parent-phase memories are boosted at a lower factor than same-phase
- Phase columns added in schema v15 for persistent phase metadata

### Graph Signals Post-Processing

Graph signals are applied after the core scoring pipeline via `lib/graph/graph-signals.ts`. When enabled, they add two bounded bonuses to the current score:

- Momentum bonus: `clamp(momentum * 0.01, 0, 0.05)`
- Causal-depth bonus: `normalizedDepth * 0.05`

The causal-depth pass condenses strongly connected components, then computes longest-path depth across the resulting DAG. This preserves deeper causal chains even when shortcut edges exist, gives all members of a cycle the same bounded depth layer, and still leaves pure isolated cycles at `0` normalized depth.

<!-- /ANCHOR:key-concepts -->

---

## 3. STRUCTURE
<!-- ANCHOR:structure -->

```
scoring/
 composite-scoring.ts     # 5-factor and 6-factor composite scoring, N4 cold-start boost, score normalization
 importance-tiers.ts      # 6-tier importance configuration
 folder-scoring.ts        # Re-exports from @spec-kit/shared/scoring/folder-scoring
 confidence-tracker.ts    # User validation and promotion
 interference-scoring.ts  # TM-01 interference penalty for redundant memories (Sprint 2)
 mpab-aggregation.ts      # Multi-Parent Aggregated Bonus for chunk-to-memory score aggregation
 negative-feedback.ts     # Negative validation confidence multiplier with time-based recovery
 README.md                # This file
```

**Note:** `dist/lib/scoring/` currently emits module-per-source compiled artifacts such as `composite-scoring.js`, `folder-scoring.js`, and `importance-tiers.js`. There is no generated `index.js` or `scoring.js` in the current build output.

### Key Files

| File | Purpose |
|------|---------|
| `composite-scoring.ts` | Main scoring engine with 5-factor REQ-017 model, N4 cold-start novelty boost, score normalization, interference penalty integration |
| `importance-tiers.ts` | Tier definitions, boost functions, SQL helpers |
| `folder-scoring.ts` | Re-export from @spec-kit/shared/scoring/folder-scoring |
| `confidence-tracker.ts` | Feedback loop: validation -> promotion |
| `interference-scoring.ts` | TM-01 interference penalty: counts similar memories in same spec_folder, applied as scoring penalty to demote redundant results |
| `mpab-aggregation.ts` | Multi-Parent Aggregated Bonus (MPAB) for chunk-to-memory score aggregation; computes aggregated scores after RRF fusion, collapses and reassembles chunk results |
| `negative-feedback.ts` | Negative validation confidence multiplier with 30-day half-life recovery; records negative feedback events and batch-loads stats for scoring pipeline |

<!-- /ANCHOR:structure -->

---

## 4. USAGE
<!-- ANCHOR:usage -->

### Example 1: Calculate 5-Factor Score

```typescript
import { calculateFiveFactorScore } from './composite-scoring';

const memory = {
  stability: 30,
  last_review: '2025-01-15T10:00:00Z',
  access_count: 5,
  importance_tier: 'important',
  importance_weight: 0.8,
  similarity: 85,
  title: 'Authentication Implementation',
};

const score = calculateFiveFactorScore(memory, {
  query: 'auth login',
  anchors: ['implementation'],
});
// Returns: 0.0 - 1.0 composite score
```

### Example 2: Apply Tier Boost

```typescript
import { applyTierBoost, getTierConfig } from './importance-tiers';

const baseScore = 0.75;
const boostedScore = applyTierBoost(baseScore, 'critical');
// Returns: 1.5 (0.75 * 2.0x boost)

const config = getTierConfig('constitutional');
// Returns: { value: 1.0, searchBoost: 3.0, decay: false, alwaysSurface: true, ... }
```

### Example 3: Rank Spec Folders

```typescript
import { computeFolderScores } from './folder-scoring';

const memories = [
  { spec_folder: '012-auth', updated_at: '2025-01-20', importance_tier: 'critical' },
  { spec_folder: '012-auth', updated_at: '2025-01-19', importance_tier: 'normal' },
  { spec_folder: 'z_archive/001-old', updated_at: '2024-06-01', importance_tier: 'deprecated' },
];

const ranked = computeFolderScores(memories, { includeArchived: false });
// Returns: [{ folder: '012-auth', score: 0.85, recencyScore: 0.95, ... }]
```

### Example 4: Track Confidence and Promote

```typescript
import { recordValidation, getConfidenceInfo } from './confidence-tracker';
import Database from 'better-sqlite3';

const db = new Database('context-index.sqlite');

// Record positive validation
const result = recordValidation(db, memoryId, true);
// Returns: { confidence: 0.6, validationCount: 1, promotionEligible: false }

// After 5+ validations with confidence >= 0.9
const info = getConfidenceInfo(db, memoryId);
// Returns: { promotionEligible: true, wasPromoted: true, importanceTier: 'critical' }
```

> **Note on `validationCount`:** SQLite returns `validation_count` (snake_case column name).
> The code type-casts to include both `validationCount` and `validation_count` for safety,
> but the camelCase variant is always `undefined`. The `??` fallback chain ensures
> `validation_count` is used at runtime. No bug, but the type cast is defensive/misleading.

### Common Patterns

| Pattern | Code | When to Use |
|---------|------|-------------|
| Get tier value | `getTierValue('critical')` | Numeric importance (0-1) |
| Check decay | `allowsDecay('constitutional')` | Filter decay-exempt tiers |
| Archive check | `isArchived('/z_archive/old')` | Deprioritize archived folders |
| Score breakdown | `getFiveFactorBreakdown(row)` | Debug/explain scoring |

<!-- /ANCHOR:usage -->

---

## 5. RELATED RESOURCES
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [../config/README.md](../config/README.md) | Memory type half-lives and inference |
| [../cognitive/README.md](../cognitive/README.md) | FSRS scheduler, attention decay |
| [../storage/README.md](../storage/README.md) | Access tracking, checkpoints |

### Parent Module

| Resource | Description |
|----------|-------------|
| [../../README.md](../../README.md) | MCP server overview |
| [../../../SKILL.md](../../../SKILL.md) | System Spec Kit skill documentation |

<!-- /ANCHOR:related -->

---

**Version**: 1.9.0
**Last Updated**: 2026-03-08

**Migration Notes**:
- 7 of 9 modules migrated to TypeScript (.ts) as source of truth
- `index.js` and `scoring.js` remain as compiled JS only in `dist/lib/scoring/` (barrel re-exports and base decay utilities, never had .ts source)
- Compiled output in `dist/lib/scoring/`
- `folder-scoring.ts` re-exports from `@spec-kit/shared/scoring/folder-scoring`
- Import paths use ES modules (`import` instead of `require`)
