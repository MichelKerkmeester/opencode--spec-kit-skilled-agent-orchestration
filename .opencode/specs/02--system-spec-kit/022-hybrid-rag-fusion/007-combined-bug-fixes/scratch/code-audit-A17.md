● SQL: Initialize audit todos
  └ 3 row(s) inserted. Last inserted row ID: 3.

● Read .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/07-community-detec
  tion.md
  └ 33 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/08-graph-and-cogni
  tive-memory-fixes.md
  └ 72 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/09-anchor-tags-as-
  graph-nodes.md
  └ 34 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/10-causal-neighbor
  -boost-and-injection.md
  └ 31 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/11-temporal-contig
  uity-layer.md
  └ 27 lines read

● Todo started: collect-source-paths

● Extract source file paths from feature markdowns
  $ python - <<'PY'
  from pathlib import Path
  import re, json
  base=Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation')...
  └ 28 lines...

● Todo started: collect-source-paths

● Extract source file paths from feature markdowns
  $ python3 - <<'PY'
  from pathlib import Path
  import re, json
  base=Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation')...
  └ 158 lines...

● Locate README files for source dirs
  $ python3 - <<'PY'
  from pathlib import Path
  root=Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit')
  files=[...
  └ 49 lines...

● Read .opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts
  └ 576 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/attention-decay.ts
  └ 359 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts
  └ 389 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts
  └ 57 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts lines 1-260
  └ 259 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts lines 261-520
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts
  └ 414 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/scoring/folder-scoring.ts
  └ 7 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts
  └ 231 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts
  └ 271 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts lines 1-280
  └ 280 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts lines 521-900
  └ 154 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts lines 281-620
  └ 340 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/storage/access-tracker.ts
  └ 270 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/telemetry/scoring-observability.ts
  └ 222 lines read

● Read .opencode/skill/system-spec-kit/shared/normalization.ts
  └ 246 lines read

● Read .opencode/skill/system-spec-kit/shared/scoring/folder-scoring.ts
  └ 352 lines read

● Read .opencode/skill/system-spec-kit/shared/types.ts
  └ 507 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts
  └ 259 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/anchor-metadata.ts
  └ 181 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/types.ts
  └ 415 lines read

● Read .opencode/skill/system-spec-kit/shared/contracts/retrieval-trace.ts
  └ 196 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts
  └ 302 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/session-boost.ts
  └ 212 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/temporal-contiguity.ts
  └ 174 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts lines 1-280
  └ 280 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts lines 281-620
  └ 340 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts lines 621-980
  └ 128 lines read

● Todo started: check-readme-coverage

● Read all source files and compute README coverage
  $ python3 - <<'PY'
  from pathlib import Path
  import re, json
  root=Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit')...
  └ 354 lines...

● Todo completed: audit-source-files, check-readme-coverage

---
FEATURE: 07-community-detection.md  
SOURCE_FILES_AUDITED: 2  
BUGS_FOUND: 1

BUG: F07-B01  
FILE: mcp_server/lib/graph/community-detection.ts:334-337  
SEVERITY: P1-IMPORTANT  
TYPE: EDGE_CASE  
DESCRIPTION: Debounce checksum assumes `source_id`/`target_id` are numeric; non-numeric IDs cast to 0, so graph changes can be missed and stale community assignments reused.  
EVIDENCE:
```ts
.prepare("SELECT COALESCE(SUM(CAST(source_id AS INTEGER) + CAST(target_id AS INTEGER)), 0) AS cksum FROM causal_edges")
const currentDebounceHash = `${currentEdgeCount}:${edgeStatsRow?.maxId ?? 0}:${edgeChecksumRow?.cksum ?? 0}`;
```
SUGGESTED_FIX: Build checksum from stable text values (e.g., hash of `source_id || '->' || target_id || ':' || relation || ':' || strength`) instead of integer casts.

README_COVERAGE:
- mcp_server/lib/graph/community-detection.ts: LISTED in mcp_server/lib/graph/README.md
- mcp_server/tests/community-detection.vitest.ts: MISSING in mcp_server/tests/README.md
---

---
FEATURE: 08-graph-and-cognitive-memory-fixes.md  
SOURCE_FILES_AUDITED: 39  
BUGS_FOUND: 2

BUG: F08-B01  
FILE: mcp_server/lib/cognitive/rollout-policy.ts:41-47  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: Rollout gating is bypassed when `identity` is absent; for partial rollouts (<100%), anonymous callers are always enabled.  
EVIDENCE:
```ts
if (!identity || identity.trim().length === 0) {
  return true;
}
```
SUGGESTED_FIX: For partial rollouts, return `false` when identity is missing (or derive a stable fallback identity) so percentage rollout is enforced.

BUG: F08-B02  
FILE: mcp_server/lib/storage/access-tracker.ts:81-99  
SEVERITY: P2-MINOR  
TYPE: RESOURCE  
DESCRIPTION: `trackMultipleAccesses()` does not enforce `MAX_ACCUMULATOR_SIZE`, unlike `trackAccess()`, so batch-heavy paths can grow the accumulator map without bound.  
EVIDENCE:
```ts
function trackMultipleAccesses(memoryIds: number[]): { tracked: number; flushed: number } {
  let tracked = 0;
  let flushed = 0;
  for (const id of memoryIds) {
    const current = accumulators.get(id) || 0;
```
SUGGESTED_FIX: Apply the same size-guard/flush logic used in `trackAccess()` at the start of `trackMultipleAccesses()`.

README_COVERAGE:
- mcp_server/lib/cognitive/attention-decay.ts: LISTED in mcp_server/lib/cognitive/README.md
- mcp_server/lib/cognitive/fsrs-scheduler.ts: LISTED in mcp_server/lib/cognitive/README.md
- mcp_server/lib/cognitive/rollout-policy.ts: LISTED in mcp_server/lib/cognitive/README.md
- mcp_server/lib/cognitive/working-memory.ts: LISTED in mcp_server/lib/cognitive/README.md
- mcp_server/lib/graph/graph-signals.ts: LISTED in mcp_server/lib/graph/README.md
- mcp_server/lib/scoring/composite-scoring.ts: LISTED in mcp_server/lib/scoring/README.md
- mcp_server/lib/scoring/folder-scoring.ts: LISTED in mcp_server/lib/scoring/README.md
- mcp_server/lib/scoring/importance-tiers.ts: LISTED in mcp_server/lib/scoring/README.md
- mcp_server/lib/scoring/interference-scoring.ts: LISTED in mcp_server/lib/scoring/README.md
- mcp_server/lib/storage/access-tracker.ts: LISTED in mcp_server/lib/storage/README.md
- mcp_server/lib/telemetry/scoring-observability.ts: LISTED in mcp_server/lib/telemetry/README.md
- shared/normalization.ts: LISTED in shared/README.md
- shared/scoring/folder-scoring.ts: LISTED in shared/scoring/README.md
- shared/types.ts: LISTED in shared/README.md
- mcp_server/tests/access-tracker-extended.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/access-tracker.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/attention-decay.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/checkpoint-working-memory.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/composite-scoring.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/decay.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/feature-eval-graph-signals.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/folder-scoring.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/fsrs-scheduler.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/graph-signals.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/importance-tiers.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/interference.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/memory-types.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/rollout-policy.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/score-normalization.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/scoring-observability.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/scoring.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/unit-composite-scoring-types.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/unit-folder-scoring-types.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/unit-normalization-roundtrip.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/unit-normalization.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/unit-tier-classifier-types.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/unit-transaction-metrics-types.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/working-memory-event-decay.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/working-memory.vitest.ts: LISTED in mcp_server/tests/README.md
---

---
FEATURE: 09-anchor-tags-as-graph-nodes.md  
SOURCE_FILES_AUDITED: 11  
BUGS_FOUND: 1

BUG: F09-B01  
FILE: mcp_server/lib/search/anchor-metadata.ts:56-63  
SEVERITY: P2-MINOR  
TYPE: EDGE_CASE  
DESCRIPTION: Anchor parser only matches uppercase `ANCHOR` tags, while other code paths accept lowercase; lowercase tags are silently ignored during metadata enrichment.  
EVIDENCE:
```ts
const ANCHOR_OPEN_RE = /<!--\s*ANCHOR:\s*(\S+)\s*-->/;
const ANCHOR_CLOSE_RE = /<!--\s*\/ANCHOR:\s*(\S+)\s*-->/;
```
SUGGESTED_FIX: Make regexes case-insensitive (`/i`) or support both variants explicitly like the chunker.

README_COVERAGE:
- mcp_server/lib/chunking/anchor-chunker.ts: LISTED in mcp_server/lib/chunking/README.md
- mcp_server/lib/search/anchor-metadata.ts: LISTED in mcp_server/lib/search/README.md
- mcp_server/lib/search/pipeline/types.ts: LISTED in mcp_server/lib/search/pipeline/README.md
- shared/contracts/retrieval-trace.ts: LISTED in shared/contracts/README.md
- mcp_server/tests/anchor-metadata.vitest.ts: MISSING in mcp_server/tests/README.md
- mcp_server/tests/memory-types.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/retrieval-trace.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/unit-composite-scoring-types.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/unit-folder-scoring-types.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/unit-tier-classifier-types.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/unit-transaction-metrics-types.vitest.ts: LISTED in mcp_server/tests/README.md
---

---
FEATURE: 10-causal-neighbor-boost-and-injection.md  
SOURCE_FILES_AUDITED: 6  
BUGS_FOUND: 1

BUG: F10-B01  
FILE: mcp_server/lib/search/pipeline/stage2-fusion.ts:695-699  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: Final synchronization can preserve stale `intentAdjustedScore` values above `score`, but downstream `resolveEffectiveScore()` prioritizes `intentAdjustedScore`, which can undo later demotions/adjustments and mis-rank results.  
EVIDENCE:
```ts
for (const result of results) {
  if (typeof result.intentAdjustedScore === 'number' && typeof result.score === 'number') {
    result.intentAdjustedScore = Math.max(result.intentAdjustedScore, result.score);
  }
}
```
SUGGESTED_FIX: Keep both fields equal after final scoring (`intentAdjustedScore = score`) or stop using `intentAdjustedScore` as top-priority fallback after Stage 2 finalization.

README_COVERAGE:
- mcp_server/lib/search/causal-boost.ts: LISTED in mcp_server/lib/search/README.md
- mcp_server/lib/search/pipeline/stage2-fusion.ts: LISTED in mcp_server/lib/search/pipeline/README.md
- mcp_server/lib/search/pipeline/types.ts: LISTED in mcp_server/lib/search/pipeline/README.md
- mcp_server/lib/search/session-boost.ts: LISTED in mcp_server/lib/search/README.md
- mcp_server/tests/causal-boost.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/phase2-integration.vitest.ts: LISTED in mcp_server/tests/README.md
---

---
FEATURE: 11-temporal-contiguity-layer.md  
SOURCE_FILES_AUDITED: 2  
BUGS_FOUND: 1

BUG: F11-B01  
FILE: mcp_server/lib/cognitive/temporal-contiguity.ts:53-56, 74  
SEVERITY: P1-IMPORTANT  
TYPE: EDGE_CASE  
DESCRIPTION: `windowSeconds` is not validated/clamped before use; zero/negative values cause invalid boost math (`timeDelta / windowSeconds`) and contradict the documented bounded window behavior.  
EVIDENCE:
```ts
export function vectorSearchWithContiguity(
  results: Array<{ id: number; similarity: number; created_at: string }> | null,
  windowSeconds: number,
)
...
const rawBoost = (1 - timeDelta / windowSeconds) * BOOST_FACTOR;
```
SUGGESTED_FIX: Normalize input at entry (`const safeWindow = Math.max(1, Math.min(MAX_WINDOW, Math.floor(windowSeconds || DEFAULT_WINDOW)))`) and use `safeWindow` for comparisons/division.

README_COVERAGE:
- mcp_server/lib/cognitive/temporal-contiguity.ts: LISTED in mcp_server/lib/cognitive/README.md
- mcp_server/tests/temporal-contiguity.vitest.ts: LISTED in mcp_server/tests/README.md
---


Total usage est:        1 Premium request
API time spent:         2m 51s
Total session time:     3m 9s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.3-codex           810.9k in, 10.4k out, 709.8k cached (Est. 1 Premium request)
