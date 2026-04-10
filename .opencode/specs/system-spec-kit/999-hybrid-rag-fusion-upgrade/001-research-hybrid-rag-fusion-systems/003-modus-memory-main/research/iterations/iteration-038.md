# Iteration 038: OPEN QUESTIONS REGISTER

## Focus
OPEN QUESTIONS REGISTER: Catalog all remaining open questions, uncertainties, and items needing further investigation across all 37 prior iterations.

## Findings

### Finding 1: `memory_review` is decided in principle, but its public contract is still the highest-priority unresolved item
- **Source**: `research/iterations/iteration-031.md`; `research/iterations/iteration-032.md`; `research/iterations/iteration-036.md`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts` [SOURCE: research/iterations/iteration-031.md:6174-6191, research/iterations/iteration-032.md:201-217, research/iterations/iteration-036.md:16-20,61-79, .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:164-169,297-317, .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:39-43,65-72,197-215]
- **What it does**: Late-stage research repeatedly converges on shipping `memory_review` first, because Public already exposes grade primitives and `processReview()` internally, while the public mutation surface still stops at `memory_validate` and opt-in `trackAccess`. The remaining uncertainty is contract-level: identifier choice, accepted grades, batch semantics, returned fields, and the exact boundary between graded review, usefulness feedback, and access tracking.
- **Why it matters**: This is the first implementation blocker. Until the `memory_review` contract is explicit, downstream work like `memory_due`, review-oriented docs, and contract tests stays underspecified.
- **Recommendation**: **adopt now**
- **Impact**: **high**
- **Source strength**: **primary**

### Finding 2: `memory_due` remains intentionally blocked because Public has review math but no authoritative due-state model
- **Source**: `research/iterations/iteration-031.md`; `research/iterations/iteration-036.md`; `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts`; `.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts` [SOURCE: research/iterations/iteration-031.md:6175-6191, research/iterations/iteration-036.md:19-20, .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:65-72,177-215, .opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:143-171, .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:569-579,840-877]
- **What it does**: The roadmap iterations defer `memory_due` until after `memory_review`. The code already computes `nextReviewDate`, but current saved metadata surfaces only `stability`, `difficulty`, and `review_count`, while search-side testing-effect writes update `last_review`, `review_count`, and `access_count` without persisting a due-date field. The unresolved design question is whether due-ness should be stored, derived at query time, or maintained through a hybrid contract.
- **Why it matters**: This is the main remaining architecture question if Public wants a real spaced-repetition queue instead of isolated FSRS math.
- **Recommendation**: **NEW FEATURE**
- **Impact**: **high**
- **Source strength**: **primary**

### Finding 3: doctor/debug output is conceptually settled as an overlay, but its response shape and entrypoint are still open
- **Source**: `research/iterations/iteration-032.md`; `research/iterations/iteration-037.md`; `external/cmd/modus-memory/doctor.go`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` [SOURCE: research/iterations/iteration-032.md:201-217, research/iterations/iteration-037.md:43-49,103-121, external/cmd/modus-memory/doctor.go:13-31,42-58,86-105,108-166, .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:222-340, .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:127-128,1318-1333, .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:211-212,691-702,1325-1339]
- **What it does**: The research resolved the architecture question: doctor/debug should summarize existing `memory_health` and debug-profile data rather than replacing those authorities. The remaining open work is the UX contract: new tool vs new `reportMode` vs `debug` profile, summary depth, and how repair confirmation and degradation semantics stay visible.
- **Why it matters**: If the overlay becomes too separate, Public regains the split-brain diagnostics problem the research just rejected. If it stays too implicit, it misses the DX goal that motivated the idea.
- **Recommendation**: **NEW FEATURE**
- **Impact**: **medium**
- **Source strength**: **primary**

### Finding 4: connected-doc appendices and weak-result lexical fallback are the biggest remaining prototype questions, not settled adoption items
- **Source**: `research/iterations/iteration-034.md`; `research/iterations/iteration-035.md`; `research/iterations/iteration-037.md`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`; `external/internal/mcp/vault.go` [SOURCE: research/iterations/iteration-034.md:24-29,67-85, research/iterations/iteration-035.md:16-20,40-45,63-81, research/iterations/iteration-037.md:59-83,103-121, .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:771-809,812-859, external/internal/mcp/vault.go:901-924]
- **What it does**: The late research consistently bounds both ideas to low-authority overlays under `memory_search`, not new top-level lanes. What remains open is empirical and contract-oriented: trigger thresholds, merge rules, appendix labeling, whether hints need their own follow-up surface, and what latency and judged-relevance budgets they must satisfy before rollout.
- **Why it matters**: These are the only remaining search-quality ideas with clear upside, but they are also the easiest way to blur routing authority, duplicate code-graph/causal semantics, or regress latency.
- **Recommendation**: **prototype later**
- **Impact**: **high**
- **Source strength**: **primary**

### Finding 5: the last major gap is rollout evidence, not source discovery
- **Source**: `research/iterations/iteration-033.md`; `research/iterations/iteration-034.md`; `research/iterations/iteration-035.md`; `research/iterations/iteration-036.md`; `.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts`; `.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts` [SOURCE: research/iterations/iteration-033.md:7957-7958, research/iterations/iteration-034.md:80-85, research/iterations/iteration-035.md:75-81, research/iterations/iteration-036.md:8-12,61-79, .opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:54-90, .opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:194-254]
- **What it does**: Prior iterations largely converged on what to build, but not on the concrete release gates. Existing tests already cover FSRS math and testing-effect formulas, while the late passes still call for a contract test matrix, judged retrieval regression pack, routing playbook, workflow map, and benchmark budgets. The open question is which of those artifacts are mandatory before any public-surface change ships.
- **Why it matters**: The remaining risk is now mostly validation and rollout discipline, not missing source comprehension.
- **Recommendation**: **adopt now**
- **Impact**: **high**
- **Source strength**: **primary**

## Sources Consulted
- `research/iterations/iteration-031.md:6174-6191`
- `research/iterations/iteration-032.md:201-217`
- `research/iterations/iteration-033.md:7957-7958`
- `research/iterations/iteration-034.md:24-29,67-85`
- `research/iterations/iteration-035.md:16-20,40-45,63-81`
- `research/iterations/iteration-036.md:8-20,61-79`
- `research/iterations/iteration-037.md:43-83,103-121`
- `external/cmd/modus-memory/doctor.go:13-31,42-58,86-105,108-166`
- `external/internal/mcp/vault.go:901-924`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:164-169,297-317`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:127-128,1318-1333`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:211-212,691-702,771-859,1325-1339`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:222-340`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:143-171`
- `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts:39-43,65-72,177-215`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts:569-579,840-877`
- `.opencode/skill/system-spec-kit/mcp_server/tests/memory-search-integration.vitest.ts:54-90`
- `.opencode/skill/system-spec-kit/mcp_server/tests/cognitive-gaps.vitest.ts:194-254`

## Assessment
- New information ratio: **0.11**
- Questions addressed: which issues from iterations 001-037 are still unresolved; which remaining items are contract questions vs architecture questions vs validation questions; which directions are blocked versus merely deferred.
- Questions answered: the unresolved backlog now collapses to five clusters: `memory_review` contract, `memory_due` due-state model, doctor/debug overlay shape, low-authority search overlays, and rollout evidence requirements.
- Novelty justification: Earlier iterations settled most directions one by one; this pass isolates only the unresolved seams that still prevent immediate implementation planning.

## Ruled Out
- Reopening settled rejections such as fuzzy Jaccard cache reuse, default write-on-read reinforcement, a monolithic `vault_*` lane, or direct markdown writes for spec memory, because late iterations already closed those questions with primary-source evidence.
- Treating the absence of reducer-owned JSONL/strategy files in this packet as a Modus/Public product uncertainty, because that is packet-hygiene debt rather than a remaining architecture question about the memory system itself.
- Starting new external-source exploration, because the remaining uncertainty is now concentrated in Public-side contracts, rollout artifacts, and validation gates.

## Reflection
- What worked: using the late-iteration assessment and recommended-next-focus chain as a filter, then re-reading only the live Public surfaces those iterations still left open.
- What did not work: the accumulated iteration files are noisy and duplicated, so broad artifact mining remained less efficient than targeted source verification.
- What I would do differently: on a reducer-managed run, keep a dedicated machine-owned open-questions registry so this endgame pass can diff unresolved items directly instead of reconstructing them from repeated synthesis text.

## Recommended Next Focus
Freeze the Q1 design packet in this order: `memory_review` API contract, `memory_due` ADR, doctor/debug overlay response shape, then the validation pack (contract tests, routing playbook, benchmark gates) before any prototype of lexical fallback or connected-memory appendix.


Total usage est:        1 Premium request
API time spent:         4m 53s
Total session time:     5m 12s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.8m in, 20.1k out, 1.7m cached, 9.5k reasoning (Est. 1 Premium request)
