● Read opencode-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts
  └ 1 line read

● Read source-capabilities.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts
  └ 82 lines read

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ 1 line read

● Read contamination-filter.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts
  └ 199 lines read

● List directory .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capt…
  └ 9 files found

● Search (glob)
  │ "**/test*/**/*parity*" in .opencode/skill/system-spec-kit
  └ 1 file found

● Search (glob)
  │ "**/test*/**/*cross-cli*" in .opencode/skill/system-spec-kit
  └ No matches found

● Search (glob)
  │ "**/test*/**/*multi-cli*" in .opencode/skill/system-spec-kit
  └ No matches found

I’ve located the key files and one explicit parity test file. Next I’ll map each CLI-specific branch in code and then validate it against Phase-016 docs/tests.

● Read opencode-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts
  └ L1:260 (260 lines read)

● Search (grep)
  │ "claude|codex|copilot|gemini|sourceCapabilities|captureSource|toolTitleWithPathExpected|opencode
  │ -capture|DataSource" (.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts)
  └ No matches found

● Search (grep)
  │ "claude|codex|copilot|gemini|sourceCapabilities|getSourceCapabilities|DataSource|normalize|captu
  │ re" (.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts)
  └ 67 lines found

● Read opencode-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts
  └ L261:520 (260 lines read)

● Read opencode-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts
  └ L521:860 (340 lines read)

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ L1:260 (260 lines read)

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ L261:560 (300 lines read)

● Read spec.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/016-mult
  │ i-cli-parity/spec.md
  └ 173 lines read

● Read tasks.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/016-mult
  │ i-cli-parity/tasks.md
  └ 92 lines read

● Read implementation-summary.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/016-mult
  │ i-cli-parity/implementation-summary.md
  └ 124 lines read

● Read content-filter-parity.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/content-filter-parity.vitest.ts
  └ 36 lines read

● Search (grep)
  │ "claude-code-capture|codex-cli-capture|copilot-cli-capture|gemini-cli-capture|multi-cli|parity|c
  │ ross-CLI|cross cli|source-capabilities" (.opencode/skill/system-spec-kit/scripts/tests)
  └ 76 lines found

● Search (grep)
  │ "claude-code-capture|codex-cli-capture|copilot-cli-capture|gemini-cli-capture|opencode-capture"
  │ in **/*.ts (.opencode/skill/system-spec-kit/scripts)
  └ 5 lines found

● Search (grep)
  │ "toolTitleWithPathExpected|getSourceCapabilities|sourceCapabilities|captureSource" in **/*.ts
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 35 lines found

● Read contamination-filter.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts
  └ 126 lines read

● Read validation-rule-metadata.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts
  └ 73 lines read

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ L780:1160 (370 lines read)

● Read research.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/016-mult
  │ i-cli-parity/research.md
  └ 1 line read

● Search (grep)
  │ "describe\(|it\(" (.opencode/skill/system-spec-kit/scripts/tests/claude-code-capture.vitest.ts)
  └ 1 file found

● Search (grep)
  │ "describe\(|it\(" (.opencode/skill/system-spec-kit/scripts/tests/codex-cli-capture.vitest.ts)
  └ 1 file found

● Search (grep)
  │ "describe\(|it\(" (.opencode/skill/system-spec-kit/scripts/tests/copilot-cli-capture.vitest.ts)
  └ 1 file found

● Search (grep)
  │ "describe\(|it\(" (.opencode/skill/system-spec-kit/scripts/tests/gemini-cli-capture.vitest.ts)
  └ 1 file found

● Search (grep)
  │ "describe\(|it\("
  │ (.opencode/skill/system-spec-kit/scripts/tests/content-filter-parity.vitest.ts)
  └ 1 file found

● Search (grep)
  │ "describe\(|it\("
  │ (.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts)
  └ 1 file found

● Search (grep)
  │ "describe\(|it\(" (.opencode/skill/system-spec-kit/scripts/tests/phase-classification.vitest.ts)
  └ 1 file found

I’ve confirmed the capability layer and contamination exception. I’ll now pinpoint remaining hardcoded CLI branches (if any) and compute per-CLI test coverage counts from the capture/parity suites.

● Search (grep)
  │ "\b(?:source|captureSource|_source)\b\s*(?:===|==|!==|!=)\s*['"](?:claude-code-capture|codex-cli
  │ -capture|copilot-cli-capture|gemini-cli-capture|opencode-capture)['"]" in **/*.ts
  │ (.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Search (grep)
  │ "claude-code-capture|codex-cli-capture|copilot-cli-capture|gemini-cli-capture"
  │ (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ No matches found

● Search (grep)
  │ "function buildToolObservationTitle|const TOOL_TITLE|view|read|edit|write|glob|grep|bash"
  │ (.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts)
  └ 19 lines found

● Read claude-code-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/claude-code-capture.ts
  └ 1 line read

● Read codex-cli-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts
  └ 471 lines read

● Read copilot-cli-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/copilot-cli-capture.ts
  └ 414 lines read

● Read gemini-cli-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts
  └ 394 lines read

✗ Count tests per target file (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/scripts/tests' && for f in
  │ claude-code-capture.vitest.ts codex-cli-capture.vitest.ts copilot-cli-capture.vitest.ts
  │ gemini-cli-capture.vitest.ts content-filter-parity.vitest.ts runtime-memory-inputs.vitest.ts
  │ phase-classification.vitest.ts contamination-filter.vitest.ts …
  └ Permission denied and could not request permission from user

● Read claude-code-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/claude-code-capture.ts
  └ L1:280 (280 lines read)

● Read claude-code-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/claude-code-capture.ts
  └ L281:620 (340 lines read)

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ L620:720 (100 lines read)

● Read research.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/016-mult
  │ i-cli-parity/research.md
  └ L1:260 (259 lines read)

● Read research.md
  │ .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/010-perfect-session-capturing/016-mult
  │ i-cli-parity/research.md
  └ L261:520 (176 lines read)

● Search (grep)
  │ "^\s*(it|test)\(" in claude-code-capture.vitest.ts
  │ (.opencode/skill/system-spec-kit/scripts/tests)
  └ 1 file found

● Search (grep)
  │ "^\s*(it|test)\(" in codex-cli-capture.vitest.ts (.opencode/skill/system-spec-kit/scripts/tests)
  └ 1 file found

● Search (grep)
  │ "^\s*(it|test)\(" in copilot-cli-capture.vitest.ts
  │ (.opencode/skill/system-spec-kit/scripts/tests)
  └ 1 file found

● Search (grep)
  │ "^\s*(it|test)\(" in gemini-cli-capture.vitest.ts
  │ (.opencode/skill/system-spec-kit/scripts/tests)
  └ 1 file found

● Search (grep)
  │ "^\s*(it|test)\(" in runtime-memory-inputs.vitest.ts
  │ (.opencode/skill/system-spec-kit/scripts/tests)
  └ 1 file found

● Search (grep)
  │ "^\s*(it|test)\(" in phase-classification.vitest.ts
  │ (.opencode/skill/system-spec-kit/scripts/tests)
  └ 1 file found

● Search (grep)
  │ "^\s*(it|test)\(" in content-filter-parity.vitest.ts
  │ (.opencode/skill/system-spec-kit/scripts/tests)
  └ 1 file found

● Search (grep)
  │ "^\s*(it|test)\(" in contamination-filter.vitest.ts
  │ (.opencode/skill/system-spec-kit/scripts/tests)
  └ 1 file found

● Search (grep)
  │ "^\s*(it|test)\(" in validation-rule-metadata.vitest.ts
  │ (.opencode/skill/system-spec-kit/scripts/tests)
  └ 1 file found

● Read claude-code-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/claude-code-capture.ts
  └ L620:940 (112 lines read)

● Search (grep)
  │ "DEFAULT_NATIVE_CAPTURE_ORDER|NATIVE_CAPTURE_ENV_ALIASES|SYSTEM_SPEC_KIT_CAPTURE_SOURCE|captureC
  │ laudeConversation|captureCodexConversation|captureCopilotConversation|captureGeminiConversation|
  │ captureConversation" (.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts)
  └ 18 lines found

● Search (grep)
  │ "claude-code-capture|codex-cli-capture|copilot-cli-capture|gemini-cli-capture|opencode-capture"
  │ (.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts)
  └ 15 lines found

● Search (grep)
  │ "view|Read|Research|copilot|codex|gemini|claude"
  │ (.opencode/skill/system-spec-kit/scripts/tests/phase-classification.vitest.ts)
  └ 22 lines found

● Search (grep)
  │ "claude-code-capture|codex-cli-capture|copilot-cli-capture|gemini-cli-capture|tool title with
  │ path|captureSource"
  │ (.opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts)
  └ 9 lines found

● Search (grep)
  │ "^\s*(it|test)\(" in opencode-capture.vitest.ts (.opencode/skill/system-spec-kit/scripts/tests)
  └ 1 file found

● Search (grep)
  │ "^\s*(it|test)\(" in claude-code-capture.vitest.ts
  │ (.opencode/skill/system-spec-kit/scripts/tests)
  └ 1 file found

● Search (grep)
  │ "^\s*(it|test)\(" in codex-cli-capture.vitest.ts (.opencode/skill/system-spec-kit/scripts/tests)
  └ 1 file found

● Search (grep)
  │ "^\s*(it|test)\(" in copilot-cli-capture.vitest.ts
  │ (.opencode/skill/system-spec-kit/scripts/tests)
  └ 1 file found

● Search (grep)
  │ "^\s*(it|test)\(" in gemini-cli-capture.vitest.ts
  │ (.opencode/skill/system-spec-kit/scripts/tests)
  └ 1 file found

● Search (grep)
  │ "^\s*(it|test)\(" in content-filter-parity.vitest.ts
  │ (.opencode/skill/system-spec-kit/scripts/tests)
  └ 1 file found

● Search (grep)
  │ "^\s*(it|test)\(" in contamination-filter.vitest.ts
  │ (.opencode/skill/system-spec-kit/scripts/tests)
  └ 1 file found

● Search (grep)
  │ "^\s*(it|test)\(" in validation-rule-metadata.vitest.ts
  │ (.opencode/skill/system-spec-kit/scripts/tests)
  └ 1 file found

● Read data-loader.ts
  │ .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
  └ L220:360 (141 lines read)

● Search (grep)
  │ "NOISE_PATTERNS|tool\.execution_start|tool\.execution_complete|reasoning|<reasoning>|view|Read|n
  │ ormalizeToolName|copilot|codex|gemini|claude"
  │ (.opencode/skill/system-spec-kit/scripts/lib/content-filter.ts)
  └ 8 lines found

● Read data-loader.ts
  │ .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
  └ L360:520 (161 lines read)

● Read validate-memory-quality.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts
  └ L360:460 (101 lines read)

● Search (grep)
  │ "appliesToSources|VALIDATION_RULE_METADATA|toolTitleWithPathExpected|prefersStructuredSave|input
  │ Mode" (.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts)
  └ 19 lines found

● Read validate-memory-quality.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts
  └ L1:220 (220 lines read)

● Read runtime-memory-inputs.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts
  └ L400:640 (241 lines read)

● Read phase-classification.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/phase-classification.vitest.ts
  └ L1:80 (80 lines read)

● Read content-filter.ts
  │ .opencode/skill/system-spec-kit/scripts/lib/content-filter.ts
  └ L240:320 (81 lines read)

● Read claude-code-capture.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/claude-code-capture.vitest.ts
  └ L1:120 (120 lines read)

● Read codex-cli-capture.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/codex-cli-capture.vitest.ts
  └ L1:120 (120 lines read)

● Read copilot-cli-capture.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/copilot-cli-capture.vitest.ts
  └ L1:120 (120 lines read)

● Read gemini-cli-capture.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/gemini-cli-capture.vitest.ts
  └ L1:120 (120 lines read)

● Search (grep)
  │ "toolTitleWithPathExpected|claude-code-capture|codex-cli-capture|copilot-cli-capture|gemini-cli-
  │ capture" (.opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts)
  └ 16 lines found

● Search (grep)
  │ "buildClaudeSessionHints|ClaudeSessionHints|sessionHints|expectedSessionId|CLAUDE_CODE_SESSION|C
  │ LAUDE_CODE_ENTRYPOINT" (.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts)
  └ 12 lines found

● Read data-loader.ts
  │ .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
  └ L170:240 (71 lines read)

● Read opencode-capture.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/opencode-capture.vitest.ts
  └ L1:120 (119 lines read)

● Search (grep)
  │ "_sourceTranscriptPath|_sourceSessionId|_sourceSessionCreated|_sourceSessionUpdated" in *.ts
  │ (.opencode/skill/system-spec-kit/scripts/extractors)
  └ 11 lines found

● Search (grep)
  │ "toolTitleWithPathExpected|captureSource|getSourceCapabilities"
  │ (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 5 lines found

● Search (grep)
  │ "^\s*(it|test)\(" in phase-classification.vitest.ts
  │ (.opencode/skill/system-spec-kit/scripts/tests)
  └ 1 file found

● Search (grep)
  │ "^\s*(it|test)\(" in runtime-memory-inputs.vitest.ts
  │ (.opencode/skill/system-spec-kit/scripts/tests)
  └ 1 file found

Findings for **Q13 parity divergence**:

1) **Source capabilities by CLI** (`source-capabilities.ts`):
- Claude: `stateless`, `prefersStructuredSave=true`, **`toolTitleWithPathExpected=true`**.
- Codex/Copilot/Gemini/OpenCode-capture: same, but `toolTitleWithPathExpected=false`.
- `file/simulation` are structured-mode baselines.

2) **CLI-specific handling still present**:
- **Claude-only contamination exception remains**: tool-title-with-path severity downgrades only when `toolTitleWithPathExpected` is true (`contamination-filter.ts`, tested in `contamination-filter.vitest.ts`).
- Loader has CLI-specific env detection + capture switch + Claude session hints (`data-loader.ts`).
- Input normalizer has Copilot alias logic (`view` -> `Read ...`) in `buildToolObservationTitle`.
- Content filter has Codex/Copilot marker patterns hardcoded (`content-filter.ts`).

3) **Test coverage (current files)**:
- Dedicated capture suites (`it/test` count): Claude **7** (most), OpenCode/Codex/Copilot/Gemini **4 each** (least, tied).
- Cross-CLI parity checks exist in `runtime-memory-inputs`, `phase-classification`, `content-filter-parity`, `contamination-filter`, `validation-rule-metadata`.

4) **Parity gaps in behavior**:
- Claude-only: session hints, active-task lock handling, transcript ambiguity handling, `_sourceSession*` metadata enrichment.
- Others rely mainly on freshness/workspace matching.
- OpenCode adapter semantics differ (native `opencode` command + storage fallback).

5) **Assessment**:
`source-capabilities.ts` **partially abstracts** differences (mainly contamination/validation metadata), but does **not** fully centralize parity; meaningful CLI checks remain scattered across loader, filters, and adapter-specific extractors.

