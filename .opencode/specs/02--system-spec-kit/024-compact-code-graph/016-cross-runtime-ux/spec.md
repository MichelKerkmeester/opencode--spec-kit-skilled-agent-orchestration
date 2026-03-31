---
title: "Spec: Cross-Runtime UX & Documentation [024/016]"
description: "Achieve ~85-90% context preservation parity across all 5 runtimes. Near-exact seeds, intent routing, auto-reindex, instruction updates, recovery doc consolidation, seed-resolver error handling, spec/settings truth-sync."
---
# Spec: Phase 016 — Cross-Runtime UX & Documentation

## Summary

Improve CocoIndex integration (seed resolution, query routing, auto-reindex) and update instruction files across all 5 runtimes to auto-trigger code graph + memory context on session start. Consolidate recovery documentation.

## Cross-Runtime Parity Target

| Runtime | Hook Support | Current Parity | Target Parity |
|---------|-------------|---------------|---------------|
| Claude Code | Full (25 events) | 100% | 100% |
| OpenCode | None | ~60% | ~90% |
| Codex CLI | None | ~55% | ~85% |
| Copilot CLI | Guardrails only | ~50% | ~85% |
| Gemini CLI | Has hooks (v0.33.1+) | ~50% | ~80% |

## Items

### P2

**Item 22: Near-exact seed resolution + score propagation**
- Add near-exact tier to seed resolution chain: exact → near-exact (±5 lines) → enclosing → file anchor
- Graduated confidence: `0.95 - distance * 0.02`
- CocoIndex score propagation: blended confidence `resolution * 0.6 + coco * 0.4`
- Add composite index `(file_path, start_line)` for performance
- Files: `mcp_server/lib/code-graph/seed-resolver.ts`, `code-graph-db.ts`
- LOC: 60-80

**Item 23: Query-intent pre-classification**
- Heuristic classifier: structural keywords → code graph, semantic keywords → CocoIndex
- Confidence threshold: route to both when ambiguous
- Fallback: if primary source returns empty, try secondary
- Files: Intent router (new or extend existing)
- LOC: 60-100

**Item 24: Auto-reindex triggers**
- Branch switch: detect via git HEAD change on tool call
- Session start: batch reindex via resolveTrustedSession() first-call
- Debounced save: track file modifications, reindex after 30s idle
- Files: `handlers/code-graph/scan.ts`, `ccc_reindex` wiring
- LOC: 100-150

### P3

**Item 25: Cross-runtime instruction updates**
- **CODEX.md**: Add Session Start Protocol section — force `memory_context()` + `code_graph_status()` on first turn
- **AGENTS.md**: Add code graph auto-trigger for Copilot CLI agents
- **OpenCode agents**: Update `.opencode/agent/context.md` with code graph integration
- **Gemini**: Update `GEMINI.md` with equivalent session start protocol
- **CLAUDE.md** (root): Add universal Code Search Protocol referencing code graph tools
- Files: `CODEX.md`, `AGENTS.md`, `.opencode/agent/context.md`, `GEMINI.md`, `CLAUDE.md`
- LOC: 100-168
- Evidence: research iter-065 (OpenCode), iter-074 (Codex/Copilot), iter-084-087 (per-runtime deep dives)

**Item 26: Recovery documentation consolidation**
- Current: recovery instructions split across `.claude/CLAUDE.md` and root `CLAUDE.md`
- Fix: single source of truth for recovery workflow
- Root CLAUDE.md: universal recovery (works on all runtimes)
- `.claude/CLAUDE.md`: Claude-specific hook-aware additions only
- Files: `.claude/CLAUDE.md`, root `CLAUDE.md`
- LOC: 20-30

### P2 — Improvements (new from 30-iteration review)

**Item 44: Fix seed-resolver silent DB failure**
- When DB queries fail in seed-resolver.ts, failures silently become placeholder anchors
- Seeds intended as exact matches degrade to file-level anchors without warning
- Fix: propagate DB errors; return explicit error or retry instead of silent fallback
- Files: `mcp_server/lib/code-graph/seed-resolver.ts`
- Evidence: review F014

**Item 45: Fix spec/settings SessionStart scope mismatch**
- Spec describes source-scoped SessionStart matchers (startup, resume, clear, compact)
- settings.local.json registers a single unscoped SessionStart entry
- Fix: align settings with spec or update spec to reflect actual registration
- Files: `spec.md`, `.claude/settings.local.json`
- Evidence: review F030

### Truth-Sync (spec/checklist alignment)

**Item 46: Downgrade checklist claims for partially-shipped phases**
- Review found phases 005/006/008/011/012 have checked items that overstate shipped behavior
- 5 PARTIAL + 1 UNVERIFIED items in parent checklist (review iteration 029)
- Fix: downgrade claims to match actual implementation; add notes for incomplete items
- Files: root `checklist.md`, phase-specific checklists
- Evidence: review iterations 14, 18, 29

## Completion Status

| Item | Status | Notes |
|------|--------|-------|
| 39: Near-exact seeds | **DONE** | +/-5 lines, graduated confidence, composite index |
| 40: Intent pre-classifier | **DEFERRED** | Requires CocoIndex API integration |
| 41: Auto-reindex | **DONE** | Git HEAD change detection, stale file pruning |
| 42: Cross-runtime instructions | **DONE** | CODEX.md, AGENTS.md, context.md, GEMINI.md |
| 43: Recovery consolidation | **DONE** | Universal in root CLAUDE.md, Claude-specific in .claude/ |
| 44: Seed-resolver errors | **DONE** | Throws instead of silent placeholder |
| 45: SessionStart scope | **DEFERRED** | Requires settings.local.json changes |
| 46: Truth-sync | **DONE** | 5 PARTIAL annotations on v1 checklist |

## Deferred Items — Future Work

### Item 40: Intent Pre-Classifier
**Status:** DEFERRED — requires CocoIndex API integration
**Dependency:** CocoIndex MCP server needs to expose a relevance scoring endpoint
**Implementation plan:**
1. Define keyword lists: structural (`calls`, `imports`, `implements`, `extends`) vs semantic (`similar`, `like`, `related`, `example`)
2. Route: structural keywords → code_graph_query, semantic → CocoIndex search
3. Ambiguous queries (no clear signal) → run both, merge results
4. Wire into code_graph_context as pre-routing step
**Estimated LOC:** 60-100
**Risk:** LOW — heuristic classifier, no ML models

### Item 45: SessionStart Scope Alignment
**Status:** DEFERRED — requires settings.local.json schema investigation
**Dependency:** Needs to determine whether `.claude/settings.local.json` supports source-scoped matchers
**Implementation plan:**
1. Test whether Claude Code respects `source` matchers in SessionStart hook registration
2. If supported: add 4 scoped entries (startup, resume, clear, compact) to settings.local.json
3. If not supported: update spec to reflect actual single-entry registration
4. Verify hooks fire correctly on each source type
**Estimated LOC:** 5-20
**Risk:** LOW — configuration change only

## Estimated LOC: 130-208 (completed items ~95 LOC; deferred items ~65-120 LOC)
## Dependencies: Phase 014 (MCP first-call priming enables auto-trigger patterns)
## Risk: LOW — mostly documentation and configuration changes
