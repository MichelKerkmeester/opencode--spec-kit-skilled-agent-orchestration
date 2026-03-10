● Todo added: Inventory source and test files

● Glob ".opencode/skill/system-spec-kit/scripts/tests/**/*" in
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
  └ 122 files found

● Glob ".opencode/skill/system-spec-kit/scripts/**/*.test.ts" in
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
  └ No matches found

● Glob ".opencode/skill/system-spec-kit/scripts/**/*.spec.ts" in
/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
  └ No matches found

● Read .opencode/skill/system-spec-kit/scripts/core/file-writer.ts
  └ 198 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/scripts/core/config.ts
  └ 356 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts
  └ 87 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts
  └ 476 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts
  └ 443 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts
  └ 587 lines read

● Read .opencode/skill/system-spec-kit/scripts/utils/file-helpers.ts
  └ 88 lines read

● Read .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts
  └ 185 lines read

● Run skill advisor
  $ python3 .opencode/skill/scripts/skill_advisor.py "Audit TypeScript test coverage for 11
  system-spec-kit script files, identify uncovered exported functions, untested edge cases, and
  missing error-path tests" --threshold 0.8
  └ 43 lines...

● Create session plan
  $ cat >
  '/Users/michelkerkmeester/.copilot/session-state/567fe405-66f3-4d64-a6e8-cd7042faf208/plan.md'
   <<'EOF'
  1. Inventory relevant source and test files.
  2. Read all 11 source files plus all related tests....
  └ 5 lines...

● skill(sk-code--review)

● Todo started: inventory-files

● Read .agents/skills/sk-code--review/references/quick_reference.md
  └ 151 lines read

● Read .agents/skills/sk-code--review/references/security_checklist.md
  └ 206 lines read

● Read .agents/skills/sk-code--review/references/code_quality_checklist.md
  └ 162 lines read

● Read .agents/skills/sk-code--review/references/test_quality_checklist.md
  └ 146 lines read

● Grep "^export\s+(?:async\s+)?function|^export\s*\{|^export\s+type|^export\s+interface" in
{core/file-writer.ts,core/workflow.ts,core/config.ts,extractors/collect-session-data.ts,extractors/c
ontamination-filter.ts,extractors/decision-extractor.ts,extractors/file-extractor.ts,extractors/open
code-capture.ts,utils/file-helpers.ts,utils/input-normalizer.ts,utils/slug-utils.ts}
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Grep "file-writer|workflow|config|collect-session-data|contamination-filter|decision-extractor|fil
e-extractor|opencode-capture|file-helpers|input-normalizer|slug-utils|writeFilesAtomically|extractDe
cisions|extractFilesFromData|captureConversation|getRecentPrompts|normalizeMemoryNameCandidate|gener
ateContentSlug|filterContamination|toRelativePath|cleanDescription|isDescriptionValid" in
**/*.{ts,js} (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/tests)
  └ 5 lines found

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 1-260
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts lines 1-260
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts lines 1-260
  └ 260 lines read

● Count large file lines
  $ wc -l .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts
  .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ 5 lines...

● Grep "^export\s+|^}\s*;?$" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 23 lines found

● Grep "^export\s+|^}\s*;?$" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts)
  └ 34 lines found

● Grep "^export\s+|^}\s*;?$" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts)
  └ 33 lines found

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 261-520
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 521-780
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 781-1040
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/workflow.ts lines 1041-1333
  └ 293 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts lines 261-520
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts lines 521-857
  └ 337 lines read

● Read .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts lines 261-520
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts lines 521-627
  └ 107 lines read

● Grep "writeFilesAtomically|file-writer" in tests/**/*.{ts,js}
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Grep "runWorkflow|workflow-memory|workflow|injectQualityMetadata|applyThinningToFileChanges|enrich
StatelessData" in tests/**/*.{ts,js} (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Grep "collectSessionData|shouldAutoSave|extractPreflightPostflightData|buildContinueSessionData|de
termineSessionStatus|estimateCompletionPercent|extractPendingTasks|generateContextSummary|generateRe
sumeContext|calculateLearningIndex|getScoreAssessment|getTrendIndicator|generateLearningSummary" in
tests/**/*.{ts,js} (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Grep "filterContamination|contamination-filter|extractDecisions|decision-extractor|extractFilesFro
mData|buildObservationsWithAnchors|deduplicateObservations|enhanceFilesWithSemanticDescriptions|dete
ctObservationType" in tests/**/*.{ts,js} (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Grep "captureConversation|getRecentPrompts|getSessionResponses|getToolExecutions|getProjectId|getR
ecentSessions|getCurrentSession|getSessionMessages|getMessageParts|readJsonlTail|readJsonSafe|trunca
teOutput|calculateDuration|opencode-capture" in tests/**/*.{ts,js}
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Grep "toRelativePath|isDescriptionValid|cleanDescription|normalizeInputData|validateInputData|tran
sformKeyDecision|transformOpencodeCapture|transformOpenCodeCapture|normalizeMemoryNameCandidate|slug
ify|isContaminatedMemoryName|isGenericContentTask|pickBestContentName|truncateSlugAtWordBoundary|ens
ureUniqueMemoryFilename|generateContentSlug" in tests/**/*.{ts,js}
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Read .opencode/skill/system-spec-kit/scripts/package.json
  └ 24 lines read

● Grep "collect-session-data|input-normalizer|file-extractor|decision-extractor|opencode-capture|slu
g-utils|file-helpers|contamination-filter|workflow|file-writer|config"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/tests)
  └ 5 lines found

● Grep
"runWorkflow|collectSessionData|normalizeInputData|transformOpencodeCapture|extractFilesFromData|ext
ractDecisions|captureConversation|generateContentSlug|writeFilesAtomically|filterContamination"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/tests)
  └ 5 lines found

● Run script test suite
  $ cd '.opencode/skill/system-spec-kit/scripts' && npm test -- --runInBand 2>/dev/null || npm test
  └ 17 lines...

● Grep "core/file-writer|writeFilesAtomically" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/tests)
  └ 10 lines found

● Grep "core/workflow|runWorkflow" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/tests)
  └ 38 lines found

● Grep "core/config|findActiveSpecsDir|getAllExistingSpecsDirs|getSpecsDirectories|CONFIG"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/tests)
  └ 5 lines found

● Grep "extractors/collect-session-data|collectSessionData|shouldAutoSave|extractPreflightPostflight
Data|buildContinueSessionData|determineSessionStatus|estimateCompletionPercent|extractPendingTasks|g
enerateContextSummary|generateResumeContext" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/tests)
  └ 52 lines found

● Grep "extractors/(contamination-filter|decision-extractor|file-extractor|opencode-capture)|filterC
ontamination|extractDecisions|extractFilesFromData|buildObservationsWithAnchors|deduplicateObservati
ons|enhanceFilesWithSemanticDescriptions|detectObservationType|captureConversation|getRecentPrompts|
getSessionResponses|getToolExecutions|getProjectId|getRecentSessions|getCurrentSession|getSessionMes
sages|getMessageParts|readJsonSafe|readJsonlTail"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/tests)
  └ 5 lines found

● Grep "utils/(file-helpers|input-normalizer|slug-utils)|toRelativePath|isDescriptionValid|cleanDesc
ription|normalizeInputData|validateInputData|transformKeyDecision|transformOpencodeCapture|transform
OpenCodeCapture|normalizeMemoryNameCandidate|slugify|isContaminatedMemoryName|isGenericContentTask|p
ickBestContentName|truncateSlugAtWordBoundary|ensureUniqueMemoryFilename|generateContentSlug"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/tests)
  └ 92 lines found

● Grep "findActiveSpecsDir|getAllExistingSpecsDirs|getSpecsDirectories|core/config"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/tests)
  └ 46 lines found

● Grep "filterContamination|extractDecisions|extractFilesFromData|buildObservationsWithAnchors|dedup
licateObservations|enhanceFilesWithSemanticDescriptions|detectObservationType"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/tests)
  └ 5 lines found

● Grep
"captureConversation|getRecentPrompts|getSessionResponses|getToolExecutions|getProjectId|getRecentSe
ssions|getCurrentSession|getSessionMessages|getMessageParts|readJsonSafe|readJsonlTail|pathExists"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/tests)
  └ 51 lines found

● Read .opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js lines 1488-1580
  └ 93 lines read

● Read .opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js lines 250-380
  └ 131 lines read

● Read .opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js lines 250-350
  └ 101 lines read

● Read .opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js lines 2538-2615
  └ 78 lines read

● Read .opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts lines 240-420
  └ 181 lines read

● Read .opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts lines 520-780
  └ 252 lines read

● Grep "FILE-EXTRACTOR|decision-extractor|input-normalizer|contamination-filter|file-helpers|slug-ut
ils|opencode-capture|config.js|file-writer" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js)
  └ 10 lines found

● Grep "filterContamination|extractDecisions|extractFilesFromData|buildObservationsWithAnchors|dedup
licateObservations|enhanceFilesWithSemanticDescriptions|detectObservationType"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js)
  └ 49 lines found

● Read .opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js lines 108-160
  └ 53 lines read

● Read .opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js lines 980-1060
  └ 81 lines read

● Read /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1773090417841-v608n3.txt
  lines 1-220
  └ 93 lines read

● Read .opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js lines 540-730
  └ 190 lines read

● Read .opencode/skill/system-spec-kit/scripts/tests/test-memory-quality-lane.js lines 50-110
  └ 61 lines read

● Read .opencode/skill/system-spec-kit/scripts/tests/test-folder-detector-functional.js lines 516-666

  └ 151 lines read

● Grep "buildTechnicalContextObservation|buildSessionSummaryObservation|transformKeyDecision|transfo
rmOpencodeCapture|transformOpenCodeCapture|validateInputData|normalizeInputData"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/tests)
  └ 38 lines found

● Grep "normalizeMemoryNameCandidate|truncateSlugAtWordBoundary|ensureUniqueMemoryFilename|slugify|p
ickBestContentName|generateContentSlug|isContaminatedMemoryName|isGenericContentTask"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/tests)
  └ 22 lines found

● Grep "deduplicateObservations|buildObservationsWithAnchors|enhanceFilesWithSemanticDescriptions|ex
tractFilesFromData|detectObservationType" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/tests)
  └ 69 lines found

● Grep "buildContinueSessionData|determineSessionStatus|estimateCompletionPercent|extractPendingTask
s|generateContextSummary|generateResumeContext" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/tests)
  └ No matches found

● Read .opencode/skill/system-spec-kit/scripts/tests/test-extractors-loaders.js lines 1136-1165
  └ 30 lines read

● Grep "buildContinueSessionData|determineSessionStatus|estimateCompletionPercent|extractPendingTask
s|generateContextSummary|generateResumeContext" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts)
  └ 18 lines found

● Grep "buildTechnicalContextObservation|normalizeMemoryNameCandidate|truncateSlugAtWordBoundary|ens
ureUniqueMemoryFilename|deduplicateObservations" in tests/**/*
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Grep "writeFilesAtomically" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/core/file-writer.ts)
  └ 1 line found

● Grep "collectSessionData|shouldAutoSave|extractPreflightPostflightData|calculateLearningIndex|getS
coreAssessment|getTrendIndicator|generateLearningSummary|buildContinueSessionData|determineSessionSt
atus|estimateCompletionPercent|extractPendingTasks|generateContextSummary|generateResumeContext"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts)
  └ 42 lines found

● Grep "normalizeInputData|validateInputData|transformKeyDecision|buildSessionSummaryObservation|bui
ldTechnicalContextObservation|transformOpencodeCapture"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts)
  └ 16 lines found

● Grep "normalizeMemoryNameCandidate|slugify|isContaminatedMemoryName|isGenericContentTask|pickBestC
ontentName|truncateSlugAtWordBoundary|ensureUniqueMemoryFilename|generateContentSlug"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts)
  └ 16 lines found

● Grep "quality|duplicate|contamination|alignment|tree
thinning|lock|serial|contextFilename|memorySequence|description
tracking|index|HTML|cleaning|stateless" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts)
  └ 28 lines found

● Grep "quality|duplicate|contamination|alignment|tree
thinning|index|metadata|warning|html|cleaning|memorySequence|contextFilename"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts)
  └ 29 lines found

● Read .opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts lines 170-330
  └ 161 lines read

● Read .opencode/skill/system-spec-kit/scripts/tests/memory-render-fixture.vitest.ts lines 330-380
  └ 19 lines read

● Grep "vitest" in package.json (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit)
  └ 5 lines found

● Run targeted vitest tests
  $ cd '.opencode/skill/system-spec-kit/scripts' && npx vitest run tests/task-enrichment.vitest.ts
  tests/memory-render-fixture.vitest.ts --reporter=verbose
  └ 3 lines...

● Grep
"ALIGNMENT_BLOCK|POST_ENRICHMENT_ALIGNMENT_BLOCK|QUALITY_GATE_ABORT|CONTAMINATION_GATE_ABORT|rolled
back|duplicate" (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/tests)
  └ 19 lines found

● Read .opencode/skill/system-spec-kit/package.json lines 18-26
  └ 9 lines read

● Run available targeted vitest
  $ cd '.opencode/skill/system-spec-kit' && node mcp_server/node_modules/vitest/vitest.mjs run
  scripts/tests/task-enrichment.vitest.ts scripts/tests/memory-render-fixture.vitest.ts --config
  mcp_server/vitest.config.ts --reporter=verbose
  └ 8 lines...

● Grep "normalizeMemoryNameCandidate|truncateSlugAtWordBoundary|ensureUniqueMemoryFilename|deduplica
teObservations|buildTechnicalContextObservation|filterContamination"
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/scripts/tests)
  └ 5 lines found

● Run workflow-related vitest
  $ cd '.opencode/skill/system-spec-kit' && node mcp_server/node_modules/vitest/vitest.mjs run
  tests/task-enrichment.vitest.ts tests/memory-render-fixture.vitest.ts --root scripts --config
  mcp_server/vitest.config.ts --reporter=verbose
  └ 21 lines...

✗ Run exact vitest command
  $ cd '.opencode/skill/system-spec-kit' && node mcp_server/node_modules/vitest/vitest.mjs run
  tests/task-enrichment.vitest.ts tests/memory-render-fixture.vitest.ts --root scripts --config
  ../mcp_server/vitest.config.ts --reporter=verbose
  Permission denied and could not request permission from user

● Run packaged task enrichment test
  $ cd '.opencode/skill/system-spec-kit' && npm run test:task-enrichment -- --reporter=verbose
  └ 84 lines...

✗ Run memory render fixture test
  $ cd '.opencode/skill/system-spec-kit' && node mcp_server/node_modules/vitest/vitest.mjs run
  tests/memory-render-fixture.vitest.ts --root scripts --config ../mcp_server/vitest.config.ts
  --reporter=verbose
  Permission denied and could not request permission from user

● Read .opencode/skill/system-spec-kit/scripts/tests/test-scripts-modules.js lines 600-680
  └ 81 lines read

✗ Run targeted JS regression tests
  $ cd '.opencode/skill/system-spec-kit' && node scripts/tests/test-memory-quality-lane.js && node
  scripts/tests/test-extractors-loaders.js >/tmp/speckit-extractors.log 2>&1 && tail -n 20
  /tmp/speckit-extractors.log
  Permission denied and could not request permission from user

● Todo started: summarize-findings

● Todo completed: analyze-coverage, summarize-findings

### FINDING-01: Session-bound prompt filtering is not actually verified
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts:186-219,464-510`
- **Severity:** HIGH
- **Category:** SECURITY
- **Current Behavior:** `getRecentPrompts` and `captureConversation` contain logic to scope prompt history to the active session window, but existing tests only cover export presence and nonexistent-path fallbacks.
- **Expected Behavior:** Tests should prove that out-of-window prompts are excluded, invalid session bounds return an empty prompt set, and `captureConversation` never reintroduces unrelated global prompt history.
- **Root Cause:** Current coverage in `test-scripts-modules.js:1606-1684` and `test-extractors-loaders.js:991-1053` never exercises the session-bounding branches that prevent cross-session leakage.
- **Suggested Fix:** Add temp-JSONL tests with mixed in-range/out-of-range prompts plus an end-to-end `captureConversation` case asserting only active-session prompts survive.

### FINDING-02: `transformOpencodeCapture` contamination guards are mostly untested
- **File:** `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts:213-224,415-611`
- **Severity:** HIGH
- **Category:** SECURITY
- **Current Behavior:** The suite has one happy-path smoke test for `transformOpenCodeCapture`, but it does not verify spec-folder relevance filtering, snake_case normalization, invalid timestamp fallback, placeholder suppression, or the untested exported helper `buildTechnicalContextObservation`.
- **Expected Behavior:** Tests should confirm that irrelevant tool calls and exchanges are filtered out, `session_id/session_title/captured_at` normalize correctly, bad timestamps degrade safely, placeholder assistant text is ignored, and technical-context observations serialize predictably.
- **Root Cause:** `test-scripts-modules.js:334-346` only asserts `_source === 'opencode-capture'`, leaving the isolation and normalization branches unexercised.
- **Suggested Fix:** Add table-driven tests for `specFolderHint`, mixed relevant/irrelevant capture data, snake_case payloads, malformed timestamps, placeholder responses, and `buildTechnicalContextObservation`.

### FINDING-03: Atomic-write safety paths have almost no direct coverage
- **File:** `.opencode/skill/system-spec-kit/scripts/core/file-writer.ts:91-197`
- **Severity:** HIGH
- **Category:** SECURITY
- **Current Behavior:** `writeFilesAtomically` is only directly tested for leaked-placeholder rejection; traversal rejection, realpath boundary checks, duplicate-content skipping, overwrite backup/restore, rollback of prior writes, and cleanup branches are unverified.
- **Expected Behavior:** Tests should prove unsafe filenames fail, symlink escapes are blocked, duplicates are skipped idempotently, overwritten files restore from backup on failure, and partially written batches fully roll back.
- **Root Cause:** Coverage in `test-scripts-modules.js:1545-1574` is a single negative smoke test, while workflow tests mostly mock the writer instead of exercising its failure paths.
- **Suggested Fix:** Add temp-directory tests for `..`/absolute filenames, symlinked targets, partial-batch failures, duplicate hashes, overwrite recovery, and backup cleanup on success.

### FINDING-04: `runWorkflow` happy-path naming is covered, but its critical abort/degradation gates are not
- **File:** `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:553-1305`
- **Severity:** HIGH
- **Category:** QUALITY
- **Current Behavior:** Existing Vitest coverage validates naming, locking, and rendered output, but not the exported workflow’s alignment blocks, quality-gate aborts, contamination aborts, duplicate-skip/no-index behavior, indexing degradation, or tree-thinning application branches.
- **Expected Behavior:** Tests should explicitly assert the workflow aborts on cross-spec misalignment and failed contamination/quality rules, skips indexing for duplicate writes, and degrades cleanly when enrichment/indexing/retry processing fails.
- **Root Cause:** `task-enrichment.vitest.ts` and `memory-render-fixture.vitest.ts` focus on filename/title outcomes and mock many collaborators, leaving the highest-risk control-flow branches uncovered.
- **Suggested Fix:** Add focused `runWorkflow` tests that drive mocked loader/quality/indexer/file-writer dependencies through each abort and degraded-success path.

### FINDING-05: `collectSessionData` path-boundary protection lacks end-to-end tests
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:623-837`
- **Severity:** HIGH
- **Category:** SECURITY
- **Current Behavior:** Helper utilities are tested and one seam test checks quick-summary selection, but there is no test proving `collectSessionData` rejects `SPEC_FOLDER` values that escape the active specs root or correctly assembles the full returned payload under realistic inputs.
- **Expected Behavior:** Tests should verify that traversal inputs like `../../outside` are ignored/rejected, in-root spec folders resolve correctly, `detectRelatedDocs` failures degrade safely, and returned `SessionData` contains the expected spec/context fields.
- **Root Cause:** `test-scripts-modules.js:1493-1517` skips the full collector path, and `test-extractors-loaders.js:257-348` only exercises helper exports.
- **Suggested Fix:** Create temp spec-root fixtures and run `collectSessionData` with safe and unsafe `SPEC_FOLDER` values, then assert `SPEC_FILES`, progress metadata, and traversal-guard behavior.

### FINDING-06: Six exported continue-session helpers have no direct test coverage
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts:370-600`
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Current Behavior:** `buildContinueSessionData`, `determineSessionStatus`, `estimateCompletionPercent`, `extractPendingTasks`, `generateContextSummary`, and `generateResumeContext` are exported but have no direct references in the test suite.
- **Expected Behavior:** Each exported helper should have scenario tests for completed/blocked/in-progress states, zero-tool sessions, regex task extraction, summary truncation/suppression, and resume-context prioritization.
- **Root Cause:** Coverage stops at preflight/postflight helpers; the continuation API surface is exported but effectively unaudited.
- **Suggested Fix:** Add unit tests with compact fixtures covering blocker precedence, completion-keyword detection, task deduplication, P0 next-action insertion, recent-doc prioritization, and placeholder-summary suppression.

### FINDING-07: Config fallback logic is only smoke-tested
- **File:** `.opencode/skill/system-spec-kit/scripts/core/config.ts:81-179,186-345`
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Current Behavior:** Tests only check that `CONFIG` exists and exported directory helpers return arrays/nullable strings; malformed JSONC, invalid numeric fallback, learning-weight validation, timezone bounds, and realpath deduplication are untested.
- **Expected Behavior:** Tests should prove the config loader falls back safely on bad input and that `getAllExistingSpecsDirs` dedupes realpaths correctly even when `realpathSync` fails.
- **Root Cause:** `test-scripts-modules.js:114-156` and folder-detector integration tests are shape checks, not behavioral validation of the loader/validator.
- **Suggested Fix:** Add temp `config.jsonc` fixtures for malformed JSON, out-of-range fields, bad `learningWeights`, missing files, and duplicate-realpath directories.

### FINDING-08: Slug collision handling exports are missing direct tests
- **File:** `.opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts:60-74,128-185`
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Current Behavior:** Higher-level tests cover `isGenericContentTask`, `isContaminatedMemoryName`, `pickBestContentName`, and `generateContentSlug`, but there are no direct tests for `normalizeMemoryNameCandidate`, `truncateSlugAtWordBoundary`, or `ensureUniqueMemoryFilename`.
- **Expected Behavior:** Tests should verify quote/template stripping, trailing punctuation cleanup, word-boundary truncation, `-1/-2` collision suffixing, and random-suffix fallback after repeated collisions.
- **Root Cause:** Current coverage only hits these helpers indirectly through slug generation, so filesystem-collision behavior remains unverified.
- **Suggested Fix:** Add temp-directory tests that create colliding filenames and assert deterministic suffixing plus normalization edge cases.

### FINDING-09: Rich manual-decision normalization is under-tested
- **File:** `.opencode/skill/system-spec-kit/scripts/extractors/decision-extractor.ts:135-257,272-459`
- **Severity:** MEDIUM
- **Category:** QUALITY
- **Current Behavior:** Tests cover null input, simple manual decisions, lexical cues, and empty observations, but not object-shaped alternatives, pros/cons arrays, chosen-label overrides, anchor collisions, evidence/follow-up/caveat extraction, or confidence normalization nuances.
- **Expected Behavior:** Tests should validate rich manual decision objects end-to-end, including repeated titles, mixed string/object alternatives, `chosen/selected` fields, observation-file evidence, and fact-derived pros/cons/followups/caveats.
- **Root Cause:** Current coverage in `test-extractors-loaders.js:545-616`, `test-scripts-modules.js:1354-1384`, and `test-memory-quality-lane.js:77-99` stays on basic/manual happy paths.
- **Suggested Fix:** Add table-driven fixtures for structured decision objects, repeated titles, mixed fact payloads, and evidence/follow-up extraction branches.

### SUMMARY - Total: 9, Critical: 0, High: 5, Medium: 4, Low: 0


Total usage est:        1 Premium request
API time spent:         7m 28s
Total session time:     7m 55s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                 3.2m in, 21.8k out, 2.1m cached (Est. 1 Premium request)
