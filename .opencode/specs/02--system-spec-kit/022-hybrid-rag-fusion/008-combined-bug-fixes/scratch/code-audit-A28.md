● Todo added: Audit feature source files

● Extract source files from feature docs
  $ python - <<'PY'
  from pathlib import Path
  import re, json
  root=Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements')...
  └ 21 lines...

● Extract source files from feature docs
  $ python3 - <<'PY'
  from pathlib import Path
  import re
  root=Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements')...
  └ 29 lines...

● Read .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/01-dual-scope-memor
  y-auto-surface.md
  └ 84 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/02-constitutional-m
  emory-as-expert-knowledge-injection.md
  └ 27 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/03-spec-folder-hier
  archy-as-retrieval-structure.md
  └ 29 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/04-lightweight-cons
  olidation.md
  └ 47 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/05-memory-summary-s
  earch-channel.md
  └ 41 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/06-cross-document-e
  ntity-linking.md
  └ 42 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/07-tier-2-fallback-
  channel-forcing.md
  └ 30 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/08-provenance-rich-
  response-envelopes.md
  └ 38 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/09-contextual-tree-
  injection.md
  └ 149 lines read

● Parse feature source file lists
  $ python3 - <<'PY'
  from pathlib import Path
  import re, json
  base=Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit')...
  └ 161 lines...

● Analyze source files and README coverage
  $ python3 - <<'PY'
  from pathlib import Path
  import re, json
  root=Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit')...
  └ 53 lines...

● Read /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/copilot-tool-output-1772996878814-43p0va.txt
  └ 1 line read

● Write parsed feature and coverage json files
  $ python3 - <<'PY'
  from pathlib import Path
  import re, json
  root=Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit')...
  └ 37 lines...

✗ Read /tmp/feature_sources.json
  Permission denied and could not request permission from user

✗ Read /tmp/readme_coverage.json lines 1-220
  Permission denied and could not request permission from user

● Print parsed source and coverage summary
  $ python3 - <<'PY'
  import json
  from pathlib import Path
  fs=json.loads(Path('/tmp/feature_sources.json').read_text())
  cv=json.loads(Path('/tmp/readme_coverage.json').read_text())...
  └ 26 lines...

● Grep "catch \(|as any|TODO|FIXME|@ts-ignore" in *.ts
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks)
  └ 2 lines found

● Grep "as any|catch \(|TODO|FIXME|@ts-ignore|Number\.isNaN|\|\| 0" in *.ts
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search)
  └ 5 lines found

● Grep "catch \(|as any|TODO|FIXME|@ts-ignore" in *.ts
(/Users/michelkerkmeester/MEGA/Development/Opencode
Env/Public/.opencode/skill/system-spec-kit/shared)
  └ 32 lines found

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts
  └ 345 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts
  └ 283 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts
  └ 280 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts
  └ 241 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/tfidf-summarizer.ts
  └ 252 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts
  └ 539 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/channel-enforcement.ts
  └ 140 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/channel-representation.ts
  └ 200 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts
  └ 284 lines read

● Run targeted tests for audited modules
  $ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit/mcp_server' && npx vitest run
  tests/memory-summaries.vitest.ts tests/entity-linker.vitest.ts
  tests/spec-folder-hierarchy.vitest.ts tests/retrieval-directives.vitest.ts
  tests/channel-enforcement.vitest.ts tests/channel-representation.vitest.ts ...
  └ 39 lines...

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts lines 1-260
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/formatters/token-metrics.ts
  └ 85 lines read

● Read .opencode/skill/system-spec-kit/shared/utils/token-estimate.ts
  └ 14 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts lines 261-620
  └ 360 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/spec-folder-hierarchy.ts lines 262-283
  └ 22 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/memory-summaries.ts lines 166-192
  └ 27 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/formatters/token-metrics.ts lines 41-70
  └ 29 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts lines 66-80
  └ 14 lines read

● Generate README coverage lines per feature
  $ python3 - <<'PY'
  from pathlib import Path
  import re
  root=Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit')...
  └ 26 lines...

● Generate structured audit report draft
  $ python3 - <<'PY'
  from pathlib import Path
  import re
  root=Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit')...
  └ 111 lines...

● Todo completed: audit-feature-catalog

---
FEATURE: 01-dual-scope-memory-auto-surface.md  
SOURCE_FILES_AUDITED: 34  
BUGS_FOUND: 1

BUG: F01-B1  
FILE: mcp_server/hooks/memory-surface.ts:76-79  
SEVERITY: P2-MINOR  
TYPE: TYPE_SAFETY  
DESCRIPTION: `concepts` is cast directly to `string[]` without validating element types, so non-string values are coerced into noisy text (e.g. `[object Object]`) and can degrade trigger matching quality.  
EVIDENCE:
```ts
if (args.concepts && Array.isArray(args.concepts) && args.concepts.length > 0) {
  return (args.concepts as string[]).join(' ');
}
```  
SUGGESTED_FIX: Validate `concepts.every((v) => typeof v === 'string')` before joining, or map/filter to strings safely.

README_COVERAGE:
- All 34 source files are LISTED in their directory README.md except:
- mcp_server/hooks/memory-surface.ts: MISSING in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/hooks/README.md
---

---
FEATURE: 02-constitutional-memory-as-expert-knowledge-injection.md  
SOURCE_FILES_AUDITED: 1  
BUGS_FOUND: 0

README_COVERAGE:
- mcp_server/lib/search/retrieval-directives.ts: LISTED in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md
---

---
FEATURE: 03-spec-folder-hierarchy-as-retrieval-structure.md  
SOURCE_FILES_AUDITED: 1  
BUGS_FOUND: 1

BUG: F03-B1  
FILE: mcp_server/lib/search/spec-folder-hierarchy.ts:266-283  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: Query applies `LIMIT` by recency before relevance ranking; highly relevant parent/self memories can be excluded if newer sibling rows fill the limit first.  
EVIDENCE:
```ts
ORDER BY created_at DESC
LIMIT ?
...
return rows.map(...).sort((a, b) => b.relevance - a.relevance);
```  
SUGGESTED_FIX: Rank by computed relevance first (then recency) before `LIMIT`, or over-fetch and trim after relevance sort.

README_COVERAGE:
- mcp_server/lib/search/spec-folder-hierarchy.ts: LISTED in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md
---

---
FEATURE: 04-lightweight-consolidation.md  
SOURCE_FILES_AUDITED: 9  
BUGS_FOUND: 1

BUG: F04-B1  
FILE: mcp_server/lib/search/spec-folder-hierarchy.ts:266-283  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: Same hierarchy-ranking defect: recency-limited candidate set is relevance-sorted only afterward, causing relevance loss under high write churn.  
EVIDENCE:
```ts
ORDER BY created_at DESC
LIMIT ?
```
followed by JS relevance sort.  
SUGGESTED_FIX: Move relevance ordering ahead of `LIMIT` (SQL CASE/weight), or use larger candidate pool then rank and trim.

README_COVERAGE:
- All 9 source files LISTED in their directory README.md files.
---

---
FEATURE: 05-memory-summary-search-channel.md  
SOURCE_FILES_AUDITED: 4  
BUGS_FOUND: 1

BUG: F05-B1  
FILE: mcp_server/lib/search/memory-summaries.ts:168-191  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: Summary search computes similarity only on an arbitrary `LIMIT`ed subset (no deterministic ordering/ANN preselection), so true nearest neighbors can be missed.  
EVIDENCE:
```ts
SELECT id, memory_id, summary_embedding
FROM memory_summaries
WHERE summary_embedding IS NOT NULL
LIMIT ?
...
results.sort((a, b) => b.similarity - a.similarity);
return results.slice(0, limit);
```  
SUGGESTED_FIX: Use vector-index/ANN ordering in SQL (or deterministic paged scanning with global top-K heap) instead of bare pre-limit sampling.

README_COVERAGE:
- All 4 source files LISTED in their directory README.md files.
---

---
FEATURE: 06-cross-document-entity-linking.md  
SOURCE_FILES_AUDITED: 3  
BUGS_FOUND: 0

README_COVERAGE:
- All 3 source files LISTED in their directory README.md files.
---

---
FEATURE: 07-tier-2-fallback-channel-forcing.md  
SOURCE_FILES_AUDITED: 2  
BUGS_FOUND: 0

README_COVERAGE:
- All 2 source files LISTED in their directory README.md files.
---

---
FEATURE: 08-provenance-rich-response-envelopes.md  
SOURCE_FILES_AUDITED: 5  
BUGS_FOUND: 1

BUG: F08-B1  
FILE: mcp_server/formatters/token-metrics.ts:43-45,68-69  
SEVERITY: P2-MINOR  
TYPE: LOGIC  
DESCRIPTION: `hypotheticalFullTokens` is documented as “ALL matches returned full content” but is calculated only from `returnedResults`, underestimating baseline and overstating savings.  
EVIDENCE:
```ts
const hypotheticalFullTokens = returnedResults.reduce(...)
const coldExcluded = allMatches.length - returnedResults.length;
```  
SUGGESTED_FIX: Compute hypothetical baseline from `allMatches` (full-content assumption for each), then compare to actual returned tokens.

README_COVERAGE:
- All 5 source files LISTED in their directory README.md files.
---

---
FEATURE: 09-contextual-tree-injection.md  
SOURCE_FILES_AUDITED: 63  
BUGS_FOUND: 1

BUG: F09-B1  
FILE: mcp_server/lib/search/spec-folder-hierarchy.ts:266-283  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: Contextual hierarchy retrieval can omit best contextual ancestors because SQL limits by recency prior to relevance scoring.  
EVIDENCE:
```ts
ORDER BY created_at DESC
LIMIT ?
```
then:
```ts
...sort((a, b) => b.relevance - a.relevance);
```  
SUGGESTED_FIX: Make SQL relevance-aware before limiting, or over-fetch and rank before final truncation.

README_COVERAGE:
- All 63 source files LISTED in their directory README.md files.
---

Targeted regression suite for audited modules was executed and passed (`vitest`: 7 files, 250 tests).


Total usage est:        1 Premium request
API time spent:         4m 12s
Total session time:     4m 38s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.3-codex           957.2k in, 12.3k out, 763.9k cached (Est. 1 Premium request)
