---
title: "189 -- Tool-result extraction to working memory"
description: "This scenario validates tool-result extraction to working memory for `189`. It focuses on Verify salient tool results are automatically captured as session-scoped attention items, survive checkpoint recovery, and follow the documented attention decay rules."
---

# 189 -- Tool-result extraction to working memory

## 1. OVERVIEW

This scenario validates tool-result extraction to working memory for `189`. It focuses on Verify salient tool results are automatically captured as session-scoped attention items, survive checkpoint recovery, follow the documented attention decay rules, and use the optimized index/upsert path.

---

## 2. CURRENT REALITY

Operators run the exact prompt and command sequence for `189` and confirm the expected signals without contradicting evidence.

- Objective: Verify salient tool results are summarized and inserted into working memory with provenance, remain available across turns in the same session, survive checkpoint save/restore, follow the documented decay rules with bounded mention boosts, and use the optimized index/upsert path
- Prompt: `Validate tool-result extraction to working memory. Capture the evidence needed to prove salient tool outputs are automatically extracted into session-scoped working memory with provenance; follow-up turns can reuse that context; checkpoint restore preserves the extracted entries; attention decay follows the documented event-distance model with bounded mention boosts; the new indexes idx_wm_session_focus_lru and idx_wm_session_attention_focus support eviction and ordered reads; and upsertExtractedEntry() relies on INSERT ... ON CONFLICT without a pre-upsert existence probe. Return a concise user-facing pass/fail verdict with the main reason.`
- Expected signals: Tool-result capture runs automatically after eligible tool responses; extracted entries appear in working memory with provenance; follow-up context can reuse the extracted result; checkpoint restore preserves the entry; decay behavior matches the documented floor, mention boost, and eviction boundaries; the new indexes back LRU eviction and attention-ordered reads; extraction upsert executes without a pre-upsert existence probe
- Pass/fail: PASS: Automatic extraction, cross-turn reuse, checkpoint preservation, attention-scoring behavior, index-backed reads/eviction, and direct `ON CONFLICT` upserts all align. FAIL: extracted entries are missing, unusable across turns, lost on restore, decay/boost behavior contradicts the documented contract, required indexes are absent, or the write path still performs a pre-upsert existence check.

---

## 3. TEST EXECUTION

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 189 | Tool-result extraction to working memory | Verify automatic capture, session continuity, checkpoint preservation, attention decay, and optimized index/upsert behavior | `Validate tool-result extraction to working memory. Capture the evidence needed to prove salient tool outputs are automatically extracted into session-scoped working memory with provenance; follow-up turns can reuse that context; checkpoint restore preserves the extracted entries; attention decay follows the documented event-distance model with bounded mention boosts; the new indexes idx_wm_session_focus_lru and idx_wm_session_attention_focus support eviction and ordered reads; and upsertExtractedEntry() relies on INSERT ... ON CONFLICT without a pre-upsert existence probe. Return a concise user-facing pass/fail verdict with the main reason.` | 1) Start a reusable session such as `ex189-session` with the MCP server running so the extraction adapter is initialized through `context-server.ts` 2) Run an eligible retrieval tool call that returns salient results, for example `memory_search({ query: "checkpoint working memory", sessionId: "ex189-session" })`, and capture the tool output 3) Verify the extraction path runs after the tool response, including summary/redaction checks and an `upsertExtractedEntry()` insertion into working memory with provenance fields 4) Capture schema or query-plan evidence that `idx_wm_session_attention_focus` backs attention-ordered session reads and `idx_wm_session_focus_lru` backs least-recently-focused eviction ordering 5) Confirm the extraction write path uses a single `INSERT ... ON CONFLICT(session_id, memory_id) DO UPDATE` without a pre-upsert existence probe such as `SELECT COUNT(*)` 6) In the same session, ask a follow-up question such as `memory_context({ input: "What did the last retrieval find about checkpoint working memory?", mode: "focused", sessionId: "ex189-session" })` and confirm the prior extracted result is available without repeating the original search 7) Create and restore a checkpoint for the same session and verify the extracted working-memory entry remains available after restore 8) Advance several events and repeated mentions, then confirm the attention score follows the documented decay contract: 0.85 per elapsed event, floor 0.05 during decay updates, bounded `MENTION_BOOST_FACTOR = 0.05`, and eviction only once score drops below 0.01 | Automatic extraction runs after eligible tool responses; extracted entries carry provenance; follow-up context reuses the prior result; checkpoint restore retains the entry; attention scoring follows the documented decay, floor, mention boost, and eviction behavior; the new indexes back session reads and LRU eviction; extraction upsert executes without a pre-upsert existence probe | Tool outputs; working-memory or log evidence showing extraction/upsert; schema/query-plan evidence for `idx_wm_session_focus_lru` and `idx_wm_session_attention_focus`; follow-up retrieval transcript; checkpoint save/restore evidence; score traces or diagnostic logs showing decay behavior | PASS: Automatic extraction, cross-turn reuse, checkpoint preservation, attention-scoring behavior, index-backed reads/eviction, and direct `ON CONFLICT` upserts all align. FAIL: extracted entries are missing, unusable across turns, lost on restore, decay/boost behavior contradicts the documented contract, required indexes are absent, or the write path still performs a pre-upsert existence check. | Verify after-tool callback registration in `context-server.ts` -> inspect `extraction-adapter.ts` for summary or redaction gating -> confirm session IDs and memory IDs are stable -> inspect checkpoint restore flow -> review score-clamp and eviction handling in working-memory decay logic -> confirm no pre-upsert existence probe remains in `upsertExtractedEntry()` |

---

## 4. REFERENCES

- Root playbook: [MANUAL_TESTING_PLAYBOOK.md](../MANUAL_TESTING_PLAYBOOK.md)
- Feature catalog: [01--retrieval/09-tool-result-extraction-to-working-memory.md](../../feature_catalog/01--retrieval/09-tool-result-extraction-to-working-memory.md)

---

## 5. SOURCE METADATA

- Group: Retrieval
- Playbook ID: 189
- Canonical root source: `MANUAL_TESTING_PLAYBOOK.md`
- Feature file path: `01--retrieval/189-tool-result-extraction-to-working-memory.md`
