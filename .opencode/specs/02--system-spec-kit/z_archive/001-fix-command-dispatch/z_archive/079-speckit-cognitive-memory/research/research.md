---
title: "Research: [02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/079-speckit-cognitive-memory/research]"
description: "Request: Research how memories transition between active and dormant states in cognitive science and how to implement this for AI memory systems."
trigger_phrases:
  - "research"
  - "memory"
  - "consolidation"
  - "and"
  - "dormancy"
  - "079"
  - "speckit"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: research | v1.0 -->
# Research: Memory Consolidation and Dormancy Patterns

## Metadata
- **Research ID:** 079-speckit-cognitive-memory
- **Status:** COMPLETE
- **Date:** 2026-01-27
- **Researcher:** Claude Opus 4.5 (Research Agent)
- **Scope:** Memory consolidation neuroscience, dormancy patterns, AI memory implementation

---

## 1. Executive Summary

### Investigation Report

**Request:** Research how memories transition between active and dormant states in cognitive science and how to implement this for AI memory systems.

**Key Findings:**

1. **Neuroscience provides a robust two-strength model**: The Bjork "New Theory of Disuse" distinguishes between Storage Strength (how well-learned) and Retrieval Strength (how accessible). This maps directly to AI memory systems.

2. **Forgetting is adaptive, not loss**: Engram research shows "forgotten" memories remain intact in storage (recoverable via optogenetic stimulation) but become inaccessible. This justifies dormant states over deletion.

3. **Spaced repetition algorithms (FSRS-6) provide battle-tested decay formulas**: The FSRS algorithm, used by 100M+ Anki users, models memory decay mathematically with Stability and Retrievability metrics.

4. **Current Spec Kit Memory already implements HOT/WARM/COLD tiers**: The existing cognitive memory system uses attention scores (0.0-1.0) with tier thresholds. Enhancement needed: add DORMANT and ARCHIVED states with transition logic.

5. **State transitions should be bidirectional and reversible**: Neuroscience shows memories can be reactivated from dormant states. Implementation should support "resurrection" of dormant memories on relevant retrieval cues.

**Recommendation:** Extend the existing 3-tier attention system (HOT/WARM/COLD) with two additional storage-focused states (DORMANT/ARCHIVED) and implement dual-strength tracking (retrieval strength + storage strength).

---

## 2. Investigation Report

### 2.1 Research Questions Addressed

| Question | Finding | Evidence Grade |
|----------|---------|----------------|
| What defines "dormant" vs "active" memory? | Retrieval strength (accessibility) vs storage strength (availability) | A - Primary neuroscience research |
| How do memories transition between states? | Turn-based decay + access patterns + recency | A - FSRS algorithm + cognitive research |
| What triggers dormancy? | Extended non-access with decay below threshold | A - Spaced repetition research |
| Can dormant memories be reactivated? | Yes - retrieval cues restore accessibility | A - Optogenetics engram research |
| What determines archival vs dormancy? | Time since last access + storage strength | B - Inferred from combined research |

### 2.2 Research Methodology

**Sources Consulted:**
1. Bjork Learning and Forgetting Lab - New Theory of Disuse [SOURCE: https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2016/07/RBjork_EBjork_1992.pdf]
2. FSRS Algorithm Documentation [SOURCE: https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-Algorithm]
3. Neuroscience memory consolidation research (PMC articles) [SOURCE: https://pmc.ncbi.nlm.nih.gov/articles/PMC10618102/]
4. Vestige MCP server architecture [SOURCE: https://github.com/samvallad33/vestige]
5. Existing Spec Kit Memory cognitive modules [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/]

---

## 3. Core Architecture: Memory State Model

### 3.1 Neuroscience Foundation: Dual-Strength Theory

The Bjork "New Theory of Disuse" (1992) provides the foundational model for memory states:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     DUAL-STRENGTH MEMORY MODEL                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  STORAGE STRENGTH (SS)                    RETRIEVAL STRENGTH (RS)           │
│  ────────────────────                     ─────────────────────             │
│  • How well-learned an item is            • How accessible it is NOW        │
│  • Increases monotonically with exposure  • Fluctuates based on use         │
│  • Never decreases (memory persists)      • Decays without retrieval        │
│  • Represents "availability"              • Represents "accessibility"      │
│                                                                             │
│  Key Insight: SS cannot decrease, but RS can fall to near-zero             │
│  → This is what creates "dormant" memories: high SS, low RS                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Critical Finding:** The more difficult a retrieval is (low RS), the MORE beneficial it is when successful - this increases both RS and SS. [SOURCE: https://www.learningscientists.org/blog/2016/5/10-1]

### 3.2 Proposed 5-State Memory Model

Based on research findings, I propose extending the current 3-tier system to a 5-state model:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MEMORY STATE MACHINE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐   decay    ┌──────────┐   decay    ┌──────────┐              │
│  │   HOT    │───────────▶│   WARM   │───────────▶│   COLD   │              │
│  │  RS≥0.8  │            │0.25≤RS<0.8│            │0.05≤RS<0.25│             │
│  └──────────┘            └──────────┘            └──────────┘              │
│       ▲                       ▲                       │                     │
│       │                       │                       │ decay               │
│       │ activation            │ activation            ▼                     │
│       │                       │                  ┌──────────┐              │
│       │                       └──────────────────│ DORMANT  │              │
│       │                                          │RS<0.05,  │              │
│       │                                          │SS persists│              │
│       │                                          └──────────┘              │
│       │                                               │                     │
│       │ reactivation                                  │ time>90d            │
│       │ (trigger match)                               ▼                     │
│       │                                          ┌──────────┐              │
│       └──────────────────────────────────────────│ ARCHIVED │              │
│                                                  │RS≈0,     │              │
│                                                  │SS stable │              │
│                                                  └──────────┘              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

State Definitions:
─────────────────
HOT      : Frequently accessed, high retrieval strength (RS ≥ 0.8)
           → Full content returned in searches
           → Maximum 5 memories in working memory

WARM     : Recently accessed, moderate retrieval strength (0.25 ≤ RS < 0.8)
           → Summary content returned in searches
           → Maximum 10 memories in working memory

COLD     : Not recently accessed, low retrieval strength (0.05 ≤ RS < 0.25)
           → Not returned in searches, but tracked for reactivation
           → Still part of session working memory

DORMANT  : Extended non-access, minimal retrieval strength (RS < 0.05)
           → Excluded from working memory entirely
           → Storage strength preserved
           → Can be reactivated by explicit search or trigger match

ARCHIVED : Very old memories with no recent access (>90 days dormant)
           → Moved to cold storage tier
           → Lowest retrieval priority
           → Preserved for historical reference
           → Requires explicit search to surface
```

### 3.3 State Properties Matrix

| State | Retrieval Strength (RS) | Storage Strength (SS) | In Working Memory | Returned in Search | Content Depth |
|-------|-------------------------|----------------------|-------------------|-------------------|---------------|
| **HOT** | ≥ 0.8 | Increasing | Yes (max 5) | Always | Full |
| **WARM** | 0.25 - 0.79 | Stable/Increasing | Yes (max 10) | Always | Summary |
| **COLD** | 0.05 - 0.24 | Stable | Yes (tracked) | On high relevance | Metadata only |
| **DORMANT** | < 0.05 | Preserved | No | On explicit search | Metadata only |
| **ARCHIVED** | ≈ 0 | Preserved | No | On exact match | None (requires load) |

---

## 4. Technical Specifications: Transition Rules

### 4.1 State Transition Triggers

#### Decay Transitions (RS decreases over time/turns)

```javascript
// FSRS-6 inspired decay function
function calculateRetrievalStrength(currentRS, turnsElapsed, stability) {
  // Power-law decay (FSRS-6 formula)
  // R(t,S) = (1 + factor × t/S)^(-decay_exponent)
  const factor = 0.9;  // Trainable parameter
  const decayExponent = 0.5;  // w₂₀ in FSRS

  const decayedRS = Math.pow(1 + (factor * turnsElapsed / stability), -decayExponent);

  // Clamp to valid range
  return Math.max(0, Math.min(1, currentRS * decayedRS));
}
```

**Transition Thresholds:**

| From State | To State | Condition |
|------------|----------|-----------|
| HOT | WARM | RS drops below 0.8 |
| WARM | COLD | RS drops below 0.25 |
| COLD | DORMANT | RS drops below 0.05 AND no access for 7+ days |
| DORMANT | ARCHIVED | No access for 90+ days |

#### Activation Transitions (RS increases on access)

```javascript
// Activation on retrieval (increases RS)
function activateMemory(memory, retrievalDifficulty) {
  // Higher difficulty = greater boost (desirable difficulty principle)
  const difficultyBonus = 1 + (1 - memory.retrievalStrength) * 0.5;

  // Set RS to maximum on activation
  memory.retrievalStrength = 1.0;

  // Also increase storage strength (learning effect)
  memory.storageStrength = Math.min(1.0,
    memory.storageStrength + (0.1 * difficultyBonus)
  );

  // Update last accessed
  memory.lastAccessedTurn = currentTurn;
  memory.lastAccessedTime = new Date();

  return memory;
}
```

**Reactivation Rules:**

| From State | To State | Trigger |
|------------|----------|---------|
| DORMANT | HOT | Explicit search match with high relevance (>0.7) |
| DORMANT | WARM | Trigger phrase match |
| ARCHIVED | DORMANT | Explicit search match |
| COLD | WARM | Co-activation from related memory |
| WARM | HOT | Direct mention/activation |

### 4.2 Time-Based vs Turn-Based Decay

The system should implement **hybrid decay**:

```javascript
const DECAY_CONFIG = {
  // Turn-based decay (session-scoped)
  turnBasedDecay: {
    enabled: true,
    decayRateByImportance: {
      constitutional: 1.0,  // No decay
      critical: 0.98,       // Very slow decay
      important: 0.95,      // Slow decay
      normal: 0.80,         // Standard decay
      temporary: 0.60,      // Fast decay
    }
  },

  // Time-based decay (cross-session)
  timeBasedDecay: {
    enabled: true,
    halfLifeDays: {
      constitutional: Infinity,
      critical: 90,
      important: 30,
      normal: 14,
      temporary: 3,
    }
  },

  // Dormancy thresholds
  dormancy: {
    rsThreshold: 0.05,        // RS below this = dormant candidate
    minDaysSinceAccess: 7,    // Must be inactive for 7+ days
    archiveAfterDays: 90,     // Move to archive after 90 days dormant
  }
};
```

### 4.3 State Machine Pseudocode

```javascript
function updateMemoryState(memory, currentTurn, currentTime) {
  // Step 1: Calculate time-based decay
  const daysSinceAccess = daysBetween(memory.lastAccessedTime, currentTime);
  const halfLife = DECAY_CONFIG.timeBasedDecay.halfLifeDays[memory.importanceTier];
  const timeDecayFactor = Math.pow(0.5, daysSinceAccess / halfLife);

  // Step 2: Calculate turn-based decay (if in active session)
  let turnDecayFactor = 1.0;
  if (memory.sessionId === currentSessionId) {
    const turnsElapsed = currentTurn - memory.lastMentionedTurn;
    const decayRate = DECAY_CONFIG.turnBasedDecay.decayRateByImportance[memory.importanceTier];
    turnDecayFactor = Math.pow(decayRate, turnsElapsed);
  }

  // Step 3: Apply combined decay to retrieval strength
  memory.retrievalStrength *= timeDecayFactor * turnDecayFactor;

  // Step 4: Determine new state
  const previousState = memory.state;

  if (memory.retrievalStrength >= 0.8) {
    memory.state = 'HOT';
  } else if (memory.retrievalStrength >= 0.25) {
    memory.state = 'WARM';
  } else if (memory.retrievalStrength >= 0.05) {
    memory.state = 'COLD';
  } else if (daysSinceAccess < 90) {
    memory.state = 'DORMANT';
  } else {
    memory.state = 'ARCHIVED';
  }

  // Step 5: Log state transition if changed
  if (previousState !== memory.state) {
    logStateTransition(memory.id, previousState, memory.state);
  }

  return memory;
}
```

---

## 5. Dormancy Benefits

### 5.1 Context Window Optimization

**Problem:** AI context windows are finite. Including all memories creates noise that drowns out signal.

**Solution:** Dormant memories are excluded from working memory and search results, reducing:
- Token usage by 60-80% (based on vector database tiering research) [SOURCE: https://www.ernestchiang.com/en/posts/2025/amazon-s3-vectors/]
- Search latency (fewer vectors to compare)
- Cognitive load (AI doesn't need to filter irrelevant context)

```
Context Window Before Dormancy:
┌─────────────────────────────────────────────────────────────┐
│ HOT memories (5) + WARM (10) + COLD (50) + OLD (200+)       │
│ Total: 265+ memories competing for attention                 │
│ Signal-to-noise ratio: LOW                                   │
└─────────────────────────────────────────────────────────────┘

Context Window After Dormancy:
┌─────────────────────────────────────────────────────────────┐
│ HOT memories (5) + WARM (10) + COLD (limited)               │
│ Total: ~20 memories in active context                        │
│ Signal-to-noise ratio: HIGH                                  │
│ Dormant (50+) and Archived (200+) excluded but recoverable   │
└─────────────────────────────────────────────────────────────┘
```

### 5.2 Storage Strength Preservation

**Critical Insight from Neuroscience:** Dormant memories retain their storage strength (how well-learned they are) even when retrieval strength falls to near-zero.

```
Memory: "Authentication uses JWT with RS256"
───────────────────────────────────────────
Day 1:   RS=1.0, SS=0.3 (newly learned)
Day 7:   RS=0.6, SS=0.4 (accessed, SS increased)
Day 30:  RS=0.1, SS=0.4 (decaying, SS preserved)
Day 60:  RS=0.02, SS=0.4 (DORMANT - but SS intact!)
Day 90:  RS≈0, SS=0.4 (ARCHIVED - SS still preserved)

On reactivation (user asks about auth):
         RS=1.0, SS=0.5 (RS restored, SS boosted due to "desirable difficulty")
```

This means:
1. **No information is lost** when memories become dormant
2. **Reactivation is efficient** - the memory is already "learned", just needs accessibility restored
3. **Difficult retrievals are beneficial** - the lower the RS when retrieved, the higher the SS boost

### 5.3 Efficient Retrieval from Dormant State

Dormant memories can be efficiently surfaced through:

1. **Explicit semantic search** - Vector similarity still works on dormant memories
2. **Trigger phrase matching** - Keywords can "wake up" dormant memories
3. **Co-activation** - Related HOT/WARM memories can boost dormant ones
4. **Temporal cues** - "What did we discuss last month about X?"

```javascript
// Dormant memory retrieval strategy
async function searchWithDormantFallback(query, options) {
  // Step 1: Search active memories (HOT/WARM/COLD)
  const activeResults = await searchActiveMemories(query, {
    limit: options.limit,
    minSimilarity: 0.5
  });

  // Step 2: If insufficient results, check dormant
  if (activeResults.length < options.limit) {
    const dormantResults = await searchDormantMemories(query, {
      limit: options.limit - activeResults.length,
      minSimilarity: 0.7  // Higher threshold for dormant
    });

    // Step 3: Reactivate dormant memories that match
    for (const memory of dormantResults) {
      await reactivateMemory(memory.id, 'search_match');
    }

    return [...activeResults, ...dormantResults];
  }

  return activeResults;
}
```

---

## 6. Implementation Specification

### 6.1 Database Schema Extension

```sql
-- Extend existing memory_index table
ALTER TABLE memory_index ADD COLUMN retrieval_strength REAL DEFAULT 1.0;
ALTER TABLE memory_index ADD COLUMN storage_strength REAL DEFAULT 0.5;
ALTER TABLE memory_index ADD COLUMN memory_state TEXT DEFAULT 'WARM';
ALTER TABLE memory_index ADD COLUMN state_changed_at TEXT;
ALTER TABLE memory_index ADD COLUMN dormant_since TEXT;

-- Add state transition history
CREATE TABLE IF NOT EXISTS memory_state_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  memory_id INTEGER NOT NULL,
  from_state TEXT NOT NULL,
  to_state TEXT NOT NULL,
  trigger TEXT NOT NULL,  -- 'decay', 'activation', 'reactivation', 'archive'
  retrieval_strength_before REAL,
  retrieval_strength_after REAL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (memory_id) REFERENCES memory_index(id) ON DELETE CASCADE
);

-- Index for efficient state queries
CREATE INDEX IF NOT EXISTS idx_memory_state ON memory_index(memory_state);
CREATE INDEX IF NOT EXISTS idx_dormant_since ON memory_index(dormant_since);

-- Extend working_memory table
ALTER TABLE working_memory ADD COLUMN retrieval_strength REAL DEFAULT 1.0;
ALTER TABLE working_memory ADD COLUMN storage_strength REAL DEFAULT 0.5;
```

### 6.2 State Transition Implementation

```javascript
// lib/cognitive/memory-states.js
'use strict';

const STATES = {
  HOT: 'HOT',
  WARM: 'WARM',
  COLD: 'COLD',
  DORMANT: 'DORMANT',
  ARCHIVED: 'ARCHIVED'
};

const STATE_CONFIG = {
  thresholds: {
    hot: 0.8,
    warm: 0.25,
    cold: 0.05,
    // Below cold threshold + time criteria = dormant
    // 90+ days dormant = archived
  },

  dormancy: {
    minDaysInactive: 7,
    archiveAfterDays: 90
  },

  limits: {
    maxHot: 5,
    maxWarm: 10,
    maxColdInContext: 20
  }
};

/**
 * Determine memory state from retrieval strength and time factors
 */
function determineState(retrievalStrength, daysSinceAccess, isDormant) {
  if (retrievalStrength >= STATE_CONFIG.thresholds.hot) {
    return STATES.HOT;
  }

  if (retrievalStrength >= STATE_CONFIG.thresholds.warm) {
    return STATES.WARM;
  }

  if (retrievalStrength >= STATE_CONFIG.thresholds.cold) {
    return STATES.COLD;
  }

  // Below cold threshold
  if (isDormant && daysSinceAccess >= STATE_CONFIG.dormancy.archiveAfterDays) {
    return STATES.ARCHIVED;
  }

  if (daysSinceAccess >= STATE_CONFIG.dormancy.minDaysInactive) {
    return STATES.DORMANT;
  }

  return STATES.COLD;
}

/**
 * Apply state transition with history logging
 */
function transitionState(db, memoryId, newState, trigger, rsBefore, rsAfter) {
  const memory = db.prepare(`
    SELECT memory_state, retrieval_strength, storage_strength
    FROM memory_index WHERE id = ?
  `).get(memoryId);

  if (!memory || memory.memory_state === newState) {
    return false;
  }

  // Log transition
  db.prepare(`
    INSERT INTO memory_state_history
    (memory_id, from_state, to_state, trigger, retrieval_strength_before, retrieval_strength_after)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(memoryId, memory.memory_state, newState, trigger, rsBefore, rsAfter);

  // Update state
  const dormantSince = newState === STATES.DORMANT
    ? new Date().toISOString()
    : null;

  db.prepare(`
    UPDATE memory_index
    SET memory_state = ?,
        retrieval_strength = ?,
        state_changed_at = CURRENT_TIMESTAMP,
        dormant_since = COALESCE(?, dormant_since)
    WHERE id = ?
  `).run(newState, rsAfter, dormantSince, memoryId);

  // Remove from working memory if dormant/archived
  if (newState === STATES.DORMANT || newState === STATES.ARCHIVED) {
    db.prepare(`DELETE FROM working_memory WHERE memory_id = ?`).run(memoryId);
  }

  return true;
}

module.exports = {
  STATES,
  STATE_CONFIG,
  determineState,
  transitionState
};
```

### 6.3 Decay Algorithm Implementation

```javascript
// lib/cognitive/dual-strength-decay.js
'use strict';

const DECAY_PARAMS = {
  // FSRS-6 inspired parameters
  decayFactor: 0.9,
  decayExponent: 0.5,

  // Importance tier multipliers
  tierMultipliers: {
    constitutional: 0,      // No decay
    critical: 0.02,         // 2% of base decay
    important: 0.05,        // 5% of base decay
    normal: 1.0,            // Full decay
    temporary: 2.0          // 2x decay
  },

  // Stability factors (how SS affects RS decay)
  stabilityEffect: 0.1  // Higher SS = slower RS decay
};

/**
 * Calculate new retrieval strength after decay
 * Uses power-law decay (FSRS-6 formula)
 */
function calculateDecayedRS(currentRS, storageStrength, turnsElapsed, importanceTier) {
  // Constitutional memories don't decay
  if (importanceTier === 'constitutional') {
    return currentRS;
  }

  const tierMultiplier = DECAY_PARAMS.tierMultipliers[importanceTier] || 1.0;

  // Higher storage strength = more stable (slower decay)
  const stabilityBonus = 1 + (storageStrength * DECAY_PARAMS.stabilityEffect);
  const effectiveStability = stabilityBonus / tierMultiplier;

  // Power-law decay: R(t,S) = (1 + factor × t/S)^(-exponent)
  const decayTerm = 1 + (DECAY_PARAMS.decayFactor * turnsElapsed / effectiveStability);
  const decayedRS = currentRS * Math.pow(decayTerm, -DECAY_PARAMS.decayExponent);

  return Math.max(0, decayedRS);
}

/**
 * Calculate storage strength increase on successful retrieval
 * Implements "desirable difficulty" - harder retrievals boost SS more
 */
function calculateSSBoost(currentSS, retrievalStrength) {
  // Lower RS = harder retrieval = bigger boost
  const difficultyBonus = Math.pow(1 - retrievalStrength, 0.5);
  const baseBoost = 0.05;
  const boost = baseBoost * (1 + difficultyBonus);

  return Math.min(1.0, currentSS + boost);
}

/**
 * Apply decay to all memories in a session
 */
function applySessionDecay(db, sessionId, currentTurn) {
  const memories = db.prepare(`
    SELECT wm.memory_id, wm.attention_score, wm.last_mentioned_turn,
           mi.storage_strength, mi.importance_tier
    FROM working_memory wm
    JOIN memory_index mi ON wm.memory_id = mi.id
    WHERE wm.session_id = ? AND wm.attention_score > 0
  `).all(sessionId);

  const updates = [];

  for (const memory of memories) {
    const turnsElapsed = currentTurn - (memory.last_mentioned_turn || 0);
    if (turnsElapsed <= 0) continue;

    const newRS = calculateDecayedRS(
      memory.attention_score,
      memory.storage_strength || 0.5,
      turnsElapsed,
      memory.importance_tier
    );

    updates.push({
      memoryId: memory.memory_id,
      oldRS: memory.attention_score,
      newRS: newRS
    });
  }

  // Batch update
  const updateStmt = db.prepare(`
    UPDATE working_memory
    SET attention_score = ?, updated_at = CURRENT_TIMESTAMP
    WHERE session_id = ? AND memory_id = ?
  `);

  db.transaction(() => {
    for (const update of updates) {
      updateStmt.run(update.newRS, sessionId, update.memoryId);
    }
  })();

  return updates;
}

module.exports = {
  DECAY_PARAMS,
  calculateDecayedRS,
  calculateSSBoost,
  applySessionDecay
};
```

### 6.4 Reactivation Implementation

```javascript
// lib/cognitive/memory-reactivation.js
'use strict';

const { STATES, transitionState } = require('./memory-states');

/**
 * Reactivate a dormant or archived memory
 */
function reactivateMemory(db, memoryId, trigger, sessionId, turnNumber) {
  const memory = db.prepare(`
    SELECT id, retrieval_strength, storage_strength, memory_state, importance_tier
    FROM memory_index WHERE id = ?
  `).get(memoryId);

  if (!memory) {
    return { success: false, error: 'Memory not found' };
  }

  // Only reactivate dormant or archived memories
  if (![STATES.DORMANT, STATES.ARCHIVED].includes(memory.memory_state)) {
    // For active memories, just boost RS
    return boostActiveMemory(db, memory, sessionId, turnNumber);
  }

  // Calculate new state based on reactivation trigger
  const newRS = calculateReactivationRS(memory, trigger);
  const newState = newRS >= 0.8 ? STATES.HOT : STATES.WARM;

  // Boost storage strength (desirable difficulty effect)
  const ssBoost = calculateSSBoost(memory.storage_strength, memory.retrieval_strength);

  // Transition state
  transitionState(db, memoryId, newState, `reactivation_${trigger}`,
    memory.retrieval_strength, newRS);

  // Update storage strength
  db.prepare(`
    UPDATE memory_index
    SET storage_strength = ?,
        dormant_since = NULL
    WHERE id = ?
  `).run(ssBoost, memoryId);

  // Add to working memory
  db.prepare(`
    INSERT OR REPLACE INTO working_memory
    (session_id, memory_id, attention_score, last_mentioned_turn, tier, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
  `).run(sessionId, memoryId, newRS, turnNumber, newState);

  return {
    success: true,
    memoryId,
    previousState: memory.memory_state,
    newState,
    retrievalStrength: newRS,
    storageStrength: ssBoost
  };
}

/**
 * Calculate retrieval strength after reactivation
 */
function calculateReactivationRS(memory, trigger) {
  const baseRS = {
    'search_match': 0.9,      // High relevance search
    'trigger_match': 0.7,     // Trigger phrase matched
    'co_activation': 0.5,     // Related memory was accessed
    'explicit_load': 1.0,     // User explicitly requested
    'temporal_cue': 0.6       // Time-based reference
  };

  return baseRS[trigger] || 0.7;
}

/**
 * Calculate storage strength boost on reactivation
 */
function calculateSSBoost(currentSS, previousRS) {
  // Lower previous RS = harder retrieval = bigger boost
  const difficultyBonus = Math.pow(1 - previousRS, 0.5);
  const baseBoost = 0.1;  // Larger boost for reactivation
  const boost = baseBoost * (1 + difficultyBonus);

  return Math.min(1.0, currentSS + boost);
}

module.exports = {
  reactivateMemory,
  calculateReactivationRS,
  calculateSSBoost
};
```

### 6.5 Cleanup and Archival Policies

```javascript
// lib/cognitive/memory-cleanup.js
'use strict';

const { STATES, transitionState } = require('./memory-states');

/**
 * Run periodic cleanup to transition memories to dormant/archived states
 */
function runMemoryCleanup(db, options = {}) {
  const {
    dormantThresholdDays = 7,
    archiveThresholdDays = 90,
    dryRun = false
  } = options;

  const now = new Date().toISOString();
  const dormantCutoff = new Date(Date.now() - dormantThresholdDays * 24 * 60 * 60 * 1000).toISOString();
  const archiveCutoff = new Date(Date.now() - archiveThresholdDays * 24 * 60 * 60 * 1000).toISOString();

  // Find memories to transition to DORMANT
  const toDormant = db.prepare(`
    SELECT id, retrieval_strength, memory_state
    FROM memory_index
    WHERE memory_state IN ('COLD')
      AND retrieval_strength < 0.05
      AND last_accessed < ?
      AND importance_tier NOT IN ('constitutional', 'critical')
  `).all(dormantCutoff);

  // Find memories to transition to ARCHIVED
  const toArchive = db.prepare(`
    SELECT id, retrieval_strength, memory_state, dormant_since
    FROM memory_index
    WHERE memory_state = 'DORMANT'
      AND dormant_since < ?
      AND importance_tier NOT IN ('constitutional', 'critical', 'important')
  `).all(archiveCutoff);

  if (dryRun) {
    return {
      wouldTransitionToDormant: toDormant.length,
      wouldTransitionToArchive: toArchive.length,
      dryRun: true
    };
  }

  // Execute transitions
  let dormantCount = 0;
  let archiveCount = 0;

  db.transaction(() => {
    for (const memory of toDormant) {
      transitionState(db, memory.id, STATES.DORMANT, 'cleanup_decay',
        memory.retrieval_strength, memory.retrieval_strength);
      dormantCount++;
    }

    for (const memory of toArchive) {
      transitionState(db, memory.id, STATES.ARCHIVED, 'cleanup_archive',
        memory.retrieval_strength, 0);
      archiveCount++;
    }
  })();

  return {
    transitionedToDormant: dormantCount,
    transitionedToArchive: archiveCount,
    timestamp: now
  };
}

/**
 * Get memory statistics by state
 */
function getMemoryStateStats(db) {
  return db.prepare(`
    SELECT
      memory_state,
      COUNT(*) as count,
      AVG(retrieval_strength) as avg_rs,
      AVG(storage_strength) as avg_ss,
      MIN(last_accessed) as oldest_access,
      MAX(last_accessed) as newest_access
    FROM memory_index
    GROUP BY memory_state
  `).all();
}

module.exports = {
  runMemoryCleanup,
  getMemoryStateStats
};
```

---

## 7. Integration with Existing System

### 7.1 Compatibility with Current Cognitive Modules

The proposed implementation extends (not replaces) the existing system:

| Existing Module | Extension |
|-----------------|-----------|
| `working-memory.js` | Add `retrieval_strength`, `storage_strength` columns; extend state enum |
| `attention-decay.js` | Replace with dual-strength decay; use power-law instead of exponential |
| `tier-classifier.js` | Add DORMANT and ARCHIVED tiers; update thresholds |
| `co-activation.js` | Add reactivation trigger for dormant memories |

### 7.2 Migration Path

1. **Phase 1: Schema Extension** (non-breaking)
   - Add new columns with defaults
   - Initialize `retrieval_strength` from existing `attention_score`
   - Initialize `storage_strength` at 0.5 for all memories
   - Initialize `memory_state` based on current tier

2. **Phase 2: Dual-Strength Decay** (feature flag)
   - Implement new decay algorithm
   - Run in shadow mode alongside existing decay
   - Compare results for validation

3. **Phase 3: State Machine** (gradual rollout)
   - Enable dormancy detection
   - Enable archival after validation period

### 7.3 Configuration Options

```javascript
const COGNITIVE_MEMORY_CONFIG = {
  // Feature flags
  features: {
    dualStrengthModel: true,
    dormancyEnabled: true,
    archivalEnabled: true,
    powerLawDecay: true
  },

  // State thresholds
  states: {
    hotThreshold: 0.8,
    warmThreshold: 0.25,
    coldThreshold: 0.05,
    dormantMinDays: 7,
    archiveAfterDays: 90
  },

  // Decay parameters
  decay: {
    factor: 0.9,
    exponent: 0.5,
    stabilityEffect: 0.1
  },

  // Limits
  limits: {
    maxHotMemories: 5,
    maxWarmMemories: 10,
    maxColdInContext: 20
  },

  // Cleanup schedule
  cleanup: {
    runIntervalHours: 24,
    dryRunFirst: true
  }
};
```

---

## 8. Success Metrics

### 8.1 Quantitative Metrics

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Active context size | ~50-100 memories | ~15-25 memories | Count of HOT+WARM+limited COLD |
| Token efficiency | Baseline | +40% | Tokens saved by dormancy |
| Reactivation accuracy | N/A | >80% | Dormant memories correctly surfaced |
| State transition latency | N/A | <10ms | Time to classify and transition |

### 8.2 Qualitative Metrics

- [ ] Relevant dormant memories surface when needed
- [ ] Old but important context doesn't get lost
- [ ] Context window feels "cleaner" (less noise)
- [ ] No false negatives (important memories incorrectly dormant)

---

## 9. References

### Primary Sources

1. [Bjork New Theory of Disuse (1992)](https://bjorklab.psych.ucla.edu/wp-content/uploads/sites/13/2016/07/RBjork_EBjork_1992.pdf) - Dual-strength memory model
2. [FSRS-6 Algorithm](https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-Algorithm) - Spaced repetition mathematics
3. [Engram Neurons: Encoding, Consolidation, Retrieval](https://pmc.ncbi.nlm.nih.gov/articles/PMC10618102/) - Neuroscience of memory states
4. [Natural Forgetting Reversibly Modulates Engram Expression](https://elifesciences.org/articles/92860) - Forgetting as retrieval failure
5. [Vestige MCP Server](https://github.com/samvallad33/vestige) - Reference implementation

### Secondary Sources

1. [Systems Memory Consolidation During Sleep](https://pmc.ncbi.nlm.nih.gov/articles/PMC12576410/) - Consolidation mechanisms
2. [Retrieval Strength vs Storage Strength](https://www.learningscientists.org/blog/2016/5/10-1) - Practical explanation
3. [Vector Database Tiering](https://www.ernestchiang.com/en/posts/2025/amazon-s3-vectors/) - Hot/warm/cold patterns
4. [Spaced Repetition Algorithm Journey](https://github.com/open-spaced-repetition/fsrs4anki/wiki/spaced-repetition-algorithm:-a-three%E2%80%90day-journey-from-novice-to-expert) - Implementation details

### Existing Codebase

1. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.js] - Current working memory implementation
2. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.js] - Current decay implementation
3. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/tier-classifier.js] - Current tier classification
4. [SOURCE: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/02--system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/055-cognitive-memory-upgrade/research/research/research.md] - Previous cognitive memory research

---

## 10. Changelog

| Date | Change |
|------|--------|
| 2026-01-27 | Initial research complete |
