---
title: "Research: Index Scope and Constitutional Tier Invariants"
description: "Read-only investigation of memory scan discovery, save-time tier handling, code-graph scanning, constitutional injection, frontmatter parsing, and existing cleanup tooling."
trigger_phrases:
  - "026/011 research"
  - "index scope investigation"
  - "constitutional tier investigation"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-index-scope-and-constitutional-tier-invariants"
    last_updated_at: "2026-04-24T00:00:00Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Research logged"
    next_safe_action: "Use these file:line references during implementation and verification"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Memory discovery lacks permanent z_future and external exclusions."
      - "Code graph specific-file refresh can bypass recursive excludes."
      - "Constitutional tier currently flows from frontmatter to persistence without a path gate."
---
# Research: Index Scope and Constitutional Tier Invariants

Primary source files for this investigation were [memory-index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:160), [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2577), [structural-indexer.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:1186), and [cleanup-orphaned-vectors.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:59). Live DB evidence came from direct inspection of `.opencode/skill/system-spec-kit/mcp_server/database/context-index__voyage__voyage-4__1024.sqlite`.

<!-- ANCHOR:research-memory-scan -->
## 1. Memory Scanner Entry and Walker

Evidence baseline: [memory-index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:160), [memory-index-discovery.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:26), and [spec-doc-paths.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts:5).

- `handleMemoryIndexScan()` is the memory scanner entrypoint. It gathers files from `findConstitutionalFiles()`, `findSpecDocuments()`, and `findGraphMetadataFiles()`, merges them, deduplicates them by canonical path, and feeds each file into `indexMemoryFile()`. File: [memory-index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:160)
- The scan path marks no path-scope invariant beyond whatever the discovery helpers returned. The scan-level merge and dedup happen at [memory-index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:224) and [memory-index.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index.ts:240).
- `findSpecDocuments()` recursively walks `.opencode/specs/` or legacy `specs/`, and only skips directories in `SPEC_DOC_EXCLUDE_DIRS = ['scratch', 'memory', 'node_modules', 'iterations', 'z_archive']`. There is no `z_future` or `external` exclusion here today. File: [memory-index-discovery.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:26) and [memory-index-discovery.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:68)
- `findGraphMetadataFiles()` reuses the same directory exclusion set, so graph metadata under `z_future/` also remains discoverable today. File: [memory-index-discovery.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:205)
- `findConstitutionalFiles()` scans `.opencode/skill/*/constitutional/` and currently excludes `readme.md` and `readme.txt` via `EXCLUDED_CONSTITUTIONAL_BASENAMES`. That matches the observed missing constitutional README row. File: [memory-index-discovery.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:29) and [memory-index-discovery.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts:172)
- Spec-doc include patterns are defined in `SPEC_DOCUMENT_FILENAMES`, with special handling for `research/research.md` and `graph-metadata.json`. Spec-doc path exclusion currently covers `/memory/`, `/scratch/`, `/temp/`, `/review/`, `/z_archive/`, `/research/iterations/`, `/review/iterations/`, and `/node_modules/`, but not `/z_future/` or `/external/`. File: [spec-doc-paths.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts:5) and [spec-doc-paths.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/config/spec-doc-paths.ts:26)
<!-- /ANCHOR:research-memory-scan -->

## 2. Code-Graph Scanner Walker

- The code-graph scanner default exclude set lives in `getDefaultConfig()`. It already excludes `node_modules`, `dist`, `.git`, `vendor`, `z_future`, `z_archive`, and `mcp-coco-index/mcp_server`, but not `external`. File: [indexer-types.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/indexer-types.ts:112)
- Recursive file walking happens in `findFiles()`, which converts `excludeGlobs` into regexes and filters each file or directory through `shouldExcludePath()`. File: [structural-indexer.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:1186)
- `collectSpecificFiles()` is a second path-enumeration surface. It only checks that a requested file stays inside `rootDir` and under `maxFileSizeBytes`; it does not apply `excludeGlobs`, so today a caller could refresh a specific file inside `/external/` even if recursive scans skipped it. File: [structural-indexer.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:1236)
- `indexFiles()` uses `findFiles()` for recursive scans and `collectSpecificFiles()` for direct refreshes, which means both surfaces need the same invariant. File: [structural-indexer.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts:1328)

## 3. Importance Tier Assignment

- Parsed memory objects get their tier from `extractImportanceTier()`. Standard markdown save paths read frontmatter and content markers, then return a normalized tier or the document-type default. File: [memory-parser.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:335) and [memory-parser.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:822)
- `extractImportanceTier()` accepts `importance_tier` or `importanceTier` from frontmatter, trusts valid tier values directly, recognizes textual `[CONSTITUTIONAL]` markers, and otherwise falls back to document defaults or `normal`. There is no path-based constitutional validity check here today. File: [memory-parser.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:829)
- `extractDocumentType()` classifies any markdown file under `/constitutional/` as document type `constitutional`, but that affects document typing, not whether `importanceTier: constitutional` is allowed elsewhere. File: [memory-parser.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:414)
- `prepareParsedMemoryForIndexing()` validates and enriches the parsed object but currently passes `parsed.importanceTier` through untouched. There is no normalization step between parsing and persistence. File: [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:297)
- Persistence happens in `createMemoryRecord()`, which writes `parsed.importanceTier` into `memory_index.importance_tier` via `applyPostInsertMetadata()`. That is the point where a polluted constitutional tier becomes durable. File: [create-record.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/create-record.ts:347)

## 4. Auto-Surface and Constitutional Prioritization

- Stage 1 candidate generation injects constitutional memories when `includeConstitutional=true` and no explicit tier filter is active. It checks for existing constitutional candidates, then performs a dedicated vector search with `tier: 'constitutional'` and appends those rows back into the candidate set. File: [stage1-candidate-gen.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:1075)
- The constitutional cache query in `getConstitutionalMemories()` selects only rows where `m.importance_tier = 'constitutional'`, meaning any polluted row with that tier can enter the always-surface path. File: [vector-index-store.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts:630)
- `hybrid-search.ts` has a structural fallback query that explicitly sorts `importance_tier='constitutional'` first, followed by `critical`, `important`, and lower tiers. That confirms polluted constitutional rows outrank the real rule files even in fallback ranking. File: [hybrid-search.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:1878)

## 5. Frontmatter Parser Flow

- `extractFrontmatterBlock()` parses the YAML frontmatter block once and feeds title, trigger, context-type, and importance extraction. File: [memory-parser.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:648)
- `extractImportanceTier()` reads `importance_tier` and `importanceTier` from that frontmatter block and normalizes the value. File: [memory-parser.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:829)
- `parseMemoryContent()` and `parseMemoryFile()` then place that parsed tier onto `ParsedMemory.importanceTier`, which is what the save pipeline later persists. File: [memory-parser.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:247) and [memory-parser.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:356)

## 6. Save-Time Admissibility

- `handleMemorySave()` validates the file path, then rejects anything that fails `memoryParser.isMemoryFile()`. That check currently enforces canonical spec-doc and constitutional locations, but it still allows `z_future` because spec-doc classification does not exclude it yet. File: [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2680)
- `isMemoryFile()` currently rejects `z_archive` spec docs and skips constitutional README files, but it has no direct `z_future` or `external` exclusion and therefore is not yet a full save-time scope guard. File: [memory-parser.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:955)
- `indexMemoryFile()` is exported and used by the scan path, so any save-time constitutional gate needs to live below the direct tool boundary as well. File: [memory-save.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2577)

## 7. Existing Cleanup Tooling

- `mcp_server/scripts/README.md` states that `mcp_server/scripts/` contains compatibility wrappers only, and points maintenance work to the canonical `scripts/memory/` package. File: [mcp_server/scripts/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/scripts/README.md:10)
- The canonical memory script inventory includes `cleanup-orphaned-vectors.ts`, `reindex-embeddings.ts`, and other maintenance CLIs, but nothing dedicated to path/tier invariant cleanup. File: [scripts/memory/README.md](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/README.md:35)
- `cleanup-orphaned-vectors.ts` already provides a useful script pattern: default dry-run semantics, one transaction for mutation, SQLite access through `better-sqlite3` plus `sqlite-vec`, and clear before/after reporting. Its scope is limited to orphaned `memory_history` and `vec_memories` rows, so it is not sufficient for tier/path pollution. File: [cleanup-orphaned-vectors.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/cleanup-orphaned-vectors.ts:59)
- `memory-bulk-delete.ts` shows another useful runtime pattern: collect candidate rows first, then delete them inside a single transaction. It is not suitable as-is because it filters by tier, preserves `memory_history`, and does not cover the duplicate-reference rewrite requirements in this packet. File: [memory-bulk-delete.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts:183)

## 8. Existing Delete Semantics and Schema Impact

- `delete_memory_from_database()` already removes `vec_memories`, `degree_snapshots`, `community_assignments`, `memory_summaries`, `memory_entities`, `memory_lineage`, `active_memory_projection`, and causal edges before deleting the primary `memory_index` row. It intentionally preserves `memory_history`, which is the opposite of the cleanup requirement for forbidden `z_future` rows. File: [vector-index-mutations.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:59) and [vector-index-mutations.ts](/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts:515)
- Live schema inspection of `context-index__voyage__voyage-4__1024.sqlite` shows additional memory-linked tables that the cleanup must consider: `batch_learning_log`, `feedback_events`, `governance_audit`, `learned_feedback_audit`, `memory_conflicts`, `memory_corrections`, `memory_history`, `memory_lineage`, `memory_summaries`, `negative_feedback_events`, `scoring_observations`, `session_sent_memories`, and `working_memory`. This evidence came from direct runtime queries against the live DB, not from a source file.
- Live inspection also confirmed the current pollution baseline: `5700` constitutional rows total, `2` legitimate `/constitutional/` rows, `5947` `z_future` rows overall, `0` `external` rows, `0` indexed `constitutional/README.md` rows, and duplicate `gate-enforcement.md` rows at IDs `1` and `9868`, where `9868` is the newer record.

## 9. Design Implications

- The lowest-risk permanent enforcement point is a shared helper that normalizes path segments once and is consumed by discovery, classification, and save-time code.
- Memory-side invariants need two layers: walker exclusion to avoid indexing forbidden files in the first place, and save-time rejection to catch direct callers or future bypass paths.
- Constitutional tier normalization should happen after tier extraction but before any DB writes so frontmatter still works for valid constitutional docs while invalid uses are downgraded consistently.
- Cleanup must be broader than existing delete helpers because forbidden rows should not leave `memory_history`, feedback, or lineage residue behind.
