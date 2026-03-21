● skill(sk-deep-research)

I’m tracing the search pipeline against the hybrid-RAG specs now, then I’ll distill concrete spec/code mismatches and dead paths with exact citations.

● memory_match_triggers
  └ {"summary":"Matched 5 memories via trigger phrases","data":{"matchType":"trig...

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/lib/search/**/*"
  └ 58 files found

● Search (glob)
  │ ".opencode/specs/**/022-hybrid-rag-fusion/**/*"
  └ 5 files found

● search hybrid rag fusion search pipeline in mcp_server lib search rerank fusion stages spec imple…
  └ {"success":true,"results":[],"total_returned":0,"offset":0,"message":null}

I found the search module surface area. Next I’m narrowing to the hybrid-RAG spec docs and the pipeline entrypoints that should implement them.

● Read README.md
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/README.md
  └ 1 line read

● Read README.md
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md
  └ 117 lines read

● Search (grep)
  │ "hybrid-rag-fusion|RSF|fusion|rerank|channel|stage[1-4]|pipeline|hybrid search" in
  │ **/*.{md,json} (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion)
  └ 5 lines found

● Search (glob)
  │ ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/*"
  └ 4 files found

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/spec.md
  └ L1:260 (259 lines read)

● Read implementation-summary.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/implementation-summary.md
  └ L1:260 (244 lines read)

● Search (grep)
  │ "REQ-|CHK-|hybrid|fusion|rerank|pipeline|stage|artifact|feedback|session boost|causal
  │ boost|MMR|MPAB|state immutability|score resolution|constitutional"
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/spec.md)
  └ 22 lines found

● Search (grep)
  │ "executePipeline|Stage 1|Stage 2|Stage 3|Stage 4|score
  │ invariant|immutable|RSF|RRF|MMR|MPAB|artifact|feedback|session boost|causal boost|intent
  │ weights|constitutional" in **/*.{ts,md} (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 5 lines found

● Search (grep)
  │ "pipeline|stage|orchestrator|candidate|fusion|rerank|filter|immutability|atomic|retry|DB
  │ safety|artifact|MPAB|MMR" in **/*.md (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/
  │ 007-code-audit-per-feature-catalog/014-pipeline-architecture)
  └ 5 lines found

● Search (grep)
  │ "Stage 1|Stage 2|Stage 3|Stage 4|single fusion point|artifact
  │ routing|feedback|MPAB|MMR|RSF|R12|score immutability|G2|Stage 4 is filtering|no score changes"
  │ in **/*.md
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic)
  └ 5 lines found

● Search (glob)
  │ ".opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/{001-hybrid-rag-fusion-epic,007-code-
  │ audit-per-feature-catalog/014-pipeline-architecture,007-code-audit-per-feature-catalog/001-retri
  │ eval,009-perfect-session-capturing}/**/*"
  └ 5 files found

I’ve got the root epic and pipeline docs. Now I’m reading the concrete sprint and stage implementations to compare promised behavior with the actual control flow.

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ 1 line read

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ 1 line read

● Read stage3-rerank.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts
  └ 1 line read

● Read types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts
  └ 429 lines read

● Read stage4-filter.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage4-filter.ts
  └ 365 lines read

● Read orchestrator.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/orchestrator.ts
  └ 78 lines read

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/014
  │ -pipeline-architecture/spec.md
  └ L1:320 (198 lines read)

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/spec.md
  └ L1:320 (256 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L1:320 (320 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L321:640 (320 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L341:760 (420 lines read)

● Read stage3-rerank.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts
  └ L1:360 (360 lines read)

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L1:340 (340 lines read)

● Read stage3-rerank.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts
  └ L361:760 (304 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L361:760 (399 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1:360 (360 lines read)

● Search (grep)
  │ "export async function executeStage1|export async function executeStage2|export async function
  │ executeStage3|executePipeline\(|SPECKIT_PIPELINE_V2|pipeline v2|usePipeline|executeStage4|chunk
  │ collapse|mpab|mmr|artifactRouting|trackAccess|Stage 4" in **/*.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 88 lines found

I’ve confirmed the four stage modules exist. The next question is whether the live `memory_search` path actually uses them or still runs the legacy hybrid-search stack.

● Search (grep)
  │ "searchWithFallback\(|hybridSearchEnhanced\(|memory_search|memorySearch|search handler|session
  │ dedup|post-cache|trackAccess" in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "executePipeline\(|SPECKIT_PIPELINE_V2|pipeline/orchestrator|executeStage1\(|executeStage2\(|exe
  │ cuteStage3\(|executeStage4\(" in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 53 lines found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/*memory-search*.ts"
  └ No matches found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/**/*search*.ts"
  └ 22 files found

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L900:1120 (220 lines read)

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L1121:1360 (143 lines read)

● Read pipeline-v2.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts
  └ L280:312 (33 lines read)

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L1:220 (219 lines read)

● Read search-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
  └ L90:140 (51 lines read)

● Search (grep)
  │ "artifactRouting|annotations|metadata.stage|stage1|stage2|stage3|stage4|session
  │ dedup|enableDedup|cache|post-cache|pipelineResult"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
  └ 48 lines found

● Read stage2-fusion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ L760:920 (94 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L580:700 (121 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L640:860 (62 lines read)

● Read stage3-rerank.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts
  └ L148:230 (82 lines read)

● Read anchor-metadata.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts
  └ L1:220 (188 lines read)

● Read validation-metadata.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/validation-metadata.ts
  └ L1:260 (260 lines read)

● Search (grep)
  │ "channelAttribution|enrichResultsWithAnchorMetadata|enrichResultsWithValidationMetadata|validati
  │ onMetadata|anchorMetadata"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts)
  └ 8 lines found

A bigger pattern is emerging: Stage 1 may already be calling a legacy “enhanced hybrid search” that performs fusion and reranking itself, which would undercut the clean 4-stage contract. I’m verifying that path now.

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L740:1045 (306 lines read)

● Read hybrid-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts
  └ L1046:1165 (120 lines read)

● Search (grep)
  │ "R6|Stage 4|no score changes in Stage 4|pipeline refactor|searchWithFallback"
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/spec.md)
  └ 21 lines found

● Search (grep)
  │ "function searchWithFallback|async function
  │ searchWithFallback|hybridSearchEnhanced\(|collapseAndReassembleChunkResults\(|applyMMR\(|rerankL
  │ ocal\(|crossEncoder|truncateByConfidence|enforceChannelRepresentation"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts)
  └ 16 lines found

I’ve confirmed one concrete architectural violation: Stage 1 is delegating to a legacy path that already fuses, reranks, truncates, and aggregates before the “official” Stage 2 and Stage 3 even run. I’m checking a couple more suspicious signals to separate real bugs from mere doc drift.

● Read artifact-routing.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts
  └ L1:260 (259 lines read)

● Search (grep)
  │ "boostFactor|maxResults|detectedClass|artifact
  │ class|routing|applyRoutingWeights|getStrategyForQuery"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts)
  └ 40 lines found

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/spec.md
  └ L548:560 (13 lines read)

● Search (grep)
  │ "resolveEffectiveScore\(|rerankerScore|stage2Score|extractScoringValue|score:
  │ rerankScore|intentAdjustedScore" in **/*.{ts,md} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "artifact routing|artifact class|maxResults|boostFactor|spec.md|tasks.md|checklist.md|memory
  │ artifact" in **/*.md (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion)
  └ 5 lines found

● Read artifact-routing.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts
  └ L236:304 (69 lines read)

● Read artifact-routing.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/artifact-routing.ts
  └ L300:345 (46 lines read)

● Read README.md
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/README.md
  └ L1:220 (219 lines read)

● Read types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts
  └ L48:68 (21 lines read)

● Read types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts
  └ L270:284 (15 lines read)

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/spec.md
  └ L286:296 (11 lines read)

● Search (grep)
  │ "artifactBoostApplied|artifact
  │ routing|stage2Score|rerankerScore|resolveEffectiveScore|Stage4Invariant|session dedup" in
  │ **/*.vitest.ts (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 45 lines found

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L220:360 (141 lines read)

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L600:720 (121 lines read)

● Search (grep)
  │ "function applyArtifactRouting|const
  │ applyArtifactRouting|applyRoutingWeights\(|getStrategyForQuery\("
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
  └ 3 lines found

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L488:506 (18 lines read)

● Search (grep)
  │ "applyArtifactRouting\(" in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Read memory-search-quality-filter.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/memory-search-quality-filter.vitest.ts
  └ L56:90 (35 lines read)

● Read artifact-routing.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/artifact-routing.vitest.ts
  └ L210:230 (21 lines read)

Top findings from iteration 14:

- **High — split-brain pipeline.** Spec says Stage 1 = candidate generation, Stage 2 = fusion, Stage 3 = rerank, Stage 4 = filter/dedup-only, but runtime Stage 1 calls `searchWithFallback()`, which already does fusion, MPAB, channel enforcement, confidence truncation, MMR, co-activation, folder scoring, token-budget truncation, and context-header injection. That collapses the stage boundaries. [`001-hybrid-rag-fusion-epic/spec.md:548-558`; `handlers/memory-search.ts:929-969`; `pipeline/stage1-candidate-gen.ts:271-316,408-441`; `lib/search/hybrid-search.ts:745-1057`]

- **High — reranker output can be ignored downstream.** `resolveEffectiveScore()` prefers `intentAdjustedScore`/`rrfScore` over `score`; Stage 3 reranking updates `score` but leaves the higher-priority Stage 2 fields intact, then later MMR/final sort/evidence-gap logic read the stale fields. [`pipeline/types.ts:48-68`; `pipeline/stage2-fusion.ts:165-172,761-797`; `pipeline/stage3-rerank.ts:186-203,369-380,495-502,535-537`; `pipeline/stage4-filter.ts:203-216,269-283`]

- **Medium — Stage 4 contract drift.** Spec/types say Stage 4 owns session dedup and constitutional guarantee, but implementation explicitly moves dedup after cache in the handler, and constitutional injection happens in Stage 1. [`001-hybrid-rag-fusion-epic/spec.md:557`; `pipeline/types.ts:270-284`; `pipeline/stage4-filter.ts:34-35,236-237`; `handlers/memory-search.ts:1081-1115`; `pipeline/stage1-candidate-gen.ts:524-579`]

- **Medium — artifact routing is mostly ranking-inert.** Routing chooses one query-level class, then multiplies *every* result by the same `boostFactor`, which preserves ordering; only `maxResults` slicing materially changes output. Tests validate scaled scores/metadata, not retrieval behavior. [`lib/search/artifact-routing.ts:21-33,236-338`; `pipeline/stage2-fusion.ts:364-391,763-770`; `tests/artifact-routing.vitest.ts:210-224`]

