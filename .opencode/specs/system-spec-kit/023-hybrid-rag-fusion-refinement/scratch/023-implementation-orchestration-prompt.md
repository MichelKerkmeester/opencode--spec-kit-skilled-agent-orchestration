# 023 ESM Module Compliance — Implementation Orchestration Prompt

> **Target**: Claude Opus agent running `/spec_kit:implement` across all 4 phases
> **Branch**: `system-speckit/023-esm-module-compliance` (already created)
> **Agent Pool**: Up to 5 GPT-5.4 xhigh + 5 GPT-5.4 high via `codex exec`
> **Concurrency Model**: Phase-sequential, task-parallel with file-scope locking

---

## Your Role

You are the **conductor**. You orchestrate the full ESM migration for spec `023-hybrid-rag-fusion-refinement` by running `/spec_kit:implement` on each phase folder in order, delegating parallelizable work to GPT-5.4 agents via `codex exec`, and integrating their output.

You MUST:
- Work on branch `system-speckit/023-esm-module-compliance` (already exists — checkout, do not create)
- Execute phases **strictly sequentially**: 001 -> 002 -> 003 -> 004
- Within each phase, delegate parallelizable tasks to codex agents
- Prevent file conflicts by assigning **exclusive file scopes** per agent
- Verify each phase's handoff criteria before starting the next
- Commit after each completed phase with a conventional commit

---

## Branch Setup

```bash
git checkout system-speckit/023-esm-module-compliance
git pull origin system-speckit/023-esm-module-compliance 2>/dev/null || true
```

---

## Agent Pool — Delegation Rules

### Tiers

| Tier | Count | Model | Reasoning | Use For |
|------|-------|-------|-----------|---------|
| **xhigh** | Up to 5 | `gpt-5.4` | `xhigh` | Complex multi-file tasks: bulk import rewrites, CJS global cleanup, interop helper creation, test rewrites |
| **high** | Up to 5 | `gpt-5.4` | `high` | Simpler single-concern tasks: config changes, single-file edits, verification runs, audits |

### Invocation Pattern

```bash
# xhigh agent (complex tasks)
codex exec -p speckit -c model_reasoning_effort="xhigh" \
  -s workspace-write -m gpt-5.4 \
  "@path/to/file1.ts @path/to/file2.ts <task description>"

# high agent (simpler tasks)
codex exec -p speckit -c model_reasoning_effort="high" \
  -s workspace-write -m gpt-5.4 \
  "@path/to/file.ts <task description>"

# read-only verification agent
codex exec -p review -c model_reasoning_effort="high" \
  -s read-only -m gpt-5.4 \
  "<verification task>"
```

### Concurrency Safety Rules

**CRITICAL — these rules prevent agent conflicts:**

1. **Exclusive File Scope**: Each concurrent agent gets an explicit, non-overlapping set of files. NEVER assign the same file to two agents running simultaneously.

2. **Directory Partitioning**: When parallelizing across a package, split by directory:
   - Agent A: `mcp_server/lib/search/**`
   - Agent B: `mcp_server/lib/scoring/**`
   - Agent C: `mcp_server/handlers/**`
   - NEVER: two agents touching `mcp_server/lib/search/` at the same time

3. **Dependency-Aware Ordering**: If file A imports from file B, and both need changes, assign them to the **same agent** or run them sequentially (B first, then A).

4. **Shared Entry Points Are Single-Agent**: Files that many others import (barrel exports, type definitions, shared utilities) must be edited by **one agent only**, and that agent must finish before agents touching dependent files start.

5. **Max Concurrent Agents**: Never exceed **5 agents running simultaneously**. Stagger launches if needed.

6. **Verify-Before-Next**: After each batch of parallel agents completes, run a build check before launching the next batch:
   ```bash
   npm run build --workspace=@spec-kit/shared 2>&1 | tail -20
   # or
   npm run build --workspace=@spec-kit/mcp-server 2>&1 | tail -20
   ```

---

## Phase Execution Plan

### Phase 1: `001-shared-esm-migration`

**Spec folder**: `specs/system-spec-kit/023-hybrid-rag-fusion-refinement/001-shared-esm-migration/`
**Run**: `/spec_kit:implement` on this phase folder
**Package scope**: `.opencode/skill/system-spec-kit/shared/`

#### Parallelization Strategy

`shared` is small (~54 imports). Limited parallelism — 2-3 agents max.

| Batch | Agent Tier | File Scope | Task |
|-------|-----------|------------|------|
| 1 (sequential) | high | `shared/package.json`, `shared/tsconfig.json` | T001-T004: Update metadata and compiler settings |
| 2 (parallel) | xhigh | `shared/**/*.ts` (no `src/` dir — source at package root; split by subdirectory if >20 files) | T005-T006: Rewrite all relative imports/exports to `.js` specifiers |
| 3 (sequential) | YOU | Build verification | T007-T008: `npm run build --workspace=@spec-kit/shared`, inspect dist output |

#### Handoff Gate (must pass before Phase 2)
```bash
npm run build --workspace=@spec-kit/shared
# Verify: shared/dist/*.js contains import/export, not require/exports
grep -r "require(" .opencode/skill/system-spec-kit/shared/dist/ | grep -v node_modules | wc -l
# Expected: 0
```

#### Commit
```
feat(shared): migrate @spec-kit/shared to native ESM (Phase 1/4)
```

---

### Phase 2: `002-mcp-server-esm-migration`

**Spec folder**: `specs/system-spec-kit/023-hybrid-rag-fusion-refinement/002-mcp-server-esm-migration/`
**Run**: `/spec_kit:implement` on this phase folder
**Package scope**: `.opencode/skill/system-spec-kit/mcp_server/`

#### Parallelization Strategy

This is the **largest phase** (839 relative import/exports across 253 source files, 16 CJS global sites). Use all 10 agents across 4 batches.

| Batch | Agents | Tier | File Scope | Task |
|-------|--------|------|------------|------|
| 1 | 1 | high | `mcp_server/package.json`, `mcp_server/tsconfig.json` | T001-T004: Metadata + compiler settings |
| 2 | 5 (parallel) | xhigh | Split `mcp_server/` by directory — see below | T005-T007: Import specifier rewrites + cross-package cleanup |
| 3 | 4 (parallel) | high | Split by CJS-global file groups | T008-T011: Replace `__dirname`, `__filename`, `require()` |
| 4 | 1 | YOU | Build + runtime smoke | T012-T014: Build, `node dist/context-server.js`, inspect dist |

**Batch 2 Directory Split (5 xhigh agents):**

Note: `mcp_server/` has 253 source files across many subdirectories. All must be covered.

| Agent | Exclusive Scope | Approx Files |
|-------|----------------|--------------|
| A | `mcp_server/lib/search/**/*.ts` | ~70 files |
| B | `mcp_server/lib/scoring/**/*.ts`, `mcp_server/lib/feedback/**/*.ts`, `mcp_server/lib/eval/**/*.ts`, `mcp_server/lib/cognitive/**/*.ts` | ~37 files |
| C | `mcp_server/lib/storage/**/*.ts`, `mcp_server/lib/parsing/**/*.ts`, `mcp_server/lib/response/**/*.ts`, `mcp_server/lib/session/**/*.ts`, `mcp_server/lib/graph/**/*.ts`, `mcp_server/lib/cache/**/*.ts`, `mcp_server/lib/chunking/**/*.ts`, `mcp_server/lib/learning/**/*.ts`, `mcp_server/lib/providers/**/*.ts`, `mcp_server/lib/validation/**/*.ts`, `mcp_server/lib/ops/**/*.ts`, `mcp_server/lib/*.ts` (root lib files) | ~40 files |
| D | `mcp_server/handlers/**/*.ts`, `mcp_server/hooks/**/*.ts`, `mcp_server/formatters/**/*.ts` | ~50 files |
| E | `mcp_server/tools/**/*.ts`, `mcp_server/api/**/*.ts`, `mcp_server/core/**/*.ts`, `mcp_server/schemas/**/*.ts`, `mcp_server/scripts/**/*.ts`, `mcp_server/lib/errors/**/*.ts`, `mcp_server/lib/config/**/*.ts`, `mcp_server/lib/extraction/**/*.ts`, `mcp_server/lib/telemetry/**/*.ts`, `mcp_server/lib/utils/**/*.ts`, `mcp_server/lib/governance/**/*.ts`, `mcp_server/lib/collab/**/*.ts`, `mcp_server/lib/interfaces/**/*.ts`, `mcp_server/lib/architecture/**/*.ts`, `mcp_server/context-server.ts`, `mcp_server/cli.ts`, `mcp_server/startup-checks.ts` | ~56 files |

**IMPORTANT**: Before Batch 2, identify barrel/index files (e.g., `handlers/index.ts`, `lib/search/index.ts`) that re-export from multiple subdirectories. These are **shared entry points** — assign each to the agent that owns that directory, and ensure dependent agents run AFTER.

**Batch 3 CJS Global Split (4 high agents):**

The 16 files with CJS globals are:
`cli.ts`, `core/config.ts`, `handlers/index.ts`, `handlers/memory-crud-health.ts`, `handlers/shared-memory.ts`, `handlers/v-rule-bridge.ts`, `lib/cognitive/archival-manager.ts`, `lib/cognitive/tier-classifier.ts`, `lib/errors/core.ts`, `lib/eval/eval-db.ts`, `lib/ops/file-watcher.ts`, `lib/scoring/composite-scoring.ts`, `lib/search/vector-index-store.ts`, `scripts/map-ground-truth-ids.ts`, `scripts/reindex-embeddings.ts`, `startup-checks.ts`

Split these across 4 agents by directory, maintaining the same exclusive scopes from Batch 2.

#### Handoff Gate (must pass before Phase 3)
```bash
npm run build --workspace=@spec-kit/mcp-server
node .opencode/skill/system-spec-kit/mcp_server/dist/context-server.js &
SERVER_PID=$!; sleep 2; kill $SERVER_PID 2>/dev/null
# Expected: server starts without "ERR_REQUIRE_ESM" or "ERR_MODULE_NOT_FOUND"
```

#### Commit
```
feat(mcp-server): migrate @spec-kit/mcp-server to native ESM (Phase 2/4)
```

---

### Phase 3: `003-scripts-interop-refactor`

**Spec folder**: `specs/system-spec-kit/023-hybrid-rag-fusion-refinement/003-scripts-interop-refactor/`
**Run**: `/spec_kit:implement` on this phase folder
**Package scope**: `.opencode/skill/system-spec-kit/scripts/`

#### Parallelization Strategy

Medium scope (20 consumer files), but the interop helper must be created FIRST. 3 batches.

| Batch | Agents | Tier | File Scope | Task |
|-------|--------|------|------------|------|
| 1 | 1 | xhigh | `scripts/lib/esm-interop.ts` (new file) | T001-T002: Create interop helper with typed `import()` wrappers |
| 2 | 4 (parallel) | xhigh+high mix | Split scripts consumers by directory | T003-T006: Refactor all `require()` -> interop helper calls |
| 3 | 1 | xhigh | `scripts/core/workflow.ts` | T012 [P0]: Decouple workflow.ts from direct mcp-server runtime imports (use script-local adapters) |
| 4 | 3 (parallel) | xhigh+high mix | Memory save hardening files | T013-T017: V8 descendant detection, manual-fallback mode, evidence parser, related_specs, JSON v2 schema |
| 5a | 3 (parallel) | high | Split test files | T008-T011: Rewrite module-sensitive tests |
| 5b | 1 | YOU | Runtime verification | T018-T021: `generate-context.js --help`, test suite, Vitest, memory save e2e |

**Batch 2 Consumer Split:**

First, audit which scripts files consume ESM siblings:
```bash
grep -rn "require.*@spec-kit/shared\|require.*@spec-kit/mcp-server" \
  .opencode/skill/system-spec-kit/scripts/ --include="*.ts"
```

Split the results into 4 non-overlapping groups by directory. Assign 2 xhigh agents for complex files (workflow.ts, generate-context.ts) and 2 high agents for simpler consumer files.

**DUAL-BUILD DECISION GATE**: After Batch 2, evaluate: if >50% of files needed deep restructuring beyond simple `require()` -> `import()` swaps, STOP and document the escalation. Per parent research, dual-build becomes the fallback. Report to the user before proceeding.

**Batch 4 Memory Save Hardening Split (3 agents):**

| Agent | Tier | File Scope | Task |
|-------|------|------------|------|
| F | xhigh | `scripts/lib/validate-memory-quality.ts` | T013: V8 descendant phase detection + T016: related_specs allowlist |
| G | xhigh | `shared/parsing/memory-sufficiency.ts`, `mcp_server/handlers/save/markdown-evidence-builder.ts` | T014-T015: manual-fallback mode + primary evidence expansion |
| H | high | `scripts/memory/generate-context.ts`, `scripts/utils/input-normalizer.ts` | T017: JSON v2 schema freeze + contract tests |

**IMPORTANT**: Batch 3 (workflow.ts decoupling) MUST complete before Batch 5b runtime verification, because `generate-context.js` depends on workflow.ts which currently imports mcp-server directly.

#### Handoff Gate (must pass before Phase 4)
```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --help
npm run test --workspace=@spec-kit/scripts
# NEW: Memory save end-to-end test
echo '{"specFolder":"023-hybrid-rag-fusion-refinement","sessionSummary":"test save"}' | node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --stdin
```

#### Commit
```
feat(scripts): add CJS-to-ESM interop + memory save hardening for @spec-kit/scripts (Phase 3/4)
```

---

### Phase 4: `004-verification-and-standards`

**Spec folder**: `specs/system-spec-kit/023-hybrid-rag-fusion-refinement/004-verification-and-standards/`
**Run**: `/spec_kit:implement` on this phase folder
**Scope**: Verification + standards docs

#### Parallelization Strategy

Mostly verification commands — high parallelism for retests, sequential for matrix and docs.

| Batch | Agents | Tier | Task |
|-------|--------|------|------|
| 1 | 5 (parallel) | high (read-only) | T001-T007: Re-test 7 highest-risk surfaces in parallel (each agent gets one surface) |
| 2 | 1 | YOU | T008-T012: Run full verification matrix commands sequentially |
| 3 | 2 (parallel) | high | T013-T014: Update standards docs (split by doc) |
| 4 | 1 | YOU | T015-T017: Update parent implementation-summary, close checklist, close packet |

**Batch 1 Retest Assignment (5 high agents, read-only + targeted test runs):**

| Agent | Surface | Verification |
|-------|---------|-------------|
| A | `memory-save.ts` | Run targeted test or smoke covering save paths |
| B | `memory-index.ts` + `vector-index-store.ts` | Run index-related tests |
| C | `shared-memory.ts` + `session-manager.ts` | Run shared-memory handler tests |
| D | `generate-context.ts` | `node scripts/dist/memory/generate-context.js --help` + integration test |
| E | `workflow.ts` | Run workflow-related tests |

#### Final Verification Matrix (YOU run these sequentially)
```bash
npm run --workspaces=false typecheck
npm run --workspaces=false test:cli
npm run build --workspace=@spec-kit/mcp-server
npm run test --workspace=@spec-kit/mcp-server
npm run test --workspace=@spec-kit/scripts
npx vitest run tests/cli.vitest.ts tests/regression-010-index-large-files.vitest.ts tests/continue-session.vitest.ts
npx vitest run tests/modularization.vitest.ts tests/trigger-config-extended.vitest.ts
npx vitest run scripts/tests/test-integration.vitest.ts scripts/tests/architecture-boundary-enforcement.vitest.ts
node .opencode/skill/system-spec-kit/mcp_server/dist/context-server.js
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js --help
```

#### Commit
```
test(spec-kit): verify ESM migration and sync standards docs (Phase 4/4)
```

---

## Error Handling

### Build Failure After Agent Batch
1. Read the full error output
2. Identify which agent's changes caused the failure (check git diff by file scope)
3. Fix the issue yourself or re-delegate to a single high agent with the error context
4. Re-run the build check before proceeding

### Agent Returns Incomplete Work
1. Check which files were changed vs. which were assigned
2. Re-delegate only the missing files to a new agent
3. Do NOT re-delegate files that were already correctly modified

### Dual-Build Escalation (Phase 3 only)
If the scripts interop refactor proves materially too invasive:
1. Document the evidence (which files, what complexity, why `import()` is insufficient)
2. Save to `specs/system-spec-kit/023-hybrid-rag-fusion-refinement/003-scripts-interop-refactor/scratch/dual-build-escalation.md`
3. STOP and report to the user — do not proceed to Phase 4 without user decision

---

## Post-Completion

After all 4 phases pass:
1. Run the full verification matrix one final time
2. Update `specs/system-spec-kit/023-hybrid-rag-fusion-refinement/implementation-summary.md` with runtime evidence
3. Mark all parent `checklist.md` items with `[x]` and `[EVIDENCE: ...]`
4. Save context to memory via `generate-context.js`
5. Report completion with verification results

---

## Key File Paths

| Item | Path |
|------|------|
| Parent spec folder | `specs/system-spec-kit/023-hybrid-rag-fusion-refinement/` |
| Phase 1 | `specs/system-spec-kit/023-hybrid-rag-fusion-refinement/001-shared-esm-migration/` |
| Phase 2 | `specs/system-spec-kit/023-hybrid-rag-fusion-refinement/002-mcp-server-esm-migration/` |
| Phase 3 | `specs/system-spec-kit/023-hybrid-rag-fusion-refinement/003-scripts-interop-refactor/` |
| Phase 4 | `specs/system-spec-kit/023-hybrid-rag-fusion-refinement/004-verification-and-standards/` |
| shared package | `.opencode/skill/system-spec-kit/shared/` |
| mcp_server package | `.opencode/skill/system-spec-kit/mcp_server/` |
| scripts package | `.opencode/skill/system-spec-kit/scripts/` |
| Research (source of truth) | `specs/system-spec-kit/023-hybrid-rag-fusion-refinement/research/research.md` |
