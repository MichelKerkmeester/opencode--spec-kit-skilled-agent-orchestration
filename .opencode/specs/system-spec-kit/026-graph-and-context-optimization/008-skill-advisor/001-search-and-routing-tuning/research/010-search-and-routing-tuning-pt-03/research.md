---
title: "...or/001-search-and-routing-tuning/003-graph-metadata-validation/research/010-search-and-routing-tuning-pt-03/research]"
description: "This research loop scanned every graph-metadata.json file under .opencode/specs/ excluding z_archive and node_modules, read the runtime schema/parser/backfill code, and cross-ch..."
trigger_phrases:
  - "001"
  - "search"
  - "and"
  - "routing"
  - "tuning"
  - "research"
  - "010"
importance_tier: "normal"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/research/010-search-and-routing-tuning-pt-03"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["research.md"]
---
# Research: Graph Metadata Quality and Relationship Validation

## Scope and Method
This research loop scanned every `graph-metadata.json` file under `.opencode/specs/` excluding `z_archive` and `node_modules`, read the runtime schema/parser/backfill code, and cross-checked representative packet docs. The investigation stayed read-only outside this packet's `research/` folder.

### Runtime Baseline
- Corpus size: 344 graph-metadata files. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
- Legacy-format files: 35, all still runtime-loadable through the parser's legacy fallback. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:96-203] [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]
- Backfill already expects review-worthy ambiguity around status, summary quality, and prose relationships. [SOURCE: .opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts:111-136]

## Research Answers

### RQ-1: Depends-On Integrity
Only four declared `depends_on` edges exist in the live corpus, and all four resolve to real spec folders. Broken-edge rate: 0.0%. [SOURCE: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/013-dead-code-and-architecture-audit/graph-metadata.json:7-15] [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]

Interpretation:
The current graph is relationship-sparse rather than relationship-broken.

### RQ-2: Dependency Cycles
No cycles were found in the resolved dependency graph. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]

Interpretation:
This is a low-confidence sign of graph health because the graph contains only four declared dependency edges.

### RQ-3: Children IDs
`children_ids` serialize specs-root-relative paths generated from direct numeric child directories. With that same path base, all 290 child links resolve. Ghost-child rate: 0.0%. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:388-393] [SOURCE: .opencode/specs/00--ai-systems/001-global-shared/graph-metadata.json:6-12] [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]

Interpretation:
The obvious ghost-child failures appear only when scanners incorrectly join `dirname` with values that are already full specs-root-relative identifiers.

### RQ-4: Key File Existence
`deriveKeyFiles()` pulls backticked file references from packet docs, prefers `implementation-summary.md`, appends canonical doc names, and truncates the final list to 20 entries. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:463-471]

Corpus result:
- Total key-file entries: 5,298
- Resolved under a three-base heuristic (`repo root`, `spec-relative`, `skill-relative`): 3,172 (59.87%)
- Missing: 2,126 (40.13%)
- Repo-root-only resolution: 21.78%

Dominant miss classes:
- Bare tokens: 1,203
- Path-like misses: 628
- Dot-relative or cross-root references: 193
- Version-like tokens: 55
- Title-like tokens: 47

Interpretation:
Key-file quality is the largest concrete path-quality problem in the corpus. Many stored values are not canonical paths at all.

### RQ-5: Entity Duplicate Noise
`deriveEntities()` seeds the entity map from every key-file path using `path.basename()`, then adds extracted doc entities, and truncates to 16 entries. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:418-446]

Corpus result:
- Basename-only duplicate entities: 2,020
- Folders affected: 270 of 344 (78.49%)
- Entity-cap hits at 16: 291 folders (84.59%)

Representative noise:
- Canonical-path basename duplicates like `spec.md` alongside `.opencode/specs/.../spec.md`
- Command-derived entity names
- Newline-bearing or section-label-bearing entities such as `Problem Statement\nThe Global Shared` [SOURCE: .opencode/specs/00--ai-systems/001-global-shared/graph-metadata.json:95-120]

Interpretation:
Entity quality is downstream of key-file quality, and both are currently too noisy for high-confidence graph/search enrichment.

### RQ-6: Status Accuracy
`deriveStatus()` reads frontmatter scalars only and does not inspect markdown metadata tables. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:346-353] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:498-510]

Corpus result:
- Stored status distribution: `planned` 302, `complete` 39, `Complete` 1, `In Progress` 1, `review` 1
- Folders with `implementation-summary.md` present: 301
- Folders still marked `planned` despite `implementation-summary.md`: 259

Representative mismatch:
`00--ai-systems/001-global-shared/spec.md` shows `In Progress` only in a markdown table while `implementation-summary.md` lacks frontmatter `status`, so the graph metadata remains `planned`. [SOURCE: .opencode/specs/00--ai-systems/001-global-shared/spec.md:15-23] [SOURCE: .opencode/specs/00--ai-systems/001-global-shared/implementation-summary.md:1-20] [SOURCE: .opencode/specs/00--ai-systems/001-global-shared/graph-metadata.json:43-50]

Interpretation:
Status drift is primarily a derivation-policy problem, not just inconsistent packet authoring.

### RQ-7: Distribution and Limits
Corpus distributions show sustained pressure at or beyond current limits.

- Trigger phrases over 12: 216 folders (62.79%)
- Highest trigger count observed: 33
- Key-file lists at cap 20: 159 folders (46.22%)
- Entity lists at cap 16: 291 folders (84.59%)

Interpretation:
The current caps are either too low for the source material or are being fed too much noisy content. For entities and triggers, the stronger issue is likely quality before quantity.

### RQ-8: Stale `last_save_at`
130 folders have `last_save_at` older than the newest canonical-doc mtime in the same packet. [SOURCE: live filesystem scan over `.opencode/specs` on 2026-04-13]

Important nuance:
Legacy fallback parsing synthesizes timestamp fields instead of preserving historical save times, so stale-timestamp counts mix true freshness gaps with compatibility-artifact gaps. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:122-160]

Interpretation:
Timestamp freshness is useful as a signal, but it should be split into native-JSON freshness versus legacy-compatibility freshness before driving automation.

## Cross-Corpus Patterns

### What Is Healthy
- Relationship integrity is strong on the small amount of structured relationship data currently present.
- `children_ids` and parent-child structure are internally consistent when interpreted correctly.
- The runtime can still load legacy text metadata, which reduces immediate breakage risk.

### What Is Weak
- Key-file canonicality is poor.
- Entity derivation amplifies key-file noise.
- Status derivation under-reports real packet progress.
- Trigger/entity caps are saturated too often to be treated as edge cases.
- Legacy compatibility preserves loadability but weakens timestamps and entity coverage.

## Recommendations
1. Normalize legacy text files to canonical JSON so timestamp, entity, and relationship behavior is consistent across the full corpus.
2. Strengthen `deriveStatus()` with a fallback that recognizes implementation-summary presence and optionally normalized packet-table status when frontmatter is absent.
3. Sanitize `key_files` before storage: reject obvious commands, MIME types, version tokens, and non-canonical cross-root references.
4. De-duplicate entities against canonical path basenames before insertion, not only after extraction.
5. Enforce or explicitly re-specify trigger-phrase limits, because the current implementation stores far more than the packet contract suggests.
6. Separate relationship integrity from relationship coverage in future dashboards so a sparse-but-valid graph is not mistaken for a complete graph.

## Priority Order
1. Status derivation