# Actionable Recommendations: Cognitive Memory Upgrade

> **Research ID:** 079-speckit-cognitive-memory
> **Date:** 2026-01-27
> **Target System:** Spec Kit Memory MCP Server
> **Word Count:** ~1,400

---

## Executive Summary

Based on analysis of FSRS, Vestige, and cognitive science research, this document provides prioritized recommendations for upgrading Spec Kit Memory with human-like memory characteristics. The core insight: **intelligent forgetting is as important as remembering**.

---

## 1. Applicable Patterns for Spec Kit Memory

### 1.1 FSRS Power-Law Decay (HIGH PRIORITY)

**Pattern:** Replace exponential decay with FSRS power-law formula.

**Current:**
```javascript
// attention-decay.js
score × rate^turns  // Exponential, too aggressive
```

**Recommended:**
```javascript
// FSRS power-law (proven on 100M+ users)
R(t, S) = (1 + 0.235 × t/S)^(-0.5)
```

**Implementation:**
```javascript
// lib/cognitive/fsrs-decay.js
function calculateRetrievability(stabilityDays, elapsedDays) {
  const FACTOR = 19 / 81;  // ~0.235
  const DECAY = -0.5;
  return Math.pow(1 + FACTOR * (elapsedDays / stabilityDays), DECAY);
}
```

**Impact:** Natural forgetting that matches human memory curves.

---

### 1.2 Prediction Error Gating (HIGH PRIORITY)

**Pattern:** Detect conflicts before creating duplicate memories.

**Implementation:**
```javascript
// lib/cognitive/prediction-error-gate.js
const THRESHOLDS = {
  DUPLICATE: 0.95,    // Skip, reinforce existing
  HIGH_MATCH: 0.90,   // Check contradiction
  MEDIUM_MATCH: 0.70  // Context-dependent
};

function evaluateMemory(newContent, newEmbedding, candidates) {
  const best = findMostSimilar(candidates, newEmbedding);

  if (best.similarity >= THRESHOLDS.DUPLICATE) {
    return { action: 'REINFORCE', targetId: best.id };
  }

  if (best.similarity >= THRESHOLDS.HIGH_MATCH) {
    if (detectContradiction(newContent, best.content)) {
      return { action: 'SUPERSEDE', targetId: best.id };
    }
    return { action: 'REINFORCE', targetId: best.id };
  }

  if (best.similarity >= THRESHOLDS.MEDIUM_MATCH) {
    return { action: 'LINK', targetId: best.id };
  }

  return { action: 'CREATE' };
}
```

**Impact:** Eliminates duplicate memories, handles contradictions gracefully.

---

### 1.3 Dual-Strength Tracking (MEDIUM PRIORITY)

**Pattern:** Track Storage Strength (how learned) separately from Retrieval Strength (how accessible).

**Schema Addition:**
```sql
ALTER TABLE memory_index ADD COLUMN stability REAL DEFAULT 1.0;
ALTER TABLE memory_index ADD COLUMN difficulty REAL DEFAULT 5.0;
ALTER TABLE memory_index ADD COLUMN last_review TEXT;
```

**Implementation:**
```javascript
function updateStrengths(memoryId, wasSuccessful) {
  const memory = getMemory(memoryId);
  const elapsed = daysSince(memory.last_review);
  const currentR = calculateRetrievability(memory.stability, elapsed);

  if (wasSuccessful) {
    // Harder retrieval = greater stability boost (desirable difficulty)
    const boost = Math.exp(0.1 * (11 - memory.difficulty))
                * Math.pow(memory.stability, -0.2)
                * (Math.exp(2.0 * (1 - currentR)) - 1);
    memory.stability *= (1 + boost);
  } else {
    // Partial reset with memory of past learning
    memory.stability = 0.5 * Math.pow(memory.difficulty, -0.2)
                     * (Math.pow(memory.stability + 1, 0.1) - 1);
  }

  memory.last_review = now();
  saveMemory(memory);
}
```

**Impact:** Enables "dormant" memories to be reactivated efficiently.

---

### 1.4 Testing Effect (MEDIUM PRIORITY)

**Pattern:** Accessing a memory strengthens it.

**Implementation:**
```javascript
// Integrate into search results handler
function onMemoryAccessed(memoryId) {
  const memory = getMemory(memoryId);
  const currentR = calculateRetrievability(memory);

  // Lower R at access = greater boost (desirable difficulty)
  const boostFactor = 0.1 * (1 - currentR);
  memory.stability *= (1 + boostFactor);
  memory.access_count += 1;

  saveMemory(memory);
}
```

**Impact:** Useful memories naturally strengthen; unused memories fade.

---

### 1.5 5-State Memory Model (MEDIUM PRIORITY)

**Pattern:** Extend HOT/WARM/COLD to include DORMANT and ARCHIVED states.

**Implementation:**
```javascript
const MEMORY_STATES = {
  HOT:      { threshold: 0.80, maxCount: 5,  content: 'full' },
  WARM:     { threshold: 0.25, maxCount: 10, content: 'summary' },
  COLD:     { threshold: 0.05, maxCount: 50, content: 'none' },
  DORMANT:  { threshold: 0.00, maxCount: null, content: 'none' },
  ARCHIVED: { daysInactive: 90, content: 'none' }
};

function classifyState(memory) {
  const R = calculateRetrievability(memory);
  const daysInactive = daysSince(memory.last_accessed);

  if (daysInactive >= 90) return 'ARCHIVED';
  if (R < 0.05) return 'DORMANT';
  if (R < 0.25) return 'COLD';
  if (R < 0.80) return 'WARM';
  return 'HOT';
}
```

**Impact:** Prevents context window pollution while preserving all memories.

---

## 2. Integration Opportunities

### 2.1 Composite Scoring Enhancement

Add retrievability as a scoring factor:

```javascript
// lib/scoring/composite-scoring.js
const ENHANCED_WEIGHTS = {
  similarity: 0.30,      // Was 0.35
  importance: 0.25,      // Unchanged
  recency: 0.15,         // Was 0.20
  popularity: 0.10,      // Unchanged
  tier_boost: 0.05,      // Was 0.10
  retrievability: 0.15   // NEW
};
```

### 2.2 Memory Save Handler Enhancement

Integrate prediction error gating:

```javascript
// handlers/memory-save.js
async function memory_save(params) {
  const embedding = await generateEmbedding(params.content);
  const candidates = await vectorSearch(embedding, { limit: 5 });

  const decision = predictionErrorGate.evaluate(
    params.content, embedding, candidates
  );

  // Execute decision with audit logging
  return executeMemoryAction(decision, params);
}
```

### 2.3 Memory Validate Enhancement

Use feedback to update FSRS parameters:

```javascript
// handlers/memory-triggers.js (memory_validate)
async function memory_validate(params) {
  const { memoryId, wasUseful } = params;

  // Existing validation logic...

  // NEW: Update FSRS strengths
  updateStrengths(memoryId, wasUseful);

  // NEW: Adjust difficulty based on feedback pattern
  if (!wasUseful) {
    adjustDifficulty(memoryId, +0.5);  // Harder to learn
  }
}
```

---

## 3. Architecture Improvements

### 3.1 Schema Migration

```sql
-- Phase 1: Core FSRS columns
ALTER TABLE memory_index ADD COLUMN stability REAL DEFAULT 1.0;
ALTER TABLE memory_index ADD COLUMN difficulty REAL DEFAULT 5.0;
ALTER TABLE memory_index ADD COLUMN last_review TEXT;
ALTER TABLE memory_index ADD COLUMN review_count INTEGER DEFAULT 0;

-- Phase 2: Conflict tracking
CREATE TABLE memory_conflicts (
  id INTEGER PRIMARY KEY,
  original_id INTEGER REFERENCES memory_index(id),
  conflicting_id INTEGER REFERENCES memory_index(id),
  resolution TEXT,  -- 'UPDATE', 'SUPERSEDE', 'LINK'
  similarity REAL,
  resolved_at TEXT
);

-- Phase 3: Context encoding
ALTER TABLE memory_index ADD COLUMN encoding_context TEXT;  -- JSON
```

### 3.2 New Module Structure

```
lib/cognitive/
├── attention-decay.js      # Existing (enhanced)
├── co-activation.js        # Existing
├── temporal-contiguity.js  # Existing
├── working-memory.js       # Existing
├── tier-classifier.js      # Existing (enhanced)
├── fsrs-scheduler.js       # NEW: Core FSRS logic
├── prediction-error-gate.js # NEW: Conflict detection
└── context-encoder.js      # NEW: Encoding context capture
```

---

## 4. Implementation Strategy (Prioritized by Impact/Effort)

| Phase | Feature | Impact | Effort | Timeline |
|-------|---------|--------|--------|----------|
| **1** | FSRS decay formula | High | Low | 1-2 days |
| **1** | Schema migration (stability, difficulty) | High | Low | 1 day |
| **2** | Prediction error gating | High | Medium | 3-5 days |
| **2** | Composite scoring update | Medium | Low | 1 day |
| **3** | Testing effect integration | Medium | Low | 1-2 days |
| **3** | 5-state model | Medium | Medium | 2-3 days |
| **4** | Context encoding | Medium | Medium | 3-5 days |
| **4** | Memory conflict tracking | Low | Medium | 2-3 days |

**Total Estimated Effort:** 2-3 weeks

---

## 5. Potential Risks and Considerations

### 5.1 Backward Compatibility

**Risk:** Existing memories lack new columns.

**Mitigation:**
```javascript
// Default values for existing memories
const DEFAULTS = {
  stability: 1.0,
  difficulty: 5.0,
  last_review: created_at,  // Use creation date
  review_count: access_count  // Approximate from access
};
```

### 5.2 Performance Impact

**Risk:** Additional calculations on every search.

**Mitigation:**
- Cache retrievability scores (5-minute TTL)
- Batch decay updates (hourly, not per-access)
- Index on `last_review` column

### 5.3 Threshold Tuning

**Risk:** FSRS parameters optimized for flashcards, not conversations.

**Mitigation:**
- Start with defaults, monitor behavior
- Expose thresholds as configuration
- A/B test different threshold sets

---

## 6. Specific Code Patterns to Leverage

### 6.1 From FSRS (Use Directly)

```javascript
// Power-law retrievability - USE AS-IS
const R = Math.pow(1 + 0.235 * (t / S), -0.5);

// Optimal interval calculation - USE AS-IS
const I = (S * 81 / 19) * (Math.pow(targetR, -2) - 1);
```

### 6.2 From Vestige (Adapt)

```javascript
// Contradiction detection - ADAPT patterns
const CONTRADICTION_SIGNALS = [
  ['always', 'never'],
  ['use', "don't use"],
  ['prefer', 'avoid'],
  ['async', 'blocking']
];
```

### 6.3 From Cognitive Science (Implement)

```javascript
// Desirable difficulty bonus - IMPLEMENT
const learningGain = currentR < 0.4 ? 1.0 :
                     currentR < 0.8 ? 0.6 :
                     0.3;  // Easy = minimal learning
```

---

## 7. Migration Pathway

### Step 1: Non-Breaking Additions
- Add columns with defaults
- Create new modules without integration
- Test in isolation

### Step 2: Parallel Running
- Calculate FSRS scores alongside existing
- Log comparison metrics
- Validate no regression

### Step 3: Gradual Cutover
- Enable FSRS decay (feature flag)
- Enable prediction error gating
- Monitor for issues

### Step 4: Deprecate Legacy
- Remove exponential decay
- Clean up feature flags
- Update documentation

---

## Summary

The highest-impact upgrades are:

1. **FSRS power-law decay** - Replaces arbitrary exponential with research-backed formula
2. **Prediction error gating** - Eliminates duplicate memories elegantly
3. **Testing effect** - Makes the system self-improving

These three features alone will transform Spec Kit Memory from a "store everything" system to an intelligent memory that naturally retains what matters and forgets what doesn't—just like human memory.

---

**Next Steps:**
1. Review and approve recommendations
2. Create implementation spec.md and plan.md
3. Begin Phase 1 implementation
4. Run `/spec_kit:implement` for execution
