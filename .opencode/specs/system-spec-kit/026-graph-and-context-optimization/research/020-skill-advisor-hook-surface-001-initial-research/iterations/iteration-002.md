# Iteration 002 - Code-Graph Pattern to Skill-Advisor Brief Map

## Focus

Deep-dive the code-graph `buildStartupBrief()` producer, non-mutating freshness logic, shared-payload envelope contract, OpenCode transport coercion, and the current `skill_advisor.py` ranking pipeline. This iteration maps the code-graph startup pattern 1:1 onto skill-advisor hook equivalents and answers Q4: the freshness semantic design for `getAdvisorFreshness()`.

## Source Evidence

- `startup-brief.ts` defines `StartupBriefResult`, builds `graphOutline`, `sessionContinuity`, `startupSurface`, and optional `sharedPayload` from filtered sections. The producer maps graph state into envelope provenance through `trustStateFromGraphState(graph.graphState)`.
- `ensure-ready.ts` treats freshness as non-mutating state detection: graph empty, git HEAD drift, tracked-file mtime drift, deleted tracked files, and selective/full reindex thresholds. Its display helper `getGraphFreshness()` catches probe failures and returns `empty`.
- `shared-payload.ts` already validates reusable envelope structure and trust-state vocabulary, but producer values are currently limited to `startup_brief`, `session_snapshot`, `session_resume`, `session_health`, `session_bootstrap`, `compact_merger`, and `hook_cache`; section sources are limited to `memory`, `code-graph`, `semantic`, `session`, and `operational`.
- `opencode-transport.ts` proves transport can stay generic: it validates envelope kind, producer, and trustState, then renders selected sections. Unknown producer labels are rejected.
- `skill_advisor.py` has the advisor execution and ranking pipeline: skill discovery cache, SQLite/JSON graph loading, source metadata signal extraction, semantic search fallback, confidence/uncertainty scoring, command bridge normalization, health diagnostics, and CLI surfaces for single prompt, batch, semantic hits, health, and validation.
- `skill_advisor_runtime.py` already computes the SKILL.md discovery signature from file path, mtime, and size and exposes cache health, which is the closest existing primitive to an advisor freshness probe.

## Parallel Extraction Map

| Code-graph pattern | Advisor equivalent | Classification | Proposed shape |
| --- | --- | --- | --- |
| `StartupGraphSummary` | `SkillAdvisorSummary` | Slight adaptation needed | Replace files/nodes/edges with `skillsFound`, `commandBridgesFound`, `skillGraphSource`, `skillGraphSkillCount`, `inventoryParity`, `cacheStatus`, `cocoIndexAvailable`, and `lastUpdated`. |
| `StartupBriefResult` | `SkillAdvisorBriefResult` | Slight adaptation needed | Keep `outline`, `summary`, `surface`, and `sharedPayload`, but add prompt-scoped `recommendations` and `advisorState`. |
| `buildStartupBrief()` | `buildSkillAdvisorBrief(prompt, options)` | Slight adaptation needed | Same orchestration pattern: build outline, run or read advisor summary, render bounded surface, build envelope. Must accept a prompt because advisor routing is prompt-specific. |
| `buildGraphOutline()` | `buildSkillAdvisorOutline()` | Slight adaptation needed | Same compact text role. Replace structural highlights with top 1-3 recommendations plus health/freshness line. Default budget should be about 80 tokens; hard cap around 120 tokens. |
| `getGraphFreshness()` | `getAdvisorFreshness()` | Requires new design | Reuse non-mutating probe style, but compare advisor source mtimes and generated graph artifacts instead of code file mtimes. Details below. |
| `trustStateFromGraphState()` | `trustStateFromAdvisorState()` | Direct reuse of semantics, new adapter | Same output vocabulary: `live`, `stale`, `absent`, `unavailable`. Adapter should map advisor states rather than graph states. |
| `createSharedPayloadEnvelope()` | Same function | Direct reuse with schema extension | The envelope mechanics are reusable, but first-class advisor output needs new producer/source enum values unless it is intentionally published as generic `hook_cache`/`operational`. |
| `coerceSharedPayloadEnvelope()` | Same transport coercion | Direct reuse after enum extension | Transport rejects unknown producers today, so `skill_advisor_brief` must be registered before runtime hooks emit it. |
| `queryStartupHighlights()` | Top recommendations from `analyze_prompt()` | Requires new design | Advisor highlights are prompt-conditioned and should not query graph nodes. Use `skill`, `confidence`, `uncertainty`, `passes_threshold`, and a shortened reason. |
| `buildSessionContinuity()` | Prompt/session advisor cache lookup | Requires new design | Code graph loads persistent hook state; advisor should use prompt fingerprint plus source signature cache, preferably session scoped and TTL-bound. |

## Proposed Function Shapes

### `buildSkillAdvisorBrief()`

```ts
export interface SkillAdvisorBriefRecommendation {
  skill: string;
  kind: 'skill' | 'command';
  confidence: number;
  uncertainty: number;
  passesThreshold: boolean;
  reason: string;
}

export interface SkillAdvisorSummary {
  skillsFound: number;
  commandBridgesFound: number;
  skillGraphSource: 'sqlite' | 'json' | null;
  skillGraphSkillCount: number;
  inventoryParity: 'synced' | 'degraded' | 'unknown';
  cacheStatus: 'ok' | 'degraded' | 'unknown';
  cocoIndexAvailable: boolean;
  lastUpdated: string | null;
}

export type AdvisorState = 'ready' | 'stale' | 'absent' | 'unavailable';

export interface SkillAdvisorBriefResult {
  advisorOutline: string | null;
  recommendations: SkillAdvisorBriefRecommendation[];
  advisorSummary: SkillAdvisorSummary | null;
  advisorState: AdvisorState;
  advisorSurface: string;
  sharedPayload: SharedPayloadEnvelope | null;
}

export function buildSkillAdvisorBrief(
  prompt: string,
  options?: {
    maxRecommendations?: number;
    maxOutlineChars?: number;
    cacheTtlMs?: number;
    sourceSurface?: 'user_prompt_submit' | 'session_start' | 'manual';
  },
): SkillAdvisorBriefResult;
```

Design notes:

- It should mirror `buildStartupBrief()` by composing small helpers: `buildSkillAdvisorOutline()`, `buildSkillAdvisorSurface()`, `getAdvisorFreshness()`, and `createSharedPayloadEnvelope()`.
- It should call the advisor through a bounded subprocess or a precomputed in-process adapter. The current Python CLI already supports single prompt and batch mode; hook usage should prefer a long-lived or session cache path because per-prompt process startup will dominate latency.
- It should fail open: on timeout, missing Python, invalid JSON, or unhealthy advisor graph, return `advisorState='unavailable'`, an empty recommendation list, an explanatory surface line, and either no envelope or an envelope with trustState `unavailable`.
- Caching should key on `promptFingerprint + sourceSignature + threshold options`. The prompt fingerprint should be session scoped and salted or memory-only to avoid retaining raw prompts.

### `getAdvisorFreshness()`

`getGraphFreshness()` compares tracked code graph state against repo/git and indexed file mtimes. The advisor equivalent should compare the source inventory that drives recommendation quality:

| Input | Compare against | Freshness effect |
| --- | --- | --- |
| Top-level `.opencode/skill/*/SKILL.md` files | Current discovery signature in `skill_advisor_runtime.py` (`path`, `st_mtime_ns`, `st_size`) | Any newer or changed signature means stale in-process discovery cache. |
| `.opencode/skill/*/graph-metadata.json` files | `skill-graph.sqlite` `last_scan_timestamp` and/or DB file mtime | Any newer metadata file means stale graph signals/families/conflicts. |
| `skill_advisor.py` and `skill_advisor_runtime.py` | Cache build timestamp or hook snapshot timestamp | Any newer script means stale advisor code snapshot. |
| `skill_graph_compiler.py` | `skill-graph.sqlite` generation timestamp | Newer compiler means graph may be stale if schema/compilation logic changed. |
| `skill-graph.sqlite` | Existence, readability, `schema_version`, `last_scan_timestamp`, inventory parity | Missing or unreadable DB maps to absent/unavailable; older DB maps stale. |
| `skill-graph.json` fallback | Existence and mtime relative to graph metadata | JSON fallback can be accepted as stale/degraded, not live, when SQLite is missing but JSON exists. |

Proposed state logic:

```ts
export type AdvisorFreshness = 'fresh' | 'stale' | 'absent' | 'unavailable';

export function getAdvisorFreshness(rootDir: string): AdvisorFreshness {
  // absent: no parseable SKILL.md records, no advisor graph artifacts, or advisor script missing
  // unavailable: expected files exist but cannot be read, Python/JSON probe throws, DB lock/read failure
  // stale: SKILL.md, graph-metadata.json, advisor scripts, or compiler are newer than the advisor snapshot/graph
  // fresh: SKILL.md discovery, source metadata, graph artifact, and advisor scripts are all up-to-date
}
```

Important distinction: unlike `getGraphFreshness()`, advisor freshness should not return `empty` as the public semantic. "No skills discovered" is not a benign empty index for this use case; it should be `absent` or `unavailable` depending on whether files are missing or unreadable.

### `trustStateFromAdvisorState()`

| Advisor state | Trust state | Meaning |
| --- | --- | --- |
| `ready` or `fresh` | `live` | Advisor recommendation was computed from current skill discovery and current graph metadata. |
| `stale` | `stale` | A recommendation may still be useful, but at least one source file or graph artifact changed after the advisor snapshot. |
| `absent` | `absent` | No usable advisor inventory exists for this workspace or hook scope. |
| `unavailable` | `unavailable` | Advisor should exist but could not be reached, parsed, or read within the hook budget. |

Recommended adapter:

```ts
export function trustStateFromAdvisorState(
  advisorState: 'ready' | 'fresh' | 'stale' | 'absent' | 'unavailable',
): SharedPayloadTrustState {
  switch (advisorState) {
    case 'ready':
    case 'fresh':
      return 'live';
    case 'stale':
      return 'stale';
    case 'absent':
      return 'absent';
    case 'unavailable':
      return 'unavailable';
  }
}
```

### `buildSkillAdvisorOutline()`

Recommended format:

```text
Advisor: live; 20 skills, 16 command bridges; graph=sqlite/degraded.
Recommended: sk-deep-research 0.95/0.20, system-spec-kit 0.82/0.28.
Use first passing skill; if none passes, continue without advisor gating.
```

Token budget:

- 40 tokens: state + top skill only. Good for prompt hooks where latency/context are tight.
- 60 tokens: state + top 2 skills. Good default for normal prompts.
- 80 tokens: state + top 3 skills + fail-open note. Best default for early rollout.
- 120 tokens: include short reasons. Reserve for debugging or manual diagnostics.

Default recommendation: use an 80-token target and a 120-token hard cap. The current advisor reasons can be long (`Matched: ...`); truncate reasons or omit them from prompt-time surfaces.

## Envelope Contract Decision

The envelope shape itself is directly reusable. The schema vocabulary needs a small first-class extension:

- Add `skill_advisor_brief` to `SHARED_PAYLOAD_PRODUCER_VALUES`.
- Add `advisor` or `skill-advisor` to `SharedPayloadSection.source`, or intentionally reuse `operational` with a clear comment. First-class `advisor` is cleaner because the transport and tests can distinguish routing advice from generic operational notices.
- Existing kind can be `startup` for session-start advisor priming, but prompt-submit injection is better modeled as `health` or a new kind only if future transport needs distinguish current-turn routing from startup/bootstrap/resume. For this phase, avoid adding a new kind unless implementation proves it necessary.

Because `coerceSharedPayloadEnvelope()` rejects unknown producers, runtime hooks must land the enum extension before emitting a `skill_advisor_brief` envelope. Without that, the producer would have to reuse `hook_cache`, which hides provenance.

## Q4 Answer: Freshness Semantic Design

`getAdvisorFreshness()` should be non-mutating and fast, like `getGraphFreshness()`, but its authority axis is not git HEAD or code graph tracked files. It should compare the advisor's recommendation inputs:

1. Skill discovery source: top-level `SKILL.md` mtimes and sizes.
2. Skill graph source: `graph-metadata.json` mtimes versus SQLite `last_scan_timestamp` or DB mtime.
3. Advisor runtime source: `skill_advisor.py`, `skill_advisor_runtime.py`, and `skill_graph_compiler.py` mtimes versus the hook snapshot or graph generation time.
4. Artifact availability: SQLite preferred, JSON fallback accepted as degraded/stale, missing artifacts absent, read/parse/DB-lock failures unavailable.

This yields a clean hook contract:

- `live`: prompt routing computed from current source and current graph.
- `stale`: prompt routing computed from usable but older source/graph.
- `absent`: no usable advisor inventory exists.
- `unavailable`: advisor inventory should exist but probing or subprocess execution failed.

## Findings

1. The code-graph startup producer is the right shape to mirror. The advisor producer should be a sibling module, not a rewrite of transport.
2. The shared-payload envelope is reusable, but the allowed producer/source enums need advisor-specific entries for clean provenance.
3. The current advisor runtime already has a useful cache-signature primitive for `SKILL.md` files; implementation should extend that to graph metadata and script/compiler mtimes.
4. Health output currently reports `status=degraded` because graph inventory includes `skill-advisor` while SKILL.md discovery returns 20 skills and no `skill-advisor` SKILL.md. A hook should surface this as `stale` or `unavailable` only if it affects recommendation correctness; otherwise the prompt-time brief can say `graph=sqlite/degraded`.
5. Per-prompt hook execution should not run broad health checks every time. Use health/freshness probes for cache invalidation, then run the cheaper prompt analysis path or a cached batch/daemon path.
6. `getAdvisorFreshness()` should not auto-rebuild the skill graph during prompt submission. Freshness reports should be non-mutating; remediation belongs to explicit setup or a bounded background path.

## Function Reuse Classification

### Direct Reuse

- `createSharedPayloadEnvelope()` for envelope construction after enum extension.
- `coerceSharedPayloadEnvelope()` and OpenCode transport rendering after enum extension.
- Trust-state vocabulary: `live`, `stale`, `absent`, `unavailable`.
- Truncation and compact-number formatting patterns from `startup-brief.ts`.

### Slight Adaptation Needed

- `buildStartupBrief()` orchestration structure becomes `buildSkillAdvisorBrief(prompt, options)`.
- `buildGraphOutline()` becomes top-recommendation outline rendering.
- `StartupBriefResult` becomes prompt-scoped advisor result with recommendation records.
- `trustStateFromGraphState()` becomes a sibling adapter for advisor freshness/state.

### Requires New Design

- Advisor freshness snapshot format across SKILL.md files, graph metadata, graph artifacts, and advisor script/compiler mtimes.
- Session-scoped prompt fingerprint cache and TTL behavior.
- Hook-specific fail-open budget and subprocess timeout policy.
- Cross-runtime prompt-submit wrappers that pass raw prompt text or a sanitized prompt summary into the producer.

## Next Focus

Iteration 3 should investigate the prompt-fingerprint and cache design: TTL candidates, privacy boundary, cache key shape, and whether per-runtime hooks should share a single advisor snapshot cache or keep isolated runtime caches.

## Ruled Out

- Treating code-graph freshness as a direct copy. Git HEAD/tracked-code mtimes are not the advisor authority source.
- Emitting `skill_advisor_brief` through the shared envelope without extending producer/source enums. Transport validation rejects unknown producers today.
- Running full advisor health checks on every prompt. Health is useful for invalidation and diagnostics, not a prompt-time hot path.
