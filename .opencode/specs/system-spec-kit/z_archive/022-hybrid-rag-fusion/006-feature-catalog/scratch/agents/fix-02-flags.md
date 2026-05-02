● skill(sk-doc)

I’m verifying each catalog entry against the actual implementation first, then I’ll patch only the incorrect claims and show the diffs.

● Read 01-1-search-pipeline-features-speckit.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-
  │ features-speckit.md
  └ 1 line read

● Read 03-3-mcp-configuration.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/03-3-mcp-configuratio
  │ n.md
  └ 40 lines read

● Read 05-5-embedding-and-api.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/05-5-embedding-and-ap
  │ i.md
  └ 39 lines read

● Read 06-6-debug-and-telemetry.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/06-6-debug-and-teleme
  │ try.md
  └ 46 lines read

✗ Read plan.md
  │ .copilot/session-state/c59a970a-9bc2-4462-a769-0bac00048407/plan.md
  └ Path does not exist

● Read generate-context.js
  │ .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js
  └ L1:40 (40 lines read)

● Search (grep)
  │ "SPECKIT_TEMPORAL_CONTIGUITY|SPECKIT_HYDE_ACTIVE|SPECKIT_GRAPH_CONCEPT_ROUTING|MCP_MAX_MEMORY_TO
  │ KENS|EMBEDDING_DIM|RERANKER_LOCAL|SPECKIT_CONSUMPTION_LOG" (.opencode/skill/system-spec-kit)
  └ 5 lines found

I found the target tables; now I’m reading the exact implementation lines that back each flag so the fixes stay evidence-based.

✗ Read factory.ts
  │ .opencode/skill/system-spec-kit/mcp_server/shared/embeddings/factory.ts
  └ Path does not exist

● Search (grep)
  │ "SPECKIT_TEMPORAL_CONTIGUITY|SPECKIT_HYDE_ACTIVE|SPECKIT_GRAPH_CONCEPT_ROUTING"
  │ (.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline
  │ -features-speckit.md)
  └ 2 lines found

● Read search-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
  └ L220:325 (106 lines read)

● Read hyde.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts
  └ L1:80 (80 lines read)

✗ Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/stage1-candidate-gen.ts
  └ Path does not exist

● Read preflight.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts
  └ L500:520 (21 lines read)

● Read local-reranker.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts
  └ L228:260 (33 lines read)

● Read consumption-logger.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts
  └ L1:110 (110 lines read)

● Create session plan file (shell)
  │ mkdir -p
  │ '/Users/michelkerkmeester/.copilot/session-state/c59a970a-9bc2-4462-a769-0bac00048407' && cat
  │ >
  │ '/Users/michelkerkmeester/.copilot/session-state/c59a970a-9bc2-4462-a769-0bac00048407/plan.md'
  │ <<'EOF'…
  └ 8 lines...

I’ve confirmed the token-budget and local-reranker behaviors. I’m locating the remaining source anchors now so the edits match the code exactly, including the new missing flags.

● Search (glob)
  │ "**/factory.ts" in .opencode/skill/system-spec-kit
  └ 1 file found

● Search (glob)
  │ "**/stage1-candidate-gen.ts" in .opencode/skill/system-spec-kit
  └ 1 file found

● Read 01-1-search-pipeline-features-speckit.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-
  │ features-speckit.md
  └ L60:98 (39 lines read)

● Read plan.md
  │ ~/.copilot/session-state/c59a970a-9bc2-4462-a769-0bac00048407/plan.md
  └ 6 lines read

● Search (grep)
  │ "EMBEDDING_DIM|RERANKER_LOCAL|MCP_MAX_MEMORY_TOKENS|SPECKIT_CONSUMPTION_LOG"
  │ (.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference)
  └ 6 lines found

I’ve got the exact spots now. Next step is patching the four docs, including the two missing rows in the search-pipeline catalog and the corrected fallback/error semantics elsewhere.

● Read factory.ts
  │ .opencode/skill/system-spec-kit/shared/embeddings/factory.ts
  └ L150:180 (31 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L308:324 (17 lines read)

● Read 01-1-search-pipeline-features-speckit.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-
  │ features-speckit.md
  └ L44:60 (17 lines read)

● Read 01-1-search-pipeline-features-speckit.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-
  │ features-speckit.md
  └ L84:92 (9 lines read)

● Search (grep)
  │ "EMBEDDING_DIM" (.opencode/skill/system-spec-kit)
  └ 45 lines found

One detail I’m checking before editing: whether the source-file columns should also be corrected, not just the prose. If the code proves that, I’ll update those anchors too so the catalog stays self-consistent.

● Read vector-index-store.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts
  └ L82:130 (49 lines read)

● Read feature-flag-reference-docs.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts
  └ L1:220 (174 lines read)

● Search (grep)
  │ "SPECKIT_TEMPORAL_CONTIGUITY|SPECKIT_HYDE_ACTIVE"
  │ (.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference)
  └ 1 line found

● Search (grep)
  │ "03-3-mcp-configuration|05-5-embedding-and-api|06-6-debug-and-telemetry|01-1-search-pipeline-fea
  │ tures-speckit" in *.ts (.opencode/skill/system-spec-kit)
  └ 9 lines found

I found a targeted Vitest suite for these catalog docs, so I’m using that as the repo-native check before and after the edits rather than guessing at custom validation.

● Read validate_document.py
  │ .agents/skills/sk-doc/scripts/validate_document.py
  └ L1:120 (120 lines read)

● Run targeted feature flag docs tests (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/mcp_server' && npx vitest run
  │ tests/feature-flag-reference-docs.vitest.ts --reporter=verbose
  └ 36 lines...

Baseline targeted docs tests are green. I’m editing the four rows now and keeping the table ordering sane so the catalog remains easy to diff and maintain.

● Search (grep)
  │ "SPECKIT_TEMP|SPECKIT_TRACE|SPECKIT_TOKEN|SPECKIT_T" (.opencode/skill/system-spec-kit/feature_ca
  │ talog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md)
  └ 2 lines found

● Read 01-1-search-pipeline-features-speckit.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-
  │ features-speckit.md
  └ L108:136 (28 lines read)

I’ve got the insertion points. I’m checking the actual temporal-contiguity and HyDE-active call sites now so the new rows describe behavior, not just the flag comments.

● Search (grep)
  │ "TemporalContiguity|SPECKIT_TEMPORAL_CONTIGUITY|HYDE_ACTIVE|isHyDEActive|SPECKIT_HYDE_ACTIVE"
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 18 lines found

● Read search-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
  └ L330:360 (31 lines read)

I confirmed both missing flags are real runtime toggles, not just comments. I’m pulling their usage sites too so the new descriptions reflect what the pipeline actually does.

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L660:716 (57 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L928:944 (17 lines read)

● Read hyde.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts
  └ L104:118 (15 lines read)

● Search (grep)
  │ "graphActivated|activation"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts)
  └ 3 lines found

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L324:342 (19 lines read)

I’ve got enough evidence to patch cleanly now: one wording fix in MCP config, two in embedding/API, one in debug/telemetry, and three changes in the search-pipeline catalog including two new rows.

● Edit
  │ Edit .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipe
  │ line-features-speckit.md
  │ Edit .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/03-3-mcp-configu
  │ ration.md
  │ Edit .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/05-5-embedding-a
  │ nd-api.md
  └ Edit .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/06-6-debug-and-t
    elemetry.md

The edits are in. I’m running the targeted Vitest suite again plus the markdown validator on the four touched files, then I’ll show the diffs.

● Show diffs for touched docs (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public' && git --no-pager diff --
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipelin
  │ e-features-speckit.md .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-referen
  │ ce/03-3-mcp-configuration.md .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-
  │ reference/05-5-embedding-and-api.md .opencode/skill/system-spec-kit/feature_catalog/19--featur…
  └ 73 lines...

● Validate touched markdown docs (shell)
  │ python3 '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.agents/skills/sk-doc/scripts/validate_document.py'
  │ '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit
  │ /feature_catalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md' --type
  │ reference && python3 '/Users/michelkerkmeester/MEGA/Development/Opencode …
  └ 27 lines...

● Re-run targeted feature flag docs tests (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/mcp_server' && npx vitest run
  │ tests/feature-flag-reference-docs.vitest.ts --reporter=verbose
  └ 36 lines...

Validation passed, so I’m surfacing the exact diffs next rather than just summarizing them.

● Show diff 01-1-search-pipeline-features-speckit.md
  │
  │  72    | `SPECKIT_FOLDER_SCORING` | `true` | boolean | `lib/search/folder-relevance.ts` | Sprint
  │         1 two-phase folder-relevance scoring. When enabled, re-ranks results by spec folder
  │        relevance using a two-phase retrieval strategy. Disabled by setting to `'false'`. |
  │
  │  73    | `SPECKIT_FOLDER_TOP_K` | `5` | number | `lib/search/hybrid-search.ts` | Number of top
  │        folders used in two-phase folder retrieval when `SPECKIT_FOLDER_SCORING` is active.
  │        Parsed as integer; invalid or missing values fall back to 5. |
  │  74    | `SPECKIT_GRAPH_CALIBRATION_PROFILE` | `true` | boolean |
  │        `lib/search/graph-calibration.ts` | **Default ON (graduated).** Graph calibration
  │        profiles and community thresholds. Enables calibration profile enforcement
  │        (graphWeightCap=0.05, communityScoreCap=0.03), Louvain activation gates (minDensity=0.3,
  │        minSize=10), and ablation harness with MRR/NDCG metrics. Two presets: default
  │        (conservative) and aggressive (tighter caps). |
  │  75 -  | `SPECKIT_GRAPH_CONCEPT_ROUTING` | `true` | boolean | `lib/search/entity-linker.ts` |
  │        **Default ON (graduated).** Query-time concept alias matching. Extracts noun phrases and
  │        matches against the concept alias table, recording matched concepts in trace metadata for
  │         downstream observability (does not activate graph retrieval). |
  │  75 +  | `SPECKIT_GRAPH_CONCEPT_ROUTING` | `true` | boolean | `lib/search/search-flags.ts`,
  │        `lib/search/pipeline/stage1-candidate-gen.ts` | **Default ON (graduated).** Query-time
  │        concept alias matching. Extracts noun phrases and matches against the concept alias
  │        table, and when concepts match, surfaces `graphActivated` trace metadata for downstream
  │        Stage 2 graph-channel handling. |
  │  76    | `SPECKIT_GRAPH_REFRESH_MODE` | `write_local` | enum (`off`, `write_local`, `scheduled`)
  │         | `lib/search/graph-lifecycle.ts` | **Default `write_local` (graduated).** Graph
  │        lifecycle refresh mode. `off` disables graph refresh. `write_local` runs synchronous
  │        local recompute for small dirty components (<=50 nodes). `scheduled` queues background
  │        global refresh for larger components. Dirty-node tracking persists across onWrite() calls
  │         within the process. |
  │  77    | `SPECKIT_GRAPH_SIGNALS` | `true` | boolean | `lib/search/search-flags.ts` | Enables the
  │         broader Stage 2 graph-signal surface. When active, graph momentum and causal-depth
  │        scoring remain available and the graph-walk rollout flag can graduate from `off` to
  │        `trace_only` or `bounded_runtime`. |
  │  78    | `SPECKIT_GRAPH_WALK_ROLLOUT` | inherited from `SPECKIT_GRAPH_SIGNALS` | enum (`off`,
  │        `trace_only`, `bounded_runtime`) | `lib/search/search-flags.ts` | Controls the bounded
  │        graph-walk ladder. `off` disables the walk bonus, `trace_only` keeps rollout state and
  │        diagnostics visible with zero applied bonus, and `bounded_runtime` applies the capped
  │        Stage 2 graph-walk bonus while preserving deterministic ordering protections. |
  │ ────────────────────────────────────────────────────────────────────────────────────────────────
  │  86    | `SPECKIT_MEMORY_SHARED_MEMORY` / `SPECKIT_HYDRA_SHARED_MEMORY` | `false` | boolean |
  │        `lib/config/capability-flags.ts` | Canonical / legacy alias pair for the shared-memory
  │        roadmap flag. Roadmap metadata now defaults this flag to off unless explicitly enabled
  │        with `true` or `1`, matching the live shared-spaces runtime gate. This prevents telemetry
  │         or roadmap snapshots from claiming shared memory is available before env/config rollout
  │        actually enables it. |
  │  87    | `SPECKIT_HYBRID_DECAY_POLICY` | `true` | boolean | `lib/cognitive/fsrs-scheduler.ts` |
  │        **Default ON (graduated).** Type-aware no-decay FSRS policy.
  │        Decision/constitutional/critical context types receive Infinity stability (never decay).
  │        Separate from TM-03. |
  │  88    | `SPECKIT_HYDE` | `true` | boolean | `lib/search/hyde.ts` | **Default ON (graduated).**
  │        HyDE (Hypothetical Document Embeddings). Generates a pseudo-document (~200 tokens,
  │        markdown-memory format) for deep low-confidence queries (top score < 0.45), embeds it,
  │        and merges the embedding as an additional retrieval channel. Active by default
  │        (`SPECKIT_HYDE_ACTIVE` also ON); set `SPECKIT_HYDE_ACTIVE=false` for shadow mode (logged,
  │         not merged). Budget: 1 LLM call per cache miss. |
  │  89 +  | `SPECKIT_HYDE_ACTIVE` | `true` | boolean | `lib/search/hyde.ts`,
  │        `lib/search/pipeline/stage1-candidate-gen.ts` | **Default ON (graduated).** Active-mode
  │        gate for HyDE candidate merging. When `true`, deep hybrid low-confidence HyDE candidates
  │        are merged into the candidate set. When `false`, HyDE stays in shadow mode and logs
  │        results without merging them. |
  │  90    | `SPECKIT_IMPLICIT_FEEDBACK_LOG` | `true` | boolean | `lib/feedback/feedback-ledger.ts`
  │        | **Default ON (graduated).** Shadow-only implicit feedback event ledger. Records 5 event
  │         types with confidence tiers (strong/medium/weak). No ranking side effects. |
  │  91    | `SPECKIT_INDEX_SPEC_DOCS` | `true` | boolean | `handlers/memory-index-discovery.ts` |
  │        Controls whether `memory_index_scan` indexes spec folder documents (`spec.md`, `plan.md`,
  │         `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`,
  │        `research/research.md`, `handover.md`). Set to `'false'` to skip spec docs. |
  │
  │  92    | `SPECKIT_INTERFERENCE_SCORE` | `true` | boolean | `lib/scoring/interference-scoring.ts`
  │         | Enables interference-based penalty scoring in composite scoring. When disabled (set to
  │         `'false'`), the interference computation is bypassed and the raw score passes through
  │        unchanged. |
  │ ────────────────────────────────────────────────────────────────────────────────────────────────
  │ 127    | `SPECKIT_SIGNAL_VOCAB` | `true` | boolean | `lib/parsing/trigger-matcher.ts` | Enables
  │        signal vocabulary expansion in the trigger matcher. Augments the trigger phrase
  │        vocabulary with derived signal terms during matching. Disabled with explicit `'false'`. |
  │
  │ 128    | `SPECKIT_SKIP_API_VALIDATION` | `false` | boolean | `context-server.ts` | When
  │        `'true'`, skips API key validation at startup. Useful for testing without a real
  │        embedding provider. Default is to validate API credentials. |
  │ 129    | `SPECKIT_STRICT_SCHEMAS` | `true` | boolean | `schemas/tool-input-schemas.ts` |
  │        **IMPLEMENTED (Sprint 019).** P0-1: Controls Zod schema enforcement mode for all 33 live
  │        MCP tool definitions. When `true`, `.strict()` rejects unexpected parameters with stderr
  │        logging (CHK-029). When `false`, `.passthrough()` allows undocumented parameters for
  │        backward compatibility. Validation runs per-tool in the handler layer. |
  │ 130 +  | `SPECKIT_TEMPORAL_CONTIGUITY` | `true` | boolean | `lib/search/search-flags.ts`,
  │        `lib/search/pipeline/stage1-candidate-gen.ts` | **Default ON (graduated).** Temporal
  │        contiguity boost on raw Stage 1 vector results. When enabled, hybrid/vector candidate
  │        lists are passed through `vectorSearchWithContiguity(..., 3600)` before the pipeline
  │        continues. |
  │ 131    | `SPECKIT_TRM` | `true` | boolean | `lib/search/search-flags.ts` | Enables the
  │        Transparent Reasoning Module (evidence-gap detection). Stage 4 runs a TRM Z-score
  │        analysis to detect evidence gaps and annotate results accordingly. |
  │ 132    | `SPECKIT_TYPED_TRAVERSAL` | `true` | boolean | `lib/search/causal-boost.ts` | **Default
  │         ON (graduated).** Sparse-first policy + intent-aware edge traversal. Density < 0.5
  │        constrains to 1-hop. Score: seedScore * edgePrior * hopDecay * freshness. |
  │ 133    | `SPECKIT_WORKING_MEMORY` | `true` | boolean | `lib/cognitive/working-memory.ts` |
  │        Enables the working memory system which tracks attention scores for memories seen in the
  │        current session. Working memory context is injected during resume mode and influences
  │        session-boost scoring. |
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-
    features-speckit.md

● Show diff 03-3-mcp-configuration.md
  │
  │ 21    | `MCP_CHARS_PER_TOKEN` | `4` | number | `lib/validation/preflight.ts`,
  │       `handlers/quality-loop.ts` | Characters-per-token ratio used for save-time token budget
  │       estimation during pre-flight validation. The same ratio is also shared by the quality loop
  │        when trimming to its default token budget. |
  │ 22    | `MCP_DUPLICATE_THRESHOLD` | `0.95` | number | `lib/validation/preflight.ts` | Cosine
  │       similarity threshold above which a new memory is considered a near-duplicate of an
  │       existing one during pre-flight validation. Duplicates above this threshold are rejected by
  │        the quality gate Layer 3. |
  │ 23    | `MCP_MAX_CONTENT_LENGTH` | `250000` | number | `lib/validation/preflight.ts`,
  │       `lib/parsing/memory-parser.ts` | Maximum allowed content length in characters for a memory
  │        file. Files exceeding this limit are rejected at pre-flight validation before any
  │       embedding generation or database writes. |
  │ 24 -  | `MCP_MAX_MEMORY_TOKENS` | `8000` | number | `lib/validation/preflight.ts` | Maximum
  │       token budget per memory (estimated via `MCP_CHARS_PER_TOKEN`). Pre-flight validation warns
  │        when a memory exceeds this limit. |
  │ 24 +  | `MCP_MAX_MEMORY_TOKENS` | `8000` | number | `lib/validation/preflight.ts` | Maximum
  │       token budget per memory (estimated via `MCP_CHARS_PER_TOKEN`). Pre-flight hard-fails with
  │       PF020 (`TOKEN_BUDGET_EXCEEDED`) when a memory exceeds this limit. |
  │ 25    | `MCP_MIN_CONTENT_LENGTH` | `10` | number | `lib/validation/preflight.ts` | Minimum
  │       content length in characters for a valid memory file. Files shorter than this are rejected
  │        at pre-flight. The quality gate Layer 1 requires at least 50 characters, so this lower
  │       floor catches truly empty files. |
  │ 26    | `MCP_TOKEN_WARNING_THRESHOLD` | `0.8` | number | `lib/validation/preflight.ts` |
  │       Fraction of `MCP_MAX_MEMORY_TOKENS` at which a token budget warning is emitted. At 0.8, a
  │       warning fires when estimated tokens exceed 80% of the max. |
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/03-3-mcp-configuratio
    n.md

● Show diff 05-5-embedding-and-api.md
  │
  │ 18     | Name | Default | Type | Source File | Description |
  │ 19     |---|---|---|---|---|
  │ 20    | `COHERE_API_KEY` | _(none)_ | string | `lib/search/cross-encoder.ts` | API key for the
  │       Cohere reranker provider. When present, the cross-encoder reranker uses Cohere's rerank
  │       API. Falls back to local or Voyage reranker when absent. |
  │ 21 -  | `EMBEDDING_DIM` | _(provider default)_ | number | `lib/search/vector-index-store.ts` |
  │       Compatibility check for the stored vector dimension. Runtime dimension selection comes
  │       from the active provider profile (Voyage 1024, OpenAI 1536, local 768 fallback); the env
  │       var only short-circuits confirmation when explicitly set to `'768'`. |
  │ 21 +  | `EMBEDDING_DIM` | _(provider default)_ | number | `lib/search/vector-index-store.ts`,
  │       `shared/embeddings/factory.ts` | Compatibility check and startup override for the stored
  │       vector dimension. Any positive explicit `EMBEDDING_DIM` value is honored first; otherwise
  │       runtime dimension selection comes from the active provider profile (Voyage 1024, OpenAI
  │       1536, local 768 fallback). |
  │ 22    | `EMBEDDINGS_PROVIDER` | `'auto'` | string | `shared/embeddings/factory.ts` | Selects the
  │        embedding provider. Valid values include `'auto'`, `'openai'`, `'hf-local'`, and
  │       `'voyage'`. In `'auto'` mode, resolution precedence is explicit `EMBEDDINGS_PROVIDER` ->
  │       `VOYAGE_API_KEY` -> `OPENAI_API_KEY` -> local fallback. |
  │ 23    | `OPENAI_API_KEY` | _(none)_ | string | `shared/embeddings/factory.ts` | API key for the
  │       OpenAI embeddings provider. Required when `EMBEDDINGS_PROVIDER` is `'openai'` or when
  │       `'auto'` mode selects OpenAI as the available provider. |
  │ 24 -  | `RERANKER_LOCAL` | `false` | boolean | `lib/search/local-reranker.ts` | **IMPLEMENTED
  │       (Sprint 019).** When set to `'true'` (strict string equality, not truthy), enables the
  │       local GGUF reranker via `node-llama-cpp`. Requires model file on disk and sufficient total
  │        system memory (8GB default, 2GB with custom `SPECKIT_RERANKER_MODEL`). Sequential
  │       per-candidate inference; expect 200-400ms for top-20 on Apple Silicon (CHK-113). Falls
  │       back silently to algorithmic RRF scoring on any precondition failure. |
  │ 24 +  | `RERANKER_LOCAL` | `false` | boolean | `lib/search/local-reranker.ts` | **IMPLEMENTED
  │       (Sprint 019).** When set to `'true'` (strict string equality, not truthy), enables the
  │       local GGUF reranker via `node-llama-cpp`. Requires model file on disk and sufficient total
  │        system memory (8GB default, 2GB with custom `SPECKIT_RERANKER_MODEL`). Sequential
  │       per-candidate inference; expect 200-400ms for top-20 on Apple Silicon (CHK-113). Falls
  │       back to the original candidate ordering on precondition failure or runtime inference
  │       error. |
  │ 25    | `VOYAGE_API_KEY` | _(none)_ | string | `shared/embeddings/factory.ts` | API key for the
  │       Voyage AI embeddings and reranker provider. In `'auto'` mode, Voyage is preferred over
  │       OpenAI when this key is present. |
  │ 26
  │ 27     ---
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/05-5-embedding-and-ap
    i.md

● Show diff 06-6-debug-and-telemetry.md
  │
  │ 29    | `SPECKIT_HYDRA_SCOPE_ENFORCEMENT` | `true` | boolean | `lib/config/capability-flags.ts`
  │       | Legacy compatibility alias for the scope-enforcement roadmap flag. Roadmap metadata is
  │       default-on unless explicitly opted out with `false` or `0`. Used by roadmap snapshots and
  │       governed-scope compatibility checks. |
  │ 30    | `SPECKIT_HYDRA_GOVERNANCE_GUARDRAILS` | `true` | boolean |
  │       `lib/config/capability-flags.ts` | Legacy compatibility alias for the governance-guardrail
  │        roadmap flag. Roadmap metadata is default-on unless explicitly opted out with `false` or
  │       `0`. Used by roadmap snapshots and governed-ingest compatibility checks. |
  │
  │ 31    | `SPECKIT_HYDRA_SHARED_MEMORY` | `false` | boolean | `lib/config/capability-flags.ts` |
  │       Legacy compatibility alias for the shared-memory roadmap flag. Roadmap metadata now
  │       defaults this flag to off unless explicitly enabled with `true` or `1`, matching the live
  │       shared-spaces runtime gate. This keeps diagnostic snapshots from claiming shared memory is
  │        live before runtime rollout enables it. |
  │ 32 -  | `SPECKIT_CONSUMPTION_LOG` | inert | boolean | `lib/telemetry/consumption-logger.ts` |
  │       (Also listed under Search Pipeline.) Deprecated and inert. See category 1 for full
  │       description. |
  │ 32 +  | `SPECKIT_CONSUMPTION_LOG` | `true` | boolean | `lib/telemetry/consumption-logger.ts` |
  │       (Also listed under Search Pipeline.) **Default ON (graduated via rollout policy).**
  │       `isConsumptionLogEnabled()` delegates to `isFeatureEnabled('SPECKIT_CONSUMPTION_LOG')`, so
  │        consumption logging stays active unless explicitly disabled or rollout policy gates it
  │       off. |
  │ 33
  │ 34     ---
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/06-6-debug-and-teleme
    try.md

Done. I fixed all four requested catalog files after verifying each claim against the implementation.

Changes made:
- `01-1-search-pipeline-features-speckit.md`: added `SPECKIT_TEMPORAL_CONTIGUITY` and `SPECKIT_HYDE_ACTIVE`, and corrected `SPECKIT_GRAPH_CONCEPT_ROUTING` to reflect `graphActivated`/Stage 2 activation semantics.
- `03-3-mcp-configuration.md`: changed `MCP_MAX_MEMORY_TOKENS` from “warns” to hard-fails with `PF020`.
- `05-5-embedding-and-api.md`: fixed `EMBEDDING_DIM` to honor any positive explicit value, and `RERANKER_LOCAL` to fall back to original ordering.
- `06-6-debug-and-telemetry.md`: changed `SPECKIT_CONSUMPTION_LOG` from inert to active/default-ON.

Validation passed:
- `npx vitest run tests/feature-flag-reference-docs.vitest.ts`
- `validate_document.py` on all 4 touched docs

I also showed the diffs above.

