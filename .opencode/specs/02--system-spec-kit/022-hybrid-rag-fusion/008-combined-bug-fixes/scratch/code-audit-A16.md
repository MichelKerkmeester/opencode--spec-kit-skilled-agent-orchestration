● Todo added: Extract source file paths from all feature catalog markdown files

● Read .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/01-typed-weighted-
  degree-channel.md
  └ 41 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/02-co-activation-b
  oost-strength-increase.md
  └ 27 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/03-edge-density-me
  asurement.md
  └ 25 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/04-weight-history-
  audit-tracking.md
  └ 39 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/05-graph-momentum-
  scoring.md
  └ 32 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/06-causal-depth-si
  gnal.md
  └ 36 lines read

● Todo started: extract-feature-sources

● Grep "`mcp_server/[^`]+`" in *.md (/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation)
  └ 5 lines found

● Extract unique source paths from feature files
  $ python3 - <<'PY'
  import re,glob,os
  base='/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation'
  paths=[]...
  └ 81 lines...

● Extract unique source paths from specified feature files
  $ python3 - <<'PY'
  import re
  files=[
  '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit
  /feature_catalog/10--graph-signal-activation/01-typed-weighted-degree-channel.md',...
  └ 116 lines...

● Read .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts
  └ 385 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts
  └ 57 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/eval/edge-density.ts
  └ 210 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts
  └ 414 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts
  └ 265 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts
  └ 367 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/causal-boost.ts
  └ 302 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts
  └ 13 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts
  └ 474 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/search-types.ts
  └ 11 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts
  └ 283 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts lines 1-260
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts lines 261-520
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts lines 521-780
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts lines 781-1040
  └ 2 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/storage/causal-edges.ts lines 1041-1300

● Read .opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/causal-boost.vitest.ts
  └ 118 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/causal-edges.vitest.ts
  └ 319 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts
  └ 268 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/degree-computation.vitest.ts
  └ 363 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/edge-density.vitest.ts
  └ 426 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts lines 1-260
  └ 259 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts lines 261-520
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts lines 1-260
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts lines 261-520
  └ 259 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts lines 1-260
  └ 259 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts lines 261-520
  └ 259 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/graph-flags.vitest.ts
  └ 51 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/bm25-index.vitest.ts lines 521-900
  └ 76 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/causal-edges-unit.vitest.ts lines 521-900
  └ 287 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/content-normalizer.vitest.ts lines 521-900
  └ 105 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/graph-scoring-integration.vitest.ts
  └ 397 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts
  └ 223 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/rollout-policy.vitest.ts
  └ 91 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts
  └ 464 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/spec-folder-hierarchy.vitest.ts
  └ 533 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts
  └ 1 line read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts lines 1-260
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts lines 261-520
  └ 259 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/graph-signals.vitest.ts lines 521-900
  └ 92 lines read

● Glob "**/rollout-policy.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib
  └ 1 file found

● Glob "**/co-activation.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib
  └ 1 file found

● Read .opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts lines
  1-320
  └ 320 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/tests/feature-eval-graph-signals.vitest.ts lines
  321-760
  └ 309 lines read

● Glob "cache/**/*.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib
  └ No matches found

● Check README listing for source files
  $ python3 - <<'PY'
  import os,re
  base='/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit'
  files=[...
  └ 70 lines...

● Glob "**/rollout-policy.*" in /Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server
  └ 2 files found

● Todo completed: audit-source-files, check-readme-coverage

---
FEATURE: 01-typed-weighted-degree-channel.md  
SOURCE_FILES_AUDITED: 16  
BUGS_FOUND: 2

BUG: BUG-GSA-001  
FILE: mcp_server/lib/search/graph-flags.ts:6  
SEVERITY: P0-CRITICAL  
TYPE: LOGIC  
DESCRIPTION: Broken relative import points to a non-existent module path (`../cache/cognitive/rollout-policy`), which can fail module load/compile for graph flag evaluation.  
EVIDENCE: `import { isFeatureEnabled } from '../cache/cognitive/rollout-policy';`  
SUGGESTED_FIX: Change import to `../cognitive/rollout-policy` (or the actual existing path) and align all related imports/tests to the same location.

BUG: BUG-GSA-004  
FILE: mcp_server/lib/search/graph-search-fn.ts:135-136,152-154  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: FTS BM25 relevance is queried (`fts_score`) but discarded from returned candidate scores; output score uses only edge strength, weakening lexical relevance in downstream ranking.  
EVIDENCE: `-bm25(memory_fts, ...) AS fts_score` then `const score = ... row.strength ...`  
SUGGESTED_FIX: Combine strength and FTS relevance into returned `score` (e.g., normalized weighted blend) instead of strength-only.

README_COVERAGE:
- mcp_server/lib/cognitive/rollout-policy.ts: LISTED in mcp_server/lib/cognitive/README.md  
- mcp_server/lib/parsing/content-normalizer.ts: LISTED in mcp_server/lib/parsing/README.md  
- mcp_server/lib/search/bm25-index.ts: LISTED in mcp_server/lib/search/README.md  
- mcp_server/lib/search/graph-flags.ts: LISTED in mcp_server/lib/search/README.md  
- mcp_server/lib/search/graph-search-fn.ts: LISTED in mcp_server/lib/search/README.md  
- mcp_server/lib/search/search-types.ts: LISTED in mcp_server/lib/search/README.md  
- mcp_server/lib/search/spec-folder-hierarchy.ts: LISTED in mcp_server/lib/search/README.md  
- mcp_server/tests/bm25-index.vitest.ts: LISTED in mcp_server/tests/README.md  
- mcp_server/tests/content-normalizer.vitest.ts: MISSING in mcp_server/tests/README.md  
- mcp_server/tests/degree-computation.vitest.ts: LISTED in mcp_server/tests/README.md  
- mcp_server/tests/graph-flags.vitest.ts: LISTED in mcp_server/tests/README.md  
- mcp_server/tests/graph-scoring-integration.vitest.ts: LISTED in mcp_server/tests/README.md  
- mcp_server/tests/graph-search-fn.vitest.ts: LISTED in mcp_server/tests/README.md  
- mcp_server/tests/rollout-policy.vitest.ts: LISTED in mcp_server/tests/README.md  
- mcp_server/tests/rrf-degree-channel.vitest.ts: LISTED in mcp_server/tests/README.md  
- mcp_server/tests/spec-folder-hierarchy.vitest.ts: MISSING in mcp_server/tests/README.md  
---

---
FEATURE: 02-co-activation-boost-strength-increase.md  
SOURCE_FILES_AUDITED: 2  
BUGS_FOUND: 1

BUG: BUG-GSA-003  
FILE: mcp_server/lib/cognitive/co-activation.ts:131-133,142-153,349-357  
SEVERITY: P1-IMPORTANT  
TYPE: EDGE_CASE  
DESCRIPTION: Parsed `related_memories` entries are not type-guarded for numeric `similarity`; malformed values can propagate `NaN` into `decayedScore`, contaminating queue ordering and output scores.  
EVIDENCE: `related = JSON.parse(...)` then `similarity: rel.similarity` and later `decayedScore = ... * (rel.similarity / 100)`  
SUGGESTED_FIX: Validate each relation object (`id` finite int, `similarity` finite number in range), drop invalid entries, and guard `decayedScore` with `Number.isFinite`.

README_COVERAGE:
- mcp_server/lib/cognitive/co-activation.ts: LISTED in mcp_server/lib/cognitive/README.md  
- mcp_server/tests/co-activation.vitest.ts: LISTED in mcp_server/tests/README.md  
---

---
FEATURE: 03-edge-density-measurement.md  
SOURCE_FILES_AUDITED: 2  
BUGS_FOUND: 0

README_COVERAGE:
- mcp_server/lib/eval/edge-density.ts: LISTED in mcp_server/lib/eval/README.md  
- mcp_server/tests/edge-density.vitest.ts: LISTED in mcp_server/tests/README.md  
---

---
FEATURE: 04-weight-history-audit-tracking.md  
SOURCE_FILES_AUDITED: 12  
BUGS_FOUND: 1

BUG: BUG-GSA-004  
FILE: mcp_server/lib/search/graph-search-fn.ts:135-136,152-154  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: FTS-derived relevance is computed but not used in output score, causing lexical signal loss for graph candidates.  
EVIDENCE: `fts_score` selected, but candidate `score` assigned from `row.strength` only.  
SUGGESTED_FIX: Include normalized `fts_score` in candidate `score` composition.

README_COVERAGE:
- mcp_server/lib/parsing/content-normalizer.ts: LISTED in mcp_server/lib/parsing/README.md  
- mcp_server/lib/search/bm25-index.ts: LISTED in mcp_server/lib/search/README.md  
- mcp_server/lib/search/graph-search-fn.ts: LISTED in mcp_server/lib/search/README.md  
- mcp_server/lib/search/search-types.ts: LISTED in mcp_server/lib/search/README.md  
- mcp_server/lib/search/spec-folder-hierarchy.ts: LISTED in mcp_server/lib/search/README.md  
- mcp_server/lib/storage/causal-edges.ts: LISTED in mcp_server/lib/storage/README.md  
- mcp_server/tests/bm25-index.vitest.ts: LISTED in mcp_server/tests/README.md  
- mcp_server/tests/causal-edges-unit.vitest.ts: LISTED in mcp_server/tests/README.md  
- mcp_server/tests/causal-edges.vitest.ts: LISTED in mcp_server/tests/README.md  
- mcp_server/tests/content-normalizer.vitest.ts: MISSING in mcp_server/tests/README.md  
- mcp_server/tests/graph-search-fn.vitest.ts: LISTED in mcp_server/tests/README.md  
- mcp_server/tests/spec-folder-hierarchy.vitest.ts: MISSING in mcp_server/tests/README.md  
---

---
FEATURE: 05-graph-momentum-scoring.md  
SOURCE_FILES_AUDITED: 3  
BUGS_FOUND: 1

BUG: BUG-GSA-002  
FILE: mcp_server/lib/graph/graph-signals.ts:298-308  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: Causal depth computation uses first-visit BFS semantics (`if !depthMap.has(neighbor)`) which yields shortest depth from roots, not maximum root distance as specified.  
EVIDENCE: `if (!depthMap.has(neighbor)) { depthMap.set(neighbor, neighborDepth); ... }`  
SUGGESTED_FIX: Compute longest-path depth in DAG context (or iterative relaxation/topological DP); if cycles exist, define and implement explicit max-depth policy.

README_COVERAGE:
- mcp_server/lib/graph/graph-signals.ts: LISTED in mcp_server/lib/graph/README.md  
- mcp_server/tests/feature-eval-graph-signals.vitest.ts: LISTED in mcp_server/tests/README.md  
- mcp_server/tests/graph-signals.vitest.ts: LISTED in mcp_server/tests/README.md  
---

---
FEATURE: 06-causal-depth-signal.md  
SOURCE_FILES_AUDITED: 8  
BUGS_FOUND: 2

BUG: BUG-GSA-001  
FILE: mcp_server/lib/search/causal-boost.ts:9  
SEVERITY: P0-CRITICAL  
TYPE: LOGIC  
DESCRIPTION: Non-existent relative import path for rollout policy (`../cache/cognitive/rollout-policy`) can break feature gating/module resolution.  
EVIDENCE: `import { isFeatureEnabled } from '../cache/cognitive/rollout-policy';`  
SUGGESTED_FIX: Use existing module path (`../cognitive/rollout-policy`) consistently.

BUG: BUG-GSA-002  
FILE: mcp_server/lib/graph/graph-signals.ts:298-308  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: Depth algorithm computes shortest-root distance, conflicting with “maximum distance from root nodes” behavior.  
EVIDENCE: Neighbor depth is set only on first visit in BFS (`!depthMap.has(neighbor)` guard).  
SUGGESTED_FIX: Replace with max-depth computation strategy (DAG longest path / repeated relaxation with cycle-safe bounds).

README_COVERAGE:
- mcp_server/lib/cognitive/rollout-policy.ts: LISTED in mcp_server/lib/cognitive/README.md  
- mcp_server/lib/graph/graph-signals.ts: LISTED in mcp_server/lib/graph/README.md  
- mcp_server/lib/search/causal-boost.ts: LISTED in mcp_server/lib/search/README.md  
- mcp_server/tests/causal-boost.vitest.ts: LISTED in mcp_server/tests/README.md  
- mcp_server/tests/feature-eval-graph-signals.vitest.ts: LISTED in mcp_server/tests/README.md  
- mcp_server/tests/graph-signals.vitest.ts: LISTED in mcp_server/tests/README.md  
- mcp_server/tests/rollout-policy.vitest.ts: LISTED in mcp_server/tests/README.md  
---




Total usage est:        1 Premium request
API time spent:         3m 53s
Total session time:     4m 13s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.3-codex           1.5m in, 11.6k out, 1.2m cached (Est. 1 Premium request)
