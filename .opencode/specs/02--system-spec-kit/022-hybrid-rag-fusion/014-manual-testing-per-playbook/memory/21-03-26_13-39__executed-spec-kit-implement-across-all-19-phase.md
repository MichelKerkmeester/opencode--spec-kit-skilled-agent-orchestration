---
title: "Executed Spec Kit [014-manual-testing-per-playbook/21-03-26_13-39__executed-spec-kit-implement-across-all-19-phase]"
description: "Executed spec kit:implement across all 19 phase folders using 20 agents (5 GPT-5.4 + 15 Sonnet) in...; Graph 0-hits root cause: eval code reinitialized hybrid search without..."
trigger_phrases:
  - "system spec kit/022 hybrid rag fusion/014 manual testing per playbook"
  - "sign issue"
  - "issue graph"
  - "no data available"
  - "speckit_shadow_scoring"
  - "post fusion"
  - "compatibility only"
  - "thin input"
  - "env var"
  - "graph 0-hits root cause"
  - "0-hits root cause eval"
  - "root cause eval code"
  - "cause eval code reinitialized"
  - "eval code reinitialized hybrid"
  - "k-sensitivity feed raw pre-fusion"
  - "feed raw pre-fusion per-channel"
  - "raw pre-fusion per-channel ranked"
  - "code reinitialized hybrid search"
  - "reinitialized hybrid search without"
  - "hybrid search without graph"
  - "pre-fusion per-channel ranked lists"
  - "per-channel ranked lists post-fusion"
  - "shadow-scoring canonical flag speckit"
  - "canonical flag speckit shadow"
  - "flag speckit shadow scoring"
  - "by-design items documented known"
  - "manual testing playbook execution"
  - "19 phase testing remediation"
importance_tier: "important"
contextType: "general"
_sourceTranscriptPath: ""
_sourceSessionId: ""
_sourceSessionCreated: 0
_sourceSessionUpdated: 0
captured_file_count: 10
filesystem_file_count: 10
git_changed_file_count: 0
quality_score: 1.00
quality_flags: []
spec_folder_health: {"pass":true,"score":0.9,"errors":0,"warnings":2}
---

# Executed Spec Kit Implement Across All 19 Phase Folders

## SESSION SUMMARY

| **Meta Data** | **Value** |
|:--------------|:----------|
| Session Date | 2026-03-21 |
| Session ID | session-1774096768051-c12d1d7757fe |
| Spec Folder | 02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook |
| Channel | main |
| Importance Tier | important |
| Context Type | decision |
| Total Messages | 1 |
| Tool Executions | 0 |
| Decisions Made | 5 |
| Follow-up Items Recorded | 0 |
| Created At | 2026-03-21 |
| Created At (Epoch) | 1774096768 |
| Last Accessed (Epoch) | 1774096768 |
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
| Session Status | COMPLETED |
| Completion % | 95% |
| Last Activity | 2026-03-21T12:39:28.039Z |
| Time in Session | 0m |
| Continuation Count | 1 |

### Context Summary

**Phase:** IMPLEMENTATION

**Recent:** isConstitutional logic confirmed correct at DB level via importance_tier check —, By-design items documented as known limitations: thin-input ABORT, NO_DATA_AVAIL, Next Steps

**Decisions:** 5 decisions recorded

**Summary:** Executed spec_kit:implement across all 19 phase folders using 20 agents (5 GPT-5.4 + 15 Sonnet) in...; Graph 0-hits root cause: eval code reinitialized hybrid search without graph fun; K-sensitivity m...

### Pending Work

- [ ] **T001**: Re-run phases 007 and 009 with SPECKIT_ABLATION=true to convert 10+ PARTIAL scenarios to PASS (Priority: P2)

### Quick Resume

**To continue this work, use:**
```
/spec_kit:resume 02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook
```

**Or paste this continuation prompt:**
```
CONTINUATION - Attempt 2
Spec: 02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook
Last: Next Steps
Next: Re-run phases 007 and 009 with SPECKIT_ABLATION=true to convert 10+ PARTIAL scenarios to PASS
```

**Key Context to Review:**

- Files modified: mcp_server/lib/search/graph-search-fn.ts, mcp_server/handlers/index.ts, mcp_server/handlers/eval-reporting.ts

- Check: plan.md, tasks.md, checklist.md

- Last: Next Steps

<!-- /ANCHOR:continue-session -->

---

<!-- ANCHOR:project-state-snapshot -->
<a id="project-state-snapshot"></a>

## PROJECT STATE SNAPSHOT

| Field | Value |
|-------|-------|
| Phase | RESEARCH |
| Active File | mcp_server/lib/search/graph-search-fn.ts |
| Last Action | Next Steps |
| Next Action | Re-run phases 007 and 009 with SPECKIT_ABLATION=true to convert 10+ PARTIAL scenarios to PASS |
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

**Key Topics:** `pre-fusion per-channel` | `reinitialized hybrid` | `eval reinitialized` | `k-sensitivity feed` | `per-channel ranked` | `fusion/014 manual` | `lists post-fusion` | `kit/022 hybrid` | `rag fusion/014` | `manual testing` | `search without` | `raw pre-fusion` |

<!-- /ANCHOR:project-state-snapshot -->

---

<!-- ANCHOR:task-guide -->
<a id="implementation-guide"></a>

## 1. IMPLEMENTATION GUIDE

**What Was Built**:

- **Executed spec_kit:implement across all 19 phase folders using 20 agents (5 GPT-5.4 + 15 Sonnet) in...** - Executed spec_kit:implement across all 19 phase folders using 20 agents (5 GPT-5.

**Key Files and Their Roles**:

- `mcp_server/lib/search/graph-search-fn.ts` - Modified graph search fn

- `mcp_server/handlers/index.ts` - Entry point / exports

- `mcp_server/handlers/eval-reporting.ts` - Modified eval reporting

- `mcp_server/lib/eval/k-value-analysis.ts` - Modified k value analysis

- `mcp_server/lib/search/hybrid-search.ts` - Modified hybrid search

- `mcp_server/schemas/tool-input-schemas.ts` - Modified tool input schemas

- `mcp_server/tool-schemas.ts` - Modified tool schemas

- `mcp_server/tests/handler-helpers.vitest.ts` - Modified handler helpers.vitest

**How to Extend**:

- Add new modules following the existing file structure patterns

- Create corresponding test files for new implementations

- Maintain consistent error handling approach

**Common Patterns**:

- No patterns identified

<!-- /ANCHOR:task-guide -->

---

<!-- ANCHOR:summary -->
<a id="overview"></a>

## 2. OVERVIEW

Executed spec_kit:implement across all 19 phase folders using 20 agents (5 GPT-5.4 + 15 Sonnet) in...; Graph 0-hits root cause: eval code reinitialized hybrid search without graph fun; K-sensitivity must feed raw pre-fusion per-channel ranked lists, not post-fusion

**Key Outcomes**:
- Executed spec_kit:implement across all 19 phase folders using 20 agents (5 GPT-5.4 + 15 Sonnet) in 4 waves. 209/209 scenarios verdicted: 153 PASS, 52 PARTIAL, 4 FAIL.
- Graph 0-hits root cause: eval code reinitialized hybrid search without graph function — fixed by wiring createUnifiedGraphSearchFn() into eval-reporting.ts
- K-sensitivity must feed raw pre-fusion per-channel ranked lists, not post-fusion output — rebuilt handler to collect raw channel results
- Shadow-scoring canonical flag is SPECKIT_SHADOW_SCORING (compatibility-only, feature retired) — aligned runtime, tests, and docs
- isConstitutional logic confirmed correct at DB level via importance_tier check — no code change needed
- By-design items documented as known limitations: thin-input ABORT, NO_DATA_AVAILABLE, MCP boolean serialization, env-var restart
- Next Steps: Re-run with SPECKIT_ABLATION=true, seed memories for phase 010, index flag docs for 019, create sandbox fixtures for 015

**Key Files:**

| **File** | **Description** |
|:---------|:----------------|
| `mcp_server/lib/search/(merged-small-files)` | Tree-thinning merged 2 small files (graph-search-fn.ts, hybrid-search.ts).  Merged from mcp_server/lib/search/graph-search-fn.ts : Modified graph search fn | Merged from mcp_server/lib/search/hybrid-search.ts : Modified hybrid search |
| `mcp_server/handlers/(merged-small-files)` | Tree-thinning merged 2 small files (index.ts, eval-reporting.ts).  Merged from mcp_server/handlers/index.ts : Modified index | Merged from mcp_server/handlers/eval-reporting.ts : Modified eval reporting |
| `mcp_server/lib/eval/(merged-small-files)` | Tree-thinning merged 2 small files (k-value-analysis.ts, shadow-scoring.ts).  Merged from mcp_server/lib/eval/k-value-analysis.ts : Modified k value analysis | Merged from mcp_server/lib/eval/shadow-scoring.ts : Modified shadow scoring |
| `mcp_server/schemas/(merged-small-files)` | Tree-thinning merged 1 small files (tool-input-schemas.ts).  Merged from mcp_server/schemas/tool-input-schemas.ts : Modified tool input schemas |
| `mcp_server/(merged-small-files)` | Tree-thinning merged 1 small files (tool-schemas.ts).  Merged from mcp_server/tool-schemas.ts : Modified tool schemas |
| `mcp_server/tests/(merged-small-files)` | Tree-thinning merged 1 small files (handler-helpers.vitest.ts).  Merged from mcp_server/tests/handler-helpers.vitest.ts : Modified handler helpers.vitest |
| `scripts/utils/(merged-small-files)` | Tree-thinning merged 1 small files (source-capabilities.ts).  Merged from scripts/utils/source-capabilities.ts : Modified source capabilities |

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:detailed-changes -->
<a id="detailed-changes"></a>

## 3. DETAILED CHANGES

<!-- ANCHOR:implementation-executed-speckitimplement-across-all-ab0269c4 -->
### FEATURE: Executed spec_kit:implement across all 19 phase folders using 20 agents (5 GPT-5.4 + 15 Sonnet) in...

Executed spec_kit:implement across all 19 phase folders using 20 agents (5 GPT-5.4 + 15 Sonnet) in 4 sequential waves. Results: 209/209 scenarios verdicted — 153 PASS, 52 PARTIAL, 4 FAIL. Then fixed all discovered issues across 4 waves: Wave 1 applied 3 critical code fixes (graph FTS5 Math.abs, pe-gating barrel re-exports, source-capabilities MODULE header). Wave 2 fixed 5 playbook documentation errors (channel enums vector/bm25, script path, field names, tier value, aggregate counts). Wave 3 implemented 2 features (FUT-5 K-sensitivity reporting endpoint with formatKValueReport, Sprint3 trace field enrichment with routing.confidence, truncation.medianGap, tokenBudget.configValues). GPT-5.4 ultra-think review identified 5 findings: graph root cause was eval init without graph function not FTS5 score sign, K-sensitivity schema gap and wrong data source, test migration incomplete, shadow-scoring flag drift. GPT-5.4 agent fixed all 5 with 264 tests passing.

<!-- /ANCHOR:implementation-executed-speckitimplement-across-all-ab0269c4 -->

<!-- ANCHOR:guide-next-steps-7e5b0c6b -->
### FOLLOWUP: Next Steps

Re-run phases 007 and 009 with SPECKIT_ABLATION=true to convert 10+ PARTIAL scenarios to PASS Seed indexed memories in 022-hybrid-rag-fusion spec folder for phase 010 re-test Index flag reference documentation for phase 019 re-test Create disposable sandbox fixtures for phase 015 scenarios 058 and 060

**Details:** Next: Re-run phases 007 and 009 with SPECKIT_ABLATION=true to convert 10+ PARTIAL scenarios to PASS | Follow-up: Seed indexed memories in 022-hybrid-rag-fusion spec folder for phase 010 re-test | Follow-up: Index flag reference documentation for phase 019 re-test | Follow-up: Create disposable sandbox fixtures for phase 015 scenarios 058 and 060
<!-- /ANCHOR:guide-next-steps-7e5b0c6b -->

<!-- /ANCHOR:detailed-changes -->

---

<!-- ANCHOR:decisions -->
<a id="decisions"></a>

## 4. DECISIONS

<!-- ANCHOR:decision-graph-0hits-root-cause-6597063f -->
### Decision 1: Graph 0-hits root cause: eval code reinitialized hybrid search without graph function, not FTS5 score sign issue

**Context**: Graph 0-hits root cause: eval code reinitialized hybrid search without graph function, not FTS5 score sign issue

**Timestamp**: 2026-03-21T12:39:28.085Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Graph 0-hits root cause: eval code reinitialized hybrid s...

#### Chosen Approach

**Selected**: Graph 0-hits root cause: eval code reinitialized hybrid s...

**Rationale**: Graph 0-hits root cause: eval code reinitialized hybrid search without graph function, not FTS5 score sign issue

#### Trade-offs

**Confidence**: 90%

<!-- /ANCHOR:decision-graph-0hits-root-cause-6597063f -->

---

<!-- ANCHOR:decision-ksensitivity-feed-raw-prefusion-db102248 -->
### Decision 2: K-sensitivity must feed raw pre-fusion per-channel ranked lists, not post-fusion output

**Context**: K-sensitivity must feed raw pre-fusion per-channel ranked lists, not post-fusion output

**Timestamp**: 2026-03-21T12:39:28.085Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   K-sensitivity must feed raw pre-fusion per-channel ranked...

#### Chosen Approach

**Selected**: K-sensitivity must feed raw pre-fusion per-channel ranked...

**Rationale**: K-sensitivity must feed raw pre-fusion per-channel ranked lists, not post-fusion output

#### Trade-offs

**Confidence**: 90%

<!-- /ANCHOR:decision-ksensitivity-feed-raw-prefusion-db102248 -->

---

<!-- ANCHOR:decision-shadowscoring-canonical-flag-speckitshadowscoring-124bb42f -->
### Decision 3: Shadow-scoring canonical flag is SPECKIT_SHADOW_SCORING (compatibility-only, feature retired)

**Context**: Shadow-scoring canonical flag is SPECKIT_SHADOW_SCORING (compatibility-only, feature retired)

**Timestamp**: 2026-03-21T12:39:28.085Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Shadow-scoring canonical flag is SPECKIT_SHADOW_SCORING (...

#### Chosen Approach

**Selected**: Shadow-scoring canonical flag is SPECKIT_SHADOW_SCORING (...

**Rationale**: Shadow-scoring canonical flag is SPECKIT_SHADOW_SCORING (compatibility-only, feature retired)

#### Trade-offs

**Confidence**: 90%

<!-- /ANCHOR:decision-shadowscoring-canonical-flag-speckitshadowscoring-124bb42f -->

---

<!-- ANCHOR:decision-isconstitutional-logic-confirmed-correct-3b328a76 -->
### Decision 4: isConstitutional logic confirmed correct at DB level via importance_tier check

**Context**: isConstitutional logic confirmed correct at DB level via importance_tier check

**Timestamp**: 2026-03-21T12:39:28.085Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   isConstitutional logic confirmed correct at DB level via ...

#### Chosen Approach

**Selected**: isConstitutional logic confirmed correct at DB level via ...

**Rationale**: no code change needed

#### Trade-offs

**Confidence**: 90%

<!-- /ANCHOR:decision-isconstitutional-logic-confirmed-correct-3b328a76 -->

---

<!-- ANCHOR:decision-bydesign-items-documented-known-63f81dd0 -->
### Decision 5: By-design items documented as known limitations: thin-input ABORT, NO_DATA_AVAILABLE with active session, MCP boolean serialization, env-var restart requirement

**Context**: By-design items documented as known limitations: thin-input ABORT, NO_DATA_AVAILABLE with active session, MCP boolean serialization, env-var restart requirement

**Timestamp**: 2026-03-21T12:39:28.086Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   By-design items documented as known limitations: thin-inp...

#### Chosen Approach

**Selected**: By-design items documented as known limitations: thin-inp...

**Rationale**: By-design items documented as known limitations: thin-input ABORT, NO_DATA_AVAILABLE with active session, MCP boolean serialization, env-var restart requirement

#### Trade-offs

**Confidence**: 90%

<!-- /ANCHOR:decision-bydesign-items-documented-known-63f81dd0 -->

---

<!-- /ANCHOR:decisions -->

<!-- ANCHOR:session-history -->
<a id="conversation"></a>

## 5. CONVERSATION

Complete timestamped dialogue capturing all user interactions, AI responses, tool executions, and code changes during the session.

This session followed a **Linear Sequential** conversation pattern with **1** phase segments across **1** unique phases.

##### Conversation Phases
- **Verification** - 3 actions
- **Discussion** - 3 actions
- **Planning** - 1 actions

---

### Message Timeline

> **User** | 2026-03-21 @ 13:39:28

Executed spec_kit:implement across all 19 phase folders using 20 agents (5 GPT-5.4 + 15 Sonnet) in 4 sequential waves. Results: 209/209 scenarios verdicted — 153 PASS, 52 PARTIAL, 4 FAIL. Then fixed all discovered issues across 4 waves: Wave 1 applied 3 critical code fixes (graph FTS5 Math.abs, pe-gating barrel re-exports, source-capabilities MODULE header). Wave 2 fixed 5 playbook documentation errors (channel enums vector/bm25, script path, field names, tier value, aggregate counts). Wave 3 implemented 2 features (FUT-5 K-sensitivity reporting endpoint with formatKValueReport, Sprint3 trace field enrichment with routing.confidence, truncation.medianGap, tokenBudget.configValues). GPT-5.4 ultra-think review identified 5 findings: graph root cause was eval init without graph function not FTS5 score sign, K-sensitivity schema gap and wrong data source, test migration incomplete, shadow-scoring flag drift. GPT-5.4 agent fixed all 5 with 264 tests passing.

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
| Context Loss | Agent doesn't remember prior work | Run `/spec_kit:resume 02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook` |
| State Mismatch | Files don't match expected state | Verify with `git status` and `git diff` |
| Memory Not Found | Search returns no results | Check `memory_search({ specFolder: "02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook" })` |
| Stale Context | Information seems outdated | Check `last_accessed_epoch` vs current time |
| Incomplete Handover | Missing continuation context | Review CONTINUE SESSION section above |
| Dedup Collision | Wrong memory surfaced | Check `fingerprint_hash` for conflicts |

### Diagnostic Commands

```bash
# Check memory index health
node .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts --status

# List memories for this spec folder
memory_search({ specFolder: "02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook", limit: 10 })

# Verify memory file integrity
ls -la 02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/memory/

# Check for orphaned memories
memory_search({ query: "orphaned", anchors: ["state"] })

# Force re-index of this spec folder
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js 02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook --force
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

---

<!-- ANCHOR:metadata -->
<a id="memory-metadata"></a>

## MEMORY METADATA

> **Machine-Readable Section** - This YAML block is parsed by the semantic memory indexer for search optimization and decay calculations.

```yaml
# Core Identifiers
session_id: "session-1774096768051-c12d1d7757fe"
spec_folder: "02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook"
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
  fingerprint_hash: "0925260cb27825b22d6fff3b873d8c9764976ffc"         # content hash for dedup detection
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
created_at: "2026-03-21"
created_at_epoch: 1774096768
last_accessed_epoch: 1774096768
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
  - "pre-fusion per-channel"
  - "reinitialized hybrid"
  - "eval reinitialized"
  - "k-sensitivity feed"
  - "per-channel ranked"
  - "fusion/014 manual"
  - "lists post-fusion"
  - "kit/022 hybrid"
  - "rag fusion/014"
  - "manual testing"
  - "search without"
  - "raw pre-fusion"

# Trigger Phrases (auto-extracted for fast <50ms matching)
trigger_phrases:
  - "system spec kit/022 hybrid rag fusion/014 manual testing per playbook"
  - "sign issue"
  - "issue graph"
  - "no data available"
  - "speckit_shadow_scoring"
  - "post fusion"
  - "compatibility only"
  - "thin input"
  - "env var"
  - "graph 0-hits root cause"
  - "0-hits root cause eval"
  - "root cause eval code"
  - "cause eval code reinitialized"
  - "eval code reinitialized hybrid"
  - "k-sensitivity feed raw pre-fusion"
  - "feed raw pre-fusion per-channel"
  - "raw pre-fusion per-channel ranked"
  - "code reinitialized hybrid search"
  - "reinitialized hybrid search without"
  - "hybrid search without graph"
  - "pre-fusion per-channel ranked lists"
  - "per-channel ranked lists post-fusion"
  - "shadow-scoring canonical flag speckit"
  - "canonical flag speckit shadow"
  - "flag speckit shadow scoring"
  - "by-design items documented known"
  - "manual testing playbook execution"
  - "19 phase testing remediation"

key_files:
  - "mcp_server/lib/search/graph-search-fn.ts"
  - "mcp_server/handlers/index.ts"
  - "mcp_server/handlers/eval-reporting.ts"
  - "mcp_server/lib/eval/k-value-analysis.ts"
  - "mcp_server/lib/search/hybrid-search.ts"
  - "mcp_server/schemas/tool-input-schemas.ts"
  - "mcp_server/tool-schemas.ts"
  - "mcp_server/tests/handler-helpers.vitest.ts"
  - "mcp_server/lib/eval/shadow-scoring.ts"
  - "scripts/utils/source-capabilities.ts"

# Relationships
related_sessions:

  []

parent_spec: "02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook"
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

