● skill(system-spec-kit)

I’ll inspect the pipeline/capture files plus the existing spec docs, then synthesize a minimal per-CLI live-proof protocol with concrete commands, validations, artifact schema, and build effort.

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ 1 line read

● Read data-loader.ts
  │ .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
  └ 1 line read

● Read generate-context.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts
  └ 1 line read

● Read opencode-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts
  └ 1 line read

● List directory .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capt…
  └ 6 files found

● List directory .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capt…
  └ 1 file found

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/020-live
  │ -proof-and-parity-hardening/spec.md
  └ 119 lines read

● Read plan.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/020-live
  │ -proof-and-parity-hardening/plan.md
  └ 110 lines read

● Read tasks.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/020-live
  │ -proof-and-parity-hardening/tasks.md
  └ 70 lines read

● Read implementation-summary.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/020-live
  │ -proof-and-parity-hardening/implementation-summary.md
  └ 78 lines read

● Search (grep)
  │ "(cli|opencode|claude|codex|gemini|stdin|json|source|quality|timestamp|index|save|memory|proof)"
  │ (.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts)
  └ 53 lines found

● Search (grep)
  │ "(runWorkflow|cli|capture|extract|parallel|source|quality|timestamp|index|proof|parity|save|gene
  │ rate-context)" (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 5 lines found

● Search (grep)
  │ "(opencode|claude|codex|gemini|stdin|--json|source|quality|timestamp|index|capture|session|proof
  │ |parity)" (.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts)
  └ 5 lines found

● Search (grep)
  │ "(opencode|claude|codex|gemini|copilot|stdin|--json|source|quality|timestamp|index|capture|sessi
  │ on|proof|parity)" (.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts)
  └ 5 lines found

● Search (grep)
  │ "(type .*Cli|CLI|supported|loadCollectedData|collect|structured|_source|sourceCapabilities|stdin
  │ |json|simulation|simulate|session data|save mode)"
  │ (.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts)
  └ 59 lines found

● Search (grep)
  │ "(supported CLIs|opencode|claude|codex|copilot|gemini|--stdin|--json|_source|timestamp|quality|i
  │ ndex|sourceCapabilities|structured)"
  │ (.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts)
  └ 30 lines found

● Search (grep)
  │ "(runWorkflow|workflow|extractor|parallel|Promise\.all|loadCollectedData|sourceCapabilities|_sou
  │ rce|validate|quality|index|timestamp|evidence|proof)"
  │ (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 5 lines found

● Search (glob)
  │ "**/*" in .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturin
  │ g/020-live-proof-and-parity-hardening
  └ 6 files found

● Search (grep)
  │ "(export function|function .*capture|opencode|claude|codex|gemini|copilot|stdin|json|session|ext
  │ ract|source|capabil|structured)"
  │ (.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts)
  └ 5 lines found

● Search (grep)
  │ "function detectActiveCli|async function
  │ captureCurrentSession|captureCurrentSession\(|captureCodexSession|captureCopilotSession|captureG
  │ eminiSession|captureOpenCodeSession|captureClaudeSession"
  │ (.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts)
  └ No matches found

● Search (grep)
  │ "async function runWorkflow|function runWorkflow|runWorkflow\("
  │ (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 2 lines found

● Search (grep)
  │ "NO_DATA_AVAILABLE|attemptCapture|loadCollectedData|DataSource|_source|preferStructured|--stdin|
  │ --json" (.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts)
  └ 20 lines found

● Search (grep)
  │ "parseArguments|parseStructuredModeArguments|timestamp|sourceCapabilities|_source|--stdin|--json
  │ |Usage" (.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts)
  └ 22 lines found

● Search (grep)
  │ "M-007|live proof|retained artifact|parity|proof boundary|CLI" in **/*.md
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing)
  └ 5 lines found

● Read data-loader.ts
  │ .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
  └ L220:360 (141 lines read)

● Read opencode-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts
  └ L260:620 (361 lines read)

● Read data-loader.ts
  │ .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
  └ L360:590 (225 lines read)

● Read generate-context.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts
  └ L40:180 (141 lines read)

● Read opencode-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts
  └ L1:260 (260 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1340:1710 (371 lines read)

● Read generate-context.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts
  └ L324:460 (137 lines read)

● Search (grep)
  │ "live-cli-proof|M-007|manual proof|retained artifact|parity hardening|proof
  │ protocol|sourceCapabilities" in **/*.{md,json}
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing)
  └ 5 lines found

Quick update: I’ve confirmed the actual capture/save entry points and fallback order. Next I’ll pull the quality/index/timestamp contract surfaces and any prior live-proof artifact format so the proposed protocol is anchored to current code reality.

● Search (grep)
  │ "quality|index|timestamp|source|SOURCE_|captured_at|capturedAt|memory|markdown|write"
  │ (.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts)
  └ 12 lines found

● Search (grep)
  │ "M-007|live proof|parity|retained|artifact|protocol|proof"
  │ (.opencode/skill/system-spec-kit/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md)
  └ 43 lines found

● Search (grep)
  │ "quality|score|qualityScore|index|indexed|memory_save|memory_index_scan|timestamp|captured_at|ca
  │ pturedAt|SOURCE_|_source|sourceCapabilities|writeFile|memory file|output file"
  │ (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 5 lines found

● Search (glob)
  │ "**/*live-cli-proof*.json" in
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing
  └ 1 file found

● Search (glob)
  │ "**/research/**/*" in
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing
  └ 5 files found

● Search (grep)
  │ "sourceCapabilities|getSourceCapabilities|capture source|supported|structured|stdin|json|native"
  │ in **/*.{ts,js} (.opencode/skill/system-spec-kit/scripts)
  └ 5 lines found

● Read 007-session-capturing-pipeline-quality.md
  │ .opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/007-session-capt
  │ uring-pipeline-quality.md
  └ 161 lines read

● Read live-cli-proof-2026-03-17.json
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research
  │ /live-cli-proof-2026-03-17.json
  └ 72 lines read

● Search (grep)
  │ "qualityScore|quality score|calculateQuality|score|insufficient|INSUFFICIENT|index|indexing|SOUR
  │ CE_|capturedAt|_source|return \{|WorkflowResult"
  │ (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 5 lines found

● Search (grep)
  │ "export interface WorkflowResult|interface
  │ WorkflowResult|qualityScore|timestamp|source|filePath|memoryPath|specFolder"
  │ (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 5 lines found

● Search (grep)
  │ "getSourceCapabilities|sourceCapabilities|capture
  │ source|supportsStructured|preferredStructured|structured" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 5 lines found

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ L1:260 (260 lines read)

● Search (grep)
  │ "export function getSourceCapabilities|getSourceCapabilities\(|sourceCapabilities|supportsStruct
  │ ured|preferredInput|nativeCapture|fallbackOrder|capture source"
  │ (.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts)
  └ No matches found

● Search (grep)
  │ "export interface WorkflowResult|interface
  │ WorkflowResult|qualityValidation|indexingResult|memoryId|qualityScore|INSUFFICIENT_CONTEXT_ABORT
  │ |QUALITY_GATE_ABORT|QUALITY_GATE_WARN|skipped_duplicate|SOURCE_|capturedAt|captureCapabilities"
  │ (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 50 lines found

● Search (grep)
  │ "sourceCapabilities|preferred save path|Direct CLI target rule|structured JSON|--stdin|--json"
  │ (.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts)
  └ 14 lines found

● Search (grep)
  │ "live-cli-proof-2026-03-17|clients|proofCriteria|attemptedActionRequired|capturedAt|source"
  │ (.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/researc
  │ h/live-cli-proof-2026-03-17.json)
  └ 16 lines found

● Search (grep)
  │ "indexing|memory_save|memory_index_scan|id|skipped_duplicate|qualityValidation|validation" in
  │ **/*.{ts,js} (.opencode/skill/system-spec-kit/scripts/core)
  └ 5 lines found

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ L1120:1260 (38 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L90:190 (101 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L2180:2265 (85 lines read)

● Read data-loader.ts
  │ .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
  └ L1:120 (120 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L2338:2475 (138 lines read)

● Search (grep)
  │ "function getSourceCapabilities|export function getSourceCapabilities|interface
  │ SourceCapabilities|type SourceCapabilities"
  │ (.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts)
  └ No matches found

● Search (grep)
  │ "getSourceCapabilities|SourceCapabilities|inputMode|native_capture|structured_json|structured"
  │ (.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts)
  └ 12 lines found

● Search (grep)
  │ "function getSourceCapabilities|export function getSourceCapabilities|const
  │ getSourceCapabilities|interface SourceCapabilities" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 2 lines found

● Search (grep)
  │ "qualityValidation|indexingStatus|memoryId|skipped_duplicate|indexed|failed_embedding|skipped_qu
  │ ality_gate|skipped_index_policy" in **/*.{ts,js,md} (.opencode/skill/system-spec-kit/scripts)
  └ 106 lines found

● Search (grep)
  │ "SOURCE_SESSION_ID|SOURCE_TRANSCRIPT_PATH|SOURCE_CAPTURED_AT|SOURCE_CAPTURE|SOURCE_" in
  │ **/*.{ts,md} (.opencode/skill/system-spec-kit/scripts)
  └ 52 lines found

● Read source-capabilities.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts
  └ 82 lines read

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L2040:2098 (59 lines read)

● Read memory-indexer.ts
  │ .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts
  └ L150:210 (55 lines read)

● Read memory-indexer.ts
  │ .opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts
  └ L1:120 (120 lines read)

● Read collect-session-data.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts
  └ L940:985 (46 lines read)

✗ Read sufficiency.ts
  │ .opencode/skill/system-spec-kit/scripts/core/sufficiency.ts
  └ Path does not exist

● Read config.ts
  │ .opencode/skill/system-spec-kit/scripts/core/config.ts
  └ L1:140 (140 lines read)

● Search (grep)
  │ "QUALITY_ABORT_THRESHOLD|qualityAbortThreshold|INSUFFICIENT_CONTEXT_ABORT|formatSufficiencyAbort
  │ |sufficiency" in **/*.{ts,js} (.opencode/skill/system-spec-kit/scripts/core)
  └ 42 lines found

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1128:1168 (41 lines read)

● Search (grep)
  │ "M-007e|M-007f|M-007g|M-007h|M-007i|M-007m|M-007n|--stdin|--json|OpenCode precedence|fallback"
  │ (.opencode/skill/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/007-session-cap
  │ turing-pipeline-quality.md)
  └ 21 lines found

● Search (grep)
  │ "Direct CLI target rule|Preferred save path|preferred native capture
  │ override|SYSTEM_SPEC_KIT_CAPTURE_SOURCE"
  │ (.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts)
  └ 3 lines found

● Read generate-context.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts
  └ L540:640 (72 lines read)

● Read generate-context.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts
  └ L460:540 (81 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L2068:2145 (78 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L2100:2185 (86 lines read)

Great target. Based on current code, an MVP protocol is:

1) **Per-CLI minimal automated test**

- **Native path (all CLIs):**  
`SYSTEM_SPEC_KIT_CAPTURE_SOURCE=<opencode|claude|codex|copilot|gemini> node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js 009-perfect-session-capturing`  
Validate: expected source selected, save completed, gates honored, indexing status recorded.

- **Structured path (contract path):**  
`--stdin` and `--json` with rich payload + explicit target override checks.

2) **Proof artifact schema (required)**  
`runId, capturedOn, cli, mode(native|stdin|json), command, expectedSource, observedSource, specTarget, sessionId, capturedAt, qualityScore100, qualityScore01, indexingStatus, memoryId, pass, errorCode, errorMessage, evidencePaths(stdout, metadata, context)`.

3) **Contract checks**  
- Source/fallback order contract.  
- `INSUFFICIENT_CONTEXT_ABORT`, `QUALITY_GATE_ABORT/WARN` behavior.  
- `indexingStatus` in `{indexed, skipped_duplicate, skipped_index_policy, skipped_quality_gate, skipped_embedding_unavailable, failed_embedding}`.  
- Provenance timestamps and session metadata present.

4) **Script structure**  
`prove-cli-parity.sh` orchestrates matrix → `run-proof-case.ts` executes case + parses `WorkflowResult/metadata.json` → writes `research/live-cli-proof-<date>.json`.

5) **Effort**  
~1.5–2.5 days (harness + parser + matrix + assertions + docs/CI).

**Anchors:** fallback order (`data-loader.ts:231-237`), structured modes (`generate-context.ts:62-63,356-378`), quality/index contract (`workflow.ts:112-139,2207-2248,2348-2466`), source capabilities (`source-capabilities.ts:13-49`), existing artifact pattern (`live-cli-proof-2026-03-17.json:1-72`).


Total usage est:        1 Premium request
API time spent:         5m 47s
Total session time:     6m 9s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.3-codex            1.5m in, 14.8k out, 1.4m cached (Est. 1 Premium request)
