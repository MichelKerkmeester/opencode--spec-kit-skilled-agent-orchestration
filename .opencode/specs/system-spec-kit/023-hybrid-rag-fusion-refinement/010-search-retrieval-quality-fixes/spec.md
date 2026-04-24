---
title: "Feature Specification [system-spec-kit/023-hybrid-rag-fusion-refinement/010-search-retrieval-quality-fixes/spec]"
description: "Fix six retrieval quality issues in memory_context/memory_search: intent propagation bug, silent folder auto-narrowing, aggressive token budget truncation, folder discovery as boost signal, two-tier metadata+content response, and intent confidence floor."
trigger_phrases: ["search retrieval quality", "intent propagation bug", "folder auto-narrowing", "token budget truncation", "memory context 0 results", "folder discovery boost", "search returns nothing", "evidence gap false positive"]
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/023-hybrid-rag-fusion-refinement/010-search-retrieval-quality-fixes"
    last_updated_at: "2026-04-24T14:55:00Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Backfilled memory block"
    next_safe_action: "Revalidate packet docs"
    key_files: ["spec.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

# Feature Specification: Search Retrieval Quality Fixes

---

<!-- ANCHOR:phase-context -->
### Phase Context

| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 10 of N |
| **Predecessor** | 009-reindex-validator-false-positives |
| **Successor** | 011-indexing-and-adaptive-fusion |
| **Handoff Criteria** | `memory_context` deep mode returns relevant results for "semantic search" without evidence gap; all 6 fixes verified |

This is **Phase 10** of the ESM Module Compliance specification. It addresses six retrieval quality issues discovered during root-cause analysis of `memory_context` returning 0 results for "semantic search" — a query that should match 20+ memories.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Review |
| **Created** | 2026-03-31 |
| **Branch** | `system-speckit/024-compact-code-graph` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`memory_context({ input: "semantic search", mode: "deep", intent: "understand" })` returns **0 results** despite the database containing 1202 memories with 20+ relevant matches. Root-cause analysis revealed three compounding bugs and three architectural improvements needed:

**Bugs (Quick Wins):**

1. **RC3-A: Intent not propagated to non-focused strategies** — When caller passes explicit `intent: "understand"` to `memory_context`, only `executeFocusedStrategy()` receives it. `executeDeepStrategy()`, `executeQuickStrategy()`, and `executeResumeStrategy()` ignore the explicit intent and set `autoDetectIntent: true`, causing re-detection that produces wrong intents (e.g., `fix_bug` at 0.098 confidence for "semantic search").

2. **RC1-A: Folder discovery silently narrows to empty** — `memory_context` auto-discovers a specFolder via keyword matching (`maybeDiscoverSpecFolder`), applies it as a hard filter (`options.specFolder = discoveredFolder`), and when that folder has 0 matching memories, returns 0 results. The recovery system diagnoses `reason: "spec_filter_too_narrow"` but doesn't retry without the filter.

3. **RC2-B: Token budget truncation drops 95% of results** — With `includeContent: true`, a single large result (e.g., 2000-token spec document) consumes the entire 3500-token deep mode budget, causing the truncation loop to drop 19 of 20 results.

**Architecture (Proper Fixes):**

4. **RC1-B: Folder discovery as boost signal** — Currently folder discovery is a binary filter (include/exclude). It should be a scoring boost that promotes results from the discovered folder without excluding others.

5. **RC2-A: Two-tier metadata+content response** — Return metadata (title, score, folder, confidence) for ALL results, with full content only for top N that fit the budget. Callers can then selectively load content for specific results.

6. **RC3-B: Intent confidence floor** — Auto-detected intents below 0.25 confidence should fall back to `understand` rather than applying nonsense classifications.

### Diagnostic Evidence

| Query | Via | Candidates | Returned | Root Cause |
|-------|-----|-----------|----------|------------|
| "semantic search" | `memory_context` deep | 0 | 0 | RC1-A: folder narrowing |
| "semantic search" | `memory_search` direct | 20 | 1 | RC2-B: budget truncation |
| "semantic search vector embeddings CocoIndex" | `memory_quick_search` | 18 | 1 | RC2-B: budget truncation |
| "hybrid retrieval pipeline vector search embedding" | `memory_search` direct | 28 | 1 | RC2-B: budget truncation |

Intent auto-detection accuracy on these queries:

| Query | Detected | Confidence | Correct |
|-------|----------|------------|---------|
| "semantic search" | fix_bug | 0.098 | No |
| "semantic search vector embeddings CocoIndex" | security_audit | 0.111 | No |
| "hybrid retrieval pipeline vector search embedding" | find_decision | 0.190 | No |

### Purpose

Restore retrieval quality so that `memory_context` reliably returns relevant results for valid queries, explicit intents are honored across all strategies, and token budgets don't silently discard the majority of search results.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**Quick Wins (Fixes 1-3):**
1. Forward explicit `intent` parameter to all four strategy functions in `memory-context.ts`
2. Add auto-retry without folder filter when folder discovery yields 0 results
3. Implement adaptive content truncation — truncate content of large results rather than dropping them entirely

**Architecture (Fixes 4-6):**
4. Add folder-boost scoring for discovered folders while preserving the 0-result recovery path when the initial discovered-folder scope is too narrow
5. Implement two-tier response: metadata for all results, content for top N that fit budget
6. Add confidence floor (0.25) for auto-detected intent in `memory-search.ts`

### Out of Scope
- Embedding model changes (Voyage AI working correctly)
- Database schema changes
- FTS5/BM25 index changes
- New search channels or retrieval strategies
- Changes to trigger matching system

### Files to Change

| File Path | Change Type | Fixes |
|-----------|-------------|-------|
| `mcp_server/handlers/memory-context.ts` | Modify | RC3-A, RC1-A, RC2-B, RC1-B, RC2-A |
| `mcp_server/handlers/memory-search.ts` | Modify | RC3-B |
| `mcp_server/lib/search/folder-discovery.ts` | Modify | RC1-B |

All paths relative to `.opencode/skill/system-spec-kit/`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Explicit intent propagated to all strategies | `memory_context({ intent: "understand" })` uses "understand" regardless of strategy (deep/quick/resume/focused) |
| REQ-002 | Folder discovery 0-result recovery | When folder-narrowed search returns 0, auto-retry without folder filter returns >0 results |
| REQ-003 | Token truncation preserves result diversity | With `includeContent: true` and 20 candidates, at least 5 results returned (with truncated content) instead of 1 |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Folder discovery as boost signal | Discovered folder boosts matching results by configurable factor (default 1.3x) without excluding non-matching results |
| REQ-005 | Two-tier metadata+content response | All results include metadata (title, score, folder, confidence); full content included only for top N that fit budget |
| REQ-006 | Intent confidence floor | Auto-detected intents below 0.25 confidence default to "understand"; explicit intents bypass the floor |

### Verification

| ID | Verification Query | Expected Outcome |
|----|-------------------|------------------|
| VER-001 | `memory_context({ input: "semantic search", mode: "deep", intent: "understand" })` | >0 results, intent=understand in trace |
| VER-002 | `memory_context({ input: "semantic search", mode: "deep" })` | >0 results (folder recovery or no false narrowing) |
| VER-003 | `memory_search({ query: "semantic search", includeContent: true, limit: 20 })` | >=5 results returned (not truncated to 1) |
| VER-004 | `memory_search({ query: "semantic search" })` | Intent defaults to "understand" (not fix_bug at 0.098) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `memory_context({ input: "semantic search", mode: "deep", intent: "understand" })` returns relevant results (not 0)
- **SC-002**: Intent trace shows "understand" (explicit) not "fix_bug" (auto-detected) when caller specifies intent
- **SC-003**: Token budget truncation preserves at least 5 of 20 results with truncated content
- **SC-004**: Search responses surface folder boost data via `appliedBoosts.folder`, while the L1 response meta continues to report `folderDiscovery.source: "folder-discovery"`
- **SC-005**: Short ambiguous queries ("semantic search") get `understand` intent (not random low-confidence classifications)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->

### Acceptance Scenarios

**Given** the phase scope and requirements are loaded, **when** implementation starts, **then** only in-scope files and behaviors are changed.

**Given** the phase deliverables are implemented, **when** verification runs, **then** required checks complete without introducing regressions.

**Given** this phase depends on predecessor outputs, **when** those dependencies are present, **then** this phase behavior composes correctly with adjacent phases.

**Given** this phase modifies documented behavior, **when** packet docs are reviewed, **then** spec/plan/tasks/checklist remain internally consistent.

**Given** this phase is rerun in a clean environment, **when** the same commands are executed, **then** outcomes are reproducible.

**Given** completion is claimed, **when** evidence is inspected, **then** each required acceptance outcome is explicitly supported.

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Intent propagation changes affect focused strategy behavior | Focused strategy already handles intent — no change needed there |
| Risk | Folder boost scoring changes result order | Existing order is wrong anyway (0 results); test with known queries |
| Risk | Content truncation loses important context | Truncated results still include title, score, folder — caller can load full content |
| Risk | Confidence floor too aggressive at 0.25 | Configurable threshold; 0.25 is well below any valid classification |
| Dependency | MCP server restart after changes | Required; brief search downtime | Plan restart window |
| Dependency | TypeScript build pipeline | TS source must compile | Verify build after changes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the folder discovery boost factor (1.3x) be configurable via environment variable?
- Should two-tier response be opt-in (new parameter) or always-on?
- Should confidence floor (0.25) apply to `memory_context` auto-detection too, or only `memory_search`?
<!-- /ANCHOR:questions -->
