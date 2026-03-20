● Read opencode-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts
  └ 1 line read

● Read source-capabilities.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/source-capabilities.ts
  └ 82 lines read

● Read contamination-filter.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts
  └ 199 lines read

● Search (glob)
  │ "**/*{source-capabilities,capabilities}*{test,spec}*.{ts,js,mjs,cjs}" in
  │ .opencode/skill/system-spec-kit/scripts
  └ No matches found

● Search (grep)
  │ "source-capabilities|getSourceCapabilities|supports[A-Z]" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 18 lines found

I’ve pulled the core files and next I’ll quickly inspect the related tests and capability consumers to map exact parity behavior and any risk paths.

● Read validation-rule-metadata.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/validation-rule-metadata.vitest.ts
  └ 73 lines read

● Read contamination-filter.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/contamination-filter.vitest.ts
  └ 126 lines read

● Search (grep)
  │ "captureSource\s*===|source\s*===|includes\('claude|codex|copilot|gemini|opencode-capture|cli-ca
  │ pture" (.opencode/skill/system-spec-kit/scripts/extractors/contamination-filter.ts)
  └ No matches found

● Search (grep)
  │ "claude|codex|copilot|gemini|captureSource|getSourceCapabilities|toolTitleWithPathExpected|prefe
  │ rsStructuredSave|inputMode"
  │ (.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts)
  └ No matches found

● Search (grep)
  │ "getSourceCapabilities|prefersStructuredSave|toolTitleWithPathExpected|inputMode|claude|codex|co
  │ pilot|gemini" (.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts)
  └ 2 lines found

● Search (grep)
  │ "captureCapabilities|getSourceCapabilities|prefersStructuredSave|inputMode|toolTitleWithPathExpe
  │ cted|claude|codex|copilot|gemini" (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 4 lines found

● Read validate-memory-quality.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts
  └ L360:440 (81 lines read)

● Read input-normalizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts
  └ L1:140 (140 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L2125:2195 (71 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1400:1475 (76 lines read)

● Search (grep)
  │ "filterContamination|captureSource|DataSource|source|cli|tool title|title with
  │ path|contamination" (.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts)
  └ No matches found

● Search (glob)
  │ "**/*opencode-capture*.vitest.ts" in .opencode/skill/system-spec-kit/scripts/tests
  └ 1 file found

● Read opencode-capture.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/opencode-capture.vitest.ts
  └ 249 lines read

● Search (grep)
  │ "sourceCapabilities|captureSource|tool title with path|V10|V8|V9|appliesToSources"
  │ (.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts)
  └ 26 lines found

● Search (grep)
  │ "_source|claude-code-capture|codex-cli-capture|copilot-cli-capture|gemini-cli-capture|opencode-c
  │ apture" (.opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts)
  └ No matches found

● Search (grep)
  │ "toolTitleWithPathExpected|prefersStructuredSave|inputMode" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 34 lines found

● Read validate-memory-quality.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts
  └ L1:170 (170 lines read)

● Read opencode-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/opencode-capture.ts
  └ L1:220 (220 lines read)

● Search (glob)
  │ "**/*capture*.ts" in .opencode/skill/system-spec-kit/scripts/extractors
  └ 5 files found

● Search (grep)
  │ "_source\s*[:=]|DataSource|CaptureDataSource|claude-code-capture|codex-cli-capture|copilot-cli-c
  │ apture|gemini-cli-capture|opencode-capture" in **/*.ts
  │ (.opencode/skill/system-spec-kit/scripts/extractors)
  └ 9 lines found

Quick pass found strong signals already; I’ll now check the CLI extractor/test surface to confirm whether parity gaps are theoretical or observable in current code paths.

● Read collect-session-data.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/collect-session-data.ts
  └ L300:460 (161 lines read)

● Search (grep)
  │ "tool title with path|toolTitleWithPathExpected|Read tool on|\*\*Tool:|captureSource|_source" in
  │ **/*-capture.ts (.opencode/skill/system-spec-kit/scripts/extractors)
  └ 4 lines found

● Search (grep)
  │ "captureSource|_source|getSourceCapabilities|sourceCapabilities|toolTitleWithPathExpected|claude
  │ -code-capture|codex-cli-capture|copilot-cli-capture|gemini-cli-capture|opencode-capture" in
  │ **/*.vitest.ts (.opencode/skill/system-spec-kit/scripts/tests)
  └ 5 lines found

● Search (glob)
  │ "**/*{claude,codex,copilot,gemini,opencode}*{capture}*.vitest.ts" in
  │ .opencode/skill/system-spec-kit/scripts/tests
  └ 5 files found

● Read copilot-cli-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/copilot-cli-capture.ts
  └ L1:220 (220 lines read)

● Read gemini-cli-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts
  └ L1:220 (219 lines read)

● Read codex-cli-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts
  └ L1:220 (219 lines read)

● Read copilot-tool-output-1773991537616-gb6uv2.txt
  │ /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1773991537616-gb6uv2.txt
  └ L1:220 (98 lines read)

● Read claude-code-capture.ts
  │ .opencode/skill/system-spec-kit/scripts/extractors/claude-code-capture.ts
  └ L650:760 (82 lines read)

● Search (grep)
  │ "_source\s*===\s*'claude-code-capture'|_source\s*===\s*'codex-cli-capture'|_source\s*===\s*'copi
  │ lot-cli-capture'|_source\s*===\s*'gemini-cli-capture'|captureSource\s*===\s*'claude-code-capture
  │ '|captureSource\s*===\s*'codex-cli-capture'|captureSource\s*===\s*'copilot-cli-capture'|captureS
  │ ource\s*===\s*'gemini-cli-capture'" in **/*.ts (.opencode/skill/system-spec-kit/scripts)
  └ No matches found

● Search (grep)
  │ "_source\s*=\s*'claude-code-capture'|_source\s*=\s*'codex-cli-capture'|_source\s*=\s*'copilot-cl
  │ i-capture'|_source\s*=\s*'gemini-cli-capture'|_source\s*=\s*'opencode-capture'|_source\s*:\s*'cl
  │ aude-code-capture'|_source\s*:\s*'codex-cli-capture'|_source\s*:\s*'copilot-cli-capture'|_source
  │ \s*:\s*'gemini-cli-capture'|_source\s*:\s*'opencode-capture'" in **/*.ts
  │ (.opencode/skill/system-spec-kit/scripts)
  └ 16 lines found

● Read data-loader.ts
  │ .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
  └ L330:490 (161 lines read)

● Search (grep)
  │ "title\s*=\s*|sanitizeToolDescription|displayName|description|tool_calls|toolCalls|tool
  │ call|assistantResponse"
  │ (.opencode/skill/system-spec-kit/scripts/extractors/codex-cli-capture.ts)
  └ 14 lines found

● Search (grep)
  │ "title\s*=\s*|sanitizeToolDescription|displayName|description|tool_calls|toolCalls|tool
  │ call|assistantResponse"
  │ (.opencode/skill/system-spec-kit/scripts/extractors/gemini-cli-capture.ts)
  └ 16 lines found

● Search (grep)
  │ "title\s*=\s*|sanitizeToolDescription|displayName|description|tool_calls|toolCalls|tool
  │ call|assistantResponse"
  │ (.opencode/skill/system-spec-kit/scripts/extractors/copilot-cli-capture.ts)
  └ 20 lines found

● Search (grep)
  │ "tool title with path|\*\*Tool:|title\s*=\s*|sanitizeToolDescription|displayName|description"
  │ (.opencode/skill/system-spec-kit/scripts/extractors/claude-code-capture.ts)
  └ 3 lines found

● Search (grep)
  │ "captureClaudeConversation|captureCodexConversation|captureCopilotConversation|captureGeminiConv
  │ ersation|_source"
  │ (.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts)
  └ 87 lines found

● Search (grep)
  │ "toolTitleWithPathExpected|getSourceCapabilities|source-capabilities" in **/*.vitest.ts
  │ (.opencode/skill/system-spec-kit/scripts/tests)
  └ 11 lines found

● Read tool-sanitizer.ts
  │ .opencode/skill/system-spec-kit/scripts/utils/tool-sanitizer.ts
  └ L1:260 (146 lines read)

● Search (grep)
  │ "tool title with path|Read tool on|\*\*Tool:\s+|toolTitleWithPathExpected|sourceCapabilities"
  │ (.opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts)
  └ No matches found

● Search (grep)
  │ "function
  │ sanitizeToolDescription|sanitizeToolDescription\(|sanitizeToolInputPaths|strip|path|tool title"
  │ (.opencode/skill/system-spec-kit/scripts/utils/tool-sanitizer.ts)
  └ 18 lines found

● Search (grep)
  │ "captureCapabilities\.inputMode|getSourceCapabilities\(captureSource\)|captureSource \? \{
  │ captureSource: captureCapabilities.source"
  │ (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 3 lines found

● Read validate-memory-quality.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts
  └ L520:630 (111 lines read)

● Read validate-memory-quality.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/validate-memory-quality.ts
  └ L630:730 (101 lines read)

● Search (grep)
  │ "getSourceCapabilities\(|captureCapabilities\.source|toolTitleWithPathExpected|inputMode ===
  │ 'stateless'|prefersStructuredSave" in **/*.ts (.opencode/skill/system-spec-kit/scripts)
  └ 33 lines found

I’ve finished the static analysis; I’ll run the targeted capability/parity tests once to confirm there’s no hidden mismatch in behavior.

✗ Run source capability parity tests (shell)
  │ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/scripts' && npx vitest run
  │ tests/validation-rule-metadata.vitest.ts tests/contamination-filter.vitest.ts
  │ tests/runtime-memory-inputs.vitest.ts --reporter=verbose
  └ Permission denied and could not request permission from user

● Search (grep)
  │ "contaminationMaxSeverity|hadContamination|extractorCleanedFieldCount|contaminationAuditTrail|ma
  │ xSeverity" (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 25 lines found

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1568:1600 (33 lines read)

Findings for **Q14 parity** (static analysis only; test execution blocked by permissions).

1) **Capabilities per CLI** (`source-capabilities.ts`):
- `claude-code-capture`: `inputMode='stateless'`, `toolTitleWithPathExpected=true`, `prefersStructuredSave=true`
- `codex-cli-capture`: `stateless`, `false`, `true`
- `copilot-cli-capture`: `stateless`, `false`, `true`
- `gemini-cli-capture`: `stateless`, `false`, `true`

2) **Parity set**: all 4 CLIs have the same capability keys; no missing capability fields.

3) **CLI-unique behavior**: only Claude has `toolTitleWithPathExpected=true` (intentional downgrade path).

4) **`contamination-filter.ts` usage**: capability-driven only (`getSourceCapabilities` + `toolTitleWithPathExpected`), no CLI-name branching.

5) **Risk paths**:
- Unknown/mismatched `_source` falls back to `file` capabilities (`source-capabilities.ts`), which can misclassify stateless captures and alter contamination severity/gating (`workflow.ts`, `validate-memory-quality.ts`).
- Test parity gap: capability-specific assertions cover Claude+Codex but not Copilot/Gemini/OpenCode for contamination severity behavior.

