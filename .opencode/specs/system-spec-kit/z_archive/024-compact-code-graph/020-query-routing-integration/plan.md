<!-- SPECKIT_TEMPLATE_SOURCE: system-spec-kit templates | v2.2 -->
---
title: "Plan: Query-Routing Integration [024/020] [system-spec-kit/024-compact-code-graph/020-query-routing-integration/plan]"
description: "Implementation order for query-intent enrichment in memory_context, session_resume, and passive enrichment."
trigger_phrases:
  - "plan"
  - "query"
  - "routing"
  - "integration"
  - "024"
  - "020"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "024-compact-code-graph/020-query-routing-integration"
    last_updated_at: "2026-04-24T15:33:48Z"
    last_updated_by: "claude-opus-4-7-spec-audit-2026-04-24"
    recent_action: "Spec audit + path reference remediation (Pass 1-3)"
    next_safe_action: "Continue systematic remediation or reindex"
    blockers: []

---
# Implementation Plan: Query-Routing Integration [024/020]


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## 1. SUMMARY
Template compliance shim section. Legacy phase content continues below.

## 2. QUALITY GATES
Template compliance shim section. Legacy phase content continues below.

## 3. ARCHITECTURE
Template compliance shim section. Legacy phase content continues below.

## 4. IMPLEMENTATION PHASES
Template compliance shim section. Legacy phase content continues below.

## 5. TESTING STRATEGY
Template compliance shim section. Legacy phase content continues below.

## 6. DEPENDENCIES
Template compliance shim section. Legacy phase content continues below.

## 7. ROLLBACK PLAN
Template compliance shim section. Legacy phase content continues below.

<!-- SPECKIT_TEMPLATE_SHIM_END -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
### 1. SUMMARY
#### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript MCP server |
| **Framework** | Internal tool handlers and lifecycle dispatch |
| **Storage** | Graph DB stats + existing memory stack |
| **Testing** | Code audit, packet consistency review, strict spec validation |

### Overview
This phase adds query-intent awareness without replacing `memory_context`'s core semantic flow. The shipped implementation classifies intent, optionally appends graph context for structural or hybrid queries, exposes `queryIntentRouting` metadata, adds a slim `session_resume` composite tool, and wires passive enrichment into the response path.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
### 2. QUALITY GATES
### Definition of Ready
- [x] Problem statement captured: docs had drifted from verified implementation behavior.
- [x] Success criteria defined: packet must describe additive enrichment, real metadata, slim resume payload, and shipped passive enrichment.
- [x] Dependencies identified: classifier, graph context builder, and registered resume schema already exist.

### Definition of Done
- [x] All five packet documents use the same corrected contract language.
- [x] `session_resume` is described without `ccc_status()` or full CocoIndex status claims.
- [x] Part 3 is documented as implemented and `code-graph-enricher.ts` is removed from the file inventory.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
### 3. ARCHITECTURE
### Pattern
Documentation for additive enrichment over a semantic-first handler flow.

### Key Components
- **`handlers/memory-context.ts`**: Classifies query intent, continues semantic strategy execution, and appends optional `graphContext` plus `queryIntentRouting`.
- **`handlers/session-resume.ts`**: Returns resume context, summarized code graph stats, and CocoIndex availability.
- **`context-server.ts`**: Invokes passive enrichment on tool response text.
- **`lib/enrichment/passive-enrichment.ts`**: Contains path extraction and code graph symbol enrichment logic inline.

### Data Flow
User query enters `memory_context`, query intent is classified, the normal traced semantic result is produced, and graph context is appended only when structural or hybrid signals justify it and context can be built. `session_resume` separately combines memory resume data with graph and CocoIndex summaries rather than proxying full status-tool payloads.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
### 4. IMPLEMENTATION PHASES
### Phase 1: Query-Intent Enrichment
- Classify query intent near the top of `memory_context`.
- Keep `executeStrategy()` as the main execution path.
- Build graph context for structural or hybrid queries when available.
- Append `graphContext` and `queryIntentRouting` to the traced result.

### Phase 2: Composite Resume Tool
- Add `session_resume` handler and register it in tool schemas and lifecycle dispatch.
- Accept only `specFolder?` and `minimal?`.
- Return `memory_context` resume data, `codeGraph { status, lastScan, nodeCount, edgeCount, fileCount }`, and `cocoIndex { available, binaryPath }`.

### Phase 3: Passive Enrichment and Verification
- Wire `context-server.ts` to dynamically import `./lib/enrichment/passive-enrichment.js`.
- Run `runPassiveEnrichment(result.content[0].text)` on response output.
- Keep code graph symbol enrichment inside `lib/enrichment/passive-enrichment.ts`.
- Verify the packet does not claim deferred Part 3 work or deleted enrichment files.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
### 5. TESTING STRATEGY
| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract audit | `memory_context` metadata and enrichment behavior | Verified handler line references |
| Integration audit | `session_resume` schema and response summary | Verified handler + schema references |
| Manual documentation review | Packet-wide terminology consistency | Cross-file comparison and targeted stale-term search |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
### 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `classifyQueryIntent()` | Internal | Green | Without it there is no query-intent metadata or graph enrichment trigger. |
| `buildContext()` | Internal | Green | Structural and hybrid enrichment cannot append `graphContext` if this is unavailable. |
| `graphDb.getStats()` + `isCocoIndexAvailable()` | Internal | Green | `session_resume` cannot expose its lightweight status summary. |
| Passive enrichment hook in `context-server.ts` | Internal | Green | Packet would need to describe Part 3 as incomplete if this wiring were absent. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
### 7. ROLLBACK PLAN
- **Trigger**: Revert if query-intent enrichment or passive enrichment causes incorrect tool responses.
- **Procedure**: Remove the query-intent append path, unregister `session_resume`, and remove the passive enrichment hook from `context-server.ts`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
### L2: PHASE DEPENDENCIES
```
Phase 1 (Query Intent) ───────┐
                              ├──► Phase 2 (Resume Tool) ───► Phase 3 (Passive Enrichment + Verify)
Schema Registration ──────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Query Intent | Existing `memory_context` semantic flow | Resume metadata accuracy, final verification |
| Resume Tool | Query intent naming + schema registration | Final packet accuracy |
| Passive Enrichment + Verify | `context-server.ts` hook and passive enrichment implementation | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
### L2: EFFORT ESTIMATION
| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Query-Intent Enrichment | Medium | 2-4 hours |
| Resume Tool | Medium | 2-3 hours |
| Passive Enrichment + Verification | Medium | 2-4 hours |
| **Total** | | **6-11 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
### L2: ENHANCED ROLLBACK
### Pre-deployment Checklist
- [x] Existing `memory_context` behavior preserved as the semantic baseline.
- [x] `session_resume` exposed as a new tool without mutating other tool schemas.
- [x] Passive enrichment kept best-effort on response text.

### Rollback Procedure
1. Remove query-intent append logic from `handlers/memory-context.ts`.
2. Remove `session_resume` registration and handler export.
3. Remove the passive enrichment dynamic import and invocation from `context-server.ts`.
4. Re-run smoke checks on resume and memory context flows.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

### Technical Context
- Runtime context and validation dependencies are documented for this phase.
