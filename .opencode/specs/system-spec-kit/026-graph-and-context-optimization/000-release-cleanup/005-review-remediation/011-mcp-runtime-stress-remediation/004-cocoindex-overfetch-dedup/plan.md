---
# SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2
title: "Implementation Plan: CocoIndex over-fetch + canonical-identity dedup + path-class rerank [system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/004-cocoindex-overfetch-dedup/plan]"
description: "Make CocoIndex code-first by default: exclude mirrors, add canonical identity, over-fetch+dedup+rerank, surface path_class telemetry."
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
trigger_phrases:
  - "cocoindex dedup plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/011-mcp-runtime-stress-remediation/004-cocoindex-overfetch-dedup"
    last_updated_at: "2026-04-27T09:38:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored plan"
    next_safe_action: "Dispatch cli-codex"
    blockers: []
    key_files: ["plan.md"]
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
# Implementation Plan: CocoIndex over-fetch + canonical-identity dedup + path-class rerank

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3.11+ |
| **Framework** | CocoIndex (vector search), sqlite-vec |
| **Storage** | sqlite + vec0 |
| **Testing** | pytest (if available), manual ccc search probes |

### Overview
Three-layer fix: (1) settings — exclude mirrors at index time. (2) indexer — add source_realpath + content_hash + path_class. (3) query — over-fetch+dedup+rerank, surface telemetry. The first layer alone substantially mitigates 005/REQ-018; the second + third are required for the full contract.

### Pre-step (CRITICAL)
Locate CocoIndex source files. They may be installed as a Python package OR vendored in the repo. Run: `python -c "import cocoindex_code; print(cocoindex_code.__file__)"` to find the install path. If the path is in site-packages, decide vendor-vs-fork strategy with the user before patching.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem stated (005/REQ-018-019, 007/Q2-Q3)
- [x] Success criteria measurable
- [ ] CocoIndex source location resolved

### Definition of Done
- [ ] All REQs PASS
- [ ] Reindex completed
- [ ] 005 Probe REQ-018 + REQ-019 re-run shows expected behavior
- [ ] `validate.sh --strict` PASS
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Layered: settings (exclude) -> indexer schema (canonical identity + class) -> query (over-fetch + dedup + rerank).

### Key Components
- `.cocoindex_code/settings.yml`: exclude rules.
- `cocoindex_code/indexer.py`: chunk write path. Add source_realpath via `os.path.realpath()`. Add content_hash via sha256 of normalized content. Add path_class via classifier function.
- `cocoindex_code/query.py`: nearest-neighbor query path. Add over-fetch + dedup + rerank.
- `cocoindex_code/project.py` + `cocoindex_code/server.py`: pass-through layers; surface new fields in query results.

### Data Flow
```
index time:
  file -> chunk -> resolve realpath -> hash content -> classify path_class
       -> insert (file_path, source_realpath, content_hash, path_class, vector, ...)

query time:
  query -> embed -> fetch limit*4 nearest neighbors
       -> group by (source_realpath || content_hash, start_line, end_line)
       -> prefer canonical display path within group
       -> rerank by path_class for implementation-intent queries
       -> return top limit with rankingSignals
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Pre-flight
- [ ] Locate CocoIndex source-of-truth (vendor vs installed)
- [ ] Confirm reindex strategy (full vs incremental migration)
- [ ] Read `.cocoindex_code/settings.yml`
- [ ] Read `cocoindex_code/indexer.py`, `query.py`, `project.py`, `server.py`

### Phase 2: Implementation
- [ ] Settings: exclude `.gemini/specs`, `.codex/specs`, `.claude/specs`, `.agents/specs`
- [ ] Indexer: add source_realpath + content_hash + path_class fields
- [ ] Add path_class classifier function
- [ ] Query: implement over-fetch (limit*4)
- [ ] Query: implement dedup grouping
- [ ] Query: implement bounded rerank (+0.05 implementation / -0.05 spec_research,docs)
- [ ] Query: surface dedupedAliases, uniqueResultCount, rankingSignals
- [ ] project.py + server.py: pass-through

### Phase 3: Verify + reindex
- [ ] Reindex (`ccc reindex` or equivalent)
- [ ] Run pytest if available
- [ ] Manual probe: `ccc search "semantic search vector embedding implementation" --limit 10` -> verify dedup
- [ ] Manual probe: `ccc search "code graph traversal callers query" --limit 10` -> verify implementation in top 3
- [ ] Update implementation-summary.md
- [ ] Commit + push
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | path_class classifier | pytest |
| Unit | dedup grouping logic | pytest |
| Manual | end-to-end probe | ccc search |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| CocoIndex source location | External | Yellow | Must resolve before patching |
| Reindex capacity | Internal | Green | Required for verification |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Reindex fails or query layer regresses.
- **Procedure**: Revert settings.yml, revert source patches, restore prior index from backup if available.
<!-- /ANCHOR:rollback -->
