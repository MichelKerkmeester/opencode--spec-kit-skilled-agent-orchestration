---
title: "Phase 7 complete — skill rename to sk-improve-agent and sk-improve-prompt"
description: "Renamed two OpenCode skills to align with the /improve: command namespace. sk-agent-improver →...; git mv before sed — preserves rename detection and lets one sed pass cover..."
# Canonical classification lives in frontmatter; MEMORY METADATA mirrors these values.
trigger_phrases:
  - "sk-improve-agent"
  - "sk-improve-prompt"
  - "sk-agent-improver"
  - "sk-prompt-improver"
  - "skill rename"
  - "improve agent skill"
  - "improve prompt skill"
  - "phase 7 rename"
  - "042 phase 7"
importance_tier: "normal"
contextType: "implementation"
_sourceTranscriptPath: ""
_sourceSessionId: ""
_sourceSessionCreated: 0
_sourceSessionUpdated: 0
captured_file_count: 21
filesystem_file_count: 21
git_changed_file_count: 21
render_quality_score: 1.00
render_quality_flags: []
spec_folder_health: {"pass":true,"score":0.75,"errors":0,"warnings":5}
---

# Phase 7 complete — skill rename to sk-improve-agent and sk-improve-prompt

## SESSION SUMMARY

| **Meta Data** | **Value** |
|:--------------|:----------|
| Session Date | 2026-04-11 |
| Session ID | session-1775888884165-0dd477af82d0 |
| Spec Folder | skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/007-skill-rename-improve-agent-prompt |
| Channel | system-speckit/026-graph-and-context-optimization |
| Git Ref | system-speckit/026-graph-and-context-optimization (`1d93227cdaf2`) |
| Importance Tier | normal |
| Context Type | implementation |
| Total Messages | 1 |
| Tool Executions | 0 |
| Decisions Made | 6 |
| Follow-up Items Recorded | 0 |
| Created At | 2026-04-11 |
| Created At (Epoch) | 1775888884 |
| Last Accessed (Epoch) | 1775888884 |
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
| Completion % | 25% |
| Last Activity | 2026-04-11T06:28:03.302Z |
| Time in Session | 0m |
| Continuation Count | 1 |

### Context Summary

**Phase:** IMPLEMENTATION

**Recent:** Use while-read instead of xargs for sed pipeline — safe for paths with spaces like SET-UP - AGENTS., Rename changelog folders 14-- and 15-- to match — they mirror skill names and would otherwise be orphaned, Next Steps

**Decisions:** 6 decisions recorded

### Pending Work

- [ ] **T000**: Optional manual smoke test: invoke /improve:agent and /improve:prompt commands to confirm end-to-end resolution (Priority: P0)

### Quick Resume

**To continue this work, use:**
```
/spec_kit:resume skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/007-skill-rename-improve-agent-prompt
```

**Or paste this continuation prompt:**
```
CONTINUATION - Attempt 2
Spec: skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/007-skill-rename-improve-agent-prompt
Last: Next Steps
Next: Optional manual smoke test: invoke /improve:agent and /improve:prompt commands to confirm end-to-end resolution
```

**Key Context to Review:**

- Files modified: .opencode/skill/sk-improve-agent/ (renamed from sk-agent-improver, all contents moved), .opencode/skill/sk-improve-prompt/ (renamed from sk-prompt-improver, all contents moved), .opencode/changelog/14--sk-improve-prompt/ (renamed)

- Check: plan.md, tasks.md, checklist.md, plan.md, tasks.md, checklist.md

- Last: Optional manual smoke test: invoke /improve:agent and /improve:prompt commands…

### Pending Work

- [ ] **T001**: Optional manual smoke test: invoke /improve:agent and /improve:prompt commands to confirm end-to-end (Priority: P2)

### Quick Resume

**To continue this work, use:**
```
/spec_kit:resume skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/007-skill-rename-improve-agent-prompt
```

**Or paste this continuation prompt:**
```
CONTINUATION - Attempt 2
Spec: skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/007-skill-rename-improve-agent-prompt
Last: Next Steps
Next: Optional manual smoke test: invoke /improve:agent and /improve:prompt commands to confirm end-to-end resolution
```

**Key Context to Review:**

- Files modified: .opencode/skill/sk-improve-agent/ (renamed from sk-agent-improver, all contents moved), .opencode/skill/sk-improve-prompt/ (renamed from sk-prompt-improver, all contents moved), .opencode/changelog/14--sk-improve-prompt/ (renamed)

- Check: plan.md, tasks.md, checklist.md, plan.md, tasks.md, checklist.md

- Last: Optional manual smoke test: invoke /improve:agent and /improve:prompt commands…

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

Renamed two OpenCode skills to align with the /improve:* command namespace. sk-agent-improver →...; git mv before sed — preserves rename detection and lets one sed pass cover both moved files and external references; Exclude phase-007 folder from sed — its own documentation of the transformation must stay intact

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:evidence -->

## DISTINGUISHING EVIDENCE

**Compact session-specific evidence that distinguishes this memory from the canonical static docs:**

- Renamed two OpenCode skills to align with the /improve:* command namespace. sk-agent-improver →...

- Next Steps

- Next: Optional manual smoke test: invoke /improve:agent and /improve:prompt commands to confirm end-to-end resolution

- 10 files modified

<!-- /ANCHOR:evidence -->

---

<!-- ANCHOR:recovery-hints -->

## RECOVERY HINTS

**Diagnostic guidance for common session recovery scenarios.**

### Recovery Scenarios

| Scenario | Symptoms | Recovery Action |
|----------|----------|-----------------|
| Context Loss | Agent doesn't remember prior work | Run `/spec_kit:resume skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/007-skill-rename-improve-agent-prompt` |
| State Mismatch | Files don't match expected state | Verify with `git status` and `git diff` |
| Memory Not Found | Search returns no results | Check `memory_search({ specFolder: "skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/007-skill-rename-improve-agent-prompt" })` |
| Stale Context | Information seems outdated | Check `last_accessed_epoch` vs current time |
| Incomplete Handover | Missing continuation context | Review CONTINUE SESSION section above |
| Dedup Collision | Wrong memory surfaced | Check `fingerprint_hash` for conflicts |

### Diagnostic Commands

```bash
# Check memory index health
node .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts --status

# List memories for this spec folder
memory_search({ specFolder: "skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/007-skill-rename-improve-agent-prompt", limit: 10 })

# Verify memory file integrity
ls -la skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/007-skill-rename-improve-agent-prompt/memory/

# Check for orphaned memories
memory_search({ query: "orphaned", anchors: ["state"] })

# Force re-index of this spec folder
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/007-skill-rename-improve-agent-prompt --force
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
session_id: "session-1775888884165-0dd477af82d0"
spec_folder: "skilled-agent-orchestration/042-sk-deep-research-review-improvement-2/007-skill-rename-improve-agent-prompt"
channel: "system-speckit/026-graph-and-context-optimization"
title: "Phase 7 complete — skill rename to sk-improve-agent and sk-improve-prompt"

# Git Provenance (M-007d)
head_ref: "system-speckit/026-graph-and-context-optimization"
commit_ref: "1d93227cdaf2"
repository_state: "dirty"
is_detached_head: No

# Classification
importance_tier: "normal"  # constitutional|critical|important|normal|temporary|deprecated
context_type: "implementation"        # mirrors frontmatter contextType

# Memory Classification (v2.2)
memory_classification:
  memory_type: "procedural"         # episodic|procedural|semantic|constitutional
  half_life_days: 180     # decay half-life in days (0 = never decays)
  decay_factors:
    base_decay_rate: 0.9962           # 0.0-1.0, daily decay multiplier
    access_boost_factor: 0.1   # boost per access (default 0.1)
    recency_weight: 0.5             # weight for recent accesses (default 0.5)
    importance_multiplier: 1 # tier-based multiplier

# Session Deduplication (v2.2)
session_dedup:
  memories_surfaced: 0   # count of memories shown this session
  dedup_savings_tokens: 0   # tokens saved via deduplication
  fingerprint_hash: "f6687fbd295adc453f3fda0641d62551717e4ab6"         # content hash for dedup detection
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
created_at: "2026-04-11"
created_at_epoch: 1775888884
last_accessed_epoch: 1775888884
expires_at_epoch: 1783664884  # 0 for critical (never expires)

# Session Metrics
message_count: 1
decision_count: 6
tool_count: 0
file_count: 21
captured_file_count: 21
filesystem_file_count: 21
git_changed_file_count: 21
followup_count: 0

# Access Analytics
access_count: 1
last_search_query: ""
relevance_boost: 1  # 1.0 default, increased by access patterns

# Content Indexing
key_topics:
  - "exclude phase-007"
  - "names agent-improver.md"
  - "agent-improver.md .toml"
  - "external references"
  - "references exclude"
  - "while-read instead"
  - "changelog folders"
  - "preserves rename"
  - "rename detection"
  - "rename changelog"
  - "keep historical"
  - "historical spec"

# Trigger Phrases (mirrors the canonical frontmatter list for fast <50ms matching)
trigger_phrases:
  - "sk-improve-agent"
  - "sk-improve-prompt"
  - "sk-agent-improver"
  - "sk-prompt-improver"
  - "skill rename"
  - "improve agent skill"
  - "improve prompt skill"
  - "phase 7 rename"
  - "042 phase 7"

key_files:

# Relationships
related_sessions:

  []

parent_spec: "skilled-agent-orchestration/042-sk-deep-research-review-improvement-2"
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

