---
title: "Shipped The 014 Code Graph Upgrades Runtime Lane"
description: "Shipped the 014 code graph upgrades runtime lane across detector provenance, blast-radius correctness, hot-file breadcrumbs, edge evidence, and a frozen regression floor. The..."
# Canonical classification lives in frontmatter; MEMORY METADATA mirrors these values.
trigger_phrases:
  - "detector provenance taxonomy"
  - "blast-radius depth cap fix"
  - "edge evidence numeric confidence additive"
  - "hot-file breadcrumb advisory"
importance_tier: "normal"
contextType: "implementation"
_sourceTranscriptPath: ""
_sourceSessionId: ""
_sourceSessionCreated: 0
_sourceSessionUpdated: 0
captured_file_count: 5
filesystem_file_count: 5
git_changed_file_count: 5
render_quality_score: 1.00
render_quality_flags: []
spec_folder_health: {"pass":true,"score":0.95,"errors":0,"warnings":1}
---
> **Note:** This session had limited actionable content (quality score: 0/100). 0 noise entries and 0 duplicates were filtered.


# Shipped The 014 Code Graph Upgrades Runtime Lane

## SESSION SUMMARY

| **Meta Data** | **Value** |
|:--------------|:----------|
| Session Date | 2026-04-09 |
| Session ID | session-1775734809280-aeb14157e832 |
| Spec Folder | system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades |
| Channel | system-speckit/026-graph-and-context-optimization |
| Git Ref | system-speckit/026-graph-and-context-optimization (`706c4e2516d3`) |
| Importance Tier | normal |
| Context Type | implementation |
| Total Messages | 11 |
| Tool Executions | 0 |
| Decisions Made | 4 |
| Follow-up Items Recorded | 0 |
| Created At | 2026-04-09 |
| Created At (Epoch) | 1775734809 |
| Last Accessed (Epoch) | 1775734809 |
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
| Completion % | 95% |
| Last Activity | 2026-04-09T11:40:09.309Z |
| Time in Session | N/A |
| Continuation Count | 1 |

### Context Summary

**Phase:** IMPLEMENTATION

**Recent:** Blast-radius traversal cut at BFS expansion not as a post-filter; unionMode caller flag is explicit and defaults to single [SOURCE:., hotFileBreadcrumb uses the wording changeCarefullyReason only; never a trust axis or authority score [SOURCE:., edgeEvidenceClass plus numericConfidence validated at 0 to 1 and attached additively next to StructuralTrust without replacing it [SOURCE:.

**Decisions:** 4 decisions recorded

### Pending Work

- [ ] **T001**: Monitor downstream consumers of the new code graph payload fields for additive-only adoption (Priority: P2)

### Quick Resume

**To continue this work, use:**
```
/spec_kit:resume system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades
```

**Or paste this continuation prompt:**
```
CONTINUATION - Attempt 2
Spec: system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades
Last: edgeEvidenceClass plus numericConfidence validated at 0 to 1 and attached additively next to StructuralTrust without replacing it [SOURCE:.
Next: Monitor downstream consumers of the new code graph payload fields for additive-only adoption
```

**Key Context to Review:**

- Files modified: .opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts, .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts, .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/scan.ts

- Check: plan.md, tasks.md, checklist.md

- Last: edgeEvidenceClass plus numericConfidence validated at 0 to 1 and attached…

<!-- /ANCHOR:continue-session -->

---

<!-- ANCHOR:canonical-docs -->

## CANONICAL SOURCES

**Authoritative documentation for this packet. The memory save is a compact retrieval wrapper; full narrative context lives here:**

- **Review Report**: [review-report.md](../review/review-report.md) — Review findings and quality assessment

- **Decision Record**: [decision-record.md](./decision-record.md) — Architectural decisions and rationale

- **Implementation Summary**: [implementation-summary.md](./implementation-summary.md) — Build story, verification results, and outcomes

- **Specification**: [spec.md](./spec.md) — Feature requirements and acceptance criteria

- **Plan**: [plan.md](./plan.md) — Execution phases and verification strategy

<!-- /ANCHOR:canonical-docs -->

---

<!-- ANCHOR:overview -->

## OVERVIEW

Shipped the 014 code graph upgrades runtime lane across detector provenance, blast-radius correctness, hot-file breadcrumbs, edge evidence, and a frozen regression floor. The runtime adds a DetectorProvenance taxonomy to shared-payload, enforces blast-radius depth-cap at BFS traversal time with explicit multi-file unionMode, emits advisory hotFileBreadcrumb entries with low-authority wording, carries edgeEvidenceClass and numericConfidence additively on existing owner payloads without replacing…

<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:evidence -->

## DISTINGUISHING EVIDENCE

**Compact session-specific evidence that distinguishes this memory from the canonical static docs:**

- DetectorProvenance added as a superset of ParserProvenance with ast, structured, regex, heuristic values; does not collapse the existing StructuralTrust axes [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:38]

- Blast-radius traversal cut at BFS expansion not as a post-filter; unionMode caller flag is explicit and defaults to single [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:239]

- hotFileBreadcrumb uses the wording changeCarefullyReason only; never a trust axis or authority score [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:207]

- edgeEvidenceClass plus numericConfidence validated at 0 to 1 and attached additively next to StructuralTrust without replacing it [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts:128]

<!-- /ANCHOR:evidence -->

---

<!-- ANCHOR:recovery-hints -->

## RECOVERY HINTS

**Diagnostic guidance for common session recovery scenarios.**

### Recovery Scenarios

| Scenario | Symptoms | Recovery Action |
|----------|----------|-----------------|
| Context Loss | Agent doesn't remember prior work | Run `/spec_kit:resume system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades` |
| State Mismatch | Files don't match expected state | Verify with `git status` and `git diff` |
| Memory Not Found | Search returns no results | Check `memory_search({ specFolder: "system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades" })` |
| Stale Context | Information seems outdated | Check `last_accessed_epoch` vs current time |
| Incomplete Handover | Missing continuation context | Review CONTINUE SESSION section above |
| Dedup Collision | Wrong memory surfaced | Check `fingerprint_hash` for conflicts |

### Diagnostic Commands

```bash
# Check memory index health
node .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts --status

# List memories for this spec folder
memory_search({ specFolder: "system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades", limit: 10 })

# Verify memory file integrity
ls -la system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades/memory/

# Check for orphaned memories
memory_search({ query: "orphaned", anchors: ["state"] })

# Force re-index of this spec folder
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades --force
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
session_id: "session-1775734809280-aeb14157e832"
spec_folder: "system-spec-kit/026-graph-and-context-optimization/014-code-graph-upgrades"
channel: "system-speckit/026-graph-and-context-optimization"

# Git Provenance (M-007d)
head_ref: "system-speckit/026-graph-and-context-optimization"
commit_ref: "706c4e2516d3"
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
  fingerprint_hash: "0a614a33ba7498268c72df6b1ca22f6628c4f598"         # content hash for dedup detection
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
created_at: "2026-04-09"
created_at_epoch: 1775734809
last_accessed_epoch: 1775734809
expires_at_epoch: 1783510809  # 0 for critical (never expires)

# Session Metrics
message_count: 11
decision_count: 4
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
  - "wording changecarefullyreason"
  - "numericconfidence validated"
  - "existing structuraltrust"
  - "structuraltrust without"
  - "blast-radius traversal"
  - "hotfilebreadcrumb uses"
  - "edgeevidenceclass plus"
  - "plus numericconfidence"
  - "post-filter unionmode"
  - "structuraltrust axes"
  - "attached additively"
  - "structured regex"

# Trigger Phrases (mirrors the canonical frontmatter list for fast <50ms matching)
trigger_phrases:
  - "detector provenance taxonomy"
  - "blast-radius depth cap fix"
  - "edge evidence numeric confidence additive"
  - "hot-file breadcrumb advisory"

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

