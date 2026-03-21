I’ll quickly run context-trigger retrieval and skill routing, then inspect the three target files in one pass and draft the minimal live-proof protocol per CLI.

✗ memory_match_triggers
  └ Permission denied and could not request permission from user

✗ Run skill advisor for routing (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Design minimum viable automated live-proof
  │ protocol per CLI from generate-context.ts, data-loader.ts, workflow.ts" --threshold 0.8
  └ Permission denied and could not request permission from user

● Read generate-context.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts
  └ 1 line read

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ 1 line read

● Read data-loader.ts
  │ .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
  └ 1 line read

● Search (grep)
  │ "(runWorkflow|return\s*\{|WorkflowResult|collectedData|extractor|parallel|proof|artifact|status|
  │ success|errors|warnings|validation|metrics)"
  │ (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 5 lines found

● Search (grep)
  │ "(process\.argv|commander|yargs|argv|main\(|runWorkflow|loadCollectedData|return\s*\{|interface\
  │ s+WorkflowResult|type\s+WorkflowResult|collectedData|simulation|fallback|CLI|opencode|codex|clau
  │ de|gemini|copilot)" (.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts)
  └ 56 lines found

● Search (grep)
  │ "(loadCollectedData|simulation|fallback|CLI|opencode|codex|claude|gemini|copilot|capture|provide
  │ r|source|read.*json|return\s*\{|interface|type\s+)"
  │ (.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts)
  └ 5 lines found

● Search (grep)
  │ "^(export\s+)?(async\s+)?function\s+(loadCollectedData|loadFrom|collect|detect)|fallback|simulat
  │ ion|opencode|claude|codex|copilot|gemini|provider|sessionId|return\s+\{"
  │ (.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts)
  └ 93 lines found

● Search (grep)
  │ "^(export\s+)?(async\s+)?function\s+(main|parseArguments|parseStructuredInput|loadCollectedData|
  │ runWorkflow)|type\s+WorkflowResult|interface\s+WorkflowResult|return\s+\{"
  │ (.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts)
  └ 16 lines found

● Search (grep)
  │ "^(export\s+)?(async\s+)?function\s+runWorkflow|interface\s+Workflow|type\s+Workflow|summary|suc
  │ cess|errors|warnings|return\s+\{|extract|parallel|Promise\.all"
  │ (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 5 lines found

Quick pivot: I’ve located the key anchors. I’ll now read the exact sections around argument parsing, loader fallback/simulation, and workflow outputs to produce a concrete protocol.

● Read generate-context.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts
  └ L1:140 (140 lines read)

● Read generate-context.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts
  └ L330:460 (131 lines read)

● Read generate-context.ts
  │ .opencode/skill/system-spec-kit/scripts/memory/generate-context.ts
  └ L540:620 (72 lines read)

● Read data-loader.ts
  │ .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
  └ L1:120 (120 lines read)

● Read data-loader.ts
  │ .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
  └ L220:360 (141 lines read)

● Read data-loader.ts
  │ .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
  └ L360:540 (181 lines read)

● Read data-loader.ts
  │ .opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts
  └ L540:720 (45 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1:200 (200 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L380:620 (241 lines read)

● Read package.json
  │ .opencode/skill/system-spec-kit/scripts/package.json
  └ 28 lines read

● Search (glob)
  │ "**/*{vitest,test}*.{ts,js}" in .opencode/skill/system-spec-kit/scripts
  └ 63 files found

● Search (grep)
  │ "runWorkflow|loadCollectedData|generate-context|--json|--stdin|NO_DATA_AVAILABLE|EXPLICIT_DATA_F
  │ ILE_LOAD_FAILED" (.opencode/skill/system-spec-kit/scripts/tests)
  └ 5 lines found

● Read opencode-capture.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/opencode-capture.vitest.ts
  └ 249 lines read

● Read codex-cli-capture.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/codex-cli-capture.vitest.ts
  └ 307 lines read

● Read claude-code-capture.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/claude-code-capture.vitest.ts
  └ 453 lines read

● Read copilot-cli-capture.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/copilot-cli-capture.vitest.ts
  └ 290 lines read

● Read gemini-cli-capture.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/gemini-cli-capture.vitest.ts
  └ 250 lines read

● Search (grep)
  │ "async function runWorkflow|export async function runWorkflow|return
  │ \{\s*contextDir|WorkflowResult|indexingStatus|stats: \{"
  │ (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 90 lines found

● Read runtime-memory-inputs.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts
  └ 1 line read

● Read generate-context-cli-authority.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/generate-context-cli-authority.vitest.ts
  └ 257 lines read

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1360:1525 (166 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1705:1905 (201 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L2400:2485 (78 lines read)

● Read workflow.ts
  │ .opencode/skill/system-spec-kit/scripts/core/workflow.ts
  └ L1525:1705 (181 lines read)

● Read runtime-memory-inputs.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts
  └ L1:220 (220 lines read)

● Read runtime-memory-inputs.vitest.ts
  │ .opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts
  └ L220:520 (301 lines read)

● Search (grep)
  │ "inferPreferredCaptureSourceFromEnv|buildNativeCaptureOrder|NO_DATA_AVAILABLE|EXPLICIT_DATA_FILE
  │ _LOAD_FAILED|_source|capture.*Conversation"
  │ (.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts)
  └ 5 lines found

● Search (grep)
  │ "specFolderArg|collectSessionDataFn|loadDataFn|collectedData"
  │ (.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts)
  └ 57 lines found

● Search (grep)
  │ "isSimulation\s*=|_isSimulation" (.opencode/skill/system-spec-kit/scripts/core/workflow.ts)
  └ 11 lines found

Here’s an MVP live-proof protocol per CLI.

**1) Minimal automated input + validation per CLI**

Use temp HOME fixtures + direct loader invocation (`loadCollectedData`) so each native capture path is exercised (`data-loader.ts` fallback order and `_source` output).

- **OpenCode**: mock `opencode session list/export` JSON with 1 user+assistant exchange, 1 tool call. Validate `_source='opencode-capture'`, exchanges/toolCalls > 0.
- **Claude**: `.claude/history.jsonl` + project transcript with `thinking` + `tool_use`. Validate session selection, thinking excluded, tool extracted.
- **Codex**: `.codex/sessions/**/*.jsonl` with `session_meta`, `reasoning`, `function_call`. Validate reasoning excluded, project-match selected, outside-path tool args sanitized.
- **Copilot**: `.copilot/session-state/*/{workspace.yaml,events.jsonl}`. Validate newest matching workspace, user/assistant pairing, tool execution merged.
- **Gemini**: `.gemini/history/*/.project_root` + chat JSON. Validate project mapping, thoughts excluded, tool call extracted.

(Aligned with existing tests in `scripts/tests/*-capture.vitest.ts`, `runtime-memory-inputs.vitest.ts`.)

**2) Proof artifact schema (JSON)**

```json
{
  "protocolVersion":"1.0",
  "cli":"codex|copilot|claude|gemini|opencode",
  "runId":"uuid",
  "input":{"fixture":"path","specFolderArg":"...","envHints":{}},
  "capture":{"selectedSource":"...","exchangeCount":1,"toolCallCount":1},
  "workflow":{"specFolder":"...","contextFilename":"...","writtenFiles":["..."],"memoryId":null,"indexingStatus":{"status":"..."},"stats":{"messageCount":1,"decisionCount":0,"diagramCount":0,"qualityScore":0,"isSimulation":false}},
  "assertions":[{"name":"source-match","pass":true}],
  "pass":true
}
```

**3) Script structure**

- `scripts/evals/live-proof/run-live-proof.ts` (matrix runner).
- `fixtures/<cli>/...` (minimal transcripts).
- `adapters/<cli>.ts` (seed fixture into temp HOME).
- `validators.ts` (shared assertions).
- `schema.ts` (artifact typing/validation).
- Output: `artifacts/live-proof/<timestamp>/<cli>.json` + `summary.json`.

This leverages `generate-context.ts` CLI authority + `workflow.ts` result contract directly.


Total usage est:        1 Premium request
API time spent:         3m 50s
Total session time:     4m 6s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.3-codex            679.3k in, 9.8k out, 605.8k cached (Est. 1 Premium request)
