# Codex Memory Alignment Checklist

---

## 1. OBJECTIVE
- **Category**: Checklist
- **Tags**: codex-memory, spec-kit, security
- **Priority**: P1-high
- **Type**: Testing & QA
- **Created**: 2025-12-25
- **Status**: Draft

Purpose: ensure every verified issue from 036 analysis is remediated with evidence (security guard, docs, library consolidation, command accuracy).

---

## 2. LINKS
- **Plan**: ./codex-plan.md
- **Tasks**: ./codex-tasks.md
- **Source Analysis**: ../036-post-merge-refinement/analysis_findings.md (with verification notes)

---

## 3. CHECKLIST CATEGORIES

### Security & Validation
- [ ] CHK-S1 [P0] Path traversal tests fail when targeting `../` or symlink escapes (evidence: log snippet)
- [ ] CHK-S2 [P0] `test-validation.sh` passes on spec folder 038 after changes

### Documentation Accuracy
- [ ] CHK-D1 [P1] `rg "memory_search\(\)"` returns zero unnamespaced tool references outside archives
- [ ] CHK-D2 [P1] `README.md` + `.opencode/command/**` contain no actionable `memory_load` references
- [ ] CHK-D3 [P1] `mcp_server/README.md` states 13 tools and removes `tier` parameter from `memory_list`
- [ ] CHK-D4 [P1] `memory/checkpoint.md` restore section matches actual MCP behavior (clearExisting default, scoped deprecation)

### Library Consolidation
- [ ] CHK-L1 [P1] Only one copy of `embeddings.js`, `retry-manager.js`, `trigger-extractor.js` exists; imports updated
- [ ] CHK-L2 [P1] `generate-context.js` + MCP server smoke tests pass after consolidation

### Repo Hygiene
- [ ] CHK-R1 [P2] Repo-wide `rg "memory_load"` limited to `specs/**/z_archive` or historical notes
- [ ] CHK-R2 [P2] Documentation states exactly 13 MCP tools everywhere
- [ ] CHK-R3 [P2] README “How To” sections include namespaced examples only (`semantic_memory_*`)

### Completion Summary
- [ ] CHK-C1 [P0] Evidence of all CHK items captured in final memory save or PR notes

---

## 4. VERIFICATION SUMMARY (fill at completion)
- **Total Items**: 10
- **P0 Items**: CHK-S1, CHK-S2, CHK-C1
- **Verification Date**: _TBD_
