# Iteration 4: RQ-08 close (hook brief signal-to-noise) + RQ-10 close (cross-runtime parity)

## Focus

Close both measurement RQs in one iteration. RQ-08 reads the two brief-producer
files (advisor + startup) and the single renderer that gates what actually
reaches the model, then maps every declared field to "load-bearing" (drives a
downstream decision or survives into the model-visible string) vs "decorative"
(diagnostic/metric only). RQ-10 reads the four per-runtime hook adapters +
each runtime's `settings.json` wiring to catalog parity gaps in invocation
contract, field projection, and "is it actually wired?" reality check.

1. **RQ-08 close:** Full read of `skill-advisor-brief.ts` (546 LOC),
   `startup-brief.ts` (333 LOC, already largely read in iter 3), and
   `render.ts` (161 LOC — the prompt-boundary guard). Catalog the
   `AdvisorHookResult` shape and trace each field's consumer.
2. **RQ-10 close:** Read the four adapters in
   `mcp_server/hooks/{claude,codex,copilot,gemini}/user-prompt-submit.ts`,
   confirm presence/absence of per-runtime settings wiring, identify the
   four-way parity matrix.

## Actions Taken

1. `ls` of runtime directories — confirmed `.claude/`, `.codex/`, `.gemini/`
   exist at repo root; `.copilot/` and `.opencode/plugin/` do NOT exist.
2. Read `skill-advisor/lib/skill-advisor-brief.ts` in full (546 LOC).
3. Read `skill-advisor/lib/render.ts` in full (161 LOC — single file that
   produces the model-visible string).
4. Read `code-graph/lib/startup-brief.ts` in full (333 LOC) — already
   mapped in iter 3 but re-read for the field inventory.
5. Read all four per-runtime adapters in parallel:
   `hooks/claude/user-prompt-submit.ts` (247 LOC),
   `hooks/codex/user-prompt-submit.ts` (401 LOC),
   `hooks/gemini/user-prompt-submit.ts` (261 LOC),
   `hooks/copilot/user-prompt-submit.ts` (282 LOC).
6. Introspected `.claude/settings.json`, `.claude/settings.local.json`,
   `.codex/settings.json`, `.gemini/settings.json` for UserPromptSubmit
   hook wiring.
7. Grep + `find` to confirm no `.copilot/` runtime dir, no
   `.opencode/plugin/`, no shell-hook entry points in any runtime's
   `scripts/` directory (only `.gemini/scripts/spec-kit-memory.sh`).

## Findings

### F19 — RQ-08: The `AdvisorHookResult` type declares 8 top-level fields, but only 2 survive into the model-visible brief

`skill-advisor-brief.ts:72-81` declares `AdvisorHookResult`:

```ts
export interface AdvisorHookResult {
  readonly status: AdvisorHookStatus;          // 'ok'|'stale'|'skipped'|'degraded'|'fail_open'
  readonly freshness: AdvisorHookFreshness;    // 'live'|'stale'|'absent'|'unavailable'
  readonly brief: string | null;               // ← pre-rendered string
  readonly recommendations: AdvisorRecommendation[];
  readonly diagnostics: AdvisorHookDiagnostics | null;
  readonly metrics: AdvisorHookMetrics;
  readonly generatedAt: string;
  readonly sharedPayload: SharedPayloadEnvelope | null;
}
```

Field-by-field consumer analysis (trace each to its downstream consumer):

| Field | Consumer | Load-bearing? | Justification |
| --- | --- | --- | --- |
| `status` | `render.ts:115` early-return (`status !== 'ok'` → null) | **LOAD-BEARING** | Gates the entire brief emission |
| `freshness` | `render.ts:118,150,156` early-return + string interpolation (`live` vs `stale`) | **LOAD-BEARING** | Drives emit/suppress AND appears verbatim in the brief string (`Advisor: live;` / `Advisor: stale;`) |
| `brief` | (pre-rendered by producer; renderer re-derives from `recommendations`) | **Partial** | `buildSkillAdvisorBrief` pre-renders `brief` at line 199; adapters then call `renderBrief(result)` which re-renders from `recommendations`. This is **double rendering** (F20). |
| `recommendations[0]` | `render.ts:134` via destructure `[top, second]` | **LOAD-BEARING** | `top.confidence`, `top.uncertainty`, `top.skill` all appear verbatim in output string |
| `recommendations[1]` | `render.ts:144` (ambiguous branch only) | **Conditional** | Only consumed if `isAmbiguous(recommendations)` returns true (two confidences within 0.05) AND `tokenCap > DEFAULT_TOKEN_CAP` |
| `recommendations[2+]` | **never** | **DECORATIVE** | The renderer only destructures first two; index 2+ are filtered but unused |
| `diagnostics.errorCode` | Each adapter's `emitDiagnostic` → stderr + JSONL file | **DIAGNOSTIC-ONLY** | Does NOT reach the model. Appears in `advisor-hook-diagnostic.jsonl` only |
| `diagnostics.errorMessage` | Same — diagnostic-only | **DIAGNOSTIC-ONLY** | Stderr + JSONL only |
| `diagnostics.policyReason` | Same | **DIAGNOSTIC-ONLY** | Stderr + JSONL only |
| `diagnostics.staleReason` | Same | **DIAGNOSTIC-ONLY** | Stderr + JSONL only |
| `diagnostics.metalinguisticMention` | Same | **DIAGNOSTIC-ONLY** | Stderr + JSONL only |
| `diagnostics.skillNameSuppressions` | Same | **DIAGNOSTIC-ONLY** | Stderr + JSONL only |
| `diagnostics.errorClass` | Same | **DIAGNOSTIC-ONLY** | Stderr + JSONL only |
| `metrics.tokenCap` | `render.ts:122` clamp + slice length | **LOAD-BEARING** | Enforces char cap (tokenCap × 4) |
| `metrics.durationMs` | `emitDiagnostic` | **DIAGNOSTIC-ONLY** | Telemetry |
| `metrics.cacheHit` | `emitDiagnostic` | **DIAGNOSTIC-ONLY** | Telemetry |
| `metrics.subprocessInvoked` | `emitDiagnostic` | **DIAGNOSTIC-ONLY** | Telemetry |
| `metrics.retriesAttempted` | `emitDiagnostic` | **DIAGNOSTIC-ONLY** | Telemetry |
| `metrics.recommendationCount` | `emitDiagnostic` | **DIAGNOSTIC-ONLY** | Telemetry |
| `generatedAt` | `sharedPayload.provenance.generatedAt` + cache restamp (`skill-advisor-brief.ts:464`) | **Partial** | Populates the envelope used by `buildStartupSharedPayloadTransport` — consumed by startup transport, NOT by the user-prompt brief string |
| `sharedPayload.metadata.skillLabel` | `render.ts:96-98,139` via `metadataSkillLabel()` | **LOAD-BEARING** | If set, **overrides** `recommendations[0].skill` for the rendered label. Any refactor touching `sharedPayload` can change the model-visible output silently. |
| `sharedPayload.metadata.confidence/uncertainty` | — only `buildSharedPayload` populates these (line 267-268); the renderer reads `top.confidence` directly, not via metadata | **DECORATIVE** | Populated but not consumed by the model-visible path |
| `sharedPayload.metadata.status` | — only echoed back by `buildSharedPayload` | **DECORATIVE** | |
| `sharedPayload.sections` | `buildStartupSharedPayloadTransport` (startup-brief.ts) — **startup transport only, NOT advisor hook** | **DECORATIVE** (for advisor path) | The advisor `buildSharedPayload` creates exactly one section (`'advisor-brief'`, line 255-259); no consumer reads `sections` back out for the advisor path |
| `sharedPayload.provenance.sourceRefs` | Echoed in envelope, not consumed by model-visible output | **DECORATIVE** | `sourceRefsForFreshness` at line 235 iterates up to 8 skill labels + advisor-runtime path — populated but never read downstream on the advisor path |
| `sharedPayload.provenance.trustState` | Echoed, not consumed | **DECORATIVE** | |
| `sharedPayload.provenance.lastUpdated` | Echoed, not consumed | **DECORATIVE** | |

**Load-bearing count (fields that change the model-visible string):**
`status`, `freshness`, `recommendations[0].{confidence,uncertainty,skill}`,
`recommendations[1]` (ambiguous only), `metrics.tokenCap`,
`sharedPayload.metadata.skillLabel`. That's **5 top-level fields** out of
the declared 8 (and only about 6 sub-fields out of roughly 30+ sub-fields
when counting diagnostics + metrics + provenance).

**Decorative count (populated but unread on the advisor path):**
`brief` (duplicated by renderer), `recommendations[2+]`, all of `diagnostics`
(7 sub-fields, telemetry-only), 5 of 6 `metrics` sub-fields,
`sharedPayload.sections` (for advisor path), `sharedPayload.provenance`
(4 sub-fields), `sharedPayload.metadata.{confidence,uncertainty,status}`,
`generatedAt` (only startup transport uses it). Roughly **~20 sub-fields**.

**Signal-to-noise ratio** of the declared result surface: **~6 / 26 ≈ 0.23**.
Three-quarters of the declared result shape is diagnostic-only or dead.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:72-81,156-173,220-282`]
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/render.ts:21-33,111-159`]

### F20 — RQ-08 subtle: The `brief` field is double-rendered

`skill-advisor-brief.ts:156-173` (`renderSharedBrief` helper, used inside
`buildAdvisorHookResultFromRecommendations` at line 199 AND in
`buildSkillAdvisorBrief` at line 497) pre-renders the brief string by
constructing an `AdvisorBriefRenderableResult` shape and calling
`renderAdvisorBrief` — that result is stored at
`AdvisorHookResult.brief`.

Then each adapter (`claude/user-prompt-submit.ts:170`,
`codex/user-prompt-submit.ts:305`, `gemini/user-prompt-submit.ts:184`,
`copilot/user-prompt-submit.ts:201`) ignores `result.brief` and calls
`renderBrief(result)` again, passing the full `AdvisorHookResult` as the
`AdvisorBriefRenderableResult`.

- The two renders SHOULD be identical (same renderer, same inputs) but the
  second render re-applies the threshold filter (`render.ts:124-133`) over
  `result.recommendations` which have ALREADY been filtered by
  `passingRecommendations` on the producer side.
- **Consequence:** For `codex/user-prompt-submit.ts:305-310`, the adapter
  passes `thresholdConfig: { confidenceThreshold: 0.8, uncertaintyThreshold: 0.35 }`
  into the second render, but the producer used
  `options.thresholdConfig` (from the caller, typically undefined) for the
  first render. These can DIVERGE — the second render can filter out
  recommendations the first kept if Codex's thresholds are stricter than
  the caller's. The claude/gemini/copilot adapters pass no overrides, so
  they get the same default threshold both times. **Divergence risk: codex
  only.**
- Double rendering costs one extra template-string build per hook
  invocation (~5 LOC work), negligible. The real cost is the added
  reasoning surface — which render is authoritative, and which filter
  wins?
- **Fix candidate:** have each adapter prefer `result.brief` when non-null
  (already computed with the same or looser thresholds) and only
  re-render when a stricter threshold override is specified. Or: drop the
  pre-render at the producer side entirely and let each adapter render
  once.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:156-173,199-218,496-502`]
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:305-310`]

### F21 — RQ-08: Two candidate brief schemas with token budget

Given F19's 6/26 signal-to-noise, two natural schemas emerge.

**Minimal (load-bearing only):**

```
{
  status: 'ok',                     // gate only
  freshness: 'live'|'stale',        // gate + verbatim in output
  topRecommendation: {              // flattened from recommendations[0]
    skill: string,
    confidence: number,
    uncertainty: number,
  },
  ambiguousRunnerUp?: {             // only when |c1 - c2| <= 0.05
    skill: string,
    confidence: number,
    uncertainty: number,
  },
  tokenCap: 80 | 120,               // derived from ambiguity
  skillLabelOverride?: string,      // optional, from sharedPayload.metadata
}
```

**Token cost:** The serialized JSON is never seen by the model. Only the
rendered output line is seen. That line already has a fixed budget:
`DEFAULT_TOKEN_CAP = 80` → **80 tokens = ~320 chars**. A typical brief
like `Advisor: live; use sk-code-opencode 0.91/0.18 pass.` is
**12-14 tokens**. Ambiguous form doubles to ~25-28 tokens. **Actual
model-visible cost: 12-28 tokens per prompt.**

**Maximal (full context for a hypothetical smarter renderer):**
The current `AdvisorHookResult` with 26+ sub-fields; useful ONLY if a
future renderer wants to surface diagnostics, metrics, or sharedPayload
provenance to the model. No current consumer does so. Maximal schema
has no marginal model-visible benefit until such a consumer exists.

**Recommendation for RQ-08:** adopt the minimal schema for the
model-visible path; keep the current `AdvisorHookResult` shape for
diagnostics/telemetry (consumed by `emitDiagnostic`), but stop treating
it as "the brief." Rename to `AdvisorHookInstrumentedResult` or similar
to make the split explicit. **Roughly 75% of the current surface is
telemetry dressed as model context.**

### F22 — RQ-10: Four runtime adapters exist; invocation contracts diverge on 5 axes

All four adapters are implemented in `mcp_server/hooks/<runtime>/user-prompt-submit.ts`.
Matrix of divergences:

| Axis | Claude (247 LOC) | Codex (401 LOC) | Gemini (261 LOC) | Copilot (282 LOC) |
| --- | --- | --- | --- | --- |
| **Input field names accepted** | `prompt` only | `prompt`, `userPrompt`, `request.prompt` (3 fallbacks) | `prompt`, `userPrompt`, `request.prompt` (3 fallbacks) | `prompt`, `userPrompt` (2 fallbacks) |
| **CWD resolution** | `input.cwd` → `process.cwd()` | `input.cwd` → `input.request.cwd` → `process.cwd()` | `input.cwd` → `input.request.cwd` → `process.cwd()` | `input.cwd` → `process.cwd()` |
| **Input source** | stdin only | stdin (canonical) OR argv JSON (wrapper fallback) with dual-input telemetry | stdin only | stdin only |
| **Output shape** | `{hookSpecificOutput: {hookEventName, additionalContext}}` | Same as Claude | Same as Claude | **Always `{}`** — emits brief by WRITING `custom-instructions.md` side-effect, not by return value |
| **Timeout handling** | None (relies on Claude hook timeout in settings) | Explicit `SPECKIT_CODEX_HOOK_TIMEOUT_MS` env var (default 3000ms) passed into subprocess; `timeoutFallbackOutput()` returns `'Advisor: stale (cold-start timeout)'` on TIMEOUT | None | None |
| **Render threshold override** | None (uses caller defaults) | **Explicitly** passes `{confidenceThreshold: 0.8, uncertaintyThreshold: 0.35}` into the second render call (F20 divergence source) | None | None |
| **Side effects beyond return** | None | None | None | **Writes `writeCopilotCustomInstructions`** — a file-refresh side effect because Copilot CLI ignores hook return values for prompt mutation |

[SOURCE:
 `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:28-45,149,166-169`,
 `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:30-53,122-136,175-193,283-310`,
 `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:29-51,80-94,178-184`,
 `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:34-42,77-83,124-136,194-216,231-239`]

**Key structural observations:**

- All four adapters share 95% of the code (parse → validate → buildBrief →
  renderBrief → emitDiagnostic → return). The divergences above are
  surgical. This means the four adapters could collapse to one generic
  adapter + four 20-LOC thin wrappers encoding the axis differences.
- **Output-shape asymmetry is fundamental:** Claude/Codex/Gemini return
  JSON that the host merges into the prompt; Copilot must WRITE a file
  because the host ignores the return value. This is a host-CLI fact, not
  a choice — but it means the "brief" content path for copilot is
  different (file-refresh) and subject to different failure modes
  (filesystem errors, race conditions, stale content after the next
  prompt).
- **Codex's second render with forced thresholds (F20)** means Codex can
  silently emit a different brief than Claude/Gemini for the same input
  if the caller's thresholds differ from `{0.8, 0.35}`. Parity gap.

### F23 — RQ-10: Cross-runtime WIRING reality check — ONLY Codex, Gemini, and Claude (via settings.local.json) are actually wired

Adapter existence ≠ hook firing. Inspected each runtime's settings for a
`UserPromptSubmit`-equivalent hook entry:

| Runtime | Adapter exists | Settings wires it | Notes |
| --- | --- | --- | --- |
| **Claude** | `hooks/claude/user-prompt-submit.ts` | `.claude/settings.json` hooks is `{}` (empty) ; `.claude/settings.local.json` DOES wire it — **BUT WITH A BUG** (see below) | **Personal/local-only wiring.** `.claude/settings.json` (checked-in) has `env` + `statusLine` only |
| **Codex** | `hooks/codex/user-prompt-submit.ts` | `.codex/settings.json` wires `dist/hooks/codex/user-prompt-submit.js` at UserPromptSubmit with `timeout:3` | Clean wiring, checked-in |
| **Gemini** | `hooks/gemini/user-prompt-submit.ts` | `.gemini/settings.json` wires `dist/hooks/gemini/user-prompt-submit.js` on the **`BeforeAgent`** event (not a `UserPromptSubmit` event — Gemini has no such event) with `timeout:3000` | Clean wiring but on a different event surface |
| **Copilot** | `hooks/copilot/user-prompt-submit.ts` | **No `.copilot/` directory in repo.** No per-runtime settings file. Wiring is presumed handled by Copilot's own config mechanism (not in repo) | **Cannot verify in-repo** that Copilot's host actually invokes this hook |

**The `.claude/settings.local.json` bug (F23.1):**

```json
"UserPromptSubmit": [
  {
    "type": "command",
    "bash": "cd \"$(git rev-parse --show-toplevel 2>/dev/null || pwd)\" && node .opencode/skill/system-spec-kit/mcp_server/dist/hooks/copilot/user-prompt-submit.js",
    "timeoutSec": 5,
    "hooks": [
      {
        "type": "command",
        "command": "bash -c '... dist/hooks/claude/user-prompt-submit.js'",
        "timeout": 3
      }
    ]
  }
]
```

- The **top-level `bash:` key points at `hooks/copilot/user-prompt-submit.js`** — the Copilot adapter — not the Claude one.
- The **nested `hooks:[{command:...}]` array points at the correct Claude adapter**.
- This looks like the user hand-authored a Codex-style entry with `"type":"command"` + `"bash":"..."` at the top, then wrapped a Claude-native entry with `{command,timeout}` inside a `hooks:[...]` array. Whether Claude Code executes the top or the nested entry depends on Claude's hook schema interpreter. At least one of these paths runs the WRONG runtime's adapter.
- **Same file, PreCompact, SessionStart, Stop blocks all repeat this nesting pattern** (top-level `bash:` runs copilot/copilot/claude adapters; nested `hooks[0].command` runs claude/claude/claude). SessionStart top-level calls `dist/hooks/copilot/session-prime.js` — definitely wrong for a Claude session.
- **Impact:** Claude-runtime sessions may invoke Copilot-runtime adapters as a side effect of the settings.local.json structure. Diagnostic records will show `runtime: 'copilot'` on Claude sessions, polluting telemetry. **Parity gap: yes, and an active config-shape bug, not just a gap.**

**Gemini event-name asymmetry (F23.2):**
Gemini's checked-in settings wires the user-prompt hook on **`BeforeAgent`**,
not `UserPromptSubmit`. The adapter's comment at line 4-5 acknowledges this:
`// Runs on Gemini's prompt-equivalent BeforeAgent surface`. Three
consequences:

- The `BeforeAgent` payload is not documented as including a `prompt`
  field; the adapter tries `prompt`, `userPrompt`, `request.prompt` in that
  order (line 90-94). If Gemini's BeforeAgent payload uses none of these
  three, the adapter returns `PARSE_FAIL` with `GEMINI_UNKNOWN_SCHEMA`
  (line 166-175). **Silent failure path if Gemini changes its event
  payload shape.**
- BeforeAgent fires for every agent invocation including sub-agents;
  UserPromptSubmit fires once per user message. This is a **different
  firing cadence** than the Claude/Codex UserPromptSubmit hooks. The
  cache key (`prompt-cache.ts:75`) includes `runtime` and
  `canonicalPrompt` but NOT an agent-invocation identifier — so if
  BeforeAgent fires N times with the same canonicalPrompt, the first
  hit hits the subprocess and N-1 are cache hits. Acceptable but worth
  noting.
- **Silent parity gap:** Gemini BeforeAgent cannot be used to gate
  tool-call decisions the way Claude's UserPromptSubmit can. The advisor
  brief reaches Gemini later in the request lifecycle than Claude/Codex,
  making the "pre-execution skill routing" gate (CLAUDE.md Gate 2)
  slightly later on Gemini.

**Copilot no-in-repo wiring (F23.3):**
The adapter file (`hooks/copilot/user-prompt-submit.ts`) and the
instructions-refresh helper (`hooks/copilot/custom-instructions.ts`) are
in the repo, but there is no `.copilot/settings.json` or equivalent. The
Copilot adapter's README comment (line 5-7) says: *"Copilot CLI ignores
userPromptSubmitted hook output for prompt mutation. The hook therefore
refreshes Copilot's local custom instructions file and returns an empty
JSON object."* This means:
- If Copilot's own hook subsystem is wired at the user/machine level
  (outside the repo), the hook does run and refreshes the custom-
  instructions file. In-repo audit cannot verify this.
- If not wired, the hook never runs and Copilot sessions miss the
  advisor brief entirely. Silent no-op.
- The instructions-refresh side-effect path means Copilot's brief is
  **eventually-consistent** across hook invocations (next prompt reads
  the file written by the previous hook), not per-prompt. Stale brief is
  a real risk if the file write fails silently.

[SOURCE: `.claude/settings.json:1-` (no hooks key; confirmed via grep + Python introspection)]
[SOURCE: `.claude/settings.local.json:25-75` (UserPromptSubmit/PreCompact/SessionStart/Stop nested `bash:copilot` / `hooks[0].command:claude` pattern)]
[SOURCE: `.codex/settings.json:1-40` (clean wiring on UserPromptSubmit)]
[SOURCE: `.gemini/settings.json:20-60` (wired on BeforeAgent, not UserPromptSubmit)]
[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:1-10` comment]

### F24 — RQ-10: The advisor path has ZERO runtime-specific branching except the `runtime` cache-key field and Codex-only thresholds

Grep for `runtime ===` in the advisor lib found 5 hits, all in
`metrics.ts` (telemetry validation) and `prompt-cache.ts:75` (cache key
partitioning). Specifically:

- `skill-advisor-brief.ts:446` passes `runtime: options.runtime` into
  the cache key — means the same prompt cached under `claude` will MISS
  under `codex`. 4x cache pressure per unique prompt for a user that
  switches runtimes. **Minor:** this is intended because future per-
  runtime thresholds could differ (today, only codex differs).
- `metrics.ts:294,316,392,405` validate that the `runtime` field is
  in the `ADVISOR_RUNTIME_VALUES` enum `['claude', 'gemini', 'copilot', 'codex']`
  — diagnostic-only.
- `schemas/advisor-tool-schemas.ts:102` declares `z.enum(['claude',
  'gemini', 'copilot', 'codex'])` for the MCP tool schema — enforces
  the same enum on MCP ingress.

**Interpretation:** the advisor LIBRARY is runtime-agnostic. The four
adapters are the full scope of per-runtime logic. The library itself
has no `if (runtime === 'claude') ... else if (runtime === 'codex')`
branches anywhere. This is good separation — all runtime divergence is
isolated to the thin adapter layer (F22). Any parity fix can ship as
adapter-level changes without touching the library.

[SOURCE: grep `runtime ===` and `AdvisorRuntime` across
`.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/`]

### F25 — RQ-10: There is a legacy parity test but it's in `tests/legacy/`

`mcp_server/skill-advisor/tests/legacy/advisor-runtime-parity.vitest.ts`
asserts at line 233: `expect(RUNTIMES).toEqual(['claude', 'gemini', 'copilot', 'codex'])`
and invokes all four `handle*UserPromptSubmit` functions with
synthesized inputs. Verified that:

- The parity test treats copilot's empty-`{}` output as intentional
  (line 242: filters `directInjectionOutputs` to exclude copilot +
  copilot-wrapper).
- The test does NOT exercise the `.claude/settings.local.json` wiring
  bug (F23.1) — it calls the adapter function directly, not via the
  settings-driven hook invocation path. The bug is undetectable via
  unit tests.

- **Why `tests/legacy/`:** The folder name implies these tests are
  slated for removal or replacement. Without a current-tier replacement,
  per-runtime parity regressions could ship without CI coverage.

[SOURCE: `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-runtime-parity.vitest.ts:1-300`]

## Questions Answered

- **RQ-08 (close):** Answered. The `AdvisorHookResult` signal-to-noise is
  **~6 load-bearing sub-fields out of ~26 total = ~0.23**. Three-quarters
  of the declared result surface is telemetry-only or dead. The brief is
  **double-rendered** (F20), and Codex re-filters with a stricter
  threshold override that can diverge from the producer-side filter.
  Minimal schema (F21) is 5 top-level fields; maximal schema has no
  current consumer. **Model-visible cost: 12-28 tokens per prompt**,
  which is already tight. Register ID:
  `question-8-rq-08-what-is-the-signal-to-noise-ratio-of-the-advisor-hook-brief-which-fields-a`.
- **RQ-10 (close):** Answered. Four runtime adapters exist (Claude,
  Codex, Gemini, Copilot) sharing 95% of their code. **Real parity
  gaps:** (1) Only Codex has explicit per-adapter threshold overrides
  (F20/F22); (2) Only Copilot writes a side-effect file instead of
  returning additionalContext (F22); (3) `.claude/settings.json` has
  ZERO hook wiring — only `.claude/settings.local.json` wires Claude
  hooks, and with a `bash:copilot/...` top-level key that may invoke the
  wrong adapter (F23.1); (4) Gemini wires on `BeforeAgent` not
  UserPromptSubmit, giving a different firing cadence (F23.2); (5)
  Copilot has no in-repo settings file, wiring is user-machine-level
  only (F23.3); (6) Legacy parity tests don't exercise the settings-
  driven invocation path (F25). Register ID:
  `question-10-rq-10-what-cross-runtime-parity-gaps-exist-claude-codex-gemini-copilot-opencode-`.

## Ruled Out

- **Not a fix by adding more fields to the brief:** F21's maximal
  schema has no current consumer; adding telemetry-grade sub-fields to
  the model-visible string would only inflate token cost with no
  behavior improvement. **Ruled out: "expand the brief for future
  extensibility."** The path is the opposite — shrink the declared
  result surface to its load-bearing subset and rename the telemetry
  envelope.
- **Not a fix via a runtime-branching macro in the library:** F24
  confirms the library is already runtime-agnostic. Adding runtime
  switches inside the library would reverse a good separation. **Ruled
  out: "centralize runtime logic in skill-advisor-brief.ts."** The
  correct layer is the adapter (F22 collapse candidate).
- **Not a `.opencode/plugin/` issue:** The directory does not exist in
  this repo. Earlier dispatch context mentioned it as a possible runtime
  surface — it is not. **Ruled out: auditing plugin bridge.** No plugin
  bridge exists.

## Dead Ends

- None this iteration. The dispatch hinted at `.opencode/skill/system-spec-kit/scripts/hooks/*.sh` — that directory does not exist either. Found the real path (`mcp_server/hooks/<runtime>/`) via `find` + `grep`.

## Sources Consulted

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/skill-advisor-brief.ts:1-546`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/render.ts:1-161`
- `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/startup-brief.ts:1-333` (re-read; largely mapped in iter 3)
- `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:1-247`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:1-401`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:1-261`
- `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts:1-282`
- `.claude/settings.json` (top-level keys only: `env`, `statusLine`)
- `.claude/settings.local.json:25-75` (UserPromptSubmit + PreCompact + SessionStart + Stop entries)
- `.codex/settings.json:1-40`
- `.gemini/settings.json:20-60`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/legacy/advisor-runtime-parity.vitest.ts:1-300` (via grep)
- Grep `AdvisorRuntime | 'claude' | 'codex' | 'gemini' | 'copilot'` across advisor package

## Assessment

- **New information ratio: 0.85.**
  - F19 (S/N 6/26 ≈ 0.23) — fully new; no prior iteration counted
    fields on the model-visible path.
  - F20 (double rendering + codex threshold divergence) — fully new;
    subtle enough that it took a full-file read of both the producer and
    all four adapters to see.
  - F21 (minimal/maximal schemas + 12-28 token budget) — fully new;
    first iteration to quantify the actual model-visible cost.
  - F22 (4-way adapter divergence matrix on 7 axes) — fully new
    structural catalog.
  - F23.1 (`.claude/settings.local.json` wiring bug) — fully new;
    structural landmine that no prior iteration touched.
  - F23.2 (Gemini wired on BeforeAgent, not UserPromptSubmit) —
    fully new.
  - F23.3 (Copilot no in-repo settings) — fully new.
  - F24 (library is runtime-agnostic; only adapters diverge) —
    new evidence; prior iterations assumed this but did not verify.
  - F25 (legacy parity tests don't exercise settings path) — fully
    new.
  - **8.5 / 10 findings fully new + 1 structural extension = 8.5 / 10 =
    0.85.** Simplification bonus does not apply this iteration; this was
    pure evidence gathering, not a consolidation.
- **Questions addressed: RQ-08 (closed), RQ-10 (closed).**
- **Questions answered via registry IDs:**
  `question-8-rq-08-what-is-the-signal-to-noise-ratio-of-the-advisor-hook-brief-which-fields-a`,
  `question-10-rq-10-what-cross-runtime-parity-gaps-exist-claude-codex-gemini-copilot-opencode-`.

## Reflection

- **What worked and why:** Reading all four adapters in parallel (one
  tool call returns up to a full file per call, but the two parallel
  batches covered all four in two cycles) plus the settings-file
  introspection via `python3 -c "json.load"` caught F23.1 (the claude
  settings.local.json wiring bug) which a grep-only approach would have
  missed. The field-by-field consumer trace for F19 required reading
  `render.ts` top-to-bottom AND then verifying each `AdvisorHookResult`
  field by tracing through `skill-advisor-brief.ts`'s `buildSharedPayload`
  and cache-restamp paths — time-consuming but the only way to know
  "load-bearing vs decorative."
- **What did not work and why:** The dispatch context mentioned
  `.opencode/skill/system-spec-kit/scripts/hooks/*.sh` and
  `.opencode/plugin/` — neither exists. Cost one tool call to confirm.
  Root cause: dispatch context authored without a directory check.
  Identical to iter 3's `handlers/code-graph-*.ts` miss. **This is a
  recurring dispatch-context drift — worth noting for the reducer.**
- **What I would do differently:** None substantively — the flow worked.
  If anything, combining the settings inspection with the adapter reads
  into ONE planning phase (instead of adapter reads → then settings)
  would have shaved a turn. Ordering: inspect settings FIRST to know
  which adapters are actually wired, then read those adapters
  prioritized by wiring status.

## Recommended Next Focus

**Iteration 5 focus options,** in order of marginal value:

1. **RQ-05 (scan throughput ceiling per language/file-size)** — measurement-
   heavy. Read `structural-indexer.ts`, `tree-sitter-parser.ts`, and any
   bench harness in `tests/benchmarks/`. Contained file reads; high
   likelihood of finding the per-language bottleneck and empirical
   evidence for F19's "signal-to-noise" of scan budget.
2. **RQ-06 (query p50/p95/p99 + cache hit ratio)** — measurement, requires
   a live benchmark run OR reading existing benchmark snapshots in
   `deep-research-state.jsonl` or in `.opencode/skill/system-spec-kit/mcp_server/code-graph/tests/benchmarks/` (if such a directory exists). One grep + one read to locate the fixture.
3. **RQ-02 (scorer bias across lanes)** — requires the MCP tools
   `eval_run_ablation` + `eval_reporting_dashboard`. One MCP call with a
   long latency tail. **Defer to iter 6+ unless iter 5 is quick**, so
   iter 5 can still stay under 6 research actions.
4. **RQ-09 (benchmark coverage gaps)** — meta-research on the benchmark
   harness. Best folded into RQ-05 or RQ-06.

**Also follow up from this iteration:**
- File the `.claude/settings.local.json` wiring bug (F23.1) as a concrete
  remediation item in the spec packet's tasks.md — this is the first
  iteration to find a live config-shape bug rather than a structural
  divergence.
- Consider whether F20's double-rendering + codex threshold divergence is
  worth a targeted fix-now recommendation, since it's the smallest
  surgical parity fix and affects only one adapter.
