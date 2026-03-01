# Technical Analysis: Cognitive Memory Systems

> **Research ID:** 079-speckit-cognitive-memory
> **Date:** 2026-01-27
> **Systems Analyzed:** FSRS Algorithm, Vestige MCP Server, Spec Kit Memory
> **Word Count:** ~2,800

---

## Executive Summary

This analysis examines three memory systems to extract patterns for enhancing AI assistant memory: **FSRS** (Free Spaced Repetition Scheduler) used by 100M+ Anki users, **Vestige** (a Rust-based MCP server implementing cognitive memory), and the existing **Spec Kit Memory** system. The key insight is that treating AI memory like a database (store everything forever) is fundamentally flawed—human-like forgetting with intelligent retention produces superior results.

---

## 1. System Architecture Overview

### 1.1 FSRS (Free Spaced Repetition Scheduler)

FSRS is a 21-parameter algorithm trained on millions of Anki reviews, achieving 30% better efficiency than SM-2. It implements the **DSR Model**:

| Variable | Range | Description |
|----------|-------|-------------|
| **Difficulty (D)** | [1, 10] | Inherent complexity of information |
| **Stability (S)** | [0, +∞) | Days until retrievability drops to 90% |
| **Retrievability (R)** | [0, 1] | Current probability of recall |

**Core Formula (Power-Law Forgetting):**
```
R(t, S) = (1 + 19/81 × t/S)^(-0.5)
```

This power-law model outperforms exponential decay because it accounts for memory superposition effects—individual memories decay exponentially, but aggregated forgetting follows power-law distribution.

### 1.2 Vestige MCP Server

Vestige implements cognitive science principles in Rust with SQLite storage:

**Architecture:**
```
vestige/
├── crates/
│   ├── vestige-core/           # Cognitive engine
│   │   ├── fsrs/               # FSRS-6 (21 parameters)
│   │   ├── embeddings/         # nomic-embed-text-v1.5 (768 dims)
│   │   ├── neuroscience/       # Brain-inspired features
│   │   │   ├── prediction_error.rs    # Titans mechanism
│   │   │   ├── context_memory.rs      # Encoding specificity
│   │   │   └── memory_states.rs       # Active/Dormant/Silent
│   │   └── search/             # Hybrid (FTS5 + HNSW)
│   └── vestige-mcp/            # 8 exposed tools
```

**Key Innovation: Prediction Error Gating**

Based on the Titans paper (arXiv 2501.00663), Vestige uses "surprise" to decide memory operations:

```rust
enum GateDecision {
    Create { prediction_error: f32 },      // High PE: new memory
    Update { target_id: String },          // Low PE: update existing
    Supersede { old_memory_id: String },   // Contradiction detected
    Reinforce { target_id: String },       // Near-duplicate: strengthen
}
```

Thresholds:
- **≥0.92 similarity**: Near-duplicate → Reinforce
- **0.75-0.92 similarity**: Check contradiction → Update or Supersede
- **<0.75 similarity**: New memory → Create

### 1.3 Spec Kit Memory (Current System)

The existing system uses SQLite with sqlite-vec for vector search:

**Cognitive Modules:**
| Module | Purpose | Current Status |
|--------|---------|----------------|
| `attention-decay.js` | Turn-based score decay | Exponential: `score × rate^turns` |
| `co-activation.js` | Spreading activation | 35% boost to related memories |
| `temporal-contiguity.js` | Time-based linking | 2-memory window, same spec_folder |
| `working-memory.js` | Session working set | 100 max, 2-hour timeout |
| `tier-classifier.js` | HOT/WARM/COLD tiers | Fixed thresholds (0.8, 0.25) |

**Search Pipeline:**
1. Hybrid search (FTS5 + vector)
2. RRF fusion (k=60)
3. Composite scoring (similarity 35%, importance 25%, recency 20%, popularity 10%, tier 10%)
4. Tiered content delivery (HOT: full, WARM: summary, COLD: excluded)

---

## 2. Core Logic Flows and Data Structures

### 2.1 FSRS State Machine

```
┌─────┐     ┌──────────┐     ┌────────┐
│ New │────►│ Learning │────►│ Review │
└─────┘     └──────────┘     └────────┘
                 ▲               │
                 │    (Again)    │
                 │               ▼
                 └──────── Relearning
```

**State Transitions:**
- **New → Learning**: First review (any grade)
- **Learning → Review**: Graduate after meeting stability threshold
- **Review → Relearning**: Failed review (grade=1)
- **Relearning → Review**: Successful recovery

### 2.2 Vestige Memory Lifecycle

```
ENCODING
├─► ingest() → Create KnowledgeNode
├─► Generate embedding (768-dim via nomic-embed)
├─► Add to HNSW index (USearch)
├─► Initialize FSRS (stability=1.0, difficulty=5.0)
└─► Capture EncodingContext (temporal, topical, session)

RETRIEVAL
├─► search() → Hybrid (FTS5 + vector + RRF)
├─► Context matching boost (up to 30%)
├─► Testing Effect: strengthen_on_access()
└─► Return with scores + context reinstatement

MAINTENANCE
├─► FSRS scheduling: next_review = now + interval
├─► Strength decay via retrievability formula
├─► State transitions: Active → Dormant → Silent
└─► Consolidation: periodic pruning
```

### 2.3 Spec Kit Memory Data Model

**Core Tables:**
```sql
-- Main memory storage
memory_index (
    id, file_path, spec_folder, content_hash,
    importance_tier, context_type, related_memories,
    trigger_phrases, access_count, embedding_status
)

-- Session working memory
working_memory (
    session_id, memory_id, attention_score,
    last_mentioned_turn, tier, created_at
)

-- Vector embeddings
vec_memories (
    memory_id, embedding -- 768/1024/1536 dims
)
```

---

## 3. Integration Mechanisms

### 3.1 FSRS Integration Points

FSRS can integrate with Spec Kit Memory at three levels:

**Level 1: Scoring Enhancement**
Add retrievability to composite scoring:
```javascript
const ENHANCED_WEIGHTS = {
  similarity: 0.30,      // Reduced from 0.35
  importance: 0.25,
  recency: 0.15,         // Reduced from 0.20
  popularity: 0.10,
  tier_boost: 0.05,      // Reduced from 0.10
  retrievability: 0.15   // NEW: FSRS-based
};
```

**Level 2: Decay Replacement**
Replace exponential decay with FSRS power-law:
```javascript
// Current: score × rate^turns
// FSRS: (1 + factor × elapsed/stability)^(-0.5)
```

**Level 3: Full Scheduling**
Implement review scheduling for memory maintenance.

### 3.2 Prediction Error Gating Integration

Integrates with `memory_save` handler:

```javascript
async function memory_save(params) {
  const newEmbedding = await generateEmbedding(params.content);
  const candidates = await vectorSearch(newEmbedding, { limit: 5 });

  const decision = predictionErrorGate.evaluate(
    params.content, newEmbedding, candidates
  );

  switch (decision.action) {
    case 'CREATE': return createMemory(params);
    case 'UPDATE': return updateMemory(decision.targetId, params);
    case 'SUPERSEDE': return supersedeMemory(decision.oldId, params);
    case 'REINFORCE': return reinforceMemory(decision.targetId);
  }
}
```

### 3.3 Context-Dependent Retrieval

**Context Dimensions:**
| Dimension | Weight | Captures |
|-----------|--------|----------|
| Semantic | 30% | Topic, domain, concepts |
| Task | 25% | debugging, implementation, research |
| Environmental | 20% | File paths, folders, git state |
| Cognitive | 15% | Conversation depth, mode |
| Temporal | 10% | Time patterns, session timing |

**Retrieval Enhancement:**
```javascript
function enhancedSearch(query, currentContext) {
  const results = hybridSearch(query);

  return results.map(result => ({
    ...result,
    score: result.score * (1 + 0.3 * contextMatch(
      result.encodingContext, currentContext
    ))
  }));
}
```

---

## 4. Design Patterns and Architectural Decisions

### 4.1 Dual-Strength Memory Model (Bjork)

From Bjork's New Theory of Disuse:

| Strength | Behavior | Implementation |
|----------|----------|----------------|
| **Storage Strength** | Monotonically increases | `stability` in FSRS |
| **Retrieval Strength** | Fluctuates with use | `retrievability` calculation |

**Key Insight:** Forgetting is decreased retrieval strength, not loss of storage. "Dormant" memories can be reactivated.

### 4.2 Testing Effect

Accessing a memory strengthens it:
```javascript
function strengthen_on_access(memoryId) {
  const memory = getMemory(memoryId);
  const currentR = calculateRetrievability(memory);

  // Lower R at access = greater stability boost (desirable difficulty)
  const boost = (1 - currentR) * BOOST_FACTOR;
  updateStability(memoryId, memory.stability * (1 + boost));
}
```

### 4.3 5-State Memory Model

```
┌─────────────────────────────────────────────────────────────┐
│  HOT (R >= 0.8)     │ Full content, max 5 in working set   │
├─────────────────────────────────────────────────────────────┤
│  WARM (0.25-0.8)    │ Summary content, max 10              │
├─────────────────────────────────────────────────────────────┤
│  COLD (0.05-0.25)   │ Tracked, not returned                │
├─────────────────────────────────────────────────────────────┤
│  DORMANT (R < 0.05) │ Excluded from context, preserved     │
├─────────────────────────────────────────────────────────────┤
│  ARCHIVED (90+ days)│ Cold storage tier                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Technical Dependencies and Requirements

### 5.1 FSRS Requirements
- 21 float parameters (can use defaults or train custom)
- Timestamp tracking for stability calculations
- Grade input (1-4 scale) on retrieval feedback

### 5.2 Vestige Dependencies
- Rust 2021 edition
- SQLite with FTS5
- fastembed v5 (ONNX for local embeddings)
- USearch HNSW index

### 5.3 Spec Kit Memory Stack
- Node.js with better-sqlite3
- sqlite-vec extension
- External embedding API (Voyage AI)
- MCP protocol for tool exposure

---

## 6. Current Limitations and Constraints

### 6.1 Spec Kit Memory Gaps

| Gap | Impact | Severity |
|-----|--------|----------|
| No FSRS decay | Memories never naturally fade | High |
| No prediction error gating | Duplicate memories accumulate | High |
| No dual-strength tracking | Can't distinguish learned vs accessible | Medium |
| Fixed decay rate | One-size-fits-all forgetting | Medium |
| No context encoding | Context-dependent retrieval limited | Medium |
| Session memory not persisted | Lost on restart | Low |

### 6.2 Vestige Limitations
- Local embeddings (768-dim) vs Voyage AI (1024/1536-dim)
- No checkpoint system
- No session learning tracking
- Rust complexity for maintenance

### 6.3 FSRS Constraints
- Requires explicit feedback (grade) on retrieval
- Parameters optimized for flashcards, not conversations
- No native context handling

---

## 7. Key Learnings and Interesting Approaches

### 7.1 From FSRS
1. **Power-law beats exponential** for aggregate forgetting
2. **Desirable difficulties**: harder retrieval = stronger learning
3. **Mean reversion** prevents difficulty from drifting to extremes
4. **Grade modifiers** (Hard penalty, Easy bonus) enable fine-tuning

### 7.2 From Vestige
1. **Prediction error gating** elegantly solves duplicate detection
2. **Testing effect** auto-strengthens useful memories
3. **Memory states** (Active/Dormant/Silent) manage context window
4. **Encoding context** enables context-dependent retrieval boost

### 7.3 From Cognitive Science
1. **Dual-strength model** explains why "forgotten" memories can return
2. **Encoding specificity** (Tulving 1973): retrieval context matching boosts recall
3. **Spreading activation** (Collins & Loftus): related memories prime each other
4. **Synaptic tagging** (Frey & Morris): weak memories can be strengthened by strong ones

---

## 8. Architecture Comparison Matrix

| Feature | FSRS | Vestige | Spec Kit Memory |
|---------|------|---------|-----------------|
| Decay Model | Power-law | Power-law (FSRS-6) | Exponential |
| Parameters | 21 | 21 + config | Fixed rates |
| Embedding | N/A | nomic (768) | Voyage (1024+) |
| Vector Search | N/A | HNSW + FTS5 | sqlite-vec + FTS5 |
| Fusion | N/A | RRF | RRF |
| Conflict Detection | N/A | Prediction Error | None |
| Context Encoding | N/A | Yes | Partial |
| Dual Strength | Implicit | Yes | No |
| Memory States | 4 | 4+ | 3 (HOT/WARM/COLD) |
| Session Persistence | N/A | No | No |
| Checkpoints | N/A | No | Yes |
| Language | Multiple | Rust | JavaScript |

---

## Conclusion

The three systems represent complementary approaches to memory management:

- **FSRS** provides mathematically rigorous forgetting curves and scheduling
- **Vestige** implements neuroscience-inspired conflict detection and context encoding
- **Spec Kit Memory** has strong foundations in tiered retrieval and session management

The optimal path forward combines FSRS's proven decay model with Vestige's prediction error gating, layered onto Spec Kit Memory's existing infrastructure. This preserves backward compatibility while adding human-like memory characteristics.

---

**Sources:**
- [FSRS Algorithm Wiki](https://github.com/open-spaced-repetition/fsrs4anki/wiki/The-Algorithm)
- [Vestige GitHub](https://github.com/samvallad33/vestige)
- [Titans Paper (arXiv 2501.00663)](https://arxiv.org/abs/2501.00663)
- [Bjork Lab Research](https://bjorklab.psych.ucla.edu/research/)
- [Tulving & Thomson 1973](https://psycnet.apa.org/record/1973-31800-001)
