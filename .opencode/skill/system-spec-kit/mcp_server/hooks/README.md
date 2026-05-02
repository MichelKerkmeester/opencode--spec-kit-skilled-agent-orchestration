---
title: "Hooks"
description: "Runtime startup hooks, prompt-time skill-advisor hooks, and in-process helper modules for memory surfacing and UX feedback."
trigger_phrases:
  - "hooks"
  - "memory surfacing"
  - "context injection"
  - "startup hook"
  - "skill advisor hook"
---


# Hooks

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. IMPLEMENTED STATE](#2-implemented-state)
- [3. HARDENING NOTES](#3-hardening-notes)
- [4. RELATED](#4-related)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

`hooks/` covers three distinct concerns that share a directory but serve different lifecycles:

1. **Runtime startup hooks** — external hook scripts registered with each runtime (Claude, Gemini, Copilot, Codex) that run at session start and transport the compact startup shared-payload (`graphQualitySummary`, `sharedPayloadTransport`, etc.) produced by the MCP server.
2. **Prompt-time skill-advisor hooks** — external hook scripts that fire on each user prompt, call the native advisor, and deliver the advisor brief through the runtime's `additionalContext` or managed-instructions surface.
3. **In-process helper modules** — helpers exported via `index.ts` for memory surfacing, mutation UX feedback, and response-hint injection.

### Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────────┐
│                      HOOK SYSTEM ARCHITECTURE                        │
├──────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │                    AI RUNTIMES                                   ││
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐               ││
│  │  │Claude  │  │Gemini  │  │Copilot │  │ Codex  │               ││
│  │  └───┬────┘  └───┬────┘  └───┬────┘  └───┬────┘               ││
│  └──────┼───────────┼───────────┼───────────┼──────────────────────┘│
│         │           │           │           │                        │
│  ┌──────▼───────────▼───────────▼───────────▼──────────────────────┐│
│  │                    HOOK SCRIPTS (External Processes)            ││
│  │  ┌──────────────────────┐  ┌──────────────────────────────────┐││
│  │  │   STARTUP HOOKS      │  │   PROMPT-TIME ADVISOR HOOKS      │││
│  │  │ ┌──────────────────┐ │  │ ┌──────────────────────────────┐ │││
│  │  │ │claude/           │ │  │ │claude/user-prompt-submit.ts │ │││
│  │  │ │ session-prime.ts │ │  │ │gemini/user-prompt-submit.ts │ │││
│  │  │ │gemini/           │ │  │ │copilot/user-prompt-submit.ts│ │││
│  │  │ │ session-prime.ts │ │  │ │codex/user-prompt-submit.ts  │ │││
│  │  │ │copilot/          │ │  │ └──────────────────────────────┘ │││
│  │  │ │ session-prime.ts │ │  └──────────────────────────────────┘││
│  │  │ │codex/            │ │                                       ││
│  │  │ │ session-start.ts │ │  ┌──────────────────────────────────┐││
│  │  │ └──────────────────┘ │  │   COMPACTION HOOKS               │││
│  │  └──────────────────────┘  │ ┌──────────────────────────────┐ │││
│  │                            │ │claude/compact-inject.ts     │ │││
│  │                            │ │gemini/compact-inject.ts     │ │││
│  │                            │ │gemini/compact-cache.ts      │ │││
│  │                            │ │copilot/compact-cache.ts     │ │││
│  │                            │ └──────────────────────────────┘ │││
│  │                            └──────────────────────────────────┘││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │              IN-PROCESS HELPER MODULES (index.ts exports)       ││
│  │  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐ ││
│  │  │ memory-surface.ts│ │ mutation-feedback│ │ response-hints.ts│ ││
│  │  │ context extract  │ │ post-mutation    │ │ auto-surface     │ ││
│  │  │ constitutional   │ │ UX payloads     │ │ hint injection   │ ││
│  │  │ trigger matching │ │ cache invalidation│ token-count sync │ ││
│  │  └──────────────────┘ └──────────────────┘ └──────────────────┘ ││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────────┐│
│  │             SHARED INFRASTRUCTURE                                ││
│  │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────────┐││
│  │ │index.ts  │ │memory-   │ │response- │ │shared-provenance.ts  │││
│  │ │          │ │surface.ts│ │hints.ts  │ │                      │││
│  │ └──────────┘ └──────────┘ └──────────┘ └──────────────────────┘││
│  └─────────────────────────────────────────────────────────────────┘│
│                                                                      │
│  Transport: Claude/Gemini → stdout context injection                │
│             Copilot → managed custom-instructions file refresh      │
│             Codex → native hook injection                           │
│                                                                      │
└──────────────────────────────────────────────────────────────────────┘
```

### Directory Tree

```
mcp_server/hooks/
├── claude/                        # Claude runtime hooks
│   ├── session-prime.ts           #   SessionStart: compact shared-payload injection
│   ├── user-prompt-submit.ts      #   BeforeAgent: skill-advisor brief delivery
│   ├── compact-inject.ts          #   Compact: context injection on compaction
│   ├── claude-transcript.ts       #   Transcript handling
│   ├── session-stop.ts            #   SessionStop: cleanup and metadata capture
│   └── README.md
├── gemini/                        # Gemini runtime hooks
│   ├── session-prime.ts           #   SessionStart: startup brief injection
│   ├── user-prompt-submit.ts      #   BeforeAgent: skill-advisor brief delivery
│   ├── compact-inject.ts          #   Compact: context injection
│   ├── compact-cache.ts           #   Compact: cache management
│   ├── session-stop.ts            #   SessionStop: cleanup
│   └── README.md
├── copilot/                       # Copilot runtime hooks
│   ├── session-prime.ts           #   SessionStart: custom-instructions refresh
│   ├── user-prompt-submit.ts       #   Prompt-time: advisor brief
│   ├── compact-cache.ts           #   Compact: cache management
│   ├── custom-instructions.ts     #   Managed instructions file handler
│   └── README.md
├── codex/                         # Codex runtime hooks
│   ├── session-start.ts           #   SessionStart: native hook injection
│   ├── user-prompt-submit.ts      #   Prompt-time: advisor brief
│   ├── pre-tool-use.ts            #   Pre-execution tool routing
│   ├── prompt-wrapper.ts          #   Prompt wrapping for advisor integration
│   └── README.md
├── index.ts                       # Public helper exports
├── memory-surface.ts              # Context extraction + constitutional cache
├── mutation-feedback.ts           # Post-mutation UX feedback payloads
├── response-hints.ts              # Auto-surface hints + token count sync
├── shared-provenance.ts           # Provenance-wrapped transport
└── README.md
```

### 1.1 Runtime Startup Hooks

All four supported runtimes now transport the same compact startup shared-payload through their runtime-specific startup hooks. Each hook reads the structural snapshot produced by `buildStartupBrief()` (including `graphQualitySummary`, `sharedPayload`, and `sharedPayloadTransport`) and injects it through the runtime's native transport:

| Runtime | Entrypoint | Registration Surface | Transport |
|---------|------------|----------------------|-----------|
| Claude | `claude/session-prime.ts` | `.claude/settings.local.json` `SessionStart` | stdout context injection (routes by source: compact/startup/resume/clear) |
| Gemini | `gemini/session-prime.ts` | `.gemini/settings.json` `SessionStart` (or equivalent) | startup brief injection at session priming |
| Copilot | `copilot/session-prime.ts` | wrapper/hook config + managed custom-instructions refresh | writes the compact shared-payload envelope into the managed block in `$HOME/.copilot/copilot-instructions.md` |
| Codex | `codex/session-start.ts` | `~/.codex/hooks.json` with `[features].codex_hooks = true` in `~/.codex/config.toml` | native `SessionStart` hook injection |

`session_bootstrap()` remains available as a manual fallback when native startup hooks are disabled or unwired; it is no longer a Codex-only substitute. Copilot no longer has "varies by environment" behavior — the managed custom-instructions refresh is the defined startup transport.

### 1.2 Prompt-Time Skill-Advisor Hooks

Prompt-time advisor hooks fire on each user prompt, call the native advisor, and deliver the brief:

| Runtime | Entrypoint | Registration Surface |
|---------|------------|----------------------|
| Claude | `claude/user-prompt-submit.ts` | `.claude/settings.local.json` |
| Gemini | `gemini/user-prompt-submit.ts` | `.gemini/settings.json` `BeforeAgent` |
| Copilot | `copilot/user-prompt-submit.ts` | SDK `onUserPromptSubmitted` or wrapper hook config |
| Codex | `codex/user-prompt-submit.ts` | `~/.codex/hooks.json` (`UserPromptSubmit`) with `[features].codex_hooks = true`; prompt-wrapper fallback available |

OpenCode delivers the advisor via `.opencode/plugins/spec-kit-skill-advisor.js` + `.opencode/skill/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs`, which imports the stable native compat entrypoint. The default prompt-time threshold contract is `0.8` (confidence) / `0.35` (uncertainty).

Packet 014 unified the threshold/render contract across OpenCode and Codex: both now use the shared `renderAdvisorBrief(...)` path and the shared builder/timeout/threshold contract. Diagnostics for all runtime hook surfaces persist to bounded JSONL sinks under the temp metrics root so `advisor_validate` analysis can read them back across processes.

Operator contract: `../../references/hooks/skill-advisor-hook.md`.

### 1.3 In-Process Helper Modules

Helper modules exported via `index.ts`:

- `memory-surface.ts`: context extraction, constitutional/triggered memory surfacing, lifecycle hook helpers, and constitutional cache management.
- `mutation-feedback.ts`: post-mutation feedback payloads and hint strings for cache clear results and tool cache invalidation.
- `response-hints.ts`: auto-surface hint injection plus MCP JSON envelope metadata and token-count synchronization.

This in-process layer is a utility surface for memory-aware context surfacing and UX feedback metadata — distinct from the runtime hook scripts above, which run as external processes triggered by the host runtime. Subsection 1.1 (startup) and 1.2 (prompt-time) are the operator-facing hook registration surfaces.

See `claude/README.md` for details on the Claude-side wiring and `references/config/hook_system.md` for the canonical cross-runtime registration matrix.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:implemented-state -->
## 2. IMPLEMENTED STATE


Main exports (camelCase):
- `extractContextHint(args)`
- `getConstitutionalMemories()`
- `clearConstitutionalCache()`
- `autoSurfaceMemories(contextHint)`
- `autoSurfaceAtToolDispatch(toolName, toolArgs, options)`
- `autoSurfaceAtCompaction(sessionContext, options)`
- `MEMORY_AWARE_TOOLS`
- `buildMutationHookFeedback(operation, hookResult)`
- `appendAutoSurfaceHints(result, autoSurfacedContext)`
- `syncEnvelopeTokenCount(envelope)`
- `serializeEnvelopeWithTokenCount(envelope)`

Data shape:
- `extractContextHint(args)` pulls the first usable string from `input`, `query`, `prompt`, `specFolder`, or `filePath`, and falls back to joining `concepts[]` when present.
- auto-surface output includes `constitutional`, `triggered`, `surfaced_at`, and `latencyMs`.
- post-mutation runtime first produces `MutationHookResult` via `runPostMutationHooks()` in `../handlers/mutation-hooks.ts`, then `buildMutationHookFeedback()` maps that into the public `postMutationHooks` payload used by mutation responses.
- `MutationHookResult` includes `latencyMs`, `triggerCacheCleared`, `constitutionalCacheCleared`, `graphSignalsCacheCleared`, `coactivationCacheCleared`, `toolCacheInvalidated`, and `errors`.
- public `postMutationHooks` data includes `operation`, `latencyMs`, `triggerCacheCleared`, `constitutionalCacheCleared`, `graphSignalsCacheCleared`, `coactivationCacheCleared`, and `toolCacheInvalidated`.
- auto-surface response hints enrich the MCP JSON envelope `hints` and `meta.autoSurface`.
- `MEMORY_AWARE_TOOLS` currently includes `memory_context`, `memory_search`, `memory_match_triggers`, `memory_list`, `memory_save`, and `memory_index_scan`.


<!-- /ANCHOR:implemented-state -->
<!-- ANCHOR:hardening-notes -->
## 3. HARDENING NOTES


- Constitutional cache uses a short TTL (60s) to reduce DB churn.
- Trigger matching uses fast phrase matching and returns empty/null safely on failures.
- Hook output remains compatible with current formatter and tool response contracts.


<!-- /ANCHOR:hardening-notes -->
<!-- ANCHOR:related -->
## 4. RELATED


- `../handlers/memory-triggers.ts`
- `../lib/parsing/trigger-matcher.ts`
- `../core/README.md`
<!-- /ANCHOR:related -->
