---
title: "Unified context retrieval (memory_context)"
description: "Describes the L1 orchestration layer that auto-detects task intent and routes to the best retrieval strategy."
---

# Unified context retrieval (memory_context)

## 1. OVERVIEW

Describes the L1 orchestration layer that auto-detects task intent and routes to the best retrieval strategy.

When you ask the system a question, it figures out what kind of help you need and automatically picks the best way to find the answer. Think of it like a smart librarian who reads your request, decides whether you need a quick lookup or a deep research session and then fetches the right materials for you. Without this, you would have to manually tell the system how to search every time.

---

## 2. CURRENT REALITY

You send a query or prompt. The system figures out what you need. That is the core idea behind `memory_context`: an L1 orchestration layer that auto-detects your task intent and routes to the best retrieval strategy without you having to pick one.

Intent detection classifies your input into one of seven types (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and maps it to a retrieval mode. Five modes are available: auto (default, intent-detected routing), quick (trigger matching for fast lookups), deep (comprehensive semantic search across the full corpus), focused (intent-optimized with tighter filtering) and resume (session recovery targeting state, next-steps, summary and blocker anchors with full content included).

Each mode has a token budget. Quick gets 800 tokens. Focused gets 1,500. Deep gets 2,000. Resume gets 1,200. After retrieval, the orchestrator estimates token count (1 token per 4 characters) and enforces the budget by stripping lowest-scored results from the tail until the response fits. A dedicated `enforceTokenBudget()` function handles the truncation with detailed tracking of original and returned result counts. Auto-resume `systemPromptContext` injection now happens before that budget pass runs, so resume-mode context items count toward the advertised limit instead of being appended afterward and pushing the final envelope over budget. When your overall context is running high, a pressure policy kicks in. When the `tokenUsage` ratio exceeds 0.60, the system downgrades to focused mode. Above 0.80, it switches to quick mode. The pressure policy is gated by `SPECKIT_PRESSURE_POLICY` and subject to rollout percentage via `SPECKIT_ROLLOUT_PERCENT`. You can override the mode and intent manually, but the auto-detection handles most cases correctly.

When no `specFolder` is provided, automatic spec folder discovery attempts to identify the most relevant folder from the query text using a cached one-sentence description per spec folder. If the target folder can be identified from the description alone, the system avoids full-corpus search entirely. Discovery failure is non-fatal and falls through to the standard retrieval path. This feature runs behind the `SPECKIT_FOLDER_DISCOVERY` flag.

Session management is caller-scoped. Passing `sessionId` enables cross-turn deduplication and lets the handler resume an existing working-memory session. If you do not pass `sessionId`, the handler generates an ephemeral UUID for internal bookkeeping for that single call only. In resume mode, `systemPromptContext` is injected only when auto-resume is enabled, the effective mode resolves to `resume` and the caller supplied a reusable `sessionId`. Anonymous calls do not revive prior session context.

When `includeTrace` is enabled, `memory_context` also computes a trace-only `sessionTransition` payload and forwards it through the internal `memory_search` path. The contract is `trace.sessionTransition = { previousState, currentState, confidence, signalSources, reason? }`. Cold starts use `previousState: null`, the payload is omitted when trace is disabled, and this inference does not change retrieval routing beyond the existing mode-selection path.

Extended telemetry now records transition diagnostics alongside mode selection and pressure-override fallbacks for observability when enabled.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/memory-context.ts` | Handler | Context orchestration entry point: intent detection, mode selection, token budget enforcement, pressure policy |
| `mcp_server/handlers/memory-search.ts` | Handler | Search handler delegated to for deep/focused retrieval |
| `mcp_server/handlers/memory-triggers.ts` | Handler | Trigger handler delegated to for quick-mode retrieval |
| `mcp_server/lib/architecture/layer-definitions.ts` | Lib | Architecture layer enforcement |
| `mcp_server/lib/cognitive/pressure-monitor.ts` | Lib | Context pressure detection and mode downgrade thresholds |
| `mcp_server/lib/cognitive/working-memory.ts` | Lib | Working memory session integration and auto-resume context |
| `mcp_server/lib/eval/eval-logger.ts` | Lib | Evaluation event logger for search telemetry |
| `mcp_server/lib/response/envelope.ts` | Lib | Response envelope formatting |
| `mcp_server/lib/search/folder-discovery.ts` | Lib | Spec folder auto-discovery from query text |
| `mcp_server/lib/search/intent-classifier.ts` | Lib | Intent detection (7 types) and mode routing |
| `mcp_server/lib/search/search-flags.ts` | Lib | Feature flag registry (auto-resume, folder discovery, pressure policy) |
| `mcp_server/lib/search/session-transition.ts` | Lib | Session transition trace contract and injection helpers |
| `mcp_server/lib/search/vector-index.ts` | Lib | Vector index facade for DB access |
| `mcp_server/lib/session/session-manager.ts` | Lib | Session lifecycle management |
| `mcp_server/lib/telemetry/consumption-logger.ts` | Lib | Agent consumption logging |
| `mcp_server/lib/telemetry/retrieval-telemetry.ts` | Lib | Retrieval telemetry and transition diagnostics |
| `mcp_server/formatters/token-metrics.ts` | Formatter | Token estimation for budget enforcement |

### Tests

| File | Focus |
|------|-------|
| `mcp_server/tests/handler-memory-context.vitest.ts` | Context handler input/output |
| `mcp_server/tests/memory-context.vitest.ts` | Context integration tests |
| `mcp_server/tests/memory-context-eval-channels.vitest.ts` | Context eval channel coverage |
| `mcp_server/tests/intent-classifier.vitest.ts` | Intent classification accuracy |
| `mcp_server/tests/pressure-monitor.vitest.ts` | Pressure monitor tests |
| `mcp_server/tests/token-budget-enforcement.vitest.ts` | Token budget enforcement |
| `mcp_server/tests/session-manager.vitest.ts` | Session manager tests |
| `mcp_server/tests/folder-discovery.vitest.ts` | Folder discovery tests |

---

## 4. SOURCE METADATA

- Group: Retrieval
- Source feature title: Unified context retrieval (memory_context)
- Current reality source: FEATURE_CATALOG.md
