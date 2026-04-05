# Tasks: Codex Memory Alignment

---

## 1. OBJECTIVE

### Metadata
- **Category**: Tasks
- **Tags**: codex-memory, spec-kit, documentation
- **Priority**: P1-high

### Organization
Tasks grouped by remediation theme. Parallelizable items are tagged `[P]` when independent.

---

## 2. TASK LIST

### Theme A — Security Guardrails
- [ ] TASK-001: Refactor `validateFilePath` in `context-server.js` to use `path.relative` containment checks.
  - **Acceptance**: Unit tests prove traversal attempts outside repo throw errors
  - **Verification**: New test cases + manual call prove rejection
- [ ] TASK-002 [P]: Extend regression coverage (unit or integration) to cover symbolic links + ../ injection attempts.
  - **Verification**: Test script log attached to checklist

### Theme B — Documentation Accuracy
- [ ] TASK-003: Update SKILL.md + command docs to reference `semantic_memory_*` names exclusively (no `memory_search()` shorthand).
  - **Scope**: `.opencode/skill/system-spec-kit/SKILL.md`, `.opencode/command/spec_kit/**/*.md`, `.opencode/command/memory/*.md`
- [ ] TASK-004 [P]: Replace all active references to `memory_load` with guidance on `includeContent`; ensure root `README.md` matches.
- [ ] TASK-005 [P]: Fix `mcp_server/README.md` (13 tools, remove `tier` parameter), and sync other references (INSTALL_GUIDE, README).
- [ ] TASK-006: Correct `memory/checkpoint.md` language describing restore defaults (`clearExisting=false` preserves data) and add warning about embeddings needing regeneration.

### Theme C — Library Consolidation
- [ ] TASK-007: Determine canonical location for shared helpers (`embeddings.js`, `retry-manager.js`, `trigger-extractor.js`) and deduplicate.
  - **Acceptance**: Only one copy remains; imports updated; `generate-context.js` + MCP server run

### Theme D — Verification & Cleanup
- [ ] TASK-008: Repo-wide `rg` scans confirm: (a) `memory_load` limited to archives, (b) `memory_search()` shorthand removed, (c) `memory_list` doc matches schema.
- [ ] TASK-009 [P]: Run `test-validation.sh` + targeted MCP smoke tests after changes; capture output in checklist evidence.

---

## 3. DEPENDENCIES
- TASK-001 must precede TASK-002 (tests rely on final API)
- TASK-003 should complete before TASK-004/005 to avoid conflicting edits in same docs
- TASK-007 requires consensus from Phase 1 due to wide impact

---

## 4. COMPLETION CRITERIA
- All tasks checked with evidence in checklist
- `rg "memory_search()"` returns zero results outside archives
- Duplicate modules removed and lint/tests clean
- README + command docs reflect actual tool behavior
