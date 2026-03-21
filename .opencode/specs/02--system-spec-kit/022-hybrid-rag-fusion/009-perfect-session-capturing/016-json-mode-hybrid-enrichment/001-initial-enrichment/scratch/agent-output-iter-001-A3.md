# Iteration 1: Domain D -- Indexing & Crawlability (Steps 10, 10.5, 11)

## Focus
Investigate what makes trigger phrases effective vs. useless (Q4/Q7), how the indexing pipeline processes and stores them, and what determines ranking in memory_search() results after MCP indexing (Q8). Analyzed the input-normalizer trigger phrase flow, post-save-review path fragment detection, the save handler pipeline, and sampled 5 real memory files for trigger phrase quality.

## Findings

### F1: CRITICAL -- Massive trigger phrase pollution from auto-extraction
Real memory files contain 15-30 trigger phrases dominated by path fragments, n-gram shingles, and generic tokens. Evidence from `architecture-audit.md`: phrases like `"and missing"`, `"kit/022"`, `"fusion/005"`, `"architecture"`, `"audit"` are path-derived noise. The `indexing-normalization.md` file is worse: `"even specs/ .opencode/specs/ file"`, `"roots contribute identical files"`, `"anomalies occur metadata hints"` -- these are sliding-window n-gram shingles extracted from body text, not meaningful retrieval keys.

[SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/memory/20-03-26_15-26__architecture-audit.md, lines 5-31]
[SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/002-indexing-normalization/memory/20-03-26_11-05__indexing-normalization.md, lines 5-30]

### F2: HIGH -- Path fragment detection in post-save-review catches only single-token fragments
The `post-save-review.ts` PATH_FRAGMENT_PATTERNS (lines 184-189) detect single short words (`/^[a-z]{1,4}$/`), stopwords, directory names, and generic file stems. However, multi-token path fragments like `"system spec kit/022 hybrid rag fusion/005 architecture audit"` and `"kit/022"` are NOT detected because they contain slashes/numbers and are multi-word. The first trigger phrase in almost every sampled memory is a full path-to-spec-folder slug (e.g., `"system spec kit/022 hybrid rag fusion/019 deep research rag improvement"`). These consume trigger phrase slots and add no retrieval value since the path is already indexed via file_path metadata.

[SOURCE: .opencode/skill/system-spec-kit/scripts/core/post-save-review.ts:184-194]

### F3: HIGH -- Manual trigger phrases are stored on `_manualTriggerPhrases` but auto-extracted phrases can dilute them
In `input-normalizer.ts`, when the AI provides explicit `triggerPhrases`, they are copied to `_manualTriggerPhrases` (line 451). These manual phrases are then passed to `buildSessionSummaryObservation()` as `facts` (line 278-279, line 550). However, the downstream template/frontmatter rendering likely adds auto-extracted phrases ON TOP of the manual ones, creating a diluted set where the intentional domain-specific phrases are buried among noise.

[SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:430-451]
[SOURCE: .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:549-551]

### F4: HIGH -- Contrast between manual-quality and auto-extracted trigger phrases is stark
Compare the spec-kit-phase-system memory (older, likely manually curated): `["spec kit phase system", "spec 139", "phase decomposition workflow", "spec kit:phase", "recommend-level phasing"]` -- 5 precise, domain-relevant phrases. Versus the architecture-audit memory (auto-extracted): 30 phrases dominated by function names (`"estimate token count"`, `"extract quality score"`), path tokens (`"kit/022"`, `"fusion/005"`), and fragments (`"and missing"`, `"audit"`). The manually curated set would perform dramatically better in trigger matching because every phrase maps to a real retrieval intent.

[SOURCE: .opencode/specs/02--system-spec-kit/021-spec-kit-phase-system/memory/20-02-26_18-04__spec-kit-phase-system.md:5-9]
[SOURCE: .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/memory/20-03-26_15-26__architecture-audit.md:5-31]

### F5: IMPORTANT -- memory_search() ranking uses a 4-channel hybrid pipeline
After indexing, search ranking is determined by: (1) Vector similarity via Voyage AI 1024d embeddings, (2) FTS5/BM25 full-text scoring, (3) Graph connectivity (co-activation + causal signals), (4) Typed-weighted degree scoring. These are fused via intent-weighted adaptive RRF, then MMR diversity reranking, then confidence gap truncation. This means trigger_phrases primarily affect the `memory_match_triggers` fast-path (binary match, not scored) and BM25/FTS5 channels, while the vector channel depends on the embedding of the full content.

[SOURCE: .opencode/skill/system-spec-kit/README.md:281]
[SOURCE: .opencode/skill/system-spec-kit/README.md:629]

### F6: IMPORTANT -- Deferred indexing creates potentially "invisible" memories for vector search
When embedding generation fails or async mode is requested, memories get `embedding_status = 'pending'` and are searchable ONLY via BM25/FTS5, not vector similarity. The save pipeline README explicitly states: "remains searchable via BM25/FTS5" (line 69). This means memories with failed embeddings are partially invisible -- they appear in BM25-matching queries but NOT in semantic similarity searches. There is no documented monitoring or alerting for memories stuck in pending state.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:69]

### F7: IMPORTANT -- Trigger matcher is binary, not scored
The `memory-triggers.ts` handler (line 227) assigns score 1.0 to all trigger matches -- they are binary hit/miss. This means a memory with 30 noisy triggers that happens to match one generic word ranks equal to a memory with 5 precise triggers that matches the exact domain concept. The match quality signal is completely lost.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:227]

### F8: MEDIUM -- The save pipeline has 9 stages, with trigger phrases having no dedicated validation stage
The save pipeline flow is: dedup -> embedding -> save-quality-gate -> pe-orchestration -> reconsolidation -> create-record -> db-helpers -> post-insert -> response-builder. None of these stages validate trigger phrase quality (e.g., minimum phrase length, maximum count, path-fragment filtering, deduplication against file_path). The post-save-review catches some issues AFTER the save, but it runs post-hoc and only flags for manual AI patching -- it does not prevent bad trigger phrases from entering the index.

[SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md:52-62]

## Sources Consulted
- `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts` (full file, 383 lines)
- `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` (trigger phrase grep, 15+ matches)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md` (full file, 88 lines)
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts` (grep results)
- `.opencode/skill/system-spec-kit/README.md` (grep results on ranking/search)
- 5 real memory files (frontmatter analysis)

## Assessment
- New information ratio: 0.88 (7 of 8 findings are new, F5 partially known from strategy's Known Context)
- Questions addressed: Q4, Q7, Q8
- Questions answered: Q7 (trigger phrase effectiveness -- comprehensive analysis), Q8 (ranking determinants -- 4-channel pipeline with binary trigger matching)

## Reflection
- What worked and why: Sampling real memory files was the highest-value action because it revealed the ground truth of trigger phrase pollution that no amount of code reading alone would show. The contrast between manually-curated (5 precise phrases) and auto-extracted (30 noisy phrases) is the clearest evidence of the problem.
- What did not work and why: The memory-frontmatter.ts renderer file does not exist at the expected path, suggesting the rendering logic may have been restructured. This gap means I cannot trace exactly WHERE auto-extraction happens (the missing link between input-normalizer storing _manualTriggerPhrases and the final frontmatter output).
- What I would do differently: Start by finding the actual frontmatter rendering logic (likely in a template or renderer module) to complete the trigger phrase generation chain from JSON input to saved file.

## Recommended Next Focus
Domain A (Pipeline Data Integrity): Trace the complete trigger phrase generation chain -- find the renderer/template that produces the final frontmatter trigger_phrases array, determine whether _manualTriggerPhrases survive or get overwritten by auto-extraction, and map the exact code path where the n-gram shingle extraction happens. This would close the gap between what input-normalizer stores and what ends up in the saved file.
