# Implementation Plan: Codex Memory System Alignment

Implementation plan covering remediation of confirmed issues after verifying 036 analysis findings.

---

## 1. OBJECTIVE

### Metadata
- **Category**: Plan
- **Tags**: codex-memory, spec-kit, documentation
- **Priority**: P1-high (blocks future automation)
- **Branch**: `038-post-merge-refinement-3`
- **Date**: 2025-12-25
- **Spec**: `../036-post-merge-refinement/analysis_findings.md` (verified)

### Summary
Verified every claim in `analysis_findings.md` and narrowed remediation scope to the issues that reproduced:
- Path traversal guard uses `startsWith` (needs `path.relative`)
- Documentation still mixes shorthand `memory_*` names and outdated tool counts
- Duplicate helper modules (`embeddings.js`, `retry-manager.js`, `trigger-extractor.js`) live in both `scripts/lib/` and `mcp_server/lib/`
- `README.md` and other docs still cite the removed `memory_load` tool
- `memory/checkpoint.md` still describes restore as destructive-by-default

### Technical Context
- **Language**: Node 20 (MCP server) + Bash scripts + Markdown docs
- **Dependencies**: Nominal (sqlite-vec, huggingface embedder); no new deps required
- **Storage**: `.opencode/skill/system-spec-kit/database/context-index.sqlite`
- **Testing**: Existing `test-validation.sh` + lint (eslint/prettier) where touched
- **Project Type**: Monorepo-style Webflow tooling repo
- **Constraints**: Preserve MCP tool schemas; avoid downtime for semantic memory; doc changes must keep Gate text consistent
- **Scale**: Affects all agents using SpecKit + semantic memory

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement verified by re-reading each finding
- [x] Impacted paths enumerated (`context-server.js`, `README.md`, `.opencode/command/**`, `scripts/lib/**`)
- [x] Risks captured (security regression, doc drift)
- [x] Success criteria defined (see DoD)

### Definition of Done
- [ ] All path validation tests enforce `path.relative`
- [ ] Docs contain only `semantic_memory_*` tool names + 13-tool count
- [ ] Single source of truth for helper modules, with import refactors complete
- [ ] README + commands contain no actionable references to `memory_load`
- [ ] `memory/checkpoint.md` matches actual restore semantics
- [ ] Lint/tests run for touched areas

### Rollback Guardrails
- **Stop Signals**: New validation stops indexing or breaks `/memory:save`
- **Recovery**: Revert offending change; re-run `test-validation.sh`; redeploy MCP server

### Constitution Check
| Violation | Why Needed | Alternative Rejected |
|-----------|------------|----------------------|
| Path validation refactor | Eliminates CWE-22 exposure | Leaving startsWith guard |

---

## 3. PROJECT STRUCTURE

### Architecture Overview
SpecKit + semantic memory share a single MCP server. Fixes stay within:
- `.opencode/skill/system-spec-kit/mcp_server/**`
- `.opencode/skill/system-spec-kit/scripts/**`
- `.opencode/command/{memory,spec_kit}/**`
- Root `README.md`

Documentation structure already conforms to Option 1 (single project). No build changes required.

---

## 4. IMPLEMENTATION PHASES

### Phase 0 – Verification & Scope Freeze (COMPLETE)
- Read `analysis_findings.md`
- Confirmed actual issues vs false positives
- Logged evidence per finding

### Phase 1 – Security & Server Hygiene
- Replace `startsWith` guard with `path.relative` in `context-server.js`
- Ensure allowed base paths include only repo-root + explicit env overrides
- Add regression test (unit or integration) for traversal attempts

### Phase 2 – Documentation Alignment
- Update `SKILL.md`, `mcp_server/README.md`, and command docs to use `semantic_memory_*`
- Correct tool count (13) and remove unsupported parameters (`tier` from `memory_list`)
- Remove `memory_load` references from active docs (keep history in z_archive only)

### Phase 3 – Library Consolidation
- Move shared helpers from `scripts/lib/` into `mcp_server/lib/` (or vice versa)
- Update import paths in `generate-context.js`, validation scripts, and MCP server
- Delete redundant copies once consumers compile

### Phase 4 – Command Accuracy
- Rewrite `memory/checkpoint.md` restore section to match actual MCP behavior (`clearExisting` default, scoped vs global)
- Add explicit callouts for `includeContent` vs legacy `memory_load`

### Phase 5 – Verification & Handoff
- Run `test-validation.sh` + targeted MCP server tests
- Update checklist evidence + memory save if user requests
- Prepare follow-up spec if new issues discovered

---

## 5. RISKS & MITIGATIONS
- **Security regression**: Add unit tests + manual attempts with crafted paths
- **Doc drift**: Keep single source (mcp_server/README) and link other docs to it
- **Script refactor fallout**: Stage duplicate removal, run generate-context smoke test
- **Missing references**: grep entire repo for `memory_load` and `memory_search(` without namespace before claiming done

---

## 6. SUCCESS METRICS
- `rg "memory_load"` limited to historical z_archive only
- `rg "memory_search()" SKILL.md` returns zero shorthand instances
- `test-validation.sh` passes on spec folder 038
- Duplicate helper modules removed (only one copy of embeddings/retry-manager/trigger-extractor)
- README describes correct MCP tool count and usage
