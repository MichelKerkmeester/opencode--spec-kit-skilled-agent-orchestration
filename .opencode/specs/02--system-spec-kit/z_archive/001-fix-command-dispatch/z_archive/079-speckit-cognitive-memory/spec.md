---
title: "Feature Specification: Cognitive Memory Upgrade [079-speckit-cognitive-memory/spec]"
description: "Upgrade the Spec Kit Memory MCP server with cognitive science-inspired memory patterns: FSRS power-law decay, prediction error gating for conflict detection, and dual-strength t..."
trigger_phrases:
  - "feature"
  - "specification"
  - "cognitive"
  - "memory"
  - "upgrade"
  - "spec"
  - "079"
  - "speckit"
importance_tier: "important"
contextType: "decision"
---
# Feature Specification: Cognitive Memory Upgrade

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.0 -->

---

## EXECUTIVE SUMMARY

Upgrade the Spec Kit Memory MCP server with cognitive science-inspired memory patterns: FSRS power-law decay, prediction error gating for conflict detection, and dual-strength tracking. This transforms the system from "store everything forever" to intelligent memory that naturally retains what matters and forgets what doesn't.

**Key Decisions**: FSRS power-law decay over exponential, prediction error gating for duplicate detection, phased rollout for backward compatibility

**Critical Dependencies**: sqlite-vec extension, existing memory_index schema

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-01-27 |
| **Research** | `001-analysis-cognitive-memory-systems.md`, `002-recommendations-cognitive-memory-upgrade.md` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement

The current Spec Kit Memory system stores memories indefinitely with arbitrary exponential decay. This causes: (1) memory bloat over time, (2) duplicate memories from similar content, (3) no distinction between "learned" vs "accessible" memories, (4) context window pollution from irrelevant old memories.

### Purpose

Implement human-like memory characteristics where useful memories strengthen through retrieval, unused memories naturally fade, duplicates are intelligently detected, and the context window stays clean with only relevant content.

---

## 3. SCOPE

### In Scope

- **FSRS Power-Law Decay**: Replace exponential decay with research-backed formula
- **Prediction Error Gating**: Detect conflicts/duplicates before creating new memories
- **Dual-Strength Tracking**: Track storage_strength and retrieval_strength separately
- **Testing Effect**: Auto-strengthen memories on access
- **5-State Memory Model**: Extend HOT/WARM/COLD with DORMANT and ARCHIVED
- **Schema Migration**: Add new columns with backward-compatible defaults

### Out of Scope

- Rust rewrite (keep JavaScript) - complexity not justified
- Local embedding model - Voyage AI provides superior quality
- Review scheduling UI - beyond current scope
- Cross-database migration - existing SQLite sufficient

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/cognitive/fsrs-scheduler.js` | Create | FSRS algorithm implementation |
| `mcp_server/lib/cognitive/prediction-error-gate.js` | Create | Conflict detection logic |
| `mcp_server/lib/cognitive/attention-decay.js` | Modify | Replace exponential with FSRS |
| `mcp_server/lib/cognitive/tier-classifier.js` | Modify | Add DORMANT, ARCHIVED states |
| `mcp_server/lib/scoring/composite-scoring.js` | Modify | Add retrievability factor |
| `mcp_server/handlers/memory-save.js` | Modify | Integrate prediction error gating |
| `mcp_server/handlers/memory-search.js` | Modify | Add testing effect strengthening |
| `mcp_server/core/index.js` | Modify | Schema migration for new columns |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | FSRS retrievability calculation | `calculate_retrievability(stability, elapsed_days)` returns value 0-1 matching FSRS formula |
| REQ-002 | Schema migration adds stability, difficulty columns | Migration runs without data loss, defaults applied |
| REQ-003 | Prediction error gating prevents duplicates | Similarity > 0.95 triggers REINFORCE, not CREATE |
| REQ-004 | Backward compatibility maintained | Existing memories work without migration issues |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Testing effect strengthens on access | Accessed memories show increased stability |
| REQ-006 | 5-state model implemented | DORMANT/ARCHIVED states filter correctly |
| REQ-007 | Composite scoring includes retrievability | New weight (0.15) integrated in scoring |
| REQ-008 | Conflict logging for audit | memory_conflicts table tracks decisions |

### P2 - Optional (can defer)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Contradiction detection | NLP patterns detect conflicting content |
| REQ-010 | Context encoding capture | Save encoding context with memories |

---

## 5. SUCCESS CRITERIA

- **SC-001**: Memory bloat reduced - dormant memories excluded from context window
- **SC-002**: No duplicate memories - prediction error gating active on all saves
- **SC-003**: Useful memories persist - accessed memories maintain high retrievability
- **SC-004**: All existing tests pass - no regression in functionality

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | sqlite-vec extension | Cannot run without | Verified already installed |
| Dependency | better-sqlite3 | Transaction support | Already in package.json |
| Risk | Migration corrupts data | High | Backup before migration, defaults only |
| Risk | Performance degradation | Medium | Cache retrievability, batch updates |
| Risk | FSRS parameters wrong | Medium | Use proven defaults from Anki research |

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Retrievability calculation < 1ms per memory
- **NFR-P02**: Prediction error search < 100ms for 5 candidates
- **NFR-P03**: Batch decay update < 5s for 10,000 memories

### Security

- **NFR-S01**: No external API calls for FSRS (local calculation only)
- **NFR-S02**: Memory conflicts logged but not exposed to users

### Reliability

- **NFR-R01**: Schema migration is idempotent (can run multiple times safely)
- **NFR-R02**: Graceful degradation if new columns missing

---

## 8. EDGE CASES

### Data Boundaries

- **Empty stability**: Default to 1.0 days
- **Null last_review**: Use created_at as fallback
- **Negative elapsed time**: Clamp to 0

### Error Scenarios

- **Vector search fails**: Fall back to CREATE action (no gating)
- **Migration fails mid-run**: Transaction rollback, retry safe
- **Calculation overflow**: Use Math.min/max bounds

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: 8, LOC: ~800, Systems: 1 |
| Risk | 15/25 | Auth: N, API: N, Breaking: Y (schema) |
| Research | 18/20 | Extensive (FSRS, Vestige, cognitive science) |
| Multi-Agent | 10/15 | 4 parallel workstreams possible |
| Coordination | 12/15 | Dependencies: 3 internal modules |
| **Total** | **75/100** | **Level 3+** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Schema migration data loss | H | L | Backup + transaction + defaults only |
| R-002 | FSRS parameters need tuning | M | M | Start with Anki defaults, expose config |
| R-003 | Performance regression | M | L | Cache calculations, batch updates |
| R-004 | Prediction error false positives | M | M | Tunable thresholds, logging for analysis |

---

## 11. USER STORIES

### US-001: Memory Decay (Priority: P0)

**As a** developer using the memory system, **I want** unused memories to naturally fade, **so that** my context window stays clean and relevant.

**Acceptance Criteria**:
1. Given a memory not accessed for 7 days, When retrievability is calculated, Then it should be significantly lower than a recently accessed memory
2. Given a DORMANT memory (R < 0.05), When searching, Then it should not appear in results

### US-002: Duplicate Prevention (Priority: P0)

**As a** developer saving memories, **I want** the system to detect duplicates, **so that** I don't accumulate redundant information.

**Acceptance Criteria**:
1. Given I save content 95% similar to existing memory, When prediction error gating runs, Then it should REINFORCE existing instead of CREATE new
2. Given a conflict is detected, When saved, Then the decision should be logged to memory_conflicts table

### US-003: Memory Strengthening (Priority: P1)

**As a** developer accessing memories, **I want** useful memories to strengthen, **so that** they persist longer than unused ones.

**Acceptance Criteria**:
1. Given I access a memory via search, When the result is returned, Then the memory's stability should increase
2. Given a memory accessed at low retrievability (R < 0.4), When strengthened, Then the boost should be larger (desirable difficulty)

---

## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | User | Pending | |
| Design Review | User | Pending | |
| Implementation Review | User | Pending | |
| Launch Approval | User | Pending | |

---

## 13. COMPLIANCE CHECKPOINTS

### Security Compliance

- [ ] No external API calls for core calculations
- [ ] Memory data stays local (SQLite)
- [ ] Conflict logging doesn't expose sensitive content

### Code Compliance

- [ ] workflows-code standards followed (snake_case, file headers, IIFE)
- [ ] CDN-safe initialization pattern used
- [ ] Error handling with silent catch for non-critical ops

---

## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| User | Developer | High | Direct in-conversation |
| Memory System | Internal | High | Via MCP tools |

---

## 15. CHANGE LOG

### v1.0 (2026-01-27)

**Initial specification**
- Defined FSRS integration requirements
- Defined prediction error gating
- Established 4-phase implementation plan

---

## 16. OPEN QUESTIONS

- [ ] Should FSRS difficulty be user-adjustable per memory?
- [ ] What retention threshold for DORMANT → ARCHIVED transition? (Currently 90 days)
- [ ] Should contradiction detection use embedding comparison or NLP patterns?

---

## RELATED DOCUMENTS

- **Research Analysis**: See `001-analysis-cognitive-memory-systems.md`
- **Recommendations**: See `002-recommendations-cognitive-memory-upgrade.md`
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
