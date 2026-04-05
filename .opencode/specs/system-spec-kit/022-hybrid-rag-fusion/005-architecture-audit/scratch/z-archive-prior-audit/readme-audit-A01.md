# README Audit Report A01

**Date**: 2026-03-08
**Auditor**: Claude Opus 4.6
**Scope**: Two library subdirectories missing README.md files

---

## Audit Results

| Folder | Action | File Count | Notes |
|--------|--------|------------|-------|
| `mcp_server/lib/graph/` | Created README.md | 2 source files (`community-detection.ts`, `graph-signals.ts`) | Documented BFS + Louvain community detection, momentum/depth graph signals, 14 exported functions, database table references and score adjustment formulas. |
| `mcp_server/lib/chunking/` | Created README.md | 2 source files (`anchor-chunker.ts`, `chunk-thinning.ts`) | Documented two-strategy chunking pipeline (anchor-based + structure fallback), thinning score composition, 12 exported symbols with types and constants, size thresholds. |

## Format Compliance

Both READMEs follow the established `mcp_server/lib/` README convention:

- YAML frontmatter with title, description, trigger_phrases
- Numbered ALL-CAPS H2 sections
- TOC with anchor tags
- File listing table with accurate descriptions
- No HVR-banned words
- No em dashes, no semicolons, no Oxford commas
- Active voice throughout

## Source Files Reviewed

All 4 source files were read in full before writing:

1. `graph/community-detection.ts` (577 lines) - BFS connected components, single-level Louvain, community persistence, co-retrieval boost
2. `graph/graph-signals.ts` (415 lines) - Degree snapshots, momentum (N2a), causal depth (N2b), combined application
3. `chunking/anchor-chunker.ts` (260 lines) - Anchor extraction, anchor-based chunking, structure-based fallback
4. `chunking/chunk-thinning.ts` (156 lines) - Chunk scoring, content density computation, threshold thinning
