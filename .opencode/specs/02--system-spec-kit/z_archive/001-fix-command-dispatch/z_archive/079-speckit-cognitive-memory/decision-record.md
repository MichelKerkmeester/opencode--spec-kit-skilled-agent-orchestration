---
title: "Decision Record: Cognitive Memory Upgrade [079-speckit-cognitive-memory/decision-record]"
description: "The current Spec Kit Memory system uses an arbitrary exponential decay formula (score × rate^turns) which does not accurately model human memory behavior. Research shows that ag..."
trigger_phrases:
  - "decision"
  - "record"
  - "cognitive"
  - "memory"
  - "upgrade"
  - "decision record"
  - "079"
  - "speckit"
importance_tier: "important"
contextType: "decision"
---
# Decision Record: Cognitive Memory Upgrade

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.0 -->

---

## ADR-001: FSRS Power-Law Over Exponential Decay

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-01-27 |
| **Deciders** | User, AI Assistant |

---

### Context

The current Spec Kit Memory system uses an arbitrary exponential decay formula (`score × rate^turns`) which does not accurately model human memory behavior. Research shows that aggregated forgetting follows a power-law distribution due to memory superposition effects, not pure exponential decay.

### Constraints

- Must maintain backward compatibility with existing memories
- Cannot require external API calls (must calculate locally)
- Should use proven parameters, not arbitrary values

---

### Decision

**Summary**: Adopt FSRS v4 power-law formula for retrievability calculation.

**Details**: Replace the exponential decay in `attention-decay.js` with the FSRS power-law formula: `R(t, S) = (1 + 0.235 × t/S)^(-0.5)`. This formula has been validated on 100M+ Anki users and achieves 30% better efficiency than SM-2.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **FSRS Power-Law** | Research-backed, proven on 100M users, accurate forgetting curves | Requires stability tracking per memory | 9/10 |
| Exponential Decay | Simple implementation, already in codebase | Arbitrary parameters, too aggressive, poor fit to actual forgetting | 4/10 |
| SM-2 Algorithm | Well-documented, widely used | Older algorithm, less efficient than FSRS, interval-based not strength-based | 6/10 |
| Leitner System | Simple box-based approach | Binary (know/don't know), not granular enough | 3/10 |

**Why Chosen**: FSRS is the most scientifically validated algorithm available, with proven performance on a massive user base. The power-law formula better models aggregate forgetting behavior.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Current exponential decay causes memory bloat (no natural forgetting) |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives evaluated (exponential, SM-2, Leitner, FSRS) |
| 3 | **Sufficient?** | PASS | Single formula change, additive schema |
| 4 | **Fits Goal?** | PASS | Directly addresses "intelligent forgetting" requirement |
| 5 | **Open Horizons?** | PASS | FSRS parameters can be tuned; formula is extensible |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Natural forgetting that matches human memory curves
- Reduced memory bloat (unused memories fade)
- Research-backed parameters (not arbitrary)
- Better retention of useful memories

**Negative**:
- Requires new schema columns (stability, difficulty) - Mitigation: Additive migration with defaults
- More complex than exponential - Mitigation: Well-documented formula, unit tests

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Parameters not optimal for conversations | M | Use Anki defaults, expose config for tuning |
| Performance impact | L | Formula is O(1), cache results if needed |

---

### Implementation

**Affected Systems**:
- `mcp_server/lib/cognitive/attention-decay.js` (modify decay formula)
- `mcp_server/lib/cognitive/fsrs-scheduler.js` (new file)
- `mcp_server/core/index.js` (schema migration)

**Rollback**: Remove new columns (schema is additive), revert code changes via git, existing formula restored.

---

## ADR-002: Prediction Error Gating Thresholds

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-01-27 |
| **Deciders** | User, AI Assistant |

---

### Context

The current memory system creates new memories without checking for duplicates or conflicts. This leads to accumulation of redundant memories and conflicting information. Research on the Vestige MCP server (implementing Titans paper mechanisms) shows that "prediction error gating" effectively detects and handles duplicates.

### Constraints

- Must integrate with existing vector search (sqlite-vec)
- Thresholds must be tunable (different contexts may need adjustment)
- Cannot significantly slow down memory save operations

---

### Decision

**Summary**: Use three-tier similarity thresholds for conflict detection.

**Details**: Implement prediction error gating with thresholds based on Vestige research:
- ≥0.95 similarity: DUPLICATE → REINFORCE existing memory
- 0.90-0.94: HIGH_MATCH → Check for contradiction, then UPDATE or SUPERSEDE
- 0.70-0.89: MEDIUM_MATCH → Context-dependent (may LINK related memories)
- <0.70: LOW_MATCH → CREATE new memory

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Three-Tier (0.95/0.90/0.70)** | Balanced, handles edge cases, proven in Vestige | Requires contradiction detection for middle tier | 8/10 |
| Single Threshold (0.90) | Simple implementation | Too many false positives, misses near-duplicates | 5/10 |
| Two-Tier (0.95/0.70) | Simpler than three-tier | Misses contradiction cases in middle range | 6/10 |
| Content Hash Only | No false positives | Misses semantic duplicates, only exact matches | 4/10 |

**Why Chosen**: Three-tier model from Vestige research handles the full spectrum of similarity cases while providing clear action decisions for each tier.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Users report duplicate memories accumulating |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives evaluated |
| 3 | **Sufficient?** | PASS | Thresholds + actions cover all cases |
| 4 | **Fits Goal?** | PASS | Directly prevents duplicate memory creation |
| 5 | **Open Horizons?** | PASS | Thresholds configurable for different use cases |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Eliminates most duplicate memories (95%+ similar)
- Handles contradictions gracefully (SUPERSEDE)
- Allows related but different memories (LINK)
- Audit trail for decisions (memory_conflicts table)

**Negative**:
- Additional vector search on save (~100ms) - Mitigation: Limit to 5 candidates
- Potential false positives on 0.90-0.94 range - Mitigation: Contradiction check + logging

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Thresholds too aggressive | M | Tunable config, start conservative |
| Contradiction detection false positives | M | Pattern-based, logging for analysis |
| Save operation slower | L | Candidate limit, async processing |

---

### Implementation

**Affected Systems**:
- `mcp_server/lib/cognitive/prediction-error-gate.js` (new file)
- `mcp_server/handlers/memory-save.js` (integration)
- `mcp_server/core/index.js` (memory_conflicts table)

**Rollback**: Remove PE gate integration from handler, fall back to CREATE-only behavior.

---

## ADR-003: Additive Schema Migration Strategy

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-01-27 |
| **Deciders** | User, AI Assistant |

---

### Context

The cognitive memory upgrade requires new database columns (stability, difficulty, last_review, review_count) and a new table (memory_conflicts). This requires a migration strategy that doesn't corrupt existing data or cause downtime.

### Constraints

- Existing memories must work immediately after migration
- No downtime or complex migration scripts
- Migration must be idempotent (safe to run multiple times)

---

### Decision

**Summary**: Add columns with DEFAULT values only. No data transformation.

**Details**: Use `ALTER TABLE ... ADD COLUMN ... DEFAULT value` statements. Columns get sensible defaults:
- `stability`: DEFAULT 1.0 (1 day)
- `difficulty`: DEFAULT 5.0 (medium)
- `last_review`: DEFAULT created_at (use creation date)
- `review_count`: DEFAULT 0

This allows gradual population as memories are accessed.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Additive with Defaults** | Zero downtime, backward compatible, idempotent | Existing memories start with defaults | 9/10 |
| Batch Migration | All data consistent immediately | Downtime required, risk of corruption | 5/10 |
| New Table + Data Copy | Clean schema | Complex migration, data duplication | 4/10 |
| Schema Version Flag | Explicit versioning | More complex code paths | 6/10 |

**Why Chosen**: Additive migration with defaults provides the safest, most backward-compatible approach with zero downtime risk.

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | New features require new columns |
| 2 | **Beyond Local Maxima?** | PASS | 4 migration strategies evaluated |
| 3 | **Sufficient?** | PASS | Defaults allow gradual transition |
| 4 | **Fits Goal?** | PASS | Enables cognitive features without breaking existing |
| 5 | **Open Horizons?** | PASS | Can add more columns later with same pattern |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Existing memories work immediately
- Zero migration downtime
- Idempotent (safe to run multiple times)
- Simple rollback (columns ignored if not used)

**Negative**:
- Existing memories have default values initially - Mitigation: Values update on first access
- Schema has "old" and "new" data coexisting - Mitigation: Code handles both cases

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Default values not optimal | L | Sensible defaults chosen, updated on access |
| Migration script fails | M | Wrap in transaction, backup first |

---

### Implementation

**Affected Systems**:
- `mcp_server/core/index.js` (migration code)

**Rollback**:
1. Restore database from backup
2. Code changes ignore new columns (backward compatible)
3. No manual schema changes needed

---

## ADR-004: 5-State Memory Model

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-01-27 |
| **Deciders** | User, AI Assistant |

---

### Context

The current system uses a 3-tier model (HOT/WARM/COLD) with fixed thresholds. This doesn't account for truly dormant memories that should be excluded from context or archived memories that are essentially permanent but inactive storage.

### Constraints

- Must be backward compatible with existing tier system
- Context window space is limited (need effective filtering)
- Dormant memories should be reactivatable

---

### Decision

**Summary**: Extend to 5 states using retrievability thresholds.

**Details**:
- HOT (R >= 0.80): Full content, max 5 in working set
- WARM (0.25 <= R < 0.80): Summary content, max 10
- COLD (0.05 <= R < 0.25): Tracked, not returned in context
- DORMANT (R < 0.05): Excluded from context, preserved in storage
- ARCHIVED (90+ days inactive): Cold storage tier, reactivatable

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Context window pollution from old memories |
| 2 | **Beyond Local Maxima?** | PASS | Evaluated 3-tier, 4-tier, and 5-tier options |
| 3 | **Sufficient?** | PASS | Covers full lifecycle from active to archived |
| 4 | **Fits Goal?** | PASS | Directly addresses context window management |
| 5 | **Open Horizons?** | PASS | Thresholds configurable, states extensible |

**Checks Summary**: 5/5 PASS

---

### Consequences

**Positive**:
- Clean context window (only relevant memories)
- Dormant memories preserved but not polluting
- Clear lifecycle for memory aging

**Negative**:
- More complex state logic - Mitigation: Well-defined thresholds

---

### Implementation

**Affected Systems**:
- `mcp_server/lib/cognitive/tier-classifier.js`
- `mcp_server/lib/cognitive/working-memory.js`

**Rollback**: Revert to 3-tier model, ignore new states.

---

## Session Decision Log

> **Purpose**: Track all gate decisions made during this session for audit trail and learning.

| Timestamp | Gate | Decision | Confidence | Uncertainty | Evidence |
|-----------|------|----------|------------|-------------|----------|
| 2026-01-27 | Research Complete | PASS | HIGH | 0.10 | 10 research agents completed |
| 2026-01-27 | Spec Level | 3+ | HIGH | 0.05 | Complexity score 75/100, multi-module |
| 2026-01-27 | ADR-001 (FSRS) | ACCEPTED | HIGH | 0.05 | 100M+ user validation |
| 2026-01-27 | ADR-002 (PE Gate) | ACCEPTED | HIGH | 0.10 | Vestige research + Titans paper |
| 2026-01-27 | ADR-003 (Migration) | ACCEPTED | HIGH | 0.05 | Zero-downtime strategy |
| 2026-01-27 | ADR-004 (5-State) | ACCEPTED | MEDIUM | 0.15 | Extension of existing model |

**Log Instructions**:
- Record each gate decision as it occurs during the session
- Include both PASS and BLOCK decisions for completeness
- Link to relevant ADR if decision resulted in new architecture record

---

## Research Sources

| Source | URL | Key Insight |
|--------|-----|-------------|
| FSRS Algorithm Wiki | github.com/open-spaced-repetition/fsrs4anki/wiki | Power-law formula, 21 parameters |
| Vestige MCP Server | github.com/samvallad33/vestige | Prediction error gating, Rust implementation |
| Titans Paper | arXiv 2501.00663 | Prediction error gating mechanism |
| Bjork Lab Research | bjorklab.psych.ucla.edu/research | Dual-strength memory model |
| Tulving & Thomson 1973 | psycnet.apa.org | Encoding specificity principle |

---

<!--
Level 3+ Decision Record
Document significant technical decisions
One ADR per major decision
Includes Session Decision Log for audit trail
-->
