---
title: "Implemented 45 Item V2 [024-compact-code-graph/31-03-26_17-35__implemented-45-item-v2-remediation-across-phases]"
description: "Implemented 45-item v2 remediation across phases 013-016 of spec 024 (Hybrid Context Injection +...; DR-016: Expanded remediation from 26 to 45 items based on 30-iteration..."
trigger_phrases:
  - "include trace"
  - "file mtime ms"
  - "code graph metadata"
  - "idx file line"
  - "cli codex"
  - "gate skip"
  - "spec folder"
  - "tree sitter"
  - "tree thinning"
  - "structural indexer"
  - "code graph db"
  - "budget allocator"
  - "work adapter"
  - "context injection"
  - "indexer types system"
  - "dr-016 expanded"
  - "expanded remediation"
  - "remediation items"
  - "items based"
  - "based 30-iteration"
  - "30-iteration deep"
  - "deep review"
  - "review codex+copilot"
  - "agents dispatched"
  - "codex+copilot gpt-5.4"
  - "kit/024"
  - "compact"
  - "code"
  - "graph"
importance_tier: "important"
contextType: "planning"
_sourceTranscriptPath: ""
_sourceSessionId: ""
_sourceSessionCreated: 0
_sourceSessionUpdated: 0
captured_file_count: 10
filesystem_file_count: 10
git_changed_file_count: 0
quality_score: 1.00
quality_flags: []
spec_folder_health: {"pass":false,"score":0.6,"errors":1,"warnings":5}
---

# Implemented 45 Item V2 Remediation Across Phases

## SESSION SUMMARY

| **Meta Data** | **Value** |
|:--------------|:----------|
| Session Date | 2026-03-31 |
| Session ID | session-1774974936748-cf53aa61fccb |
| Spec Folder | system-spec-kit/024-compact-code-graph |
| Channel | system-speckit/024-compact-code-graph |
| Importance Tier | important |
| Context Type | planning |
| Total Messages | 1 |
| Tool Executions | 0 |
| Decisions Made | 5 |
| Follow-up Items Recorded | 0 |
| Created At | 2026-03-31 |
| Created At (Epoch) | 1774974936 |
| Last Accessed (Epoch) | 1774974936 |
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
| Completion % | 25% |
| Last Activity | 2026-03-31T16:35:36.737Z |
| Time in Session | 0m |
| Continuation Count | 1 |

### Context Summary

**Phase:** PLANNING

**Recent:** includeTrace removed from schema rather than implemented — simpler and no downstream consumers., Tree-sitter WASM deferred as separate future work — adapter interface in place for when it's ready., Next Steps

**Decisions:** 5 decisions recorded

### Pending Work

- [ ] **T001**: Commit all changes with conventional format (Priority: P2)

### Quick Resume

**To continue this work, use:**
```
/spec_kit:resume system-spec-kit/024-compact-code-graph
```

**Or paste this continuation prompt:**
```
CONTINUATION - Attempt 2
Spec: system-spec-kit/024-compact-code-graph
Last: Next Steps
Next: Commit all changes with conventional format
```

**Key Context to Review:**

- Files modified: mcp_server/lib/code-graph/structural-indexer.ts, mcp_server/lib/code-graph/code-graph-db.ts, mcp_server/lib/code-graph/budget-allocator.ts

- Check: plan.md, checklist.md

- Last: Next Steps

<!-- /ANCHOR:continue-session -->

---

<!-- ANCHOR:project-state-snapshot -->
<a id="project-state-snapshot"></a>

## PROJECT STATE SNAPSHOT

| Field | Value |
|-------|-------|
| Phase | PLANNING |
| Active File | mcp_server/lib/code-graph/structural-indexer.ts |
| Last Action | Next Steps |
| Next Action | Commit all changes with conventional format |
| Blockers | None |

### File Progress

| File | Status |
|------|--------|
| spec.md | EXISTS |
| plan.md | EXISTS |
| checklist.md | EXISTS |
| decision-record.md | EXISTS |
| research/research.md | EXISTS |

**Related Documentation:**
- [`spec.md`](./spec.md) - Requirements specification
- [`plan.md`](./plan.md) - Implementation plan
- [`checklist.md`](./checklist.md) - QA checklist
- [`decision-record.md`](./decision-record.md) - Architecture decisions
- [`research/research.md`](./research/research.md) - Research findings

**Key Topics:** `expanded remediation` | `review codex+copilot` | `items 30-iteration` | `remediation items` | `30-iteration deep` | `dr-016 expanded` | `deep review` | `codex+copilot gpt-5.4` | `findings confirmed` | `confirmed findings` | `original findings` | `agents dispatched` |

<!-- /ANCHOR:project-state-snapshot -->

---

<!-- ANCHOR:task-guide -->
<a id="implementation-guide"></a>

## 1. IMPLEMENTATION GUIDE

**What Was Built**:

- **45-item v2 remediation across phases 013-016 of spec 024 (Hybrid Context Injection +...** - Implemented 45-item v2 remediation across phases 013-016 of spec 024 (Hybrid Context Injection + Compact Code Graph).

**Key Files and Their Roles**:

- `mcp_server/lib/code-graph/structural-indexer.ts` - Modified structural indexer

- `mcp_server/lib/code-graph/code-graph-db.ts` - Modified code graph db

- `mcp_server/lib/code-graph/budget-allocator.ts` - Modified budget allocator

- `mcp_server/lib/code-graph/compact-merger.ts` - Modified compact merger

- `mcp_server/lib/code-graph/seed-resolver.ts` - Modified seed resolver

- `mcp_server/lib/code-graph/working-set-tracker.ts` - Modified working set tracker

- `mcp_server/lib/code-graph/indexer-types.ts` - Type definitions

- `mcp_server/lib/response/envelope.ts` - Modified envelope

**How to Extend**:

- Add new modules following the existing file structure patterns

- Maintain consistent error handling approach

**Common Patterns**:

- No patterns identified

<!-- /ANCHOR:task-guide -->

---

<!-- ANCHOR:summary -->
<a id="overview"></a>

## 2. OVERVIEW

Implemented 45-item v2 remediation across phases 013-016 of spec 024 (Hybrid Context Injection +...; DR-016: Expanded remediation from 26 to 45 items based on 30-iteration deep review (Codex+Copilot GPT-5.; All 16 agents dispatched via cli-codex GPT-5.

**Key Outcomes**:
- Implemented 45-item v2 remediation across phases 013-016 of spec 024 (Hybrid Context Injection +...
- DR-016: Expanded remediation from 26 to 45 items based on 30-iteration deep review (Codex+Copilot GPT-5.
- All 16 agents dispatched via cli-codex GPT-5.
- Schema version bumped from 1 to 3 (v2: file_mtime_ms column; v3: code_graph_metadata table + idx_file_line index).
- includeTrace removed from schema rather than implemented — simpler and no downstream consumers.
- Tree-sitter WASM deferred as separate future work — adapter interface in place for when it's ready.
- Next Steps

**Key Files:**

| **File** | **Description** |
|:---------|:----------------|
| `mcp_server/lib/code-graph/compact-merger.ts` | Modified compact merger | Tree-thinning merged 3 small files (structural-indexer.ts, code-graph-db.ts, budget-allocator.ts).  Merged from mcp_server/lib/code-graph/structural-indexer.ts : Modified structural indexer | Merged from mcp_server/lib/code-graph/code-graph-db.ts : Modified code graph db | Merged from mcp_server/lib/code-graph/budget-allocator.ts : Modified budget allocator |
| `mcp_server/lib/code-graph/seed-resolver.ts` | Modified seed resolver |
| `mcp_server/lib/code-graph/working-set-tracker.ts` | Modified working set tracker |
| `mcp_server/lib/code-graph/indexer-types.ts` | Modified indexer types |
| `mcp_server/lib/response/(merged-small-files)` | Tree-thinning merged 1 small files (envelope.ts).  Merged from mcp_server/lib/response/envelope.ts : Pressure-budget helper shared |
| `mcp_server/handlers/code-graph/(merged-small-files)` | Tree-thinning merged 2 small files (query.ts, context.ts).  Merged from mcp_server/handlers/code-graph/query.ts : Modified query | Merged from mcp_server/handlers/code-graph/context.ts : Modified context |

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:detailed-changes -->
<a id="detailed-changes"></a>

## 3. DETAILED CHANGES

<!-- ANCHOR:implementation-45item-remediation-across-phases-b577c7da -->
### FEATURE: Implemented 45-item v2 remediation across phases 013-016 of spec 024 (Hybrid Context Injection +...

Implemented 45-item v2 remediation across phases 013-016 of spec 024 (Hybrid Context Injection + Compact Code Graph). Used 16 parallel Codex CLI GPT-5.4 agents in 5 waves, all via cli-codex with model_reasoning_effort=high. No fallback to Copilot needed. Phase 013 (Correctness & Boundary Repair, 15 items): Fixed endLine bug via brace-counting (JS/TS/Bash) and indentation tracking (Python). DB safety: initDb() singleton guard, schema migration v1→v3, transaction atomicity for...

<!-- /ANCHOR:implementation-45item-remediation-across-phases-b577c7da -->

<!-- ANCHOR:implementation-next-steps-7e5b0c6b -->
### FOLLOWUP: Next Steps

Commit all changes with conventional format Build dist/ from updated TypeScript sources Implement tree-sitter WASM (Item 32) when ready Implement intent pre-classifier (Item 40) for structural vs semantic routing Fix pre-existing TypeScript errors in memory-search.ts and shadow-evaluation-runtime.ts

**Details:** Next: Commit all changes with conventional format | Follow-up: Build dist/ from updated TypeScript sources | Follow-up: Implement tree-sitter WASM (Item 32) when ready | Follow-up: Implement intent pre-classifier (Item 40) for structural vs semantic routing | Follow-up: Fix pre-existing TypeScript errors in memory-search.ts and shadow-evaluation-runtime.ts
<!-- /ANCHOR:implementation-next-steps-7e5b0c6b -->

<!-- /ANCHOR:detailed-changes -->

---

<!-- ANCHOR:decisions -->
<a id="decisions"></a>

## 4. DECISIONS

<!-- ANCHOR:decision-dr016-expanded-remediation-items-45428f2f -->
### Decision 1: DR-016: Expanded remediation from 26 to 45 items based on 30-iteration deep review (Codex+Copilot GPT-5.4). All original 19 findings confirmed; 20 new findings added.

**Context**: DR-016: Expanded remediation from 26 to 45 items based on 30-iteration deep review (Codex+Copilot GPT-5.4). All original 19 findings confirmed; 20 new findings added.

**Timestamp**: 2026-03-31T16:35:36.780Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   DR-016: Expanded remediation from 26 to 45 items based on 30-iteration deep review (Codex+Copilot GPT-5.4). All original 19 findings confirmed; 20 new findings added.

#### Chosen Approach

**Selected**: DR-016: Expanded remediation from 26 to 45 items based on 30-iteration deep review (Codex+Copilot GPT-5.4). All original 19 findings confirmed; 20 new findings added.

**Rationale**: DR-016: Expanded remediation from 26 to 45 items based on 30-iteration deep review (Codex+Copilot GPT-5.4). All original 19 findings confirmed; 20 new findings added.

#### Trade-offs

**Confidence**: 70%

<!-- /ANCHOR:decision-dr016-expanded-remediation-items-45428f2f -->

---

<!-- ANCHOR:decision-all-agents-dispatched-via-ff8186be -->
### Decision 2: All 16 agents dispatched via cli-codex GPT-5.4 high (never xhigh). Gate-skip instruction required

**Context**: All 16 agents dispatched via cli-codex GPT-5.4 high (never xhigh). Gate-skip instruction required

**Timestamp**: 2026-03-31T16:35:36.780Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   All 16 agents dispatched via cli-codex GPT-5.4 high (never xhigh). Gate-skip instruction required

#### Chosen Approach

**Selected**: All 16 agents dispatched via cli-codex GPT-5.4 high (never xhigh). Gate-skip instruction required

**Rationale**: agents hit Gate 3 spec-folder question on first attempt.

#### Trade-offs

**Confidence**: 70%

<!-- /ANCHOR:decision-all-agents-dispatched-via-ff8186be -->

---

<!-- ANCHOR:decision-schema-version-bumped-filemtimems-0376c10d -->
### Decision 3: Schema version bumped from 1 to 3 (v2: file_mtime_ms column; v3: code_graph_metadata table + idx_file_line index).

**Context**: Schema version bumped from 1 to 3 (v2: file_mtime_ms column; v3: code_graph_metadata table + idx_file_line index).

**Timestamp**: 2026-03-31T16:35:36.780Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Schema version bumped from 1 to 3 (v2: file_mtime_ms column; v3: code_graph_metadata table + idx_file_line index).

#### Chosen Approach

**Selected**: Schema version bumped from 1 to 3 (v2: file_mtime_ms column; v3: code_graph_metadata table + idx_file_line index).

**Rationale**: Schema version bumped from 1 to 3 (v2: file_mtime_ms column; v3: code_graph_metadata table + idx_file_line index).

#### Trade-offs

**Confidence**: 70%

<!-- /ANCHOR:decision-schema-version-bumped-filemtimems-0376c10d -->

---

<!-- ANCHOR:decision-includetrace-schema-rather-than-90960332 -->
### Decision 4: includeTrace removed from schema rather than implemented

**Context**: includeTrace removed from schema rather than implemented

**Timestamp**: 2026-03-31T16:35:36.780Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   includeTrace removed from schema rather than implemented

#### Chosen Approach

**Selected**: includeTrace removed from schema rather than implemented

**Rationale**: simpler and no downstream consumers.

#### Trade-offs

**Confidence**: 70%

<!-- /ANCHOR:decision-includetrace-schema-rather-than-90960332 -->

---

<!-- ANCHOR:decision-treesitter-wasm-deferred-separate-28d6d7de -->
### Decision 5: Tree-sitter WASM deferred as separate future work

**Context**: Tree-sitter WASM deferred as separate future work

**Timestamp**: 2026-03-31T16:35:36.780Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Tree-sitter WASM deferred as separate future work

#### Chosen Approach

**Selected**: Tree-sitter WASM deferred as separate future work

**Rationale**: adapter interface in place for when it's ready.

#### Trade-offs

**Confidence**: 70%

<!-- /ANCHOR:decision-treesitter-wasm-deferred-separate-28d6d7de -->

---

<!-- /ANCHOR:decisions -->

<!-- ANCHOR:session-history -->
<a id="conversation"></a>

## 5. CONVERSATION

Complete timestamped dialogue capturing all user interactions, AI responses, tool executions, and code changes during the session.

This session followed a **Linear Sequential** conversation pattern with **1** phase segments across **1** unique phases.

##### Conversation Phases
- **Implementation** - 3 actions
- **Research** - 1 actions
- **Verification** - 1 actions
- **Discussion** - 2 actions

---

### Message Timeline

> **User** | 2026-03-31 @ 17:35:36

Implemented 45-item v2 remediation across phases 013-016 of spec 024 (Hybrid Context Injection + Compact Code Graph). Used 16 parallel Codex CLI GPT-5.4 agents in 5 waves, all via cli-codex with model_reasoning_effort=high. No fallback to Copilot needed. Phase 013 (Correctness & Boundary Repair, 15 items): Fixed endLine bug via brace-counting (JS/TS/Bash) and indentation tracking (Python). DB safety: initDb() singleton guard, schema migration v1→v3, transaction atomicity for replaceNodes/Edges, orphan edge cleanup. Budget: removed 4000-token ceiling, sessionState budgeted, zero-budget sections skipped. Query: maxDepth strict enforcement, dedup via Set, includeTrace removed from schema. Validation: tool arg validation via getMissingRequiredStringArgs(), rootDir boundary check, exception sanitization, seed source preservation, working-set-tracker maxFiles enforcement. Phase 014 (Hook Durability & Auto-Enrichment, 14 items): readAndClearCompactPrime() prevents cache race, saveState() returns boolean. Security: SHA-256 session_id hashing, 0o700/0o600 permissions, provenance markers on recovered context, instruction-like pattern sanitization. Hook path: autoSurfaceAtCompaction() wired into compact-inject.ts so constitutional memories survive compaction. MCP first-call priming via sessionPrimed flag + primeSessionIfNeeded(). Tool auto-enrichment: GRAPH_CONTEXT_EXCLUDED_TOOLS set, 1-hop graph neighbors, 250ms Promise.race timeout. Stale-on-read: file_mtime_ms column, isFileStale()/ensureFreshFiles(). Dead code: workingSet branch removed, token-count sync consolidated to envelope.ts, pressure-budget helper shared. Phase 015 (Tree-Sitter Migration foundation, 8 items done of 13): ParserAdapter interface + RegexParser class + SPECKIT_PARSER env var. DECORATES/OVERRIDES/TYPE_OF edge types with regex detection. Ghost SymbolKinds (method, variable, parameter, module) now extracted. Dead TESTED_BY branch removed, excludeGlobs wired,.zsh in default globs. Tree-sitter WASM impl (Item 32) deferred — needs web-tree-sitter package. Phase 016 (Cross-Runtime UX, 11 items done of 14): Near-exact seed tier (±5 lines, confidence 0.95-distance*0.02), composite idx_file_line index. Auto-reindex on git HEAD change via code_graph_metadata table. Seed-resolver DB failures now throw (no silent placeholders). Session Start Protocol added to CODEX.md, AGENTS.md,.opencode/agent/context.md. Recovery consolidated: universal in root CLAUDE.md, Claude-specific in.claude/CLAUDE.md. 5 PARTIAL annotations on v1 checklist items. Deferred (4 items): tree-sitter WASM (Item 32), intent pre-classifier (Item 40), SessionStart scope alignment (Item 45), regex removal (Item 35).

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
| Context Loss | Agent doesn't remember prior work | Run `/spec_kit:resume system-spec-kit/024-compact-code-graph` |
| State Mismatch | Files don't match expected state | Verify with `git status` and `git diff` |
| Memory Not Found | Search returns no results | Check `memory_search({ specFolder: "system-spec-kit/024-compact-code-graph" })` |
| Stale Context | Information seems outdated | Check `last_accessed_epoch` vs current time |
| Incomplete Handover | Missing continuation context | Review CONTINUE SESSION section above |
| Dedup Collision | Wrong memory surfaced | Check `fingerprint_hash` for conflicts |

### Diagnostic Commands

```bash
# Check memory index health
node .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts --status

# List memories for this spec folder
memory_search({ specFolder: "system-spec-kit/024-compact-code-graph", limit: 10 })

# Verify memory file integrity
ls -la system-spec-kit/024-compact-code-graph/memory/

# Check for orphaned memories
memory_search({ query: "orphaned", anchors: ["state"] })

# Force re-index of this spec folder
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js system-spec-kit/024-compact-code-graph --force
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
session_id: "session-1774974936748-cf53aa61fccb"
spec_folder: "system-spec-kit/024-compact-code-graph"
channel: "system-speckit/024-compact-code-graph"

# Git Provenance (M-007d)
head_ref: ""
commit_ref: ""
repository_state: "unavailable"
is_detached_head: No

# Classification
importance_tier: "important"  # constitutional|critical|important|normal|temporary|deprecated
context_type: "planning"        # implementation|planning|research|general

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
  fingerprint_hash: "e5e6733d816b9c461947b4c4afc5b4a172598db8"         # content hash for dedup detection
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
created_at: "2026-03-31"
created_at_epoch: 1774974936
last_accessed_epoch: 1774974936
expires_at_epoch: 0  # 0 for critical (never expires)

# Session Metrics
message_count: 1
decision_count: 5
tool_count: 0
file_count: 10
captured_file_count: 10
filesystem_file_count: 10
git_changed_file_count: 0
followup_count: 0

# Access Analytics
access_count: 1
last_search_query: ""
relevance_boost: 1  # 1.0 default, increased by access patterns

# Content Indexing
key_topics:
  - "expanded remediation"
  - "review codex+copilot"
  - "items 30-iteration"
  - "remediation items"
  - "30-iteration deep"
  - "dr-016 expanded"
  - "deep review"
  - "codex+copilot gpt-5.4"
  - "findings confirmed"
  - "confirmed findings"
  - "original findings"
  - "agents dispatched"

# Trigger Phrases (auto-extracted for fast <50ms matching)
trigger_phrases:
  - "include trace"
  - "file mtime ms"
  - "code graph metadata"
  - "idx file line"
  - "cli codex"
  - "gate skip"
  - "spec folder"
  - "tree sitter"
  - "tree thinning"
  - "structural indexer"
  - "code graph db"
  - "budget allocator"
  - "work adapter"
  - "context injection"
  - "indexer types system"
  - "dr-016 expanded"
  - "expanded remediation"
  - "remediation items"
  - "items based"
  - "based 30-iteration"
  - "30-iteration deep"
  - "deep review"
  - "review codex+copilot"
  - "agents dispatched"
  - "codex+copilot gpt-5.4"
  - "kit/024"
  - "compact"
  - "code"
  - "graph"

key_files:
  - "mcp_server/lib/code-graph/structural-indexer.ts"
  - "mcp_server/lib/code-graph/code-graph-db.ts"
  - "mcp_server/lib/code-graph/budget-allocator.ts"
  - "mcp_server/lib/code-graph/compact-merger.ts"
  - "mcp_server/lib/code-graph/seed-resolver.ts"
  - "mcp_server/lib/code-graph/working-set-tracker.ts"
  - "mcp_server/lib/code-graph/indexer-types.ts"
  - "mcp_server/lib/response/envelope.ts"
  - "mcp_server/handlers/code-graph/query.ts"
  - "mcp_server/handlers/code-graph/context.ts"

# Relationships
related_sessions:

  []

parent_spec: "system-spec-kit/024-compact-code-graph"
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

