---
title: "Epistemic state captured at session start for learning delta [030-gate3-enforcement/constitutional-gate-rules]"
importance_tier: "normal"
contextType: "general"
---
<!-- TEMPLATE: context_template.md v2.2 - DO NOT EDIT GENERATED FILES -->
<!-- Migrated from legacy format by migrate-memory-v22.mjs -->

---

# SESSION SUMMARY

| **Meta Data** | **Value** |
|:--------------|:----------|
| Session Date | unknown |
| Session ID | session-legacy-1770632216920-e5zajj |
| Spec Folder | ** A) Existing | B) New | C) Update related | D) Skip |
| Channel | main |
| Importance Tier | normal |
| Context Type | general |
| Total Messages | 0 |
| Tool Executions | 0 |
| Decisions Made | 0 |
| Follow-up Items Recorded | 0 |
| Created At | unknown |
| Created At (Epoch) | 1770632216 |
| Last Accessed (Epoch) | 1770632216 |
| Access Count | 1 |

---

<!-- ANCHOR:preflight-session-legacy-1770632216920-e5zajj-** A) Existing | B) New | C) Update related | D) Skip -->
## PREFLIGHT BASELINE

**Epistemic state captured at session start for learning delta calculation.**

| Metric | Value | Assessment |
|--------|-------|------------|
| Knowledge Score | [N/A]/100 | [Not assessed - migrated from older format] |
| Uncertainty Score | [N/A]/100 | [Not assessed - migrated from older format] |
| Context Score | [N/A]/100 | [Not assessed - migrated from older format] |
| Timestamp | unknown | Session start |

**Initial Gaps Identified:**

- Not assessed (migrated from older format)

**Dual-Threshold Status at Start:**
- Confidence: N/A
- Uncertainty: N/A
- Readiness: N/A
<!-- /ANCHOR:preflight-session-legacy-1770632216920-e5zajj-** A) Existing | B) New | C) Update related | D) Skip -->

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

<!-- ANCHOR:continue-session-session-legacy-1770632216920-e5zajj-** A) Existing | B) New | C) Update related | D) Skip -->
<a id="continue-session"></a>

## CONTINUE SESSION

**Quick resume context for session continuation and handover.**

### Session State

| Field | Value |
|-------|-------|
| Session Status | COMPLETED |
| Completion % | 100% |
| Last Activity | unknown |
| Time in Session | N/A |
| Continuation Count | 0 |

### Context Summary

This session was migrated from an older format to v2.2. Review the OVERVIEW and DECISIONS sections for session content.

### Pending Work

- No pending tasks - session completed

### Quick Resume

**To continue this work, use:**
```
/spec_kit:resume ** A) Existing | B) New | C) Update related | D) Skip
```
<!-- /ANCHOR:continue-session-session-legacy-1770632216920-e5zajj-** A) Existing | B) New | C) Update related | D) Skip -->

---

<a id="project-state-snapshot"></a>

## PROJECT STATE SNAPSHOT

| Field | Value |
|-------|-------|
| Phase | COMPLETED |
| Active File | N/A |
| Last Action | Legacy content migrated to v2.2 |
| Next Action | N/A |
| Blockers | None |

---

<!-- ANCHOR:summary-session-legacy-1770632216920-e5zajj-** A) Existing | B) New | C) Update related | D) Skip -->
<a id="overview"></a>

## 1. OVERVIEW

CONSTITUTIONAL RULES - ALWAYS ENFORCE

**Original Content (preserved from legacy format):**

---
importanceTier: deprecated
deprecatedBy: ".opencode/skill/system-memory/constitutional/gate-enforcement.md"
deprecationDate: "2025-12-25"
---

> **DEPRECATED**: This file has been superseded by the canonical version at:
> `.opencode/skill/system-memory/constitutional/gate-enforcement.md`
> 
> This file is kept for reference only. Do not use for gate enforcement.

---

<!-- TEMPLATE: constitutional_memory.md v1.0 - STATIC RULE DOCUMENT -->
---
title: "GATE 3 & GATE 5 - HARD BLOCK ENFORCEMENT"
importance_tier: constitutional
context_type: decision
trigger_phrases:
  - fix
  - implement
  - create
  - modify
  - update
  - change
  - edit
  - refactor
  - write
  - add
  - remove
  - delete
  - rename
  - move
  - spec folder
  - gate 3
  - gate 5
  - save context
  - save memory
  - memory save
  - preserve context
  - comprehensive
  - all bugs
  - fix all
  - everything
---

<!-- ANCHOR:constitutional-gate-enforcement -->

# CONSTITUTIONAL RULES - ALWAYS ENFORCE

These rules are HARD BLOCKS. No exceptions. No "I'll do it after."

---

## GATE 3: SPEC FOLDER BEFORE FILE MODIFICATIONS

**TRIGGER:** Any intent to create, edit, delete, fix, implement, update, rename, or move files.

### REQUIRED ACTION

STOP and ASK before using Read/Edit/Write/Bash:

> **Spec Folder:** A) Existing | B) New | C) Update related | D) Skip

WAIT for user's answer. THEN proceed.

### VIOLATION = HARD BLOCK

- DO NOT analyze code first
- DO NOT "just check" files first  
- DO NOT start on "exciting" tasks without asking
- ASK FIRST, always

---

## GATE 5: USE SCRIPT FOR MEMORY SAVES

**TRIGGER:** "save context", "save memory", `/memory:save`, or any memory file creation.

### REQUIRED ACTION

ONLY use this command to save context:

```bash
node .opencode/skill/system-memory/scripts/generate-context.js [spec-folder-path]
```

Or with JSON input for rich context:
```bash
node .opencode/skill/system-memory/scripts/generate-context.js /tmp/save-context-data.json
```

### VIOLATION = HARD BLOCK

- NEVER manually create memory files with Write/Edit tools
- NEVER write to `memory/*.md` paths directly
- If violation detected: DELETE the file and re-run via script
- Script ensures: proper anchors, format, embeddings, indexing

---

## WHY THESE MATTER

| Gate | Skip Consequence |
|------|------------------|
| Gate 3 | Lost documentation, scope creep, no spec folder |
| Gate 5 | Missing anchors, broken search, malformed files |

**Self-Check Before Every Tool Call:**
1. File modification planned? Did I ask spec folder question?
2. Saving context? Am I using the script (not Write tool)?

<!-- /ANCHOR:constitutional-gate-enforcement -->

---

*Constitutional Memory - Always surfaces at top of search results*


<!-- /ANCHOR:summary-session-legacy-1770632216920-e5zajj-** A) Existing | B) New | C) Update related | D) Skip -->

---

<!-- ANCHOR:decisions-session-legacy-1770632216920-e5zajj-** A) Existing | B) New | C) Update related | D) Skip -->
<a id="decisions"></a>

## 2. DECISIONS

This session did not involve significant architectural or technical decisions. The work was primarily implementation, bug fixes, documentation, or research.

---

<!-- /ANCHOR:decisions-session-legacy-1770632216920-e5zajj-** A) Existing | B) New | C) Update related | D) Skip -->

<!-- ANCHOR:session-history-session-legacy-1770632216920-e5zajj-** A) Existing | B) New | C) Update related | D) Skip -->
<a id="conversation"></a>

## 3. CONVERSATION

Complete timestamped dialogue capturing all user interactions, AI responses, tool executions, and code changes during the session.

This session followed a **Legacy Import** conversation pattern with **0** distinct phases.

##### Conversation Phases
- Single continuous phase (legacy import)

---

### Message Timeline

No conversation messages were captured. This is a legacy memory file migrated to v2.2 format.

---

<!-- /ANCHOR:session-history-session-legacy-1770632216920-e5zajj-** A) Existing | B) New | C) Update related | D) Skip -->

---

<!-- ANCHOR:recovery-hints-session-legacy-1770632216920-e5zajj-** A) Existing | B) New | C) Update related | D) Skip -->
<a id="recovery-hints"></a>

## RECOVERY HINTS

**Diagnostic guidance for common session recovery scenarios.**

### Recovery Scenarios

| Scenario | Symptoms | Recovery Action |
|----------|----------|-----------------|
| Context Loss | Agent doesn't remember prior work | Run `/spec_kit:resume ** A) Existing | B) New | C) Update related | D) Skip` |
| State Mismatch | Files don't match expected state | Verify with `git status` and `git diff` |
| Memory Not Found | Search returns no results | Check `memory_search({ specFolder: "** A) Existing | B) New | C) Update related | D) Skip" })` |

### Recovery Priority

1. **Verify spec folder exists** - Check path is correct
2. **Load memory context** - Use memory_search to surface prior work
3. **Review last session state** - Check PROJECT STATE SNAPSHOT
4. **Validate pending tasks** - Review CONTINUE SESSION section
5. **Resume with handover prompt** - Use continuation template above
<!-- /ANCHOR:recovery-hints-session-legacy-1770632216920-e5zajj-** A) Existing | B) New | C) Update related | D) Skip -->

---

<!-- ANCHOR:postflight-session-legacy-1770632216920-e5zajj-** A) Existing | B) New | C) Update related | D) Skip -->
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
<!-- /ANCHOR:postflight-session-legacy-1770632216920-e5zajj-** A) Existing | B) New | C) Update related | D) Skip -->

---

<a id="memory-metadata"></a>

## MEMORY METADATA

<!-- ANCHOR:metadata-session-legacy-1770632216920-e5zajj-** A) Existing | B) New | C) Update related | D) Skip -->

> **Machine-Readable Section** - This YAML block is parsed by the semantic memory indexer for search optimization and decay calculations.

```yaml
# Core Identifiers
session_id: "session-legacy-1770632216920-e5zajj"
spec_folder: "** A) Existing | B) New | C) Update related | D) Skip"
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
created_at: "unknown"
created_at_epoch: 1770632216
last_accessed_epoch: 1770632216
expires_at_epoch: 1773224216  # 0 for critical (never expires)

# Session Metrics
message_count: 0
decision_count: 0
tool_count: 0
file_count: 0
followup_count: 0

# Access Analytics
access_count: 1
last_search_query: ""
relevance_boost: 1  # 1.0 default, increased by access patterns

# Content Indexing
key_topics: []

# Trigger Phrases (auto-extracted for fast <50ms matching)
trigger_phrases:
  []

key_files: []

# Relationships
related_sessions: []
parent_spec: "** A) Existing | B) New | C) Update related | D) Skip"
child_sessions: []

# Embedding Info (populated by indexer)
embedding_model: "nomic-ai/nomic-embed-text-v1.5"
embedding_version: "1.0"
chunk_count: 1
```

<!-- /ANCHOR:metadata-session-legacy-1770632216920-e5zajj-** A) Existing | B) New | C) Update related | D) Skip -->

---

*Generated by system-spec-kit skill (migrated from legacy format)*

<!--
  SESSION CONTEXT DOCUMENTATION v2.2
  Migrated from legacy format by migrate-memory-v22.mjs
-->
