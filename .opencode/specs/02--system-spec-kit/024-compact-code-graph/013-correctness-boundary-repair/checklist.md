---
title: "Checklist: Correctness & Boundary Repair [024/013]"
description: "25 items across P0/P1/P2 for phase 013."
---
# Checklist: Phase 013 — Correctness & Boundary Repair

## P0

- [x] endLine correctly set for multi-line JS/TS functions (brace-counting)
- [x] endLine correctly set for multi-line Python functions (indentation)
- [x] endLine correctly set for multi-line Bash functions (marker tracking)
- [x] CALLS edges detected across full function bodies (not just declaration line)
- [x] contentHash computed over full function body (startLine to endLine)

## P1

- [x] Seed identity (source type) preserved through code_graph_context pipeline [F006]
- [x] Code-graph dispatch uses local `getMissingRequiredStringArgs()` checks for required strings in `code_graph_query` and `ccc_feedback` — not unified `validateToolArgs()` [F010]
- [x] code_graph_scan rejects rootDir outside workspace root [F010]
- [x] Exception strings sanitized in memory-context.ts handler
- [x] Exception strings sanitized in code_graph_context handler
- [x] Orphan inbound edges deleted during replaceNodes() [F007]
- [x] Orphan outbound edges deleted during replaceNodes() [F007]
- [x] Budget allocator accepts caller-provided budget (no hard 4000 ceiling) [F011]
- [x] sessionState section included in budget allocation (no bypass) [F020]
- [x] Merger skips sections with zero granted budget [F012]
- [x] Merger truncation marker stays within granted budget [F012]
- [x] code_graph_scan initializes DB on fresh runtime without throwing [F021]
- [x] initDb() has migration guard — failed init resets singleton for retry [F023]
- [x] replaceNodes/Edges wrapped in transaction — constraint error rolls back [F024]
- [x] Transitive code_graph_query respects maxDepth — no node leak [F026]
- [x] Converging paths deduplicated in transitive query results [F026]
- [x] `includeTrace` is absent from the `code_graph_context` schema; memory tool schemas (`memory_context`, `memory_search`) still expose `includeTrace` [F033]
- [x] All existing vitest tests still pass after changes — 226/226

## P2

- [x] Working-set-tracker enforces maxFiles at insertion (no 2x overshoot) [F013]
- [ ] ccc_feedback length validation for `comment`/`resultFile` is NOT IMPLEMENTED; dispatch only checks required `query`/`rating`, and the schema defines no minLength/maxLength bounds [F031]
