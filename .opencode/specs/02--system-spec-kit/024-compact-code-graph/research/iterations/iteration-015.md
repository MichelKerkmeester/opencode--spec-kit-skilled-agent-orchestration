# Iteration 015 — Cross-Runtime Testing And Token Tracking Strategy

**Focus:** Design the automated test matrix, runtime-detection model, and token-tracking storage plan for the hybrid hook system.
**Status:** complete
**newInfoRatio:** 0.62
**Novelty:** This pass connects the packet's hook/tool architecture to existing MCP telemetry and session primitives, and it updates the runtime-capability picture with current official docs rather than older repo assumptions.

---

## Executive Summary

The right shape is a **capability-based test harness with runtime-specific fixtures**, not four disconnected runtime suites. Claude Code should remain the only runtime with first-class hook automation in v1 because that is what this packet scopes, but the implementation should not hardcode "all other runtimes lack hooks" as a permanent truth. As of **March 29, 2026**, current official docs show that **GitHub Copilot CLI** and **Gemini CLI** both document hook systems. That means the current packet should frame Codex/Copilot/Gemini as **tool-fallback by project policy for v1**, not as ecosystem-wide impossibility.

For token tracking, we should **reuse the existing SQLite-first telemetry posture** instead of inventing a separate sidecar store. The MCP server already has a durable `consumption_log` table for query/session usage telemetry, and retrieval telemetry already accepts a normalized `tokenUsageRatio`. Claude Code's Stop hook gives enough context to locate and parse the session transcript, but it does **not** give us a clean "here are the final token totals" contract at the MCP boundary. So the safest design is:

1. Claude Stop hook script parses transcript usage outside the MCP core.
2. It writes **normalized token snapshot rows** into SQLite.
3. Retrieval handlers can read the latest session ratio and feed `tokenUsageRatio` into existing telemetry and pressure logic.
4. A dashboard UI should stay out of scope for now; add SQL-backed reporting first.

---

## Runtime Reality Check

The packet spec is clear about the intended v1 behavior:

- Claude Code gets `SessionStart`, `PreCompact`, and `Stop` hooks.
- All runtimes get tool-based fallback via `memory_match_triggers()` and `memory_context({ mode: "resume" })`.
- Dashboard UI is explicitly future work.

That is still the correct **shipping scope** for this packet. The important correction is how we describe non-Claude runtimes:

| Runtime | Current v1 packet policy | Current evidence status | Recommendation |
|--------|---------------------------|-------------------------|----------------|
| Claude Code | Full hooks | Official hooks docs confirmed, including Stop-hook input fields | Ship hook path now |
| Codex CLI | Tool fallback | No official hook surface confirmed in this pass | Keep fallback-only for now |
| Copilot CLI | Tool fallback | Official docs now show hooks support | Keep fallback-only in v1, but mark as future adapter candidate |
| Gemini CLI | Tool fallback | Official docs now show hooks support | Keep fallback-only in v1, but mark as future adapter candidate |

Practical implication: the runtime detector should produce **two outputs**, not one:

- `runtime`: `claude-code | codex-cli | copilot-cli | gemini-cli | unknown`
- `hookPolicy`: `enabled | disabled_by_scope | unavailable | unknown`

That keeps the implementation honest if Copilot/Gemini hook adapters are added later.

---

## Recommended Test Strategy

### 1. Test Layers

Use three layers that mirror existing MCP test patterns:

1. **Pure unit tests**
   - Runtime detection precedence
   - Hook payload parsing
   - Transcript token extraction
   - Token normalization and ratio calculation
   - Budget/truncation logic

2. **In-memory SQLite integration tests**
   - Token snapshot writes
   - Session resume/crash recovery joins
   - Consumption telemetry correlation
   - Multi-session continuity behavior

3. **Runtime contract smoke tests**
   - Claude hook fixture -> script -> mocked MCP round trip
   - Codex/Copilot/Gemini tool-fallback fixtures -> Gate 1 / resume flow
   - One manual verification run per runtime profile before closeout

This matches the repo's current testing style:

- pure logic and env-gating tests in `startup-checks.vitest.ts` and `dynamic-token-budget.vitest.ts`
- hook-budget and hook-behavior coverage in `dual-scope-hooks.vitest.ts`
- in-memory SQLite telemetry tests in `consumption-logger.vitest.ts`
- resume/session continuity tests in `continue-session.vitest.ts`, `session-lifecycle.vitest.ts`, and `crash-recovery.vitest.ts`

### 2. Scenario Matrix

| Scenario | Primary path | Automated coverage | Core assertions |
|--------|---------------|--------------------|-----------------|
| 1. Claude Code with hooks | `SessionStart` + `PreCompact` + `Stop` | hook-fixture unit tests, mocked MCP integration, one manual smoke | hook payload parsed, correct MCP calls made, compaction output respects 4000-token budget, stop path persists token snapshot |
| 2. Codex CLI without hooks | tool fallback only | runtime-routing unit tests, fallback integration tests | runtime resolves to `codex-cli`, hook policy is `unavailable` or `disabled_by_scope`, Gate 1 trigger path works, resume path works without hook assumptions |
| 3. Copilot CLI without hooks in v1 | tool fallback by policy | runtime-routing tests plus policy gate tests | runtime resolves to `copilot-cli`, hooks are intentionally suppressed by policy, fallback path remains functional |
| 4. Gemini CLI without hooks in v1 | tool fallback by policy | runtime-routing tests plus policy gate tests | runtime resolves to `gemini-cli`, hooks are intentionally suppressed by policy, fallback path remains functional |
| 5. Context compaction recovery (Claude only) | `PreCompact` -> `autoSurfaceAtCompaction()` | hook-fixture tests, budget enforcement tests, recovery smoke | surfaced payload truncates cleanly, constitutional/trigger ordering is stable, no recursive memory-aware tool surfacing |
| 6. Session resume after crash/exit | `resetInterruptedSessions()` + `memory_context(resume)` + `CONTINUE_SESSION.md` | real SQLite fixture tests, resume/recovery integration tests | interrupted sessions become recoverable, resume reuses effective session, continuation artifact contains correct next step |
| 7. Multi-session context continuity | session lifecycle + working memory + token snapshots | in-memory DB tests plus cross-session aggregation tests | event counters continue, prompt context survives resume, token snapshots aggregate per session/spec without cross-session bleed |

### 3. Test Files To Add

Recommended new files:

- `tests/runtime-routing.vitest.ts`
- `tests/hook-session-start.vitest.ts`
- `tests/hook-precompact.vitest.ts`
- `tests/hook-stop-token-tracking.vitest.ts`
- `tests/cross-runtime-fallback.vitest.ts`
- `tests/token-snapshot-store.vitest.ts`
- `tests/session-token-resume.vitest.ts`

Recommended updates to existing files:

- extend `dual-scope-hooks.vitest.ts` for Claude-specific compaction fixture coverage
- extend `consumption-logger.vitest.ts` only if we add join metadata, not if token tracking gets its own table
- turn the TODO-heavy crash-recovery cases in `crash-recovery.vitest.ts` into real SQLite-fixture tests

### 4. Best Harness Pattern

The cleanest pattern is to define a **runtime fixture contract**:

```ts
interface RuntimeFixture {
  runtime: 'claude-code' | 'codex-cli' | 'copilot-cli' | 'gemini-cli';
  hookPolicy: 'enabled' | 'disabled_by_scope' | 'unavailable' | 'unknown';
  supports: {
    sessionStartHook: boolean;
    preCompactHook: boolean;
    stopHook: boolean;
    toolFallback: boolean;
  };
  input: {
    hookPayload?: Record<string, unknown>;
    userPrompt?: string;
    sessionId?: string;
  };
  expected: {
    mcpCalls: string[];
    tokenWrite: boolean;
    resumeMode: boolean;
  };
}
```

That makes Copilot/Gemini easy to promote later: update the fixture and policy, not the whole harness.

---

## Token Tracking Design

### 1. What We Already Have

The MCP server already persists telemetry in SQLite:

- `consumption_log` records `search`, `context`, and `triggers` events with `session_id`, latency, result counts, and free-form JSON metadata.
- retrieval telemetry already accepts a normalized `tokenUsageRatio`.
- `memory_context()` already computes token-pressure decisions using a caller-provided `tokenUsage` ratio plus runtime token budget metadata.

So the token design should extend this model rather than bypassing it.

### 2. What Claude Stop Hooks Give Us

Official Claude Code hooks docs currently show that Stop-hook input includes:

- `session_id`
- `transcript_path`
- `cwd`
- `hook_event_name`
- `stop_hook_active`
- `permission_mode`
- `last_assistant_message`

That is enough to:

1. identify the runtime session,
2. locate the transcript on disk,
3. guard against recursive Stop-hook execution,
4. hash or correlate the final assistant turn,
5. parse transcript usage data after the fact.

It is **not** enough to assume "the Stop hook payload itself contains final token totals." The safe contract is transcript-derived usage, not direct hook-field usage.

### 3. Recommended Storage Model

Do **not** overload `consumption_log` with raw token fields. Keep it focused on retrieval events.

Instead, add a dedicated table:

```sql
CREATE TABLE IF NOT EXISTS session_token_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  session_id TEXT NOT NULL,
  runtime TEXT NOT NULL,
  spec_folder TEXT,
  hook_event_name TEXT NOT NULL,
  transcript_path TEXT,
  cwd TEXT,
  permission_mode TEXT,
  parse_status TEXT NOT NULL,
  prompt_tokens INTEGER,
  completion_tokens INTEGER,
  cache_creation_tokens INTEGER,
  cache_read_tokens INTEGER,
  total_tokens INTEGER,
  token_usage_ratio REAL,
  estimated_cost_usd REAL,
  assistant_message_hash TEXT,
  captured_at TEXT NOT NULL,
  parser_version TEXT NOT NULL,
  metadata TEXT
);

CREATE INDEX IF NOT EXISTS idx_session_token_snapshots_session
  ON session_token_snapshots (session_id, captured_at DESC);

CREATE INDEX IF NOT EXISTS idx_session_token_snapshots_runtime
  ON session_token_snapshots (runtime, captured_at DESC);
```

Why snapshot rows instead of one mutable session row:

- Stop hooks can fire multiple times in the same session.
- Resume flows are easier to debug with append-only snapshots.
- Multi-session continuity reporting becomes a query problem, not an overwrite problem.

### 4. Data Flow

Recommended flow:

1. Claude Stop hook fires.
2. `session-stop.js` reads hook payload and checks `stop_hook_active`.
3. Script parses transcript usage from `transcript_path`.
4. Script writes one `session_token_snapshots` row.
5. Script optionally writes a lightweight correlation pointer into `consumption_log.metadata` on the next retrieval event.
6. Retrieval handlers load the latest `token_usage_ratio` for that session and pass it into existing pressure handling.

### 5. Ratio Semantics

Keep `tokenUsageRatio` normalized to `0.0-1.0`, matching current retrieval telemetry.

Recommended rule:

- numerator: latest known `total_tokens`
- denominator: runtime-specific context window ceiling

Store both:

- `total_tokens` for audit/reporting
- `token_usage_ratio` for live pressure behavior

The ratio is the operational signal. The totals are the observability signal.

### 6. Dashboard Recommendation

Skip the UI dashboard for this phase.

Instead, add:

- one SQL report or script summary by `session_id`, `runtime`, and `spec_folder`
- one future-facing read model or MCP tool only if operators actually need it

Reason:

- the packet spec already marks dashboard UI as future work
- current telemetry/reporting surfaces are retrieval/eval oriented, not session-token oriented
- the hard problem is reliable capture and normalization, not chart rendering

---

## Runtime Detection Approach

### 1. Detection Should Be Explicit First

Use a strict precedence order:

1. **Explicit runtime hint from launcher or hook script**
2. **Hook payload evidence**
3. **Runtime/profile mapping from repo conventions**
4. **Fallback heuristic**

Recommended interface:

```ts
interface RuntimeContext {
  runtime: 'claude-code' | 'codex-cli' | 'copilot-cli' | 'gemini-cli' | 'unknown';
  hookPolicy: 'enabled' | 'disabled_by_scope' | 'unavailable' | 'unknown';
  supports: {
    sessionStartHook: boolean;
    preCompactHook: boolean;
    stopHook: boolean;
    toolFallback: boolean;
  };
  agentDirectory: string | null;
  evidence: string[];
}
```

### 2. Repo-Native Signals To Reuse

The repo already has a runtime/profile mapping in `CLAUDE.md`:

- Claude profile -> `.claude/agents/`
- Codex CLI -> `.codex/agents/`
- Gemini CLI -> `.gemini/agents/`
- Copilot/default OpenCode profile -> `.opencode/agent/`

That mapping is a better first-party signal than brittle prompt-text heuristics.

Also, `startup-checks.ts` already models deterministic runtime snapshots using explicit fields (`nodeVersion`, `moduleVersion`, `platform`, `arch`) and compares them with a structured mismatch result. The runtime detector should use that same style: deterministic facts in, structured decision out.

### 3. Recommended Precedence

Proposed precedence:

1. `runtime` passed directly by hook wrapper or CLI wrapper
2. Claude hook payload present -> `claude-code`
3. agent-directory or config profile mapping
4. executable or env heuristic
5. `unknown` + tool fallback

Important edge case:

`.opencode/agent/` identifies the default OpenCode/Copilot-style profile bucket, but it does **not** disambiguate Copilot vs OpenCode by itself. If that distinction matters operationally, the launcher should pass an explicit runtime hint.

### 4. Policy Resolution

After runtime detection, apply packet policy:

| Runtime | Packet v1 policy |
|--------|-------------------|
| `claude-code` | hook path enabled |
| `codex-cli` | tool fallback |
| `copilot-cli` | tool fallback by scope |
| `gemini-cli` | tool fallback by scope |
| `unknown` | tool fallback, no hook assumptions |

That keeps the detection logic separate from product scope.

---

## Recommended Acceptance Criteria

The phase is ready when all of the following are true:

1. Claude hook fixtures cover `SessionStart`, `PreCompact`, and `Stop`.
2. Token snapshots are append-only, queryable, and session-scoped.
3. `memory_context()` can consume the latest session ratio without breaking existing telemetry shape.
4. Crash recovery tests move from TODO placeholders to real SQLite fixtures for the token/resume path.
5. Codex/Copilot/Gemini fallback tests prove there is no Claude-hook dependency in the universal recovery path.
6. Runtime detection returns both `runtime` and `hookPolicy`, with evidence attached for debugging.

---

## Dead Ends And Cautions

- I did **not** find current official Codex CLI hook documentation in this pass, so "Codex has no hooks" remains an inference, not a proven universal fact.
- The older packet framing "Copilot/Gemini without hooks" is already stale relative to current official docs. We should preserve the packet's v1 scope, but update the wording so future work is not built on a false capability model.
- Do not store full transcripts in SQLite. Store normalized usage plus small diagnostics only; keep transcripts on disk and parse them opportunistically.
- Do not bind token tracking to a dashboard before the capture contract is stable.

## Sources

- [SOURCE: specs/02--system-spec-kit/024-compact-code-graph/spec.md:5-24] — packet scope and hook/tool split
- [SOURCE: specs/02--system-spec-kit/024-compact-code-graph/spec.md:28-32] — intended hook-script architecture
- [SOURCE: specs/02--system-spec-kit/024-compact-code-graph/spec.md:58-66] — Stop-hook phase and dashboard out-of-scope statement
- [SOURCE: CLAUDE.md:237-246] — runtime/profile to agent-directory mapping
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:42-61] — memory-aware tool skip list and 4000-token hook budgets
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:136-185] — budget enforcement strategy for surfaced hook payloads
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:1-37] — existing SQLite telemetry types and event model
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/consumption-logger.ts:96-162] — `consumption_log` schema and fail-safe write path
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:61-67] — `tokenUsageRatio` in telemetry mode metadata
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/retrieval-telemetry.ts:248-261] — ratio normalization/clamping in `recordMode`
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:689-715] — resume-mode retrieval behavior
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:730-760] — trusted session resolution and effective session handling
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:801-814] — resume heuristics
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:1060-1148] — token budget, pressure policy, and session transition wiring
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:1099-1114] — startup crash-recovery behavior
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/startup-checks.ts:12-60] — deterministic runtime snapshot and mismatch pattern
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/dual-scope-hooks.vitest.ts:1-109] — current hook-oriented test style
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/consumption-logger.vitest.ts:1-133] — current SQLite telemetry fixture pattern
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/continue-session.vitest.ts:1-168] — current continue-session extraction tests
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/crash-recovery.vitest.ts:1-117] — current crash-recovery coverage and TODO gaps
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/session-lifecycle.vitest.ts:1-68] — current multi-session continuity contract
- [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/dynamic-token-budget.vitest.ts:1-140] — current env-gated token-budget test style
- [SOURCE: https://docs.anthropic.com/en/docs/claude-code/hooks (accessed 2026-03-29)] — current Claude Code hook events and Stop-hook input fields
- [SOURCE: https://docs.github.com/en/copilot/how-tos/copilot-cli/use-hooks (accessed 2026-03-29)] — current GitHub Copilot CLI hook support
- [SOURCE: https://geminicli.com/docs/hooks/ (accessed 2026-03-29)] — current Gemini CLI hook support
