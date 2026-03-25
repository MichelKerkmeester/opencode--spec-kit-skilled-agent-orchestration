# Deep Review Strategy: Agent Content Alignment

## Scope

Review 10 agent definitions across 5 runtimes for content alignment with 022-hybrid-rag-fusion changes.

### Agents Under Review
@context, @orchestrate, @speckit, @deep-review, @deep-research, @handover, @review, @debug, @ultra-think, @write

### Runtimes
- Base: `.opencode/agent/*.md`
- ChatGPT: `.opencode/agent/chatgpt/*.md`
- Claude: `.claude/agents/*.md`
- Codex: `.codex/agents/*.toml`
- Gemini: `.agents/agents/*.md`

## Reference Brief: 022-hybrid-rag-fusion Key Changes

Agents should align with these completed changes:

### 1. Memory Surface (011-skill-alignment, 012-command-alignment)
- **33 MCP tools** in Spec Kit Memory (source: `tool-schemas.ts`)
- **6 memory commands**: `/memory:save`, `/memory:continue`, `/memory:analyze`, `/memory:manage`, `/memory:learn`, `/memory:shared`
- `/memory:analyze` owns retrieval, `memory_quick_search`, analysis/eval tooling, `memory_get_learning_history`
- `/memory:manage ingest` owns async ingest workflows

### 2. Constitutional Memory (003-constitutional-learn-refactor)
- `/memory:learn` rewritten from generic learning capture to **constitutional memory manager**
- 5 subcommands: `list`, `edit`, `remove`, `budget`, default create flow
- Constitutional-tier constraints: always-surface behavior, ~2000 token budget
- Stale wording fixed in: command README, `debug.md`, `complete.md`, `README.md`, `speckit.md` agents

### 3. Indexing & Normalization (002-indexing-normalization)
- Canonical-path-aware deduplication before indexing
- Deterministic tier resolution (metadata > inline > defaults)
- Frontmatter normalization with `backfill-frontmatter.js` migration tool
- Templates updated for canonical frontmatter structure

### 4. UX Hooks Automation (004-ux-hooks-automation)
- Shared post-mutation hook execution across all mutation handlers
- Dedicated UX-hook modules: `mutation-feedback.ts`, `response-hints.ts`, `memory-surface.ts`
- `postMutationHooks` output in mutation results
- Auto-surface hints appended before token-budget checks
- Checkpoint-delete safety with `confirmName` confirmation

### 5. Architecture Boundary (005-architecture-audit)
- Canonical ownership: `scripts/` vs `mcp_server/` (runtime) vs `shared/`
- API-first cross-boundary access policy
- Import-policy enforcement checks in validation
- Handler utilities extracted, duplicate helpers to shared modules

### 6. Agent Lineage (013-agents-alignment — prior pass)
- Dual-source model: base + ChatGPT families
- Codex downstream from ChatGPT, not base
- Gemini via `.gemini -> .agents` symlink
- 9 agents per family (deep-research.md naming standardized)

## Dimension Queue

| Priority | Dimension | Focus |
|----------|-----------|-------|
| 1 | Correctness | MCP tool names, parameters, file paths, workflow steps match current system |
| 2 | Security | Permission boundaries correct, LEAF agents properly constrained |
| 3 | Traceability | Cross-references between agents consistent, spec-kit references valid |
| 4 | Maintainability | No stale references, no dead registrations, consistent across runtimes |

## Wave Progress

| Wave | Status | Agents | Findings |
|------|--------|--------|----------|
| 1 | Pending | @context, @orchestrate | — |
| 2 | Pending | @speckit, @deep-review | — |
| 3 | Pending | @deep-research, @handover | — |
| 4 | Pending | @review, @debug | — |
| 5 | Pending | @ultra-think, @write | — |

## Next Focus

Wave 1: @context (GPT-5.3-Codex, xhigh) + @orchestrate (GPT-5.4, high)
