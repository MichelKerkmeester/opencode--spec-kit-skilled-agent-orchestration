---
title: "Implementation Plan: Spec Doc Indexing [system-spec-kit/022-hybrid-rag-fusion/022-spec-doc-indexing-bypass/plan]"
description: "Propagate qualityGateMode warn-only to all 4 rejection gates in processPreparedMemory, fixing incomplete v3.0.0.1 spec doc indexing bypass."
trigger_phrases:
  - "spec doc bypass plan"
  - "processpreparedmemory fix"
  - "warn-only gates"
importance_tier: "critical"
contextType: "planning"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/022-hybrid-rag-fusion/022-spec-doc-indexing-bypass"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
# Implementation Plan: Spec Doc Indexing Bypass

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (CommonJS) |
| **Framework** | MCP Server (Node.js) |
| **Storage** | SQLite (better-sqlite3) |
| **Testing** | Manual via `memory_index_scan` |

### Overview
Add `qualityGateMode` checks to the 3 upstream rejection gates in `processPreparedMemory()` (memory-save.ts). When `qualityGateMode === 'warn-only'`, log a warning and continue instead of returning `status: 'rejected'`. This completes the v3.0.0.1 fix which only bypassed Gate 4 (quality gate).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Root cause fully diagnosed with line numbers

### Definition of Done
- [ ] All 3 gates bypassed for warn-only mode
- [ ] Build passes (`npm run build`)
- [ ] `memory_index_scan({ force: true })` — 0 rejected spec docs
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Conditional bypass — same pattern as existing Gate 4 bypass

### Key Components
- **`processPreparedMemory()`** (line 306): The 4-gate rejection pipeline in memory-save.ts
- **`qualityGateMode`** parameter: Already threaded through from memory-index.ts

### Data Flow
```
memory-index.ts:384  isSpecDoc → { qualityGateMode: 'warn-only' }
    ↓
indexSingleFile() → indexMemoryFile() → processPreparedMemory()
    ↓
Gate 1 (V-rule):         if warn-only → log + continue  [NEW]
Gate 2 (sufficiency):    if warn-only → log + continue  [NEW]
Gate 3 (template):       if warn-only → log + continue  [NEW]
Gate 4 (quality gate):   if warn-only → log + continue  [EXISTING v3.0.0.1]
    ↓
Embedding → DB insert → success
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Code Change
- [ ] Modify Gate 1 (line 333): Add `qualityGateMode === 'warn-only'` check before V-rule rejection
- [ ] Modify Gate 2 (line 350): Add `qualityGateMode === 'warn-only'` check before sufficiency rejection
- [ ] Modify Gate 3 (line 354): Add `qualityGateMode === 'warn-only'` check before template contract rejection

### Phase 2: Build
- [ ] Run `npm run build` in `mcp_server/`
- [ ] Verify no TypeScript errors

### Phase 3: Verification
- [ ] Restart MCP server
- [ ] Run `memory_index_scan({ force: true })`
- [ ] Confirm spec docs indexed (not rejected)
- [ ] Confirm memory files still subject to all gates
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Full force re-index scan | `memory_index_scan({ force: true })` |
| Manual | Check rejection count is 0 for spec docs | Scan output analysis |
| Manual | Verify memory files unchanged | Compare before/after |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| v3.0.0.1 build | Internal | Green | Already compiled and running |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Spec docs indexed with corrupt data or memory files bypass gates incorrectly
- **Procedure**: `git checkout` the memory-save.ts file, rebuild, restart MCP
<!-- /ANCHOR:rollback -->
