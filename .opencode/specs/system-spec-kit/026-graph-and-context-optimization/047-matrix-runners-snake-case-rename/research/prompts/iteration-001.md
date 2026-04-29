## Packet 047: matrix-runners-snake-case-rename — Tier C config + import + doc rename

You are cli-codex (gpt-5.5 high fast) implementing **047-matrix-runners-snake-case-rename**.

### CRITICAL: Spec folder path

The packet folder is: `specs/system-spec-kit/026-graph-and-context-optimization/047-matrix-runners-snake-case-rename/` — write ALL packet files there. Do NOT ask for the spec folder.

### Goal

Rename `.opencode/skill/system-spec-kit/mcp_server/matrix-runners/` (kebab-case) to `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/` (snake_case) to match the convention used by adjacent dirs:

| Existing dir | Convention |
|--------------|------------|
| `mcp_server/skill_advisor/` | snake_case ✓ |
| `mcp_server/code_graph/` | snake_case ✓ |
| `mcp_server/stress_test/` | snake_case ✓ |
| `mcp_server/matrix-runners/` | **kebab-case ✗ (odd one out)** |

After rename: all four are snake_case-aligned.

### Scope

This is a pure rename + reference update operation. No semantic code changes.

### Phase 1: Rename the directory

```bash
cd /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public
git mv .opencode/skill/system-spec-kit/mcp_server/matrix-runners .opencode/skill/system-spec-kit/mcp_server/matrix_runners
```

If `git mv` is blocked by sandbox `.git/index.lock` (known issue), fall back to filesystem mv + git add/rm.

### Phase 2: Update imports/references

Find and update every reference. Use:

```bash
grep -rln 'matrix-runners' .opencode/ specs/ AGENTS.md CLAUDE.md README.md \
  --include='*.ts' --include='*.tsx' --include='*.js' --include='*.cjs' --include='*.mjs' \
  --include='*.json' --include='*.jsonc' --include='*.md' --include='*.txt' \
  --include='*.yaml' --include='*.yml' \
  2>/dev/null
```

Surfaces likely affected:
- `.opencode/skill/system-spec-kit/mcp_server/matrix_runners/*.ts` — internal cross-imports between adapter files
- `.opencode/skill/system-spec-kit/mcp_server/tests/matrix-adapter-*.vitest.ts` — imports from matrix-runners
- `.opencode/skill/system-spec-kit/mcp_server/package.json` — npm scripts (`npm run hook-tests`, etc.)
- `.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts` and `vitest.stress.config.ts` — include/exclude patterns
- `.opencode/skill/system-spec-kit/mcp_server/tsconfig.json` — path aliases or include patterns (if any)
- `.opencode/skill/system-spec-kit/mcp_server/README.md` — documentation references
- `.opencode/skill/system-spec-kit/SKILL.md`, `ARCHITECTURE.md` — top-level skill docs
- Root `README.md` — was just updated in 042; check for matrix-runners refs
- `AGENTS.md` — if it references matrix-runners
- Spec docs in `specs/system-spec-kit/026-graph-and-context-optimization/036-cli-matrix-adapter-runners/` — update path refs in implementation-summary.md, plan.md, etc.
- Spec docs in `specs/system-spec-kit/026-graph-and-context-optimization/035-full-matrix-execution-validation/` and `043-hook-plugin-per-runtime-testing/` — may reference matrix-runners
- The 045/006-mcp-tool-schema-governance and 045/007-deep-loop-workflow-integrity review-reports may also cite the path

For each file: replace `matrix-runners` → `matrix_runners` literally. Use Edit/MultiEdit/sed surgically.

The `mcp_server/matrix_runners/README.md` itself is now an evergreen doc inside the renamed folder — update its content to refer to itself as `matrix_runners/` (its own folder).

### Phase 3: Verify

```bash
cd .opencode/skill/system-spec-kit/mcp_server
npm run build  # MUST pass — no broken imports
npx vitest run matrix-adapter  # all 5 smoke tests still pass
```

If any test or build fails, the imports weren't fully updated. Find remaining `matrix-runners` references and fix.

### Phase 4: Self-check

After Phase 3:

```bash
grep -rln 'matrix-runners' .opencode/ specs/ AGENTS.md CLAUDE.md README.md 2>/dev/null
```

Goal: zero remaining references to `matrix-runners` (kebab-case). If grep returns hits, fix them.

Note: spec packet folder names (e.g., `036-cli-matrix-adapter-runners/`) keep their kebab-case slug — that's the spec folder convention, separate from runtime code dir convention. Do NOT rename the packet folder. Only the runtime code dir at `mcp_server/matrix-runners` and its references should change.

### Packet structure to create (Level 2)

7-file structure under this packet folder.

PLUS: `rename-log.md` at packet root listing all files updated + total references replaced.

**Deps**: `manual.depends_on=["system-spec-kit/026-graph-and-context-optimization/036-cli-matrix-adapter-runners","system-spec-kit/026-graph-and-context-optimization/046-release-readiness-synthesis-and-remediation"]`.

**Trigger phrases**: `["047-matrix-runners-snake-case-rename","matrix_runners rename","kebab-to-snake convention","mcp_server folder convention"]`.

**Causal summary**: `"Renames mcp_server/matrix-runners (kebab-case) to mcp_server/matrix_runners (snake_case) to match adjacent dir convention. Updates all imports + npm scripts + vitest config + tsconfig + README + skill/runtime docs. Pure rename; no semantic code changes."`.

**Frontmatter**: compact `recent_action` / `next_safe_action` rules. < 80 chars.

### Constraints

- This is a pure rename — DO NOT change any code semantics.
- Keep changes surgical: only path refs change; no logic.
- Build MUST pass; vitest smoke tests MUST pass.
- Strict validator MUST exit 0 on this packet.
- Honor evergreen-doc rule (no packet IDs in any new/edited evergreen content).
- DO NOT commit; orchestrator commits.

When done, last action: strict validator + build + tests passing + zero remaining `matrix-runners` references in repo. No narration; just write files and exit.
