# Iteration 017: memory_context Resume Flow Analysis

## Focus

This iteration traced the live `memory_context` resume path from MCP request handling down to the profiled search payload returned to the caller. The requested file `.opencode/skill/system-spec-kit/mcp_server/lib/context-server.ts` does not exist in the current tree, so the analysis used the actual entrypoint `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` together with all `.ts` files under `mcp_server/api/`, `hooks/memory-surface.ts`, and the directly connected implementation files that own the resume behavior.

## Findings

1. `memory_context({ mode: 'resume', profile: 'resume' })` does not return a flat resume brief as the top-level tool payload. The final tool return is an outer MCP transport wrapper, whose `content[0].text` is a JSON `MCPEnvelope`, and that outer envelope's `data` is a `ContextResult` object containing orchestration metadata plus a nested `content[0].text` string from `memory_search`. In resume mode, the inner `memory_search` envelope is where the profiled resume brief appears. The outer `memory_context` envelope still keeps `strategy`, `mode`, `resumeAnchors`, and optional `systemPromptContext*` fields on `data`, not `state/nextSteps/blockers` directly. `[.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:688-717] [.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1247-1279] [.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:16-35] [.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:264-282] [.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:86-112] [.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:447-497]`

2. `profile: 'resume'` changes the output format only inside the nested `memory_search` envelope. `handleMemoryContext()` forwards `profile` to `handleMemorySearch()`, and `handleMemorySearch()` applies `applyProfileToEnvelope()` as a best-effort post-processing step. That formatter removes `data.results`, preserves other non-result data fields, adds `data.state`, `data.nextSteps`, `data.blockers`, and `data.topResult`, and stamps `meta.responseProfile = 'resume'`. Without `profile`, the inner envelope keeps the standard search shape with `data.results`. The outer `memory_context` envelope is not flattened into the resume brief. `[.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:246-259] [.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1066-1084] [.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:283-286] [.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:356-370] [.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:447-497]`

3. The actual resume-brief schema is `ResumeProfile`, not a bare `{ state, nextSteps, blockers }` triple. The concrete TypeScript interface is:

   ```ts
   interface ResumeProfile {
     state: string;
     nextSteps: string[];
     blockers: string[];
     topResult: SearchResultEntry | null;
   }
   ```

   So the shorthand `{ state, nextSteps, blockers }` is incomplete; `topResult` is part of the real profile contract. `[.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:86-92] [.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:356-370]`

4. The full call chain is:

   ```text
   MCP CallToolRequest
   -> context-server.ts setRequestHandler(CallToolRequestSchema)
   -> pre-dispatch auto-surface hook selection
   -> dispatchTool(name, args)
   -> tools/context-tools.ts handleTool()
   -> handleMemoryContext()
   -> executeResumeStrategy()
   -> handleMemorySearch()
   -> applyProfileToEnvelope('resume') inside memory-search
   -> return nested search MCPResponse to handleMemoryContext()
   -> optional auto-resume working-memory injection
   -> enforceTokenBudget()
   -> createMCPResponse() for outer memory_context envelope
   -> context-server post-processing: appendAutoSurfaceHints(), meta.autoSurfacedContext, layer tokenBudget injection
   -> final MCPResponse to caller
   ```

   The `api/*.ts` files are not in this runtime call chain; they are public re-export barrels for external scripts and indexing/search bootstrapping, not live request middleware for `memory_context`. `[.opencode/skill/system-spec-kit/mcp_server/context-server.ts:308-440] [.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:24-35] [.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:10-17] [.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:872-892] [.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:980-1354] [.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1066-1084] [.opencode/skill/system-spec-kit/mcp_server/api/index.ts:11-117] [.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts:26-57]`

5. `autoSurfaceAtCompaction()` integrates with resume mode in the server layer, not inside `handleMemoryContext()`. `context-server.ts` explicitly treats `memory_context` calls with `args.mode === 'resume'` as `isCompactionLifecycleCall`, then routes them through `autoSurfaceAtCompaction(contextHint)` before dispatch. That hook uses the compaction token budget and returns surfaced constitutional/triggered memories. After the tool handler returns, the server appends an auto-surface hint into the outer envelope and also stores the full surfaced payload in `meta.autoSurfacedContext`. This is separate from the handler-level auto-resume working-memory injection. `[.opencode/skill/system-spec-kit/mcp_server/context-server.ts:325-347] [.opencode/skill/system-spec-kit/mcp_server/context-server.ts:373-399] [.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:283-317] [.opencode/skill/system-spec-kit/mcp_server/hooks/response-hints.ts:59-104] [.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1219-1239]`

6. There are three distinct token-budget layers in this flow, and they do not match:

   - Resume strategy budget: `1200` tokens from `CONTEXT_MODES.resume.tokenBudget`. This is the budget actually enforced by `handleMemoryContext()` via `enforceTokenBudget()`.
   - L1 tool-layer budget: `2000` tokens for `memory_context` from `layer-definitions.ts`. `context-server.ts` writes this value into the outer envelope's `meta.tokenBudget` after the handler returns.
   - Compaction auto-surface budget: `4000` tokens from `COMPACTION_TOKEN_BUDGET`, used only by the pre-dispatch `autoSurfaceAtCompaction()` hook.

   The important nuance is that the final caller-visible `meta.tokenBudget` is overwritten to `2000` by the server layer, while `meta.tokenBudgetEnforcement.budgetTokens` still reflects the handler's `1200`-token resume enforcement. `[.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:581-587] [.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1215-1244] [.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1259-1279] [.opencode/skill/system-spec-kit/mcp_server/lib/architecture/layer-definitions.ts:43-60] [.opencode/skill/system-spec-kit/mcp_server/context-server.ts:397-433] [.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:52-55] [.opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:294-316]`

7. Session detection is based on trusted-session resolution, not on resume keywords alone. `resolveTrustedSession()` marks a call as resumed only when the caller-supplied `sessionId` is already server-tracked, is bound to corroborated identity state, and does not violate tenant/user/agent scope. If no `sessionId` is supplied, the server generates a new UUID and `resumed = false`. If the `sessionId` is untracked or mismatched, the handler returns `E_SESSION_SCOPE`. Once a session is trusted, `handleMemoryContext()` reads the previous inferred mode and event counter from working memory, uses that in resume heuristics, and then saves the current session state back into `session_state`. `[.opencode/skill/system-spec-kit/mcp_server/lib/session/session-manager.ts:385-435] [.opencode/skill/system-spec-kit/mcp_server/tests/session-manager-extended.vitest.ts:270-342] [.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:724-763] [.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:794-849] [.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1041-1067] [.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1149-1160]`

8. Resume-mode selection and resumed-session recognition are related but separate. A call can enter `effectiveMode = 'resume'` either because the caller explicitly requested `mode: 'resume'`, because auto mode sees resume keywords in the input, or because auto mode sees resume context such as `session.resumed`, `priorMode === 'resume'`, or short spec-folder-scoped prompts mentioning status/state/blockers. That means "recognized as resumed" is a trusted-session property, while "routed into resume mode" is an effective-mode decision that can also happen heuristically. `[.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:776-849] [.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:140-156] [.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:181-196]`

9. `SPECKIT_AUTO_RESUME` only gates the post-search working-memory prompt-context injection step. It does not decide whether the request uses resume mode, and it does not control the pre-dispatch compaction hook. When enabled, and only when `effectiveMode === 'resume'` and the session is trusted as resumed, the handler fetches up to five working-memory items above `DECAY_FLOOR` and attaches them as `data.systemPromptContext` plus `data.systemPromptContextInjected = true`. When disabled (`false` or `0`), that injection is skipped. Because rollout flags default to on, leaving `SPECKIT_AUTO_RESUME` unset still enables the feature unless rollout gating excludes the identity. `[.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts:39-45] [.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts:53-74] [.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts:325-357] [.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1083-1086] [.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1228-1239] [.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:580-591] [.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-context.vitest.ts:669-726]`

## Evidence

### 1. Final transport shape

```ts
type MCPResponse = {
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
};

type MCPEnvelope<T> = {
  summary: string;
  data: T;
  hints: string[];
  meta: ResponseMeta;
};
```

Source: the outer transport wrapper always serializes a single JSON envelope into `content[0].text`, and `memory_context` uses `createMCPResponse()` for its final payload. `[.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:30-35] [.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts:264-282] [.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1247-1279]`

### 2. Effective outer `memory_context` data shape in resume mode

```ts
type ResumeContextResult = {
  strategy: 'resume';
  mode: 'resume';
  resumeAnchors: string[];
  content: Array<{ type: 'text'; text: string }>; // nested memory_search envelope
  isError?: boolean;
  systemPromptContext?: Array<{
    memoryId: number;
    title: string;
    filePath: string;
    attentionScore: number;
  }>;
  systemPromptContextInjected?: true;
};
```

This is the object placed in the outer envelope's `data`. The nested `content[0].text` is the profiled `memory_search` envelope. `[.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:688-717] [.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1228-1239]`

### 3. Inner profiled resume envelope shape

```ts
type ResumeProfile = {
  state: string;
  nextSteps: string[];
  blockers: string[];
  topResult: SearchResultEntry | null;
};
```

Applied by `memory_search` when `profile: 'resume'` is forwarded from `memory_context`. `[.opencode/skill/system-spec-kit/mcp_server/lib/response/profile-formatters.ts:86-92] [.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:1066-1084]`

### 4. Concrete nested-envelope sketch

```json
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"summary\": \"Context retrieved via resume mode (resume strategy)\",\n  \"data\": {\n    \"strategy\": \"resume\",\n    \"mode\": \"resume\",\n    \"resumeAnchors\": [\"state\", \"next-steps\", \"summary\", \"blockers\"],\n    \"content\": [\n      {\n        \"type\": \"text\",\n        \"text\": \"{\\n  \\\"summary\\\": \\\"...search summary...\\\",\\n  \\\"data\\\": {\\n    \\\"count\\\": 5,\\n    \\\"state\\\": \\\"...\\\",\\n    \\\"nextSteps\\\": [...],\\n    \\\"blockers\\\": [...],\\n    \\\"topResult\\\": {...}\\n  },\\n  \\\"meta\\\": {\\n    \\\"tool\\\": \\\"memory_search\\\",\\n    \\\"responseProfile\\\": \\\"resume\\\"\\n  }\\n}\"\n      }\n    ],\n    \"systemPromptContextInjected\": true,\n    \"systemPromptContext\": [...]\n  },\n  \"meta\": {\n    \"tool\": \"memory_context\",\n    \"mode\": \"resume\",\n    \"tokenBudget\": 2000,\n    \"tokenBudgetEnforcement\": {\n      \"budgetTokens\": 1200\n    },\n    \"sessionLifecycle\": {\n      \"resumed\": true\n    }\n  }\n}"
    }
  ]
}
```

This sketch is assembled directly from the handler and envelope code paths; the important point is the nested envelope split and the dual token-budget metadata. `[.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1247-1279] [.opencode/skill/system-spec-kit/mcp_server/context-server.ts:393-433]`

## New Information Ratio (0.0-1.0)

0.84

## Novelty Justification

The prior memory/rollout context already established the product intent for a "Resume Essentials" packet and the decision to consolidate `/memory:continue` into `/spec_kit:resume`, but it did not spell out the actual transport contract or runtime layering. The new information in this iteration is the implementation-level detail that matters for Hybrid Context Injection work:

- the resume brief lives in the inner `memory_search` envelope, not the outer `memory_context` envelope;
- the actual resume schema includes `topResult`, so the shorthand `{ state, nextSteps, blockers }` is lossy;
- `memory_context(mode:'resume')` is specially routed through the compaction auto-surface hook before dispatch;
- the handler enforces `1200` tokens while the server later advertises `2000` in top-level metadata;
- resumed-session recognition is trusted-session based, not just keyword based;
- `SPECKIT_AUTO_RESUME` only gates post-search working-memory prompt injection.

Those details materially refine the architecture model for compact-code-graph work and were not present in the earlier high-level smart-resume summary.

## Recommendations for Implementation

1. Treat the resume brief as an inner-envelope contract unless you intentionally add a flattening layer. If Hybrid Context Injection expects direct `{ state, nextSteps, blockers }` access from `memory_context`, it will currently parse the wrong level.

2. Model three budgets explicitly in the hook/tool architecture:
   - `resume retrieval budget = 1200`
   - `memory_context layer budget = 2000`
   - `compaction auto-surface budget = 4000`
   Collapsing these into one "resume budget" will hide real behavior.

3. Separate "resume routing" from "resumed session" in implementation docs and telemetry. The code already distinguishes them, and keeping that distinction in the compact graph will avoid false assumptions.

4. If the implementation needs a canonical resume-brief type, introduce and export a named `ResumeBrief` alias instead of relying on formatter-internal `ResumeProfile`.

5. Consider renaming or documenting the `isCompactionLifecycleCall` branch more explicitly. Today it is triggered by `memory_context(mode:'resume')`, which is accurate in code but easy to misread as a literal session-compaction event.

6. If downstream consumers need the auto-resume working-memory hints, read them from the outer `memory_context` envelope (`systemPromptContext*`), not from the inner profiled search payload. The two injections happen at different layers and should remain distinct in any hook graph.
