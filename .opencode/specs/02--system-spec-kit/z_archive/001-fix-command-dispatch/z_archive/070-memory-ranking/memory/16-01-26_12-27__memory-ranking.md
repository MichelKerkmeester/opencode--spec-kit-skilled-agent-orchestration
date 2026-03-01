---
title: "To promote a memory to constitutional tier (always surfaced) [070-memory-ranking/16-01-26_12-27__memory-ranking]"
importance_tier: "normal"
contextType: "general"
---
<!-- TEMPLATE: context_template.md v2.2 - DO NOT EDIT GENERATED FILES -->
<!-- Constitutional Tier Promotion:
  To promote a memory to constitutional tier (always surfaced):
  
  1. Via MCP tool after indexing:
     memory_update({ id: <memory_id>, importanceTier: 'constitutional' })
  
  2. Criteria for constitutional:
     - Applies to ALL future conversations (not project-specific)
     - Core constraints/rules that should NEVER be forgotten
     - ~2000 token budget total for constitutional tier
     
  3. Add trigger phrases for proactive surfacing:
     memory_update({ 
       id: <memory_id>, 
       importanceTier: 'constitutional',
       triggerPhrases: ['fix', 'implement', 'create', 'modify', ...]
     })
     
  4. Examples of constitutional content:
     - "Always ask Gate 3 spec folder question before file modifications"
     - "Never modify production data directly"
     - "Memory files MUST use generate-context.js script"
-->

---

# SESSION SUMMARY

| **Meta Data** | **Value** |
|:--------------|:----------|
| Session Date | 2026-01-16 |
| Session ID | session-1768562878943-pqvza91mv |
| Spec Folder | 003-memory-and-spec-kit/071-memory-ranking |
| Channel | main |
| Importance Tier | normal |
| Context Type | general |
| Total Messages | 12 |
| Tool Executions | 24 |
| Decisions Made | 5 |
| Follow-up Items Recorded | 0 |
| Created At | 2026-01-16 |
| Created At (Epoch) | 1768562878 |
| Last Accessed (Epoch) | 1768562878 |
| Access Count | 1 |

---

<!-- ANCHOR:preflight-session-1768562878943-pqvza91mv-003-memory-and-spec-kit/071-memory-ranking -->
## PREFLIGHT BASELINE

**Epistemic state captured at session start for learning delta calculation.**

| Metric | Value | Assessment |
|--------|-------|------------|
| Knowledge Score | [N/A]/100 | [Not assessed - migrated from older format] |
| Uncertainty Score | [N/A]/100 | [Not assessed - migrated from older format] |
| Context Score | [N/A]/100 | [Not assessed - migrated from older format] |
| Timestamp | 2026-01-16 | Session start |

**Initial Gaps Identified:**

- Not assessed (migrated from older format)

**Dual-Threshold Status at Start:**
- Confidence: N/A
- Uncertainty: N/A
- Readiness: N/A
<!-- /ANCHOR:preflight-session-1768562878943-pqvza91mv-003-memory-and-spec-kit/071-memory-ranking -->
---

## Table of Contents

- [Continue Session](#continue-session)
- [Project State Snapshot](#project-state-snapshot)
- [Overview](#overview)
- [Decisions](#decisions)
- [Conversation](#conversation)
- [Recovery Hints](#recovery-hints)
- [Memory Metadata](#memory-metadata)

---

<!-- ANCHOR:continue-session-session-1768562878943-pqvza91mv-003-memory-and-spec-kit/071-memory-ranking -->
<a id="continue-session"></a>

## CONTINUE SESSION

**Quick resume context for session continuation and handover.**

### Session State

| Field | Value |
|-------|-------|
| Session Status | COMPLETED |
| Completion % | 100% |
| Last Activity | 2026-01-16 |
| Time in Session | N/A |
| Continuation Count | 0 |

### Context Summary

This session was migrated from an older format to v2.2. Review the OVERVIEW and DECISIONS sections for session content.

### Pending Work

- No pending tasks - session completed

### Quick Resume

**To continue this work, use:**
```
/spec_kit:resume 003-memory-and-spec-kit/071-memory-ranking
```
<!-- /ANCHOR:continue-session-session-1768562878943-pqvza91mv-003-memory-and-spec-kit/071-memory-ranking -->
---

<a id="project-state-snapshot"></a>

## PROJECT STATE SNAPSHOT

| Field | Value |
|-------|-------|
| Phase | DOCUMENTATION COMPLETE |
| Active File | research.md |
| Last Action | Quality review complete - all documentation errors fixed |
| Next Action | Begin Phase 1 implementation (client-side ranking) |
| Blockers | None |

**Key Topics:** `memory ranking` | `folder ranking` | `composite scoring` | `recency decay` | `archive detection` | `Level 3 documentation` | 

---

<!-- ANCHOR:summary-071 -->
<!-- ANCHOR:summary-session-1768562878943-pqvza91mv-003-memory-and-spec-kit/071-memory-ranking -->
<a id="overview"></a>

## 1. OVERVIEW

Created comprehensive Level 3 documentation for memory and folder ranking improvements, then performed thorough review and enhancement. Initial documentation included spec.md, plan.md, tasks.md, checklist.md, and decision-record.md covering a 3-phase implementation approach (quick wins, MCP enhancements, advanced ranking). Review identified and fixed: incorrect decay rate math (was claiming 7-day half-life, actual is 10-day), scope section using checkboxes instead of bullets, missing task dependencies and decision references, missing D8 decision for constitutional decay exemption, and missing research.md. Final quality score improved from 85/100 to 95/100.

**Key Outcomes**:
- Created complete Level 3 spec folder documentation
- Established 3-phase implementation plan (client-side → MCP → advanced)
- Defined composite ranking formula with weights (recency 40%, importance 30%, activity 20%, validation 10%)
- Fixed documentation errors during quality review
- Added missing D8 decision for constitutional decay exemption
- Created research.md with existing code analysis

<!-- /ANCHOR:summary-071 -->
<!-- /ANCHOR:summary-session-1768562878943-pqvza91mv-003-memory-and-spec-kit/071-memory-ranking -->

---

<!-- ANCHOR:decision-ranking-071 -->
<!-- ANCHOR:decisions-session-1768562878943-pqvza91mv-003-memory-and-spec-kit/071-memory-ranking -->
<a id="decisions"></a>

<!-- DYNAMIC SECTION NUMBERING:
  This section number depends on which optional sections are present:
  - Base: 2 (after Overview)
  - +1 if HAS_IMPLEMENTATION_GUIDE (adds section 1)
  - +1 if HAS_OBSERVATIONS (adds Detailed Changes)
  - +1 if HAS_WORKFLOW_DIAGRAM (adds Workflow Visualization)
  
  Result matrix:
  | IMPL_GUIDE | OBSERVATIONS | WORKFLOW | This Section # |
  |------------|--------------|----------|----------------|
  | No         | No           | No       | 2              |
  | No         | No           | Yes      | 3              |
  | No         | Yes          | No       | 3              |
  | No         | Yes          | Yes      | 4              |
  | Yes        | No           | No       | 3              |
  | Yes        | No           | Yes      | 4              |
  | Yes        | Yes          | No       | 4              |
  | Yes        | Yes          | Yes      | 5              |
-->
## 2. DECISIONS

### D1: Composite Ranking Formula
**Decision:** Use composite ranking with weights (recency 40%, importance 30%, activity 20%, validation 10%)
**Rationale:** Single-factor ranking (count-only) produced poor results - archived/test folders appeared at top
**Status:** Approved

### D2: Path Pattern Matching for Archive Detection
**Decision:** Use path pattern matching (regex) for archive detection
**Rationale:** Works immediately without requiring schema migration
**Status:** Approved

### D3: Hybrid Client/Server Approach
**Decision:** Implement as hybrid - Phase 1 client-side, Phase 2 MCP server-side
**Rationale:** Phase 1 can deploy immediately, Phase 2 adds server-side performance optimization
**Status:** Approved

### D4: Decay Rate Configuration
**Decision:** Use decay rate 0.10 resulting in 50% weight at 10 days
**Rationale:** Balances recent work resumption with older reference discovery
**Status:** Approved

### D8: Constitutional Decay Exemption
**Decision:** Constitutional tier memories always return decay factor 1.0
**Rationale:** Rules/guardrails must always surface regardless of age
**Status:** Approved

---

<!-- /ANCHOR:decision-ranking-071 -->
<!-- /ANCHOR:decisions-session-1768562878943-pqvza91mv-003-memory-and-spec-kit/071-memory-ranking -->

<!-- ANCHOR:session-history-session-1768562878943-pqvza91mv-003-memory-and-spec-kit/071-memory-ranking -->
<a id="conversation"></a>

<!-- DYNAMIC SECTION NUMBERING:
  This section number = DECISIONS section + 1
  See DECISIONS section comment for the full matrix.
  Range: 3-6 depending on optional sections present.
-->
## 3. CONVERSATION

Complete timestamped dialogue capturing all user interactions, AI responses, tool executions, and code changes during the session.

This session followed a **Linear Sequential** conversation pattern with **2** distinct phases.

##### Conversation Phases
- **Documentation Creation** - 25 min (created all Level 3 spec files)
- **Quality Review & Fixes** - 15 min (identified and fixed documentation errors)

---

### Message Timeline

<!-- ANCHOR:files-071 -->
**Files Modified:**
- `specs/003-memory-and-spec-kit/071-memory-ranking/spec.md` - Problem statement and success criteria
- `specs/003-memory-and-spec-kit/071-memory-ranking/plan.md` - 3-phase implementation approach
- `specs/003-memory-and-spec-kit/071-memory-ranking/tasks.md` - Detailed task breakdown with dependencies
- `specs/003-memory-and-spec-kit/071-memory-ranking/checklist.md` - QA verification items
- `specs/003-memory-and-spec-kit/071-memory-ranking/decision-record.md` - ADR-style decision log
- `specs/003-memory-and-spec-kit/071-memory-ranking/research.md` - Existing code analysis
<!-- /ANCHOR:files-071 -->

**Technical Context:**
- **Root Cause:** Current `memory_stats()` ranks folders by count only, causing archived/test folders to appear at top
- **Solution:** Composite weighted scoring formula with recency, importance, activity, and validation factors
- **Pattern:** 3-phase implementation (client-side quick wins → MCP enhancements → advanced learning)

**Quality Review Fixes Applied:**
1. Corrected decay rate math (was claiming 7-day half-life, actual is 10-day based on rate 0.10)
2. Fixed scope section formatting (checkboxes → bullets)
3. Added missing task dependencies and decision references
4. Added D8 decision for constitutional decay exemption
5. Created missing research.md with existing code analysis

---

<!-- /ANCHOR:session-history-session-1768562878943-pqvza91mv-003-memory-and-spec-kit/071-memory-ranking -->

---

<!-- ANCHOR:recovery-hints-session-1768562878943-pqvza91mv-003-memory-and-spec-kit/071-memory-ranking -->
<a id="recovery-hints"></a>

## RECOVERY HINTS

**Diagnostic guidance for common session recovery scenarios.**

### Recovery Scenarios

| Scenario | Symptoms | Recovery Action |
|----------|----------|-----------------|
| Context Loss | Agent doesn't remember prior work | Run `/spec_kit:resume 003-memory-and-spec-kit/071-memory-ranking` |
| State Mismatch | Files don't match expected state | Verify with `git status` and `git diff` |
| Memory Not Found | Search returns no results | Check `memory_search({ specFolder: "003-memory-and-spec-kit/071-memory-ranking" })` |

### Recovery Priority

1. **Verify spec folder exists** - Check path is correct
2. **Load memory context** - Use memory_search to surface prior work
3. **Review last session state** - Check PROJECT STATE SNAPSHOT
4. **Validate pending tasks** - Review CONTINUE SESSION section
5. **Resume with handover prompt** - Use continuation template above
<!-- /ANCHOR:recovery-hints-session-1768562878943-pqvza91mv-003-memory-and-spec-kit/071-memory-ranking -->
---

<!-- ANCHOR:postflight-session-1768562878943-pqvza91mv-003-memory-and-spec-kit/071-memory-ranking -->
<a id="postflight-learning-delta"></a>

## POSTFLIGHT LEARNING DELTA

**Epistemic state comparison showing knowledge gained during session.**

| Metric | Before | After | Delta | Trend |
|--------|--------|-------|-------|-------|
| Knowledge | N/A | N/A | N/A | - |
| Uncertainty | N/A | N/A | N/A | - |
| Context | N/A | N/A | N/A | - |

**Learning Index:** N/A (not assessed - migrated from older format)

**Gaps Closed:**
- Not assessed (migrated from older format)

**New Gaps Discovered:**
- Not assessed (migrated from older format)

**Session Learning Summary:**
This session was migrated from an older format. Learning metrics were not captured in the original format.
<!-- /ANCHOR:postflight-session-1768562878943-pqvza91mv-003-memory-and-spec-kit/071-memory-ranking -->
---

<a id="memory-metadata"></a>

## MEMORY METADATA

<!-- ANCHOR:metadata-session-1768562878943-pqvza91mv-003-memory-and-spec-kit/071-memory-ranking -->

> **Machine-Readable Section** - This YAML block is parsed by the semantic memory indexer for search optimization and decay calculations.

```yaml
# Core Identifiers
session_id: "session-1768562878943-pqvza91mv"
spec_folder: "003-memory-and-spec-kit/071-memory-ranking"
channel: "main"

# Classification
importance_tier: "normal"  # constitutional|critical|important|normal|temporary|deprecated
context_type: "general"        # research|implementation|decision|discovery|general

# Memory Classification (v2.2)
memory_classification:
  memory_type: "episodic"         # episodic|procedural|semantic|constitutional
  half_life_days: 30              # decay half-life in days (0 = never decays)
  decay_factors:
    base_decay_rate: 0.03         # 0.0-1.0, daily decay multiplier
    access_boost_factor: 0.1      # boost per access (default 0.1)
    recency_weight: 0.5           # weight for recent accesses (default 0.5)
    importance_multiplier: 1.0    # tier-based multiplier

# Session Deduplication (v2.2)
session_dedup:
  memories_surfaced: 0
  dedup_savings_tokens: 0
  fingerprint_hash: ""
  similar_memories: []

# Causal Links (v2.2)
causal_links:
  caused_by: []
  supersedes: []
  derived_from: []
  blocks: []
  related_to: []

# Timestamps (for decay calculations)
created_at: "2026-01-16"
created_at_epoch: 1768562878
last_accessed_epoch: 1768562878
expires_at_epoch: 1776338878  # 0 for critical (never expires)

# Session Metrics
message_count: 12
decision_count: 5
tool_count: 24
file_count: 6
followup_count: 0

# Access Analytics
access_count: 1
last_search_query: ""
relevance_boost: 1  # 1.0 default, increased by access patterns

# Content Indexing
key_topics:
  - "memory ranking"
  - "folder ranking"
  - "composite scoring"
  - "recency decay"
  - "archive detection"
  - "dashboard sections"
  - "Level 3 documentation"

# Trigger Phrases (auto-extracted for fast <50ms matching)
trigger_phrases:
  - "memory ranking"
  - "folder ranking"
  - "composite scoring"
  - "recency decay"
  - "archive detection"
  - "dashboard sections"
  - "constitutional exemption"
  - "importance tier weights"
  - "half-life calculation"
  - "top folders"

key_files:
  - "specs/003-memory-and-spec-kit/071-memory-ranking/spec.md"
  - "specs/003-memory-and-spec-kit/071-memory-ranking/plan.md"
  - "specs/003-memory-and-spec-kit/071-memory-ranking/tasks.md"
  - "specs/003-memory-and-spec-kit/071-memory-ranking/checklist.md"
  - "specs/003-memory-and-spec-kit/071-memory-ranking/decision-record.md"
  - "specs/003-memory-and-spec-kit/071-memory-ranking/research.md"

# Relationships
related_sessions:

  []

parent_spec: "003-memory-and-spec-kit/071-memory-ranking"
child_sessions:

  []

# Embedding Info (populated by indexer)
embedding_model: "nomic-ai/nomic-embed-text-v1.5"
embedding_version: "1.0"
chunk_count: 1
```

<!-- /ANCHOR:metadata-session-1768562878943-pqvza91mv-003-memory-and-spec-kit/071-memory-ranking -->

---

*Generated by system-spec-kit skill v12.5.0*

