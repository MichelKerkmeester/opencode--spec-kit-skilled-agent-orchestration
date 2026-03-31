---
title: "...-rag-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment/004-indexing-and-coherence/decision-record]"
description: "Three architecture decisions for the 004-indexing-and-coherence phase: RetryStats exposure strategy, trigger phrase filter placement, and Mustache template section design for toolCalls/exchanges."
trigger_phrases:
  - "indexing coherence decision record"
  - "retrystats accessor decision"
  - "trigger phrase filter architecture decision"
  - "toolcalls exchanges template design decision"
  - "optional_placeholders adr"
importance_tier: "normal"
contextType: "decision"
---
# Decision Record: Indexing & Coherence

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: RetryStats Exposed as Pull Accessor, Not DB Query or Event Push

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-21 |
| **Deciders** | System Spec Kit maintainers |

---

<!-- ANCHOR:adr-001-context -->
### Context

The retry manager (retry-manager.ts:86-233) maintains embedding retry state entirely in memory: a pending queue, a failure counter, a retry attempt counter, a circuit breaker flag, and the last run timestamp. The memory_health MCP handler builds a health response but currently has no window into this state. Operators diagnosing vector-search degradation have no tool-accessible signal — they must inspect background job logs or the embedding_status SQLite table directly. We needed to expose this state through memory_health without adding fragile coupling or latency.

### Constraints

- The memory_health handler is called synchronously during MCP request handling — cannot block on async event
- The retry manager's internal queue is not persisted to DB; DB has embedding_status rows but not the live retry counters
- Adding a DB query for RetryStats would race with the background job and introduce >50ms latency
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Add a `getRetryStats(): RetryStats` export to the retry manager singleton that reads in-memory state and returns a typed struct.

**How it works**: The retry manager already maintains its state as module-level variables (or a singleton class). We expose a `getRetryStats()` function that reads those variables and returns them as a `RetryStats` object. The memory_health handler imports and calls this function synchronously when building the health response, merging the result into the response under an `embeddingRetry` key. When the manager has not been started (e.g., test environments), the function returns a zero-state struct rather than throwing.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Pull accessor on singleton (chosen)** | Zero latency, no DB coupling, type-safe, idempotent | Requires retry manager to be in same process as handler | 9/10 |
| Query embedding_status DB table | No code change to retry manager | Races with background job, misses live retry counters, adds ~50ms latency | 5/10 |
| Push via event emitter | Decoupled, real-time | Async mismatch with synchronous MCP handler; requires state buffer; adds complexity | 4/10 |
| Expose via separate MCP tool | Clean separation of concerns | Requires new tool registration, more API surface; operators must know to call two tools | 6/10 |

**Why this one**: The in-memory state is the ground truth for retry health — the DB only has final status rows, not live queue depth or circuit breaker state. A synchronous pull accessor is the simplest design that provides accurate data with zero latency.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Operators can diagnose embedding health in one `memory_health` call instead of log inspection
- Circuit breaker state (open/closed) is visible — operators know when vector search is degraded vs. catching up
- Zero added latency to memory_health — in-memory read completes in microseconds

**What it costs**:
- Retry manager must be in the same process as the MCP handler (true by current architecture). Mitigation: document this constraint in the accessor JSDoc.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Retry manager restructured to separate process in future | M | Accessor interface remains stable; implementation changes to IPC call |
| RetryStats struct fields renamed internally | L | Define exported RetryStats interface as contract; internal fields map to interface before return |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Operators have no tool-accessible embedding health signal; debug requires log access |
| 2 | **Beyond Local Maxima?** | PASS | DB query and event emitter alternatives evaluated and rejected with specific rationale |
| 3 | **Sufficient?** | PASS | In-memory read accessor is the simplest design that provides accurate, zero-latency data |
| 4 | **Fits Goal?** | PASS | Directly addresses REQ-001/REQ-002; on critical path for P0 completion |
| 5 | **Open Horizons?** | PASS | Interface is stable; implementation can change to IPC if architecture evolves |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- retry-manager.ts: Add `RetryStats` interface export + `getRetryStats(): RetryStats` function
- memory-health.ts: Import `getRetryStats`, merge result into response as `embeddingRetry`

**How to roll back**: Revert memory-health.ts to remove the `embeddingRetry` field from response; revert retry-manager.ts to remove the exported accessor. Memory health response returns to prior shape. No DB data is touched.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

### ADR-002: Trigger Phrase Filter as Post-Extraction Stage, Not Extraction Replacement

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-21 |
| **Deciders** | System Spec Kit maintainers |

---

### Context

Auto-extraction at workflow.ts:940-1018 uses n-gram depth 4 to generate 15-30 trigger phrases per memory. Real-session output contains path fragments like "system spec kit/022 hybrid rag fusion", n-gram shingles like "roots contribute identical files", and generic tokens like "and missing" — all of which produce binary score=1.0 matches when they appear in any query prompt, creating false positives and diluting recall quality. The RC2 fix (workflow.ts:978-988) already ensures manually-authored `_manualTriggerPhrases` survive, but the problem is the volume and quality of the auto-extracted set, not the merge logic.

### Constraints

- Must not disable auto-extraction entirely — it provides signal for sessions without manual phrases
- Must not modify the n-gram extraction algorithm — changes to extraction depth could affect all sessions
- Must preserve manually-authored phrases unchanged — they are the highest-quality signal
- Filter must be idempotent — safe to apply more than once without loss of additional signal

---

### Decision

**We chose**: Insert a 3-stage filter function (`filterTriggerPhrases()`) between auto-extraction output and the merge step, applied only to auto-extracted phrases.

**How it works**: After the n-gram extractor produces its phrase list, and before merging with `_manualTriggerPhrases`, we pass the auto-extracted list through three sequential stages: (1) remove entries containing path separators or matching multi-word path segment patterns, (2) remove entries where all word tokens are under 3 characters (with an allow-list for technical acronyms like RAG, BM25, MCP), (3) remove n-gram phrases that are strict substrings of any retained longer phrase. Manual phrases skip this filter entirely and are merged after filtering.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Post-extraction filter (chosen)** | Additive, reversible, does not touch extraction algorithm | Filters after the fact; root cause (noisy n-gram extraction) not addressed | 8/10 |
| Reduce n-gram extraction depth (e.g., depth 2 instead of 4) | Fewer phrases generated upstream | Changes all sessions; may remove valid longer phrases; harder to tune per-session | 5/10 |
| Replace auto-extraction with AI-generated phrases only | Highest quality output | Requires AI call per save, adds latency and cost, breaks offline/fast-path saves | 3/10 |
| Raise minimum phrase frequency threshold | Reduces low-signal phrases | Shared threshold across all sessions may cut valid rare but important phrases | 6/10 |

**Why this one**: A post-extraction filter is the only approach that is (a) additive and reversible, (b) does not change extraction for all sessions, and (c) applies deterministic rules that can be unit-tested. The root-cause fix (reduce n-gram depth) is a separate concern tracked for a future sprint after we have baseline metrics on phrase quality.

---

### Consequences

**What improves**:
- Auto-extracted trigger phrases for spec-folder sessions contain no path fragments or short tokens
- Binary trigger matching (score=1.0) returns fewer false positives for path-fragment queries
- Manually-authored phrases retain full quality — no change to their handling

**What it costs**:
- A legitimate short technical token without allow-list entry would be filtered. Mitigation: allow-list seeded with known acronyms; allow-list is a simple string array that can be extended without code changes.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Filter over-aggressively removes valid short phrases | M | 3-char minimum (not 4); allow-list for RAG, BM25, MCP, ADR, JWT, API |
| Stage 3 (shingle removal) removes valid n-grams that happen to be substrings | L | Stage 3 only removes exact substring matches of longer retained phrases — not substring of any query string |
| Filter adds latency to high-volume saves | L | Pure string operations on <50 phrases; negligible O(n^2) in practice |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Real-session output confirmed to contain path fragments and short tokens (research/research.md Domain D) |
| 2 | **Beyond Local Maxima?** | PASS | Extraction depth reduction and AI-only alternatives evaluated and rejected |
| 3 | **Sufficient?** | PASS | Three deterministic stages cover the three categories of noise identified in research |
| 4 | **Fits Goal?** | PASS | Directly addresses REQ-003/REQ-004/REQ-005 |
| 5 | **Open Horizons?** | PASS | Filter is independent of extraction algorithm; root-cause fix can be tackled separately |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- workflow.ts: Add `filterTriggerPhrases()` pure function; insert call after auto-extraction, before merge with `_manualTriggerPhrases`
- Optional: separate utility file if function exceeds ~40 lines

**How to roll back**: Remove the `filterTriggerPhrases()` call from the merge flow — auto-extracted phrases pass through unfiltered, reverting to current noisy state. No data is lost (filtering is output-side only).

---

### ADR-003: toolCalls/exchanges as Optional Mustache Sections with Context Builder Guards

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-03-21 |
| **Deciders** | System Spec Kit maintainers |

---

### Context

CollectedDataBase contains `toolCalls: ToolCallSummary[]` and `exchanges: ExchangeSummary[]` fields that AI agents populate during session capture. These fields hold structured, AI-composed data: tool usage patterns and conversation exchange summaries. They are ingested into the pipeline but never bound to any Mustache template section — the data is silently discarded at render time. This is one of 15+ fields identified in the research (Domain F) that are collected but never rendered, representing permanent information loss for sessions with non-trivial tool usage.

### Constraints

- Must not restructure existing Mustache template sections — additive-only changes
- Empty arrays must produce no output (no section header without content)
- Must not add verbosity for sessions where toolCalls/exchanges are absent (majority of current sessions)
- toolCallsSummary output should be bounded in length — top-3 by frequency to avoid bloat

---

### Decision

**We chose**: Add optional `{{#hasToolCalls}}...{{/hasToolCalls}}` and `{{#hasExchanges}}...{{/hasExchanges}}` sections to the Mustache template, with context builder guards in workflow.ts that pre-compute `hasToolCalls` (boolean), `toolCallsSummary` (top-3 entries), `hasExchanges` (boolean), and `exchangesSummary` (count + topics).

**How it works**: The workflow.ts context builder already assembles a flat object for the Mustache renderer. We add four new keys: `hasToolCalls` is true when toolCalls.length > 0, `toolCallsSummary` is an array of the top 3 ToolCallSummary entries by call count (or all if fewer than 3), `hasExchanges` is true when exchanges.length > 0, and `exchangesSummary` contains a count and a deduplicated topics array. In the Mustache template, the two new sections are gated on the boolean flags, ensuring empty arrays produce zero output.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Optional Mustache sections with guards (chosen)** | Zero verbosity for absent data; type-safe; additive; bounded output | Requires context builder additions; top-3 cap is a policy choice | 9/10 |
| Render all toolCalls/exchanges unconditionally | Simpler template | Verbose for large arrays; always-present headers even when empty | 4/10 |
| Serialize toolCalls/exchanges as JSON blocks | No template changes | JSON blobs in memory output are hard to read; not useful for retrieval | 3/10 |
| Aggregate counts only (no per-entry rendering) | Minimal verbosity | Loses per-tool signal; not useful for retrieval beyond "N tools used" | 5/10 |

**Why this one**: The optional section pattern already exists in the Mustache template for other conditional fields. Using the same guard pattern keeps the template consistent and ensures zero regression for sessions without toolCalls or exchanges. The top-3 cap prevents verbosity regression for sessions with many tool calls.

---

### Consequences

**What improves**:
- Sessions with tool usage now have that data searchable in memory retrieval
- AI agents that compose toolCalls data will see it reflected in saved memory output — closing the feedback loop
- Pattern is extensible to other silently-discarded CollectedDataBase fields identified in Domain F research

**What it costs**:
- Memory output for tool-heavy sessions will be slightly longer. Mitigation: top-3 cap and no header for absent data.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| ToolCallSummary field shape differs from assumed | L | Read session-types.ts before T017 — confirmed shape before template design |
| Top-3 cap excludes relevant tool calls for power-user sessions | L | Cap is configurable via context builder; start at 3, adjust if feedback received |
| Mustache section insertion point conflicts with 003-sibling template changes | M | Coordinate: insert at end of optional sections block, after any 003 additions |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | toolCalls/exchanges confirmed present in CollectedDataBase, confirmed absent from all template sections (research/research.md Domain F) |
| 2 | **Beyond Local Maxima?** | PASS | JSON blob and unconditional render alternatives evaluated and rejected |
| 3 | **Sufficient?** | PASS | Optional guard sections with top-3 cap solve data loss without verbosity regression |
| 4 | **Fits Goal?** | PASS | Directly addresses REQ-006/REQ-007/REQ-008 |
| 5 | **Open Horizons?** | PASS | Pattern extensible to other silently-discarded fields from Domain F research list |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- Mustache template: Add `{{#hasToolCalls}}...{{/hasToolCalls}}` and `{{#hasExchanges}}...{{/hasExchanges}}` sections at end of optional sections block
- workflow.ts context builder: Add hasToolCalls, toolCallsSummary, hasExchanges, exchangesSummary key bindings

**How to roll back**: Remove the four context builder keys from workflow.ts and remove the two Mustache sections. The fields return to being silently discarded — same as current state. No data is permanently affected.

---

<!--
Level 3 Decision Record — 3 ADRs covering embedding visibility, trigger filter, template design.
Write in human voice: active, direct, specific.
HVR rules: .opencode/skill/sk-doc/references/hvr_rules.md
-->
