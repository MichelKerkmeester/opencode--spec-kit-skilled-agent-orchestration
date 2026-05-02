# Iteration 007: PrimePackage + Session Snapshot Routing Extensions
## Focus: Draft implementation-ready PrimePackage routing directives and session snapshot routing state so hook-compatible and non-hook CLIs share the same CocoIndex-vs-Code-Graph routing policy after bootstrap and during recovery.

## Code Snippets:
### 1) Add a shared routing guidance helper
Create `mcp_server/lib/session/routing-guidance.ts` so PrimePackage and SessionSnapshot cannot drift.

```ts
export type RoutingGraphFreshness = 'fresh' | 'stale' | 'empty' | 'error';

export interface RoutingGuidance {
  routingRules: string[];
  routingRecommendation: string;
}

export function buildRoutingGuidance(
  graphFreshness: RoutingGraphFreshness,
  cocoIndexAvailable: boolean,
): RoutingGuidance {
  const routingRules = [
    'Use CocoIndex first for semantic, intent-based, or unfamiliar-code discovery.',
    'Use code_graph_query/code_graph_context for structural questions such as callers, imports, impact, and neighborhood traversal.',
    'Use rg/glob only for exact text, exact symbol, or known-path lookups.',
  ];

  if (graphFreshness === 'fresh') {
    routingRules.push(
      'Code graph is fresh: prefer code_graph_query/code_graph_context after discovery when the task asks for structure.',
    );
  } else {
    routingRules.push(
      'Code graph is not ready: prefer CocoIndex for discovery until code_graph_scan restores graph freshness.',
    );
  }

  if (!cocoIndexAvailable) {
    routingRules.push(
      'CocoIndex is unavailable: rely on code_graph_* for structure and rg/glob for exact lookup.',
    );
  }

  let routingRecommendation: string;
  if (cocoIndexAvailable && graphFreshness === 'fresh') {
    routingRecommendation =
      'Use CocoIndex for semantic discovery, then use code_graph_query/code_graph_context for structural follow-up.';
  } else if (cocoIndexAvailable) {
    routingRecommendation =
      'Use CocoIndex first; run code_graph_scan before depending on code_graph_query/code_graph_context.';
  } else if (graphFreshness === 'fresh') {
    routingRecommendation =
      'CocoIndex unavailable: use code_graph_query/code_graph_context for structural exploration and rg/glob for exact lookup.';
  } else {
    routingRecommendation =
      'CocoIndex unavailable and code graph not ready: use rg/glob for exact lookup, then run code_graph_scan before structural analysis.';
  }

  return {
    routingRules,
    routingRecommendation,
  };
}
```

### 2) Extend `hooks/memory-surface.ts` PrimePackage
This is the post-first-tool routing payload. Add explicit rules so the second and later tool choices get policy, not just availability/status.

```ts
import { buildRoutingGuidance } from '../lib/session/routing-guidance.js';

interface PrimePackage {
  specFolder: string | null;
  currentTask: string | null;
  codeGraphStatus: 'fresh' | 'stale' | 'empty';
  cocoIndexAvailable: boolean;
  routingRules: string[];
  recommendedCalls: string[];
}

function buildPrimePackage(
  toolArgs: Record<string, unknown>,
  graphSnapshot: NonNullable<AutoSurfaceResult['codeGraphStatus']>,
): PrimePackage {
  const specFolder = typeof toolArgs.specFolder === 'string' ? toolArgs.specFolder : null;

  const taskFields = ['input', 'query', 'prompt'] as const;
  let currentTask: string | null = null;
  for (const f of taskFields) {
    if (typeof toolArgs[f] === 'string' && (toolArgs[f] as string).length >= 3) {
      currentTask = (toolArgs[f] as string).slice(0, 200);
      break;
    }
  }

  let codeGraphStatus: PrimePackage['codeGraphStatus'] = 'empty';
  if (graphSnapshot.status === 'ok' && graphSnapshot.data) {
    const lastScan = graphSnapshot.data.lastScanAt;
    const totalFiles = graphSnapshot.data.totalFiles ?? 0;
    if (totalFiles === 0) {
      codeGraphStatus = 'empty';
    } else if (!lastScan || (Date.now() - new Date(lastScan).getTime() > 24 * 60 * 60 * 1000)) {
      codeGraphStatus = 'stale';
    } else {
      codeGraphStatus = 'fresh';
    }
  }

  const cocoIndexAvailable = isCocoIndexAvailable();
  const { routingRules } = buildRoutingGuidance(codeGraphStatus, cocoIndexAvailable);

  const recommendedCalls: string[] = [];
  if (codeGraphStatus === 'stale' || codeGraphStatus === 'empty') {
    recommendedCalls.push('code_graph_scan');
  }
  if (!specFolder) {
    recommendedCalls.push('memory_context({ input: "resume previous work", mode: "resume", profile: "resume" })');
  }
  if (cocoIndexAvailable && recommendedCalls.length === 0) {
    recommendedCalls.push('memory_match_triggers({ prompt: "<your task>" })');
  }

  return {
    specFolder,
    currentTask,
    codeGraphStatus,
    cocoIndexAvailable,
    routingRules,
    recommendedCalls,
  };
}
```

### 3) Extend `lib/session/session-snapshot.ts`
`cocoIndexAvailable` already exists here; the missing state is the synthesized routing recommendation.

```ts
import { buildRoutingGuidance } from './routing-guidance.js';

export interface SessionSnapshot {
  specFolder: string | null;
  currentTask: string | null;
  graphFreshness: 'fresh' | 'stale' | 'empty' | 'error';
  cocoIndexAvailable: boolean;
  routingRecommendation: string;
  sessionQuality: 'healthy' | 'degraded' | 'critical' | 'unknown';
  lastToolCallAgoMs: number | null;
  primed: boolean;
}

export function getSessionSnapshot(): SessionSnapshot {
  const now = Date.now();

  let specFolder: string | null = null;
  let currentTask: string | null = null;
  try {
    const metrics = getSessionMetrics();
    specFolder = metrics.currentSpecFolder;
    currentTask = null;
  } catch { /* metrics unavailable */ }

  const graphFreshness = resolveGraphFreshness();

  let cocoIndexAvailable = false;
  try {
    cocoIndexAvailable = isCocoIndexAvailable();
  } catch { /* unavailable */ }

  const { routingRecommendation } = buildRoutingGuidance(graphFreshness, cocoIndexAvailable);

  let sessionQuality: SessionSnapshot['sessionQuality'] = 'unknown';
  try {
    const qs = computeQualityScore();
    sessionQuality = qs.level;
  } catch { /* unknown */ }

  let lastToolCallAgoMs: number | null = null;
  try {
    const last = getLastToolCallAt();
    if (last !== null) lastToolCallAgoMs = now - last;
  } catch { /* null */ }

  let primed = false;
  try {
    primed = isSessionPrimed();
  } catch { /* not primed */ }

  return {
    specFolder,
    currentTask,
    graphFreshness,
    cocoIndexAvailable,
    routingRecommendation,
    sessionQuality,
    lastToolCallAgoMs,
    primed,
  };
}
```

### 4) Companion wiring required in `context-server.ts`
Without this, the new fields exist in TypeScript but remain invisible to non-hook CLIs.

```ts
interface AutoSurfaceResult {
  constitutional: unknown[];
  triggered: unknown[];
  codeGraphStatus?: {
    status: 'ok' | 'error';
    data?: Record<string, unknown>;
    error?: string;
  };
  sessionPrimed?: boolean;
  primedTool?: string;
  primePackage?: {
    specFolder: string | null;
    currentTask: string | null;
    codeGraphStatus: 'fresh' | 'stale' | 'empty';
    cocoIndexAvailable: boolean;
    routingRules: string[];
    recommendedCalls: string[];
  };
  surfaced_at?: string;
  latencyMs?: number;
}

function injectSessionPrimeHints(
  envelope: Record<string, unknown>,
  meta: Record<string, unknown>,
  sessionPrimeContext: AutoSurfaceResult,
): void {
  const hints = Array.isArray(envelope.hints)
    ? envelope.hints.filter((hint): hint is string => typeof hint === 'string')
    : [];
  envelope.hints = hints;

  const constitutionalCount = Array.isArray(sessionPrimeContext.constitutional)
    ? sessionPrimeContext.constitutional.length
    : 0;
  const codeGraphStatus = sessionPrimeContext.codeGraphStatus;
  const codeGraphState = codeGraphStatus?.status === 'ok'
    ? 'loaded code graph status'
    : 'code graph status unavailable';

  hints.push(
    `Session priming: loaded ${constitutionalCount} constitutional memories and ${codeGraphState}`,
  );

  const pkg = sessionPrimeContext.primePackage;
  if (pkg) {
    if (pkg.specFolder) {
      hints.push(`Active spec folder: ${pkg.specFolder}`);
    }
    hints.push(`Code graph: ${pkg.codeGraphStatus}, CocoIndex: ${pkg.cocoIndexAvailable ? 'available' : 'not installed'}`);
    if (pkg.routingRules.length > 0) {
      hints.push(`Routing rules: ${pkg.routingRules.join(' | ')}`);
    }
    if (pkg.recommendedCalls.length > 0) {
      hints.push(`Recommended next calls: ${pkg.recommendedCalls.join(', ')}`);
    }
  }

  meta.sessionPriming = sessionPrimeContext;
}
```

And replace the current local recommendation synthesis in `buildServerInstructions()` with the snapshot field:

```ts
const { getSessionSnapshot } = await import('./lib/session/session-snapshot.js');
const snap = getSessionSnapshot();
const hasData = snap.specFolder || snap.graphFreshness !== 'error' || snap.sessionQuality !== 'unknown';
if (hasData) {
  lines.push('');
  lines.push('## Session Recovery');
  lines.push(`- Last spec folder: ${snap.specFolder || 'none'}`);
  lines.push(`- Code graph: ${snap.graphFreshness}`);
  lines.push(`- CocoIndex: ${snap.cocoIndexAvailable ? 'available' : 'unavailable'}`);
  lines.push(`- Session quality: ${snap.sessionQuality}`);
  lines.push(`- Routing recommendation: ${snap.routingRecommendation}`);
}
```

## Findings:
1. `PrimePackage` is still the correct post-selection intervention point for second and later tool decisions, but its current payload is missing actual routing policy. Today it only carries `specFolder`, `currentTask`, `codeGraphStatus`, `cocoIndexAvailable`, and `recommendedCalls`, and `recommendedCalls` only suggests bootstrap or maintenance actions such as `code_graph_scan`, `memory_context(...resume...)`, or `memory_match_triggers(...)`. That means the package exposes environment state but not the semantic-vs-structural-vs-exact-match rule the model needs after the first tool call. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:64-70] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:316-364]
2. The cleanest implementation is to synthesize `routingRules` from the same two signals already available in `buildPrimePackage()`: code graph freshness and CocoIndex availability. This keeps PrimePackage lightweight, deterministic, and directly aligned with the root-cause routing decision: semantic discovery -> CocoIndex, structural traversal -> Code Graph, exact lookup -> `rg`/`glob`, with a stale-graph fallback back to CocoIndex. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:335-363]
3. The earlier assumption that `SessionSnapshot` still needs `cocoIndexAvailable` is no longer true. `SessionSnapshot` already exposes `cocoIndexAvailable`; the real missing state is a derived `routingRecommendation` string that can be shown in startup/session-recovery instructions. The implementation-ready fix is therefore additive, not a reintroduction of an absent field. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:17-25] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:67-75]
4. A shared routing-guidance helper is the lowest-drift fix because PrimePackage and SessionSnapshot are parallel surfaces for the same policy problem. If each file hand-builds its own strings, hook-compatible and non-hook CLIs will diverge again over time. A single `buildRoutingGuidance(graphFreshness, cocoIndexAvailable)` helper keeps both surfaces on the same routing truth table. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:316-364] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:53-105]
5. One additional companion change is required for the proposal to be implementation-ready: `context-server.ts` duplicates the `primePackage` shape inline and is also responsible for rendering PrimePackage hints into the envelope. If that duplicate type and the hint renderer are not updated, `routingRules` will exist in `memory-surface.ts` but never be surfaced to non-hook CLIs. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:151-168] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:530-565]
6. The session snapshot change only matters if startup/server instructions consume it. `buildServerInstructions()` currently computes a local `recommended` string from primed/graph/session-quality heuristics, but it does not carry any explicit CocoIndex-vs-Code-Graph routing statement. Replacing that local synthesis with `snap.routingRecommendation` is the smallest change that makes the same routing policy visible during non-hook CLI recovery before the next tool choice. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:627-645] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/session/session-snapshot.ts:53-105]
7. The practical effect of this extension is role separation across phases: `PrimePackage.routingRules` helps after the first tool call, while `SessionSnapshot.routingRecommendation` helps at startup/recovery time. Together they cover both hook-compatible flows (where priming metadata is injected into responses) and non-hook flows (where recovery/server instructions must carry the policy explicitly). [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:366-415] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:530-565] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:627-645]

## Key Questions Answered:
- Answered the PrimePackage extension question: add `routingRules: string[]` and populate it from code graph freshness + CocoIndex availability.
- Answered the routing-logic question: centralize routing synthesis in a shared helper so PrimePackage and SessionSnapshot use the same policy.
- Answered the session snapshot question: keep existing `cocoIndexAvailable`, add `routingRecommendation`, and surface it from `buildServerInstructions()`.
- Answered the implementation-completeness question: `context-server.ts` must also be updated because it duplicates the PrimePackage shape and controls hint/session-recovery rendering.

## New Information Ratio: 0.63

## Next Focus Recommendation: Verify whether the same routing-guidance helper should also feed `buildServerInstructions()` directly and tool-description text in `tool-schemas.ts`, so the semantic-vs-structural policy is visible both before the first tool choice and after first-call priming.
