● skill(sk-code--review)

I’m gathering the audit surface first: the two child specs, the UX/flag source files, and the catalog entries they’re supposed to document. Then I’ll cross-check runtime behavior against the audit claims and report only evidence-backed findings.

● Search (grep)
  │ "018-ux-hooks|020-feature-flag-reference|F11|F21|F23|F15"
  │ (.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)
  └ 1 line found

● Search (glob)
  │ "**/018-ux-hooks/spec.md"
  └ 2 files found

● Search (glob)
  │ "**/020-feature-flag-reference/spec.md"
  └ 2 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/**/{memory-save.ts,memory-context.ts,rollout-policy.
  │ ts}"
  └ 3 files found

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ 1 line read

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/018
  │ -ux-hooks/spec.md
  └ 219 lines read

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/020
  │ -feature-flag-reference/spec.md
  └ 205 lines read

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ L1:140 (140 lines read)

● Read memory-context.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
  └ 1 line read

● Read rollout-policy.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts
  └ 81 lines read

I found one likely contradiction already: `rollout-policy.ts` implements “default ON” semantics for undefined flags, so I’m now tracing whether the catalog/spec text still claims some of those flags are OFF by default and whether the UX handlers actually wire the documented hooks end-to-end.

● skill(sk-code--opencode)

I’ve got the phase audit summaries. Next I’m drilling into the concrete runtime evidence: the actual hook helpers those features depend on, the handler call sites, and the flag docs that might still describe pre-graduation defaults.

✗ search UX hook mutation wiring, post-mutation hooks, progressive disclosure, retrieval session st…
  └ Permission denied and could not request permission from user

● Search (grep)
  │ "postMutation|UX|progressive disclosure|cursor|session
  │ state|confidence|explainability|mode-aware|empty result|no-op|partial indexing|token metadata"
  │ in **/*.{ts,md} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "default ON|default OFF|OFF by default|ON by default|runtime defaults to ON|header.*OFF|enabled
  │ by default|Treats undefined/missing as enabled" in **/*.{ts,md}
  │ (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/*.md"
  └ 19 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/*.md"
  └ 8 files found

● Read 01-1-search-pipeline-features-speckit.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-
  │ features-speckit.md
  └ 1 line read

● Read 01-shared-post-mutation-hook-wiring.md
  │ .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/01-shared-post-mutation-hook-wiring
  │ .md
  └ 111 lines read

● Read 16-progressive-disclosure.md
  │ .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/16-progressive-disclosure.md
  └ 52 lines read

● Read 17-retrieval-session-state.md
  │ .opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/17-retrieval-session-state.md
  └ 56 lines read

● Read 02-2-session-and-cache.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/02-2-session-and-cach
  │ e.md
  └ 44 lines read

● Read 05-5-embedding-and-api.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/05-5-embedding-and-ap
  │ i.md
  └ 39 lines read

● Read 01-1-search-pipeline-features-speckit.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-
  │ features-speckit.md
  └ 1 line read

● Search (grep)
  │ "runPostMutation|post-mutation|MutationHook|hookResult|hooks|appendSuccessHint|ux|cursor|progres
  │ siveDisclosure|sessionState|goalRefinement|no-op|partial indexing|token metadata|errors:"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts)
  └ 78 lines found

● Search (grep)
  │ "success hint|progressiveDisclosure|cursor|sessionState|goalRefinement|question|anchor|empty
  │ result|confidence|mode-aware|explainability"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
  └ 119 lines found

● Search (grep)
  │ "runPostMutationHooks|errors: \[]|error.message|hook result|autoSurface|mutation
  │ feedback|post-mutation" (.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts)
  └ 71 lines found

● Search (grep)
  │ "SPECKIT_PROGRESSIVE_DISCLOSURE_V1|SPECKIT_SESSION_RETRIEVAL_STATE_V1|default ON|default
  │ OFF|Treats undefined/missing as
  │ enabled|isFeatureEnabled|isProgressiveDisclosureEnabled|isSessionRetrievalStateEnabled" in
  │ **/*.{ts,md} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "default OFF|default ON|graduated|SPECKIT_PROGRESSIVE_DISCLOSURE_V1|SPECKIT_SESSION_RETRIEVAL_ST
  │ ATE_V1|SPECKIT_ROLLOUT_PERCENT" in **/*.md (.opencode/skill/system-spec-kit/feature_catalog)
  └ 5 lines found

I’ve confirmed the save path does call shared post-mutation hooks and surfaces hook errors instead of suppressing them. I’m now checking the second half of the pipeline: whether search/session UX payloads are actually wired through the live search path and whether the published flag docs still match the live defaults.

● Read search-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
  └ 1 line read

● Read memory-save.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts
  └ L1038:1105 (68 lines read)

● Read memory-context.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
  └ L1000:1095 (96 lines read)

● Read mutation-hooks.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts
  └ L1:130 (106 lines read)

● Read session-state.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts
  └ L1:180 (180 lines read)

● Read progressive-disclosure.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts
  └ L1:260 (260 lines read)

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L1:360 (360 lines read)

● Search (grep)
  │ "default OFF|default
  │ ON|opt-in|graduated|SPECKIT_SESSION_RETRIEVAL_STATE_V1|SPECKIT_PROGRESSIVE_DISCLOSURE_V1"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts)
  └ 15 lines found

● Search (grep)
  │ "buildProgressiveResponse|resolveCursor|progressiveDisclosure|data\.sessionState|goalRefinement|
  │ preferredAnchors|openQuestions|markSeen|updateGoal|setAnchors|cursor"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
  └ 5 lines found

● Search (grep)
  │ "isProgressiveDisclosureEnabled|isSessionRetrievalStateEnabled|SPECKIT_PROGRESSIVE_DISCLOSURE_V1
  │ |SPECKIT_SESSION_RETRIEVAL_STATE_V1"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts)
  └ 19 lines found

● Search (grep)
  │ "default OFF|default ON|opt-in|graduated|SPECKIT_PROGRESSIVE_DISCLOSURE_V1"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts)
  └ 23 lines found

● Search (grep)
  │ "SPECKIT_SESSION_RETRIEVAL_STATE_V1|SPECKIT_PROGRESSIVE_DISCLOSURE_V1|default OFF|default
  │ ON|graduated|opt-in" in **/*.md
  │ (.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference)
  └ 5 lines found

I’ve got a clean contradiction now: `session-state.ts` still advertises “default OFF, opt-in” at its module header, but both the canonical flag gate and the implementation behave as default ON. I’m verifying whether that mismatch is isolated documentation drift or whether any runtime call paths still behave as if the feature were opt-in.

● Search (grep)
  │ "progressiveDisclosure" (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
  └ 11 lines found

● Search (grep)
  │ "runPostMutationHooks\(" in **/*.ts (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 55 lines found

● Search (grep)
  │ "sessionState|goalRefinement|markSeen\(|updateGoal\(|setAnchors\(|openQuestions|preferredAnchors
  │ " (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
  └ 64 lines found

● Search (grep)
  │ "cursor\)|resolveCursor\(|buildProgressiveResponse\(|memory_search\(\{ cursor
  │ \}\)|cursor-only|continuation"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
  └ 55 lines found

● Search (grep)
  │ "SPECKIT_SESSION_RETRIEVAL_STATE_V1|SPECKIT_PROGRESSIVE_DISCLOSURE_V1|default OFF|default
  │ ON|graduated|opt-in" (.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference
  │ /01-1-search-pipeline-features-speckit.md)
  └ 5 lines found

● Read mutation-feedback.ts
  │ .opencode/skill/system-spec-kit/mcp_server/hooks/mutation-feedback.ts
  └ 61 lines read

● Search (grep)
  │ "SPECKIT_PROGRESSIVE_DISCLOSURE_V1|SPECKIT_SESSION_RETRIEVAL_STATE_V1|SPECKIT_ROLLOUT_PERCENT"
  │ (.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline
  │ -features-speckit.md)
  └ 25 lines found

● Search (grep)
  │ "SPECKIT_PROGRESSIVE_DISCLOSURE_V1|SPECKIT_SESSION_RETRIEVAL_STATE_V1|SPECKIT_ROLLOUT_PERCENT"
  │ (.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)
  └ 48 lines found

● Search (grep)
  │ "Default: TRUE|default ON|default OFF|graduated|opt-in" (.opencode/skill/system-spec-kit/feature
  │ _catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md)
  └ 5 lines found

● Search (grep)
  │ "buildMutationHookFeedback|postMutationHooks|hints"
  │ (.opencode/skill/system-spec-kit/mcp_server/hooks/mutation-feedback.ts)
  └ 54 lines found

I found a second area worth checking carefully: `memory_context` appears to do its own rollout gating for `SPECKIT_AUTO_RESUME` and `SPECKIT_PRESSURE_POLICY`. If that path treats “no caller identity” as allowed, it would contradict the documented fail-closed behavior of `SPECKIT_ROLLOUT_PERCENT`. I’m validating the exact branch now.

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L435:466 (32 lines read)

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L671:690 (20 lines read)

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L792:807 (16 lines read)

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L921:936 (16 lines read)

● Read memory-context.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
  └ L988:1006 (19 lines read)

● Read memory-context.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
  └ L1094:1148 (55 lines read)

● Read rollout-policy.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts
  └ L53:74 (22 lines read)

● Read progressive-disclosure.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts
  └ L260:430 (171 lines read)

● Search (grep)
  │ "requestedSessionId|effectiveSessionId|generate.*session|randomUUID|sessionLifecycle"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
  └ 5 lines found

● Search (grep)
  │ "function buildProgressiveResponse|function resolveCursor|export
  │ \{|DEFAULT_PAGE_SIZE|remainingCount"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts)
  └ 93 lines found

● Read session-state.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/session-state.ts
  └ L225:360 (136 lines read)

● Search (grep)
  │ "requestedSessionId|effectiveSessionId"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
  └ 97 lines found

● Search (grep)
  │ "resolveSessionLifecycle|resumeOrCreate|requested_session|sessionId: effectiveSessionId"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
  └ 23 lines found

● Search (grep)
  │ "openQuestions|addQuestion\("
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
  └ 7 lines found

● Search (grep)
  │ "progressive disclosure|cursor pagination|session state|goalRefinement|memory-search-ux-hooks"
  │ in **/*.vitest.ts (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 7 files found

● Read memory-context.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
  └ L652:690 (39 lines read)

● Read memory-search-ux-hooks.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts
  └ L1:260 (179 lines read)

● Search (grep)
  │ "openQuestions|addQuestion\(|preferredAnchors|setAnchors\(|goalRefinement|progressiveDisclosure|
  │ continuation"
  │ (.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-ux-hooks.vitest.ts)
  └ 37 lines found

● Search (grep)
  │ "result-explain|confidence|mode-aware|profile-formatters|empty result"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
  └ 45 lines found

I found another potential traceability/correctness gap: the session-state surface promises `openQuestions` tracking, but the live search handler only sets goals, anchors, and seen IDs. I’m now confirming whether any runtime path ever calls `addQuestion()` or whether `openQuestions` is effectively dead data.

● Search (grep)
  │ "open questions|openQuestions"
  │ (.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)
  └ 11 lines found

● Search (grep)
  │ "addQuestion\(" in **/*.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 12 lines found

● Search (grep)
  │ "openQuestions" in **/*.{ts,md} (.opencode/skill/system-spec-kit/mcp_server)
  └ 39 lines found

● Search (grep)
  │ "preferredAnchors|seenResultIds|activeGoal"
  │ (.opencode/skill/system-spec-kit/feature_catalog/18--ux-hooks/17-retrieval-session-state.md)
  └ 6 lines found

I’ve confirmed the `openQuestions` issue: the feature is documented as live, the state manager supports it, and tests cover the method itself, but no production path ever calls `addQuestion()`. I’m checking one last traceability edge around server-minted session IDs and rollout gating before I write up the findings.

● Search (grep)
  │ "resolveTrustedSession\(|requestedSessionId|effectiveSessionId|mint|ephemeral"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts)
  └ 44 lines found

● Search (grep)
  │ "SPECKIT_AUTO_RESUME|SPECKIT_PRESSURE_POLICY|subject to `SPECKIT_ROLLOUT_PERCENT`|calls without
  │ identity fail closed|fail closed" in **/*.md (.opencode/skill/system-spec-kit/feature_catalog)
  └ 5 lines found

● Search (grep)
  │ "SPECKIT_AUTO_RESUME|SPECKIT_PRESSURE_POLICY|getSessionPromptContext|pressure policy|rollout"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts)
  └ 33 lines found

● Search (grep)
  │ "SPECKIT_AUTO_RESUME|SPECKIT_PRESSURE_POLICY" (.opencode/skill/system-spec-kit/feature_catalog/1
  │ 9--feature-flag-reference/01-1-search-pipeline-features-speckit.md)
  └ 11 lines found

I’ve got enough source evidence for the likely findings, so I’m doing one targeted verification pass with the existing Vitest suites that cover UX hooks and session state. That lets me distinguish “code drift” from “audit missed a real regression.”

● Search (grep)
  │ "post-mutation|mutation hook|memory-save|postMutationHooks" in **/*.vitest.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 15 files found

✗ Run targeted UX hook tests (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/mcp_server' && npx vitest run
  │ tests/memory-search-ux-hooks.vitest.ts tests/session-state.vitest.ts --reporter=verbose
  └ Permission denied and could not request permission from user

● Read hooks-mutation-wiring.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/hooks-mutation-wiring.vitest.ts
  └ L1:220 (141 lines read)

● Read hooks-ux-feedback.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/hooks-ux-feedback.vitest.ts
  └ L1:220 (132 lines read)

● Read context-server.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/context-server.vitest.ts
  └ L1:260 (260 lines read)

One of the original feature-flag audit findings now looks stale rather than still valid: the current `05-5-embedding-and-api.md` already points at production sources. I’m collecting the source-line proof so I can separate “audit was correct when written” from “current codebase still mismatches.”

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/020
  │ -feature-flag-reference/spec.md
  └ L167:190 (24 lines read)

● Search (grep)
  │ "COHERE_API_KEY|OPENAI_API_KEY|VOYAGE_API_KEY|EMBEDDINGS_PROVIDER|EMBEDDING_DIM|RERANKER_LOCAL"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts)
  └ 31 lines found

● Search (grep)
  │ "COHERE_API_KEY|OPENAI_API_KEY|VOYAGE_API_KEY|EMBEDDINGS_PROVIDER|EMBEDDING_DIM|RERANKER_LOCAL"
  │ (.opencode/skill/system-spec-kit/shared/embeddings/factory.ts)
  └ 111 lines found

● Search (grep)
  │ "EMBEDDING_DIM" (.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts)
  └ 25 lines found

I found a stronger flag-pipeline problem than I expected: `memory_search` is not using the canonical `search-flags.ts` gate for progressive disclosure at all. It imports a local helper from `progressive-disclosure.ts`, and that helper only checks the env var directly, so rollout-policy semantics never apply there. I’m pulling the exact export/import lines now.

● Read progressive-disclosure.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/progressive-disclosure.ts
  └ L471:495 (25 lines read)

● Read search-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
  └ L409:425 (17 lines read)

● Search (grep)
  │ "isProgressiveDisclosureEnabled\(" in **/*.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 60 lines found

● Search (grep)
  │ "isSessionRetrievalStateEnabled\(" in **/*.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 67 lines found

# 1. Summary

**P0:** 0  
**P1:** 3  
**P2:** 1  

**Files reviewed:** 26 files across audit specs, feature catalog entries, runtime handlers, flag helpers, session/rollout code, and existing Vitest coverage.

**Dimension coverage:** correctness, security, traceability, maintainability.

**Scope outcome:** `018/F01` and `018/F16` are implemented and wired. `018/F17` is still mismatched, but the prior audit understated the problem. `020/F05` is **not reproducible on current HEAD** and should no longer be tracked as an open partial mismatch.

Direct `vitest` execution was blocked by environment permissions, so validation here is source-and-test-code based.

# 2. Findings

## A1 — P1 — Progressive disclosure bypasses the canonical rollout gate

**Evidence**

- `mcp_server/handlers/memory-search.ts:75-80` imports `isProgressiveDisclosureEnabled` from `lib/search/progressive-disclosure.ts`, and `mcp_server/handlers/memory-search.ts:795-805` uses that gate.
- `mcp_server/lib/search/progressive-disclosure.ts:227-229,473-495` exports a local gate that only checks `SPECKIT_PROGRESSIVE_DISCLOSURE_V1 !== false/0`.
- `mcp_server/lib/search/search-flags.ts:409-416` already defines the canonical gate via `isFeatureEnabled('SPECKIT_PROGRESSIVE_DISCLOSURE_V1')`.
- `mcp_server/lib/cognitive/rollout-policy.ts:64-70` applies fail-closed rollout behavior when no identity is supplied.

**Impact**

`SPECKIT_ROLLOUT_PERCENT` does not apply to progressive disclosure in the live `memory_search` path, even though the server has a canonical rollout-aware flag helper. This is a pipeline-connection bug and a maintainability drift point.

**Fix recommendation**

Route progressive-disclosure gating through `search-flags.ts` only, or make the local helper delegate to that canonical implementation. Add a regression test covering partial rollout behavior.

## A2 — P1 — `memory_context` rollout semantics contradict the documented fail-closed policy

**Evidence**

- `feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:102,114` and `feature_catalog/FEATURE_CATALOG.md:4470` describe `SPECKIT_ROLLOUT_PERCENT` as a global gate whose calls without identity fail closed.
- `mcp_server/lib/cognitive/rollout-policy.ts:64-70` implements that fail-closed rule.
- `mcp_server/lib/session/session-manager.ts:315-319` mints `crypto.randomUUID()` when the caller omits `sessionId`.
- `mcp_server/handlers/memory-context.ts:999-1003` gates `SPECKIT_PRESSURE_POLICY` and `SPECKIT_AUTO_RESUME` with `isIdentityInRollout(effectiveSessionId)`.

**Impact**

Anonymous `memory_context` calls do **not** fail closed under partial rollout. They get randomly bucketed using a server-minted UUID, so pressure-policy and auto-resume behavior can flicker across retries and does not match the published rollout contract.

**Fix recommendation**

Use caller-supplied/trusted identity for rollout gating, or explicitly document and stabilize server-minted rollout identity semantics. Today the docs and runtime disagree.

## A3 — P1 — `openQuestions` is documented as live session-state output but is never populated

**Evidence**

- `feature_catalog/18--ux-hooks/17-retrieval-session-state.md:18-29`, `feature_catalog/FEATURE_CATALOG.md:4297`, and `feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md:123` all describe `openQuestions` as tracked state.
- `mcp_server/lib/search/session-state.ts:144-147` implements `addQuestion()`.
- `mcp_server/handlers/memory-search.ts:314-321` exposes `openQuestions` in the response payload.
- But the live handler only updates goal/anchors/seen IDs at `mcp_server/handlers/memory-search.ts:675-689,925-931`.
- Repository search found `addQuestion()` used only in `mcp_server/tests/session-state.vitest.ts:189-193`, not in production code.

**Impact**

Clients can receive an `openQuestions` field, but it will remain empty in normal runtime flows. This means the current audit for `018/F17` is incomplete: the issue is not just stale header text.

**Fix recommendation**

Either wire unresolved-question capture into the live retrieval flow, or remove `openQuestions` from current-reality docs until it is actually fed by production code.

## A4 — P2 — The `020/F05` audit finding is stale on current HEAD

**Evidence**

- The audit still claims `F05` is partial because source files point at tests: `.opencode/specs/.../020-feature-flag-reference/spec.md:178-186`.
- The current catalog now points to production sources: `feature_catalog/19--feature-flag-reference/05-5-embedding-and-api.md:20-25`.
- Those production files do contain the cited behavior:
  - `mcp_server/lib/search/cross-encoder.ts:40,48,181-183,251,293`
  - `shared/embeddings/factory.ts:84,168-169,204-234,263-266,282-285`
  - `mcp_server/lib/search/vector-index-store.ts:82,89-91,126`

**Impact**

The audit trail still reports a resolved documentation problem as open, which weakens remediation tracking and can waste follow-up review time.

**Fix recommendation**

Update the `020-feature-flag-reference` audit spec to mark `F05` resolved / `MATCH`, or annotate it as a post-audit fix.

# 3. Cross-references checked

- **018 / F01 — Shared post-mutation hook wiring:** confirmed.  
  Evidence: `handlers/memory-save.ts:1046-1098`, `handlers/mutation-hooks.ts:19-103`, `hooks/mutation-feedback.ts:6-58`, `tests/hooks-mutation-wiring.vitest.ts:70-105`, `tests/hooks-ux-feedback.vitest.ts:7-61`.

- **018 / F16 — Progressive disclosure:** confirmed as wired, but flag gating is flawed.  
  Evidence: `handlers/memory-search.ts:441-466,795-807`, `lib/search/progressive-disclosure.ts:299-401,419-429`, `tests/memory-search-ux-hooks.vitest.ts:136-178`.

- **018 / F17 — Retrieval session state:** prior PARTIAL is still valid for header drift, but incomplete.  
  Evidence: `lib/search/session-state.ts:11` vs `lib/search/search-flags.ts:421-424`, plus A3 above.

- **020 / F05 — Embedding/API source references:** prior PARTIAL is no longer valid on current HEAD.  
  Evidence: see A4.

# 4. Dimension-specific notes

- **Correctness:** core UX payload wiring exists for mutation feedback, progressive disclosure, and session-state envelopes. The main correctness gaps are rollout behavior drift and the unwired `openQuestions` claim.

- **Security:** no direct data-exposure issue found in this scope. The closest security-adjacent risk is rollout/governance drift, where operators cannot rely on documented flag behavior.

- **Traceability:** the audit docs need refresh. `018/F17` understates the runtime gap, and `020/F05` appears resolved but still tracked as partial.

- **Maintainability:** flag logic is duplicated (`search-flags.ts` vs `progressive-disclosure.ts`), which already caused behavior drift. Existing tests cover UX payloads well, but do not cover rollout-policy interactions for these features.

