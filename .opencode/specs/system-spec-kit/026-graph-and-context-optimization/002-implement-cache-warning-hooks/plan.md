---
title: "Implementation Plan: Cache-Warning Hook System [template:level_3/plan.md]"
description: "Sequential 6-phase implementation of cache-expiry warning hooks with replay isolation, env kill-switches, and prototype-only gating. Build order: schema → harness → Stop writer → state seam validation → SessionStart estimator → UserPromptSubmit hook."
trigger_phrases:
  - "cache warning plan"
  - "hook implementation plan"
  - "phase build order"
  - "replay harness"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: Cache-Warning Hook System

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js >=18) |
| **Framework** | Claude Code hook protocol |
| **Storage** | `${os.tmpdir()}/speckit-claude-hooks/<project-hash>/<session-hash>.json` |
| **Testing** | Replay harness (Phase B deliverable) |

### Overview

This implementation is a strict six-phase prototype that makes cache expiry visible without collapsing the existing hook ownership model. The build order is intentional: land deterministic shared state first, prove replay isolation second, then add warning behavior in ascending UX risk order so the highest-risk `UserPromptSubmit` surface ships last [F5][F19][F20][F24] [SOURCE: spec.md §4; research.md §4].

The prototype constraint is non-negotiable. Every new behavior stays behind env kill-switches, `compact-inject.ts` remains untouched as a warning owner, and all warning/cost language must stay qualitative where the research says accounting precision is not locally proven [F6][F8][F21][F24] [SOURCE: spec.md §6; research.md §4].

### Sequential Build Order

| Phase | Name | Why It Must Happen Here |
|-------|------|-------------------------|
| **A** | Shared State Schema Extension | Later phases need a deterministic `lastClaudeTurnAt` contract before any warning logic can be trusted [F19] [SOURCE: research.md §4]. |
| **B** | Replay Harness with Isolation | Validation is not credible until replay is isolated from live temp state and autosave side effects [F20][F24] [SOURCE: research.md §4]. |
| **C** | Stop Hook Timestamp Writer | Stop is the canonical post-turn writer, so it must seed the new timestamp before read-side warning features land [F4] [SOURCE: research.md §4]. |
| **D** | Shared Hook-State Seam Validation | The shared seam must be proven before more UX-facing read paths depend on it [F7] [SOURCE: research.md §4]. |
| **E** | SessionStart Resume Cost Estimator | Resume copy belongs in `session-prime.ts`, but only after the seam exists and is validated [F6][F7] [SOURCE: research.md §4]. |
| **F** | UserPromptSubmit Warning Hook | This is the highest-risk flow-changing hook, so it lands last after the supporting data and replay scaffolding exist [F5][F24] [SOURCE: research.md §4]. |

<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] `spec.md` is complete and remains the source of truth for scope, requirements, and risk framing [SOURCE: spec.md §3; §4; §10].
- [ ] Research findings F4-F8, F19-F20, and F24 are cited in the plan anywhere they drive sequencing or architecture [SOURCE: research.md §4].
- [ ] The replay-harness shape is designed before Phase C starts, including fixture structure, per-run `TMPDIR`, autosave suppression, cleanup, and side-effect detection [F20][F24] [SOURCE: research.md §4].
- [ ] The env kill-switch contract is defined before any warning copy or soft-block behavior is implemented [F5][F6][F24] [SOURCE: spec.md §4; research.md §4].
- [ ] The boundary rule is explicit: no warning ownership moves into `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts` [F8] [SOURCE: spec.md §3; research.md §4].
- [ ] The build pipeline is understood end-to-end: source under `.opencode/skill/system-spec-kit/mcp_server/**/*.ts`, outputs under `.opencode/skill/system-spec-kit/mcp_server/dist/`, and runtime commands pointed at `dist/hooks/claude/*.js` [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tsconfig.json; .opencode/skill/system-spec-kit/mcp_server/package.json; .claude/settings.local.json].

### Definition of Done

- [ ] All six phases compile cleanly under `cd .opencode/skill/system-spec-kit/mcp_server && npm run typecheck`.
- [ ] Replay harness coverage exists for each phase deliverable, including at least one fixture path that exercises the phase-specific behavior [SOURCE: spec.md §5].
- [ ] Replay runs enforce `sideEffectsDetected.length === 0` for all expected-pass scenarios [F24] [SOURCE: spec.md §5; research.md §4].
- [ ] The defaults remain safe: warning surfaces can be disabled without code changes, and observe-only behavior remains the default posture where possible [F5][F6][F24] [SOURCE: spec.md §4; §6; research.md §4].
- [ ] `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts` remains unchanged [F8 REJECTED] [SOURCE: spec.md §3; research.md §4].
- [ ] `.opencode/skill/system-spec-kit/scripts/spec/validate.sh ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks" --strict` passes after plan/tasks/checklist/decision-record updates are complete [SOURCE: spec.md §3].

### Quality Non-Negotiables

- No phase may be declared complete if replay depends on live temp state or live autosave output [F24] [SOURCE: research.md §4].
- No phase may add precise savings claims beyond the heuristic allowance already accepted in the spec [F6][F21][F22] [SOURCE: spec.md §6; research.md §4; §10].
- No phase may widen scope into transcript auditing, dashboard work, or cross-runtime rollout [SOURCE: spec.md §3].
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Architecture Findings

The current Claude hook surface already has three active entry points plus one clear opening for the new prototype hook. `compact-inject.ts` handles `PreCompact` and silently caches recovery payloads; `session-prime.ts` handles `SessionStart` and emits stdout sections by `source`; `session-stop.ts` handles async `Stop` processing and owns token snapshots, spec-folder detection, summary extraction, and autosave; Phase F adds a new `user-prompt-submit.ts` pre-send surface rather than overloading an existing handler [F4][F5][F6][F8] [SOURCE: research.md §4; .opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md].

### Hook Surface Diagram

```text
                             Claude Code Hook Events
                                      |
      -------------------------------------------------------------------
      |                          |                         |             |
      v                          v                         v             v
PreCompact                  SessionStart                 Stop     UserPromptSubmit
compact-inject.ts           session-prime.ts        session-stop.ts   user-prompt-submit.ts
      |                          |                         |             |
      | writes pendingCompactPrime| reads shared state     | writes      | reads/writes
      | only                      | emits stdout           | metrics     | cacheWarning ack
      v                          v                         v             v
                 ${os.tmpdir()}/speckit-claude-hooks/<project-hash>/<session-hash>.json
                                      ^
                                      |
                              hook-state.ts seam

Boundary:
- compact-inject.ts = cache builder / mitigation surface only
- session-prime.ts = startup/resume/clear/compact stdout owner
- session-stop.ts = post-turn state writer + autosave owner
- user-prompt-submit.ts = stale-cache pre-send warning owner
```

### Shared Seam

`hook-state.ts` is the architectural seam because all existing Claude hook behaviors already converge on its temp-file contract and atomic save path. The important properties are:

- State directory derives from `tmpdir()` plus project hash, so replay isolation can redirect state by overriding `TMPDIR` per child process [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts].
- Session filenames are SHA-256 hashes of `sessionId`, so multi-session tests can coexist safely under one isolated root [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts].
- `saveState()` writes to `*.tmp` and `renameSync()`s into place, which is the existing atomic-save guarantee that Phase D must preserve [F7] [SOURCE: research.md §4; .opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts].
- `updateState()` seeds defaults and shallow-merges the patch, so new top-level fields can be added without introducing a schema version or migration layer [F19] [SOURCE: research.md §4; .opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts].

### HookState Schema Delta

| Field | Current Type | New Type / Change | Owner | Purpose |
|-------|--------------|-------------------|-------|---------|
| `claudeSessionId` | `string` | unchanged | existing seam | Session identity |
| `speckitSessionId` | `string` | unchanged | existing seam | Reserved Spec Kit session mapping |
| `lastSpecFolder` | `string \| null` | unchanged | Stop / SessionStart | Session continuity |
| `sessionSummary` | `{ text: string; extractedAt: string } \| null` | unchanged | Stop | Autosave input |
| `pendingCompactPrime` | `{ payload: string; cachedAt: string; payloadContract?: SharedPayloadEnvelope \| null } \| null` | unchanged | PreCompact / SessionStart | Compaction recovery seam |
| `metrics` | `{ estimatedPromptTokens: number; estimatedCompletionTokens: number; lastTranscriptOffset: number }` | unchanged | Stop / SessionStart | Resume estimator input |
| `lastClaudeTurnAt` | not present | `string \| null` | Stop writer, SessionStart/UserPromptSubmit readers | Deterministic idle-gap anchor [F19] [SOURCE: research.md §4]. |
| `cacheWarning` | not present | `{ thresholdMinutes: number; lastAckAt: string \| null; warningsEmitted: number } \| null` | UserPromptSubmit primary owner, SessionStart read-only consumer | Warning suppression and observability seam [F5][F7] [SOURCE: research.md §4]. |
| `createdAt` | `string` | unchanged | existing seam | Creation timestamp |
| `updatedAt` | `string` | unchanged | existing seam | Last persisted write timestamp |

### Dependency Findings

#### Import map by hook

| File | Imports from shared seam | Other direct imports | Implication for this plan |
|------|--------------------------|----------------------|---------------------------|
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts` | `parseHookStdin`, `hookLog`, `truncateToTokenBudget`, `withTimeout`, budgets; `ensureStateDir`, `updateState` | `mergeCompactBrief`, `autoSurfaceAtCompaction`, payload-contract helpers | Do not change its responsibility; only rely on its existing `updateState()` use for seam validation [F8] [SOURCE: research.md §4]. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` | `parseHookStdin`, `hookLog`, `formatHookOutput`, `truncateToTokenBudget`, budget helpers, pressure helper; `ensureStateDir`, `loadState`, `readCompactPrime`, `clearCompactPrime` | dynamic import for `startup-brief.js` | Resume estimate can be implemented entirely in this file without changing startup/compact/clear routing [F6] [SOURCE: research.md §4]. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts` | `parseHookStdin`, `hookLog`, `withTimeout`, timeout constant; `ensureStateDir`, `loadState`, `updateState`, `cleanStaleStates` | `spawnSync`, transcript parser, cost estimator | Timestamp write belongs here because it already owns transcript-driven post-turn writes and autosave ordering [F4] [SOURCE: research.md §4]. |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts` | `parseHookStdin`, `hookLog`, `formatHookOutput`; `loadState`, `updateState` | likely no additional dependencies beyond stdlib time math | New hook should stay lightweight and avoid transcript rereads or new network dependencies [F5][F24] [SOURCE: spec.md §7; research.md §4]. |

#### What `shared.ts` already exports for Phase F

`shared.ts` already exposes everything the new hook needs: `parseHookStdin()` for raw JSON input, `hookLog()` for stderr-only diagnostics, `formatHookOutput()` plus `OutputSection` for stdout sections, and `withTimeout()` with `HOOK_TIMEOUT_MS` for parity with the existing hooks [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts].

#### Downstream consumers of `HookState` shape stability

- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts` reads `lastSpecFolder`, `metrics`, and `pendingCompactPrime`, so new fields must be additive only.
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts` and `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/compact-inject.ts` both rely on `updateState()`, so shallow merge behavior must remain stable.
- `.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts`, and `.opencode/skill/system-spec-kit/mcp_server/tests/token-snapshot-store.vitest.ts` construct or validate `HookState` directly and must be updated alongside the interface.

#### `parseHookStdin()` and UserPromptSubmit input format

The parser dependency is intentionally small: `parseHookStdin()` only requires valid JSON on stdin and does not enforce a schema beyond `HookInput` plus `[key: string]: unknown` [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts]. That means:

- `session_id` is the only field Phase F must treat as mandatory, because state lookup cannot happen without it.
- `prompt_text` can be treated as optional metadata for future UX or logging, not as a gating input, until the actual Claude `UserPromptSubmit` payload is fixture-proven.
- `source` is currently modeled only for `SessionStart`; the new hook should not depend on it being present.
- The replay harness should use raw event JSON fixtures so the actual contract stays visible and testable rather than being smuggled through ad hoc mocks [F20][F24] [SOURCE: research.md §4].

### Build Pipeline Notes

The build pipeline is already compatible with this feature, but the placement of new files matters:

- `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json` compiles `**/*.ts` into `./dist`, excludes `tests/**/*.vitest.ts`, and does not exclude `.opencode/skill/system-spec-kit/mcp_server/test/**/*.ts` [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tsconfig.json].
- `.opencode/skill/system-spec-kit/mcp_server/package.json` exposes `npm run build` as `tsc --build` and `npm run typecheck` as `tsc --noEmit --composite false -p tsconfig.json` [SOURCE: .opencode/skill/system-spec-kit/mcp_server/package.json].
- `.claude/settings.local.json` executes Node against compiled files under `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/*.js`, so source edits are insufficient until the `dist/` mirror is rebuilt [SOURCE: .claude/settings.local.json].
- Because `test/hooks/replay-harness.ts` is not under `tests/`, it can compile into `dist/test/hooks/replay-harness.js` and be imported by Vitest files in `tests/` or used by spawned child-process tests. This is the main reason to follow the spec's requested location rather than forcing the harness into `tests/`.

### Test Pattern Findings

The repo already has hook-adjacent tests and temp-dir discipline that the replay harness should copy rather than reinvent:

- Existing hook tests use Vitest in `.opencode/skill/system-spec-kit/mcp_server/tests/` and import compiled-path JS module specifiers like `../hooks/claude/session-stop.js` [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop.vitest.ts].
- Transcript fixtures are currently lightweight raw files, often newline-delimited text or `.jsonl` paths written to temp dirs via `mkdtempSync(join(tmpdir(), 'prefix-'))` [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop.vitest.ts].
- State seam tests use real `ensureStateDir()`, `saveState()`, `loadState()`, and `updateState()` helpers against temp-backed files rather than deep mocks [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts].
- Cleanup convention is `rmSync(dir, { recursive: true, force: true })`, usually in `afterEach()` or `finally`, which should be mirrored in the harness [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop.vitest.ts; .opencode/skill/system-spec-kit/mcp_server/tests/README.md].
- The repo explicitly documents a macOS `TMPDIR=.tmp/vitest-tmp npx vitest run` workaround, so the harness should keep `TMPDIR` injectable rather than hard-coded [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tests/README.md].

Replay fixtures should stay simple: `stdin.json` for every hook, optional `transcript.jsonl` for Stop/PreCompact, optional `seed-state.json` for SessionStart or UserPromptSubmit, and optional `expected.json` for assertions.

### Boundary Rule (CRITICAL)

`compact-inject.ts` stays untouched. Cache warning never lives in PreCompact ownership, even if `/compact` remains the mitigation the warning recommends [F8 REJECTED] [SOURCE: spec.md §3; research.md §4].
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

These phases are strictly sequential. Do not start a phase until the previous phase has passed its stated acceptance criteria and replay-harness validation.

### Phase A — Shared State Schema Extension [F19 PREREQUISITE]

**Goal**: Extend the existing `HookState` contract with deterministic idle-gap and warning-ack fields so later phases have a stable seam [F19] [SOURCE: research.md §4].

**Files touched**: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/hook-state.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/hook-state.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/session-token-resume.vitest.ts`.

**API changes**:

- Add `lastClaudeTurnAt: string | null` to `HookState`.
- Add `cacheWarning: { thresholdMinutes: number; lastAckAt: string | null; warningsEmitted: number } | null` to `HookState`.
- Update `updateState(sessionId: string, patch: Partial<HookState>): HookState` default seed to initialize both new fields to `null`.
- Do not add a schema version field; `HookState` remains an internal contract [SOURCE: spec.md §4].

**Acceptance**:

- TypeScript compiles with the new interface and all direct `HookState` object literals updated.
- `updateState()` seeds `lastClaudeTurnAt: null` and `cacheWarning: null` when no prior state exists.
- `loadState()` still returns `null` for absent files and a complete JSON contract for present files.

**Validation via replay harness**: not applicable yet; use `tests/hook-state.vitest.ts`, `tests/session-token-resume.vitest.ts`, and `tests/token-snapshot-store.vitest.ts` as the pre-harness smoke suite.

**Dependencies**:

- None. This phase is the prerequisite for every later phase.

### Phase B — Replay Harness with Isolation [F20 + F24 PREREQUISITES]

**Goal**: Create a reusable hook replay harness that exercises hook entry points with isolated temp state, autosave suppression, and side-effect detection [F20][F24] [SOURCE: research.md §4].

**Files touched**: `.opencode/skill/system-spec-kit/mcp_server/test/hooks/replay-harness.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/hook-replay-harness.vitest.ts`, and the new replay fixtures under `.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/hooks/`.

**API changes**:

- Create `runHookReplay({ hookEntry, fixturePath, env, isolateAutosave: true }): Promise<{ stdout: string; stderr: string; finalState: HookState | null; sideEffectsDetected: string[] }>` in `.opencode/skill/system-spec-kit/mcp_server/test/hooks/replay-harness.ts`.
- The harness must support:
  - `hookEntry` as a compiled or source-resolved file path.
  - `fixturePath` pointing to a directory containing at least `stdin.json`.
  - `env` override injection.
  - `isolateAutosave` defaulting to `true`.

**Acceptance**:

- Harness can replay at least one Stop fixture and one SessionStart fixture successfully.
- With autosave isolation on, no replay run writes outside the per-run temp directory.
- Harness returns a structured result object with `stdout`, `stderr`, `finalState`, and `sideEffectsDetected`.
- Failing isolation assertions surface as explicit test failures, not warnings.

**Validation via replay harness**: `stop-minimal` proves basic state capture, `resume-stale` proves seed-state plus stdout capture, and one negative test proves the harness surfaces out-of-bound writes when autosave isolation is disabled.

**Dependencies**:

- Phase A must be complete so the harness can observe the final schema.

### Phase C — Stop Hook Timestamp Writer [F4]

**Goal**: Add deterministic last-turn timestamp capture to the existing Stop hook without changing its user-facing output [F4] [SOURCE: research.md §4].

**Files touched**: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-stop.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/hook-cache-warning-stop.vitest.ts`, and Stop replay fixtures under `.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/hooks/`.

**API changes**:

- In `main()` add `updateState(sessionId, { lastClaudeTurnAt: new Date().toISOString() })` after transcript parsing succeeds.
- Placement rule: after token snapshot handling, before `runContextAutosave(sessionId)`, so autosave can observe the new field if it reads the state [SOURCE: spec.md §4].
- No new stdout output and no change to `process.exit(0)` behavior.

**Acceptance**:

- A successful Stop replay produces a non-null ISO timestamp in `finalState.lastClaudeTurnAt`.
- Token metrics, summary extraction, and spec-folder detection still behave as before.
- No additional stdout is emitted by Stop.

**Validation via replay harness**: `stop-with-summary` must show a parseable `finalState.lastClaudeTurnAt`, preserved summary/metrics behavior, and zero side effects; a malformed-transcript fixture must show no crash and no misleading timestamp.

**Dependencies**:

- Phase A for schema field availability.
- Phase B for isolated replay evidence.

### Phase D — Shared Hook-State Seam Validation [F7]

**Goal**: Prove that the existing and new hook surfaces share one atomic JSON seam and that warning ownership stays out of PreCompact [F7][F8] [SOURCE: research.md §4].

**Files touched**: none required for source code; optional evidence scratch only if notes are needed under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks/scratch/`.

**API changes**:

- None. This is a validation-only phase.

**Acceptance**:

- Stop, SessionStart, PreCompact, and UserPromptSubmit all resolve to the same session state file naming scheme.
- No phase requires a second warning-specific state file.
- `compact-inject.ts` remains unchanged and uninvolved in warning decisions.

**Validation via replay harness**: replay Stop, inspect `finalState`, replay SessionStart against the same state, confirm one state file only under `${TMPDIR}/speckit-claude-hooks/<project-hash>/`, and confirm PreCompact still writes only `pendingCompactPrime` with `sideEffectsDetected.length === 0`.

**Dependencies**:

- Phase A for schema shape.
- Phase B for harness.
- Phase C for timestamp production.

### Phase E — SessionStart Resume Cost Estimator [F6]

**Goal**: Extend `handleResume(sessionId)` in `session-prime.ts` to warn about likely cache rebuild cost for stale resumed sessions without altering startup/compact/clear behavior [F6] [SOURCE: research.md §4].

**Files touched**: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/hook-session-start.vitest.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/hook-cache-warning-session-start.vitest.ts`, and resume fixtures under `.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/hooks/`.

**API changes**:

- Extend `handleResume(sessionId: string): OutputSection[]` to:
  - read `state.lastClaudeTurnAt`,
  - read `state.metrics.estimatedPromptTokens`,
  - compute elapsed idle time,
  - consult `process.env.CACHE_WARNING_RESUME_ESTIMATE_ENABLED !== 'false'`,
  - read `process.env.CACHE_WARNING_IDLE_THRESHOLD_MINUTES ?? 5`,
  - append a new `OutputSection` titled `Cache Rebuild Estimate` when conditions are met.
- Do not alter signatures or behavior of `handleStartup()`, `handleClear()`, or `handleCompact()`.

**Acceptance**:

- `source=resume` above threshold appends one warning section.
- `source=resume` below threshold does not append the section.
- `source=compact` and `source=clear` never show the section even if stale state exists [SOURCE: spec.md §4; §8].
- Existing startup and compact behavior remains byte-for-byte compatible except where new resume-only output appears.

**Validation via replay harness**: `resume-stale` must include `## Cache Rebuild Estimate` and `/compact`, `resume-fresh` must show only the normal continuity copy, and `clear`/`compact` fixtures must show no cache-warning section.

**Dependencies**:

- Phase A for `lastClaudeTurnAt`.
- Phase B for harness.
- Phase C so stale/fresh comparisons use real Stop-written timestamps.
- Phase D to confirm seam behavior before read-side UX lands.

### Phase F — UserPromptSubmit Warning Hook [F5, HIGHEST RISK, LAST]

**Goal**: Introduce a dedicated pre-send warning hook that warns on stale cache and optionally soft-blocks once per idle window [F5] [SOURCE: research.md §4].

**Files touched**: `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts`, `.opencode/skill/system-spec-kit/mcp_server/tests/hook-cache-warning-user-prompt-submit.vitest.ts`, UserPromptSubmit fixtures under `.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/hooks/`, `.claude/settings.local.json`, and `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js`.

**API changes**:

- Create a new hook entry file that imports:
  - `parseHookStdin`,
  - `hookLog`,
  - `formatHookOutput`,
  - `loadState`,
  - `updateState`.
- Implement this logic:

```text
1. Parse stdin (hook input format includes session_id, prompt_text, etc.)
2. Load hook state for sessionId
3. Compute idle gap = Date.now() - new Date(state.lastClaudeTurnAt).getTime()
4. threshold = (CACHE_WARNING_IDLE_THRESHOLD_MINUTES ?? 5) * 60 * 1000
5. If idle gap < threshold -> exit 0 silently
6. If state.cacheWarning?.lastAckAt set AND ack within current idle window -> exit 0 (already acknowledged)
7. If CACHE_WARNING_SOFT_BLOCK_ONCE === 'true' AND no ack:
   - Print warning to stdout
   - Set cacheWarning.lastAckAt = new Date().toISOString()
   - Exit code 2 (soft block)
8. Otherwise (observe-only):
   - Print warning to stdout
   - Increment warningsEmitted
   - Exit code 0
```

- Treat `prompt_text` as optional until fixture-proven; `session_id` remains the only required input dependency.
- Update `.claude/settings.local.json` to recommend a `UserPromptSubmit` hook entry pointing at `dist/hooks/claude/user-prompt-submit.js`, plus the three env keys defined by the spec [SOURCE: spec.md §4].

**Acceptance**:

- First stale send emits the warning.
- With `CACHE_WARNING_SOFT_BLOCK_ONCE=true`, first stale send exits with code `2` and a resend within the same idle window is not blocked again.
- With `CACHE_WARNING_SOFT_BLOCK_ONCE=false`, the hook runs observe-only: warning on stdout, exit `0`, no hard interruption.
- Missing `lastClaudeTurnAt` produces no warning and no crash.

**Validation via replay harness**: `user-prompt-stale` must show warning stdout and exit `2` when soft block is enabled, `user-prompt-ack` must prove no repeated block inside the same idle window, `user-prompt-observe-only` must warn and exit `0`, and every fixture must assert `sideEffectsDetected.length === 0`.

**Dependencies**:

- Phase A for schema.
- Phase B for replay harness.
- Phase C for real timestamp writes.
- Phase D for seam proof.
- Phase E for consistent threshold/env semantics across read-side warning surfaces.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

### Test Layers

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `hook-state.ts`, `shared.ts`, warning helper logic, threshold math | Vitest |
| Replay unit/integration | Individual hook entrypoints executed via replay harness with isolated fixtures | Vitest + child process replay harness |
| Cross-hook integration | Stop -> idle gap -> SessionStart -> UserPromptSubmit acknowledgement flow | Vitest + replay harness |
| Spec validation | Plan/tasks/checklist/decision docs remain validator-clean | `validate.sh --strict` |

### Unit Coverage Plan

- Phase A:
  - extend `tests/hook-state.vitest.ts` for new required fields,
  - confirm `updateState()` default seeds are correct.
- Phase C:
  - add Stop-focused tests around timestamp persistence ordering.
- Phase E:
  - add resume estimator tests for stale/fresh/malformed timestamp cases.
- Phase F:
  - add warning-copy, threshold, ack, and exit-code tests.

### Replay Harness Strategy

- Each hook module gets at least one fixture-driven replay test using the Phase B harness.
- Harness caller always sets a unique `TMPDIR`.
- Harness caller always requests autosave isolation unless a dedicated negative isolation test explicitly disables it.
- Replay fixtures remain file-backed so `parseHookStdin()` and transcript-path handling are exercised as they are in production.

### Integration Scenarios

1. **Stop -> stale resume -> send warning**
   - Replay Stop to write `lastClaudeTurnAt`.
   - Manipulate seed-state time or wait through a synthetic stale timestamp.
   - Replay SessionStart with `source=resume`.
   - Replay UserPromptSubmit against the same session.
   - Assert one shared state seam and expected warning outputs.

2. **Soft-block once -> resend acknowledged**
   - Replay stale UserPromptSubmit with soft block enabled.
   - Replay again with same session state.
   - Assert first exit code `2`, second exit code `0`, and no repeated block.

3. **Suppression paths**
   - `source=compact` must not emit resume estimate.
   - `source=clear` must not emit resume estimate.
   - Missing `lastClaudeTurnAt` must suppress both SessionStart estimate and UserPromptSubmit warning.

### Side-Effect Assertions

- Every harness-backed test must assert `sideEffectsDetected.length === 0`.
- Any attempted write outside the replay directory is a test failure, not a warning [F24] [SOURCE: research.md §4].
- Stop-hook autosave must be stubbed or disabled in all ordinary replay runs.

### Negative Test Matrix

| Case | Expected Behavior |
|------|-------------------|
| Missing `lastClaudeTurnAt` | No warning, no crash |
| Malformed timestamp | No warning, stderr diagnostic only |
| Future timestamp | Treat as no-op; avoid negative-gap warning |
| Missing `metrics.estimatedPromptTokens` | Resume estimate degrades to qualitative copy or suppresses numeric phrasing |
| Replay without autosave stub | Harness reports side-effect violation |
| PreCompact replay | No cache-warning behavior and no warning-owned state fields changed |

### Verification Commands

```bash
cd .opencode/skill/system-spec-kit/mcp_server

npx vitest run tests/hook-state.vitest.ts
npx vitest run tests/hook-session-stop.vitest.ts tests/hook-cache-warning-stop.vitest.ts
npx vitest run tests/hook-session-start.vitest.ts tests/hook-cache-warning-session-start.vitest.ts
npx vitest run tests/hook-cache-warning-user-prompt-submit.vitest.ts
npx vitest run tests/hook-replay-harness.vitest.ts

# If macOS temp-dir permissions are noisy:
TMPDIR=.tmp/vitest-tmp npx vitest run tests/hook-*.vitest.ts tests/hook-cache-warning-*.vitest.ts
```
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Type | Item | Why |
|------|------|-----|
| Build | TypeScript compiler (existing tsc setup) | Compile new TS source to dist JS |
| Runtime | Node.js >=18 (existing) | Hook runtime |
| Test | Replay harness (Phase B output) | Validates Phases C-F |
| Config | `.claude/settings.local.json` | Adds UserPromptSubmit hook entry + 3 env keys |
| External | None | Self-contained |

### Internal Constraints

- `hook-state.ts` remains the only shared state file contract [F7] [SOURCE: research.md §4].
- `shared.ts` remains the common parser/output/logging utility surface for hook entry points [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/claude/shared.ts].
- `session-stop.ts` remains the only phase allowed to introduce post-turn timestamp capture [F4] [SOURCE: research.md §4].
- `session-prime.ts` remains the only phase allowed to add resume-start warning copy [F6] [SOURCE: research.md §4].
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Phase F rollback:** Set `CACHE_WARNING_SOFT_BLOCK_ONCE=false` or remove `UserPromptSubmit` hook entry from `.claude/settings.local.json`.
- **Phase E rollback:** Set `CACHE_WARNING_RESUME_ESTIMATE_ENABLED=false`.
- **Phase C rollback:** Revert the single `updateState({ lastClaudeTurnAt })` call in `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-stop.ts`.
- **Phase A rollback:** Remove the two new fields from `HookState`; `updateState` already tolerates missing fields via spread merge.
- **Full rollback:** `git revert` the integration commit; harness and tests can stay as scaffolding.

### Rollback Safety Notes

- Because runtime commands point at `dist/hooks/claude/*.js`, rollback is incomplete until the compiled outputs are reverted or rebuilt to match source.
- Phase B harness code is safe to leave behind even if warning behavior is rolled back; it remains useful for future hook validation.
- Any rollback that removes the `UserPromptSubmit` hook entry must preserve valid JSON in `.claude/settings.local.json`.
<!-- /ANCHOR:rollback -->

## 8. AI EXECUTION PROTOCOL

### Pre-Task Checklist

- [ ] Read `spec.md` and `research.md` before any code change.
- [ ] Confirm spec folder is `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/002-implement-cache-warning-hooks/`.
- [ ] Verify Phase A schema extension landed before starting any later phase.
- [ ] Verify Phase B harness exists and isolation passes a smoke test before running any Phase C-F validation.
- [ ] No `compact-inject.js` modifications in any phase.

### Task Execution Rules

| Rule ID | Rule | Enforcement |
|---------|------|-------------|
| TASK-SEQ | Phases A->B->C->D->E->F MUST run in order; no parallel phases | Hard block at each phase boundary |
| TASK-SCOPE | Each phase touches ONLY the files listed in its "Files touched" subsection | Editor-side scope lock |
| TASK-PROTO | All new behavior gated by env kill-switches with safe defaults | Code review check |
| TASK-ISOLATE | All replay tests run in unique TMPDIR with autosave stub | Harness assertion |
| TASK-NOREPL | Never modify `compact-inject.js` | Hard block |

### Status Reporting Format

After each phase, report:

```text
PHASE [A-F] STATUS=[done|blocked|partial]
FILES_CHANGED=[list]
HARNESS_RESULT=[pass|fail|n/a]
SIDE_EFFECTS_DETECTED=[count]
NEXT_PHASE=[letter or done]
```

### Blocked Task Protocol

If a phase cannot complete:

1. STOP - do not proceed to the next phase.
2. Document the blocker in `scratch/phase-[X]-blocker.md`.
3. Cite the failing assertion or compiler error verbatim.
4. Propose 2 alternatives, request user decision.
5. Do NOT skip the phase or apply a workaround.

### Implementation Discipline

- Rebuild `dist/` before any replay test run that targets a CLI-registered hook file.
- Prefer adding new Vitest files over overloading broad unrelated suites.
- Keep warning text exact unless `spec.md` is amended.
- When in doubt about hook input shape, add a fixture that shows the raw event JSON rather than guessing from memory.

## 9. SUCCESS METRICS

- All 6 phases compile with `tsc --noEmit`.
- Replay harness covers >=1 fixture per phase.
- Zero side-effect violations across the test suite.
- `validate.sh --strict` passes on this spec folder.
- Defaults ship the feature in observe-only mode (soft block disabled by default).

### Additional Completion Metrics

- One shared state seam is proven across Stop, SessionStart, PreCompact, and UserPromptSubmit.
- No `compact-inject.ts` diff appears in the implementation branch.
- Resume estimate copy appears only on stale resumed sessions and nowhere else.
- First stale send blocks at most once per idle window when soft-block mode is enabled.

## 10. RISK MATRIX (mirror from spec.md §10)

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | `UserPromptSubmit` warning UX is still explicitly unshipped and may behave poorly under real send-flow conditions [F5] [SOURCE: research.md §4]. | High | Medium | Keep prototype-only, gate with env flags, and require replay coverage before rollout. |
| R-002 | Replay evidence is invalid if autosave or temp-state side effects leak into test runs [F24] [SOURCE: research.md §4]. | High | High | Make isolation mandatory in Phase B and fail tests when boundaries are crossed. |
| R-003 | Resume warning estimate can imply false precision because cached-token rebuild cost is only heuristic [F6] [SOURCE: research.md §4]. | Medium | High | Label the output as an estimate, suppress outside `source=resume`, and avoid savings claims. |
| R-004 | Shared-state schema drift could desynchronize Stop writer, SessionStart estimator, PreCompact seam, and `UserPromptSubmit` acknowledgement logic [F7][F19] [SOURCE: research.md §4]. | High | Medium | Keep one contract in `hook-state.ts` and validate all four entry points together in Phase D. |
| R-005 | Boundary blur in `compact-inject.js` would create overlapping ownership and still miss resumed sessions [F8] [SOURCE: research.md §4]. | Medium | Medium | Enforce "no warning ownership in PreCompact" as a hard scope rule. |
| R-006 | Source arithmetic is not ledger-grade because the source preserves denominator mismatches and inconsistent totals [F13][F21] [SOURCE: research.md §4]. | Low | Certain | Frame source economics qualitatively, preserve discrepancies explicitly, and do not cite the post's totals as settled accounting. |
| R-007 | Remedy bundle is not net-costed, so the mitigation path could add overhead that erodes claimed savings [F22] [SOURCE: research.md §10]. | Medium | High | Claim reduced surprise only; defer savings language until local measurement is complete. |
| R-008 | TS-to-dist build drift could leave stale `dist/hooks/claude/*.js` after source edits. | Medium | Medium | Rebuild via the existing `npm run build` / `tsc --build` command before any replay test run and before validating `.claude/settings.local.json` wiring [SOURCE: .opencode/skill/system-spec-kit/mcp_server/package.json; .claude/settings.local.json]. |

### Risk Prioritization Notes

- The operational critical path is R-002 -> R-004 -> R-001. If replay isolation is weak, seam validation is weak; if seam validation is weak, the highest-risk UX hook should not ship.
- R-008 is implementation-specific but easy to miss because the runtime points at compiled JS, not source TS.
