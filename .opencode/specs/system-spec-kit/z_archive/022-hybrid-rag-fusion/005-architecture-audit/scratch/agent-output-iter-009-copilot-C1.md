● skill(system-spec-kit)

I’m mapping the full config surface first, then I’ll trace how values flow through runtime code and docs so the audit is grounded in the actual implementation.

● Search (grep)
  │ "SPECKIT_|process\.env|dotenv|config" (.opencode/skill/system-spec-kit)
  └ 5 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/**/*.{json,jsonc,env,example,ts}"
  └ 5 files found

● Create session plan file (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/cfcbd63d-9f2e-4a2e-9f8a-9ec6900674c7/plan.md'
  │ <<'EOF'
  │ # Plan…
  └ 10 lines...

● Explore Survey config surface
  │ Find provider detection logic (shell)
  │   │ grep -r "EMBEDDINGS_PROVIDER\|auto.*detect.*provider"
  │   │ "/Users/michelkerkmeester/MEGA/Development/Opencode
  │   Env/Public/.opencode/skill/system-spec-kit"
  │   │ --include="*.ts" -B 2 -A 2 | head -40
  │   └ 41 lines...
  └ Read configs directory README (shell)
      │ cat "/Users/michelkerkmeester/MEGA/Development/Opencode
      │ Env/Public/.opencode/skill/system-spec-kit/mcp_server/configs/README.md"
      └ 85 lines...

I’ve got the broad inventory. Next I’m drilling into the authoritative config loaders and schema files to verify override order, defaults, and documentation coverage.

● List directory .opencode/skill/system-spec-kit/config
  └ 3 files found

● List directory .opencode/skill/system-spec-kit/mcp_server/lib/config
  └ 4 files found

● Read config.ts
  │ .opencode/skill/system-spec-kit/mcp_server/core/config.ts
  └ 153 lines read

● Read cognitive.ts
  │ .opencode/skill/system-spec-kit/mcp_server/configs/cognitive.ts
  └ 114 lines read

● Read config.ts
  │ .opencode/skill/system-spec-kit/scripts/core/config.ts
  └ 369 lines read

● Read package.json
  │ .opencode/skill/system-spec-kit/package.json
  └ 44 lines read

● Read tsconfig.json
  │ .opencode/skill/system-spec-kit/tsconfig.json
  └ 23 lines read

● Read config.ts
  │ .opencode/skill/system-spec-kit/shared/config.ts
  └ 47 lines read

● Read 1774014970032-copilot-tool-output-jmxffi.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/1774014970032-copilot-tool-output-jmxffi.txt
  └ L1:260 (260 lines read)

● Read config.jsonc
  │ .opencode/skill/system-spec-kit/config/config.jsonc
  └ 158 lines read

● Read README.md
  │ .opencode/skill/system-spec-kit/config/README.md
  └ 199 lines read

● Read filters.jsonc
  │ .opencode/skill/system-spec-kit/config/filters.jsonc
  └ 52 lines read

● Read capability-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts
  └ 153 lines read

● Read type-inference.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts
  └ 338 lines read

● Read memory-types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts
  └ 429 lines read

● Read README.md
  │ .opencode/skill/system-spec-kit/mcp_server/lib/config/README.md
  └ 248 lines read

● Read .env.example
  │ .opencode/skill/system-spec-kit/.env.example
  └ 73 lines read

● Search (glob)
  │ ".opencode/skill/system-spec-kit/**/*.json*"
  └ 46 files found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/**/.env*"
  └ 1 file found

The main pattern emerging is split authority: some settings are genuinely loaded, while others are “documented config” that runtime code ignores. I’m now verifying that against the concrete loaders and env-var docs.

● Read search-weights.json
  │ .opencode/skill/system-spec-kit/mcp_server/configs/search-weights.json
  └ 29 lines read

● Search (grep)
  │ "config\.jsonc|filters\.jsonc|search-weights\.json|loadCognitiveConfigFromEnv|getMemoryRoadmapPh
  │ ase|getMemoryRoadmapCapabilityFlags|SPEC_KIT_DB_DIR|SPECKIT_DB_DIR|EMBEDDINGS_PROVIDER|VOYAGE_AP
  │ I_KEY|OPENAI_API_KEY|SPECKIT_[A-Z0-9_]+" in *.{ts,js,json,jsonc,md}
  │ (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/**/environment_variables.md"
  └ 1 file found

● Compare env vars in code vs docs (shell)
  │ python3 - <<'PY'
  │ import re, pathlib, json
  │ root = pathlib.Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit')
  │ code_exts = {'.ts','.js','.mjs','.cjs'}…
  └ 33 lines...

● Read environment_variables.md
  │ .opencode/skill/system-spec-kit/references/config/environment_variables.md
  └ 330 lines read

● Read copilot-tool-output-1774015014194-sx4yvd.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1774015014194-sx4yvd.txt
  └ L1:220 (93 lines read)

● Read shell output Waiting up to 10 seconds for command output
  └ 324 lines...

I’ve confirmed the docs/code mismatch is real, not just a wording issue. Now I’m tracing the actual consumers for JSONC configs, feature flags, and secrets so the findings tie back to runtime behavior.

● Read content-filter.ts
  │ .opencode/skill/system-spec-kit/scripts/lib/content-filter.ts
  └ 1 line read

● Read factory.ts
  │ .opencode/skill/system-spec-kit/shared/embeddings/factory.ts
  └ 461 lines read

● Read context-server.ts
  │ .opencode/skill/system-spec-kit/mcp_server/context-server.ts
  └ L740:860 (121 lines read)

● Read rollout-policy.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts
  └ 64 lines read

● Read .gitignore
  │ .opencode/skill/system-spec-kit/.gitignore
  └ 8 lines read

● Search (grep)
  │ "filters\.jsonc|search-weights\.json|config\.jsonc|stripJsoncComments|dotenv|\.env|EMBEDDINGS_PR
  │ OVIDER|VOYAGE_API_KEY|OPENAI_API_KEY|SPECKIT_SKIP_API_VALIDATION|SPECKIT_EAGER_WARMUP|SPECKIT_LA
  │ ZY_LOADING|SPECKIT_ROLLOUT_PERCENT|isFeatureEnabled" in *.{ts,js,md,sh}
  │ (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (grep)
  │ "filters\.jsonc|warnThreshold|minContentLength|similarityThreshold"
  │ (.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts)
  └ 11 lines found

● Search (grep)
  │ "\.env" (.opencode/skill/system-spec-kit/.gitignore)
  └ No matches found

● Search (grep)
  │ "shouldEagerWarmup|SPECKIT_EAGER_WARMUP|SPECKIT_LAZY_LOADING" in *.ts
  │ (.opencode/skill/system-spec-kit/shared)
  └ 7 lines found

● Search (grep)
  │ "search-weights\.json|smartRanking|documentTypeMultipliers|maxTriggersPerMemory" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 10 lines found

● Search (grep)
  │ "MEMORY_DB_PATH|SPEC_KIT_DB_DIR|SPECKIT_DB_DIR|MEMORY_BASE_PATH|MEMORY_ALLOWED_PATHS" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 88 lines found

● Read vector-index-store.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts
  └ L1:90 (90 lines read)

● Read embeddings.ts
  │ .opencode/skill/system-spec-kit/shared/embeddings.ts
  └ L286:335 (50 lines read)

● Read content-filter.ts
  │ .opencode/skill/system-spec-kit/scripts/lib/content-filter.ts
  └ L160:250 (91 lines read)

● Read vector-index-store.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts
  └ L200:250 (51 lines read)

● Read vector-index-queries.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts
  └ L956:974 (19 lines read)

● Read vector-index-schema.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts
  └ L100:130 (31 lines read)

● Search (grep)
  │ "EMBEDDING_PROVIDER|EMBEDDINGS_PROVIDER|text-embedding-3-small|text-embedding-3-large|EMBEDDINGS
  │ _MODEL" (.opencode/skill/system-spec-kit/mcp_server/README.md)
  └ 8 lines found

● Search (grep)
  │ "EMBEDDING_PROVIDER|EMBEDDINGS_PROVIDER|EMBEDDINGS_BATCH_SIZE|EMBEDDINGS_CONCURRENCY|EMBEDDINGS_
  │ MODEL|HF_EMBEDDINGS_MODEL|SPECKIT_BATCH_SIZE" (.opencode/skill/system-spec-kit/.env.example)
  └ 4 lines found

● Search (grep)
  │ "EMBEDDINGS_BATCH_SIZE|EMBEDDINGS_CONCURRENCY|EMBEDDINGS_DEVICE|EMBEDDINGS_MODEL|HF_EMBEDDINGS_M
  │ ODEL|OPENAI_EMBEDDINGS_MODEL|VOYAGE_EMBEDDINGS_MODEL|OPENAI_BASE_URL|VOYAGE_BASE_URL|RERANKER_TI
  │ MEOUT_MS|SPECKIT_RERANKER_TIMEOUT_MS" in *.ts (.opencode/skill/system-spec-kit/shared)
  └ 14 lines found

● Search (grep)
  │ "EMBEDDINGS_BATCH_SIZE|EMBEDDINGS_CONCURRENCY|EMBEDDINGS_DEVICE|EMBEDDINGS_MODEL|HF_EMBEDDINGS_M
  │ ODEL|OPENAI_EMBEDDINGS_MODEL|VOYAGE_EMBEDDINGS_MODEL|OPENAI_BASE_URL|VOYAGE_BASE_URL|RERANKER_TI
  │ MEOUT_MS|SPECKIT_RERANKER_TIMEOUT_MS" in *.ts (.opencode/skill/system-spec-kit/mcp_server)
  └ 10 lines found

I’ve confirmed one of the biggest risks: database path and feature-flag settings don’t have a single authority. I’m checking the remaining config docs now to separate genuinely supported options from stale or reference-only ones.

● Read README.md
  │ .opencode/skill/system-spec-kit/mcp_server/configs/README.md
  └ 84 lines read

● Read README.md
  │ .opencode/skill/system-spec-kit/mcp_server/README.md
  └ L820:900 (81 lines read)

● Read vector-index-aliases.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts
  └ L45:65 (21 lines read)

● Read eval-db.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/eval/eval-db.ts
  └ L1:60 (60 lines read)

● Read local-reranker.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/local-reranker.ts
  └ L40:60 (21 lines read)

● Search (grep)
  │ "SPECKIT_RERANKER_MODEL|RERANKER_LOCAL|SPECKIT_RERANKER_TIMEOUT_MS" in *.{ts,md,env}
  │ (.opencode/skill/system-spec-kit)
  └ 72 lines found

● Search (grep)
  │ "SPEC_KIT_BATCH_SIZE|SPEC_KIT_BATCH_DELAY_MS" in *.{ts,md,env} (.opencode/skill/system-spec-kit)
  └ 10 lines found

● Search (grep)
  │ "EMBEDDINGS_BATCH_SIZE|EMBEDDINGS_CONCURRENCY|EMBEDDINGS_DEVICE" in *.{ts,md,env}
  │ (.opencode/skill/system-spec-kit)
  └ No matches found

● Search (grep)
  │ "EMBEDDINGS_MODEL\b" in *.{ts,md,env} (.opencode/skill/system-spec-kit)
  └ 27 lines found

● Search (grep)
  │ "\bEMBEDDINGS_MODEL\b" in *.{ts,md,env} (.opencode/skill/system-spec-kit)
  └ No matches found

● Search (grep)
  │ "\bEMBEDDINGS_BATCH_SIZE\b|\bEMBEDDINGS_CONCURRENCY\b|\bEMBEDDINGS_DEVICE\b" in *.{ts,md,env}
  │ (.opencode/skill/system-spec-kit)
  └ No matches found

● Search (grep)
  │ "SPECKIT_DB_DIR" in *.{ts,md,env} (.opencode/skill/system-spec-kit)
  └ 10 lines found

● Search (grep)
  │ "SPEC_KIT_DB_DIR" in *.{ts,md,env} (.opencode/skill/system-spec-kit)
  └ 67 lines found

● Search (grep)
  │ "MEMORY_DB_DIR" in *.{ts,md,env} (.opencode/skill/system-spec-kit)
  └ 10 lines found

● Search (grep)
  │ "documentTypeMultipliers|constitutional.*2\.0|decision_record.*1\.4|plan.*1\.3" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/lib)
  └ 4 lines found

● Search (grep)
  │ "timezoneOffsetHours" in *.{ts,jsonc,md} (.opencode/skill/system-spec-kit)
  └ 11 lines found

● Search (grep)
  │ "minContentLength|minUniqueWords|hashLength|similarityThreshold" in *.{ts,jsonc,md}
  │ (.opencode/skill/system-spec-kit)
  └ 18 lines found

● Read composite-scoring.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts
  └ L176:214 (39 lines read)

● Search (grep)
  │ "SPECKIT_SKIP_API_VALIDATION|validateApiKey\(|process\.exit\(1\)|Continuing startup - validation
  │ will occur on first use" (.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
  └ 8 lines found

● Search (grep)
  │ "SPECKIT_COGNITIVE_COACTIVATION_PATTERN|SPECKIT_COGNITIVE_COACTIVATION_FLAGS|safeParseCognitiveC
  │ onfigFromEnv|loadCognitiveConfigFromEnv" in *.{ts,md,env} (.opencode/skill/system-spec-kit)
  └ 42 lines found

● Read package.json
  │ .opencode/skill/system-spec-kit/scripts/package.json
  └ 28 lines read

● Read package.json
  │ .opencode/skill/system-spec-kit/mcp_server/package.json
  └ 59 lines read

● Read package.json
  │ .opencode/skill/system-spec-kit/shared/package.json
  └ 14 lines read

● Read search-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
  └ L230:250 (21 lines read)

● Search (grep)
  │ "process\.env\.[A-Z_]+|process\.env\[['"][A-Z_]+['"]\]"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts)
  └ 5 lines found

● Search (grep)
  │ "dotenv" in *.{ts,js,md,sh} (.opencode/skill/system-spec-kit)
  └ No matches found

✗ Memory stored configuration
  └ In system-spec-kit, `config/config.jsonc` only drives the legacy Section 1 workf…

# Configuration Sprawl Audit

## Scope

I audited the requested surface plus adjacent consumers that actually load or enforce config: `package.json`, `tsconfig.json`, `mcp_server/core/config.ts`, `mcp_server/configs/cognitive.ts`, `mcp_server/lib/config/*.ts`, `shared/config.ts`, `scripts/core/config.ts`, the whole `config/` directory, `.env.example`, and the runtime consumers for `filters.jsonc`, `search-weights.json`, embedding/env handling, DB path resolution, and feature flags.

## Active configuration sources

- Build/tooling config: root `package.json` and `tsconfig.json`, plus workspace `mcp_server/package.json`, `shared/package.json`, `scripts/package.json`. These are real config, but build-time only.

- Script runtime config: `scripts/core/config.ts` loads `config/config.jsonc`, but only its legacy Section 1 keys are active (`config/config.jsonc:4-6`, `scripts/core/config.ts:223-275`).

- Filter runtime config: `scripts/lib/content-filter.ts` separately loads `config/filters.jsonc` with its own defaults (`scripts/lib/content-filter.ts:168-247`).

- MCP runtime config: `mcp_server/core/config.ts`, `mcp_server/configs/cognitive.ts`, `mcp_server/lib/config/*.ts`, `mcp_server/lib/search/vector-index-store.ts`, `mcp_server/lib/scoring/composite-scoring.ts`, `mcp_server/lib/eval/eval-db.ts`, `mcp_server/lib/search/local-reranker.ts`, `mcp_server/lib/cognitive/rollout-policy.ts`, `mcp_server/context-server.ts`.

- Env templates/docs: only `.env.example` exists. I found no real `.env` files and no `dotenv` loader, so env vars must be injected by the shell/host.

## Effective hierarchy

- Build config is straightforward: root `package.json` and `tsconfig.json` define workspace/build structure only.

- Script config hierarchy is `config/config.jsonc` Section 1 -> merged over hardcoded defaults in `scripts/core/config.ts` -> validated/fallback defaults.

- Filter config hierarchy is `filters.jsonc` -> deep-merged over hardcoded defaults in `scripts/lib/content-filter.ts`.

- MCP server config is fragmented:
  `process.env` overrides many values directly,
  `search-weights.json` is only partly live,
  `core/config.ts` and `shared/config.ts` both define DB/path constants,
  feature flags are mostly interpreted ad hoc through `rollout-policy.ts` and `search-flags.ts`.

- Feature flag semantics are not uniform. Many `SPECKIT_*` flags are default-on unless explicitly `false`/`0` (`rollout-policy.ts:42-57`), while some opt-ins require exact `"true"` (`search-flags.ts:240-243` for `RERANKER_LOCAL`).

## Findings

- **High: there is no single source of truth for runtime config.** `config/config.jsonc` looks like a master config, but it explicitly says only Section 1 is active (`config/config.jsonc:4-6`). Sections like `semanticSearch`, `memoryDecay`, `importanceTiers`, and `hybridSearch` are effectively documentation, not live config. That makes the file misleading as an operator surface.

- **High: DB path config is inconsistent across modules.** `shared/config.ts` supports `SPEC_KIT_DB_DIR` and `SPECKIT_DB_DIR` (`shared/config.ts:9-10`), `mcp_server/core/config.ts` only honors `SPEC_KIT_DB_DIR` (`core/config.ts:42-50`), while `vector-index-store.ts` and `eval-db.ts` use `SPEC_KIT_DB_DIR` plus legacy `MEMORY_DB_DIR`, and `MEMORY_DB_PATH` can override the final file path (`vector-index-store.ts:213-235`, `eval-db.ts:18-25`). Docs present a cleaner hierarchy than the code actually implements.

- **High: some “config files” duplicate values that are really hardcoded elsewhere.** `mcp_server/configs/search-weights.json` says `documentTypeMultipliers` are “reference/future-config only” (`search-weights.json:7-19`), while the live values are duplicated in `lib/scoring/composite-scoring.ts` (`composite-scoring.ts:198-212`). That is classic config sprawl: editable file, but wrong source of truth.

- **Medium: `filters.jsonc` and its fallback defaults diverge materially.** The file says `minContentLength: 15`, `minUniqueWords: 3`, `hashLength: 300`, `similarityThreshold: 0.70` (`filters.jsonc:21-50`). The code fallback defaults are `5`, `2`, `200`, `0.85` (`scripts/lib/content-filter.ts:169-195`). If the file is missing or malformed, behavior changes a lot and silently.

- **Medium: version/config duplication exists across packages and code.** Version `1.7.2` appears in root `package.json`, all workspace `package.json` files, and also as `SKILL_VERSION: '1.7.2'` in `scripts/core/config.ts:283-305`. That is unnecessary duplication for a value that will drift.

- **Medium: validation is uneven.** Strong validation exists for cognitive regex config (`configs/cognitive.ts:44-112`), workflow numeric config (`scripts/core/config.ts:94-217`), rollout percent clamping (`rollout-policy.ts:7-25`), and startup API key validation (`context-server.ts:751-788`). But `filters.jsonc` has merge logic without schema validation, `search-weights.json` is parsed without schema validation, and many flags are just parsed inline.

- **Medium: environment-specific behavior is implicit rather than structured.** There are no `.env.development`, `.env.staging`, or `.env.production` files, and no loader for `.env`. Dev/prod behavior mainly comes from “which vars are present” and flag choices. Example: provider resolution is `EMBEDDINGS_PROVIDER` -> `VOYAGE_API_KEY` -> `OPENAI_API_KEY` -> local HF (`shared/embeddings/factory.ts:72-112`).

- **Medium: docs are fragmented and partially stale.** `mcp_server/README.md` still documents `EMBEDDING_PROVIDER` and `huggingface`, but code uses `EMBEDDINGS_PROVIDER` and `hf-local` (`mcp_server/README.md:828-885` vs `shared/embeddings/factory.ts:72-112`). `.env.example` documents `EMBEDDINGS_MODEL`, `EMBEDDINGS_BATCH_SIZE`, `EMBEDDINGS_CONCURRENCY`, and `EMBEDDINGS_DEVICE`, but I found no runtime consumers for those names.

- **Medium: active env vars are missing from central docs.** Examples include `OPENAI_BASE_URL`, `VOYAGE_BASE_URL`, and `SPECKIT_RERANKER_TIMEOUT_MS`, which are used in code (`shared/embeddings/factory.ts:345-351`, `providers/openai.ts`, `providers/voyage.ts`, `local-reranker.ts:48-50`) but absent from the main env reference and `.env.example`.

- **Low: secret handling is mostly sane, but operational hygiene is incomplete.** I found no committed secrets; only `.env.example` exists. API keys are redacted in provider info (`shared/embeddings/factory.ts:279-286`), and startup validates cloud keys (`context-server.ts:751-788`). But `.gitignore` does not ignore `.env`, so accidental secret commits are still possible.

## Bottom line

The main issue is **split authority**: config lives partly in env vars, partly in JSONC, partly in hardcoded constants, and partly in docs that look live but are not. The riskiest areas are **DB path resolution**, **reference-only JSON config**, **stale env documentation**, and **fallback defaults that don’t match checked-in config files**.

