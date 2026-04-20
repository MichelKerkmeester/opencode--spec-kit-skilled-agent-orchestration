---
title: Skill Advisor Hook Reference
description: Operator contract for the Phase 020 proactive skill-advisor hook across Claude, Gemini, Copilot and Codex runtimes.
trigger_phrases:
  - "skill advisor hook reference"
  - "advisor hook setup"
  - "speckit advisor hook"
---

# Skill Advisor Hook Reference

This reference explains the Phase 020 skill-advisor hook as shipped by child packets 002 through 008. It is the operator-facing contract for setup, privacy, health checks, release gates and rollback.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

The skill-advisor hook runs the existing local advisor path at prompt time and injects a compact recommendation into runtime context. The hook does not replace skills. It routes users and agents toward the right skill before the turn proceeds.

The hook exists because explicit Gate 2 invocation was easy to miss. Before Phase 020, an agent had to remember to run:

```bash
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "request" --threshold 0.8
```

Phase 020 keeps that command as the fallback path. The primary path is now automatic:

1. Runtime receives a user prompt.
2. Runtime hook parses prompt JSON.
3. Hook calls `buildSkillAdvisorBrief(prompt, { runtime, workspaceRoot })`.
4. Shared renderer emits a short model-visible brief when a skill passes threshold.
5. Diagnostics write a prompt-free JSONL record.
6. Failure paths return `{}` or no decision and let the turn continue.

Authoritative shipped surfaces:

| Packet | Contract |
|--------|----------|
| [020/002 implementation summary](../../../../specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/002-shared-payload-advisor-contract/implementation-summary.md) | Shared-payload `advisor` producer, metadata whitelist and prompt-derived provenance rejection |
| [020/003 implementation summary](../../../../specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/003-advisor-freshness-and-source-cache/implementation-summary.md) | `getAdvisorFreshness()`, per-skill fingerprints, generation counter and JSON fallback |
| [020/004 implementation summary](../../../../specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/004-advisor-brief-producer-cache-policy/implementation-summary.md) | `buildSkillAdvisorBrief()`, prompt policy, HMAC cache, subprocess timeout and fail-open mapping |
| [020/005 implementation summary](../../../../specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/005-advisor-renderer-and-regression-harness/implementation-summary.md) | Shared renderer, 200-prompt parity, timing suite, metrics and privacy checks |
| [020/006 implementation summary](../../../../specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/006-claude-hook-wiring/implementation-summary.md) | Claude `UserPromptSubmit` adapter and `.claude/settings.local.json` registration |
| [020/007 implementation summary](../../../../specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/007-gemini-copilot-hook-wiring/implementation-summary.md) | Gemini and Copilot adapters plus 3-runtime parity |
| [020/008 implementation summary](../../../../specs/system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/008-codex-integration-and-hook-policy/implementation-summary.md) | Codex adapter, dynamic detector, Bash-only `PreToolUse` policy and prompt-wrapper fallback |

Key properties:

- Local first: the hook calls the existing repo advisor script and local skill graph.
- Short output: default brief cap is 80 token-estimate units, with 120 for ambiguity paths.
- Fail open: prompt handling continues when Python, SQLite or hook parsing fails.
- Prompt privacy: raw prompt text is not persisted in caches, metrics, diagnostics or health output.
- Cross-runtime parity: Claude, Gemini, Copilot and Codex share the renderer and parity fixtures.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:runtime-capability-matrix -->
## 2. RUNTIME CAPABILITY MATRIX

The table below reflects shipped child summaries 006, 007 and 008 plus the parity suite in `advisor-runtime-parity.vitest.ts`.

| Runtime | Transport | Config Location | SDK Required | Status | Notes |
|---------|-----------|-----------------|--------------|--------|-------|
| Claude | JSON `hookSpecificOutput.additionalContext` | `.claude/settings.local.json` | No | Live | Registered in 006, direct CLI smoke passed, interactive smoke deferred to T9 |
| Gemini | JSON `hookSpecificOutput.additionalContext` under `BeforeAgent` | `.gemini/settings.json` | No | Live | Registered in 007 as `speckit-user-prompt-advisor` |
| Copilot SDK | `onUserPromptSubmitted` return object with `additionalContext` | Runtime-specific SDK config | Yes | Live in code, SDK local smoke unavailable | 007 unit-tests SDK branch with dependency injection |
| Copilot wrapper | In-memory prompt wrapper fallback | `.github/hooks/superset-notify.json` or runtime wrapper config | No | Live fallback | Local checkout uses wrapper path when SDK packages are absent |
| Codex | JSON `hookSpecificOutput.additionalContext` | `.codex/settings.json` | No | Adapter live, registration shipped | `.codex/settings.json` points to the compiled Codex adapter |
| Codex fallback | Markdown-comment prompt wrapper | Wrapper command, only when detector reports `unavailable` | No | Live fallback | Rewritten prompt exists only in memory |

Evidence:

- 005 parity: `advisor-corpus-parity.vitest.ts` passed `200/200`.
- 007 parity: Claude, Gemini and Copilot variants matched five canonical fixtures.
- 008 parity: Claude, Gemini, Copilot and Codex matched five canonical fixtures.
- 008 follow-up: `.codex/settings.json` and `.codex/policy.json` are now present as the shipped registration surfaces.

---

<!-- /ANCHOR:runtime-capability-matrix -->
<!-- ANCHOR:setup-per-runtime -->
## 3. SETUP PER RUNTIME

Build the MCP server before enabling runtime hooks:

```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server run build
```

Use the repo root as the working directory for every command below. Each command changes to `git rev-parse --show-toplevel` first so nested shell launches still find the compiled hook.

### Claude

Claude uses `UserPromptSubmit` in `.claude/settings.local.json`. Child 006 registered this command:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js'",
            "timeout": 3
          }
        ]
      }
    ]
  }
}
```

Verification:

```bash
jq -r '.hooks.UserPromptSubmit[0].hooks[0].command' .claude/settings.local.json
```

Expected model-visible success shape:

```json
{
  "hookSpecificOutput": {
    "hookEventName": "UserPromptSubmit",
    "additionalContext": "Advisor: live; use sk-code-opencode 0.91/0.23 pass."
  }
}
```

No-op and failure cases emit `{}` with exit code `0`.

### Gemini

Gemini uses `BeforeAgent` in `.gemini/settings.json`. Child 007 registered `speckit-user-prompt-advisor` after the compact injection hook:

```json
{
  "hooksConfig": {
    "enabled": true
  },
  "hooks": {
    "BeforeAgent": [
      {
        "hooks": [
          {
            "name": "speckit-user-prompt-advisor",
            "type": "command",
            "command": "bash -c 'cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/gemini/user-prompt-submit.js'",
            "timeout": 3000
          }
        ]
      }
    ]
  }
}
```

Verification:

```bash
jq -r '.hooks.BeforeAgent[0].hooks[] | select(.name=="speckit-user-prompt-advisor") | .command' .gemini/settings.json
```

Gemini no-op behavior matches Claude: `{}` on skipped, disabled, parse-failed and fail-open paths.

### Copilot

Copilot prefers an SDK callback when the host runtime exposes `onUserPromptSubmitted`. The same adapter also supports a command wrapper fallback.

SDK branch:

```ts
import { handleCopilotSdkUserPromptSubmitted } from './dist/hooks/copilot/user-prompt-submit.js';

export async function onUserPromptSubmitted(input) {
  return handleCopilotSdkUserPromptSubmitted(input);
}
```

Command wrapper branch, illustrative only. For the exact shipped Copilot wrapper config, see [`../../../../../.github/hooks/superset-notify.json`](../../../../../.github/hooks/superset-notify.json):

```json
{
  "version": 1,
  "hooks": {
    "userPromptSubmitted": [
      {
        "type": "command",
        "bash": "/absolute/path/to/copilot-hook.sh userPromptSubmitted",
        "timeoutSec": 5
      }
    ]
  }
}
```

Notes:

- SDK packages were not installed in the 007 local checkout, so unit tests cover SDK behavior through dependency injection.
- The wrapper fallback writes no prompt to disk.
- The checked-in Copilot file delegates through an external `copilot-hook.sh` wrapper; use the linked repo file for parity checks and rollback work.
- If the wrapper also chains another local hook, keep advisor output first and make downstream hooks fail open.

### Codex

Codex code and tests shipped in child 008. The checked-in registration surfaces are [`../../../../../.codex/settings.json`](../../../../../.codex/settings.json) and [`../../../../../.codex/policy.json`](../../../../../.codex/policy.json). The snippets below are illustrative summaries of those shapes, not byte-for-byte copies.

Illustrative `.codex/settings.json` shape:

```json
{
  "hooks": {
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/user-prompt-submit.js'",
            "timeout": 3
          }
        ]
      }
    ],
    "PreToolUse": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "bash -c 'cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/codex/pre-tool-use.js'",
            "timeout": 3
          }
        ]
      }
    ]
  }
}
```

Illustrative `.codex/policy.json` shape:

```json
{
  "bashDenylist": [
    "git reset --hard origin/main",
    "git reset --hard origin/master",
    "sudo rm -rf"
  ],
  "bash_denylist": [
    "git reset --hard origin/main",
    "git reset --hard origin/master",
    "sudo rm -rf"
  ]
}
```

Codex rules:

- Stdin JSON is canonical and wins over argv JSON.
- `PreToolUse` only denies Bash commands that match `.codex/policy.json`.
- Non-Bash tools emit no decision.
- Prompt wrapper fallback runs only when `detectCodexHookPolicy()` reports `unavailable`.

---

<!-- /ANCHOR:setup-per-runtime -->
<!-- ANCHOR:failure-mode-playbook -->
## 4. FAILURE-MODE PLAYBOOK

`buildSkillAdvisorBrief()` returns a status and freshness pair. Operators should use both fields.

| Status | Freshness | Meaning | Runtime Output | Operator Action |
|--------|-----------|---------|----------------|-----------------|
| `ok` | `live` | Advisor ran against current SQLite graph | Advisor brief | No action |
| `ok` | `stale` | Advisor ran, but sources are newer than the graph or JSON fallback was used | Stale advisor brief | Rebuild skill graph, then rerun parity smoke |
| `skipped` | `absent` | Required source or SQLite artifact missing | `{}` or no context | Check `.opencode/skill/` and `skill-graph.sqlite` |
| `skipped` | `unavailable` | Prompt policy skipped before freshness probe | `{}` or no context | No action for empty, command-only or casual prompts |
| `degraded` | `unavailable` | Freshness probe failed | `{}` or no context | Inspect generation counter and graph files |
| `fail_open` | `unavailable` | Subprocess failed, timed out or returned invalid JSON | `{}` or no context | Inspect JSONL `errorCode`, Python path and advisor script |
| `ok` | `absent` | Invalid combination | Treat as defect | File a packet follow-up |
| `degraded` | `live` | Invalid combination | Treat as defect | File a packet follow-up |
| `fail_open` | `live` | Invalid combination | Treat as defect | File a packet follow-up |

Freshness reasons from 003:

| Reason | Typical Cause | Action |
|--------|---------------|--------|
| `SOURCE_NEWER_THAN_SKILL_GRAPH` | A `SKILL.md` or `graph-metadata.json` changed after SQLite build | Rebuild skill graph |
| `JSON_FALLBACK_ONLY` | SQLite missing but JSON artifact exists | Rebuild SQLite graph, keep JSON only as degraded backup |
| `SKILL_GRAPH_SQLITE_MISSING` | No SQLite artifact and no usable fallback | Run skill graph scan or advisor graph compiler |
| `ADVISOR_SOURCE_MISSING` | Required advisor script or skill root missing | Restore missing file or fix checkout |
| `GENERATION_COUNTER_CORRUPT` | `.advisor-state/generation.json` malformed and not recoverable | Remove or repair counter, then rerun probe |

Fail-open means the advisor never blocks the user prompt. The only blocking path in Phase 020 is Codex `PreToolUse`, and that path is Bash-only with an external denylist.

---

<!-- /ANCHOR:failure-mode-playbook -->
<!-- ANCHOR:observability-contract -->
## 5. OBSERVABILITY CONTRACT

The shared metrics contract lives in [metrics.ts](../../mcp_server/skill-advisor/lib/metrics.ts). Runtime adapters should use that module instead of inventing labels.

### Metric Definitions

| Metric | Type | Labels | Meaning |
|--------|------|--------|---------|
| `speckit_advisor_hook_duration_ms` | Histogram | `runtime`, `status`, `freshness`, `cacheHit` | End-to-end hook duration |
| `speckit_advisor_hook_invocations_total` | Counter | `runtime`, `status` | Prompt-time hook calls by outcome |
| `speckit_advisor_hook_cache_hits_total` | Counter | `runtime` | Prompt cache hits |
| `speckit_advisor_hook_cache_misses_total` | Counter | `runtime` | Prompt cache misses |
| `speckit_advisor_hook_fail_open_total` | Counter | `runtime`, `errorCode` | Fail-open outcomes by normalized error |
| `speckit_advisor_hook_freshness_state` | Gauge | `runtime`, `state` | Last observed freshness state |

Closed label values:

| Label | Values |
|-------|--------|
| `runtime` | `claude`, `gemini`, `copilot`, `codex` |
| `status` | `ok`, `skipped`, `degraded`, `fail_open` |
| `freshness` or `state` | `live`, `stale`, `absent`, `unavailable` |
| `errorCode` | `TIMEOUT`, `SCRIPT_MISSING`, `SQLITE_BUSY`, `PARSE_FAIL`, `SIGNAL_KILLED`, `GENERATION_COUNTER_CORRUPT`, `PYTHON_MISSING`, `NONZERO_EXIT`, `SQLITE_BUSY_EXHAUSTED`, `DELETED_SKILL`, `UNKNOWN` |

### JSONL Schema

`AdvisorHookDiagnosticRecord` is the only stderr JSONL schema:

```json
{
  "timestamp": "2026-04-19T16:40:00.000Z",
  "runtime": "codex",
  "status": "ok",
  "freshness": "live",
  "durationMs": 1,
  "cacheHit": false,
  "skillLabel": "sk-code-opencode",
  "generation": 7
}
```

Allowed fields:

| Field | Required | Type |
|-------|----------|------|
| `timestamp` | Yes | ISO timestamp string |
| `runtime` | Yes | Closed enum |
| `status` | Yes | Closed enum |
| `freshness` | Yes | Closed enum |
| `durationMs` | Yes | Number |
| `cacheHit` | Yes | Boolean |
| `errorCode` | No | Closed enum |
| `errorDetails` | No | Sanitized string, max 240 chars |
| `skillLabel` | No | Skill slug only |
| `generation` | No | Number |

Forbidden fields:

| Field | Reason |
|-------|--------|
| `prompt` | Raw prompt content |
| `promptFingerprint` | Prompt-derived identifier must not leave private cache surfaces |
| `promptExcerpt` | Raw or partial prompt content |
| `stdout` | Subprocess output can contain advisor data not meant for logs |
| `stderr` | Subprocess error content can include uncontrolled text |

### Alert Thresholds

Defaults from `getAdvisorHookAlertThresholds()`:

| Alert | Warn | Page | Env Override |
|-------|------|------|--------------|
| Fail-open rate | `> 2%` | `> 5%` | `SPECKIT_ADVISOR_HOOK_FAILOPEN_WARN_RATE`, `SPECKIT_ADVISOR_HOOK_FAILOPEN_PAGE_RATE` |
| Cache-hit p95 | `> 75 ms` | `> 150 ms` | `SPECKIT_ADVISOR_HOOK_CACHE_HIT_P95_WARN_MS`, `SPECKIT_ADVISOR_HOOK_CACHE_HIT_P95_PAGE_MS` |

The release gate is stricter than the page threshold: cache-hit p95 must stay at or below `50 ms`.

### Health Section

`advisor-hook-health` reports:

- `lastInvocations`, capped to the last 30 diagnostic records
- `rollingCacheHitRate`
- `rollingP95Ms`
- `rollingFailOpenRate`

It reports counts, latencies and outcomes only. It never reports prompt content.

---

<!-- /ANCHOR:observability-contract -->
<!-- ANCHOR:performance-budgets -->
## 6. PERFORMANCE BUDGETS

The release budget comes from 004 producer timing and 005 shared timing gates.

| Lane | p50 | p95 | p99 | Source | Gate |
|------|-----|-----|-----|--------|------|
| 004 warm-cache producer | Not recorded | `0.452 ms` | Not recorded | 004 implementation summary | Diagnostic, under 10 ms target |
| 004 cold subprocess producer | Not recorded | `58.373 ms` | Not recorded | 004 implementation summary | Diagnostic |
| 005 cold subprocess lane | `0.010 ms` | `0.052 ms` | `0.999 ms` | 005 timing suite | Diagnostic |
| 005 warm subprocess lane | `0.010 ms` | `0.019 ms` | `0.022 ms` | 005 timing suite | Diagnostic |
| 005 cache hit lane | `0.007 ms` | `0.016 ms` | `0.021 ms` | 005 timing suite | Release gate: p95 <= 50 ms |
| 005 cache miss lane | `0.009 ms` | `0.018 ms` | `0.020 ms` | 005 timing suite | Diagnostic |

Replay gate:

| Scenario | Result | Gate |
|----------|--------|------|
| Corrected 30-turn replay | `20/30` cache hits, `66.7%` | Hit rate >= 60% |
| 019/004 corpus parity | `200/200` top-1 match | No regression |
| Runtime parity | 4 runtimes x 5 fixtures | Identical visible brief text |

Budget rules:

- Prompt-time cache hit p95 must stay at or below `50 ms`.
- Typical 30-turn replay must keep hit rate at or above `60%`.
- The brief must stay under the default 80-token cap unless ambiguity selects the 120-token path.
- Timing tests may mock subprocess and freshness dependencies so cache-path gates stay deterministic in CI.

---

<!-- /ANCHOR:performance-budgets -->
<!-- ANCHOR:migration-notes -->
## 7. MIGRATION NOTES

### Skill Fingerprints

Child 003 introduced per-skill fingerprints:

| Field | Meaning |
|-------|---------|
| `skillMdMtime` | Last modified time for the skill's `SKILL.md` |
| `skillMdSize` | Size of `SKILL.md` |
| `graphMetaMtime` | Last modified time for `graph-metadata.json`, or `null` |

The source signature includes every current skill fingerprint plus advisor scripts and graph artifacts. Any source change invalidates prompt cache reuse.

### Rename and Delete Semantics

Deleted or renamed skills must not keep cached recommendations alive. Child 004 checks cached skill labels against current fingerprints. If a cached skill label is missing, the cache entry is invalidated and the producer runs the advisor again.

Operator action:

1. Rename or delete the skill directory.
2. Rebuild the skill graph when needed.
3. Run one advisor prompt smoke.
4. Confirm old skill labels do not appear in the brief.

### SQLite and JSON Fallback

SQLite is the preferred graph artifact:

| Artifact State | Freshness | Fallback Mode | Operator Meaning |
|----------------|-----------|---------------|------------------|
| SQLite exists and is current | `live` | `sqlite` | Normal |
| SQLite exists but sources are newer | `stale` | `sqlite` | Rebuild graph |
| SQLite missing, JSON exists | `stale` | `json` | Degraded backup |
| Both missing | `absent` | `none` | Advisor should not emit a brief |

JSON fallback never reports `live`.

### Explicit Invocation Fallback

Keep the CLI path for scripted diagnostics:

```bash
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py \
  "update OpenCode docs" \
  --threshold 0.8
```

Use it when:

- Runtime hooks are unavailable.
- You need raw advisor candidate output.
- You are debugging the hook against a direct advisor baseline.

---

<!-- /ANCHOR:migration-notes -->
<!-- ANCHOR:concurrency -->
## 8. CONCURRENCY

Phase 020 keeps concurrency local and conservative.

| Mechanism | Owner | Purpose |
|-----------|-------|---------|
| Generation counter | 003 | Tags snapshots so rebuilds can invalidate old reads |
| Temp-file plus rename write | 003 | Avoids partial `generation.json` writes |
| Source cache | 003 | Keeps freshness probes cheap for 15 minutes and 16 entries |
| HMAC prompt cache | 004 | Avoids repeated advisor subprocess calls inside a session |
| Session-scoped secret | 004 | Makes exact prompt cache keys opaque and non-portable |
| Runtime diagnostic writer | 006-008 | Writes one schema-bound record without changing hook output |

Important behavior:

- A malformed generation counter recovers on writable filesystems.
- If recovery cannot write, freshness returns `unavailable` with `GENERATION_COUNTER_CORRUPT`.
- Prompt cache entries include runtime, source signature and threshold settings.
- Prompt cache is exact-match only after canonical prompt folding.
- Similarity cache is intentionally absent.
- Runtime adapters do not hold cross-session locks.
- Copilot and Codex prompt wrappers hold rewritten prompts in memory only.

Operator guidance:

1. If graph rebuilds are frequent, expect lower cache hit rate.
2. If cache hit p95 rises, inspect source-signature churn before tuning thresholds.
3. If multiple runtimes run in parallel, compare diagnostics by `runtime` label.
4. If corruption appears in `.advisor-state/generation.json`, repair the counter or delete it and rerun the probe.

---

<!-- /ANCHOR:concurrency -->
<!-- ANCHOR:disable-flag -->
## 9. DISABLE FLAG

Set this variable to disable prompt-time advisor work for the current process session:

```bash
export SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1
```

Contract:

| Runtime | Disabled Behavior |
|---------|-------------------|
| Claude | Emits `{}` and does not call `buildSkillAdvisorBrief()` |
| Gemini | Emits `{}` and does not call `buildSkillAdvisorBrief()` |
| Copilot SDK | Returns `{}` and does not call `buildSkillAdvisorBrief()` |
| Copilot wrapper | Returns `{}` and does not rewrite prompt text |
| Codex UserPromptSubmit | Emits `{}` and does not call `buildSkillAdvisorBrief()` |
| Codex prompt wrapper | Returns `{}` and does not rewrite prompt text |

Expected diagnostic:

```json
{
  "runtime": "claude",
  "status": "skipped",
  "freshness": "unavailable",
  "durationMs": 0,
  "cacheHit": false
}
```

The disable flag is the rollback path for runtime prompt advice. It does not disable Codex `PreToolUse` deny policy unless the runtime operator unregisters that hook or empties `.codex/policy.json`.

---

<!-- /ANCHOR:disable-flag -->
<!-- ANCHOR:privacy-contract -->
## 10. PRIVACY CONTRACT

The privacy boundary covers hook state, shared payload, wrapper fallbacks, diagnostics, metrics and health output.

### Hook-State Persistence

- Raw prompts are never persisted.
- Prompt excerpts are never persisted.
- Semantic prompt embeddings are never persisted.
- Exact prompt cache keys use HMAC fingerprints.
- Session-scoped secret is derived from process-local facts and is never persisted.
- Shared-payload source refs contain advisor runtime paths and skill inventory paths, not prompt text.
- Shared-payload metadata contains freshness, confidence, uncertainty, skill label and status only.

### Copilot Wrapper Fallback

- The rewritten prompt exists only in memory for the wrapper process.
- The wrapper does not write the original prompt, rewritten prompt or prompt excerpt to logs.
- Errors may record `wrapperFallbackInvoked: true` in runtime-owned surfaces when available, but not prompt content.
- Child 007 remains the implementation source for Copilot SDK and wrapper behavior.

### Codex Prompt Wrapper Fallback

- The fallback only runs when detector result is `unavailable`.
- The returned wrapper value is process output for the active invocation only.
- Diagnostics use the same `AdvisorHookDiagnosticRecord` schema and omit prompt fields.
- Child 008 remains the implementation source for Codex prompt wrapper behavior.

### Observability Surface

Forbidden everywhere outside private in-memory cache:

| Forbidden Surface | Reason |
|-------------------|--------|
| Raw prompt text | User private content |
| Prompt excerpts | Partial private content |
| `promptFingerprint` in JSONL | Prevents correlating user prompts outside cache |
| Subprocess `stdout` | Can contain raw advisor output |
| Subprocess `stderr` | Can contain uncontrolled details |
| Free-form metric labels | Can smuggle prompt content |

Allowed:

- Runtime enum
- Status enum
- Freshness enum
- Error code enum
- Duration
- Cache hit boolean
- Skill slug
- Generation number

Privacy verification source: 005 `advisor-privacy.vitest.ts` passed and found no sensitive prompt literals in envelope, metrics, diagnostic JSONL, health or cache-key surfaces.

---

<!-- /ANCHOR:privacy-contract -->
<!-- ANCHOR:troubleshooting -->
## 11. TROUBLESHOOTING

| Symptom | Root Cause | Fix |
|---------|------------|-----|
| No brief appears in any runtime | Disable flag set, advisor script missing, or prompt policy skipped | Unset `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`, check `skill_advisor.py`, test with a work-intent prompt |
| Brief appears in Claude but not Gemini or Copilot | Adapter registration drift | Check `.gemini/settings.json`, Copilot SDK or wrapper config, then run runtime parity suite |
| `freshness: "unavailable"` persists | Probe failure or corrupt generation counter | Inspect `.opencode/skill/.advisor-state/generation.json`, `skill-graph.sqlite` and JSONL `errorCode` |
| p95 latency exceeds 100 ms | Cache hit rate dropped or subprocess spawn path is hot | Check source-signature churn, graph rebuild frequency and `speckit_advisor_hook_cache_hits_total` |
| Fail-open rate exceeds 5% | Python missing, timeout, invalid JSON or SQLite busy exhaustion | Inspect `speckit_advisor_hook_fail_open_total{errorCode=...}` and fix the top error |

### Fast Diagnostic Commands

```bash
# Check Claude registration
jq -r '.hooks.UserPromptSubmit[0].hooks[0].command' .claude/settings.local.json

# Check Gemini registration
jq -r '.hooks.BeforeAgent[0].hooks[] | select(.name=="speckit-user-prompt-advisor") | .command' .gemini/settings.json

# Run shared runtime parity suite
npx vitest run .opencode/skill/system-spec-kit/mcp_server/tests/advisor-runtime-parity.vitest.ts \
  --config .opencode/skill/system-spec-kit/mcp_server/vitest.config.ts

# Run corpus parity
npx vitest run .opencode/skill/system-spec-kit/mcp_server/tests/advisor-corpus-parity.vitest.ts \
  --config .opencode/skill/system-spec-kit/mcp_server/vitest.config.ts

# Run timing gate
npx vitest run .opencode/skill/system-spec-kit/mcp_server/tests/advisor-timing.vitest.ts \
  --config .opencode/skill/system-spec-kit/mcp_server/vitest.config.ts
```

### Release Readiness Checks

| Check | Expected |
|-------|----------|
| Reference doc present | This file exists under `references/hooks/` |
| Validation playbook present | `skill-advisor-hook-validation.md` exists next to this file |
| Disable flag smoke | `buildSkillAdvisorBrief()` is not called when flag is `1` |
| Runtime parity | Four runtimes match five canonical fixtures |
| Corpus parity | `200/200` |
| Timing | Cache hit p95 <= `50 ms`, replay hit rate >= `60%` |

---

<!-- /ANCHOR:troubleshooting -->
