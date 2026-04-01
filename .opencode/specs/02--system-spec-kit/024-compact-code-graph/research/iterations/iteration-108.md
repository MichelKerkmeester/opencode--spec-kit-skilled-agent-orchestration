# Research Iteration 108: Cold Start Optimization — Minimum Viable Prime

## Current State

The system currently has three distinct bootstrap paths with very different cost profiles:

| Path | What it does | Cost profile | Primary value |
| --- | --- | --- | --- |
| `@context-prime` agent | `memory_context(resume)` -> `code_graph_status` -> `ccc_status` -> `session_health` | Heavy, because the first call dominates | Best manual "full recovery" experience |
| MCP auto-prime `primeSessionIfNeeded()` | `getConstitutionalMemories()` -> `enrichWithRetrievalDirectives()` -> `getCodeGraphStatusSnapshot()` -> `buildPrimePackage()` | Very cheap; typically `<50ms` | Passive first-tool bootstrap |
| `session_resume` | `handleMemoryContext(resume)` + graph stats + CocoIndex availability | Medium-heavy; still dominated by resume retrieval | Single-call recovery without `session_health` |

Key implementation facts:

- `memory_context(resume)` routes to `executeResumeStrategy()`, which calls `handleMemorySearch()` with `limit=5`, `includeContent=true`, anchors `['state','next-steps','summary','blockers']`, `enableDedup=false`, `useDecay=false`. This is the expensive part because it performs real retrieval and ranking work.
- `primeSessionIfNeeded()` does not call `memory_context`; it uses a cached constitutional-memory query, a code-graph snapshot, and a cheap package builder.
- `session_health` is derived mostly from in-memory metrics plus graph freshness; it adds no recovery content.
- `buildServerInstructions()` is startup-time-only and effectively amortized to near-zero at first user turn.

## Analysis

### Latency breakdown by call

| Call | Internal work | Relative latency | Why |
| --- | --- | --- | --- |
| `memory_context(resume)` | DB readiness check, resume-mode orchestration, `memory_search`, ranking, content inclusion, anchors | **Very high** | Only path doing full retrieval/search/scoring |
| `code_graph_status` / `getCodeGraphStatusSnapshot()` | SQLite stats + stale/error count query | **Low** | Pure local stats read |
| `ccc_status` / `isCocoIndexAvailable()` | `existsSync` plus optional stat checks | **Very low** | Filesystem existence check |
| `session_health` | Read timestamps, compute freshness/quality score, reuse graph snapshot | **Low** | Mostly derived state |
| `buildServerInstructions()` | One memory stats read at server startup | **Near-zero at turn time** | Already computed before user work |
| `primeSessionIfNeeded()` | constitutional query (cached 60s), graph snapshot, prime package | **Very low** | No semantic retrieval |

### Where the time really goes

Cold-start cost is overwhelmingly concentrated in `memory_context(resume)`. The other three `@context-prime` calls are not the problem:

- `code_graph_status` is a local snapshot.
- `ccc_status` is a binary-presence check.
- `session_health` is mostly meta-state and is especially low-value on a true cold start.

This means the current four-step bootstrap is structurally misleading: it looks like four calls, but almost all latency is in one call.

### Information value per call

| Call | First-turn value | Notes |
| --- | --- | --- |
| `memory_context(resume)` | **High for resume**, low for fresh-task starts | Needed only when recovering prior work |
| code graph snapshot | **Medium-high** | Tells the model whether structural tools are trustworthy |
| CocoIndex availability | **Medium** | Helpful, but not strictly required for a productive first turn |
| `session_health` | **Low on cold start** | Usually reports "not primed" / stale-by-definition before work begins |
| startup instructions | **Medium** | Good ambient context: memory counts, stale count, search channels |

### Why `session_health` should not be in the minimum viable prime

`session_health` is useful mid-session, not at boot:

- It depends on `lastToolCallAt`, `memoryRecoveryCalls`, and continuity metrics.
- On a fresh session it often reports a predictable low score because no work has happened yet.
- It does not recover task state, spec folder, blockers, or next steps.

So it adds cost and payload without materially improving first-turn productivity.

### Absolute minimum context for a productive first turn

For a model to behave productively on turn one, the minimum useful dynamic context is:

1. **Active spec folder** or "none known".
2. **Current task summary** or "new task / unknown".
3. **Next step or blocker**.
4. **Code graph freshness** (`fresh`, `stale`, `empty`).

Everything else is optional for MVP:

- CocoIndex availability is useful but not essential.
- Session quality score is nice-to-have, not boot-critical.
- Memory counts/search channels can live in startup instructions.

### Comparison with other tools

| Tool | Bootstrap model | Implication |
| --- | --- | --- |
| Cursor | Static rules + index, no session prime | Cheap startup, weak explicit resume |
| Windsurf | Memory recall at start | More dynamic, but startup recall is the expensive part |
| Aider | Repo-map at startup, no session memory | Pays for structural context, not task continuity |
| Continue.dev | Mostly manual context | Minimal automatic cost |
| Claude Code | Static `CLAUDE.md` + hooks | Cheap when hookless, rich when hooks exist |

The pattern across tools is consistent: **cheap static/bootstrap context first, expensive recovery only when needed**. The current `@context-prime` flow is closer to "always do recovery" than to the industry minimum.

## Proposals

### Proposal A — Make auto-prime the true default MVP

Use the existing `primeSessionIfNeeded()` behavior as the default cold-start prime and stop treating full resume as mandatory.

**What the user/model gets:**
- code graph freshness
- CocoIndex availability
- inferred current task from tool args
- recommended next call
- optional constitutional memories

**Pros**
- Already implemented
- `<50ms` class overhead
- No retrieval/search tax
- Matches the "cheap bootstrap first" pattern of other tools

**Cons**
- Weak for session recovery
- Does not recover blockers/next steps from prior work

**Estimated change size**
- Runtime: `0-20 LOC`
- Agent/docs cleanup: `20-40 LOC`

### Proposal B — Replace 4-step `@context-prime` with single-call `session_resume`

Make `session_resume` the standard "manual recovery" call and drop separate `code_graph_status` / `ccc_status` / `session_health` from the bootstrap recipe.

**Why it works**
- `session_resume` already bundles the only expensive thing that matters (`memory_context(resume)`) plus graph + CocoIndex.
- It removes redundant round trips.
- `session_health` remains available on demand.

**Pros**
- Single call
- No new runtime primitives
- Clearer UX

**Cons**
- Still pays full resume retrieval cost
- Not minimum-latency, only minimum-round-trip

**Estimated change size**
- Docs/agent prompt change: `20-35 LOC`
- Optional tests if behavior contract changes: `30-60 LOC`

### Proposal C — Add `session_resume(minimal: true)` or `session_prime(mode: "resume-lite")`

Create a constrained resume path that returns only the minimum viable recovery fields:

- top `state`
- top `next-steps`
- maybe one `blocker`
- graph freshness
- optional CocoIndex bit

Implementation idea:
- reduce anchors from `['state','next-steps','summary','blockers']` to `['state','next-steps']`
- reduce `limit` from `5` to `2`
- keep `includeContent=true`
- omit `session_health`
- optionally omit CocoIndex if strict minimum is desired

**Pros**
- Preserves real recovery
- Single call
- Smaller payload and likely materially faster than full resume

**Cons**
- Still heavier than passive auto-prime
- Requires runtime/schema/test work

**Estimated change size**
- Handler + args/schema: `35-70 LOC`
- tool registration/tests: `80-140 LOC`
- docs: `20-30 LOC`
- total: `135-240 LOC`

### Proposal D — Add a new `session_prime` tool built from cheap primitives only

Build a dedicated cold-start tool from:
- `getCodeGraphStatusSnapshot()`
- `isCocoIndexAvailable()`
- current metrics/spec folder if known
- startup instruction stats already computed or cached
- optional constitutional titles only

This tool would **not** call `memory_context`.

**Pros**
- True minimum-latency explicit prime
- Semantically clean separation between "prime" and "resume"
- Best alignment with other tools' startup behavior

**Cons**
- Does not solve recovery by itself
- Adds one more tool concept

**Estimated change size**
- handler + schema + registration: `70-110 LOC`
- tests: `80-140 LOC`
- docs/agent: `20-30 LOC`
- total: `170-280 LOC`

## Recommendation

The minimum viable prime should be **two-tiered**, not one-size-fits-all:

### Tier 1: Default cold-start prime
Use **cheap passive priming only**:
- `buildServerInstructions()` at server startup
- `primeSessionIfNeeded()` on first tool call

This is the real MVP because it is already in the right latency envelope and gives enough environment context for a new task.

### Tier 2: Explicit recovery prime
When the user intent is clearly "resume previous work," use **one single resume call**, not the four-call `@context-prime` workflow.

Best near-term choice:
- standardize on `session_resume`

Best end-state choice:
- add `session_resume(minimal)` / `resume-lite`

### Final answer to "what is the absolute minimum context?"

The smallest dynamic payload that still changes model behavior productively is:

- `specFolder`
- `currentTaskSummary`
- `nextStepOrBlocker`
- `codeGraphFreshness`

If resume context is unavailable, the fallback minimum is:

- `codeGraphFreshness`
- `cocoIndexAvailable`
- `recommendedNextCall`

That fallback is basically what the current auto-prime already provides.

## Implementation Plan

### Phase 1 — Stop over-priming by default
- Update `@context-prime` guidance to prefer:
  - default: passive auto-prime
  - explicit recovery: `session_resume`
- Remove `session_health` from bootstrap-critical guidance.
- Keep `session_health` as a diagnostic tool only.

**Estimate:** `20-40 LOC`

### Phase 2 — Collapse manual recovery to one call
- Replace the documented 4-step bootstrap with:
  - `session_resume({ specFolder? })`
- Update orchestrator/bootstrap docs to treat `session_resume` as the standard recovery path.

**Estimate:** `20-35 LOC` docs only, or `50-90 LOC` with verification/test updates

### Phase 3 — Add `resume-lite` for true MVP recovery
Implement either:
- `session_resume({ minimal: true })`, or
- `session_prime({ mode: "resume-lite" })`

Behavior:
- anchors: `state`, `next-steps`
- limit: `2`
- no `session_health`
- graph freshness included
- CocoIndex optional

**Estimate:** `135-240 LOC`

### Phase 4 — Optional dedicated `session_prime`
Only if explicit-tool ergonomics matter:
- add a cheap prime-only tool for first-turn status without retrieval
- keep it separate from recovery

**Estimate:** `170-280 LOC`

### Recommended shipping order
1. **Docs/agent simplification now**: treat auto-prime as default, `session_resume` as manual recovery.
2. **Measure** actual `session_resume` latency in production traces.
3. **Only then** add `resume-lite` if full `session_resume` is still too slow.

The key optimization is conceptual: **do not pay the resume-retrieval tax unless the user is actually resuming work.**
