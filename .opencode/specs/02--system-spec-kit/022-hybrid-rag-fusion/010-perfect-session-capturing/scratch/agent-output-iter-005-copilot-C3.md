I’ll inspect the listed pipeline files first, then map each stage against CLI-specific branching to produce a full parity table and score.

✗ memory_match_triggers
  └ Permission denied and could not request permission from user

● skill(system-spec-kit)

I’ve loaded the required skill context; now I’m scanning the target files for CLI-specific branches and stage-level behavior to build the parity matrix.

● Search (grep)
  │ "opencode|claude|codex|gemini|copilot|provider|runtime|normalize|normalization|contamination|qua
  │ lity|template|render|write|index|capture|simulate" in
  │ {utils/source-capabilities.ts,extractors/opencode-capture.ts,loaders/data-loader.ts,extractors/c
  │ ontamination-filter.ts,core/quality-scorer.ts} (.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Read opencode-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts
  └ 1 line read

● Read data-loader.ts
  │ .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
  └ 1 line read

● Read source-capabilities.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts
  └ 82 lines read

● Read contamination-filter.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts
  └ 199 lines read

● Read quality-scorer.ts
  │ .opencode/skill/system-spec-kit/scripts/core/quality-scorer.ts
  └ 356 lines read

● Search (grep)
  │ "DataSource|source|opencode|claude|codex|copilot|gemini|simulation|capture|normalize|render|writ
  │ e|index|template|quality|contamination"
  │ (.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts)
  └ 28 lines found

● Search (grep)
  │ "DataSource|source|opencode|claude|codex|copilot|gemini|simulation|capture|normalize|render|writ
  │ e|index|template|quality|contamination"
  │ (.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts)
  └ 5 lines found

● Read data-loader.ts
  │ .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
  └ L261:520 (260 lines read)

● Read data-loader.ts
  │ .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
  └ L1:260 (259 lines read)

● Read data-loader.ts
  └ .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts

● Read data-loader.ts
  │ .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
  └ L521:780 (64 lines read)

● Search (grep)
  │ "function transformOpencodeCapture|function normalizeInputData|export\s+\{|type
  │ DataSource|CaptureDataSource|sourceCapabilities|toolTitleWithPathExpected"
  │ (.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts)
  └ 6 lines found

● Search (grep)
  │ "^async function|^function|export\s+\{|captureConversation|extract|normalize|toolCalls|responses
  │ |session|prompt|exchange|projectRoot|opencode"
  │ (.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts)
  └ 5 lines found

● Read opencode-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts
  └ L1:260 (260 lines read)

● Read opencode-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts
  └ L261:520 (260 lines read)

● Read opencode-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts
  └ L521:860 (340 lines read)

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ L1:120 (120 lines read)

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ L360:520 (161 lines read)

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ L780:980 (201 lines read)

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ L980:1160 (178 lines read)

● Search (glob)
  │ "**/*-capture.ts" in .opencode/skill/system-spec-kit/scripts/extractors
  └ 5 files found

● Search (grep)
  │ "capture.*Conversation|session|toolCalls|transformOpencodeCapture|title|filePath|path|metadata|_
  │ sourceSession|_source" in *-capture.ts (.opencode/skill/system-spec-kit/scripts/extractors)
  └ 5 files found

● Search (grep)
  │ "render|template|write|index|memory_save|memory_index_scan|save|generate-context|scoreMemoryQual
  │ ity|filterContamination" (.opencode/skill/system-spec-kit/scripts/core)
  └ 5 lines found

● Search (grep)
  │ "_source|captureSource|getSourceCapabilities|toolTitleWithPathExpected|prefersStructuredSave|inp
  │ utMode" (.opencode/skill/system-spec-kit/scripts)
  └ 5 lines found

I found concrete CLI-specific branching in loading/capture; next I’ll quickly inspect the other capture extractors and workflow wiring so the stage-by-stage table is evidence-backed.

● Read claude-code-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/claude-code-capture.ts
  └ L1:260 (260 lines read)

● Read codex-cli-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts
  └ L1:260 (260 lines read)

● Read copilot-cli-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/copilot-cli-capture.ts
  └ L1:260 (260 lines read)

● Read gemini-cli-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts
  └ L1:260 (260 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1:340 (339 lines read)

● Search (grep)
  │ "filterContamination\(|scoreMemoryQuality\(|render|writeFile|memory_save|memory_index_scan|index
  │ |template" (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 74 lines found

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1450:1565 (116 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L2066:2448 (383 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1810:2065 (256 lines read)

● Search (grep)
  │ "getSourceCapabilities\(|sourceCapabilities|captureSource|_source\b|inputMode|prefersStructuredS
  │ ave|toolTitleWithPathExpected" (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 7 lines found

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1188:1298 (111 lines read)

● Search (grep)
  │ "loadCollectedData\(|simulation|requiresSimulation|_isSimulation|isStatelessMode|determineValida
  │ tionDisposition" (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 12 lines found

✗ Search (grep)
  │ "export async function captureClaudeConversation|export async function
  │ captureCodexConversation|export async function captureCopilotConversation|export async function
  │ captureGeminiConversation|return \{|metadata: \{|toolCalls|_sourceSession|transcriptPath"
  │ (.opencode/skill/system-spec-kit/scripts/extractors/{claude-code-capture.ts,codex-cli-capture.ts
  │ ,copilot-cli-capture.ts,gemini-cli-capture.ts})
  └ rg: /Users/michelkerkmeester/MEGA/Development/Opencode
    Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/{claude-code-capture.ts,codex-cli-
    capture.ts,copilot-cli-capture.ts,gemini-cli-capture.ts}: IO error for operation on
    /Users/michelkerkmeester/MEGA/Development/Opencode
    Env/Public/.opencode/skill/system-spec-kit/scripts/extractors/{claude-code-capture.ts,codex-cli-
    capture.ts,copilot-cli-capture.ts,gemini-cli-capture.ts}: No such file or directory (os error 2)

● Search (grep)
  │ "export async function captureClaudeConversation|return \{|sessionTitle|sessionId|capturedAt|too
  │ lCalls|metadata:|title:|filePath|_sourceSession|transcriptPath"
  │ (.opencode/skill/system-spec-kit/scripts/extractors/claude-code-capture.ts)
  └ 66 lines found

● Search (grep)
  │ "export async function captureCopilotConversation|return \{|sessionTitle|sessionId|capturedAt|to
  │ olCalls|metadata:|title:|filePath|_sourceSession|transcriptPath"
  │ (.opencode/skill/system-spec-kit/scripts/extractors/copilot-cli-capture.ts)
  └ 32 lines found

● Search (grep)
  │ "export async function captureGeminiConversation|return \{|sessionTitle|sessionId|capturedAt|too
  │ lCalls|metadata:|title:|filePath|_sourceSession|transcriptPath"
  │ (.opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts)
  └ 21 lines found

● Search (grep)
  │ "export async function captureCodexConversation|return \{|sessionTitle|sessionId|capturedAt|tool
  │ Calls|metadata:|title:|filePath|_sourceSession|transcriptPath"
  │ (.opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts)
  └ 31 lines found

● Read claude-code-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/claude-code-capture.ts
  └ L520:735 (212 lines read)

● Read gemini-cli-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts
  └ L260:400 (135 lines read)

● Read copilot-cli-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/copilot-cli-capture.ts
  └ L200:420 (215 lines read)

● Read codex-cli-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts
  └ L300:475 (172 lines read)

● Read validate-memory-quality.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts
  └ L1:260 (259 lines read)

● Search (grep)
  │ "function determineValidationDisposition|captureSource|DataSource|stateless|opencode|claude|code
  │ x|copilot|gemini|write_skip_index|abort_write"
  │ (.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts)
  └ 11 lines found

● Read validate-memory-quality.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts
  └ L372:455 (84 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1350:1450 (101 lines read)

● Search (grep)
  │ "function runWorkflow|export async function runWorkflow|loadCollectedDataFromLoader\(|filterCont
  │ amination\(|populateTemplate\(|writeFilesAtomically\(|indexMemory\("
  │ (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 6 lines found

● Read collect-session-data.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts
  └ L1:260 (260 lines read)

● Search (grep)
  │ "SOURCE_TRANSCRIPT_PATH|SOURCE_SESSION_ID|SOURCE_SESSION_CREATED|SOURCE_SESSION_UPDATED|_sourceT
  │ ranscriptPath|_sourceSession"
  │ (.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts)
  └ 12 lines found

● Read collect-session-data.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts
  └ L740:830 (91 lines read)

● Read collect-session-data.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts
  └ L930:990 (60 lines read)

● Search (grep)
  │ "toolTitleWithPathExpected|getSourceCapabilities\(|sourceCapabilities"
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 24 lines found

● Read task-enrichment.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts
  └ L1:220 (49 lines read)

● Search (grep)
  │ "function shouldEnrichTaskFromSpecTitle|dataSource|source"
  │ (.opencode/skill/system-spec-kit/scripts/utils/task-enrichment.ts)
  └ 3 lines found

Here’s the synthesis from code-path review (not runtime-executed):

| Stage | Claude | Codex | Copilot | Gemini |
|---|---|---|---|---|
| Data Loading | DIVERGES | IDENTICAL | IDENTICAL | IDENTICAL |
| Capture | DIVERGES | DIVERGES | DIVERGES | DIVERGES |
| Normalization | IDENTICAL | IDENTICAL | IDENTICAL | IDENTICAL |
| Contamination Filter | DIVERGES | IDENTICAL | IDENTICAL | IDENTICAL |
| Extraction | IDENTICAL | IDENTICAL | IDENTICAL | IDENTICAL |
| Quality Scoring | DIVERGES | IDENTICAL | IDENTICAL | IDENTICAL |
| Template Rendering | IDENTICAL | IDENTICAL | IDENTICAL | IDENTICAL |
| File Writing | IDENTICAL | IDENTICAL | IDENTICAL | IDENTICAL |
| Indexing | IDENTICAL | IDENTICAL | IDENTICAL | IDENTICAL |

Divergences are mostly **intentional** (CLI-specific capture adapters, Claude-specific tool-title/path contamination handling, Claude session hints).  
No clearly confirmed accidental divergence in these files; biggest risk area is metadata richness consistency across adapters.

**Biggest parity gap:** Capture stage.  
**Overall parity score:** **~81%** (29/36 cells IDENTICAL).


Total usage est:        1 Premium request
API time spent:         9m 13s
Total session time:     9m 38s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.3-codex            2.0m in, 22.2k out, 1.8m cached (Est. 1 Premium request)
