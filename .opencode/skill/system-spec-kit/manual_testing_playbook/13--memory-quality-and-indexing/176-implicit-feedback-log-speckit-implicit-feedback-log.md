---
title: "176 -- Implicit feedback log (SPECKIT_IMPLICIT_FEEDBACK_LOG)"
description: "This scenario validates implicit feedback log (SPECKIT_IMPLICIT_FEEDBACK_LOG) for `176`. It focuses on the default-on graduated rollout and verifying the shadow-only implicit feedback event ledger records 5 event types."
---

# 176 -- Implicit feedback log (SPECKIT_IMPLICIT_FEEDBACK_LOG)

## 1. OVERVIEW

This scenario validates implicit feedback log (SPECKIT_IMPLICIT_FEEDBACK_LOG) for `176`. It focuses on the default-on graduated rollout and verifying the shadow-only implicit feedback event ledger records 5 event types.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `176` and confirm the expected signals without contradicting evidence.

- Objective: Verify shadow-only implicit feedback event ledger records 5 event types
- Prompt: `Test the default-on SPECKIT_IMPLICIT_FEEDBACK_LOG behavior. Run a search, cite a result, reformulate the query, and verify the feedback ledger records events for all 5 types: search_shown, result_cited, query_reformulated, same_topic_requery, follow_on_tool_use. Confirm confidence tiers (strong/medium/weak) are correctly assigned and events are shadow-only (no ranking side effects). Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: 5 event types recorded: search_shown, result_cited, query_reformulated, same_topic_requery, follow_on_tool_use; confidence tiers: strong (result_cited, follow_on_tool_use), medium (query_reformulated), weak (search_shown, same_topic_requery); shadow-only (no ranking influence); resolveConfidence() infers tier from event type
- Pass/fail: PASS if ledger schema supports all 5 event types with correct confidence tier mappings, handlers emit events for triggered actions (e.g., search_shown on search), and events remain shadow-only; FAIL if ledger schema missing event types, confidence tiers incorrect, or events influence live rankings

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 176 | Implicit feedback log (SPECKIT_IMPLICIT_FEEDBACK_LOG) | Verify shadow-only implicit feedback event ledger records 5 event types | `Test the default-on SPECKIT_IMPLICIT_FEEDBACK_LOG behavior. Trigger all 5 feedback event types and verify confidence tier assignment. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Confirm `SPECKIT_IMPLICIT_FEEDBACK_LOG` is unset or `true` 2) `memory_search({ query: "test query" })` — triggers search_shown 3) Cite a result — triggers result_cited 4) Reformulate query — triggers query_reformulated 5) Re-search same topic — triggers same_topic_requery 6) Use follow-on tool — triggers follow_on_tool_use 7) Query feedback ledger for recorded events 8) Verify shadow-only (no ranking changes) | isImplicitFeedbackLogEnabled() returns true; 5 event types stored with type/memory_id/query_id/confidence/timestamp/session_id; resolveConfidence() maps: result_cited→strong, follow_on_tool_use→strong, query_reformulated→medium, search_shown→weak, same_topic_requery→weak; shadow-only | Feedback ledger query results + event type/confidence pairs + ranking comparison (before/after) + test transcript | PASS if all 5 event types recorded with correct confidence tiers and no ranking side effects; FAIL if event types missing, confidence tiers wrong, or events influence rankings | Verify isImplicitFeedbackLogEnabled() → Confirm flag is not forced off → Check feedback-ledger.ts schema creation → Inspect resolveConfidence() tier mapping → Verify shadow-only constraint (no ranking integration) |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [13--memory-quality-and-indexing/22-implicit-feedback-log.md](../../feature_catalog/13--memory-quality-and-indexing/22-implicit-feedback-log.md)
- Feature flag reference: [19--feature-flag-reference/01-1-search-pipeline-features-speckit.md](../../feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md)
- Source file: `mcp_server/lib/feedback/feedback-ledger.ts`

---

## 5. SOURCE METADATA

- Group: Memory quality and indexing
- Playbook ID: 176
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `13--memory-quality-and-indexing/176-implicit-feedback-log-speckit-implicit-feedback-log.md`
