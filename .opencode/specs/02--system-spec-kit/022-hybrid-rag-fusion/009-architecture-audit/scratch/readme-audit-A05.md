# README Audit Report A05

> Audit of missing README.md files in `shared/` subfolders.

**Date**: 2026-03-08
**Auditor**: Claude Opus 4.6
**Scope**: Three `shared/` subfolders that lacked README documentation

---

## Summary

| Folder                | Action  | File Count | Notes                                                            |
| --------------------- | ------- | ---------- | ---------------------------------------------------------------- |
| `shared/algorithms/`  | Created | 4 source   | Barrel index + 3 algorithm modules (RRF, adaptive fusion, MMR)   |
| `shared/contracts/`   | Created | 1 source   | Single module: retrieval-trace.ts (types + factory functions)     |
| `shared/lib/`         | Created | 1 source   | Single module: structure-aware-chunker.ts (markdown chunking)     |

## Details

### shared/algorithms/README.md (created)

- **Files documented**: `index.ts`, `adaptive-fusion.ts`, `mmr-reranker.ts`, `rrf-fusion.ts`
- **Total LOC**: ~1,078 across all modules
- **Key coverage**: All public exports cataloged in tables. Documents 7 intent weight profiles, 3 fusion modes (two-list, multi-list, cross-variant), feature-flag gating and dark-run comparison mode.

### shared/contracts/README.md (created)

- **Files documented**: `retrieval-trace.ts`
- **Total LOC**: 197
- **Key coverage**: 6 type/interface exports, 4 factory functions, 1 constant. Documents the pipeline stage enum, trace structure, context envelope pattern and degraded-mode contract.

### shared/lib/README.md (created)

- **Files documented**: `structure-aware-chunker.ts`
- **Total LOC**: 222
- **Key coverage**: 2 public functions, 2 interfaces. Includes a dedicated section on chunking behavior rules (atomic code blocks, atomic tables, heading pairing, token budget accumulation).

## Style Conformance

All three READMEs follow the established pattern from `shared/scoring/README.md`:

- YAML frontmatter with title, description, trigger_phrases
- Numbered ALL CAPS H2 sections
- ANCHOR comments for section targeting
- File listing table with LOC counts
- Export tables grouped by kind
- No HVR-banned words, no em dashes, no semicolons, no Oxford commas
- Active voice throughout
