---
title: "Decision Record: Full Spec Folder Document Indexing [126-full-spec-doc-indexing/decision-record]"
description: "Context: Need to classify indexed files by their structural role in the spec lifecycle. The existing context_type column describes content nature (research/implementation/decisi..."
trigger_phrases:
  - "decision"
  - "record"
  - "full"
  - "spec"
  - "folder"
  - "decision record"
  - "126"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 3+ -->
# Decision Record: Full Spec Folder Document Indexing

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
### ADR-001: Add document_type Column (Not Overload context_type)

<!-- ANCHOR:adr-001-context -->
| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-16 |
| **Deciders** | User, Agent |

**Context**: Need to classify indexed files by their structural role in the spec lifecycle. The existing `context_type` column describes content nature (research/implementation/decision), not structural role.

**Constraints**:
- Cannot modify existing CHECK constraints without recreating the table
- Must be backward compatible with existing queries
- Must distinguish structural type from content nature

<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
**Decision**: Add a new `document_type TEXT DEFAULT 'memory'` column. Values: `spec`, `plan`, `tasks`, `checklist`, `decision_record`, `implementation_summary`, `research`, `handover`, `memory`, `readme`, `constitutional`.

<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **New column** | Clean separation, no migration risk | Additional column | 9/10 |
| Overload context_type | No new column | Conflates two orthogonal concepts, breaks existing queries | 3/10 |
| JSON metadata column | Flexible | Slower queries, no indexing | 5/10 |

**Why Chosen**: Orthogonal concerns deserve separate columns. context_type = content nature, document_type = structural role.

<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-five-checks -->
**Five Checks Evaluation**:

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without document_type, cannot distinguish spec.md from memory file |
| 2 | **Beyond Local Maxima?** | PASS | Evaluated 3 alternatives; new column is cleanest |
| 3 | **Sufficient?** | PASS | Single column with DEFAULT covers all cases |
| 4 | **Fits Goal?** | PASS | Enables document-type-aware scoring and queries |
| 5 | **Open Horizons?** | PASS | New document types can be added without schema change |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-001-five-checks -->

<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
### ADR-002: Use Scoring Multipliers (Not New Importance Tier)

<!-- ANCHOR:adr-002-context -->
| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-16 |
| **Deciders** | User, Agent |

**Context**: Spec documents should rank higher than regular memories in search results.

**Constraints**:
- Cannot add new CHECK constraint values to `importance_tier` without table recreation
- Must work with existing 5-factor and legacy 6-factor scoring
- Must not break existing memory ranking

<!-- /ANCHOR:adr-002-context -->

<!-- ANCHOR:adr-002-decision -->
**Decision**: Use a `DOCUMENT_TYPE_MULTIPLIERS` map in composite-scoring.ts applied as a final multiplier. spec=1.4, decision_record=1.4, plan=1.3, memory=1.0 (unchanged).

<!-- /ANCHOR:adr-002-decision -->

<!-- ANCHOR:adr-002-alternatives -->
| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Scoring multiplier** | No schema change, works with both scoring models | Another scoring factor | 9/10 |
| New importance tier | Semantic clarity | Requires table recreation, breaks CHECK constraint | 2/10 |
| Hardcoded importance_weight | Simple | Loses the concept, can't query by tier | 5/10 |

**Why Chosen**: Achieves the same effect (spec docs score higher) without schema risk.

<!-- /ANCHOR:adr-002-alternatives -->

<!-- ANCHOR:adr-002-five-checks -->
**Five Checks Evaluation**:

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Without multiplier, spec docs rank same as memories |
| 2 | **Beyond Local Maxima?** | PASS | Evaluated tier-based and weight-based alternatives |
| 3 | **Sufficient?** | PASS | Multiplier + pattern alignment achieves desired ranking |
| 4 | **Fits Goal?** | PASS | Directly addresses "spec docs should rank higher" requirement |
| 5 | **Open Horizons?** | PASS | Multiplier values can be tuned without code changes |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-002-five-checks -->

<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
### ADR-003: Whole-Document Indexing (Not Section-Level)

<!-- ANCHOR:adr-003-context -->
| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-16 |
| **Deciders** | User, Agent |

**Context**: Spec documents can range from 1KB to 10KB. Need to decide indexing granularity.

**Constraints**:
- Embedding costs scale linearly with entry count
- BM25/FTS5 already handles intra-document matching
- Section-level would require anchor parsing for all spec docs

<!-- /ANCHOR:adr-003-context -->

<!-- ANCHOR:adr-003-decision -->
**Decision**: Index each spec document as a single entry (whole-document). Section-level can be added later via existing `anchor_id` column.

<!-- /ANCHOR:adr-003-decision -->

<!-- ANCHOR:adr-003-alternatives -->
| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Whole-document** | Simple, low cost, adequate for 2-10KB docs | Less granular matching | 8/10 |
| Section-level | More precise results | 5-15x entries, embedding costs, anchor complexity | 4/10 |
| Hybrid (title + body) | Balance | 2x entries, still coarse | 6/10 |

**Why Chosen**: Spec docs are small enough for whole-document embedding. BM25/FTS5 provides intra-document matching. anchor_id column exists for future section-level indexing.

<!-- /ANCHOR:adr-003-alternatives -->

<!-- ANCHOR:adr-003-five-checks -->
**Five Checks Evaluation**:

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Must decide indexing granularity |
| 2 | **Beyond Local Maxima?** | PASS | Section-level and hybrid considered |
| 3 | **Sufficient?** | PASS | Whole-doc + BM25 covers typical queries |
| 4 | **Fits Goal?** | PASS | Enables spec doc search at minimal cost |
| 5 | **Open Horizons?** | PASS | anchor_id column enables future section-level |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-003-five-checks -->

<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
### ADR-004: Existing causal_edges Table for Relationship Chains

<!-- ANCHOR:adr-004-context -->
| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-16 |
| **Deciders** | User, Agent |

**Context**: Spec documents have natural relationships: spec -> plan -> tasks -> implementation-summary. Need to represent these.

<!-- /ANCHOR:adr-004-context -->

<!-- ANCHOR:adr-004-decision -->
**Decision**: Use existing `causal_edges` table with CAUSED and SUPPORTS relation types. No new tables or relation types needed.

<!-- /ANCHOR:adr-004-decision -->

<!-- ANCHOR:adr-004-alternatives -->
| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Existing causal_edges** | No schema changes, existing traversal/stats tools | Shares table with memory causal links | 8/10 |
| New spec_document_links table | Clean separation | New table, new tools, duplicate functionality | 4/10 |
| JSON array on spec.md row | Simple | No graph traversal, no integrity | 3/10 |

**Why Chosen**: causal_edges already has the exact relation types needed (CAUSED, SUPPORTS) and full graph traversal infrastructure.

<!-- /ANCHOR:adr-004-alternatives -->

<!-- ANCHOR:adr-004-five-checks -->
**Five Checks Evaluation**:

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Relationships enable chain traversal in search |
| 2 | **Beyond Local Maxima?** | PASS | Evaluated new table and JSON approaches |
| 3 | **Sufficient?** | PASS | CAUSED + SUPPORTS cover all spec doc relationships |
| 4 | **Fits Goal?** | PASS | Enables memory_causal_stats to show spec document chains |
| 5 | **Open Horizons?** | PASS | Additional relation types can be added later |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-004-five-checks -->

<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
### ADR-005: Feature Flag for Opt-Out Control

<!-- ANCHOR:adr-005-context -->
| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-16 |
| **Deciders** | User, Agent |

**Context**: Need a way to disable spec doc indexing without code changes, for debugging or resource-constrained environments.

<!-- /ANCHOR:adr-005-context -->

<!-- ANCHOR:adr-005-decision -->
**Decision**: Environment variable `SPECKIT_INDEX_SPEC_DOCS=false` disables globally. Tool parameter `includeSpecDocs: false` disables per-call. Default is `true` (enabled).

<!-- /ANCHOR:adr-005-decision -->

<!-- ANCHOR:adr-005-alternatives -->
| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Env var + param** | Global and per-call control | Two mechanisms | 8/10 |
| Config file only | Persistent | Requires restart, no per-call control | 5/10 |
| No control | Simplest | No way to disable without code change | 3/10 |

**Why Chosen**: Dual control (env var for global, param for per-call) provides maximum flexibility with minimal complexity.

<!-- /ANCHOR:adr-005-alternatives -->

<!-- ANCHOR:adr-005-five-checks -->
**Five Checks Evaluation**:

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Rollback and debugging require disable mechanism |
| 2 | **Beyond Local Maxima?** | PASS | Evaluated config-file and no-control options |
| 3 | **Sufficient?** | PASS | Env var + param covers all use cases |
| 4 | **Fits Goal?** | PASS | Enables safe rollout and debugging |
| 5 | **Open Horizons?** | PASS | Additional feature flags can follow same pattern |

**Checks Summary**: 5/5 PASS

<!-- /ANCHOR:adr-005-five-checks -->

<!-- /ANCHOR:adr-005 -->

<!--
Level 3+ Decision Record
5 ADRs, all with Five Checks evaluation (5/5 PASS each)
-->
