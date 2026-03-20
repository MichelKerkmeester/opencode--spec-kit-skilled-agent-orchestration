● skill(sk-code--review)

I’m loading the review standards and the target files together so I can answer with evidence instead of guesses. After that I’ll synthesize the failure paths, type boundaries, and any data-loss risks.

● skill(sk-code--opencode)

I’ve got the target review lenses loaded. Next I’m pulling the collector, workflow entry/exit, and type definitions together with a few focused searches for fallback and validation paths so the findings are grounded in exact code paths.

● Read collect-session-data.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts
  └ 1 line read

● Search (grep)
  │ "MAX_OBSERVATIONS|fallback|simulate|validation|index|CollectedDataFull|SessionData|opencode|clau
  │ de|codex|copilot|gemini|capture" in
  │ {extractors/collect-session-data.ts,core/workflow.ts,types/session-types.ts}
  │ (.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Read quick_reference.md
  │ .agents/skills/sk-code--review/references/quick_reference.md
  └ 151 lines read

● Read session-types.ts
  │ .opencode/skill/system-spec-kit/scripts/types/session-types.ts
  └ 534 lines read

● Read code_quality_checklist.md
  │ .agents/skills/sk-code--review/references/code_quality_checklist.md
  └ 162 lines read

● Read security_checklist.md
  │ .agents/skills/sk-code--review/references/security_checklist.md
  └ 206 lines read

● Read quick_reference.md
  │ .agents/skills/sk-code--opencode/references/typescript/quick_reference.md
  └ 539 lines read

● Read universal_patterns.md
  │ .agents/skills/sk-code--opencode/references/shared/universal_patterns.md
  └ 571 lines read

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1:500 (500 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1983:end (439 lines read)

● memory_context
  └ {"summary":"Context retrieved via focused mode (focused strategy) [truncated ...

● Run skill advisor (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Analyze session data collection and workflow
  │ integration for capture-source consistency, fallback chains, type hierarchy, data loss risks,
  │ validation, and observation limits in collect-session-data.ts workflow.ts and session-types.ts"
  │ --threshold 0.8
  └ 11 lines...

● Create session plan file (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/0d803112-7352-4cd5-b06c-35accd102556/plan.md'
  │ <<'EOF'
  │ 1. Read review guidance and target files.
  │ 2. Trace capture-source handling and fallback paths.…
  └ 5 lines...

I’ve confirmed the review overlay and type context. I’m now tracing the collector’s source-specific branches and the workflow’s gatekeeping paths so the final output can call out exact breakpoints, not just architecture impressions.

● skill(mcp-code-mode)

I’ve moved from the high-level workflow into the collector internals. I’m pulling the exact source-selection and fallback code now, because that’s where consistency and data-loss issues will show up.

● Read collect-session-data.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts
  └ L1:260 (260 lines read)

● Read collect-session-data.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts
  └ L261:520 (260 lines read)

● Read collect-session-data.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts
  └ L521:780 (260 lines read)

● Read collect-session-data.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts
  └ L781:1050 (229 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L500:900 (401 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1300:1700 (401 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L900:1300 (401 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1700:1982 (283 lines read)

● Search (grep)
  │ "collectSessionData\(|captureSource|getSourceCapabilities|determineValidationDisposition|validat
  │ eMemoryQualityContent|evaluateMemorySufficiency|QUALITY_ABORT_THRESHOLD|indexMemory|loadCollecte
  │ dDataFromLoader|_isSimulation|stateless|simulation"
  │ (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 32 lines found

● Search (grep)
  │ "MAX_OBSERVATIONS|collectSessionData\(|captureSource|capture source|getSourceCapabilities|loadCo
  │ llectedData|_isSimulation|fallback|simulation|opencode|claude|codex|copilot|gemini"
  │ (.opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts)
  └ 8 lines found

● Search (grep)
  │ "interface CollectedDataBase|interface SessionData|type CollectedDataSubset|interface
  │ Observation|interface ObservationDetailed|interface SessionMetadata|interface GitMetadata"
  │ (.opencode/skill/system-spec-kit/scripts/types/session-types.ts)
  └ 7 lines found

The collector itself mostly treats input as already-normalized; source-specific behavior seems to sit one layer earlier. I’m checking the loader and capability map now so I can separate “collector consistency” from “upstream normalization quality.”

● Read data-loader.ts
  │ .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
  └ L1:320 (320 lines read)

● Read source-capabilities.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts
  └ 83 lines read

● Read data-loader.ts
  │ .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
  └ L321:520 (200 lines read)

● Search (glob)
  │ "**/*{opencode,claude,codex,copilot,gemini}*.{ts,js}" in .opencode/skill/system-spec-kit/scripts
  └ 10 files found

● Search (glob)
  │ "**/*{opencode,claude,codex,copilot,gemini}*capture*.{ts,js}" in
  │ .opencode/skill/system-spec-kit/scripts
  └ 10 files found

● Search (grep)
  │ "_source\s*=|_source:|'opencode'|'claude'|'claude-code'|'codex'|'codex-cli'|'copilot'|'copilot-c
  │ li'|'gemini'|'gemini-cli'|capture source|normalized" (.opencode/skill/system-spec-kit/scripts)
  └ 5 lines found

I found the key split: all five native captures are funneled through one loader/normalizer path before the collector sees them. I’m finishing that path now to judge whether failures degrade cleanly or just silently fall back to simulation.

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ L1:360 (360 lines read)

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ L361:760 (400 lines read)

● Read opencode-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts
  └ L1:240 (240 lines read)

● Read copilot-cli-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/copilot-cli-capture.ts
  └ L1:200 (200 lines read)

● Read data-loader.ts
  │ .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
  └ L520:760 (65 lines read)

● Read codex-cli-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts
  └ L1:200 (200 lines read)

● Read claude-code-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/claude-code-capture.ts
  └ L1:220 (220 lines read)

● Read gemini-cli-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts
  └ L1:200 (200 lines read)

The loader does have a real fallback chain: explicit JSON → preferred/native capture order → hard failure. I’m checking the shared `transformOpencodeCapture()` path now, because that determines whether the five sources actually become equivalent before extraction.

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ L760:1120 (360 lines read)

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ L1121:1460 (98 lines read)

● Search (grep)
  │ "function transformOpencodeCapture|toolTitleWithPathExpected|_relevanceFallback|files\?|recentCo
  │ ntext|buildToolObservationTitle|sanitizeTool"
  │ (.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts)
  └ 22 lines found

● Search (grep)
  │ "toolTitleWithPathExpected|prefersStructuredSave|SOURCE_CAPABILITIES|getSourceCapabilities"
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 44 lines found

I’ve got enough to separate three layers now: capture adapters, shared normalization, and workflow gating. I’m doing one last pass on `extractFilesFromData`, validation disposition, and the configured observation cap so the findings can be precise about where data is dropped versus merely filtered.

● Read file-extractor.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts
  └ L1:360 (360 lines read)

● Read validate-memory-quality.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts
  └ L360:470 (110 lines read)

● Read file-extractor.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/file-extractor.ts
  └ L361:760 (87 lines read)

● Read config.ts
  │ .opencode/skill/system-spec-kit/scripts/core/config.ts
  └ L1:220 (220 lines read)

● Search (grep)
  │ "MAX_OBSERVATIONS|MESSAGE_COUNT_TRIGGER|QUALITY_ABORT_THRESHOLD"
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 25 lines found

I found the hard cap: `MAX_OBSERVATIONS` is configured in shared config and explicitly tested. I’m reading the default value and a couple of nearby limits so I can assess whether the cap is a deliberate summary strategy or an under-sized bottleneck.

● Read config.ts
  │ .opencode/skill/system-spec-kit/scripts/core/config.ts
  └ L220:320 (101 lines read)

● Read validation-rule-metadata.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts
  └ L1:120 (73 lines read)

● Read runtime-memory-inputs.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts
  └ L830:920 (91 lines read)

One important correction: the code no longer defaults to a 3-observation cap. The shipped default is `15`, and there’s even an inline note saying it was raised from 3 because of severe data loss. I’m checking whether repo config overrides that default, then I’ll synthesize the findings.

● Search (grep)
  │ "maxObservations|qualityAbortThreshold|maxFilesInMemory"
  │ (.opencode/skill/system-spec-kit/config)
  └ No matches found

● Search (glob)
  │ "**/config.jsonc" in .opencode/skill/system-spec-kit
  └ 1 file found

● Read config.jsonc
  │ .opencode/skill/system-spec-kit/config/config.jsonc
  └ 158 lines read

## Findings

**SESSION-001 — P2 — Capture-source handling is mostly consistent after normalization, not perfectly symmetric.** All five native sources are funneled through the same loader path and end up in `transformOpencodeCapture()`, so the collector/workflow mostly sees one canonical shape. The notable asymmetry is source capabilities: only Claude is flagged as expecting “tool title with path,” which changes downstream contamination/validation behavior. Evidence: `data-loader.ts:323-478`, `input-normalizer.ts:867-1202`, `source-capabilities.ts:14-57`, `validation-rule-metadata.vitest.ts:66-72`.

**SESSION-002 — P1 — Capture failure fallback is explicit and robust, but it ends in hard failure, not simulation.** The real chain is: explicit JSON file -> preferred/native capture order -> `NO_DATA_AVAILABLE`. `collectSessionData()` still has a simulation branch, but `runWorkflow()` now throws before that branch is reached in the normal path, so simulation is effectively a defensive leftover unless callers bypass the loader. Evidence: `data-loader.ts:489-525`, `data-loader.ts:557-574`, `workflow.ts:1411-1426`, `collect-session-data.ts:721-728`.

**SESSION-003 — P1 — The pipeline still has several intentional data-loss points.** Native capture is capped at 20 exchanges per source attempt; observations are capped at 15; files are capped at 10; outcomes are capped at 10; tool-result previews are truncated to 160 chars. Some of this is logged, but not all of it is surfaced as a user-visible warning. Evidence: `data-loader.ts:341`, `369`, `402`, `431`, `460`; `config.ts:223-240`; `collect-session-data.ts:739-753`, `798-803`; `file-extractor.ts:255-260`; `input-normalizer.ts:1087-1090`.

**SESSION-004 — P1 — Validation between collection and indexing is strong at the rendered-memory stage, but weak at native-capture ingress.** File/JSON input gets `validateInputData()` and `normalizeInputData()`. Native capture paths skip that schema validation entirely and are accepted if they have “usable” content, so malformed-but-nonempty transformed data can reach extraction/rendering. Indexing is then heavily gated by template-contract validation, sufficiency, quality threshold, and source-aware rule disposition, so bad content is unlikely to index unless it renders plausibly. Evidence: `data-loader.ts:517-525`, `557-566`; `workflow.ts:2122-2253`, `2381-2417`; `validate-memory-quality.ts:390-446`.

**SESSION-005 — P2 — The type hierarchy is serviceable, but over-complicated.** The boundary between ingest (`CollectedDataBase`) and render DTO (`SessionData`) is reasonable, but `CollectedDataFull` adds no structure, `CollectedDataBase` mixes canonical and legacy fields plus `[key: string]: unknown`, and file entries accept both `FILE_PATH`/`path` and `DESCRIPTION`/`description`. That flexibility helps adapters, but weakens type safety and makes invariants hard to reason about. Evidence: `session-types.ts:25-37`, `124-152`, `442-534`; `collect-session-data.ts:118-119`.

**SESSION-006 — P3 — The “3-observation limit” is outdated; current default is 15.** The code comment explicitly says it was raised from 3 to 15 because the older cap caused severe loss. That said, even 15 can still drop important research/decision history in long mixed sessions because truncation only prioritizes `followup` observations before slicing. Evidence: `config.ts:223-240`; `collect-session-data.ts:740-753`; stale test comments still mention 3 at `runtime-memory-inputs.vitest.ts:838-841`, `908-910`.


Total usage est:        1 Premium request
API time spent:         3m 47s
Total session time:     4m 9s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.5m in, 12.2k out, 1.4m cached (Est. 1 Premium request)
