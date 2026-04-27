# Iteration 006 - Q4 weak retrieval hallucination guard

## Focus

Q4: diagnose the weak-retrieval hallucination class from sibling 006 and define the runtime response contract that should prevent models from inventing spec packets or file paths when retrieval confidence is weak.

## Actions Taken

1. Re-read Iteration 005 and the state log to avoid duplicating the already-covered Q5 work.
2. Inspected sibling 006 findings and the I2 `cli-opencode` run/score artifacts that captured the hallucination.
3. Inspected `memory_search` response formatting, request-quality scoring, and recovery-payload construction.
4. Compared the live I2 response shape against the formatter and recovery-payload source to identify the missing guard.

## Findings

### 1. The strongest source evidence is `cli-opencode`, not `cli-codex` or `cli-copilot`

Sibling 006 describes the major I2 failure as `cli-opencode` fabricating paths and packet IDs when `memory_search` returned weak retrieval evidence (`006-search-intelligence-stress-test/002-scenario-execution/findings.md:14`, `:30`, `:72-74`, `:96-102`). The I2 score file says `cli-opencode` recommended `lib/search/README.md`, `lib/search/pipeline/`, `023-hybrid-rag-fusion-refinement/...`, and `022-hybrid-rag-fusion/...`, then verified those were not valid current codebase locations (`runs/I2/cli-opencode-1/score.md:3-12`, `:18-24`).

The raw run shows why the model was tempted. `memory_match_triggers` matched broad `"search"` triggers and surfaced unrelated or stale-looking packets, while `cocoindex_code_search` returned mirror/spec paths plus the canonical `.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md` entry (`runs/I2/cli-opencode-1/output.txt:3-5`). The final answer then collapsed those mixed signals into confident recommendations (`output.txt:12`).

### 2. The recovery payload is advisory, but not binding

`memory_search` returned a structured warning in the I2 run: `requestQuality.label="weak"`, `recovery.status="low_confidence"`, `recovery.reason="knowledge_gap"`, `recovery.suggestedQueries=[]`, and `recovery.recommendedAction="ask_user"` (`runs/I2/cli-opencode-1/output.txt:5`). That is the right raw signal, but it sits beside a returned result and normal `Found 5 memories` framing, so the model can still treat the payload as useful evidence.

Source confirms this is by design today. `formatSearchResults()` computes request quality and recovery metadata for non-empty results, but then returns a normal success envelope with `results`, `requestQuality`, and optional `recovery` merged into `data` (`mcp_server/formatters/search-results.ts:951-983`, `:1025-1035`). There is no hard refusal state, no "do not cite these paths" contract, and no field that marks low-confidence results as non-authoritative.

### 3. Empty `suggestedQueries` is a known allowed state, but it is unsafe with `ask_user`

`buildRecoveryPayload()` always returns the four core fields, but suggestions are generated only by local query-rewrite heuristics (`mcp_server/lib/search/recovery-payload.ts:107-147`, `:272-283`). For short/generic queries like `search bug debugging`, none of the rewrite rules must produce a suggestion. The recommended action can still become `ask_user` for `low_confidence + knowledge_gap` (`recovery-payload.ts:152-163`).

The tests assert shape and uniqueness, not a guardrail invariant. They allow `suggestedQueries` to be an array and validate fallback suggestions for empty/null queries, but they do not assert that `recommendedAction:"ask_user"` with an empty suggestion list emits a blocking instruction or suppresses result citation (`tests/d5-recovery-payload.vitest.ts:250-259`, `:262-310`, `:314-340`; `tests/empty-result-recovery.vitest.ts:111-130`).

### 4. Request quality is ranking confidence, not provenance authority

The confidence module explicitly scopes itself to ranking confidence, not freshness or structural truth (`mcp_server/lib/search/confidence-scoring.ts:24-25`). It labels a request `"weak"` when results exist but top score or confidence ratio are mixed (`confidence-scoring.ts:284-315`). That means downstream agents need a second, stronger policy layer: "weak ranking evidence can guide the next search, but must not be cited as canonical context."

## Questions Answered

### Q4 root cause

The runtime emits weak-retrieval diagnostics as soft metadata inside an otherwise successful search result. When `requestQuality:"weak"` combines with `recovery.status:"low_confidence"`, `recommendedAction:"ask_user"`, and empty `suggestedQueries`, the model receives no binding instruction to stop. It can cite the low-confidence results, merge them with mirror/cached retrieval hits, and invent plausible current paths.

### Q4 recommended guardrail contract

Add a hard "non-authoritative retrieval" branch before the success response is handed to the model:

1. If `requestQuality.label !== "good"` and `recovery.recommendedAction === "ask_user"`, set `data.citationPolicy = "do_not_cite_results"` and `data.answerPolicy = "ask_disambiguating_question"`.
2. If `recovery.suggestedQueries.length === 0`, synthesize 2-3 generic-but-safe suggestions from the query intent, or require a user clarification. Empty suggestions should not coexist with a non-authoritative result set and no next step.
3. Add a top-level hint that is operational, not advisory: `No canonical context found. Do not invent file paths, spec folders, or packet IDs. Ask the user to clarify or run a broader query.`
4. In renderers/agent wrappers, suppress normal "Found N memories" framing for non-authoritative results. Prefer `Retrieved weak candidates; none are safe to cite yet`.
5. Add regression tests that parse the final envelope for the I2 shape and assert the guard fields are present and results are marked non-citable.

## Questions Remaining

- Q6: empty/stale code-graph recovery.
- Q7: supersedes-heavy causal-edge growth.
- Q8: broader intent classifier consistency.

Q2, Q3, and Q5 now have source-backed recommendations in prior iterations. Q4 is answered for the observed `cli-opencode` failure class; a separate cross-runtime replay would be needed to prove the same exact failure mode for `cli-codex` or `cli-copilot`.

## Next Focus

Q6: investigate the empty/sparse code-graph recovery path and recommend a fast scan-on-empty or warm-start protocol so callers do not spend minutes falling back to grep.
