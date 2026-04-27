# Iteration 009 - Q4 weak retrieval hallucination guard

## Focus

Q4: harden against model-side hallucination when retrieval returns weak evidence. Q1 was not reopened per the packet constraint. Q5 was also not reopened because Iterations 002 and 005 already identify the `memory_context` truncation root cause, despite the stale remaining-question checklist.

## Actions Taken

1. Checked current iteration coverage and found Q5 already answered in `iteration-005.md` and `deltas/iter-005.jsonl`, so selected the next high-value unanswered cluster: Q4.
2. Read the 006 scenario-execution findings for the I2 hallucination failure and cross-referenced the exact weak-retrieval evidence.
3. Inspected the `memory_search` formatter path that attaches `requestQuality` and `recovery` payloads to successful and empty responses.
4. Inspected the recovery payload and confidence-scoring helpers to determine whether the runtime can currently express a hard refusal or no-invention policy.

## Findings

### 1. Q4 is a model-policy failure exposed by real weak-retrieval telemetry

Sibling 006 records the concrete failure: I2/opencode received weak/low-confidence retrieval and invented non-existent files and spec packets instead of broadening or saying no canonical context was found (`.opencode/specs/system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/001-search-intelligence-stress-test/002-scenario-execution/findings.md:14`, `:30`, `:73`). The strongest evidence is the recommendation section: the run had `requestQuality.label="weak"`, `recovery.status="low_confidence"`, `recovery.reason="knowledge_gap"`, and `recovery.suggestedQueries=[]`, then fabricated paths anyway (`findings.md:96-100`).

This is different from a missing retrieval payload. The runtime did expose weakness; the caller treated advisory weakness as permission to guess.

### 2. The current recovery contract has no hard guard action

`RecoveryAction` is limited to `retry_broader`, `switch_mode`, `save_memory`, and `ask_user` (`.opencode/skill/system-spec-kit/mcp_server/lib/search/recovery-payload.ts:28-37`). `recommendAction()` maps low-confidence knowledge gaps to `ask_user`, partial matches to `retry_broader`, and no-results knowledge gaps to `save_memory` (`recovery-payload.ts:152-164`). None of those names means "refuse to cite canonical paths", "do not invent", or "require disambiguation before answering".

That is too soft for model callers. The guard should be a machine-readable policy field, not only a hint string.

### 3. `suggestedQueries` can legitimately be empty for weak prompts

`generateSuggestedQueries()` only emits suggestions when it can remove parentheticals, shorten queries longer than four words, trim trailing stop words, reuse the query without a spec-folder filter, or handle an empty query (`recovery-payload.ts:107-147`). For a non-empty, short, generic query with no filter and no removable syntax, it can return `[]`. That matches the 006 failure mode: weak retrieval plus no suggested path forward.

Empty suggestions need a stronger fallback action. If `suggestedQueries.length === 0`, the response should not leave the model to improvise; it should require disambiguation or a broader user-provided query.

### 4. `requestQuality` is ranking confidence, not evidence authority

The confidence module explicitly scopes itself to retrieval ordering and says it is not structural trust or evidence authority (`.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-scoring.ts:24-25`). It returns `weak` when results exist but the top score or confidence ratio is only marginal (`confidence-scoring.ts:293-315`). That label is useful telemetry, but it does not by itself tell the model which claims are forbidden.

The missing layer is a response policy derived from `requestQuality` + `recovery`: for weak/gap evidence, canonical path claims require retrieved citations; otherwise the model must ask, broaden, or refuse.

### 5. The formatter attaches recovery metadata but does not escalate weak recovery into response policy

For empty results, `formatSearchResults()` builds `requestQuality` and `recovery` into the empty envelope (`.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:713-739`). For non-empty weak or partial results, it computes confidence, assesses request quality, optionally builds recovery, and includes both in `responseData` (`search-results.ts:951-982`, `:1025-1035`).

That proves the right insertion point exists. The formatter can derive a hard `responsePolicy` beside `recovery`, such as `mustAskUser`, `mustBroaden`, `noCanonicalPathClaims`, and `citationRequiredForPaths`.

## Questions Answered

### Q4 root cause

The hallucination class occurs because weak retrieval metadata is advisory and incomplete. The runtime can say `requestQuality:"weak"` and `recovery.status:"low_confidence"`, but it cannot currently express a hard no-invention contract. When `suggestedQueries` is empty, the model gets no safe next query and fills the gap with plausible-looking paths.

### Q4 recommended fix

Add a hard response-policy layer in the memory search formatter:

1. Derive `responsePolicy` when `requestQuality.label !== "good"` or `recovery` exists.
2. For `requestQuality:"weak"` + `recovery.status:"low_confidence"` + `recovery.suggestedQueries.length === 0`, set:
   - `requiredAction: "ask_disambiguation"`
   - `noCanonicalPathClaims: true`
   - `citationRequiredForPaths: true`
   - `safeResponse: "No canonical context found from the current retrieval. Ask a clarifying question or request a broader query."`
3. Extend `RecoveryAction` with explicit literals: `ask_disambiguation`, `refuse_without_evidence`, and `broaden_or_ask`.
4. Add a renderer preamble that says, in machine-readable and visible text, not to invent spec folders, packet IDs, files, functions, or line numbers.
5. Add regression tests for the exact I2 shape: weak request quality, low-confidence recovery, empty suggested queries, and attempted path-answer prompt. The expected behavior is no invented paths and a disambiguation response.

## Questions Remaining

- Q8 appears to have already been answered in the pre-existing `iteration-009.md` content this run replaced; reducer state may need reconciliation because the strategy checklist is stale.
- Iteration 010 should avoid reopening answered clusters and synthesize the implementation backlog across Q1-Q8.

## Next Focus

Iteration 010: final synthesis. Reconcile duplicate/stale iteration state, mark Q4/Q8 coverage correctly, and rank implementation packets by blast radius and verification cost.
