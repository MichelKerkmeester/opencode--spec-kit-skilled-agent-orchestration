---
title: "Spec: Memory & Folder Ranking Improvements [070-memory-ranking/spec]"
description: "The memory dashboard displays \"top folders\" ranked purely by memory file count. This creates several issues"
trigger_phrases:
  - "spec"
  - "memory"
  - "folder"
  - "ranking"
  - "improvements"
  - "070"
importance_tier: "important"
contextType: "decision"
---
# Spec: Memory & Folder Ranking Improvements

> **Level:** 3 (≥500 LOC, architecture changes)  
> **Status:** Phase 2 Complete  
> **Created:** 2026-01-16  
> **Updated:** 2026-01-16  
> **Spec Folder:** `003-memory-and-spec-kit/070-memory-ranking`

---

## 1. Problem Statement

### Current Behavior

The memory dashboard displays "top folders" ranked purely by **memory file count**. This creates several issues:

| Issue | Example | Impact |
|-------|---------|--------|
| Archived folders appear | `z_archive/044-speckit-test-suite` (7 files) outranks active work | User sees irrelevant, historical content |
| No recency weighting | Folder with 7 old memories > folder with 3 recent ones | Cannot quickly resume recent work |
| Test data pollution | Test suite folders inflate rankings | Noise obscures signal |
| Count-only metric | 7 test memories = "more important" than 2 critical decisions | Quantity over quality |

### Current Implementation

```javascript
// memory_stats() returns:
{
  topFolders: [
    { folder: "z_archive/044-speckit-test-suite", count: 7 },
    { folder: "004-command-logic-improvement", count: 6 },
    // ... sorted by count DESC only
  ]
}
```

### User Needs

| Use Case | Primary Factor | Current Support |
|----------|---------------|-----------------|
| Resume recent work | Recency | Not supported |
| Find important reference | Importance tier | Not supported |
| Explore related context | Semantic similarity | Partial (search only) |
| Clean up old memories | Archive status | Not exposed |

---

## 2. Proposed Solution

### 2.1 Composite Folder Ranking

Replace count-only ranking with a multi-factor composite score:

```
folder_score = (
  recency_weight × recency_score +
  activity_weight × activity_score +
  importance_weight × importance_score +
  validation_weight × validation_score
) × archive_multiplier
```

**Default Weights:**
- Recency: 0.40 (most recent memory update)
- Importance: 0.30 (average tier of memories)
- Activity: 0.20 (memory count, capped)
- Validation: 0.10 (user feedback scores)

**Archive Multiplier:**
- Active folders: 1.0
- `z_archive/` paths: 0.1
- `scratch/` or `test-` paths: 0.2

### 2.2 Individual Memory Ranking

Enhance memory search results with multi-factor scoring:

| Factor | Weight | Description |
|--------|--------|-------------|
| Semantic similarity | 0.50 | Vector cosine distance (existing) |
| Recency decay | 0.20 | Time since last update |
| Importance tier | 0.20 | constitutional=1.0 → deprecated=0.0 |
| Validation confidence | 0.10 | User feedback history |

**Boosts:**
- Exact trigger match: +0.30
- Partial trigger match: +0.15
- Same spec folder as current context: +0.20

### 2.3 Improved Dashboard Display

```
╭─────────────────────────────────────────────────────────────╮
│  MEMORY DASHBOARD                          [173 entries]    │
├─────────────────────────────────────────────────────────────┤
│  ★ CONSTITUTIONAL (always active)                           │
│    #173  CRITICAL GATES & RULES                             │
│                                                             │
│  ◆ RECENTLY ACTIVE FOLDERS                                  │
│    012-form-input-components (2 memories, last: 2h ago)     │
│    058-generate-context-modularization (6, last: 1d ago)    │
│                                                             │
│  ◇ HIGH IMPORTANCE CONTENT                                  │
│    system-spec-kit (constitutional)                         │
│    009-security-remediation (critical decisions)            │
│                                                             │
│  ○ RECENT MEMORIES                                          │
│    #172  SESSION SUMMARY (font-performance)                 │
├─────────────────────────────────────────────────────────────┤
│  [#] load | [s]earch | [f]olders | [t]riggers | [q]uit      │
╰─────────────────────────────────────────────────────────────╯
```

---

## 3. Scope

### In Scope

- Folder ranking algorithm (composite scoring)
- Memory ranking enhancements
- Dashboard display improvements
- Archive/test folder filtering
- MCP parameter additions for ranking control
- Access tracking schema (for future learning)

### Out of Scope

- Personalized ranking per user (future)
- ML-based relevance learning (future)
- Cross-project memory ranking (different scope)
- UI beyond CLI dashboard (Webflow integration)

---

## 4. Success Criteria

| Criterion | Measurement | Target |
|-----------|-------------|--------|
| Archived folders hidden | Default dashboard excludes `z_archive/` | 100% filtered |
| Recency reflected | Most recent folder appears in top 3 | Always |
| Importance surfaces | Constitutional/critical content visible | Top section |
| Performance acceptable | Dashboard render time | <500ms |
| Backward compatible | Existing API calls work unchanged | 100% |

---

## 5. Technical Context

### Affected Systems

| System | Location | Changes |
|--------|----------|---------|
| Memory MCP Server | External package | API parameters, schema |
| Dashboard Command | `.opencode/command/memory-search.md` | Display logic |
| Memory Search | `.opencode/command/memory-search.md` | Ranking integration |

### Dependencies

- SQLite with sqlite-vec extension (existing)
- Spec Kit Memory MCP (existing)
- generate-context.js for memory saves (existing)

---

## 6. References

- Current MCP implementation: `spec_kit_memory` tools
- Dashboard command: `/memory:search`
- Related spec: `058-generate-context-modularization`
- **Research document:** `research.md` (prior art, alternatives, evidence)
