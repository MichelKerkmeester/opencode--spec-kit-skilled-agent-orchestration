---
title: "Cognitive Subsystem"
description: "Research-backed memory decay, retrieval, classification and lifecycle engine with document-aware scoring inputs."
trigger_phrases:
  - "cognitive memory"
  - "FSRS decay"
  - "memory classification"
---

# Cognitive Subsystem

> Research-backed memory decay, retrieval, classification and lifecycle engine with document-aware scoring inputs.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. KEY CONCEPTS](#2--key-concepts)
- [3. STRUCTURE](#3--structure)
- [4. FEATURES](#4--features)
- [5. USAGE EXAMPLES](#5--usage-examples)
- [6. TROUBLESHOOTING](#6--troubleshooting)
- [7. FAQ](#7--faq)
- [8. RELATED RESOURCES](#8--related-resources)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

The cognitive subsystem implements human memory principles to manage conversation context intelligently. It models how memories decay and strengthen through use, then transition between activity states based on research-validated algorithms from cognitive science and spaced repetition systems. Retrieval consumes `documentType` and `specLevel` metadata from indexing, so cognitive scoring is applied to both memory notes and spec documents.

### What is the Cognitive Subsystem?

The cognitive subsystem is the "brain" of the memory system. It determines which memories stay active, which fade, and which get archived. Unlike simple time-based caching, it uses FSRS v4 power-law decay validated on 100M+ real human memory data.

### Key Statistics

| Component      | Modules | Lines | Purpose                                      |
| -------------- | ------- | ----- | -------------------------------------------- |
| Decay          | 2       | ~650  | Memory forgetting curves (FSRS, attention)   |
| Classification | 2       | ~960  | 5-state memory model + duplicate detection   |
| Activation     | 2       | ~700  | Working memory + spreading activation        |
| Lifecycle      | 1       | ~395  | Archival management                          |
| Temporal       | 1       | ~158  | Time-based contiguity boosting and timelines |
| **Total**      | **10**  | ~2860 | Complete cognitive memory lifecycle          |

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    MEMORY LIFECYCLE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [New Memory]                                                   │
│       ↓                                                         │
│  FSRS Scheduler ────→ Initial Stability = 1.0 day               │
│       ↓                                                         │
│  Tier Classifier ───→ State = HOT (R > 0.80)                     │
│       ↓                                                         │
│  Working Memory ────→ Attention Score = 1.0                     │
│       ↓                                                         │
│  [Time Passes]                                                  │
│       ↓                                                         │
│  Attention Decay ───→ R(t,S) = (1 + (19/81) × t/S)^(-0.5)       │
│       ↓                                                         │
│  Tier Classifier ───→ State = WARM → COLD → DORMANT              │
│       ↓                                                         │
│  Archival Manager ──→ After 90 days → ARCHIVED                  │
│       ↓                                                         │
│  [Access Event]                                                 │
│       ↓                                                         │
│  Co-Activation ─────→ Spread to Related (+0.15 boost)           │
│       ↓                                                         │
│  FSRS Review ─────→ Update Stability (harder = stronger)        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Key Features

| Feature                      | Implementation                                                                        | Benefit                              |
| ---------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------ |
| **Power-Law Decay**          | FSRS v4 formula validated on 100M+ users                                              | More accurate than exponential decay |
| **5-State Model**            | HOT/WARM/COLD/DORMANT/ARCHIVED with thresholds                                        | Progressive memory transitions       |
| **Duplicate Prevention**     | 4-tier similarity detection (95/85/70/50%)                                            | Prevents redundant context           |
| **Spreading Activation**     | Boost related memories (+0.15 on access)                                              | Maintains semantic coherence         |
| **Type-Specific Decay**      | Constitutional (none), Critical (none), Normal (0.80/turn)                            | Memory importance = retention time   |
| **Testing Effect**           | Low retrievability = greater boost on success                                         | Harder recalls strengthen more       |
| **Automatic Archival**       | 90-day threshold with background job (2hr interval)                                   | Lifecycle management                 |
| **Document-Aware Retrieval** | Uses indexed doc metadata (`spec`, `plan`, `decision_record`, etc.) in ranking inputs | Better relevance for spec workflows  |
| **Event-Based Decay**        | Event-driven decay model (spec 136) replaces fixed per-turn decay with event triggers | Context-sensitive memory management  |
| **Session-Attention Boost**  | `SPECKIT_SESSION_BOOST` boosts scores for memories active in the current session       | Recency-aware retrieval              |
| **Pressure-Aware Mode**      | `SPECKIT_PRESSURE_POLICY` enables token pressure monitoring for context window management | Prevents context overflow          |

### Requirements

| Requirement    | Minimum | Recommended |
| -------------- | ------- | ----------- |
| Node.js        | 16+     | 20+         |
| better-sqlite3 | 8.0+    | Latest      |
| Memory (RAM)   | 256MB   | 1GB+        |

<!-- /ANCHOR:overview -->

---

## 2. KEY CONCEPTS
<!-- ANCHOR:key-concepts -->

### The FSRS Formula

**Why power-law beats exponential:**

Traditional exponential decay: `R(t) = e^(-t/τ)`
- Decays too fast initially, too slow later
- Not validated on real human memory data

FSRS power-law decay: `R(t,S) = (1 + FACTOR × t/S)^DECAY`
- `R` = Retrievability (0.0 to 1.0)
- `t` = Time elapsed (days)
- `S` = Stability (days until 90% retrievability)
- `FACTOR` = 19/81 ≈ 0.2346 (FSRS v4 constant)
- `DECAY` = -0.5 (FSRS decay exponent)
- **Invariant**: At t = S: R = (1 + 19/81)^(-0.5) = (100/81)^(-0.5) = 0.9 (always 90%)

**Example:**
```javascript
// After 10 days with stability = 5 days:
R(10, 5) = (1 + (19/81) × 10/5)^(-0.5)
         = (1 + 0.2346 × 2)^(-0.5)
         = (1 + 0.4691)^(-0.5)
         = 1.4691^(-0.5)
         = 0.825  // 82.5% retrievable
```

### The 5-State Memory Model

Memories transition through states based on retrievability:

| State        | Threshold            | Meaning           | Content       | Typical Age |
| ------------ | -------------------- | ----------------- | ------------- | ----------- |
| **HOT**      | R >= 0.80            | Recently accessed | Full content  | 0-2 days    |
| **WARM**     | R >= 0.25            | Recently relevant | Summary only  | 3-14 days   |
| **COLD**     | R >= 0.05            | Fading            | Metadata only | 15-60 days  |
| **DORMANT**  | R >= 0.02            | Nearly forgotten  | Metadata only | 60-90 days  |
| **ARCHIVED** | R < 0.02 OR 90+ days | Long-term storage | Not loaded    | 90+ days    |

**State Transitions:**
```
NEW MEMORY → HOT (R = 1.0)
    ↓ time passes
  WARM (R = 0.60)
    ↓ time passes
  COLD (R = 0.15)
    ↓ time passes
  DORMANT (R = 0.03)
    ↓ 90 days threshold
  ARCHIVED

  ↑ access event
[Any state] → HOT (R = 1.0) + Stability boost
```

### Prediction Error Gating

Prevents duplicate memories using similarity thresholds:

| Threshold     | Action                      | Logic                            |
| ------------- | --------------------------- | -------------------------------- |
| >= 0.95 (95%) | **REINFORCE**               | Exact duplicate, boost existing  |
| >= 0.85 (85%) | **UPDATE** or **SUPERSEDE** | High match, check contradiction  |
| >= 0.70 (70%) | **CREATE_LINKED**           | Medium match, new with relations |
| < 0.50 (50%)  | **CREATE**                  | Low match, fully new memory      |

**Contradiction Detection:**
- Pattern types: negation, replacement, deprecation, correction, clarification, prohibition, obsolescence, explicit
- Confidence-based scoring: explicit (0.85) > obsolescence (0.80) > deprecation (0.75) > correction (0.70) > prohibition (0.65) > negation (0.60) > replacement (0.55) > clarification (0.45)
- Triggers: SUPERSEDE action to replace contradictory memory
- Audit: Logs to `memory_conflicts` table for review

### Multi-Factor Decay (5-Factor Model)

Attention score = weighted combination of 5 factors:

| Factor         | Weight | Measures               | Source                                        |
| -------------- | ------ | ---------------------- | --------------------------------------------- |
| **Temporal**   | 0.25   | FSRS retrievability    | `composite-scoring.ts` FIVE_FACTOR_WEIGHTS    |
| **Usage**      | 0.15   | Access frequency       | `min(1, access_count / 50)`                   |
| **Importance** | 0.25   | Memory tier weight     | Constitutional=1.0, Normal=0.5, Temporary=0.2 |
| **Pattern**    | 0.20   | Query/anchor alignment | Jaccard similarity with matched phrases       |
| **Citation**   | 0.15   | Recency of citation    | Days since last citation                      |

**Composite Score:**
```javascript
attention = (0.25 × temporal) + (0.15 × usage) + (0.25 × importance)
          + (0.20 × pattern) + (0.15 × citation)
```

**Decay Rates by Tier:**
```javascript
constitutional: 1.0  // No decay
critical:       1.0  // No decay
important:      1.0  // No decay
normal:         0.80 // 80% per turn
temporary:      0.60 // 60% per turn
deprecated:     1.0  // No decay (frozen)
```

### Type-Specific Half-Lives

Different memory types decay at different rates:

| Memory Type        | Half-Life | Rationale                         |
| ------------------ | --------- | --------------------------------- |
| **Constitutional** | None (∞)  | Permanent rules and principles    |
| **Critical**       | None (∞)  | Essential architectural decisions |
| **Semantic**       | 180 days  | Long-term knowledge               |
| **Procedural**     | 120 days  | Learned processes                 |
| **Declarative**    | 60 days   | Facts and information             |
| **Episodic**       | 60 days   | Session-specific events           |
| **Temporary**      | 1 day     | Short-term context                |

**Half-Life to Stability Conversion:**
```javascript
// FSRS stability = time for R to reach 90%
// Half-life = time for R to reach 50%
// With FSRS power law: 0.5 = (1 + FACTOR × t_half/S)^(-0.5)
// Solving: t_half = 3/FACTOR × S = 3/(19/81) × S = 243/19 × S ≈ 12.789 × S
// Inverse: S = half_life × 19/243 ≈ half_life / 12.789
half_life = 60 days → stability ≈ 4.69 days
```

<!-- /ANCHOR:key-concepts -->

---

## 3. STRUCTURE
<!-- ANCHOR:structure -->

```
cognitive/                      # TypeScript source files (10 modules)
├── fsrs-scheduler.ts           # FSRS v4 power-law decay + TM-03 classification-based decay (340 lines)
├── prediction-error-gate.ts    # Duplicate detection & conflict logging (510 lines)
├── tier-classifier.ts          # 5-state model classifier (452 lines)
├── attention-decay.ts          # Multi-factor attention decay (409 lines)
├── co-activation.ts            # Spreading activation with R17 fan-effect sqrt divisor (350 lines)
├── working-memory.ts           # Session-scoped activation (410 lines)
├── archival-manager.ts         # 90-day archival lifecycle (395 lines)
├── temporal-contiguity.ts      # Time-based contiguity boosting (158 lines)
├── pressure-monitor.ts         # Token pressure monitoring and context window management
├── rollout-policy.ts           # Feature flag rollout control and percentage-based activation
└── README.md                   # This file
```

### Key Modules

| Module                     | Purpose                   | Key Exports                                                                 |
| -------------------------- | ------------------------- | --------------------------------------------------------------------------- |
| `fsrs-scheduler.ts`        | FSRS v4 + TM-03 classification decay | `calculateRetrievability`, `updateStability`, `processReview`, `applyClassificationDecay` |
| `tier-classifier.ts`       | State classification      | `classifyState`, `classifyTier`, `getStateContent`, `filterAndLimitByState` |
| `attention-decay.ts`       | Multi-factor decay        | `applyFsrsDecay`, `calculateCompositeAttention`, `getAttentionBreakdown`    |
| `prediction-error-gate.ts` | Conflict detection        | `evaluateMemory`, `detectContradiction`, `logConflict`                      |
| `co-activation.ts`         | Semantic spreading (R17 fan-effect sqrt divisor) | `spreadActivation`, `populateRelatedMemories`, `boostScore`  |
| `working-memory.ts`        | Session memory management | `setAttentionScore`, `getWorkingMemory`, `batchUpdateScores`                |
| `archival-manager.ts`      | Lifecycle management      | `runArchivalScan`, `archiveMemory`, `startBackgroundJob`                    |
| `temporal-contiguity.ts`   | Time-based linking        | `vectorSearchWithContiguity`, `getTemporalNeighbors`, `buildTimeline`       |
| `pressure-monitor.ts`      | Token pressure monitoring | Context window management and pressure threshold tracking                   |
| `rollout-policy.ts`        | Feature flag rollout      | Percentage-based activation and gradual feature rollout control             |

<!-- /ANCHOR:structure -->

---

## 4. FEATURES
<!-- ANCHOR:features -->

### FSRS Power-Law Decay

**Purpose**: Research-validated memory forgetting curve

**Usage**:
```typescript
import {
  calculateRetrievability,
  updateStability,
  calculateOptimalInterval,
  processReview,
  createInitialParams,
  GRADE_GOOD,
} from './fsrs-scheduler';

// Calculate retrievability
const stability = 5.0;  // 5 days until 90% retrievable
const elapsed = 10;      // 10 days passed
const R = calculateRetrievability(stability, elapsed);
// R ≈ 0.825

// Update stability after review
const newStability = updateStability(
  stability,    // currentStability
  5.0,          // difficulty
  GRADE_GOOD,   // grade (3 = successful recall)
  R             // retrievability
);

// Process a full review cycle
const params = createInitialParams();
// params = { stability: 1.0, difficulty: 5.0, lastReview: null, reviewCount: 0 }

const result = processReview(params, GRADE_GOOD);
// result = { stability, difficulty, lastReview, reviewCount, nextReviewDate, retrievability }

// Optimal review interval
const interval = calculateOptimalInterval(newStability, 0.9);
```

**FSRS Grades:**
- `GRADE_AGAIN (1)`: Failed recall → Stability × 0.2
- `GRADE_HARD (2)`: Difficult recall → gradeFactor 0.8
- `GRADE_GOOD (3)`: Successful recall → gradeFactor 1.0
- `GRADE_EASY (4)`: Easy recall → gradeFactor 1.3

**Testing Effect:**
Lower retrievability = greater boost on success (desirable difficulty):
```javascript
// retrievabilityBonus = 1 + (1 - R) * 0.5
R = 0.3 (hard) → bonus = 1.35
R = 0.8 (easy) → bonus = 1.10
```

### 5-State Classification

**Purpose**: Progressive memory state transitions

**Usage**:
```typescript
import {
  classifyState,
  classifyTier,
  getStateContent,
  filterAndLimitByState,
  getStateStats,
} from './tier-classifier';

// Classify by numeric retrievability
const state = classifyState(0.65, 5);
// state = 'WARM' (R >= 0.25 but < 0.80)

// Classify from a memory object
const state2 = classifyState(memory);
// Extracts R from memory.retrievability or memory.attentionScore

// Full classification with half-life awareness
const classification = classifyTier(memory);
// classification = { state: 'WARM', retrievability: 0.65, effectiveHalfLife: 60 }

// Get memories filtered by state
const hotMemories = getStateContent(allMemories, 'HOT', 5);
// hotMemories = { state: 'HOT', memories: [...], count: N }

// Filter with tier-specific limits (max 5 HOT + max 10 WARM)
const active = filterAndLimitByState(allMemories);

// State distribution statistics
const stats = getStateStats(allMemories);
// stats = { HOT: 3, WARM: 8, COLD: 12, DORMANT: 4, ARCHIVED: 20, total: 47 }
```

**State Thresholds (configurable via env vars):**
```bash
HOT_THRESHOLD=0.80      # Default: 0.80
WARM_THRESHOLD=0.25     # Default: 0.25
COLD_THRESHOLD=0.05     # Default: 0.05
ARCHIVED_DAYS_THRESHOLD=90  # Default: 90 days
```

### Prediction Error Gating

**Purpose**: Prevent duplicate memories with conflict detection

**Usage**:
```typescript
import {
  init,
  evaluateMemory,
  detectContradiction,
  formatConflictRecord,
  logConflict,
  getConflictStats,
  getRecentConflicts,
  THRESHOLD,
} from './prediction-error-gate';

// Initialize with database
init(db);

// Evaluate similarity candidates
const result = evaluateMemory(
  'abc123hash',                    // newContentHash
  'Always use React for frontend', // newContent
  [                                // candidates array
    { id: 42, similarity: 92, content: 'Use React for UI' },
    { id: 58, similarity: 88, content: 'React is the UI framework' }
  ],
  { specFolder: 'specs/<###-spec-name>' }     // options
);

// result = {
//   action: 'UPDATE',
//   similarity: 92.0,
//   existingMemoryId: 42,
//   contradiction: { detected: false, type: null, description: null, confidence: 0 },
//   reason: 'High match, updating existing (similarity: 92.0%)'
// }

// Detect contradiction between two texts
const contradiction = detectContradiction(newContent, existingContent);
// contradiction = { detected: true, type: 'negation', description: '...', confidence: 0.60 }

// Manual conflict logging
const record = formatConflictRecord(
  'UPDATE',           // action
  'abc123hash',       // newMemoryHash
  42,                 // existingMemoryId
  92.0,               // similarity
  'reason text',      // reason
  contradiction,      // ContradictionResult
  'preview of new',   // newContentPreview
  'preview of old',   // existingContentPreview
  'specs/<###-spec-name>'         // specFolder
);
logConflict(record);  // Single ConflictRecord param

// Get statistics
const stats = getConflictStats();
// stats = { total, byAction: {...}, contradictions, averageSimilarity }

const recent = getRecentConflicts(20);
```

**Actions by Threshold:**
```javascript
similarity >= 0.95 → REINFORCE (boost existing score)
similarity >= 0.85 → UPDATE or SUPERSEDE (if contradiction detected)
similarity >= 0.70 → CREATE_LINKED (new with link to existing)
similarity <  0.50 → CREATE (fully new)
```

### Multi-Factor Attention Decay

**Purpose**: Composite scoring with 5 factors

**Usage**:
```typescript
import {
  init,
  applyFsrsDecay,
  applyDecay,
  calculateCompositeAttention,
  getAttentionBreakdown,
  activateMemory,
  activateMemoryWithFsrs,
  getActiveMemories,
  applyCompositeDecay,
  DECAY_CONFIG,
} from './attention-decay';

// Initialize with database
init(db);

// Apply FSRS-based decay to a memory
const decayedScore = applyFsrsDecay(memory, 1.0);
// Uses memory.stability and memory.last_review to calculate

// Apply tier-based decay
const decayed = applyDecay(memory, 1.0);
// Uses memory.importance_tier for decay rate

// Calculate composite attention score
const score = calculateCompositeAttention(memory);
// score = weighted 5-factor composite (temporal, usage, importance, pattern, citation)

// Get factor breakdown
const breakdown = getAttentionBreakdown(memory);
// breakdown = {
//   temporal: 0.75,
//   usage: 0.24,
//   importance: 0.50,
//   pattern: 0.80,
//   citation: 0.20,
//   composite: 0.485,
//   weights: { temporal: 0.25, usage: 0.15, importance: 0.25, pattern: 0.20, citation: 0.15 }
// }

// Activate memory (increment access_count, update last_accessed)
activateMemory(memoryId);

// Activate with FSRS review update
activateMemoryWithFsrs(memoryId, 3);  // memoryId, grade (default: 3 = GOOD)

// Get active memories sorted by composite score
const active = getActiveMemories(20);

// Batch apply composite decay
const sorted = applyCompositeDecay(memories);
```

### Spreading Activation

**Purpose**: Boost related memories when primary memory is accessed

**Usage**:
```typescript
import {
  init,
  spreadActivation,
  populateRelatedMemories,
  getRelatedMemories,
  boostScore,
  isEnabled,
  CO_ACTIVATION_CONFIG,
} from './co-activation';

// Initialize with database
init(db);

// Spread activation from seed memories
const results = spreadActivation(
  [42, 58],    // seedIds: number[]
  2,           // maxHops (default: 2)
  20           // limit (default: 20)
);
// results = [
//   { id: 71, activationScore: 0.425, hop: 1, path: [42, 71] },
//   { id: 84, activationScore: 0.180, hop: 2, path: [42, 71, 84] }
// ]

// Get related memories for a given memory
const related = getRelatedMemories(42, 5);
// related = [{ id: 58, similarity: 85, title: '...', spec_folder: '...' }, ...]

// Populate related memories using vector search
const count = await populateRelatedMemories(
  memoryId,
  vectorSearchFn  // (embedding: Float32Array, options) => Array<{id, similarity}>
);
// count = 5 (number of related memories found)

// Boost a score based on co-activation
const boosted = boostScore(0.5, 3, 85);
// boosted = 0.5 + (0.15 * (3/5) * (85/100)) = 0.577
```

**Co-Activation Configuration:**
```javascript
SPECKIT_COACTIVATION=true    // Default: true (env var name)
// CO_ACTIVATION_CONFIG:
boostFactor: 0.15            // Boost per related memory (NOT 0.35)
maxRelated: 5                // Max related memories to store
minSimilarity: 70            // Minimum similarity for relation
decayPerHop: 0.5             // Activation decay per graph hop
maxHops: 2                   // Max traversal depth
maxSpreadResults: 20         // Max results from spreading
```

### Working Memory (Session Management)

**Purpose**: Session-scoped attention tracking with capacity limits

**Usage**:
```typescript
import {
  init,
  getOrCreateSession,
  setAttentionScore,
  getWorkingMemory,
  getSessionMemories,
  batchUpdateScores,
  clearSession,
  getSessionStats,
  isEnabled,
  WORKING_MEMORY_CONFIG,
} from './working-memory';

// Initialize with database
init(db);

// Get or create a session
const sessionId = getOrCreateSession();
// sessionId = 'wm-lxyz123-abc456'

// Add/update memory in working memory
setAttentionScore(sessionId, memoryId, 1.0);

// Get working memory entries
const entries = getWorkingMemory(sessionId);
// entries = [{ id, session_id, memory_id, attention_score, added_at, last_focused, focus_count }]

// Get full memory details for session
const memories = getSessionMemories(sessionId);

// Apply decay to all entries in session
const updated = batchUpdateScores(sessionId);
// Multiplies scores by attentionDecayRate (0.95), removes below threshold

// Get session statistics
const stats = getSessionStats(sessionId);
// stats = { sessionId, totalEntries, avgAttention, maxAttention, minAttention, totalFocusEvents }

// Clear session
clearSession(sessionId);
```

**Working Memory Configuration:**
```javascript
SPECKIT_WORKING_MEMORY=true   // Default: true (env var name)
// WORKING_MEMORY_CONFIG:
maxCapacity: 7                // Miller's Law: 7 +/- 2
sessionTimeoutMs: 1800000     // 30 minutes
attentionDecayRate: 0.95      // 95% retention per decay cycle
minAttentionScore: 0.1        // Below this = evicted
```

### Automatic Archival

**Purpose**: Lifecycle management for inactive memories

**Usage**:
```typescript
import {
  init,
  startBackgroundJob,
  stopBackgroundJob,
  runArchivalScan,
  archiveMemory,
  unarchiveMemory,
  checkMemoryArchivalStatus,
  getArchivalCandidates,
  getStats,
  isBackgroundJobRunning,
  ARCHIVAL_CONFIG,
} from './archival-manager';

// Initialize with database
init(db);

// Start background job (scans every 2 hours)
startBackgroundJob();
// Default interval: 7200000ms (2 hours)

// Manual scan
const scanResult = runArchivalScan();
// scanResult = { scanned: 15, archived: 12 }

// Check specific memory status
const status = checkMemoryArchivalStatus(memoryId);
// status = { isArchived: boolean, shouldArchive: boolean }

// Archive/unarchive
archiveMemory(memoryId);
unarchiveMemory(memoryId);

// Get archival candidates
const candidates = getArchivalCandidates(50);
// candidates = [{ id, title, spec_folder, file_path, created_at, importance_tier, access_count, confidence, reason }]

// Get statistics
const stats = getStats();
// stats = { totalScanned, totalArchived, totalUnarchived, lastScanTime, errors }

// Stop background job
stopBackgroundJob();
```

**Archival Configuration:**
```bash
SPECKIT_ARCHIVAL=true                          # Default: true (env var name)
# ARCHIVAL_CONFIG defaults:
# scanIntervalMs: 3600000                      # 1 hour scan interval
# backgroundJobIntervalMs: 7200000             # 2 hours between background runs
# batchSize: 50                                # Per scan
# maxAgeDays: 90                               # Days before eligible for archival
# maxAccessCount: 2                            # Low-access threshold
# maxConfidence: 0.4                           # Low-confidence threshold
# protectedTiers: ['constitutional', 'critical']
```

### Temporal Contiguity

**Purpose**: Boost search results by temporal proximity and query temporal neighbors. Also builds spec-folder timelines.

**Usage**:
```typescript
import {
  init,
  vectorSearchWithContiguity,
  getTemporalNeighbors,
  buildTimeline,
  DEFAULT_WINDOW,
  MAX_WINDOW,
} from './temporal-contiguity';

// Initialize with database
init(db);

// Boost vector search results by temporal proximity
const results = [
  { id: 1, similarity: 0.85, created_at: '2026-02-10T10:00:00Z' },
  { id: 2, similarity: 0.78, created_at: '2026-02-10T10:30:00Z' },
  { id: 3, similarity: 0.72, created_at: '2026-02-09T10:00:00Z' },
];
const boosted = vectorSearchWithContiguity(results, DEFAULT_WINDOW);
// Results 1 and 2 (30 min apart, within 1h window) get similarity boost
// Result 3 (1 day apart) is outside the window and unchanged

// Find temporal neighbors of a memory
const neighbors = getTemporalNeighbors(42, 3600); // within 1 hour
// neighbors = [{ id, title, time_delta_seconds, ... }]

// Build a timeline for a spec folder
const timeline = buildTimeline('specs/005-memory', 20);
// timeline = [{ id, title, created_at, ... }] ordered by created_at DESC
```

**Configuration:**
```javascript
DEFAULT_WINDOW: 3600     // 1 hour in seconds (default temporal window)
MAX_WINDOW: 86400        // 24 hours in seconds (maximum allowed window)
BOOST_FACTOR: 0.15       // Maximum similarity boost for temporally adjacent memories
```

<!-- /ANCHOR:features -->

---

## 5. USAGE EXAMPLES
<!-- ANCHOR:usage-examples -->

### Example 1: Initialize Cognitive System

```typescript
import Database from 'better-sqlite3';
import * as decay from './attention-decay';
import * as gate from './prediction-error-gate';
import * as archival from './archival-manager';
import * as workingMemory from './working-memory';
import * as coActivation from './co-activation';

const db = new Database('memory.db');

// Initialize modules that need database
decay.init(db);
gate.init(db);
archival.init(db);
workingMemory.init(db);
coActivation.init(db);

// Start background archival
archival.startBackgroundJob();
```

### Example 2: Memory Access with FSRS Review

```typescript
import * as decay from './attention-decay';
import * as coActivation from './co-activation';

// Memory was accessed, apply FSRS review update
decay.activateMemoryWithFsrs(42, 3);  // memoryId=42, grade=GOOD(3)

// Spread activation to related memories
const boosted = coActivation.spreadActivation([42]);
// boosted = [{ id: 58, activationScore: 0.425, hop: 1, path: [42, 58] }]
```

### Example 3: Detect and Handle Duplicates

```typescript
import * as gate from './prediction-error-gate';
import * as decay from './attention-decay';

// Before saving new memory, check for duplicates
const decision = gate.evaluateMemory(
  contentHash,
  newMemoryContent,
  candidates,        // from vector search
  { specFolder: 'specs/<###-spec-name>' }
);

switch (decision.action) {
  case 'REINFORCE':
    // Boost existing memory instead of creating new
    decay.activateMemoryWithFsrs(decision.existingMemoryId!, 3);
    break;

  case 'SUPERSEDE':
    // Contradiction detected, mark old as deprecated, create new
    db.prepare('UPDATE memory_index SET importance_tier = ? WHERE id = ?')
      .run('deprecated', decision.existingMemoryId);
    createNewMemory(newMemoryContent);
    break;

  case 'UPDATE':
    // High similarity but no contradiction, update existing
    appendToMemory(decision.existingMemoryId!, newMemoryContent);
    break;

  case 'CREATE_LINKED':
  case 'CREATE':
    // Medium/low similarity, create new
    createNewMemory(newMemoryContent);
    break;
}
```

### Example 4: Composite Attention Scoring

```typescript
import * as decay from './attention-decay';

// Get active memories sorted by composite score
const activeMemories = decay.getActiveMemories(20);

// Score each memory with detailed breakdown
for (const memory of activeMemories) {
  const breakdown = decay.getAttentionBreakdown(memory);
  console.log(`${memory.title}:`);
  console.log(`  Composite: ${breakdown.composite}`);
  console.log(`  Temporal:   ${breakdown.temporal} × ${breakdown.weights.temporal}`);
  console.log(`  Usage:      ${breakdown.usage} × ${breakdown.weights.usage}`);
  console.log(`  Importance: ${breakdown.importance} × ${breakdown.weights.importance}`);
  console.log(`  Pattern:    ${breakdown.pattern} × ${breakdown.weights.pattern}`);
  console.log(`  Citation:   ${breakdown.citation} × ${breakdown.weights.citation}`);
}
```

### Common Patterns

| Pattern           | Use Case                             | Key Functions                                |
| ----------------- | ------------------------------------ | -------------------------------------------- |
| **Memory Save**   | New memory → Check duplicates → Save | `evaluateMemory`, `activateMemoryWithFsrs`   |
| **Memory Access** | Search hit → Boost + spread          | `activateMemoryWithFsrs`, `spreadActivation` |
| **Session Decay** | Turn end → Apply decay               | `applyFsrsDecay`, `batchUpdateScores`        |
| **State Check**   | Context selection → Filter by state  | `classifyState`, `filterAndLimitByState`     |
| **Nightly Jobs**  | Background → Archive                 | `runArchivalScan`, `startBackgroundJob`      |

<!-- /ANCHOR:usage-examples -->

---

## 6. TROUBLESHOOTING
<!-- ANCHOR:troubleshooting -->

### Common Issues

#### Memories Not Decaying

**Symptom**: Attention scores stay at 1.0 after multiple turns

**Cause**: Decay not being applied at turn boundaries

**Solution**:
```typescript
import * as decay from './attention-decay';

// Apply FSRS decay to individual memory
const decayed = decay.applyFsrsDecay(memory, 1.0);
console.log(`Decayed score: ${decayed}`);

// Check decay config
console.log('Decay rates:', decay.DECAY_CONFIG.decayRateByTier);
// constitutional: 1.0 = no decay (expected)
// normal: 0.80 = 80% retention per turn
```

#### High Memory Usage

**Symptom**: Memory consumption grows over time

**Cause**: Not archiving old memories, or archival job not running

**Solution**:
```typescript
import * as archival from './archival-manager';

// Check archival stats
const stats = archival.getStats();
console.log('Background job:', archival.isBackgroundJobRunning());

// Start background job if not running
if (!archival.isBackgroundJobRunning()) {
  archival.startBackgroundJob();
}

// Manual cleanup
const scanResult = archival.runArchivalScan();
console.log(`Archived ${scanResult.archived} old memories`);
```

#### Duplicate Memories

**Symptom**: Multiple similar memories with same content

**Cause**: Not using prediction error gate before saving

**Solution**:
```typescript
import * as gate from './prediction-error-gate';

// ALWAYS check before saving new memory
const decision = gate.evaluateMemory(contentHash, newContent, candidates, { specFolder });

if (decision.action === 'REINFORCE') {
  // Don't create new, boost existing
  console.log(`Reinforced existing memory ${decision.existingMemoryId}`);
  return decision.existingMemoryId;
}

// Check conflict logs
const recent = gate.getRecentConflicts(20);
console.log('Recent conflict decisions:', recent);
```

#### Incorrect State Classification

**Symptom**: Memory shows COLD but was recently accessed

**Cause**: `last_review` not being updated on access

**Solution**:
```typescript
import * as decay from './attention-decay';
import { classifyTier } from './tier-classifier';

// Use activateMemoryWithFsrs (updates stability, last_review, access_count)
decay.activateMemoryWithFsrs(memoryId, 3);

// Verify state after activation
const memory = db.prepare('SELECT * FROM memory_index WHERE id = ?').get(memoryId);
const classification = classifyTier(memory);
console.log(`State: ${classification.state}, R: ${classification.retrievability}`);
```

### Quick Fixes

| Problem              | Quick Fix                                                    |
| -------------------- | ------------------------------------------------------------ |
| Decay not working    | Call `applyFsrsDecay(memory, score)` at turn boundaries      |
| Memory leak          | Enable archival: `archival.startBackgroundJob()`             |
| Duplicate prevention | Use `gate.evaluateMemory()` before save                      |
| State always COLD    | Use `activateMemoryWithFsrs()` (updates last_review)         |
| Slow queries         | `CREATE INDEX idx_memory_state ON memory_index(memory_type)` |

<!-- /ANCHOR:troubleshooting -->

---

## 7. FAQ
<!-- ANCHOR:faq -->

### General Questions

**Q: Why use FSRS instead of simple exponential decay?**

A: FSRS is validated on 100M+ real human memory data from Anki. Exponential decay (`e^(-t/τ)`) decays too fast initially and too slow later. FSRS power-law decay `(1 + (19/81) × t/S)^(-0.5)` matches how human memory actually works, with a "desirable difficulty" effect where harder recalls strengthen memories more.

---

**Q: What's the difference between attention score and retrievability?**

A: **Retrievability** (R) is the FSRS-calculated probability of recall (0.0 to 1.0), based on stability and elapsed time. **Attention score** is the session-specific activation level in `working_memory`, which starts at 1.0 when a memory enters the session and decays at 0.95 per cycle.

---

**Q: Why do constitutional memories never decay?**

A: Constitutional memories are permanent rules and principles (like coding standards and architectural decisions). They should ALWAYS be available, so `decay_rate = 1.0` (100% retention = no decay). This applies to both `constitutional` and `critical` tiers.

---

### Technical Questions

**Q: How does spreading activation work?**

A: When memories are accessed:
1. Call `spreadActivation(seedIds)` with one or more seed memory IDs
2. For each seed, get `related_memories` from DB (JSON array of `{id, similarity}`)
3. Traverse the graph up to `maxHops` (default: 2)
4. Each hop applies `decayPerHop` (0.5) decay, weighted by similarity
5. Results sorted by activation score, limited to `maxSpreadResults` (20)

---

**Q: Can I disable automatic archival?**

A: Yes, set `SPECKIT_ARCHIVAL=false` in environment or:
```typescript
import * as archival from './archival-manager';
archival.stopBackgroundJob();
```
You will need to manually manage old memories to prevent database growth.

---

**Q: What are the orphaned dist/ files?**

A: Two compiled `.js` files exist in `dist/lib/cognitive/` without corresponding `.ts` sources:
- `consolidation.js`: 5-phase consolidation pipeline (source was deleted)
- `summary-generator.js`: Auto-summary generation (source was deleted)

Note: `temporal-contiguity.js` in dist/ is **not** orphaned. It is compiled from the active `temporal-contiguity.ts` source module. The `index.js` barrel file in dist/ may reference deleted modules and should be rebuilt.

<!-- /ANCHOR:faq -->

---

## 8. RELATED RESOURCES
<!-- ANCHOR:related -->

### Internal Modules

| Module                                                             | Purpose                                   |
| ------------------------------------------------------------------ | ----------------------------------------- |
| [../search/vector-index.ts](../search/vector-index.ts)             | Semantic search using voyageai embeddings |
| [../scoring/composite-scoring.ts](../scoring/composite-scoring.ts) | 5-factor scoring (canonical weights)      |
| [../storage/checkpoints.ts](../storage/checkpoints.ts)             | Backup/restore                            |
| [../config/memory-types.ts](../config/memory-types.ts)             | Memory type definitions and half-lives    |

### External Research

| Resource                                                                        | Description                                                  |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| [FSRS Paper](https://github.com/open-spaced-repetition/fsrs4anki)               | Free Spaced Repetition Scheduler algorithm                   |
| [Anki Research](https://faqs.ankiweb.net/what-spaced-repetition-algorithm.html) | Spaced repetition validation dataset                         |
| [ACT-R](http://act-r.psy.cmu.edu/)                                              | Adaptive Control of Thought, Rational cognitive architecture |

### Configuration Reference

| Environment Variable      | Default | Purpose                                 |
| ------------------------- | ------- | --------------------------------------- |
| `HOT_THRESHOLD`           | 0.80    | Retrievability threshold for HOT state  |
| `WARM_THRESHOLD`          | 0.25    | Retrievability threshold for WARM state |
| `COLD_THRESHOLD`          | 0.05    | Retrievability threshold for COLD state |
| `ARCHIVED_DAYS_THRESHOLD` | 90      | Days inactive before archival           |
| `SPECKIT_COACTIVATION`    | true    | Enable spreading activation             |
| `SPECKIT_ARCHIVAL`        | true    | Enable background archival job          |
| `SPECKIT_WORKING_MEMORY`  | true    | Enable working memory sessions          |
| `SPECKIT_SESSION_BOOST`   | false   | Enable session-based score boost from working_memory attention signals |
| `SPECKIT_PRESSURE_POLICY` | false   | Enable pressure-aware mode for token budget monitoring and context window management |
| `SPECKIT_EXTRACTION`      | false   | Enable post-tool extraction pipeline for automated memory creation |
| `SPECKIT_REDACTION_GATE`  | true    | Enable PII/secret redaction gate before memory insert |

<!-- /ANCHOR:related -->

*Cognitive Subsystem v1.9.0, Research-Backed Memory Management — Updated: 2026-02-27*
