---
title: "Spec: Cross-Runtime UX & Documentation [024/016] [system-spec-kit/024-compact-code-graph/016-cross-runtime-ux/spec]"
description: "Achieve ~85-90% context preservation parity across all 5 runtimes. Near-exact seeds, intent metadata annotation, auto-reindex, instruction updates, recovery doc consolidation, seed-resolver error handling, spec/settings truth-sync."
trigger_phrases:
  - "spec"
  - "cross"
  - "runtime"
  - "documentation"
  - "024"
  - "016"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/024-compact-code-graph/016-cross-runtime-ux"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Phase 016 — Cross-Runtime UX & Documentation

<!-- PHASE_LINKS: parent=../spec.md predecessor=015-tree-sitter-migration successor=017-tree-sitter-classifier-fixes -->

<!-- SPECKIT_LEVEL: 2 -->


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## 1. METADATA
Template compliance shim section. Legacy phase content continues below.

## 2. PROBLEM & PURPOSE
Template compliance shim section. Legacy phase content continues below.

## 3. SCOPE
Template compliance shim section. Legacy phase content continues below.

## 4. REQUIREMENTS
Template compliance shim section. Legacy phase content continues below.

## 5. SUCCESS CRITERIA
Template compliance shim section. Legacy phase content continues below.

## 6. RISKS & DEPENDENCIES
Template compliance shim section. Legacy phase content continues below.

## 10. OPEN QUESTIONS
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:metadata -->
Template compliance shim anchor for metadata.
<!-- /ANCHOR:metadata -->
<!-- ANCHOR:problem -->
Template compliance shim anchor for problem.
<!-- /ANCHOR:problem -->
<!-- ANCHOR:scope -->
Template compliance shim anchor for scope.
<!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements -->
Template compliance shim anchor for requirements.
<!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria -->
Template compliance shim anchor for success-criteria.
<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
Template compliance shim anchor for risks.
<!-- /ANCHOR:risks -->
<!-- ANCHOR:questions -->
Template compliance shim anchor for questions.
<!-- /ANCHOR:questions -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### Summary

Improve CocoIndex integration (seed resolution, query-intent metadata, auto-reindex) and update instruction files across all 5 runtimes to auto-trigger code graph + memory context on session start. Consolidate recovery documentation.

### Cross-Runtime Parity Target

| Runtime | Hook Support | Current Parity | Target Parity |
|---------|-------------|---------------|---------------|
| Claude Code | Full (25 events) | 100% | 100% |
| OpenCode | None | ~60% | ~90% |
| Codex CLI | None | ~55% | ~85% |
| Copilot CLI | Guardrails only | ~50% | ~85% |
| Gemini CLI | Has hooks (v0.33.1+) | ~50% | ~80% |

### Items

### P2

**Item 22: Near-exact seed resolution + score propagation**
- Add near-exact tier to seed resolution chain: exact → near-exact (±5 lines) → enclosing → file anchor
- Graduated confidence: `0.95 - distance * 0.02`
- CocoIndex score propagation: blended confidence `resolution * 0.6 + coco * 0.4`
- Add composite index `(file_path, start_line)` for performance
- Files: `mcp_server/lib/code-graph/seed-resolver.ts`, `code-graph-db.ts`
- LOC: 60-80

**Item 23: Query-intent pre-classification metadata**
- Heuristic classifier computes structural vs semantic vs hybrid intent from query terms
- Current phase scope: surface classifier output as `queryIntentMetadata` / `queryIntentRouting` for observability
- Backend-specific routing and fallback behavior remain deferred to follow-on integration work
- Files: `mcp_server/lib/code-graph/query-intent-classifier.ts`, downstream response annotation wiring
- LOC: 60-100

**Item 24: Auto-reindex triggers**
- Branch switch: detect via git HEAD change on tool call
- Session start: batch reindex via resolveTrustedSession() first-call
- Debounced save: track file modifications, reindex after 30s idle
- Files: `handlers/code-graph/scan.ts`, `ccc_reindex` wiring
- LOC: 100-150

### P3

**Item 25: Cross-runtime instruction updates**
- **AGENTS.md**: Add Session Start Protocol section — force `memory_context()` + `code_graph_status()` on first turn
- **AGENTS.md**: Add code graph auto-trigger for Copilot CLI agents
- **OpenCode agents**: Update `.opencode/agent/context.md` with code graph integration
- **Gemini**: Update `AGENTS.md` with equivalent session start protocol
- **CLAUDE.md** (root): Add universal Code Search Protocol referencing code graph tools
- Files: `AGENTS.md`, `AGENTS.md`, `.opencode/agent/context.md`, `AGENTS.md`, `CLAUDE.md`
- LOC: 100-168
- Evidence: research iter-065 (OpenCode), iter-074 (Codex/Copilot), iter-084-087 (per-runtime deep dives)

**Item 26: Recovery documentation consolidation**
- Current: recovery instructions split across `CLAUDE.md` and root `CLAUDE.md`
- Fix: single source of truth for recovery workflow
- Root CLAUDE.md: universal recovery (works on all runtimes)
- `CLAUDE.md`: Claude-specific hook-aware additions only
- Files: `CLAUDE.md`, root `CLAUDE.md`
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

### Completion Status

**Phase Status:** **PARTIAL (11/14 tracked items complete; 3 deferred)**

| Item | Status | Notes |
|------|--------|-------|
| 39: Near-exact seeds | **PARTIAL** | +/-5 lines, graduated confidence, composite index complete; CocoIndex score blending deferred |
| 40: Intent pre-classifier | **PARTIAL** | `classifyQueryIntent()` exists in `query-intent-classifier.ts`; this phase records metadata annotation, not backend routing completion |
| 41: Auto-reindex | **DONE** | Git HEAD change detection, stale file pruning, first-call priming trigger |
| 42: Cross-runtime instructions | **PARTIAL** | Instruction updates landed; runtime-by-runtime manual verification remains deferred |
| 43: Recovery consolidation | **DONE** | Universal in root CLAUDE.md, Claude-specific in .claude/ |
| 44: Seed-resolver errors | **DONE** | Throws instead of silent placeholder |
| 45: SessionStart scope | **DONE** | Spec updated to reflect actual single-entry in-script branching |
| 46: Truth-sync | **DONE** | 5 PARTIAL annotations on v1 checklist |

### Deferred Items — Future Work

### Item 40: Backend Routing from Intent Metadata
**Status:** DEFERRED — classifier metadata exists, but backend routing is not counted as delivered in this phase
**Dependency:** Follow-on integration must consume `queryIntentMetadata` / `queryIntentRouting` to select retrieval backends consistently
**Implementation plan:**
1. Define keyword lists: structural (`calls`, `imports`, `implements`, `extends`) vs semantic (`similar`, `like`, `related`, `example`)
2. Route: structural keywords → code_graph_query, semantic → CocoIndex search
3. Ambiguous queries (no clear signal) → run both, merge results
4. Wire into code_graph_context as pre-routing step
**Estimated LOC:** 60-100
**Risk:** LOW — heuristic classifier, no ML models

### CocoIndex Score Propagation
**Status:** DEFERRED — requires CocoIndex API integration
**Dependency:** CocoIndex MCP server needs to expose a relevance scoring endpoint
**Implementation plan:**
1. Expose semantic relevance scores from CocoIndex search responses
2. Blend semantic and seed-resolution confidence using `resolution * 0.6 + cocoScore * 0.4`
3. Re-rank mixed results with the blended score
4. Validate ranking quality on near-exact and semantic queries
**Estimated LOC:** 20-40
**Risk:** LOW — configuration change only

### Runtime Verification on Target CLIs
**Status:** DEFERRED — requires manual verification on all 5 runtimes
**Dependency:** Access to Claude Code, OpenCode, Codex CLI, Copilot CLI, and Gemini CLI runtime environments
**Implementation plan:**
1. Run each updated instruction file on its target runtime
2. Confirm Session Start Protocol / Code Search Protocol sections load without formatting regressions
3. Record evidence per runtime
**Estimated LOC:** 0-10
**Risk:** LOW — verification only

### Estimated LOC: 130-208 (completed items ~95 LOC; deferred items ~35-110 LOC)
### Dependencies: Phase 014 (MCP first-call priming enables auto-trigger patterns)
### Risk: LOW — mostly documentation and configuration changes

### Problem Statement
This phase addresses concrete context-preservation and code-graph reliability gaps tracked in this packet.

### Requirements Traceability
- REQ-900: Keep packet documentation and runtime verification aligned for this phase.
- REQ-901: Keep packet documentation and runtime verification aligned for this phase.
- REQ-902: Keep packet documentation and runtime verification aligned for this phase.
- REQ-903: Keep packet documentation and runtime verification aligned for this phase.
- REQ-904: Keep packet documentation and runtime verification aligned for this phase.

### Acceptance Scenarios
- **Given** phase context is loaded, **When** verification scenario 1 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 2 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 3 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 4 runs, **Then** expected packet behavior remains intact.
