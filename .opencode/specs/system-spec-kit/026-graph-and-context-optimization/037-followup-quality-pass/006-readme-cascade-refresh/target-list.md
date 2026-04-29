---
title: "Target List: 037/006 README Cascade Refresh"
description: "Discovery and audit ledger for README cascade targets after packets 031-036 and 037/001-005."
trigger_phrases:
  - "037-006-readme-cascade-refresh"
  - "README cascade target list"
importance_tier: "important"
contextType: "documentation"
---
# Target List: 037/006 README Cascade Refresh

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:discovery -->
## Discovery

Commands run:

```bash
find .opencode/skill/system-spec-kit -name 'README.md' -type f
find .opencode/specs/system-spec-kit/026-graph-and-context-optimization -maxdepth 3 -name 'README.md' -type f
git --no-pager log --oneline --since='2026-04-29' -- .opencode/skill/system-spec-kit/ | head -30
find .opencode/skill/system-spec-kit/mcp_server -path '*/node_modules/*' -prune -o -path '*/.pytest_cache/*' -prune -o -name 'README.md' -type f -print
```

Discovery facts:

| Fact | Result |
|------|--------|
| Raw `system-spec-kit` README search | Includes authored docs plus vendored `node_modules` and cache READMEs |
| Active target policy | First-party authored READMEs only; `node_modules/` and `.pytest_cache/` excluded |
| Related spec READMEs under packet parent | Two scratch prompt README files found; PASS, unrelated to cascade current-state docs |
| Recent commits command | No matching output in this workspace |
| Public MCP tool count | 54 from `TOOL_DEFINITIONS.length` in `mcp_server/tool-schemas.ts` |
| MCP package version | `@spec-kit/mcp-server` v1.8.0 |
| MCP SDK dependency | `@modelcontextprotocol/sdk` ^1.24.3 |
<!-- /ANCHOR:discovery -->

---

<!-- ANCHOR:packet-context -->
## Packet Context Read

| Packet | Relevant Change |
|--------|-----------------|
| 037/001 | Audited 033/034/036 code, including memory retention sweep, advisor rebuild, Codex freshness, and matrix runner tests |
| 037/002 | Updated feature catalogs for 54 tools, retention sweep, advisor rebuild, matrix runners, and Codex freshness smoke check |
| 037/003 | Added manual playbook entries for retention sweep, advisor rebuild, matrix adapters, and code_graph evidence |
| 037/004 | Fixed README/reference structure drift and deferred raw matrix prompt-template rewrites |
| 037/005 | Moved explicit stress suites into `mcp_server/stress_test/` and added `npm run stress` |
<!-- /ANCHOR:packet-context -->

---

<!-- ANCHOR:first-party-readmes -->
## First-Party `mcp_server` README Audit

| Target | Status | Finding / Action |
|--------|--------|------------------|
| `.opencode/skill/system-spec-kit/mcp_server/README.md` | UPDATED | Tool count, Skill Advisor tools, code_graph paths, structure tree, layer matrix, version footer |
| `.opencode/skill/system-spec-kit/mcp_server/api/README.md` | PASS | No stale 031-037 surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/README.md` | UPDATED | Added `code_graph_verify`, `detect_changes`, `ccc_*`, and `code_graph/` folder name |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/README.md` | UPDATED | Added verify, detect_changes, and CCC handlers |
| `.opencode/skill/system-spec-kit/mcp_server/code_graph/lib/README.md` | PASS | File-name references are valid inside code_graph lib |
| `.opencode/skill/system-spec-kit/mcp_server/configs/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/core/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/database/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/formatters/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/README.md` | UPDATED | Added `memory-retention-sweep.ts`; corrected code_graph handler paths |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/README.md` | PASS | Current hook overview already points to canonical matrix docs |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/README.md` | UPDATED | Added `lib/freshness-smoke-check.ts` helper |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/README.md` | UPDATED | Refreshed live category/module counts and governance structure |
| `.opencode/skill/system-spec-kit/mcp_server/lib/analytics/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/architecture/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/cache/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/cache/scoring/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/chunking/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/config/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/context/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/continuity/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/contracts/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/coverage-graph/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/enrichment/README.md` | UPDATED | Fixed related-doc link to the code_graph README |
| `.opencode/skill/system-spec-kit/mcp_server/lib/errors/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/eval/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/eval/data/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/extraction/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/feedback/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/governance/README.md` | UPDATED | Added `memory-retention-sweep.ts` lifecycle helper |
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/interfaces/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/learning/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/manage/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/merge/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/ops/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/providers/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/response/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/resume/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/routing/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/session/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/spec/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/storage/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/telemetry/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/utils/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/lib/validation/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/README.md` | PASS | Current matrix adapter README already documents F1-F14 and five CLI executors |
| `.opencode/skill/system-spec-kit/mcp_server/schemas/README.md` | UPDATED | Replaced stale 29+ wording with 54-tool/57-schema registry distinction |
| `.opencode/skill/system-spec-kit/mcp_server/scripts/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/scripts/migrations/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/README.md` | UPDATED | Added `advisor-rebuild.ts` handler/API references and fixed test paths |
| `.opencode/skill/system-spec-kit/mcp_server/stress_test/README.md` | PASS | New dedicated stress README matches packet 037/005 migration |
| `.opencode/skill/system-spec-kit/mcp_server/tests/README.md` | PASS | Already points stress/load/degraded-state suites at sibling `../stress_test/` |
| `.opencode/skill/system-spec-kit/mcp_server/tests/_support/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/tests/_support/hooks/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/tests/adversarial/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/tests/fixtures/hooks/README.md` | PASS | No stale cascade surface claims found |
| `.opencode/skill/system-spec-kit/mcp_server/tools/README.md` | UPDATED | Added retention sweep dispatch note |
| `.opencode/skill/system-spec-kit/mcp_server/utils/README.md` | PASS | No stale cascade surface claims found |
<!-- /ANCHOR:first-party-readmes -->

---

<!-- ANCHOR:parent-related -->
## Parent And Related Docs

| Target | Status | Finding / Action |
|--------|--------|------------------|
| `.opencode/skill/system-spec-kit/README.md` | UPDATED | 54-tool count, catalog/playbook counts, MCP tree, related links, version footer |
| `.opencode/skill/system-spec-kit/SKILL.md` | UPDATED | `@spec-kit/mcp-server` v1.8.0, 9 layers, catalog/playbook counts, code_graph path |
| `.opencode/skill/system-spec-kit/ARCHITECTURE.md` | UPDATED | matrix_runners/stress_test notes, four Skill Advisor tools, nine Code Graph/CCC tools |
| `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | UPDATED | 54-tool claim and `skill_advisor/` links |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/INSTALL_GUIDE.md` | UPDATED | `advisor_rebuild` expectation and `skill_advisor` / `code_graph` test paths |
<!-- /ANCHOR:parent-related -->

---

<!-- ANCHOR:verification -->
## Verification Notes

| Check | Result |
|-------|--------|
| `awk` count over `TOOL_DEFINITIONS` | PASS: `54` |
| `node` package version probe | PASS: `@spec-kit/mcp-server 1.8.0`, `@modelcontextprotocol/sdk ^1.24.3` |
| Local markdown link check | PASS |
| Strict packet validator | PASS |
<!-- /ANCHOR:verification -->
