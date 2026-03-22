---
title: "Empty result recovery"
description: "Empty result recovery generates structured recovery payloads when search returns no results, low-confidence results, or only partial matches, providing the calling agent with actionable next steps, gated by the SPECKIT_EMPTY_RESULT_RECOVERY_V1 flag."
---

# Empty result recovery

## 1. OVERVIEW

Empty result recovery generates structured recovery payloads when search returns no results, low-confidence results, or only partial matches, providing the calling agent with actionable next steps, gated by the `SPECKIT_EMPTY_RESULT_RECOVERY_V1` flag.

When a search comes back empty or with poor results, the user gets no guidance on what to do next. This feature detects three failure states (no results, low confidence, partial matches) and generates a structured payload that tells the calling agent why the search failed and what action to take. Suggested alternatives might include broadening the query, switching search mode, saving a new memory to fill the knowledge gap, or asking the user for clarification.

---

## 2. CURRENT REALITY

Enabled by default (graduated). Set `SPECKIT_EMPTY_RESULT_RECOVERY_V1=false` to disable.

The recovery payload module (`recovery-payload.ts`) classifies search outcomes into three statuses:
- **no_results**: Zero results returned.
- **low_confidence**: Results returned but average confidence is below `DEFAULT_LOW_CONFIDENCE_THRESHOLD = 0.4`.
- **partial**: Fewer than `PARTIAL_RESULT_MIN = 3` results returned.

For each status, the module identifies a root cause reason:
- `spec_filter_too_narrow`: A specFolder filter was applied and likely excluded relevant results.
- `low_signal_query`: The query itself lacks distinctive terms.
- `knowledge_gap`: The system simply does not have relevant memories.

The recommended actions are: `retry_broader`, `switch_mode`, `save_memory`, or `ask_user`. Suggested alternative queries are generated based on the original query and failure context.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/search/recovery-payload.ts` | Lib | Recovery status classification, reason inference, suggested query generation, payload construction |
| `mcp_server/lib/search/search-flags.ts` | Lib | Central flag registry reference |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/d5-recovery-payload.vitest.ts` | Recovery payload generation, status classification, flag gating |

---

## 4. SOURCE METADATA

- Group: UX hooks
- Source feature title: Empty result recovery
- Current reality source: mcp_server/lib/search/recovery-payload.ts module header and implementation
