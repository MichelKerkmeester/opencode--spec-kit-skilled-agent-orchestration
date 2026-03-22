---
title: "Implicit feedback log"
description: "Implicit feedback log records implicit feedback signals from search and save interactions into a shadow-only SQLite table with tiered confidence scoring, enabling offline analysis of search quality without ranking side effects, gated by the SPECKIT_IMPLICIT_FEEDBACK_LOG flag."
---

# Implicit feedback log

## 1. OVERVIEW

Implicit feedback log records implicit feedback signals from search and save interactions into a shadow-only SQLite table with tiered confidence scoring, enabling offline analysis of search quality without ranking side effects, gated by the `SPECKIT_IMPLICIT_FEEDBACK_LOG` flag.

Every time a user searches and then takes an action (cites a result, reformulates the query, or uses a follow-on tool), that action says something about whether the results were useful. This feature captures those signals as feedback events in a dedicated SQLite table. The events are shadow-only, meaning they do not influence live rankings. Instead, they provide a dataset for offline analysis of search quality, enabling future features like learned ranking and A/B evaluation.

---

## 2. CURRENT REALITY

Enabled by default (graduated). Set `SPECKIT_IMPLICIT_FEEDBACK_LOG=false` to disable.

The `isImplicitFeedbackLogEnabled()` function in both `search-flags.ts` and `feedback-ledger.ts` checks the flag. The feedback ledger module records five event types with a three-tier confidence hierarchy:

- **Strong**: `result_cited`, `follow_on_tool_use` (result was used)
- **Medium**: `query_reformulated` (implicit relevance dissatisfaction)
- **Weak**: `search_shown`, `same_topic_requery` (passive exposure)

Each event is stored with `type`, `memory_id`, `query_id`, `confidence`, `timestamp`, and optional `session_id`. The `resolveConfidence()` function infers the confidence tier from the event type when not explicitly provided.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/feedback/feedback-ledger.ts` | Lib | Feedback event recording, schema creation, confidence resolution, query API |
| `mcp_server/lib/search/search-flags.ts` | Lib | `isImplicitFeedbackLogEnabled()` flag accessor |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/feedback-ledger.vitest.ts` | Feedback event recording, retrieval, flag gating |

---

## 4. SOURCE METADATA

- Group: Memory quality and indexing
- Source feature title: Implicit feedback log
- Current reality source: mcp_server/lib/feedback/feedback-ledger.ts module header and implementation
