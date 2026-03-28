---
title: "Planned Spec Folder [021-ground-truth-id-remapping/27-03-26_19-08__planned-spec-folder-021-ground-truth-id-remapping]"
description: "Planned spec folder 021-ground-truth-id-remapping: create map-ground-truth-ids.ts script to remap stale ground truth memory IDs. Ablation study returns all-zero relevance..."
trigger_phrases:
  - "expected result description"
  - "ground truth id remapping"
  - "map ground truth ids"
  - "context index"
  - "phrase match"
  - "tree thinning"
  - "system spec kit"
  - "hybrid rag fusion"
  - "fts5 search"
  - "plan system"
  - "spec folder"
  - "search against"
  - "two-pass fts5"
  - "search phrase-match"
  - "phrase-match first"
  - "first keyword"
  - "keyword fallback"
  - "atomic write"
  - "write pattern"
  - "pattern ground-truth.json"
  - "ground-truth.json updates"
  - "level documentation"
  - "documentation complexity"
  - "script location"
  - "location mcp"
  - "kit/022"
  - "fusion/021"
  - "ground"
  - "truth"
  - "remapping"
importance_tier: "important"
contextType: "decision"
_sourceTranscriptPath: ""
_sourceSessionId: ""
_sourceSessionCreated: 0
_sourceSessionUpdated: 0
captured_file_count: 4
filesystem_file_count: 4
git_changed_file_count: 0
quality_score: 1.00
quality_flags: []
spec_folder_health: {"pass":true,"score":0.85,"errors":0,"warnings":3}
---

# Planned Spec Folder 021 Ground Truth Id Remapping

## SESSION SUMMARY

| **Meta Data** | **Value** |
|:--------------|:----------|
| Session Date | 2026-03-27 |
| Session ID | session-1774634927435-e6dc804ea41b |
| Spec Folder | 02--system-spec-kit/022-hybrid-rag-fusion/021-ground-truth-id-remapping |
| Channel | main |
| Importance Tier | important |
| Context Type | decision |
| Total Messages | 1 |
| Tool Executions | 0 |
| Decisions Made | 4 |
| Follow-up Items Recorded | 0 |
| Created At | 2026-03-27 |
| Created At (Epoch) | 1774634927 |
| Last Accessed (Epoch) | 1774634927 |
| Access Count | 1 |

---

---

## TABLE OF CONTENTS

- [CONTINUE SESSION](#continue-session)
- [PROJECT STATE SNAPSHOT](#project-state-snapshot)
- [IMPLEMENTATION GUIDE](#implementation-guide)
- [OVERVIEW](#overview)
- [DETAILED CHANGES](#detailed-changes)
- [DECISIONS](#decisions)
- [CONVERSATION](#conversation)
- [RECOVERY HINTS](#recovery-hints)
- [MEMORY METADATA](#memory-metadata)

---

<!-- ANCHOR:continue-session -->
<a id="continue-session"></a>

## CONTINUE SESSION

**Quick resume context for session continuation and handover.**

### Session State

| Field | Value |
|-------|-------|
| Session Status | IN_PROGRESS |
| Completion % | 23% |
| Last Activity | 2026-03-27T18:08:47.427Z |
| Time in Session | 0m |
| Continuation Count | 1 |

### Context Summary

**Phase:** PLANNING

**Recent:** Level 2 documentation (complexity 32/70), Script location: mcp_server/scripts/map-ground-truth-ids., Next Steps

**Decisions:** 4 decisions recorded

### Pending Work

- [ ] **T000**: Run /spec_kit:implement to create map-ground-truth-ids.ts (Priority: P0)

- [ ] **T001**: Run /spec_kit:implement to create map-ground-truth-ids (Priority: P2)

### Quick Resume

**To continue this work, use:**
```
/spec_kit:resume 02--system-spec-kit/022-hybrid-rag-fusion/021-ground-truth-id-remapping
```

**Or paste this continuation prompt:**
```
CONTINUATION - Attempt 2
Spec: 02--system-spec-kit/022-hybrid-rag-fusion/021-ground-truth-id-remapping
Last: Next Steps
Next: Run /spec_kit:implement to create map-ground-truth-ids.ts
```

**Key Context to Review:**

- Files modified: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/021-ground-truth-id-remapping/spec.md, .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/021-ground-truth-id-remapping/plan.md, .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/021-ground-truth-id-remapping/tasks.md

- Check: plan.md, tasks.md, checklist.md

- Last: Next Steps

<!-- /ANCHOR:continue-session -->

---

<!-- ANCHOR:project-state-snapshot -->
<a id="project-state-snapshot"></a>

## PROJECT STATE SNAPSHOT

| Field | Value |
|-------|-------|
| Phase | PLANNING |
| Active File | .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/021-ground-truth-id-remapping/spec.md |
| Last Action | Next Steps |
| Next Action | Run /spec_kit:implement to create map-ground-truth-ids.ts |
| Blockers | None |

### File Progress

| File | Status |
|------|--------|
| spec.md | EXISTS |
| plan.md | EXISTS |
| tasks.md | EXISTS |
| checklist.md | EXISTS |

**Related Documentation:**
- [`spec.md`](./spec.md) - Requirements specification
- [`plan.md`](./plan.md) - Implementation plan
- [`tasks.md`](./tasks.md) - Task breakdown
- [`checklist.md`](./checklist.md) - QA checklist

**Key Topics:** `fts5 search` | `mcp server/scripts/map-ground-truth-ids.ts` | `pattern ground-truth.json` | `ground-truth.json updates` | `documentation complexity` | `search phrase-match` | `level documentation` | `phrase-match first` | `script location` | `two-pass fts5` | `first keyword` | `write pattern` |

<!-- /ANCHOR:project-state-snapshot -->

---

<!-- ANCHOR:task-guide -->
<a id="implementation-guide"></a>

## 1. IMPLEMENTATION GUIDE

**What Was Built**:

- **Planned spec folder 021-ground-truth-id-remapping: create map-ground-truth-ids.ts script to remap...** - Planned spec folder 021-ground-truth-id-remapping: create map-ground-truth-ids.

**Key Files and Their Roles**:

- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/021-ground-truth-id-remapping/spec.md` - Documentation

- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/021-ground-truth-id-remapping/plan.md` - Documentation

- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/021-ground-truth-id-remapping/tasks.md` - Documentation

- `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/021-ground-truth-id-remapping/checklist.md` - Documentation

**How to Extend**:

- Reference existing implementations as patterns for new features

**Common Patterns**:

- No patterns identified

<!-- /ANCHOR:task-guide -->

---

<!-- ANCHOR:summary -->
<a id="overview"></a>

## 2. OVERVIEW

Planned spec folder 021-ground-truth-id-remapping: create map-ground-truth-ids.ts script to remap stale ground truth memory IDs. Ablation study returns all-zero relevance metrics because ground-truth.json references memory IDs (32599, 22351, 7518) from a prior DB snapshot that don't exist in the current database (296 parent memories, IDs up to ~25669). The script will: (1) read expectedResultDescription for each of 110 queries, (2) run FTS5 search against live context-index.sqlite, (3) assign graded relevance 1-3, (4) atomically write updated ground-truth.json. Estimated 200-300 LOC TypeScript. Level 2 spec folder with spec.md, plan.md, tasks.md, checklist.md all created.

**Key Outcomes**:
- Planned spec folder 021-ground-truth-id-remapping: create map-ground-truth-ids.ts script to remap...
- Two-pass FTS5 search: phrase-match first, keyword fallback
- Atomic write pattern for ground-truth.
- Level 2 documentation (complexity 32/70)
- Script location: mcp_server/scripts/map-ground-truth-ids.
- Next Steps

**Key Files:**

| **File** | **Description** |
|:---------|:----------------|
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/021-ground-truth-id-remapping/checklist.md` | Spec.md, plan | Tree-thinning merged 3 small files (spec.md, plan.md, tasks.md).  Merged from .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/021-ground-truth-id-remapping/spec.md : Updated spec | Merged from .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/021-ground-truth-id-remapping/plan.md : Spec.md, plan | Merged from .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/021-ground-truth-id-remapping/tasks.md : Spec.md, plan |

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:detailed-changes -->
<a id="detailed-changes"></a>

## 3. DETAILED CHANGES

<!-- ANCHOR:implementation-planned-spec-folder-021groundtruthidremapping-748c424a -->
### FEATURE: Planned spec folder 021-ground-truth-id-remapping: create map-ground-truth-ids.ts script to remap...

Planned spec folder 021-ground-truth-id-remapping: create map-ground-truth-ids.ts script to remap stale ground truth memory IDs. Ablation study returns all-zero relevance metrics because ground-truth.json references memory IDs (32599, 22351, 7518) from a prior DB snapshot that don't exist in the current database (296 parent memories, IDs up to ~25669). The script will: (1) read expectedResultDescription for each of 110 queries, (2) run FTS5 search against live context-index.sqlite, (3) assign...

<!-- /ANCHOR:implementation-planned-spec-folder-021groundtruthidremapping-748c424a -->

<!-- ANCHOR:implementation-next-steps-7e5b0c6b -->
### FOLLOWUP: Next Steps

Run /spec_kit:implement to create map-ground-truth-ids.ts Execute script against live DB to remap IDs Re-run ablation study to get meaningful metrics

**Details:** Next: Run /spec_kit:implement to create map-ground-truth-ids.ts | Follow-up: Execute script against live DB to remap IDs | Follow-up: Re-run ablation study to get meaningful metrics
<!-- /ANCHOR:implementation-next-steps-7e5b0c6b -->

<!-- /ANCHOR:detailed-changes -->

---

<!-- ANCHOR:decisions -->
<a id="decisions"></a>

## 4. DECISIONS

<!-- ANCHOR:decision-twopass-fts5-search-phrasematch-88fea3a7 -->
### Decision 1: Two-pass FTS5 search: phrase-match first, keyword fallback

**Context**: Two-pass FTS5 search: phrase-match first, keyword fallback

**Timestamp**: 2026-03-27T18:08:47.461Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Two-pass FTS5 search: phrase-match first, keyword fallback

#### Chosen Approach

**Selected**: Two-pass FTS5 search: phrase-match first, keyword fallback

**Rationale**: Two-pass FTS5 search: phrase-match first, keyword fallback

#### Trade-offs

**Confidence**: 70%

<!-- /ANCHOR:decision-twopass-fts5-search-phrasematch-88fea3a7 -->

---

<!-- ANCHOR:decision-atomic-write-pattern-groundtruthjson-e7f22222 -->
### Decision 2: Atomic write pattern for ground-truth.json updates

**Context**: Atomic write pattern for ground-truth.json updates

**Timestamp**: 2026-03-27T18:08:47.461Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Atomic write pattern for ground-truth.json updates

#### Chosen Approach

**Selected**: Atomic write pattern for ground-truth.json updates

**Rationale**: Atomic write pattern for ground-truth.json updates

#### Trade-offs

**Confidence**: 70%

<!-- /ANCHOR:decision-atomic-write-pattern-groundtruthjson-e7f22222 -->

---

<!-- ANCHOR:decision-level-documentation-complexity-3270-7c12c90b -->
### Decision 3: Level 2 documentation (complexity 32/70)

**Context**: Level 2 documentation (complexity 32/70)

**Timestamp**: 2026-03-27T18:08:47.461Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Level 2 documentation (complexity 32/70)

#### Chosen Approach

**Selected**: Level 2 documentation (complexity 32/70)

**Rationale**: Level 2 documentation (complexity 32/70)

#### Trade-offs

**Confidence**: 70%

<!-- /ANCHOR:decision-level-documentation-complexity-3270-7c12c90b -->

---

<!-- ANCHOR:decision-script-location-mcpserverscriptsmapgroundtruthidsts-3493e0f2 -->
### Decision 4: Script location: mcp_server/scripts/map-ground-truth-ids.ts

**Context**: Script location: mcp_server/scripts/map-ground-truth-ids.ts

**Timestamp**: 2026-03-27T18:08:47.461Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Script location: mcp_server/scripts/map-ground-truth-ids.ts

#### Chosen Approach

**Selected**: Script location: mcp_server/scripts/map-ground-truth-ids.ts

**Rationale**: Script location: mcp_server/scripts/map-ground-truth-ids.ts

#### Trade-offs

**Confidence**: 70%

<!-- /ANCHOR:decision-script-location-mcpserverscriptsmapgroundtruthidsts-3493e0f2 -->

---

<!-- /ANCHOR:decisions -->

<!-- ANCHOR:session-history -->
<a id="conversation"></a>

## 5. CONVERSATION

Complete timestamped dialogue capturing all user interactions, AI responses, tool executions, and code changes during the session.

This session followed a **Linear Sequential** conversation pattern with **1** phase segments across **1** unique phases.

##### Conversation Phases
- **Verification** - 2 actions
- **Implementation** - 2 actions
- **Discussion** - 2 actions

---

### Message Timeline

> **User** | 2026-03-27 @ 19:08:47

Planned spec folder 021-ground-truth-id-remapping: create map-ground-truth-ids.ts script to remap stale ground truth memory IDs. Ablation study returns all-zero relevance metrics because ground-truth.json references memory IDs (32599, 22351, 7518) from a prior DB snapshot that don't exist in the current database (296 parent memories, IDs up to ~25669). The script will: (1) read expectedResultDescription for each of 110 queries, (2) run FTS5 search against live context-index.sqlite, (3) assign graded relevance 1-3, (4) atomically write updated ground-truth.json. Estimated 200-300 LOC TypeScript. Level 2 spec folder with spec.md, plan.md, tasks.md, checklist.md all created.

---

<!-- /ANCHOR:session-history -->

---

<!-- ANCHOR:recovery-hints -->
<a id="recovery-hints"></a>

## RECOVERY HINTS

**Diagnostic guidance for common session recovery scenarios.**

### Recovery Scenarios

| Scenario | Symptoms | Recovery Action |
|----------|----------|-----------------|
| Context Loss | Agent doesn't remember prior work | Run `/spec_kit:resume 02--system-spec-kit/022-hybrid-rag-fusion/021-ground-truth-id-remapping` |
| State Mismatch | Files don't match expected state | Verify with `git status` and `git diff` |
| Memory Not Found | Search returns no results | Check `memory_search({ specFolder: "02--system-spec-kit/022-hybrid-rag-fusion/021-ground-truth-id-remapping" })` |
| Stale Context | Information seems outdated | Check `last_accessed_epoch` vs current time |
| Incomplete Handover | Missing continuation context | Review CONTINUE SESSION section above |
| Dedup Collision | Wrong memory surfaced | Check `fingerprint_hash` for conflicts |

### Diagnostic Commands

```bash
# Check memory index health
node .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts --status

# List memories for this spec folder
memory_search({ specFolder: "02--system-spec-kit/022-hybrid-rag-fusion/021-ground-truth-id-remapping", limit: 10 })

# Verify memory file integrity
ls -la 02--system-spec-kit/022-hybrid-rag-fusion/021-ground-truth-id-remapping/memory/

# Check for orphaned memories
memory_search({ query: "orphaned", anchors: ["state"] })

# Force re-index of this spec folder
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js 02--system-spec-kit/022-hybrid-rag-fusion/021-ground-truth-id-remapping --force
```

### Recovery Priority

1. **Verify spec folder exists** - Check path is correct
2. **Load memory context** - Use memory_search to surface prior work
3. **Review last session state** - Check PROJECT STATE SNAPSHOT
4. **Validate pending tasks** - Review CONTINUE SESSION section
5. **Resume with handover prompt** - Use continuation template above

<!-- /ANCHOR:recovery-hints -->

---

---

<!-- ANCHOR:metadata -->
<a id="memory-metadata"></a>

## MEMORY METADATA

> **Machine-Readable Section** - This YAML block is parsed by the semantic memory indexer for search optimization and decay calculations.

```yaml
# Core Identifiers
session_id: "session-1774634927435-e6dc804ea41b"
spec_folder: "02--system-spec-kit/022-hybrid-rag-fusion/021-ground-truth-id-remapping"
channel: "main"

# Git Provenance (M-007d)
head_ref: ""
commit_ref: ""
repository_state: "unavailable"
is_detached_head: No

# Classification
importance_tier: "important"  # constitutional|critical|important|normal|temporary|deprecated
context_type: "decision"        # research|implementation|decision|discovery|general

# Memory Classification (v2.2)
memory_classification:
  memory_type: "semantic"         # episodic|procedural|semantic|constitutional
  half_life_days: 365     # decay half-life in days (0 = never decays)
  decay_factors:
    base_decay_rate: 0.9981           # 0.0-1.0, daily decay multiplier
    access_boost_factor: 0.1   # boost per access (default 0.1)
    recency_weight: 0.5             # weight for recent accesses (default 0.5)
    importance_multiplier: 1.3 # tier-based multiplier

# Session Deduplication (v2.2)
session_dedup:
  memories_surfaced: 0   # count of memories shown this session
  dedup_savings_tokens: 0   # tokens saved via deduplication
  fingerprint_hash: "7026ed666fd31b41adcd7153f8dca8f1211f20de"         # content hash for dedup detection
  similar_memories:

    []

# Causal Links (v2.2)
causal_links:
  caused_by:

    []

  supersedes:

    []

  derived_from:

    []

  blocks:

    []

  related_to:

    []

# Timestamps (for decay calculations)
created_at: "2026-03-27"
created_at_epoch: 1774634927
last_accessed_epoch: 1774634927
expires_at_epoch: 0  # 0 for critical (never expires)

# Session Metrics
message_count: 1
decision_count: 4
tool_count: 0
file_count: 4
captured_file_count: 4
filesystem_file_count: 4
git_changed_file_count: 0
followup_count: 0

# Access Analytics
access_count: 1
last_search_query: ""
relevance_boost: 1  # 1.0 default, increased by access patterns

# Content Indexing
key_topics:
  - "fts5 search"
  - "mcp server/scripts/map-ground-truth-ids.ts"
  - "pattern ground-truth.json"
  - "ground-truth.json updates"
  - "documentation complexity"
  - "search phrase-match"
  - "level documentation"
  - "phrase-match first"
  - "script location"
  - "two-pass fts5"
  - "first keyword"
  - "write pattern"

# Trigger Phrases (auto-extracted for fast <50ms matching)
trigger_phrases:
  - "expected result description"
  - "ground truth id remapping"
  - "map ground truth ids"
  - "context index"
  - "phrase match"
  - "tree thinning"
  - "system spec kit"
  - "hybrid rag fusion"
  - "fts5 search"
  - "plan system"
  - "spec folder"
  - "search against"
  - "two-pass fts5"
  - "search phrase-match"
  - "phrase-match first"
  - "first keyword"
  - "keyword fallback"
  - "atomic write"
  - "write pattern"
  - "pattern ground-truth.json"
  - "ground-truth.json updates"
  - "level documentation"
  - "documentation complexity"
  - "script location"
  - "location mcp"
  - "kit/022"
  - "fusion/021"
  - "ground"
  - "truth"
  - "remapping"

key_files:
  - ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/021-ground-truth-id-remapping/spec.md"
  - ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/021-ground-truth-id-remapping/plan.md"
  - ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/021-ground-truth-id-remapping/tasks.md"
  - ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/021-ground-truth-id-remapping/checklist.md"

# Relationships
related_sessions:

  []

parent_spec: "02--system-spec-kit/022-hybrid-rag-fusion/021-ground-truth-id-remapping"
child_sessions:

  []

# Embedding Info (populated by indexer)
embedding_model: "voyage-4"
embedding_version: "1.0"
chunk_count: 1
```

<!-- /ANCHOR:metadata -->

---

*Generated by system-spec-kit skill v1.7.2*

