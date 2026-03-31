---
title: "Resolved Remaining Checklist [024-compact-code-graph/31-03-26_10-23__resolved-remaining-checklist-items-for-spec-024]"
description: "Resolved remaining checklist items for spec 024-compact-code-graph, bringing completion from 83.5% to 96.5% (246 of 255). Implemented Wave 0 (DEFERRED markers), Wave 1 (4..."
trigger_phrases:
  - "get blocked"
  - "for empty"
  - "empty transcript"
  - "invalid stdin"
  - "calculate pressure adjusted budget"
  - "get token usage ratio"
  - "speckit auto compact detect"
  - "compact code graph"
  - "session prime"
  - "session stop"
  - "auto save"
  - "compact inject"
  - "code graph context"
  - "code graph db"
  - "edge cases"
  - "tree thinning"
  - "used claude"
  - "claude subagents"
  - "subagents wave"
  - "agents get"
  - "blocked gate"
  - "marked items deferred"
  - "deferred v2 items"
  - "spec 024 compact code graph"
importance_tier: "important"
contextType: "decision"
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

# Resolved Remaining Checklist Items For Spec 024

## SESSION SUMMARY

| **Meta Data** | **Value** |
|:--------------|:----------|
| Session Date | 2026-03-31 |
| Session ID | session-1774948998427-15d07f4dfff8 |
| Spec Folder | 02--system-spec-kit/024-compact-code-graph |
| Channel | system-speckit/024-compact-code-graph |
| Importance Tier | important |
| Context Type | decision |
| Total Messages | 1 |
| Tool Executions | 0 |
| Decisions Made | 11 |
| Follow-up Items Recorded | 0 |
| Created At | 2026-03-31 |
| Created At (Epoch) | 1774948998 |
| Last Accessed (Epoch) | 1774948998 |
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
| Last Activity | 2026-03-31T09:23:18.394Z |
| Time in Session | 0m |
| Continuation Count | 1 |

### Context Summary

**Phase:** PLANNING

**Recent:** Updated CocoIndex SKILL., Performance benchmarks pass: full index under 500ms, incremental under 10ms, Next Steps

**Decisions:** 11 decisions recorded

### Pending Work

- [ ] **T000**: 9 remaining items — all testing: dual-scope-hooks extension, crash-recovery extension, 7-scenario matrix, agent routing tests, coverage report, Copilot/Gemini live tests, manual playbook execution (Priority: P0)

- [ ] **T001**: 9 remaining items — all testing: dual-scope-hooks extension, crash-recovery extension, 7-scenario ma (Priority: P2)

### Quick Resume

**To continue this work, use:**
```
/spec_kit:resume 02--system-spec-kit/024-compact-code-graph
```

**Or paste this continuation prompt:**
```
CONTINUATION - Attempt 2
Spec: 02--system-spec-kit/024-compact-code-graph
Last: Next Steps
Next: 9 remaining items — all testing: dual-scope-hooks extension, crash-recovery extension, 7-scenario matrix, agent routing tests, coverage report, Copilot/Gemini live tests, manual playbook execution
```

**Key Context to Review:**

- Files modified: mcp_server/hooks/claude/session-prime.ts, mcp_server/hooks/claude/session-stop.ts, mcp_server/hooks/claude/compact-inject.ts

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
| Active File | mcp_server/hooks/claude/session-prime.ts |
| Last Action | Next Steps |
| Next Action | 9 remaining items — all testing: dual-scope-hooks extension, crash-recovery extension, 7-scenario matrix, agent routing tests, coverage report, Copilot/Gemini live tests, manual playbook execution |
| Blockers | None (Gate 3 blocking mitigated by using Claude subagents instead of copilot/codex) |

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

**Key Topics:** `shared.ts calculatepressureadjustedbudget` | `calculatepressureadjustedbudget helper` | `code-graph-db.ts gettokenusageratio` | `code-graph-context.ts latency` | `compact-inject.ts attention` | `session-stop.ts extraction` | `edge-cases.vitest.ts tests` | `gettokenusageratio helper` | `detection copilot/gemini` | `session-prime.ts token` | `performance benchmarks` | `extraction --finalize` |

<!-- /ANCHOR:project-state-snapshot -->

---

<!-- ANCHOR:task-guide -->
<a id="implementation-guide"></a>

## 1. IMPLEMENTATION GUIDE

**What Was Built**:

- **Resolved remaining checklist items for spec 024-compact-code-graph, bringing completion from 83.5%...** - Resolved remaining checklist items for spec 024-compact-code-graph, bringing completion from 83.

**Key Files and Their Roles**:

- `mcp_server/hooks/claude/session-prime.ts` - Modified session prime

- `mcp_server/hooks/claude/session-stop.ts` - Modified session stop

- `mcp_server/hooks/claude/compact-inject.ts` - Modified compact inject

- `mcp_server/hooks/claude/shared.ts` - Modified shared

- `mcp_server/hooks/claude/hook-state.ts` - Modified hook state

- `mcp_server/lib/code-graph/code-graph-context.ts` - Context configuration

- `mcp_server/lib/code-graph/code-graph-db.ts` - Modified code graph db

- `mcp_server/tests/edge-cases.vitest.ts` - Modified edge cases.vitest

**How to Extend**:

- Add new modules following the existing file structure patterns

- Create corresponding test files for new implementations

**Common Patterns**:

- No patterns identified

<!-- /ANCHOR:task-guide -->

---

<!-- ANCHOR:summary -->
<a id="overview"></a>

## 2. OVERVIEW

Resolved remaining checklist items for spec 024-compact-code-graph, bringing completion from 83.5% to 96.5% (246 of 255). Implemented Wave 0 (DEFERRED markers), Wave 1 (4 parallel agents for code), plus documentation and edge case tests.

**Key Outcomes**:
- Resolved remaining checklist items from 83.5% to 96.5% (246/255) via Wave 0 (DEFERRED markers) + Wave 1 (4 parallel agents)
- Used Claude subagents for Wave 1 since copilot/codex agents get blocked by Gate 3
- Marked 5 items DEFERRED v2: MCP compaction detection, Copilot/Gemini hook adapters, SPECKIT_AUTO_COMPACT_DETECT, adapter test fixtures
- session-prime.ts: token pressure awareness (calculatePressureBudget), stale index detection (>24h), working memory signals
- session-stop.ts: session summary extraction (extractSessionSummary), --finalize mode, auto-save merge (5min dedup)
- compact-inject.ts: attention signal extraction (extractAttentionSignals), spec folder detection in merged context
- shared.ts: calculatePressureAdjustedBudget helper for context window pressure
- code-graph-context.ts: latency guard (400ms budget in impact mode), deadlineMs parameter
- code-graph-db.ts: getTokenUsageRatio helper, WAL concurrent reads confirmed
- Created edge-cases.vitest.ts with 13 tests (empty transcript, invalid stdin, pressure budget, concurrent sessions)

**Key Files:**

| **File** | **Description** |
|:---------|:----------------|
| `mcp_server/hooks/claude/session-prime.ts` | Token pressure awareness, stale index detection, working memory signals |
| `mcp_server/hooks/claude/session-stop.ts` | Session summary extraction, --finalize mode, auto-save merge dedup |
| `mcp_server/hooks/claude/compact-inject.ts` | Attention signal extraction, spec folder detection in merged context |
| `mcp_server/hooks/claude/shared.ts` | calculatePressureAdjustedBudget helper |
| `mcp_server/hooks/claude/hook-state.ts` | sessionSummary field added to HookState interface |
| `mcp_server/lib/code-graph/code-graph-context.ts` | Latency guard (400ms), deadlineMs parameter for anchor processing |
| `mcp_server/lib/code-graph/code-graph-db.ts` | getTokenUsageRatio helper, WAL concurrent reads comment |
| `mcp_server/tests/edge-cases.vitest.ts` | 13 edge case tests (empty transcript, pressure budget, concurrent sessions) |
| `mcp-coco-index/SKILL.md` | ccc_status/ccc_reindex/ccc_feedback in MCP Tool Summary |
| `mcp-coco-index/references/search_patterns.md` | Freshness strategy section (8b) with re-index triggers |

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:detailed-changes -->
<a id="detailed-changes"></a>

## 3. DETAILED CHANGES

<!-- ANCHOR:implementation-resolved-remaining-checklist-items-3191d7cc -->
### FEATURE: Resolved remaining checklist items for spec 024-compact-code-graph, bringing completion from 83.5%...

Resolved remaining checklist items for spec 024-compact-code-graph, bringing completion from 83.5% to 96.5% (246 of 255). Implemented Wave 0 (DEFERRED markers), Wave 1 (4 parallel agents for code), plus documentation and edge case tests.

<!-- /ANCHOR:implementation-resolved-remaining-checklist-items-3191d7cc -->

<!-- ANCHOR:guide-next-steps-7e5b0c6b -->
### FOLLOWUP: Next Steps

9 remaining items — all testing: dual-scope-hooks extension, crash-recovery extension, 7-scenario matrix, agent routing tests, coverage report, Copilot/Gemini live tests, manual playbook execution Branch has 7 commits pushed to GitHub Consider merging to main when testing items resolved

**Details:** Next: 9 remaining items — all testing: dual-scope-hooks extension, crash-recovery extension, 7-scenario matrix, agent routing tests, coverage report, Copilot/Gemini live tests, manual playbook execution | Follow-up: Branch has 7 commits pushed to GitHub | Follow-up: Consider merging to main when testing items resolved
<!-- /ANCHOR:guide-next-steps-7e5b0c6b -->

<!-- /ANCHOR:detailed-changes -->

---

<!-- ANCHOR:decisions -->
<a id="decisions"></a>

## 4. DECISIONS

<!-- ANCHOR:decision-claude-subagents-wave-since-6d36a95a -->
### Decision 1: Used Claude subagents for Wave 1 since copilot/codex agents get blocked by Gate 3

**Context**: Used Claude subagents for Wave 1 since copilot/codex agents get blocked by Gate 3

**Timestamp**: 2026-03-31T09:23:18.460Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Used Claude subagents for Wave 1 since copilot/codex agents get blocked by Gate 3

#### Chosen Approach

**Selected**: Used Claude subagents for Wave 1 since copilot/codex agents get blocked by Gate 3

**Rationale**: Used Claude subagents for Wave 1 since copilot/codex agents get blocked by Gate 3

#### Trade-offs

**Confidence**: 70%

<!-- /ANCHOR:decision-claude-subagents-wave-since-6d36a95a -->

---

<!-- ANCHOR:decision-marked-items-deferred-mcp-913b7f3c -->
### Decision 2: Marked 5 items DEFERRED v2: MCP compaction detection, Copilot/Gemini hook adapters, SPECKIT_AUTO_COMPACT_DETECT, adapter test fixtures

**Context**: Marked 5 items DEFERRED v2: MCP compaction detection, Copilot/Gemini hook adapters, SPECKIT_AUTO_COMPACT_DETECT, adapter test fixtures

**Timestamp**: 2026-03-31T09:23:18.461Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Marked 5 items DEFERRED v2: MCP compaction detection, Copilot/Gemini hook adapters, SPECKIT_AUTO_COMPACT_DETECT, adapter test fixtures

#### Chosen Approach

**Selected**: Marked 5 items DEFERRED v2: MCP compaction detection, Copilot/Gemini hook adapters, SPECKIT_AUTO_COMPACT_DETECT, adapter test fixtures

**Rationale**: Marked 5 items DEFERRED v2: MCP compaction detection, Copilot/Gemini hook adapters, SPECKIT_AUTO_COMPACT_DETECT, adapter test fixtures

#### Trade-offs

**Confidence**: 70%

<!-- /ANCHOR:decision-marked-items-deferred-mcp-913b7f3c -->

---

<!-- ANCHOR:decision-sessionprimets-token-pressure-awareness-6681b65c -->
### Decision 3: session-prime.ts: token pressure awareness, stale index detection (>24h), working memory attention signals

**Context**: session-prime.ts: token pressure awareness, stale index detection (>24h), working memory attention signals

**Timestamp**: 2026-03-31T09:23:18.461Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   session-prime.ts: token pressure awareness, stale index detection (>24h), working memory attention signals

#### Chosen Approach

**Selected**: session-prime.ts: token pressure awareness, stale index detection (>24h), working memory attention signals

**Rationale**: session-prime.ts: token pressure awareness, stale index detection (>24h), working memory attention signals

#### Trade-offs

**Confidence**: 70%

<!-- /ANCHOR:decision-sessionprimets-token-pressure-awareness-6681b65c -->

---

<!-- ANCHOR:decision-sessionstopts-session-summary-extraction-37e05bd4 -->
### Decision 4: session-stop.ts: session summary extraction, --finalize mode, auto-save merge detection (5min dedup)

**Context**: session-stop.ts: session summary extraction, --finalize mode, auto-save merge detection (5min dedup)

**Timestamp**: 2026-03-31T09:23:18.461Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   session-stop.ts: session summary extraction, --finalize mode, auto-save merge detection (5min dedup)

#### Chosen Approach

**Selected**: session-stop.ts: session summary extraction, --finalize mode, auto-save merge detection (5min dedup)

**Rationale**: session-stop.ts: session summary extraction, --finalize mode, auto-save merge detection (5min dedup)

#### Trade-offs

**Confidence**: 70%

<!-- /ANCHOR:decision-sessionstopts-session-summary-extraction-37e05bd4 -->

---

<!-- ANCHOR:decision-compactinjectts-attention-signal-extraction-5506210f -->
### Decision 5: compact-inject.ts: attention signal extraction (identifier frequency), spec folder detection in merged context

**Context**: compact-inject.ts: attention signal extraction (identifier frequency), spec folder detection in merged context

**Timestamp**: 2026-03-31T09:23:18.461Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   compact-inject.ts: attention signal extraction (identifier frequency), spec folder detection in merged context

#### Chosen Approach

**Selected**: compact-inject.ts: attention signal extraction (identifier frequency), spec folder detection in merged context

**Rationale**: compact-inject.ts: attention signal extraction (identifier frequency), spec folder detection in merged context

#### Trade-offs

**Confidence**: 70%

<!-- /ANCHOR:decision-compactinjectts-attention-signal-extraction-5506210f -->

---

<!-- ANCHOR:decision-sharedts-calculatepressureadjustedbudget-helper-f99d9754 -->
### Decision 6: shared.ts: calculatePressureAdjustedBudget helper

**Context**: shared.ts: calculatePressureAdjustedBudget helper

**Timestamp**: 2026-03-31T09:23:18.461Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   shared.ts: calculatePressureAdjustedBudget helper

#### Chosen Approach

**Selected**: shared.ts: calculatePressureAdjustedBudget helper

**Rationale**: shared.ts: calculatePressureAdjustedBudget helper

#### Trade-offs

**Confidence**: 70%

<!-- /ANCHOR:decision-sharedts-calculatepressureadjustedbudget-helper-f99d9754 -->

---

<!-- ANCHOR:decision-codegraphcontextts-latency-guard-400ms-a5210a94 -->
### Decision 7: code-graph-context.ts: latency guard (400ms budget in impact mode), deadlineMs parameter

**Context**: code-graph-context.ts: latency guard (400ms budget in impact mode), deadlineMs parameter

**Timestamp**: 2026-03-31T09:23:18.461Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   code-graph-context.ts: latency guard (400ms budget in impact mode), deadlineMs parameter

#### Chosen Approach

**Selected**: code-graph-context.ts: latency guard (400ms budget in impact mode), deadlineMs parameter

**Rationale**: code-graph-context.ts: latency guard (400ms budget in impact mode), deadlineMs parameter

#### Trade-offs

**Confidence**: 70%

<!-- /ANCHOR:decision-codegraphcontextts-latency-guard-400ms-a5210a94 -->

---

<!-- ANCHOR:decision-codegraphdbts-gettokenusageratio-helper-wal-cc636080 -->
### Decision 8: code-graph-db.ts: getTokenUsageRatio helper, WAL concurrent reads confirmed

**Context**: code-graph-db.ts: getTokenUsageRatio helper, WAL concurrent reads confirmed

**Timestamp**: 2026-03-31T09:23:18.461Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   code-graph-db.ts: getTokenUsageRatio helper, WAL concurrent reads confirmed

#### Chosen Approach

**Selected**: code-graph-db.ts: getTokenUsageRatio helper, WAL concurrent reads confirmed

**Rationale**: code-graph-db.ts: getTokenUsageRatio helper, WAL concurrent reads confirmed

#### Trade-offs

**Confidence**: 70%

<!-- /ANCHOR:decision-codegraphdbts-gettokenusageratio-helper-wal-cc636080 -->

---

<!-- ANCHOR:decision-edgecasesvitestts-tests-empty-transcript-13a0fb1b -->
### Decision 9: Created edge-cases.vitest.ts with tests for empty transcript, invalid stdin, pressure budget, concurrent sessions

**Context**: Created edge-cases.vitest.ts with tests for empty transcript, invalid stdin, pressure budget, concurrent sessions

**Timestamp**: 2026-03-31T09:23:18.461Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Created edge-cases.vitest.ts with tests for empty transcript, invalid stdin, pressure budget, concurrent sessions

#### Chosen Approach

**Selected**: Created edge-cases.vitest.ts with tests for empty transcript, invalid stdin, pressure budget, concurrent sessions

**Rationale**: Created edge-cases.vitest.ts with tests for empty transcript, invalid stdin, pressure budget, concurrent sessions

#### Trade-offs

**Confidence**: 70%

<!-- /ANCHOR:decision-edgecasesvitestts-tests-empty-transcript-13a0fb1b -->

---

<!-- ANCHOR:decision-cocoindex-skillmd-ccc-tools-d887d9f1 -->
### Decision 10: Updated CocoIndex SKILL.md with ccc tools, search_patterns.md with freshness strategy

**Context**: Updated CocoIndex SKILL.md with ccc tools, search_patterns.md with freshness strategy

**Timestamp**: 2026-03-31T09:23:18.461Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Updated CocoIndex SKILL.md with ccc tools, search_patterns.md with freshness strategy

#### Chosen Approach

**Selected**: Updated CocoIndex SKILL.md with ccc tools, search_patterns.md with freshness strategy

**Rationale**: Updated CocoIndex SKILL.md with ccc tools, search_patterns.md with freshness strategy

#### Trade-offs

**Confidence**: 70%

<!-- /ANCHOR:decision-cocoindex-skillmd-ccc-tools-d887d9f1 -->

---

<!-- ANCHOR:decision-performance-benchmarks-pass-full-490184bf -->
### Decision 11: Performance benchmarks pass: full index under 500ms, incremental under 10ms

**Context**: Performance benchmarks pass: full index under 500ms, incremental under 10ms

**Timestamp**: 2026-03-31T09:23:18.461Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Performance benchmarks pass: full index under 500ms, incremental under 10ms

#### Chosen Approach

**Selected**: Performance benchmarks pass: full index under 500ms, incremental under 10ms

**Rationale**: Performance benchmarks pass: full index under 500ms, incremental under 10ms

#### Trade-offs

**Confidence**: 70%

<!-- /ANCHOR:decision-performance-benchmarks-pass-full-490184bf -->

---

<!-- /ANCHOR:decisions -->

<!-- ANCHOR:session-history -->
<a id="conversation"></a>

## 5. CONVERSATION

Complete timestamped dialogue capturing all user interactions, AI responses, tool executions, and code changes during the session.

This session followed a **Linear Sequential** conversation pattern with **1** phase segments across **1** unique phases.

##### Conversation Phases
- **Verification** - 6 actions
- **Discussion** - 6 actions
- **Planning** - 1 actions

---

### Message Timeline

> **User** | 2026-03-31 @ 10:23:18

Resolved remaining checklist items for spec 024-compact-code-graph, bringing completion from 83.5% to 96.5% (246 of 255). Implemented Wave 0 (DEFERRED markers), Wave 1 (4 parallel agents for code), plus documentation and edge case tests.

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
| Context Loss | Agent doesn't remember prior work | Run `/spec_kit:resume 02--system-spec-kit/024-compact-code-graph` |
| State Mismatch | Files don't match expected state | Verify with `git status` and `git diff` |
| Memory Not Found | Search returns no results | Check `memory_search({ specFolder: "02--system-spec-kit/024-compact-code-graph" })` |
| Stale Context | Information seems outdated | Check `last_accessed_epoch` vs current time |
| Incomplete Handover | Missing continuation context | Review CONTINUE SESSION section above |
| Dedup Collision | Wrong memory surfaced | Check `fingerprint_hash` for conflicts |

### Diagnostic Commands

```bash
# Check memory index health
node .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts --status

# List memories for this spec folder
memory_search({ specFolder: "02--system-spec-kit/024-compact-code-graph", limit: 10 })

# Verify memory file integrity
ls -la 02--system-spec-kit/024-compact-code-graph/memory/

# Check for orphaned memories
memory_search({ query: "orphaned", anchors: ["state"] })

# Force re-index of this spec folder
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js 02--system-spec-kit/024-compact-code-graph --force
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
session_id: "session-1774948998427-15d07f4dfff8"
spec_folder: "02--system-spec-kit/024-compact-code-graph"
channel: "system-speckit/024-compact-code-graph"

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
  fingerprint_hash: "3c80d5bcd30160cc65f3969ffa4d405cc3894e26"         # content hash for dedup detection
  similar_memories:

    []

# Causal Links (v2.2)
causal_links:
  caused_by:

    []

  supersedes:
    - "31-03-26_10-06__resolved-70-checklist-items-for-spec-024-compact"

  derived_from:
    - "31-03-26_10-06__resolved-70-checklist-items-for-spec-024-compact"

  blocks:

    []

  related_to:

    []

# Timestamps (for decay calculations)
created_at: "2026-03-31"
created_at_epoch: 1774948998
last_accessed_epoch: 1774948998
expires_at_epoch: 0  # 0 for critical (never expires)

# Session Metrics
message_count: 1
decision_count: 11
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
  - "shared.ts calculatepressureadjustedbudget"
  - "calculatepressureadjustedbudget helper"
  - "code-graph-db.ts gettokenusageratio"
  - "code-graph-context.ts latency"
  - "compact-inject.ts attention"
  - "session-stop.ts extraction"
  - "edge-cases.vitest.ts tests"
  - "gettokenusageratio helper"
  - "detection copilot/gemini"
  - "session-prime.ts token"
  - "performance benchmarks"
  - "extraction --finalize"

# Trigger Phrases (auto-extracted for fast <50ms matching)
trigger_phrases:
  - "get blocked"
  - "for empty"
  - "empty transcript"
  - "invalid stdin"
  - "calculate pressure adjusted budget"
  - "get token usage ratio"
  - "speckit auto compact detect"
  - "compact code graph"
  - "session prime"
  - "session stop"
  - "auto save"
  - "compact inject"
  - "code graph context"
  - "code graph db"
  - "edge cases"
  - "tree thinning"
  - "used claude"
  - "claude subagents"
  - "subagents wave"
  - "agents get"
  - "blocked gate"
  - "marked items deferred"
  - "deferred v2 items"
  - "spec 024 compact code graph"

key_files:
  - "mcp_server/hooks/claude/session-prime.ts"
  - "mcp_server/hooks/claude/session-stop.ts"
  - "mcp_server/hooks/claude/compact-inject.ts"
  - "mcp_server/hooks/claude/shared.ts"
  - "mcp_server/hooks/claude/hook-state.ts"
  - "mcp_server/lib/code-graph/code-graph-context.ts"
  - "mcp_server/lib/code-graph/code-graph-db.ts"
  - "mcp_server/tests/edge-cases.vitest.ts"
  - "mcp-coco-index/SKILL.md"
  - "mcp-coco-index/references/search_patterns.md"

# Relationships
related_sessions:

  []

parent_spec: "02--system-spec-kit/024-compact-code-graph"
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

