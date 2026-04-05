---
title: "Feature Specification [system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/082-speckit-reimagined/spec]"
description: "SpecKit Reimagined synthesizes findings from 25 parallel agent analyses of 8 pre-analysis documents examining dotmd, seu-claude, drift, and system-speckit architectures. This sp..."
trigger_phrases:
  - "feature"
  - "specification"
  - "speckit"
  - "reimagined"
  - "spec"
  - "082"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: SpecKit Reimagined

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.0 -->

---

<!-- ANCHOR:metadata -->
## EXECUTIVE SUMMARY

SpecKit Reimagined synthesizes findings from 25 parallel agent analyses of 8 pre-analysis documents examining dotmd, seu-claude, drift, and system-speckit architectures. This specification defines 15 P0 blockers (10 original + 5 embedding resilience), 18 P1 requirements, and establishes a unified 6-7 week implementation roadmap to transform SpecKit into a best-in-class memory system with hybrid search, causal graphs, embedding resilience, and self-improvement capabilities.

> **[AUDIT 2026-02-01]:** Timeline corrected from 11 weeks to 6-7 weeks based on critical path analysis. Original estimate included redundant parallel work (Wave 3 could leverage foundations from Waves 1-2) and overestimated dependencies. RRF fusion, composite scoring, and FSRS already exist in codebase, reducing new implementation effort. See tasks.md for detailed breakdown.

**Key Decisions**: Adopt drift's session deduplication + type-specific half-lives, enhance dotmd's RRF fusion with convergence bonus, maintain SpecKit's ANCHOR format for token efficiency, and implement defense-in-depth embedding resilience (ADR-009).

**Critical Dependencies**: Session deduplication (blocks token savings), causal graph (prerequisite for "why" queries), embedding fallback chain (blocks memory save reliability). Note: Lazy loading and RRF fusion foundations already exist in codebase.

---

<!-- /ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-02-01 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

SpecKit currently lacks critical capabilities present in competitor systems: no graph traversal (dotmd has 2-hop + LadybugDB), no session deduplication (drift achieves 8-16x token savings), no type-specific memory half-lives (drift has 9 types), and no causal relationship tracking (drift has 8 relationship types). These gaps result in 25-35% excess token usage and inability to answer "why" queries about decision lineage.

**Current State (validated via codebase analysis):**
- Lazy embedding provider EXISTS (`shared/embeddings.js` singleton pattern), but uses eager warmup
- RRF fusion EXISTS (`lib/search/rrf-fusion.js`), but needs enhancement for convergence bonus
- Hybrid search with FTS5 EXISTS (`lib/search/hybrid-search.js`)
- Composite scoring EXISTS with 6 factors (`lib/scoring/composite-scoring.js`)
- FSRS integration EXISTS (`lib/cognitive/attention-decay.js`)

**Gaps requiring new implementation:**
- Session deduplication (no current implementation)
- Type-specific half-lives (column exists but no type inference)
- Causal graph relationships (no current implementation)
- 5-state memory model (thresholds not yet defined)
- Recovery hints catalog (error handling is basic)

### Purpose

Transform SpecKit into a self-improving memory system with hybrid search (vector + BM25 + graph), session deduplication, causal lineage tracking, and multi-factor decay scoring, achieving 40-50% relevance improvement and 50% token reduction on follow-up queries.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- P0: Session deduplication, type-specific half-lives, lazy model loading, recovery hints, usage boost, intent-aware retrieval, tool output caching
- P0 (new): Length penalty in reranking, recovery hints catalog, 5-state memory model
- P1: RRF search fusion, causal memory graph, cross-encoder reranking, BM25 hybrid search, learning from corrections, crash recovery, multi-factor decay, query expansion, standardized response structure, layered tool organization, protocol abstractions, consolidation pipeline
- P1 (new): Incremental indexing, pre-flight quality gates, CONTINUE_SESSION.md, corrections tracking, fuzzy acronym matching, BM25-WASM
- Migration strategy with feature flags for non-breaking deployment

### Out of Scope

- Full hexagonal architecture (P3 - over-engineering for current scale)
- Graph database migration to LadybugDB (only if >10K nodes)
- Self-correction learning (P4 - LOW impact, HIGH effort)
- Per-layer token budgets (P2 - after layered tools complete)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/lib/search/vector-index.js` | Modify | Add RRF fusion, BM25 integration |
| `mcp_server/lib/cognitive/attention-decay.js` | Modify | Multi-factor decay, type-specific half-lives |
| `mcp_server/lib/storage/sessions.js` | Create | Session deduplication manager |
| `mcp_server/lib/storage/causal-edges.js` | Create | Causal relationship tracking |
| `mcp_server/server.js` | Modify | Lazy model loading, layered tools |
| `mcp_server/database/schema.sql` | Modify | v4.1 and v5 migrations |

<!-- /ANCHOR:scope -->
---

## SKILL TRIGGERS

The following phrases and patterns should trigger SpecKit skill loading and specific behaviors:

### Spec Folder Creation

| Trigger Pattern | Action | Gate |
|-----------------|--------|------|
| "create spec folder" | Initialize L1-L3+ structure based on scope | Gate 1 |
| "new spec", "start spec" | Prompt for spec folder options (A/B/C/D) | Gate 1 |
| "document this", "track this work" | Evaluate if spec folder needed | Gate 1 |

### Memory & Context

| Trigger Pattern | Action | Gate |
|-----------------|--------|------|
| "save context", "save memory" | Run generate-context.js with spec folder | Post-exec |
| "/memory:save" | Explicit memory save command | Post-exec |
| "remember this", "save for later" | Evaluate context save appropriateness | Post-exec |

### Session Continuity

| Trigger Pattern | Action | Gate |
|-----------------|--------|------|
| "resume work on [spec]" | Load memory with anchors (summary, state, next-steps) | Gate 2 |
| "continue [spec name]" | Surface relevant context via memory_search | Gate 2 |
| "/spec_kit:resume" | Explicit resume command | Gate 2 |

### Validation & Completion

| Trigger Pattern | Action | Gate |
|-----------------|--------|------|
| "validate spec", "check spec" | Run validation script if exists | Pre-completion |
| "complete task", "mark done" | Load checklist.md, verify items, require evidence | Post-exec |
| "I'm done", "finished" | Trigger completion verification rule | Post-exec |

### Debug & Escalation

| Trigger Pattern | Action | Gate |
|-----------------|--------|------|
| "stuck", "tried 3+ times" | Suggest /spec_kit:debug delegation | HALT |
| "need fresh perspective" | Route to debug agent | HALT |
| "end session", "stopping" | Suggest /spec_kit:handover | Session end |

> **Note:** These triggers align with the Gate system defined in AGENTS.md. Gate 1 triggers are evaluated FIRST before any file modifications. Gate 2 triggers surface context for understanding.

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Session Deduplication | Hash-based duplicate prevention achieves -50% tokens on follow-up queries |
| REQ-002 | Type-Specific Half-Lives | 9 memory types configured with distinct decay rates; +20% tier accuracy |
| REQ-003 | Lazy Embedding Model Loading | Defer eager warmup to first use; MCP startup <500ms (currently 2-3s due to warmup) |
| REQ-004 | Recovery Hints in Errors | Error catalog with actionable recovery guidance; zero runtime cost |
| REQ-005 | Usage Boost to Decay | Frequently-accessed memories get +15% relevance boost |
| REQ-006 | Intent-Aware Retrieval | Query classification routes to task-specific weights |
| REQ-007 | Tool Output Caching | Session-scoped cache achieves -60% redundant API calls |
| REQ-008 | Length Penalty in Reranking | Short content (<100 chars) receives 0.8-1.0x penalty to prevent artificial high scores |
| REQ-009 | Recovery Hints Catalog | Complete error-to-hint mapping for memory_search, checkpoint_restore, memory_save |
| REQ-010 | 5-State Memory Model | HOT/WARM/COLD/DORMANT/ARCHIVED states with threshold-based transitions |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-011 | RRF Search Fusion | Enhance existing RRF with 10% convergence bonus for multi-source results; +40-50% relevance |
| REQ-012 | Causal Memory Graph | causal_edges table with 6 relationship types; "why" query support |
| REQ-013 | Cross-Encoder Reranking | Top-20 reranking via configurable cross-encoder (e.g., Voyage, Cohere); precision improvement |
| REQ-014 | BM25 Hybrid Search | FTS5 + vector combination in RRF |
| REQ-015 | Learning from Corrections | Feedback loop with 0.5x stability penalty for corrected memories |
| REQ-016 | Crash Recovery Pattern | Immediate SQLite saves; zero data loss on crash |
| REQ-017 | Multi-Factor Decay Composite | 5-factor scoring: temporal, usage, importance, pattern, citation |
| REQ-018 | Query Expansion + Fuzzy Match | Typo tolerance via Levenshtein distance (max 2) |
| REQ-019 | Standardized Response Structure | Envelope: summary, data, hints, meta |
| REQ-020 | Layered Tool Organization | L1-L5 structure with progressive disclosure |
| REQ-021 | Protocol Abstractions | IVectorStore, IEmbeddingProvider interfaces |
| REQ-022 | Consolidation Pipeline | 5-phase: REPLAY, ABSTRACT, INTEGRATE, PRUNE, STRENGTHEN |
| REQ-023 | Incremental Indexing | Content hash + mtime check; 10-100x faster re-indexing |
| REQ-024 | Pre-Flight Quality Gates | Validation before expensive operations |
| REQ-025 | CONTINUE_SESSION.md | Human-readable session state file |
| REQ-026 | Corrections Tracking Schema | memory_corrections table with penalty application |
| REQ-027 | Fuzzy Acronym Matching | ACRONYM_MAP with Levenshtein fuzzy lookup |
| REQ-028 | BM25-WASM Implementation | 5-10x faster BM25 with pure JS fallback |

### P0 - Embedding Resilience (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-029 | Pre-Flight API Key Validation | Embedding provider API key validated at MCP startup; invalid key causes startup failure with actionable error message |
| REQ-030 | Fallback Embedding Provider Chain | Ordered fallback: Primary API → Local (nomic-embed-text) → BM25-only mode; each step logged with reason |
| REQ-031 | Deferred Indexing on Embedding Failure | Memory saved with `embedding_status: 'pending'`; searchable via BM25/FTS5; background retry when provider available |
| REQ-032 | Retry Logic with Exponential Backoff | 3 retries with backoff (1s, 2s, 4s) for transient failures (5xx, timeouts); permanent failures (401, 403) fail fast |
| REQ-033 | Memory Save Atomicity | File creation atomic with index insert; rollback file on indexing failure OR mark with `_pending` suffix for retry |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Search relevance improvement +40% (via user feedback sampling)
- **SC-002**: MCP startup time <500ms (from current 2-3s baseline)
- **SC-003**: Token savings -50% on follow-up queries (session deduplication)
- **SC-004**: Intent match rate +20% (query classification accuracy)
- **SC-005**: Query latency P95 <150ms (from ~200ms baseline)
- **SC-006**: Cache hit rate 50% (session-scoped caching)
- **SC-007**: "Why" query coverage 60% (memories with causal links)
- **SC-008**: Decay curve adherence unit test validated
- **SC-009**: Duplicate rate in results <5% (from ~20% baseline)
- **SC-010**: Tokens per search configurable via compression tiers

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | R1: Cross-encoder latency/cost | Medium | Optional, limit to 20 candidates, cache results |
| Risk | R2: Cache invalidation bugs | High | Conservative 60s TTL, invalidate on write |
| Risk | R3: Half-life misconfiguration | High | Document defaults, provide reset command, dry-run mode |
| Risk | R4: RRF tuning complexity | Medium | Ship with k=60 default, iterate post-baseline |
| Risk | R5: Graph scaling beyond 10K nodes | Medium | Index heavily, consider LadybugDB migration path |
| Risk | R6: Learning system errors/bias | Medium | Feature flag, allow undo of corrections |
| Risk | R7: Session state overhead | Low | 30min TTL, cap at 100 entries per session |
| Risk | R8: Breaking changes in schema v5 | Medium | Version schema, defaults preserve compatibility |
| Dependency | Lazy model loading | Blocks MCP cold-start improvement | Prioritize in Phase 1 |
| Dependency | RRF implementation | Required before cross-encoder reranking | Phase 2 prerequisite |
| Dependency | Type-specific half-lives | Required before multi-factor decay | Phase 1 then Phase 2 |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:requirements -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: MCP startup time <500ms (cold start)
- **NFR-P02**: Query latency P95 <150ms
- **NFR-P03**: Cross-encoder reranking P95 <500ms (or disable)

### Security

- **NFR-S01**: No secrets in memory content (validation gate)
- **NFR-S02**: Session isolation (no cross-session data leakage)

### Reliability

- **NFR-R01**: Zero data loss on crash (immediate SQLite saves)
- **NFR-R02**: Graceful degradation when embedding API unavailable
- **NFR-R03**: Embedding provider failures must not block memory saves; deferred indexing with `embedding_status: 'pending'`
- **NFR-R04**: API key validation at startup with actionable error messages; fail-fast on invalid credentials
- **NFR-R05**: Fallback chain must complete within 100ms of primary failure detection; no cascading delays

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries

- Empty query: Return top memories by attention score
- Query >10000 chars: Return E040 error with truncation hint
- Zero search results: Suggest query expansion or broader anchors

### Error Scenarios

- Embedding API failure: Fall back to BM25-only search
- Cross-encoder timeout: Skip reranking, return RRF results
- Database corruption: Restore from checkpoint, warn user

### Embedding Provider Edge Cases

- **Invalid API key at startup**: MCP startup fails with E050 error; actionable message: "Embedding API key invalid. Verify key with your provider (e.g., voyage.ai/dashboard, openai.com/api-keys)"
- **Invalid API key at runtime**: Trigger fallback chain immediately; log warning with E051 code
- **All providers fail**: Save memory file with `embedding_status: 'failed'`; searchable via BM25; surface warning in memory_save response
- **Local model unavailable**: Skip to BM25-only mode; log E052 with instructions for installing nomic-embed-text
- **Partial embedding failure**: Retry failed chunks up to 3x; if still failing, save with `embedding_status: 'partial'`
- **Network timeout during embedding**: Apply 30s timeout per request; trigger fallback after 2 consecutive timeouts

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Files: 15+, LOC: 2000+, Systems: 4 (search, decay, session, graph) |
| Risk | 20/25 | Auth: N, API: Y (embedding, reranking), Breaking: Y (schema v5) |
| Research | 18/20 | 8 source documents, 25-agent analysis, 4 competitor systems |
| Multi-Agent | 12/15 | Workstreams: 3 (search, decay, persistence) |
| Coordination | 13/15 | Dependencies: 5 (RRF→rerank, types→decay, lazy→startup, etc.) |
| **Total** | **85/100** | **Level 3+ justified** |

<!-- /ANCHOR:complexity -->
---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Cross-encoder adds >500ms latency | High | Medium | Disable if P95 exceeds threshold |
| R-002 | Cache invalidation causes stale results | High | Low | Conservative TTL, write-through invalidation |
| R-003 | Half-life misconfiguration breaks decay | High | Medium | Reset command, documented defaults |
| R-004 | RRF k parameter poorly tuned | Medium | Medium | Start with k=60 industry standard |
| R-005 | Graph grows beyond SQLite performance | Medium | Low | Monitor node count, LadybugDB migration path |
| R-006 | Learning loop amplifies bias | Medium | Low | Feature flag, manual override, audit log |
| R-007 | Session state memory overhead | Low | Low | 30min TTL, 100-entry cap |
| R-008 | Schema migration breaks existing data | Medium | Low | Version field, backwards-compatible defaults |
| R-009 | Embedding API single-provider dependency | Medium | Medium | Fallback chain: Primary API → Local → BM25-only; IEmbeddingProvider interface for swapping |
| R-009-A | API key invalid at runtime (not startup) | High | Medium | Pre-flight validation at MCP startup; fail-fast with actionable error |
| R-009-B | Transient API failures (5xx, timeouts) | Medium | High | Retry with exponential backoff (1s, 2s, 4s); max 3 attempts before fallback |
| R-009-C | Memory save fails due to embedding failure | High | Medium | Deferred indexing: save file with `embedding_status: 'pending'`; BM25-searchable immediately |
| R-010 | Test coverage gaps lead to regressions | High | Medium | Unit tests for core algorithms, integration tests per phase |
| R-011 | Cognitive load from increased complexity | Medium | Medium | Clear documentation, layered architecture, progressive disclosure |
| R-012 | Feature flag proliferation creates confusion | Low | Medium | Feature flag registry, sunset policy, default-on after validation |
| R-013 | Scope creep extends timeline beyond 7 weeks | High | Medium | Strict phase gates, defer P2 items aggressively |
| R-014 | Consolidation pipeline causes data loss | High | Low | Dry-run mode, backup before prune, undo capability |

---

## 11. USER STORIES

### US-001: Session Deduplication (Priority: P0)

**As a** developer using SpecKit, **I want** memories already surfaced in this session to not repeat, **so that** I save tokens and avoid redundant context.

**Acceptance Criteria**:
1. Given a session with 5 surfaced memories, When I search again, Then those 5 are excluded from results
2. Given deduplication enabled, When a follow-up query runs, Then token count is reduced by ~50%

### US-002: Causal Lineage Query (Priority: P1)

**As a** developer debugging a decision, **I want** to trace why a memory was created, **so that** I understand the decision history.

**Acceptance Criteria**:
1. Given a memory with causal links, When I call `memory_drift_why(id)`, Then I see caused_by, enabled_by, supersedes relationships
2. Given max depth of 3, When causal chain exceeds 3 hops, Then traversal stops and indicates maxDepthReached

---

## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | Tech Lead | Pending | - |
| Architecture Review | System Architect | Pending | - |
| Implementation Review | Senior Engineer | Pending | - |
| Launch Approval | Product Owner | Pending | - |

---

## 13. COMPLIANCE CHECKPOINTS

### Security Compliance

- [ ] Security review completed for session isolation
- [ ] No secrets stored in memory content (validation gate)
- [ ] Data protection requirements met (SQLite encryption optional)

### Code Compliance

- [ ] Coding standards followed (ESLint, JSDoc)
- [ ] License compliance verified (MIT for all new dependencies)

---

## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Developer Users | End User | High | Release notes, migration guide |
| OpenCode Team | Engineering | High | Daily standup, PR reviews |
| Product Owner | Product | High | Weekly sync, milestone demos |
| Community | External | Medium | GitHub issues, documentation |

---

## 15. CHANGE LOG

### v1.0 (2026-02-01)

**Initial specification**
- Synthesized 25-agent analysis of 8 source documents
- Defined 15 P0 requirements (10 core + 5 embedding resilience)
- Defined 18 P1 requirements (12 original + 6 from Section 11)
- Established 6-7 week implementation roadmap across 4 phases (revised from initial 11-week estimate)
- Documented 14 risks with mitigation strategies (R-001 to R-014)
- Set 10 KPIs for success measurement

### v1.1 (2026-02-01)

**Documentation accuracy fixes (20-agent audit)**
- Fixed inaccurate claims: RRF fusion, composite scoring, FSRS already exist in codebase
- Harmonized causal relationship types to 6 (was inconsistently 6/8 across documents)
- Updated timeline references to 11 weeks consistently
- Updated P0 requirement count from 10 to 15 to include embedding resilience

### v1.2 (2026-02-01)

**20-agent analysis findings**
- Added Section 17 with template/command improvement plans, competitor patterns, new command recommendations

---

<!-- ANCHOR:questions -->
## 16. OPEN QUESTIONS

| ID | Question | Category | Recommended Default |
|----|----------|----------|---------------------|
| Q1 | How to populate `memory_type` automatically? | Data | Infer from file path + frontmatter fallback |
| Q2 | What RRF k parameter works best? | Tuning | k=60 (industry standard), tune after baseline |
| Q3 | Cross-encoder selection: which provider? | Infra | Configurable; Voyage rerank-2 recommended for code/technical |
| Q4 | Causal extraction: manual or automatic? | Data | Automatic with manual override |
| Q5 | Consolidation threshold: 2+ or 3+ occurrences? | Tuning | 2+ (catch more patterns early) |
| Q6 | Graph database: SQLite relations vs LadybugDB? | Infra | SQLite (simpler, sufficient for current scale) |
| Q7 | Where to source learning training data? | Data | Existing memory files as seed |
| Q8 | Are drift's half-life values appropriate for SpecKit? | Tuning | Test drift defaults first, iterate |

<!-- /ANCHOR:questions -->
---

## 17. 20-AGENT ANALYSIS FINDINGS

> **Date:** 2026-02-01
> **Methodology:** 20 parallel agents analyzing template, commands, and competitor systems

### 17.1 Competitor Patterns Adopted

| System | Pattern | Priority | Expected Impact |
|--------|---------|----------|-----------------|
| drift | Session deduplication | P0 | -50% tokens on follow-up queries |
| drift | 9 memory types with type-specific half-lives | P0 | +20% decay accuracy |
| drift | Multi-factor decay (5 factors) | P1 | +30-40% relevance improvement |
| drift | Causal memory graph (6 relationship types) | P1 | "Why" query support |
| seu-claude | CONTINUE_SESSION.md | P0 | Session recovery from crashes/compaction |
| seu-claude | Immediate SQLite saves | P1 | Crash resilience |
| dotmd | RRF fusion with k=60 | Existing | Already implemented in codebase |

### 17.2 Template Improvements Planned

**Target:** `.opencode/skill/system-spec-kit/templates/context_template.md`

| Priority | Section/Field | Purpose |
|----------|---------------|---------|
| P0 | CONTINUE_SESSION section | Enable session recovery after context compaction/crashes |
| P0 | session_dedup metadata | Track surfaced memories, prevent repetition within session |
| P0 | memory_classification fields | Type + half-life for type-specific decay calculations |
| P1 | causal_links metadata | Decision lineage, "why" query support |
| P1 | RECOVERY HINTS section | Self-service error resolution guidance |

### 17.3 Command Documentation Planned

**Target:** `.opencode/command/memory/save.md`

| Priority | Addition | Purpose |
|----------|----------|---------|
| P0 | Phase 0: Pre-flight Validation | ANCHOR format, duplicates, token budget checks |
| P0 | §16 Session Deduplication | How dedup works, metadata fields, impact |
| P1 | Deferred Indexing docs | Graceful degradation when embedding fails |
| P1 | Structured Response Envelope | Return format with summary, data, hints, meta |

### 17.4 New Commands Recommended

| Command | Purpose | Priority |
|---------|---------|----------|
| `/memory:continue` | Session recovery from crash/compaction | P0 |
| `/memory:context` | Unified entry with intent awareness | P0 |
| `/memory:why` | Decision lineage tracing | P1 |
| `/memory:correct` | Learning from mistakes | P1 |
| `/memory:learn` | Explicit learning capture | P1 |

### 17.5 Documentation Accuracy Fixes Applied

Fixes already applied to this spec folder during analysis:

1. **feature-summary.md**: Corrected Features 1, 8, 9 to acknowledge existing implementations (RRF, composite, tier-classifier)
2. **tasks.md**: Added audit note about existing implementations, revised timeline to ~6-7 weeks
3. **All spec files**: Made embedding-provider agnostic (17 changes across 7 files)

---

## 18. TEST DOCUMENTATION

> **Consolidated:** 2026-02-02 from 083-speckit-reimagined-test-suite

Test planning and coverage documentation is consolidated in the `tests/` subdirectory:

| Document | Purpose |
|----------|---------|
| `tests/README.md` | Overview and quick reference |
| `tests/test-coverage-matrix.md` | Task-to-test mapping for 107 tasks |
| `tests/test-implementation-guide.md` | Test patterns, mocking, templates |
| `tests/existing-tests-audit.md` | Audit of 29 existing test files |

**Test Location:** `.opencode/skill/system-spec-kit/mcp_server/tests/`

### Coverage Summary

| Workstream | Coverage |
|------------|----------|
| W-S Session | 81.8% |
| W-R Search | 90.9% |
| W-D Decay | 90.9% |
| W-G Graph | 100% |
| W-I Infra | 68.8% |
| **Overall** | **83.2%** |

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Consolidated Analysis**: See `consolidated-analysis.md`
- **Test Documentation**: See `tests/` subdirectory
- **Source Documents**: See `../081-speckit-reimagined-pre-analysis/`
- **Archived Test Spec**: See `../z_archive/083-speckit-reimagined-test-suite/`

---

<!--
LEVEL 3+ SPEC (~250 lines)
- Core + L2 + L3 + L3+ addendums
- Approval Workflow, Compliance, Stakeholders
- Full governance controls
- Complexity score: 85/100 (Level 3+ justified)
-->
