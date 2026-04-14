# Research Prompt — Impact Analysis (5 iterations)

> **Subject**: Phase 018 — Wiki-Style Spec Kit Updates Memory Refactor Impact Analysis. A complete, file-level impact matrix covering which files must change, in what way, in what order, and with what migration effort.
>
> **Target runtime**: `cli-codex gpt-5.4 high fast` — single-shot delegation piped via stdin, or input to `/spec_kit:deep-research:auto`. Follows `sk-deep-research v1.5.0` strategy template format.
>
> **Critical scope discipline**: This prompt does NOT design the new architecture. A parallel 20-iteration research track owns the HOW. This prompt owns the WHAT-CHANGES / WHERE / IN-WHAT-ORDER / AT-WHAT-COST. If you find yourself writing "the new system should...", stop — you are describing *what must change*, not *what it becomes*.
>
> **Spec folder** (pre-approved, skip Gate 3): `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates/`

---

## How to run this prompt

> **⚠ MANDATORY**: This prompt **MUST** be driven by `/spec_kit:deep-research:auto` (or `:confirm`). It is **not** designed to run as a single-shot Codex brief, and a single-shot run would bypass the entire sk-deep-research loop driver — producing an incomplete, unauditable research packet.
>
> The sk-deep-research loop is what creates the required state files:
> - `research/deep-research-config.json` (loop config)
> - `research/deep-research-state.jsonl` (append-only event stream, per-iteration records, convergence events)
> - `research/deep-research-strategy.md` (key questions, answered questions, what worked/failed — reducer-owned)
> - `research/findings-registry.json` (open vs resolved questions, key findings)
> - `research/deep-research-dashboard.md` (lifecycle + convergence dashboard)
> - `research/iterations/iteration-NNN.md` (per-iteration findings, write-once)
>
> A single-shot Codex delegation CANNOT produce these files. It also skips the quality guard checks, the reducer's machine-owned state updates, the convergence tracking, and the proper synthesis phase. **Do not try to shortcut this with `codex exec` stdin piping.** Phase 017 was produced that way and is missing every state file except `research.md`; do not repeat that pattern here.

**Invocation — autonomous mode (recommended):**
```bash
/spec_kit:deep-research:auto "Wiki-Style Spec Kit Updates — file-level impact analysis. Follow the research prompt at .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates/prompts/research-prompt-impact.md" --spec-folder .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates --max-iterations 5 --convergence 0.05
```

**Invocation — confirm mode (pause at each iteration for approval):**
```bash
/spec_kit:deep-research:confirm "Wiki-Style Spec Kit Updates — file-level impact analysis. Follow the research prompt at .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates/prompts/research-prompt-impact.md" --spec-folder .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates --max-iterations 5 --convergence 0.05
```

The loop driver reads this prompt file as the seed for the strategy template, then dispatches `@deep-research` once per iteration with fresh context. Each iteration writes `iterations/iteration-NNN.md`, the reducer updates `deep-research-strategy.md` and `findings-registry.json`, and the workflow accumulates findings into `research/research.md` via progressive synthesis.

---

## Effort Legend (pinned — use throughout)

| Symbol | Scope | Meaning |
|--------|-------|---------|
| **XS** | < 50 tokens | single-line or import edit |
| **S** | 50–300 tokens | localized function change |
| **M** | 300–1200 tokens | multi-function or new code path |
| **L** | 1200–4000 tokens | handler-level restructure or new module |
| **XL** | > 4000 tokens | full rewrite or new subsystem |

Effort estimates are the most error-prone output. Every row in the impact matrix must pin its effort to this legend, with token count grounded in observed code size and the ratio of memory-related lines.

---

## 0. PRIOR SEED — READ FIRST

Before iterating, read `../scratch/phase-017-rerun-seed.md` at the spec folder root. It carries 10 key findings from the phase 017 10-iteration rerun, including the ~147-file integration surface inventory, the 52 engineer-day effort estimate, the dependency order, and the M4 migration strategy. Phase 018 impact analysis should verify and refine these numbers with line-level citations, not re-derive them from scratch.

---

## 1. TOPIC

Phase 018 — Wiki-Style Spec Kit Updates Memory Refactor Impact Analysis.

Option C retargets the memory subsystem so that canonical narrative content is written into existing spec kit documents (`implementation-summary.md`, `decision-record.md`, `handover.md`, `research/research.md`, `tasks.md`, `checklist.md`) instead of heavyweight standalone memory files. A thin continuity layer preserves machine metadata and fast resume. **Every advanced memory capability must keep working, just pointed at spec docs + continuity layer.**

Your job is NOT to design the new architecture. Your job is to produce a complete, file-level impact matrix: which files must change, what kind of change each needs, how large the change is, in what order they must change, and what breaks if the order is wrong. By the end of 5 iterations, a junior engineer should be able to start at row 1 of the matrix and implement the refactor without having to re-discover which files are affected.

---

## 2. KEY QUESTIONS

Seven questions drive the impact assessment. Every iteration must map its findings back to at least one question. Synthesis checks coverage.

- [ ] **Q1. Schema blast radius** — Which database schema changes are required (`UNIQUE` constraint, `document_type` semantics, anchor-level chunking, foreign keys)? What migrations must run, in what order, and what is the rollback path if a migration fails mid-way?
- [ ] **Q2. Handler triage** — Which MCP handlers need *surgical* changes (parameter additions, new routing branches) vs *full rewrites* (pipeline restructuring)? Specifically: `memory-save.ts`, `memory-context.ts`, `memory-search.ts`, `session-resume.ts`, `session-bootstrap.ts`, and the `save/` subdirectory stages.
- [ ] **Q3. Generator refactor scope** — What inside `scripts/memory/generate-context.ts` must change so it routes content into spec docs instead of creating memory files? Is it a rewrite or in-place refactor? What upstream/downstream scripts (`backfill-frontmatter.ts`, `reindex-embeddings.ts`, `rank-memories.ts`, `validate-memory-quality.ts`, `core/memory-indexer.ts`) move with it?
- [ ] **Q4. Template and anchor contract** — Which Level 1/2/3/3+ templates need new anchors, section markers, or frontmatter fields to receive routed memory content? What new validator rules must `scripts/spec/validate.sh` enforce, and which existing rules break?
- [ ] **Q5. Command and agent surface area** — Which slash commands (`memory/save`, `spec_kit/resume`, `spec_kit/complete`, `spec_kit/plan`, `spec_kit/implement`, `spec_kit/deep-research`, `spec_kit/deep-review`), workflow YAML files (`*_auto.yaml`, `*_confirm.yaml`), and agents (`context.md`, `speckit.md`, `orchestrate.md`) have contract changes? What is the user-facing behavior delta per command?
- [ ] **Q6. Dependency ordering** — What is the critical path? Given the graph of file dependencies, what must change *first* to unblock subsequent changes without leaving the system in a broken intermediate state? Which changes are parallelizable?
- [ ] **Q7. Documentation, test, and config debt** — How much of `CLAUDE.md`, `AGENTS.md`, SKILL.md files, README/ARCHITECTURE docs, `memory-quality-phase*.test.ts`, `mcp_server/test/`, `.mcp.json`, and `package.json` files must be rewritten vs line-edited? Which test suites are invalidated entirely vs retargeting existing assertions?

---

## 3. 5 ITERATION TOPICS

Each iteration audits a distinct surface end-to-end. All iterations are read-only. All iterations produce rows in the master `findings/impact-matrix.md` table with columns: `file_path` | `effort (XS-XL)` | `token_estimate` | `change_action` | `rationale` | `depends_on` | `blocks` | `citation` | `uncertain?`.

### Iteration 1 — Database, Schema, and Storage Migration Impact

**Audits**: `.opencode/skill/system-spec-kit/mcp_server/database/` (including SQL files, TypeScript schema definitions, and any `.sql` migration files if present), `lib/storage/causal-edges.ts`, schema-defining code in `core/`, and schema consumers in handlers.

**Produces**:
- **Schema delta table** — current columns → target columns, with NOT NULL / UNIQUE / index changes per table (`memory_index`, `memory_chunks`, `causal_edges`, `vec_memories`, `memory_fts`, `embedding_cache`, `memory_entities`, `memory_summaries`, `governance_audit_log`, `shared_spaces`, `shared_space_members`).
- **Migration script inventory** — which `.sql` or TS migration files must be authored, in what order, with up/down scripts.
- **Backward compatibility audit** — which columns are added (safe) vs dropped (dangerous) vs repurposed (most dangerous).
- **Storage path implications** — does `canonical_file_path` now point at spec doc anchors? How does chunk-to-file mapping change?
- **Rollback playbook** — if migration N fails, what's the recovery procedure?
- **File matrix rows** — every database/migration/schema-aware file with effort estimate.

**Key outputs fed to next iterations**: the schema shape is the contract Iteration 2 (handlers) must honor. Nothing in iterations 2-5 can land before iteration 1's schema migrations.

**Target row count**: 8–15 rows in the matrix.

**Deliverable fragment**: `findings/schema-migrations.md`

**Maps to questions**: Q1, Q6.

---

### Iteration 2 — MCP Handler and Save Pipeline Impact

**Audits**: `.opencode/skill/system-spec-kit/mcp_server/handlers/` end-to-end. Specifically:
- `memory-save.ts` (16-stage pipeline) and the `save/` subdirectory (`validation`, `dedup`, `embedding`, `reconsolidation`, `post-insert`, `causal-links-processor`, `response-builder`, `db-helpers`, `pe-orchestration`, `embedding-pipeline`)
- `memory-context.ts` (retrieval router)
- `memory-search.ts` (4-stage pipeline)
- `session-resume.ts`, `session-bootstrap.ts`, `session-health.ts`, `session-learning.ts`
- `memory-triggers.ts`, `memory-ingest.ts`, `memory-crud*.ts`, `memory-index*.ts`
- `causal-graph.ts`, `causal-links-processor.ts`, `mutation-hooks.ts`, `shared-memory.ts`, `checkpoints.ts`
- `tools/memory-tools.ts`, `tools/context-tools.ts`, `tools/checkpoint-tools.ts`, `tools/causal-tools.ts`, `tools/lifecycle-tools.ts`
- `schemas/tool-input-schemas.ts`
- Supporting: `lib/cognitive/fsrs-scheduler.ts`, `lib/search/intent-classifier.ts`, `lib/search/session-state.ts`, `lib/validation/save-quality-gate.ts`, `lib/storage/causal-edges.ts`

**Produces**:
- **Per-handler change inventory** — every handler classified as: `surgical` | `restructure` | `rewrite` | `deprecate` | `no-change`.
- **Save pipeline stage matrix** — for each of the 16 save stages, what changes (routing target, validation rules, dedup logic, embedding input source).
- **Tool schema delta** — which parameters on which MCP tools gain/lose fields (cite `schemas/tool-input-schemas.ts:line_range`).
- **Contract changes** — for each handler, old API → new API diff summary (not code, just signature and semantic delta).
- **Cross-handler dependencies** — e.g., `memory-save.ts` depends on Iteration 1's schema; `memory-search.ts` depends on the anchor model from Iteration 4.
- **Blocking risks** — handlers where the change is large enough that partial refactor = broken system.

**Target row count**: 25–40 rows.

**Deliverable fragment**: `findings/mcp-handler-audit.md`

**Maps to questions**: Q2, Q6.

---

### Iteration 3 — Generator, Scripts, and Core Indexing Impact

**Audits**: `.opencode/skill/system-spec-kit/scripts/memory/` and `mcp_server/core/`. Specifically:
- `scripts/memory/generate-context.ts` — the central refactor point
- `scripts/memory/backfill-frontmatter.ts`, `reindex-embeddings.ts`, `rank-memories.ts`, `validate-memory-quality.ts`, `cleanup-orphaned-vectors.ts`, `rebuild-auto-entities.ts`, `migrate-trigger-phrase-residual.ts`, `fix-memory-h1.mjs`, `ast-parser.ts`
- `mcp_server/core/memory-indexer.ts`, `core/memory-metadata.ts`, `core/find-predecessor-memory.ts`
- `scripts/dist/memory/` compiled outputs

**Produces**:
- **Generator refactor spec** — what functions/classes in `generate-context.ts` need to change, what the new routing output looks like (abstract, not code), what stays and what goes.
- **Script inventory matrix** — each script classified as `update` | `rewrite` | `retire` | `new-sibling-needed`.
- **Indexer contract** — `memory-indexer.ts` and `memory-metadata.ts` changes. Do they index spec doc anchors now? Do they index the thin continuity layer separately?
- **Predecessor chain implications** — `find-predecessor-memory.ts` currently follows memory-file predecessor chains; how does this re-anchor onto spec doc history?
- **New migration scripts required** — one-time data migration from existing memory files into spec doc anchors (is this a separate script? scope?).

**Note on coupling with Iteration 2**: `memory-indexer.ts` and `generate-context.ts` meet in the middle. Cross-reference explicitly — do not duplicate rows between iterations 2 and 3; instead, cite the row in the other iteration's section.

**Target row count**: 15–25 rows.

**Deliverable fragment**: merged into `findings/mcp-handler-audit.md` under a "Generator & Scripts" section, plus entries in the master impact matrix.

**Maps to questions**: Q3, Q6.

---

### Iteration 4 — Templates, Anchors, and Validator Impact

**Audits**:
- `.opencode/skill/system-spec-kit/templates/` — `level_1/`, `level_2/`, `level_3/`, `level_3+/`, plus `core/`, `addendum/`, `changelog/`, `sharded/`, `research.md`, `handover.md`, `context_template.md`, `debug-delegation.md`
- `scripts/spec/validate.sh` and any validator support files
- `.opencode/skill/system-spec-kit/SKILL.md` sections that define the template-anchor contract

**Produces**:
- **Anchor delta per template** — for each `implementation-summary.md`, `decision-record.md`, `handover.md`, `research/research.md`, `tasks.md`, `checklist.md` template (across all 4 levels), what new anchor IDs / section markers / frontmatter fields must be added to accept routed memory content.
- **Template effort matrix** — one row per template file × 4 levels.
- **Validator rule delta** — which anchor validation rules must be added, which must be relaxed, which must be replaced. Specifically: does `ANCHORS_VALID` need to extend? Does `SECTIONS_PRESENT` need new required sections? Do `FRONTMATTER_VALID` rules need new required fields for spec docs that now store memory metadata?
- **`context_template.md` disposition** — keep as thin-continuity template? Slim down? Deprecate entirely? Decide with rationale.
- **Level-specific behavior** — Level 1 may route differently than Level 3+. Audit per level.

**Target row count**: 20–30 rows.

**Deliverable fragment**: `findings/template-validator-audit.md`

**Maps to questions**: Q4, Q6.

---

### Iteration 5 — Commands, Agents, Workflows, Docs, Tests, Configs Impact

**Wide and shallow**. Warning for the agent: do not go deep on every doc/test/config — the time budget is spent on the per-file row, not on reading the whole test suite.

**Audits**:
- **Commands**: `.opencode/command/memory/save.md`, `memory/search.md`, `memory/manage.md`, `memory/learn.md`, `spec_kit/resume.md`, `spec_kit/complete.md`, `spec_kit/plan.md`, `spec_kit/implement.md`, `spec_kit/deep-research.md`, `spec_kit/deep-review.md`, `spec_kit/handover.md`, `spec_kit/debug.md`
- **Workflow YAMLs**: all `.opencode/command/spec_kit/assets/*_auto.yaml` and `*_confirm.yaml`
- **Agents**: `.opencode/agent/context.md` (primary target — "memory first" protocol), `speckit.md`, `orchestrate.md`, `deep-research.md`, `deep-review.md`, `handover.md`, `ultra-think.md`, `debug.md`, `review.md`, `write.md`, `general.md`
- **Skills**: `.opencode/skill/system-spec-kit/SKILL.md` + `references/memory/*.md` (memory_system.md, save_workflow.md, trigger_config.md, epistemic_vectors.md, embedding_resilience.md), `sk-deep-research/SKILL.md`, `sk-deep-review/SKILL.md`, `sk-doc/SKILL.md`
- **Docs**: `/CLAUDE.md`, `/AGENTS.md`, `.opencode/skill/system-spec-kit/README.md`, `ARCHITECTURE.md`, `mcp_server/README.md`, `INSTALL_GUIDE.md`
- **Tests**: `/scripts/tests/memory-quality-phase*.test.ts` (6+ files), `mcp_server/test/` directory
- **Configs**: `.mcp.json`, `mcp_server/configs/`, any `package.json` scripts

**Produces**:
- **Command × workflow matrix** — per command, what behavior changes, which YAML steps need edits, what user-visible delta exists.
- **Agent contract delta** — especially `context.md` "memory first" protocol. Rewrite vs retarget.
- **Skill reference delta** — how much of `references/memory/` is still accurate; which files get deprecated or rewritten.
- **Doc update inventory** — per doc, sections that must change with approximate line ranges.
- **Test disposition matrix** — per test file: `rewrite` | `retarget` | `delete` | `no-change`, with rationale.
- **Config delta** — which MCP server config fields, env vars, or package scripts change.

**Critical deliverable**: **rederive the dependency graph fresh at iteration 5 close** rather than incrementally through iterations 1-4, to catch cycles introduced during iteration. The graph must be acyclic.

**Target row count**: 30–50 rows.

**Deliverable fragments**: `findings/command-agent-audit.md` + `findings/docs-tests-config-audit.md`

**Maps to questions**: Q5, Q6, Q7.

---

### Expected totals

Across all 5 iterations, the final `findings/impact-matrix.md` should contain approximately **100–160 file rows**, matching the seed integration surface in Section 6.

---

## 4. NON-GOALS

- **Do NOT design the new architecture.** That is the parallel 20-iteration research track's job. If you find yourself writing "the new system should...", stop. You are describing *what must change*, not *what it becomes*.
- **Do NOT modify any files.** Read-only audit. No Edit, Write, or shell commands that mutate state.
- **Do NOT propose code diffs.** Describe changes at the level of "add parameter X to function Y", "rewrite pipeline stage 7 to consume spec-doc anchors", never actual TypeScript.
- **Do NOT rewrite `generate-context.ts` in your head.** Identify and characterize the changes; leave implementation to the architecture track.
- **Do NOT relitigate Option C vs A/B/F.** Decision made in phase 017.
- **Do NOT write outside `006-continuity-refactor-gates/`.** No global file mutations.
- **Do NOT abandon low-effort files.** LOW-effort agents and templates must still appear in the matrix with `no-change` or their actual change verb — absence is forbidden.
- **Do NOT compress iterations.** If Iteration 3's generator audit feels done early, still produce the full fragment; do not skip-ahead merge with Iteration 4.

---

## 5. STOP CONDITIONS

The research loop halts when **all** of the following are true:

1. All 7 key questions in Section 2 have explicit answers with citations.
2. Every surface listed in the Known Context (Section 6) has at least one row in `findings/impact-matrix.md` or is explicitly marked `no-change` with rationale.
3. `findings/dependency-graph.md` exists and shows a valid topological order (no cycles) for the implementation.
4. Five iterations have completed OR convergence delta drops below 0.05 (new findings / total findings) for two consecutive iterations — whichever comes first.
5. Every file in the matrix has `file_path:line_range`, one-sentence rationale, migration action verb (from the closed set in Section 8), and effort estimate.
6. `impact-summary.md` exists with total file count, total effort in token-equivalents, and a named critical path.

**Fail-open rule**: if iteration 5 ends with unresolved `UNCERTAIN` rows > 10% of total rows, the loop emits a `follow-up-investigations.md` with the open items rather than force-closing.

---

## 6. KNOWN CONTEXT (pre-vetted seed — verify, do not rediscover)

**Framing**: this is not a discovery task. The integration surface below is pre-vetted from phase 017 exploration. Your job is to *verify and refine* each entry with citations, then *expand* each entry into a full change row (effort, dependency, rationale, action verb). Iteration 1 starts from this seed; you do not re-discover which files exist.

### 6.1 Decided architecture (from phase 017)

- Option C selected: Wiki-Style Spec Kit Updates with thin continuity layer.
- Canonical narrative routes into existing spec docs.
- Advanced features preserved, retargeted at new substrate.
- Prior deliverables to read:
  - `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/z_archive/z_archive/017-memory-refactor-or-deprecation/recommendation.md`
  - `.../z_archive/017-memory-refactor-or-deprecation/phase-018-proposal.md`
  - `.../z_archive/017-memory-refactor-or-deprecation/findings/integration-impact.md`
  - `.../z_archive/017-memory-refactor-or-deprecation/research/research.md`

### 6.2 Integration surface (pre-vetted)

**Commands** (`.opencode/command/`):
- **VERY HIGH**: `memory/save.md`, `spec_kit/resume.md`, `spec_kit/complete.md`, `spec_kit/plan.md`, `spec_kit/implement.md`, `spec_kit/deep-research.md`, `spec_kit/deep-review.md`
- **MEDIUM**: `memory/search.md`, `memory/manage.md`, `memory/learn.md`, `spec_kit/handover.md`, `spec_kit/debug.md`, `spec_kit/assets/*_auto.yaml`, `spec_kit/assets/*_confirm.yaml`

**Agents** (`.opencode/agent/`):
- **VERY HIGH**: `context.md` (primary memory consumer; "memory first" protocol)
- **HIGH**: `speckit.md`, `orchestrate.md`
- **MEDIUM**: `deep-research.md`, `deep-review.md`, `handover.md`, `ultra-think.md`
- **LOW**: `debug.md`, `review.md`, `write.md`, `general.md`

**Skills** (`.opencode/skill/`):
- **VERY HIGH**: `system-spec-kit/SKILL.md` + `references/memory/` (memory_system.md, save_workflow.md, trigger_config.md, epistemic_vectors.md, embedding_resilience.md)
- **HIGH**: `sk-deep-research/SKILL.md`, `sk-deep-review/SKILL.md`
- **MEDIUM**: `sk-doc/SKILL.md`

**Scripts** (`.opencode/skill/system-spec-kit/scripts/`):
- **VERY HIGH (central refactor point)**: `memory/generate-context.ts` (~610 LOC)
- **HIGH**: `memory/backfill-frontmatter.ts`, `memory/reindex-embeddings.ts`, `memory/rank-memories.ts`, `memory/validate-memory-quality.ts`, `core/memory-indexer.ts`, `core/memory-metadata.ts`, `core/find-predecessor-memory.ts`
- **MEDIUM**: `memory/migrate-*.ts`, `memory/cleanup-*.ts`, `memory/rebuild-*.ts`

**MCP Server** (`.opencode/skill/system-spec-kit/mcp_server/`):
- **VERY HIGH**: `handlers/memory-save.ts` (~1799 LOC), `handlers/memory-context.ts` (~1610 LOC), `handlers/memory-search.ts` (~1378 LOC), `handlers/session-resume.ts`, `handlers/session-bootstrap.ts`, `database/` directory, `core/` directory, `tools/memory-tools.ts`, `tools/context-tools.ts`, `schemas/tool-input-schemas.ts`
- **HIGH**: `handlers/save/` subdirectory (validation, dedup, embedding, reconsolidation, post-insert, causal-links-processor, response-builder, db-helpers, pe-orchestration, embedding-pipeline), `handlers/memory-triggers.ts`, `handlers/memory-ingest.ts`, `handlers/memory-crud*.ts`, `handlers/memory-index*.ts`, `handlers/causal-graph.ts`, `handlers/causal-links-processor.ts`, `lib/cognitive/fsrs-scheduler.ts`, `lib/search/intent-classifier.ts`, `lib/search/session-state.ts`, `lib/validation/save-quality-gate.ts`, `lib/storage/causal-edges.ts`
- **MEDIUM**: `handlers/checkpoints.ts`, `handlers/shared-memory.ts`, `handlers/session-health.ts`, `handlers/session-learning.ts`, `handlers/mutation-hooks.ts`

**Templates** (`.opencode/skill/system-spec-kit/templates/`):
- **HIGH**: `level_1/`, `level_2/`, `level_3/`, `level_3+/` × (`implementation-summary.md`, `decision-record.md`, `handover.md`)
- **MEDIUM**: `tasks.md`, `checklist.md`, `plan.md`, `spec.md` across all levels, `context_template.md`
- **LOW**: `core/`, `addendum/`, `changelog/`, `sharded/`, `research.md`, `debug-delegation.md`

**Validator**: `scripts/spec/validate.sh`

**Documentation**:
- **HIGH**: `/CLAUDE.md`, `/AGENTS.md`, `.opencode/skill/system-spec-kit/README.md`, `ARCHITECTURE.md`, `mcp_server/README.md`, `mcp_server/INSTALL_GUIDE.md`

**Tests**:
- `/scripts/tests/memory-quality-phase*.test.ts` (6+ files)
- `mcp_server/test/` directory

**Configs**:
- `.mcp.json`, `mcp_server/configs/`, `package.json` files

### 6.3 13 advanced features to preserve (must keep working)

1. Trigger phrase fast matching (cached, sub-ms, `idx_trigger_cache_source`)
2. Intent-aware retrieval (`memory_context` modes: auto/quick/deep/focused/resume; 7 intent types)
3. Session deduplication (fingerprint-based working memory, ~50% token savings)
4. Multi-dimension quality scoring (structure, sufficiency, quality loop, contamination)
5. Memory reconsolidation (auto-merge at >0.96 similarity)
6. Causal graph (6 relations: caused, enabled, supersedes, contradicts, derived_from, supports; 2-hop BFS)
7. Memory tiers (constitutional / critical / important / normal / temporary / deprecated)
8. FSRS cognitive decay (power-law, HOT→WARM→COLD→DORMANT→ARCHIVED)
9. Shared memory governance (deny-by-default, provenance)
10. Ablation studies, dashboards, drift analysis (`memory_drift_why`)
11. Constitutional memory (always-surface rules)
12. Embedding-based semantic search (Voyage, 1024-dim)
13. 4-stage search pipeline (gather / score / rerank / filter) with RRF fusion across vector/bm25/fts5/graph/trigger

### 6.4 NOT retargetable without schema change

- `UNIQUE(spec_folder, file_path, anchor_id)` blocks multiple memories per file (`.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts:126`)
- `atomicSaveMemory()` file I/O path (`.../handlers/memory-save.ts:1521`); new `atomicIndexMemory()` needed that skips file write
- Template contract validator needs new rules for spec-doc structure
- Memory parser needs spec-doc variant
- Dry-run path doesn't work the same way for external files

### 6.5 Key code paths (absolute)

- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` (~610 LOC)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` (~1799 LOC, `atomicSaveMemory` at L1521)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` (~1378 LOC)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts` (~1610 LOC)
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
- `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/tests/safety.vitest.ts`
- Templates root: `.opencode/skill/system-spec-kit/templates/`

---

## 7. DELIVERABLES

All written inside the phase 018 spec folder.

### Primary deliverables (highest quality bar)

1. **`research/research.md`** — progressive synthesis, owned by the sk-deep-research convention. One section per iteration, with consolidated cross-references and answers to all 7 key questions.
2. **`findings/impact-matrix.md`** — **the master file-by-file table**. Columns: `file_path` | `effort (XS-XL)` | `token_estimate` | `change_action` | `rationale` | `depends_on` | `blocks` | `citation` | `uncertain?`
3. **`findings/dependency-graph.md`** — ASCII or Mermaid DAG of the change order. Explicit critical path annotation. Parallelizable groups labeled. **Rederived fresh at iteration 5 close** to catch cycles.
4. **`impact-summary.md`** — executive summary at spec-folder root: total files, total effort (token-equivalents), named critical path, top 5 risks, recommended change sequencing.

### Supporting deliverables (per-surface deep dives)

5. **`findings/schema-migrations.md`** — database migration plan from Iteration 1
6. **`findings/mcp-handler-audit.md`** — per-handler change inventory from Iterations 2 + 3
7. **`findings/template-validator-audit.md`** — template and validator changes from Iteration 4
8. **`findings/command-agent-audit.md`** — commands, agents, workflow YAMLs from Iteration 5
9. **`findings/docs-tests-config-audit.md`** — documentation, tests, configs from Iteration 5

### Conditional

10. **`follow-up-investigations.md`** — only emitted if `UNCERTAIN` rows exceed 10% at iteration 5 close.

---

## 8. EVIDENCE STANDARDS

Every row in every matrix must satisfy these rules:

1. **Citation required**: `file_path:line_range` — e.g., `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1521-1545`. Line range refers to the specific memory-dependent code block, not the whole file.
2. **Rationale is one sentence** — answers "why does this file need to change?" in plain language tied to the Option C retarget.
3. **Action verb from a closed set**:
   - `rewrite` | `restructure` | `update-logic` | `update-imports` | `add-parameter` | `add-field` | `rename` | `deprecate` | `retire` | `no-change`
   - No freeform verbs.
4. **Effort estimate justified** — token estimate must be grounded in observed code size. If a file is 800 LOC and ~40% is memory-related, cite that ratio.
5. **UNCERTAIN marker required** when a dependency or behavior is unclear — row must include `uncertain: <what's missing to resolve>`.
6. **No hedging without citation** — "might need to change" is rejected unless paired with `UNCERTAIN:`.
7. **Cross-references** — `depends_on` and `blocks` columns must name *other files in the same matrix*, not vague concepts.
8. **Read-only evidence only** — no running code, no speculation based on runtime behavior. All claims grounded in static file contents.

---

## 9. ITERATION-1 SEED ACTIONS

Six ordered starter actions. Iteration 1 is special because it (a) verifies the seed and (b) does the schema audit.

1. **Verify the integration surface** — open each category in Section 6.2 and confirm every listed file exists via `Glob` or `Read`. Flag any that have been renamed or moved since the seed was written.
2. **Ground-truth the save pipeline** — read `handlers/memory-save.ts` + the entire `handlers/save/` subdirectory once to map the 16 stages to concrete function names. This becomes the spine for Iteration 2.
3. **Extract the current schema** — inspect `mcp_server/database/` for SQL files or TypeScript schema definitions. Map every table and column that currently stores memory narrative content. Identify `canonical_file_path`, `document_type`, chunk tables, and causal edges specifically.
4. **Draft the schema delta** — produce the Iteration 1 schema change table: current → target, with `UNIQUE` constraint and `document_type` semantics resolved. Mark `UNCERTAIN` anywhere the spec doc anchor model isn't clear yet.
5. **Open the impact matrix with schema rows** — begin `findings/impact-matrix.md` with all database and migration files as the first set of rows; establish the column format the later iterations will extend.
6. **Build dependency graph v0** — stub `findings/dependency-graph.md` with the schema-first invariant: nothing in iterations 2-5 can land before Iteration 1's schema migrations.
7. **Write iteration 1 synthesis into `research/research.md`** — summarize findings, list open questions for Iteration 2 handoff, update convergence metrics.

---

## 10. HARD STOPS (absolute prohibitions)

- **Read-only audit.** No Edit / Write / Bash-mutation. Violations immediately abort the research run.
- **No file writes outside `006-continuity-refactor-gates/`.** Every artifact (research, findings, summary) lives inside the phase 018 spec folder.
- **No git commits, adds, tags, branches, or pushes.** Not at iteration boundaries, not at completion.
- **No guessing.** If a file's dependency or behavior is unclear, mark `UNCERTAIN` with a precise "what's missing" note. Do not fabricate rationales.
- **No scope creep into architecture design.** If you catch yourself describing the target system, redirect to "what changes in the source system".
- **No abandoning low-effort files.** LOW-effort agents and templates must still appear in the matrix with `no-change` or their actual change verb — absence is forbidden.
- **No compressing iterations.** If Iteration 3's generator audit feels done early, still produce the full fragment; do not skip-ahead merge with Iteration 4.
- **No runtime speculation.** All claims grounded in static file contents.
- **No external API calls.** No web search, no billable LLM calls beyond the Codex session itself.

---

## 11. SESSION METADATA

| Field | Value |
|---|---|
| **Topic** | Wiki-Style Spec Kit Updates — Memory Refactor Impact Analysis |
| **Target runtime** | `/spec_kit:deep-research:auto` or `:confirm` — driven by the sk-deep-research loop engine (NOT single-shot Codex) |
| **Strategy** | sk-deep-research (5-iteration variant) |
| **Spec folder** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-continuity-refactor-gates/` |
| **Predecessor phases** | 005 (memory deep-quality), 017 (memory refactor — Option C selected) |
| **Parallel track** | 20-iteration architecture research at `prompts/research-prompt-implementation.md` |
| **Max iterations** | 5 |
| **Convergence threshold** | 0.05 (new-findings-ratio for 2 consecutive iterations) |
| **Expected duration** | 60–90 minutes wall clock |
| **Output root** | `006-continuity-refactor-gates/research/` and `006-continuity-refactor-gates/findings/` |
| **Read-only mode** | enforced — no file writes outside spec folder, no shell mutations |
| **Seed corpus** | pre-vetted integration surface (Section 6) — verify, do not rediscover |
| **Primary deliverable** | `findings/impact-matrix.md` (file-level change table) |
| **Critical path deliverable** | `findings/dependency-graph.md` (change order DAG) |
| **Expected total matrix rows** | ~100–160 files |
