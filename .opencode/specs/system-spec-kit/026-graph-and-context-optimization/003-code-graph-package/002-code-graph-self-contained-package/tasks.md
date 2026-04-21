---
title: "Tasks: 028 — Code-Graph Self-Contained Package Migration"
description: "Ordered task ladder for code-graph self-contained package migration."
importance_tier: "high"
contextType: "implementation"
---

# Tasks: 028

| ID | Task | Priority | Est. | Evidence |
|---|---|---|---|---|
| T001 | Scaffold 028 spec folder (7 files) | P0 | — | This folder |
| T002 | Read spec.md, plan.md, tasks.md, checklist.md fully | P0 | 2m | Read |
| T003 | Baseline vitest — record counts to /tmp/028-baseline.log | P0 | 3m | Log file |
| T004 | `mkdir -p mcp_server/code-graph/{lib,handlers,tools,tests}` | P0 | 1m | ls output |
| T005 | `git mv mcp_server/lib/code-graph/* mcp_server/code-graph/lib/` (17 files) | P0 | 2m | git status |
| T006 | `git mv mcp_server/handlers/code-graph/* mcp_server/code-graph/handlers/` (9 files) | P0 | 2m | git status |
| T007 | `git mv mcp_server/tools/code-graph-tools.ts mcp_server/code-graph/tools/` | P0 | 1m | git status |
| T008 | `git mv mcp_server/tests/code-graph-*.vitest.ts mcp_server/code-graph/tests/` (7 files) | P0 | 2m | git status |
| T009 | Delete empty old dirs: `rmdir mcp_server/lib/code-graph mcp_server/handlers/code-graph` | P0 | 1m | ls returns not-found |
| T010 | Grep audit + update stale imports across mcp_server/, scripts/, hooks/ (batch edit) | P0 | 15m | Grep returns 0 lines |
| T011 | Update `mcp_server/schemas/tool-input-schemas.ts` (codeGraph import path) | P0 | 2m | File diff |
| T012 | Update `mcp_server/tool-schemas.ts` (codeGraphTools import) | P0 | 2m | File diff |
| T013 | Update `mcp_server/tools/index.ts` (codeGraphTools import + export) | P0 | 2m | File diff |
| T014 | Update `mcp_server/vitest.config.ts` include patterns for `mcp_server/code-graph/tests/**` | P0 | 1m | File diff |
| T015 | AC-1 Verify: `find mcp_server/code-graph -type f \| wc -l` ≥ 33 | P0 | 1m | Count |
| T016 | AC-2 Verify: old dirs empty/removed | P0 | 1m | find output |
| T017 | AC-3 Verify: grep audit returns 0 stale-path lines | P0 | 1m | Grep |
| T018 | AC-4 Verify: all 7 code-graph tests pass with baseline count | P0 | 3m | Test log |
| T019 | AC-5 Verify: `npm run typecheck` exit 0 | P0 | 2m | Exit code |
| T020 | AC-6 Verify: `npm run build` exit 0 | P0 | 2m | Exit code |
| T021 | AC-7 Verify: `git log --follow` on a moved file shows pre-move history | P0 | 1m | git log output |
| T022 | AC-8 Verify (regression): skill-advisor suite still 96 green, hooks still pass | P0 | 3m | Test log |
| T023 | Mark all checklist.md P0/P1 items [x] with evidence | P0 | 3m | checklist.md |
| T024 | Fill implementation-summary.md (real summary: file counts, test diff, git log excerpt) | P0 | 3m | Summary |
| T025 | Commit with `refactor(028): migrate code-graph to self-contained package` | P0 | 1m | git log |
| T026 | Push (orchestrator does this; codex leaves uncommitted if sandbox blocks `.git/index.lock`) | P0 | 1m | Remote updated |

**Total est.:** 30-60 min for cli-codex gpt-5.4 high fast.

## Dispatch prompt for cli-codex

```
Implement Phase 028 per spec + tasks at .opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/002-code-graph-self-contained-package/

Scope: pure behavior-preserving migration of code-graph into self-contained mcp_server/code-graph/ package.
- 17 files from mcp_server/lib/code-graph/ → mcp_server/code-graph/lib/ (git mv)
- 9 files from mcp_server/handlers/code-graph/ → mcp_server/code-graph/handlers/
- 1 file from mcp_server/tools/code-graph-tools.ts → mcp_server/code-graph/tools/
- 7 test files from mcp_server/tests/code-graph-*.vitest.ts → mcp_server/code-graph/tests/
- Update all import paths, dispatcher registrations, vitest.config include patterns
- Delete empty old directories
- No behavior change: baseline test count preserved; typecheck + build green

Follow tasks.md T001-T026 in order. Parallel tool calls allowed for grep audits + parallel edits on independent files. On commit-sandbox block, leave uncommitted + write blocker.md.
```
