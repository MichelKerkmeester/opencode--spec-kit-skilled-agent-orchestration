# Live Session Wrapper Setup

The live-session wrapper records observed `Read` tool calls against `.opencode/skill/*` resources and compares them with the selected skill's predicted SMART ROUTING route. It is observe-only: failures are swallowed, no tool call is denied, and no prompt text is written by the wrapper.

## What It Measures

The collected JSONL can support:

- Compliance rate by class: `always`, `conditional_expected`, `on_demand_expected`, `extra`, `missing_expected`, `unknown_unparsed`
- Over-load ratio: reads outside the predicted route
- Under-load ratio: missed expected resources when a wrapper records that state
- ON_DEMAND trigger rate for actual sessions

The collected JSONL cannot support by itself:

- Causal claims about AI reasoning
- Claims that a model understood or used a loaded resource
- Claims about sessions where the runtime did not route `Read` tool calls through this wrapper

## Data Location

By default records are appended to:

```text
.opencode/skill/.smart-router-telemetry/compliance.jsonl
```

Override the destination with:

```bash
export SPECKIT_SMART_ROUTER_TELEMETRY_DIR=/path/to/telemetry-dir
```

or:

```bash
export SPECKIT_SMART_ROUTER_TELEMETRY_PATH=/path/to/compliance.jsonl
```

Read the data with:

```bash
npx tsx .opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts
```

## Runtime Contract

Your runtime wrapper should call `configureSmartRouterSession()` once per user prompt after the advisor hook selects a skill:

```ts
import {
  configureSmartRouterSession,
  onToolCall,
} from './.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts';

configureSmartRouterSession({
  promptId: 'session-42-turn-7',
  selectedSkill: 'sk-code-opencode',
  prompt: userPrompt,
  workspaceRoot: process.cwd(),
});

onToolCall('Read', { file_path: '.opencode/skill/sk-code-opencode/references/typescript/style_guide.md' });
```

If your runtime already computed `predictedRoute` and `allowedResources`, pass them directly. That avoids reparsing the skill file.

## Claude

Claude users can import the wrapper from a local hook module referenced by `.claude/settings.local.json`. Keep the existing `UserPromptSubmit` advisor hook first, then call the wrapper from a tool-call observer when your local Claude setup exposes one.

Example local observer module:

```ts
import { onToolCall } from './.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts';

export function onClaudeToolCall(toolName: string, toolInput: Record<string, unknown>) {
  onToolCall(toolName, toolInput);
}
```

Disable by removing the observer import or setting your wrapper module to no-op.

## Codex

Codex registration remains in `.codex/settings.json`. Keep `UserPromptSubmit` for advisor selection and add any local tool-call observer supported by your Codex host to call:

```ts
import { onToolCall } from './.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts';

export function onCodexToolCall(toolName: string, toolInput: Record<string, unknown>) {
  onToolCall(toolName, toolInput);
}
```

Disable by removing that observer or by routing it to an empty function.

## Gemini

Gemini setups normally use `.gemini/settings.json` with `BeforeAgent` for prompt-time hooks. Add the wrapper in the local tool observer surface if your Gemini host exposes one:

```ts
import { onToolCall } from './.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts';

export function onGeminiToolCall(toolName: string, toolInput: Record<string, unknown>) {
  onToolCall(toolName, toolInput);
}
```

Disable by removing the observer import.

## Copilot

Copilot SDK hosts can call the wrapper from their tool invocation callback:

```ts
import { onToolCall } from './.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts';

export async function onToolInvoked(input: { name: string; arguments: Record<string, unknown> }) {
  onToolCall(input.name, input.arguments);
}
```

Disable by removing the callback or returning before `onToolCall`.

## Operational Notes

- Use stable prompt IDs, for example `<session-id>:<turn-number>`.
- Do not pass raw prompt text to telemetry output. The wrapper uses prompt text only in memory to compute predicted routes.
- Static measurement records emitted by `smart-router-measurement.ts` use `unknown_unparsed`; use live-wrapper records for behavioral claims.
