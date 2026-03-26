● skill(sk-code--review)

I’m going to cross-check the 12 catalog files against the actual `mcp_server` and `scripts` code, and I’ll use a parallel review pass plus direct spot-checking so the final alignment report is grounded in the code.

● Review Reviewing catalogs
  └ Agent started in background with agent_id: catalog-alignment. You can use rea...

● Create review tracking table (sql)
  │ CREATE TABLE IF NOT EXISTS catalog_review (file TEXT PRIMARY KEY, status TEXT, n…
  └ Schema operation completed successfully.

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ 1 line read

● Read FEATURE_CATALOG_IN_SIMPLE_TERMS.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md
  └ 1 line read

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/*.
  │ md"
  └ 1 file found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/*.md"
  └ 8 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/*.md"
  └ 1 file found

I’ve got the exact file set now. Next I’m reading the category files directly, then I’ll verify their claims against actual feature flags, tool exports, and scripts behavior.

● Read 01-1-search-pipeline-features-speckit.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-
  │ features-speckit.md
  └ 1 line read

● Read 02-2-session-and-cache.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/02-2-session-and-cach
  │ e.md
  └ 44 lines read

● Read 03-3-mcp-configuration.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/03-3-mcp-configuratio
  │ n.md
  └ 40 lines read

● Read 04-4-memory-and-storage.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/04-4-memory-and-stora
  │ ge.md
  └ 41 lines read

● Read 05-5-embedding-and-api.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/05-5-embedding-and-ap
  │ i.md
  └ 39 lines read

● Read 06-6-debug-and-telemetry.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/06-6-debug-and-teleme
  │ try.md
  └ 46 lines read

● Read 07-7-ci-and-build-informational.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/07-7-ci-and-build-inf
  │ ormational.md
  └ 39 lines read

● Read 08-audit-phase-020-mapping-note.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/08-audit-phase-020-ma
  │ pping-note.md
  └ 10 lines read

● Read 01-category-stub.md
  │ .opencode/skill/system-spec-kit/feature_catalog/20--remediation-revalidation/01-category-stub.md
  └ 14 lines read

● Read 01-category-stub.md
  │ .opencode/skill/system-spec-kit/feature_catalog/21--implement-and-remove-deprecated-features/01-
  │ category-stub.md
  └ 13 lines read

● Search (grep)
  │ "^## " (.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md)
  └ 22 lines found

● Search (grep)
  │ "^## " (.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)
  └ 22 lines found

● Search (grep)
  │ "^#|^##|^###" (.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-s
  │ earch-pipeline-features-speckit.md)
  └ 6 lines found

● Search (grep)
  │ "^\| `|^\| Name " (.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01
  │ -1-search-pipeline-features-speckit.md)
  └ 5 lines found

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ L1:80 (79 lines read)

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ L4368:4525 (77 lines read)

● Read FEATURE_CATALOG_IN_SIMPLE_TERMS.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md
  └ L1:80 (79 lines read)

● Read FEATURE_CATALOG_IN_SIMPLE_TERMS.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md
  └ L1023:1120 (29 lines read)

I’ve confirmed both master indexes still expose 21 top-level sections. Now I’m validating the specific feature-flag claims and command/tool counts against the real code so the per-file statuses aren’t just doc-to-doc comparisons.

● Read 01-1-search-pipeline-features-speckit.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-
  │ features-speckit.md
  └ L21:155 (72 lines read)

● Search (grep)
  │ "allowed-tools:" (.opencode/command/memory)
  └ 6 lines found

● Search (grep)
  │ "process\.env\.[A-Z0-9_]+|getEnv[A-Za-z]*\(['\"]([A-Z0-9_]+)['\"]|parse[A-Za-z]*Env\(['\"]([A-Z0
  │ -9_]+)['\"]" in *.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "process\.env\.[A-Z0-9_]+|getEnv[A-Za-z]*\(['\"]([A-Z0-9_]+)['\"]|parse[A-Za-z]*Env\(['\"]([A-Z0
  │ -9_]+)['\"]" in *.{ts,js,sh,py} (.opencode/skill/system-spec-kit/scripts)
  └ 5 lines found

● Check documented feature flags against mcp_server and scripts (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re, json, subprocess, os
  │ root = Path('/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public')
  │ fc = root/'.opencode/skill/system-spec-kit/feature_catalog'…
  └ 37 lines...

● Check feature flag docs for missing vars or bad source paths (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import subprocess, re
  │ root = Path('/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public')
  │ base = root/'.opencode/skill/system-spec-kit'…
  └ 92 lines...

● Verify section counts, command tool counts, and referenced links (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re, yaml
  │ root=Path('/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public')
  │ fc=root/'.opencode/skill/system-spec-kit/feature_catalog'…
  └ 334 lines...

● Read consumption-logger.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts
  └ 453 lines read

● Search (grep)
  │ "comprehensive-remediation-sprint-8" (.opencode/skill/system-spec-kit/feature_catalog)
  └ 1 line found

● Search (grep)
  │ "SPECKIT_CONSUMPTION_LOG" in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 16 lines found

● Read capability-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts
  └ L1:260 (174 lines read)

● Read FEATURE_CATALOG_IN_SIMPLE_TERMS.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md
  └ L900:960 (60 lines read)

● Search (grep)
  │ "Comprehensive remediation|comprehensive-remediation-sprint-8"
  │ (.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md)
  └ No matches found

● Search (grep)
  │ "Comprehensive remediation|comprehensive-remediation-sprint-8"
  │ (.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)
  └ 1 line found

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ L3908:3940 (32 lines read)

I’ve found one clear master-index issue already: `FEATURE_CATALOG.md` links to an internal anchor that doesn’t exist. I’m now validating the remaining possible doc drift points so I can separate true errors from harmless source-path choices.

● Search (grep)
  │ "MCP_ANCHOR_STRICT|MCP_CHARS_PER_TOKEN|MCP_DUPLICATE_THRESHOLD|MCP_MAX_CONTENT_LENGTH|MCP_MAX_ME
  │ MORY_TOKENS|MCP_MIN_CONTENT_LENGTH|MCP_TOKEN_WARNING_THRESHOLD" in *.{ts,js,md}
  │ (.opencode/skill/system-spec-kit)
  └ 51 lines found

● Search (grep)
  │ "RERANKER_LOCAL|EMBEDDINGS_PROVIDER|EMBEDDING_DIM|OPENAI_API_KEY|VOYAGE_API_KEY|COHERE_API_KEY"
  │ in *.{ts,js,md} (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (grep)
  │ "SPEC_KIT_DB_DIR|SPECKIT_DB_DIR|MEMORY_DB_PATH|MEMORY_DB_DIR|MEMORY_ALLOWED_PATHS|MEMORY_BASE_PA
  │ TH" in *.{ts,js,md} (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (grep)
  │ "SESSION_TTL_MINUTES|SESSION_MAX_ENTRIES|STALE_CLEANUP_INTERVAL_MS|STALE_SESSION_THRESHOLD_MS|EN
  │ ABLE_TOOL_CACHE|TOOL_CACHE_TTL_MS|TOOL_CACHE_MAX_ENTRIES|TOOL_CACHE_CLEANUP_INTERVAL_MS|ENABLE_B
  │ M25|DISABLE_SESSION_DEDUP|SESSION_DEDUP_DB_UNAVAILABLE_MODE" in *.{ts,js,md}
  │ (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Read (Review agent — Reviewing catalogs)
  └ Running

● Check master index links and anchors (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ root=Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/feature_catalog')…
  └ 75 lines...

● Read preflight.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts
  └ L180:230 (51 lines read)

● Read checkpoints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts
  └ L1:120 (120 lines read)

● Search (grep)
  │ "BRANCH_NAME|CI_COMMIT_REF_NAME|GIT_BRANCH|VERCEL_GIT_COMMIT_REF"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts)
  └ 4 lines found

● Read tool-cache.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/cache/tool-cache.ts
  └ L1:140 (139 lines read)

● Read checkpoints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts
  └ L226:240 (15 lines read)

● Read config.ts
  │ .opencode/skill/system-spec-kit/shared/config.ts
  └ L1:120 (47 lines read)

● Search (grep)
  │ "SPEC_KIT_DB_DIR|SPECKIT_DB_DIR|MEMORY_DB_PATH|MEMORY_DB_DIR|MEMORY_ALLOWED_PATHS|MEMORY_BASE_PA
  │ TH" in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "SPEC_KIT_DB_DIR|SPECKIT_DB_DIR|MEMORY_DB_PATH|MEMORY_DB_DIR|MEMORY_ALLOWED_PATHS|MEMORY_BASE_PA
  │ TH" in *.{ts,sh,py} (.opencode/skill/system-spec-kit/scripts)
  └ 32 lines found

● Read config.ts
  │ .opencode/skill/system-spec-kit/mcp_server/core/config.ts
  └ L1:140 (139 lines read)

● Read factory.ts
  │ .opencode/skill/system-spec-kit/shared/embeddings/factory.ts
  └ L1:220 (220 lines read)

● Read local-reranker.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts
  └ L1:220 (220 lines read)

● Read vector-index-store.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts
  └ L1:180 (180 lines read)

● Read cross-encoder.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts
  └ L1:180 (180 lines read)

● Read local-reranker.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts
  └ L206:360 (155 lines read)

● Search (grep)
  │ "canUseLocalReranker|RERANKER_LOCAL|local reranker|local-reranker" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 84 lines found

● Search (grep)
  │ "scoringMethod:'fallback'|positional fallback|unchanged ordering|fallback"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts)
  └ 13 lines found

● Read entity-linker.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts
  └ L1:220 (219 lines read)

● Search (grep)
  │ "SPECKIT_GRAPH_CONCEPT_ROUTING|graph concept routing|matched concepts|activate graph"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts)
  └ 4 lines found

● Search (grep)
  │ "graph concept routing|SPECKIT_GRAPH_CONCEPT_ROUTING"
  │ (.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)
  └ 2 lines found

● Search (grep)
  │ "graph concept routing|SPECKIT_GRAPH_CONCEPT_ROUTING" (.opencode/skill/system-spec-kit/feature_c
  │ atalog/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md)
  └ 1 line found

● Read entity-linker.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts
  └ L292:380 (89 lines read)

● Search (grep)
  │ "detectQueryConcepts|matched concepts|activate.*graph|graphActive|concept routing" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 14 lines found

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L1:220 (220 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L320:380 (61 lines read)

● Search (grep)
  │ "matchedConcepts|d2-concept-routing|graphActivated|concept routing" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline)
  └ 5 lines found

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L312:326 (15 lines read)

● Search (grep)
  │ "d2-concept-routing|matchedConcepts|graphActivated|concepts.*trace|graph channel is handled in
  │ Stage 2" in *.ts (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline)
  └ 5 lines found

● Read search-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
  └ L300:322 (23 lines read)

● Read 01-1-search-pipeline-features-speckit.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-
  │ features-speckit.md
  └ L96:112 (17 lines read)

● Search (grep)
  │ "SPECKIT_PRE_SAVE_DEDUP" in *.{ts,sh,py} (.opencode/skill/system-spec-kit/scripts)
  └ 2 lines found

● Search (grep)
  │ "SPECKIT_PRE_SAVE_DEDUP" in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ No matches found

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L28:48 (20 lines read)

● Search (grep)
  │ "github-slugger|slugger" (package.json)
  └ No matches found

● Search (grep)
  │ "github-slugger|slugger" in package.json (.opencode/skill/system-spec-kit)
  └ No matches found

● Search (grep)
  │ "1--overview" in *.md (.opencode/skill/system-spec-kit)
  └ 98 files found

● Read 06-6-debug-and-telemetry.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/06-6-debug-and-teleme
  │ try.md
  └ L16:33 (17 lines read)

● Read 05-5-embedding-and-api.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/05-5-embedding-and-ap
  │ i.md
  └ L16:26 (10 lines read)

● Read 01-1-search-pipeline-features-speckit.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/01-1-search-pipeline-
  │ features-speckit.md
  └ L72:80 (9 lines read)

● Read FEATURE_CATALOG_IN_SIMPLE_TERMS.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md
  └ L12:34 (23 lines read)

● Read cross-encoder.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts
  └ L175:205 (31 lines read)

● Listing background agents

● Read session-manager.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts
  └ L1:140 (140 lines read)

● Search (grep)
  │ "DISABLE_SESSION_DEDUP|SESSION_DEDUP_DB_UNAVAILABLE_MODE|SESSION_MAX_ENTRIES|SESSION_TTL_MINUTES
  │ |STALE_CLEANUP_INTERVAL_MS|STALE_SESSION_THRESHOLD_MS"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts)
  └ 9 lines found

● Search (grep)
  │ "ENABLE_BM25" in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 14 lines found

● Read bm25-index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts
  └ L1:80 (80 lines read)

● Read preflight.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts
  └ L250:340 (91 lines read)

● Search (grep)
  │ "PF020|warning_threshold|max_tokens_per_memory|checkTokenBudget"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts)
  └ 12 lines found

● Read 03-3-mcp-configuration.md
  │ .opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-reference/03-3-mcp-configuratio
  │ n.md
  └ L20:26 (7 lines read)

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ L4534:4540 (7 lines read)

● Read preflight.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts
  └ L468:520 (53 lines read)

● Read (Review agent — Reviewing catalogs)
  └ Running

● Search (grep)
  │ "\| `EMBEDDING_DIM`|\| `RERANKER_LOCAL`|\| `MCP_MAX_MEMORY_TOKENS`|Comprehensive remediation
  │ \(Sprint 8\)" (.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)
  └ 4 lines found

● Search (grep)
  │ "SPECKIT_CONSUMPTION_LOG" (.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)
  └ 4 lines found

● Search (grep)
  │ "SPECKIT_CONSUMPTION_LOG" (.opencode/skill/system-spec-kit/feature_catalog/19--feature-flag-refe
  │ rence/06-6-debug-and-telemetry.md)
  └ 1 line found

● Search (grep)
  │ "\| `EMBEDDING_DIM`|\| `RERANKER_LOCAL`|\| `MCP_MAX_MEMORY_TOKENS`"
  │ (.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG_IN_SIMPLE_TERMS.md)
  └ No matches found

The parallel review pass finished, so I’m pulling its findings now and reconciling them with the code spots I already verified. After that I’ll give you a single per-file alignment report with severity counts.

● Read (Review agent — Reviewing catalogs)
  └ idle

I’ve merged the parallel pass with direct code checks. I verified the strongest discrepancies myself so the final report will only include issues that are actually backed by current source.

● Read hyde.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/hyde.ts
  └ L18:120 (103 lines read)

● Search (grep)
  │ "SPECKIT_HYDE_ACTIVE" in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 9 lines found

● Search (grep)
  │ "SPECKIT_TEMPORAL_CONTIGUITY" in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 2 lines found

● Read search-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
  └ L220:238 (19 lines read)

● Search (grep)
  │ "SPECKIT_TEMPORAL_CONTIGUITY"
  │ (.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)
  └ No matches found

● Search (grep)
  │ "SPECKIT_HYDE_ACTIVE" (.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md)
  └ 2 lines found

● Search (grep)
  │ "SPECKIT_HYDE_ACTIVE|SPECKIT_TEMPORAL_CONTIGUITY" (.opencode/skill/system-spec-kit/feature_catal
  │ og/19--feature-flag-reference/01-1-search-pipeline-features-speckit.md)
  └ 1 line found

● Search (grep)
  │ "SPECKIT_TEMPORAL_CONTIGUITY" (.opencode/skill/system-spec-kit/feature_catalog)
  └ 1 line found

`19--feature-flag-reference/01-1-search-pipeline-features-speckit.md` | `PARTIAL` | Claims a full current-reality table (`:23-25`), but live flags are omitted as standalone entries, including `SPECKIT_TEMPORAL_CONTIGUITY` (`mcp_server/lib/search/search-flags.ts:229-234`) and `SPECKIT_HYDE_ACTIVE` (`mcp_server/lib/search/hyde.ts:22-25,107-113`). Also says `SPECKIT_GRAPH_CONCEPT_ROUTING` does not activate graph retrieval (`:75`), while code exposes `graphActivated` / activation semantics (`search-flags.ts:313-319`, `pipeline/stage1-candidate-gen.ts:317-320,333-339`).

`19--feature-flag-reference/02-2-session-and-cache.md` | `ALIGNED` | Rows `:20-30` match `mcp_server/lib/session/session-manager.ts:170-188`, `mcp_server/lib/cache/tool-cache.ts:49-54`, and `mcp_server/lib/search/bm25-index.ts:69-70`.

`19--feature-flag-reference/03-3-mcp-configuration.md` | `PARTIAL` | Defaults mostly match `mcp_server/lib/validation/preflight.ts:187-203` and `handlers/quality-loop.ts:74-78`, but `MCP_MAX_MEMORY_TOKENS` says preflight “warns when exceeded” (`:24`); code hard-fails with `PF020` when `estimated > maxTokens` (`preflight.ts:505-513`).

`19--feature-flag-reference/04-4-memory-and-storage.md` | `ALIGNED` | Storage/path behavior at `:20-27` matches `mcp_server/lib/search/vector-index-store.ts:188-213`, `mcp_server/core/config.ts:44-76,90-93`, and script/test env usage in `scripts/tests/workflow-e2e.vitest.ts:272-274`.

`19--feature-flag-reference/05-5-embedding-and-api.md` | `PARTIAL` | `EMBEDDING_DIM` says the env var only short-circuits confirmation at `'768'` (`:21`), but code honors any positive explicit dimension (`shared/embeddings/factory.ts:167-172`, `mcp_server/lib/search/vector-index-store.ts:89-93`). `RERANKER_LOCAL` says failures fall back to algorithmic RRF (`:24`), but code falls back to original ordering (`mcp_server/lib/search/local-reranker.ts:236-255,329-331`).

`19--feature-flag-reference/06-6-debug-and-telemetry.md` | `MISALIGNED` | `SPECKIT_CONSUMPTION_LOG` is documented as inert (`:32`), but runtime is active and default-ON via `isFeatureEnabled('SPECKIT_CONSUMPTION_LOG')` (`mcp_server/lib/telemetry/consumption-logger.ts:10,82-85,133-135`).

`19--feature-flag-reference/07-7-ci-and-build-informational.md` | `ALIGNED` | Branch-metadata fallback order in `:22-25` matches `mcp_server/lib/storage/checkpoints.ts:231-240`.

`19--feature-flag-reference/08-audit-phase-020-mapping-note.md` | `ALIGNED` | Slug-based 020 mapping at `:8-10` matches the master index mapping in `FEATURE_CATALOG.md:42-48`.

`20--remediation-revalidation/01-category-stub.md` | `ALIGNED` | Stub links at `:8-14` resolve and match the master coverage note in `FEATURE_CATALOG.md:42-48`; linked records exist under categories 08, 14, and 16.

`21--implement-and-remove-deprecated-features/01-category-stub.md` | `ALIGNED` | Stub links at `:8-13` resolve and match the master coverage note in `FEATURE_CATALOG.md:42-48`; linked closure records exist under categories 16 and 17.

`FEATURE_CATALOG.md` | `PARTIAL` | Verified 21 top-level sections (`:12-34`) and 33 tools across 6 commands (`:50-62`, confirmed from `.opencode/command/memory/*.md:4`). But section 21 repeats drifted rows for `MCP_MAX_MEMORY_TOKENS` (`:4538`), `EMBEDDING_DIM` (`:4588`), and `RERANKER_LOCAL` (`:4591`), and has a broken internal link `#comprehensive-remediation-sprint-8` at `:3925`.

`FEATURE_CATALOG_IN_SIMPLE_TERMS.md` | `PARTIAL` | Verified 21 top-level sections (`:12-34`) and the same 33-tool / 6-command counts (`:52-64`). Cross-reference coverage is weaker: audit-phase notes at `:46-50` are prose-only, not direct links to the relevant category/stub docs.

**SUMMARY:** `total=12 | aligned=6 | partial=5 | misaligned=1 | P0=0 | P1=5 | P2=2`

Main `P1` items: incomplete / partly wrong flag inventory in `01`, warn-vs-fail drift in `03`, explicit-dimension / reranker-fallback drift in `05`, inert-vs-active drift in `06`, and repeated row drift plus a broken internal link in `FEATURE_CATALOG.md`.

