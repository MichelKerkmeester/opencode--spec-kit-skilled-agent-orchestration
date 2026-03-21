---
title: "Verified trigger phrase YAML"
description: "A successful save must preserve ANCHOR comments, use valid session-specific trigger phrases, and index only when the evidence is durable enough."
trigger_phrases:
  - "system spec kit/022 hybrid rag fusion/010 perfect session capturing"
  - "session specific"
  - "generate context"
  - "tree thinning"
  - "memory sufficiency"
  - "repo tracked"
  - "memory render fixture"
  - "merged-small-files tree-thinning merged small"
  - "tree-thinning merged small files"
  - "index only"
  - "raw mustache tags leaking"
  - "mustache tags leaking memory"
importance_tier: "critical"
contextType: "general"
quality_score: 1.00
quality_flags: []
---

# Verified Trigger Phrase Yaml Rendering

## SESSION SUMMARY

| **Meta Data** | **Value** |
|:--------------|:----------|
| Session Date | 2026-03-15 |
| Session ID | session-1773573749060-9cfb417ebaa1 |
| Spec Folder | 02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing |
| Channel | main |
| Importance Tier | critical |
| Context Type | research |
| Total Messages | 3 |
| Tool Executions | 3 |
| Decisions Made | 0 |
| Follow-up Items Recorded | 0 |
| Created At | 2026-03-15 |
| Created At (Epoch) | 1773573749 |
| Last Accessed (Epoch) | 1773573749 |
| Access Count | 1 |

---

## TABLE OF CONTENTS

- [CONTINUE SESSION](#continue-session)
- [PROJECT STATE SNAPSHOT](#project-state-snapshot)
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
| Session Status | BLOCKED |
| Completion % | 10% |
| Last Activity | 2026-03-15T12:29:00.000Z |
| Time in Session | 4m |
| Continuation Count | 1 |

### Context Summary

**Phase:** RESEARCH

**Recent:** Verified trigger phrase YAML rendering, Aligned JSON normalization with documented snake_case input, Tightened insufficiency gating before write

**Summary:** A successful save must preserve ANCHOR comments, use valid session-specific trigger phrases, and index only when the evidence is durable enough.

### Pending Work

- No pending tasks - session completed successfully

### Quick Resume

**To continue this work, use:**
```
/spec_kit:resume 02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing
```

**Or paste this continuation prompt:**
```
CONTINUATION - Attempt 2
Spec: 02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing
Last: Tightened insufficiency gating before write
Next: Continue implementation
```

**Key Context to Review:**

- Files modified: .opencode/skill/system-spec-kit/templates/context_template.md, .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts, .opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts

- Last: Tightened insufficiency gating before write

<!-- /ANCHOR:continue-session -->

---
<!-- ANCHOR:project-state-snapshot -->
<a id="project-state-snapshot"></a>

## PROJECT STATE SNAPSHOT

| Field | Value |
|-------|-------|
| Phase | RESEARCH |
| Active File | .opencode/skill/system-spec-kit/scripts/core/workflow.ts |
| Last Action | Tightened insufficiency gating before write |
| Next Action | Continue implementation |
| Blockers | Confirmed the template now renders exactly one trigger_phrases YAML block in both frontmatter and tr |

**Key Topics:** `system spec kit/022 hybrid rag fusion/010 perfect session capturing` | `system` | `spec` | `kit/022` | `hybrid` | `rag` | `fusion/010` | `perfect` | `capturing` | `successful save` | `save must` | `must preserve` |
<!-- /ANCHOR:project-state-snapshot -->

---

<!-- ANCHOR:summary -->
<a id="overview"></a>

## 1. OVERVIEW

A successful save must preserve ANCHOR comments, use valid session-specific trigger phrases, and index only when the evidence is durable enough.

**Key Outcomes**:
- Verified trigger phrase YAML rendering
- Aligned JSON normalization with documented snake_case input
- Tightened insufficiency gating before write

**Key Files:**

| **File** | **Description** |
|:---------|:----------------|
| `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` | Updated generate context |
| `.opencode/skill/system-spec-kit/templates/(merged-small-files)` | Tree-thinning merged 1 small files (context_template.md). Merged from .opencode/skill/system-spec-kit/templates/context_template.md : No raw Mustache tags leaking into the memory file |
| `.opencode/skill/system-spec-kit/scripts/utils/(merged-small-files)` | Tree-thinning merged 1 small files (input-normalizer.ts). Merged from .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts : Updated input normalizer |
| `.opencode/skill/system-spec-kit/shared/parsing/(merged-small-files)` | Tree-thinning merged 1 small files (memory-sufficiency.ts). Merged from .opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts : Insufficient context before any repo-tracked memory file ... |
| `.opencode/skill/system-spec-kit/scripts/core/(merged-small-files)` | Tree-thinning merged 1 small files (workflow.ts). Merged from .opencode/skill/system-spec-kit/scripts/core/workflow.ts : No raw Mustache tags leaking into the memory file |
| `.opencode/skill/system-spec-kit/scripts/tests/(merged-small-files)` | Tree-thinning merged 3 small files (memory-render-fixture.vitest.ts, runtime-memory-inputs.vitest.ts, memory-sufficiency.vitest.ts). Merged from .opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts : No raw Mustache tags leaking into the memory file | Merged from .opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts : Updated runtime memory inputs.vitest | Merged from .opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts : Insufficient context before any repo-tracked memory file ... |

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:detailed-changes -->
<a id="detailed-changes"></a>

## 2. DETAILED CHANGES

<!-- ANCHOR:implementation-verified-trigger-phrase-yaml-80b5b37f -->
### OBSERVATION: Verified trigger phrase YAML rendering

Confirmed the template now renders exactly one trigger_phrases YAML block in both frontmatter and trailing metadata, with no raw Mustache tags leaking into the memory file.

**Files:** .opencode/skill/system-spec-kit/scripts/core/workflow.ts, .opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts, .opencode/skill/system-spec-kit/templates/context_template.md
**Details:** Tool: Read File:.opencode/skill/system-spec-kit/templates/context_template.md Result: replaced nested TRIGGER_PHRASES loops with a prebuilt YAML block placeholder. | Tool: Read File:.opencode/skill/system-spec-kit/scripts/core/workflow.ts Result: render path now injects a single trigger phrase YAML block for both metadata sections. | Tool: Bash File:.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts Result: regression checks confirm one header, no raw mustache, and valid empty-list fallback.
<!-- /ANCHOR:implementation-verified-trigger-phrase-yaml-80b5b37f -->

<!-- ANCHOR:files-aligned-json-normalization-documented-ea08f273 -->
### FEATURE: Aligned JSON normalization with documented snake_case input

Updated the normalizer so documented snake_case fields like user_prompts, recent_context, and trigger_phrases survive explicit JSON mode without being dropped or rewritten into an empty conversation.

**Files:** .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts, .opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts, .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
**Details:** Tool: Read File:.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts Result: snake_case and camelCase inputs now normalize into the same MCP-compatible structure. | Tool: Bash File:.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts Result: added explicit data-file coverage for snake_case JSON handling. | Tool: Read File:.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts Result: CLI help remains the source-of-truth contract for JSON mode.
<!-- /ANCHOR:files-aligned-json-normalization-documented-ea08f273 -->

<!-- ANCHOR:implementation-tightened-insufficiency-gating-before-70a86f0e -->
### OBSERVATION: Tightened insufficiency gating before write

Adjusted the memory sufficiency lane so scaffolded rendered sections no longer count as primary evidence. Thin saves now fail for insufficient context before any repo-tracked memory file is written.

**Files:** .opencode/skill/system-spec-kit/scripts/core/workflow.ts, .opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts, .opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts
**Details:** Tool: Read File:.opencode/skill/system-spec-kit/shared/parsing/memory-sufficiency.ts Result: removed fallback that promoted rendered sections into primary evidence when no durable evidence existed. | Tool: Read File:.opencode/skill/system-spec-kit/scripts/core/workflow.ts Result: insufficiency abort now happens before stateless quality-gate aborts, preserving the right failure contract. | Tool: Bash File:.opencode/skill/system-spec-kit/scripts/tests/memory-sufficiency.vitest.ts Result: template-only scaffold no longer passes as durable memory evidence.
<!-- /ANCHOR:implementation-tightened-insufficiency-gating-before-70a86f0e -->

<!-- /ANCHOR:detailed-changes -->

---

<!-- ANCHOR:decisions -->
<a id="decisions"></a>

## 3. DECISIONS

decision_count: 0

---

<!-- /ANCHOR:decisions -->

<!-- ANCHOR:session-history -->
<a id="conversation"></a>

## 4. CONVERSATION

Complete timestamped dialogue capturing all user interactions, AI responses, tool executions, and code changes during the session.

This session followed a **Linear Sequential** conversation pattern with **1** distinct phases.

##### Conversation Phases
- **Research** - 3 actions
- **Discussion** - 1 actions

---

### Message Timeline

> **User** | 2026-03-15 @ 13:25:00

Re-run closure verification for 009-perfect-session-capturing and prove the rendered memory preserves anchors, renders valid trigger phrases, and accepts the documented snake_case JSON contract.

---

> **User** | 2026-03-15 @ 13:29:00

Inspect the workflow, template, and normalizer paths so the generator writes one clean YAML trigger list and blocks thin context before write.

---

> **Assistant** | 2026-03-15 @ 13:32:00

Inspect the workflow, template, and normalizer paths so the generator writes one clean YAML trigger list and blocks thin context before write. → Confirmed the template now renders exactly one trigger_phrases YAML block in both frontmatter and trailing metadata, with no raw Mustache tags leaking into the memory file. Used tools: Read, Read, Bash.

**Tool: Read**
.opencode/skill/system-spec-kit/templates/context_template.md Result: replaced nested TRIGGER_PHRASES loops with a prebuilt YAML block placeholder.

Result Preview

```
replaced nested TRIGGER_PHRASES loops with a prebuilt YAML block placeholder.
```

**Tool: Read**
.opencode/skill/system-spec-kit/scripts/core/workflow.ts Result: render path now injects a single trigger phrase YAML block for both metadata sections.

Result Preview

```
render path now injects a single trigger phrase YAML block for both metadata sections.
```

**Tool: Bash**
.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts Result: regression checks confirm one header, no raw mustache, and valid empty-list fallback.

Result Preview

```
regression checks confirm one header, no raw mustache, and valid empty-list fallback.
```

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
| Context Loss | Agent doesn't remember prior work | Run `/spec_kit:resume 02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing` |
| State Mismatch | Files don't match expected state | Verify with `git status` and `git diff` |
| Memory Not Found | Search returns no results | Check `memory_search({ specFolder: "02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing" })` |
| Stale Context | Information seems outdated | Check `last_accessed_epoch` vs current time |
| Incomplete Handover | Missing continuation context | Review CONTINUE SESSION section above |
| Dedup Collision | Wrong memory surfaced | Check `fingerprint_hash` for conflicts |

### Diagnostic Commands

```bash
# Check memory index health
node .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts --status

# List memories for this spec folder
memory_search({ specFolder: "02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing", limit: 10 })

# Verify memory file integrity
ls -la 02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/memory/

# Check for orphaned memories
memory_search({ query: "orphaned", anchors: ["state"] })

# Force re-index of this spec folder
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js 02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing --force
```

### Recovery Priority

1. **Verify spec folder exists** - Check path is correct
2. **Load memory context** - Use memory_search to surface prior work
3. **Review last session state** - Check PROJECT STATE SNAPSHOT
4. **Validate pending tasks** - Review CONTINUE SESSION section
5. **Resume with handover prompt** - Use continuation template above

### Session Integrity Checks

| Check | Status | Details |
|-------|--------|---------|
| Memory File Exists |  |  |
| Index Entry Valid |  | Last indexed:  |
| Checksums Match |  |  |
| No Dedup Conflicts |  |  |
<!-- /ANCHOR:recovery-hints -->

---
<!-- ANCHOR:metadata -->
<a id="memory-metadata"></a>

## MEMORY METADATA


> **Machine-Readable Section** - This YAML block is parsed by the semantic memory indexer for search optimization and decay calculations.

```yaml
# Core Identifiers
session_id: "session-1773573749060-9cfb417ebaa1"
spec_folder: "02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing"
channel: "main"

# Classification
importance_tier: "critical"  # constitutional|critical|important|normal|temporary|deprecated
context_type: "research"        # research|implementation|decision|discovery|general

# Memory Classification (v2.2)
memory_classification:
  memory_type: ""         # episodic|procedural|semantic|constitutional
  half_life_days:      # decay half-life in days (0 = never decays)
  decay_factors:
    base_decay_rate:            # 0.0-1.0, daily decay multiplier
    access_boost_factor:    # boost per access (default 0.1)
    recency_weight:              # weight for recent accesses (default 0.5)
    importance_multiplier:  # tier-based multiplier

# Session Deduplication (v2.2)
session_dedup:
  memories_surfaced:    # count of memories shown this session
  dedup_savings_tokens:    # tokens saved via deduplication
  fingerprint_hash: ""         # content hash for dedup detection
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
created_at: "2026-03-15"
created_at_epoch: 1773573749
last_accessed_epoch: 1773573749
expires_at_epoch: 0  # 0 for critical (never expires)

# Session Metrics
message_count: 3
decision_count: 0
tool_count: 3
file_count: 8
followup_count: 0

# Access Analytics
access_count: 1
last_search_query: ""
relevance_boost: 1  # 1.0 default, increased by access patterns

# Content Indexing
key_topics:
  - "system spec kit/022 hybrid rag fusion/010 perfect session capturing"
  - "system"
  - "spec"
  - "kit/022"
  - "hybrid"
  - "rag"
  - "fusion/010"
  - "perfect"
  - "capturing"
  - "successful save"
  - "save must"
  - "must preserve"

# Trigger Phrases (auto-extracted for fast <50ms matching)
trigger_phrases:
  - "system spec kit/022 hybrid rag fusion/010 perfect session capturing"
  - "session specific"
  - "generate context"
  - "tree thinning"
  - "memory sufficiency"
  - "repo tracked"
  - "memory render fixture"
  - "merged-small-files tree-thinning merged small"
  - "tree-thinning merged small files"
  - "index only"
  - "raw mustache tags leaking"
  - "mustache tags leaking memory"  []

parent_spec: "02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing"
child_sessions:

  []

# Embedding Info (populated by indexer)
embedding_model: "nomic-ai/nomic-embed-text-v1.5"
embedding_version: "1.0"
chunk_count: 1
```

<!-- /ANCHOR:metadata -->

---

*Generated by system-spec-kit skill v1.7.2*

