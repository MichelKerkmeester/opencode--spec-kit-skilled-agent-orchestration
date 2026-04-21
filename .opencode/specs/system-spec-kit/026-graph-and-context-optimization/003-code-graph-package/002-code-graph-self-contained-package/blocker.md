---
title: "Blocker: 028 — Git Index Sandbox"
description: "Documents the sandbox git-index blocker encountered during Phase 028 code-graph package migration."
importance_tier: "high"
contextType: "implementation"
---

# Blocker: Git Index Sandbox

## Status

Migration completed in the filesystem and verification passed, but staging and committing are blocked in this runtime because git cannot create `.git/index.lock`.

## Blocked operation

Attempted command:

```bash
git mv mcp_server/lib/code-graph/* mcp_server/code-graph/lib/
git mv mcp_server/handlers/code-graph/* mcp_server/code-graph/handlers/
git mv mcp_server/tools/code-graph-tools.ts mcp_server/code-graph/tools/code-graph-tools.ts
git mv mcp_server/tests/code-graph-*.vitest.ts mcp_server/code-graph/tests/
```

Observed error:

```text
fatal: Unable to create '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.git/index.lock': Operation not permitted
```

## Workaround used

The same 34 files were moved with plain filesystem `mv` so implementation and tests could proceed. Because the git index is unavailable, the new package currently appears as untracked files plus deletions of the old paths until the orchestrator stages the rename set.

## Verification completed

- Code-graph baseline before migration: `/tmp/028-baseline.log` => 7 files / 52 tests.
- Code-graph after migration: `/tmp/028-after-codegraph.log` => 7 files / 52 tests.
- `npm run typecheck`: `/tmp/028-typecheck.log` => exit 0.
- `npm run build`: `/tmp/028-build.log` => exit 0.
- Skill-advisor regression: `/tmp/028-skill-advisor.log` => 12 files / 85 tests.
- Hook regression: `/tmp/028-hook-tests.log` => 10 files / 171 tests.
- Stale-path grep returned zero lines:

```bash
grep -rln "mcp_server/lib/code-graph\|mcp_server/handlers/code-graph\|tools/code-graph-tools" mcp_server/ scripts/ --include="*.ts"
```

## Orchestrator follow-up

Stage the filesystem rename set and commit with the exact requested message:

```text
refactor(028): migrate code-graph to self-contained mcp_server/code-graph/ package

- 17 lib + 9 handlers + 1 tool descriptor + 7 tests moved via git mv (history preserved)
- Import paths updated across hooks/, tests/, tools/, schemas/
- Dispatcher rewired: schemas/tool-input-schemas.ts, tool-schemas.ts, tools/index.ts
- vitest.config.ts include patterns add mcp_server/code-graph/tests/**
- Zero behavior change: baseline pass count preserved
- No DB, CLI, or schema changes
- Mirrors Phase 027 skill-advisor architecture

Closes 028.

Co-Authored-By: Codex gpt-5.4 <noreply@openai.com>
```
