● skill(sk-code-review)

I’m reading the skill docs and tracing the live implementation so I can compare the documented contract against what’s actually shipped. After that I’ll summarize concrete mismatches in a findings-first audit.

● Read SKILL.md
  │ .opencode/skill/system-spec-kit/SKILL.md
  └ 1 line read

● Read README.md
  │ .opencode/skill/system-spec-kit/README.md
  └ 1 line read

● Read SKILL.md
  │ .opencode/skill/sk-doc/SKILL.md
  └ 1 line read

● List directory .opencode/skill/system-spec-kit/mcp_server
  └ 32 files found

● List directory .opencode/skill/system-spec-kit
  └ 28 files found

● List directory .opencode/skill/system-spec-kit/scripts
  └ 32 files found

● Create session plan file (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/8ca33795-75f4-411c-adec-1d3295ecaaf3/plan.md'
  │ <<'EOF'
  │ # Plan
  │ 1. Read SKILL.md, README.md, and sk-doc standards.…
  └ 5 lines...

I’ve got the package layout; next I’m mapping the documented claims to concrete code locations like tool schemas, config handling, and error utilities so the findings are evidence-backed.

● Search (grep)
  │ "^#{1,6} " (.opencode/skill/system-spec-kit/SKILL.md)
  └ 51 lines found

● Search (grep)
  │ "^#{1,6} " (.opencode/skill/system-spec-kit/README.md)
  └ 78 lines found

● Search (grep)
  │ "tool|schema|error|config|environment|env|MCP|memory_|shared_memory|preflight|postflight"
  │ (.opencode/skill/system-spec-kit/README.md)
  └ 56 lines found

● Search (grep)
  │ "^#{1,6} " (.opencode/skill/sk-doc/SKILL.md)
  └ 85 lines found

● Search (grep)
  │ "tool|schema|error|config|environment|env|MCP|memory_|shared_memory|preflight|postflight"
  │ (.opencode/skill/system-spec-kit/SKILL.md)
  └ 58 lines found

● Search (grep)
  │ "export const|z\.object|tool\(|server\.tool|name:|inputSchema|error
  │ code|error_code|ERR_|MCPError|SpecKitError|SPECKIT_" in **/*.{ts,js,json}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "SPECKIT_|shared memory|task_preflight|task_postflight|checkpoint|memory_context|memory_search|m
  │ emory_match_triggers" in **/*.{md,ts,js,json} (.opencode/skill/system-spec-kit)
  └ 5 lines found

I’ve identified the main claims in `SKILL.md` and `README.md`. I’m now cross-checking them against the live MCP server and scripts, especially tool counts, env flags, and error contracts where drift usually shows up.

● Explore Audit doc-code alignment
  └ Agent started in background with agent_id: spec-kit-alignment-scan. You can u...

● Read README.md
  │ .opencode/skill/system-spec-kit/README.md
  └ L259:404 (146 lines read)

● Read SKILL.md
  │ .opencode/skill/system-spec-kit/SKILL.md
  └ L543:647 (105 lines read)

● Read context-server.ts
  │ .opencode/skill/system-spec-kit/mcp_server/context-server.ts
  └ L1:260 (260 lines read)

● Read tool-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
  └ L1:260 (260 lines read)

● Read package.json
  │ .opencode/skill/system-spec-kit/package.json
  └ 44 lines read

● Read package.json
  │ .opencode/skill/system-spec-kit/mcp_server/package.json
  └ 59 lines read

● Search (glob)
  │ "**/*{create,validate,generate-context,upgrade}*.{sh,ts,js}" in .opencode/skill/system-spec-kit
  └ 11 files found

● Search (glob)
  │ "**/*{error,errors,config,flags}*.{ts,js,md,json}" in .opencode/skill/system-spec-kit/mcp_server
  └ 18 files found

● Read errors.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/errors.ts
  └ L1:320 (35 lines read)

● Read config.ts
  │ .opencode/skill/system-spec-kit/mcp_server/core/config.ts
  └ L1:320 (153 lines read)

● Read capability-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/config/capability-flags.ts
  └ L1:320 (153 lines read)

● Read search-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
  └ L1:320 (251 lines read)

● Read graph-flags.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts
  └ L1:260 (42 lines read)

● Search (grep)
  │ "TOOL_DEFINITIONS|name: '" (.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts)
  └ 33 lines found

● Read validate.sh
  │ .opencode/skill/system-spec-kit/scripts/spec/validate.sh
  └ L1:260 (260 lines read)

● Read create.sh
  │ .opencode/skill/system-spec-kit/scripts/spec/create.sh
  └ L1:260 (260 lines read)

● Read tool-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
  └ L260:580 (269 lines read)

● Search (grep)
  │ "spec_kit_memory|memory_context|ListToolsRequestSchema|tools/list|TOOL_DEFINITIONS"
  │ (.opencode/skill/system-spec-kit/mcp_server/context-server.ts)
  └ 6 lines found

● Read README.md
  │ .opencode/skill/system-spec-kit/README.md
  └ L39:130 (91 lines read)

● Read SKILL.md
  │ .opencode/skill/system-spec-kit/SKILL.md
  └ L1:140 (140 lines read)

● Search (glob)
  │ "**/errors/*.ts" in .opencode/skill/system-spec-kit/mcp_server/lib
  └ 3 files found

● Search (grep)
  │ "ErrorCodes|E0[0-9][0-9]|buildErrorResponse\(|createErrorWithHint\(|userFriendlyError\(" in
  │ **/*.{ts,js,md} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

A few drift points are already visible: some high-level stats are stale, some docs still describe old env vars, and one package description still claims an older tool count. I’m now narrowing that into concrete, line-cited findings.

● Read core.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts
  └ L1:360 (321 lines read)

● Read index.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/errors/index.ts
  └ L1:320 (40 lines read)

● Read README.md
  │ .opencode/skill/system-spec-kit/mcp_server/README.md
  └ L1:260 (259 lines read)

● Search (grep)
  │ "E040|specFolder alone|query \(string\) OR concepts|ErrorCodes\.|ERROR_CODES\.|code: 'E" in
  │ **/*.{ts,js,md} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "Feature Entries|189|191|Commands \| 15|Bash \| 4.0\+|Context Server.*32 tools|provides 28
  │ tools" in **/*.{md,json} (.opencode/skill/system-spec-kit)
  └ 12 lines found

● Search (grep)
  │ "with-research|auto-debug|/spec_kit:phase|/memory:shared|/memory:learn|/memory:continue|/memory:
  │ analyze|/memory:manage" in **/*.{md,yaml,yml,json,ts,js} (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (grep)
  │ "SPEC_KIT_DB_PATH|SPEC_KIT_DB_DIR|SPEC_KIT_LOG_LEVEL|VOYAGE_API_KEY|OPENAI_API_KEY|SPECKIT_DYNAM
  │ IC_INIT|SPECKIT_STRICT_SCHEMAS|SPECKIT_ABLATION|SPECKIT_RESPONSE_TRACE" in
  │ **/*.{ts,js,md,sh,json} (.opencode/skill/system-spec-kit)
  └ 5 lines found

● Search (glob)
  │ "**/*memory*" in .opencode/command
  └ No matches found

● Search (grep)
  │ "SPECKIT_MMR|SPECKIT_TRM|SPECKIT_MULTI_QUERY|SPECKIT_CROSS_ENCODER|SPECKIT_SEARCH_FALLBACK|SPECK
  │ IT_FOLDER_DISCOVERY|SPECKIT_DOCSCORE_AGGREGATION|SPECKIT_CONSOLIDATION|SPECKIT_ENCODING_INTENT|S
  │ PECKIT_MEMORY_SUMMARIES|SPECKIT_CONTEXT_HEADERS|SPECKIT_FILE_WATCHER|RERANKER_LOCAL|SPECKIT_GRAP
  │ H_WALK_ROLLOUT|SPECKIT_DYNAMIC_INIT|SPECKIT_RESPONSE_TRACE|SPECKIT_ABLATION|SPEC_KIT_DB_DIR|SPEC
  │ _KIT_DB_PATH|SPEC_KIT_LOG_LEVEL" in **/*.{ts,js,md,sh}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 56 files found

● Search (grep)
  │ "SPECKIT_ADAPTIVE_FUSION|SPECKIT_EXTENDED_TELEMETRY|SPECKIT_INDEX_SPEC_DOCS|SPECKIT_SAVE_QUALITY
  │ _GATE|SPECKIT_RECONSOLIDATION|SPECKIT_NEGATIVE_FEEDBACK|SPECKIT_LEARN_FROM_SELECTION|SPECKIT_EMB
  │ EDDING_EXPANSION|SPECKIT_AUTO_ENTITIES|SPECKIT_ENTITY_LINKING|SPECKIT_PIPELINE_V2|SPECKIT_QUALIT
  │ Y_LOOP|SPECKIT_RELATIONS|SPECKIT_STRICT_SCHEMAS|SPECKIT_DEGREE_BOOST|SPECKIT_GRAPH_SIGNALS|SPECK
  │ IT_COMMUNITY_DETECTION|SPECKIT_CAUSAL_BOOST|SPECKIT_GRAPH_UNIFIED|SPECKIT_SCORE_NORMALIZATION|SP
  │ ECKIT_CLASSIFICATION_DECAY|SPECKIT_INTERFERENCE_SCORE|SPECKIT_FOLDER_SCORING|SPECKIT_SHADOW_SCOR
  │ ING|SPECKIT_DASHBOARD_LIMIT" in **/*.{ts,js,md,sh} (.opencode/skill/system-spec-kit/mcp_server)
  └ 79 files found

● Search (grep)
  │ "VOYAGE_API_KEY|OPENAI_API_KEY|HUGGINGFACE|HF_|EMBEDDING_PROVIDER|SPEC_KIT_DB_DIR|SPEC_KIT_DB_PA
  │ TH" in **/*.{ts,js,md} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (glob)
  │ "**/*spec_kit*" in .opencode
  └ 15 files found

● List directory .opencode/command
  └ 5 files found

● Search (glob)
  │ "**/*.yaml" in .opencode/command/memory
  └ No matches found

● Search (glob)
  │ "**/*.md" in .opencode/command/spec_kit
  └ 8 files found

● Search (grep)
  │ "name:|description:|/spec_kit:|/memory:" in **/*.{yaml,md} (.opencode/command)
  └ 5 lines found

✗ Read README.md
  │ .opencode/command/memory/README.md
  └ Path does not exist

● List directory .opencode/command/memory
  └ 7 files found

● Search (glob)
  │ "**/*.md" in .opencode/command/memory
  └ 6 files found

The command surface also has drift: the `spec_kit` commands exist, but the memory command count in the README looks suspicious. I’m verifying the actual command files before I lock that in as a finding.

● Read phase.md
  │ .opencode/command/spec_kit/phase.md
  └ L1:120 (120 lines read)

● Read analyze.md
  │ .opencode/command/memory/analyze.md
  └ L1:160 (160 lines read)

● Read README.txt
  │ .opencode/command/memory/README.txt
  └ 329 lines read

● Read manage.md
  │ .opencode/command/memory/manage.md
  └ L1:160 (160 lines read)

● Read complete.md
  │ .opencode/command/spec_kit/complete.md
  └ L1:140 (140 lines read)

● Read learn.md
  │ .opencode/command/memory/learn.md
  └ L1:160 (160 lines read)

● Read FEATURE_CATALOG.md
  │ .opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md
  └ L1:80 (80 lines read)

● Search (grep)
  │ "memory_context\(|memory_search\(|memory_match_triggers\(|memory_save\(|task_preflight\(|task_po
  │ stflight\(" (.opencode/skill/system-spec-kit/SKILL.md)
  └ 11 lines found

● Search (grep)
  │ "tool-schemas.ts|TOOL_DEFINITIONS.length|32 tools|zod|JSON schema"
  │ (.opencode/skill/system-spec-kit/mcp_server/README.md)
  └ 5 lines found

● Search (grep)
  │ "Feature Entries|feature_catalog/FEATURE_CATALOG.md|191 entries|189 entries"
  │ (.opencode/skill/system-spec-kit/feature_catalog)
  └ 1 line found

● Search (grep)
  │ "specFolder alone causes E040|requiredAnyOf|x-requiredAnyOf" in **/*.{ts,md}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "Bash 3\.2\+|Bash 4\.0\+|bash 3\.2|bash 4" in **/*.{md,sh,txt} (.opencode/skill/system-spec-kit)
  └ 16 lines found

● Read tool-input-schema.ts
  │ .opencode/skill/system-spec-kit/mcp_server/utils/tool-input-schema.ts
  └ L180:260 (58 lines read)

● Read tool-input-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
  └ L1:260 (260 lines read)

● Search (grep)
  │ "MISSING_REQUIRED_PARAM|INVALID_PARAMETER|SEARCH_FAILED|E031|E030|E040" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server/utils)
  └ No matches found

● Search (grep)
  │ "new MemoryError\(|createErrorWithHint\(|buildErrorResponse\(" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 26 lines found

● Search (grep)
  │ "strict schema|hallucinated|SPECKIT_STRICT_SCHEMAS" in **/*.{ts,md}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 12 lines found

● List directory .opencode/skill/system-spec-kit/templates/level_1
  └ 5 files found

● List directory .opencode/skill/system-spec-kit/templates/level_3
  └ 7 files found

● List directory .opencode/skill/system-spec-kit/templates/level_3+
  └ 7 files found

● List directory .opencode/skill/system-spec-kit/templates/level_2
  └ 6 files found

● Search (grep)
  │ "implementation-summary.md|checklist.md|decision-record.md|research.md|handover.md"
  │ (.opencode/skill/system-spec-kit/templates)
  └ 104 lines found

● Read README.md
  │ .opencode/skill/system-spec-kit/README.md
  └ L171:358 (187 lines read)

● Read context-server.ts
  │ .opencode/skill/system-spec-kit/mcp_server/context-server.ts
  └ L260:360 (100 lines read)

● Read tool-input-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
  └ L260:420 (161 lines read)

● Read tool-input-schema.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts
  └ L1:220 (220 lines read)

● Read mcp-error-format.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/mcp-error-format.vitest.ts
  └ L1:220 (162 lines read)

● Search (grep)
  │ "validateToolArgs\(|ToolSchemaValidationError|formatZodError|validateToolInputSchema\(" in
  │ **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L1:220 (219 lines read)

● Search (grep)
  │ "SEARCH_FAILED|INVALID_PARAMETER|Either "query"|query.*concepts|throw new MemoryError"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts)
  └ 6 lines found

● Search (grep)
  │ "Missing required arguments|required schema constraints|Either \"query\"|unrecognized_keys" in
  │ **/*.vitest.ts (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 5 lines found

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L772:816 (45 lines read)

● Read generate-context.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts
  └ L1:240 (239 lines read)

● Search (grep)
  │ "auto-indexed in MCP|immediate MCP visibility|generate-context.js"
  │ (.opencode/skill/system-spec-kit/README.md)
  └ 11 lines found

● Search (grep)
  │ "auto-indexed in MCP|immediate MCP visibility|generate-context.js"
  │ (.opencode/skill/system-spec-kit/SKILL.md)
  └ 9 lines found

● Search (grep)
  │ "auto-index|memory_index_scan|memory_save|index|MCP visibility|immediate MCP visibility"
  │ (.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts)
  └ 1 line found

● List directory .opencode/skill/system-spec-kit/feature_catalog
  └ 22 files found

● Search (glob)
  │ "*" in .opencode/skill/system-spec-kit/feature_catalog
  └ 5 files found

● Count feature catalog dirs and docs (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/feature_catalog' && find . -maxdepth 1 -type d | sed
  │ '1d' | wc -l && find . -type f -name '*.md' | wc -l
  └ 3 lines...

● Read embeddings.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/providers/embeddings.ts
  └ L1:260 (48 lines read)

● Search (grep)
  │ "VOYAGE_API_KEY|OPENAI_API_KEY|EMBEDDING_PROVIDER|HUGGINGFACE|HF_" in **/*.{ts,js,md}
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/providers)
  └ No matches found

● Search (grep)
  │ "SPEC_KIT_LOG_LEVEL" in **/*.{ts,js,md,sh,json} (.opencode/skill/system-spec-kit)
  └ 1 line found

● Search (grep)
  │ "SPEC_KIT_DB_PATH" in **/*.{ts,js,md,sh,json} (.opencode/skill/system-spec-kit)
  └ 1 line found

● Search (grep)
  │ "SPEC_KIT_DB_DIR" in **/*.{ts,js,md,sh,json} (.opencode/skill/system-spec-kit)
  └ 67 lines found

I’ve got enough evidence for the main doc/code drifts. I’m doing one last pass through the existing test suite for schema and flag-doc alignment so the audit can distinguish “document bug” from “code bug” cleanly.

● Read feature-flag-reference-docs.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts
  └ L1:240 (130 lines read)

● Search (grep)
  │ "feature-flag-reference-docs|tool-input-schema|README|command|docs" in **/*.vitest.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 21 files found

● Run targeted schema and flag doc tests (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/mcp_server' && npx vitest run
  │ tests/tool-input-schema.vitest.ts tests/feature-flag-reference-docs.vitest.ts --reporter=verbose
  └ 111 lines...

● Read (Explore agent — Audit doc-code alignment)
  └ idle

● List directory .opencode/skill/system-spec-kit/manual_testing_playbook
  └ 20 files found

● Search (grep)
  │ "NEW-125|hydra-roadmap-capability-flags" in **/*.md
  │ (.opencode/skill/system-spec-kit/manual_testing_playbook)
  └ 11 lines found

One last thing I’m verifying is the validation-rule count, because that’s another place the docs can silently drift. After that I’ll consolidate everything into the final findings report.

● List directory .opencode/skill/system-spec-kit/scripts/rules
  └ 20 files found

● Read validation_rules.md
  │ .opencode/skill/system-spec-kit/references/validation/validation_rules.md
  └ L1:220 (219 lines read)

● Search (grep)
  │ "13 validation rules|13/13|Run 13 validation rules" in **/*.md (.opencode/skill/system-spec-kit)
  └ 4 lines found

● Count validation rule scripts (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/scripts/rules' && find . -maxdepth 1 -type f -name
  │ '*.sh' | wc -l && find . -maxdepth 1 -type f -name '*.sh' | sort
  └ 21 lines...

● Search (grep)
  │ "deep-research|/spec_kit:deep-research|memory_ingest|shared_memory_enable|shared_space|eval_run_
  │ ablation|eval_reporting_dashboard|memory_get_learning_history"
  │ (.opencode/skill/system-spec-kit/SKILL.md)
  └ 2 lines found

● Search (grep)
  │ "deep-research|/spec_kit:deep-research|with-research|memory_ingest|shared_memory_enable|shared_s
  │ pace|eval_run_ablation|eval_reporting_dashboard|memory_get_learning_history"
  │ (.opencode/skill/system-spec-kit/README.md)
  └ 6 lines found

● Search (grep)
  │ "deep-research|/spec_kit:deep-research" in **/*.md (.opencode/command/spec_kit)
  └ 28 lines found

● Read SKILL.md
  │ .opencode/skill/sk-doc/SKILL.md
  └ L430:620 (191 lines read)

● Search (grep)
  │ "accurate|current reality|current-reality|verify|single source of truth|reference|DO NOT|NEVER"
  │ (.opencode/skill/sk-doc/SKILL.md)
  └ 103 lines found

# System Spec Kit alignment audit

## Overall assessment

Mostly aligned. I did **not** find a major `SKILL.md` feature that is advertised but missing in code.

The gaps are mainly **documentation drift**: `SKILL.md`, `README.md`, command docs, and one doc-alignment test no longer describe the same current reality.

## Findings

1. **High — MCP tool naming/interface drift.**  
   `README.md` says MCP calls use the `spec_kit_memory_` prefix, but the server registers raw tool names like `memory_context`, `checkpoint_create`, and `shared_memory_enable`; the prefixed names appear in the host command/tool wrapper layer, not in the server itself.  
   Evidence: `README.md:288-304`, `mcp_server/context-server.ts:264-266`, `mcp_server/tool-schemas.ts:40-43`, `command/memory/analyze.md:1-5`.

2. **High — configuration docs use stale env vars.**  
   The root README documents `SPEC_KIT_DB_PATH` and `SPEC_KIT_LOG_LEVEL`, but the live server config reads `SPEC_KIT_DB_DIR` for DB override, and I did not find live `SPEC_KIT_LOG_LEVEL` handling in this package.  
   Evidence: `README.md:385-392`, `mcp_server/core/config.ts:42-50`.

3. **High — documented error code does not match runtime behavior.**  
   `SKILL.md` says `memory_search()` with only `specFolder` causes `E040`, but the runtime returns `E_VALIDATION`; `E040` is the legacy generic `SEARCH_FAILED` code.  
   Evidence: `SKILL.md:578-580`, `mcp_server/handlers/memory-search.ts:804-813`, `mcp_server/lib/errors/core.ts:69-78`.

4. **Medium — command inventory is stale.**  
   The README claims **15 commands** (`8 spec_kit + 7 memory`), but the repo currently has **8 spec_kit** command files and **6 memory** command files. It also omits `/spec_kit:deep-research` from the table.  
   Evidence: `README.md:306-340`, `command/spec_kit/deep-research.md:1-5`, `command/memory/README.txt:38-67`.

5. **Medium — README overstates `generate-context.js` indexing behavior.**  
   The README says generated memory files are “auto-indexed in MCP”, but the script says it creates files **for indexing**, and `SKILL.md` explicitly says to call `memory_index_scan()` or `memory_save()` for immediate visibility.  
   Evidence: `README.md:101-106`, `README.md:265-267`, `scripts/memory/generate-context.ts:82-85`, `SKILL.md:600-602`.

6. **Medium — validation-rule counts are stale/inconsistent.**  
   The README repeatedly says “13 validation rules”, while the validation reference enumerates **14 named rules**.  
   Evidence: `README.md:109-116`, `README.md:347-348`, `README.md:669`, `references/validation/validation_rules.md:40-58`.

7. **Medium — schema-source docs are partly wrong.**  
   `mcp_server/README.md` describes `tool-schemas.ts` as the place for “Zod schemas”, but the live split is: `tool-schemas.ts` = MCP-facing JSON schemas/tool defs, `schemas/tool-input-schemas.ts` = Zod validation schemas.  
   Evidence: `mcp_server/README.md:191-224`, `mcp_server/tool-schemas.ts:29-43`, `mcp_server/schemas/tool-input-schemas.ts:1-6`, `mcp_server/schemas/tool-input-schemas.ts:99-153`, `mcp_server/schemas/tool-input-schemas.ts:354-403`.

8. **Low — current-state stats are internally inconsistent.**  
   The docs disagree on feature counts (`189` vs `191`), and the README still says Bash `4.0+` while the scripts are explicitly written for Bash `3.2+`.  
   Evidence: `README.md:55`, `README.md:183`, `README.md:672`, `SKILL.md:609`, `SKILL.md:841`, `scripts/spec/validate.sh:5`.

## Verified alignments

- The live MCP server exposes **32 tools** and the layer model is real.  
  Evidence: `mcp_server/tool-schemas.ts`, `mcp_server/context-server.ts:264-266`.

- The documented memory modes (`auto`, `quick`, `deep`, `focused`, `resume`) match the live schema.  
  Evidence: `SKILL.md:569-576`, `mcp_server/tool-schemas.ts:40-43`.

- Core Spec Kit workflow pieces exist: levels `1/2/3/3+`, template directories, validation scripts, checkpoints, shared memory, learning tools, eval tools, and async ingest.

## sk-doc alignment note

The biggest `sk-doc` issue is **current-reality drift**. There is already a failing docs test caused by a stale manual-playbook path expectation, which is a strong sign the documentation package is no longer fully synchronized.  
Evidence: `mcp_server/tests/feature-flag-reference-docs.vitest.ts:110-128`, actual file at `manual_testing_playbook/19--feature-flag-reference/125-hydra-roadmap-capability-flags.md`.

## Validation

Ran:

`cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run tests/tool-input-schema.vitest.ts tests/feature-flag-reference-docs.vitest.ts --reporter=verbose`

Result:

- `tests/tool-input-schema.vitest.ts` passed
- `tests/feature-flag-reference-docs.vitest.ts` failed due stale playbook path expectations

