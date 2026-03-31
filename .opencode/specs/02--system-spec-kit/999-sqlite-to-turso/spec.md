---
title: "SQLite-to-Turso Migration Research [02--system-spec-kit/999-sqlite-to-turso/spec]"
description: "title: \"SQLite-to-Turso Migration Research\""
trigger_phrases:
  - "sqlite"
  - "turso"
  - "migration"
  - "research"
  - "spec"
  - "999"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: CORE -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# SQLite-to-Turso Migration Research

| Field       | Value                                                    |
| ----------- | -------------------------------------------------------- |
| **Type**    | Research / Technical Analysis                            |
| **Level**   | 3 (Research with decision record)                        |
| **Scope**   | Research only — no code changes                          |
| **Status**  | In Progress                                              |
| **Created** | 2026-03-05                                               |

<!-- ANCHOR:metadata -->
## Objective

Evaluate Turso Database (Beta 0.5.0-pre.20) as a potential replacement for the current SQLite stack (`better-sqlite3` v12.6.2 + `sqlite-vec` v0.1.7-alpha.2 + FTS5) powering the Spec Kit Memory MCP server.

<!-- /ANCHOR:metadata -->
## Context

The MCP server is a production-grade semantic memory system featuring:
- 5-channel hybrid search pipeline (vector, BM25, FTS5, graph, trigger)
- 4-stage retrieval pipeline (candidate gen, fusion, rerank, filter)
- 15+ database tables, 40+ indexes, 21 schema versions
- ~29,000 lines of TypeScript across 150+ files

Turso is a **complete Rust rewrite** of SQLite (not a fork), offering native vectors, CDC, cloud sync, and encryption — but has critical gaps for RAG workloads including no vector indexes, no FTS5, and beta stability.

## Deliverables

1. **Technical Analysis** (`research/001 - analysis-sqlite-to-turso-migration.md`) — 2000-3000 word deep-dive covering architecture, compatibility matrix, and limitations
2. **Recommendations** (`research/002 - recommendations-sqlite-to-turso-migration.md`) — 1000-1500 word actionable roadmap with prioritized strategies and migration pathways

<!-- ANCHOR:scope -->
## Out of Scope

- Code changes, prototyping, or proof-of-concept implementations
- Performance benchmarking (covered in research only)
- Migration execution
<!-- /ANCHOR:scope -->
