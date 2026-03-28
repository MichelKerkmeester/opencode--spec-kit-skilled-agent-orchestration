● skill(sk-doc)

I’m checking each requested catalog entry against the actual `mcp_server` implementation first, then I’ll patch only the mismatches and show the diffs.

● Read 02-system-statistics-memorystats.md
  │ .opencode/skill/system-spec-kit/feature_catalog/03--discovery/02-system-statistics-memorystats.m
  │ d
  └ 57 lines read

● Read 01-workspace-scanning-and-indexing-memoryindexscan.md
  │ .opencode/skill/system-spec-kit/feature_catalog/04--maintenance/01-workspace-scanning-and-indexi
  │ ng-memoryindexscan.md
  └ 228 lines read

● Read 02-checkpoint-listing-checkpointlist.md
  │ .opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/02-checkpoint-listing-checkpointli
  │ st.md
  └ 144 lines read

● Read 01-typed-weighted-degree-channel.md
  │ .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/01-typed-weighted-de
  │ gree-channel.md
  └ 58 lines read

● Read 17-temporal-structural-coherence-scoring.md
  │ .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/17-temporal-structur
  │ al-coherence-scoring.md
  └ 50 lines read

● Read 06-query-expansion.md
  │ .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/06-query-expansion.md
  └ 108 lines read

● Read 11-graph-concept-routing.md
  │ .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/11-graph-concept-routing.
  │ md
  └ 47 lines read

● search memory_index_scan scans .txt files and .opencode/specs memory folders implementation
  └ {"success":false,"results":[],"total_returned":0,"offset":0,"message":"Query ...

● search memory_stats excludePatterns case-insensitive substring matching implementation
  └ {"success":false,"results":[],"total_returned":0,"offset":0,"message":"Query ...

✗ search checkpoint_list limit parameter no pagination offset page cursor implementation
  └ MCP server 'cocoindex_code': McpError: MCP error -32001: Request timed out

✗ search DEFAULT_MAX_TYPED_DEGREE search-flags typed weighted degree graph channel implementation
  └ MCP server 'cocoindex_code': McpError: MCP error -32001: Request timed out

✗ search quality-loop temporal structural coherence future-dated unresolved self causal links imple…
  └ MCP server 'cocoindex_code': McpError: MCP error -32001: Request timed out

✗ search query expansion embedding-expansion query-expander simple query suppression separate paths…
  └ MCP server 'cocoindex_code': McpError: MCP error -32001: Request timed out

✗ search graph concept routing search-flags trace-only routing graph channel inline comments implem…
  └ MCP server 'cocoindex_code': McpError: MCP error -32001: Request timed out

I’ve got the doc targets loaded. Next I’m grounding each claim against the live handler/search code so the fixes stay narrow and accurate.

● Search (grep)
  │ "coherence|future|causal|structural|quality loop" in **/*.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 5 lines found

● Search (grep)
  │ "excludePatterns|memory_stats|getStats|memory_stats" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "memory_index_scan|specs/|\.opencode/specs|\.txt|memory/" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "checkpoint_list|limit|offset|page|cursor" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "DEFAULT_MAX_TYPED_DEGREE|MAX_TYPED_DEGREE|DEGREE_BOOST_CAP|SPECKIT_DEGREE_BOOST|search-flags|gr
  │ aphActivated" in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "embedding-expansion|query-expander|simple|expand|Stage 1|expanded" in **/*.{ts,js}
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (grep)
  │ "graph concept
  │ routing|graphActivated|matchedConcepts|d2-concept-routing|SPECKIT_GRAPH_CONCEPT_ROUTING|activat"
  │ in **/*.{ts,js} (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Run skill advisor and create session plan (shell)
  │ python3 .opencode/skill/scripts/skill_advisor.py "Documentation remediation for seven feature
  │ catalog files under .opencode/skill/system-spec-kit/feature_catalog; verify against
  │ .opencode/skill/system-spec-kit/mcp_server and fix inaccurate descriptions only" --threshold
  │ 0.8 && mkdir -p
  │ "/Users/michelkerkmeester/.copilot/session-state/531b6f3a-2c42-4065-b00d-fb76f0b13b9c" && cat …
  └ 61 lines...

The broad search was noisy, so I’m narrowing to the exact handler/search files behind each doc claim. That should make the edits safer and smaller.● Request failed due to a transient API error. Retrying...

I found the catalog text that needs tightening. Now I’m narrowing into the exact source lines so the wording matches current runtime behavior, not older intent comments.

● Search (grep)
  │ "excludePatterns" (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts)
  └ 68 lines found

● Search (grep)
  │ "specs/|\.opencode/specs|\.txt|memory/|includeSpecDocs|includeConstitutional"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts)
  └ 85 lines found

● Search (grep)
  │ "checkpoint_list|limit|offset|page|cursor"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts)
  └ 5 lines found

● Search (grep)
  │ "DEFAULT_MAX_TYPED_DEGREE|MAX_TYPED_DEGREE|DEGREE_BOOST_CAP|MAX_TOTAL_DEGREE"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts)
  └ 107 lines found

● Search (grep)
  │ "SPECKIT_DEGREE_BOOST|degree|graph concept routing|SPECKIT_GRAPH_CONCEPT_ROUTING|activat"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts)
  └ 35 lines found

● Search (grep)
  │ "coherence|future|causal|self|unresolved|structural"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts)
  └ 5 lines found

● Search (grep)
  │ "simple|expand|expanded|embedding"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts)
  └ 5 lines found

● Search (grep)
  │ "expand|expansion|synonym|terms"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/query-expander.ts)
  └ 63 lines found

● Search (grep)
  │ "embedding
  │ expansion|expanded|baseline|simple|classifier|d2-concept-routing|matchedConcepts|graphActivated"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts)
  └ 5 lines found

● Search (grep)
  │ "graphActivated|matchedConcepts|noun|alias|routing"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts)
  └ 5 lines found

I’ve confirmed a few of the mismatches already: `excludePatterns` is substring-based, the degree constant is `DEFAULT_MAX_TYPED_DEGREE`, and the graph-routing flag comment really does overstate behavior. I’m pulling the last source slices now so I can patch all seven in one pass.

● Read checkpoints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts
  └ L1:220 (220 lines read)

● Search (grep)
  │ "\.opencode/specs|specs/\*\*/memory|memory.*\.txt|\.txt|spec
  │ documents|includeSpecDocs|includeConstitutional"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts)
  └ 20 lines found

● Read quality-loop.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/quality-loop.ts
  └ L242:359 (118 lines read)

● Read embedding-expansion.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts
  └ L1:220 (220 lines read)

● Read stage1-candidate-gen.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts
  └ L1:260 (260 lines read)

● Read entity-linker.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts
  └ L1:260 (260 lines read)

● Read memory-index-discovery.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts
  └ L1:260 (197 lines read)

● Search (grep)
  │ "async function handleCheckpointList|function handleCheckpointList|checkpoint_list"
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts)
  └ 5 lines found

● Search (grep)
  │ "routeQueryConcepts|graphActivated|matchedConcepts|d2-concept-routing"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts)
  └ 47 lines found

● Search (grep)
  │ "export function isExpansionActive|classifyQueryComplexity"
  │ (.opencode/skill/system-spec-kit/mcp_server/lib/search/embedding-expansion.ts)
  └ 67 lines found

I’ve got enough source evidence to patch accurately. I’m updating the seven feature files now, then I’ll run a quick validation pass and show you the diffs.

● Patch seven feature catalog docs (shell)
  │ python - <<'PY'
  │ from pathlib import Path
  │ base = Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  │ Env/Public/.opencode/skill/system-spec-kit/feature_catalog')
  │ changes = {…
  └ 180 lines...

The first edit attempt tripped on the local shell using `python3` instead of `python`. I’m applying the changes directly now and then I’ll verify the docs against the same source files.

● Edit
  │ Edit .opencode/skill/system-spec-kit/feature_catalog/03--discovery/02-system-statistics-memoryst
  │ ats.md
  │ Edit .opencode/skill/system-spec-kit/feature_catalog/04--maintenance/01-workspace-scanning-and-i
  │ ndexing-memoryindexscan.md
  │ Edit .opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/02-checkpoint-listing-checkpo
  │ intlist.md
  │ Edit .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/01-typed-weight
  │ ed-degree-channel.md
  │ Edit .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/17-temporal-str
  │ uctural-coherence-scoring.md
  │ Edit
  │ .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/06-query-expansion.md
  └ Edit .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/11-graph-concept-rou
    ting.md

The edits are in. I’m doing a quick whitespace/diff sanity check and surfacing the exact hunks so you can review the remediations file by file.

● Show diff 02-system-statistics-memorystats.md
  │
  │ 21
  │ 22    The response now reports `totalSpecFolders` from the full filtered/scored set before
  │       pagination slicing, so the summary stays accurate when `limit` truncates `topFolders`. The
  │        payload also includes the resolved `limit`, which makes truncation behavior explicit for
  │       callers and tests.
  │ 23
  │ 24 -   Direct handler validation failures return MCP error envelopes with `E_INVALID_INPUT` and
  │        `data.details.requestId` for invalid `folderRanking`, invalid `excludePatterns`, invalid
  │        `includeScores`/`includeArchived`, or non-finite `limit` values. Aggregate-query and
  │        folder-ranking failures return MCP error envelopes instead of raw throws.
  │ 24 +  Direct handler validation failures return MCP error envelopes with `E_INVALID_INPUT` and
  │       `data.details.requestId` for invalid `folderRanking`, invalid `excludePatterns`, invalid
  │       `includeScores`/`includeArchived`, or non-finite `limit` values. Although the validation
  │       text still says "regex pattern strings," the runtime treats `excludePatterns` as plain
  │       string patterns and applies case-insensitive substring matching when filtering folders.
  │       Aggregate-query and folder-ranking failures return MCP error envelopes instead of raw
  │       throws.
  │ 25
  │ 26    Embedding-status totals now treat `partial` as a first-class state instead of silently
  │       dropping it. `get_status_counts()` initializes and returns a `partial` bucket, and
  │       `get_stats()` includes that bucket in the headline total. That keeps `memory_stats`
  │       aligned with chunked and partially indexed rows that already exist elsewhere in the
  │       vector-index state model.
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/03--discovery/02-system-statistics-memorystats.m
    d

● Show diff 01-workspace-scanning-and-indexing-memoryindexscan.md
  │
  │ 17
  │ 18    This is the tool that keeps the memory database synchronized with the filesystem. Without
  │       it, new or modified memory files would be invisible to search.
  │ 19
  │ 20 -  The scanner discovers files from three sources: spec folder memory files
  │       (`specs/**/memory/*.md`), constitutional files (`.opencode/skill/*/constitutional/*.md`)
  │       and spec documents (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`,
  │       `decision-record.md`, `implementation-summary.md`, `research/research.md`, `handover.md`).
  │       Canonical path deduplication prevents the same file from being indexed twice under
  │       different paths (the `specs/` vs `.opencode/specs/` symlink problem).
  │ 20 +  The scanner discovers files from three sources: spec folder memory files under both
  │       `.opencode/specs/**/memory/` and `specs/**/memory/` (including `.md` and `.txt` memory
  │       files), constitutional files under `.opencode/skill/*/constitutional/` (currently `.md`,
  │       excluding `README.md`/`README.txt`), and spec documents (`spec.md`, `plan.md`, `tasks.md`,
  │        `checklist.md`, `decision-record.md`, `implementation-summary.md`, `research/research.md`,
  │       `handover.md`). Canonical path deduplication prevents the same file from being indexed
  │       twice under different paths (the `specs/` vs `.opencode/specs/` alias problem).
  │
  │ 21
  │ 22    In incremental mode (the default), the scanner categorizes every discovered file into one
  │       of four buckets: to-index (new files), to-update (changed mtime), to-skip (unchanged
  │       mtime) and to-delete (files that disappeared from disk). Batch processing with
  │       configurable `BATCH_SIZE` handles large workspaces. A rate limiter with
  │       `INDEX_SCAN_COOLDOWN` prevents rapid repeated scans from exhausting resources, returning
  │       an E429 error with a wait time if you scan too frequently.
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/04--maintenance/01-workspace-scanning-and-indexi
    ng-memoryindexscan.md

● Show diff 02-checkpoint-listing-checkpointlist.md
  │
  │  1     ---
  │  2     title: "Checkpoint listing (checkpoint_list)"
  │  3 -  description: "Covers the checkpoint listing tool that returns paginated metadata for
  │       available snapshots."
  │  3 +  description: "Covers the checkpoint listing tool that returns limit-based metadata for
  │       available snapshots."
  │  4     ---
  │  5
  │  6     # Checkpoint listing (checkpoint_list)
  │  7
  │  8     ## 1. OVERVIEW
  │  9
  │ 10 -  Covers the checkpoint listing tool that returns paginated metadata for available
  │       snapshots.
  │ 10 +  Covers the checkpoint listing tool that returns limit-based metadata for available
  │       snapshots.
  │ 11
  │ 12    This shows you all available snapshots so you can see when each one was taken and what it
  │       covers. Think of it like looking at a list of backup dates on your phone before deciding
  │       which one to restore from.
  │ 13
  │ ────────────────────────────────────────────────────────────────────────────────────────────────
  │ 15
  │ 16     ## 2. CURRENT REALITY
  │ 17
  │ 18 -  Returns a paginated list of available checkpoints with metadata: name, creation date, spec
  │        folder scope, git branch and compressed snapshot size. The actual snapshot data is not
  │       included. Results are ordered by creation date, most recent first. Default limit is 50,
  │       maximum 100. You can filter by spec folder to see only checkpoints that cover a specific
  │       area.
  │ 18 +  Returns a limit-based list of available checkpoints with metadata: name, creation date,
  │       spec folder scope, git branch and compressed snapshot size. The actual snapshot data is
  │       not included. Results are ordered by creation date, most recent first. The runtime exposes
  │        `limit` for truncation, but no offset, page, or cursor parameter. Default limit is 50,
  │       maximum 100. You can filter by spec folder to see only checkpoints that cover a specific
  │       area.
  │ 19
  │ 20     ---
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/05--lifecycle/02-checkpoint-listing-checkpointli
    st.md

● Show diff 01-typed-weighted-degree-channel.md
  │
  │ 15
  │ 16     ## 2. CURRENT REALITY
  │ 17
  │ 18 -  A fifth RRF channel scores memories by their graph connectivity. Edge type weights range
  │       from caused at 1.0 down to supports at 0.5, with logarithmic normalization and a hub cap
  │       (`MAX_TYPED_DEGREE=15`, `MAX_TOTAL_DEGREE=50`, `DEGREE_BOOST_CAP=0.15`) to prevent any
  │       single memory from dominating results through connections alone.
  │ 18 +  A fifth RRF channel scores memories by their graph connectivity. Edge type weights range
  │       from caused at 1.0 down to supports at 0.5, with logarithmic normalization and a hub cap
  │       (`DEFAULT_MAX_TYPED_DEGREE=15`, `MAX_TOTAL_DEGREE=50`, `DEGREE_BOOST_CAP=0.15`) to prevent
  │        any single memory from dominating results through connections alone.
  │ 19
  │ 20    Constitutional memories are excluded from degree boosting because they already receive
  │       top-tier visibility. The channel runs behind the `SPECKIT_DEGREE_BOOST` feature flag with
  │       a degree cache that invalidates only on graph mutations, not per query. That cache is now
  │       scoped per database instance via `WeakMap<Database.Database, Map<string, number>>`, with
  │       `getDegreeCacheForDb(database)` for lookup and `clearDegreeCacheForDb(database)` for
  │       explicit invalidation, so scores from one DB can no longer leak into another. When a
  │       memory has zero edges, the channel returns 0 rather than failing.
  │ 21
  │ ────────────────────────────────────────────────────────────────────────────────────────────────
  │ 30     | `mcp_server/lib/cognitive/rollout-policy.ts` | Lib | Feature rollout gating |
  │ 31     | `mcp_server/lib/parsing/content-normalizer.ts` | Lib | Content normalization |
  │ 32     | `mcp_server/lib/search/bm25-index.ts` | Lib | BM25 index management |
  │ 33 -   | `mcp_server/lib/search/graph-flags.ts` | Lib | Graph feature flags |
  │ 33 +   | `mcp_server/lib/search/search-flags.ts` | Lib | Feature flag accessor for
  │        `SPECKIT_DEGREE_BOOST` |
  │ 34     | `mcp_server/lib/search/graph-search-fn.ts` | Lib | Graph degree scoring |
  │ 35     | `mcp_server/lib/search/search-types.ts` | Lib | Search type definitions |
  │ 36    | `mcp_server/lib/search/spec-folder-hierarchy.ts` | Lib | Spec folder hierarchy traversal
  │        |
  │ ────────────────────────────────────────────────────────────────────────────────────────────────
  │ 42     | `mcp_server/tests/bm25-index.vitest.ts` | BM25 index operations |
  │ 43     | `mcp_server/tests/content-normalizer.vitest.ts` | Content normalization tests |
  │ 44     | `mcp_server/tests/degree-computation.vitest.ts` | Degree computation tests |
  │ 45 -   | `mcp_server/tests/graph-flags.vitest.ts` | Graph flag behavior |
  │ 45 +  | `mcp_server/tests/search-flags.vitest.ts` | Search flag behavior, including
  │       graph-related toggles |
  │ 46     | `mcp_server/tests/graph-scoring-integration.vitest.ts` | Graph scoring integration |
  │ 47     | `mcp_server/tests/graph-search-fn.vitest.ts` | Graph search function tests |
  │ 48     | `mcp_server/tests/rollout-policy.vitest.ts` | Rollout policy tests |
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/01-typed-weighted-de
    gree-channel.md

● Show diff 17-temporal-structural-coherence-scoring.md
  │
  │  1     ---
  │  2     title: "Temporal-structural coherence scoring"
  │  3 -  description: "Describes the coherence dimension in the quality loop that measures whether
  │       a memory's content structure aligns with its temporal context, penalizing references to
  │       future events or non-existent predecessors."
  │  3 +  description: "Describes the coherence dimension in the quality loop that scores basic
  │       content structure, future-dated completion claims, and unresolved or self-referential
  │       causal links."
  │  4     ---
  │  5
  │  6     # Temporal-structural coherence scoring
  │  7
  │  8     ## 1. OVERVIEW
  │  9
  │ 10 -  Describes the coherence dimension in the quality loop that measures whether a memory's
  │       content structure aligns with its temporal context, penalizing references to future events
  │        or non-existent predecessors.
  │ 10 +  Describes the coherence dimension in the quality loop that scores basic content structure,
  │        future-dated completion claims, and unresolved or self-referential causal links.
  │
  │ 11
  │ 12 -  This checks whether a memory's claims make sense in the order things actually happened. If
  │        a memory says it was caused by something that did not exist yet at the time, that is a
  │       red flag. Think of it like a fact-checker catching a biography that references events
  │       before the person was born. Memories that fail this time-logic check get a lower quality
  │       score and may be rejected from the index.
  │ 12 +  This checks whether a memory clears a few structural basics and avoids a narrow set of
  │       temporal and causal-link problems. If content is empty, too short, missing headings, or
  │       claims completion dates that are later than its last-modified time, the score drops.
  │       Self-referential or unresolved causal links also reduce the score. Think of it like a
  │       lightweight intake checklist rather than a full chronology engine.
  │ 13
  │ 14     ---
  │ 15
  │ 16     ## 2. CURRENT REALITY
  │ 17
  │ 18 -  The quality loop handler (`handlers/quality-loop.ts`) includes a coherence dimension in
  │       its quality score breakdown. The coherence score measures how well a memory's content
  │       structure aligns with its temporal context, specifically whether the claimed relationships
  │        (references to other memories, spec folder associations, causal links) are consistent
  │       with the chronological ordering of events. Incoherent memories that reference future
  │       events or claim relationships with non-existent predecessors receive a lower coherence
  │       score, which reduces their overall quality assessment.
  │ 18 +  The quality loop handler (`handlers/quality-loop.ts`) includes a coherence dimension in
  │       its quality score breakdown. The implementation starts with four structural checks:
  │       non-empty content, length over 50 characters, at least one Markdown heading, and length
  │       over 200 characters. It then applies bounded penalties for future-dated completion claims
  │       and for causal-link metadata that points back to the same memory or to unresolved
  │       references. The handler does not perform broader spec-folder chronology analysis or
  │       predecessor inference.
  │ 19
  │ 20 -  The coherence signal feeds into the composite quality score alongside trigger coverage,
  │       anchor density and token budget efficiency. A low coherence score can trigger a quality
  │       loop rejection, preventing temporally inconsistent content from entering the index.
  │ 20 +  The coherence signal feeds into the composite quality score alongside trigger coverage,
  │       anchor density and token budget efficiency. A low coherence score can trigger a quality
  │       loop rejection, preventing structurally weak or narrowly inconsistent content from
  │       entering the index.
  │ 21
  │ 22     ---
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/17-temporal-structur
    al-coherence-scoring.md

● Show diff 06-query-expansion.md
  │
  │  1     ---
  │  2     title: "Query expansion"
  │  3 -  description: "Query expansion broadens retrieval for complex queries by mining related
  │       terms from the vector index and appending them to the original query."
  │  3 +  description: "Covers the embedding-based query expansion path and distinguishes it from
  │       the separate rule-based deep-mode query-variant expansion path."
  │  4     ---
  │  5
  │  6     # Query expansion
  │  7
  │  8     ## 1. OVERVIEW
  │  9
  │ 10 -  Query expansion broadens retrieval for complex queries by mining related terms from the
  │       vector index and appending them to the original query.
  │ 10 +  This entry covers the embedding-based query expansion path, which broadens retrieval for
  │       complex queries by mining related terms from the vector index and appending them to the
  │       original query. It is separate from the rule-based `query-expander.ts` path used to build
  │       deep-mode synonym variants.
  │ 11
  │ 12 -  Sometimes the words you use in a question do not match the words stored in the system,
  │       even though they mean the same thing. This feature automatically adds related terms to
  │       your search so you find relevant results even when the exact wording differs. It only
  │       kicks in for complex questions because simple lookups do not benefit from the extra
  │       breadth.
  │ 12 +  Sometimes the words you use in a question do not match the words stored in the system,
  │       even though they mean the same thing. This embedding-driven path automatically adds
  │       related terms to your search so you find relevant results even when the exact wording
  │       differs. Separately, deep-mode query expansion can generate rule-based synonym variants
  │       without mining the vector index.
  │ 13
  │ 14     ---
  │ 15
  │ ────────────────────────────────────────────────────────────────────────────────────────────────
  │ 17
  │ 18    Embedding-based query expansion broadens retrieval for complex queries by mining similar
  │       memories from the vector index and extracting related terms to append to the original
  │       query, producing an enriched combined query string. Stop-words are filtered out and tokens
  │        shorter than 3 characters are discarded.
  │ 19
  │ 20 -  When R15 classifies a query as "simple", expansion is suppressed because expanding a
  │       trigger-phrase lookup would add noise. If expansion produces no additional terms, the
  │       original query proceeds unchanged. In the 4-stage pipeline, Stage 1 runs the baseline and
  │       expanded-query searches in parallel with deduplication (baseline-first). Runs behind the
  │       `SPECKIT_EMBEDDING_EXPANSION` flag (default ON).
  │ 20 +  When R15 classifies a query as "simple", the embedding-based expansion path is suppressed
  │       because expanding a trigger-phrase lookup would add noise. If embedding expansion produces
  │        no additional terms, the original query proceeds unchanged. Separately,
  │       `query-expander.ts` provides rule-based synonym variants for deep-mode retrieval; that is
  │       a distinct path and should not be conflated with vector-mined expansion. In the 4-stage
  │       pipeline, Stage 1 runs the baseline and expanded-query searches in parallel with
  │       deduplication (baseline-first). Runs behind the `SPECKIT_EMBEDDING_EXPANSION` flag
  │       (default ON).
  │ 21
  │ 22     ---
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/06-query-expansion.md

● Show diff 11-graph-concept-routing.md
  │
  │ 17
  │ 18     Enabled by default (graduated). Set `SPECKIT_GRAPH_CONCEPT_ROUTING=false` to disable.
  │ 19
  │ 20 -  The `isGraphConceptRoutingEnabled()` function in `search-flags.ts` checks the flag. The
  │       entity linker module (`entity-linker.ts`) provides query-time concept routing alongside
  │       its cross-document entity linking role. It extracts noun phrases from the query, matches
  │       them against the concept alias table in SQLite, and returns canonical concept names plus a
  │        `graphActivated` boolean. `stage1-candidate-gen.ts` currently uses that output only to
  │       append a `d2-concept-routing` trace entry with `matchedConcepts` and `graphActivated:
  │       true`; that trace field mirrors the routing result for observability, but it does not
  │       switch the Stage 1 search path or directly activate a graph retrieval channel.
  │ 20 +  The `isGraphConceptRoutingEnabled()` function in `search-flags.ts` checks the flag. The
  │       entity linker module (`entity-linker.ts`) provides query-time concept routing alongside
  │       its cross-document entity linking role. It extracts noun phrases from the query, matches
  │       them against the concept alias table in SQLite, and returns canonical concept names plus a
  │        `graphActivated` boolean. `stage1-candidate-gen.ts` currently uses that output only to
  │       append a `d2-concept-routing` trace entry with `matchedConcepts` and `graphActivated:
  │       true`; that trace field mirrors the routing result for observability, but it does not
  │       switch the Stage 1 search path or directly activate a graph retrieval channel. Note that
  │       the inline comment on `isGraphConceptRoutingEnabled()` in `search-flags.ts` overstates
  │       this behavior by saying it is "activating the graph channel"; current runtime behavior is
  │       trace-only at this stage.
  │ 21
  │ 22     ---
  │
  └ .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/11-graph-concept-routing.
    md

● Run diff whitespace check (shell)
  │ git --no-pager diff --check -- .opencode/skill/system-spec-kit/feature_catalog/03--discovery/0
  │ 2-system-statistics-memorystats.md .opencode/skill/system-spec-kit/feature_catalog/04--mainten
  │ ance/01-workspace-scanning-and-indexing-memoryindexscan.md .opencode/skill/system-spec-kit/fea
  │ ture_catalog/05--lifecycle/02-checkpoint-listing-checkpointlist.md .opencode/skill/system-spec
  │ -kit/feature_catalog/10--graph-signal-activation/01-typed-weighted-degree-channel.md …
  └ 6 lines...

Done. I verified each catalog entry against `mcp_server/` and fixed all 7 P2 doc mismatches.

Updated:
- `memory_stats`: `excludePatterns` now described as case-insensitive substring matching, not regex.
- `memory_index_scan`: broadened discovery to both `specs/` and `.opencode/specs/` memory folders, including `.txt`.
- `checkpoint_list`: changed from “paginated” to limit-based only.
- `typed-weighted degree`: fixed `DEFAULT_MAX_TYPED_DEGREE` and flag-source ownership to `search-flags.ts`.
- `temporal-structural coherence`: narrowed to actual structural/future-date/causal-link checks.
- `query expansion`: split embedding-based vs rule-based paths; simple-query suppression scoped to embedding expansion.
- `graph concept routing`: added note about overstated `search-flags.ts` inline comment.

`git diff --check` passed, and I showed the diffs above.

