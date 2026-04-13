---
title: Deep Research Strategy
description: Runtime strategy for packet 017 search fusion and reranking tuning.
---

# Deep Research Strategy - Search Fusion & Reranking Tuning

Runtime packet for `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/017-research-search-fusion-tuning`.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Track the 35-iteration investigation into fusion weights, RRF calibration, reranker thresholds, FSRS decay assumptions, cache observability, and the safest implementation seams for the packet’s four follow-on implementation phases, followed by a 10-iteration post-implementation verification wave that checked the shipped runtime, telemetry semantics, and doc alignment.

### Usage

- Iterations 1-10 established the "what should change" recommendations.
- Iterations 11-20 answered "how do we change it safely" without modifying source files.
- Iterations 21-25 cross-validated those findings, ranked phases `001`-`004` by impact versus risk, documented edge cases, resolved the remaining phase `003` scope question, and finalized the implementation-ready handoff.
- Iterations 26-35 verified the shipped post-implementation state, including continuity-intent propagation, cache telemetry semantics, doc alignment, second-order effects, and the next research-phase agenda.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC
Search fusion weight optimization, reranking threshold calibration, and safe implementation guidance for continuity-oriented system-spec-kit MCP searches.

---

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- None. Iterations 26-35 completed the post-implementation verification wave.

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS

- No source edits under `.opencode/skill/system-spec-kit/mcp_server/`
- No historical memory-save analysis or telemetry backfill
- No provider live benchmarking that requires external credentials or a running local reranker
- No packet-wide implementation plan outside the `research/` directory

---

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS

- Complete 35 packet-local iterations
- Address RQ-1 through RQ-15 plus the remaining phase `003` scope question with either evidence-backed answers or explicit bounded unknowns
- Produce implementation-facing recommendations for phases `001`-`004`, then verify the shipped post-implementation state without changing runtime code

---

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Decide whether phase `003-continuity-search-profile` should stay adaptive-fusion-only or widen into a public continuity intent across classifier/routing/tool surfaces.
- Verify whether the continuity profile actually reaches Stage 3 MMR on the shipped runtime.
- Determine whether the current reranker cache telemetry contract is sufficient for monitoring.
- Verify whether `ARCHITECTURE.md`, `SKILL.md`, and `configs/README.md` describe the shipped runtime accurately.
- Identify second-order effects from removing the length penalty and raising `MIN_RESULTS_FOR_RERANK` to `4`.
- Define what the next research phase should investigate now that the implementation shipped.

<!-- /ANCHOR:answered-questions -->
<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Reading the cross-encoder module plus the Stage 3 entrypoint exposed the real rerank knobs in one pass. (iteration 1)
- Reading the config README alongside the JSON prevented over-attributing behavior to a stale config surface. (iteration 2)
- Cross-checking code comments, docs, and config notes quickly separated canonical invariants from packet-local knobs. (iteration 3)
- Reading the shared algorithm plus the hybrid caller showed the effective control path end to end. (iteration 4)
- The repo's own eval tooling gave a direct answer about K sensitivity without needing to invent a new metric. (iteration 5)
- Separating vector-only ranking from hybrid fusion made the packet question answerable instead of ambiguous. (iteration 6)
- The fixture corpus was enough to compare first-hit quality uplift without needing networked reranker calls. (iteration 7)
- Sampling the actual markdown corpus answered the threshold-fit question much better than debating the penalty constants abstractly. (iteration 8)
- Holding recommendations until the code and corpus evidence were both in hand avoided speculative tuning. (iteration 9)
- The packet converged once the research target moved from "edit one JSON file" to "follow the real control surfaces." (iteration 10)
- Following the parameter from tool schema to pipeline config made the compatibility risk obvious very quickly. (iteration 11)
- Test-first blast-radius mapping translated the abstract removal decision into an immediately actionable implementation checklist. (iteration 12)
- Staying close to existing module boundaries made the status-shape decision much cleaner than inventing a new telemetry plane. (iteration 13)
- Comparing the packet sub-phase scope against the existing telemetry contracts prevented phase creep. (iteration 14)
- Checking the function signatures first showed that adaptive fusion is more decoupled from the typed intent system than the packet wording implies. (iteration 15)
- Walking outward from the typed union exposed the true boundary between "new profile" and "new public intent". (iteration 16)
- Separating Stage 3 policy from cross-encoder behavior narrowed the expected fallout a lot. (iteration 17)
- Searching the tests by helper name immediately separated threshold-sensitive fixtures from direct module tests. (iteration 18)
- Comparing the typed and untyped K-sweep paths exposed a clear "cheap first, broader later" implementation route. (iteration 19)
- Splitting the resumed loop by implementation phase turned a broad tuning topic into concrete change packets with clear boundaries. (iteration 20)
- Re-checking the current code and test surfaces against the packet’s own conclusions made it easy to separate real runtime contradictions from packet-local artifact drift. (iteration 21)
- Comparing behavior change, contract blast radius, and observability value produced a more actionable phase order than "finish the most interesting tuning first." (iteration 22)
- Looking for "what breaks if we only partially ship this?" uncovered sharper risks than replaying the recommended end state. (iteration 23)
- Reading both the untyped and typed evaluation harnesses made the low-risk additive path obvious. (iteration 24)
- Forcing a last-pass contradiction audit before synthesis kept the final recommendations honest and surfaced the one remaining scope choice clearly. (iteration 25)
- Following the split between `detectedIntent` and `adaptiveFusionIntent` exposed the remaining Stage 3 wiring gap much faster than reading doc summaries first. (iteration 26)
- Cross-checking resume-mode code and tests prevented conflating `/spec_kit:resume` with search-pipeline behavior. (iteration 27)
- Auditing counter write sites before designing a dashboard cleanly separated "status exists" from "status is interpretable". (iteration 28)
- Reading cache mutation paths, not just the returned status object, surfaced the eviction and occupancy ambiguities quickly. (iteration 29)
- Comparing doc wording directly against the exact runtime control flow made the alignment issues concrete instead of rhetorical. (iteration 30)
- Treating `SKILL.md` as a summary surface and the tests as executable claims made the doc audit much sharper. (iteration 31)
- Re-running targeted reranker suites after the code trace confirmed that the no-op length-penalty change is stable in practice. (iteration 32)
- Looking at `MMR_MIN_CANDIDATES` separately from `MIN_RESULTS_FOR_RERANK` surfaced the subtle small-result-set behavior change. (iteration 33)
- Grouping the residual issues into signal wiring, observability semantics, and wording precision made the post-implementation state easier to synthesize. (iteration 34)
- Turning the remaining gaps into an explicit next-phase agenda kept the packet useful after implementation instead of ending with a vague drift note. (iteration 35)

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- The packet spec understated the rerank surface by not mentioning the Stage 3 minimum-results guard. (iteration 1)
- The packet name suggests a single config file governs ranking, but the code clearly splits vector and hybrid responsibilities. (iteration 2)
- The packet's file list would have hidden the fact that the hybrid path is split across shared algorithms and `hybrid-search.ts`. (iteration 3)
- The packet framing still overemphasizes JSON config even though the weight profiles are embedded in shared TypeScript. (iteration 4)
- The harness does not directly label a continuity intent, so mapping it to packet needs remains an inference step. (iteration 5)
- There is still no dedicated `continuity` intent profile in code, so the recommendation is a mapping rather than a direct existing flag. (iteration 6)
- The tests do not capture wall-clock latency, so quality and latency remain split evidence streams. (iteration 7)
- Cache observability is fundamentally blocked by missing counters, not by lack of code access. (iteration 8)
- Some recommendations still depend on inference because the live telemetry hooks are missing. (iteration 9)
- The current repo cannot answer every performance question empirically because some metrics are simply not recorded. (iteration 10)
- Looking only at `cross-encoder.ts` would have understated the operator-facing blast radius. (iteration 11)
- The packet sub-phase spec understates how much test cleanup phase `001` really owns. (iteration 12)
- The existing "status surface" is not actually wired into operator-facing handlers, so visibility and storage remain separate questions. (iteration 13)
- The phrase "existing status surface" sounds broader than the current implementation really is. (iteration 14)
- The packet sub-phase title makes the work sound bigger than the code-path minimum actually is. (iteration 15)
- The packet sub-phase wording could easily tempt implementation into an unintended cross-cutting refactor. (iteration 16)
- The packet spec’s `4-5` range is still underdetermined without candidate-count telemetry. (iteration 17)
- The current regression suite never explicitly documents that it depends on the threshold being `2`. (iteration 18)
- The packet wording implied a single harness, but the repo actually has two distinct K-evaluation paths with different coupling. (iteration 19)
- The phase specs sometimes understated contract/test fallout, especially for length-penalty removal and public continuity intent. (iteration 20)
- The stale config and dashboard made the packet look less converged than the actual state log. (iteration 21)
- The packet’s original wording made phase `003` look deceptively adjacent to the other changes even though its risk profile is qualitatively different. (iteration 22)
- The current status surface does not tell us whether cache counters should be per-provider or process-wide, so the packet must define that explicitly during implementation. (iteration 23)
- The packet’s early wording made "the K sweep" sound singular when the repo actually maintains two evaluation paths with different coupling. (iteration 24)
- The packet’s stale reducer outputs hid how close the research actually was to convergence. (iteration 25)
- The docs made the continuity lambda sound fully live even though the search path and canonical resume path still diverge. (iteration 26)
- "Resume-style retrieval" wording obscured that resume mode bypasses `handleMemorySearch()` entirely. (iteration 27)
- The counter interface looks more complete at the type level than it is semantically for monitoring. (iteration 28)
- Cache `evictions` is too overloaded to interpret confidently without reading the code. (iteration 29)
- `ARCHITECTURE.md` and `configs/README.md` describe the continuity lambda more strongly than the runtime currently supports. (iteration 30)
- Existing tests prove the pieces independently but not the end-to-end continuity-to-Stage3 handoff. (iteration 31)
- The retired length-penalty path still leaves behind compatibility plumbing and stale cache-key commentary that can mislead future readers. (iteration 32)
- The Stage 3 threshold change sounds like a pure cost optimization, but small-result-set MMR means it also changes relevance behavior. (iteration 33)
- Post-implementation audit work can look "done" once tests pass, even when signal contracts and docs are still misaligned. (iteration 34)
- The next research phase is now about semantics and operator intent, not about better weights, so repeating the old tuning loop would waste time. (iteration 35)

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Adding counters directly to per-result payload rows; cache behavior is module-level, not document-level. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Adding counters directly to per-result payload rows; cache behavior is module-level, not document-level.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding counters directly to per-result payload rows; cache behavior is module-level, not document-level.

### Changing the threshold inside `cross-encoder.ts`; that would be the wrong layer and would break direct reranker tests unnecessarily. -- BLOCKED (iteration 17, 1 attempts)
- What was tried: Changing the threshold inside `cross-encoder.ts`; that would be the wrong layer and would break direct reranker tests unnecessarily.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Changing the threshold inside `cross-encoder.ts`; that would be the wrong layer and would break direct reranker tests unnecessarily.

### Changing the TTL based on a derived hit rate from current exports. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Changing the TTL based on a derived hit rate from current exports.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Changing the TTL based on a derived hit rate from current exports.

### Claiming real provider latency distributions from the fixture-only test corpus. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Claiming real provider latency distributions from the fixture-only test corpus.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Claiming real provider latency distributions from the fixture-only test corpus.

### Continuing to treat broad public continuity intent as the default scope for phase `003`. -- BLOCKED (iteration 25, 1 attempts)
- What was tried: Continuing to treat broad public continuity intent as the default scope for phase `003`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Continuing to treat broad public continuity intent as the default scope for phase `003`.

### Coupling phase `002` to TTL retuning or dashboard work; the packet sub-phase spec is right to keep that out of scope. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Coupling phase `002` to TTL retuning or dashboard work; the packet sub-phase spec is right to keep that out of scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Coupling phase `002` to TTL retuning or dashboard work; the packet sub-phase spec is right to keep that out of scope.

### Keeping the constants in code "just for tests". That would preserve dead behavior rather than removing it. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Keeping the constants in code "just for tests". That would preserve dead behavior rather than removing it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Keeping the constants in code "just for tests". That would preserve dead behavior rather than removing it.

### Live benchmark runs against configured providers were not available within packet constraints. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Live benchmark runs against configured providers were not available within packet constraints.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Live benchmark runs against configured providers were not available within packet constraints.

### Mass-editing every reranker test file after raising the Stage 3 minimum; the threshold blast radius is narrower than that. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: Mass-editing every reranker test file after raising the Stage 3 minimum; the threshold blast radius is narrower than that.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Mass-editing every reranker test file after raising the Stage 3 minimum; the threshold blast radius is narrower than that.

### None beyond previously ruled-out config assumptions. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: None beyond previously ruled-out config assumptions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None beyond previously ruled-out config assumptions.

### None beyond the cache observability gap. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: None beyond the cache observability gap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None beyond the cache observability gap.

### None this iteration. -- BLOCKED (iteration 25, 24 attempts)
- What was tried: None this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None this iteration.

### Ranking the follow-on phases by algorithmic novelty instead of combined impact and implementation risk. -- BLOCKED (iteration 22, 1 attempts)
- What was tried: Ranking the follow-on phases by algorithmic novelty instead of combined impact and implementation risk.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ranking the follow-on phases by algorithmic novelty instead of combined impact and implementation risk.

### Reopening FSRS or `search-weights.json` as unresolved convergence topics. -- BLOCKED (iteration 21, 1 attempts)
- What was tried: Reopening FSRS or `search-weights.json` as unresolved convergence topics.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reopening FSRS or `search-weights.json` as unresolved convergence topics.

### Replacing the deleted penalty with a higher threshold in phase `001`; that contradicts the user’s explicit removal decision. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Replacing the deleted penalty with a higher threshold in phase `001`; that contradicts the user’s explicit removal decision.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Replacing the deleted penalty with a higher threshold in phase `001`; that contradicts the user’s explicit removal decision.

### Sneaking `continuity` into `INTENT_WEIGHT_PROFILES` and pretending the MCP/tool surface automatically supports it; the handler currently validates explicit intents against `IntentType`. -- BLOCKED (iteration 16, 1 attempts)
- What was tried: Sneaking `continuity` into `INTENT_WEIGHT_PROFILES` and pretending the MCP/tool surface automatically supports it; the handler currently validates explicit intents against `IntentType`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Sneaking `continuity` into `INTENT_WEIGHT_PROFILES` and pretending the MCP/tool surface automatically supports it; the handler currently validates explicit intents against `IntentType`.

### Starting with `runJudgedKSweep()` for continuity before the profile/intent question is settled. -- BLOCKED (iteration 19, 1 attempts)
- What was tried: Starting with `runJudgedKSweep()` for continuity before the profile/intent question is settled.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Starting with `runJudgedKSweep()` for continuity before the profile/intent question is settled.

### Treating `getRerankerStatus()` as already operator-visible; the repo evidence does not support that. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Treating `getRerankerStatus()` as already operator-visible; the repo evidence does not support that.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `getRerankerStatus()` as already operator-visible; the repo evidence does not support that.

### Treating all four implementation sub-phases as symmetric. Their safe scopes are meaningfully different. -- BLOCKED (iteration 20, 1 attempts)
- What was tried: Treating all four implementation sub-phases as symmetric. Their safe scopes are meaningfully different.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating all four implementation sub-phases as symmetric. Their safe scopes are meaningfully different.

### Treating local reranker behavior as independent from the Stage 3 minimum-results gate. -- BLOCKED (iteration 23, 1 attempts)
- What was tried: Treating local reranker behavior as independent from the Stage 3 minimum-results gate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating local reranker behavior as independent from the Stage 3 minimum-results gate.

### Treating phase `001` as a one-line constant deletion with no compatibility work. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Treating phase `001` as a one-line constant deletion with no compatibility work.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating phase `001` as a one-line constant deletion with no compatibility work.

### Treating the evaluation-comparison suite as evidence for Stage 3 threshold behavior; it tests the reranker module directly. -- BLOCKED (iteration 18, 1 attempts)
- What was tried: Treating the evaluation-comparison suite as evidence for Stage 3 threshold behavior; it tests the reranker module directly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the evaluation-comparison suite as evidence for Stage 3 threshold behavior; it tests the reranker module directly.

### Treating the new profile as a change to `DEFAULT_WEIGHTS`; continuity needs to be explicit, not a silent default drift. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Treating the new profile as a change to `DEFAULT_WEIGHTS`; continuity needs to be explicit, not a silent default drift.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the new profile as a change to `DEFAULT_WEIGHTS`; continuity needs to be explicit, not a silent default drift.

### Treating the packet's shorter Stage 1 and Stage 2 file paths as authoritative. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating the packet's shorter Stage 1 and Stage 2 file paths as authoritative.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the packet's shorter Stage 1 and Stage 2 file paths as authoritative.

### Trying to keep a broad public continuity intent "optional" while leaving the current validator and test enums untouched. -- BLOCKED (iteration 23, 1 attempts)
- What was tried: Trying to keep a broad public continuity intent "optional" while leaving the current validator and test enums untouched.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Trying to keep a broad public continuity intent "optional" while leaving the current validator and test enums untouched.

### Assuming `INTENT_LAMBDA_MAP.continuity` is enough to make continuity live end to end in Stage 3. -- BLOCKED (iteration 26, 1 attempts)
- What was tried: Assuming `INTENT_LAMBDA_MAP.continuity` is enough to make continuity live end to end in Stage 3.
- Why blocked: The live Stage 3 code still reads `config.detectedIntent`, not `config.adaptiveFusionIntent`.
- Do NOT retry: Assuming `INTENT_LAMBDA_MAP.continuity` is enough to make continuity live end to end in Stage 3.

### Treating `/spec_kit:resume` as a hybrid-search path. -- BLOCKED (iteration 27, 1 attempts)
- What was tried: Treating `/spec_kit:resume` as a hybrid-search path.
- Why blocked: Resume mode explicitly bypasses `handleMemorySearch()` and reads the canonical document ladder directly.
- Do NOT retry: Treating `/spec_kit:resume` as a hybrid-search path.

### Treating `getRerankerStatus()` as dashboard-ready just because the status object looks complete. -- BLOCKED (iteration 29, 1 attempts)
- What was tried: Treating `getRerankerStatus()` as dashboard-ready just because the status object looks complete.
- Why blocked: Counter semantics are still too ambiguous for operator monitoring without extra context.
- Do NOT retry: Treating `getRerankerStatus()` as dashboard-ready just because the status object looks complete.

### Treating `MIN_RESULTS_FOR_RERANK = 4` as "no reordering below 4". -- BLOCKED (iteration 33, 1 attempts)
- What was tried: Treating `MIN_RESULTS_FOR_RERANK = 4` as "no reordering below 4".
- Why blocked: MMR still activates at 2+ candidates and can move small result sets even when reranking is skipped.
- Do NOT retry: Treating `MIN_RESULTS_FOR_RERANK = 4` as "no reordering below 4".

### Reopening weight tuning before the Stage 3 intent contract and telemetry semantics are resolved. -- BLOCKED (iteration 35, 1 attempts)
- What was tried: Reopening weight tuning before the Stage 3 intent contract and telemetry semantics are resolved.
- Why blocked: The residual gaps are now contract-level and observability-level, not weight-level.
- Do NOT retry: Reopening weight tuning before the Stage 3 intent contract and telemetry semantics are resolved.

### Using `search-weights.json` as the primary continuity tuning surface. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Using `search-weights.json` as the primary continuity tuning surface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using `search-weights.json` as the primary continuity tuning surface.

### Using ground-truth or typed judged-sweep expansion as the first continuity benchmark step. -- BLOCKED (iteration 24, 1 attempts)
- What was tried: Using ground-truth or typed judged-sweep expansion as the first continuity benchmark step.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using ground-truth or typed judged-sweep expansion as the first continuity benchmark step.

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- None this iteration. (iteration 1)
- None this iteration. (iteration 1)
- None this iteration. (iteration 2)
- None this iteration. (iteration 2)
- None this iteration. (iteration 3)
- Treating the packet's shorter Stage 1 and Stage 2 file paths as authoritative. (iteration 3)
- None this iteration. (iteration 4)
- None this iteration. (iteration 4)
- None this iteration. (iteration 5)
- None this iteration. (iteration 5)
- None this iteration. (iteration 6)
- Using `search-weights.json` as the primary continuity tuning surface. (iteration 6)
- Claiming real provider latency distributions from the fixture-only test corpus. (iteration 7)
- Live benchmark runs against configured providers were not available within packet constraints. (iteration 7)
- Changing the TTL based on a derived hit rate from current exports. (iteration 8)
- None beyond the cache observability gap. (iteration 8)
- None beyond previously ruled-out config assumptions. (iteration 9)
- None this iteration. (iteration 9)
- None this iteration. (iteration 10)
- None this iteration. (iteration 10)
- None this iteration. (iteration 11)
- Treating phase `001` as a one-line constant deletion with no compatibility work. (iteration 11)
- Keeping the constants in code "just for tests". That would preserve dead behavior rather than removing it. (iteration 12)
- Replacing the deleted penalty with a higher threshold in phase `001`; that contradicts the user’s explicit removal decision. (iteration 12)
- Adding counters directly to per-result payload rows; cache behavior is module-level, not document-level. (iteration 13)
- None this iteration. (iteration 13)
- Coupling phase `002` to TTL retuning or dashboard work; the packet sub-phase spec is right to keep that out of scope. (iteration 14)
- Treating `getRerankerStatus()` as already operator-visible; the repo evidence does not support that. (iteration 14)
- None this iteration. (iteration 15)
- Treating the new profile as a change to `DEFAULT_WEIGHTS`; continuity needs to be explicit, not a silent default drift. (iteration 15)
- None this iteration. (iteration 16)
- Sneaking `continuity` into `INTENT_WEIGHT_PROFILES` and pretending the MCP/tool surface automatically supports it; the handler currently validates explicit intents against `IntentType`. (iteration 16)
- Changing the threshold inside `cross-encoder.ts`; that would be the wrong layer and would break direct reranker tests unnecessarily. (iteration 17)
- None this iteration. (iteration 17)
- Mass-editing every reranker test file after raising the Stage 3 minimum; the threshold blast radius is narrower than that. (iteration 18)
- Treating the evaluation-comparison suite as evidence for Stage 3 threshold behavior; it tests the reranker module directly. (iteration 18)
- None this iteration. (iteration 19)
- Starting with `runJudgedKSweep()` for continuity before the profile/intent question is settled. (iteration 19)
- None this iteration. (iteration 20)
- Treating all four implementation sub-phases as symmetric. Their safe scopes are meaningfully different. (iteration 20)
- None this iteration. (iteration 21)
- Reopening FSRS or `search-weights.json` as unresolved convergence topics. (iteration 21)
- None this iteration. (iteration 22)
- Ranking the follow-on phases by algorithmic novelty instead of combined impact and implementation risk. (iteration 22)
- Treating local reranker behavior as independent from the Stage 3 minimum-results gate. (iteration 23)
- Trying to keep a broad public continuity intent "optional" while leaving the current validator and test enums untouched. (iteration 23)
- None this iteration. (iteration 24)
- Using ground-truth or typed judged-sweep expansion as the first continuity benchmark step. (iteration 24)
- Continuing to treat broad public continuity intent as the default scope for phase `003`. (iteration 25)
- None this iteration. (iteration 25)
- Assuming `INTENT_LAMBDA_MAP.continuity` is enough to make continuity live end to end in Stage 3. (iteration 26)
- None this iteration. (iteration 26)
- Treating `/spec_kit:resume` as a hybrid-search path. (iteration 27)
- None this iteration. (iteration 27)
- None this iteration. (iteration 28)
- None this iteration. (iteration 28)
- Building a meaningful monitoring dashboard from hits and misses alone. (iteration 29)
- None this iteration. (iteration 29)
- Treating `ARCHITECTURE.md` and `configs/README.md` as fully aligned because the constant values match. (iteration 30)
- None this iteration. (iteration 30)
- Assuming the existing test surface already proves Stage 3 continuity-lambda behavior. (iteration 31)
- None this iteration. (iteration 31)
- Expecting the retired length penalty to still create meaningful ranking drift. (iteration 32)
- None this iteration. (iteration 32)
- Treating `MIN_RESULTS_FOR_RERANK = 4` as only a reranker-cost optimization. (iteration 33)
- None this iteration. (iteration 33)
- Reopening broad fusion-weight tuning as the next research target. (iteration 34)
- None this iteration. (iteration 34)
- Repeating the old weight-tuning loop before the Stage 3 intent contract and telemetry semantics are resolved. (iteration 35)
- None this iteration. (iteration 35)

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Open a follow-on research phase for Stage 3 intent unification and reranker observability semantics, then patch the overstated continuity wording across `ARCHITECTURE.md`, `configs/README.md`, and repeated catalog surfaces once the intended contract is explicit.

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT

- Hybrid fusion is assembled in `hybrid-search.ts` by converting FTS and BM25 into a single keyword list, then applying adaptive intent weights before calling shared RRF fusion.
- Stage 2 adds bounded recency fusion (`0.07`, cap `0.10`) and multiple post-fusion amplifiers.
- Stage 3 reranks whenever at least `MIN_RESULTS_FOR_RERANK` candidates survive and a reranker is enabled.
- Search-style `profile='resume'` calls rewrite `adaptiveFusionIntent` to `continuity`, but Stage 3 MMR still reads `detectedIntent`.
- Canonical resume mode reads `handover.md -> _memory.continuity -> spec docs` directly and does not call `handleMemorySearch()`.
- `getRerankerStatus()` is process-local inspection telemetry today; `resetSession()` clears its counters, latency samples, and circuit state.
- The search packet is continuity-sensitive, so canonical spec-doc retrieval should prefer stable source-of-truth documents over freshness-heavy heuristics.
- User decisions now locked for follow-on implementation: remove the length penalty entirely, keep FSRS `0.2346` unchanged, favor a continuity profile near `semantic 0.52 / keyword 0.18 / recency 0.07 / graph 0.23`, raise the rerank minimum into the `4-5` range with `4` as the safest first step, and treat phase `003` as a narrow internal continuity profile first rather than a broad public-intent expansion.

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES

- Max iterations executed: 35
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- `research/research.md` ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new`, `resume`, `restart`
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-04-13T04:50:40Z
- Iterations 11-20 focus: safe implementation guidance only; still read-only against runtime code
- Iterations 21-25 focus: convergence, contradiction checks, impact-versus-risk prioritization, edge-case capture, safe K-sweep extension, and final synthesis
- Iterations 26-35 focus: post-implementation runtime verification, telemetry semantics, doc alignment, second-order-effects analysis, and next-phase definition
- Additional packet constraints: no source edits, no git commit or push
<!-- /ANCHOR:research-boundaries -->
