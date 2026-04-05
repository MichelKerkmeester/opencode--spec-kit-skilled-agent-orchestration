● memory_match_triggers
  └ {"summary":"Matched 5 memories via trigger phrases","data":{"matchType":"trig...

● Run skill advisor (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Analyze indexing/normalization test suite
  │ coverage gaps in .opencode/skill/system-spec-kit, compare tests for input-normalizer,
  │ memory-indexer, importance-tiers, and memory-parser, identify edge cases and integration gaps"
  │ --threshold 0.8
  └ 43 lines...

● Create session plan (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/ac54eeb6-e692-4cff-9383-14a41d1159b9/plan.md'
  │ <<'EOF'
  │ # Plan
  │ 1. Inventory relevant Vitest files and count tests per file.…
  └ 5 lines...

I’ve started by inventorying the relevant Vitest files and loading the core implementations so I can map actual behavior against what the suite asserts. Next I’m checking edge/error-path coverage and test distribution across files.

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ 1 line read

● Read memory-parser.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts
  └ 1 line read

● Read importance-tiers.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts
  └ 229 lines read

● Read memory-indexer.ts
  │ .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts
  └ 204 lines read

● Search (grep)
  │ "memory-parser|handler-memory-index|importance-tiers|input-normalizer" in *.vitest.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 25 lines found

● skill(system-spec-kit)

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/tests/*.vitest.ts"
  └ 5 files found

I found the core modules and the obvious direct tests. Now I’m widening the search a bit to catch indirect coverage too—especially anything exercising canonicalization, indexing failures, and `input-normalizer` from outside `mcp_server/tests`.

● Read copilot-tool-output-1773999801518-7p7w5n.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1773999801518-7p7w5n.txt
  └ 1 line read

● Search (grep)
  │ "embedding|missing file|ENOENT|malformed
  │ JSON|JSON.parse|throw|rejects|toThrow|toReject|symlink|canonical|dedup|\.\./|\\" in *.vitest.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 5 lines found

● Search (grep)
  │ "^(\s*)(it|test)\(" in *.vitest.ts (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 5 files found

● Search (grep)
  │ "input-normalizer|normalizeFileEntryLike|normalizeExtractedData|normalizeCollectedData" in
  │ **/*.{ts,js} (.opencode/skill/system-spec-kit)
  └ 28 lines found

● search tests that exercise input-normalizer.ts normalizeFileEntryLike normalizeExtractedData norm…
  └ {"success":true,"results":[],"total_returned":0,"offset":0,"message":null}

I’ve now confirmed there are separate script-side tests covering `input-normalizer`, so the suite isn’t confined to `mcp_server/tests`. I’m drilling into those alongside the parser/indexing tests to separate direct unit coverage from broader pipeline/integration coverage.

● Read memory-parser-extended.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/memory-parser-extended.vitest.ts
  └ 1 line read

● Search (grep)
  │ "^(export\s+)?(async\s+)?function\s+|^export\s*\{"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts)
  └ 25 lines found

● Search (grep)
  │ "^(export\s+)?(async\s+)?function\s+|^export\s*\{"
  │ (.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts)
  └ 19 lines found

● Read runtime-memory-inputs.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts
  └ L1:260 (260 lines read)

● Read runtime-memory-inputs.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts
  └ L261:760 (500 lines read)

● Read importance-tiers.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/importance-tiers.vitest.ts
  └ 207 lines read

● Read spec-folder-canonicalization.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-canonicalization.vitest.ts
  └ 262 lines read

● Read task-enrichment.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts
  └ L1:260 (260 lines read)

● Read integration-save-pipeline.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/integration-save-pipeline.vitest.ts
  └ L1:260 (111 lines read)

● Read memory-parser.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/memory-parser.vitest.ts
  └ L1:520 (440 lines read)

● Read handler-memory-index-cooldown.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-index-cooldown.vitest.ts
  └ 311 lines read

● Read full-spec-doc-indexing.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/full-spec-doc-indexing.vitest.ts
  └ L1:320 (319 lines read)

● Read memory-save-pipeline-enforcement.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/memory-save-pipeline-enforcement.vitest.ts
  └ L1:260 (260 lines read)

I’ve got enough of the suite in view to start spotting patterns: parser/canonicalization coverage is fairly intentional, while the indexing side looks much more skewed toward shallow guards and mocked seams. I’m now quantifying that across files so the gap list is evidence-backed instead of impressionistic.

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ L330:520 (190 lines read)

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ L520:760 (241 lines read)

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ L980:1235 (238 lines read)

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ L760:980 (221 lines read)

● Read memory-parser.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts
  └ L330:620 (291 lines read)

● Read memory-parser.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts
  └ L620:900 (280 lines read)

● Read memory-parser.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts
  └ L120:330 (210 lines read)

● Count test cases per mcp test file (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ root = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests')…
  └ 296 lines...

● Count script-side tests (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ files = [
  │ Path('/Users/michelkerkmeester/MEGA/Development/Opencode …
  └ 16 lines...

● Count relevant tests (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ root = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests')…
  └ 27 lines...

● Search (grep)
  │ "buildSpecRelevanceKeywords|containsRelevantKeyword|isSafeSpecFallback|relevance|_relevanceFallb
  │ ack|FILES|validateInputData\(|normalizeInputData\("
  │ (.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts)
  └ 23 lines found

● Search (grep)
  │ "validateInputData\(|normalizeInputData\(|transformOpencodeCapture\("
  │ (.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts)
  └ 19 lines found

● Search (grep)
  │ "normalizeFileEntryLike|empty object|missing required FILE_PATH|FILES\[|wrong
  │ type|_synthetic|_provenance|MODIFICATION_MAGNITUDE" in *.vitest.ts
  │ (.opencode/skill/system-spec-kit/scripts/tests)
  └ 37 lines found

● Search (grep)
  │ "\.\./|mixed separators|backslash|symlink|canonical|dedup|realpath|ELOOP|ENOENT" in *.vitest.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 5 lines found

● Search (grep)
  │ "indexMemory\(|updateMetadataEmbeddingStatus\(|failed_embedding|skipped_embedding_unavailable|sk
  │ ipped_quality_gate|skipped_index_policy|embedding generation returned null|metadata.json" in
  │ **/*.{ts,js} (.opencode/skill/system-spec-kit)
  └ 51 lines found

● Read runtime-memory-inputs.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts
  └ L760:1005 (222 lines read)

● Read memory-indexer-weighting.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/memory-indexer-weighting.vitest.ts
  └ 80 lines read

● Read workflow-e2e.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/workflow-e2e.vitest.ts
  └ L520:820 (280 lines read)

● Read memory-parser-extended.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/memory-parser-extended.vitest.ts
  └ L1:320 (320 lines read)

● Read memory-parser-extended.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/memory-parser-extended.vitest.ts
  └ L321:520 (200 lines read)

● Run targeted script tests (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/scripts' && npx vitest run
  │ tests/runtime-memory-inputs.vitest.ts tests/memory-indexer-weighting.vitest.ts --reporter=basic
  └ 41 lines...

● Run targeted relevant mcp tests (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/mcp_server' && npx vitest run
  │ tests/importance-tiers.vitest.ts tests/memory-parser.vitest.ts
  │ tests/memory-parser-extended.vitest.ts tests/spec-folder-canonicalization.vitest.ts
  │ tests/handler-memory-index-cooldown.vitest.ts tests/integration-save-pipeline.vitest.ts …
  └ 42 lines...

The direct test run hiccuped on an unsupported `basic` reporter in this workspace, so I’m using source-level inspection plus targeted file reads instead of blocking on that. That still gives enough signal to identify real gaps, especially where tests are obviously absent versus just unexecuted here.

● Search (grep)
  │ "parseMemoryFile|findMemoryFiles|validateParsedMemory|extractCausalLinks|readFileWithEncoding"
  │ (.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser-extended.vitest.ts)
  └ 34 lines found

● Search (grep)
  │ "applyTierBoost|getTierConfig|getAutoExpireDays|getTiersByImportance|getDefaultTierForDocumentTy
  │ pe|normalizeDocumentType|shouldAlwaysSurface|getMaxTokens|getConstitutionalFilter|getSearchableT
  │ iersFilter|getExpiredTemporaryFilter|isValidTier"
  │ (.opencode/skill/system-spec-kit/mcp_server/tests/importance-tiers.vitest.ts)
  └ 18 lines found

● Search (grep)
  │ "buildSpecRelevanceKeywords|containsRelevantKeyword|extractSpecIds|getCurrentSpecId|isSafeSpecFa
  │ llback|buildToolObservationTitle|cloneInputData|transformKeyDecision|buildSessionSummaryObservat
  │ ion|buildTechnicalContextObservation" in *.vitest.ts
  │ (.opencode/skill/system-spec-kit/scripts/tests)
  └ No matches found

● Run targeted script tests (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/scripts' && npx vitest run
  │ tests/runtime-memory-inputs.vitest.ts tests/memory-indexer-weighting.vitest.ts
  └ 11 lines...

● Run targeted mcp tests (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/mcp_server' && npx vitest run
  │ tests/importance-tiers.vitest.ts tests/memory-parser.vitest.ts
  │ tests/memory-parser-extended.vitest.ts tests/spec-folder-canonicalization.vitest.ts
  │ tests/handler-memory-index-cooldown.vitest.ts tests/integration-save-pipeline.vitest.ts …
  └ 204 lines...

One useful finding: the script-side `*.vitest.ts` files for `input-normalizer` aren’t being picked up by the scripts workspace’s current Vitest include pattern. That means some normalization coverage exists in source, but may not be part of the default runnable suite unless invoked differently or reconfigured.

● Read package.json
  │ .opencode/skill/system-spec-kit/scripts/package.json
  └ 28 lines read

● Search (grep)
  │ "^\s*it\(|^\s*test\(|it\.each"
  │ (.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts)
  └ 33 lines found

● Search (grep)
  │ "normalizeFileEntryLike\(|cloneInputData\(|buildToolObservationTitle\(|buildSpecRelevanceKeyword
  │ s\(|containsRelevantKeyword\(|extractSpecIds\(|getCurrentSpecId\(|isSafeSpecFallback\("
  │ (.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts)
  └ 26 lines found

● Search (grep)
  │ "^\s*it\(|^\s*test\(|it\.each"
  │ (.opencode/skill/system-spec-kit/scripts/tests/memory-indexer-weighting.vitest.ts)
  └ 1 line found

● Search (grep)
  │ "skipped_embedding_unavailable|failed_embedding|metadata\.embedding|updateMetadataEmbeddingStatu
  │ s|indexingStatus" in *.vitest.ts (.opencode/skill/system-spec-kit/scripts/tests)
  └ 12 lines found

● Search (grep)
  │ "include:|test\.|\.vitest\.ts|vitest" in **/*.{ts,js,json,cjs,mjs}
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 5 lines found

● Read vitest.config.ts
  │ .opencode/skill/system-spec-kit/mcp_server/vitest.config.ts
  └ 23 lines read

● Search (grep)
  │ "include\s*:|exclude\s*:|\.vitest\.ts|test\.[jt]s|setupFiles|root"
  │ (.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts)
  └ 1 line found

● Search (grep)
  │ "updateMetadataEmbeddingStatus|indexMemory\(|generateDocumentEmbedding|extractTriggerPhrases|not
  │ ifyDatabaseUpdated|readFile\(|writeFile\(|JSON.parse\("
  │ (.opencode/skill/system-spec-kit/scripts/tests/memory-indexer-weighting.vitest.ts)
  └ 7 lines found

● Search (grep)
  │ "EACCES|Permission denied|dataFile path|directory traversal|triggerPhrases must be an
  │ array|FILES must be an array|FILES\[\d+\] missing|session\.status|git\.repositoryState"
  │ (.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts)
  └ 3 lines found

I’ve isolated the main gap pattern now: parser/path tests are relatively strong, but `input-normalizer` helper coverage and `memory-indexer` failure-path coverage are much thinner—and some of that thin coverage lives in script-side tests that don’t run under the current scripts test command by default.

● Read test-extractors-loaders.js
  │ .opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js
  └ L810:840 (31 lines read)

● Search (grep)
  │ "\.\./|Equivalent normalized path|canonical path|input-normalizer\.ts"
  │ (.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js)
  └ 3 lines found

● Search (grep)
  │ "updateMetadataWithEmbedding|updateMetadataEmbeddingStatus|notifyDatabaseUpdated|Embedding
  │ generation returned null|Trigger phrase extraction failed" in *.vitest.ts
  │ (.opencode/skill/system-spec-kit/scripts/tests)
  └ 7 lines found

● Search (grep)
  │ "importanceWeight|anchorFactor|lengthFactor|Math\.round\(|extractTriggerPhrases\(|qualityFlags|q
  │ ualityScore" in *.vitest.ts (.opencode/skill/system-spec-kit/scripts/tests)
  └ 13 lines found

● Search (grep)
  │ "getExpiredTemporaryFilter|getSearchableTiersFilter|shouldAlwaysSurface|getMaxTokens|getConstitu
  │ tionalFilter|isValidTier|normalizeDocumentType" in *.vitest.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 28 lines found

● Read scoring-gaps.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts
  └ L1:360 (318 lines read)

● Search (grep)
  │ "applyTierBoost|getTierValue|compareTiers|isValidTier|normalizeDocumentType|getDefaultTierForDoc
  │ umentType" (.opencode/skill/system-spec-kit/mcp_server/tests/scoring-gaps.vitest.ts)
  └ No matches found

● Search (grep)
  │ "normalizeFileEntryLike|normalizeInputData|validateInputData|transformOpencodeCapture"
  │ (.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts)
  └ 1 line found

● Recount tier-related relevant tests (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ files = [
  │ 'importance-tiers.vitest.ts',…
  └ 25 lines...

● Read memory-parser-extended.vitest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tests/memory-parser-extended.vitest.ts
  └ L520:640 (96 lines read)

● Search (grep)
  │ "buildSpecRelevanceKeywords|containsRelevantKeyword|extractSpecIds|getCurrentSpecId|isSafeSpecFa
  │ llback|buildToolObservationTitle"
  │ (.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts)
  └ No matches found

● Search (grep)
  │ "memory-indexer weighting|indexMemory\(|updateMetadataWithEmbedding|updateMetadataEmbeddingStatu
  │ s|notifyDatabaseUpdated" in *.vitest.ts (.opencode/skill/system-spec-kit/scripts/tests)
  └ 9 lines found

● Search (grep)
  │ "getConstitutionalFilter|getSearchableTiersFilter|shouldAlwaysSurface|getMaxTokens|getExpiredTem
  │ poraryFilter" in *.vitest.ts (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 1 file found

● Search (grep)
  │ "technicalContext|keyDecisions|key_decisions|buildTechnicalContextObservation|buildSessionSummar
  │ yObservation|transformKeyDecision"
  │ (.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts)
  └ 1 line found

● Search (grep)
  │ "technicalContext|sessionSummary|keyDecisions|key_decisions|triggerPhrases|trigger_phrases|files
  │ Modified|files_modified"
  │ (.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts)
  └ 12 lines found

● Search (grep)
  │ "applyTierBoost\(|isValidTier\(|normalizeDocumentType\(|getTierConfig\(|getTierValue\(|compareTi
  │ ers\(" in *.vitest.ts (.opencode/skill/system-spec-kit/mcp_server/tests)
  └ 15 lines found

I want one last confirmation on the script-side tests because the runner behavior is a bit non-obvious here. If `npm test` picks them up while bare `npx vitest` does not, that’s an operational quirk rather than missing coverage—but it still matters when evaluating how dependable the suite is.

● Run scripts tests via package script (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/scripts' && npm test --
  │ tests/runtime-memory-inputs.vitest.ts tests/memory-indexer-weighting.vitest.ts
  └ 45 lines...

● Summarize relevant test counts (shell)
  │ python3 - <<'PY'
  │ from pathlib import Path
  │ import re
  │ files = {
  │ 'scripts/runtime-memory-inputs.vitest.ts': …
  └ 46 lines...

I couldn’t confirm the spec’s `238 passing` claim from the current tree. What I verified is `181/181` passing in the core MCP subset, while the script-side normalization subset is `37/38` with one current failure in `runtime-memory-inputs.vitest.ts`.

`TCOV-001` — `CRITICAL` — `scripts/utils/input-normalizer.ts` / `normalizeFileEntryLike()`  
Missing: no focused tests for empty object, missing `DESCRIPTION`, missing `FILE_PATH`, conflicting `path` vs `FILE_PATH`, wrong-type fields, invalid `_provenance`, invalid `MODIFICATION_MAGNITUDE`, invalid `_synthetic`.  
Suggested: assert defaults, precedence, and type-dropping behavior on malformed file entries.

`TCOV-002` — `HIGH` — `input-normalizer` validation branches  
Missing: `validateInputData()` branches for `FILES` not array, `FILES[i]` non-object, missing `FILE_PATH|path`, wrong-type `triggerPhrases`, `keyDecisions`, `nextSteps`, `observations`, `user_prompts`, `recent_context`.  
Suggested: one table-driven suite covering each validation error string.

`TCOV-003` — `HIGH` — `input-normalizer` relevance/filter helpers  
Missing: no direct tests for `buildSpecRelevanceKeywords`, `containsRelevantKeyword`, `extractSpecIds`, `getCurrentSpecId`, `isSafeSpecFallback`, `buildToolObservationTitle`.  
Suggested: explicit cases for foreign spec IDs, current-spec fallback, multiword keywords, generic stopwords, and tool-title derivation.

`TCOV-004` — `MEDIUM` — `input-normalizer` observation helpers  
Missing: no direct assertions for `transformKeyDecision`, `buildSessionSummaryObservation`, `buildTechnicalContextObservation`, `mapTechnicalContext`, `buildNextStepsObservation`, `cloneInputData`.  
Suggested: malformed decision objects, alt-label extraction, technical-context serialization, deep-clone immutability, duplicate next-step suppression.

`EDGE-001` — `HIGH` — canonical path deduplication  
Covered: symlinks, `ENOENT`, `ELOOP`, UNC, Windows backslashes.  
Missing: explicit mixed-separator paths and `..` normalization in the current Vitest parser/indexing suite; `..` is only covered in legacy JS extractor tests.  
Suggested: `specs\\x/../x/memory/file.md`, mixed `/` + `\\`, and duplicate discovery through normalized aliases.

`TCOV-005` — `CRITICAL` — `scripts/core/memory-indexer.ts`  
Missing: direct tests for `generateDocumentEmbedding()` returning `null`, trigger extraction failure fallback, `vectorIndex.indexMemory()` throw, malformed/missing `metadata.json`, JSON parse failure, write failure, and DB notification failure.  
Suggested: unit tests around `indexMemory()`, `updateMetadataEmbeddingStatus()`, `updateMetadataWithEmbedding()` with mocked fs/vector failures.

`TCOV-006` — `MEDIUM` — importance weighting formula boundaries  
Missing: `importance-tiers` tests mostly assert nominal constants; no boundary tests for `applyTierBoost(NaN|Infinity|0|negative)`, and no direct tests of the `memory-indexer` `importanceWeight` formula at min/max length/anchor counts.  
Suggested: zero/NaN/infinite scores, deprecated tier at zero boost, and formula cases for empty content, huge content, zero anchors, 10+ anchors.

`TCOV-007` — `MEDIUM` — `memory-parser` encoding/title edge paths  
Covered: missing file, malformed YAML, UTF-8 BOM.  
Missing: UTF-16 LE/BE BOM branches, invalid anchor-id warnings, comment-stripped tier extraction, duplicate trigger-phrase dedup behavior, direct `parseMemoryContent()` coverage.  
Suggested: UTF-16 fixtures, invalid anchor IDs, HTML-commented fake tiers, repeated trigger phrases, and in-memory parse tests.

`INTG-001` — `HIGH` — integration coverage gap  
Current ratio on the core runnable MCP subset is about `114 unit/seam : 67 integration-ish` (`~63:37`). Real end-to-end save/index coverage is concentrated in `memory-save-pipeline-enforcement.vitest.ts`; `handler-memory-index-cooldown.vitest.ts` is heavily mocked and `integration-save-pipeline.vitest.ts` is shallow.  
Suggested: add one real filesystem+DB integration for `memory-index` scan and one direct integration for `scripts/core/memory-indexer.ts`.

`APAT-001` — `LOW` — test anti-patterns  
`handler-memory-index-cooldown.vitest.ts` mocks nearly every dependency, so it verifies envelopes more than behavior. `integration-save-pipeline.vitest.ts` mostly checks “throws” and signatures despite its name. `full-spec-doc-indexing.vitest.ts` is a giant omnibus file that leans toward implementation/detail testing.  
Suggested: replace some mocks with temp-fs/temp-db fixtures and split broad files into behavior-focused suites.

Distribution from the files I inspected: core executed MCP subset — `importance-tiers 17`, `memory-parser 25`, `memory-parser-extended 46`, `spec-folder-canonicalization 20`, `handler-memory-index-cooldown 6`, `integration-save-pipeline 10`, `memory-save-pipeline-enforcement 57` = `181 passing`. Additional related coverage by file definition count: `scoring-gaps 40`, `full-spec-doc-indexing 121`, `runtime-memory-inputs 37 executed / 1 failing`, `memory-indexer-weighting 1 passing`.


Total usage est:        1 Premium request
API time spent:         5m 0s
Total session time:     5m 39s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  2.0m in, 19.4k out, 1.8m cached (Est. 1 Premium request)
