---
title: "Extended Packet 012 Spec Kit Commands With M9"
description: "Extended packet 012-spec-kit-commands with M9 Middleware Cleanup scope via in-place canonical-trio edits. M9 deprecates /spec kit:handover + /spec kit:debug commands and the..."
# Canonical classification lives in frontmatter; MEMORY METADATA mirrors these values.
trigger_phrases:
  - "m9 middleware cleanup"
  - "speckit agent deprecation"
  - "handover agent deprecation"
  - "distributed governance rule"
  - "spec folder authoring governance"
  - "handover_state content router"
  - "auto-debug flag removal"
  - "012 spec-kit-commands m9"
  - "orchestrate routing cleanup"
  - "command deprecation transfer"
  - "validate.sh strict enforcement"
  - "17 file deletion plan"
importance_tier: "important"
contextType: "planning"
_sourceTranscriptPath: ""
_sourceSessionId: ""
_sourceSessionCreated: 0
_sourceSessionUpdated: 0
captured_file_count: 5
filesystem_file_count: 5
git_changed_file_count: 5
render_quality_score: 1.00
render_quality_flags: []
spec_folder_health: {"pass":true,"score":0.9,"errors":0,"warnings":2}
---

# Extended Packet 012 Spec Kit Commands With M9

## SESSION SUMMARY

| **Meta Data** | **Value** |
|:--------------|:----------|
| Session Date | 2026-04-14 |
| Session ID | session-1776181796993-900911cc3bac |
| Spec Folder | system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands |
| Channel | main |
| Git Ref | main (`5c90767884d0`) |
| Importance Tier | important |
| Context Type | planning |
| Total Messages | 7 |
| Tool Executions | 0 |
| Decisions Made | 8 |
| Follow-up Items Recorded | 0 |
| Created At | 2026-04-14 |
| Created At (Epoch) | 1776181797 |
| Last Accessed (Epoch) | 1776181797 |
| Access Count | 1 |

---

---

## TABLE OF CONTENTS

- [CONTINUE SESSION](#continue-session)
- [CANONICAL SOURCES](#canonical-docs)
- [OVERVIEW](#overview)
- [DISTINGUISHING EVIDENCE](#evidence)
- [RECOVERY HINTS](#recovery-hints)
- [MEMORY METADATA](#memory-metadata)

---

<!-- ANCHOR:continue-session -->

## CONTINUE SESSION

**Quick resume context for session continuation and handover.**

### Session State

| Field | Value |
|-------|-------|
| Session Status | IN_PROGRESS |
| Completion % | 55% |
| Last Activity | 2026-04-14T15:49:56.277Z |
| Time in Session | 0m |
| Continuation Count | 1 |

### Context Summary

**Phase:** PLANNING

**Recent:** Decision 7: Distributed-governance rule replaces @speckit exclusivity in CLAUDE., Decision 8: Trimmed _memory., Technical Implementation Details

**Decisions:** 8 decisions recorded

### Pending Work

- [ ] **T001**: delete 17 files (2 command markdowns, 3 command YAMLs, 4 @handover runtime mirrors, 4 @speckit runti (Priority: P1)

### Quick Resume

**To continue this work, use:**
```
/spec_kit:resume system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands
```

**Or paste this continuation prompt:**
```
CONTINUATION - Attempt 2
Spec: system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands
Last: Technical Implementation Details
Next: Continue implementation
```

**Key Context to Review:**

- Files modified: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/spec.md, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/plan.md, .opencode/specs/system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/tasks.md

- Check: plan.md, tasks.md, checklist.md, plan.md, tasks.md, checklist.md

- Last: Technical Implementation Details

<!-- /ANCHOR:continue-session -->

---

<!-- ANCHOR:canonical-docs -->

## CANONICAL SOURCES

**Authoritative documentation for this packet. The memory save is a compact retrieval wrapper; full narrative context lives here:**

- **Decision Record**: [decision-record.md](../decision-record.md) — Architectural decisions and rationale

- **Implementation Summary**: [implementation-summary.md](./implementation-summary.md) — Build story, verification results, and outcomes

- **Specification**: [spec.md](./spec.md) — Feature requirements and acceptance criteria

- **Plan**: [plan.md](./plan.md) — Execution phases and verification strategy

<!-- /ANCHOR:canonical-docs -->

---

<!-- ANCHOR:overview -->

## OVERVIEW

Extended packet 012-spec-kit-commands with M9 Middleware Cleanup scope via in-place canonical-trio edits. M9 deprecates /spec_kit:handover + /spec_kit:debug commands and the @handover + @speckit agents across 4 runtime mirrors each (17 deletions total), transferring @speckit's exclusive-writer role to a distributed-governance rule (templates + validate.sh --strict + /memory:save routing). @debug agent retained across all 4 runtimes with description-only updates. All templates (handover.md, debug-delegation.md, level_N/), the system-spec-kit skill, and MCP routing code (handler/memory-save.ts, routing-prototypes.json, handover_state type) preserved unchanged. Phase 1 completed: extended spec.md (§2 purpose paragraph, §3 In-Scope bullet + 50-row M9 Files to Change table, REQ-012-017, SC-009-014, 4 new risk rows, 3 open questions), plan.md (Phase 9a-9f with 51 sub-tasks, M9 Testing Strategy, M9 Rollback, updated phase-deps diagram + effort table), tasks.md (Phase 4 anchor with T031-T051), checklist.md (CHK-044-054 with P0=10/P1=7/P2=29 summary), and implementation-summary.md (_memory.continuity refreshed with compact recent_action + next_safe_action + 3 open questions + 3 answered questions; §Next Steps M9 subsection with Phase 2-7 pending work and capability trade-offs documented). Phases 2-7 pending: 17 file deletions, responsibility transfer across root docs + skill, orchestrate/commands/YAML cleanup across 4 runtimes, skills/references/install-guides cleanup, verification sweep. Capability trade-off accepted: no command auto-generates full 7-section handover.md at session end; /memory:save still maintains session-log anchor + stop-hook autosaves continuity.

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:evidence -->

## DISTINGUISHING EVIDENCE

**Compact session-specific evidence that distinguishes this memory from the canonical static docs:**

- Extended packet 012-spec-kit-commands with M9 Middleware Cleanup scope via in-place canonical-trio...

- Technical Implementation Details

- 5 files modified

<!-- /ANCHOR:evidence -->

---

<!-- ANCHOR:recovery-hints -->

## RECOVERY HINTS

**Diagnostic guidance for common session recovery scenarios.**

### Recovery Scenarios

| Scenario | Symptoms | Recovery Action |
|----------|----------|-----------------|
| Context Loss | Agent doesn't remember prior work | Run `/spec_kit:resume system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands` |
| State Mismatch | Files don't match expected state | Verify with `git status` and `git diff` |
| Memory Not Found | Search returns no results | Check `memory_search({ specFolder: "system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands" })` |
| Stale Context | Information seems outdated | Check `last_accessed_epoch` vs current time |
| Incomplete Handover | Missing continuation context | Review CONTINUE SESSION section above |
| Dedup Collision | Wrong memory surfaced | Check `fingerprint_hash` for conflicts |

### Diagnostic Commands

```bash
# Check memory index health
node .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts --status

# List memories for this spec folder
memory_search({ specFolder: "system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands", limit: 10 })

# Verify memory file integrity
ls -la system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands/memory/

# Check for orphaned memories
memory_search({ query: "orphaned", anchors: ["state"] })

# Force re-index of this spec folder
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands --force
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

## MEMORY METADATA

> **Machine-Readable Section** - This YAML block is parsed by the semantic memory indexer for search optimization and decay calculations.

```yaml
# Core Identifiers
session_id: "session-1776181796993-900911cc3bac"
spec_folder: "system-spec-kit/026-graph-and-context-optimization/012-spec-kit-commands"
channel: "main"
title: "Extended Packet 012 Spec Kit Commands With M9"

# Git Provenance (M-007d)
head_ref: "main"
commit_ref: "5c90767884d0"
repository_state: "dirty"
is_detached_head: No

# Classification
importance_tier: "important"  # constitutional|critical|important|normal|temporary|deprecated
context_type: "planning"        # mirrors frontmatter contextType

# Memory Classification (v2.2)
memory_classification:
  memory_type: "episodic"         # episodic|procedural|semantic|constitutional
  half_life_days: 30     # decay half-life in days (0 = never decays)
  decay_factors:
    base_decay_rate: 0.9772           # 0.0-1.0, daily decay multiplier
    access_boost_factor: 0.1   # boost per access (default 0.1)
    recency_weight: 0.5             # weight for recent accesses (default 0.5)
    importance_multiplier: 1.3 # tier-based multiplier

# Session Deduplication (v2.2)
session_dedup:
  memories_surfaced: 0   # count of memories shown this session
  dedup_savings_tokens: 0   # tokens saved via deduplication
  fingerprint_hash: "258b9d30d3fca8f0ab0622c635a060428d0510b4"         # content hash for dedup detection
  similar_memories:

    []

# Causal Links (v2.2)
causal_links:
  caused_by:

    []

  supersedes:

    []

  derived_from:
    - "session-1776159692005-3c47975458b9"

  blocks:

    []

  related_to:

    []

# Timestamps (for decay calculations)
created_at: "2026-04-14"
created_at_epoch: 1776181797
last_accessed_epoch: 1776181797
expires_at_epoch: 0  # 0 for critical (never expires)

# Session Metrics
message_count: 7
decision_count: 8
tool_count: 0
file_count: 5
captured_file_count: 5
filesystem_file_count: 5
git_changed_file_count: 5
followup_count: 0

# Access Analytics
access_count: 1
last_search_query: ""
relevance_boost: 1  # 1.0 default, increased by access patterns

# Content Indexing
key_topics:
  - "distributed-governance rule"
  - "handover.md template"
  - "main agent"
  - "exclusive-writer role"
  - "middleware cleanup"
  - "handover state"
  - "compact recent"
  - "recent action"
  - "action next"
  - "safe action"
  - "§next steps"
  - "next safe"

# Trigger Phrases (mirrors the canonical frontmatter list for fast <50ms matching)
trigger_phrases:
  - "m9 middleware cleanup"
  - "speckit agent deprecation"
  - "handover agent deprecation"
  - "distributed governance rule"
  - "spec folder authoring governance"
  - "handover_state content router"
  - "auto-debug flag removal"
  - "012 spec-kit-commands m9"
  - "orchestrate routing cleanup"
  - "command deprecation transfer"
  - "validate.sh strict enforcement"
  - "17 file deletion plan"

key_files:

# Relationships
related_sessions:

  []

parent_spec: "system-spec-kit/026-graph-and-context-optimization"
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

