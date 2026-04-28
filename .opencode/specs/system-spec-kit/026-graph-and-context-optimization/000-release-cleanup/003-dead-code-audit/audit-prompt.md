# Dead-Code & Disconnected-Code Audit — Execution Prompt

You are executing the audit defined by:
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-dead-code-audit/spec.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-dead-code-audit/plan.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-dead-code-audit/tasks.md`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/003-dead-code-audit/checklist.md`

**READ THESE FOUR FILES IN FULL FIRST.** They define your scope, requirements, success criteria, methodology, and quality gates.

## Audit target

`.opencode/skill/system-spec-kit/` recursively, focus `mcp_server/`. Hard scope guard: every audited path starts with `.opencode/skill/system-spec-kit/`.

## Deliverables (write these)

1. **`audit-state.jsonl`** at the packet root — append-only JSONL of intermediate alive-graph + candidate sets per phase. Use to resume + reproduce.

2. **`dead-code-audit-report.md`** at the packet root — the canonical report. Required sections:
   - Executive summary (1-2 paragraphs + counts table)
   - Reachability anchor enumeration (all 6 anchor types per REQ-004)
   - 4 category sections: `dead`, `disconnected`, `dynamic-only-reference`, `false-positive`
   - Per-finding: file:line, evidence (1-3 sentences), recommended action (delete/wire-in/keep-with-rationale), safety ranking (high-confidence-delete/needs-investigation/keep)
   - Per-directory summary table (≥7 dirs per SC-007)
   - Tooling + replication appendix (commands run + tool versions)

3. **Update `implementation-summary.md`** at the packet root — fill in §What Was Built / §How Delivered / §Verification with actual audit stats.

## Audit methodology (per plan.md)

### Phase 1 — Setup
- Run `npx ts-prune --version` (fall back to `npx knip --version` if ts-prune unavailable). `tsc --version`. `rg --version`. Capture for tooling appendix.

### Phase 2 — Build the alive graph (REQ-004)
Cite findings into `audit-state.jsonl` as you go. Anchors to walk:

1. **MCP tool registrations**: read `mcp_server/tools/index.ts` and `mcp_server/context-server.ts`. List every (tool_name, handler_path) pair.
2. **CLI scripts**: enumerate `.opencode/skill/system-spec-kit/scripts/**/*.{ts,cjs,js,sh}`. Cross-reference against `package.json` scripts AND any references in `.opencode/agent/`, `.opencode/command/spec_kit/`.
3. **Hook registries**: walk `mcp_server/hooks/`. Identify the loader pattern (static import or directory glob/readdir). If it's glob, all `hooks/**/*.ts` files are reachable; if static, only the imported ones.
4. **Agent/command markdown references**: `rg -lF` symbol/path patterns across `.opencode/agent/`, `.opencode/command/spec_kit/`, `.claude/agents/`, `.codex/agents/`, `.gemini/agents/` to catch by-name string references.
5. **API barrel exports**: read `mcp_server/api/*.ts` if present. List public-surface exports.
6. **Test imports**: walk `mcp_server/tests/**/*.vitest.ts`. Extract every imported path. Tested files are alive.

Persist alive-set as records in `audit-state.jsonl`:
```jsonl
{"type":"alive_anchor","anchor":"mcp_tool","tool_name":"memory_search","handler_path":"handlers/memory-search.ts"}
{"type":"alive_anchor","anchor":"cli_script","path":"scripts/dist/memory/generate-context.js","invoker":"command/memory/save.md"}
...
```

### Phase 3 — Candidate detection
- **T201**: `cd .opencode/skill/system-spec-kit/mcp_server && npx ts-prune` — capture full stdout to a scratch file (e.g., `/tmp/ts-prune-output.txt`); count + summarize.
- **T202**: `cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit` — sanity check (any pre-existing failures noted in tooling appendix).
- **T203**: orphan files. For each `.ts`/`.js`/`.py`/`.sh` under `.opencode/skill/system-spec-kit/`, grep its basename + path against the entire audit tree. Files with zero referrers are candidates.
- **T204**: dead types. Optional/expensive — sample-check with `tsc --noEmit --noUnusedLocals --noUnusedParameters` if it doesn't produce too much noise; otherwise grep declared `type X` / `interface Y` names against codebase.
- **T205**: stale `dist/`. For each file under `scripts/dist/`, confirm a paired source file exists (`.ts` for `.js`, etc.).
- **T206**: stale tests. For each `*.vitest.ts`, attempt to resolve every imported path. Flag tests with broken imports.

### Phase 4 — Classify + recommend (per plan.md decision tree)

For each candidate:
1. Is it in the alive set? → `false-positive`
2. Is there a dynamic-load pattern referencing it (template-string `import()`, `require(varname)`, `child_process.spawn` reading by path, hook directory glob)? → `dynamic-only-reference`, `needs-investigation`
3. Does the file shape suggest "meant to be wired" (handler/tool/hook with proper exports + shape but not registered)? → `disconnected`
4. Otherwise → `dead`, `high-confidence-delete`

Per finding: write recommended action (`delete` / `wire-in` / `keep-with-rationale`) + safety ranking.

### Phase 5 — Write report
Produce `dead-code-audit-report.md` with the structured sections. Use markdown tables for per-finding details and per-directory summary. Cite tool versions in the appendix.

### Phase 6 — Verify
- Sample-verify ≥10 random findings: cite file:line, then verify with `sed -n 'NUMp' file` or `rg -n 'symbol' file` that the line/symbol exists.
- For 5 random `dead` findings, run `rg -nF '<symbol-or-basename>' .opencode/` and confirm zero hits outside the file itself.
- Update `implementation-summary.md` with audit stats.

## Discipline

- **No fabrication.** Every finding cites verifiable file:line.
- **Hard scope**: paths must start with `.opencode/skill/system-spec-kit/`.
- **Dynamic-load defensiveness**: any candidate with template-string imports, runtime path construction, `spawn`/`exec`-ed paths, or directory-glob loaders → `needs-investigation`. Never `high-confidence-delete`.
- **Markdown-driven discoverability**: ALWAYS grep cross-runtime markdown (`.opencode/agent/`, `.opencode/command/`, `.claude/agents/`, `.codex/agents/`, `.gemini/agents/`) for symbol/path references. Live code referenced only by markdown is alive.
- **Audit-only**: do NOT delete any code. The report's recommendations are advisory; deletions land in a future packet.
- **Stay under tool budget**: aim for ~30-50 tool calls total; if approaching 60, narrow scope and document remaining gaps in the report's "Limitations" section.

## BEGIN NOW

Read the 4 packet files. Execute Phase 1 → Phase 6. Write the deliverables. Do not ask for clarification — the brief is complete.
